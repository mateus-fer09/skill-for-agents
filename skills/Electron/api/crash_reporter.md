---
title: "crashReporter"
description: "Documentação técnica e referência da API de crashReporter no Electron."
topics:
  - "Api"
keywords:
  - "contextBridge"
  - "crashReporter"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/crash-reporter"
---

# crashReporter

> 

Submit crash reports to a remote server.

Process: [Main](/pt/docs/latest/glossary#main-process), [Renderer](/pt/docs/latest/glossary#renderer-process)

> 

[!IMPORTANT] If you want to call this API from a renderer process with context isolation enabled, place the API call in your preload script and [expose](/pt/docs/latest/tutorial/context-isolation#after-context-isolation-enabled) it using the [`contextBridge`](/pt/docs/latest/api/context-bridge) API.

The following is an example of setting up Electron to automatically submit crash reports to a remote server:

```javascript
const { crashReporter } = require('electron')  
  
crashReporter.start({ submitURL: 'https://your-domain.com/url-to-submit' })  

```

For setting up a server to accept and process crash reports, you can use following projects:

- [socorro](https://github.com/mozilla-services/socorro)

- [mini-breakpad-server](https://github.com/electron/mini-breakpad-server)

> 

[!NOTE] Electron uses Crashpad, not Breakpad, to collect and upload crashes, but for the time being, the [upload protocol is the same](https://chromium.googlesource.com/crashpad/crashpad/+/HEAD/doc/overview_design.md#Upload-to-collection-server).

Or use a 3rd party hosted solution:

- [Backtrace](https://backtrace.io/electron/)

- [Sentry](https://docs.sentry.io/clients/electron)

- [BugSplat](https://www.bugsplat.com/docs/platforms/electron)

- [Bugsnag](https://docs.bugsnag.com/platforms/electron/)

Crash reports are stored temporarily before being uploaded in a directory underneath the app's user data directory, called 'Crashpad'. You can override this directory by calling `app.setPath('crashDumps', '/path/to/crashes')` before starting the crash reporter.

Electron uses [crashpad](https://chromium.googlesource.com/crashpad/crashpad/+/refs/heads/main/README.md) to monitor and report crashes.

## Métodos

O módulo `crashReporter` tem os seguintes métodos:

### `crashReporter.start(options)`

History````[](/docs/latest/breaking-changes#deprecated-crashreporter-methods-in-the-renderer-process)[``````](/docs/latest/breaking-changes#default-changed-crashreporterstart-compress-true-)``````

- ``

  - ``````
  - ````
  - ``**``
  - ````
  - ````
  - ``****``
  - ``````
  - ``[``](#crashreporteraddextraparameterkey-value)
  - ````

````

> ``

> ``````

> ``````

> 

### ``
[](/docs/latest/breaking-changes#deprecated-crashreporter-methods-in-the-renderer-process)[](/pt/docs/latest/api/structures/crash-report)``

> 

### ``
[](/docs/latest/breaking-changes#deprecated-crashreporter-methods-in-the-renderer-process)[](/pt/docs/latest/api/structures/crash-report)

> 

### ``
[](/docs/latest/breaking-changes#deprecated-crashreporter-methods-in-the-renderer-process)``````

> 

### ``
[](/docs/latest/breaking-changes#deprecated-crashreporter-methods-in-the-renderer-process)

- ``
``

> 

### ``

- ``
- ``
````````

> 

### ``

- ``

### ``
``

## 
````

#### ``
[``](#crashreporterstartoptions)

#### ``
[``](#crashreportergetparameters)

#### ``
[``](#crashreporteraddextraparameterkey-value)

#### ``
[``](#crashreporterremoveextraparameterkey)

## 
``````

- ``
- ``
- ``
- ``
- ````
- ``````
- ``
- ``````
- ````
- ``````
[](https://github.com/electron/electron/edit/main/docs/api/crash-reporter.md)[](/pt/docs/latest/api/content-tracing)[](/pt/docs/latest/api/desktop-capturer)

- 

  - [``](#crashreporterstartoptions)
  - [``](#crashreportergetlastcrashreport)
  - [``](#crashreportergetuploadedreports)
  - [``](#crashreportergetuploadtoserver)
  - [``](#crashreportersetuploadtoserveruploadtoserver)
  - [``](#crashreporteraddextraparameterkey-value)
  - [``](#crashreporterremoveextraparameterkey)
  - [``](#crashreportergetparameters)

- 

  - [``](#processcrashreporterstartoptions)
  - [``](#processcrashreportergetparameters)
  - [``](#processcrashreporteraddextraparameterkey-value)
  - [``](#processcrashreporterremoveextraparameterkey)

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
