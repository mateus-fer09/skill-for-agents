---
title: "Custom Window Styles"
description: "## Frameless windows"
topics:
  - "Recursos e guias"
  - "Interface e janelas"
keywords:
  - "Custom Window Styles"
  - "frame"
  - "BrowserWindow"
  - "false"
  - "transparent"
  - "true"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/custom-window-styles"
---

# Custom Window Styles

## Frameless windows

A frameless window removes all [chrome](https://developer.mozilla.org/en-US/docs/Glossary/Chrome) applied by the OS, including window controls.

To create a frameless window, set the [BaseWindowContructorOptions](/pt/docs/latest/api/structures/base-window-options) `frame` param in the `BrowserWindow` constructor to `false`.
[docs/fiddles/features/window-customization/custom-window-styles/frameless-windows (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/window-customization/custom-window-styles/frameless-windows)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/window-customization/custom-window-styles/frameless-windows)

- main.js

```javascript
const { app, BrowserWindow } = require('electron')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    width: 300,  
    height: 200,  
    frame: false  
  })  
  win.loadURL('https://example.com')  
}  
  
app.whenReady().then(() => {  
  createWindow()  
})  

```

On Wayland (Linux), frameless windows have GTK drop shadows and extended
resize boundaries by default. To create a fully frameless window with no
decorations, set `hasShadow: false` in the window constructor options.

## Transparent windows

To create a fully transparent window, set the [BaseWindowContructorOptions](/pt/docs/latest/api/structures/base-window-options) `transparent` param in the `BrowserWindow` constructor to `true`.

The following fiddle takes advantage of a transparent window and CSS styling to create
the illusion of a circular window.
[docs/fiddles/features/window-customization/custom-window-styles/transparent-windows (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/window-customization/custom-window-styles/transparent-windows)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/window-customization/custom-window-styles/transparent-windows)

- main.js
- index.html
- styles.css

```javascript
const { app, BrowserWindow } = require('electron')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    width: 100,  
    height: 100,  
    resizable: false,  
    frame: false,  
    transparent: true  
  })  
  win.loadFile('index.html')  
}  
  
app.whenReady().then(() => {  
  createWindow()  
})  

```

```javascript
<!DOCTYPE html>  
<html>  
  <head>  
    <meta charset="UTF-8">  
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->  
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">  
    <link href="./styles.css" rel="stylesheet">  
    <title>Transparent Hello World</title>  
  </head>  
  <body>  
    <div class="white-circle">  
        <div>Hello World!</div>  
    </div>  
  </body>  
</html>  

```

```javascript
body {  
    margin: 0;  
    padding: 0;  
    background-color: rgba(0, 0, 0, 0); /* Transparent background */  
}  
.white-circle {  
    width: 100px;  
    height: 100px;  
    background-color: white;  
    border-radius: 50%;  
    display: flex;  
    align-items: center;  
    justify-content: center;  
    app-region: drag;  
    user-select: none;  
}  

```

### Limitações

- You cannot click through the transparent area. See
[#1335](https://github.com/electron/electron/issues/1335) for details.

- Transparent windows are not resizable. Setting `resizable` to `true` may make
a transparent window stop working on some platforms.

- The CSS [`blur()`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur()) filter only applies to the window's web contents, so there is
no way to apply blur effect to the content below the window (i.e. other applications
open on the user's system).

- The window will not be transparent when DevTools is opened.

- On *Windows*:

  - Transparent windows can not be maximized using the Windows system menu or by double
clicking the title bar. The reasoning behind this can be seen on
PR [#28207](https://github.com/electron/electron/pull/28207).

- On *macOS*:

  - The native window shadow will not be shown on a transparent window.

[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/custom-window-styles.md)[AnteriorCustom Window Interactions](/pt/docs/latest/tutorial/custom-window-interactions)[AvançarAcessibilidade](/pt/docs/latest/tutorial/accessibility)

- [Frameless windows](#frameless-windows)
- [Transparent windows](#transparent-windows)

  - [Limitações](#limitações)
