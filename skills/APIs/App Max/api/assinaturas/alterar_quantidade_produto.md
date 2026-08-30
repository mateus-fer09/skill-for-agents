---
title: "Alterar Quantidade de Produto na Assinatura (PATCH /v1/subscriptions/{id}/products/{variantId}/quantity)"
description: "Atualiza o volume de unidades de um item já existente no plano recorrente."
topics:
  - assinaturas
  - quantidade-produto
  - patch-v1-subscriptions-products-quantity
keywords:
  - PATCH /v1/subscriptions/{id}/products/{variantId}/quantity
  - alterar quantidade
  - quantity
  - volume
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - consultar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/alterar-quantidade-produto
---

# Alterar a quantidade de um produto

`PATCH /v1/subscriptions/{id}/products/{variantId}/quantity`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Altera a quantidade de um produto já presente na assinatura. Vale para os
dois tipos de assinatura — o produto é identificado na URL pelo `variantId`,
que é o `product_id` (produtos internos da Appmax) ou o `variant_id`
(produtos da Shopify) mostrado no detalhe da assinatura. Retorna o detalhe
atualizado.

> **A assinatura precisa estar "parada"**
>
> Alterar produtos só é permitido enquanto a assinatura está ativa, não
> pausada e sem cobrança em andamento. Veja os erros `409` e `422` abaixo.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador da assinatura. |
| `variantId` | string | sim | Identificador do produto dentro da assinatura, retornado no detalhe: - assinaturas de produtos Shopify → `variant_id` (o `shopify_variant_id`); - assinaturas de produtos internos da Appmax → `product_id`. |

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `quantity` | integer | sim | Nova quantidade do produto. |

### Exemplo de requisição

```json
{
  "quantity": 3
}
```

## Respostas

### 200

Quantidade atualizada. Retorna o detalhe atualizado.

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

Assinatura com cobrança em andamento ou dentro da janela do agendador.

```json
{
  "errors": {
    "message": "charge_in_scheduler_window"
  }
}
```

### 422

Erro de validação, produto ausente na assinatura ou assinatura
inativa/pausada.

```json
{
  "errors": {
    "message": {
      "quantity": [
        "The quantity field is required."
      ]
    }
  }
}
```

### 500

Erro ao atualizar quantidade do produto na assinatura.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
