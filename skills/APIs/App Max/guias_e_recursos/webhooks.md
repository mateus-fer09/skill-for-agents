---
title: "Webhooks da Appmax - Notificações em Tempo Real"
description: "Guia completo de webhooks: eventos disparados, payloads completos, validação de assinaturas e retentativas."
topics:
  - webhooks
  - eventos-tempo-real
  - notificacoes
  - payloads
  - seguranca
keywords:
  - webhooks
  - order_paid
  - order_refunded
  - order_cancelled
  - payload
  - retry
  - signature
related:
  - ../index_master.md
  - rate_limit.md
  - calculo_parcelas.md
  - recuperacao_vendas_ia.md
source_scope:
  - https://docs.appmax.com.br/guides/webhooks
---

# Webhooks

## Visão Geral

Webhooks da Appstore permitem que seu aplicativo receba notificações em tempo real sobre eventos que ocorrem na plataforma Appmax. Quando um evento acontece (pedido aprovado, cliente criado, assinatura cancelada, etc.), a Appmax envia uma requisição `POST` para a URL que você configurou durante a criação do app.

O payload é enviado em JSON com um envelope padrão que inclui metadados do evento e os dados específicos do recurso. Existem **4 tipos de evento** (`order`, `customer`, `payment`, `subscription`) totalizando **29 eventos** disponíveis.

> **Os webhooks da Appstore são despachados em tempo real assim que o evento ocorre na plataforma.**
>
>
## Estrutura do Payload (Envelope)

Todos os webhooks compartilham o mesmo envelope. O campo `data` varia conforme o `event_type`.

```json
{
  "event": "order_approved",
  "event_type": "order",
  "site_id": "uuid-do-site",
  "app_id": "uuid-do-app",
  "client_key": "chave-externa",
  "external_key": "chave-externa",
  "data": { },
  "partner_merchant": {
    "merchant_email": "merchant@example.com",
    "merchant_document_number": "12345678000199",
    "merchant_phone": "11999999999"
  }
}
```

| Campo                | Tipo              | Obrigatório | Descrição                                                              |
| -------------------- | ----------------- | ----------- | ---------------------------------------------------------------------- |
| `event`              | string            | Sim         | Identificador do evento (ex: `order_approved`)                         |
| `event_type`         | string            | Sim         | Tipo do evento: `order`, `customer`, `payment` ou `subscription`       |
| `site_id`            | string            | Sim         | UUID do site no qual o evento ocorreu                                  |
| `app_id`             | string            | Sim         | UUID do app que está recebendo o webhook                               |
| `client_key`         | string \| null    | Não         | Chave configurada pelo merchant para identificação externa             |
| `external_key`       | string \| null    | Não         | Chave externa associada ao recurso                                     |
| `data`               | object            | Sim         | Dados do recurso — varia conforme o `event_type`                       |
| `partner_merchant`   | object            | Sim         | Dados do merchant: `merchant_email`, `merchant_document_number`, `merchant_phone` |

## Tabela de Eventos

### Customer

| Descrição             | `event`                | `event_type` |
| --------------------- | ---------------------- | ------------ |
| Cliente criado        | `customer_created`     | `customer`   |
| Cliente interessado   | `customer_interested`  | `customer`   |
| Cliente contatado     | `customer_contacted`   | `customer`   |

### Order

| Descrição                             | `event`                           | `event_type` |
| ------------------------------------- | --------------------------------- | ------------ |
| Pedido autorizado                     | `order_authorized`                | `order`      |
| Pedido aprovado                       | `order_approved`                  | `order`      |
| Boleto criado                         | `order_billet_created`            | `order`      |
| Pedido pago                           | `order_paid`                      | `order`      |
| Pedido pendente integração            | `order_pending_integration`       | `order`      |
| Pedido estornado                      | `order_refund`                    | `order`      |
| Estorno parcial                       | `order_partial_refund`            | `order`      |
| Upsell pago                           | `order_up_sold`                   | `order`      |
| Pix gerado                            | `order_pix_created`               | `order`      |
| Pix pago                              | `order_paid_by_pix`               | `order`      |
| Pix expirado                          | `order_pix_expired`               | `order`      |
| Pedido integrado                      | `order_integrated`                | `order`      |
| Boleto vencido                        | `order_billet_overdue`            | `order`      |
| Pedido autorizado com atraso          | `order_authorized_with_delay`     | `order`      |
| Chargeback em tratamento              | `order_chargeback_in_treatment`   | `order`      |
| Chargeback vencido (favor merchant)   | `order_charge_back_gain`          | `order`      |
| Recusado por risco                    | `order_refused_by_risk`           | `order`      |
| Split de pagamento                    | `split_orders`                    | `order`      |

