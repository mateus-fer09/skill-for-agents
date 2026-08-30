---
title: "powerSaveBlocker"
description: "Documentação técnica e referência da API de powerSaveBlocker no Electron."
topics:
  - "Api"
keywords:
  - "powerSaveBlocker"
  - "type"
  - "Integer"
  - "powerSaveBlocker.start"
  - "boolean"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/power-save-blocker"
---

# powerSaveBlocker

> 

Block the system from entering low-power (sleep) mode.

Process: [Main](/pt/docs/latest/glossary#main-process)

Como por exemplo:

```javascript
const { powerSaveBlocker } = require('electron')  
  
const id = powerSaveBlocker.start('prevent-display-sleep')  
console.log(powerSaveBlocker.isStarted(id))  
  
powerSaveBlocker.stop(id)  

```

## Métodos

O módulo `powerSaveBlocker` tem os seguintes métodos:

### `powerSaveBlocker.start(type)`

- `type` string - Power save blocker type.

  - `prevent-app-suspension` - Prevent the application from being suspended. Keeps system active but allows screen to be turned off. Example use cases: downloading a file or playing audio.

  - `prevent-display-sleep` - Prevent the display from going to sleep. Keeps system and screen active. Example use case: playing video.

Returns `Integer` - The blocker ID that is assigned to this power blocker.

Starts preventing the system from entering lower-power mode. Returns an integer identifying the power save blocker.

> [!NOTE]
> 

> note

> 

`prevent-display-sleep` has higher precedence over `prevent-app-suspension`. Only the highest precedence type takes effect. In other words, `prevent-display-sleep` always takes precedence over `prevent-app-suspension`.

For example, an API calling A requests for `prevent-app-suspension`, and another calling B requests for `prevent-display-sleep`. `prevent-display-sleep` will be used until B stops its request. After that, `prevent-app-suspension` is used.

### `powerSaveBlocker.stop(id)`

- `id` Integer - The power save blocker id returned by `powerSaveBlocker.start`.

Stops the specified power save blocker.

Returns `boolean` - Whether the specified `powerSaveBlocker` has been stopped.

### `powerSaveBlocker.isStarted(id)`

- `id` Integer - The power save blocker id returned by `powerSaveBlocker.start`.

Returns `boolean` - Whether the corresponding `powerSaveBlocker` has started.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/power-save-blocker.md)[AnteriorpowerMonitor](/pt/docs/latest/api/power-monitor)[Avançarprocess](/pt/docs/latest/api/process)
