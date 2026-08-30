---
title: "Cadastrar Código de Rastreio (POST /v1/orders/shipping-tracking-code)"
description: "Vincula código de rastreamento de envio e transportadora ao pedido para notificação ao cliente e antifraude."
topics:
  - pedidos
  - rastreio
  - logistica
  - shipping-tracking-code
  - fulfillment
keywords:
  - POST /v1/orders/shipping-tracking-code
  - tracking_code
  - shipping_company
  - rastreio
  - correios
related:
  - ../../index_master.md
  - criar_pedido.md
  - consultar_pedido.md
  - calculo_valor_pedido.md
source_scope:
  - https://docs.appmax.com.br/api-reference/orders/codigo-rastreio
---

# Cadastrar código de rastreio

`POST /v1/orders/shipping-tracking-code`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cadastra um código de rastreio em um pedido criado na Appmax.

> **Para que os saques do merchant sejam aprovados, é necessário atualizar**
>
> o pedido com o código de rastreamento da entrega.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `order_id` | integer | sim | ID do pedido. |
| `shipping_tracking_code` | string | sim | Código de rastreio do pedido. |

### Exemplo de requisição

```json
{
  "order_id": 2,
  "shipping_tracking_code": "EEEASDASDAS1239A"
}
```

## Respostas

### 201

Código de rastreio incluído com sucesso.

```json
{
  "data": {
    "message": "tracking accepted"
  }
}
```

### 400

Pedido não encontrado ou falha ao armazenar o código.

### 422

Erro de validação dos campos do payload.

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Pedido](criar_pedido.md)
- [Consultar Pedido](consultar_pedido.md)
- [Calculo Valor Pedido](calculo_valor_pedido.md)