### Payment

| Descrição                          | `event`                          | `event_type` |
| ---------------------------------- | -------------------------------- | ------------ |
| Pagamento autorizado com atraso    | `payment_authorized_with_delay`  | `payment`    |
| Pagamento não autorizado           | `payment_not_authorized`         | `payment`    |

### Subscription

| Descrição                    | `event`                        | `event_type`   |
| ---------------------------- | ------------------------------ | -------------- |
| Assinatura criada            | `subscription_created`         | `subscription` |
| Assinatura cancelada         | `subscription_cancelation`     | `subscription` |
| Assinatura atrasada          | `subscription_delayed`         | `subscription` |
| Cobrança recorrente OK       | `subscription_charge_success`  | `subscription` |
| Cobrança recorrente falhou   | `subscription_charge_failed`   | `subscription` |

> **Os eventos essenciais para integração são os de pedido (`order_*`) e pagamento (`payment_*`).**
>
>
## Payloads por Tipo de Evento

### Order Events

O campo `data` para eventos do tipo `order` contém os seguintes campos:

| Campo                    | Tipo              | Descrição                                        |
| ------------------------ | ----------------- | ------------------------------------------------ |
| `order_id`               | int               | ID do pedido                                     |
| `status`                 | string            | Status atual do pedido                           |
| `total`                  | int               | Valor total em centavos (12300 = R$ 123,00)      |
| `freight_value`          | int               | Valor do frete em centavos                       |
| `merchant_total`         | int               | Valor líquido do merchant em centavos            |
| `merchant_affiliate_total` | int             | Valor do afiliado do merchant em centavos        |
| `discount`               | int               | Valor do desconto em centavos                    |
| `interest`               | int               | Valor de juros em centavos                       |
| `upsell_order_id`        | int \| null       | ID do pedido de upsell associado                 |
| `payment_link_id`        | int \| null       | ID do link de pagamento                          |
| `paid_at`                | string \| null    | Data/hora do pagamento                           |
| `integrated_at`          | string \| null    | Data/hora da integração                          |
| `refund_at`              | string \| null    | Data/hora do estorno                             |
| `created_at`             | string            | Data/hora de criação do pedido                   |
| `products`               | array             | Lista de produtos do pedido                      |
| `payment_info`           | object            | Informações do pagamento (varia por método)      |
| `client_key`             | string \| null    | Chave de identificação externa                   |
| `external_key`           | string \| null    | Chave externa                                    |
| `cashback_used`          | int \| null       | Cashback utilizado em centavos                   |
| `cashback_reserved`      | int \| null       | Cashback reservado em centavos                   |
| `cashback_status`        | string \| null    | Status do cashback                               |
| `notification_type`      | string            | Tipo da notificação                              |

**Campos de `products[]`:**

| Campo      | Tipo   | Descrição                |
| ---------- | ------ | ------------------------ |
| `sku`      | string | SKU do produto           |
| `name`     | string | Nome do produto          |
| `price`    | int    | Preço unitário em centavos |
| `quantity` | int    | Quantidade               |

**Campos de `payment_info`** (condicional por método de pagamento):

Para **Pix**:

| Campo                    | Tipo   | Descrição                       |
| ------------------------ | ------ | ------------------------------- |
| `pix.end_to_end_id`     | string | ID end-to-end da transação Pix  |
| `pix.pix_creation_date` | string | Data de criação do Pix          |
| `pix.pix_expiration_date` | string | Data de expiração do Pix      |
| `pix.pix_emv`           | string | Código EMV (copia e cola)       |
| `pix.pix_ref`           | string | Referência do Pix               |
| `pix.pix_qrcode`        | string | URL da imagem do QR Code        |
| `pix.pix_payment_link`  | string | Link de pagamento Pix           |

Para **Boleto**:

| Campo                         | Tipo   | Descrição                  |
| ----------------------------- | ------ | -------------------------- |
| `boleto.boleto_overdue_date`  | string | Data de vencimento         |
| `boleto.boleto_url`           | string | URL do boleto              |
| `boleto.boleto_digitable_line` | string | Linha digitável           |

