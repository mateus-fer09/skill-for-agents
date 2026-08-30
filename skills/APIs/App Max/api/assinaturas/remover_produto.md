---
title: "Remover Produto da Assinatura (DELETE /v1/subscriptions/{id}/products/{variantId})"
description: "Remove um item do conjunto de produtos vinculados à assinatura recorrente."
topics:
  - assinaturas
  - remover-produto
  - delete-v1-subscriptions-products
keywords:
  - DELETE /v1/subscriptions/{id}/products/{variantId}
  - remover produto
  - delete item
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - consultar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/remover-produto
---

# Remover um produto

`DELETE /v1/subscriptions/{id}/products/{variantId}`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Remove um produto da assinatura. Vale para os dois tipos de assinatura — o
produto é identificado na URL pelo `variantId`, que é o `product_id`
(produtos internos da Appmax) ou o `variant_id` (produtos da Shopify)
mostrado no detalhe da assinatura. Retorna o detalhe atualizado, sem o
produto removido.

A assinatura precisa manter pelo menos um produto — para encerrá-la por
completo use [cancelar assinatura](cancelar_assinatura.md).

> **A rota é `DELETE /v1/subscriptions/{id}/products/{variantId}` — sem o**
>
> sufixo `/quantity`. Alterar produtos só é permitido enquanto a assinatura
> está ativa, não pausada e sem cobrança em andamento.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador da assinatura. |
| `variantId` | string | sim | Identificador do produto dentro da assinatura, retornado no detalhe: - assinaturas de produtos Shopify → `variant_id` (o `shopify_variant_id`); - assinaturas de produtos internos da Appmax → `product_id`. |

## Respostas

### 200

Produto removido. Retorna o detalhe atualizado.

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
    "message": "charge_in_flight"
  }
}
```

### 422

Último produto da assinatura, produto ausente na assinatura ou
assinatura inativa/pausada.

```json
{
  "errors": {
    "message": "A assinatura deve manter ao menos um produto."
  }
}
```

### 500

Erro ao remover produto da assinatura.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
