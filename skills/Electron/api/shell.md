---
title: "shell"
description: "Documentação técnica e referência da API de shell no Electron."
topics:
  - "Api"
keywords:
  - "shell"
  - "fullPath"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/shell"
---

# shell

> 

Gerencia arquivos e URLs usando seus aplicativos padrão.

Process: [Main](/pt/docs/latest/glossary#main-process), [Renderer](/pt/docs/latest/glossary#renderer-process) (non-sandboxed only)

O módulo `shell` fornece funções relacionadas à integração com a área de trabalho.

Um exemplo de como abrir uma URL no navegador padrão do usuário:

```javascript
const { shell } = require('electron')  
  
shell.openExternal('https://github.com')  

```

> 

[!WARNING] While the `shell` module can be used in the renderer process, it will not function in a sandboxed renderer.

## Métodos

O módulo `shell` tem os seguintes métodos:

### `shell.showItemInFolder(fullPath)`

- `fullPath` string

Show the given file in a file manager. If possible, select the file.

### `shell.openPath(path)`

History[](/docs/latest/breaking-changes#api-changed-shellopenitem-is-now-shellopenpath)

- ``
``

### ``
``````

- ``
- ``

  - ``**````
  - ``**
  - ``**``

``

### ``
[](/docs/latest/breaking-changes#deprecated-shellmoveitemtotrash)

- ``
``````

### ``

### ``**

- ``
- ````

  - ``
  - ``
  - ``

- ``[](/pt/docs/latest/api/structures/shortcut-details)
````

### ``**

- ``
[](/pt/docs/latest/api/structures/shortcut-details)``[](https://github.com/electron/electron/edit/main/docs/api/shell.md)[](/pt/docs/latest/api/share-menu)[](/pt/docs/latest/api/system-preferences)

- 

  - [``](#shellshowiteminfolderfullpath)
  - [``](#shellopenpathpath)
  - [``](#shellopenexternalurl-options)
  - [``](#shelltrashitempath)
  - [``](#shellbeep)
  - [``](#shellwriteshortcutlinkshortcutpath-operation-options-windows)
  - [``](#shellreadshortcutlinkshortcutpath-windows)

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
