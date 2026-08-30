---
title: "Alterar Periodicidade (PATCH /v1/subscriptions/{id}/frequency)"
description: "Altera o ciclo de cobrança (mensal, trimestral, anual) e recalcula as próximas faturas."
topics:
  - assinaturas
  - periodicidade
  - frequencia
  - patch-v1-subscriptions-frequency
keywords:
  - PATCH /v1/subscriptions/{id}/frequency
  - periodicidade
  - frequency
  - interval
  - recalculo ciclo
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - consultar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/alterar-periodicidade
---

# Alterar periodicidade

`PATCH /v1/subscriptions/{id}/frequency`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Altera a periodicidade (`interval` + `interval_count`) da assinatura e
recalcula `next_charge_at`. Retorna o detalhe atualizado da assinatura.

A periodicidade enviada precisa ser oferecida pelo produto da assinatura.
Para assinaturas de produtos Shopify, isso significa existir uma variante de
assinatura naquela cadência; caso contrário a troca é recusada com `422`.

> **Quando a troca é recusada**
>
> - assinatura não está ativa ou está pausada;
> - a periodicidade enviada é igual à atual;
> - já existe uma cobrança em processamento (`409`);
> - a próxima cobrança está dentro da janela do agendador (`409`).

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
| `interval` | enum: week \| month \| year | sim | Novo intervalo de recorrência. |
| `interval_count` | integer | sim | Quantidade de intervalos entre cobranças. |

### Exemplo de requisição

```json
{
  "interval": "month",
  "interval_count": 2
}
```

## Respostas

### 200

Periodicidade alterada. Retorna o detalhe atualizado.

```json
{
  "data": {
    "subscription_id": 10,
    "status": "ACTIVE",
    "interval": "month",
    "interval_count": 2,
    "next_charge_at": "2026-10-15 00:00:00"
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

### 409

Existe uma cobrança em processamento ou a próxima cobrança já entrou
na janela do agendador.

```json
{
  "errors": {
    "message": "charge_in_scheduler_window"
  }
}
```

### 422

Periodicidade indisponível para o produto, igual à atual, assinatura
inativa/pausada ou campos inválidos.

```json
{
  "errors": {
    "message": "frequency_not_available_for_product"
  }
}
```

### 500

Erro ao alterar a periodicidade da assinatura.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
