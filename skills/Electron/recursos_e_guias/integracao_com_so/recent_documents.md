---
title: "Documentos Recentes"
description: "## Visão Geral"
topics:
  - "Recursos e guias"
  - "Integracao com so"
keywords:
  - "Documentos Recentes"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/recent-documents"
---

# Documentos Recentes

## Visão Geral

Windows and macOS provide access to a list of recent documents opened by the application via JumpList or dock menu, respectively.

**JumpList:**

**Application dock menu:**

## Exemplo

### Managing recent documents

[docs/fiddles/features/recent-documents (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/recent-documents)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/recent-documents)

- main.js
- index.html

```javascript
const { app, BrowserWindow } = require('electron/main')  
const fs = require('node:fs')  
const path = require('node:path')  
  
function createWindow () {  
  const win = new BrowserWindow({  
    width: 800,  
    height: 600  
  })  
  
  win.loadFile('index.html')  
}  
  
const fileName = 'recently-used.md'  
fs.writeFile(fileName, 'Lorem Ipsum', () => {  
  app.addRecentDocument(path.join(__dirname, fileName))  
})  
  
app.whenReady().then(createWindow)  
  
app.on('window-all-closed', () => {  
  app.clearRecentDocuments()  
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
<!DOCTYPE html>  
<html>  
<head>  
    <meta charset="UTF-8">  
    <title>Recent Documents</title>  
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />  
</head>  
<body>  
    <h1>Recent Documents</h1>  
    <p>  
        Right click on the app icon to see recent documents.  
        You should see `recently-used.md` added to the list of recent files  
    </p>  
</body>  
</html>  

```

#### Adding a recent document

To add a file to recent documents, use the [app.addRecentDocument](/pt/docs/latest/api/app#appaddrecentdocumentpath-macos-windows) API.

After launching the Electron application, right click the application icon. In this guide, the item is a Markdown file located in the root of the project. You should see `recently-used.md` added to the list of recent files:

#### Clearing the list of recent documents

To clear the list of recent documents, use the [app.clearRecentDocuments](/pt/docs/latest/api/app#appclearrecentdocuments-macos-windows) API. In this guide, the list of documents is cleared once all windows have been closed.

#### Accessing the list of recent documents

To access the list of recent documents, use the [app.getRecentDocuments](/pt/docs/latest/api/app#appgetrecentdocuments-macos-windows) API.

## Additional information

### Windows Notes

To use this feature on Windows, your application has to be registered as a handler of the file type of the document, otherwise the file won't appear in JumpList even after you have added it. You can find everything on registering your application in [Application Registration](https://learn.microsoft.com/en-us/windows/win32/shell/app-registration).

When a user clicks a file from the JumpList, a new instance of your application will be started with the path of the file added as a command line argument.

### macOS Notes

#### Add the Recent Documents list to the application menu

You can add menu items to access and clear recent documents by adding the following code snippet to your menu template:

```javascript
{  
  "submenu":[  
    {  
      "label":"Open Recent",  
      "role":"recentdocuments",  
      "submenu":[  
        {  
          "label":"Clear Recent",  
          "role":"clearrecentdocuments"  
        }  
      ]  
    }  
  ]  
}  

```

Make sure the application menu is added after the [`'ready'`](/pt/docs/latest/api/app#event-ready) event and not before, or the menu item will be disabled:

```javascript
const { app, Menu } = require('electron')  
  
const template = [  
  // Menu template here  
]  
const menu = Menu.buildFromTemplate(template)  
  
app.whenReady().then(() => {  
  Menu.setApplicationMenu(menu)  
})  

```

When a file is requested from the recent documents menu, the `open-file` event of `app` module will be emitted for it.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/recent-documents.md)[AnteriorProgress Bars](/pt/docs/latest/tutorial/progress-bar)[AvançarRepresenting Files in a BrowserWindow](/pt/docs/latest/tutorial/represented-file)
