---
title: "Objeto ProtocolResponse"
description: "- error Integer (opcional) - Quando definido, a request vai falhar com o número error . Para os números de erro disponíveis, por favor veja a [lista de net errors](https://source.c"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto ProtocolResponse"
  - "error"
  - "request"
  - "statusCode"
  - "charset"
  - "mimeType"
  - "headers"
  - "data"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/protocol-response"
---

# Objeto ProtocolResponse

- `error` Integer (opcional) - Quando definido, a `request` vai falhar com o número `error`. Para os números de erro disponíveis, por favor veja a [lista de net errors](https://source.chromium.org/chromium/chromium/src/+/main:net/base/net_error_list.h).

- `statusCode` number (opcional) - O código de resposta HTTP, o padrão é 200.

- `charset` string (opcional) - O conjunto de caracteres do corpo de resposta, o padrão é `"utf-8"`.

- `mimeType` string (opcional) - O tipo MIME do corpo de resposta, o padrão é `"text/html"`. Definir `mimeType` iria implicitamente definir o cabeçalho `content-type` em resposta, mas se `content-type` já está definido em `headers`, o `mimeType` seria ignorado.

- `headers` Record<string, string | string[]> (optional) - An object containing the response headers. As chaves devem ser string e os valores devem ser string ou Array de string.

- `data` (Buffer | string | ReadableStream) (opcional) - O corpo da resposta. Ao retornar stream como resposta, isto é uma stream legível Node.js representando o corpo da resposta. Ao retornar `Buffer` como resposta, isto é um `Buffer`. Ao retornar `string` como resposta, isto é uma `string`. Isto é ignorado para outros tipos de respostas.

- `path` string (opcional) - Caminho para o arquivo que seria enviado como corpo da resposta. Isto só é usado para respostas de arquivo.

- `url` string (opcional) - Baixa o `url` e transfere o resultado como corpo da resposta. Isto só é usado para respostas de URL.

- `referrer` string (opcional) - O URL de `referrer`. Isto só é usado para respostas de arquivo e de URL.

- `method` string (opcional) - O `method` HTTP. Isto só é usado para respostas de arquivo e de URL.

- `session` Session (optional) - The session used for requesting URL. The HTTP request will reuse the current session by default.

- `uploadData` [ProtocolResponseUploadData](/pt/docs/latest/api/structures/protocol-response-upload-data) (optional) - The data used as upload data. Isto só é usado para respostas de URL quando `method` é `"POST"`.
