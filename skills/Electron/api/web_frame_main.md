---
title: "webFrameMain"
description: "Documentação técnica e referência da API de webFrameMain no Electron."
topics:
  - "Api"
keywords:
  - "webFrameMain"
  - "WebContents"
  - "mainFrame"
  - "processId"
  - "Integer"
  - "routingId"
  - "WebFrameMain"
  - "frame.routingId"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/web-frame-main"
---

# webFrameMain

> 

Control web pages and iframes.

Process: [Main](/pt/docs/latest/glossary#main-process)

The `webFrameMain` module can be used to lookup frames across existing [`WebContents`](/pt/docs/latest/api/web-contents) instances. Navigation events are the common use case.

```javascript
const { BrowserWindow, webFrameMain } = require('electron')  
  
const win = new BrowserWindow({ width: 800, height: 1500 })  
win.loadURL('https://twitter.com')  
  
win.webContents.on(  
  'did-frame-navigate',  
  (event, url, httpResponseCode, httpStatusText, isMainFrame, frameProcessId, frameRoutingId) => {  
    const frame = webFrameMain.fromId(frameProcessId, frameRoutingId)  
    if (frame) {  
      const code = 'document.body.innerHTML = document.body.innerHTML.replaceAll("heck", "h*ck")'  
      frame.executeJavaScript(code)  
    }  
  }  
)  

```

You can also access frames of existing pages by using the `mainFrame` property of [`WebContents`](/pt/docs/latest/api/web-contents).

```javascript
const { BrowserWindow } = require('electron')  
  
async function main () {  
  const win = new BrowserWindow({ width: 800, height: 600 })  
  await win.loadURL('https://reddit.com')  
  
  const youtubeEmbeds = win.webContents.mainFrame.frames.filter((frame) => {  
    try {  
      const url = new URL(frame.url)  
      return url.host === 'www.youtube.com'  
    } catch {  
      return false  
    }  
  })  
  
  console.log(youtubeEmbeds)  
}  
  
main()  

```

## Métodos

These methods can be accessed from the `webFrameMain` module:

### `webFrameMain.fromId(processId, routingId)`

- `processId` Integer - An `Integer` representing the internal ID of the process which owns the frame.

- `routingId` Integer - An `Integer` representing the unique frame ID in the current renderer process. Routing IDs can be retrieved from `WebFrameMain` instances (`frame.routingId`) and are also passed by frame specific `WebContents` navigation events (e.g. `did-frame-navigate`).

Returns `WebFrameMain | undefined` - A frame with the given process and routing IDs, or `undefined` if there is no WebFrameMain associated with the given IDs.

### `webFrameMain.fromFrameToken(processId, frameToken)`

- `processId` Integer - An `Integer` representing the internal ID of the process which owns the frame.

- `frameToken` string - A `string` token identifying the unique frame. Can also be retrieved in the renderer process via [`webFrame.frameToken`](/pt/docs/latest/api/web-frame#webframeframetoken-readonly).

Returns `WebFrameMain | null` - A frame with the given process and frame token, or `null` if there is no WebFrameMain associated with the given IDs.

## Class: WebFrameMain

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### Eventos de instância

#### Event: 'dom-ready'

Emitted when the document is loaded.

### Métodos de Instância

#### `frame.executeJavaScript(code[, userGesture])`

- `code` string

- `userGesture` boolean (optional) - Default is `false`.

Returns `Promise<unknown>` - A promise that resolves with the result of the executed code or is rejected if execution throws or results in a rejected promise.

Evaluates `code` in page.

In the browser window some HTML APIs like `requestFullScreen` can only be invoked by a gesture from the user. Setting `userGesture` to `true` will remove this limitation.

#### `frame.reload()`

Returns `boolean` - Whether the reload was initiated successfully. Only results in `false` when the frame has no history.

#### `frame.isDestroyed()`

Returns `boolean` - Whether the frame is destroyed.

#### `frame.send(channel, ...args)`

- `channel` string

- `...args` any[]

Send an asynchronous message to the renderer process via `channel`, along with arguments. Arguments will be serialized with the [Structured Clone Algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), just like [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage), so prototype chains will not be included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an exception.

The renderer process can handle the message by listening to `channel` with the [`ipcRenderer`](/pt/docs/latest/api/ipc-renderer) module.

#### `frame.postMessage(channel, message, [transfer])`

- `channel` string

- `message` any

- `transfer` MessagePortMain[] (optional)

Send a message to the renderer process, optionally transferring ownership of zero or more [`MessagePortMain`](/pt/docs/latest/api/message-port-main) objects.

The transferred `MessagePortMain` objects will be available in the renderer process by accessing the `ports` property of the emitted event. When they arrive in the renderer, they will be native DOM `MessagePort` objects.

Como por exemplo:

```javascript
// Main process  
const win = new BrowserWindow()  
const { port1, port2 } = new MessageChannelMain()  
win.webContents.mainFrame.postMessage('port', { message: 'hello' }, [port1])  
  
// Renderer process  
ipcRenderer.on('port', (e, msg) => {  
  const [port] = e.ports  
  // ...  
})  

```

#### `frame.collectJavaScriptCallStack()` *Experimental*

Returns `Promise<string> | Promise<void>` - A promise that resolves with the currently running JavaScript call stack. If no JavaScript runs in the frame, the promise will never resolve. In cases where the call stack is otherwise unable to be collected, it will return `undefined`.

This can be useful to determine why the frame is unresponsive in cases where there's long-running JavaScript. For more information, see the [proposed Crash Reporting API.](https://wicg.github.io/crash-reporting/)

```javascript
const { app } = require('electron')  
  
app.commandLine.appendSwitch('enable-features', 'DocumentPolicyIncludeJSCallStacksInCrashReports')  
  
app.on('web-contents-created', (_, webContents) => {  
  webContents.on('unresponsive', async () => {  
    // Interrupt execution and collect call stack from unresponsive renderer  
    const callStack = await webContents.mainFrame.collectJavaScriptCallStack()  
    console.log('Renderer unresponsive\n', callStack)  
  })  
})  

```

#### `frame.copyVideoFrameAt(x, y)`

- `x` Integer

- `y` Integer

When executed on a video media element, copies the frame at (x, y) to the clipboard.

#### `frame.saveVideoFrameAs(x, y)`

- `x` Integer

- `y` Integer

When executed on a video media element, shows a save dialog and saves the frame at (x, y) to disk.

#### `frame.printToPDF(options)`

History

- ``[](/pt/docs/latest/api/structures/print-to-pdf-options)

  - ``````
  - ``
  - ``
  - ``
  - ``````````````````````````````
  - ``[](/pt/docs/latest/api/structures/print-to-pdf-margins)

    - ``
    - ``
    - ``
    - ``

  - ``
  - ``````````````
  - ````
  - ``
  - ``**
  - ``**

``[``](/pt/docs/latest/api/web-contents#contentsprinttopdfoptions)``````

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```
[](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-printToPDF)

### 

#### ``**
[``](/pt/docs/latest/api/ipc-main)``````

1. ``
2. ``
3. ``
4. ``
``

1. ``
2. ``
3. ``
``[``](/pt/docs/latest/api/web-contents#contentsipc-readonly)``

#### ``**
``

#### ``**
``[](https://www.rfc-editor.org/rfc/rfc6454)````````

#### ``**
````

#### ``**
````````

#### ``**
````

#### ``**
````

#### ``**
``

#### ``**
``

#### ``**
``[``](/pt/docs/latest/api/web-frame#webframeframetoken-readonly)

#### ``**
````

#### ``**
``````

#### ``**
``````

#### ``**
``[](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)[](/pt/docs/latest/api/browser-window#page-visibility)

#### ``**
``[](https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event)[](https://github.com/electron/electron/edit/main/docs/api/web-frame-main.md)[](/pt/docs/latest/api/web-contents-view)[](/pt/docs/latest/api/exibir)

- 

  - [``](#webframemainfromidprocessid-routingid)
  - [``](#webframemainfromframetokenprocessid-frametoken)

- 

  - 

    - [``](#event-dom-ready)

  - 

    - [``](#frameexecutejavascriptcode-usergesture)
    - [``](#framereload)
    - [``](#frameisdestroyed)
    - [``](#framesendchannel-args)
    - [``](#framepostmessagechannel-message-transfer)
    - [``](#framecollectjavascriptcallstack-experimental)
    - [``](#framecopyvideoframeatx-y)
    - [``](#framesavevideoframeasx-y)
    - [``](#frameprinttopdfoptions)

  - 

    - [``](#frameipc-readonly)
    - [``](#frameurl-readonly)
    - [``](#frameorigin-readonly)
    - [``](#frametop-readonly)
    - [``](#frameparent-readonly)
    - [``](#frameframes-readonly)
    - [``](#frameframesinsubtree-readonly)
    - [``](#frameframetreenodeid-readonly)
    - [``](#framename-readonly)
    - [``](#frameframetoken-readonly)
    - [``](#frameosprocessid-readonly)
    - [``](#frameprocessid-readonly)
    - [``](#frameroutingid-readonly)
    - [``](#framevisibilitystate-readonly)
    - [``](#framedetached-readonly)

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
