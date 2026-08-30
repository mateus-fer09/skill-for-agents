---
title: "netLog"
description: "Documentação técnica e referência da API de netLog no Electron."
topics:
  - "Api"
keywords:
  - "netLog"
  - "ready"
  - "path"
  - "options"
  - "captureMode"
  - "includeSensitive"
  - "everything"
  - "default"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/net-log"
---

# netLog

> 

Logging network events for a session.

Process: [Main](/pt/docs/latest/glossary#main-process)

```javascript
const { app, netLog } = require('electron')  
  
app.whenReady().then(async () => {  
  await netLog.startLogging('/path/to/net-log')  
  // After some network events  
  const path = await netLog.stopLogging()  
  console.log('Net-logs written to', path)  
})  

```

See [`--log-net-log`](/pt/docs/latest/api/command-line-switches#--log-net-logpath) to log network events throughout the app's lifecycle.

> 

[!NOTE] All methods unless specified can only be used after the `ready` event of the `app` module gets emitted.

## Métodos

### `netLog.startLogging(path[, options])`

- `path` string - File path to record network logs.

- Objeto `options` (opcional)

  - `captureMode` string (optional) - What kinds of data should be captured. By default, only metadata about requests will be captured. Setting this to `includeSensitive` will include cookies and authentication data. Setting it to `everything` will include all bytes transferred on sockets. Can be `default`, `includeSensitive` or `everything`.

  - `maxFileSize` number (optional) - When the log grows beyond this size, logging will automatically stop. Defaults to unlimited.

Returns `Promise<void>` - resolves when the net log has begun recording.

Starts recording network events to `path`.

### `netLog.stopLogging()`

Returns `Promise<void>` - resolves when the net log has been flushed to disk.

Stops recording network events. If not called, net logging will automatically end when app quits.

## Propriedades

### `netLog.currentlyLogging` *Readonly*

A `boolean` property that indicates whether network logs are currently being recorded.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/net-log.md)
