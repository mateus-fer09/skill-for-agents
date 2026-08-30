---
title: "ipcMain"
description: "Documentação técnica e referência da API de ipcMain no Electron."
topics:
  - "Api"
keywords:
  - "ipcMain"
  - "channel"
  - "event.returnValue"
  - "listener"
  - "event"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/ipc-main"
---

# ipcMain

> 

Comunica de forma assíncrona o processo principal aos processos de renderização.

Process: [Main](/pt/docs/latest/glossary#main-process)

O módulo `ipcMain` é um [emissor de eventos](https://nodejs.org/api/events.html#events_class_eventemitter). Quando usado no processo principal, ele lida com mensagens assíncronas e síncronas enviadas a partir de um processo de renderização (página da web). As mensagens enviadas de um renderizador serão emitidas para este módulo.

For usage examples, check out the [IPC tutorial](/pt/docs/latest/tutorial/ipc).

## Sending messages

It is also possible to send messages from the main process to the renderer process, see [webContents.send](/pt/docs/latest/api/web-contents#contentssendchannel-args) for more information.

- Ao enviar uma mensagem, o nome do evento é o `channel`.

- Para responder a uma mensagem síncrona, você precisa de configurar `event.returnValue`.

- Para enviar uma mensagem assíncrona de volta para o remetente, você pode usar `event.reply(...)`.  This helper method will automatically handle messages coming from frames that aren't the main frame (e.g. iframes) whereas `event.sender.send(...)` will always send to the main frame.

## Métodos

The `ipcMain` module has the following methods to listen for events:

### `ipcMain.on(channel, listener)`

- `channel` string

- `listener` Função

  - `event` [IpcMainEvent](/pt/docs/latest/api/structures/ipc-main-event)

  - `...args` any[]

Ouve o `channel`, quando uma mensagem chega, o `listener` deve ser chamado com `listener(event, args...)`.

### `ipcMain.off(channel, listener)`

History

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/ipc-main-event)
  - ``

````

### ``

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/ipc-main-event)
  - ``

``````

### ``

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/ipc-main-event)
  - ``

[``](#ipcmainonchannel-listener)

### ``

- ``
- ``

  - ``

[``](#ipcmainoffchannel-listener)

### ``

- ``
``

### ``

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/ipc-main-invoke-event)
  - ``

``````

```javascript
  
  
  
  

```

```javascript
  
  
  
  

```
``````[](https://github.com/electron/electron/issues/24427)

### ``

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/ipc-main-invoke-event)
  - ``

````

### ``

- ``
``[](https://github.com/electron/electron/edit/main/docs/api/ipc-main.md)[](/pt/docs/latest/api/in-app-purchase)[](/pt/docs/latest/api/menu)

- 
- 

  - [``](#ipcmainonchannel-listener)
  - [``](#ipcmainoffchannel-listener)
  - [``](#ipcmainoncechannel-listener)
  - [``](#ipcmainaddlistenerchannel-listener)
  - [``](#ipcmainremovelistenerchannel-listener)
  - [``](#ipcmainremovealllistenerschannel)
  - [``](#ipcmainhandlechannel-listener)
  - [``](#ipcmainhandleoncechannel-listener)
  - [``](#ipcmainremovehandlerchannel)

- [](/pt/docs/latest/)
- [](/pt/docs/latest/api/app)

- [](/pt/docs/latest/tutorial/performance)
- [](/pt/docs/latest/tutorial/security)

- [](https://electronforge.io)
- [](/pt/fiddle)

- [](/pt/governance)
- [](/pt/community)
- [](https://discordapp.com/invite/APGC3k5yaH)
- [](https://bsky.app/profile/electronjs.org)
- [](https://x.com/electronjs)
- [](https://social.lfx.dev/@electronjs)
- [](https://stackoverflow.com/questions/tagged/electron)

- [](https://github.com/electron/electron)
- [](https://opencollective.com/electron)
- [](https://p.datadoghq.com/sb/c44e1df0-85d7-11ee-94c9-da7ad0900002-c245f7ef47d0d0c32abecdc0938c2a85)
[](https://openjsf.org/)[](https://openjsf.org)[](https://openjsf.org)[](https://openjsf.org)[](https://trademark-policy.openjsf.org)[](https://trademark-list.openjsf.org)[](https://trademark-list.openjsf.org)[](https://openjsf.org)[](https://terms-of-use.openjsf.org)[](https://privacy-policy.openjsf.org)[](https://bylaws.openjsf.org)[](https://code-of-conduct.openjsf.org)[](https://trademark-policy.openjsf.org)[](https://trademark-list.openjsf.org)[](https://www.linuxfoundation.org/cookies)