Para **Cartão de Crédito / Apple Pay**:

| Campo                            | Tipo   | Descrição              |
| -------------------------------- | ------ | ---------------------- |
| `credit_card.installments`       | int    | Número de parcelas     |
| `credit_card.card_brand`         | string | Bandeira do cartão     |
| `credit_card.nsu`                | string | NSU da transação       |
| `credit_card.authorization_code` | string | Código de autorização  |
| `credit_card.captured_at`        | string | Data/hora da captura   |

#### Exemplo: Pedido aprovado com cartão (`order_approved`)

```json
{
  "event": "order_approved",
  "event_type": "order",
  "site_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "app_id": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
  "client_key": "merchant-key-123",
  "external_key": "ext-order-456",
  "data": {
    "order_id": 3531,
    "status": "aprovado",
    "total": 25990,
    "freight_value": 1500,
    "merchant_total": 23400,
    "merchant_affiliate_total": 0,
    "discount": 0,
    "interest": 0,
    "upsell_order_id": null,
    "payment_link_id": null,
    "paid_at": "2025-03-15 14:30:00",
    "integrated_at": null,
    "refund_at": null,
    "created_at": "2025-03-15 14:28:00",
    "products": [
      {
        "sku": "PROD-001",
        "name": "Curso de Marketing Digital",
        "price": 25990,
        "quantity": 1
      }
    ],
    "payment_info": {
      "credit_card": {
        "installments": 3,
        "card_brand": "visa",
        "nsu": "0012345678",
        "authorization_code": "AUTH9876",
        "captured_at": "2025-03-15 14:30:00"
      }
    },
    "client_key": "merchant-key-123",
    "external_key": "ext-order-456",
    "cashback_used": null,
    "cashback_reserved": null,
    "cashback_status": null,
    "notification_type": "order_approved"
  },
  "partner_merchant": {
    "merchant_email": "loja@exemplo.com",
    "merchant_document_number": "12345678000199",
    "merchant_phone": "11999999999"
  }
}
```

#### Exemplo: Pix pago (`order_paid_by_pix`)

```json
{
  "event": "order_paid_by_pix",
  "event_type": "order",
  "site_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "app_id": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
  "client_key": null,
  "external_key": null,
  "data": {
    "order_id": 4201,
    "status": "aprovado",
    "total": 9900,
    "freight_value": 0,
    "merchant_total": 8910,
    "merchant_affiliate_total": 0,
    "discount": 0,
    "interest": 0,
    "upsell_order_id": null,
    "payment_link_id": 789,
    "paid_at": "2025-03-15 15:10:00",
    "integrated_at": null,
    "refund_at": null,
    "created_at": "2025-03-15 15:05:00",
    "products": [
      {
        "sku": "EBOOK-042",
        "name": "E-book Receitas Fit",
        "price": 9900,
        "quantity": 1
      }
    ],
    "payment_info": {
      "pix": {
        "end_to_end_id": "E123456782025031515100001",
        "pix_creation_date": "2025-03-15 15:05:00",
        "pix_expiration_date": "2025-03-15 15:35:00",
        "pix_emv": "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef12345678905204000053039865802BR5925APPMAX PAGAMENTOS LTDA6009SAO PAULO62070503***63041D3D",
        "pix_ref": "PIX-REF-4201",
        "pix_qrcode": "https://api.appmax.com.br/pix/qrcode/4201.png",
        "pix_payment_link": "https://pay.appmax.com.br/pix/4201"
      }
    },
    "client_key": null,
    "external_key": null,
    "cashback_used": null,
    "cashback_reserved": null,
    "cashback_status": null,
    "notification_type": "order_paid_by_pix"
  },
  "partner_merchant": {
    "merchant_email": "loja@exemplo.com",
    "merchant_document_number": "12345678000199",
    "merchant_phone": "11999999999"
  }
}
```

#### Exemplo: Boleto criado (`order_billet_created`)

