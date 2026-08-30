---
title: "Consultar Produto por ID (GET /v1/products/{id})"
description: "Obtém todos os detalhes cadastrais e variações de um produto específico através do seu ID."
topics:
  - produtos
  - detalhes-produto
  - get-v1-products-id
keywords:
  - GET /v1/products/{id}
  - consultar produto
  - variacoes
  - preco
  - estoque
  - sku
related:
  - ../../index_master.md
  - listar_produtos.md
  - criar_produto.md
  - atualizar_produto.md
source_scope:
  - https://docs.appmax.com.br/api-reference/products/consultar-produto
---

# Consultar um produto

`GET /v1/products/{id}`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Retorna um produto específico do merchant pelo identificador (`id`).
Produtos de outra company são tratados como inexistentes (`404`).

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador único do produto. |

## Respostas

### 200

Produto retornado com sucesso.

```json
{
  "data": {
    "id": 10,
    "sku": "SKU-1",
    "name": "Camiseta Preta",
    "price": 199.9,
    "description": "Camiseta 100% algodão",
    "image": "/uploads/a.png",
    "inventory": 5,
    "cost": 50,
    "is_active": true,
    "created_at": "2026-07-01 10:00:00",
    "updated_at": "2026-07-02 12:00:00"
  }
}
```

### 404

Produto inexistente ou de outra company.

```json
{
  "errors": {
    "message": "Produto não encontrado."
  }
}
```

### 500

Erro ao buscar o produto.

```json
{
  "errors": {
    "message": "Erro ao buscar o produto."
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Produtos](listar_produtos.md)
- [Criar Produto](criar_produto.md)
- [Atualizar Produto](atualizar_produto.md)
