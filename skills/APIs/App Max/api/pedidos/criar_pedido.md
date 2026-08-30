---
title: "Criar Pedido (POST /v1/orders)"
description: "Cria um novo pedido associado a um cliente existente, com itens de produtos, frete e descontos."
topics:
  - pedidos
  - criar-pedido
  - post-v1-orders
  - carrinho
  - checkout
keywords:
  - POST /v1/orders
  - order_id
  - customer_id
  - products
  - shipping
  - discount
  - total
related:
  - ../../index_master.md
  - consultar_pedido.md
  - calculo_valor_pedido.md
  - upsell.md
source_scope:
  - https://docs.appmax.com.br/api-reference/orders/criar-pedido
---

# Criar um pedido

`POST /v1/orders`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cria um novo pedido na Appmax. Um pedido deve estar sempre vinculado a um
cliente previamente criado.

> **Pré-requisito**
>
> Para criar um pedido, você precisa ter o `customer_id` do cliente. Caso
> ainda não tenha, veja
> [Criar ou atualizar cliente](../clientes/criar_atualizar_cliente.md).
Armazene o `order_id` retornado, pois ele será necessário para efetuar o
pagamento ou consultar o status do pedido. Para entender como o valor
total é calculado, veja
[Cálculo do valor total](calculo_valor_pedido.md).

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `customer_id` | integer | sim | ID do cliente (obtido na criação do cliente). |
| `products` | array<Product> | sim | Lista de produtos do pedido. |
| `products[].sku` | string | sim | SKU do produto. |
| `products[].name` | string | sim | Nome do produto. |
| `products[].quantity` | integer | sim | Quantidade do produto. |
| `products[].unit_value` | integer | não | Valor unitário do produto em **centavos**. Obrigatório quando `products_value` não é informado no pedido. |
| `products[].type` | enum: physical \| digital | não | Tipo do produto. |
| `products_value` | integer | não | Valor total dos produtos em **centavos**. Obrigatório quando `unit_value` não é informado nos produtos. |
| `discount_value` | integer | não | Valor do desconto em **centavos**. |
| `shipping_value` | integer | não | Valor do frete em **centavos**. |

### Exemplo de requisição

```json
{
  "customer_id": 29,
  "products_value": 12300,
  "discount_value": 0,
  "shipping_value": 3999,
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

Pedido criado com sucesso. O pedido é criado com status `pendente` até que o pagamento seja processado.

```json
{
  "data": {
    "order": {
      "id": 1,
      "status": "pendente"
    }
  }
}
```

### 404

Cliente ou dados não encontrados.

```json
{
  "error": {
    "message": "Merchant not found"
  }
}
```

### 422

Erro de validação dos campos do payload.

```json
{
  "errors": {
    "message": {
      "products_value": [
        "The products value must be an integer."
      ],
      "shipping_value": [
        "The shipping value must be an integer."
      ],
      "products": [
        "The products field is required."
      ]
    }
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Consultar Pedido](consultar_pedido.md)
- [Calculo Valor Pedido](calculo_valor_pedido.md)
- [Upsell](upsell.md)
