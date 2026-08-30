---
title: "autoUpdater"
description: "Documentação técnica e referência da API de autoUpdater no Electron."
topics:
  - "Api"
keywords:
  - "autoUpdater"
  - "NSAllowsArbitraryLoads"
  - "Squirrel.Mac"
  - "process.windowsStore"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/auto-updater"
---

# autoUpdater

> 

Habilita aplicações a se atualizarem automaticamente.

Process: [Main](/pt/docs/latest/glossary#main-process)

**See also: [A detailed guide about how to implement updates in your application](/pt/docs/latest/tutorial/updates).**

`autoUpdater` is an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

## Avisos de plataforma

Atualmente, apenas o macOS e o Windows são suportados. Não há suporte nativo para o atualizador automático no Linux - portanto, recomendamos usar o gerenciador de pacotes da distribuição para atualizar seu app.

Além disso, existem algumas diferenças sutis em cada plataforma:

### macOS

No macOS, o módulo `autoUpdater` é construído em cima do [Squirrel.Mac](https://github.com/Squirrel/Squirrel.Mac), ou seja, você não precisa de nenhuma configuração especial para que funcione. Para os requisitos do lado do servidor, você pode ler o [Suporte do servidor](https://github.com/Squirrel/Squirrel.Mac#server-support). Note that [App Transport Security](https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW35) (ATS) applies to all requests made as part of the update process. Aplicações que precisam desativar o ATS podem adicionar a chave `NSAllowsArbitraryLoads` no plist de sua aplicação.

> 

[!IMPORTANT] Your application must be signed for automatic updates on macOS. Isto é um requisito do `Squirrel.Mac`.

### Windows

On Windows, the `autoUpdater` module automatically selects the appropriate update mechanism based on how your app is packaged:

- **MSIX packages**: If your app is running as an MSIX package (created with [electron-windows-msix](https://github.com/electron-userland/electron-windows-msix) and detected via [`process.windowsStore`](/pt/docs/latest/api/process#processwindowsstore-readonly)), the module uses the MSIX updater, which supports direct MSIX file links and JSON update feeds.

- **Squirrel.Windows**: For apps installed via traditional installers (created with [electron-winstaller](https://github.com/electron/windows-installer) or [Electron Forge's Squirrel.Windows maker](https://www.electronforge.io/config/makers/squirrel.windows)), the module uses Squirrel.Windows for updates.

You don't need to configure which updater to use; Electron automatically detects the packaging format and uses the appropriate one.

#### Squirrel.Windows

Apps built with Squirrel.Windows will trigger [custom launch events](https://github.com/Squirrel/Squirrel.Windows/blob/51f5e2cb01add79280a53d51e8d0cfa20f8c9f9f/docs/using/custom-squirrel-events-non-cs.md#application-startup-commands) that must be handled by your Electron application to ensure proper setup and teardown.

Squirrel.Windows apps will launch with the `--squirrel-firstrun` argument immediately after installation. During this time, Squirrel.Windows will obtain a file lock on your app, and `autoUpdater` requests will fail until the lock is released. In practice, this means that you won't be able to check for updates on first launch for the first few seconds. You can work around this by not checking for updates when `process.argv` contains the `--squirrel-firstrun` flag or by setting a 10-second timeout on your update checks (see [electron/electron#7155](https://github.com/electron/electron/issues/7155) for more information).

The installer generated with Squirrel.Windows will create a shortcut icon with an [Application User Model ID](https://learn.microsoft.com/en-us/windows/win32/shell/appids) in the format of `com.squirrel.PACKAGE_ID.YOUR_EXE_WITHOUT_DOT_EXE`, examples are `com.squirrel.slack.Slack` and `com.squirrel.code.Code`. Você deve usar o mesmo ID para sua aplicação com a API `app.setAppUserModelId`, caso contrário, o Windows não será capaz de fixar sua aplicação corretamente na barra de tarefas.

#### MSIX Packages

When your app is packaged as an MSIX, the `autoUpdater` module provides additional functionality:

- Use the `allowAnyVersion` option in `setFeedURL()` to allow updates to older versions (downgrades)

- Support for direct MSIX file links or JSON update feeds (similar to Squirrel.Mac format)

## Eventos

O objeto `autoUpdater` emite os seguintes eventos:

### Evento: 'error'

Retorna:

- Erro `error`

Emitido quando há um erro durante a atualização.

### Evento: 'checking-for-update'

Emitted when checking for an available update has started.

### Evento: 'update-available'

Emitido quando houver uma atualização disponível. A atualização é baixada automaticamente.

### Evento: 'update-not-available'

Emitido quando não há atualização disponível.

### Evento: 'update-downloaded'

Retorna:

- `event` Event

- string `releaseNotes`

- string `releaseName`

- Data `releaseDate`

- string `updateURL`

Emitido quando uma atualização foi baixada.

With Squirrel.Windows only `releaseName` is available.

> 

[!NOTE] It is not strictly necessary to handle this event. A successfully downloaded update will still be applied the next time the application starts.

### Evento: 'before-quit-for-update'

History``````

## 
``

### ``
``````````

- ``

  - ``**``[](https://github.com/Squirrel/Squirrel.Mac)
  - ``**
  - ``**````[](https://github.com/Squirrel/Squirrel.Mac)
  - ``**````

``

### ``
``

### ``
``

> ``

### ``
``````

> [](https://github.com/electron/electron/edit/main/docs/api/auto-updater.md)[](/pt/docs/latest/api/app)[](/pt/docs/latest/api/base-window)

- 

  - 
  - 

    - 
    - 

- 

  - 
  - 
  - 
  - 
  - 
  - 

- 

  - [``](#autoupdatersetfeedurloptions)
  - [``](#autoupdatergetfeedurl)
  - [``](#autoupdatercheckforupdates)
  - [``](#autoupdaterquitandinstall)

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
