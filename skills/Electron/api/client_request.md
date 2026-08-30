---
title: "Class: ClientRequest"
description: "## Class: ClientRequest"
topics:
  - "Api"
keywords:
  - "Class: ClientRequest"
  - "ClientRequest"
  - "options"
  - "method"
  - "headers"
  - "session"
  - "Session"
  - "partition"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/client-request"
---

# Class: ClientRequest

## Class: ClientRequest

> 

Realiza requisições HTTP/HTTPS.

Process: [Main](/pt/docs/latest/glossary#main-process), [Utility](/pt/docs/latest/glossary#utility-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

`ClientRequest` implementa a interface [Writable Stream](https://nodejs.org/api/stream.html#stream_writable_streams) e deste modo um [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

### `new ClientRequest(opções)`

- `options` (Object | string) - If `options` is a string, it is interpreted as the request URL. If it is an object, it is expected to fully specify an HTTP request via the following properties:

  - `method` string (optional) - The HTTP request method. Defaults to the GET method.

  - `url` string (optional) - The request URL. Must be provided in the absolute form with the protocol scheme specified as http or https.

  - `headers` Record<string, string | string[]> (optional) - Headers to be sent with the request.

  - `session` Session (optional) - The [`Session`](/pt/docs/latest/api/session) instance with which the request is associated.

  - `partition` string (optional) - The name of the [`partition`](/pt/docs/latest/api/session) with which the request is associated. O padrão é uma string vazia. The `session` option supersedes `partition`. Assim, se a `sessão` é explicitamente especificada, a `partição` é ignorada.

  - `bypassCustomProtocolHandlers` boolean (optional) - When set to `true`, custom protocol handlers registered for the request's URL scheme will not be called. This allows forwarding an intercepted request to the built-in handler. [webRequest](/pt/docs/latest/api/web-request) handlers will still be triggered when bypassing custom protocols. O padrão é `false`.

  - `credentials` string (optional) - Can be `include`, `omit` or `same-origin`. Whether to send [credentials](https://fetch.spec.whatwg.org/#credentials) with this request. If set to `include`, credentials from the session associated with the request will be used. If set to `omit`, credentials will not be sent with the request (and the `'login'` event will not be triggered in the event of a 401). If set to `same-origin`, `origin` must also be specified. This matches the behavior of the [fetch](https://fetch.spec.whatwg.org/#concept-request-credentials-mode) option of the same name. If this option is not specified, authentication data from the session will be sent, and cookies will not be sent (unless `useSessionCookies` is set).

  - `useSessionCookies` boolean (optional) - Whether to send cookies with this request from the provided session. If `credentials` is specified, this option has no effect. Por padrão é `false`.

  - `protocol` string (optional) - Can be `http:` or `https:`. The protocol scheme in the form 'scheme:'. Defaults to 'http:'.

  - `host` string (opcional) - O servidor, definido como a concatenação do nome com a porta: 'nome:porta'.

  - `hostname` string (opcional) - O nome do servidor.

  - `port` Integer (opcional) - O número da porta do servidor.

  - `path` string (opcional) - A parte do caminho da URL de requisição.

  - `redirect` string (optional) - Can be `follow`, `error` or `manual`. The redirect mode for this request. When mode is `error`, any redirection will be aborted. When mode is `manual` the redirection will be cancelled unless [`request.followRedirect`](#requestfollowredirect) is invoked synchronously during the [`redirect`](#event-redirect) event.  O padrão é `follow`.

  - `origin` string (optional) - The origin URL of the request.

  - `referrerPolicy` string (optional) - can be "", `no-referrer`, `no-referrer-when-downgrade`, `origin`, `origin-when-cross-origin`, `unsafe-url`, `same-origin`, `strict-origin`, or `strict-origin-when-cross-origin`. Padrão sendo `strict-origin-when-cross-origin`.

  - `cache` string (optional) - can be `default`, `no-store`, `reload`, `no-cache`, `force-cache` or `only-if-cached`.

  - `priority` string (optional) - can be `throttled`, `idle`, `lowest`, `low`, `medium`, or `highest`. O padrão é `idle`.

  - `priorityIncremental` boolean (optional) - the incremental loading flag as part of HTTP extensible priorities (RFC 9218). Por padrão é `true`.

As propriedades em `options`, como `protocol`, `host`, `hostname`, `port` e `path` seguem estritamente o modelo Node.js, como descrito no módulo [URL](https://nodejs.org/api/url.html).

Por exemplo, nós poderíamos criar a mesma requisição para 'github.com' da seguinte forma:

```javascript
const request = net.request({  
  method: 'GET',  
  protocol: 'https:',  
  hostname: 'github.com',  
  port: 443,  
  path: '/'  
})  

```

### Eventos de instância

#### Evento: 'response'

Retorna:

- `response` [IncomingMessage](/pt/docs/latest/api/incoming-message) - An object representing the HTTP response message.

#### Evento: 'login'

Retorna:

- Objeto `authInfo`

  - `isProxy` boolean

  - `scheme` string

  - `host` string

  - `port` Integer

  - `realm` string

- `callback` Function

  - `username` string (optional)

  - `password` string (optional)

Emitido quando um proxy de autenticação está solicitando as credenciais de usuário.

A função de `callback` é esperada para chamar de volta as credenciais do usuário:

- `username` string

- `password` string

```javascript
request.on('login', (authInfo, callback) => {  
  callback('username', 'password')  
})  

```

Informar credenciais vazias irá cancelar a requisição e reportar um erro de autenticação no objeto de resposta:

```javascript
request.on('response', (response) => {  
  console.log(`STATUS: ${response.statusCode}`)  
  response.on('error', (error) => {  
    console.log(`ERROR: ${JSON.stringify(error)}`)  
  })  
})  
request.on('login', (authInfo, callback) => {  
  callback()  
})  

```

#### Evento: 'finish'

Emitido logo após o último pedaço dos dados de `request` for escrito no objeto `request`.

#### Evento: 'abort'

Emitted when the `request` is aborted. The `abort` event will not be fired if the `request` is already closed.

#### Evento: 'error'

Retorna:

- `error` Error - um objeto de erro que provê informações sobre a falha.

Emitido quando o módulo `net` falha ao emitir uma requisição de rede. Normalmente quando o objeto `request` emite um evento `error`, um evento `close` virá a seguir e nenhum objeto de resposta será fornecido.

#### Evento: 'close'

Emitido como último evento na transação HTTP de requisição-resposta. O evento `close` indica que nenhum outro evento será emitido no objeto `request` e nem no objeto `response`.

#### Evento: 'redirect'

Retorna:

- `statusCode` Integer

- `method` string

- `redirectUrl` string

- `responseHeaders` Record<string, string[]>

Emitted when the server returns a redirect response (e.g. 301 Moved Permanently). Calling [`request.followRedirect`](#requestfollowredirect) will continue with the redirection.  If this event is handled, [`request.followRedirect`](#requestfollowredirect) must be called **synchronously**, otherwise the request will be cancelled.

### Propriedades da Instância

#### `request.chunkedEncoding`

A `boolean` specifying whether the request will use HTTP chunked transfer encoding or not. Defaults to false. The property is readable and writable, however it can be set only before the first write operation as the HTTP headers are not yet put on the wire. Trying to set the `chunkedEncoding` property after the first write will throw an error.

Using chunked encoding is strongly recommended if you need to send a large request body as data will be streamed in small chunks instead of being internally buffered inside Electron process memory.

### Métodos de Instância

#### `request.setHeader(name, value)`

- `name` string - An extra HTTP header name.

- `value` string - An extra HTTP header value.

Adds an extra HTTP header. The header name will be issued as-is without lowercasing. It can be called only before first write. Calling this method after the first write will throw an error. If the passed value is not a `string`, its `toString()` method will be called to obtain the final value.

Certain headers are restricted from being set by apps. These headers are listed below. More information on restricted headers can be found in [Chromium's header utils](https://source.chromium.org/chromium/chromium/src/+/main:services/network/public/cpp/header_util.cc;drc=1562cab3f1eda927938f8f4a5a91991fefde66d3;bpv=1;bpt=1;l=22).

- `Content-Length`

- `Host`

- `Trailer` ou `Te`

- `Fazer upgrade`

- `Cookie2`

- `Keep-Alive`

- `Transfer-Encoding`

Additionally, setting the `Connection` header to the value `upgrade` is also disallowed.

#### `request.getHeader(name)`

- `name` string - Specify an extra header name.

Returns `string` - The value of a previously set extra header name.

#### `request.removeHeader(name)`

- `name` string - Specify an extra header name.

Removes a previously set extra header name. This method can be called only before first write. Trying to call it after the first write will throw an error.

#### `request.write(chunk[, encoding][, callback])`

- `chunk` (string | Buffer) - A chunk of the request body's data. If it is a string, it is converted into a Buffer using the specified encoding.

- `encoding` string (optional) - Used to convert string chunks into Buffer objects. Defaults to 'utf-8'.

- `callback` Function (optional) - Called after the write operation ends.

`callback` is essentially a dummy function introduced in the purpose of keeping similarity with the Node.js API. It is called asynchronously in the next tick after `chunk` content have been delivered to the Chromium networking layer. Contrary to the Node.js implementation, it is not guaranteed that `chunk` content have been flushed on the wire before `callback` is called.

Adds a chunk of data to the request body. The first write operation may cause the request headers to be issued on the wire. After the first write operation, it is not allowed to add or remove a custom header.

#### `request.end([chunk][, encoding][, callback])`

- `chunk` (string | Buffer) (optional)

- `encoding` string (opcional)

- `callback` Function (optional)

Retorna `this`.

Sends the last chunk of the request data. Subsequent write or end operations will not be allowed. The `finish` event is emitted just after the end operation.

#### `request.abort()`

Cancels an ongoing HTTP transaction. If the request has already emitted the `close` event, the abort operation will have no effect. Otherwise an ongoing event will emit `abort` and `close` events. Additionally, if there is an ongoing response object, it will emit the `aborted` event.

#### `request.followRedirect()`

Continues any pending redirection. Can only be called during a `'redirect'` event.

#### `request.getUploadProgress()`

Retorna `Object`:

- `active` boolean - Whether the request is currently active. If this is false no other properties will be set

- `started` boolean - Whether the upload has started. If this is false both `current` and `total` will be set to 0.

- `current` Integer - The number of bytes that have been uploaded so far

- `total` Integer - The number of bytes that will be uploaded this request

You can use this method in conjunction with `POST` requests to get the progress of a file upload or other data transfer.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/client-request.md)
