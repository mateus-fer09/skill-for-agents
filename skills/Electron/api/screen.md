---
title: "screen"
description: "Documentação técnica e referência da API de screen no Electron."
topics:
  - "Api"
keywords:
  - "ready"
  - "screen"
  - "window.screen"
  - "event"
  - "newDisplay"
  - "oldDisplay"
  - "display"
  - "changedMetrics"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/screen"
---

# screen

> 

Recupere informações sobre o tamanho da tela, monitores, posição do cursor, etc.

Process: [Main](/pt/docs/latest/glossary#main-process)

Este módulo não pode ser usado até que o evento `ready` do módulo `app` seja emitido.

`screen` é um [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

> 

[!NOTE] In the renderer / DevTools, `window.screen` is a reserved DOM property, so writing `let { screen } = require('electron')` will not work.

Um exemplo de criação de uma janela que preenche a tela inteira:
[docs/fiddles/screen/fit-screen (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/screen/fit-screen)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/screen/fit-screen)

- main.js

```javascript
// Retrieve information about screen size, displays, cursor position, etc.  
//  
// For more info, see:  
// https://www.electronjs.org/docs/latest/api/screen  
  
const { app, BrowserWindow, screen } = require('electron/main')  
  
let mainWindow = null  
  
app.whenReady().then(() => {  
  // Create a window that fills the screen's available work area.  
  const primaryDisplay = screen.getPrimaryDisplay()  
  const { width, height } = primaryDisplay.workAreaSize  
  
  mainWindow = new BrowserWindow({ width, height })  
  mainWindow.loadURL('https://electronjs.org')  
})  

```

Another example of creating a window in the external display:

```javascript
const { app, BrowserWindow, screen } = require('electron')  
  
let win  
  
app.whenReady().then(() => {  
  const displays = screen.getAllDisplays()  
  const externalDisplay = displays.find((display) => {  
    return display.bounds.x !== 0 || display.bounds.y !== 0  
  })  
  
  if (externalDisplay) {  
    win = new BrowserWindow({  
      x: externalDisplay.bounds.x + 50,  
      y: externalDisplay.bounds.y + 50  
    })  
    win.loadURL('https://github.com')  
  }  
})  

```

> 

[!NOTE] Screen coordinates used by this module are [Point](/pt/docs/latest/api/structures/point) structures. There are two kinds of coordinates available to the process:

- **Physical screen points** are raw hardware pixels on a display.

- **Device-independent pixel (DIP) points** are virtualized screen points scaled based on the DPI (dots per inch) of the display.

## Eventos

O módulo `screen` emite os seguintes eventos:

### Evento: 'display-added'

Retorna:

- `event` Event

- `newDisplay` [Display](/pt/docs/latest/api/structures/display)

Emitido quando `newDisplay` foi adicionado.

### Event: 'display-removed'

Retorna:

- `event` Event

- `oldDisplay` [Display](/pt/docs/latest/api/structures/display)

Emitted when `oldDisplay` has been removed.

### Event: 'display-metrics-changed'

Retorna:

- `event` Event

- `display` [Display](/pt/docs/latest/api/structures/display)

- `changedMetrics` string[]

Emitted when one or more metrics change in a `display`. The `changedMetrics` is an array of strings that describe the changes. Possible changes are `bounds`, `workArea`, `scaleFactor` and `rotation`.

## Métodos

O módulo `screen` tem os seguintes métodos:

### `screen.getCursorScreenPoint()`

Returns [Point](/pt/docs/latest/api/structures/point)

The current absolute position of the mouse pointer.

Not supported on Wayland (Linux).

> 

[!NOTE] The return value is a DIP point, not a screen physical point.

### `screen.getPrimaryDisplay()`

Returns [Display](/pt/docs/latest/api/structures/display) - The primary display.

### `screen.getAllDisplays()`

Returns [Display[]](/pt/docs/latest/api/structures/display) - An array of displays that are currently available.

### `screen.getDisplayNearestPoint(point)`

- `point` [Point](/pt/docs/latest/api/structures/point)

Returns [Display](/pt/docs/latest/api/structures/display) - The display nearest the specified point.

### `screen.getDisplayMatching(rect)`

- `rect` [Rectangle](/pt/docs/latest/api/structures/rectangle)

Returns [Display](/pt/docs/latest/api/structures/display) - The display that most closely intersects the provided bounds.

### `screen.screenToDipPoint(point)` *Windows* *Linux*

- `point` [Point](/pt/docs/latest/api/structures/point)

Returns [Point](/pt/docs/latest/api/structures/point)

Converts a screen physical point to a screen DIP point. The DPI scale is performed relative to the display containing the physical point.

Not currently supported on Wayland - if used there it will return the point passed in with no changes.

### `screen.dipToScreenPoint(point)` *Windows* *Linux*

- `point` [Point](/pt/docs/latest/api/structures/point)

Returns [Point](/pt/docs/latest/api/structures/point)

Converts a screen DIP point to a screen physical point. The DPI scale is performed relative to the display containing the DIP point.

Not currently supported on Wayland.

### `screen.screenToDipRect(window, rect)` *Windows*

- `window` [BrowserWindow](/pt/docs/latest/api/browser-window) | null

- `rect` [Rectangle](/pt/docs/latest/api/structures/rectangle)

Returns [Rectangle](/pt/docs/latest/api/structures/rectangle)

Converts a screen physical rect to a screen DIP rect. The DPI scale is performed relative to the display nearest to `window`. If `window` is null, scaling will be performed to the display nearest to `rect`.

### `screen.dipToScreenRect(window, rect)` *Windows*

- `window` [BrowserWindow](/pt/docs/latest/api/browser-window) | null

- `rect` [Rectangle](/pt/docs/latest/api/structures/rectangle)

Returns [Rectangle](/pt/docs/latest/api/structures/rectangle)

Converts a screen DIP rect to a screen physical rect. The DPI scale is performed relative to the display nearest to `window`. If `window` is null, scaling will be performed to the display nearest to `rect`.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/screen.md)[AnteriorsafeStorage](/pt/docs/latest/api/safe-storage)[Avançarsession](/pt/docs/latest/api/session)