```json
{
  "event": "order_billet_created",
  "event_type": "order",
  "site_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "app_id": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
  "client_key": "merchant-key-123",
  "external_key": null,
  "data": {
    "order_id": 4305,
    "status": "aguardando_pagamento",
    "total": 34900,
    "freight_value": 2000,
    "merchant_total": 31410,
    "merchant_affiliate_total": 0,
    "discount": 500,
    "interest": 0,
    "upsell_order_id": null,
    "payment_link_id": null,
    "paid_at": null,
    "integrated_at": null,
    "refund_at": null,
    "created_at": "2025-03-16 09:00:00",
    "products": [
      {
        "sku": "KIT-PREMIUM",
        "name": "Kit Premium de Suplementos",
        "price": 16700,
        "quantity": 2
      }
    ],
    "payment_info": {
      "boleto": {
        "boleto_overdue_date": "2025-03-19 23:59:59",
        "boleto_url": "https://api.appmax.com.br/boleto/4305.pdf",
        "boleto_digitable_line": "23793.38128 60000.000003 00000.000400 1 84340000034900"
      }
    },
    "client_key": "merchant-key-123",
    "external_key": null,
    "cashback_used": 500,
    "cashback_reserved": 1000,
    "cashback_status": "applied",
    "notification_type": "order_billet_created"
  },
  "partner_merchant": {
    "merchant_email": "loja@exemplo.com",
    "merchant_document_number": "98765432000188",
    "merchant_phone": "21988887777"
  }
}
```

### Customer Events

O campo `data` para eventos do tipo `customer` contém os seguintes campos:

| Campo                              | Tipo              | Descrição                    |
| ---------------------------------- | ----------------- | ---------------------------- |
| `customer_id`                      | int               | ID do cliente                |
| `customer_data`                    | object            | Dados pessoais do cliente    |
| `customer_data.firstname`          | string            | Primeiro nome                |
| `customer_data.lastname`           | string            | Sobrenome                    |
| `customer_data.email`              | string            | E-mail                       |
| `customer_data.telephone`          | string            | Telefone                     |
| `customer_data.document_number`    | string            | CPF ou CNPJ                  |
| `customer_data.custom_txt`         | string \| null    | Campo customizado            |
| `customer_address`                 | object            | Endereço do cliente          |
| `customer_address.postcode`        | string            | CEP                          |
| `customer_address.street`          | string            | Logradouro                   |
| `customer_address.street_number`   | string            | Número                       |
| `customer_address.street_complement` | string \| null  | Complemento                  |
| `customer_address.street_district` | string            | Bairro                       |
| `customer_address.city`            | string            | Cidade                       |
| `customer_address.state`           | string            | Estado (UF)                  |
| `created_at`                       | string            | Data/hora de criação         |
| `updated_at`                       | string            | Data/hora de atualização     |
| `client_key`                       | string \| null    | Chave de identificação externa |
| `external_key`                     | string \| null    | Chave externa                |

#### Exemplo: Cliente criado (`customer_created`)

```json
{
  "event": "customer_created",
  "event_type": "customer",
  "site_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "app_id": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
  "client_key": "merchant-key-123",
  "external_key": null,
  "data": {
    "customer_id": 2023,
    "customer_data": {
      "firstname": "Junior",
      "lastname": "Almeida",
      "email": "junior.almeida@email.com",
      "telephone": "51983655100",
      "document_number": "12345678900",
      "custom_txt": null
    },
    "customer_address": {
      "postcode": "90010-000",
      "street": "Rua dos Andradas",
      "street_number": "1234",
      "street_complement": "Sala 501",
      "street_district": "Centro Histórico",
      "city": "Porto Alegre",
      "state": "RS"
    },
    "created_at": "2025-03-15 14:25:00",
    "updated_at": "2025-03-15 14:25:00",
    "client_key": "merchant-key-123",
    "external_key": null
  },
  "partner_merchant": {
    "merchant_email": "loja@exemplo.com",
    "merchant_document_number": "12345678000199",
    "merchant_phone": "11999999999"
  }
}
```

### Payment Events

O campo `data` para eventos do tipo `payment` contém os seguintes campos:

| Campo            | Tipo              | Descrição                                              |
| ---------------- | ----------------- | ------------------------------------------------------ |
| `customer_id`    | int               | ID do cliente                                          |
| `order_id`       | int               | ID do pedido                                           |
| `payment_type`   | string            | Método de pagamento (ex: `credit_card`, `pix`, `boleto`) |
| `payment_total`  | int               | Valor do pagamento em centavos                         |
| `cashback_used`  | int \| null       | Cashback utilizado em centavos                         |

