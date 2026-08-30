---
title: "webContents"
description: "Documentação técnica e referência da API de webContents no Electron."
topics:
  - "Api"
keywords:
  - "webContents"
  - "BrowserWindow"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/web-contents"
---

# webContents

> 

Render and control web pages.

Process: [Main](/pt/docs/latest/glossary#main-process)

`webContents` é um [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter). It is responsible for rendering and controlling a web page and is a property of the [`BrowserWindow`](/pt/docs/latest/api/browser-window) object. An example of accessing the `webContents` object:

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({ width: 800, height: 1500 })  
win.loadURL('https://github.com')  
  
const contents = win.webContents  
console.log(contents)  

```

## Navigation Events

Several events can be used to monitor navigations as they occur within a `webContents`.

### Document Navigations

When a `webContents` navigates to another page (as opposed to an [in-page navigation](/pt/docs/latest/api/web-contents#in-page-navigation)), the following events will be fired.

- [`did-start-navigation`](/pt/docs/latest/api/web-contents#event-did-start-navigation)

- [`will-frame-navigate`](/pt/docs/latest/api/web-contents#event-will-frame-navigate)

- [`will-navigate`](/pt/docs/latest/api/web-contents#event-will-navigate) (only fired when main frame navigates)

- [`will-redirect`](/pt/docs/latest/api/web-contents#event-will-redirect) (only fired when a redirect happens during navigation)

- [`did-redirect-navigation`](/pt/docs/latest/api/web-contents#event-did-redirect-navigation) (only fired when a redirect happens during navigation)

- [`did-frame-navigate`](/pt/docs/latest/api/web-contents#event-did-frame-navigate)

- [`did-navigate`](/pt/docs/latest/api/web-contents#event-did-navigate) (only fired when main frame navigates)

Subsequent events will not fire if `event.preventDefault()` is called on any of the cancellable events.

### In-page Navigation

In-page navigations don't cause the page to reload, but instead navigate to a location within the current page. These events are not cancellable. For an in-page navigations, the following events will fire in this order:

- [`did-start-navigation`](/pt/docs/latest/api/web-contents#event-did-start-navigation)

- [`did-navigate-in-page`](/pt/docs/latest/api/web-contents#event-did-navigate-in-page)

### Frame Navigation

The [`will-navigate`](/pt/docs/latest/api/web-contents#event-will-navigate) and [`did-navigate`](/pt/docs/latest/api/web-contents#event-did-navigate) events only fire when the [mainFrame](/pt/docs/latest/api/web-contents#contentsmainframe-readonly) navigates. If you want to also observe navigations in `<iframe>`s, use [`will-frame-navigate`](/pt/docs/latest/api/web-contents#event-will-frame-navigate) and [`did-frame-navigate`](/pt/docs/latest/api/web-contents#event-did-frame-navigate) events.

## Métodos

These methods can be accessed from the `webContents` module:

```javascript
const { webContents } = require('electron')  
  
console.log(webContents)  

```

### `webContents.getAllWebContents()`

Returns `WebContents[]` - An array of all `WebContents` instances. This will contain web contents for all windows, webviews, opened DevTools, and DevTools extension background pages.

### `webContents.getFocusedWebContents()`

Returns `WebContents | null` - The web contents that is focused in this application, otherwise returns `null`.

### `webContents.fromId(id)`

- `id` Inteiro

Returns `WebContents | undefined` - A WebContents instance with the given ID, or `undefined` if there is no WebContents associated with the given ID.

### `webContents.fromFrame(frame)`

- `frame` WebFrameMain

Returns `WebContents | undefined` - A WebContents instance with the given WebFrameMain, or `undefined` if there is no WebContents associated with the given WebFrameMain.

### `webContents.fromDevToolsTargetId(targetId)`

- `targetId` string - The Chrome DevTools Protocol [TargetID](https://chromedevtools.github.io/devtools-protocol/tot/Target/#type-TargetID) associated with the WebContents instance.

Returns `WebContents | undefined` - A WebContents instance with the given TargetID, or `undefined` if there is no WebContents associated with the given TargetID.

When communicating with the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/), it can be useful to lookup a WebContents instance based on its assigned TargetID.

```javascript
async function lookupTargetId (browserWindow) {  
  const wc = browserWindow.webContents  
  await wc.debugger.attach('1.3')  
  const { targetInfo } = await wc.debugger.sendCommand('Target.getTargetInfo')  
  const { targetId } = targetInfo  
  const targetWebContents = await wc.fromDevToolsTargetId(targetId)  
}  

```

## Class: WebContents

> 

Render and control the contents of a BrowserWindow instance.

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### Eventos de instância

#### Event: 'did-finish-load'

Emitted when the navigation is done, i.e. the spinner of the tab has stopped spinning, and the `onload` event was dispatched.

#### Event: 'did-fail-load'

Retorna:

- `event` Event

- `errorCode` Integer

- `errorDescription` string

- `validatedURL` string

- `isMainFrame` boolean

- `frameProcessId` Integer

- `frameRoutingId` Integer

This event is like `did-finish-load` but emitted when the load failed. The full list of error codes and their meaning is available [here](https://source.chromium.org/chromium/chromium/src/+/main:net/base/net_error_list.h).

#### Event: 'did-fail-provisional-load'

Retorna:

- `event` Event

- `errorCode` Integer

- `errorDescription` string

- `validatedURL` string

- `isMainFrame` boolean

- `frameProcessId` Integer

- `frameRoutingId` Integer

This event is like `did-fail-load` but emitted when the load was cancelled (e.g. `window.stop()` was invoked).

#### Event: 'did-frame-finish-load'

Retorna:

- `event` Event

- `isMainFrame` boolean

- `frameProcessId` Integer

- `frameRoutingId` Integer

Emitted when a frame has done navigation.

#### Event: 'did-start-loading'

Corresponds to the points in time when the spinner of the tab started spinning.

#### Event: 'did-stop-loading'

Corresponds to the points in time when the spinner of the tab stopped spinning.

#### Event: 'dom-ready'

Emitted when the document in the top-level frame is loaded.

#### Evento: 'page-title-updated'

Retorna:

- `event` Event

- `title` string

- `explicitSet` boolean

Fired when page title is set during navigation. `explicitSet` is false when title is synthesized from file url.

#### Evento: 'page-title-updated'

Retorna:

- `event` Event

- `favicons` string[] - Array de URLs.

Emitido quando a página recebe urls de favicon.

#### Event: 'content-bounds-updated'

Retorna:

- `event` Event

- `bounds` [Rectangle](/pt/docs/latest/api/structures/rectangle) - requested new content bounds

Emitted when the page calls `window.moveTo`, `window.resizeTo` or related APIs.

By default, this will move the window. To prevent that behavior, call `event.preventDefault()`.

#### Event: 'did-create-window'

Retorna:

- `window` BrowserWindow

- Objeto `details`

  - `url` string - URL for the created window.

  - `frameName` string - Name given to the created window in the `window.open()` call.

  - `options` [BrowserWindowConstructorOptions](/pt/docs/latest/api/structures/browser-window-options) - The options used to create the BrowserWindow. They are merged in increasing precedence: parsed options from the `features` string from `window.open()`, security-related webPreferences inherited from the parent, and options given by [`webContents.setWindowOpenHandler`](/pt/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler). Unrecognized options are not filtered out.

  - `referrer` [Referrer](/pt/docs/latest/api/structures/referrer) - The referrer that will be passed to the new window. May or may not result in the `Referer` header being sent, depending on the referrer policy.

  - `postBody` [PostBody](/pt/docs/latest/api/structures/post-body) (optional) - The post data that will be sent to the new window, along with the appropriate headers that will be set. If no post data is to be sent, the value will be `null`. Only defined when the window is being created by a form that set `target=_blank`.

  - `disposition` string - Can be `default`, `foreground-tab`, `background-tab`, `new-window` or `other`. Corresponds to the manner an associated link was clicked. See Chromium's [WindowOpenDisposition](https://source.chromium.org/chromium/chromium/src/+/main:ui/base/window_open_disposition.h).

    - `default` - Indicates Chromium deems in-window navigation valid for a window open call.

    - `foreground-tab` - Corresponds to a left click or shift + middle click.

    - `background-tab` - Corresponds to a middle click or ctrl/cmd + click.

    - `new-window` - Corresponds to a shift + left click.

    - `other` - A catch-all for the remaining Chromium dispositions not handled by Electron.

Emitted *after* successful creation of a window via `window.open` in the renderer. Not emitted if the creation of the window is canceled from [`webContents.setWindowOpenHandler`](/pt/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler).

See [`window.open()`](/pt/docs/latest/api/window-open) for more details and how to use this in conjunction with `webContents.setWindowOpenHandler`.

#### Evento: 'will-navigate'

Retorna:

- `details` Evento<>

  - `url` string - The URL the frame is navigating to.

  - `isSameDocument` boolean - This event does not fire for same document navigations using window.history api and reference fragment navigations. This property is always set to `false` for this event.

  - `isMainFrame` boolean - True if the navigation is taking place in a main frame.

  - `frame` WebFrameMain | null - The frame to be navigated. May be `null` if accessed after the frame has either navigated or been destroyed.

  - `initiator` WebFrameMain | null (optional) - The frame which initiated the navigation, which can be a parent frame (e.g. via `window.open` with a frame's name), or null if the navigation was not initiated by a frame. This can also be null if the initiating frame was deleted before the event was emitted.

- `url` string *Deprecated*

- `isInPlace` boolean *Deprecated*

- `isMainFrame` boolean *Deprecated*

- `frameProcessId` Integer *Deprecated*

- `frameRoutingId` Integer *Deprecated*

Emitted when a user or the page wants to start navigation on the main frame. It can happen when the `window.location` object is changed or a user clicks a link in the page.

This event will not emit when the navigation is started programmatically with APIs like `webContents.loadURL` and `webContents.back`.

It is also not emitted for in-page navigations, such as clicking anchor links or updating the `window.location.hash`. Use `did-navigate-in-page` event for this purpose.

Calling `event.preventDefault()` will prevent the navigation.

#### Event: 'will-frame-navigate'

Retorna:

- `details` Evento<>

  - `url` string - The URL the frame is navigating to.

  - `isSameDocument` boolean - This event does not fire for same document navigations using window.history api and reference fragment navigations. This property is always set to `false` for this event.

  - `isMainFrame` boolean - True if the navigation is taking place in a main frame.

  - `frame` WebFrameMain | null - The frame to be navigated. May be `null` if accessed after the frame has either navigated or been destroyed.

  - `initiator` WebFrameMain | null (optional) - The frame which initiated the navigation, which can be a parent frame (e.g. via `window.open` with a frame's name), or null if the navigation was not initiated by a frame. This can also be null if the initiating frame was deleted before the event was emitted.

Emitted when a user or the page wants to start navigation in any frame. It can happen when the `window.location` object is changed or a user clicks a link in the page.

Unlike `will-navigate`, `will-frame-navigate` is fired when the main frame or any of its subframes attempts to navigate. When the navigation event comes from the main frame, `isMainFrame` will be `true`.

This event will not emit when the navigation is started programmatically with APIs like `webContents.loadURL` and `webContents.back`.

It is also not emitted for in-page navigations, such as clicking anchor links or updating the `window.location.hash`. Use `did-navigate-in-page` event for this purpose.

Calling `event.preventDefault()` will prevent the navigation.

#### Event: 'did-start-navigation'

Retorna:

- `details` Evento<>

  - `url` string - The URL the frame is navigating to.

  - `isSameDocument` boolean - Whether the navigation happened without changing document. Examples of same document navigations are reference fragment navigations, pushState/replaceState, and same page history navigation.

  - `isMainFrame` boolean - True if the navigation is taking place in a main frame.

  - `frame` WebFrameMain | null - The frame to be navigated. May be `null` if accessed after the frame has either navigated or been destroyed.

  - `initiator` WebFrameMain | null (optional) - The frame which initiated the navigation, which can be a parent frame (e.g. via `window.open` with a frame's name), or null if the navigation was not initiated by a frame. This can also be null if the initiating frame was deleted before the event was emitted.

- `url` string *Deprecated*

- `isInPlace` boolean *Deprecated*

- `isMainFrame` boolean *Deprecated*

- `frameProcessId` Integer *Deprecated*

- `frameRoutingId` Integer *Deprecated*

Emitted when any frame (including main) starts navigating.

#### Event: 'will-redirect'

Retorna:

- `details` Evento<>

  - `url` string - The URL the frame is navigating to.

  - `isSameDocument` boolean - Whether the navigation happened without changing document. Examples of same document navigations are reference fragment navigations, pushState/replaceState, and same page history navigation.

  - `isMainFrame` boolean - True if the navigation is taking place in a main frame.

  - `frame` WebFrameMain | null - The frame to be navigated. May be `null` if accessed after the frame has either navigated or been destroyed.

  - `initiator` WebFrameMain | null (optional) - The frame which initiated the navigation, which can be a parent frame (e.g. via `window.open` with a frame's name), or null if the navigation was not initiated by a frame. This can also be null if the initiating frame was deleted before the event was emitted.

- `url` string *Deprecated*

- `isInPlace` boolean *Deprecated*

- `isMainFrame` boolean *Deprecated*

- `frameProcessId` Integer *Deprecated*

- `frameRoutingId` Integer *Deprecated*

Emitted when a server side redirect occurs during navigation.  For example a 302 redirect.

This event will be emitted after `did-start-navigation` and always before the `did-redirect-navigation` event for the same navigation.

Calling `event.preventDefault()` will prevent the navigation (not just the redirect).

#### Event: 'did-redirect-navigation'

Retorna:

- `details` Evento<>

  - `url` string - The URL the frame is navigating to.

  - `isSameDocument` boolean - Whether the navigation happened without changing document. Examples of same document navigations are reference fragment navigations, pushState/replaceState, and same page history navigation.

  - `isMainFrame` boolean - True if the navigation is taking place in a main frame.

  - `frame` WebFrameMain | null - The frame to be navigated. May be `null` if accessed after the frame has either navigated or been destroyed.

  - `initiator` WebFrameMain | null (optional) - The frame which initiated the navigation, which can be a parent frame (e.g. via `window.open` with a frame's name), or null if the navigation was not initiated by a frame. This can also be null if the initiating frame was deleted before the event was emitted.

- `url` string *Deprecated*

- `isInPlace` boolean *Deprecated*

- `isMainFrame` boolean *Deprecated*

- `frameProcessId` Integer *Deprecated*

- `frameRoutingId` Integer *Deprecated*

Emitted after a server side redirect occurs during navigation.  For example a 302 redirect.

This event cannot be prevented, if you want to prevent redirects you should check out the `will-redirect` event above.

#### Event: 'did-navigate'

Retorna:

- `event` Event

- string `url`

- `httpResponseCode` Integer - -1 for non HTTP navigations

- `httpStatusText` string - empty for non HTTP navigations

Emitted when a main frame navigation is done.

This event is not emitted for in-page navigations, such as clicking anchor links or updating the `window.location.hash`. Use `did-navigate-in-page` event for this purpose.

#### Event: 'did-frame-navigate'

Retorna:

- `event` Event

- string `url`

- `httpResponseCode` Integer - -1 for non HTTP navigations

- `httpStatusText` string - empty for non HTTP navigations,

- `isMainFrame` boolean

- `frameProcessId` Integer

- `frameRoutingId` Integer

Emitted when any frame navigation is done.

This event is not emitted for in-page navigations, such as clicking anchor links or updating the `window.location.hash`. Use `did-navigate-in-page` event for this purpose.

#### Event: 'did-navigate-in-page'

Retorna:

- `event` Event

- string `url`

- `isMainFrame` boolean

- `frameProcessId` Integer

- `frameRoutingId` Integer

Emitted when an in-page navigation happened in any frame.

When in-page navigation happens, the page URL changes but does not cause navigation outside of the page. Examples of this occurring are when anchor links are clicked or when the DOM `hashchange` event is triggered.

#### Event: 'will-prevent-unload'

Retorna:

- `event` Event

Emitted when a `beforeunload` event handler is attempting to cancel a page unload.

Calling `event.preventDefault()` will ignore the `beforeunload` event handler and allow the page to be unloaded.

```javascript
const { BrowserWindow, dialog } = require('electron')  
  
const win = new BrowserWindow({ width: 800, height: 600 })  
win.webContents.on('will-prevent-unload', (event) => {  
  const choice = dialog.showMessageBoxSync(win, {  
    type: 'question',  
    buttons: ['Leave', 'Stay'],  
    title: 'Do you want to leave this site?',  
    message: 'Changes you made may not be saved.',  
    defaultId: 0,  
    cancelId: 1  
  })  
  const leave = (choice === 0)  
  if (leave) {  
    event.preventDefault()  
  }  
})  

```

> 

[!NOTE] This will be emitted for `BrowserViews` but will *not* be respected - this is because we have chosen not to tie the `BrowserView` lifecycle to its owning BrowserWindow should one exist per the [specification](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event).

#### Event: 'render-process-gone'

Retorna:

- `event` Event

- `details` [RenderProcessGoneDetails](/pt/docs/latest/api/structures/render-process-gone-details)

Emitted when the renderer process unexpectedly disappears.  This is normally because it was crashed or killed.

#### Evento: 'unresponsive'

Emitted when the web page becomes unresponsive.

#### Evento: 'responsive'

Emitted when the unresponsive web page becomes responsive again.

#### Event: 'destroyed'

Emitted when `webContents` is destroyed.

#### Event: 'input-event'

Retorna:

- `event` Event

- `inputEvent` [InputEvent](/pt/docs/latest/api/structures/input-event)

Emitted when an input event is sent to the WebContents. See [InputEvent](/pt/docs/latest/api/structures/input-event) for details.

#### Event: 'before-input-event'

Retorna:

- `event` Event

- `input` Object - Input properties.

  - `type` string - Either `keyUp` or `keyDown`.

  - `key` string - Equivalent to [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

  - `code` string - Equivalent to [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

  - `isAutoRepeat` boolean - Equivalent to [KeyboardEvent.repeat](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

  - `isComposing` boolean - Equivalent to [KeyboardEvent.isComposing](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

  - `shift` boolean - Equivalent to [KeyboardEvent.shiftKey](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

  - `control` boolean - Equivalent to [KeyboardEvent.controlKey](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

  - `alt` boolean - Equivalent to [KeyboardEvent.altKey](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

  - `meta` boolean - Equivalent to [KeyboardEvent.metaKey](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

  - `location` number - Equivalent to [KeyboardEvent.location](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

  - `modifiers` string[] - See [InputEvent.modifiers](/pt/docs/latest/api/structures/input-event).

Emitted before dispatching the `keydown` and `keyup` events in the page. Calling `event.preventDefault` will prevent the page `keydown`/`keyup` events and the menu shortcuts.

To only prevent the menu shortcuts, use [`setIgnoreMenuShortcuts`](#contentssetignoremenushortcutsignore):

```javascript
const { app, BrowserWindow } = require('electron')  
  
app.whenReady().then(() => {  
  const win = new BrowserWindow({ width: 800, height: 600 })  
  
  win.webContents.on('before-input-event', (event, input) => {  
    // Enable application menu keyboard shortcuts when Ctrl/Cmd are down.  
    win.webContents.setIgnoreMenuShortcuts(!input.control && !input.meta)  
  })  
})  

```

#### Event: 'before-mouse-event'

Retorna:

- `event` Event

- `mouse` [MouseInputEvent](/pt/docs/latest/api/structures/mouse-input-event)

Emitted before dispatching mouse events in the page.

Calling `event.preventDefault` will prevent the page mouse events.

```javascript
const { app, BrowserWindow } = require('electron')  
  
app.whenReady().then(() => {  
  const win = new BrowserWindow({ width: 800, height: 600 })  
  
  win.webContents.on('before-mouse-event', (event, mouse) => {  
    // Prevent mouseDown events.  
    if (mouse.type === 'mouseDown') {  
      console.log(mouse)  
      /*  
      {  
        type: 'mouseDown',  
        clickCount: 1,  
        movementX: 0,  
        movementY: 0,  
        button: 'left',  
        x: 632.359375,  
        y: 480.6875,  
        globalX: 168.359375,  
        globalY: 193.6875  
      }  
      */  
      event.preventDefault()  
    }  
  })  
})  

```

#### Evento: 'enter-html-full-screen'

Emitted when the window enters a full-screen state triggered by HTML API.

#### Evento: 'leave-html-full-screen'

Emitted when the window leaves a full-screen state triggered by HTML API.

#### Event: 'zoom-changed'

Retorna:

- `event` Event

- `zoomDirection` string - Can be `in` or `out`.

Emitted when the user is requesting to change the zoom level using the mouse wheel.

#### Evento: 'blur'

Emitted when the `WebContents` loses focus.

#### Evento: 'focus'

Emitted when the `WebContents` gains focus.

Note that on macOS, having focus means the `WebContents` is the first responder of window, so switching focus between windows would not trigger the `focus` and `blur` events of `WebContents`, as the first responder of each window is not changed.

The `focus` and `blur` events of `WebContents` should only be used to detect focus change between different `WebContents` and `BrowserView` in the same window.

#### Event: 'devtools-open-url'

Retorna:

- `event` Event

- `url` string - URL of the link that was clicked or selected.

Emitted when a link is clicked in DevTools or 'Open in new tab' is selected for a link in its context menu.

#### Event: 'devtools-search-query'

Retorna:

- `event` Event

- `query` string - text to query for.

Emitted when 'Search' is selected for text in its context menu.

#### Event: 'devtools-opened'

Emitted when DevTools is opened.

#### Event: 'devtools-closed'

Emitted when DevTools is closed.

#### Event: 'devtools-focused'

Emitted when DevTools is focused / opened.

#### Evento: 'certificate-error'

Retorna:

- `event` Event

- string `url`

- `error` string - O código do erro.

- `certificate` [Certificate](/pt/docs/latest/api/structures/certificate)

- `callback` Function

  - `isTrusted` boolean - Indicates whether the certificate can be considered trusted.

- `isMainFrame` boolean

Emitted when failed to verify the `certificate` for `url`.

The usage is the same with [the `certificate-error` event of `app`](/pt/docs/latest/api/app#event-certificate-error).

#### Evento: 'select-client-certificate'

Retorna:

- `event` Event

- `url` URL

- `certificateList` [Certificate[]](/pt/docs/latest/api/structures/certificate)

- `callback` Function

  - `certificate` [Certificate](/pt/docs/latest/api/structures/certificate) - Must be a certificate from the given list.

Emitido quando um certificado de cliente é solicitado.

The usage is the same with [the `select-client-certificate` event of `app`](/pt/docs/latest/api/app#event-select-client-certificate).

#### Evento: 'login'

Retorna:

- `event` Event

- `authenticationResponseDetails` Object

  - `url` URL

  - `pid` number

  - `isRequestForNavigation` boolean - Indicates whether the request is for a navigation.

  - `firstAuthAttempt` boolean - Indicates whether this is the first authentication attempt.

  - `responseHeaders` Record<string, string | string[]> (optional) - The headers returned in the response.

- Objeto `authInfo`

  - `isProxy` boolean

  - `scheme` string

  - `host` string

  - `port` Integer

  - `realm` string

- `callback` Function

  - `username` string (optional)

  - `password` string (optional)

Emitido quando `webContents` quer fazer uma autenticação básica.

The usage is the same with [the `login` event of `app`](/pt/docs/latest/api/app#event-login).

#### Event: 'found-in-page'

Retorna:

- `event` Event

- Objeto `result`

  - `requestId` Integer

  - `activeMatchOrdinal` Integer - Position of the active match.

  - `matches` Integer - Number of Matches.

  - `selectionArea` Rectangle - Coordinates of first match region.

  - `finalUpdate` boolean

Emitted when a result is available for [`webContents.findInPage`](#contentsfindinpagetext-options) request.

#### Event: 'media-started-playing'

Emitted when media starts playing.

#### Event: 'media-paused'

Emitted when media is paused or done playing.

#### Event: 'audio-state-changed'

Retorna:

- `event` Evento<>

  - `audible` boolean - True if one or more frames or child `webContents` are emitting audio.

Emitted when media becomes audible or inaudible.

#### Event: 'did-change-theme-color'

Retorna:

- `event` Event

- `color` (string | null) - Theme color is in format of '#rrggbb'. It is `null` when no theme color is set.

Emitted when a page's theme color changes. This is usually due to encountering a meta tag:

```javascript
<meta name='theme-color' content='#ff0000'>  

```

#### Event: 'update-target-url'

Retorna:

- `event` Event

- string `url`

Emitted when mouse moves over a link or the keyboard moves the focus to a link.

#### Event: 'cursor-changed'

Retorna:

- `event` Event

- `type` string

- `image` [NativeImage](/pt/docs/latest/api/native-image) (optional)

- `scale` Float (optional) - scaling factor for the custom cursor.

- `size` [Size](/pt/docs/latest/api/structures/size) (optional) - the size of the `image`.

- `hotspot` [Point](/pt/docs/latest/api/structures/point) (optional) - coordinates of the custom cursor's hotspot.

Emitted when the cursor's type changes. The `type` parameter can be `pointer`, `crosshair`, `hand`, `text`, `wait`, `help`, `e-resize`, `n-resize`, `ne-resize`, `nw-resize`, `s-resize`, `se-resize`, `sw-resize`, `w-resize`, `ns-resize`, `ew-resize`, `nesw-resize`, `nwse-resize`, `col-resize`, `row-resize`, `m-panning`, `m-panning-vertical`, `m-panning-horizontal`, `e-panning`, `n-panning`, `ne-panning`, `nw-panning`, `s-panning`, `se-panning`, `sw-panning`, `w-panning`, `move`, `vertical-text`, `cell`, `context-menu`, `alias`, `progress`, `nodrop`, `copy`, `none`, `not-allowed`, `zoom-in`, `zoom-out`, `grab`, `grabbing`, `custom`, `null`, `drag-drop-none`, `drag-drop-move`, `drag-drop-copy`, `drag-drop-link`, `ns-no-resize`, `ew-no-resize`, `nesw-no-resize`, `nwse-no-resize`, or `default`.

If the `type` parameter is `custom`, the `image` parameter will hold the custom cursor image in a [`NativeImage`](/pt/docs/latest/api/native-image), and `scale`, `size` and `hotspot` will hold additional information about the custom cursor.

#### Event: 'context-menu'

Retorna:

- `event` Event

- `params` Object

  - `x` Integer - x coordinate.

  - `y` Integer - y coordinate.

  - `frame` WebFrameMain | null - Frame from which the context menu was invoked. May be `null` if accessed after the frame has either navigated or been destroyed.

  - `linkURL` string - URL of the link that encloses the node the context menu was invoked on.

  - `linkText` string - Text associated with the link. May be an empty string if the contents of the link are an image.

  - `pageURL` string - URL of the top level page that the context menu was invoked on.

  - `frameURL` string - URL of the subframe that the context menu was invoked on.

  - `srcURL` string - Source URL for the element that the context menu was invoked on. Elements with source URLs are images, audio and video.

  - `mediaType` string - Type of the node the context menu was invoked on. Can be `none`, `image`, `audio`, `video`, `canvas`, `file` or `plugin`.

  - `hasImageContents` boolean - Whether the context menu was invoked on an image which has non-empty contents.

  - `isEditable` boolean - Whether the context is editable.

  - `selectionText` string - Text of the selection that the context menu was invoked on.

  - `titleText` string - Title text of the selection that the context menu was invoked on.

  - `altText` string - Alt text of the selection that the context menu was invoked on.

  - `suggestedFilename` string - Suggested filename to be used when saving file through 'Save Link As' option of context menu.

  - `selectionRect` [Rectangle](/pt/docs/latest/api/structures/rectangle) - Rect representing the coordinates in the document space of the selection.

  - `selectionStartOffset` number - Start position of the selection text.

  - `referrerPolicy` [Referrer](/pt/docs/latest/api/structures/referrer) - The referrer policy of the frame on which the menu is invoked.

  - `misspelledWord` string - The misspelled word under the cursor, if any.

  - `dictionarySuggestions` string[] - An array of suggested words to show the user to replace the `misspelledWord`.  Only available if there is a misspelled word and spellchecker is enabled.

  - `frameCharset` string - The character encoding of the frame on which the menu was invoked.

  - `formControlType` string - The source that the context menu was invoked on. Possible values include `none`, `button-button`, `field-set`, `input-button`, `input-checkbox`, `input-color`, `input-date`, `input-datetime-local`, `input-email`, `input-file`, `input-hidden`, `input-image`, `input-month`, `input-number`, `input-password`, `input-radio`, `input-range`, `input-reset`, `input-search`, `input-submit`, `input-telephone`, `input-text`, `input-time`, `input-url`, `input-week`, `output`, `reset-button`, `select-list`, `select-list`, `select-multiple`, `select-one`, `submit-button`, and `text-area`,

  - `spellcheckEnabled` boolean - If the context is editable, whether or not spellchecking is enabled.

  - `menuSourceType` string - Input source that invoked the context menu. Can be `none`, `mouse`, `keyboard`, `touch`, `touchMenu`, `longPress`, `longTap`, `touchHandle`, `stylus`, `adjustSelection`, or `adjustSelectionReset`.

  - `mediaFlags` Object - The flags for the media element the context menu was invoked on.

    - `inError` boolean - Whether the media element has crashed.

    - `isPaused` boolean - Whether the media element is paused.

    - `isMuted` boolean - Whether the media element is muted.

    - `hasAudio` boolean - Whether the media element has audio.

    - `isLooping` boolean - Whether the media element is looping.

    - `isControlsVisible` boolean - Whether the media element's controls are visible.

    - `canToggleControls` boolean - Whether the media element's controls are toggleable.

    - `canPrint` boolean - Whether the media element can be printed.

    - `canSave` boolean - Whether or not the media element can be downloaded.

    - `canShowPictureInPicture` boolean - Whether the media element can show picture-in-picture.

    - `isShowingPictureInPicture` boolean - Whether the media element is currently showing picture-in-picture.

    - `canRotate` boolean - Whether the media element can be rotated.

    - `canLoop` boolean - Whether the media element can be looped.

  - `editFlags` Object - These flags indicate whether the renderer believes it is able to perform the corresponding action.

    - `canUndo` boolean - Whether the renderer believes it can undo.

    - `canRedo` boolean - Whether the renderer believes it can redo.

    - `canCut` boolean - Whether the renderer believes it can cut.

    - `canCopy` boolean - Whether the renderer believes it can copy.

    - `canPaste` boolean - Whether the renderer believes it can paste.

    - `canDelete` boolean - Whether the renderer believes it can delete.

    - `canSelectAll` boolean - Whether the renderer believes it can select all.

    - `canEditRichly` boolean - Whether the renderer believes it can edit text richly.

Emitted when there is a new context menu that needs to be handled.

#### Event: 'select-bluetooth-device'

Retorna:

- `event` Event

- `devices` [BluetoothDevice[]](/pt/docs/latest/api/structures/bluetooth-device)

- `callback` Function

  - `deviceId` string

Emitted when a bluetooth device needs to be selected when a call to `navigator.bluetooth.requestDevice` is made. `callback` should be called with the `deviceId` of the device to be selected.  Passing an empty string to `callback` will cancel the request.

If no event listener is added for this event, all bluetooth requests will be cancelled.

If `event.preventDefault` is not called when handling this event, the first available device will be automatically selected.

Due to the nature of bluetooth, scanning for devices when `navigator.bluetooth.requestDevice` is called may take time and will cause `select-bluetooth-device` to fire multiple times until `callback` is called with either a device id or an empty string to cancel the request.
main.js

```javascript
const { app, BrowserWindow } = require('electron')  
  
let win = null  
  
app.whenReady().then(() => {  
  win = new BrowserWindow({ width: 800, height: 600 })  
  win.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {  
    event.preventDefault()  
    const result = deviceList.find((device) => {  
      return device.deviceName === 'test'  
    })  
    if (!result) {  
      // The device wasn't found so we need to either wait longer (eg until the  
      // device is turned on) or cancel the request by calling the callback  
      // with an empty string.  
      callback('')  
    } else {  
      callback(result.deviceId)  
    }  
  })  
})  

