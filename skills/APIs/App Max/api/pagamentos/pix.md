---
title: "Pagamento via Pix (POST /v1/payments/pix)"
description: "Geração instantânea de QR Code dinâmico e código Copia e Cola (EMV) para pagamentos via Pix com confirmação imediata."
topics:
  - pagamentos
  - pix
  - qr-code
  - copia-e-cola
  - post-v1-payments-pix
keywords:
  - POST /v1/payments/pix
  - pix
  - qr_code
  - emv
  - copia e cola
  - expiracao pix
related:
  - ../../index_master.md
  - visao_geral.md
  - cartao_credito.md
  - boleto.md
source_scope:
  - https://docs.appmax.com.br/api-reference/payments/pix
---

# Pagamento via Pix

`POST /v1/payments/pix`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Gera as instruções de pagamento via Pix para um pedido existente:
QR Code (imagem base64) e código EMV (copia-e-cola).

> **Exiba um cronômetro de expiração**
>
> Na página de sucesso, mostre o QR Code, o copia-e-cola e um cronômetro
> com o tempo restante até `pix_expiration_date`. Calcule a contagem
> regressiva **dinamicamente a partir desse campo** — não fixe um tempo
> de expiração no seu código, pois esse valor pode variar.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `order_id` | integer | sim | ID do pedido. |
| `payment_data` | object | não |  |
| `payment_data.pix` | object | não |  |
| `payment_data.pix.document_number` | string | não | CPF ou CNPJ do pagador. |
| `payment_data.subscription` | object | não | **Pendente de especificação.** Placeholder criado só para destravar a resolução de `$ref` no restante da spec — o formato real de `payment_data.subscription` ainda não foi documentado. Antes de usar em produção, substituir pelos campos reais (ex.: os mesmos de `CreateSubscriptionRequest`, sem `order_id`, ou outro formato a confirmar com o time responsável). |

### Exemplo de requisição

```json
{
  "order_id": 113,
  "payment_data": {
    "pix": {
      "document_number": "19100000000"
    }
  }
}
```

## Respostas

### 200

Instruções Pix retornadas. Os campos `pix_qrcode` (PNG em base64,
sem prefixo `data:`), `pix_emv` (BR Code copia-e-cola) e
`pix_expiration_date` (data/hora de expiração do Pix, formato
`Y-m-d H:i:s`) vivem em `data.payment`. Exiba o QR Code e o
copia-e-cola ao cliente.

```json
{
  "data": {
    "payment": {
      "cashback": 0,
      "pay_reference": "115063889f2f0f1e51428104d1b542f8299",
      "pix_qrcode": "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD...",
      "pix_emv": "00020101021226850014br.gov.bcb.pix2563qrcodepix.bb.com.br/pix/v2/fab6ead0-131f-46b6-aa19-d17be75b00535204000...",
      "pix_expiration_date": "2026-05-21 05:34:30"
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
- [Boleto](boleto.md)
