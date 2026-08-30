---
title: "ImageView"
description: "Documentação técnica e referência da API de ImageView no Electron."
topics:
  - "Api"
keywords:
  - "ready"
  - "WebContentsView"
  - "ImageView"
  - "View"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/image-view"
---

# ImageView

> 

A View that displays an image.

Process: [Main](/pt/docs/latest/glossary#main-process)

This module cannot be used until the `ready` event of the `app`
module is emitted.

Useful for showing splash screens that will be swapped for `WebContentsView`s
when the content finishes loading.

Note that `ImageView` is experimental and may be changed or removed in the future.

```javascript
const { BaseWindow, ImageView, nativeImage, WebContentsView } = require('electron')  
  
const path = require('node:path')  
  
const win = new BaseWindow({ width: 800, height: 600 })  
  
// Create a "splash screen" image to display while the WebContentsView loads  
const splashView = new ImageView()  
const splashImage = nativeImage.createFromPath(path.join(__dirname, 'loading.png'))  
splashView.setImage(splashImage)  
win.setContentView(splashView)  
  
const webContentsView = new WebContentsView()  
webContentsView.webContents.once('did-finish-load', () => {  
  // Now that the WebContentsView has loaded, swap out the "splash screen" ImageView  
  win.setContentView(webContentsView)  
})  
webContentsView.webContents.loadURL('https://electronjs.org')  

```

## Class: ImageView extends `View`

History

> [](/pt/docs/latest/glossary#main-process)``[``](/pt/docs/latest/api/exibir)``[](https://nodejs.org/api/events.html#events_class_eventemitter)

> [!WARNING]
> 

> 

> [](/pt/docs/latest/faq#class-inheritance-does-not-work-with-electron-built-in-modules)

### ``**

### 
``[](/pt/docs/latest/api/exibir)

#### ``**

- ``
``````[](https://github.com/electron/electron/edit/main/docs/api/image-view.md)[](/pt/docs/latest/api/global-shortcut)[](/pt/docs/latest/api/in-app-purchase)

- [``](#class-imageview-extends-view)

  - [``**](#new-imageview-experimental)
  - 

    - [``](#imagesetimageimage-experimental)

- [](/pt/docs/latest/)
- [](/pt/docs/latest/api/app)

- [](/pt/docs/latest/tutorial/performance)
- [](/pt/docs/latest/tutorial/security)

- [](https://electronforge.io)
- [](/pt/fiddle)

- [](/pt/governance)
- [](/pt/community)
- [](https://discordapp.com/invite/APGC3k5yaH)
- [](https://bsky.app/profile/electronjs.org)
- [](https://x.com/electronjs)
- [](https://social.lfx.dev/@electronjs)
- [](https://stackoverflow.com/questions/tagged/electron)

- [](https://github.com/electron/electron)
- [](https://opencollective.com/electron)
- [](https://p.datadoghq.com/sb/c44e1df0-85d7-11ee-94c9-da7ad0900002-c245f7ef47d0d0c32abecdc0938c2a85)
[](https://openjsf.org/)[](https://openjsf.org)[](https://openjsf.org)[](https://openjsf.org)[](https://trademark-policy.openjsf.org)[](https://trademark-list.openjsf.org)[](https://trademark-list.openjsf.org)[](https://openjsf.org)[](https://terms-of-use.openjsf.org)[](https://privacy-policy.openjsf.org)[](https://bylaws.openjsf.org)[](https://code-of-conduct.openjsf.org)[](https://trademark-policy.openjsf.org)[](https://trademark-list.openjsf.org)[](https://www.linuxfoundation.org/cookies)
