---
title: "globalShortcut"
description: "Documentação técnica e referência da API de globalShortcut no Electron."
topics:
  - "Api"
keywords:
  - "globalShortcut"
  - "ready"
  - "GlobalShortcutsPortal"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/global-shortcut"
---

# globalShortcut

> 

Detecta eventos de teclado quando o aplicativo não tiver o foco do teclado.

Process: [Main](/pt/docs/latest/glossary#main-process)

O módulo `globalShortcut` pode registrar/cancelar o registro de um atalho de teclado global com o sistema operativo que você possa personalizar as operações para os vários atalhos.

> 

[!NOTE] The shortcut is global; it will work even if the app does not have the keyboard focus. This module cannot be used before the `ready` event of the app module is emitted. Please also note that it is also possible to use Chromium's `GlobalShortcutsPortal` implementation, which allows apps to bind global shortcuts when running within a Wayland session.

```javascript
const { app, globalShortcut } = require('electron')  
  
// Enable usage of Portal's globalShortcuts. This is essential for cases when  
// the app runs in a Wayland session.  
app.commandLine.appendSwitch('enable-features', 'GlobalShortcutsPortal')  
  
app.whenReady().then(() => {  
  // Register a 'CommandOrControl+X' shortcut listener.  
  const ret = globalShortcut.register('CommandOrControl+X', () => {  
    console.log('CommandOrControl+X is pressed')  
  })  
  
  if (!ret) {  
    console.log('registration failed')  
  }  
  
  // Check whether a shortcut is registered.  
  console.log(globalShortcut.isRegistered('CommandOrControl+X'))  
})  
  
app.on('will-quit', () => {  
  // Unregister a shortcut.  
  globalShortcut.unregister('CommandOrControl+X')  
  
  // Unregister all shortcuts.  
  globalShortcut.unregisterAll()  
})  

```

> 

[!TIP] See also: [A detailed guide on Keyboard Shortcuts](/pt/docs/latest/tutorial/keyboard-shortcuts).

## Métodos

O módulo `globalShortcut` tem os seguintes métodos:

### `globalShortcut.register(accelerator, callback)`

History

- ``[](/pt/docs/latest/tutorial/keyboard-shortcuts#accelerators)
- ``
``````[](https://developer.apple.com/library/archive/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

- 
- 
- 
- 

### ``

- ``[](/pt/docs/latest/tutorial/keyboard-shortcuts#accelerators)
- ``
``````[](https://developer.apple.com/library/archive/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

- 
- 
- 
- 

### ``

- ``[](/pt/docs/latest/tutorial/keyboard-shortcuts#accelerators)
``````

### ``

- ``[](/pt/docs/latest/tutorial/keyboard-shortcuts#accelerators)
``

### ``

### ``

- ``

### ``
``[](https://github.com/electron/electron/edit/main/docs/api/global-shortcut.md)[](/pt/docs/latest/api/dialog)[](/pt/docs/latest/api/image-view)

- 

  - [``](#globalshortcutregisteraccelerator-callback)
  - [``](#globalshortcutregisterallaccelerators-callback)
  - [``](#globalshortcutisregisteredaccelerator)
  - [``](#globalshortcutunregisteraccelerator)
  - [``](#globalshortcutunregisterall)
  - [``](#globalshortcutsetsuspendedsuspended)
  - [``](#globalshortcutissuspended)

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
