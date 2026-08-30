---
title: "Modo escuro"
description: "## Visão Geral"
topics:
  - "Recursos e guias"
  - "Interface e janelas"
keywords:
  - "Modo escuro"
  - "nativeTheme"
  - "nativeTheme.shouldUseDarkColors"
  - "Tray"
  - "NSRequiresAquaSystemAppearance"
  - "false"
  - "Info.plist"
  - "darwinDarkModeSupport"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/dark-mode"
---

# Modo escuro

## Visão Geral

### Atualiza automaticamente as interfaces nativas

"Native interfaces" include the file picker, window border, dialogs, context menus, and more - anything where the UI comes from your operating system and not from your app. O comportamento padrão é optar por esse tema automático do sistema operacional.

### Automatically update your own interfaces

If your app has its own dark mode, you should toggle it on and off in sync with the system's dark mode setting. You can do this by using the [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) CSS media query.

### Manually update your own interfaces

If you want to manually switch between light/dark modes, you can do this by setting the desired mode in the [themeSource](/pt/docs/latest/api/native-theme#nativethemethemesource) property of the `nativeTheme` module. This property's value will be propagated to your Renderer process. Any CSS rules related to `prefers-color-scheme` will be updated accordingly.

## macOS settings

No macOS 10.14 Mojave, a Apple introduziu um novo [system-wide dark mode](https://developer.apple.com/design/human-interface-guidelines/macos/visual-design/dark-mode/) para todos computadores macOS. If your Electron app has a dark mode, you can make it follow the system-wide dark mode setting using [the `nativeTheme` API](/pt/docs/latest/api/native-theme).

In macOS 10.15 Catalina, Apple introduced a new "automatic" dark mode option for all macOS computers. In order for the `nativeTheme.shouldUseDarkColors` and `Tray` APIs to work correctly in this mode on Catalina, you need to use Electron `>=7.0.0`, or set `NSRequiresAquaSystemAppearance` to `false` in your `Info.plist` file for older versions. Both [Electron Packager](https://github.com/electron/packager) and [Electron Forge](https://www.electronforge.io/) have a [`darwinDarkModeSupport` option](https://electron.github.io/packager/main/interfaces/electronpackager.options.html#darwindarkmodesupport) to automate the `Info.plist` changes during app build time.

If you wish to opt-out while using Electron > 8.0.0, you must set the `NSRequiresAquaSystemAppearance` key in the `Info.plist` file to `true`. Please note that Electron 8.0.0 and above will not let you opt-out of this theming, due to the use of the macOS 10.14 SDK.

## Exemplo

Este exemplo demonstra um aplicativo Electron que deriva suas cores de tema do `nativeTheme`. Além disso, ele fornece controles de alternância e redefinição de tema usando canais IPC.
[docs/fiddles/features/dark-mode (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/dark-mode)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/dark-mode)

- main.js
- preload.js
- index.html
- renderer.js
- styles.css

```javascript
const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron/main')  
const path = require('node:path')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    width: 800,  
    height: 600,  
    webPreferences: {  
      preload: path.join(__dirname, 'preload.js')  
    }  
  })  
  
  win.loadFile('index.html')  
}  
  
ipcMain.handle('dark-mode:toggle', () => {  
  if (nativeTheme.shouldUseDarkColors) {  
    nativeTheme.themeSource = 'light'  
  } else {  
    nativeTheme.themeSource = 'dark'  
  }  
  return nativeTheme.shouldUseDarkColors  
})  
  
ipcMain.handle('dark-mode:system', () => {  
  nativeTheme.themeSource = 'system'  
})  
  
app.whenReady().then(() => {  
  createWindow()  
  
  app.on('activate', () => {  
    if (BrowserWindow.getAllWindows().length === 0) {  
      createWindow()  
    }  
  })  
})  
  
app.on('window-all-closed', () => {  
  if (process.platform !== 'darwin') {  
    app.quit()  
  }  
})  

```

```javascript
const { contextBridge, ipcRenderer } = require('electron/renderer')  
  
contextBridge.exposeInMainWorld('darkMode', {  
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),  
  system: () => ipcRenderer.invoke('dark-mode:system')  
})  

```

```javascript
<!DOCTYPE html>  
<html>  
<head>  
    <meta charset="UTF-8">  
    <title>Hello World!</title>  
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />  
    <link rel="stylesheet" type="text/css" href="./styles.css">  
</head>  
<body>  
    <h1>Hello World!</h1>  
    <p>Current theme source: <strong id="theme-source">System</strong></p>  
  
    <button id="toggle-dark-mode">Toggle Dark Mode</button>  
    <button id="reset-to-system">Reset to System Theme</button>  
  
    <script src="renderer.js"></script>  
</body>  
</html>  

```

```javascript
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {  
  const isDarkMode = await window.darkMode.toggle()  
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'  
})  
  
document.getElementById('reset-to-system').addEventListener('click', async () => {  
  await window.darkMode.system()  
  document.getElementById('theme-source').innerHTML = 'System'  
})  

```

```javascript
:root {  
  color-scheme: light dark;  
}  
  
@media (prefers-color-scheme: dark) {  
  body { background: #333; color: white; }  
}  
  
@media (prefers-color-scheme: light) {  
  body { background: #ddd; color: black; }  
}  

```

### Como isso funciona?

Iniciando com o arquivo `index.html`:
index.html

```javascript
<!DOCTYPE html>  
<html>  
<head>  
    <meta charset="UTF-8">  
    <title>Hello World!</title>  
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />  
    <link rel="stylesheet" type="text/css" href="./styles.css">  
</head>  
<body>  
    <h1>Hello World!</h1>  
    <p>Current theme source: <strong id="theme-source">System</strong></p>  
  
    <button id="toggle-dark-mode">Toggle Dark Mode</button>  
    <button id="reset-to-system">Reset to System Theme</button>  
  
    <script src="renderer.js"></script>  
</body>  
</html>  

```

E o arquivo `styles.css`:
styles.css

```javascript
@media (prefers-color-scheme: dark) {  
  body { background: #333; color: white; }  
}  
  
@media (prefers-color-scheme: light) {  
  body { background: #ddd; color: black; }  
}  

```

The example renders an HTML page with a couple elements. The `<strong id="theme-source">` element shows which theme is currently selected, and the two `<button>` elements are the controls. The CSS file uses the [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query to set the `<body>` element background and text colors.

The `preload.js` script adds a new API to the `window` object called `darkMode`. This API exposes two IPC channels to the renderer process, `'dark-mode:toggle'` and `'dark-mode:system'`. It also assigns two methods, `toggle` and `system`, which pass messages from the renderer to the main process.
preload.js

```javascript
const { contextBridge, ipcRenderer } = require('electron')  
  
contextBridge.exposeInMainWorld('darkMode', {  
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),  
  system: () => ipcRenderer.invoke('dark-mode:system')  
})  

```

Now the renderer process can communicate with the main process securely and perform the necessary mutations to the `nativeTheme` object.

The `renderer.js` file is responsible for controlling the `<button>` functionality.
renderer.js

```javascript
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {  
  const isDarkMode = await window.darkMode.toggle()  
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'  
})  
  
document.getElementById('reset-to-system').addEventListener('click', async () => {  
  await window.darkMode.system()  
  document.getElementById('theme-source').innerHTML = 'System'  
})  

```

Using `addEventListener`, the `renderer.js` file adds `'click'` [event listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) to each button element. Each event listener handler makes calls to the respective `window.darkMode` API methods.

Finally, the `main.js` file represents the main process and contains the actual `nativeTheme` API.

```javascript
const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')  
  
const path = require('node:path')  
  
const createWindow = () => {  
  const win = new BrowserWindow({  
    width: 800,  
    height: 600,  
    webPreferences: {  
      preload: path.join(__dirname, 'preload.js')  
    }  
  })  
  
  win.loadFile('index.html')  
  
  ipcMain.handle('dark-mode:toggle', () => {  
    if (nativeTheme.shouldUseDarkColors) {  
      nativeTheme.themeSource = 'light'  
    } else {  
      nativeTheme.themeSource = 'dark'  
    }  
    return nativeTheme.shouldUseDarkColors  
  })  
  
  ipcMain.handle('dark-mode:system', () => {  
    nativeTheme.themeSource = 'system'  
  })  
}  
  
app.whenReady().then(() => {  
  createWindow()  
  
  app.on('activate', () => {  
    if (BrowserWindow.getAllWindows().length === 0) {  
      createWindow()  
    }  
  })  
})  
  
app.on('window-all-closed', () => {  
  if (process.platform !== 'darwin') {  
    app.quit()  
  }  
})  

```

The `ipcMain.handle` methods are how the main process responds to the click events from the buttons on the HTML page.

The `'dark-mode:toggle'` IPC channel handler method checks the `shouldUseDarkColors` boolean property, sets the corresponding `themeSource`, and then returns the current `shouldUseDarkColors` property. Looking back on the renderer process event listener for this IPC channel, the return value from this handler is utilized to assign the correct text to the `<strong id='theme-source'>` element.

The `'dark-mode:system'` IPC channel handler method assigns the string `'system'` to the `themeSource` and returns nothing. This also corresponds with the relative renderer process event listener as the method is awaited with no return value expected.

Run the example using Electron Fiddle and then click the "Toggle Dark Mode" button; the app should start alternating between a light and dark background color.

[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/dark-mode.md)[AnteriorExamples Overview](/pt/docs/latest/tutorial/examples)[AvançarDevice Access](/pt/docs/latest/tutorial/devices)

- [Visão Geral](#visão-geral)

  - [Atualiza automaticamente as interfaces nativas](#atualiza-automaticamente-as-interfaces-nativas)
  - [Automatically update your own interfaces](#automatically-update-your-own-interfaces)
  - [Manually update your own interfaces](#manually-update-your-own-interfaces)

- [macOS settings](#macos-settings)
- [Exemplo](#exemplo)

  - [Como isso funciona?](#como-isso-funciona)

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
