# Webhooks e Eventos

## Objetivo

A Appmax envia `POST` para a URL configurada no aplicativo quando eventos ocorrem na plataforma.

Exemplos de domínio:

```text
customer
order
payment
subscription
```

## Envelope

Estrutura geral:

```json
{
  "event": "order_approved",
  "event_type": "order",
  "site_id": "UUID",
  "app_id": "UUID",
  "client_key": null,
  "external_key": null,
  "data": {},
  "partner_merchant": {
    "merchant_email": "merchant@example.com",
    "merchant_document_number": "00000000000000",
    "merchant_phone": "5511999999999"
  }
}
```

## Campos principais

| Campo | Tipo | Papel |
|---|---|---|
| `event` | string | nome do evento |
| `event_type` | string | domínio |
| `site_id` | string | loja/site |
| `app_id` | string | app receptor |
| `client_key` | string/null | identificação externa opcional |
| `external_key` | string/null | chave externa opcional |
| `data` | object | payload específico |
| `partner_merchant` | object | dados do merchant |

## Dados de pedido

Campos encontrados na documentação incluem:

```text
order_id
status
total
freight_value
merchant_total
merchant_affiliate_total
discount
interest
upsell_order_id
payment_link_id
paid_at
integrated_at
refund_at
created_at
products[]
payment_info
```

Produtos:

```json
{
  "sku": "SKU-001",
  "name": "Produto",
  "price": 9900,
  "quantity": 1
}
```

## Payment info — Pix

Pode conter:

```text
end_to_end_id
pix_creation_date
pix_expiration_date
pix_emv
pix_ref
pix_qrcode
pix_payment_link
```

## Evento de pagamento

Exemplo conceitual:

```json
{
  "event": "payment_not_authorized",
  "event_type": "payment",
  "data": {
    "customer_id": 123,
    "order_id": 456,
    "payment_type": "credit_card",
    "payment_total": 15900,
    "cashback_used": null
  }
}
```

## Eventos de assinatura

O bloco `data` pode incluir:

```text
subscription_id
subscription_name
total
customer_id
created_at
updated_at
```

## Implementação recomendada

```ts
app.post("/webhooks/appmax", async (req, res) => {
  // 1. faça validações de origem/autenticidade conforme contrato vigente
  // 2. responda rapidamente
  res.sendStatus(200);

  // 3. processe de forma idempotente
  await queue.enqueue({
    event: req.body.event,
    payload: req.body
  });
});
```

## Idempotência

Mantenha chave interna por evento/recurso:

```text
appmax:{event}:{resource_id}:{timestamp_or_unique_key}
```

Antes de executar efeitos colaterais:

```text
se já processado → ignore
senão → grave marca → processe
```

## Política de estado

Webhooks devem atualizar sua projeção local do estado Appmax. Evite usar somente a resposta síncrona do checkout como confirmação final em fluxos que podem evoluir assincronamente.
