---
title: "Objeto IpcMainEvent herda de"
description: "- type String - Possible values include frame"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto IpcMainEvent herda de"
  - "Event"
  - "type"
  - "frame"
  - "processId"
  - "frameId"
  - "returnValue"
  - "sender"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/ipc-main-event"
---

# Objeto IpcMainEvent herda de `Event`

- `type` String - Possible values include `frame`

- `processId` Integer - O ID interno do processo de renderização que enviou esta mensagem

- `frameId` Integer - O ID do quadro do renderizador que enviou esta mensagem

- `returnValue` any - Defina isso como o valor a ser retornado em uma mensagem síncrona

- `sender` [WebContents](/pt/docs/latest/api/web-contents) - Returns the `webContents` that sent the message

- `senderFrame` [WebFrameMain](/pt/docs/latest/api/web-frame-main) | null *Readonly* - The frame that sent this message. May be `null` if accessed after the frame has either navigated or been destroyed.

- `ports` [MessagePortMain](/pt/docs/latest/api/message-port-main)[] - A list of MessagePorts that were transferred with this message

- `reply` Função - Uma função que enviará uma mensagem IPC para o quadro renderizador que enviou a mensagem original que você está usando atualmente.  Você deve usar este método para "responder" à mensagem enviada a fim de garantir que a resposta irá para o processo e o quadro corretos.

  - `channel` string

  - `...args` any[]
