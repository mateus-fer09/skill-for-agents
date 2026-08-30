---
title: "Class: ServiceWorkerMain"
description: "## Class: ServiceWorkerMain"
topics:
  - "Api"
keywords:
  - "Class: ServiceWorkerMain"
  - "boolean"
  - "channel"
  - "postMessage"
  - "ipcRenderer"
  - "Object"
  - "serviceWorker.ipc"
  - "IpcMainServiceWorker"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/service-worker-main"
---

# Class: ServiceWorkerMain

## Class: ServiceWorkerMain

> 

An instance of a Service Worker representing a version of a script for a given scope.

Process: [Main](/pt/docs/latest/glossary#main-process)  

*This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### Métodos de Instância

#### `serviceWorker.isDestroyed()` *Experimental*

Returns `boolean` - Whether the service worker has been destroyed.

#### `serviceWorker.send(channel, ...args)` *Experimental*

- `channel` string

- `...args` any[]

Send an asynchronous message to the service worker process via `channel`, along with
arguments. Arguments will be serialized with the [Structured Clone Algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm),
just like [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage), so prototype chains will not be included.
Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an exception.

The service worker process can handle the message by listening to `channel` with the
[`ipcRenderer`](/pt/docs/latest/api/ipc-renderer) module.

#### `serviceWorker.startTask()` *Experimental*

Returns `Object`:

- `end` Function - Method to call when the task has ended. If never called, the service won't terminate while otherwise idle.

Initiate a task to keep the service worker alive until ended.

### Propriedades da Instância

#### `serviceWorker.ipc` *Readonly* *Experimental*

An [`IpcMainServiceWorker`](/pt/docs/latest/api/ipc-main-service-worker) instance scoped to the service worker.

#### `serviceWorker.scope` *Readonly* *Experimental*

A `string` representing the scope URL of the service worker.

#### `serviceWorker.scriptURL` *Readonly* *Experimental*

A `string` representing the script URL of the service worker.

#### `serviceWorker.versionId` *Readonly* *Experimental*

A `number` representing the ID of the specific version of the service worker script in its scope.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/service-worker-main.md)
