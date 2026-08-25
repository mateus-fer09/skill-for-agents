# 16. IPC

Electron usa IPC para comunicação entre processos.

Módulos principais:

- `ipcMain`
- `ipcRenderer`
- `contextBridge`

Padrões:

## Renderer -> Main: fire-and-forget

```js
ipcRenderer.send('telemetry:event', payload)
```

```js
ipcMain.on('telemetry:event', (event, payload) => {
  // validar
})
```

## Renderer -> Main: request/response

Preferido:

```js
ipcRenderer.invoke('files:open')
```

```js
ipcMain.handle('files:open', async (event) => {
  // validar sender
  return result
})
```

## Main -> Renderer

```js
win.webContents.send('app:update-status', status)
```

No preload:

```js
contextBridge.exposeInMainWorld('updates', {
  onStatus(callback) {
    const handler = (_event, value) => callback(value)

    ipcRenderer.on('app:update-status', handler)

    return () => {
      ipcRenderer.removeListener('app:update-status', handler)
    }
  }
})
```

Não repassar o objeto `event` ao renderer.

---

# 17. Regras de IPC seguro

Todo handler IPC privilegiado deve:

1. usar canal específico;
2. validar sender;
3. validar origem quando aplicável;
4. validar tipo dos argumentos;
5. validar formato;
6. validar limites de tamanho;
7. aplicar autorização;
8. não confiar em caminhos;
9. não aceitar comandos shell genéricos;
10. retornar apenas os dados necessários.

Exemplo de validação:

```js
ipcMain.handle('settings:set-theme', (event, theme) => {
  if (!isTrustedSender(event.senderFrame)) {
    throw new Error('Unauthorized IPC sender')
  }

  if (!['light', 'dark', 'system'].includes(theme)) {
    throw new TypeError('Invalid theme')
  }

  saveTheme(theme)

  return { ok: true }
})
```

---

# 45. MessageChannelMain e MessagePortMain

Úteis para comunicação estruturada e canais dedicados entre contextos/processos.

Considerar quando:

- alto volume de mensagens;
- stream-like communication;
- canal isolado;
- transferência de ports.

Ainda aplicar validação e ownership explícito.

---

# 63. TypeScript

Recomendado para aplicações médias/grandes.

Benefícios:

- tipos Electron;
- contratos IPC;
- APIs preload declaradas;
- eventos;
- estruturas platform-specific.

Exemplo:

```ts
declare global {
  interface Window {
    desktop: {
      openFile(): Promise<string | null>
    }
  }
}
```

Criar tipos compartilhados para IPC, mas não compartilhar módulos runtime que
introduzam dependências privilegiadas no renderer.

---

# 65. Arquitetura de IPC recomendada

```text
renderer
   │
   ▼
window.desktop.files.open()
   │
   ▼
preload
   │
   ▼
ipcRenderer.invoke("files:open")
   │
   ▼
ipcMain.handle("files:open")
   │
   ▼
service layer
   │
   ▼
filesystem/dialog/native API
```

Não colocar toda lógica de negócio em handlers IPC.

Handlers devem ser adaptadores de fronteira.

---

# 66. Design de canais IPC

Usar namespace:

```text
files:open
files:save
settings:get
settings:update
updates:check
window:minimize
auth:logout
```

Evitar:

```text
action
command
do
execute
ipc
```

Canais genéricos incentivam payloads genéricos e vulneráveis.

---

# 67. Schemas de validação

Quando projeto já usa biblioteca de schema:

- Zod;
- Valibot;
- Joi;
- Ajv;
- outra biblioteca existente;

reutilizar para validar inputs IPC.

Exemplo conceitual:

```js
const parsed = SettingsSchema.parse(input)
```

Não adicionar dependência apenas para uma validação trivial se checagens
simples forem suficientes.

---

# 99. Security Baseline para IPC

```js
function validateSender(event) {
  const url = event.senderFrame?.url

  if (!url) {
    throw new Error('Missing sender URL')
  }

  const parsed = new URL(url)

  if (parsed.protocol !== 'app:') {
    throw new Error('Untrusted IPC sender')
  }
}
```

A implementação exata depende do esquema de origem do app.

Não copiar literalmente sem ajustar ao projeto.

---

# 114. Preload Design

Um bom preload:

```text
100% explícito
mínimo
sem lógica de negócio pesada
sem segredos
sem acesso genérico a Node
com APIs semânticas
com cleanup de listeners
com validação básica
```

Ruim:

```js
window.require = require
window.fs = require('fs')
window.electron = require('electron')
```

---

# 115. API Surface

Pergunta obrigatória ao adicionar método no preload:

> O renderer realmente precisa desta capacidade?

Se sim:

> Qual é a menor função que entrega essa capacidade?

Exemplo:

Melhor:

```js
getCurrentUserAvatar()
```

Pior:

```js
readAnyFile(path)
```

---

# 116. Remote Procedure Design

Evitar API IPC estilo:

```js
invoke('execute', {
  module: 'fs',
  method: 'readFile',
  args: [...]
})
```

Isso recria RCE sobre IPC.

Cada ação privilegiada deve ter endpoint semântico.

---

# 117. Authentication vs Authorization

O renderer declarar:

```json
{ "isAdmin": true }
```

não é autorização.

O main deve verificar estado confiável próprio.

Nunca confiar em role/permission enviada pelo renderer.

---

# 153. Frames e IPC

Em aplicações com iframes, validar o frame real que enviou mensagem.

Não assumir:

```text
sender webContents = trusted page
```

implica:

```text
sender frame = trusted frame
```

---

