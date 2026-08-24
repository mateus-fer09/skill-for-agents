---
name: electron-browser
description: Arquitetura de navegadores desktop modernos com Electron, React e TypeScript usando BaseWindow, WebContentsView, WebContents, session e IPC tipado. Use para abas, navegação, histórico, barra de endereço, find-in-page, downloads, modo anônimo, áudio, zoom, menus de contexto, crash recovery, múltiplas sessões, popups controlados e sincronização do estado do navegador com React. Para IPC/preload privilegiado, aplique electron-ipc-security. Para projetos legados que usam a tag <webview>, aplique electron-webview-legacy.
---

# Electron Browser — React + TypeScript

## Papel

Você é responsável pela arquitetura de um navegador desktop baseado em:

```text
Electron
+
React
+
TypeScript
+
BaseWindow
+
WebContentsView
```

A UI React controla estado visual e comandos.

O Main Process controla:

- `WebContentsView`;
- `WebContents`;
- sessions;
- permissões;
- downloads;
- navegação privilegiada;
- lifecycle das views.

## 1. Arquitetura recomendada

```text
electron/
  main.ts
  preload.ts
  ipc/
    channels.ts
    types.ts
  browser/
    TabManager.ts
    NavigationManager.ts
    SessionManager.ts
    PopupManager.ts
    DownloadManager.ts

src/
  components/
    TabBar/
    Toolbar/
    AddressBar/
    DownloadsPanel/
  state/
    browserReducer.ts
```

Não coloque todas as responsabilidades em um único componente React.

## 2. BaseWindow + WebContentsView

Para navegadores com múltiplas abas, cada aba deve ser representada por um `WebContentsView`.

```ts
import { BaseWindow, WebContentsView } from "electron";

const win = new BaseWindow({
  width: 1200,
  height: 800,
});

const view = new WebContentsView({
  webPreferences: {
    sandbox: true,
    contextIsolation: true,
    nodeIntegration: false,
  },
});

win.contentView.addChildView(view);
view.webContents.loadURL("https://example.com");
```

A UI React e o conteúdo web remoto devem permanecer em contextos separados.

## 3. Estado de aba

Use estado explícito e tipado.

```ts
export interface TabState {
  id: string;
  title: string;
  url: string;
  faviconUrl?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  crashed: boolean;
  audible: boolean;
  muted: boolean;
}
```

O DOM React não é a fonte de verdade do conteúdo remoto.

O Main observa `WebContents` e envia patches ao Renderer.

## 4. Bridge tipado

Exemplo:

```ts
export interface ElectronBridge {
  createTab(url?: string): Promise<string>;
  closeTab(id: string): Promise<void>;
  switchTab(id: string): Promise<void>;

  loadUrl(id: string, url: string): Promise<void>;

  navigate(
    id: string,
    action: "back" | "forward" | "reload" | "stop"
  ): Promise<void>;

  onTabUpdated(
    callback: (patch: Partial<TabState> & { id: string }) => void
  ): () => void;
}
```

A implementação do bridge deve obedecer `electron-ipc-security`.

## 5. TabManager

Responsabilidades:

- criar aba;
- registrar ID;
- manter Map de views;
- trocar aba ativa;
- fechar aba;
- restaurar layout;
- aplicar bounds;
- realizar cleanup.

```ts
const tabs = new Map<string, WebContentsView>();
```

Ao fechar:

```ts
view.webContents.close();
tabs.delete(id);
```

Remover a view da janela não substitui o fechamento do `WebContents`.

## 6. Troca de aba

Mantenha apenas a aba desejada na composição ativa ou adote uma política consistente de views visíveis.

Exemplo conceitual:

```text
activeTab changes
  ↓
remove previous child view
  ↓
add current child view
  ↓
apply bounds
```

Não recrie a aba apenas para trocar visibilidade.

## 7. Navegação

Use APIs de `WebContents` e `navigationHistory`.

```ts
await view.webContents.loadURL(url);

if (view.webContents.navigationHistory.canGoBack()) {
  view.webContents.navigationHistory.goBack();
}
```

Também use:

- `goForward`;
- `reload`;
- `stop`.

Trate `loadURL()` como assíncrono.

## 8. Eventos relevantes

Observe e reflita ao React:

- `did-start-loading`;
- `did-stop-loading`;
- `did-navigate`;
- `did-navigate-in-page`;
- `page-title-updated`;
- `page-favicon-updated`;
- `render-process-gone`;
- `found-in-page`.

A UI deve derivar seu estado do Main via IPC.

## 9. Lifecycle real

Não substitua eventos do Chromium por `setTimeout`.

Prefira:

```text
evento real
  ↓
atualização do estado
  ↓
IPC
  ↓
React reducer
```

## 10. Resize e layout

Ao redimensionar a janela:

- reserve espaço para toolbar/tabbar;
- atualize bounds da view ativa;
- evite valores duplicados espalhados pelo código.

Centralize métricas de layout.

## 11. Sessions

Use `session` conscientemente para:

- cookies;
- cache;
- permissões;
- downloads;
- autenticação;
- isolamento de contas.

