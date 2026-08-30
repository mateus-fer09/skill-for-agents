---
title: "Atualizar Produto (PUT /v1/products/{id})"
description: "Atualiza propriedades cadastrais, estoque, preço e dimensões de um produto existente."
topics:
  - produtos
  - atualizar-produto
  - put-v1-products-id
keywords:
  - PUT /v1/products/{id}
  - atualizar produto
  - name
  - sku
  - price
  - status
related:
  - ../../index_master.md
  - listar_produtos.md
  - consultar_produto.md
  - criar_produto.md
source_scope:
  - https://docs.appmax.com.br/api-reference/products/atualizar-produto
---

# Atualizar um produto

`PUT /v1/products/{id}`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Atualiza os dados de um produto existente. Envie apenas os campos que
deseja alterar; todos são opcionais e seguem as mesmas regras da criação.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador único do produto. |

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | não |  |
| `price` | number | não |  |
| `sku` | string | não | Único por company. |
| `external_id` | string | não | Único por company. |
| `description` | string | não |  |
| `image` | string | não |  |
| `inventory` | integer | não |  |
| `cost` | number | não |  |

### Exemplo de requisição

```json
{
  "name": "Camiseta Preta Slim",
  "price": 219.9
}
```

## Respostas

### 200

Produto atualizado com sucesso.

```json
{
  "data": {
    "id": 10,
    "sku": "SKU-1",
    "name": "Camiseta Preta Slim",
    "price": 219.9,
    "description": "Camiseta 100% algodão",
    "image": "/uploads/a.png",
    "inventory": 5,
    "cost": 50,
    "is_active": true,
    "created_at": "2026-07-01 10:00:00",
    "updated_at": "2026-07-02 13:30:00"
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

### 422

Erro de validação ou `sku`/`external_id` duplicado.

```json
{
  "errors": {
    "message": "Já existe um produto com o mesmo SKU ou external_id."
  }
}
```

### 500

Erro ao atualizar o produto.

```json
{
  "errors": {
    "message": "Erro ao atualizar o produto."
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Produtos](listar_produtos.md)
- [Consultar Produto](consultar_produto.md)
- [Criar Produto](criar_produto.md)
