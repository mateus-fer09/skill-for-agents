---
name: electron-webview-legacy
description: Uso seguro, manutenção, auditoria e migração de aplicações Electron que usam a tag <webview> ou guest content. Use sempre que houver <webview>, webviewTag, guest preload, sendToHost, ipc-message, will-attach-webview, allowpopups, navegação guest, WebView sessions/partitions, permissões, downloads, executeJavaScript, insertCSS, popups/OAuth ou migração <webview> → WebContentsView. Esta skill funciona também como security gate: conteúdo remoto deve ser tratado como comprometível e a implementação só é aprovada após validar isolamento, preload, IPC, navegação, popups, permissões, sessions e capacidades nativas.
---

# Electron WebView Legacy & Security Gate

## Papel

Você é especialista em aplicações Electron que usam:

```html
<webview>
```

Sua responsabilidade possui dois eixos inseparáveis:

```text
USO / ARQUITETURA
+
SECURITY GATE
```

Nunca escolha `<webview>` automaticamente para projeto novo.

Para aplicações novas, avalie primeiro:

1. `WebContentsView`;
2. `<iframe sandbox>`;
3. `<webview>` somente quando houver requisito arquitetural real ou legado;
4. navegador externo quando incorporação não for necessária.

Para navegadores novos baseados em `WebContentsView`, use `electron-browser`.

---

# PARTE A — ARQUITETURA E USO

## 1. Modelo mental

```text
Main Process
├─ políticas
├─ sessions
├─ permissões
├─ popups
├─ downloads
└─ lifecycle privilegiado
      │
      │ IPC
      ▼
Renderer / Embedder
├─ React/UI
├─ tabs
└─ <webview>
      │
      ▼
Guest Content
└─ página web remota
```

O guest nunca deve ser tratado como confiável apenas por estar dentro do aplicativo.

## 2. Habilitação

`webviewTag` deve existir apenas nas janelas que realmente precisam dele.

```ts
const win = new BrowserWindow({
  webPreferences: {
    preload: preloadPath,
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    webviewTag: true,
  },
});
```

Não habilite globalmente por conveniência.

## 3. Configuração mínima

```html
<webview
  id="guest"
  src="https://example.com"
></webview>
```

Adicione atributos somente quando houver requisito concreto.

## 4. CSS

O `<webview>` é um Custom Element.

```css
webview {
  display: flex;
  width: 100%;
  height: 100%;
}
```

Evite alterar o comportamento de layout sem necessidade.

## 5. Lifecycle

Use eventos reais:

- `did-attach`;
- `dom-ready`;
- `did-start-loading`;
- `did-stop-loading`;
- `did-finish-load`;
- `did-fail-load`;
- `did-navigate`;
- `did-navigate-in-page`;
- `page-title-updated`;
- `page-favicon-updated`;
- `render-process-gone`;
- `destroyed`.

Nunca use `setTimeout` como substituto do lifecycle.

## 6. Estado da aba

Mantenha estado explícito.

```ts
interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  partition: string;
  loading: boolean;
  crashed: boolean;
  audible: boolean;
  muted: boolean;
}
```

O elemento `<webview>` não deve ser a única fonte de verdade.

## 7. Navegação

Use APIs próprias:

```ts
await webview.loadURL(url);

webview.stop();
webview.reload();
webview.reloadIgnoringCache();

if (webview.canGoBack()) webview.goBack();
if (webview.canGoForward()) webview.goForward();
```

Trate `loadURL()` como assíncrono e lide com falhas.

## 8. Find in page

```ts
const requestId = webview.findInPage(query, {
  forward: true,
  findNext: false,
  matchCase: false,
});
```

Observe `found-in-page`.

Finalize com `stopFindInPage()`.

## 9. Sessions e partitions

```html
<webview partition="persist:account-a"></webview>
```

Regras:

- `persist:nome` → persistente;
- `nome` → memória;
- não reutilize a mesma partition entre contas se isolamento for requisito;
- não derive partition diretamente de input arbitrário;
- não tente trocar a partition de um guest já navegado.

