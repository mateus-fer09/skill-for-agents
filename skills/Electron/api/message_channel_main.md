---
title: "MessageChannelMain"
description: "MessageChannelMain is the main-process-side equivalent of the DOM [ MessageChannel ](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) object. Its singular function "
topics:
  - "Api"
keywords:
  - "MessageChannelMain"
  - "MessageChannel"
  - "MessagePortMain"
  - "channel.port1"
  - "channel.port2"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/message-channel-main"
---

# MessageChannelMain

`MessageChannelMain` is the main-process-side equivalent of the DOM [`MessageChannel`](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) object. Its singular function is to create a pair of connected [`MessagePortMain`](/pt/docs/latest/api/message-port-main) objects.

See the [Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API) documentation for more information on using channel messaging.

## Class: MessageChannelMain

> 

Channel interface for channel messaging in the main process.

Process: [Main](/pt/docs/latest/glossary#main-process)

Exemplo:

```javascript
// Main process  
const { BrowserWindow, MessageChannelMain } = require('electron')  
  
const w = new BrowserWindow()  
const { port1, port2 } = new MessageChannelMain()  
w.webContents.postMessage('port', null, [port2])  
port1.postMessage({ some: 'message' })  
  
// Renderer process  
const { ipcRenderer } = require('electron')  
  
ipcRenderer.on('port', (e) => {  
  // e.ports is a list of ports sent along with this message  
  e.ports[0].onmessage = (messageEvent) => {  
    console.log(messageEvent.data)  
  }  
})  

```

> 

[!WARNING] Electron's built-in classes cannot be subclassed in user code. For more information, see [the FAQ](/pt/docs/latest/faq#class-inheritance-does-not-work-with-electron-built-in-modules).

### Propriedades da Instância

#### `channel.port1`

A [`MessagePortMain`](/pt/docs/latest/api/message-port-main) property.

#### `channel.port2`

A [`MessagePortMain`](/pt/docs/latest/api/message-port-main) property.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/message-channel-main.md)
