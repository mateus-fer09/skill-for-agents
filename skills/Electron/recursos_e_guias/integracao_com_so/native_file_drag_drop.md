---
title: "Nativo Arquivo Drag & Drop"
description: "## Visão Geral"
topics:
  - "Recursos e guias"
  - "Integracao com so"
keywords:
  - "Nativo Arquivo Drag & Drop"
  - "ondragstart"
  - "preload.js"
  - "contextBridge"
  - "index.html"
  - "renderer.js"
  - "main.js"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/native-file-drag-drop"
---

# Nativo Arquivo Drag & Drop

## Visão Geral

Alguns tipos de aplicativos que manipulam arquivos talvez queiram oferecer suporte ao recurso de drag & drop (arrastar e soltar) nativo do sistema operacional. Arrastar arquivos para a web é bastante comum e utilizado por muitos sites. Além disso, Electron adicionou suporte para arrastar arquivos e conteúdos de fora do conteúdo web para o mundo do sistema operacional.

To implement this feature in your app, you need to call the [`webContents.startDrag(item)`](/pt/docs/latest/api/web-contents#contentsstartdragitem) API in response to the `ondragstart` event.

## Exemplo

An example demonstrating how you can create a file on the fly to be dragged out of the window.

### Preload.js

In `preload.js` use the [`contextBridge`](/pt/docs/latest/api/context-bridge) to inject a method `window.electron.startDrag(...)` that will send an IPC message to the main process.

```javascript
const { contextBridge, ipcRenderer } = require('electron')  
  
contextBridge.exposeInMainWorld('electron', {  
  startDrag: (fileName) => ipcRenderer.send('ondragstart', fileName)  
})  

```

### Index.html

Add a draggable element to `index.html`, and reference your renderer script:

```javascript
<div style="border:2px solid black;border-radius:3px;padding:5px;display:inline-block" draggable="true" id="drag">Drag me</div>  
<script src="renderer.js"></script>  

```

### Renderer.js

In `renderer.js` set up the renderer process to handle drag events by calling the method you added via the [`contextBridge`](/pt/docs/latest/api/context-bridge) above.

```javascript
document.getElementById('drag').ondragstart = (event) => {  
  event.preventDefault()  
  window.electron.startDrag('drag-and-drop.md')  
}  

```

### Main.js

In the Main process (`main.js` file), expand the received event with a path to the file that is being dragged and an icon:
[docs/fiddles/features/drag-and-drop (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/drag-and-drop)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/drag-and-drop)

- main.js
- preload.js
- index.html
- renderer.js

```javascript
const { app, BrowserWindow, ipcMain } = require('electron/main')  
const path = require('node:path')  
const fs = require('node:fs')  
const https = require('node:https')  
  
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
  
const iconName = path.join(__dirname, 'iconForDragAndDrop.png')  
const icon = fs.createWriteStream(iconName)  
  
// Create a new file to copy - you can also copy existing files.  
fs.writeFileSync(path.join(__dirname, 'drag-and-drop-1.md'), '# First file to test drag and drop')  
fs.writeFileSync(path.join(__dirname, 'drag-and-drop-2.md'), '# Second file to test drag and drop')  
  
https.get('https://img.icons8.com/ios/452/drag-and-drop.png', (response) => {  
  response.pipe(icon)  
})  
  
app.whenReady().then(createWindow)  
  
ipcMain.on('ondragstart', (event, filePath) => {  
  event.sender.startDrag({  
    file: path.join(__dirname, filePath),  
    icon: iconName  
  })  
})  
  
app.on('window-all-closed', () => {  
  if (process.platform !== 'darwin') {  
    app.quit()  
  }  
})  
  
app.on('activate', () => {  
  if (BrowserWindow.getAllWindows().length === 0) {  
    createWindow()  
  }  
})  

```

```javascript
const { contextBridge, ipcRenderer } = require('electron/renderer')  
  
contextBridge.exposeInMainWorld('electron', {  
  startDrag: (fileName) => ipcRenderer.send('ondragstart', fileName)  
})  

```

```javascript
<!DOCTYPE html>  
<html>  
<head>  
    <meta charset="UTF-8">  
    <title>Hello World!</title>  
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />  
</head>  
<body>  
    <h1>Hello World!</h1>  
    <p>Drag the boxes below to somewhere in your OS (Finder/Explorer, Desktop, etc.) to copy an example markdown file.</p>  
    <div style="border:2px solid black;border-radius:3px;padding:5px;display:inline-block" draggable="true" id="drag1">Drag me - File 1</div>  
    <div style="border:2px solid black;border-radius:3px;padding:5px;display:inline-block" draggable="true" id="drag2">Drag me - File 2</div>  
    <script src="renderer.js"></script>  
</body>  
</html>  

```

```javascript
document.getElementById('drag1').ondragstart = (event) => {  
  event.preventDefault()  
  window.electron.startDrag('drag-and-drop-1.md')  
}  
  
document.getElementById('drag2').ondragstart = (event) => {  
  event.preventDefault()  
  window.electron.startDrag('drag-and-drop-2.md')  
}  

```

After launching the Electron application, try dragging and dropping the item from the BrowserWindow onto your desktop. In this guide, the item is a Markdown file located in the root of the project:

## Dragging files into your app

You can use the standard [Drag and Drop web API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) for dragging and dropping files into your app.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/native-file-drag-drop.md)[AnteriorMultitarefa](/pt/docs/latest/tutorial/multithreading)[AvançarNavigation History](/pt/docs/latest/tutorial/navigation-history)

- [Visão Geral](#visão-geral)
- [Exemplo](#exemplo)

  - [Preload.js](#preloadjs)
  - [Index.html](#indexhtml)
  - [Renderer.js](#rendererjs)
  - [Main.js](#mainjs)

- [Dragging files into your app](#dragging-files-into-your-app)
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
