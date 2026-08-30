---
title: "Application Menu"
description: "Each Electron app has a single top-level application menu."
topics:
  - "Recursos e guias"
  - "Interface e janelas"
keywords:
  - "Application Menu"
  - "Menu.setApplicationMenu"
  - "MenuItem"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/application-menu"
---

# Application Menu

Each Electron app has a single top-level application menu.

- On macOS, this menu is shown in the system [menu bar](https://support.apple.com/en-ca/guide/mac-help/mchlp1446/mac).

- On Windows and Linux, this menu is shown at the top of each [BaseWindow](/pt/docs/latest/api/base-window).

## Building application menus

The application menu can be set by passing a [Menu](/pt/docs/latest/api/menu) instance into the
[`Menu.setApplicationMenu`](/pt/docs/latest/api/menu#menusetapplicationmenumenu) static function.

When building an application menu in Electron, each top-level array menu item **must be a submenu**.

Electron will set a default menu for your app if this API is never called. Below is an example of
that default menu being created manually using shorthand [`MenuItem` roles](/pt/docs/latest/tutorial/menus#roles).
Manually creating the default menu

```javascript
const { shell } = require('electron/common')  
const { app, Menu } = require('electron/main')  
  
const isMac = process.platform === 'darwin'  
const template = [  
  // { role: 'appMenu' }  
  ...(isMac  
    ? [{  
        label: app.name,  
        submenu: [  
          { role: 'about' },  
          { type: 'separator' },  
          { role: 'services' },  
          { type: 'separator' },  
          { role: 'hide' },  
          { role: 'hideOthers' },  
          { role: 'unhide' },  
          { type: 'separator' },  
          { role: 'quit' }  
        ]  
      }]  
    : []),  
  // { role: 'fileMenu' }  
  {  
    label: 'File',  
    submenu: [  
      isMac ? { role: 'close' } : { role: 'quit' }  
    ]  
  },  
  // { role: 'editMenu' }  
  {  
    label: 'Edit',  
    submenu: [  
      { role: 'undo' },  
      { role: 'redo' },  
      { type: 'separator' },  
      { role: 'cut' },  
      { role: 'copy' },  
      { role: 'paste' },  
      ...(isMac  
        ? [  
            { role: 'pasteAndMatchStyle' },  
            { role: 'delete' },  
            { role: 'selectAll' },  
            { type: 'separator' },  
            {  
              label: 'Speech',  
              submenu: [  
                { role: 'startSpeaking' },  
                { role: 'stopSpeaking' }  
              ]  
            }  
          ]  
        : [  
            { role: 'delete' },  
            { type: 'separator' },  
            { role: 'selectAll' }  
          ])  
    ]  
  },  
  // { role: 'viewMenu' }  
  {  
    label: 'View',  
    submenu: [  
      { role: 'reload' },  
      { role: 'forceReload' },  
      { role: 'toggleDevTools' },  
      { type: 'separator' },  
      { role: 'resetZoom' },  
      { role: 'zoomIn' },  
      { role: 'zoomOut' },  
      { type: 'separator' },  
      { role: 'togglefullscreen' }  
    ]  
  },  
  // { role: 'windowMenu' }  
  {  
    label: 'Window',  
    submenu: [  
      { role: 'minimize' },  
      { role: 'zoom' },  
      ...(isMac  
        ? [  
            { type: 'separator' },  
            { role: 'front' },  
            { type: 'separator' },  
            { role: 'window' }  
          ]  
        : [  
            { role: 'close' }  
          ])  
    ]  
  },  
  {  
    role: 'help',  
    submenu: [  
      {  
        label: 'Learn More',  
        click: async () => {  
          const { shell } = require('electron')  
          await shell.openExternal('https://electronjs.org')  
        }  
      }  
    ]  
  }  
]  
  
const menu = Menu.buildFromTemplate(template)  
Menu.setApplicationMenu(menu)  

```

> [!NOTE]
> 

> info

> 

On macOS, the first submenu of the application menu will **always** have your application's name
as its label. In general, you can populate this submenu by conditionally adding a menu item with
the `appMenu` role.

> [!TIP]
> 

> dica

> 

For additional descriptions of available roles, see the [`MenuItem` roles](/pt/docs/latest/tutorial/menus#roles)
section of the general Menus guide.

### Using standard OS menu roles

Defining each submenu explicitly can get very verbose. If you want to re-use default submenus
in your app, you can use various submenu-related roles provided by Electron.
Using default roles for each submenu

```javascript
const { shell } = require('electron/common')  
const { app, Menu } = require('electron/main')  
  
const template = [  
  ...(process.platform === 'darwin'  
    ? [{ role: 'appMenu' }]  
    : []),  
  { role: 'fileMenu' },  
  { role: 'editMenu' },  
  { role: 'viewMenu' },  
  { role: 'windowMenu' },  
  {  
    role: 'help',  
    submenu: [  
      {  
        label: 'Learn More',  
        click: async () => {  
          const { shell } = require('electron')  
          await shell.openExternal('https://electronjs.org')  
        }  
      }  
    ]  
  }  
]  
  
const menu = Menu.buildFromTemplate(template)  
Menu.setApplicationMenu(menu)  

```

> [!NOTE]
> 

> note

> 

On macOS, the `help` role defines a top-level Help submenu that has a search bar for
other menu items. It requires items to be added to its `submenu` to function.

## Setting window-specific application menus *Linux* *Windows*

Since the root application menu exists on each `BaseWindow` on Windows and Linux, you can override
it with a window-specific `Menu` instance via the [`win.setMenu`](/pt/docs/latest/api/browser-window#winsetmenumenu-linux-windows) method.
Override a window

```javascript
const { BrowserWindow, Menu } = require('electron/main')  
  
const win = new BrowserWindow()  
const menu = Menu.buildFromTemplate([  
  {  
    label: 'my custom menu',  
    submenu: [  
      { role: 'copy' },  
      { role: 'paste' }  
    ]  
  }  
])  
win.setMenu(menu)  

```

> [!TIP]
> 

> dica

> 

You can remove a specific window's application menu by calling the
[`win.removeMenu`](/pt/docs/latest/api/base-window#winremovemenu-linux-windows) API.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/application-menu.md)[AnteriorMenus](/pt/docs/latest/tutorial/menus)[AvançarContext Menu](/pt/docs/latest/tutorial/context-menu)

- [Building application menus](#building-application-menus)

  - [Using standard OS menu roles](#using-standard-os-menu-roles)

- [Setting window-specific application menus *Linux* *Windows*](#setting-window-specific-application-menus-linux-windows)
