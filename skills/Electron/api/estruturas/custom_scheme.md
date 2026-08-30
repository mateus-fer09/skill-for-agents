---
title: "Objeto"
description: "- scheme string - Esquemas personalizados que serão registrados com opções."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto"
  - "CustomScheme"
  - "scheme"
  - "privileges"
  - "standard"
  - "false"
  - "secure"
  - "bypassCSP"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/custom-scheme"
---

# Objeto `CustomScheme`

- `scheme` string - Esquemas personalizados que serão registrados com opções.

- `privileges` Object (opcional)

  - `standard` boolean (opcional) - por padrão é `false`.

  - `secure` boolean (opcional) - por padrão é `false`.

  - `bypassCSP` boolean (opcional) - por padrão é `false`.

  - `allowServiceWorkers` boolean (opcional) - por padrão é `false`.

  - `supportFetchAPI` boolean (opcional) - por padrão é `false`.

  - `corsEnabled` boolean (opcional) - por padrão é `false`.

  - `stream` boolean (opcional) - por padrão é `false`.

  - `codeCache` boolean (optional) - Enable V8 code cache for the scheme, only works when `standard` is also set to true. Default false.

  - `allowExtensions` boolean (optional) - Allow Chrome extensions to be used on pages served over this protocol. Default false.
