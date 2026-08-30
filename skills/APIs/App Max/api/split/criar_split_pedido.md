---
title: "Criar Split de Pedido (POST /v1/orders/{orderId}/split-order)"
description: "Define a regra de divisão do valor líquido do pedido entre marketplace e um ou mais recebedores (valor fixo ou percentual)."
topics:
  - split
  - split-pedido
  - post-v1-orders-split-order
  - divisao-valores
  - marketplace
keywords:
  - POST /v1/orders/{orderId}/split-order
  - split order
  - recipient_hash
  - amount
  - percentage
  - marketplace
related:
  - ../../index_master.md
  - criar_recebedor.md
  - criar_recebedor_flexivel.md
  - facematch_link.md
source_scope:
  - https://docs.appmax.com.br/api-reference/split/criar-split-pedido
---

# Criar split de pedido

`POST /v1/orders/{orderId}/split-order`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Divide o valor líquido de um pedido entre um ou mais recebedores. Os
valores são informados em **centavos** e cada linha referencia um
`recipient_hash` previamente aprovado (`Onboarding completed`).

> **Não é permitido criar ou alterar split em pedidos com status**
>
> `aprovado`. Pedidos com split também não aceitam estorno parcial — só
> estorno total.
> **Valores e taxas**
>
> O split é limitado ao `partner_total` — valor do pedido menos as taxas
> da Appmax. A taxa é descontada automaticamente do marketplace; **não
> envie taxa no payload**. Se a soma ultrapassar o `partner_total`, a
> divisão é proporcional e o último recebedor recebe apenas o residual,
> **sem retorno de erro**.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `orderId` | integer | sim | ID do pedido na Appmax. |

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `split` | array<SplitItem> | sim |  |
| `split[].amount` | integer | sim | Valor destinado ao recebedor em **centavos**. |
| `split[].recipient_hash` | string | sim | Hash do recebedor previamente aprovado. |

### Exemplo de requisição

```json
{
  "split": [
    {
      "amount": 1000,
      "recipient_hash": "d9bd0dae-3274-5e5a-939f-f50d867eb652"
    },
    {
      "amount": 500,
      "recipient_hash": "d9bd0dae-3274-5e5a-939f-f50d867eb653"
    }
  ]
}
```

## Respostas

### 201

Split criado com sucesso.

```json
{
  "message": "Split order created successfully"
}
```

### 422

Erro de validação dos itens do split.

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Recebedor](criar_recebedor.md)
- [Criar Recebedor Flexivel](criar_recebedor_flexivel.md)
- [Facematch Link](facematch_link.md)
