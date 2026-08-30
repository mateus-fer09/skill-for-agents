---
title: "Usando scripts de pré-carregamento"
description: "[!NOTE]"
topics:
  - "Primeiros passos"
keywords:
  - "Usando scripts de pré-carregamento"
  - "require"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/tutorial-preload"
---

# Usando scripts de pré-carregamento

> [!NOTE]
> 

> Acompanhe o tutorial

> 

Esta é a **parte 3** do tutorial de Electron.

1. [Pré-requisitos](/pt/docs/latest/tutorial/tutorial-prerequisites)

2. [Criando seu primeiro aplicativo](/pt/docs/latest/tutorial/tutorial-first-app)

3. **[Usando scripts de pré-carregamento](/pt/docs/latest/tutorial/tutorial-preload)**

4. [Adicionando recursos](/pt/docs/latest/tutorial/tutorial-adding-features)

5. [Empacotando seu aplicativo](/pt/docs/latest/tutorial/tutorial-packaging)

6. [Publicando e atualizando](/pt/docs/latest/tutorial/tutorial-publishing-updating)

## Learning goals

In this part of the tutorial, you will learn what a preload script is and how to use one to securely expose privileged APIs into the renderer process. You will also learn how to communicate between main and renderer processes with Electron's inter-process communication (IPC) modules.

## What is a preload script?

Electron's main process is a Node.js environment that has full operating system access. On top of [Electron modules](/pt/docs/latest/api/app), you can also access [Node.js built-ins](https://nodejs.org/dist/latest/docs/api/), as well as any packages installed via npm. On the other hand, renderer processes run web pages and do not run Node.js by default for security reasons.

To bridge Electron's different process types together, we will need to use a special script called a **preload**.

## Augmenting the renderer with a preload script

A BrowserWindow's preload script runs in a context that has access to both the HTML DOM and a limited subset of Node.js and Electron APIs.

> [!NOTE]
> 

> Preload script sandboxing

> 

From Electron 20 onwards, preload scripts are **sandboxed** by default and no longer have access to a full Node.js environment. Practically, this means that you have a polyfilled `require` function that only has access to a limited set of APIs.[``](https://nodejs.org/api/events.html)[``](https://nodejs.org/api/timers.html)[``](https://nodejs.org/api/url.html)[``](https://nodejs.org/api/buffer.html)[``](/pt/docs/latest/api/process)[``](https://nodejs.org/api/timers.html#timers_clearimmediate_immediate)[``](https://nodejs.org/api/timers.html#timers_setimmediate_callback_args)[](/pt/docs/latest/tutorial/sandbox)[](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)[](https://developer.mozilla.org/en-US/docs/Glossary/Global_object)[](/pt/docs/latest/api/context-bridge)``````

```javascript
  
  
  
  
  
  
  
  

```
``

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```

> [!NOTE]
> 

> 

> 

- [``](https://nodejs.org/api/modules.html#modules_dirname)
- [``](https://nodejs.org/api/path.html#path_path_join_paths)
````````[``](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)````

```javascript
  
  

```
````````

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```
[](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/tutorial-preload)[](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/tutorial-preload)

- 
- 
- 
- 

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```

```javascript
  
  
  
  
  
  
  

```

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```

```javascript
  
  

```

## 
````````````

```javascript
  
  
  
  
  
  
  
  
  

```

> [!WARNING]
> 

> 

> ````****````**``

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```
``

```javascript
  
  
  
  
  
  

```

> [!NOTE]
> 

> 

> ````[](/pt/docs/latest/tutorial/ipc)

## 
``[](https://github.com/electron/electron/edit/main/docs/tutorial/tutorial-3-preload.md)[](/pt/docs/latest/tutorial/tutorial-first-app)[](/pt/docs/latest/tutorial/tutorial-adding-features)

- 
- 
- 
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
