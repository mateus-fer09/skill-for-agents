# 177. Padrão completo mínimo

## `main.js`

```js
const path = require('node:path')
const {
  app,
  BrowserWindow,
  ipcMain,
  dialog
} = require('electron')

let mainWindow

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  })

  win.webContents.setWindowOpenHandler(() => ({
    action: 'deny'
  }))

  win.webContents.on('will-navigate', (event, url) => {
    const parsed = new URL(url)

    if (parsed.protocol !== 'file:') {
      event.preventDefault()
    }
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    if (mainWindow === win) {
      mainWindow = null
    }
  })

  win.loadFile('index.html')

  return win
}

function registerIpc() {
  ipcMain.handle('files:open', async (event) => {
    const url = event.senderFrame?.url ?? ''

    if (!url.startsWith('file://')) {
      throw new Error('Untrusted IPC sender')
    }

    const result = await dialog.showOpenDialog({
      properties: ['openFile']
    })

    if (result.canceled) {
      return null
    }

    return result.filePaths[0]
  })
}

app.whenReady().then(() => {
  registerIpc()

  mainWindow = createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

Observação:

O `startsWith('file://')` acima é aceitável apenas como exemplo didático de
estrutura. Em aplicações reais, a skill deve preferir validação robusta da
origem, idealmente com custom protocol seguro e parsing explícito.

## `preload.js`

```js
const {
  contextBridge,
  ipcRenderer
} = require('electron')

contextBridge.exposeInMainWorld('desktop', {
  openFile() {
    return ipcRenderer.invoke('files:open')
  }
})
```

## renderer

```js
document
  .querySelector('#open-file')
  .addEventListener('click', async () => {
    const file = await window.desktop.openFile()

    console.log(file)
  })
```

---

