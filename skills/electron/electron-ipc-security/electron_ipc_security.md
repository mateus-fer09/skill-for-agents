---
name: electron-ipc-security
description: Segurança e arquitetura da fronteira privilegiada Main ↔ Renderer em Electron. Use sempre que houver preload, contextBridge, ipcMain/ipcRenderer, window.electronAPI, filesystem, shell, notificações nativas, APIs do sistema operacional, exposição de capacidades Node ou qualquer operação privilegiada solicitada pelo Renderer. Esta skill é a autoridade para contratos IPC, validação de sender/payload, least privilege e isolamento de processo. Para guest content ou <webview>, combine com electron-webview-legacy. Para navegadores baseados em WebContentsView, combine com electron-browser.
---

# Electron IPC Security

## Papel

Você é responsável pela fronteira de segurança entre:

```text
Renderer
  ↓
preload / contextBridge
  ↓
IPC
  ↓
Main Process
  ↓
Node.js / filesystem / shell / sistema operacional
```

O Renderer deve ser tratado como **não confiável por padrão**. Uma XSS no Renderer nunca deve resultar automaticamente em acesso ao Node.js, filesystem, shell, processos do sistema ou APIs privilegiadas.

## 1. Baseline obrigatório

Toda janela que não possua justificativa explícita em contrário deve usar:

```ts
new BrowserWindow({
  webPreferences: {
    preload: preloadPath,
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
  },
});
```

Regras:

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- Renderer nunca importa `electron`, `fs`, `child_process` ou módulos Node diretamente
- toda capacidade privilegiada passa por uma API explícita no preload

## 2. ContextBridge: exponha capacidades, não infraestrutura

Nunca exponha objetos genéricos ou módulos inteiros.

```ts
// ❌
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);

// ❌
contextBridge.exposeInMainWorld("fs", fs);

// ✅
contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),
  saveDocument: (name: string, content: string) =>
    ipcRenderer.invoke("document:save", { name, content }),
});
```

Não exponha:

```text
ipcRenderer completo
require
electron inteiro
fs
child_process
shell genérico
eval
new Function
process
```

## 3. Contrato IPC explícito

Prefira canais específicos:

```text
app:get-version
document:save
dialog:open-file
shell:open-external
```

Evite:

```text
host:call(methodName, ...args)
system:execute(command)
filesystem:operation(type, path)
```

Toda capability privilegiada deve possuir:

1. canal conhecido;
2. formato de payload conhecido;
3. validação de tipos;
4. limites;
5. validação de remetente quando sensível;
6. resposta previsível.

## 4. Prefira invoke/handle

Para request/response:

```ts
ipcMain.handle("app:get-version", () => app.getVersion());
```

```ts
const version = await ipcRenderer.invoke("app:get-version");
```

Prefira `ipcMain.handle` + `ipcRenderer.invoke` em vez de eventos soltos quando houver retorno.

## 5. Validação no preload não substitui o Main

O preload pode rejeitar dados obviamente inválidos, mas o Main Process deve revalidar tudo.

```ts
ipcMain.handle("document:save", async (event, payload) => {
  if (event.sender !== mainWindow.webContents) {
    throw new Error("Sender não autorizado");
  }

  if (
    !payload ||
    typeof payload.name !== "string" ||
    typeof payload.content !== "string"
  ) {
    throw new TypeError("Payload inválido");
  }

  // operação privilegiada
});
```

Regra:

```text
Renderer pede.
Main decide.
```

## 6. Validação de sender

Valide `event.sender` especialmente para operações como:

- filesystem;
- shell;
- credenciais;
- dados de outra conta;
- criação de janelas;
- APIs nativas;
- alteração de configuração;
- comandos de atualização;
- qualquer ação com impacto fora do Renderer.

Não assuma que qualquer frame, iframe, guest ou view com acesso ao canal está autorizado.

## 7. Dados simples atravessando a ponte

Prefira:

- string;
- number;
- boolean;
- arrays simples;
- objetos planos.

Evite expor objetos Node/Electron como:

- `Buffer`;
- `Stream`;
- `EventEmitter`;
- objetos com métodos privilegiados;
- eventos Electron crus.