## 10. Guest ↔ Embedder

Guest → Host:

```text
guest preload
  ↓
ipcRenderer.sendToHost()
  ↓
ipc-message no <webview>
  ↓
embedder
```

Host → Guest:

```text
embedder
  ↓
webview.send()
  ↓
ipcRenderer.on() no guest preload
```

Use canais explícitos e payloads estruturados.

Qualquer caminho que chegue ao Main Process privilegiado deve obedecer `electron-ipc-security`.

## 11. Guest preload

Use somente quando necessário.

Casos possíveis:

- integração persistente com DOM;
- observadores;
- bridge guest específica.

Nunca permita que site, Renderer ou input do usuário escolham arbitrariamente:

- caminho do preload;
- código;
- módulo Node;
- API exposta.

## 12. executeJavaScript

Use apenas para tarefas controladas e pontuais.

```ts
const title =
  await webview.executeJavaScript("document.title", true);
```

Nunca faça:

```ts
webview.executeJavaScript(userInput);
webview.executeJavaScript(remoteServerResponse);
```

Não transforme conteúdo remoto em código.

## 13. insertCSS

```ts
const key = await webview.insertCSS(css);
// ...
await webview.removeInsertedCSS(key);
```

Use apenas CSS controlado pelo aplicativo.

Guarde a chave se precisar remover depois.

## 14. Popups

Popups não devem ser:

```text
ALLOW ALL
```

nem obrigatoriamente:

```text
BLOCK ALL
```

Sites reais podem depender de popup para autenticação.

Se `allowpopups` estiver habilitado, `setWindowOpenHandler()` é obrigatório.

## 15. Auth popup

Fluxos de autenticação podem depender de:

- cookies;
- redirects;
- `window.opener`;
- `postMessage`.

Não converta automaticamente popup de autenticação em nova aba.

Quando necessário, use uma janela controlada.

## 16. Login do site vs OAuth do app

### Login do site

O usuário visita um site e o site abre seu próprio login.

Preserve o fluxo legítimo de forma controlada.

### OAuth do aplicativo Electron

O próprio app autentica o usuário.

Não trate `<webview>` como substituto automático do fluxo desktop recomendado pelo provedor.

## 17. Áudio

```ts
webview.isCurrentlyAudible();
webview.isAudioMuted();
webview.setAudioMuted(true);
```

Sincronize o estado com a UI de abas.

## 18. Crash recovery

Observe `render-process-gone`.

```text
crash
  ↓
registrar motivo
  ↓
primeira tentativa?
  ├─ sim → reload controlado
  └─ não → estado de erro
```

Não crie loop infinito de reload.

## 19. Cleanup

Remova:

- listeners;
- timers;
- referências;
- subscriptions.

Não mantenha referências a guests destruídos.

## 20. Memória

Defina estratégia:

```text
KEEP ALIVE
SUSPEND
DESTROY + RESTORE
```

Múltiplos guests podem consumir RAM, GPU, processos Chromium, timers, áudio e rede.

## 21. Downloads

Defina:

- origem;
- destino;
- progresso;
- cancelamento;
- nome;
- MIME;
- tamanho;
- lifecycle.

Downloads de conteúdo remoto são não confiáveis.

---

# PARTE B — SECURITY GATE

## 22. Princípios

```text
ZERO TRUST
+
LEAST PRIVILEGE
+
DENY BY DEFAULT
+
EXPLICIT ALLOWLIST
+
DEFENSE IN DEPTH
```

Pergunta central:

> Se o site carregado for totalmente controlado por um atacante, até onde ele consegue chegar?

A resposta correta deve ser:

```text
somente ao contexto web não privilegiado
```

## 23. Baseline de segurança

Para conteúdo remoto:

```text
nodeIntegration: false
contextIsolation: true
sandbox: true
webSecurity: true
```

Não use como workaround:

