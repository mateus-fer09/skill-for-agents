---
title: "Deep Links"
description: "## Visão Geral"
topics:
  - "Recursos e guias"
  - "Integracao com so"
keywords:
  - "Deep Links"
  - "electron"
  - "index.html"
  - "BrowserWindow"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/launch-app-from-url-in-another-app"
---

# Deep Links

## Visão Geral

This guide will take you through the process of setting your Electron app as the default handler for a specific [protocol](/pt/docs/latest/api/protocol).

By the end of this tutorial, we will have set our app to intercept and handle any clicked URLs that start with a specific protocol. In this guide, the protocol we will use will be "`electron-fiddle://`".

## Exemplos

### Main Process (main.js)

First, we will import the required modules from `electron`. These modules help control our application lifecycle and create a native browser window.

```javascript
const { app, BrowserWindow, shell } = require('electron')  
  
const path = require('node:path')  

```

Next, we will proceed to register our application to handle all "`electron-fiddle://`" protocols.

```javascript
if (process.defaultApp) {  
  if (process.argv.length >= 2) {  
    app.setAsDefaultProtocolClient('electron-fiddle', process.execPath, [path.resolve(process.argv[1])])  
  }  
} else {  
  app.setAsDefaultProtocolClient('electron-fiddle')  
}  

```

We will now define the function in charge of creating our browser window and load our application's `index.html` file.

```javascript
let mainWindow  
  
const createWindow = () => {  
  // Create the browser window.  
  mainWindow = new BrowserWindow({  
    width: 800,  
    height: 600,  
    webPreferences: {  
      preload: path.join(__dirname, 'preload.js')  
    }  
  })  
  
  mainWindow.loadFile('index.html')  
}  

```

In this next step, we will create our `BrowserWindow` and tell our application how to handle an event in which an external protocol is clicked.

This code will be different in Windows and Linux compared to macOS. This is due to both platforms emitting the `second-instance` event rather than the `open-url` event and Windows requiring additional code in order to open the contents of the protocol link within the same Electron instance. Read more about this [here](/pt/docs/latest/api/app#apprequestsingleinstancelockadditionaldata).

#### Windows and Linux code:

```javascript
const gotTheLock = app.requestSingleInstanceLock()  
  
if (!gotTheLock) {  
  app.quit()  
} else {  
  app.on('second-instance', (event, commandLine, workingDirectory) => {  
    // Someone tried to run a second instance, we should focus our window.  
    if (mainWindow) {  
      if (mainWindow.isMinimized()) mainWindow.restore()  
      mainWindow.focus()  
    }  
    // the commandLine is array of strings in which last element is deep link url  
    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop()}`)  
  })  
  
  // Create mainWindow, load the rest of the app, etc...  
  app.whenReady().then(() => {  
    createWindow()  
    // Check for deep link on cold start  
    if (process.argv.length >= 2) {  
      const lastArg = process.argv[process.argv.length - 1]  
      if (lastArg.startsWith('electron-fiddle://')) {  
        dialog.showErrorBox('Welcome Back', `You arrived from: ${lastArg}`)  
      }  
    }  
  })  
}  

```

#### macOS code:

```javascript
// This method will be called when Electron has finished  
// initialization and is ready to create browser windows.  
// Algumas APIs podem ser usadas somente depois que este evento ocorre.  
app.whenReady().then(() => {  
  createWindow()  
})  
  
// Handle the protocol. In this case, we choose to show an Error Box.  
app.on('open-url', (event, url) => {  
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)  
})  

```

Finally, we will add some additional code to handle when someone closes our application.

```javascript
// Quit when all windows are closed, except on macOS. There, it's common  
// for applications and their menu bar to stay active until the user quits  
// explicitly with Cmd + Q.  
app.on('window-all-closed', () => {  
  if (process.platform !== 'darwin') app.quit()  
})  

