---
title: "protocol"
description: "Documentação técnica e referência da API de protocol no Electron."
topics:
  - "Api"
keywords:
  - "ready"
  - "protocol"
  - "partition"
  - "session"
  - "browserWindow"
  - "webPreferences"
  - "electron.protocol.XXX"
  - "customSchemes"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/protocol"
---

# protocol

> 

Registra um protocolo personalizado e intercepta as solicitações de protocolo existentes.

Process: [Main](/pt/docs/latest/glossary#main-process)

Um exemplo de implementação de um protocolo que tem o mesmo efeito que o `file://` protocol:

```javascript
const { app, protocol, net } = require('electron')  
  
const path = require('node:path')  
const url = require('node:url')  
  
app.whenReady().then(() => {  
  protocol.handle('atom', (request) => {  
    const filePath = request.url.slice('atom://'.length)  
    return net.fetch(url.pathToFileURL(path.join(__dirname, filePath)).toString())  
  })  
})  

```

> 

[!NOTE] All methods unless specified can only be used after the `ready` event of the `app` module gets emitted.

## Using `protocol` with a custom `partition` or `session`

A protocol is registered to a specific Electron [`session`](/pt/docs/latest/api/session) object. If you don't specify a session, then your `protocol` will be applied to the default session that Electron uses. However, if you define a `partition` or `session` on your `browserWindow`'s `webPreferences`, then that window will use a different session and your custom protocol will not work if you just use `electron.protocol.XXX`.

To have your custom protocol work in combination with a custom session, you need to register it to that session explicitly.

```javascript
const { app, BrowserWindow, net, protocol, session } = require('electron')  
  
const path = require('node:path')  
const url = require('node:url')  
  
app.whenReady().then(() => {  
  const partition = 'persist:example'  
  const ses = session.fromPartition(partition)  
  
  ses.protocol.handle('atom', (request) => {  
    const filePath = request.url.slice('atom://'.length)  
    return net.fetch(url.pathToFileURL(path.resolve(__dirname, filePath)).toString())  
  })  
  
  const mainWindow = new BrowserWindow({ webPreferences: { partition } })  
})  

```

## Protocol names

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) defines what a valid protocol name is:

> 

Scheme names consist of a sequence of characters beginning with a letter and followed by any combination of letters, digits, plus ("+"), period ("."), or hyphen ("-"). Although schemes are case-insensitive, the canonical form is lowercase […].

## Métodos

O módulo de protocolo possui os seguintes métodos:

### `protocol.registerSchemesAsPrivileged(customSchemes)`

- `customSchemes` [CustomScheme[]](/pt/docs/latest/api/structures/custom-scheme)

> 

[!NOTE] This method can only be used before the `ready` event of the `app` module gets emitted and can be called only once.

Registers the `scheme` as standard, secure, bypasses content security policy for resources, allows registering ServiceWorker, supports fetch API, streaming video/audio, and V8 code cache. Specify a privilege with the value of `true` to enable the capability.

An example of registering a privileged scheme, that bypasses Content Security Policy:

```javascript
const { protocol } = require('electron')  
  
protocol.registerSchemesAsPrivileged([  
  { scheme: 'foo', privileges: { bypassCSP: true } }  
])  

```

