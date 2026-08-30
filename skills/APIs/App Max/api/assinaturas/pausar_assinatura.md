---
title: "Pausar Assinatura (PATCH /v1/subscriptions/{id}/pause)"
description: "Interrompe temporariamente os ciclos de cobrança de uma assinatura ativa sem cancelá-la."
topics:
  - assinaturas
  - pausar
  - patch-v1-subscriptions-pause
keywords:
  - PATCH /v1/subscriptions/{id}/pause
  - pausar assinatura
  - pause
  - suspender cobrancas
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - consultar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/pausar-assinatura
---

# Pausar assinatura

`PATCH /v1/subscriptions/{id}/pause`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Pausa temporariamente a assinatura. Opcionalmente informe uma data até a
qual ela permanece pausada e um motivo. Retorna o detalhe atualizado com
`status: PAUSED`.

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
| `paused_until` | string | não | Data até a qual a assinatura fica pausada. |
| `reason` | string | não | Motivo da pausa. |

### Exemplo de requisição

```json
{
  "paused_until": "2026-09-01",
  "reason": "Cliente solicitou pausa temporária"
}
```

## Respostas

### 200

Assinatura pausada. Retorna o detalhe atualizado.

```json
{
  "data": {
    "subscription_id": 10,
    "status": "PAUSED",
    "paused_from": "2026-08-04 00:00:00",
    "paused_until": "2026-09-01 00:00:00"
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

Erro ao pausar a assinatura.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
