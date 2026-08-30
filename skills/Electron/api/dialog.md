---
title: "dialog"
description: "Documentação técnica e referência da API de dialog no Electron."
topics:
  - "Api"
keywords:
  - "dialog"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/dialog"
---

# dialog

> 

Exibe diálogos nativos do sistema para abrir e salvar arquivos, alertas, etc.

Process: [Main](/pt/docs/latest/glossary#main-process)

An example of showing a dialog to select multiple files:

```javascript
const { dialog } = require('electron')  
  
console.log(dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))  

```

## Métodos

O módulo `dialog` possúi os seguintes métodos:

### `dialog.showOpenDialogSync([window, ]options[, callback)`

History

- ``[](/pt/docs/latest/api/base-window)
- ``

  - ``
  - ``
  - ``
  - ``[](/pt/docs/latest/api/structures/file-filter)
  - ``

    - ``
    - ``
    - ``
    - ``****
    - ``**
    - ``**
    - ``**
    - ``**``
    - ``**

  - ``**
  - ``****[](https://developer.apple.com/documentation/professional-video-applications/enabling-security-scoped-bookmark-and-url-access)

````````

```javascript
  
  
  
  
  
  
  
  

```
``````````

> ````

```javascript
  
  
  

```

> ````[](/pt/docs/latest/api/command-line-switches#--xdg-portal-required-versionversion)

### ``
[](/docs/latest/breaking-changes#api-changed-callback-based-versions-of-promisified-apis)

- ``[](/pt/docs/latest/api/base-window)
- ``

  - ``
  - ``
  - ``
  - ``[](/pt/docs/latest/api/structures/file-filter)
  - ``

    - ``
    - ``
    - ``
    - ``****
    - ``**
    - ``**
    - ``**
    - ``**``
    - ``**

  - ``**
  - ``****[](https://developer.apple.com/documentation/professional-video-applications/enabling-security-scoped-bookmark-and-url-access)

``

- ``
- ``
- ``****````
````

```javascript
  
  
  
  
  
  
  
  

```
``````````

> ````

```javascript
  
  
  
  
  
  
  
  

```

> ````[](/pt/docs/latest/api/command-line-switches#--xdg-portal-required-versionversion)

### ``

- ``[](/pt/docs/latest/api/base-window)
- ``

  - ``**
  - ``
  - ``
  - ``[](/pt/docs/latest/api/structures/file-filter)
  - ``**
  - ``**
  - ``**``
  - ``

    - ``****
    - ``**
    - ``**``
    - ``**
    - ``**

  - ``****[](https://developer.apple.com/documentation/professional-video-applications/enabling-security-scoped-bookmark-and-url-access)

````````

### ``
[](/docs/latest/breaking-changes#api-changed-callback-based-versions-of-promisified-apis)

- ``[](/pt/docs/latest/api/base-window)
- ``

  - ``**
  - ``
  - ``
  - ``[](/pt/docs/latest/api/structures/file-filter)
  - ``**
  - ``**
  - ``**``
  - ``

    - ``****
    - ``**
    - ``**``
    - ``**
    - ``**

  - ``****[](https://developer.apple.com/documentation/professional-video-applications/enabling-security-scoped-bookmark-and-url-access)

``

- ``
- ``
- ``****``
``````

> 

### ``

- ``[](/pt/docs/latest/api/base-window)
- ``

  - ``
  - ``````````````````````
  - ``
  - ``
  - ``
  - ``
  - ``[](/pt/docs/latest/api/native-image)
  - ``**
  - ``````
  - ````````
  - ``````````````````

``````

### ``
[](/docs/latest/breaking-changes#api-changed-callback-based-versions-of-promisified-apis)````

- ``[](/pt/docs/latest/api/base-window)
- ``

  - ``
  - ``````````````````````
  - ``
  - ``
  - ``[](https://nodejs.org/api/globals.html#globals_class_abortsignal)``
  - ``
  - ``
  - ``
  - ````
  - ``[](/pt/docs/latest/api/native-image)
  - ``**
  - ``````
  - ````````
  - ``````````````````

``

- ``
- ``````
``

### ``

- ``
- ``
``````

### ``****
[](/docs/latest/breaking-changes#api-changed-callback-based-versions-of-promisified-apis)

- ``[](/pt/docs/latest/api/base-window)
- ``

  - ``[](/pt/docs/latest/api/structures/certificate)
  - ``

````

- ``
- ``

## 
``````[](https://developer.apple.com/documentation/professional-video-applications/enabling-security-scoped-bookmark-and-url-access)``````````

## 
[``](/pt/docs/latest/api/base-window)````[](https://github.com/electron/electron/edit/main/docs/api/dialog.md)[](/pt/docs/latest/api/desktop-capturer)[](/pt/docs/latest/api/global-shortcut)

- 

  - [``](#dialogshowopendialogsyncwindow-options-callback)
  - [``](#dialogshowopendialogwindow-options)
  - [``](#dialogshowsavedialogsyncwindow-options)
  - [``](#dialogshowsavedialogwindow-options)
  - [``](#dialogshowmessageboxsyncwindow-options)
  - [``](#dialogshowmessageboxwindow-options)
  - [``](#dialogshowerrorboxtitle-content)
  - [``](#dialogshowcertificatetrustdialogwindow-options-macos-windows)

- 
- 

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
