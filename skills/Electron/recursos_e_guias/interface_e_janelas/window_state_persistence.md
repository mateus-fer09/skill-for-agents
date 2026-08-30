---
title: "Window State Persistence"
description: "## Overview"
topics:
  - "Recursos e guias"
  - "Interface e janelas"
keywords:
  - "Window State Persistence"
  - "name"
  - "clearPersistedState"
  - "BaseWindow"
  - "BrowserWindow"
source_scope:
  - "https://electronjs.org/docs/latest/tutorial/window-state-persistence"
---

# Window State Persistence

## Overview

Window State Persistence allows your Electron application to automatically save and restore a window's position, size, and display modes (such as maximized or fullscreen states) across application restarts.

This feature is particularly useful for applications where users frequently resize, move, or maximize windows and expect them to remain in the same state when reopening the app.

## Usage

### Basic usage

To enable Window State Persistence, set `windowStatePersistence: true` in your window constructor options and provide a unique `name` for the window.

```javascript
const { app, BrowserWindow } = require('electron')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    name: 'main-window',  
    width: 800,  
    height: 600,  
    windowStatePersistence: true  
  })  
  
  win.loadFile('index.html')  
}  
  
app.whenReady().then(createWindow)  

```

With this configuration, Electron will automatically:

1. Restore the window's position, size, and display mode when created (if a previous state exists)

2. Save the window state whenever it changes (position, size, or display mode).

3. Emit a `persisted-state-restored` event after successfully restoring state.

4. Adapt restored window state to multi-monitor setups and display changes automatically.

> [!NOTE]
> 

> note

> 

Window State Persistence requires that the window has a unique `name` property set in its constructor options. This name serves as the identifier for storing and retrieving the window's saved state.

### Selective persistence

You can control which aspects of the window state are persisted by passing an object with specific options:

```javascript
const { app, BrowserWindow } = require('electron')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    name: 'main-window',  
    width: 800,  
    height: 600,  
    windowStatePersistence: {  
      bounds: true, // Save position and size (default: true)  
      displayMode: false // Don't save maximized/fullscreen/kiosk state (default: true)  
    }  
  })  
  
  win.loadFile('index.html')  
}  
  
app.whenReady().then(createWindow)  

```

In this example, the window will remember its position and size but will always start in normal mode, even if it was maximized or fullscreened when last closed.

### Clearing persisted state

You can programmatically clear the saved state for a specific window using the static `clearPersistedState` method:

```javascript
const { BrowserWindow } = require('electron')  
  
// Clear saved state for a specific window  
BrowserWindow.clearPersistedState('main-window')  
  
// Now when you create a window with this name,  
// it will use the default constructor options  
const win = new BrowserWindow({  
  name: 'main-window',  
  width: 800,  
  height: 600,  
  windowStatePersistence: true  
})  

```

## API reference

The Window State Persistence APIs are available on both `BaseWindow` and `BrowserWindow` (since `BrowserWindow` extends `BaseWindow`) and work identically.

For complete API documentation, see:

- [windowStatePersistence in BaseWindowConstructorOptions](/docs/latest/api/structures/base-window-options)

- [WindowStatePersistence object structure](/docs/latest/api/structures/window-state-persistence)

- [`BaseWindow.clearPersistedState()`](/docs/latest/api/base-window#basewindowclearpersistedstatename)

- [`persisted-state-restored` event](/docs/latest/api/base-window#event-persisted-state-restored)

[Edit this page](https://github.com/electron/electron/edit/main/docs/tutorial/window-state-persistence.md)
