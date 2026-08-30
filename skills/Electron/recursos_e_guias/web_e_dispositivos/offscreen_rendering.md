---
title: "Renderização fora da tela"
description: "## Visão Geral"
topics:
  - "Recursos e guias"
  - "Web e dispositivos"
keywords:
  - "Renderização fora da tela"
  - "BrowserWindow"
  - "paint"
  - "webPreferences.offscreen.useSharedTexture"
  - "false"
  - "true"
  - "NativeImage"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/offscreen-rendering"
---

# Renderização fora da tela

## Visão Geral

Offscreen rendering lets you obtain the content of a `BrowserWindow` in a bitmap or a shared GPU texture, so it can be rendered anywhere, for example, on texture in a 3D scene. The offscreen rendering in Electron uses a similar approach to that of the [Chromium Embedded Framework](https://bitbucket.org/chromiumembedded/cef) project.

*Notes*:

- There are two rendering modes that can be used (see the section below) and only the dirty area is passed to the `paint` event to be more efficient.

- You can stop/continue the rendering as well as set the frame rate.

- When `webPreferences.offscreen.useSharedTexture` is `false`, the maximum frame rate is 240 because greater values bring only performance losses with no benefits.

- When nothing is happening on a webpage, no frames are generated.

- An offscreen window is always created as a [Frameless Window](/pt/docs/latest/tutorial/window-customization).

### Rendering Modes

#### Aceleração da GPU

GPU accelerated rendering means that the GPU is used for composition. The benefit of this mode is that WebGL and 3D CSS animations are supported. There are two different approaches depending on the `webPreferences.offscreen.useSharedTexture` setting.

1. 

Use GPU shared texture

Used when `webPreferences.offscreen.useSharedTexture` is set to `true`.

This is an advanced feature requiring a native node module to work with your own code. The frames are directly copied in GPU textures, thus this mode is very fast because there's no CPU-GPU memory copies overhead, and you can directly import the shared texture to your own rendering program. You can read more details [here](https://github.com/electron/electron/blob/v43.4.0/shell/common/api/shared_texture/README.md).

2. 

Use CPU shared memory bitmap

Used when `webPreferences.offscreen.useSharedTexture` is set to `false` (default behavior).

The texture is accessible using the `NativeImage` API at the cost of performance. The frame has to be copied from the GPU to the CPU bitmap which requires more system resources, thus this mode is slower than the Software output device mode. But it supports GPU related functionalities.

#### Software output device

This mode uses a software output device for rendering in the CPU, so the frame generation is faster than shared memory bitmap GPU accelerated mode.

To enable this mode, GPU acceleration has to be disabled by calling the [`app.disableHardwareAcceleration()`](/pt/docs/latest/api/app#appdisablehardwareacceleration) API.

## Exemplo

[docs/fiddles/features/offscreen-rendering (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/features/offscreen-rendering)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/features/offscreen-rendering)

- main.js

```javascript
const { app, BrowserWindow } = require('electron/main')  
const fs = require('node:fs')  
const path = require('node:path')  
  
app.disableHardwareAcceleration()  
  
function createWindow () {  
  const win = new BrowserWindow({  
    width: 800,  
    height: 600,  
    webPreferences: {  
      offscreen: true  
    }  
  })  
  
  win.loadURL('https://github.com')  
  win.webContents.on('paint', (event, dirty, image) => {  
    fs.writeFileSync('ex.png', image.toPNG())  
  })  
  win.webContents.setFrameRate(60)  
  console.log(`The screenshot has been successfully saved to ${path.join(process.cwd(), 'ex.png')}`)  
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

After launching the Electron application, navigate to your application's working folder, where you'll find the rendered image.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/offscreen-rendering.md)[AnteriorNotificações](/pt/docs/latest/tutorial/notifications)[AvançarDetecção de Evento Online/Offline](/pt/docs/latest/tutorial/online-offline-events)
