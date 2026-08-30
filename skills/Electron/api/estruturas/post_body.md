---
title: "Objeto PostBody"
description: "- data ([UploadRawData](/pt/docs/latest/api/structures/upload-raw-data) | [UploadFile](/pt/docs/latest/api/structures/upload-file))[] - The post data to be sent to the new window."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto PostBody"
  - "data"
  - "contentType"
  - "enctype"
  - "boundary"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/post-body"
---

# Objeto PostBody

- `data` ([UploadRawData](/pt/docs/latest/api/structures/upload-raw-data) | [UploadFile](/pt/docs/latest/api/structures/upload-file))[] - The post data to be sent to the new window.

- `contentType` string - O cabeçalho `content-type` usado para os dados. Um dos `application/x-www-form-urlencoded` ou `multipart/form-data`. Corresponde ao atributo `enctype` do formulário HTML submetido.

- `boundary` string (opcional) - O limite usado para separar múltiplas partes da mensagem. Válido somente quando `contentType` é `multipart/form-data`.
