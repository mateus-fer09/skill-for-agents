---
title: "Regras de Cálculo do Valor do Pedido"
description: "Especificação matemática e regras da Appmax para cálculo de subtotal de itens, frete, descontos e total do pedido."
topics:
  - pedidos
  - calculo-valor
  - regras-de-negocio
  - arredondamento
  - descontos
keywords:
  - calculo do pedido
  - products total
  - shipping
  - discount
  - total amount
  - regras de validacao
related:
  - ../../index_master.md
  - criar_pedido.md
  - consultar_pedido.md
  - upsell.md
source_scope:
  - https://docs.appmax.com.br/api-reference/orders/calculo-valor
---

# Cálculo do valor total do pedido

## Regras de calculo

Existem duas formas de calcular o valor total de um pedido:

### 1. Cálculo baseado no unit_value dos produtos

Se o valor unitário (`unit_value`) de cada produto for informado, o valor total será a soma do valor de todos os produtos.

**Exemplo:** três produtos com valores de R$ 10,00, R$ 30,00 e R$ 50,00 resultam em valor total de R$ 90,00.

Caso a compra seja parcelada, os juros devem ser calculados sobre o valor total dos produtos somado ao frete (`shipping_value`).

**Exemplo:** produtos R$ 90,00 + frete R$ 15,00 = R$ 105,00. Com juros de 10% em 5x, o valor final será R$ 115,50. Esse valor ajustado deve ser distribuído entre os produtos proporcionalmente.

```bash
curl --request POST \
     --url https://api.appmax.com.br/v1/orders \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '{
  "customer_id": 113543689,
  "discount_value": 0,
  "shipping_value": 1500,
  "products": [
    {
      "sku": "46_0",
      "name": "PRODUTO_TEST_1",
      "quantity": 1,
      "unit_value": 1350
    },
    {
      "sku": "47_0",
      "name": "PRODUTO_TEST_2",
      "quantity": 1,
      "unit_value": 3350
    },
    {
      "sku": "48_0",
      "name": "PRODUTO_TEST_3",
      "quantity": 1,
      "unit_value": 5350
    }
  ]
}'
```

### 2. Cálculo baseado no products_value com juros

Se o `unit_value` de cada produto não for informado, é obrigatório passar o valor total dos produtos (`products_value`) com juros e frete já calculados.

**Exemplo:** produtos + frete = R$ 105,00. Com juros de 10%, o valor final será R$ 115,50. Esse valor deve ser informado diretamente em `products_value`.

```bash
curl --request POST \
     --url https://api.appmax.com.br/v1/orders \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '{
  "customer_id": 113543689,
  "products_value": 10050,
  "discount_value": 0,
  "shipping_value": 1500,
  "products": [
    {
      "sku": "46_0",
      "name": "PRODUTO_TEST_1",
      "quantity": 1
    },
    {
      "sku": "47_0",
      "name": "PRODUTO_TEST_2",
      "quantity": 1
    },
    {
      "sku": "48_0",
      "name": "PRODUTO_TEST_3",
      "quantity": 1
    }
  ]
}'
```

## Regras gerais

> **- Sempre envie o cálculo com os juros incluídos, seja no valor de cada produto individualmente ou no valor total dos produtos e frete.**
>
> - O sistema **nao faz o cálculo dos juros automaticamente**. O valor informado já deve estar ajustado de acordo com a forma de pagamento, os juros aplicáveis e o frete.
Para consultar os valores de parcelas com as taxas configuradas na Appmax, utilize a rota [Cálculo de parcelas](../pagamentos/parcelas.md).

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Pedido](criar_pedido.md)
- [Consultar Pedido](consultar_pedido.md)
- [Upsell](upsell.md)
