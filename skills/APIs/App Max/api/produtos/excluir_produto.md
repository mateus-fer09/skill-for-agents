---
title: "Excluir Produto (DELETE /v1/products/{id})"
description: "Realiza a exclusão lógica (soft delete) de um produto no catálogo da Appmax."
topics:
  - produtos
  - excluir-produto
  - delete-v1-products-id
  - soft-delete
keywords:
  - DELETE /v1/products/{id}
  - excluir produto
  - soft delete
  - status deleted
related:
  - ../../index_master.md
  - listar_produtos.md
  - consultar_produto.md
  - criar_produto.md
source_scope:
  - https://docs.appmax.com.br/api-reference/products/excluir-produto
---

# Excluir um produto

`DELETE /v1/products/{id}`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Exclui um produto do merchant. A exclusão é feita por **soft delete**: o
produto é marcado como inativo (`is_active: false`) e continua consultável
com o filtro de status `inactive` ou `all`.

> **Bloqueio**
>
> A exclusão é bloqueada (`409`) quando o produto está vinculado a uma
> assinatura.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador único do produto. |

## Respostas

### 200

Produto excluído (soft delete) com sucesso.

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
    "is_active": false,
    "created_at": "2026-07-01 10:00:00",
    "updated_at": "2026-07-02 14:00:00"
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

### 409

Produto vinculado a uma assinatura não pode ser excluído.

```json
{
  "errors": {
    "message": "Produto vinculado a uma assinatura não pode ser excluído."
  }
}
```

### 500

Erro ao excluir o produto.

```json
{
  "errors": {
    "message": "Erro ao excluir o produto."
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Produtos](listar_produtos.md)
- [Consultar Produto](consultar_produto.md)
- [Criar Produto](criar_produto.md)
