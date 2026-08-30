---
title: "Adicionar Produtos à Assinatura (POST /v1/subscriptions/{id}/products)"
description: "Inclui novos produtos na lista de itens cobrados e enviados periodicamente pela assinatura."
topics:
  - assinaturas
  - adicionar-produtos
  - post-v1-subscriptions-products
keywords:
  - POST /v1/subscriptions/{id}/products
  - adicionar produtos
  - add items
  - addons
related:
  - ../../index_master.md
  - ../produtos/listar_produtos.md
  - ../produtos/consultar_produto.md
  - ../produtos/criar_produto.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/adicionar-produtos
---

# Adicionar produtos

`POST /v1/subscriptions/{id}/products`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Adiciona um ou mais produtos a uma assinatura existente. Retorna o detalhe
atualizado da assinatura.

Funciona para os dois tipos de assinatura, e a forma de identificar o
produto muda conforme o tipo — sempre use os identificadores devolvidos por
[produtos disponíveis](produtos_disponiveis.md):

- **Produtos internos da Appmax** → `product_id` (+ `quantity`). Nome,
  preço e SKU vêm do cadastro do produto; se enviados, são ignorados.
- **Produtos da Shopify** → `shopify_product_id` **e**
  `shopify_variant_id` (+ `quantity`). O preço é lido da variante.

> **A assinatura precisa estar "parada"**
>
> Alterar produtos só é permitido enquanto a assinatura está ativa, não
> pausada e sem cobrança em andamento. Veja os erros `409` e `422` abaixo.
> **Assinaturas sem produtos**
>
> A gestão de produtos exige uma assinatura com produtos definidos: criada
> com `products` no [criar assinatura](criar_assinatura.md)
> ou originada de um checkout Shopify. Assinaturas criadas sem `products`
> (que herdam o valor do pedido) respondem `404` aqui.

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
| `products` | array<object> | sim | Lista de produtos a adicionar. |
| `products[].product_id` | integer | não | Produto interno da Appmax. Usado em assinaturas de produtos internos. |
| `products[].shopify_product_id` | string | não | Produto na Shopify. Exigido junto de `shopify_variant_id`. |
| `products[].shopify_variant_id` | string | não | Variante na Shopify. Exigido junto de `shopify_product_id`. |
| `products[].name` | string | não | Opcional e apenas informativo — nome, preço e SKU são resolvidos do cadastro do produto (interno) ou da variante (Shopify). |
| `products[].price` | number | não |  |
| `products[].sku` | string | não |  |
| `products[].qty` | integer | não | Quantidade (alias de `quantity`). |
| `products[].quantity` | integer | não |  |

### Exemplo de requisição

```json
{
  "products": [
    {
      "product_id": 55,
      "quantity": 1
    }
  ]
}
```

## Respostas

### 200

Produtos adicionados. Retorna o detalhe atualizado.

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

Produto repetido na requisição, produto que já está na assinatura, ou
assinatura com cobrança em andamento / dentro da janela do agendador.

```json
{
  "errors": {
    "message": "Produto já está na assinatura."
  }
}
```

### 422

Erro de validação, produto inválido para a assinatura, ou assinatura
inativa/pausada.

```json
{
  "errors": {
    "message": {
      "products": [
        "The products field is required."
      ]
    }
  }
}
```

### 500

Erro ao adicionar produto à assinatura.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Produtos](../produtos/listar_produtos.md)
- [Consultar Produto](../produtos/consultar_produto.md)
- [Criar Produto](../produtos/criar_produto.md)
