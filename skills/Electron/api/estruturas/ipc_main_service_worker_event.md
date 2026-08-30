---
title: "IpcMainServiceWorkerEvent Object extends"
description: "- type String - Possible values include service-worker ."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "IpcMainServiceWorkerEvent Object extends"
  - "Event"
  - "type"
  - "serviceWorker"
  - "versionId"
  - "session"
  - "Session"
  - "returnValue"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/ipc-main-service-worker-event"
---

# IpcMainServiceWorkerEvent Object extends `Event`

- `type` String - Possible values include `service-worker`.

- `serviceWorker` [ServiceWorkerMain](/pt/docs/latest/api/service-worker-main) *Readonly* - The service worker that sent this message

- `versionId` Number - The service worker version ID.

- `session` Session - The [`Session`](/pt/docs/latest/api/session) instance with which the event is associated.

- `returnValue` any - Set this to the value to be returned in a synchronous message

- `ports` [MessagePortMain](/pt/docs/latest/api/message-port-main)[] - A list of MessagePorts that were transferred with this message

- `reply` Function - A function that will send an IPC message to the renderer frame that sent the original message that you are currently handling.  Você deve usar este método para "responder" à mensagem enviada a fim de garantir que a resposta irá para o processo e o quadro corretos.

  - `channel` string

  - `...args` any[]
