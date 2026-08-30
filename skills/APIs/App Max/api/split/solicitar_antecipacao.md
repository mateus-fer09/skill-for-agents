---
title: "Solicitar Antecipação de Saque (POST /v1/recipient/{recipient_hash}/withdraw-request/anticipation)"
description: "Efetiva uma solicitação real de antecipação de recursos do saldo a liberar para a conta bancária."
topics:
  - split
  - antecipacao-saque
  - post-v1-withdraw-request-anticipation
keywords:
  - POST /v1/recipient/{recipient_hash}/withdraw-request/anticipation
  - antecipacao
  - saque antecipado
related:
  - ../../index_master.md
  - criar_recebedor.md
  - criar_recebedor_flexivel.md
  - facematch_link.md
source_scope:
  - https://docs.appmax.com.br/api-reference/split/antecipacao
---

# Solicitar antecipação de saque

`POST /v1/recipient/{recipient_hash}/withdraw-request/anticipation`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cria uma solicitação real de antecipação usando saldo do tipo
`to_release`. Ao contrário da simulação, este endpoint efetivamente
movimenta o saldo.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `recipient_hash` | string | sim | Hash do recebedor (retornado em `POST /v1/recipient`). |

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `value` | integer | sim | Valor do saque em **centavos** (inteiro positivo). |

### Exemplo de requisição

```json
{
  "value": 1000
}
```

## Respostas

### 201

Antecipação criada com status `2 = pending`.

```json
{
  "data": {
    "withdraw_request_id": 1,
    "status": 2,
    "value": 10000,
    "net_value": 4700,
    "withdraw_tax": 5000
  }
}
```

### 403

`Withdraw not allowed` (pode indicar `withdrawal_blocked`).

### 404

Recebedor não encontrado.

### 409

Saque em andamento para o mesmo recebedor.

### 422

Validação de input ou regra de negócio (saldo insuficiente, limite, conta inválida).

### 500

Erro interno.

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Recebedor](criar_recebedor.md)
- [Criar Recebedor Flexivel](criar_recebedor_flexivel.md)
- [Facematch Link](facematch_link.md)