```text
nodeIntegration: true
contextIsolation: false
sandbox: false
webSecurity: false
allowRunningInsecureContent: true
```

## 24. will-attach-webview obrigatório

Toda aplicação com `<webview>` deve validar guests antes do attach.

```ts
app.on("web-contents-created", (_event, contents) => {
  contents.on(
    "will-attach-webview",
    (event, webPreferences, params) => {
      webPreferences.nodeIntegration = false;
      webPreferences.contextIsolation = true;
      webPreferences.sandbox = true;

      if (!isAllowedWebViewURL(params.src)) {
        event.preventDefault();
        return;
      }

      validateGuestPreloadOrRemove(webPreferences);
    }
  );
});
```

O Renderer não é autoridade final sobre WebPreferences ou guest preload.

## 25. Guest preload como fronteira crítica

Nunca exponha ao guest:

```text
fs
child_process
shell
process
ipcRenderer completo
require
electron inteiro
```

Prefira capabilities pequenas:

```ts
window.browser.requestTheme();
window.documents.requestSelectedDocument();
```

## 26. IPC guest privilegiado

IPC deve:

- usar canais explícitos;
- validar payload;
- validar tipos;
- aplicar limites;
- validar sender quando necessário;
- negar canal desconhecido;
- nunca aceitar shell command arbitrário.

Quando chegar ao Main, aplique também `electron-ipc-security`.

## 27. Política de navegação

A URL inicial permitida não torna navegações futuras confiáveis.

```ts
function isAllowedNavigation(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      ALLOWED_HOSTS.has(url.hostname)
    );
  } catch {
    return false;
  }
}
```

Não use:

```ts
url.includes("example.com");
url.startsWith("https://example.com");
```

Valide componentes reais da URL.

## 28. Protocolos

Bloqueie por padrão:

```text
javascript:
file:
data:
vbscript:
filesystem:
```

Prefira HTTPS para conteúdo remoto.

## 29. Redirects

Revalide navegações e redirects.

Não assuma que um destino inicial permitido impede fuga posterior da allowlist.

## 30. Popup policy

Fluxo:

```text
window.open()
  ↓
setWindowOpenHandler()
  ↓
parse URL
  ↓
validar protocolo/origem
  ↓
classificar
  ↓
AUTH / INTERNAL / EXTERNAL / UNKNOWN
  ↓
controlled window / controlled tab / deny
```

## 31. Popup storm protection

Implemente:

- limite de popups simultâneos;
- rate limit;
- preferência por user gesture quando disponível;
- política de uma janela de auth ativa por guest/tab quando adequada.

## 32. Nunca capture credenciais

Não observe, extraia ou registre:

- senha;
- campo password;
- cookie de autenticação;
- authorization header;
- refresh token;
- segredo OAuth.

Não injete script para interceptar login.

## 33. Permissões Chromium

Sessions remotas devem possuir política explícita.

Trate como deny-by-default:

- câmera;
- microfone;
- geolocation;
- notificações;
- clipboard;
- MIDI;
- fullscreen;
- pointer lock;
- demais permissões Chromium.

Use `session.setPermissionRequestHandler()`.

A decisão deve considerar:

```text
origin + permission + contexto
```

## 34. shell.openExternal

Nunca passe diretamente URL do guest.

Antes:

1. parseie com `new URL()`;
2. valide protocolo;
3. valide origem quando necessário;
4. aplique política explícita.

## 35. Downloads

Valide:

- origem;
- nome;
- extensão;
- MIME;
- destino;
- tamanho;
- ação do usuário.

Nunca:

```text
download
  ↓
save
  ↓
execute automatically
```

Tenha cautela especial com:

```text
.exe
.msi
.bat
.cmd
.ps1
.scr
.js
.vbs
```

## 36. Upload/file chooser

Mantenha a seleção de arquivo sob controle do usuário/aplicativo.

Não deixe o site escolher caminhos locais arbitrários.

## 37. TLS

Não ignore erros TLS globalmente.

