---
title: "MessagePortMain"
description: "MessagePortMain is the main-process-side equivalent of the DOM [ MessagePort ](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort) object. It behaves similarly to the DOM"
topics:
  - "Api"
keywords:
  - "MessagePortMain"
  - "MessagePort"
  - "EventEmitter"
  - "EventTarget"
  - "message"
  - "transfer"
  - "messageEvent"
  - "data"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/message-port-main"
---

# MessagePortMain

`MessagePortMain` is the main-process-side equivalent of the DOM [`MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort) object. It behaves similarly to the DOM version, with the exception that it uses the Node.js `EventEmitter` event system, instead of the DOM `EventTarget` system. This means you should use `port.on('message', ...)` to listen for events, instead of `port.onmessage = ...` or `port.addEventListener('message', ...)`

See the [Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API) documentation for more information on using channel messaging.

`MessagePortMain` é um [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

## Class: MessagePortMain

> 

Port interface for channel messaging in the main process.

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### Métodos de Instância

#### `port.postMessage(message, [transfer])`

- `message` any

- `transfer` MessagePortMain[] (optional)

Sends a message from the port, and optionally, transfers ownership of objects to other browsing contexts.

#### `port.start()`

Starts the sending of messages queued on the port. Messages will be queued until this method is called.

#### `port.close()`

Disconnects the port, so it is no longer active.

### Eventos de instância

#### Event: 'message'

Retorna:

- `messageEvent` Object

  - `data` any

  - `ports` MessagePortMain[]

Emitted when a MessagePortMain object receives a message.

#### Evento: 'close'

Emitted when the remote end of a MessagePortMain object becomes disconnected.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/message-port-main.md)
