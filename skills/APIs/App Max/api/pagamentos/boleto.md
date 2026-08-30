---
title: "Pagamento via Boleto Bancário (POST /v1/payments/boleto)"
description: "Emissão de boleto bancário vinculado a um pedido, linha digitável, código de barras e link em PDF."
topics:
  - pagamentos
  - boleto
  - linha-digitavel
  - pdf-boleto
  - post-v1-payments-boleto
keywords:
  - POST /v1/payments/boleto
  - boleto bancario
  - linha digitavel
  - pdf
  - codigo de barras
  - vencimento
related:
  - ../../index_master.md
  - visao_geral.md
  - cartao_credito.md
  - pix.md
source_scope:
  - https://docs.appmax.com.br/api-reference/payments/boleto
---

# Pagamento via boleto

`POST /v1/payments/boleto`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Cria um boleto bancário vinculado a um pedido existente. Retorna o link
do PDF e a linha digitável.

O boleto é uma opção de pagamento **offline**: o cliente paga em um
banco, lotérica ou pelo internet banking, fora do seu checkout.

> **Exiba o boleto na página de sucesso**
>
> Mostre a opção de baixar o PDF (`pdf_url`) e de copiar a linha
> digitável (`digitable_line`) na página de sucesso, para que o cliente
> possa efetuar o pagamento pelo canal de sua preferência.
> **Não abra o PDF em iframe**
>
> O download do boleto (`pdf_url`) deve **redirecionar o cliente para
> outra página**, e não ser aberto embutido em um iframe na sua página
> de checkout/sucesso.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `order_id` | integer | sim | ID do pedido. |
| `payment_data` | object | sim |  |
| `payment_data.boleto` | object | sim |  |
| `payment_data.boleto.document_number` | string | sim | CPF ou CNPJ do pagador. |

### Exemplo de requisição

```json
{
  "order_id": 113,
  "payment_data": {
    "boleto": {
      "document_number": "19100000000"
    }
  }
}
```

## Respostas

### 201

Boleto gerado com sucesso.

```json
{
  "data": {
    "order": {
      "id": 113,
      "status": "pendente"
    },
    "boleto": {
      "pdf_url": "https://boleto.appmax.com.br/pdf/abc123...",
      "digitable_line": "23793.38128 60000.000003 00000.000400 1 84340000012300",
      "due_date": "2025-03-22"
    }
  }
}
```

### 404

Pedido não encontrado ou já pago.

## Veja Também

- [Index Master](../../index_master.md)
- [Visao Geral](visao_geral.md)
- [Cartao Credito](cartao_credito.md)
- [Pix](pix.md)