#### Exemplo: Pagamento não autorizado (`payment_not_authorized`)

```json
{
  "event": "payment_not_authorized",
  "event_type": "payment",
  "site_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "app_id": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
  "client_key": null,
  "external_key": null,
  "data": {
    "customer_id": 2023,
    "order_id": 3532,
    "payment_type": "credit_card",
    "payment_total": 15900,
    "cashback_used": null
  },
  "partner_merchant": {
    "merchant_email": "loja@exemplo.com",
    "merchant_document_number": "12345678000199",
    "merchant_phone": "11999999999"
  }
}
```

### Subscription Events

O campo `data` para eventos do tipo `subscription` contém os seguintes campos:

| Campo               | Tipo   | Descrição                      |
| ------------------- | ------ | ------------------------------ |
| `subscription_id`   | int    | ID da assinatura               |
| `subscription_name` | string | Nome da assinatura             |
| `total`             | int    | Valor da assinatura em centavos |
| `customer_id`       | int    | ID do cliente                  |
| `created_at`        | string | Data/hora de criação           |
| `updated_at`        | string | Data/hora de atualização       |

#### Exemplo: Assinatura criada (`subscription_created`)

```json
{
  "event": "subscription_created",
  "event_type": "subscription",
  "site_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "app_id": "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
  "client_key": "merchant-key-123",
  "external_key": null,
  "data": {
    "subscription_id": 501,
    "subscription_name": "Plano Mensal Premium",
    "total": 4990,
    "customer_id": 2023,
    "created_at": "2025-03-15 14:30:00",
    "updated_at": "2025-03-15 14:30:00"
  },
  "partner_merchant": {
    "merchant_email": "loja@exemplo.com",
    "merchant_document_number": "12345678000199",
    "merchant_phone": "11999999999"
  }
}
```

## Fluxo Temporal dos Eventos

Os diagramas abaixo ilustram a sequência típica de eventos para cada método de pagamento.

**Cartão de Crédito:**

```
customer_created → order_authorized → order_approved → order_paid → order_integrated
```

**Pix:**

```
customer_created → order_pix_created → [timeout: order_pix_expired]
                                     → order_paid_by_pix → order_approved → order_integrated
```

**Boleto:**

```
customer_created → order_billet_created → [vencimento: order_billet_overdue]
                                        → order_paid → order_approved → order_integrated
```

**Estorno / Chargeback:**

```
[pedido aprovado] → order_refund (total)
                  → order_partial_refund (parcial)
                  → order_chargeback_in_treatment → order_charge_back_gain
```

**Assinatura:**

```
subscription_created → subscription_charge_success / subscription_charge_failed
                     → subscription_delayed → subscription_cancelation
```

> **A ordem dos eventos não é garantida. Atrasos de rede, retries e processamento assíncrono podem alterar a sequência. Sempre verifique o estado atual do recurso antes de tomar decisões baseadas em eventos.**
>
>
## Política de Retry

Quando o endpoint falha em receber um webhook, a Appmax inicia um ciclo de retentativas:

```
Tentativa 1 (original) — após delay do evento
        ↓ falha
Tentativa 2 — +30 minutos
        ↓ falha
Tentativa 3 — +2 horas
        ↓ falha
Tentativa 4 — +4 horas
        ↓ falha
Webhook descartado (sem notificação)
```

- **Timeout HTTP:** 5 segundos
- **Códigos de sucesso:** 200, 201, 202, 203, 204, 205, 206, 207, 208, 226
- **Falha:** qualquer outro código HTTP ou timeout inicia o retry
- **Máximo:** 4 tentativas (1 original + 3 retries)

> **Após 4 tentativas sem sucesso, o webhook é descartado permanentemente. Não há notificação ao desenvolvedor. Monitore seu endpoint ativamente.**
>
>
## Headers HTTP

Toda requisição de webhook é enviada com os seguintes headers:

| Header         | Valor              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |
| `User-Agent`   | `GuzzleHttp/7`     |

> **A Appmax não envia header de assinatura (HMAC) ou token de autenticação nos webhooks. Recomendamos validar a origem por outros meios (ver Boas Práticas).**
>
>
## Como Receber Webhooks

Seu endpoint deve:

1. Aceitar requisições `POST` com `Content-Type: application/json`
2. Responder com **HTTP 200** em até **5 segundos**
3. Processar o evento de forma assíncrona (não bloqueie a resposta)

