---
title: "Criar Pedido Unificado Flexível"
description: "Variação avançada do pedido unificado para estruturas dinâmicas de catálogo, customizações e regras especiais."
topics:
  - pedidos
  - pedido-unificado-flexivel
  - carrinho-dinamico
keywords:
  - pedido unificado flexivel
  - unified order flexible
  - dynamic products
  - custom checkout
related:
  - ../../index_master.md
  - criar_pedido.md
  - consultar_pedido.md
  - calculo_valor_pedido.md
source_scope:
  - https://docs.appmax.com.br/api-reference/orders/pedido-unificado-flexivel
---

[ [[**Referência][**Playground]][[[[[[[[]

# [Criar um pedido unificado flexível]

] [

```bash
POST/v1/orders/unified-order/partner-flexible
```

][

Permite criar pedidos completos em uma única requisição, centralizando
dados do cliente, produtos, frete, pagamentos e split de pagamentos. Para
pagamentos via PIX, o customer pode ser opcional conforme configuração
interna.

**Responsabilidade da rota**

- Receber payloads de pedido em formato unificado
- Resolver a identificação do cliente:

- Utilizar customer_id quando informado
- Criar um novo cliente quando apenas customer for informado
- Em cenários de PIX com configuração habilitada, cria automaticamente um system customer (cliente com dados reaproveitados de um usuário vinculado ao site), tornando opcional customer, customer_id e document_number (pix).
- Criar a configuração de *split de pagamentos*
- Validar estrutura e regras de negócio
- Normalizar os dados para o modelo aceito pela Appmax
- Encaminhar o pedido para o fluxo de cobrança

**Métodos de pagamento suportados**

| Método | Regras principais |
| --- | --- |
| Cartão de crédito | Exige token ou objeto card completo |
| Pix | Não exige o document_number quando a configuração de customer opcional estiver habilitada. |
| Boleto | Exige document_number |

][[

## [Autorizações]

[ [bearerAuth

Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as
credenciais do merchant (não do app). Veja
[Autenticação](../../primeiros_passos/autenticacao.md).

TipoHTTP (bearer)  [   ] ] ]]][ ][[

## [Corpo da Requisição]

application/json[[[[[[Esquema]][[[Pedido com Pix sem customer e documento]][[Pedido com Pix]][[Pedido com Cartão de Crédito]][[Pedido com Token de Cartão de Crédito]][[Pedido com Boleto e Customer ID]][[Pedido com Boleto]][[JSON]]]]]v-if[[[ 

```json
JSON{  "ip": "1.2.3.4",  "items": [    {      "amount": 2000,      "description": "Chaveiro do Caneta",      "quantity": 2,      "code": "sku910"    }  ],  "payments": [    {      "payment_method": "pix",      "split": [        {          "amount": 1200,          "recipient_id": "72ccc884-edb6-5699-9eee-51ab34165e14"        }      ]    }  ]}
```

]]v-ifv-ifv-ifv-ifv-ifv-if]]]]][[[[

## [Respostas]

[[[v-if[[[201]][[500]]]] ]][[[

201

[[Content-Type]]application/json[[[[[[Esquema]][[[Boleto]][[Pix]][[JSON]]]]]v-if[[[ 

```json
JSON{  "data": {    "order_id": 48523,    "payment": {      "cashback": 0,      "pay_reference": "tran_jkl345mno678",      "boleto_expiration_date": "2026-06-27",      "boleto_digitable_line": "23793.38128 60000.000003 00000.000400 1 92570000010000",      "boleto_payment_code": "23793.38128 60000.000003 00000.000400 1 92570000010000",      "boleto_link_pdf": "https://api.example.com/boleto/tran_jkl345mno678.pdf"    }  }}
```

]]v-ifv-if]]]]]v-if]]]]][

```bash
POST/v1/orders/unified-order/partner-flexible
```

][][

## [Exemplos]

 ] []]]]]][[[[Sandbox`https://api.sandboxappmax.com.br`] []  Authorization (Bearer)[[]] Cole uma vez e use em todos os playgrounds — o token fica salvo somente nesta aba do navegador e é apagado quando ela for fechada. Corpo  

```
{
  "ip": "1.2.3.4",
  "items": [
    {
      "amount": 2000,
      "description": "Chaveiro do Caneta",
      "quantity": 2,
      "code": "sku910"
    }
  ],
  "payments": [
    {
      "payment_method": "pix",
      "split": [
        {
          "amount": 1200,
          "recipient_id": "72ccc884-edb6-5699-9eee-51ab34165e14"
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
