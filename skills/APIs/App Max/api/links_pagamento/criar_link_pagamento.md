---
title: "Criar Link de Pagamento (POST /v1/payment-link)"
description: "Gera um link de pagamento hospedado na infraestrutura Appmax com produtos, configurações e prazo de expiração."
topics:
  - links-pagamento
  - checkout-hospedado
  - post-v1-payment-link
keywords:
  - POST /v1/payment-link
  - link de pagamento
  - payment link
  - checkout hospedado
  - url de checkout
related:
  - ../../index_master.md
  - consultar_link_pagamento.md
source_scope:
  - https://docs.appmax.com.br/api-reference/payment-links/criar-link-pagamento
---

# Criar um link de pagamento

`POST /v1/payment-link`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cria um novo link de pagamento. A resposta traz o `checkout_url` — a URL
hospedada pela Appmax que você compartilha com o comprador para que ele
finalize o pagamento.

A requisição deve conter um token Bearer do **merchant**, obtido no
fluxo de autenticação. Veja
[Autenticação](../../primeiros_passos/autenticacao.md).

> **O campo `value` é informado em **centavos** e o mínimo aceito é `500`**
>
> (R$ 5,00).
O campo `fee_transfer_from_installment` define a partir de qual parcela
o custo do parcelamento é repassado ao comprador. Com o valor `0`
(default), o custo é absorvido pelo merchant em todas as parcelas.

O campo `document` é opcional. Quando informado, deve conter um CPF ou
CNPJ válido e o merchant deve possuir vínculo com a empresa do
documento informado.

> **Comportamento padrão do documento**
>
> Quando já existe um link de pagamento criado e vinculado a uma empresa,
> a última empresa utilizada na criação de um link passa a ser o padrão.
> Portanto, ao criar um novo link **sem informar o campo `document`**, o
> sistema continuará criando o link vinculado à última empresa utilizada,
> mesmo que uma nova empresa tenha sido cadastrada posteriormente. Para
> garantir que o link seja vinculado a uma empresa específica, informe o
> `document` correspondente no payload.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | sim | Nome do link de pagamento. |
| `value` | integer | sim | Valor do link em **centavos**. Mínimo `500`. |
| `description` | string | sim | Descrição do link de pagamento. |
| `product_type` | enum: physical \| digital | não | Tipo do produto. |
| `document` | string | não | CPF ou CNPJ vinculado ao link de pagamento. Quando informado, deve ser um documento válido e o merchant precisa possuir vínculo com a empresa deste documento. |
| `payments` | array<string> | sim | Métodos de pagamento habilitados no link. |
| `max_installments` | integer | sim | Número máximo de parcelas. |
| `fee_transfer_from_installment` | integer | sim | Parcela a partir da qual o custo do parcelamento é absorvido/repassado. Com `0`, o custo é absorvido pelo merchant. |
| `allow_multiple_sales` | boolean | não | Indica se o link de pagamento permite alterar a quantidade de produtos a ser vendidos no carrinho. Quando `true`, permite editar a quantidade; quando `false`, é desativado. Por padrão, o valor é `true`; caso o dado não seja enviado, o link permanecerá com a opção ativa. |

## Respostas

### 201

Link de pagamento criado com sucesso.

### 400

Requisição inválida.

### 401

Não autorizado.

### 403

Usuário bloqueado para criar links de pagamento.

### 404

Empresa do documento não encontrada ou não vinculada ao merchant.

### 422

Erro na validação dos dados ou erro de negócio ao processar a criação.

```json
{
  "errors": {
    "message": {
      "name": [
        "O campo name é obrigatório."
      ],
      "value": [
        "O campo value é obrigatório."
      ],
      "description": [
        "O campo description é obrigatório."
      ],
      "payments": [
        "O campo payments é obrigatório."
      ]
    }
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Consultar Link Pagamento](consultar_link_pagamento.md)