> **Se o endpoint não responder 200 dentro de 5 segundos, a Appmax inicia o ciclo de retry. Processe o evento em background e responda imediatamente.**
>
>
## Exemplos de Código

##### Go

```go
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"sync"

	"github.com/gin-gonic/gin"
)

var (
	processed sync.Map
)

func main() {
	r := gin.Default()

	r.POST("/webhooks/appmax", func(c *gin.Context) {
		var payload struct {
			Event     string          `json:"event"`
			EventType string          `json:"event_type"`
			Data      json.RawMessage `json:"data"`
		}

		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(200, gin.H{"received": true}) // responder 200 mesmo com erro
			return
		}

		// Responder 200 imediatamente para evitar timeout de 5s
		c.JSON(200, gin.H{"received": true})

		// Extrair ID para idempotência
		var data struct {
			OrderID    int `json:"order_id"`
			CustomerID int `json:"customer_id"`
		}
		json.Unmarshal(payload.Data, &data)

		id := data.OrderID
		if id == 0 {
			id = data.CustomerID
		}
		key := fmt.Sprintf("%d-%s", id, payload.Event)

		if _, loaded := processed.LoadOrStore(key, true); loaded {
			return // duplicado
		}

		// Processar em goroutine — em produção, envie para uma fila
		go func() {
			log.Printf("Processando: %s (%s)", payload.Event, payload.EventType)
			// Sua lógica aqui
		}()
	})

	r.Run(":3000")
}
```

##### Node.js

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// Map para rastrear eventos já processados (em produção, use banco de dados)
const processed = new Set();

app.post('/webhooks/appmax', (req, res) => {
  // Responder 200 imediatamente para evitar timeout de 5s
  res.status(200).json({ received: true });

  const { event, event_type, data } = req.body;
  const idempotencyKey = `${data.order_id || data.customer_id}-${event}`;

  if (processed.has(idempotencyKey)) {
    console.log(`Evento duplicado ignorado: ${idempotencyKey}`);
    return;
  }

  processed.add(idempotencyKey);
  console.log(`Processando: ${event} (${event_type})`);

  // Processar evento de forma assíncrona
  // Em produção, envie para uma fila (Bull, RabbitMQ, etc.)
});

app.listen(3000, () => console.log('Webhook listener na porta 3000'));
```

##### Python

```python
from flask import Flask, request, jsonify
import threading

app = Flask(__name__)
processed = set()

@app.route('/webhooks/appmax', methods=['POST'])
def webhook():
    payload = request.get_json()
    event = payload.get('event')
    data = payload.get('data', {})

    key = f"{data.get('order_id') or data.get('customer_id')}-{event}"

    if key in processed:
        return jsonify(received=True), 200

    processed.add(key)

    # Processar em background para responder rápido
    threading.Thread(target=process_event, args=(payload,)).start()

    return jsonify(received=True), 200

def process_event(payload):
    print(f"Processando: {payload['event']}")
    # Sua lógica aqui

if __name__ == '__main__':
    app.run(port=3000)
```

##### PHP (Laravel)

```php
// routes/api.php
Route::post('/webhooks/appmax', [WebhookController::class, 'handle']);

// app/Http/Controllers/WebhookController.php
class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->all();

        // Despachar para job assíncrono e responder 200 imediatamente
        ProcessWebhook::dispatch($payload);

        return response()->json(['received' => true]);
    }
}

