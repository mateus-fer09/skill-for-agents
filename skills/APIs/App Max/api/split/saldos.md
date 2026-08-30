---
title: "Consultar Saldos do Recebedor (GET /v1/recipient/{recipient_hash}/balances)"
description: "Retorna o saldo financeiro disponível e os saldos futuros a liberar de um recebedor de split."
topics:
  - split
  - saldos
  - balances
  - saldo-disponivel
  - saldo-a-liberar
keywords:
  - GET /v1/recipient/{recipient_hash}/balances
  - saldos
  - available_balance
  - future_balance
  - recebedor
related:
  - ../../index_master.md
  - criar_recebedor.md
  - criar_recebedor_flexivel.md
  - facematch_link.md
source_scope:
  - https://docs.appmax.com.br/api-reference/split/saldos
---

# Consultar saldos do recebedor

`GET /v1/recipient/{recipient_hash}/balances`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Retorna os saldos financeiros do recebedor. Pode haver dois tipos:
- `available` — saldo disponível para saque imediato.
- `to_release` — saldo ainda em compensação (pode ser antecipado).

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `recipient_hash` | string | sim | Hash do recebedor (retornado em `POST /v1/recipient`). |

## Respostas

### 200

Saldos retornados.

```json
{
  "data": [
    {
      "type": "available",
      "value": "150.00"
    },
    {
      "type": "to_release",
      "value": "250.00"
    }
  ]
}
```

### 404

Saldos não provisionados para esse recebedor.

### 500

Erro interno.

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Recebedor](criar_recebedor.md)
- [Criar Recebedor Flexivel](criar_recebedor_flexivel.md)
- [Facematch Link](facematch_link.md)
