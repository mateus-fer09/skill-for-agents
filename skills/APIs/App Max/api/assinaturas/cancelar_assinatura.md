---
title: "Cancelar Assinatura (PATCH /v1/subscriptions/{id}/cancel)"
description: "Encerra definitivamente o contrato e cancela todos os ciclos futuros da assinatura."
topics:
  - assinaturas
  - cancelar
  - patch-v1-subscriptions-cancel
  - churn
keywords:
  - PATCH /v1/subscriptions/{id}/cancel
  - cancelar assinatura
  - cancel
  - cancelamento definitivo
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - consultar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/cancelar-assinatura
---

# Cancelar assinatura

`PATCH /v1/subscriptions/{id}/cancel`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cancela a assinatura de forma definitiva — nenhuma nova cobrança será
gerada. Opcionalmente registre um motivo. Retorna o detalhe atualizado
com `status: CANCELLED` e `canceled_at` preenchido.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador da assinatura. |

## Corpo da requisição

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `reason` | string | não | Motivo do cancelamento. |

### Exemplo de requisição

```json
{
  "reason": "Cliente não deseja mais o produto"
}
```

## Respostas

### 200

Assinatura cancelada. Retorna o detalhe atualizado.

```json
{
  "data": {
    "subscription_id": 10,
    "status": "CANCELLED",
    "canceled_at": "2026-08-04 12:00:00"
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

Erro de validação dos campos.

### 500

Erro ao cancelar a assinatura.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
