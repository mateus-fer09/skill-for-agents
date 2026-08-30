---
title: "Reativar Assinatura (PATCH /v1/subscriptions/{id}/activate)"
description: "Retoma as cobranças de uma assinatura que se encontrava em estado pausado."
topics:
  - assinaturas
  - reativar
  - patch-v1-subscriptions-activate
keywords:
  - PATCH /v1/subscriptions/{id}/activate
  - reativar assinatura
  - activate
  - retomar cobranca
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - consultar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/reativar-assinatura
---

# Reativar assinatura

`PATCH /v1/subscriptions/{id}/activate`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Reativa uma assinatura pausada, retomando as cobranças recorrentes. Não
requer corpo. Retorna o detalhe atualizado com `status: ACTIVE`.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador da assinatura. |

## Respostas

### 200

Assinatura reativada. Retorna o detalhe atualizado.

```json
{
  "data": {
    "subscription_id": 10,
    "status": "ACTIVE",
    "paused_from": null,
    "paused_until": null
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

### 500

Erro ao reativar a assinatura.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
