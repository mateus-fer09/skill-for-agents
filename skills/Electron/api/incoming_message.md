---
title: "Class: IncomingMessage"
description: "## Class: IncomingMessage"
topics:
  - "Api"
keywords:
  - "Class: IncomingMessage"
  - "IncomingMessage"
  - "chunk"
  - "data"
  - "error"
  - "close"
  - "response.statusCode"
  - "Integer"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/incoming-message"
---

# Class: IncomingMessage

## Class: IncomingMessage

> 

Handle responses to HTTP/HTTPS requests.

Process: [Main](/pt/docs/latest/glossary#main-process), [Utility](/pt/docs/latest/glossary#utility-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

`IncomingMessage` implements the [Readable Stream](https://nodejs.org/api/stream.html#stream_readable_streams) interface and is therefore an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

### Eventos de instância

#### Event: 'data'

Retorna:

- `chunk` Buffer - A chunk of response body's data.

The `data` event is the usual method of transferring response data into applicative code.

#### Event: 'end'

Indicates that response body has ended. Must be placed before 'data' event.

#### Event: 'aborted'

Emitido quando uma solicitação foi cancelada durante uma transação HTTP em curso.

#### Evento: 'error'

Retorna:

- `error` Error - Typically holds an error string identifying failure root cause.

Emitido quando ocorreu um erro ao transmitir eventos de dados de resposta. For instance, if the server closes the underlying connection while the response is still streaming, an `error` event will be emitted on the response object and a `close` event will subsequently follow on the request object.

### Propriedades da Instância

An `IncomingMessage` instance has the following readable properties:

#### `response.statusCode`

Um `Integer` indica o estado do código de resposta HTTP.

#### `response.statusMessage`

Uma `string` representa a mensagem de estado HTTP.

#### `response.headers`

A `Record<string, string | string[]>` representing the HTTP response headers. The `headers` object is formatted as follows:

- Todos os nomes de cabeçalho são em minúsculas.

- Duplicates of `age`, `authorization`, `content-length`, `content-type`, `etag`, `expires`, `from`, `host`, `if-modified-since`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `referer`, `retry-after`, `server`, or `user-agent` are discarded.

- `set-cookie` is always an array. Duplicates are added to the array.

- For duplicate `cookie` headers, the values are joined together with '; '.

- For all other headers, the values are joined together with ', '.

#### `response.httpVersion`

A `string` indicating the HTTP protocol version number. Typical values are '1.0' or '1.1'. Additionally `httpVersionMajor` and `httpVersionMinor` are two Integer-valued readable properties that return respectively the HTTP major and minor version numbers.

#### `response.httpVersionMajor`

An `Integer` indicating the HTTP protocol major version number.

#### `response.httpVersionMinor`

An `Integer` indicating the HTTP protocol minor version number.

#### `response.rawHeaders`

A `string[]` containing the raw HTTP response headers exactly as they were received. The keys and values are in the same list. It is not a list of tuples. So, the even-numbered offsets are key values, and the odd-numbered offsets are the associated values. Header names are not lowercased, and duplicates are not merged.

```javascript
// Prints something like:  
//  
// [ 'user-agent',  
//   'this is invalid because there can be only one',  
//   'User-Agent',  
//   'curl/7.22.0',  
//   'Host',  
//   '127.0.0.1:8000',  
//   'ACCEPT',  
//   '*/*' ]  
console.log(response.rawHeaders)  

```
