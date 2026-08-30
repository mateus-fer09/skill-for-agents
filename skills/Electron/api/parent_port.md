---
title: "parentPort"
description: "Documentação técnica e referência da API de parentPort no Electron."
topics:
  - "Api"
keywords:
  - "parentPort"
  - "messageEvent"
  - "data"
  - "ports"
  - "message"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/parent-port"
---

# parentPort

> 

Interface for communication with parent process.

Process: [Utility](/pt/docs/latest/glossary#utility-process)

`parentPort` é um [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter). *This object is not exported from the `'electron'` module. It is only available as a property of the process object in the Electron API.*

```javascript
// Main process  
const child = utilityProcess.fork(path.join(__dirname, 'test.js'))  
child.postMessage({ message: 'hello' })  
child.on('message', (data) => {  
  console.log(data) // hello world!  
})  
  
// Child process  
process.parentPort.on('message', (e) => {  
  process.parentPort.postMessage(`${e.data} world!`)  
})  

```

## Eventos

O objeto `parentPort` emite os seguintes eventos:

### Event: 'message'

Retorna:

- `messageEvent` Object

  - `data` any

  - `ports` MessagePortMain[]

Emitted when the process receives a message. Messages received on this port will be queued up until a handler is registered for this event.

## Métodos

### `parentPort.postMessage(message)`

- `message` any

Sends a message from the process to its parent.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/parent-port.md)
