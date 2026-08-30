---
title: "Total Líquido do Pedido e Consulta de Saldos"
description: "Cálculo de valores líquidos após deduções de taxas da adquirente/gateway e consulta de saldos resultantes."
topics:
  - pedidos
  - total-liquido
  - saldos
  - taxas-gateway
keywords:
  - total liquido
  - saldos
  - taxas
  - liquid value
  - net amount
  - tax deductions
related:
  - ../../index_master.md
  - criar_pedido.md
  - consultar_pedido.md
  - calculo_valor_pedido.md
source_scope:
  - https://docs.appmax.com.br/api-reference/orders/total-liquido-e-saldos
---

[ [[**Referência][**Playground]][[[[[[[[]

# [Total líquido do pedido]

] [

```bash
GET/v1/orders/total-liquid/{order_id}
```

][

Retorna o detalhamento do valor líquido de um pedido (`order_id`),
incluindo taxas, comissões e o total líquido a receber pelo produtor.

**Autenticação:** header `secret` (API Gateway).

][[

## [Autorizações]

[ [secretHeader

Autenticação via header `secret` (API Gateway).

TipoAPI Key (header: secret)  [   ] ] ]]][[

## [Parâmetros]

 

### Parâmetros de Caminho

[order_id*

ID do pedido na Appmax.

Tipointeger Obrigatório [Exemplo`3531`  ] ] ]][ ][[[[

## [Respostas]

[[[v-if[[[200]][[404]][[500]]]] ]][[[

Detalhamento do valor líquido retornado com sucesso.

[[Content-Type]]application/json[[[[[[Esquema]][[[default]][[JSON]]]]]v-if[[[ 

```json
JSON{  "data": {    "site": "Teste applink",    "currency": "BRL",    "producer": {      "name": "Produtor teste",      "total_liquid": 148.87,      "total_order": 159.9,      "interest": null,      "installment_fee": null,      "processing_fee": [        {          "key": "Taxa de processamento (6.9%)",          "value": "11.03",          "internal_name": "creditcard-processing-rate"        }      ],      "cashback": 0,      "coproducer_commission": null,      "affiliate_commission": null,      "debts": {        "cashBalance": [        ],        "cashBalanceTotal": 0,        "splitsTotal": 0      }    },    "total": 148.87,    "split_orders": null  }}
```

]]v-if]]]]]v-ifv-if]]]]][

```bash
GET/v1/orders/total-liquid/{order_id}
```

][][

## [Exemplos]

 ] []]]]]][[[[Sandbox`https://api.sandboxappmax.com.br`] [] Parâmetros da URL[`order_id`]Authorization (Bearer)[[]] Cole uma vez e use em todos os playgrounds — o token fica salvo somente nesta aba do navegador e é apagado quando ela for fechada.  [[]Testar ] ]]]]][ [[**Referência][**Playground]][[[[[[[[]

# [Consultar saldos]

] [

```bash
GET/v1/balances
```

][

Retorna os saldos financeiros da empresa autenticada, separados por tipo.

**Autenticação:** header `secret` (API Gateway).

| type | descrição |
| --- | --- |
| available | Saldo disponível para saque |
| to_release | Saldo a liberar |

][[

## [Autorizações]

[ [secretHeader

Autenticação via header `secret` (API Gateway).

TipoAPI Key (header: secret)  [   ] ] ]]][ ][ ][[[[

## [Respostas]

[[[v-if[[[200]][[404]][[500]]]] ]][[[

Saldos retornados com sucesso.

[[Content-Type]]application/json[[[[[[Esquema]][[[default]][[JSON]]]]]v-if[[[ 

```json
JSON{  "data": [    {      "type": "available",      "value": "6220.80"    },    {      "type": "to_release",      "value": "24729.89"    }  ]}
```

]]v-if]]]]]v-ifv-if]]]]][

```bash
GET/v1/balances
```

][][

## [Exemplos]

 ] []]]]]][[[[Sandbox`https://api.sandboxappmax.com.br`] []  Authorization (Bearer)[[]] Cole uma vez e use em todos os playgrounds — o token fica salvo somente nesta aba do navegador e é apagado quando ela for fechada.  [[]Testar ] ]]]]]

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Pedido](criar_pedido.md)
- [Consultar Pedido](consultar_pedido.md)
- [Calculo Valor Pedido](calculo_valor_pedido.md)