```

#### Event: 'paint'

Retorna:

- `details` Evento<>

  - `texture` [OffscreenSharedTexture](/pt/docs/latest/api/structures/offscreen-shared-texture) (optional) *Experimental* - The GPU shared texture of the frame, when `webPreferences.offscreen.useSharedTexture` is `true`.

- `dirtyRect` [Rectangle](/pt/docs/latest/api/structures/rectangle)

- `image` [NativeImage](/pt/docs/latest/api/native-image) - The image data of the whole frame.

Emitted when a new frame is generated. Only the dirty area is passed in the buffer.

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({ webPreferences: { offscreen: true } })  
win.webContents.on('paint', (event, dirty, image) => {  
  // updateBitmap(dirty, image.toBitmap())  
})  
win.loadURL('https://github.com')  

```

When using shared texture (set `webPreferences.offscreen.useSharedTexture` to `true`) feature, you can pass the texture handle to external rendering pipeline without the overhead of copying data between CPU and GPU memory, with Chromium's hardware acceleration support. This feature is helpful for high-performance rendering scenarios.

Only a limited number of textures can exist at the same time, so it's important that you call `texture.release()` as soon as you're done with the texture. By managing the texture lifecycle by yourself, you can safely pass the `texture.textureInfo` to other processes through IPC.