A standard scheme adheres to what RFC 3986 calls [generic URI syntax](https://tools.ietf.org/html/rfc3986#section-3). For example `http` and `https` are standard schemes, while `file` is not.

Registering a scheme as standard allows relative and absolute resources to be resolved correctly when served. Caso contrário, o esquema se comportará como o protocolo `file`, mas sem a capacidade de resolver URLs relativos.

Por exemplo, quando você carrega a página seguinte com o protocolo personalizado sem registrando-o como esquema padrão, a imagem não será carregada porque esquemas não padrão não podem reconhecer URLs relativas:

```javascript
<body>  
  <img src='test.png'>  
</body>  

```

Registering a scheme as standard will allow access to files through the [FileSystem API](https://developer.mozilla.org/en-US/docs/Web/API/LocalFileSystem). Caso contrário, o renderizador lançará um erro de segurança para o esquema.

By default web storage apis (localStorage, sessionStorage, webSQL, indexedDB, cookies) are disabled for non standard schemes. So in general if you want to register a custom protocol to replace the `http` protocol, you have to register it as a standard scheme.

Protocols that use streams (http and stream protocols) should set `stream: true`. The `<video>` and `<audio>` HTML elements expect protocols to buffer their responses by default. The `stream` flag configures those elements to correctly expect streaming responses.

### `protocol.handle(scheme, handler)`

- `scheme` string - scheme to handle, for example `https` or `my-app`. This is the bit before the `:` in a URL.

- `handler` Function<[GlobalResponse](https://nodejs.org/api/globals.html#response) | Promise<GlobalResponse>>

  - `request` [GlobalRequest](https://nodejs.org/api/globals.html#request)

Register a protocol handler for `scheme`. Requests made to URLs with this scheme will delegate to this handler to determine what response should be sent.

Either a `Response` or a `Promise<Response>` can be returned.

Exemplo:

```javascript
const { app, net, protocol } = require('electron')  
  
const path = require('node:path')  
const { pathToFileURL } = require('node:url')  
  
protocol.registerSchemesAsPrivileged([  
  {  
    scheme: 'app',  
    privileges: {  
      standard: true,  
      secure: true,  
      supportFetchAPI: true  
    }  
  }  
])  
  
app.whenReady().then(() => {  
  protocol.handle('app', (req) => {  
    const { host, pathname } = new URL(req.url)  
    if (host === 'bundle') {  
      if (pathname === '/') {  
        return new Response('<h1>hello, world</h1>', {  
          headers: { 'content-type': 'text/html' }  
        })  
      }  
      // NB, this checks for paths that escape the bundle, e.g.  
      // app://bundle/../../secret_file.txt  
      const pathToServe = path.resolve(__dirname, pathname)  
      const relativePath = path.relative(__dirname, pathToServe)  
      const isSafe = relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)  
      if (!isSafe) {  
        return new Response('bad', {  
          status: 400,  
          headers: { 'content-type': 'text/html' }  
        })  
      }  
  
      return net.fetch(pathToFileURL(pathToServe).toString())  
    } else if (host === 'api') {  
      return net.fetch('https://api.my-server.com/' + pathname, {  
        method: req.method,  
        headers: req.headers,  
        body: req.body  
      })  
    }  
  })  
})  

```

See the MDN docs for [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) for more details.

### `protocol.unhandle(scheme)`

- `scheme` string - scheme for which to remove the handler.

Removes a protocol handler registered with `protocol.handle`.

### `protocol.isProtocolHandled(scheme)`

- `scheme` string

Returns `boolean` - Whether `scheme` is already handled.

### `protocol.registerFileProtocol(scheme, handler)` *Descontinuado*

History[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/protocol-request)
  - ``

    - ``[](/pt/docs/latest/api/structures/protocol-response)

````````````````````````````````

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/protocol-request)
  - ``

    - ``[](/pt/docs/latest/api/structures/protocol-response)

``````````````

```javascript
  
  
  

```

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/protocol-request)
  - ``

    - ``[](/pt/docs/latest/api/structures/protocol-response)

``````````````

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/protocol-request)
  - ``

    - ``[](/pt/docs/latest/api/structures/protocol-response)

``````````

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/protocol-request)
  - ``

    - ``[](/pt/docs/latest/api/structures/protocol-response)

````````[``](https://nodejs.org/api/stream.html#stream_class_stream_readable)``

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```
``````

```javascript
  
  
  

```

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
````

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
````

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/protocol-request)
  - ``

    - ``[](/pt/docs/latest/api/structures/protocol-response)

``````

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/protocol-request)
  - ``

    - ``[](/pt/docs/latest/api/structures/protocol-response)

````````

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/protocol-request)
  - ``

    - ``[](/pt/docs/latest/api/structures/protocol-response)

````````

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/protocol-request)
  - ``

    - ``[](/pt/docs/latest/api/structures/protocol-response)

``````

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
- ``

  - ``[](/pt/docs/latest/api/structures/protocol-request)
  - ``

    - ``[](/pt/docs/latest/api/structures/protocol-response)

````

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
````

### ``**
[``````](/docs/latest/breaking-changes#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)

- ``
````[](https://github.com/electron/electron/edit/main/docs/api/protocol.md)[](/pt/docs/latest/api/process)[](/pt/docs/latest/api/push-notifications)

- [``````](#using-protocol-with-a-custom-partition-or-session)
- 
- 

  - [``](#protocolregisterschemesasprivilegedcustomschemes)
  - [``](#protocolhandlescheme-handler)
  - [``](#protocolunhandlescheme)
  - [``](#protocolisprotocolhandledscheme)
  - [``](#protocolregisterfileprotocolscheme-handler-descontinuado)
  - [``](#protocolregisterbufferprotocolscheme-handler-descontinuado)
  - [``](#protocolregisterstringprotocolscheme-handler-descontinuado)
  - [``](#protocolregisterhttpprotocolscheme-handler-descontinuado)
  - [``](#protocolregisterstreamprotocolscheme-handler-descontinuado)
  - [``](#protocolunregisterprotocolscheme-descontinuado)
  - [``](#protocolisprotocolregisteredscheme-descontinuado)
  - [``](#protocolinterceptfileprotocolscheme-handler-descontinuado)
  - [``](#protocolinterceptstringprotocolscheme-handler-descontinuado)
  - [``](#protocolinterceptbufferprotocolscheme-handler-descontinuado)
  - [``](#protocolintercepthttpprotocolscheme-handler-descontinuado)
  - [``](#protocolinterceptstreamprotocolscheme-handler-descontinuado)
  - [``](#protocoluninterceptprotocolscheme-descontinuado)
  - [``](#protocolisprotocolinterceptedscheme-descontinuado)

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
