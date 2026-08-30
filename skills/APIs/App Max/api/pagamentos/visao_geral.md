---
title: "Pagamentos - Visão Geral"
description: "Visão geral dos métodos de pagamento suportados pela Appmax e pré-requisitos para processamento."
topics:
  - pagamentos
  - visao-geral
  - metodos-pagamento
  - pre-requisitos
keywords:
  - pagamentos
  - cartao de credito
  - pix
  - boleto
  - apple pay
  - gateways
related:
  - ../../index_master.md
  - cartao_credito.md
  - pix.md
  - boleto.md
source_scope:
  - https://docs.appmax.com.br/api-reference/payments/visao-geral
---

# Pagamentos — visão geral

A API da Appmax permite criar pagamentos para pedidos já existentes, usando diferentes métodos.

## Métodos disponíveis

- [Cartão de crédito](cartao_credito.md)
- [Pix](pix.md)
- [Boleto](boleto.md)
- [Apple Pay](apple_pay.md)

## Pré-requisito geral

> **Antes de criar um pagamento, você precisa ter:**
>
> - `order_id` — ID do pedido
> - `customer_id` — ID do cliente
>
> Veja como obtê-los em [Criar ou atualizar cliente](../clientes/criar_atualizar_cliente.md) e [Criar um pedido](../pedidos/criar_pedido.md).

## Veja Também

- [Index Master](../../index_master.md)
- [Cartao Credito](cartao_credito.md)
- [Pix](pix.md)
- [Boleto](boleto.md)
