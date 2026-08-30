---
title: "BrowserWindow"
description: "Documentação técnica e referência da API de BrowserWindow no Electron."
topics:
  - "Api"
keywords:
  - "ready"
  - "BrowserWindow"
  - "show"
  - "backgroundColor"
  - "parent"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/browser-window"
---

# BrowserWindow

> 

Crier e controle janelas de navegação.

Process: [Main](/pt/docs/latest/glossary#main-process)

Este módulo não pode ser usado até que o evento `ready` do módulo `app` seja emitido.

```javascript
// No processo main.  
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({ width: 800, height: 600 })  
  
// Load a remote URL  
win.loadURL('https://github.com')  
  
// Or load a local HTML file  
win.loadFile('index.html')  

```

## Window customization

The `BrowserWindow` class exposes various ways to modify the look and behavior of your app's windows. For more details, see the [Window Customization](/pt/docs/latest/tutorial/window-customization) tutorial.

## Showing the window gracefully

When loading a page in the window directly, users may see the page load incrementally, which is not a good experience for a native app. To make the window display without a visual flash, there are two solutions for different situations.

### Using the `ready-to-show` event

Enquanto a página é carregada, o evento `ready-to-show` será disparado quando o processo de renderização estiver renderizado completamente a página pela primeira vez, caso a janela ainda não tenha sido exibida. Exibindo a janela após este evento não resultará em um flash visual:

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({ show: false })  
win.once('ready-to-show', () => {  
  win.show()  
})  

```

Este evento geralmente é emitido depois do evento `did-finish-load`, porém para páginas com vários recursos remotos, tal evento pode ser emitido antes.

Please note that using this event implies that the renderer will be considered "visible" and paint even though `show` is false.  This event will never fire if you use `paintWhenInitiallyHidden: false`

### Setting the `backgroundColor` property

Para um aplicativo complexo, o evento `ready-to-show` poderia ser emitido tarde demais, fazendo com que o aplicativo aparente lentidão. Neste caso, é recomendado exibir a janela imediatamente e utilizar a propriedade `backgroundColor` com cor semelhante a cor de fundo do seu aplicativo:

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({ backgroundColor: '#2e2c29' })  
win.loadURL('https://github.com')  

```

Note that even for apps that use `ready-to-show` event, it is still recommended to set `backgroundColor` to make the app feel more native.

Some examples of valid `backgroundColor` values include:

```javascript
const win = new BrowserWindow()  
win.setBackgroundColor('hsl(230, 100%, 50%)')  
win.setBackgroundColor('rgb(255, 145, 145)')  
win.setBackgroundColor('#ff00a3')  
win.setBackgroundColor('blueviolet')  

```

For more information about these color types see valid options in [win.setBackgroundColor](/pt/docs/latest/api/browser-window#winsetbackgroundcolorbackgroundcolor).

## Janelas parent e child

Ao utilizar a opção `parent`, é possível criar janelas secundarias:

```javascript
const { BrowserWindow } = require('electron')  
  
const top = new BrowserWindow()  
const child = new BrowserWindow({ parent: top })  
child.show()  
top.show()  

```

A janela secundaria (`child`) sempre será exibida em frente a janela principal (`top`).

## Janelas Modais

A modal window is a child window that disables parent window. To create a modal window, you have to set both the `parent` and `modal` options:

```javascript
const { BrowserWindow } = require('electron')  
  
const top = new BrowserWindow()  
const child = new BrowserWindow({ parent: top, modal: true, show: false })  
child.loadURL('https://github.com')  
child.once('ready-to-show', () => {  
  child.show()  
})  

```

## Visibilidade de página

A [API de visibilidade de página](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) funciona da seguinte forma:

- Em todas as plataformas, o estado de visibilidade verifica quando a janela é ocultada/minimizada ou não.

- Adicionalmente, no macOS, o estado de visibilidade também verifica o estado de oclusão da janela. Se a janela estive obstruída (ou seja, completamente coberta) por outra janela, o estado de visibilidade será `hidden`. Em outras plataformas, o estado de visibilidade será `hidden` somente quando a janela for minimizada ou explicitamente ocultada com o método `win.hide()`.

- Se um `BrowserWindow` é criado com a propriedade `show: false`, a visibilidade inicial será `visible` independente da janela estar de fato ocultada.

- Se a propriedade `backgroundThrottling` estive desativado, o estado de visibilidade continuará `visible` mesmo que a janela esteja minimizada, ocultada ou escondida.

É recomendado que você pause operações "caras" quando o estado de visibilidadade for `hidden` com o objetivo de minimizar o consumo de energia.

## Avisos de plataformas

- No macOS, janelas modal serão exibidas como "folhas" vinculadas a janela principal.

- No macOS, as janelas secundarias manterão a posição relativa com a janela principal quando a mesma se mover, enquanto que no Windows e Linux as janelas secundarias não se movem.

- No Linux, o tipo de janelas modais será modificado para `dialog`.

- No Linux, vários ambientes desktop não há suporte para esconder uma janela modal.

- On Wayland (Linux) it is generally not possible to programmatically resize windows after creation, or to position, move, focus, or blur windows without user input. If your app needs these capabilities, run it in Xwayland by appending the flag `--ozone-platform=x11`.

## Class: BrowserWindow extends `BaseWindow`

> 

Crier e controle janelas de navegação.

Process: [Main](/pt/docs/latest/glossary#main-process)

`BrowserWindow` é um [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

O mesmo cria um novo `BrowserWindow` com propriedades nativas informadas como a opção `options`.

> 

[!WARNING] Electron's built-in classes cannot be subclassed in user code. For more information, see [the FAQ](/pt/docs/latest/faq#class-inheritance-does-not-work-with-electron-built-in-modules).

### `new BrowserWindow([options])`

- `options` [BrowserWindowConstructorOptions](/pt/docs/latest/api/structures/browser-window-options) (optional)

  - `webPreferences` [WebPreferences](/pt/docs/latest/api/structures/web-preferences) (optional) - Settings of web page's features.

    - `devTools` boolean (optional) - Whether to enable DevTools. If it is set to `false`, can not use `BrowserWindow.webContents.openDevTools()` to open DevTools. Por padrão é `true`.

    - `nodeIntegration` boolean (optional) - Whether node integration is enabled. Por padrão é `false`.

    - `nodeIntegrationInWorker` boolean (optional) - Whether node integration is enabled in web workers. Por padrão é `false`. More about this can be found in [Multithreading](/pt/docs/latest/tutorial/multithreading).

    - `nodeIntegrationInSubFrames` boolean (optional) - Experimental option for enabling Node.js support in sub-frames such as iframes and child windows. All your preloads will load for every iframe, you can use `process.isMainFrame` to determine if you are in the main frame or not.

    - `preload` string (optional) - Specifies a script that will be loaded before other scripts run in the page. This script will always have access to node APIs no matter whether node integration is turned on or off. The value should be the absolute file path to the script. When node integration is turned off, the preload script can reintroduce Node global symbols back to the global scope. See example [here](/pt/docs/latest/api/context-bridge#exposing-node-global-symbols).

    - `sandbox` boolean (optional) - If set, this will sandbox the renderer associated with the window, making it compatible with the Chromium OS-level sandbox and disabling the Node.js engine. This is not the same as the `nodeIntegration` option and the APIs available to the preload script are more limited. Default is `true` since Electron 20. The sandbox will automatically be disabled when `nodeIntegration` is set to `true`. Read more about the option [here](/pt/docs/latest/tutorial/sandbox).

    - `session` [Session](/pt/docs/latest/api/session#class-session) (optional) - Sets the session used by the page. Instead of passing the Session object directly, you can also choose to use the `partition` option instead, which accepts a partition string. When both `session` and `partition` are provided, `session` will be preferred. Default is the default session.

    - `partition` string (optional) - Sets the session used by the page according to the session's partition string. If `partition` starts with `persist:`, the page will use a persistent session available to all pages in the app with the same `partition`. If there is no `persist:` prefix, the page will use an in-memory session. By assigning the same `partition`, multiple pages can share the same session. Default is the default session.

    - `zoomFactor` number (optional) - The default zoom factor of the page, `3.0` represents `300%`. Por padrão é `1.0`.

    - `javascript` boolean (optional) - Enables JavaScript support. Por padrão é `true`.

    - `webSecurity` boolean (optional) - When `false`, it will disable the same-origin policy (usually using testing websites by people), and set `allowRunningInsecureContent` to `true` if this option has not been set by user. Por padrão é `true`.

    - `allowRunningInsecureContent` boolean (optional) - Allow an https page to run JavaScript, CSS or plugins from http URLs. Por padrão é `false`.

    - `images` boolean (optional) - Enables image support. Por padrão é `true`.

    - `imageAnimationPolicy` string (optional) - Specifies how to run image animations (E.g. GIFs).  Can be `animate`, `animateOnce` or `noAnimation`.  Por padrão é `animate`.

    - `textAreasAreResizable` boolean (optional) - Make TextArea elements resizable. Default is `true`.

    - `webgl` boolean (optional) - Enables WebGL support. Por padrão é `true`.

    - `plugins` boolean (optional) - Whether plugins should be enabled. Por padrão é `false`.

    - `experimentalFeatures` boolean (optional) - Enables Chromium's experimental features. Por padrão é `false`.

    - `scrollBounce` boolean (optional) *macOS* - Enables scroll bounce (rubber banding) effect on macOS. Por padrão é `false`.

    - `enableBlinkFeatures` string (optional) - A list of feature strings separated by `,`, like `CSSVariables,KeyboardEventKey` to enable. The full list of supported feature strings can be found in the [RuntimeEnabledFeatures.json5](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5) file.

    - `disableBlinkFeatures` string (optional) - A list of feature strings separated by `,`, like `CSSVariables,KeyboardEventKey` to disable. The full list of supported feature strings can be found in the [RuntimeEnabledFeatures.json5](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5) file.

    - `defaultFontFamily` Object (optional) - Sets the default font for the font-family.

      - `standard` string (optional) - Defaults to `Times New Roman`.

      - `serif` string (optional) - Defaults to `Times New Roman`.

      - `sansSerif` string (optional) - Defaults to `Arial`.

      - `monospace` string (optional) - Defaults to `Courier New`.

      - `cursive` string (optional) - Defaults to `Script`.

      - `fantasy` string (optional) - Defaults to `Impact`.

      - `math` string (optional) - Defaults to `Latin Modern Math`.

    - `defaultFontSize` Integer (optional) - Defaults to `16`.

    - `defaultMonospaceFontSize` Integer (optional) - Defaults to `13`.

    - `minimumFontSize` Integer (optional) - Defaults to `0`.

    - `defaultEncoding` string (optional) - Defaults to `ISO-8859-1`.

    - `backgroundThrottling` boolean (optional) - Whether to throttle animations and timers when the page becomes background. This also affects the [Page Visibility API](/pt/docs/latest/api/browser-window#page-visibility). When at least one [webContents](/pt/docs/latest/api/web-contents) displayed in a single [browserWindow](/pt/docs/latest/api/browser-window) has disabled `backgroundThrottling` then frames will be drawn and swapped for the whole window and other [webContents](/pt/docs/latest/api/web-contents) displayed by it. O padrão é `true`.

    - `offscreen` Object | boolean (optional) - Whether to enable offscreen rendering for the browser window. O padrão é `false`. See the [offscreen rendering tutorial](/pt/docs/latest/tutorial/offscreen-rendering) for more details.

      - `useSharedTexture` boolean (optional) *Experimental* - Whether to use GPU shared texture for accelerated paint event. O padrão é `false`. See the [offscreen rendering tutorial](/pt/docs/latest/tutorial/offscreen-rendering) for more details.

      - `sharedTexturePixelFormat` string (optional) *Experimental* - The requested output format of the shared texture. O padrão é `argb`. The name is originated from Chromium [`media::VideoPixelFormat`](https://source.chromium.org/chromium/chromium/src/+/main:media/base/video_types.h) enum suffix and only subset of them are supported. The actual output pixel format and color space of the texture should refer to [OffscreenSharedTexture](/pt/docs/latest/api/structures/offscreen-shared-texture) object in the `paint` event.

        - `argb` - The requested output texture format is 8-bit unorm RGBA, with SRGB SDR color space.

        - `rgbaf16` - The requested output texture format is 16-bit float RGBA, with scRGB HDR color space.

        - `nv12` - The requested output texture format is 12bpp with Y plane followed by a 2x2 interleaved UV plane, with REC709 color space.

      - `deviceScaleFactor` number (optional) *Experimental* - The device scale factor of the offscreen rendering output. If not set, will use `1` as default.

    - `contextIsolation` boolean (optional) - Whether to run Electron APIs and the specified `preload` script in a separate JavaScript context. Defaults to `true`. The context that the `preload` script runs in will only have access to its own dedicated `document` and `window` globals, as well as its own set of JavaScript builtins (`Array`, `Object`, `JSON`, etc.), which are all invisible to the loaded content. The Electron API will only be available in the `preload` script and not the loaded page. This option should be used when loading potentially untrusted remote content to ensure the loaded content cannot tamper with the `preload` script and any Electron APIs being used.  This option uses the same technique used by [Chrome Content Scripts](https://developer.chrome.com/extensions/content_scripts#execution-environment).  You can access this context in the dev tools by selecting the 'Electron Isolated Context' entry in the combo box at the top of the Console tab.

    - `webviewTag` boolean (optional) - Whether to enable the [`<webview>` tag](/pt/docs/latest/api/webview-tag). O padrão é `false`. **Note:** The `preload` script configured for the `<webview>` will have node integration enabled when it is executed so you should ensure remote/untrusted content is not able to create a `<webview>` tag with a possibly malicious `preload` script. You can use the `will-attach-webview` event on [webContents](/pt/docs/latest/api/web-contents) to strip away the `preload` script and to validate or alter the `<webview>`'s initial settings.

    - `additionalArguments` string[] (optional) - A list of strings that will be appended to `process.argv` in the renderer process of this app.  Useful for passing small bits of data down to renderer process preload scripts.

    - `safeDialogs` boolean (optional) - Whether to enable browser style consecutive dialog protection. Por padrão é `false`.

    - `safeDialogsMessage` string (optional) - The message to display when consecutive dialog protection is triggered. If not defined the default message would be used, note that currently the default message is in English and not localized.

    - `disableDialogs` boolean (optional) - Whether to disable dialogs completely. Overrides `safeDialogs`. Por padrão é `false`.

    - `navigateOnDragDrop` boolean (optional) - Whether dragging and dropping a file or link onto the page causes a navigation. Por padrão é `false`.

    - `autoplayPolicy` string (optional) - Autoplay policy to apply to content in the window, can be `no-user-gesture-required`, `user-gesture-required`, `document-user-activation-required`. Padrão sendo `no-user-gesture-required`.

    - `disableHtmlFullscreenWindowResize` boolean (optional) - Whether to prevent the window from resizing when entering HTML Fullscreen. Default is `false`.

    - `accessibleTitle` string (optional) - An alternative title string provided only to accessibility tools such as screen readers. This string is not directly visible to users.

    - `spellcheck` boolean (optional) - Whether to enable the builtin spellchecker. Por padrão é `true`.

    - `enableWebSQL` boolean (optional) - Whether to enable the [WebSQL api](https://www.w3.org/TR/webdatabase/). Por padrão é `true`.

    - `v8CacheOptions` string (optional) - Enforces the v8 code caching policy used by blink. Accepted values are

      - `none` - Disables code caching

      - `code` - Heuristic based code caching

      - `bypassHeatCheck` - Bypass code caching heuristics but with lazy compilation

      - `bypassHeatCheckAndEagerCompile` - Same as above except compilation is eager. Default policy is `code`.

    - `enablePreferredSizeMode` boolean (optional) - Whether to enable preferred size mode. The preferred size is the minimum size needed to contain the layout of the document—without requiring scrolling. Enabling this will cause the `preferred-size-changed` event to be emitted on the `WebContents` when the preferred size changes. Por padrão é `false`.

    - `transparent` boolean (optional) - Whether to enable background transparency for the guest page. Por padrão é `true`. **Note:** The guest page's text and background colors are derived from the [color scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) of its root element. When transparency is enabled, the text color will still change accordingly but the background will remain transparent.

    - `enableDeprecatedPaste` boolean (optional) *Deprecated* - Whether to enable the `paste` [execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand). Por padrão é `false`.

    - `focusOnNavigation` boolean (optional) - Whether to focus the WebContents when navigating. Por padrão é `true`.

  - `paintWhenInitiallyHidden` boolean (optional) - Whether the renderer should be active when `show` is `false` and it has just been created.  In order for `document.visibilityState` to work correctly on first load with `show: false` you should set this to `false`.  Setting this to `false` will cause the `ready-to-show` event to not fire.  Por padrão é `true`.

### Eventos de instância

Objects created with `new BrowserWindow` emit the following events:

> 

[!NOTE] Some events are only available on specific operating systems and are labeled as such.

#### Evento: 'page-title-updated'

Retorna:

- `event` Event

- `title` string

- `explicitSet` boolean

Emitido quando o documento mudou seu título, chamando `event.preventDefault()` impedirá que o título da janela nativa mude. `explicitSet` is false when title is synthesized from file URL.

#### Evento: 'close'

Retorna:

- `event` Event

Emitted when the window is going to be closed. It's emitted before the `beforeunload` and `unload` event of the DOM. Calling `event.preventDefault()` will cancel the close.

Usually you would want to use the `beforeunload` handler to decide whether the window should be closed, which will also be called when the window is reloaded. In Electron, returning any value other than `undefined` would cancel the close. Como por exemplo:

```javascript
window.onbeforeunload = (e) => {  
  console.log('I do not want to be closed')  
  
  // Unlike usual browsers that a message box will be prompted to users, returning  
  // a non-void value will silently cancel the close.  
  // It is recommended to use the dialog API to let the user confirm closing the  
  // application.  
  e.returnValue = false  
}  

```

> 

[!NOTE] There is a subtle difference between the behaviors of `window.onbeforeunload = handler` and `window.addEventListener('beforeunload', handler)`. It is recommended to always set the `event.returnValue` explicitly, instead of only returning a value, as the former works more consistently within Electron.

#### Evento: 'closed'

Emitted when the window is closed. After you have received this event you should remove the reference to the window and avoid using it any more.

#### Event: 'query-session-end' *Windows*

Retorna:

- `event` [WindowSessionEndEvent](/pt/docs/latest/api/structures/window-session-end-event)

Emitted when a session is about to end due to a shutdown, machine restart, or user log-off. Calling `event.preventDefault()` can delay the system shutdown, though it’s generally best to respect the user’s choice to end the session. However, you may choose to use it if ending the session puts the user at risk of losing data.

#### Evento: 'session-end' *Windows*

Retorna:

- `event` [WindowSessionEndEvent](/pt/docs/latest/api/structures/window-session-end-event)

Emitted when a session is about to end due to a shutdown, machine restart, or user log-off. Once this event fires, there is no way to prevent the session from ending.

#### Evento: 'unresponsive'

Emitted when the web page becomes unresponsive.

#### Evento: 'responsive'

Emitted when the unresponsive web page becomes responsive again.

#### Evento: 'blur'

Emitted when the window loses focus.

#### Evento: 'focus'

Emitted when the window gains focus.

#### Evento: 'show'

Emitted when the window is shown.

#### Evento: 'hide'

Emitted when the window is hidden.

#### Evento: 'ready-to-show'

Emitted when the web page has been rendered (while not being shown) and window can be displayed without a visual flash.

Please note that using this event implies that the renderer will be considered "visible" and paint even though `show` is false.  This event will never fire if you use `paintWhenInitiallyHidden: false`

#### Evento: 'maximize'

Emitted when window is maximized.

#### Evento: 'unmaximize'

Emitted when the window exits from a maximized state.

#### Evento: 'minimize'

Emitted when the window is minimized.

> 

[!NOTE] On Wayland, “minimized” is not currently a supported state. The minimize event will only fire when triggered by client-side decoration (e.g. clicking the minimize button on a frameless window’s Window Control Overlay)

#### Evento: 'restore'

Emitted when the window is restored from a minimized state.

#### Event: 'will-resize' *macOS* *Windows*

Retorna:

- `event` Event

- `newBounds` [Rectangle](/pt/docs/latest/api/structures/rectangle) - Size the window is being resized to.

- Objeto `details`

  - `edge` (string) - The edge of the window being dragged for resizing. Can be `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left` or `bottom-right`.

Emitted before the window is resized. Calling `event.preventDefault()` will prevent the window from being resized.

Note that this is only emitted when the window is being resized manually. Resizing the window with `setBounds`/`setSize` will not emit this event.

The possible values and behaviors of the `edge` option are platform dependent. Possible values are:

- On Windows, possible values are `bottom`, `top`, `left`, `right`, `top-left`, `top-right`, `bottom-left`, `bottom-right`.

- On macOS, possible values are `bottom` and `right`.

  - The value `bottom` is used to denote vertical resizing.

  - The value `right` is used to denote horizontal resizing.

#### Evento: 'resize'

Emitted after the window has been resized.

#### Event: 'resized' *macOS* *Windows*

Emitted once when the window has finished being resized.

This is usually emitted when the window has been resized manually. On macOS, resizing the window with `setBounds`/`setSize` and setting the `animate` parameter to `true` will also emit this event once resizing has finished.

#### Event: 'will-move' *macOS* *Windows*

Retorna:

- `event` Event

- `newBounds` [Rectangle](/pt/docs/latest/api/structures/rectangle) - Location the window is being moved to.

Emitted before the window is moved. On Windows, calling `event.preventDefault()` will prevent the window from being moved.

Note that this is only emitted when the window is being moved manually. Moving the window with `setPosition`/`setBounds`/`center` will not emit this event.

#### Evento: 'move'

Emitted when the window is being moved to a new position.

#### Event: 'moved' *macOS* *Windows*

Emitted once when the window is moved to a new position.

> 

[!NOTE] On macOS, this event is an alias of `move`.

#### Evento: 'enter-full-screen'

Emitted when the window enters a full-screen state.

#### Evento: 'leave-full-screen'

Emitted when the window leaves a full-screen state.

#### Evento: 'enter-html-full-screen'

Emitted when the window enters a full-screen state triggered by HTML API.

#### Evento: 'leave-html-full-screen'

Emitted when the window leaves a full-screen state triggered by HTML API.

#### Evento: 'always-on-top-changed'

Retorna:

- `event` Event

- `isAlwaysOnTop` boolean

Emitted when the window is set or unset to show always on top of other windows.

#### Event: 'app-command' *Windows* *Linux*

Retorna:

- `event` Event

- `command` string

Emitted when an [App Command](https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-appcommand) is invoked. These are typically related to keyboard media keys or browser commands, as well as the "Back" button built into some mice on Windows.

Commands are lowercased, underscores are replaced with hyphens, and the `APPCOMMAND_` prefix is stripped off. e.g. `APPCOMMAND_BROWSER_BACKWARD` is emitted as `browser-backward`.

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow()  
win.on('app-command', (e, cmd) => {  
  // Navigate the window back when the user hits their mouse back button  
  if (cmd === 'browser-backward' && win.webContents.canGoBack()) {  
    win.webContents.goBack()  
  }  
})  

```

The following app commands are explicitly supported on Linux:

- `browser-backward`

- `browser-forward`

#### Event: 'swipe' *macOS*

Retorna:

- `event` Event

- `direction` string

Emitted on 3-finger swipe. Possible directions are `up`, `right`, `down`, `left`.

The method underlying this event is built to handle older macOS-style trackpad swiping, where the content on the screen doesn't move with the swipe. Most macOS trackpads are not configured to allow this kind of swiping anymore, so in order for it to emit properly the 'Swipe between pages' preference in `System Preferences > Trackpad > More Gestures` must be set to 'Swipe with two or three fingers'.

#### Event: 'rotate-gesture' *macOS*

Retorna:

- `event` Event

- `rotation` Float

Emitted on trackpad rotation gesture. Continually emitted until rotation gesture is ended. The `rotation` value on each emission is the angle in degrees rotated since the last emission. The last emitted event upon a rotation gesture will always be of value `0`. Counter-clockwise rotation values are positive, while clockwise ones are negative.

#### Event: 'sheet-begin' *macOS*

Emitted when the window opens a sheet.

#### Event: 'sheet-end' *macOS*

Emitted when the window has closed a sheet.

#### Evento: 'new-window-for-tab' *macOS*

Emitted when the user clicks the native macOS new tab button. The new tab button is only visible if the current `BrowserWindow` has a `tabbingIdentifier`.

You must create a window in this handler in order for macOS tabbing to work as expected.

#### Event: 'system-context-menu' *Windows* *Linux*

Retorna:

- `event` Event

- `point` [Point](/pt/docs/latest/api/structures/point) - The screen coordinates where the context menu was triggered.

Emitted when the system context menu is triggered on the window, this is normally only triggered when the user right clicks on the non-client area of your window.  This is the window titlebar or any area you have declared as `-webkit-app-region: drag` in a frameless window.

Calling `event.preventDefault()` will prevent the menu from being displayed.

To convert `point` to DIP, use [`screen.screenToDipPoint(point)`](/pt/docs/latest/api/screen#screenscreentodippointpoint-windows-linux).

### Métodos estáticos

A classe `BrowserWindow` tem os seguintes métodos estáticos:

#### `BrowserWindow.getAllWindows()`

Returns `BrowserWindow[]` - An array of all opened browser windows.

#### `BrowserWindow.getFocusedWindow()`

Returns `BrowserWindow | null` - The window that is focused in this application, otherwise returns `null`.

#### `BrowserWindow.fromWebContents(webContents)`

- `webContents` [WebContents](/pt/docs/latest/api/web-contents)

Returns `BrowserWindow | null` - The window that owns the given `webContents` or `null` if the contents are not owned by a window.

#### `BrowserWindow.fromBrowserView(browserView)` *Descontinuado*

- `browserView` [BrowserView](/pt/docs/latest/api/browser-view)

> 

[!NOTE] The `BrowserView` class is deprecated, and replaced by the new [`WebContentsView`](/pt/docs/latest/api/web-contents-view) class.

Returns `BrowserWindow | null` - The window that owns the given `browserView`. If the given view is not attached to any window, returns `null`.

#### `BrowserWindow.fromId(id)`

- `id` Inteiro

Returns `BrowserWindow | null` - The window with the given `id`.

### Propriedades da Instância

Objectos criados com `new BrowserWindow` posuem as seguintes propriedades:

```javascript
const { BrowserWindow } = require('electron')  
// In this example `win` is our instance  
const win = new BrowserWindow({ width: 800, height: 600 })  
win.loadURL('https://github.com')  

```

#### `win.webContents` *Readonly*

A `WebContents` object this window owns. All web page related events and operations will be done via it.

See the [`webContents` documentation](/pt/docs/latest/api/web-contents) for its methods and events.

#### `win.id` *Readonly*

A `Integer` property representing the unique ID of the window. Each ID is unique among all `BrowserWindow` instances of the entire Electron application.

#### `win.tabbingIdentifier` *macOS* *Readonly*

A `string` (optional) property that is equal to the `tabbingIdentifier` passed to the `BrowserWindow` constructor or `undefined` if none was set.

#### `win.autoHideMenuBar` *Linux* *Windows*

A `boolean` property that determines whether the window menu bar should hide itself automatically. Once set, the menu bar will only show when users press the single `Alt` key.

If the menu bar is already visible, setting this property to `true` won't hide it immediately.

#### `win.simpleFullScreen`

A `boolean` property that determines whether the window is in simple (pre-Lion) fullscreen mode.

#### `win.fullScreen`

A `boolean` property that determines whether the window is in fullscreen mode.

#### `win.focusable` *Windows* *macOS*

A `boolean` property that determines whether the window is focusable.

#### `win.visibleOnAllWorkspaces` *macOS* *Linux*

A `boolean` property that determines whether the window is visible on all workspaces.

> 

[!NOTE] Always returns false on Windows.

#### `win.shadow`

A `boolean` property that determines whether the window has a shadow.

#### `win.menuBarVisible` *Windows* *Linux*

A `boolean` property that determines whether the menu bar should be visible.

> 

[!NOTE] If the menu bar is auto-hide, users can still bring up the menu bar by pressing the single `Alt` key.

#### `win.kiosk`

A `boolean` property that determines whether the window is in kiosk mode.

#### `win.documentEdited` *macOS*

A `boolean` property that specifies whether the window’s document has been edited.

The icon in title bar will become gray when set to `true`.

#### `win.representedFilename` *macOS*

A `string` property that determines the pathname of the file the window represents, and the icon of the file will show in window's title bar.

#### `win.title`

A `string` property that determines the title of the native window.

> 

[!NOTE] The title of the web page can be different from the title of the native window.

#### `win.minimizable` *macOS* *Windows*

A `boolean` property that determines whether the window can be manually minimized by user.

On Linux the setter is a no-op, although the getter returns `true`.

#### `win.maximizable` *macOS* *Windows*

A `boolean` property that determines whether the window can be manually maximized by user.

On Linux the setter is a no-op, although the getter returns `true`.

#### `win.fullScreenable`

A `boolean` property that determines whether the maximize/zoom window button toggles fullscreen mode or maximizes the window.

#### `win.resizable`

A `boolean` property that determines whether the window can be manually resized by user.

#### `win.closable` *macOS* *Windows*

A `boolean` property that determines whether the window can be manually closed by user.

On Linux the setter is a no-op, although the getter returns `true`.

#### `win.movable` *macOS* *Windows*

A `boolean` property that determines Whether the window can be moved by user.

On Linux the setter is a no-op, although the getter returns `true`.

#### `win.excludedFromShownWindowsMenu` *macOS*

A `boolean` property that determines whether the window is excluded from the application’s Windows menu. `false` by default.

```javascript
const win = new BrowserWindow({ height: 600, width: 600 })  
  
const template = [  
  {  
    role: 'windowmenu'  
  }  
]  
  
win.excludedFromShownWindowsMenu = true  
  
const menu = Menu.buildFromTemplate(template)  
Menu.setApplicationMenu(menu)  

```

#### `win.accessibleTitle`

A `string` property that defines an alternative title provided only to accessibility tools such as screen readers. This string is not directly visible to users.

#### `win.snapped` *Windows* *Readonly*

A `boolean` property that indicates whether the window is arranged via [Snap.](https://support.microsoft.com/en-us/windows/snap-your-windows-885a9b1e-a983-a3b1-16cd-c531795e6241)

### Métodos de Instância

Objectos criados com `new BrowserWindow` possuem os seguintes métodos de instâncias:

> 

[!NOTE] Some methods are only available on specific operating systems and are labeled as such.

#### `win.destroy()`

Force closing the window, the `unload` and `beforeunload` event won't be emitted for the web page, and `close` event will also not be emitted for this window, but it guarantees the `closed` event will be emitted.

#### `win.close()`

Try to close the window. This has the same effect as a user manually clicking the close button of the window. The web page may cancel the close though. See the [close event](#event-close).

#### `win.focus()`

Focuses on the window.

On Wayland (Linux), the desktop environment may show a notification or flash the app icon if the window or app is not already focused.

#### `win.blur()`

Removes focus from the window.

Not supported on Wayland (Linux).

#### `win.isFocused()`

Returns `boolean` - Whether the window is focused.

#### `win.isDestroyed()`

Returns `boolean` - Whether the window is destroyed.

#### `win.show()`

Shows and gives focus to the window.

#### `win.showInactive()`

Shows the window but doesn't focus on it.

Not supported on Wayland (Linux).

#### `win.hide()`

Hides the window.

#### `win.isVisible()`

Returns `boolean` - Whether the window is visible to the user in the foreground of the app.

#### `win.isModal()`

Returns `boolean` - Whether current window is a modal window.

#### `win.maximize()`

Maximizes the window. This will also show (but not focus) the window if it isn't being displayed already.

#### `win.unmaximize()`

Unmaximizes the window.

#### `win.isMaximized()`

Returns `boolean` - Whether the window is maximized.

#### `win.minimize()`

Minimizes the window. On some platforms the minimized window will be shown in the Dock.

#### `win.restore()`

Restores the window from minimized state to its previous state.

#### `win.isMinimized()`

Returns `boolean` - Whether the window is minimized.

#### `win.setFullScreen(flag)`

- `flag` boolean

Sets whether the window should be in fullscreen mode.

> 

[!NOTE] On macOS, fullscreen transitions take place asynchronously. If further actions depend on the fullscreen state, use the ['enter-full-screen'](/pt/docs/latest/api/browser-window#event-enter-full-screen) or ['leave-full-screen'](/pt/docs/latest/api/browser-window#event-leave-full-screen) events.

#### `win.isFullScreen()`

Returns `boolean` - Whether the window is in fullscreen mode.

> 

[!NOTE] On macOS, fullscreen transitions take place asynchronously. When querying for a BrowserWindow's fullscreen status, you should ensure that either the ['enter-full-screen'](/pt/docs/latest/api/browser-window#event-enter-full-screen) or ['leave-full-screen'](/pt/docs/latest/api/browser-window#event-leave-full-screen) events have been emitted.

#### `win.setSimpleFullScreen(flag)` *macOS*

- `flag` boolean

Enters or leaves simple fullscreen mode.

Simple fullscreen mode emulates the native fullscreen behavior found in versions of macOS prior to Lion (10.7).

#### `win.isSimpleFullScreen()` *macOS*

Returns `boolean` - Whether the window is in simple (pre-Lion) fullscreen mode.

#### `win.isNormal()`

Returns `boolean` - Whether the window is in normal state (not maximized, not minimized, not in fullscreen mode).

#### `win.setAspectRatio(aspectRatio[, extraSize])`

- `aspectRatio` Float - The aspect ratio to maintain for some portion of the content view.

- `extraSize` [Size](/pt/docs/latest/api/structures/size) (optional) *macOS* - The extra size not to be included while maintaining the aspect ratio.

This will make a window maintain an aspect ratio. The extra size allows a developer to have space, specified in pixels, not included within the aspect ratio calculations. This API already takes into account the difference between a window's size and its content size.

Consider a normal window with an HD video player and associated controls. Perhaps there are 15 pixels of controls on the left edge, 25 pixels of controls on the right edge and 50 pixels of controls below the player. In order to maintain a 16:9 aspect ratio (standard aspect ratio for HD @1920x1080) within the player itself we would call this function with arguments of 16/9 and { width: 40, height: 50 }. The second argument doesn't care where the extra width and height are within the content view--only that they exist. Sum any extra width and height areas you have within the overall content view.

The aspect ratio is not respected when window is resized programmatically with APIs like `win.setSize`.

To reset an aspect ratio, pass 0 as the `aspectRatio` value: `win.setAspectRatio(0)`.

#### `win.setBackgroundColor(backgroundColor)`

- `backgroundColor` string - Color in Hex, RGB, RGBA, HSL, HSLA or named CSS color format. The alpha channel is optional for the hex type.

Examples of valid `backgroundColor` values:

- Hex

  - #fff (shorthand RGB)

  - #ffff (shorthand ARGB)

  - #ffffff (RGB)

  - #ffffffff (ARGB)

- RGB

  - `rgb\(([\d]+),\s*([\d]+),\s*([\d]+)\)`

    - e.g. rgb(255, 255, 255)

- RGBA

  - `rgba\(([\d]+),\s*([\d]+),\s*([\d]+),\s*([\d.]+)\)`

    - e.g. rgba(255, 255, 255, 1.0)

- HSL

  - `hsl\((-?[\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)`

    - e.g. hsl(200, 20%, 50%)

- HSLA

  - `hsla\((-?[\d.]+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)`

    - e.g. hsla(200, 20%, 50%, 0.5)

- Color name

  - Options are listed in [SkParseColor.cpp](https://source.chromium.org/chromium/chromium/src/+/main:third_party/skia/src/utils/SkParseColor.cpp;l=11-152;drc=eea4bf52cb0d55e2a39c828b017c80a5ee054148)

  - Similar to CSS Color Module Level 3 keywords, but case-sensitive.

    - e.g. `blueviolet` or `red`

Sets the background color of the window. See [Setting `backgroundColor`](#setting-the-backgroundcolor-property).

#### `win.previewFile(path[, displayName])` *macOS*

- `path` string - The absolute path to the file to preview with QuickLook. This is important as Quick Look uses the file name and file extension on the path to determine the content type of the file to open.

- `displayName` string (optional) - The name of the file to display on the Quick Look modal view. This is purely visual and does not affect the content type of the file. O padrão é `path`.

Uses [Quick Look](https://en.wikipedia.org/wiki/Quick_Look) to preview a file at a given path.

#### `win.closeFilePreview()` *macOS*

Closes the currently open [Quick Look](https://en.wikipedia.org/wiki/Quick_Look) panel.

#### `win.setBounds(bounds[, animate])`

- `bounds` Partial<[Rectangle](/pt/docs/latest/api/structures/rectangle)>

- `animate` boolean (optional) *macOS*

Resizes and moves the window to the supplied bounds. Any properties that are not supplied will default to their current values.

On Wayland (Linux), has the same limitations as `setSize` and `setPosition`.

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow()  
  
// set all bounds properties  
win.setBounds({ x: 440, y: 225, width: 800, height: 600 })  
  
// set a single bounds property  
win.setBounds({ width: 100 })  
  
// { x: 440, y: 225, width: 100, height: 600 }  
console.log(win.getBounds())  

```

> 

[!NOTE] On macOS, the y-coordinate value cannot be smaller than the [Tray](/pt/docs/latest/api/tray) height. The tray height has changed over time and depends on the operating system, but is between 20-40px. Passing a value lower than the tray height will result in a window that is flush to the tray.

#### `win.getBounds()`

Returns [Rectangle](/pt/docs/latest/api/structures/rectangle) - The `bounds` of the window as `Object`.

> 

[!NOTE] On macOS, the y-coordinate value returned will be at minimum the [Tray](/pt/docs/latest/api/tray) height. For example, calling `win.setBounds({ x: 25, y: 20, width: 800, height: 600 })` with a tray height of 38 means that `win.getBounds()` will return `{ x: 25, y: 38, width: 800, height: 600 }`.

> 

[!NOTE] On Wayland, this method will return `{ x: 0, y: 0, ... }` as introspecting or programmatically changing the global window coordinates is prohibited.

#### `win.getBackgroundColor()`

Returns `string` - Gets the background color of the window in Hex (`#RRGGBB`) format.

See [Setting `backgroundColor`](#setting-the-backgroundcolor-property).

> 

[!NOTE] The alpha value is *not* returned alongside the red, green, and blue values.

#### `win.setContentBounds(bounds[, animate])`

- `bounds` [Rectangle](/pt/docs/latest/api/structures/rectangle)

- `animate` boolean (optional) *macOS*

Resizes and moves the window's client area (e.g. the web page) to the supplied bounds.

On Wayland (Linux), has the same limitations as `setContentSize` and `setPosition`.

#### `win.getContentBounds()`

Returns [Rectangle](/pt/docs/latest/api/structures/rectangle) - The `bounds` of the window's client area as `Object`.

#### `win.getNormalBounds()`

Returns [Rectangle](/pt/docs/latest/api/structures/rectangle) - Contains the window bounds of the normal state

> 

[!NOTE] Whatever the current state of the window (maximized, minimized or in fullscreen), this function always returns the position and size of the window in normal state. In normal state, `getBounds` and `getNormalBounds` return the same [Rectangle](/pt/docs/latest/api/structures/rectangle).

#### `win.setEnabled(enable)`

- `enable` boolean

Disable or enable the window.

#### `win.isEnabled()`

Returns `boolean` - whether the window is enabled.

#### `win.setSize(width, height[, animate])`

- `width` Integer

- `height` Integer

- `animate` boolean (optional) *macOS*

Resizes the window to `width` and `height`. If `width` or `height` are below any set minimum size constraints the window will snap to its minimum size.

On Wayland (Linux), may not work as some window managers restrict programmatic window resizing.

#### `win.getSize()`

Returns `Integer[]` - Contains the window's width and height.

#### `win.setContentSize(width, height[, animate])`

- `width` Integer

- `height` Integer

- `animate` boolean (optional) *macOS*

Resizes the window's client area (e.g. the web page) to `width` and `height`.

On Wayland (Linux), may not work as some window managers restrict programmatic window resizing.

#### `win.getContentSize()`

Returns `Integer[]` - Contains the window's client area's width and height.

#### `win.setMinimumSize(width, height)`

- `width` Integer

- `height` Integer

Sets the minimum size of window to `width` and `height`.

#### `win.getMinimumSize()`

Returns `Integer[]` - Contains the window's minimum width and height.

#### `win.setMaximumSize(width, height)`

- `width` Integer

- `height` Integer

Sets the maximum size of window to `width` and `height`.

#### `win.getMaximumSize()`

Returns `Integer[]` - Contains the window's maximum width and height.

#### `win.setResizable(resizable)`

- `resizable` boolean

Sets whether the window can be manually resized by the user.

#### `win.isResizable()`

Returns `boolean` - Whether the window can be manually resized by the user.

#### `win.setMovable(movable)` *macOS* *Windows*

- `movable` boolean

Sets whether the window can be moved by user. On Linux does nothing.

#### `win.isMovable()` *macOS* *Windows*

Returns `boolean` - Whether the window can be moved by user.

On Linux always returns `true`.

#### `win.setMinimizable(minimizable)` *macOS* *Windows*

- `minimizable` boolean

Sets whether the window can be manually minimized by user. On Linux does nothing.

#### `win.isMinimizable()` *macOS* *Windows*

Returns `boolean` - Whether the window can be manually minimized by the user.

On Linux always returns `true`.

#### `win.setMaximizable(maximizable)` *macOS* *Windows*

- `maximizable` boolean

Sets whether the window can be manually maximized by user. On Linux does nothing.

#### `win.isMaximizable()` *macOS* *Windows*

Returns `boolean` - Whether the window can be manually maximized by user.

On Linux always returns `true`.

#### `win.setFullScreenable(fullscreenable)`

- `fullscreenable` boolean

Sets whether the maximize/zoom window button toggles fullscreen mode or maximizes the window.

#### `win.isFullScreenable()`

Returns `boolean` - Whether the maximize/zoom window button toggles fullscreen mode or maximizes the window.

#### `win.setClosable(closable)` *macOS* *Windows*

- `closable` boolean

Sets whether the window can be manually closed by user. On Linux does nothing.

#### `win.isClosable()` *macOS* *Windows*

Returns `boolean` - Whether the window can be manually closed by user.

On Linux always returns `true`.

#### `win.setHiddenInMissionControl(hidden)` *macOS*

- `hidden` boolean

Sets whether the window will be hidden when the user toggles into mission control.

#### `win.isHiddenInMissionControl()` *macOS*

Returns `boolean` - Whether the window will be hidden when the user toggles into mission control.

#### `win.setAlwaysOnTop(flag[, level][, relativeLevel])`

- `flag` boolean

- `level` string (optional) *macOS* *Windows* - Values include `normal`, `floating`, `torn-off-menu`, `modal-panel`, `main-menu`, `status`, `pop-up-menu`, `screen-saver`, and `dock` (Deprecated). The default is `floating` when `flag` is true. The `level` is reset to `normal` when the flag is false. Note that from `floating` to `status` included, the window is placed below the Dock on macOS and below the taskbar on Windows. From `pop-up-menu` to a higher it is shown above the Dock on macOS and above the taskbar on Windows. See the [macOS docs](https://developer.apple.com/documentation/appkit/nswindow/level) for more details.

- `relativeLevel` Integer (optional) *macOS* - The number of layers higher to set this window relative to the given `level`. O padrão é `0`. Note that Apple discourages setting levels higher than 1 above `screen-saver`.

Sets whether the window should show always on top of other windows. After setting this, the window is still a normal window, not a toolbox window which can not be focused on.

#### `win.isAlwaysOnTop()`

Returns `boolean` - Whether the window is always on top of other windows.

#### `win.moveAbove(mediaSourceId)`

- `mediaSourceId` string - Window id in the format of DesktopCapturerSource's id. For example "window:1869:0".

Moves window above the source window in the sense of z-order. If the `mediaSourceId` is not of type window or if the window does not exist then this method throws an error.

#### `win.moveTop()`

Moves window to top(z-order) regardless of focus.

Not supported on Wayland (Linux).

#### `win.center()`

Moves window to the center of the screen.

Not supported on Wayland (Linux).

#### `win.setPosition(x, y[, animate])`

- `x` Integer

- `y` Integer

- `animate` boolean (optional) *macOS*

Moves window to `x` and `y`.

Not supported on Wayland (Linux).

#### `win.getPosition()`

Returns `Integer[]` - Contains the window's current position.

> 

[!NOTE] On Wayland, this method will return `[0, 0]` as introspecting or programmatically changing the global window coordinates is prohibited.

#### `win.setTitle(title)`

- `title` string

Changes the title of native window to `title`.

#### `win.getTitle()`

Returns `string` - The title of the native window.

> 

[!NOTE] The title of the web page can be different from the title of the native window.

#### `win.setSheetOffset(offsetY[, offsetX])` *macOS*

- `offsetY` Float

- `offsetX` Float (optional)

Changes the attachment point for sheets on macOS. By default, sheets are attached just below the window frame, but you may want to display them beneath a HTML-rendered toolbar. Como por exemplo:

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow()  
  
const toolbarRect = document.getElementById('toolbar').getBoundingClientRect()  
win.setSheetOffset(toolbarRect.height)  

```

#### `win.flashFrame(flag)`

History[``](/docs/latest/breaking-changes#behavior-changed-windowflashframebool-will-flash-dock-icon-continuously-on-macos)

- ``

#### ``****

- ``

#### ``

- ``

#### ``
``

#### ``**
``[](https://support.microsoft.com/en-us/help/17210/windows-10-use-your-pc-like-a-tablet)``

#### ``
``````````````````

#### ``
``````````

#### ``**

- ``
- ``

  - ````
  - ````

``

#### ``**

- ``
``````

#### ``**

- ``

#### ``**

#### ``**

- ``

#### ``**
``

#### ``**

- ``
``

#### ``**
``

#### ``

#### ``

#### ``

- ``[](/pt/docs/latest/api/structures/rectangle)
- ``

  - ````
  - ````

``[](/pt/docs/latest/api/native-image)````````

#### ``

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/referrer)
  - ``
  - ``
  - ``[](/pt/docs/latest/api/structures/upload-raw-data)[](/pt/docs/latest/api/structures/upload-file)
  - ````

``[``](/pt/docs/latest/api/web-contents#event-did-finish-load)[``](/pt/docs/latest/api/web-contents#event-did-fail-load)[``](/pt/docs/latest/api/web-contents#event-did-fail-load)[``](/pt/docs/latest/api/web-contents#event-did-fail-load)[``](/pt/docs/latest/api/web-contents#contentsloadurlurl-options)``````[``](https://nodejs.org/api/url.html#url_url_format_urlobject)

```javascript
  
  
  
  
  
  
  
  
  
  
  

```
``

```javascript
  
  
  
  
  
  
  
  
  
  
  

```

#### ``

- ``
- ``

  - ````
  - ````
  - ````

``[``](/pt/docs/latest/api/web-contents#event-did-finish-load)[``](/pt/docs/latest/api/web-contents#event-did-fail-load)``````

#### ``
``

#### ``****

- ``
``

#### ``****

#### ``

- ``
- ``

  - ``**``````````

``````````````````````

#### ``**

- ``[](/pt/docs/latest/api/native-image)``
- ``

#### ``**
``

#### ``

- ``

#### ``
``

#### ``****

- ``

#### ``
``

#### ``******

- ``[](/pt/docs/latest/api/structures/rectangle)

#### ``**

- ``[](/pt/docs/latest/api/structures/thumbar-button)
````````

- ``

  - ``[](/pt/docs/latest/api/native-image)
  - ``
  - ``
  - ````

````

- ``
- ``
- ``
- ``
- ``
- ``

#### ``**

- ``[](/pt/docs/latest/api/structures/rectangle)
``

#### ``**

- ``

#### ``**

- ``

  - ``[](https://learn.microsoft.com/en-us/windows/win32/shell/appids)
  - ``[](https://learn.microsoft.com/en-us/windows/win32/properties/props-system-appusermodel-relaunchiconresource)
  - ````````
  - ``[](https://learn.microsoft.com/en-us/windows/win32/properties/props-system-appusermodel-relaunchcommand)
  - ``[](https://learn.microsoft.com/en-us/windows/win32/properties/props-system-appusermodel-relaunchdisplaynameresource)

> [!NOTE]
> 

> 

> ````

#### ``**

- ````
``

- ****``
- **``**``
- **``**
- **``**

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```

#### ``**
``````

#### ``**
``

#### ``****

- ``[](/pt/docs/latest/api/native-image)

#### ``**

- ``

#### ``****

- ``
````

#### ``****
``

#### ``****

- ``
``

#### ``****
``

#### ``**
``[](https://support.microsoft.com/en-us/windows/snap-your-windows-885a9b1e-a983-a3b1-16cd-c531795e6241)

#### ``****

- ``
- ``

  - ``**
  - ``**

> 

#### ``****
``

> 

#### ``

- ``
- ``

  - ``****``````

#### ``****

- ``
[``](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwindowdisplayaffinity)``````[``](https://developer.apple.com/documentation/appkit/nswindow/sharingtype-swift.property?language=objc)[``](https://developer.apple.com/documentation/appkit/nswindow/sharingtype-swift.enum/none?language=objc)````[](https://github.com/electron/electron/issues/48258#issuecomment-3269893618)

#### ``****
``

#### ``****

- ``

#### ``****
``

#### ``

- ``
````

#### ``
````

#### ``
``

#### ``**

- ``

#### ``**

#### ``**

#### ``**

#### ``**

#### ``**

#### ``**

#### ``**

- ``

#### ``**

- ``````````````````````````````[](https://developer.apple.com/documentation/appkit/nsvisualeffectview?preferredLanguage=objc)
- ``

  - ``

````

#### ``**

- ``

  - ``
  - ``
  - ``
  - ``
  - ``

[](https://learn.microsoft.com/en-us/windows/win32/api/dwmapi/ne-dwmapi-dwm_systembackdrop_type)

> 

#### ``**

- ``[](/pt/docs/latest/api/structures/point)
``

#### ``**
````

#### ``**

- ``
````

> 

#### ``****

- ``[](/pt/docs/latest/api/browser-view)``````

> ``[``](/pt/docs/latest/api/web-contents-view)

#### ``****
``````````

> ``[``](/pt/docs/latest/api/web-contents-view)

#### ``****

- ``[](/pt/docs/latest/api/browser-view)

> ``[``](/pt/docs/latest/api/web-contents-view)

#### ``****

- ``[](/pt/docs/latest/api/browser-view)

> ``[``](/pt/docs/latest/api/web-contents-view)

#### ``****

- ``[](/pt/docs/latest/api/browser-view)
``````````

> ``[``](/pt/docs/latest/api/web-contents-view)

#### ``****
``````

> ``[``](/pt/docs/latest/api/web-contents-view)

#### ``****

- ``

  - ``
  - ``
  - ``

````[](https://github.com/electron/electron/edit/main/docs/api/browser-window.md)[](/pt/docs/latest/api/browser-view)[](/pt/docs/latest/api/clipboard)

- 
- 

  - [``](#using-the-ready-to-show-event)
  - [``](#setting-the-backgroundcolor-property)

- 
- 
- 
- 
- [``](#class-browserwindow-extends-basewindow)

  - [``](#new-browserwindowoptions)
  - 

    - 
    - 
    - 
    - [``](#event-query-session-end-windows)
    - [**](#evento-session-end-windows)
    - 
    - 
    - 
    - 
    - 
    - 
    - 
    - 
    - 
    - 
    - 
    - [``](#event-will-resize-macos-windows)
    - 
    - [``](#event-resized-macos-windows)
    - [``](#event-will-move-macos-windows)
    - 
    - [``](#event-moved-macos-windows)
    - 
    - 
    - 
    - 
    - 
    - [``](#event-app-command-windows-linux)
    - [``](#event-swipe-macos)
    - [``](#event-rotate-gesture-macos)
    - [``](#event-sheet-begin-macos)
    - [``](#event-sheet-end-macos)
    - [**](#evento-new-window-for-tab-macos)
    - [``](#event-system-context-menu-windows-linux)

  - 

    - [``](#browserwindowgetallwindows)
    - [``](#browserwindowgetfocusedwindow)
    - [``](#browserwindowfromwebcontentswebcontents)
    - [``](#browserwindowfrombrowserviewbrowserview-descontinuado)
    - [``](#browserwindowfromidid)

  - 

    - [``](#winwebcontents-readonly)
    - [``](#winid-readonly)
    - [``](#wintabbingidentifier-macos-readonly)
    - [``](#winautohidemenubar-linux-windows)
    - [``](#winsimplefullscreen)
    - [``](#winfullscreen)
    - [``](#winfocusable-windows-macos)
    - [``](#winvisibleonallworkspaces-macos-linux)
    - [``](#winshadow)
    - [``](#winmenubarvisible-windows-linux)
    - [``](#winkiosk)
    - [``](#windocumentedited-macos)
    - [``](#winrepresentedfilename-macos)
    - [``](#wintitle)
    - [``](#winminimizable-macos-windows)
    - [``](#winmaximizable-macos-windows)
    - [``](#winfullscreenable)
    - [``](#winresizable)
    - [``](#winclosable-macos-windows)
    - [``](#winmovable-macos-windows)
    - [``](#winexcludedfromshownwindowsmenu-macos)
    - [``](#winaccessibletitle)
    - [``](#winsnapped-windows-readonly)

  - 

    - [``](#windestroy)
    - [``](#winclose)
    - [``](#winfocus)
    - [``](#winblur)
    - [``](#winisfocused)
    - [``](#winisdestroyed)
    - [``](#winshow)
    - [``](#winshowinactive)
    - [``](#winhide)
    - [``](#winisvisible)
    - [``](#winismodal)
    - [``](#winmaximize)
    - [``](#winunmaximize)
    - [``](#winismaximized)
    - [``](#winminimize)
    - [``](#winrestore)
    - [``](#winisminimized)
    - [``](#winsetfullscreenflag)
    - [``](#winisfullscreen)
    - [``](#winsetsimplefullscreenflag-macos)
    - [``](#winissimplefullscreen-macos)
    - [``](#winisnormal)
    - [``](#winsetaspectratioaspectratio-extrasize)
    - [``](#winsetbackgroundcolorbackgroundcolor)
    - [``](#winpreviewfilepath-displayname-macos)
    - [``](#winclosefilepreview-macos)
    - [``](#winsetboundsbounds-animate)
    - [``](#wingetbounds)
    - [``](#wingetbackgroundcolor)
    - [``](#winsetcontentboundsbounds-animate)
    - [``](#wingetcontentbounds)
    - [``](#wingetnormalbounds)
    - [``](#winsetenabledenable)
    - [``](#winisenabled)
    - [``](#winsetsizewidth-height-animate)
    - [``](#wingetsize)
    - [``](#winsetcontentsizewidth-height-animate)
    - [``](#wingetcontentsize)
    - [``](#winsetminimumsizewidth-height)
    - [``](#wingetminimumsize)
    - [``](#winsetmaximumsizewidth-height)
    - [``](#wingetmaximumsize)
    - [``](#winsetresizableresizable)
    - [``](#winisresizable)
    - [``](#winsetmovablemovable-macos-windows)
    - [``](#winismovable-macos-windows)
    - [``](#winsetminimizableminimizable-macos-windows)
    - [``](#winisminimizable-macos-windows)
    - [``](#winsetmaximizablemaximizable-macos-windows)
    - [``](#winismaximizable-macos-windows)
    - [``](#winsetfullscreenablefullscreenable)
    - [``](#winisfullscreenable)
    - [``](#winsetclosableclosable-macos-windows)
    - [``](#winisclosable-macos-windows)
    - [``](#winsethiddeninmissioncontrolhidden-macos)
    - [``](#winishiddeninmissioncontrol-macos)
    - [``](#winsetalwaysontopflag-level-relativelevel)
    - [``](#winisalwaysontop)
    - [``](#winmoveabovemediasourceid)
    - [``](#winmovetop)
    - [``](#wincenter)
    - [``](#winsetpositionx-y-animate)
    - [``](#wingetposition)
    - [``](#winsettitletitle)
    - [``](#wingettitle)
    - [``](#winsetsheetoffsetoffsety-offsetx-macos)
    - [``](#winflashframeflag)
    - [``](#winsetskiptaskbarskip-macos-windows)
    - [``](#winsetkioskflag)
    - [``](#winiskiosk)
    - [``](#winistabletmode-windows)
    - [``](#wingetmediasourceid)
    - [``](#wingetnativewindowhandle)
    - [``](#winhookwindowmessagemessage-callback-windows)
    - [``](#winiswindowmessagehookedmessage-windows)
    - [``](#winunhookwindowmessagemessage-windows)
    - [``](#winunhookallwindowmessages-windows)
    - [``](#winsetrepresentedfilenamefilename-macos)
    - [``](#wingetrepresentedfilename-macos)
    - [``](#winsetdocumenteditededited-macos)
    - [``](#winisdocumentedited-macos)
    - [``](#winfocusonwebview)
    - [``](#winblurwebview)
    - [``](#wincapturepagerect-opts)
    - [``](#winloadurlurl-options)
    - [``](#winloadfilefilepath-options)
    - [``](#winreload)
    - [``](#winsetmenumenu-linux-windows)
    - [``](#winremovemenu-linux-windows)
    - [``](#winsetprogressbarprogress-options)
    - [``](#winsetoverlayiconoverlay-description-windows)
    - [``](#wininvalidateshadow-macos)
    - [``](#winsethasshadowhasshadow)
    - [``](#winhasshadow)
    - [``](#winsetopacityopacity-windows-macos)
    - [``](#wingetopacity)
    - [``](#winsetshaperects-windows-linux-experimental)
    - [``](#winsetthumbarbuttonsbuttons-windows)
    - [``](#winsetthumbnailclipregion-windows)
    - [``](#winsetthumbnailtooltiptooltip-windows)
    - [``](#winsetappdetailsoptions-windows)
    - [``](#winsetaccentcoloraccentcolor-windows)
    - [``](#wingetaccentcolor-windows)
    - [``](#winshowdefinitionforselection-macos)
    - [``](#winseticonicon-windows-linux)
    - [``](#winsetwindowbuttonvisibilityvisible-macos)
    - [``](#winsetautohidemenubarhide-windows-linux)
    - [``](#winismenubarautohide-windows-linux)
    - [``](#winsetmenubarvisibilityvisible-windows-linux)
    - [``](#winismenubarvisible-windows-linux)
    - [``](#winissnapped-windows)
    - [``](#winsetvisibleonallworkspacesvisible-options-macos-linux)
    - [``](#winisvisibleonallworkspaces-macos-linux)
    - [``](#winsetignoremouseeventsignore-options)
    - [``](#winsetcontentprotectionenable-macos-windows)
    - [``](#winiscontentprotected-macos-windows)
    - [``](#winsetfocusablefocusable-macos-windows)
    - [``](#winisfocusable-macos-windows)
    - [``](#winsetparentwindowparent)
    - [``](#wingetparentwindow)
    - [``](#wingetchildwindows)
    - [``](#winsetautohidecursorautohide-macos)
    - [``](#winselectprevioustab-macos)
    - [``](#winselectnexttab-macos)
    - [``](#winshowalltabs-macos)
    - [``](#winmergeallwindows-macos)
    - [``](#winmovetabtonewwindow-macos)
    - [``](#wintoggletabbar-macos)
    - [``](#winaddtabbedwindowbrowserwindow-macos)
    - [``](#winsetvibrancytype-options-macos)
    - [``](#winsetbackgroundmaterialmaterial-windows)
    - [``](#winsetwindowbuttonpositionposition-macos)
    - [``](#wingetwindowbuttonposition-macos)
    - [``](#winsettouchbartouchbar-macos)
    - [``](#winsetbrowserviewbrowserview-experimental-deprecated)
    - [``](#wingetbrowserview-experimental-deprecated)
    - [``](#winaddbrowserviewbrowserview-experimental-deprecated)
    - [``](#winremovebrowserviewbrowserview-experimental-deprecated)
    - [``](#winsettopbrowserviewbrowserview-experimental-deprecated)
    - [``](#wingetbrowserviews-experimental-deprecated)
    - [``](#winsettitlebaroverlayoptions-windows-linux)

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