Não compartilhe uma session entre contas quando isolamento for requisito.

## 12. Modo anônimo

Use partição em memória:

```ts
const incognitoSession =
  session.fromPartition("in-memory-incognito");
```

As abas da mesma janela anônima podem compartilhar a mesma sessão em memória.

Não reutilize a sessão anônima como sessão normal.

## 13. Popups e window.open

Nenhum `window.open()` de conteúdo remoto deve criar janela fora da política do Main.

```ts
view.webContents.setWindowOpenHandler((details) => {
  const decision = popupPolicy.evaluate(details);

  if (decision.kind === "tab") {
    openControlledTab(details.url);
    return { action: "deny" };
  }

  if (decision.kind === "auth") {
    return createControlledAuthWindow(details);
  }

  return { action: "deny" };
});
```

Não converta automaticamente todos os popups de autenticação em abas.

## 14. OAuth e login

Diferencie:

### Login do site visitado

O navegador está hospedando uma página que inicia seu próprio login.

Fluxos legítimos podem depender de:

- cookies;
- redirect;
- `window.opener`;
- `postMessage`.

### OAuth do próprio aplicativo

O app Electron está autenticando o próprio usuário.

Não trate uma aba web genérica como substituto automático do fluxo recomendado pelo provedor.

## 15. Permissões Chromium

Sessions remotas devem usar política explícita.

```ts
session.defaultSession.setPermissionRequestHandler(
  (webContents, permission, callback) => {
    callback(permissionPolicy.allows(webContents, permission));
  }
);
```

A decisão deve considerar:

```text
origin
+
permission
+
contexto
```

Nunca faça allow-all global.

## 16. Downloads

Centralize downloads no `DownloadManager`.

Observe:

```ts
session.on("will-download", ...)
```

Gerencie:

- origem;
- nome;
- MIME;
- tamanho;
- destino;
- progresso;
- cancelamento;
- conclusão.

O React recebe apenas estado traduzido por IPC.

## 17. Find in page

```ts
const requestId = webContents.findInPage(query, {
  forward: true,
  findNext: false,
  matchCase: false,
});
```

Observe `found-in-page`.

Finalize com `stopFindInPage()`.

## 18. Áudio e mute

Use:

```ts
webContents.isCurrentlyAudible();
webContents.isAudioMuted();
webContents.setAudioMuted(true);
```

Sincronize com o estado visual da aba.

## 19. Zoom

Use APIs nativas:

```ts
webContents.setZoomFactor(factor);
```

Mantenha limites controlados pelo aplicativo.

## 20. Menu de contexto

Use o evento `context-menu` e `Menu`/`MenuItem`.

Ações possíveis:

- copiar;
- colar;
- selecionar tudo;
- abrir link em nova aba;
- inspecionar elemento.

Não exponha internals do `WebContents` diretamente ao React.

## 21. Crash recovery

Observe:

```text
render-process-gone
```

Fluxo recomendado:

```text
crash
  ↓
registrar motivo
  ↓
primeira ocorrência?
  ├─ sim → reload controlado
  └─ não → mostrar página/estado de erro
```

Evite loops infinitos de reload.

## 22. Estratégia de memória

Múltiplas abas custam:

- RAM;
- GPU;
- timers;
- WebGL;
- áudio;
- rede;
- processos Chromium.

Escolha explicitamente:

```text
KEEP ALIVE
SUSPEND
DESTROY + RESTORE
```

Não mantenha dezenas ou centenas de abas ativas indefinidamente sem política.

## 23. Segurança de conteúdo remoto

Baseline:

```text
nodeIntegration: false
contextIsolation: true
sandbox: true
webSecurity: true
```

Além disso:

- popup policy;
- permission policy;
- navigation policy quando necessária;
- sessions isoladas;
- downloads controlados;
- IPC restrito via `electron-ipc-security`.

## 24. Quando NÃO usar esta skill

Se o projeto usa diretamente a tag:

```html
<webview>
```

e depende de:

- `sendToHost`;
- `ipc-message`;
- `will-attach-webview`;
- `webviewTag`;
- guest preload;
- `<webview allowpopups>`;

use `electron-webview-legacy`.

## 25. Checklist

- [ ] `BaseWindow`/`WebContentsView` usados conscientemente
- [ ] cada aba possui estado explícito
- [ ] Main é fonte de verdade do conteúdo remoto
- [ ] React recebe patches via IPC
- [ ] bridge é tipado
- [ ] lifecycle usa eventos reais
- [ ] views fechadas chamam `webContents.close()`
- [ ] sessions foram planejadas
- [ ] modo anônimo usa partição em memória
- [ ] `setWindowOpenHandler` existe
- [ ] permissões são deny-by-default
- [ ] downloads possuem manager
- [ ] crash recovery tem limite
- [ ] estratégia de memória foi definida
- [ ] IPC privilegiado segue `electron-ipc-security`

## Regra final

Prioridade:

```text
ARCHITECTURE
  ↓
CORRECTNESS
  ↓
SECURITY
  ↓
STABILITY
  ↓
PERFORMANCE
```
