---
title: "Representing Files in a BrowserWindow"
description: "## Visão Geral"
topics:
  - "Recursos e guias"
  - "Integracao com so"
keywords:
  - "Representing Files in a BrowserWindow"
  - "Command"
  - "Control"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/represented-file"
---

# Representing Files in a BrowserWindow

## Visão Geral

On macOS, you can set a represented file for any window in your application. The represented file's icon will be shown in the title bar, and when users `Command-Click` or `Control-Click`, a popup with a path to the file will be shown.

> 

NOTE: The screenshot above is an example where this feature is used to indicate the currently opened file in the Atom text editor.

You can also set the edited state for a window so that the file icon can indicate whether the document in this window has been modified.

To set the represented file of window, you can use the [BrowserWindow.setRepresentedFilename](/pt/docs/latest/api/browser-window#winsetrepresentedfilenamefilename-macos) and [BrowserWindow.setDocumentEdited](/pt/docs/latest/api/browser-window#winsetdocumenteditededited-macos) APIs.

## Exemplo

[docs/fiddles/features/represented-file (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/represented-file)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/represented-file)

- main.js
- index.html

```javascript
const { app, BrowserWindow } = require('electron/main')  
const os = require('node:os')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    width: 800,  
    height: 600  
  })  
  
  win.setRepresentedFilename(os.homedir())  
  win.setDocumentEdited(true)  
  
  win.loadFile('index.html')  
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
    <p>  
      Click on the title with the <pre>Command</pre> or <pre>Control</pre> key pressed.  
      You should see a popup with the represented file at the top.  
    </p>  
  </body>  
</body>  
</html>  

```

After launching the Electron application, click on the title with `Command` or `Control` key pressed. You should see a popup with the represented file at the top. In this guide, this is the current user's home directory:

[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/represented-file.md)[AnteriorDocumentos Recentes](/pt/docs/latest/tutorial/recent-documents)[AvançarSpellChecker](/pt/docs/latest/tutorial/spellchecker)
