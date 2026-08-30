---
title: "Pular Ciclo de Assinatura (PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/skip)"
description: "Pula uma cobrança específica agendada sem cancelar ou pausar toda a assinatura."
topics:
  - assinaturas
  - pular-ciclo
  - skip-cycle
  - patch-v1-subscriptions-cycles-skip
keywords:
  - PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/skip
  - pular ciclo
  - skip
  - adiar fatura
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - consultar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/pular-ciclo
---

# Pular ciclo

`PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/skip`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Marca um ciclo futuro para ser pulado: a assinatura segue ativa, mas
aquele ciclo não gera cobrança nem pedido — a cobrança salta para o
próximo ciclo não pulado.

`cycleIndex` é o número do ciclo (1 = primeiro ciclo de recorrência).
Só é possível pular ciclos ainda **não processados** — use
`completed_cycles` do detalhe da assinatura como referência.

Para desfazer, chame
[desfazer o skip](desfazer_skip_ciclo.md).

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

Ciclo marcado como pulado.

```json
{
  "data": {
    "cycle_index": 3,
    "status": "skipped",
    "next_charge_at": "2026-10-15 00:00:00"
  }
}
```

### 400

Ciclo já processado, fora do limite de `max_cycles` ou assinatura
que não está ativa.

```json
{
  "errors": {
    "message": "Só é possível pular ciclos que ainda não foram processados."
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

Erro ao pular o ciclo da assinatura.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
