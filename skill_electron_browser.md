---
name: electron-navegador-react-ts
description: Use esta skill sempre que o projeto envolver construir ou manter um navegador web nativo com Electron (abas, controle de navegação, downloads, sessões isoladas/anônimas, segurança de conteúdo remoto) numa stack com React + TypeScript no renderer. Cobre a API oficial do Electron para essa finalidade — BaseWindow, WebContentsView, session, contextBridge — e como conectar isso de forma tipada a uma UI em React sem quebrar o isolamento de processo. Trigger em pedidos como "cria uma aba nova", "adiciona controle de voltar/avançar", "implementa downloads", "modo anônimo", "abre link em nova aba" dentro de um projeto desse tipo, mesmo sem mencionar Electron pelo nome.
---

# Navegador Electron com React + TypeScript

Esta skill traduz a API nativa recomendada do Electron para navegadores (baseada em `WebContentsView`, não em `BrowserView` nem na tag `<webview>` — ambos desencorajados pela documentação oficial) em um padrão consistente e tipado para um projeto com renderer em React + TypeScript.

O ponto que mais gera bug nesse tipo de projeto: o processo Main (Node/Electron puro) e o processo Renderer (React) são mundos isolados de propósito. Toda vez que o renderer precisa saber algo do navegador (título da aba, se pode voltar, progresso de download), esse dado precisa atravessar IPC de forma tipada — nunca acessando Electron/Node direto de dentro de um componente React.

---

## 1. Arquitetura do projeto

```
electron/
  main.ts             → cria a BaseWindow, gerencia abas com WebContentsView
  preload.ts          → contextBridge com a API tipada exposta ao renderer
  ipc/
    channels.ts        → nomes de canais IPC centralizados (evita strings soltas)
    types.ts           → tipos compartilhados entre main e renderer
src/                   → app React (renderer): TabBar, Toolbar, AddressBar, DownloadsPanel
```

Regra central: **o renderer React nunca importa `electron`, `fs`, `child_process` ou qualquer módulo Node diretamente.** Tudo passa pelo bridge tipado exposto no `preload.ts` via `contextBridge`. Isso não é só organização — é o que faz `contextIsolation: true` (seção 6) proteger de verdade.

---

## 2. Contrato de tipos entre main e renderer

Defina o formato do estado de uma aba e a API do bridge uma vez, em um arquivo compartilhado — assim qualquer mudança de formato quebra a build em vez de falhar silenciosamente em runtime:

```ts
// electron/ipc/types.ts
export interface TabState {
  id: string;
  title: string;
  url: string;
  faviconUrl?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

export interface ElectronBridge {
  createTab: (url: string) => Promise<string>; // retorna o id da nova aba
  closeTab: (id: string) => Promise<void>;
  switchTab: (id: string) => Promise<void>;
  navigate: (id: string, action: "back" | "forward" | "reload" | "stop") => Promise<void>;
  loadUrl: (id: string, url: string) => Promise<void>;
  onTabUpdated: (callback: (tab: TabState) => void) => () => void; // retorna função de unsubscribe
}
```
No React, o estado das abas vive num `useReducer` (várias atualizações parciais chegam por evento) que só é alimentado pelo `onTabUpdated` do bridge — o componente nunca guarda referência a `WebContentsView`, porque essa instância só existe no processo Main.

---

## 3. Processo Main: janela e abas

- `app` — ciclo de vida da aplicação (`ready`, `window-all-closed`).
- `BaseWindow` — janela nativa que hospeda a interface e as views de conteúdo. Prefira `BaseWindow` a `BrowserWindow` quando o navegador tem múltiplas abas: `BrowserWindow` embute um único `WebContents`, enquanto `BaseWindow` + várias `WebContentsView` é o padrão atual pra isso.
- `WebContentsView` — cada aba é uma instância independente, adicionada à janela via `win.contentView.addChildView(view)`.
- `session` — cache, cookies, permissões, downloads e isolamento de dados por partição.

```ts
import { app, BaseWindow, WebContentsView } from "electron";

let win: BaseWindow;
const tabs = new Map<string, WebContentsView>();

app.whenReady().then(() => {
  win = new BaseWindow({ width: 1200, height: 800 });
  createTab("tab-1", "https://www.google.com");
});

function createTab(id: string, url: string): WebContentsView {
  const view = new WebContentsView({
    webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false },
  });

  win.contentView.addChildView(view);

  const [width, height] = win.getContentSize();
  view.setBounds({ x: 0, y: 80, width, height: height - 80 }); // 80px reservado pra toolbar do React

  view.webContents.loadURL(url);
  tabs.set(id, view);
  return view;
}
```

**Troca de aba ativa**: `win.contentView.removeChildView(viewAntiga)` seguido de `win.contentView.addChildView(novaView)`.

**Fechar aba**: chame `view.webContents.close()` explicitamente. Views filhas não são destruídas automaticamente só por serem removidas da janela — pular esse passo é vazamento de memória silencioso que só aparece depois de muitas abas abertas/fechadas.

---

## 4. Navegação e eventos (sempre relay pro React via IPC)

Ações disponíveis por aba, todas chamadas a partir de um handler IPC (nunca direto do renderer):
- `webContents.loadURL(url)`
- `webContents.navigationHistory.canGoBack()` / `.goBack()`
- `webContents.navigationHistory.canGoForward()` / `.goForward()`
- `webContents.reload()`
- `webContents.stop()`

