---
title: Referência de API — Realtime Calls, Client Secrets & Webhooks
description: Especificação técnica dos endpoints /v1/realtime/calls, /v1/realtime/client_secrets e validação de assinaturas de Webhooks da OpenAI.
topics:
  - api-reference
  - realtime-api-reference
  - webhooks-reference
  - client-secrets
keywords:
  - /v1/realtime/calls
  - /v1/realtime/client_secrets
  - webhooks
  - signature-verification
  - unwrap
related:
  - ../multimidia_e_tempo_real/realtime_api_webrtc.md
  - ../multimidia_e_tempo_real/realtime_api_websocket.md
  - ../multimidia_e_tempo_real/realtime_sip_e_telefonia.md
source_scope:
  - https://developers.openai.com/api/reference/resources/realtime.md
  - https://developers.openai.com/api/reference/resources/realtime/subresources/calls.md
  - https://developers.openai.com/api/reference/resources/webhooks.md
---

# Referência de API — Realtime Calls, Client Secrets & Webhooks

---

## 1. Tokens Efêmeros (`/v1/realtime/client_secrets`)

Gera credenciais de sessão temporárias e seguras para clientes WebRTC front-end e mobile:

```http
POST /v1/realtime/client_secrets
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY

{
  "model": "gpt-4o-realtime-preview",
  "voice": "coral",
  "modalities": ["text", "audio"]
}
```

---

## 2. Chamadas Telefônicas Realtime (`/v1/realtime/calls`)

Endpoints para controle de sessões SIP / PSTN:

- `POST /v1/realtime/calls`: Inicia uma nova chamada telefônica de saída (*outbound*).
- `POST /v1/realtime/calls/{call_id}/accept`: Atende chamada de entrada (*inbound*).
- `POST /v1/realtime/calls/{call_id}/hangup`: Encerra a chamada.
- `POST /v1/realtime/calls/{call_id}/refer`: Transfere a chamada via protocolo SIP REFER.
- `POST /v1/realtime/calls/{call_id}/reject`: Rejeita a chamada.

---

## 3. Validação de Assinatura de Webhooks (`openai.webhooks.unwrap`)

Para receber notificações de eventos assíncronos (ex.: conclusão de Batch, término de Job de Fine-Tuning, alertas de Spend Limit):

```python
import openai

# Validação criptográfica com segredo de webhook (Standard Webhooks)
evento = openai.webhooks.unwrap(
    payload=request_body_raw,
    headers=request_headers,
    secret="whsec_xxxxxxxxxxxxxxxxxxxxxxxx"
)

print(f"Evento recebido com segurança: {evento.type}")
```

### Cabeçalhos de Segurança Validados:
- `webhook-id`: Identificador único da mensagem.
- `webhook-timestamp`: Timestamp da emissão (proteção contra replay attacks).
- `webhook-signature`: Assinatura HMAC-SHA256 codificada em Base64.

---

## 4. Referências Cruzadas

- [`../multimidia_e_tempo_real/realtime_api_webrtc.md`](../multimidia_e_tempo_real/realtime_api_webrtc.md)
- [`../multimidia_e_tempo_real/realtime_sip_e_telefonia.md`](../multimidia_e_tempo_real/realtime_sip_e_telefonia.md)
