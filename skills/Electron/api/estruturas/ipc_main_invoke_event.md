---
title: "Objeto IpcMainInvokeEvent herda de"
description: "- type String - Possible values include frame"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto IpcMainInvokeEvent herda de"
  - "Event"
  - "type"
  - "frame"
  - "processId"
  - "frameId"
  - "sender"
  - "webContents"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/ipc-main-invoke-event"
---

# Objeto IpcMainInvokeEvent herda de `Event`

- `type` String - Possible values include `frame`

- `processId` Integer - O ID interno do processo de renderização que enviou esta mensagem

- `frameId` Integer - O ID do quadro do renderizador que enviou esta mensagem

- `sender` [WebContents](/pt/docs/latest/api/web-contents) - Returns the `webContents` that sent the message

- `senderFrame` [WebFrameMain](/pt/docs/latest/api/web-frame-main) | null *Readonly* - The frame that sent this message. May be `null` if accessed after the frame has either navigated or been destroyed.
