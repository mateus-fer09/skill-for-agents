---
title: "ES Modules (ESM) in Electron"
description: "## Introdução"
topics:
  - "Fundamentos"
keywords:
  - "ES Modules (ESM) in Electron"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/esm"
---

# ES Modules (ESM) in Electron

## Introdução

The ECMAScript module (ESM) format is [the standard way of loading JavaScript packages](https://tc39.es/ecma262/#sec-modules).

Chromium and Node.js have their own implementations of the ESM specification, and Electron
chooses which module loader to use depending on the context.

This document serves to outline the limitations of ESM in Electron and the differences between
ESM in Electron and ESM in Node.js and Chromium.

> [!NOTE]
> 

> info

> 

This feature was added in `electron@28.0.0`.

## Summary: ESM support matrix

This table gives a general overview of where ESM is supported and which ESM loader is used.

- [````](#you-must-use-await-generously-before-the-apps-ready-event)

- 

- 
- [``](#esm-preload-scripts-must-have-the-mjs-extension)

- 
- [``](#esm-preload-scripts-must-have-the-mjs-extension)

## 
[](https://nodejs.org/api/esm.html)

- ``
- ``
[](https://nodejs.org/api/packages.html#determining-module-system)

### 

#### ````
****``[``](/pt/docs/latest/api/app#appsetpathname-path)****````````````````

```javascript
  
  
  
  
  
  

```

> [!WARNING]
> 

> 

> ``````[``](https://babeljs.io/docs/babel-plugin-transform-modules-commonjs#importinterop)

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```

## 
``

- 
- ``

```javascript
  
  
  

```

## 
**````

### 

#### ``
``**``

#### 
````[](/pt/docs/latest/tutorial/sandbox)

#### 
**``**````````

### 
````

```javascript
  
  
  

```
````[](https://github.com/electron/electron/edit/main/docs/tutorial/esm.md)[](/pt/docs/latest/tutorial/boilerplates-and-clis)[](/pt/docs/latest/tutorial/fuses)

- 
- 
- 

  - 

    - [````](#you-must-use-await-generously-before-the-apps-ready-event)

- 
- 

  - 

    - [``](#esm-preload-scripts-must-have-the-mjs-extension)
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
