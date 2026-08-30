---
title: "Atualizar Endereço de Entrega (PATCH /v1/subscriptions/{id}/address)"
description: "Atualiza o endereço de entrega dos produtos físicos enviados nos ciclos futuros da assinatura."
topics:
  - assinaturas
  - endereco-entrega
  - logistica-recorrente
  - patch-v1-subscriptions-address
keywords:
  - PATCH /v1/subscriptions/{id}/address
  - atualizar endereco
  - shipping address
  - entrega recorrente
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - consultar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/atualizar-endereco
---

# Atualizar o endereço de entrega

`PATCH /v1/subscriptions/{id}/address`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Atualiza o endereço de entrega associado à assinatura (dados do cliente
vinculado). Aplica-se aos próximos ciclos de cobrança.

O `postcode` é gravado apenas com dígitos (a pontuação enviada é removida)
e o `state` é gravado em maiúsculas — a resposta devolve os valores já
normalizados.

> **A alteração é feita no **cadastro do cliente**, então vale para todas as**
>
> assinaturas e pedidos futuros dele, não só para esta assinatura.

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
| `address` | object | sim |  |
| `address.postcode` | string | sim | CEP. |
| `address.street` | string | sim | Logradouro. |
| `address.number` | string | sim | Número. |
| `address.complement` | string | não | Complemento. |
| `address.district` | string | sim | Bairro. |
| `address.city` | string | sim | Cidade. |
| `address.state` | string | sim | UF (sigla de 2 letras). |

### Exemplo de requisição

```json
{
  "address": {
    "postcode": "01010-000",
    "street": "Rua São Bento",
    "number": "111",
    "complement": "Bloco 7",
    "district": "Centro",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

## Respostas

### 200

Endereço atualizado.

```json
{
  "data": {
    "address": {
      "street": "Rua São Bento",
      "number": "111",
      "complement": "Bloco 7",
      "district": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "postcode": "01010000"
    }
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

### 422

Erro de validação dos campos do endereço.

```json
{
  "errors": {
    "message": {
      "address.postcode": [
        "The address.postcode field is required."
      ]
    }
  }
}
```

### 500

Erro ao atualizar o endereço da assinatura.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
