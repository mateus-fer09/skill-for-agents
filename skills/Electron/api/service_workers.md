---
title: "Class: ServiceWorkers"
description: "## Class: ServiceWorkers"
topics:
  - "Api"
keywords:
  - "Class: ServiceWorkers"
  - "ServiceWorkers"
  - "serviceWorkers"
  - "event"
  - "messageDetails"
  - "message"
  - "versionId"
  - "source"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/service-workers"
---

# Class: ServiceWorkers

## Class: ServiceWorkers

> 

Query and receive events from a sessions active service workers.

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

Instâncias da classe `ServiceWorkers` são acessadas através da propriedade `serviceWorkers` de uma `Sessão`.

Como por exemplo:

```javascript
const { session } = require('electron')  
  
// Get all service workers.  
console.log(session.defaultSession.serviceWorkers.getAllRunning())  
  
// Handle logs and get service worker info  
session.defaultSession.serviceWorkers.on('console-message', (event, messageDetails) => {  
  console.log(  
    'Got service worker message',  
    messageDetails,  
    'from',  
    session.defaultSession.serviceWorkers.getFromVersionID(messageDetails.versionId)  
  )  
})  

```

### Eventos de instância

Os seguintes eventos estão disponíveis em instâncias de `ServiceWorkers`:

#### Event: 'console-message'

Retorna:

- `event` Event

- `messageDetails` Object - Information about the console message

  - `message` string - The actual console message

  - `versionId` number - The version ID of the service worker that sent the log message

  - `source` string - The type of source for this message.  Can be `javascript`, `xml`, `network`, `console-api`, `storage`, `rendering`, `security`, `deprecation`, `worker`, `violation`, `intervention`, `recommendation` or `other`.

  - `level` number - The log level, from 0 to 3. In order it matches `verbose`, `info`, `warning` and `error`.

  - `sourceUrl` string - The URL the message came from

  - `lineNumber` number - The line number of the source that triggered this console message

Emitted when a service worker logs something to the console.

#### Event: 'registration-completed'

Retorna:

- `event` Event

- `details` Object - Information about the registered service worker

  - `scope` string - The base URL that a service worker is registered for

Emitted when a service worker has been registered. Can occur after a call to [`navigator.serviceWorker.register('/sw.js')`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register) successfully resolves or when a Chrome extension is loaded.

#### Event: 'running-status-changed' *Experimental*

Retorna:

- `details` Evento<>

  - `versionId` number - ID of the updated service worker version

  - `runningStatus` string - Running status. Possible values include `starting`, `running`, `stopping`, or `stopped`.

Emitted when a service worker's running status has changed.

### Métodos de Instância

The following methods are available on instances of `ServiceWorkers`:

#### `serviceWorkers.getAllRunning()`

Returns `Record<number, ServiceWorkerInfo>` - A [ServiceWorkerInfo](/pt/docs/latest/api/structures/service-worker-info) object where the keys are the service worker version ID and the values are the information about that service worker.

#### `serviceWorkers.getInfoFromVersionID(versionId)`

- `versionId` number - ID of the service worker version

Returns [ServiceWorkerInfo](/pt/docs/latest/api/structures/service-worker-info) - Information about this service worker

If the service worker does not exist or is not running this method will throw an exception.

#### `serviceWorkers.getFromVersionID(versionId)` *Descontinuado*

- `versionId` number - ID of the service worker version

Returns [ServiceWorkerInfo](/pt/docs/latest/api/structures/service-worker-info) - Information about this service worker

If the service worker does not exist or is not running this method will throw an exception.

**Deprecated:** Use the new `serviceWorkers.getInfoFromVersionID` API.

#### `serviceWorkers.getWorkerFromVersionID(versionId)` *Experimental*

- `versionId` number - ID of the service worker version

Returns [`ServiceWorkerMain | undefined`](/pt/docs/latest/api/service-worker-main) - Instance of the service worker associated with the given version ID. If there's no associated version, or its running status has changed to 'stopped', this will return `undefined`.

#### `serviceWorkers.startWorkerForScope(scope)` *Experimental*

- `scope` string - The scope of the service worker to start.

Returns `Promise<ServiceWorkerMain>` - Resolves with the service worker when it's started.

Starts the service worker or does nothing if already running.

```javascript
const { app, session } = require('electron')  
  
const { serviceWorkers } = session.defaultSession  
  
// Collect service workers scopes  
const workerScopes = Object.values(serviceWorkers.getAllRunning()).map((info) => info.scope)  
  
app.on('browser-window-created', async (event, window) => {  
  for (const scope of workerScopes) {  
    try {  
      // Ensure worker is started  
      const serviceWorker = await serviceWorkers.startWorkerForScope(scope)  
      serviceWorker.send('window-created', { windowId: window.id })  
    } catch (error) {  
      console.error(`Failed to start service worker for ${scope}`)  
      console.error(error)  
    }  
  }  
})  

```
