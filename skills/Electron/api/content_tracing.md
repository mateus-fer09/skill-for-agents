---
title: "contentTracing"
description: "Documentação técnica e referência da API de contentTracing no Electron."
topics:
  - "Api"
keywords:
  - "ready"
  - "contentTracing"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/content-tracing"
---

# contentTracing

> 

Collect tracing data from Chromium to find performance bottlenecks and slow operations.

Process: [Main](/pt/docs/latest/glossary#main-process)

This module does not include a web interface. To view recorded traces, use [trace viewer](https://chromium.googlesource.com/catapult/+/HEAD/tracing/README.md), available at `chrome://tracing` in Chrome.

> 

[!NOTE] You should not use this module until the `ready` event of the app module is emitted.

```javascript
const { app, contentTracing } = require('electron')  
  
app.whenReady().then(() => {  
  (async () => {  
    await contentTracing.startRecording({  
      included_categories: ['*']  
    })  
    console.log('Tracing started')  
    await new Promise(resolve => setTimeout(resolve, 5000))  
    const path = await contentTracing.stopRecording()  
    console.log('Tracing data recorded to ' + path)  
  })()  
})  

```

## Métodos

O módulo `contentTracing` tem os seguintes métodos:

### `contentTracing.getCategories()`

History[](/docs/latest/breaking-changes#api-changed-callback-based-versions-of-promisified-apis)````[](https://chromium.googlesource.com/chromium/src/+/main/base/trace_event/builtin_categories.h)

> ****``

### ``
``````[``](/docs/latest/breaking-changes#api-changed-callback-based-versions-of-promisified-apis)

- ``[](/pt/docs/latest/api/structures/trace-config)[](/pt/docs/latest/api/structures/trace-categories-and-options)
````

### ``
[](/docs/latest/breaking-changes#api-changed-callback-based-versions-of-promisified-apis)``

- ``
````````

### ``
[](/docs/latest/breaking-changes#api-changed-callback-based-versions-of-promisified-apis)``````

- ``
- ``

### ``**

- ``[](/pt/docs/latest/api/structures/enable-heap-profiling-options)
``[](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/memory-infra/heap_profiler.md)``````

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```

1. [](https://github.com/electron/electron/releases)
2. [](/pt/docs/latest/development/build-instructions-gn)
3. 

```javascript
  

```

4. ``
5. ``
6. ````
[](https://github.com/electron/electron/edit/main/docs/api/content-tracing.md)[](/pt/docs/latest/api/clipboard)[](/pt/docs/latest/api/crash-reporter)

- 

  - [``](#contenttracinggetcategories)
  - [``](#contenttracingstartrecordingoptions)
  - [``](#contenttracingstoprecordingresultfilepath)
  - [``](#contenttracinggettracebufferusage)
  - [``](#contenttracingenableheapprofilingoptions-experimental)

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