Não aceite certificado inválido como solução de compatibilidade.

## 38. CSP do host

Use CSP restritiva quando aplicável.

CSP não substitui:

- sandbox;
- context isolation;
- validação IPC;
- navigation policy;
- permission handlers.

## 39. Secrets

Nunca envie ao guest:

- API secret;
- private key;
- refresh token privilegiado;
- credencial do sistema;
- token interno do Main.

## 40. Logging de segurança

Registre eventos como:

```text
BLOCKED_NAVIGATION
BLOCKED_POPUP
BLOCKED_PERMISSION
INVALID_PRELOAD
INVALID_PROTOCOL
INVALID_IPC
UNTRUSTED_EXTERNAL_URL
GUEST_CRASH
```

Não registre:

- senha;
- cookie;
- token;
- authorization header.

## 41. Threat model

Antes de aprovar uma feature, responda:

- e se o site for comprometido?
- e se houver XSS?
- e se o guest enviar IPC malicioso?
- e se a URL redirecionar?
- e se abrir popup?
- e se pedir câmera/microfone?
- e se o preload for alterado?
- o atacante chega ao sistema?
- afeta outra aba?
- afeta outra conta/session?

## 42. Classificação de risco

Use:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Exemplos:

```text
nodeIntegration + remoto → CRITICAL
child_process exposto → CRITICAL
ipcRenderer completo → HIGH/CRITICAL
webSecurity false → HIGH
allowpopups sem controle → HIGH
shell.openExternal sem validação → HIGH
permissions allow-all → HIGH
HTTP remoto → HIGH
```

## 43. Formato obrigatório de auditoria

Ao revisar código:

```text
SECURITY STATUS

RISK:
LOW | MEDIUM | HIGH | CRITICAL

FINDINGS
1. ...
2. ...

REQUIRED FIXES
1. ...
2. ...

RECOMMENDED HARDENING
1. ...

FINAL STATUS
APPROVED | NOT APPROVED
```

## 44. Migração para WebContentsView

Não migre mecanicamente.

Mapeie:

- layout;
- tabs;
- CSS;
- preload;
- IPC;
- sessions;
- popups;
- eventos;
- downloads;
- lifecycle.

Para arquitetura alvo, use `electron-browser`.

## 45. Security checklist

- [ ] HTTPS quando aplicável
- [ ] Node Integration OFF
- [ ] Context Isolation ON
- [ ] Sandbox ON
- [ ] Web Security ON
- [ ] mixed content não liberado
- [ ] `webviewTag` somente onde necessário
- [ ] `will-attach-webview` implementado
- [ ] WebPreferences sanitizadas
- [ ] guest preload validado/removido
- [ ] guest preload mínimo
- [ ] APIs Node não expostas
- [ ] `ipcRenderer` inteiro não exposto
- [ ] IPC explícito
- [ ] payload validado
- [ ] sender validado quando necessário
- [ ] navigation policy explícita
- [ ] URLs parseadas com `URL`
- [ ] hosts/protocolos validados
- [ ] redirects revalidados
- [ ] `allowpopups`, se usado, possui justificativa
- [ ] `setWindowOpenHandler` implementado
- [ ] popup de auth controlado
- [ ] popup storm mitigado
- [ ] permissões Chromium com handler
- [ ] permissions deny-by-default
- [ ] sessions isoladas corretamente
- [ ] downloads possuem política
- [ ] downloads não são autoexecutados
- [ ] uploads continuam sob controle do usuário
- [ ] secrets não chegam ao guest
- [ ] CSP do host quando aplicável
- [ ] Electron/dependências privilegiadas são mantidos atualizados
- [ ] nenhum workaround desativa proteções Chromium

## Regra final

Assuma sempre:

```text
THE WEBSITE MAY BE COMPROMISED.
```

O comprometimento total do guest deve continuar confinado ao contexto web e não conceder acesso ao Node.js, Electron, filesystem, shell, Main Process, outras sessions ou outras contas.