More details can be found in the [offscreen rendering tutorial](/pt/docs/latest/tutorial/offscreen-rendering). To learn about how to handle the texture in native code, refer to [offscreen rendering's code documentation.](https://github.com/electron/electron/blob/v43.4.0/shell/browser/osr/README.md).

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({ webPreferences: { offscreen: { useSharedTexture: true } } })  
win.webContents.on('paint', async (e, dirty, image) => {  
  if (e.texture) {  
    // By managing lifecycle yourself, you can handle the event in async handler or pass the `e.texture.textureInfo`  
    // to other processes (not `e.texture`, the `e.texture.release` function is not passable through IPC).  
    await new Promise(resolve => setTimeout(resolve, 50))  
  
    // You can send the native texture handle to native code for importing into your rendering pipeline.  
    // Read more at https://github.com/electron/electron/blob/main/shell/browser/osr/README.md  
    // importTextureHandle(dirty, e.texture.textureInfo)  
  
    // You must call `e.texture.release()` as soon as possible, before the underlying frame pool is drained.  
    e.texture.release()  
  }  
})  
win.loadURL('https://github.com')  

```

#### Event: 'devtools-reload-page'

Emitted when the DevTools window instructs the webContents to reload

#### Event: 'will-attach-webview'

Retorna:

- `event` Event

- `webPreferences` [WebPreferences](/pt/docs/latest/api/structures/web-preferences) - The web preferences that will be used by the guest page. This object can be modified to adjust the preferences for the guest page.

- `params` Record<string, string> - The other `<webview>` parameters such as the `src` URL. This object can be modified to adjust the parameters of the guest page.

Emitted when a `<webview>`'s web contents is being attached to this web contents. Calling `event.preventDefault()` will destroy the guest page.

This event can be used to configure `webPreferences` for the `webContents` of a `<webview>` before it's loaded, and provides the ability to set settings that can't be set via `<webview>` attributes.

#### Event: 'did-attach-webview'

Retorna:

- `event` Event

- `webContents` WebContents - The guest web contents that is used by the `<webview>`.

Emitted when a `<webview>` has been attached to this web contents.

#### Event: 'console-message'

Retorna:

- `details` Evento<>

  - `message` string - Message text

  - `level` string - Message severity Possible values include `info`, `warning`, `error`, and `debug`.

  - `lineNumber` Integer - Line number in the log source

  - `sourceId` string - URL of the log source

  - `frame` WebFrameMain - Frame that logged the message

- `level` Integer *Deprecated* - The log level, from 0 to 3. In order it matches `verbose`, `info`, `warning` and `error`.

- `message` string *Deprecated* - The actual console message

- `line` Integer *Deprecated* - The line number of the source that triggered this console message

- `sourceId` string *Deprecated*

Emitted when the associated window logs a console message.

#### Event: 'preload-error'

Retorna:

- `event` Event

- `preloadPath` string

- Erro `error`

Emitted when the preload script `preloadPath` throws an unhandled exception `error`.

#### Event: 'ipc-message'

Retorna:

- `event` [IpcMainEvent](/pt/docs/latest/api/structures/ipc-main-event)

- `channel` string

- `...args` any[]

Emitted when the renderer process sends an asynchronous message via `ipcRenderer.send()`.

See also [`webContents.ipc`](#contentsipc-readonly), which provides an [`IpcMain`](/pt/docs/latest/api/ipc-main)-like interface for responding to IPC messages specifically from this WebContents.

#### Event: 'ipc-message-sync'

Retorna:

- `event` [IpcMainEvent](/pt/docs/latest/api/structures/ipc-main-event)

- `channel` string

- `...args` any[]

Emitted when the renderer process sends a synchronous message via `ipcRenderer.sendSync()`.

See also [`webContents.ipc`](#contentsipc-readonly), which provides an [`IpcMain`](/pt/docs/latest/api/ipc-main)-like interface for responding to IPC messages specifically from this WebContents.

#### Event: 'preferred-size-changed'

Retorna:

- `event` Event

- `preferredSize` [Size](/pt/docs/latest/api/structures/size) - The minimum size needed to contain the layout of the document—without requiring scrolling.

Emitted when the `WebContents` preferred size has changed.

This event will only be emitted when `enablePreferredSizeMode` is set to `true` in `webPreferences`.

#### Event: 'frame-created'

Retorna:

- `event` Event

- Objeto `details`

  - `frame` WebFrameMain | null - The created frame. May be `null` if accessed after the frame has either navigated or been destroyed.

Emitted when the [mainFrame](/pt/docs/latest/api/web-contents#contentsmainframe-readonly), an `<iframe>`, or a nested `<iframe>` is loaded within the page.

### Métodos de Instância

#### `contents.loadURL(url[, options])`

- string `url`

- Objeto `options` (opcional)

  - `httpReferrer` (string | [Referrer](/pt/docs/latest/api/structures/referrer)) (optional) - An HTTP Referrer url.

  - `userAgent` string (optional) - A user agent originating the request.

  - `extraHeaders` string (optional) - Extra headers separated by "\n".

  - `postData` ([UploadRawData](/pt/docs/latest/api/structures/upload-raw-data) | [UploadFile](/pt/docs/latest/api/structures/upload-file))[] (optional)

  - `baseURLForDataURL` string (optional) - Base url (with trailing path separator) for files to be loaded by the data url. This is needed only if the specified `url` is a data url and needs to load other files.

Returns `Promise<void>` - the promise will resolve when the page has finished loading (see [`did-finish-load`](/pt/docs/latest/api/web-contents#event-did-finish-load)), and rejects if the page fails to load (see [`did-fail-load`](/pt/docs/latest/api/web-contents#event-did-fail-load)). A noop rejection handler is already attached, which avoids unhandled rejection errors. If the existing page has a beforeUnload handler, [`did-fail-load`](/pt/docs/latest/api/web-contents#event-did-fail-load) will be called unless [`will-prevent-unload`](/pt/docs/latest/api/web-contents#event-did-fail-load) is handled.

Loads the `url` in the window. The `url` must contain the protocol prefix, e.g. the `http://` or `file://`. If the load should bypass http cache then use the `pragma` header to achieve it.

```javascript
const win = new BrowserWindow()  
const options = { extraHeaders: 'pragma: no-cache\n' }  
win.webContents.loadURL('https://github.com', options)  

```

#### `contents.loadFile(filePath[, options])`

- `filePath` string

- Objeto `options` (opcional)

  - `query` Record<string, string> (optional) - Passed to `url.format()`.

  - `search` string (optional) - Passed to `url.format()`.

  - `hash` string (optional) - Passed to `url.format()`.

Returns `Promise<void>` - the promise will resolve when the page has finished loading (see [`did-finish-load`](/pt/docs/latest/api/web-contents#event-did-finish-load)), and rejects if the page fails to load (see [`did-fail-load`](/pt/docs/latest/api/web-contents#event-did-fail-load)).

Loads the given file in the window, `filePath` should be a path to an HTML file relative to the root of your application.  For instance an app structure like this:

```javascript
| root  
| - package.json  
| - src  
|   - main.js  
|   - index.html  

```

Would require code like this

```javascript
const win = new BrowserWindow()  
win.loadFile('src/index.html')  

```

#### `contents.downloadURL(url[, options])`

- string `url`

- Objeto `options` (opcional)

  - `headers` Record<string, string> (optional) - HTTP request headers.

Initiates a download of the resource at `url` without navigating. The `will-download` event of `session` will be triggered.

#### `contents.getURL()`

Returns `string` - The URL of the current web page.

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({ width: 800, height: 600 })  
win.loadURL('https://github.com').then(() => {  
  const currentURL = win.webContents.getURL()  
  console.log(currentURL)  
})  

```

#### `contents.getTitle()`

Returns `string` - The title of the current web page.

#### `contents.isDestroyed()`

Returns `boolean` - Whether the web page is destroyed.

#### `contents.close([opts])`

- `opts` Object (optional)

  - `waitForBeforeUnload` boolean - if true, fire the `beforeunload` event before closing the page. If the page prevents the unload, the WebContents will not be closed. The [`will-prevent-unload`](#event-will-prevent-unload) will be fired if the page requests prevention of unload.

Closes the page, as if the web content had called `window.close()`.

If the page is successfully closed (i.e. the unload is not prevented by the page, or `waitForBeforeUnload` is false or unspecified), the WebContents will be destroyed and no longer usable. The [`destroyed`](#event-destroyed) event will be emitted.

#### `contents.focus()`

Focuses the web page.

#### `contents.isFocused()`

Returns `boolean` - Whether the web page is focused.

#### `contents.isLoading()`

Returns `boolean` - Whether web page is still loading resources.

#### `contents.isLoadingMainFrame()`

Returns `boolean` - Whether the main frame (and not just iframes or frames within it) is still loading.

#### `contents.isWaitingForResponse()`

Returns `boolean` - Whether the web page is waiting for a first-response from the main resource of the page.

#### `contents.stop()`

Stops any pending navigation.

#### `contents.reload()`

Reloads the current web page.

#### `contents.reloadIgnoringCache()`

Reloads current page and ignores cache.

#### `contents.canGoBack()` *Descontinuado*

History[](/docs/latest/breaking-changes#deprecated-clearhistory-cangoback-goback-cangoforward-goforward-gotoindex-cangotooffset-gotooffset-on-webcontents)``****[``](/pt/docs/latest/api/navigation-history#navigationhistorycangoback)

#### ``**
[](/docs/latest/breaking-changes#deprecated-clearhistory-cangoback-goback-cangoforward-goforward-gotoindex-cangotooffset-gotooffset-on-webcontents)``****[``](/pt/docs/latest/api/navigation-history#navigationhistorycangoforward)

#### ``**
[](/docs/latest/breaking-changes#deprecated-clearhistory-cangoback-goback-cangoforward-goforward-gotoindex-cangotooffset-gotooffset-on-webcontents)

- ``
````****[``](/pt/docs/latest/api/navigation-history#navigationhistorycangotooffsetoffset)

#### ``**
[](/docs/latest/breaking-changes#deprecated-clearhistory-cangoback-goback-cangoforward-goforward-gotoindex-cangotooffset-gotooffset-on-webcontents)****[``](/pt/docs/latest/api/navigation-history#navigationhistoryclear)

#### ``**
[](/docs/latest/breaking-changes#deprecated-clearhistory-cangoback-goback-cangoforward-goforward-gotoindex-cangotooffset-gotooffset-on-webcontents)****[``](/pt/docs/latest/api/navigation-history#navigationhistorygoback)

#### ``**
[](/docs/latest/breaking-changes#deprecated-clearhistory-cangoback-goback-cangoforward-goforward-gotoindex-cangotooffset-gotooffset-on-webcontents)****[``](/pt/docs/latest/api/navigation-history#navigationhistorygoforward)

#### ``**
[](/docs/latest/breaking-changes#deprecated-clearhistory-cangoback-goback-cangoforward-goforward-gotoindex-cangotooffset-gotooffset-on-webcontents)

- ``
****[``](/pt/docs/latest/api/navigation-history#navigationhistorygotoindexindex)

#### ``**
[](/docs/latest/breaking-changes#deprecated-clearhistory-cangoback-goback-cangoforward-goforward-gotoindex-cangotooffset-gotooffset-on-webcontents)

- ``
****[``](/pt/docs/latest/api/navigation-history#navigationhistorygotooffsetoffset)

#### ``
``

#### ``
``````````

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```

#### ``

- ``

#### ``
``

#### ``

- ``
- ``

  - ``[](https://www.w3.org/TR/css3-cascade/#cascade-origin)

````

```javascript
  
  
  
  

```

#### ``

- ``
````

```javascript
  
  
  
  
  
  

```

#### ``

- ``
- ````
``````````

```javascript
  
  
  
  
  
  

```

#### ``

- ````````
- ``[](/pt/docs/latest/api/structures/web-source)
- ````
``````

#### ``

- ``

#### ``

- ``[](/pt/docs/latest/api/structures/window-open-handler-response)

  - ``

    - ``**``````
    - ````
    - ````
    - ````````````[](https://source.chromium.org/chromium/chromium/src/+/main:ui/base/window_open_disposition.h)

      - ``
      - ``
      - ``
      - ``
      - ``

    - ``[](/pt/docs/latest/api/structures/referrer)``
    - ``[](/pt/docs/latest/api/structures/post-body)````

````````
``````[``](/pt/docs/latest/api/window-open)``````

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```

#### ``

- ``

#### ``
``

#### ``
``

#### ``

- ``

#### ``
``

#### ``

- ``
``

> 

#### ``
``

#### ``

- ``
- ``
``

> 

```javascript
  
  

```

#### ``
``

#### ``
``

#### ``
``

#### ``
``

#### ``

#### ``

- ``
- ``

#### ``

- ``
- ``

#### ``

- ``
- ``

#### ``
``

#### ``
``

#### ``
``

#### ``
``

#### ``
``

#### ``
``

#### ``
``

#### ``

- ``

  - ``
  - ``

```javascript
  
  
  
  
  
  
  
  
  

```
``

#### ``

- ``
``

#### ``

- ``
``

#### ``

- ``
````

#### ``

- ``
- ``

  - ````
  - ````````
  - ````

````[``](/pt/docs/latest/api/web-contents#event-found-in-page)

#### ``

- ``[``](#contentsfindinpagetext-options)

  - ``
  - ``
  - ``

``````

```javascript
  
  
  
  
  
  
  

```

#### ``

- ``[](/pt/docs/latest/api/structures/rectangle)
- ``

  - ````
  - ````

``[](/pt/docs/latest/api/native-image)``````

#### ``
``

#### ``
``[](/pt/docs/latest/api/structures/printer-info)

#### ``

- ``

  - ````
  - ````
  - ``
  - ````
  - ``

    - ````````````````````
    - ``
    - ``
    - ``
    - ``

  - ````
  - ``
  - ``
  - ``
  - ``
  - ``

    - ``
    - ``

  - ````````
  - ``

    - ``
    - ``

  - ``
  - ``
  - ``````````````````````````
  - ``````````

- ``

  - ``
  - ``

````````````````````

- 
- 
- 
``

```javascript
  
  
  
  
  
  
  
  
  
  
  
  

```

#### ``

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

````````

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```
[](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-printToPDF)

#### ``

- ``

```javascript
  
  
  
  
  
  

```

#### ``

- ``

#### ``

- ``
````````````[``](/pt/docs/latest/api/browser-window)[``](/pt/docs/latest/api/web-contents-view)``````

```javascript
  
  
  
  
  
  
  
  
  
  
  
  

```

#### ``

- ``

  - ````````````````
  - ````
  - ``````

````````````

#### ``

#### ``
``

#### ``
``

#### ``
``````

#### ``

- ``
``````

#### ``

#### ``

- ``
- ``
````

#### ``

#### ``

- ``

#### ``
[](/pt/docs/latest/api/structures/shared-worker-info)

#### ``

#### ``

- ``
- ``
``[](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)[``](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)[](/pt/docs/latest/tutorial/ipc)

#### ``

- ````
- ``
- ``
``[](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)[``](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

> ****``[``](/pt/docs/latest/api/ipc-renderer)````

```javascript
  
  

```
``

```javascript
  
  
  
  

```

#### ``

- ``
- ``
- ``
[``](/pt/docs/latest/api/message-port-main)``````

```javascript
  
  
  
  
  
  
  
  
  
  

```

#### ``

- ``

  - ````

    - ``
    - ``

  - ``[](/pt/docs/latest/api/structures/size)
  - ``[](/pt/docs/latest/api/structures/point)``
  - ````
  - ``[](/pt/docs/latest/api/structures/size)
  - ````

#### ``
``

#### ``

- ``[](/pt/docs/latest/api/structures/mouse-input-event)[](/pt/docs/latest/api/structures/mouse-wheel-input-event)[](/pt/docs/latest/api/structures/keyboard-input-event)
``

> [``](/pt/docs/latest/api/browser-window)``

#### ``

- ````
- ``

  - ``[](/pt/docs/latest/api/native-image)
  - ``[](/pt/docs/latest/api/structures/rectangle)

``````[](/pt/docs/latest/api/native-image)``````````````

#### ``

#### ``

- ``

  - ``
  - ``````
  - ``[](/pt/docs/latest/api/native-image)

``````

#### ``

- ``
- ``

  - ``
  - ``
  - ``

``

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  

```

#### ``**

#### ``
``**

#### ``
**

#### ``
**

#### ``
``**

#### ``

- ``
**````

#### ``
``**

#### ``
**``

#### ``
``

#### ``

- ``

  - ``
  - ``
  - ``
  - ``

[](https://browserleaks.com/webrtc)

#### ``
``

- ``
- ``
``

#### ``

- ``

  - ``
  - ``

> ``

#### ``

- ``
````````

#### ``
``[](https://chromedevtools.github.io/devtools-protocol/tot/Target/#type-TargetID)[``](#webcontentsfromdevtoolstargetidtargetid)

> 

#### ``
````

#### ``
````````

#### ``
``

- ****
- ****[](https://www.chromium.org/developers/design-documents/site-isolation/)
- ****
- ****

#### ``

- ``
````

#### ``
``

#### ``
[``````](/docs/latest/breaking-changes#behavior-changed-webcontentsbackgroundthrottling-set-to-false-affects-all-webcontents-in-the-host-browserwindow)

- ``

#### ``
``````````````

#### ``

- ````````
**``[](https://developer.chrome.com/docs/extensions/reference/accessibilityFeatures/#property-animationPolicy)

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
````[``](/pt/docs/latest/api/web-frame-main#frameipc-readonly)

#### ``
``

#### ``
``

#### ``
````

#### ``
``

#### ``
``**

#### ``**
````

#### ``**
[``](/pt/docs/latest/api/session)

#### ``**
[``](/pt/docs/latest/api/navigation-history)

#### ``**
``[``](/pt/docs/latest/api/web-contents)``

#### ``**
``````

> ``

#### ``**
[``](/pt/docs/latest/api/debugger)

#### ``
[``````](/docs/latest/breaking-changes#behavior-changed-webcontentsbackgroundthrottling-set-to-false-affects-all-webcontents-in-the-host-browserwindow)``

#### ``**
[``](/pt/docs/latest/api/web-frame-main)

#### ``**
[``](/pt/docs/latest/api/web-frame-main)

#### ``**
[``](/pt/docs/latest/api/web-frame-main)````[](https://github.com/electron/electron/edit/main/docs/api/web-contents.md)[](/pt/docs/latest/api/utility-process)[](/pt/docs/latest/api/web-contents-view)

- 

  - 
  - 
  - 

- 

  - [``](#webcontentsgetallwebcontents)
  - [``](#webcontentsgetfocusedwebcontents)
  - [``](#webcontentsfromidid)
  - [``](#webcontentsfromframeframe)
  - [``](#webcontentsfromdevtoolstargetidtargetid)

- 

  - 

    - [``](#event-did-finish-load)
    - [``](#event-did-fail-load)
    - [``](#event-did-fail-provisional-load)
    - [``](#event-did-frame-finish-load)
    - [``](#event-did-start-loading)
    - [``](#event-did-stop-loading)
    - [``](#event-dom-ready)
    - 
    - 
    - [``](#event-content-bounds-updated)
    - [``](#event-did-create-window)
    - 
    - [``](#event-will-frame-navigate)
    - [``](#event-did-start-navigation)
    - [``](#event-will-redirect)
    - [``](#event-did-redirect-navigation)
    - [``](#event-did-navigate)
    - [``](#event-did-frame-navigate)
    - [``](#event-did-navigate-in-page)
    - [``](#event-will-prevent-unload)
    - [``](#event-render-process-gone)
    - 
    - 
    - [``](#event-destroyed)
    - [``](#event-input-event)
    - [``](#event-before-input-event)
    - [``](#event-before-mouse-event)
    - 
    - 
    - [``](#event-zoom-changed)
    - 
    - 
    - [``](#event-devtools-open-url)
    - [``](#event-devtools-search-query)
    - [``](#event-devtools-opened)
    - [``](#event-devtools-closed)
    - [``](#event-devtools-focused)
    - 
    - 
    - 
    - [``](#event-found-in-page)
    - [``](#event-media-started-playing)
    - [``](#event-media-paused)
    - [``](#event-audio-state-changed)
    - [``](#event-did-change-theme-color)
    - [``](#event-update-target-url)
    - [``](#event-cursor-changed)
    - [``](#event-context-menu)
    - [``](#event-select-bluetooth-device)
    - [``](#event-paint)
    - [``](#event-devtools-reload-page)
    - [``](#event-will-attach-webview)
    - [``](#event-did-attach-webview)
    - [``](#event-console-message)
    - [``](#event-preload-error)
    - [``](#event-ipc-message)
    - [``](#event-ipc-message-sync)
    - [``](#event-preferred-size-changed)
    - [``](#event-frame-created)

  - 

    - [``](#contentsloadurlurl-options)
    - [``](#contentsloadfilefilepath-options)
    - [``](#contentsdownloadurlurl-options)
    - [``](#contentsgeturl)
    - [``](#contentsgettitle)
    - [``](#contentsisdestroyed)
    - [``](#contentscloseopts)
    - [``](#contentsfocus)
    - [``](#contentsisfocused)
    - [``](#contentsisloading)
    - [``](#contentsisloadingmainframe)
    - [``](#contentsiswaitingforresponse)
    - [``](#contentsstop)
    - [``](#contentsreload)
    - [``](#contentsreloadignoringcache)
    - [``](#contentscangoback-descontinuado)
    - [``](#contentscangoforward-descontinuado)
    - [``](#contentscangotooffsetoffset-descontinuado)
    - [``](#contentsclearhistory-descontinuado)
    - [``](#contentsgoback-descontinuado)
    - [``](#contentsgoforward-descontinuado)
    - [``](#contentsgotoindexindex-descontinuado)
    - [``](#contentsgotooffsetoffset-descontinuado)
    - [``](#contentsiscrashed)
    - [``](#contentsforcefullycrashrenderer)
    - [``](#contentssetuseragentuseragent)
    - [``](#contentsgetuseragent)
    - [``](#contentsinsertcsscss-options)
    - [``](#contentsremoveinsertedcsskey)
    - [``](#contentsexecutejavascriptcode-usergesture)
    - [``](#contentsexecutejavascriptinisolatedworldworldid-scripts-usergesture)
    - [``](#contentssetignoremenushortcutsignore)
    - [``](#contentssetwindowopenhandlerhandler)
    - [``](#contentssetaudiomutedmuted)
    - [``](#contentsisaudiomuted)
    - [``](#contentsiscurrentlyaudible)
    - [``](#contentssetzoomfactorfactor)
    - [``](#contentsgetzoomfactor)
    - [``](#contentssetzoomlevellevel)
    - [``](#contentsgetzoomlevel)
    - [``](#contentssetvisualzoomlevellimitsminimumlevel-maximumlevel)
    - [``](#contentsundo)
    - [``](#contentsredo)
    - [``](#contentscut)
    - [``](#contentscopy)
    - [``](#contentscenterselection)
    - [``](#contentscopyimageatx-y)
    - [``](#contentscopyvideoframeatx-y)
    - [``](#contentssavevideoframeasx-y)
    - [``](#contentspaste)
    - [``](#contentspasteandmatchstyle)
    - [``](#contentsdelete)
    - [``](#contentsselectall)
    - [``](#contentsunselect)
    - [``](#contentsscrolltotop)
    - [``](#contentsscrolltobottom)
    - [``](#contentsadjustselectionoptions)
    - [``](#contentsreplacetext)
    - [``](#contentsreplacemisspellingtext)
    - [``](#contentsinserttexttext)
    - [``](#contentsfindinpagetext-options)
    - [``](#contentsstopfindinpageaction)
    - [``](#contentscapturepagerect-opts)
    - [``](#contentsisbeingcaptured)
    - [``](#contentsgetprintersasync)
    - [``](#contentsprintoptions-callback)
    - [``](#contentsprinttopdfoptions)
    - [``](#contentsaddworkspacepath)
    - [``](#contentsremoveworkspacepath)
    - [``](#contentssetdevtoolswebcontentsdevtoolswebcontents)
    - [``](#contentsopendevtoolsoptions)
    - [``](#contentsclosedevtools)
    - [``](#contentsisdevtoolsopened)
    - [``](#contentsisdevtoolsfocused)
    - [``](#contentsgetdevtoolstitle)
    - [``](#contentssetdevtoolstitletitle)
    - [``](#contentstoggledevtools)
    - [``](#contentsinspectelementx-y)
    - [``](#contentsinspectsharedworker)
    - [``](#contentsinspectsharedworkerbyidworkerid)
    - [``](#contentsgetallsharedworkers)
    - [``](#contentsinspectserviceworker)
    - [``](#contentssendchannel-args)
    - [``](#contentssendtoframeframeid-channel-args)
    - [``](#contentspostmessagechannel-message-transfer)
    - [``](#contentsenabledeviceemulationparameters)
    - [``](#contentsdisabledeviceemulation)
    - [``](#contentssendinputeventinputevent)
    - [``](#contentsbeginframesubscriptiononlydirty-callback)
    - [``](#contentsendframesubscription)
    - [``](#contentsstartdragitem)
    - [``](#contentssavepagefullpath-savetype)
    - [``](#contentsshowdefinitionforselection-macos)
    - [``](#contentsisoffscreen)
    - [``](#contentsstartpainting)
    - [``](#contentsstoppainting)
    - [``](#contentsispainting)
    - [``](#contentssetframeratefps)
    - [``](#contentsgetframerate)
    - [``](#contentsinvalidate)
    - [``](#contentsgetwebrtciphandlingpolicy)
    - [``](#contentssetwebrtciphandlingpolicypolicy)
    - [``](#contentsgetwebrtcudpportrange)
    - [``](#contentssetwebrtcudpportrangeudpportrange)
    - [``](#contentsgetmediasourceidrequestwebcontents)
    - [``](#contentsgetorcreatedevtoolstargetid)
    - [``](#contentsgetosprocessid)
    - [``](#contentsgetprocessid)
    - [``](#contentsclone)
    - [``](#contentstakeheapsnapshotfilepath)
    - [``](#contentsgetbackgroundthrottling)
    - [``](#contentssetbackgroundthrottlingallowed)
    - [``](#contentsgettype)
    - [``](#contentssetimageanimationpolicypolicy)

  - 

    - [``](#contentsipc-readonly)
    - [``](#contentsaudiomuted)
    - [``](#contentsuseragent)
    - [``](#contentszoomlevel)
    - [``](#contentszoomfactor)
    - [``](#contentsframerate)
    - [``](#contentsid-readonly)
    - [``](#contentssession-readonly)
    - [``](#contentsnavigationhistory-readonly)
    - [``](#contentshostwebcontents-readonly)
    - [``](#contentsdevtoolswebcontents-readonly)
    - [``](#contentsdebugger-readonly)
    - [``](#contentsbackgroundthrottling)
    - [``](#contentsmainframe-readonly)
    - [``](#contentsopener-readonly)
    - [``](#contentsfocusedframe-readonly)

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
