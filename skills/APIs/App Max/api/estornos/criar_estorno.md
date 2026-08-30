---
title: "Criar Estorno (POST /v1/orders/refund-request)"
description: "Solicita o estorno total ou parcial de um pedido aprovado na plataforma Appmax."
topics:
  - estornos
  - reembolso
  - refund
  - post-v1-orders-refund-request
keywords:
  - POST /v1/orders/refund-request
  - estorno
  - refund
  - reembolso
  - estorno parcial
  - estorno total
related:
  - ../../index_master.md
source_scope:
  - https://docs.appmax.com.br/api-reference/refunds/criar-estorno
---

# Criar um estorno

`POST /v1/orders/refund-request`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cria uma solicitação de estorno (total ou parcial) para um pedido.

Para **boleto**, é necessário informar os dados bancários do cliente na
Appmax para que o valor seja ressarcido.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `order_id` | integer | sim | ID do pedido. |
| `type` | enum: total \| partial | sim | Tipo de reembolso. Padrão: `total`. |
| `value` | integer | não | Valor do reembolso em **centavos**. Obrigatório quando `type = partial`. |

### Exemplo de requisição

```json
{
  "order_id": 1,
  "type": "total"
}
```

## Respostas

### 201

Estorno aceito.

```json
{
  "data": {
    "message": "Refund request accepted"
  }
}
```

### 400

Erro de validação ou regra de negócio.

### 404

Pedido não encontrado.

### 500

Erro interno ao processar o estorno.

## Veja Também

- [Index Master](../../index_master.md)