```

## Important notes

### Empacotando

On macOS and Linux, this feature will only work when your app is packaged. It will not work when you're launching it in development from the command-line. When you package your app you'll need to make sure the macOS `Info.plist` and the Linux `.desktop` files for the app are updated to include the new protocol handler. Some of the Electron tools for bundling and distributing apps handle this for you.

#### [Electron Forge](https://electronforge.io)

If you're using Electron Forge, adjust `packagerConfig` for macOS support, and the configuration for the appropriate Linux makers for Linux support, in your [Forge configuration](https://www.electronforge.io/configuration) *(please note the following example only shows the bare minimum needed to add the configuration changes)*:

```javascript
{  
  "config": {  
    "forge": {  
      "packagerConfig": {  
        "protocols": [  
          {  
            "name": "Electron Fiddle",  
            "schemes": ["electron-fiddle"]  
          }  
        ]  
      },  
      "makers": [  
        {  
          "name": "@electron-forge/maker-deb",  
          "config": {  
            "mimeType": ["x-scheme-handler/electron-fiddle"]  
          }  
        }  
      ]  
    }  
  }  
}  

```

#### [Electron Packager](https://github.com/electron/packager)

For macOS support:

If you're using Electron Packager's API, adding support for protocol handlers is similar to how Electron Forge is handled, except `protocols` is part of the Packager options passed to the `packager` function.

```javascript
const packager = require('@electron/packager')  
  
packager({  
  // ...other options...  
  protocols: [  
    {  
      name: 'Electron Fiddle',  
      schemes: ['electron-fiddle']  
    }  
  ]  
  
}).then(paths => console.log(`SUCCESS: Created ${paths.join(', ')}`))  
  .catch(err => console.error(`ERROR: ${err.message}`))  

```

If you're using Electron Packager's CLI, use the `--protocol` and `--protocol-name` flags. For example:

```javascript
npx electron-packager . --protocol=electron-fiddle --protocol-name="Electron Fiddle"  

```

## Conclusão

After you start your Electron app, you can enter in a URL in your browser that contains the custom protocol, for example `"electron-fiddle://open"` and observe that the application will respond and show an error dialog box.
[docs/fiddles/system/protocol-handler/launch-app-from-URL-in-another-app (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/system/protocol-handler/launch-app-from-URL-in-another-app)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/system/protocol-handler/launch-app-from-URL-in-another-app)

- main.js
- preload.js
- index.html
- renderer.js

```javascript
// Modules to control application life and create native browser window  
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron/main')  
const path = require('node:path')  
  
let mainWindow  
  
if (process.defaultApp) {  
  if (process.argv.length >= 2) {  
    app.setAsDefaultProtocolClient('electron-fiddle', process.execPath, [path.resolve(process.argv[1])])  
  }  
} else {  
  app.setAsDefaultProtocolClient('electron-fiddle')  
}  
  
const gotTheLock = app.requestSingleInstanceLock()  
  
if (!gotTheLock) {  
  app.quit()  
} else {  
  app.on('second-instance', (event, commandLine, workingDirectory) => {  
    // Someone tried to run a second instance, we should focus our window.  
    if (mainWindow) {  
      if (mainWindow.isMinimized()) mainWindow.restore()  
      mainWindow.focus()  
    }  
  
    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)  
  })  
  
  // Create mainWindow, load the rest of the app, etc...  
  app.whenReady().then(() => {  
    createWindow()  
  })  
  
  app.on('open-url', (event, url) => {  
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)  
  })  
}  
  
function createWindow () {  
  // Create the browser window.  
  mainWindow = new BrowserWindow({  
    width: 800,  
    height: 600,  
    webPreferences: {  
      preload: path.join(__dirname, 'preload.js')  
    }  
  })  
  
  mainWindow.loadFile('index.html')  
}  
  
// Quit when all windows are closed, except on macOS. There, it's common  
// for applications and their menu bar to stay active until the user quits  
// explicitly with Cmd + Q.  
app.on('window-all-closed', function () {  
  if (process.platform !== 'darwin') app.quit()  
})  
  