Eventos que o Main escuta e **precisa reemitir por IPC** pra manter o `TabState` do React sincronizado:
- `did-start-loading` / `did-stop-loading`
- `did-navigate`
- `page-title-updated`
- `page-favicon-updated`
- `setAudioMuted(bool)` / `isAudioMuted()`
- `setZoomFactor(factor)`

```ts
view.webContents.on("page-title-updated", (_event, title) => {
  win.webContents.send("tab-updated", { id, title } satisfies Partial<TabState>);
});
```
No preload, `onTabUpdated` escuta esse canal e repassa pro React; no React, o reducer aplica o patch parcial no `TabState` daquele `id`. A UI (título da aba, spinner de loading, favicon) sempre reflete o que o Main mandou — nunca é derivada de acesso direto ao `WebContentsView`.

---

## 5. Segurança e isolamento (obrigatório, não opcional)

Estas configurações valem pra toda `WebContentsView` que carrega conteúdo remoto, sem exceção — a maior parte das vulnerabilidades em apps Electron vem de pular uma dessas:

- `contextIsolation: true` + `nodeIntegration: false` em todo `webPreferences`.
- `sandbox: true` em cada `WebContentsView`.
- **Controle de janelas/links externos** — sem isso, qualquer `window.open()` de uma página remota abre uma janela nativa fora do seu controle:
  ```ts
  view.webContents.setWindowOpenHandler(({ url }) => {
    createTab(Date.now().toString(), url); // abre como aba controlada, não como janela nova
    return { action: "deny" };
  });
  ```
- **Permissões restritas por allowlist explícita** — nunca permissivo por padrão:
  ```ts
  import { session } from "electron";

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowed: string[] = ["clipboard-read", "clipboard-write", "notifications"];
    callback(allowed.includes(permission));
  });
  ```

Isso cobre os riscos específicos de Electron (processo Main com acesso total ao sistema operacional exposto por engano a conteúdo remoto). Práticas de segurança de aplicação em geral — XSS na própria UI React, validação de API, etc. — seguem à parte, na skill de segurança full-stack do projeto.

---

## 6. Downloads

```ts
import { session } from "electron";

session.defaultSession.on("will-download", (_event, item, _webContents) => {
  const totalBytes = item.getTotalBytes();

  item.on("updated", (_event, state) => {
    if (state === "progressing") {
      const received = item.getReceivedBytes();
      const percent = totalBytes > 0 ? (received / totalBytes) * 100 : 0;
      win.webContents.send("download-progress", { percent }); // relay pro React
    }
  });

  item.once("done", (_event, state) => {
    if (state === "completed") {
      win.webContents.send("download-completed", { path: item.getSavePath() });
    }
  });
});
```
Mesma regra da seção 4: o React nunca escuta `session` diretamente — só recebe os eventos já traduzidos via IPC, tipados no `ElectronBridge`.

---

## 7. Busca na página, menu de contexto e DevTools

- **Busca na página**: `webContents.findInPage(text, options)` / `webContents.stopFindInPage(action)`, ouvindo `found-in-page` pra pegar contagem de resultados e índice ativo.
- **Menu de contexto nativo**: evento `context-menu` combinado com `Menu` e `MenuItem` — opções como Copiar, Colar, "Inspecionar elemento" (`webContents.inspectElement(x, y)`), "Abrir link em nova aba" (chama o mesmo `createTab` da seção 3).
- **DevTools**: `webContents.openDevTools({ mode: "right" })` / `webContents.closeDevTools()`.

---

## 8. Sessões isoladas (modo anônimo)

Partição em memória, sem persistência de cookies/cache em disco:
```ts
const incognitoSession = session.fromPartition("in-memory-incognito");

const incognitoView = new WebContentsView({
  webPreferences: { session: incognitoSession, sandbox: true, contextIsolation: true },
});
```
Todas as abas incógnitas do usuário devem compartilhar a **mesma** partição em memória entre si (pra funcionar como uma janela anônima coerente), mas essa partição nunca deve ser reaproveitada entre uma sessão anônima e o modo normal.

---

## 9. Checklist antes de considerar a integração pronta

- [ ] Nenhum componente React importa `electron`/`fs`/`child_process` — só usa o bridge tipado do `preload.ts`
- [ ] Toda `WebContentsView` nasce com `sandbox: true`, `contextIsolation: true`, `nodeIntegration: false` já na criação
- [ ] `setWindowOpenHandler` implementado — nenhum link externo abre janela nativa fora de controle
- [ ] `setPermissionRequestHandler` com allowlist explícita, não permissivo por padrão
- [ ] `view.webContents.close()` chamado ao fechar aba, evitando vazamento de memória
- [ ] `TabState` tipado e sincronizado só via IPC — o React nunca lê `WebContentsView` diretamente
- [ ] Progresso de download e eventos de navegação chegam ao React já traduzidos pelo bridge, não por acesso direto ao `session`/`webContents`

---

## 10. Referência rápida das APIs oficiais usadas

`BaseWindow` / `BrowserWindow` (processo Main) · `WebContentsView` & `webContents` (renderização de páginas e abas) · `session` (sessões, permissões, downloads) · `contextBridge` & `ipcMain`/`ipcRenderer` (comunicação segura Main ↔ Renderer) · `Menu` & `MenuItem` (menus de contexto) · `shell` (integração com SO).
