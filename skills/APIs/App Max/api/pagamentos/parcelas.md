---
title: "Cálculo de Parcelas (POST /v1/payments/installments)"
description: "Consulta de planos de parcelamento, simulação de juros do merchant ou comprador e valores de cada parcela."
topics:
  - pagamentos
  - parcelas
  - juros
  - simulacao-parcelamento
  - installments
keywords:
  - POST /v1/payments/installments
  - parcelas
  - juros
  - taxa
  - valor_parcela
  - total_com_juros
related:
  - ../../index_master.md
  - visao_geral.md
  - cartao_credito.md
  - pix.md
source_scope:
  - https://docs.appmax.com.br/api-reference/payments/parcelas
---

# Cálculo de parcelas

`POST /v1/payments/installments`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Retorna o valor total com os juros aplicados em cada modalidade de
parcelamento. A integração deve realizar a divisão para obter o valor
de cada parcela.

> **A quantidade e os valores das parcelas podem ser personalizados de 1 a**
>
> 12 parcelas. Os valores são configuráveis individualmente para cada
> merchant.
**Modalidades**
- **PP** (Simples por parcela): a taxa de juros é aplicada diretamente sobre o valor de cada parcela.
- **AM** (Financiamento): a taxa de juros é calculada mensalmente sobre o saldo devedor total.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `installments` | integer | sim | Número de parcelas desejado. |
| `total_value` | integer | sim | Valor total do pedido em **centavos**. |
| `settings` | boolean | não | Quando `true`, retorna as configurações de parcelamento do merchant. |

### Exemplo de requisição

```json
{
  "installments": 10,
  "total_value": 10000,
  "settings": true
}
```

## Respostas

### 200

Cálculo realizado com sucesso.

```json
{
  "data": {
    "installments": {
      "1": {
        "total": 10000
      },
      "2": {
        "total": 10200
      },
      "3": {
        "total": 10404
      },
      "10": {
        "total": 11600
      }
    },
    "settings": {
      "modality": "PP",
      "max_installments": 12,
      "min_installment_value": 500
    }
  }
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Visao Geral](visao_geral.md)
- [Cartao Credito](cartao_credito.md)
- [Pix](pix.md)
