---
name: electron-ipc
description: Padrões de comunicação segura entre processo principal e renderer em apps Electron, usando contextBridge, preload scripts e ipcMain/ipcRenderer. Use sempre que o usuário mencionar IPC, preload script, contextBridge, comunicação entre main e renderer, window.electronAPI, ou pedir para expor alguma funcionalidade do Node/sistema operacional para a interface (arquivos, sistema, notificações nativas, etc). Essa é uma das áreas onde apps Electron mais viram vulnerabilidade — a configuração errada permite que uma XSS na interface vire execução arbitrária de código no computador do usuário.
---

# Electron IPC Seguro

O modelo de ameaça do Electron é diferente de web comum: o renderer roda HTML/CSS/JS, mas se mal configurado, tem acesso direto a Node.js — ou seja, um XSS na interface (ex: um `dangerouslySetInnerHTML` mal sanitizado, uma lib de terceiros comprometida) pode virar `require('child_process').exec('rm -rf /')`. Toda a superfície de IPC deve ser desenhada assumindo que **o renderer é hostil por padrão**.

## As três flags obrigatórias

```js
new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,   // padrão desde Electron 12 — nunca desative
    nodeIntegration: false,   // renderer não deve ter require() nem Node direto
    sandbox: true,            // roda no mesmo sandbox do Chromium
  },
});
```

`contextIsolation: true` sozinho não é suficiente — ele impede o renderer de mexer nos globals do preload, mas quem decide o que fica exposto é o `contextBridge`. As três flags juntas são o piso mínimo; qualquer app que desvie disso precisa de uma justificativa explícita documentada no código, não um "esqueci de configurar".

## Preload: exponha funções, nunca módulos inteiros

Nunca passe `ipcRenderer` cru para o `contextBridge` — isso dá ao renderer acesso a mandar/escutar **qualquer** canal IPC, não só os que você pretendia.

```js
// ❌ Perigoso — dá acesso ao sistema de IPC inteiro
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);

// ✅ Uma função por operação, com validação já no preload
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  saveFile: (filename, content) => {
    if (typeof filename !== 'string' || typeof content !== 'string') {
      throw new TypeError('Argumentos inválidos');
    }
    return ipcRenderer.invoke('file:save', filename, content);
  },
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),
});
```

Regras do preload:
- **Nunca** exponha `child_process`, `fs` direto, `eval`, `new Function`, ou qualquer coisa que rode comando arbitrário.
- Serialize os dados antes de mandar pela ponte — `Buffer`, `Stream`, `EventEmitter` do Node podem vazar acesso a internals do Node quando passados crus pelo `contextBridge`; envie tipos simples (string, number, array, objeto plano).
- Para eventos do main → renderer (`ipcRenderer.on`), nunca repasse o callback direto — isso vaza o objeto `event` (que dá acesso ao `ipcRenderer` completo via `event.sender`). Use um wrapper que só repassa os dados:

```js
// ✅ preload.js
contextBridge.exposeInMainWorld('api', {
  onUpdateProgress: (callback) => {
    ipcRenderer.on('update:progress', (_event, progress) => callback(progress));
  },
});
```

## Main process: validação em profundidade (defense in depth)

Trate toda validação do preload como uma sugestão, não uma garantia — o main process **sempre** revalida, porque é a única camada que roda com privilégio real.

```js
const { app } = require('electron');
const path = require('path');

ipcMain.handle('file:save', async (event, filename, content) => {
  // 1. Validar remetente — a mensagem veio da janela que eu esperava?
  if (event.sender !== mainWindow.webContents) {
    throw new Error('Remetente não autorizado');
  }

  // 2. Validar tipos
  if (typeof filename !== 'string' || typeof content !== 'string') {
    throw new TypeError('Argumentos inválidos');
  }

  // 3. Prevenir path traversal — nunca confie em filename como caminho direto
  const safeName = path.basename(filename); // remove "../../etc/passwd"
  const safePath = path.join(app.getPath('userData'), safeName);
  if (!safePath.startsWith(app.getPath('userData'))) {
    throw new Error('Tentativa de escape de diretório bloqueada');
  }

  return fs.promises.writeFile(safePath, content, 'utf-8');
});
```

- **Todo `ipcMain.handle`/`ipcMain.on`** deve checar `event.sender` quando a ação for sensível (gravar arquivo, rodar comando, acessar dados de outro usuário) — sem isso, qualquer `<iframe>` ou `BrowserView` carregado dentro do app também consegue chamar o handler.
- `path.basename` + checar prefixo do diretório é o padrão mínimo contra path traversal sempre que um nome de arquivo vem do renderer.
- Prefira `ipcMain.handle` + `ipcRenderer.invoke` (padrão request/response com Promise) a `ipcMain.on`/`ipcRenderer.send` para qualquer operação que precise de retorno — é mais fácil de tipar e auditar do que eventos soltos.

## Abrindo links e caminhos externos

`shell.openExternal` e `shell.openPath` são pontos comuns de fuga de sandbox se o argumento vier direto do renderer sem checagem:

```js
ipcMain.handle('shell:open-external', async (event, url) => {
  const parsed = new URL(url); // lança erro se não for URL válida
  if (parsed.protocol !== 'https:') {
    throw new Error('Apenas links https são permitidos');
  }
  await shell.openExternal(url);
});
```

Rejeite sempre `javascript:`, `file:`, `data:` e caminhos UNC (`\\servidor\...`) — esses protocolos podem levar a execução de código ou vazamento de credenciais.

## Content Security Policy

Configure um CSP restritivo na página carregada, como camada extra mesmo com `contextIsolation`/`sandbox` ativos — ele limita o que um XSS consegue fazer mesmo que passe pelas outras defesas:

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; object-src 'none';">
```

## Checklist de auditoria rápida (rodar antes de cada release)
1. `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true` em toda `BrowserWindow`.
2. Nenhum `exposeInMainWorld` repassa `ipcRenderer`, `require`, `fs`, ou `child_process` crus.
3. Todo `ipcMain.handle`/`on` sensível valida `event.sender` e o formato dos argumentos.
4. Nenhum nome de arquivo/caminho do renderer vai direto para `fs`/`path` sem `path.basename` + checagem de diretório.
5. `shell.openExternal`/`openPath` restritos a protocolos/domínios permitidos.
6. CSP configurado na página principal.
7. Nenhum listener de IPC repassa o `callback` bruto do `ipcRenderer.on` para o renderer.