// app/Jobs/ProcessWebhook.php
class ProcessWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private array $payload) {}

    public function handle()
    {
        $event = $this->payload['event'];
        $data = $this->payload['data'];
        $key = ($data['order_id'] ?? $data['customer_id']) . '-' . $event;

        // Verificar idempotência
        if (Cache::has("webhook:{$key}")) {
            return;
        }
        Cache::put("webhook:{$key}", true, now()->addHours(24));

        // Processar evento
        Log::info("Webhook recebido: {$event}", $this->payload);
    }
}
```

## Boas Práticas

1. **Responda 200 antes de processar.** O timeout é de 5 segundos. Processamento síncrono causa retry desnecessário. Responda imediatamente e processe em background (fila, thread, job assíncrono).

2. **Implemente idempotência.** Use `order_id` + `event` (ou `customer_id` + `event`) como chave única. Retries legitimamente reenviam o mesmo evento, e seu sistema precisa tratar duplicatas sem efeitos colaterais.

3. **Armazene o payload cru.** Salve o JSON completo em banco de dados ou log antes de processar. Isso facilita debug e permite reprocessamento manual sem depender de reenvio.

4. **Não confie na ordem dos eventos.** Atrasos de rede e retries podem alterar a sequência. Sempre verifique o estado atual do recurso (via API, se necessário) antes de tomar decisões baseadas em um evento.

5. **Use HTTPS.** Proteja dados em trânsito. A Appmax envia webhooks para URLs HTTP e HTTPS, mas dados de cliente e pagamento transitam no payload.

6. **Trate duplicatas.** Retries legitimamente reenviam o mesmo evento. Garanta que processar o mesmo evento duas vezes não cause efeitos colaterais (cobrar duas vezes, enviar dois e-mails, etc.).

7. **Valide a origem.** Como não há header HMAC, considere filtrar por IP de origem, validar a estrutura do payload contra o schema esperado, ou confirmar o evento via API da Appmax.

## Webhooks: Appstore vs Painel

Existem **dois tipos de webhook** na plataforma Appmax. Não confunda:

| Aspecto | Webhooks da Appstore | Webhooks do Painel |
|---------|---------------------|-------------------|
| Quem configura | Desenvolvedor do app, na criação do aplicativo | Merchant, no painel admin da loja |
| Escopo | Todos os merchants que instalam o app | Apenas a loja específica do merchant |
| URL destino | URL do host do app (definida na Appstore) | URL definida pelo merchant no painel |
| Eventos | 28 eventos documentados nesta página | Subconjunto de eventos (varia por configuração) |
| Credenciais no payload | `app_id`, `site_id`, `external_key` | Formato diferente, sem `app_id` |
| Quando usar | Integrações via Appstore (este guia) | Integrações diretas do merchant |

> **Se você está integrando via Appstore (criou um app, merchants instalam), use os webhooks documentados nesta página. Os webhooks do painel são para merchants que configuram notificações diretamente, sem app intermediário.**
>
>
## Erros e Troubleshooting

| Cenário | O que acontece | Como resolver |
| ------- | -------------- | ------------- |
| Endpoint retorna HTTP diferente de 2xx | Retry iniciado (até 4 tentativas) | Retornar 200, 201 ou 202 |
| Endpoint não responde em 5s | Timeout, retry iniciado | Processar async e responder 200 imediatamente |
| Endpoint retorna 502 | URL inválida ou servidor fora do ar | Verificar URL cadastrada e disponibilidade do servidor |
| Endpoint retorna 401/403 | Autenticação falha, retry iniciado | Remover autenticação do endpoint ou adicionar whitelist |
| Retry esgotado (4 tentativas) | Webhook descartado permanentemente | Monitorar endpoint ativamente e solicitar reenvio ao suporte |
| Webhook demora para chegar | Evento pode estar em fila de retry | Verificar se o endpoint respondeu 200 nas tentativas anteriores |
| Webhook não chega (pedido Yampi) | Webhook suprimido | Comportamento intencional para pedidos originados da Yampi |
| `customer_interested` não dispara | Cliente já possui pedido | Evento só dispara para leads sem pedido associado |

## Testes e Debug

### webhook.site

Serviço gratuito para inspecionar webhooks recebidos. Crie uma URL temporária em [webhook.site](https://webhook.site), configure como URL de webhook do app e visualize os payloads recebidos em tempo real.

### ngrok

Para testar webhooks diretamente no seu ambiente local:

```bash
ngrok http 3000
```

Use a URL HTTPS gerada pelo ngrok como URL de webhook do app. As requisições serão redirecionadas para `localhost:3000`, permitindo debug end-to-end com breakpoints.

### Dicas gerais

- Verifique os logs do seu servidor para confirmar que as requisições estão chegando
- Inspecione os headers da requisição para confirmar `Content-Type: application/json`
- Valide que o JSON recebido está bem formado antes de processar
- Confirme que o app possui as permissões necessárias para receber os eventos desejados

## Veja Também

- [Index Master](../index_master.md)
- [Rate Limit](rate_limit.md)
- [Calculo Parcelas](calculo_parcelas.md)
- [Recuperacao Vendas Ia](recuperacao_vendas_ia.md)
