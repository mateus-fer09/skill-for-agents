---
title: "BaseWindow"
description: "Documentação técnica e referência da API de BaseWindow no Electron."
topics:
  - "Api"
keywords:
  - "BaseWindow"
  - "BrowserWindow"
  - "ready"
  - "parent"
  - "child"
  - "modal"
  - "dialog"
  - "WebContentsView"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/base-window"
---

# BaseWindow

> 

Create and control windows.

Process: [Main](/pt/docs/latest/glossary#main-process)

> [!NOTE]
> 

> note

> 

`BaseWindow` provides a flexible way to compose multiple web views in a
single window. For windows with only a single, full-size web view, the
[`BrowserWindow`](/pt/docs/latest/api/browser-window) class may be a simpler option.

This module cannot be used until the `ready` event of the `app`
module is emitted.

```javascript
// In the main process.  
const { BaseWindow, WebContentsView } = require('electron')  
  
const win = new BaseWindow({ width: 800, height: 600 })  
  
const leftView = new WebContentsView()  
leftView.webContents.loadURL('https://electronjs.org')  
win.contentView.addChildView(leftView)  
  
const rightView = new WebContentsView()  
rightView.webContents.loadURL('https://github.com/electron/electron')  
win.contentView.addChildView(rightView)  
  
leftView.setBounds({ x: 0, y: 0, width: 400, height: 600 })  
rightView.setBounds({ x: 400, y: 0, width: 400, height: 600 })  

```

## Janelas parent e child

By using `parent` option, you can create child windows:

```javascript
const { BaseWindow } = require('electron')  
  
const parent = new BaseWindow()  
const child = new BaseWindow({ parent })  

```

The `child` window will always show on top of the `parent` window.

## Janelas Modais

A modal window is a child window that disables parent window. To create a modal
window, you have to set both the `parent` and `modal` options:

```javascript
const { BaseWindow } = require('electron')  
  
const parent = new BaseWindow()  
const child = new BaseWindow({ parent, modal: true })  

```

## Avisos de plataformas

- No macOS, janelas modal serão exibidas como "folhas" vinculadas a janela principal.

- On macOS the child windows will keep the relative position to parent window
when parent window moves, while on Windows and Linux child windows will not
move.

- On Linux the type of modal windows will be changed to `dialog`.

- No Linux, vários ambientes desktop não há suporte para esconder uma janela modal.

## Resource management

When you add a [`WebContentsView`](/pt/docs/latest/api/web-contents-view) to a `BaseWindow` and the `BaseWindow`
is closed, the [`webContents`](/pt/docs/latest/api/web-contents) of the `WebContentsView` are not destroyed
automatically.

It is your responsibility to close the `webContents` when you no longer need them, e.g. when
the `BaseWindow` is closed:

```javascript
const { BaseWindow, WebContentsView } = require('electron')  
  
const win = new BaseWindow({ width: 800, height: 600 })  
  
const view = new WebContentsView()  
win.contentView.addChildView(view)  
  
win.on('closed', () => {  
  view.webContents.close()  
})  

```

Unlike with a [`BrowserWindow`](/pt/docs/latest/api/browser-window), if you don't explicitly close the
`webContents`, you'll encounter memory leaks.

## Class: BaseWindow

> 

Create and control windows.

Process: [Main](/pt/docs/latest/glossary#main-process)

`BaseWindow` is an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

It creates a new `BaseWindow` with native properties as set by the `options`.

> [!WARNING]
> 

> aviso

> 

Electron's built-in classes cannot be subclassed in user code.
For more information, see [the FAQ](/pt/docs/latest/faq#class-inheritance-does-not-work-with-electron-built-in-modules).

### `new BaseWindow([options])`

- `options` [BaseWindowConstructorOptions](/pt/docs/latest/api/structures/base-window-options) (optional)

  - `width` Integer (optional) - Window's width in pixels. Default is `800`.

  - `height` Integer (optional) - Window's height in pixels. Default is `600`.

  - `x` Integer (optional) - (**required** if y is used) Window's left offset from screen.
Default is to center the window.

  - `y` Integer (optional) - (**required** if x is used) Window's top offset from screen.
Default is to center the window.

  - `useContentSize` boolean (optional) - The `width` and `height` would be used as web
page's size, which means the actual window's size will include window
frame's size and be slightly larger. Default is `false`.

  - `center` boolean (optional) - Show window in the center of the screen. Default is `false`.

  - `minWidth` Integer (optional) - Window's minimum width. Default is `0`.

  - `minHeight` Integer (optional) - Window's minimum height. Default is `0`.

  - `maxWidth` Integer (optional) - Window's maximum width. Default is no limit.

  - `maxHeight` Integer (optional) - Window's maximum height. Default is no limit.

  - `resizable` boolean (optional) - Whether window is resizable. Default is `true`.

  - `movable` boolean (optional) *macOS* *Windows* - Whether window is
movable. This is not implemented on Linux. Default is `true`.

  - `minimizable` boolean (optional) *macOS* *Windows* - Whether window is
minimizable. This is not implemented on Linux. Default is `true`.

  - `maximizable` boolean (optional) *macOS* *Windows* - Whether window is
maximizable. This is not implemented on Linux. Default is `true`.

  - `closable` boolean (optional) *macOS* *Windows* - Whether window is
closable. This is not implemented on Linux. Default is `true`.

  - `focusable` boolean (optional) - Whether the window can be focused. Default is
`true`. On Windows setting `focusable: false` also implies setting
`skipTaskbar: true`. On Linux setting `focusable: false` makes the window
stop interacting with wm, so the window will always stay on top in all
workspaces.

  - `alwaysOnTop` boolean (optional) - Whether the window should always stay on top of
other windows. Default is `false`.

  - `fullscreen` boolean (optional) - Whether the window should show in fullscreen. When
explicitly set to `false` the fullscreen button will be hidden or disabled
on macOS. Default is `false`.

  - `fullscreenable` boolean (optional) - Whether the window can be put into fullscreen
mode. On macOS, also whether the maximize/zoom button should toggle full
screen mode or maximize window. Default is `true`.

  - `simpleFullscreen` boolean (optional) *macOS* - Use pre-Lion fullscreen on
macOS. Default is `false`.

  - `skipTaskbar` boolean (optional) *macOS* *Windows* - Whether to show the window in taskbar.
Default is `false`.

  - `hiddenInMissionControl` boolean (optional) *macOS* - Whether window should be hidden when the user toggles into mission control.

  - `kiosk` boolean (optional) - Whether the window is in kiosk mode. Default is `false`.

  - `title` string (optional) - Default window title. Default is `"Electron"`. If the HTML tag `<title>` is defined in the HTML file loaded by `loadURL()`, this property will be ignored.

  - `icon` ([NativeImage](/pt/docs/latest/api/native-image) | string) (optional) - The window icon. On Windows it is
recommended to use `ICO` icons to get best visual effects, you can also
leave it undefined so the executable's icon will be used.

  - `show` boolean (optional) - Whether window should be shown when created. Default is
`true`.

  - `frame` boolean (optional) - Specify `false` to create a
[frameless window](/pt/docs/latest/tutorial/custom-window-styles#frameless-windows). Default is `true`.

  - `parent` BaseWindow (optional) - Specify parent window. Default is `null`.

  - `modal` boolean (optional) - Whether this is a modal window. This only works when the
window is a child window. Default is `false`.

  - `acceptFirstMouse` boolean (optional) *macOS* - Whether clicking an
inactive window will also click through to the web contents. Default is
`false` on macOS. This option is not configurable on other platforms.

  - `disableAutoHideCursor` boolean (optional) - Whether to hide cursor when typing.
Default is `false`.

  - `autoHideMenuBar` boolean (optional) *Linux* *Windows* - Auto hide the menu bar
unless the `Alt` key is pressed. Default is `false`.

  - `enableLargerThanScreen` boolean (optional) *macOS* - Enable the window to
be resized larger than screen. Only relevant for macOS, as other OSes
allow larger-than-screen windows by default. Default is `false`.

  - `backgroundColor` string (optional) - The window's background color in Hex, RGB, RGBA, HSL, HSLA or named CSS color format. Alpha in #AARRGGBB format is supported if `transparent` is set to `true`. Default is `#FFF` (white). See [win.setBackgroundColor](/pt/docs/latest/api/browser-window#winsetbackgroundcolorbackgroundcolor) for more information.

  - `hasShadow` boolean (optional) - Whether window should have a shadow. Default is `true`.

  - `opacity` number (optional) *macOS* *Windows* - Set the initial opacity of
the window, between 0.0 (fully transparent) and 1.0 (fully opaque). This
is only implemented on Windows and macOS.

  - `darkTheme` boolean (optional) - Forces using dark theme for the window, only works on
some GTK+3 desktop environments. Default is `false`.

  - `transparent` boolean (optional) - Makes the window [transparent](/pt/docs/latest/tutorial/custom-window-styles#transparent-windows).
Default is `false`. On Windows, does not work unless the window is frameless.
When you add a [`View`](/pt/docs/latest/api/exibir) to a `BaseWindow`, you'll need to call
[`view.setBackgroundColor`](/pt/docs/latest/api/exibir#viewsetbackgroundcolorcolor) with a transparent
background color on that view to make its background transparent as well.

  - `type` string (optional) - The type of window, default is normal window. See more about
this below.

  - `visualEffectState` string (optional) *macOS* - Specify how the material
appearance should reflect window activity state on macOS. Must be used
with the `vibrancy` property. Possible values are:

    - `followWindow` - The backdrop should automatically appear active when the window is active, and inactive when it is not. This is the default.

    - `active` - The backdrop should always appear active.

    - `inactive` - The backdrop should always appear inactive.

  - `titleBarStyle` string (optional) - The style of window title bar.
Default is `default`. Possible values are:

    - `default` - Results in the standard title bar for macOS or Windows respectively.

    - `hidden` - Results in a hidden title bar and a full size content window. On macOS, the window still has the standard window controls (“traffic lights”) in the top left. On Windows and Linux, when combined with `titleBarOverlay: true` it will activate the Window Controls Overlay (see `titleBarOverlay` for more information), otherwise no window controls will be shown.

    - `hiddenInset` *macOS* - Results in a hidden title bar
with an alternative look where the traffic light buttons are slightly
more inset from the window edge.

    - `customButtonsOnHover` *macOS* - Results in a hidden
title bar and a full size content window, the traffic light buttons will
display when being hovered over in the top left of the window.
**Note:** This option is currently experimental.

  - `titleBarOverlay` Object | Boolean (optional) -  When using a frameless window in conjunction with `win.setWindowButtonVisibility(true)` on macOS or using a `titleBarStyle` so that the standard window controls ("traffic lights" on macOS) are visible, this property enables the Window Controls Overlay [JavaScript APIs](https://github.com/WICG/window-controls-overlay/blob/main/explainer.md#javascript-apis) and [CSS Environment Variables](https://github.com/WICG/window-controls-overlay/blob/main/explainer.md#css-environment-variables). Specifying `true` will result in an overlay with default system colors. Default is `false`.

    - `color` String (optional) *Windows* *Linux* - The CSS color of the Window Controls Overlay when enabled. Default is the system color.

    - `symbolColor` String (optional) *Windows* *Linux* - The CSS color of the symbols on the Window Controls Overlay when enabled. Default is the system color.

    - `height` Integer (optional) - The height of the title bar and Window Controls Overlay in pixels. Default is system height.

  - `accentColor` boolean | string (optional) *Windows* - The accent color for the window. By default, follows user preference in System Settings. Set to `false` to explicitly disable, or set the color in Hex, RGB, RGBA, HSL, HSLA or named CSS color format. Alpha values will be ignored.

  - `trafficLightPosition` [Point](/pt/docs/latest/api/structures/point) (optional) *macOS* -
Set a custom position for the traffic light buttons in frameless windows.

  - `roundedCorners` boolean (optional) - Whether a frameless window
should have rounded corners. Default is `true`. On Windows versions older than
Windows 11 Build 22000 this property has no effect, and frameless windows will
not have rounded corners. On Linux, rounded corners are only drawn when the
desktop environment supports client-side decorations.

  - `thickFrame` boolean (optional) *Windows* - Use `WS_THICKFRAME` style for
frameless windows on Windows, which adds the standard window frame. Setting it
to `false` will remove window shadow and window animations, and disable window
resizing via dragging the window edges. Default is `true`.

  - `vibrancy` string (optional) *macOS* - Add a type of vibrancy effect to
the window, only on macOS. Can be `appearance-based`, `titlebar`, `selection`,
`menu`, `popover`, `sidebar`, `header`, `sheet`, `window`, `hud`, `fullscreen-ui`,
`tooltip`, `content`, `under-window`, or `under-page`.

  - `backgroundMaterial` string (optional) *Windows* - Set the window's
system-drawn background material, including behind the non-client area.
Can be `auto`, `none`, `mica`, `acrylic` or `tabbed`. See [win.setBackgroundMaterial](/pt/docs/latest/api/browser-window#winsetbackgroundmaterialmaterial-windows) for more information.

  - `zoomToPageWidth` boolean (optional) *macOS* - Controls the behavior on
macOS when option-clicking the green stoplight button on the toolbar or by
clicking the Window > Zoom menu item. If `true`, the window will grow to
the preferred width of the web page when zoomed, `false` will cause it to
zoom to the width of the screen. This will also affect the behavior when
calling `maximize()` directly. Default is `false`.

  - `tabbingIdentifier` string (optional) *macOS* - Tab group name, allows
opening the window as a native tab. Windows with the same
tabbing identifier will be grouped together. This also adds a native new
tab button to your window's tab bar and allows your `app` and window to
receive the `new-window-for-tab` event.

When setting minimum or maximum window size with `minWidth`/`maxWidth`/
`minHeight`/`maxHeight`, it only constrains the users. It won't prevent you from
passing a size that does not follow size constraints to `setBounds`/`setSize` or
to the constructor of `BrowserWindow`.

The possible values and behaviors of the `type` option are platform dependent.
Possible values are:

  - On Linux, possible types are `desktop`, `dock`, `toolbar`, `splash`,
`notification`.

    - The `desktop` type places the window at the desktop background window level
(kCGDesktopWindowLevel - 1). However, note that a desktop window will not
receive focus, keyboard, or mouse events. You can still use globalShortcut to
receive input sparingly.

    - The `dock` type creates a dock-like window behavior.

    - The `toolbar` type creates a window with a toolbar appearance.

    - The `splash` type behaves in a specific way. It is not
draggable, even if the CSS styling of the window's body contains
-webkit-app-region: drag. This type is commonly used for splash screens.

    - The `notification` type creates a window that behaves like a system notification.

  - On macOS, possible types are `desktop`, `textured`, `panel`.

    - The `textured` type adds metal gradient appearance. This option is **deprecated**.

    - The `desktop` type places the window at the desktop background window level
(`kCGDesktopWindowLevel - 1`). Note that desktop window will not receive
focus, keyboard or mouse events, but you can use `globalShortcut` to receive
input sparingly.

    - The `panel` type enables the window to float on top of full-screened apps
by adding the `NSWindowStyleMaskNonactivatingPanel` style mask, normally
reserved for NSPanel, at runtime. Also, the window will appear on all
spaces (desktops).

  - On Windows, possible type is `toolbar`.

### Eventos de instância

Objects created with `new BaseWindow` emit the following events:

> [!NOTE]
> 

> note

> 

Some events are only available on specific operating systems and are
labeled as such.

#### Evento: 'close'

Retorna:

- `event` Event

Emitted when the window is going to be closed. It's emitted before the
`beforeunload` and `unload` event of the DOM. Calling `event.preventDefault()`
will cancel the close.

Usually you would want to use the `beforeunload` handler to decide whether the
window should be closed, which will also be called when the window is
reloaded. In Electron, returning any value other than `undefined` would cancel the
close. Como por exemplo:

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

> [!NOTE]
> 

> note

> 

There is a subtle difference between the behaviors of `window.onbeforeunload = handler` and
`window.addEventListener('beforeunload', handler)`. It is recommended to always set the
`event.returnValue` explicitly, instead of only returning a value, as the former works more
consistently within Electron.

#### Evento: 'closed'

Emitted when the window is closed. After you have received this event you should
remove the reference to the window and avoid using it any more.

#### Event: 'query-session-end' *Windows*

Retorna:

- `event` [WindowSessionEndEvent](/pt/docs/latest/api/structures/window-session-end-event)

Emitted when a session is about to end due to a shutdown, machine restart, or user log-off.
Calling `event.preventDefault()` can delay the system shutdown, though it’s generally best
to respect the user’s choice to end the session. However, you may choose to use it if
ending the session puts the user at risk of losing data.

#### Event: 'session-end' *Windows*

Retorna:

- `event` [WindowSessionEndEvent](/pt/docs/latest/api/structures/window-session-end-event)

Emitted when a session is about to end due to a shutdown, machine restart, or user log-off. Once this event fires, there is no way to prevent the session from ending.

#### Evento: 'blur'

Retorna:

- `event` Event

Emitted when the window loses focus.

#### Evento: 'focus'

Retorna:

- `event` Event

Emitted when the window gains focus.

#### Evento: 'show'

Emitted when the window is shown.

#### Evento: 'hide'

Emitted when the window is hidden.

#### Evento: 'maximize'

Emitted when window is maximized.

#### Evento: 'unmaximize'

Emitted when the window exits from a maximized state.

#### Evento: 'minimize'

Emitted when the window is minimized.

> [!NOTE]
> 

> note

> 

On Wayland, “minimized” is not currently a supported state. The minimize event will only fire when triggered by client-side decoration (e.g. clicking the minimize
button on a frameless window’s Window Control Overlay)

#### Evento: 'restore'

Emitted when the window is restored from a minimized state.

#### Event: 'will-resize' *macOS* *Windows*

Retorna:

- `event` Event

- `newBounds` [Rectangle](/pt/docs/latest/api/structures/rectangle) - Size the window is being resized to.

- `details` Object

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

> [!NOTE]
> 

> note

> 

On macOS, this event is an alias of `move`.

#### Evento: 'enter-full-screen'

Emitted when the window enters a full-screen state.

#### Evento: 'leave-full-screen'

Emitted when the window leaves a full-screen state.

#### Evento: 'always-on-top-changed'

Retorna:

- `event` Event

- `isAlwaysOnTop` boolean

Emitted when the window is set or unset to show always on top of other windows.

#### Event: 'app-command' *Windows* *Linux*

Retorna:

- `event` Event

- `command` string

Emitted when an [App Command](https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-appcommand)
is invoked. These are typically related to keyboard media keys or browser
commands, as well as the "Back" button built into some mice on Windows.

Commands are lowercased, underscores are replaced with hyphens, and the
`APPCOMMAND_` prefix is stripped off.
e.g. `APPCOMMAND_BROWSER_BACKWARD` is emitted as `browser-backward`.

```javascript
const { BaseWindow } = require('electron')  
  
const win = new BaseWindow()  
win.on('app-command', (e, cmd) => {  
  // Navigate the window back when the user hits their mouse back button  
  if (cmd === 'browser-backward') {  
    // Find the appropriate WebContents to navigate.  
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

The method underlying this event is built to handle older macOS-style trackpad swiping,
where the content on the screen doesn't move with the swipe. Most macOS trackpads are not
configured to allow this kind of swiping anymore, so in order for it to emit properly the
'Swipe between pages' preference in `System Preferences > Trackpad > More Gestures` must be
set to 'Swipe with two or three fingers'.

#### Event: 'rotate-gesture' *macOS*

Retorna:

- `event` Event

- `rotation` Float

Emitted on trackpad rotation gesture. Continually emitted until rotation gesture is
ended. The `rotation` value on each emission is the angle in degrees rotated since
the last emission. The last emitted event upon a rotation gesture will always be of
value `0`. Counter-clockwise rotation values are positive, while clockwise ones are
negative.

#### Event: 'sheet-begin' *macOS*

Emitted when the window opens a sheet.

#### Event: 'sheet-end' *macOS*

Emitted when the window has closed a sheet.

#### Event: 'new-window-for-tab' *macOS*

Emitted when the user clicks the native macOS new tab button. The new
tab button is only visible if the current `BrowserWindow` has a
`tabbingIdentifier`.

You must create a window in this handler in order for macOS tabbing to work as expected.

#### Event: 'system-context-menu' *Windows* *Linux*

Retorna:

- `event` Event

- `point` [Point](/pt/docs/latest/api/structures/point) - The screen coordinates where the context menu was triggered.

Emitted when the system context menu is triggered on the window, this is
normally only triggered when the user right clicks on the non-client area
of your window.  This is the window titlebar or any area you have declared
as `-webkit-app-region: drag` in a frameless window.

Calling `event.preventDefault()` will prevent the menu from being displayed.

To convert `point` to DIP, use [`screen.screenToDipPoint(point)`](/pt/docs/latest/api/screen#screenscreentodippointpoint-windows-linux).

### Métodos estáticos

The `BaseWindow` class has the following static methods:

#### `BaseWindow.getAllWindows()`

Returns `BaseWindow[]` - An array of all opened browser windows.

#### `BaseWindow.getFocusedWindow()`

Returns `BaseWindow | null` - The window that is focused in this application, otherwise returns `null`.

#### `BaseWindow.fromId(id)`

- `id` Integer

Returns `BaseWindow | null` - The window with the given `id`.

### Propriedades da Instância

Objects created with `new BaseWindow` have the following properties:

```javascript
const { BaseWindow } = require('electron')  
// In this example `win` is our instance  
const win = new BaseWindow({ width: 800, height: 600 })  

```

#### `win.id` *Readonly*

A `Integer` property representing the unique ID of the window. Each ID is unique among all `BaseWindow` instances of the entire Electron application.

#### `win.contentView`

A `View` property for the content view of the window.

#### `win.tabbingIdentifier` *macOS* *Readonly*

A `string` (optional) property that is equal to the `tabbingIdentifier` passed to the `BrowserWindow` constructor or `undefined` if none was set.

#### `win.autoHideMenuBar` *Linux* *Windows*

A `boolean` property that determines whether the window menu bar should hide itself automatically. Once set, the menu bar will only show when users press the single `Alt` key.

If the menu bar is already visible, setting this property to `true` won't
hide it immediately.

#### `win.simpleFullScreen`

A `boolean` property that determines whether the window is in simple (pre-Lion) fullscreen mode.

#### `win.fullScreen`

A `boolean` property that determines whether the window is in fullscreen mode.

#### `win.focusable` *Windows* *macOS*

A `boolean` property that determines whether the window is focusable.

#### `win.visibleOnAllWorkspaces` *macOS* *Linux*

A `boolean` property that determines whether the window is visible on all workspaces.

> [!NOTE]
> 

> note

> 

Always returns false on Windows.

#### `win.shadow`

A `boolean` property that determines whether the window has a shadow.

#### `win.menuBarVisible` *Windows* *Linux*

A `boolean` property that determines whether the menu bar should be visible.

> [!NOTE]
> 

> note

> 

If the menu bar is auto-hide, users can still bring up the menu bar by pressing the single `Alt` key.

#### `win.kiosk`

A `boolean` property that determines whether the window is in kiosk mode.

#### `win.documentEdited` *macOS*

A `boolean` property that specifies whether the window’s document has been edited.

The icon in title bar will become gray when set to `true`.

#### `win.representedFilename` *macOS*

A `string` property that determines the pathname of the file the window represents,
and the icon of the file will show in window's title bar.

#### `win.title`

A `string` property that determines the title of the native window.

> [!NOTE]
> 

> note

> 

The title of the web page can be different from the title of the native window.

#### `win.minimizable` *macOS* *Windows*

A `boolean` property that determines whether the window can be manually minimized by user.

On Linux the setter is a no-op, although the getter returns `true`.

#### `win.maximizable` *macOS* *Windows*

A `boolean` property that determines whether the window can be manually maximized by user.

On Linux the setter is a no-op, although the getter returns `true`.

#### `win.fullScreenable`

A `boolean` property that determines whether the maximize/zoom window button toggles fullscreen mode or
maximizes the window.

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
const { Menu, BaseWindow } = require('electron')  
  
const win = new BaseWindow({ height: 600, width: 600 })  
  
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

A `string` property that defines an alternative title provided only to
accessibility tools such as screen readers. This string is not directly
visible to users.

#### `win.snapped` *Windows* *Readonly*

A `boolean` property that indicates whether the window is arranged via [Snap.](https://support.microsoft.com/en-us/windows/snap-your-windows-885a9b1e-a983-a3b1-16cd-c531795e6241)

### Métodos de Instância

Objects created with `new BaseWindow` have the following instance methods:

> [!NOTE]
> 

> note

> 

Some methods are only available on specific operating systems and are
labeled as such.

#### `win.setContentView(view)`

- `view` [View](/pt/docs/latest/api/exibir)

Sets the content view of the window.

#### `win.getContentView()`

Returns [`View`](/pt/docs/latest/api/exibir) - The content view of the window.

#### `win.destroy()`

Force closing the window, the `unload` and `beforeunload` event won't be emitted
for the web page, and `close` event will also not be emitted
for this window, but it guarantees the `closed` event will be emitted.

#### `win.close()`

Try to close the window. This has the same effect as a user manually clicking
the close button of the window. The web page may cancel the close though. See
the [close event](#event-close).

#### `win.focus()`

Focuses on the window.

#### `win.blur()`

Removes focus from the window.

#### `win.isFocused()`

Returns `boolean` - Whether the window is focused.

#### `win.isDestroyed()`

Returns `boolean` - Whether the window is destroyed.

#### `win.show()`

Shows and gives focus to the window.

#### `win.showInactive()`

Shows the window but doesn't focus on it.

#### `win.hide()`

Hides the window.

#### `win.isVisible()`

Returns `boolean` - Whether the window is visible to the user in the foreground of the app.

#### `win.isModal()`

Returns `boolean` - Whether current window is a modal window.

#### `win.maximize()`

Maximizes the window. This will also show (but not focus) the window if it
isn't being displayed already.

#### `win.unmaximize()`

Unmaximizes the window.

#### `win.isMaximized()`

Returns `boolean` - Whether the window is maximized.

#### `win.minimize()`

Minimizes the window. On some platforms the minimized window will be shown in
the Dock.

#### `win.restore()`

Restores the window from minimized state to its previous state.

#### `win.isMinimized()`

Returns `boolean` - Whether the window is minimized.

#### `win.setFullScreen(flag)`

- `flag` boolean

Sets whether the window should be in fullscreen mode.

> [!NOTE]
> 

> note

> 

On macOS, fullscreen transitions take place asynchronously. If further actions depend on the fullscreen state, use the ['enter-full-screen'](/pt/docs/latest/api/base-window#event-enter-full-screen) or > ['leave-full-screen'](/pt/docs/latest/api/base-window#event-leave-full-screen) events.

#### `win.isFullScreen()`

Returns `boolean` - Whether the window is in fullscreen mode.

#### `win.setSimpleFullScreen(flag)` *macOS*

- `flag` boolean

Enters or leaves simple fullscreen mode.

Simple fullscreen mode emulates the native fullscreen behavior found in versions of macOS prior to Lion (10.7).

#### `win.isSimpleFullScreen()` *macOS*

Returns `boolean` - Whether the window is in simple (pre-Lion) fullscreen mode.

#### `win.isNormal()`

Returns `boolean` - Whether the window is in normal state (not maximized, not minimized, not in fullscreen mode).

#### `win.setAspectRatio(aspectRatio[, extraSize])`

- `aspectRatio` Float - The aspect ratio to maintain for some portion of the
content view.

- `extraSize` [Size](/pt/docs/latest/api/structures/size) (optional) *macOS* - The extra size not to be included while
maintaining the aspect ratio.

This will make a window maintain an aspect ratio. The extra size allows a
developer to have space, specified in pixels, not included within the aspect
ratio calculations. This API already takes into account the difference between a
window's size and its content size.

Consider a normal window with an HD video player and associated controls.
Perhaps there are 15 pixels of controls on the left edge, 25 pixels of controls
on the right edge and 50 pixels of controls below the player. In order to
maintain a 16:9 aspect ratio (standard aspect ratio for HD @1920x1080) within
the player itself we would call this function with arguments of 16/9 and
{ width: 40, height: 50 }. The second argument doesn't care where the extra width and height
are within the content view--only that they exist. Sum any extra width and
height areas you have within the overall content view.

The aspect ratio is not respected when window is resized programmatically with
APIs like `win.setSize`.

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

Sets the background color of the window. See [Setting `backgroundColor`](/pt/docs/latest/api/browser-window#setting-the-backgroundcolor-property).

#### `win.previewFile(path[, displayName])` *macOS*

- `path` string - The absolute path to the file to preview with QuickLook. This
is important as Quick Look uses the file name and file extension on the path
to determine the content type of the file to open.

- `displayName` string (optional) - The name of the file to display on the
Quick Look modal view. This is purely visual and does not affect the content
type of the file. Defaults to `path`.

Uses [Quick Look](https://en.wikipedia.org/wiki/Quick_Look) to preview a file at a given path.

#### `win.closeFilePreview()` *macOS*

Closes the currently open [Quick Look](https://en.wikipedia.org/wiki/Quick_Look) panel.

#### `win.setBounds(bounds[, animate])`

- `bounds` Partial<[Rectangle](/pt/docs/latest/api/structures/rectangle)>

- `animate` boolean (optional) *macOS*

Resizes and moves the window to the supplied bounds. Any properties that are not supplied will default to their current values.

```javascript
const { BaseWindow } = require('electron')  
  
const win = new BaseWindow()  
  
// set all bounds properties  
win.setBounds({ x: 440, y: 225, width: 800, height: 600 })  
  
// set a single bounds property  
win.setBounds({ width: 100 })  
  
// { x: 440, y: 225, width: 100, height: 600 }  
console.log(win.getBounds())  

```

> [!NOTE]
> 

> note

> 

On macOS, the y-coordinate value cannot be smaller than the [Tray](/pt/docs/latest/api/tray) height. The tray height has changed over time and depends on the operating system, but is between 20-40px. Passing a value lower than the tray height will result in a window that is flush to the tray.

#### `win.getBounds()`

Returns [Rectangle](/pt/docs/latest/api/structures/rectangle) - The `bounds` of the window as `Object`.

> [!NOTE]
> 

> note

> 

On macOS, the y-coordinate value returned will be at minimum the [Tray](/pt/docs/latest/api/tray) height. For example, calling `win.setBounds({ x: 25, y: 20, width: 800, height: 600 })` with a tray height of 38 means that `win.getBounds()` will return `{ x: 25, y: 38, width: 800, height: 600 }`.

> [!NOTE]
> 

> note

> 

On Wayland, this method will return `{ x: 0, y: 0, ... }` as introspecting or programmatically changing the global window coordinates is prohibited.

#### `win.getBackgroundColor()`

Returns `string` - Gets the background color of the window in Hex (`#RRGGBB`) format.

See [Setting `backgroundColor`](/pt/docs/latest/api/browser-window#setting-the-backgroundcolor-property).

> [!NOTE]
> 

> note

> 

The alpha value is *not* returned alongside the red, green, and blue values.

#### `win.setContentBounds(bounds[, animate])`

- `bounds` [Rectangle](/pt/docs/latest/api/structures/rectangle)

- `animate` boolean (optional) *macOS*

Resizes and moves the window's client area (e.g. the web page) to
the supplied bounds.

#### `win.getContentBounds()`

Returns [Rectangle](/pt/docs/latest/api/structures/rectangle) - The `bounds` of the window's client area as `Object`.

#### `win.getNormalBounds()`

Returns [Rectangle](/pt/docs/latest/api/structures/rectangle) - Contains the window bounds of the normal state

> [!NOTE]
> 

> note

> 

Whatever the current state of the window : maximized, minimized or in fullscreen, this function always returns the position and size of the window in normal state. In normal state, getBounds and getNormalBounds returns the same [Rectangle](/pt/docs/latest/api/structures/rectangle).

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

#### `win.getSize()`

Returns `Integer[]` - Contains the window's width and height.

#### `win.setContentSize(width, height[, animate])`

- `width` Integer

- `height` Integer

- `animate` boolean (optional) *macOS*

Resizes the window's client area (e.g. the web page) to `width` and `height`.

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

- `level` string (optional) *macOS* *Windows* - Values include `normal`,
`floating`, `torn-off-menu`, `modal-panel`, `main-menu`, `status`,
`pop-up-menu`, `screen-saver`, and `dock` (Deprecated). The default is
`floating` when `flag` is true. The `level` is reset to `normal` when the
flag is false. Note that from `floating` to `status` included, the window is
placed below the Dock on macOS and below the taskbar on Windows. From
`pop-up-menu` to a higher it is shown above the Dock on macOS and above the
taskbar on Windows. See the [macOS docs](https://developer.apple.com/documentation/appkit/nswindow/level) for more details.

- `relativeLevel` Integer (optional) *macOS* - The number of layers higher to set
this window relative to the given `level`. The default is `0`. Note that Apple
discourages setting levels higher than 1 above `screen-saver`.

Sets whether the window should show always on top of other windows. After
setting this, the window is still a normal window, not a toolbox window which
can not be focused on.

#### `win.isAlwaysOnTop()`

Returns `boolean` - Whether the window is always on top of other windows.

#### `win.moveAbove(mediaSourceId)`

- `mediaSourceId` string - Window id in the format of DesktopCapturerSource's id. For example "window:1869:0".

Moves window above the source window in the sense of z-order. If the
`mediaSourceId` is not of type window or if the window does not exist then
this method throws an error.

#### `win.moveTop()`

Moves window to top(z-order) regardless of focus

#### `win.center()`

Moves window to the center of the screen.

#### `win.setPosition(x, y[, animate])`

- `x` Integer

- `y` Integer

- `animate` boolean (optional) *macOS*

Moves window to `x` and `y`.

#### `win.getPosition()`

Returns `Integer[]` - Contains the window's current position.

> [!NOTE]
> 

> note

> 

On Wayland, this method will return `[0, 0]` as introspecting or programmatically changing the global window coordinates is prohibited.

#### `win.setTitle(title)`

- `title` string

Changes the title of native window to `title`.

#### `win.getTitle()`

Returns `string` - The title of the native window.

> [!NOTE]
> 

> note

> 

The title of the web page can be different from the title of the native
window.

#### `win.setSheetOffset(offsetY[, offsetX])` *macOS*

- `offsetY` Float

- `offsetX` Float (optional)

Changes the attachment point for sheets on macOS. By default, sheets are
attached just below the window frame, but you may want to display them beneath
a HTML-rendered toolbar. Como por exemplo:

```javascript
const { BaseWindow } = require('electron')  
  
const win = new BaseWindow()  
  
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

> [!NOTE]
> 

> 

> 

#### ``****
``

> [!NOTE]
> 

> 

> 

#### ``

- ``
- ``

  - ``****``````

#### ``****

- ``
````

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
``

#### ``**

- ``

  - ``
  - ``
  - ``
  - ``
  - ``

[](https://learn.microsoft.com/en-us/windows/win32/api/dwmapi/ne-dwmapi-dwm_systembackdrop_type)

> [!NOTE]
> 

> 

> 

#### ``**

- ``[](/pt/docs/latest/api/structures/point)
``

#### ``**
````

#### ``**

- ``
````

> [!NOTE]
> 

> 

> 

#### ``****

- ``

  - ``
  - ``
  - ``

````[](https://github.com/electron/electron/edit/main/docs/api/base-window.md)[](/pt/docs/latest/api/auto-updater)[](/pt/docs/latest/api/browser-view)

- 
- 
- 
- 
- 

  - [``](#new-basewindowoptions)
  - 

    - 
    - 
    - [``](#event-query-session-end-windows)
    - [``](#event-session-end-windows)
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
    - [``](#event-app-command-windows-linux)
    - [``](#event-swipe-macos)
    - [``](#event-rotate-gesture-macos)
    - [``](#event-sheet-begin-macos)
    - [``](#event-sheet-end-macos)
    - [``](#event-new-window-for-tab-macos)
    - [``](#event-system-context-menu-windows-linux)

  - 

    - [``](#basewindowgetallwindows)
    - [``](#basewindowgetfocusedwindow)
    - [``](#basewindowfromidid)

  - 

    - [``](#winid-readonly)
    - [``](#wincontentview)
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

    - [``](#winsetcontentviewview)
    - [``](#wingetcontentview)
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
    - [``](#winaddtabbedwindowbasewindow-macos)
    - [``](#winsetvibrancytype-macos)
    - [``](#winsetbackgroundmaterialmaterial-windows)
    - [``](#winsetwindowbuttonpositionposition-macos)
    - [``](#wingetwindowbuttonposition-macos)
    - [``](#winsettouchbartouchbar-macos)
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
