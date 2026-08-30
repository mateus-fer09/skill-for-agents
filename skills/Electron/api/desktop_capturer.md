---
title: "desktopCapturer"
description: "Documentação técnica e referência da API de desktopCapturer no Electron."
topics:
  - "Api"
keywords:
  - "navigator.mediaDevices.getUserMedia"
  - "Electron"
  - "navigator.mediaDevices.getDisplayMedia"
  - "deviceId"
  - "desktopCapturer"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/desktop-capturer"
---

# desktopCapturer

> 

Access information about media sources that can be used to capture audio and video from the desktop using the [`navigator.mediaDevices.getUserMedia`](https://developer.mozilla.org/en/docs/Web/API/MediaDevices/getUserMedia) API.

Process: [Main](/pt/docs/latest/glossary#main-process)

O exemplo a seguir mostra como capturar vídeo de uma janela desktop com o título `Electron`:

```javascript
// main.js  
const { app, BrowserWindow, desktopCapturer, session } = require('electron')  
  
app.whenReady().then(() => {  
  const mainWindow = new BrowserWindow()  
  
  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {  
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {  
      // Grant access to the first screen found.  
      callback({ video: sources[0], audio: 'loopback' })  
    })  
    // If true, use the system picker if available.  
    // Note: this is currently experimental. If the system picker  
    // is available, it will be used and the media request handler  
    // will not be invoked.  
  }, { useSystemPicker: true })  
  
  mainWindow.loadFile('index.html')  
})  

```

```javascript
// renderer.js  
const startButton = document.getElementById('startButton')  
const stopButton = document.getElementById('stopButton')  
const video = document.querySelector('video')  
  
startButton.addEventListener('click', () => {  
  navigator.mediaDevices.getDisplayMedia({  
    audio: true,  
    video: {  
      width: 320,  
      height: 240,  
      frameRate: 30  
    }  
  }).then(stream => {  
    video.srcObject = stream  
    video.onloadedmetadata = (e) => video.play()  
  }).catch(e => console.log(e))  
})  
  
stopButton.addEventListener('click', () => {  
  video.pause()  
})  

```

```javascript
<!-- index.html -->  
<html>  
<meta http-equiv="content-security-policy" content="script-src 'self' 'unsafe-inline'" />  
  <body>  
    <button id="startButton" class="button">Start</button>  
    <button id="stopButton" class="button">Stop</button>  
    <video width="320" height="240" autoplay></video>  
    <script src="renderer.js"></script>  
  </body>  
</html>  

```

See [`navigator.mediaDevices.getDisplayMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) for more information.

> [!NOTE]
> 

> note

> 

`navigator.mediaDevices.getDisplayMedia` does not permit the use of `deviceId` for selection of a source - see [specification](https://w3c.github.io/mediacapture-screen-share/#constraints).

## Métodos

O módulo `desktopCapturer` tem os seguintes métodos:

### `desktopCapturer.getSources(options)`

History[](/docs/latest/breaking-changes#api-changed-callback-based-versions-of-promisified-apis)

- ``

  - ``````
  - ``[](/pt/docs/latest/api/structures/size)````
  - ``

``[](/pt/docs/latest/api/structures/desktop-capturer-source)``

> [!NOTE]
> 

> 

- ``[``](/pt/docs/latest/api/system-preferences#systempreferencesgetmediaaccessstatusmediatype-windows-macos)

## 

### 
``

### 
````[](https://developer.apple.com/documentation/CoreAudio/capturing-system-audio-with-core-audio-taps#Configure-the-sample-code-project)

> ``````[``](https://source.chromium.org/chromium/chromium/src/+/ad17e8f8b93d5f34891b06085d373a668918255e)``[](https://developer.apple.com/documentation/CoreAudio/capturing-system-audio-with-core-audio-taps)````

```javascript
  
  

```

### 
``[](https://developer.apple.com/library/archive/documentation/Security/Conceptual/System_Integrity_Protection_Guide/KernelExtensions/KernelExtensions.html)[](https://existential.audio/blackhole/)[](https://rogueamoeba.com/freebies/soundflower/)``[](https://github.com/electron/electron/edit/main/docs/api/desktop-capturer.md)[](/pt/docs/latest/api/crash-reporter)[](/pt/docs/latest/api/dialog)

- 

  - [``](#desktopcapturergetsourcesoptions)

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
