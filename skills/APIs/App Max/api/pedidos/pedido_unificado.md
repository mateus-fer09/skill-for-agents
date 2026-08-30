---
title: "Criar Pedido Unificado (POST /v1/orders/unified-order)"
description: "Endpoint completo para criação atômica de cliente, pedido e processamento de pagamento em uma única requisição."
topics:
  - pedidos
  - pedido-unificado
  - checkout-transparente
  - atomic-order
  - post-v1-orders-unified
keywords:
  - POST /v1/orders/unified-order
  - unified order
  - customer
  - order
  - payment
  - 1-step checkout
related:
  - ../../index_master.md
  - criar_pedido.md
  - consultar_pedido.md
  - calculo_valor_pedido.md
source_scope:
  - https://docs.appmax.com.br/api-reference/orders/pedido-unificado
---

[ [[**Referência][**Playground]][[[[[[[[]

# [Criar um pedido unificado]

] [

```bash
POST/v1/orders/unified-order
```

][

Permite criar pedidos completos em uma única requisição, centralizando
dados do cliente, produtos, frete, pagamentos e split de pagamentos.

**Responsabilidade da rota**

- Receber payloads de pedido em formato unificado
- Criar o cliente automaticamente quando *customer_id* não for informado
- Criar a configuração de *split de pagamentos*
- Validar estrutura e regras de negócio
- Normalizar os dados para o modelo aceito pela Appmax
- Encaminhar o pedido para o fluxo de cobrança

**Métodos de pagamento suportados**

| Método | Regras principais |
| --- | --- |
| Cartão de crédito | Exige token ou objeto card completo |
| Pix | Exige document_number |
| Boleto | Exige document_number |

][[

## [Autorizações]

[ [bearerAuth

Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as
credenciais do merchant (não do app). Veja
[Autenticação](../../primeiros_passos/autenticacao.md).

TipoHTTP (bearer)  [   ] ] ]]][ ][[

## [Corpo da Requisição]

application/json[[[[[[Esquema]][[[Pedido com Boleto]][[Pedido com Pix]][[Pedido com Cartão de Crédito]][[Pedido com Token de Cartão de Crédito]][[Pedido com Boleto e Customer ID]][[JSON]]]]]v-if[[[ 

```json
JSON{  "customer": {    "name": "Vegeta Príncipe",    "email": "[email protected]",    "phones": {      "mobile_phone": {        "area_code": "11",        "number": "988887777"      }    }  },  "ip": "1.2.3.4",  "items": [    {      "amount": 2000,      "description": "Chaveiro do Caneta",      "quantity": 2,      "code": "sku910"    }  ],  "shipping": {    "address": {      "line_1": "Rua do Rei Vegeta, 999, Distrito Real",      "line_2": "Palácio de Vegeta, Sala do Trono",      "zip_code": "90265",      "city": "Cidade Vegeta",      "state": "BA"    },    "amount": 1000  },  "payments": [    {      "boleto": {        "document_number": "19100000000"      },      "payment_method": "boleto",      "split": [        {          "amount": 1200,          "recipient_id": "72ccc884-edb6-5699-9eee-51ab34165e14",          "refund_charge_percentage": 0        }      ]    }  ]}
```

]]v-ifv-ifv-ifv-ifv-if]]]]][[[[

## [Respostas]

[[[v-if[[[201]][[500]]]] ]][[[

201

[[Content-Type]]application/json[[[[[[Esquema]][[[Boleto]][[JSON]]]]]v-if[[[ 

```json
JSON{  "data": {    "order_id": 48523,    "payment": {      "cashback": 0,      "pay_reference": "tran_jkl345mno678",      "boleto_expiration_date": "2026-06-27",      "boleto_digitable_line": "23793.38128 60000.000003 00000.000400 1 92570000010000",      "boleto_payment_code": "23793.38128 60000.000003 00000.000400 1 92570000010000",      "boleto_link_pdf": "https://api.example.com/boleto/tran_jkl345mno678.pdf"    }  }}
```

]]v-if]]]]]v-if]]]]][

```bash
POST/v1/orders/unified-order
```

][][

## [Exemplos]

 ] []]]]]][[[[Sandbox`https://api.sandboxappmax.com.br`] []  Authorization (Bearer)[[]] Cole uma vez e use em todos os playgrounds — o token fica salvo somente nesta aba do navegador e é apagado quando ela for fechada. Corpo  

```
{
  "customer": {
    "name": "Vegeta Príncipe",
    "email": "[email protected]",
    "phones": {
      "mobile_phone": {
        "area_code": "11",
        "number": "988887777"
      }
    }
  },
  "ip": "1.2.3.4",
  "items": [
    {
      "amount": 2000,
      "description": "Chaveiro do Caneta",
      "quantity": 2,
      "code": "sku910"
    }
  ],
  "shipping": {
    "address": {
      "line_1": "Rua do Rei Vegeta, 999, Distrito Real",
      "line_2": "Palácio de Vegeta, Sala do Trono",
      "zip_code": "90265",
      "city": "Cidade Vegeta",
      "state": "BA"
    },
    "amount": 1000
  },
  "payments": [
    {
      "boleto": {
        "document_number": "19100000000"
      },
      "payment_method": "boleto",
      "split": [
        {
          "amount": 1200,
          "recipient_id": "72ccc884-edb6-5699-9eee-51ab34165e14",
          "refund_charge_percentage": 0
        }
      ]
    }
  ]
}
```

[[[]Editar ][[]Copiar ]Duplo clique no JSON para editar][[]Testar ] ]]]]]

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Pedido](criar_pedido.md)
- [Consultar Pedido](consultar_pedido.md)
- [Calculo Valor Pedido](calculo_valor_pedido.md)
