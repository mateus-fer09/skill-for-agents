# 5. Lifecycle da aplicação: módulo `app`

`app` pertence ao main process e controla o ciclo de vida da aplicação.

Importação preferencial:

```js
const { app } = require('electron/main')
```

ou, conforme o sistema de módulos:

```js
import { app } from 'electron'
```

## 5.1 Inicialização

Padrão:

```js
const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
```

APIs úteis:

- `app.isReady()`
- `app.whenReady()`

`ready` é emitido uma única vez após Electron terminar a inicialização.

Certas APIs que obrigatoriamente precisam ser chamadas antes de `ready`
devem ser configuradas sincronicamente no topo do main process.

---

# 6. Eventos principais de `app`

O agente deve conhecer a finalidade dos seguintes eventos:

## Startup e lifecycle

- `will-finish-launching`
- `ready`
- `window-all-closed`
- `before-quit`
- `will-quit`
- `quit`

## Ativação e integração macOS

- `activate`
- `did-become-active`
- `did-resign-active`
- `open-file`
- `open-url`
- `continue-activity`
- `will-continue-activity`
- `continue-activity-error`
- `activity-was-continued`
- `update-activity-state`
- `new-window-for-tab`

## Janelas e WebContents

- `browser-window-created`
- `browser-window-focus`
- `browser-window-blur`
- `web-contents-created`

## Segurança e autenticação

- `certificate-error`
- `select-client-certificate`
- `login`

## Processos e estabilidade

- `render-process-gone`
- `child-process-gone`
- `gpu-info-update`

## Outros

- `accessibility-support-changed`
- `session-created`
- `second-instance`

O agente deve consultar a documentação antes de assumir disponibilidade
cross-platform.

---

# 7. Encerramento correto

Padrão multiplataforma:

```js
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

No macOS, aplicativos normalmente permanecem ativos mesmo sem janelas.

Recriar janela:

```js
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

Diferença essencial:

```text
app.quit()
    executa fluxo normal de fechamento
    dispara eventos relevantes
    permite beforeunload/unload

app.exit(code)
    encerra imediatamente
    não executa o lifecycle normal de quit
```

Usar `app.exit()` somente quando encerramento abrupto for realmente desejado.

---

# 8. Single Instance

Para impedir múltiplas instâncias:

```js
const gotLock = app.requestSingleInstanceLock()

if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, argv, workingDirectory, additionalData) => {
    // restaurar/focar a janela principal
  })
}
```

Preferir `additionalData` quando a ordem e fidelidade de argumentos precisarem
ser preservadas.

---

# 9. Relaunch

```js
app.relaunch({
  args: process.argv.slice(1).concat(['--relaunch'])
})

app.exit(0)
```

`app.relaunch()` agenda a nova execução, mas não fecha automaticamente a
instância atual.

Evitar chamadas duplicadas que possam criar múltiplas instâncias.

---

# 11. BrowserWindow

`BrowserWindow` é uma das principais abstrações de UI Electron.

Exemplo seguro:

```js
const path = require('node:path')
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({
  width: 1200,
  height: 800,
  show: false,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true
  }
})

win.once('ready-to-show', () => {
  win.show()
})

win.loadFile('index.html')
```

O agente deve saber trabalhar com:

- tamanho e posição;
- resizable;
- minimização/maximização;
- fullscreen;
- frame;
- title bar;
- always on top;
- parent/child windows;
- modal windows;
- background color;
- icon;
- visibility;
- focus;
- multi-monitor;
- state restoration.

---

# 12. WebContents

Cada janela ou view possui um `webContents`.

Usos:

- carregar URLs;
- observar navegação;
- enviar IPC;
- controlar DevTools;
- capturar página;
- executar operações de impressão;
- inspecionar crashes;
- controlar zoom;
- manipular áudio;
- gerenciar handlers de novas janelas.

Regra:

Nunca executar JavaScript arbitrário proveniente de dados não confiáveis.

Evitar `executeJavaScript` quando uma API IPC explícita resolver o problema.

---

# 13. Navegação segura

Tratar toda navegação inesperada como risco.

Aplicações que deveriam permanecer no próprio conteúdo devem limitar navegação.

Exemplo:

```js
win.webContents.on('will-navigate', (event, url) => {
  const target = new URL(url)

  if (target.origin !== 'https://example.com') {
    event.preventDefault()
  }
})
```

Validar usando `URL`, nunca apenas `startsWith`.

Inseguro:

```js
url.startsWith('https://example.com')
```

pois pode permitir strings maliciosas visualmente semelhantes.

---

# 14. Novas janelas

Usar:

```js
webContents.setWindowOpenHandler(({ url }) => {
  const parsed = new URL(url)

  if (parsed.origin === 'https://trusted.example') {
    return { action: 'allow' }
  }

  return { action: 'deny' }
})
```

Default seguro para conteúdo remoto:

```js
webContents.setWindowOpenHandler(() => ({
  action: 'deny'
}))
```

Abrir links externos somente após validação explícita.

---

# 27. WebContentsView

`WebContentsView` é opção moderna para embutir conteúdo web controlado.

Casos:

- painéis;
- tabs;
- conteúdo remoto isolado;
- browsers embutidos;
- múltiplas superfícies Chromium.

O agente deve aplicar os mesmos princípios de segurança de `BrowserWindow`.

---

# 28. BaseWindow e Views

Electron possui APIs de composição de janela e views.

Ao utilizar `BaseWindow`, `View`, `WebContentsView`, `ImageView` ou APIs
relacionadas:

- gerenciar lifetime explicitamente;
- evitar references órfãs;
- destruir `webContents` quando necessário;
- considerar resize;
- considerar DPI/scaling;
- separar superfície visual de conteúdo web.

---

# 106. Custom Title Bars

Ao criar frame customizado:

- preservar drag regions;
- acessibilidade;
- botões nativos;
- snap;
- fullscreen;
- maximização;
- diferenças macOS/Windows/Linux.

Não sacrificar usabilidade por estética.

---

# 107. Frameless Windows

Janelas sem frame exigem cuidado:

- drag;
- resize;
- close/minimize/maximize;
- focus;
- keyboard;
- accessibility;
- platform behavior.

Testar em todos os sistemas alvo.

---

# 108. Multi-window

Cada BrowserWindow aumenta custo de renderer.

Para muitas superfícies:

- avaliar reutilização;
- views;
- tabs;
- virtualização;
- lazy creation.

Nunca manter dezenas de renderers ativos sem medir consumo.

---

# 154. BrowserWindow Ownership

Ao criar uma janela:

- armazenar referência quando necessário;
- remover referência ao fechar;
- evitar memory leak;
- não interagir após `isDestroyed()`.

---

# 155. Destroy vs Close

`close()` segue fluxo normal de fechamento.

`destroy()` é mais abrupto.

Preferir fechamento normal quando o usuário e lifecycle devem ser respeitados.

---

# 156. ready-to-show

Pode melhorar UX evitando flash de tela vazia.

Alternativas:

- background color;
- render inicial rápido.

Não atrasar visibilidade indefinidamente.

---

# 157. Loading Events

Conhecer eventos de `webContents` relevantes:

- start;
- stop;
- finish;
- fail;
- DOM ready;
- navigation.

A nomenclatura e assinatura exatas devem ser confirmadas na versão alvo.

---

# 158. Failure UX

Se página falhar ao carregar:

- logar código/descrição;
- oferecer retry;
- distinguir offline vs bundle corruption;
- não entrar em reload loop.

---

