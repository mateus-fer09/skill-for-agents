---
title: "Consultar Pedido por ID (GET /v1/orders/{order_id})"
description: "Retorna o detalhamento completo de um pedido: status de pagamento, dados do cliente, itens e transações."
topics:
  - pedidos
  - consultar-pedido
  - get-v1-orders-id
  - status-pedido
keywords:
  - GET /v1/orders/{order_id}
  - detalhes do pedido
  - status
  - payments
  - customer
  - shipping
related:
  - ../../index_master.md
  - criar_pedido.md
  - calculo_valor_pedido.md
  - upsell.md
source_scope:
  - https://docs.appmax.com.br/api-reference/orders/consultar-pedido
---

# Consultar dados de um pedido

`GET /v1/orders/{order_id}`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Consulta os detalhes de um pedido previamente criado para um merchant.
Basta informar o ID do pedido na URL.

Veja a [lista completa de status](../../fundamentos/status_pedidos.md) para entender
o campo `status` retornado.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `order_id` | integer | sim | ID do pedido na Appmax. |

## Respostas

### 200

Detalhes do pedido retornados com sucesso.

```json
{
  "data": {
    "order": {
      "id": 3531,
      "status": "estornado",
      "total_paid": 8916,
      "amounts": {
        "sub_total": 4662,
        "shipping_value": 2738,
        "discount": 0,
        "installment_fee": 1516
      },
      "created_at": "2025-02-13 14:09:48",
      "updated_at": "2025-02-13 14:11:55"
    },
    "customer": {
      "id": 2023,
      "name": "Junior Almeida",
      "email": "junior.almeida@teste.com",
      "document_number": "19100000000"
    },
    "payment": {
      "method": "creditcard",
      "installments": 12,
      "installments_amount": 743,
      "card": {
        "brand": "visa",
        "number": "400000****0010"
      },
      "paid_at": "2025-02-13 14:10:20"
    },
    "refund": {
      "refunded_at": "2025-02-13 14:11:55"
    }
  }
}
```

### 404

Pedido não encontrado.

```json
{
  "error": {
    "message": "Order not found"
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Pedido](criar_pedido.md)
- [Calculo Valor Pedido](calculo_valor_pedido.md)
- [Upsell](upsell.md)
