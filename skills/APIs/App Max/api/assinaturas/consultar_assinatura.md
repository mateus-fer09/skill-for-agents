---
title: "Consultar Assinatura por ID (GET /v1/subscriptions/{id})"
description: "Retorna o status, histórico de ciclos, produtos vinculados e próximo dia de cobrança de uma assinatura."
topics:
  - assinaturas
  - consultar-assinatura
  - get-v1-subscriptions-id
  - ciclos-cobranca
keywords:
  - GET /v1/subscriptions/{id}
  - detalhes da assinatura
  - status
  - ciclos
  - proxima cobranca
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - pausar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/consultar-assinatura
---

# Consultar assinatura

`GET /v1/subscriptions/{id}`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Retorna os detalhes completos da assinatura, incluindo produtos, ciclos e
o histórico de cobranças.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador da assinatura. |

## Respostas

### 200

Detalhes da assinatura retornados com sucesso.

```json
{
  "data": {
    "subscription_id": 10,
    "status": "ACTIVE",
    "products": [
      {
        "name": "Camiseta Preta",
        "shopify_product_id": null,
        "variant_id": null,
        "product_id": 55,
        "sku": "SKU-1",
        "quantity": 1,
        "price": 199.9,
        "image_url": null,
        "compare_at_price": null
      }
    ],
    "value": 199.9,
    "freight_value": 19.9,
    "interval": "month",
    "interval_count": 1,
    "current_cycle": 3,
    "completed_cycles": 2,
    "max_cycles": 12,
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
        "expiration": "12/2029"
      }
    },
    "next_charge_at": "2026-08-15 00:00:00",
    "last_charge_at": "15/07/2026",
    "charges": [
      {
        "cycle": 2,
        "order_id": 12347,
        "shopify_order_id": null,
        "charged_at": "15/07/2026",
        "value": 199.9,
        "status": "paid"
      }
    ],
    "created_at": "2026-06-15 10:00:00",
    "canceled_at": null,
    "paused_from": null,
    "paused_until": null
  }
}
```

### 404

Assinatura não encontrada (ou de outra loja).

```json
{
  "errors": {
    "message": "Assinatura não encontrada."
  }
}
```

### 500

Erro ao buscar a assinatura.

```json
{
  "errors": {
    "message": "Erro ao buscar a assinatura."
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Pausar Assinatura](pausar_assinatura.md)
