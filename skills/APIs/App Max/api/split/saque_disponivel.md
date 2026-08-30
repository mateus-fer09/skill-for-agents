---
title: "Solicitar Saque Disponível (POST /v1/recipient/{recipient_hash}/withdraw-request/available)"
description: "Solicita a transferência do saldo disponível do recebedor diretamente para sua conta bancária homologada."
topics:
  - split
  - saque
  - transferencia-bancaria
  - post-v1-withdraw-request-available
keywords:
  - POST /v1/recipient/{recipient_hash}/withdraw-request/available
  - saque
  - withdraw
  - transferencia bancaria
related:
  - ../../index_master.md
  - criar_recebedor.md
  - criar_recebedor_flexivel.md
  - facematch_link.md
source_scope:
  - https://docs.appmax.com.br/api-reference/split/saque-disponivel
---

# Solicitar saque com saldo disponível

`POST /v1/recipient/{recipient_hash}/withdraw-request/available`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cria uma solicitação de saque usando o saldo **available**. Sem taxa
de antecipação — o saldo já está liberado.

> **Se o recebedor tem `to_release` mas não `available`, este endpoint**
>
> retorna `Insufficient balance`. Nesse caso, use
> [antecipação](solicitar_antecipacao.md).

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

Saque criado com status `2 = pending`.

```json
{
  "data": {
    "withdraw_request_id": 1,
    "status": 2,
    "value": 0,
    "net_value": 0,
    "withdraw_tax": 0
  }
}
```

### 403

Saque não permitido.

### 404

Recebedor não encontrado.

### 409

Saque em andamento.

### 422

Validação ou regra de negócio (`Insufficient balance`, `Invalid bank account`).

### 500

Erro interno.

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Recebedor](criar_recebedor.md)
- [Criar Recebedor Flexivel](criar_recebedor_flexivel.md)
- [Facematch Link](facematch_link.md)
