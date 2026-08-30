---
title: "Custom Title Bar"
description: "## Basic tutorial"
topics:
  - "Recursos e guias"
  - "Interface e janelas"
keywords:
  - "Custom Title Bar"
  - "titleBarStyle"
  - "BrowserWindow"
  - "titleBarOverlay"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/custom-title-bar"
---

# Custom Title Bar

## Basic tutorial

Application windows have a default [chrome](https://developer.mozilla.org/en-US/docs/Glossary/Chrome) applied by the OS. Not to be confused
with the Google Chrome browser, window *chrome* refers to the parts of the window (e.g.
title bar, toolbars, controls) that are not a part of the main web content. While the
default title bar provided by the OS chrome is sufficient for simple use cases, many
applications opt to remove it. Implementing a custom title bar can help your application
feel more modern and consistent across platforms.

You can follow along with this tutorial by opening Fiddle with the following starter code.
[docs/fiddles/features/window-customization/custom-title-bar/starter-code (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/starter-code)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/starter-code)

- main.js

```javascript
const { app, BrowserWindow } = require('electron')  
  
function createWindow () {  
  const win = new BrowserWindow({})  
  win.loadURL('https://example.com')  
}  
  
app.whenReady().then(() => {  
  createWindow()  
})  

```

### Remove the default title bar

Let’s start by configuring a window with native window controls and a hidden title bar.
To remove the default title bar, set the [BaseWindowContructorOptions](/pt/docs/latest/api/structures/base-window-options) `titleBarStyle`
param in the `BrowserWindow` constructor to `'hidden'`.
[docs/fiddles/features/window-customization/custom-title-bar/remove-title-bar (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/remove-title-bar)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/remove-title-bar)

- main.js

```javascript
const { app, BrowserWindow } = require('electron')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    // remove the default titlebar  
    titleBarStyle: 'hidden'  
  })  
  win.loadURL('https://example.com')  
}  
  
app.whenReady().then(() => {  
  createWindow()  
})  

```

### Add native window controls *Windows* *Linux*

On macOS, setting `titleBarStyle: 'hidden'` removes the title bar while keeping the window’s
traffic light controls available in the upper left hand corner. However on Windows and Linux,
you’ll need to add window controls back into your `BrowserWindow` by setting the
[BaseWindowContructorOptions](/pt/docs/latest/api/structures/base-window-options) `titleBarOverlay` param in the `BrowserWindow` constructor.
[docs/fiddles/features/window-customization/custom-title-bar/native-window-controls (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/native-window-controls)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/native-window-controls)

- main.js

```javascript
const { app, BrowserWindow } = require('electron')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    // remove the default titlebar  
    titleBarStyle: 'hidden',  
    // expose window controls in Windows/Linux  
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})  
  })  
  win.loadURL('https://example.com')  
}  
  
app.whenReady().then(() => {  
  createWindow()  
})  

```

Setting `titleBarOverlay: true` is the simplest way to expose window controls back into
your `BrowserWindow`. If you’re interested in customizing the window controls further,
check out the sections [Custom traffic lights](#custom-traffic-lights-macos) and [Custom window controls](#custom-window-controls) that cover
this in more detail.

### Create a custom title bar

Now, let’s implement a simple custom title bar in the `webContents` of our `BrowserWindow`.
There’s nothing fancy here, just HTML and CSS!
[docs/fiddles/features/window-customization/custom-title-bar/custom-title-bar (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/custom-title-bar)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/custom-title-bar)

- main.js
- index.html
- styles.css

```javascript
const { app, BrowserWindow } = require('electron')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    // remove the default titlebar  
    titleBarStyle: 'hidden',  
    // expose window controls in Windows/Linux  
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})  
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
    <title>Custom Titlebar App</title>  
  </head>  
  <body>  
	  <!-- mount your title bar at the top of you application's body tag -->  
    <div class="titlebar">Cool titlebar</div>  
  </body>  
</html>  

```

```javascript
body {  
    margin: 0;  
}  
  
.titlebar {  
  height: 30px;  
  background: blue;  
  color: white;  
  display: flex;  
  justify-content: center;  
  align-items: center;  
}  

```

Currently our application window can’t be moved. Since we’ve removed the default title bar,
the application needs to tell Electron which regions are draggable. We’ll do this by adding
the CSS style `app-region: drag` to the custom title bar. Now we can drag the custom title
bar to reposition our app window!
[docs/fiddles/features/window-customization/custom-title-bar/custom-drag-region (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/custom-drag-region)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/custom-drag-region)

- main.js
- index.html
- styles.css

```javascript
const { app, BrowserWindow } = require('electron')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    // remove the default titlebar  
    titleBarStyle: 'hidden',  
    // expose window controls in Windows/Linux  
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})  
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
    <title>Custom Titlebar App</title>  
  </head>  
  <body>  
	  <!-- mount your title bar at the top of you application's body tag -->  
    <div class="titlebar">Cool titlebar</div>  
  </body>  
</html>  

```

```javascript
body {  
  margin: 0;  
}  
.titlebar {  
  height: 30px;  
  background: blue;  
  color: white;  
  display: flex;  
  justify-content: center;  
  align-items: center;  
  app-region: drag;  
}  

```

For more information around how to manage drag regions defined by your electron application,
see the [Custom draggable regions](/pt/docs/latest/tutorial/custom-window-interactions#custom-draggable-regions) section below.

One more step: we should make sure our title bar content doesn't overlap with the native
window controls. Buttons can appear on the right or left side of the frame (or both) depending
on RTL and the user's settings. We can create a safe area using the CSS variables
`env(titlebar-area-x, 0px)` and `env(titlebar-area-width, 100%)`.
[docs/fiddles/features/window-customization/custom-title-bar/safe-area (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/safe-area)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/window-customization/custom-title-bar/safe-area)

- main.js
- index.html
- styles.css

```javascript
const { app, BrowserWindow } = require('electron')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    // remove the default titlebar  
    titleBarStyle: 'hidden',  
    // expose window controls in Windows/Linux  
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})  
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
    <title>Custom Titlebar App</title>  
  </head>  
  <body>  
	  <!-- mount your title bar at the top of you application's body tag -->  
    <div class="titlebar">Cool titlebar</div>  
  </body>  
</html>  

```

```javascript
body {  
  margin: 0;  
}  
.titlebar {  
  background: blue;  
  color: white;  
  display: flex;  
  justify-content: center;  
  align-items: center;  
  app-region: drag;  
    
  margin-left: env(titlebar-area-x, 0);  
  width:       env(titlebar-area-width, 100%);  
  height:      env(titlebar-area-height, 30px);  
  box-sizing: border-box;  
  border: 1px dashed red;  
}  

```

Congratulations, you've just implemented a basic custom title bar!

## Advanced window customization

### Custom traffic lights *macOS*

#### Customize the look of your traffic lights *macOS*

The `customButtonsOnHover` title bar style will hide the traffic lights until you hover
over them. This is useful if you want to create custom traffic lights in your HTML but still
use the native UI to control the window.

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({ titleBarStyle: 'customButtonsOnHover' })  

```

#### Customize the traffic light position *macOS*

To modify the position of the traffic light window controls, there are two configuration
options available.

Applying `hiddenInset` title bar style will shift the vertical inset of the traffic lights
by a fixed amount.
main.js

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({ titleBarStyle: 'hiddenInset' })  

```

If you need more granular control over the positioning of the traffic lights, you can pass
a set of coordinates to the `trafficLightPosition` option in the `BrowserWindow`
constructor.
main.js

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({  
  titleBarStyle: 'hidden',  
  trafficLightPosition: { x: 10, y: 10 }  
})  

```

#### Show and hide the traffic lights programmatically *macOS*

You can also show and hide the traffic lights programmatically from the main process.
The `win.setWindowButtonVisibility` forces traffic lights to be shown or hidden depending
on the value of its boolean parameter.
main.js

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow()  
// hides the traffic lights  
win.setWindowButtonVisibility(false)  

```

> [!NOTE]
> 

> note

> 

Given the number of APIs available, there are many ways of achieving this. For instance,
combining `frame: false` with `win.setWindowButtonVisibility(true)` will yield the same
layout outcome as setting `titleBarStyle: 'hidden'`.

#### Custom window controls

The [Window Controls Overlay API](https://github.com/WICG/window-controls-overlay/blob/main/explainer.md) is a web standard that gives web apps the ability to
customize their title bar region when installed on desktop. Electron exposes this API
through the `titleBarOverlay` option in the `BrowserWindow` constructor. When `titleBarOverlay`
is enabled, the window controls become exposed in their default position, and DOM elements
cannot use the area underneath this region.

> [!NOTE]
> 

> note

> 

`titleBarOverlay` requires the `titleBarStyle` param in the `BrowserWindow` constructor
to have a value other than `default`.

The custom title bar tutorial covers a [basic example](#add-native-window-controls-windows-linux) of exposing
window controls by setting `titleBarOverlay: true`. The height, color (*Windows* *Linux*), and
symbol colors (*Windows*) of the window controls can be customized further by setting
`titleBarOverlay` to an object.

The value passed to the `height` property must be an integer. The `color` and `symbolColor`
properties accept `rgba()`, `hsla()`, and `#RRGGBBAA` color formats and support transparency.
If a color option is not specified, the color will default to its system color for the window
control buttons. Similarly, if the height option is not specified, the window controls will
default to the standard system height:
main.js

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({  
  titleBarStyle: 'hidden',  
  titleBarOverlay: {  
    color: '#2f3241',  
    symbolColor: '#74b1be',  
    height: 60  
  }  
})  

```

> [!NOTE]
> 

> note

> 

Once your title bar overlay is enabled from the main process, you can access the overlay's
color and dimension values from a renderer using a set of readonly
[JavaScript APIs](https://github.com/WICG/window-controls-overlay/blob/main/explainer.md#javascript-apis) and [CSS Environment Variables](https://github.com/WICG/window-controls-overlay/blob/main/explainer.md#css-environment-variables).[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/custom-title-bar.md)[AnteriorWindow Customization](/pt/docs/latest/tutorial/window-customization)[AvançarCustom Window Interactions](/pt/docs/latest/tutorial/custom-window-interactions)

- [Basic tutorial](#basic-tutorial)

  - [Remove the default title bar](#remove-the-default-title-bar)
  - [Add native window controls *Windows* *Linux*](#add-native-window-controls-windows-linux)
  - [Create a custom title bar](#create-a-custom-title-bar)

- [Advanced window customization](#advanced-window-customization)

  - [Custom traffic lights *macOS*](#custom-traffic-lights-macos)

    - [Customize the look of your traffic lights *macOS*](#customize-the-look-of-your-traffic-lights-macos)
    - [Customize the traffic light position *macOS*](#customize-the-traffic-light-position-macos)
    - [Show and hide the traffic lights programmatically *macOS*](#show-and-hide-the-traffic-lights-programmatically-macos)
    - [Custom window controls](#custom-window-controls)

Documentação

- [Introdução](/pt/docs/latest/)
- [Referência da API](/pt/docs/latest/api/app)
Listas de verificação

- [Performance](/pt/docs/latest/tutorial/performance)
- [Segurança](/pt/docs/latest/tutorial/security)
Ferramentas

- [Electron Forge](https://electronforge.io)
- [Electron Fiddle](/pt/fiddle)
Comunidade

- [Governança](/pt/governance)
- [Recursos](/pt/community)
- [Discord](https://discordapp.com/invite/APGC3k5yaH)
- [Bluesky](https://bsky.app/profile/electronjs.org)
- [X](https://x.com/electronjs)
- [Mastodon](https://social.lfx.dev/@electronjs)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/electron)
Mais

- [GitHub](https://github.com/electron/electron)
- [Open Collective](https://opencollective.com/electron)
- [Painel de infraestrutura](https://p.datadoghq.com/sb/c44e1df0-85d7-11ee-94c9-da7ad0900002-c245f7ef47d0d0c32abecdc0938c2a85)
[](https://openjsf.org/)Direitos autorais © [OpenJS Foundation](https://openjsf.org) e contribuidores do Electron. Todos os direitos reservados. A [OpenJS Foundation](https://openjsf.org) possui marcas registradas e utiliza marcas comerciais. Para uma lista de marcas da [OpenJS Foundation](https://openjsf.org), consulte nossa [Política de Marcas](https://trademark-policy.openjsf.org) e [Lista de Marcas](https://trademark-list.openjsf.org). Marcas e logotipos não indicados na [lista de marcas da OpenJS Foundation](https://trademark-list.openjsf.org) são marcas™™ ou marcas registradas®® de seus respectivos proprietários. O uso delas não implica qualquer afiliação ou endosso por parte deles.

[A OpenJS Foundation](https://openjsf.org) | [Termos de Uso](https://terms-of-use.openjsf.org) | [Política de Privacidade](https://privacy-policy.openjsf.org) | [Estatuto](https://bylaws.openjsf.org) | [Código de Conduta](https://code-of-conduct.openjsf.org) | [Política de Marcas](https://trademark-policy.openjsf.org) | [Lista de Marcas](https://trademark-list.openjsf.org) | [Política de Cookies](https://www.linuxfoundation.org/cookies)Hosting and infrastructure graciously provided by
