---
title: "Listar Produtos (GET /v1/products)"
description: "Consulta paginada do catálogo de produtos do merchant com filtros por SKU, status, busca e ordenação."
topics:
  - produtos
  - catalogo
  - get-v1-products
  - paginacao
  - filtros
keywords:
  - GET /v1/products
  - produtos
  - catalogo
  - sku
  - page
  - limit
  - filter
  - order_by
related:
  - ../../index_master.md
  - consultar_produto.md
  - criar_produto.md
  - atualizar_produto.md
source_scope:
  - https://docs.appmax.com.br/api-reference/products/listar-produtos
---

# Listar produtos

`GET /v1/products`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Lista os produtos do merchant com paginação, filtro por nome/status e
ordenação. Retorna **20 itens por página**. Cada produto pertence a uma
*company*, resolvida automaticamente a partir das credenciais.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Consulta

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `page` | integer | não | Página da listagem. |
| `name` | string | não | Filtra produtos cujo nome contém o termo informado. |
| `status` | enum: active \| inactive \| all | não | Sem valor ou `active`: apenas ativos. `inactive`: apenas inativos. `all`: todos. |
| `sort_by` | enum: name \| price \| created_at | não | Campo de ordenação. |
| `sort_dir` | enum: asc \| desc | não | Direção da ordenação. |

## Respostas

### 200

Lista de produtos retornada com sucesso.

```json
{
  "data": {
    "products": [
      {
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
    ],
    "pagination": {
      "total": 1,
      "per_page": 20,
      "current_page": 1,
      "last_page": 1
    }
  }
}
```

### 422

Parâmetros de consulta inválidos.

```json
{
  "errors": {
    "message": {
      "status": [
        "The selected status is invalid."
      ]
    }
  }
}
```

### 500

Erro ao listar os produtos.

```json
{
  "errors": {
    "message": "Erro ao listar os produtos."
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Consultar Produto](consultar_produto.md)
- [Criar Produto](criar_produto.md)
- [Atualizar Produto](atualizar_produto.md)
