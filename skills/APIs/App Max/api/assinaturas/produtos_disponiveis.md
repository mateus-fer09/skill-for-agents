---
title: "Listar Produtos Disponíveis (GET /v1/subscriptions/{id}/available-products)"
description: "Lista itens e planos do catálogo que podem ser vinculados ou adicionados à assinatura."
topics:
  - assinaturas
  - produtos-disponiveis
  - get-v1-subscriptions-available-products
keywords:
  - GET /v1/subscriptions/{id}/available-products
  - produtos disponiveis
  - cross-sell
  - upgrade
related:
  - ../../index_master.md
  - ../produtos/listar_produtos.md
  - ../produtos/consultar_produto.md
  - ../produtos/criar_produto.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/produtos-disponiveis
---

# Listar produtos disponíveis

`GET /v1/subscriptions/{id}/available-products`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Lista os produtos que ainda não estão na assinatura e podem ser
adicionados a ela, já filtrados pela periodicidade da assinatura.

O formato de cada item depende da origem da assinatura:

- **Assinaturas de produtos Shopify** — um item por produto, com a lista
  de `variants` compatíveis com a cadência da assinatura. `q` é
  obrigatório na prática: sem termo de busca a resposta vem vazia.
- **Assinaturas de produtos internos da Appmax** — lista simples de
  produtos ativos da loja (`product_id`, `name`, `price`, `sku`), até 30
  itens. Sem `q`, retorna os primeiros produtos em ordem alfabética.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador da assinatura. |

## Parâmetros de Consulta

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `q` | string | não | Termo de busca por nome ou SKU do produto. Para assinaturas Shopify, sem este parâmetro a resposta vem vazia. |

## Respostas

### 200

Produtos disponíveis retornados com sucesso.

```json
{
  "data": {
    "products": [
      {
        "shopify_product_id": "123",
        "title": "Camiseta Branca",
        "variants": [
          {
            "shopify_variant_id": "456",
            "title": "Mensal",
            "price": "189.90",
            "sku": "SKU-2",
            "interval": "month",
            "interval_count": 1
          }
        ]
      }
    ]
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

Erro ao listar os produtos disponíveis.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Produtos](../produtos/listar_produtos.md)
- [Consultar Produto](../produtos/consultar_produto.md)
- [Criar Produto](../produtos/criar_produto.md)