// Handle window controls via IPC  
ipcMain.on('shell:open', () => {  
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')  
  const pagePath = path.join('file://', pageDirectory, 'index.html')  
  shell.openExternal(pagePath)  
})  

```

```javascript
const { contextBridge, ipcRenderer } = require('electron/renderer')  
  
contextBridge.exposeInMainWorld('shell', {  
  open: () => ipcRenderer.send('shell:open')  
})  

```

```javascript
<!DOCTYPE html>  
<html>  
  
<head>  
  <meta charset="UTF-8">  
  <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->  
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">  
  <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'">  
  <title>app.setAsDefaultProtocol Demo</title>  
</head>  
  
<body>  
  <h1>App Default Protocol Demo</h1>  
  
  <p>The protocol API allows us to register a custom protocol and intercept existing protocol requests.</p>  
  <p>These methods allow you to set and unset the protocols your app should be the default app for. Similar to when a  
    browser asks to be your default for viewing web pages.</p>  
  
  <p>Open the <a href="https://www.electronjs.org/docs/latest/api/protocol">full protocol API documentation</a> in your  
    browser.</p>  
  
  -----  
  
  <h3>Demo</h3>  
  <p>  
    First: Launch current page in browser  
    <button id="open-in-browser" class="js-container-target demo-toggle-button">  
        Click to Launch Browser  
      </button>  
  </p>  
  
  <p>  
    Then: Launch the app from a web link!  
    <a href="electron-fiddle://open">Click here to launch the app</a>  
  </p>  
  
  ----  
  
  <p>You can set your app as the default app to open for a specific protocol. For instance, in this demo we set this app  
    as the default for <code>electron-fiddle://</code>. The demo button above will launch a page in your default  
    browser with a link. Click that link and it will re-launch this app.</p>  
  
  
  <h3>Packaging</h3>  
  <p>This feature will only work on macOS when your app is packaged. It will not work when you're launching it in  
    development from the command-line. When you package your app you'll need to make sure the macOS <code>plist</code>  
    for the app is updated to include the new protocol handler. If you're using <code>@electron/packager</code> then you  
    can add the flag <code>--extend-info</code> with a path to the <code>plist</code> you've created. The one for this  
    app is below:</p>  
  
  <p>  
  <h5>macOS plist</h5>  
  <pre><code>  
    <?xml version="1.0" encoding="UTF-8"?>  
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">  
            <plist version="1.0">  
                <dict>  
                    <key>CFBundleURLTypes</key>  
                    <array>  
                        <dict>  
                            <key>CFBundleURLSchemes</key>  
                            <array>  
                                <string>electron-api-demos</string>  
                            </array>  
                            <key>CFBundleURLName</key>  
                            <string>Electron API Demos Protocol</string>  
                        </dict>  
                    </array>  
                    <key>ElectronTeamID</key>  
                    <string>VEKTX9H2N7</string>  
                </dict>  
            </plist>  
        </code>  
    </pre>  
  <p>  
  
    <!-- You can also require other files to run in this process -->  
    <script src="./renderer.js"></script>  
</body>  
  
</html>  

```

```javascript
// This file is required by the index.html file and will  
// be executed in the renderer process for that window.  
// All APIs exposed by the context bridge are available here.  
  
// Binds the buttons to the context bridge API.  
document.getElementById('open-in-browser').addEventListener('click', () => {  
  window.shell.open()  
})  

```
[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/launch-app-from-url-in-another-app.md)[AnteriorAtalhos do Teclado](/pt/docs/latest/tutorial/keyboard-shortcuts)[AvançarDesktop Launcher Actions](/pt/docs/latest/tutorial/linux-desktop-actions)

- [Visão Geral](#visão-geral)
- [Exemplos](#exemplos)

  - [Main Process (main.js)](#main-process-mainjs)

    - [Windows and Linux code:](#windows-and-linux-code)
    - [macOS code:](#macos-code)

- [Important notes](#important-notes)

  - [Empacotando](#empacotando)

    - [Electron Forge](#electron-forge)
    - [Electron Packager](#electron-packager)

- [Conclusão](#conclusão)
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
