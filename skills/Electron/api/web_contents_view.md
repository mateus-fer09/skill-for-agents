---
title: "WebContentsView"
description: "Documentação técnica e referência da API de WebContentsView no Electron."
topics:
  - "Api"
keywords:
  - "ready"
  - "View"
  - "WebContentsView"
  - "options"
  - "webPreferences"
  - "webContents"
  - "view.webContents"
  - "WebContents"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/web-contents-view"
---

# WebContentsView

> 

A View that displays a WebContents.

Process: [Main](/pt/docs/latest/glossary#main-process)

This module cannot be used until the `ready` event of the `app`
module is emitted.

```javascript
const { BaseWindow, WebContentsView } = require('electron')  
  
const win = new BaseWindow({ width: 800, height: 400 })  
  
const view1 = new WebContentsView()  
win.contentView.addChildView(view1)  
view1.webContents.loadURL('https://electronjs.org')  
view1.setBounds({ x: 0, y: 0, width: 400, height: 400 })  
  
const view2 = new WebContentsView()  
win.contentView.addChildView(view2)  
view2.webContents.loadURL('https://github.com/electron/electron')  
view2.setBounds({ x: 400, y: 0, width: 400, height: 400 })  

```

## Class: WebContentsView extends `View`

> 

A View that displays a WebContents.

Process: [Main](/pt/docs/latest/glossary#main-process)

`WebContentsView` inherits from [`View`](/pt/docs/latest/api/exibir).

`WebContentsView` is an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

> [!WARNING]
> 

> aviso

> 

Electron's built-in classes cannot be subclassed in user code.
For more information, see [the FAQ](/pt/docs/latest/faq#class-inheritance-does-not-work-with-electron-built-in-modules).

### `new WebContentsView([options])`

- `options` Object (optional)

  - `webPreferences` [WebPreferences](/pt/docs/latest/api/structures/web-preferences) (optional) - Settings of web page's features.

  - `webContents` [WebContents](/pt/docs/latest/api/web-contents) (optional) - If present, the given WebContents will be adopted by the WebContentsView. A WebContents may only be presented in one WebContentsView at a time.

Creates a WebContentsView.

### Propriedades da Instância

Objects created with `new WebContentsView` have the following properties, in
addition to those inherited from [View](/pt/docs/latest/api/exibir):

#### `view.webContents` *Readonly*

A `WebContents` property containing a reference to the displayed `WebContents`.
Use this to interact with the `WebContents`, for instance to load a URL.

```javascript
const { WebContentsView } = require('electron')  
  
const view = new WebContentsView()  
view.webContents.loadURL('https://electronjs.org/')  

```
[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/web-contents-view.md)
