---
title: "Guia de Cálculo de Parcelas e Taxas"
description: "Explicação detalhada das regras de parcelamento com ou sem juros, repasse de taxas e configuração na Appmax."
topics:
  - parcelas
  - juros
  - taxas
  - regras-parcelamento
keywords:
  - calculo parcelas
  - juros merchant
  - juros comprador
  - tabela de parcelas
  - coeficiente
related:
  - ../index_master.md
  - webhooks.md
  - rate_limit.md
  - recuperacao_vendas_ia.md
source_scope:
  - https://docs.appmax.com.br/guides/calculo-parcelas
---

# Cálculo de parcelas

## Modalidades de parcelamento

A Appmax suporta duas modalidades de cálculo de parcelas, configuráveis de 1 a 12 parcelas por merchant.

### PP - Simples por parcela

A taxa de juros é aplicada diretamente sobre o valor de cada parcela. O custo adicional e somado ao valor base da parcela, proporcionando uma visualização clara do valor final a ser pago em cada mês.

Esta é a modalidade mais utilizada.

### AM - Financiamento

A taxa de juros é calculada mensalmente sobre o saldo devedor total. O valor das parcelas varia, considerando a aplicação de juros sobre o saldo total a cada mês.

Configurada em situações específicas, mas igualmente relevante.

> **É imprescindível consultar a rota de parcelas para garantir que os valores dos pedidos sejam processados de forma consistente em ambos os sistemas, utilizando a mesma taxa. O sistema não faz o cálculo dos juros automaticamente.**
>
>
## Consultar parcelas via API

Consulte a rota `POST /v1/payments/installments` para obter os valores com as taxas de parcelamento configuradas na Appmax.

```bash
curl --request POST \
     --url https://api.appmax.com.br/v1/payments/installments \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '{
  "installments": 10,
  "total_value": 10000,
  "settings": true
}'
```

> **A rota retorna o valor total com os juros aplicados em cada modalidade. A integração deve realizar a divisão para obter o valor exato de cada parcela.**
>
>
Veja a documentação completa em [Cálculo de parcelas via API](../api/pagamentos/parcelas.md).

## Veja Também

- [Index Master](../index_master.md)
- [Webhooks](webhooks.md)
- [Rate Limit](rate_limit.md)
- [Recuperacao Vendas Ia](recuperacao_vendas_ia.md)
