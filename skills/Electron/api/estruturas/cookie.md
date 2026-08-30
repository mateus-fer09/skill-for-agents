---
title: "Cookie Object"
description: "- name string - O nome do cookie."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Cookie Object"
  - "name"
  - "value"
  - "domain"
  - "hostOnly"
  - "true"
  - "path"
  - "secure"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/cookie"
---

# Cookie Object

- `name` string - O nome do cookie.

- `value` string - O valor do cookie.

- `domain` string (opcional) - O domínio do cookie; isto será normalizado com um ponto no início para que ele também seja válido para subdomínios.

- `hostOnly` boolean (opcional) - Se o cookie é host-only; isso será `true` apenas se nenhum domínio foi passado.

- `path` string (opcional) - O Diretório do cookie.

- `secure` boolean (opcional) - Se o cookie está marcado como seguro.

- `httpOnly` boolean (opcional) - Se o cookie está marcado como apenas HTTP.

- `session` boolean (optional) - Se o cookie é um cookie de sessão ou um cookie persistente com uma data de expiração.

- `expirationDate` Double (optional) - A data de validade do cookie como o número de segundos desde a época da UNIX. Não fornecida em cookies de sessão.

- `sameSite` string - A política de [Same Site](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies) aplicada a este cookie.  Pode ser `unspecified`, `no_restriction`, `lax` ou `strict`.
