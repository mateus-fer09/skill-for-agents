---
title: "Exemplo Prático de Pagamento Parcelado"
description: "Código passo a passo para consulta de parcelas com juros e submissão de transação parcelada no cartão."
topics:
  - exemplos
  - pagamento-parcelado
  - calculo-juros
  - cartao-credito
keywords:
  - exemplo parcelamento
  - consulta parcelas
  - simulacao juros
  - cartao parcelado
  - codigo funcional
related:
  - ../index_master.md
  - integracao_completa.md
source_scope:
  - https://docs.appmax.com.br/guides/exemplo-parcelamento
---

# Pagamento parcelado

Este exemplo mostra como implementar um fluxo de parcelamento completo: consultar as taxas, exibir as opções ao cliente e processar o pagamento com o valor correto.

> **Os exemplos usam URLs de sandbox. Para produção, substitua `sandboxappmax` por `appmax`.**
>
>
## Cenário

Um cliente quer comprar um produto de **R$ 200,00** e parcelar em **3x**. Você precisa:
1. Consultar as taxas de parcelamento do merchant
2. Exibir as opções ao cliente
3. Ajustar o valor do pedido com os juros
4. Processar o pagamento

## Pré-requisitos

Este exemplo assume que você já tem:
- Token de autenticação válido ([como obter](../primeiros_passos/autenticacao.md))
- `customer_id` do cliente ([como criar](../api/clientes/criar_atualizar_cliente.md))

---

## 1. Consultar as opções de parcelamento

Envie o valor total do pedido (em centavos) para obter os valores com juros:

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/payments/installments \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "installments": 12,
  "total_value": 20000,
  "settings": true
}'
```

```json
{
  "data": {
    "installments": {
      "1":  { "total": 20000 },
      "2":  { "total": 20400 },
      "3":  { "total": 20812 },
      "4":  { "total": 21228 },
      "5":  { "total": 21648 },
      "6":  { "total": 22072 },
      "7":  { "total": 22500 },
      "8":  { "total": 22932 },
      "9":  { "total": 23368 },
      "10": { "total": 23808 },
      "11": { "total": 24252 },
      "12": { "total": 24700 }
    },
    "settings": {
      "modality": "PP",
      "max_installments": 12,
      "min_installment_value": 500
    }
  }
}
```

## 2. Exibir as opções ao cliente

No seu front-end, calcule o valor de cada parcela dividindo `total` pelo número de parcelas:

```javascript
const installments = response.data.installments;
const options = Object.entries(installments).map(([n, { total }]) => ({
  parcelas: Number(n),
  valorParcela: total / Number(n),
  valorTotal: total,
  temJuros: total > 20000
}));

// Resultado:
// 1x de R$ 200,00 (sem juros)
// 2x de R$ 102,00 (total R$ 204,00)
// 3x de R$ 69,37  (total R$ 208,12)
// ...
```

Exiba para o cliente — experimente mudar o valor e selecionar uma parcela abaixo:

> Ferramenta interativa disponível na versão web desta página.

> **O componente acima é interativo e usa valores ilustrativos baseados no exemplo acima. Em produção, consulte `POST /v1/payments/installments` para obter os valores oficiais configurados pela Appmax.**
>
>
## 3. Criar o pedido com o valor ajustado

O cliente escolheu **3x**. O valor total com juros é **R$ 208,12** (`20812` centavos). Distribua os juros nos produtos:

> **O sistema **não calcula juros automaticamente**. Você deve enviar o valor já com juros incluídos, seja em `unit_value` dos produtos ou em `products_value`.**
>
>
**Opção A — Ajustar via `products_value`** (mais simples):

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/orders \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "customer_id": 2023,
  "products_value": 20812,
  "products": [
    {
      "sku": "CURSO-001",
      "name": "Curso de culinária",
      "quantity": 1,
      "type": "digital"
    }
  ]
}'
```

**Opção B — Ajustar via `unit_value`** (quando há vários produtos):

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/orders \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "customer_id": 2023,
  "products": [
    {
      "sku": "CURSO-001",
      "name": "Curso de culinária",
      "quantity": 1,
      "unit_value": 20812,
      "type": "digital"
    }
  ]
}'
```

Resposta:

```json
{
  "data": {
    "order": {
      "id": 4001,
      "status": "pendente"
    }
  }
}
```

## 4. Processar o pagamento parcelado

Envie o pagamento informando o número de parcelas:

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/payments/credit-card \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "order_id": 4001,
  "customer_id": 2023,
  "payment_data": {
    "credit_card": {
      "token": "422146c7523a46119d6073ea56193913",
      "holder_document_number": "25226493029",
      "holder_name": "Junior Almeida",
      "installments": 3,
      "soft_descriptor": "MINHALOJA"
    }
  }
}'
```

```json
{
  "data": {
    "order": {
      "id": 4001,
      "status": "autorizado"
    },
    "payment": {
      "method": "creditcard",
      "installments": 3,
      "paid_at": "2025-03-15 14:30:00"
    }
  }
}
```

Na fatura do cliente aparecerá: **3x de R$ 69,37** no cartão.

## 5. Verificar o resultado

Consulte o pedido para ver o detalhamento dos valores:

```bash
curl --request GET \
     --url https://api.sandboxappmax.com.br/v1/orders/4001 \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json'
```

```json
{
  "data": {
    "order": {
      "id": 4001,
      "status": "aprovado",
      "total_paid": 20812,
      "amounts": {
        "sub_total": 20000,
        "shipping_value": 0,
        "discount": 0,
        "installment_fee": 812
      }
    },
    "payment": {
      "method": "creditcard",
      "installments": 3,
      "installments_amount": 6937
    }
  }
}
```

O campo `installment_fee` mostra exatamente quanto foi cobrado de juros (R$ 8,12).

---

## Resumo

| Passo | O que fazer | Cuidado |
|-------|-------------|---------|
| Consultar parcelas | `POST /v1/payments/installments` | Envie `settings: true` para saber o máximo de parcelas |
| Exibir opções | Divida `total` pelo número de parcelas | Indique "sem juros" quando `total == valor_original` |
| Criar pedido | Envie o valor **com juros** | Use `products_value` ou ajuste cada `unit_value` |
| Pagar | Informe `installments` no pagamento | O número de parcelas deve bater com o valor enviado |

## Veja Também

- [Index Master](../index_master.md)
- [Integracao Completa](integracao_completa.md)
