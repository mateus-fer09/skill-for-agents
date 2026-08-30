---
title: "IpcMainServiceWorkerInvokeEvent Object extends"
description: "- type String - Possible values include service-worker ."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "IpcMainServiceWorkerInvokeEvent Object extends"
  - "Event"
  - "type"
  - "serviceWorker"
  - "versionId"
  - "session"
  - "Session"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/ipc-main-service-worker-invoke-event"
---

# IpcMainServiceWorkerInvokeEvent Object extends `Event`

- `type` String - Possible values include `service-worker`.

- `serviceWorker` [ServiceWorkerMain](/pt/docs/latest/api/service-worker-main) *Readonly* - The service worker that sent this message

- `versionId` Number - The service worker version ID.

- `session` Session - The [`Session`](/pt/docs/latest/api/session) instance with which the event is associated.
