---
title: "Introdução à API de Referência"
description: "Visão geral técnica da API REST da Appmax, URLs base, convenções de requisição, cabeçalhos e autenticação."
topics:
  - api-rest
  - introducao
  - headers
  - base-urls
  - padroes-resposta
keywords:
  - api reference
  - rest
  - json
  - authorization bearer
  - api.appmax.com.br
  - endpoints
related:
  - ../index_master.md
source_scope:
  - https://docs.appmax.com.br/api-reference/introduction
---

# Introdução à API

## URLs base

A Appmax oferece dois ambientes para integração:

| Ambiente   | Autenticação                          | API                                  |
| ---------- | ------------------------------------- | ------------------------------------ |
| Sandbox    | `https://auth.sandboxappmax.com.br`   | `https://api.sandboxappmax.com.br`   |
| Produção   | `https://auth.appmax.com.br`          | `https://api.appmax.com.br`          |

## Autenticação

Todas as requisições à API (exceto a obtenção do token) devem incluir o header `Authorization` com um token Bearer válido.

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...
```

Para obter o token, faça um `POST` para o endpoint de autenticação:

```bash
curl --location 'https://auth.appmax.com.br/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=SEU_CLIENT_ID' \
--data-urlencode 'client_secret=SEU_CLIENT_SECRET'
```

Resposta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

> **O token tem validade de 1 hora. Após expirar, obtenha um novo token usando o mesmo processo. A API não utiliza refresh tokens.**
>
>
## Headers obrigatórios

| Header          | Valor                        |
| --------------- | ---------------------------- |
| `Authorization` | `Bearer {TOKEN}`             |
| `Content-Type`  | `application/json`           |
| `Accept`        | `application/json`           |

## Formato de resposta

Todas as respostas da API seguem o formato envelope com o campo `data`:

```json
{
  "data": {
    // conteudo da resposta
  }
}
```

## Códigos de status HTTP

| Código | Descrição                                    |
| ------ | -------------------------------------------- |
| `200`  | Requisição bem-sucedida                      |
| `201`  | Recurso criado com sucesso                   |
| `400`  | Erro na requisição (ex.: pedido já pago)     |
| `401`  | Token inválido ou expirado                   |
| `404`  | Recurso não encontrado                       |
| `422`  | Erro de validação dos dados                  |
| `500`  | Erro interno do servidor                     |

## Tratamento de erros

Respostas de erro seguem o formato envelope com o campo `error` ou `errors`:

```json
{
  "error": {
    "message": "Order not found"
  }
}
```

Em erros de validação (`422`), os detalhes de cada campo são retornados:

```json
{
  "message": "The given data failed to pass validation.",
  "errors": {
    "message": {
      "campo": ["Mensagem de validação"]
    }
  }
}
```

> **Sempre verifique o código HTTP da resposta antes de processar o corpo. Para erros `401`, obtenha um novo token e repita a requisição.**
>
>
## Valores monetários

> **Todos os valores monetários na API são representados em **centavos** (inteiros). Por exemplo, R$ 123,00 deve ser enviado como `12300`.**
>
>

## Veja Também

- [Index Master](../index_master.md)
