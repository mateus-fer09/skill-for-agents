---
title: "Criar Produto (POST /v1/products)"
description: "Cadastra um novo produto físico ou digital com preços, dimensões, SKUs e variações no catálogo do merchant."
topics:
  - produtos
  - criar-produto
  - post-v1-products
  - catalogo
keywords:
  - POST /v1/products
  - criar produto
  - name
  - sku
  - price
  - digital
  - weight
  - dimensions
related:
  - ../../index_master.md
  - listar_produtos.md
  - consultar_produto.md
  - atualizar_produto.md
source_scope:
  - https://docs.appmax.com.br/api-reference/products/criar-produto
---

# Criar um produto

`POST /v1/products`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cria um novo produto para o merchant. Os campos `name` e `price` são
obrigatórios. O produto é criado ativo (`is_active: true`).

> **Unicidade**
>
> `sku` e `external_id` devem ser únicos por company. Se já existir um
> produto com o mesmo valor, a API retorna `422`.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | sim | Nome do produto. |
| `price` | number | sim | Preço de venda. Maior ou igual a 0. |
| `sku` | string | não | Código interno do produto. Único por company. |
| `external_id` | string | não | Identificador externo do produto. Único por company. |
| `description` | string | não | Descrição livre do produto. |
| `image` | string | não | Caminho ou URL da imagem. |
| `inventory` | integer | não | Quantidade em estoque. Maior ou igual a 0. |
| `cost` | number | não | Custo do produto. Maior ou igual a 0. |

### Exemplo de requisição

```json
{
  "name": "Camiseta Preta",
  "price": 199.9,
  "sku": "SKU-1",
  "external_id": "EXT-123",
  "description": "Camiseta 100% algodão",
  "image": "/uploads/a.png",
  "inventory": 5,
  "cost": 50
}
```

## Respostas

### 201

Produto criado com sucesso.

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
    "updated_at": "2026-07-01 10:00:00"
  }
}
```

### 422

Erro de validação dos campos ou `sku`/`external_id` duplicado para a
company.

```json
{
  "errors": {
    "message": {
      "name": [
        "The name field is required."
      ],
      "price": [
        "The price field is required."
      ]
    }
  }
}
```

### 500

Erro ao criar o produto.

```json
{
  "errors": {
    "message": "Erro ao criar o produto."
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Produtos](listar_produtos.md)
- [Consultar Produto](consultar_produto.md)
- [Atualizar Produto](atualizar_produto.md)
