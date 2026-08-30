---
title: "Criar Upsell em Pedido (POST /v1/orders/upsell)"
description: "Permite adicionar itens de upsell com cobrança direta utilizando o método de pagamento já aprovado no pedido original."
topics:
  - pedidos
  - upsell
  - one-click-buy
  - pos-venda
  - post-v1-orders-upsell
keywords:
  - POST /v1/orders/upsell
  - upsell
  - order_id
  - products
  - cobranca automatica
  - 1-click upsell
related:
  - ../../index_master.md
  - criar_pedido.md
  - consultar_pedido.md
  - calculo_valor_pedido.md
source_scope:
  - https://docs.appmax.com.br/api-reference/orders/upsell
---

# Criar um upsell

`POST /v1/orders/upsell`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cria um upsell vinculado a um pedido cujo pagamento já gerou o
`upsell_hash` (retornado pelo pagamento por cartão de crédito).

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `upsell_hash` | string | sim | Hash do pedido para upsell (gerado no pagamento por cartão). |
| `products_value` | integer | sim | Valor total dos produtos do upsell (em **centavos**). |
| `products` | array<Product> | sim |  |
| `products[].sku` | string | sim | SKU do produto. |
| `products[].name` | string | sim | Nome do produto. |
| `products[].quantity` | integer | sim | Quantidade do produto. |
| `products[].unit_value` | integer | não | Valor unitário do produto em **centavos**. Obrigatório quando `products_value` não é informado no pedido. |
| `products[].type` | enum: physical \| digital | não | Tipo do produto. |

### Exemplo de requisição

```json
{
  "upsell_hash": "4000114202503117156088040208561001715608804",
  "products_value": 12300,
  "products": [
    {
      "sku": "9000010",
      "name": "Livro de receitas",
      "quantity": 1,
      "unit_value": 12300,
      "type": "digital"
    }
  ]
}
```

## Respostas

### 201

Upsell criado com sucesso.

```json
{
  "data": {
    "message": "Transacao efetuada com sucesso",
    "redirect_url": "example.com/order/success-by-order?hash=..."
  }
}
```

### 404

Pedido não encontrado.

### 422

Erro de validação dos campos do payload.

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Pedido](criar_pedido.md)
- [Consultar Pedido](consultar_pedido.md)
- [Calculo Valor Pedido](calculo_valor_pedido.md)
