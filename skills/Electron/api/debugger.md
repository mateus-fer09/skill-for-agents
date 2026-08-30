---
title: "Class: Debugger"
description: "## Class: Debugger"
topics:
  - "Api"
keywords:
  - "Class: Debugger"
  - "event"
  - "reason"
  - "webContents"
  - "method"
  - "params"
  - "sessionId"
  - "debugger.sendCommand"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/debugger"
---

# Class: Debugger

## Class: Debugger

> 

Um transporte alternativo para o protocolo de depuração remoto do Chrome.

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

As ferramentas de desenvolvedor do Chrome possuem [special binding](https://chromedevtools.github.io/devtools-protocol/) disponível no runtime do JavaScript que permite interagir com páginas e instrumentá-las.

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow()  
  
try {  
  win.webContents.debugger.attach('1.1')  
} catch (err) {  
  console.log('Debugger attach failed : ', err)  
}  
  
win.webContents.debugger.on('detach', (event, reason) => {  
  console.log('Debugger detached due to : ', reason)  
})  
  
win.webContents.debugger.on('message', (event, method, params) => {  
  if (method === 'Network.requestWillBeSent') {  
    if (params.request.url === 'https://www.github.com') {  
      win.webContents.debugger.detach()  
    }  
  }  
})  
  
win.webContents.debugger.sendCommand('Network.enable')  

```

### Eventos de instância

#### Event: 'detach'

Retorna:

- `event` Event

- `reason` string - Reason for detaching debugger.

Emitted when the debugging session is terminated. This happens either when `webContents` is closed or DevTools is invoked for the attached `webContents`.

#### Event: 'message'

Retorna:

- `event` Event

- `method` string - Method name.

- `params` any - Event parameters defined by the 'parameters' attribute in the remote debugging protocol.

- `sessionId` string - Unique identifier of attached debugging session, will match the value sent from `debugger.sendCommand`.

Emitted whenever the debugging target issues an instrumentation event.

### Métodos de Instância

#### `debugger.attach([protocolVersion])`

- `protocolVersion` string (optional) - Requested debugging protocol version.

Anexa o debugger à `webContents`.

#### `debugger.isAttached()`

Returns `boolean` - Whether a debugger is attached to the `webContents`.

#### `debugger.detach()`

Retira o debugger de `webContents`.

#### `debugger.sendCommand(method[, commandParams, sessionId])`

- `method` string - Method name, should be one of the methods defined by the [remote debugging protocol](https://chromedevtools.github.io/devtools-protocol/).

- `commandParams` any (optional) - JSON object with request parameters.

- `sessionId` string (optional) - send command to the target with associated debugging session id. The initial value can be obtained by sending [Target.attachToTarget](https://chromedevtools.github.io/devtools-protocol/tot/Target/#method-attachToTarget) message.

Returns `Promise<any>` - A promise that resolves with the response defined by the 'returns' attribute of the command description in the remote debugging protocol or is rejected indicating the failure of the command.

Send given command to the debugging target.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/debugger.md)
