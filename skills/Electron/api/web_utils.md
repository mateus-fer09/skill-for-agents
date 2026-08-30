---
title: "webUtils"
description: "Documentação técnica e referência da API de webUtils no Electron."
topics:
  - "Api"
keywords:
  - "contextBridge"
  - "webUtils"
  - "file"
  - "string"
  - "File"
  - "path"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/web-utils"
---

# webUtils

> 

A utility layer to interact with Web API objects (Files, Blobs, etc.)

Process: [Renderer](/pt/docs/latest/glossary#renderer-process)

> [!NOTE]
> 

> info

> 

If you want to call this API from a renderer process with context isolation enabled,
place the API call in your preload script and
[expose](/pt/docs/latest/tutorial/context-isolation#after-context-isolation-enabled) it using the
[`contextBridge`](/pt/docs/latest/api/context-bridge) API.

## Métodos

The `webUtils` module has the following methods:

### `webUtils.getPathForFile(file)`

- `file` File - A web [File](https://developer.mozilla.org/en-US/docs/Web/API/File) object.

Returns `string` - The file system path that this `File` object points to. In the case where the object passed in is not a `File` object an exception is thrown. In the case where the File object passed in was constructed in JS and is not backed by a file on disk an empty string is returned.

This method superseded the previous augmentation to the `File` object with the `path` property.  An example is included below.

```javascript
// Before (renderer)  
const oldPath = document.querySelector('input[type=file]').files[0].path  

```

```javascript
// After  
  
// Renderer:  
  
const file = document.querySelector('input[type=file]').files[0]  
electronApi.doSomethingWithFile(file)  
  
// Preload script:  
  
const { contextBridge, webUtils } = require('electron')  
  
contextBridge.exposeInMainWorld('electronApi', {  
  doSomethingWithFile (file) {  
    const path = webUtils.getPathForFile(file)  
    // Do something with the path, e.g., send it over IPC to the main process.  
    // It's best not to expose the full file path to the web content if possible.  
  }  
})  

```
[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/web-utils.md)
