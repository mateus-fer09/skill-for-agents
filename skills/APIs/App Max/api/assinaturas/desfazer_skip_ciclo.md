---
title: "Desfazer Skip de Ciclo (PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/unskip)"
description: "Restaura para a fila de cobrança um ciclo que havia sido previamente pulado."
topics:
  - assinaturas
  - unskip-cycle
  - desfazer-skip
  - patch-v1-subscriptions-cycles-unskip
keywords:
  - PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/unskip
  - desfazer skip
  - unskip
  - restaurar ciclo
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - consultar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/desfazer-skip-ciclo
---

# Desfazer skip de ciclo

`PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/unskip`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Remove a marcação de "pulado" de um ciclo futuro, devolvendo-o à fila de
cobrança. O ciclo precisa estar marcado como pulado e ainda não ter sido
processado.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador da assinatura. |
| `cycleIndex` | integer | sim | Número do ciclo de recorrência (1 = primeiro ciclo após a cobrança de origem). Precisa ser maior que `completed_cycles`. |

## Respostas

### 200

Skip desfeito. O ciclo volta a ser cobrado.

```json
{
  "data": {
    "cycle_index": 3,
    "status": "unbilled",
    "next_charge_at": "2026-09-15 00:00:00"
  }
}
```

### 400

Ciclo já processado ou que não estava marcado como pulado.

```json
{
  "errors": {
    "message": "O ciclo informado não está marcado como pulado."
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

Erro ao desfazer o skip do ciclo da assinatura.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
