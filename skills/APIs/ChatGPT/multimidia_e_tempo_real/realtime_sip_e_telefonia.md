---
title: Realtime API com SIP e Integração Telefônica
description: Como integrar a OpenAI Realtime API com troncos SIP de telefonia (Twilio, Asterisk, FreeSWITCH), codec PCMU/PCMA e gerenciamento de chamadas.
topics:
  - realtime-api
  - sip
  - telephony
  - voip
  - twilio
keywords:
  - SIP
  - VoIP
  - /v1/realtime/calls
  - Twilio Media Streams
  - G.711
  - PCMU
related:
  - ../multimidia_e_tempo_real/realtime_api_websocket.md
  - ../multimidia_e_tempo_real/realtime_api_webrtc.md
  - ../referencia_api/realtime_calls_e_webhooks.md
source_scope:
  - https://developers.openai.com/api/docs/guides/realtime-sip.md
  - https://developers.openai.com/api/reference/resources/realtime/subresources/calls.md
---

# Realtime API com SIP e Integração Telefônica

A **OpenAI Realtime API com suporte a SIP** permite conectar agentes de voz diretamente a troncos telefônicos (PSTN / SIP Trunks) e serviços de comunicação na nuvem como **Twilio**, **Vonage**, **Asterisk** e **FreeSWITCH**.

---

## 1. Arquitetura de Integração Telefônica

```
[ Usuário / Telefone Celular ]
              | (Chamada telefônica convencional PSTN)
              v
[ Provedor de Telefonia / Twilio SIP ]
              | (SIP INVITE / RTP Media Stream)
              v
[ OpenAI Realtime SIP Gateway (/v1/realtime/calls) ]
              | (Processamento de fala e áudio bidirecional)
              v
[ Modelo de Voz OpenAI (gpt-4o-realtime-preview) ]
```

---

## 2. Inicialização de Chamada via API (`/v1/realtime/calls`)

É possível aceitar ou originar chamadas telefônicas diretamente através do endpoint de chamadas:

```python
from openai import OpenAI

client = OpenAI()

chamada = client.realtime.calls.create(
    to="+5511999998888",
    from_number="+551140001234",
    model="gpt-4o-realtime-preview",
    voice="coral",
    instructions="""
    Você é a assistente virtual da Clínica Saúde Total.
    Seja educada e confirme o agendamento de consulta do paciente.
    """,
    audio_format="g711_ulaw"
)

print(f"Chamada iniciada com ID: {chamada.id}. Status: {chamada.status}")
```

---

## 3. Ações de Controle de Chamada em Tempo Real

- **`client.realtime.calls.accept(call_id)`**: Atende uma chamada telefônica SIP recebida.
- **`client.realtime.calls.hangup(call_id)`**: Encerra a chamada telefônica.
- **`client.realtime.calls.refer(call_id, target_uri)`**: Transfere a chamada telefônica para um ramal humano ou número de atendimento externo (SIP REFER).
- **`client.realtime.calls.reject(call_id)`**: Rejeita a chamada telefônica.

---

## 4. Codecs Telefônicos Suportados

- **`g711_ulaw` (PCMU)**: Padrão na América do Norte e gateways SIP (8 kHz, 8-bit).
- **`g711_alaw` (PCMA)**: Padrão na Europa e Brasil (8 kHz, 8-bit).
- **`pcm16`**: Áudio de maior fidelidade (16 kHz ou 24 kHz) para troncos SIP com suporte a banda larga (*wideband*).

---

## 5. Referências Cruzadas

- [`../multimidia_e_tempo_real/realtime_api_websocket.md`](../multimidia_e_tempo_real/realtime_api_websocket.md)
- [`../multimidia_e_tempo_real/realtime_api_webrtc.md`](../multimidia_e_tempo_real/realtime_api_webrtc.md)
- [`../referencia_api/realtime_calls_e_webhooks.md`](../referencia_api/realtime_calls_e_webhooks.md)
