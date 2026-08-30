---
title: "Criar ou Atualizar Cliente (POST /v1/customers)"
description: "Endpoint para cadastrar ou atualizar os dados de um cliente (comprador), endereços, contatos e documentos."
topics:
  - clientes
  - customers
  - post-v1-customers
  - dados-cadastrais
  - enderecos
keywords:
  - POST /v1/customers
  - customer_id
  - firstname
  - lastname
  - email
  - telephone
  - cpf
  - cnpj
  - address
related:
  - ../../index_master.md
source_scope:
  - https://docs.appmax.com.br/api-reference/customers/criar-atualizar
---

# Criar ou atualizar cliente

`POST /v1/customers`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cria ou atualiza um cliente identificado pela combinação
`first_name + last_name + email + phone + ip`.

> **Para criar um cliente, você precisa ter feito a coleta de IP utilizando**
>
> o script [Appmax JS](../../primeiros_passos/appmax_js.md).
> **Se enviar apenas os campos obrigatórios, o cliente será registrado como**
>
> "carrinho abandonado" e pode ser atualizado depois pela mesma rota.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `first_name` | string | sim | Nome do cliente. |
| `last_name` | string | sim | Sobrenome do cliente. |
| `email` | string | sim | E-mail válido do cliente. |
| `phone` | string | sim | Telefone com DDD (máximo 11 caracteres). |
| `ip` | string | sim | IP de origem do cliente (coletado via Appmax JS). |
| `document_number` | string | não | CPF ou CNPJ do cliente. |
| `address` | object | não | Endereço do cliente. |
| `address.postcode` | string | não | CEP (apenas dígitos). |
| `address.street` | string | não | Logradouro. |
| `address.number` | string | não | Número do endereço. |
| `address.complement` | string | não | Complemento (opcional). |
| `address.district` | string | não | Bairro. |
| `address.city` | string | não | Cidade. |
| `address.state` | string | não | UF. |
| `products` | array<Product> | não | Lista de produtos vinculados ao cliente. |
| `products[].sku` | string | sim | SKU do produto. |
| `products[].name` | string | sim | Nome do produto. |
| `products[].quantity` | integer | sim | Quantidade do produto. |
| `products[].unit_value` | integer | não | Valor unitário do produto em **centavos**. Obrigatório quando `products_value` não é informado no pedido. |
| `products[].type` | enum: physical \| digital | não | Tipo do produto. |
| `tracking` | object | não | Dados de origem da visita (UTMs). |
| `cart_link` | string | não | URL do carrinho abandonado. Envie este campo para acionar a [recuperação de vendas com IA](../../guias_e_recursos/recuperacao_vendas_ia.md) (funcionalidade em fase beta). |

### Exemplo de requisição

```json
{
  "first_name": "Junior",
  "last_name": "Almeida",
  "email": "junior.almeida@email.com",
  "phone": "51983655100",
  "document_number": "25226493029",
  "address": {
    "postcode": "91520270",
    "street": "Rua Francisco Carneiro da Rocha",
    "number": "582",
    "complement": "Casa",
    "district": "Moinhos de Ventos",
    "city": "Porto Alegre",
    "state": "RS"
  },
  "ip": "127.0.0.1",
  "products": [
    {
      "sku": "9000010",
      "name": "Livro de receitas",
      "quantity": 1,
      "unit_value": 12300,
      "type": "digital"
    }
  ],
  "tracking": {
    "utm_source": "google",
    "utm_campaign": "teste"
  }
}
```

## Respostas

### 201

Cliente criado com sucesso. Guarde o `customer_id` para criar o pedido.

```json
{
  "data": {
    "customer": {
      "id": 1
    }
  }
}
```

### 422

Erro de validação dos campos do payload.

## Veja Também

- [Index Master](../../index_master.md)
