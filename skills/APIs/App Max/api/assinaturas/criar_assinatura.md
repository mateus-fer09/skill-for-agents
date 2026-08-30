---
title: "Criar Assinatura (POST /v1/subscriptions)"
description: "Transforma um pedido aprovado em um plano de cobrança recorrente com intervalo e periodicidade customizados."
topics:
  - assinaturas
  - criar-assinatura
  - post-v1-subscriptions
  - cobranca-recorrente
keywords:
  - POST /v1/subscriptions
  - criar assinatura
  - order_id
  - frequency
  - interval
  - charge_day
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - consultar_assinatura.md
  - pausar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/criar-assinatura
---

# Criar assinatura

`POST /v1/subscriptions`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cria uma assinatura a partir de um pedido existente. O pedido informado
em `order_id` é transformado em uma cobrança recorrente.

> **Pré-requisitos do pedido**
>
> - Deve existir e pertencer à mesma loja das credenciais.
> - Forma de pagamento deve ser **cartão de crédito** ou **PIX**.
> - Status deve ser **aprovado** ou **integrado** (ou seja, já liberado pelo antifraude).
Um mesmo pedido pode originar mais de uma assinatura.

> **Pedidos originados de um checkout Shopify**
>
> Quando o pedido tem carrinho Shopify vinculado, `products` é **obrigatório** e
> cada item precisa de `shopify_product_id` **e** `shopify_variant_id` (o preço é
> lido da variante na Shopify, não do payload).
>
> - Com `interval` informado, a cadência enviada vale para todos os itens.
> - Sem `interval`, a cadência vem do plano de assinatura da variante e todos os
>   itens precisam ter a mesma frequência.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `order_id` | integer | sim | Identificador do pedido de origem, que será transformado em assinatura. |
| `interval` | enum: week \| month \| year | não | Intervalo de recorrência. |
| `interval_count` | integer | não | Quantidade de intervalos entre cobranças. |
| `max_cycles` | integer | não | Número máximo de ciclos. Sem valor = ilimitado. |
| `next_charge_at` | string | não | Data da próxima cobrança. |
| `fail_max_tries` | integer | não | Tentativas em caso de falha na cobrança. |
| `fail_interval_hours` | integer | não | Horas entre tentativas de cobrança. |
| `products` | array<object> | não | Produtos que compõem a assinatura. Informe **ou** `product_id` (produto interno da Appmax) **ou** o par `shopify_product_id` + `shopify_variant_id` (produto da Shopify). Obrigatório quando o pedido veio de um checkout Shopify — nesse caso só a forma Shopify é aceita. |
| `products[].product_id` | integer | não | Identificador do produto interno da Appmax. |
| `products[].shopify_product_id` | string | não | Identificador do produto na Shopify. Exigido junto de `shopify_variant_id`. |
| `products[].shopify_variant_id` | string | não | Identificador da variante na Shopify. O preço é lido da variante, não do payload. |
| `products[].quantity` | integer | não |  |
| `freight_value` | number | não | Valor do frete. |
| `discount` | number | não | Desconto aplicado ao valor. |

### Exemplo de requisição

```json
{
  "order_id": 12345,
  "interval": "month",
  "interval_count": 1,
  "max_cycles": 12,
  "products": [
    {
      "product_id": 55,
      "quantity": 1
    }
  ],
  "freight_value": 19.9,
  "discount": 10
}
```

## Respostas

### 201

Assinatura criada com sucesso.

```json
{
  "data": {
    "id": 10,
    "uuid": "6f1c0f1e-6a1c-4a2b-9f0e-3d5c7a9b1234",
    "status": "active",
    "subscription_status_id": 1,
    "interval": "month",
    "interval_count": 1,
    "interval_name": "Mensal",
    "charge_day": 15,
    "fail_max_tries": 3,
    "fail_interval_hours": 24,
    "max_cycles": 12,
    "completed_cycles": 0,
    "current_cycle": 1,
    "next_charge_at": "2026-08-15 00:00:00",
    "created_at": "2026-07-15 10:00:00",
    "freight_value": 19.9,
    "products": [
      {
        "name": "Camiseta Preta",
        "price": 199.9,
        "quantity": 1,
        "product_id": 55,
        "shopify_product_id": null,
        "variant_id": null,
        "sku": "SKU-1",
        "image_url": null,
        "compare_at_price": null
      }
    ],
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
    "charges": [
      {
        "cycle": 0,
        "order_id": 12345,
        "shopify_order_id": null,
        "charged_at": "15/07/2026",
        "value": 209.8,
        "status": "paid"
      }
    ],
    "panel_url": "https://assinaturas.appmax.com.br/painel/6f1c0f1e-6a1c-4a2b-9f0e-3d5c7a9b1234"
  }
}
```

### 400

Pedido inválido para virar assinatura (forma de pagamento, status,
token reutilizável ausente ou produtos inválidos).

```json
{
  "errors": {
    "message": "Apenas pedidos de cartão de crédito ou PIX podem virar assinatura."
  }
}
```

### 404

Pedido não encontrado (ou de outra loja).

```json
{
  "errors": {
    "message": "Pedido não encontrado."
  }
}
```

### 409

Conflito na seleção de produtos (o mesmo produto informado duas vezes).

```json
{
  "errors": {
    "message": "Produto duplicado na seleção."
  }
}
```

### 422

Erro de validação dos campos ou regra de negócio (produto inválido,
variante inexistente na Shopify, frequências divergentes ou desconto
que deixa o valor abaixo do mínimo).

```json
{
  "errors": {
    "message": "O desconto informado deixa o valor da assinatura abaixo do mínimo permitido."
  }
}
```

### 500

Erro ao criar a assinatura.

```json
{
  "errors": {
    "message": "Erro ao criar a assinatura."
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Consultar Assinatura](consultar_assinatura.md)
- [Pausar Assinatura](pausar_assinatura.md)
