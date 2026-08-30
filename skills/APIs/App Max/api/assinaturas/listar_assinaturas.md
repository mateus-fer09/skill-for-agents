---
title: "Listar Assinaturas (GET /v1/subscriptions)"
description: "Listagem paginada de assinaturas com filtros por cliente, e-mail, status e datas."
topics:
  - assinaturas
  - recorrencia
  - get-v1-subscriptions
  - filtros-assinaturas
keywords:
  - GET /v1/subscriptions
  - assinaturas
  - recorrencia
  - status
  - customer_email
  - pagination
related:
  - ../../index_master.md
  - criar_assinatura.md
  - consultar_assinatura.md
  - pausar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/listar-assinaturas
---

# Listar assinaturas

`GET /v1/subscriptions`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Lista as assinaturas de um cliente, identificado pelo **e-mail**, com
paginação e filtro por status. Retorna 10 itens por página.

> **Formato de data na listagem**
>
> Nesta rota `next_charge_at` e `charges[].charged_at` vêm no formato
> `dd/mm/aaaa`. No detalhe da assinatura, `next_charge_at` vem como
> `aaaa-mm-dd hh:mm:ss`.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Consulta

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `email` | string | sim | E-mail do cliente. |
| `status` | enum: ACTIVE \| PAUSED \| CANCELLED | não | Filtra pelo status da assinatura. |
| `page` | integer | não | Página da listagem. |

## Respostas

### 200

Lista de assinaturas retornada com sucesso.

```json
{
  "data": {
    "subscriptions": [
      {
        "subscription_id": 10,
        "status": "ACTIVE",
        "products": [
          {
            "name": "Camiseta Preta",
            "price": 199.9,
            "quantity": 1,
            "shopify_product_id": null,
            "variant_id": null,
            "product_id": 55,
            "image_url": null,
            "compare_at_price": null
          }
        ],
        "value": 199.9,
        "freight_value": 19.9,
        "current_cycle": 3,
        "customer": {
          "name": "Maria Silva",
          "email": "cliente@exemplo.com",
          "document": "12345678909",
          "phone": "11999999999",
          "address": {
            "street": "Rua São Bento",
            "number": "111",
            "complement": "Bloco 7",
            "district": "Centro",
            "city": "São Paulo",
            "state": "SP",
            "postcode": "01010000"
          }
        },
        "payment": {
          "payment_info": {
            "brand": "visa",
            "final": "1234",
            "expiration": null
          }
        },
        "charges": [
          {
            "cycle": 1,
            "order_id": 12346,
            "shopify_order_id": null,
            "charged_at": "15/07/2026",
            "value": 199.9,
            "status": "paid"
          }
        ],
        "next_charge_at": "15/08/2026"
      }
    ],
    "pagination": {
      "total": 1,
      "per_page": 10,
      "current_page": 1,
      "last_page": 1
    }
  }
}
```

### 422

Parâmetros inválidos (por exemplo, `email` ausente ou inválido).

```json
{
  "errors": {
    "message": {
      "email": [
        "The email field is required."
      ]
    }
  }
}
```

### 500

Erro ao listar as assinaturas.

```json
{
  "errors": {
    "message": "Erro ao listar as assinaturas."
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
- [Pausar Assinatura](pausar_assinatura.md)
