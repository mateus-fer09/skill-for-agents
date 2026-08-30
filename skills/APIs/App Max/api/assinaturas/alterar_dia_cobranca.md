---
title: "Alterar Dia de Cobrança (PATCH /v1/subscriptions/{id}/charge-day)"
description: "Modifica o dia fixo do mês em que a recorrência da assinatura é cobrada."
topics:
  - assinaturas
  - dia-cobranca
  - patch-v1-subscriptions-charge-day
keywords:
  - PATCH /v1/subscriptions/{id}/charge-day
  - dia de cobranca
  - charge_day
  - vencimento
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - consultar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/alterar-dia-cobranca
---

# Alterar o dia de cobrança

`PATCH /v1/subscriptions/{id}/charge-day`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Altera o dia fixo de cobrança da assinatura. A mudança vale para todos os
ciclos futuros e a próxima data de cobrança (`next_charge_at`) é
recalculada.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador da assinatura. |

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `charge_day` | integer | sim | Dia fixo de cobrança (1 a 28). |

### Exemplo de requisição

```json
{
  "charge_day": 15
}
```

## Respostas

### 200

Dia de cobrança atualizado.

```json
{
  "data": {
    "charge_day": 15,
    "next_charge_at": "2026-08-15 00:00:00"
  }
}
```

### 404

Assinatura não encontrada.

```json
{
  "errors": {
    "message": "Assinatura não encontrada."
  }
}
```

### 422

`charge_day` fora do intervalo permitido (1 a 28).

```json
{
  "errors": {
    "message": {
      "charge_day": [
        "The charge day may not be greater than 28."
      ]
    }
  }
}
```

### 500

Erro ao alterar o dia de cobrança.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