## 8. Eventos Main → Renderer

Nunca repasse o objeto `event` cru.

```ts
contextBridge.exposeInMainWorld("electronAPI", {
  onUpdateProgress: (callback) => {
    const listener = (_event, progress) => callback(progress);
    ipcRenderer.on("update:progress", listener);

    return () => {
      ipcRenderer.removeListener("update:progress", listener);
    };
  },
});
```

Regras:

- filtre o evento;
- repasse somente dados;
- forneça unsubscribe;
- remova listeners no cleanup.

## 9. Filesystem

Nunca use diretamente caminho vindo do Renderer.

```ts
const safeName = path.basename(inputName);
const baseDir = app.getPath("userData");
const target = path.join(baseDir, safeName);

if (!target.startsWith(baseDir)) {
  throw new Error("Path inválido");
}
```

Sempre considere:

- path traversal;
- caminhos absolutos;
- UNC;
- symlinks quando relevantes;
- sobrescrita de arquivo;
- extensão;
- tamanho;
- diretório permitido.

## 10. shell.openExternal / openPath

Considere operação sensível.

```ts
ipcMain.handle("shell:open-external", async (event, value) => {
  if (event.sender !== mainWindow.webContents) {
    throw new Error("Sender não autorizado");
  }

  const url = new URL(value);

  if (url.protocol !== "https:") {
    throw new Error("Protocolo não permitido");
  }

  await shell.openExternal(url.toString());
});
```

Bloqueie por padrão protocolos inesperados como:

```text
javascript:
file:
data:
vbscript:
filesystem:
```

## 11. CSP do Renderer hospedeiro

Quando aplicável, use CSP restritiva como defesa adicional:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; object-src 'none';"
/>
```

CSP não substitui isolamento de processo e validação IPC.

## 12. Native capabilities

Toda API nativa deve ser modelada como capability pequena.

Prefira:

```ts
window.electronAPI.selectDocument()
window.electronAPI.showNotification(data)
window.electronAPI.openTrustedExternalUrl(url)
```

Evite:

```ts
window.system.call("...");
window.native.execute("...");
window.shell.run("...");
```

## 13. Coordenação com outras skills

Use esta skill como autoridade para IPC e preload.

### Com `electron-browser`

`electron-browser` define tabs, navegação, sessões e WebContentsView.

Esta skill define:

- bridge React ↔ Main;
- canais;
- tipos;
- validação;
- capabilities.

### Com `electron-webview-legacy`

`electron-webview-legacy` define guest content, navegação, popup, guest preload e security gate.

Esta skill deve revisar qualquer passagem:

```text
guest / embedder
  ↓
IPC
  ↓
Main privilegiado
```

## 14. Anti-padrões absolutos

```text
❌ nodeIntegration: true sem justificativa forte
❌ contextIsolation: false
❌ ipcRenderer completo no window
❌ require exposto
❌ fs exposto
❌ child_process exposto
❌ shell genérico exposto
❌ comando arbitrário vindo do Renderer
❌ IPC privilegiado sem validação
❌ event cru enviado ao Renderer
❌ caminho do Renderer usado diretamente no filesystem
❌ protocolo externo arbitrário
```

## 15. Security checklist

- [ ] `contextIsolation: true`
- [ ] `nodeIntegration: false`
- [ ] `sandbox: true`
- [ ] Renderer não importa Node/Electron
- [ ] preload expõe apenas capabilities específicas
- [ ] `ipcRenderer` não é exposto inteiro
- [ ] canais são explícitos
- [ ] payloads são validados no Main
- [ ] sender é validado em ações sensíveis
- [ ] filesystem rejeita path traversal
- [ ] URLs externas são parseadas e validadas
- [ ] listeners possuem cleanup
- [ ] eventos Electron crus não vazam para o Renderer
- [ ] CSP existe quando aplicável

## Regra final

Assuma:

```text
THE RENDERER MAY BE COMPROMISED.
```

Mesmo assim, um comprometimento do Renderer deve continuar confinado e não conceder automaticamente acesso ao Node.js, filesystem, shell ou outras capacidades privilegiadas.
