---
title: "Consultar Link de Pagamento (GET /v1/payment-link/{payment_link_id}/orders)"
description: "Consulta os pedidos gerados e o status das transações vinculadas a um link de pagamento."
topics:
  - links-pagamento
  - consultar-link
  - get-v1-payment-link-orders
keywords:
  - GET /v1/payment-link/{payment_link_id}/orders
  - consultar link
  - pedidos do link
  - status link
related:
  - ../../index_master.md
  - criar_link_pagamento.md
source_scope:
  - https://docs.appmax.com.br/api-reference/payment-links/consultar-link-pagamento
---

# Consultar os dados de um link de pagamento

`GET /v1/payment-link/{payment_link_id}/orders`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Retorna os pedidos gerados por um determinado link de pagamento, com o
status de cada um. Use para acompanhar as conversões do link criado em
[`POST /v1/payment-link`](criar_link_pagamento.md).

A resposta é paginada: `meta` traz os totais da consulta e `links` traz
as URLs de navegação entre as páginas.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `payment_link_id` | string | sim | ID do link de pagamento (retornado em `POST /v1/payment-link`). |

## Respostas

### 200

Link de pagamento encontrado com sucesso.

```json
{
  "data": [
    {
      "order": {
        "id": 1,
        "status": "cancelado",
        "total": 6000
      }
    },
    {
      "order": {
        "id": 2,
        "status": "pendente",
        "total": 6000
      }
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "per_page": 20,
    "total_pages": 1
  },
  "links": {
    "self": "https://api.appmax.com.br/v1/payment-link/1/orders?page=1",
    "next": null,
    "prev": null,
    "last": "https://api.appmax.com.br/v1/payment-link/1/orders?page=1"
  }
}
```

### 401

Erro de autenticação.

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Link Pagamento](criar_link_pagamento.md)
