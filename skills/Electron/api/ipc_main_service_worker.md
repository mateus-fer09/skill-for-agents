---
title: "Class: IpcMainServiceWorker"
description: "## Class: IpcMainServiceWorker"
topics:
  - "Api"
keywords:
  - "Class: IpcMainServiceWorker"
  - "IpcMain"
  - "channel"
  - "listener"
  - "event"
  - "invoke"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/ipc-main-service-worker"
---

# Class: IpcMainServiceWorker

## Class: IpcMainServiceWorker

> 

Communicate asynchronously from the main process to service workers.

Process: [Main](/pt/docs/latest/glossary#main-process)

> [!NOTE]
> 

> note

> 

This API is a subtle variation of [`IpcMain`](/pt/docs/latest/api/ipc-main)—targeted for
communicating with service workers. For communicating with web frames,
consult the `IpcMain` documentation.

> [!WARNING]
> 

> aviso

> 

Electron's built-in classes cannot be subclassed in user code.
For more information, see [the FAQ](/pt/docs/latest/faq#class-inheritance-does-not-work-with-electron-built-in-modules).

### Métodos de Instância

#### `ipcMainServiceWorker.on(channel, listener)`

- `channel` string

- `listener` Function

  - `event` [IpcMainServiceWorkerEvent](/pt/docs/latest/api/structures/ipc-main-service-worker-event)

  - `...args` any[]

Listens to `channel`, when a new message arrives `listener` would be called with
`listener(event, args...)`.

#### `ipcMainServiceWorker.once(channel, listener)`

- `channel` string

- `listener` Function

  - `event` [IpcMainServiceWorkerEvent](/pt/docs/latest/api/structures/ipc-main-service-worker-event)

  - `...args` any[]

Adds a one time `listener` function for the event. This `listener` is invoked
only the next time a message is sent to `channel`, after which it is removed.

#### `ipcMainServiceWorker.removeListener(channel, listener)`

- `channel` string

- `listener` Function

  - `...args` any[]

Removes the specified `listener` from the listener array for the specified
`channel`.

#### `ipcMainServiceWorker.removeAllListeners([channel])`

- `channel` string (optional)

Removes listeners of the specified `channel`.

#### `ipcMainServiceWorker.handle(channel, listener)`

- `channel` string

- `listener` Function<Promise<any> | any>

  - `event` [IpcMainServiceWorkerInvokeEvent](/pt/docs/latest/api/structures/ipc-main-service-worker-invoke-event)

  - `...args` any[]

#### `ipcMainServiceWorker.handleOnce(channel, listener)`

- `channel` string

- `listener` Function<Promise<any> | any>

  - `event` [IpcMainServiceWorkerInvokeEvent](/pt/docs/latest/api/structures/ipc-main-service-worker-invoke-event)

  - `...args` any[]

Handles a single `invoke`able IPC message, then removes the listener. See
`ipcMainServiceWorker.handle(channel, listener)`.

#### `ipcMainServiceWorker.removeHandler(channel)`

- `channel` string

Removes any handler for `channel`, if present.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/ipc-main-service-worker.md)
