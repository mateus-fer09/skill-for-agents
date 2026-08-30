---
title: Realtime API com WebSocket (Server-to-Server)
description: Conexão direta server-to-server com a Realtime API usando WebSockets (wss://api.openai.com/v1/realtime), streaming de áudio PCM16 e eventos de cliente/servidor.
topics:
  - realtime-api
  - websocket
  - server-to-server
  - audio-streaming
  - pcm16
keywords:
  - wss://api.openai.com/v1/realtime
  - session.update
  - input_audio_buffer.append
  - response.audio.delta
  - PCM16
related:
  - ../multimidia_e_tempo_real/realtime_api_webrtc.md
  - ../multimidia_e_tempo_real/realtime_sip_e_telefonia.md
  - ../referencia_api/realtime_calls_e_webhooks.md
source_scope:
  - https://developers.openai.com/api/docs/guides/realtime-websocket.md
  - https://developers.openai.com/api/docs/guides/realtime-conversations.md
  - https://developers.openai.com/api/reference/resources/realtime/client-events.md
  - https://developers.openai.com/api/reference/resources/realtime/server-events.md
---

# Realtime API com WebSocket (Server-to-Server)

Para aplicações executadas em servidores back-end, bots de atendimento telefônico, sistemas de transcrição ao vivo e gateways de telecomunicações, a **Realtime API via WebSocket** oferece controle total sobre buffers de áudio bruto (PCM16 / G.711) e eventos de ciclo de vida.

---

## 1. Conexão WebSocket

### Endpoint
```text
wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview
```

### Cabeçalhos de Conexão
```http
Authorization: Bearer YOUR_OPENAI_API_KEY
OpenAI-Beta: realtime=v1
```

---

## 2. Formato de Áudio Suportado

- **PCM16**: 24.000 Hz (24kHz), 1 canal (mono), little-endian, codificado em Base64.
- **G.711 / PCMU / PCMA**: 8.000 Hz (8kHz), ideal para gateways de telefonia SIP.

---

## 3. Exemplo em Python (Conexão WebSocket com `websockets`)

```python
import asyncio
import json
import websockets

async def executar_sessao_realtime():
    url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview"
    headers = {
        "Authorization": "Bearer YOUR_OPENAI_API_KEY",
        "OpenAI-Beta": "realtime=v1"
    }

    async with websockets.connect(url, extra_headers=headers) as ws:
        # 1. Configurar parâmetros da sessão
        evento_config = {
            "type": "session.update",
            "session": {
                "modalities": ["text", "audio"],
                "instructions": "Você é um assistente de voz rápido e prestativo.",
                "voice": "alloy",
                "input_audio_format": "pcm16",
                "output_audio_format": "pcm16",
                "turn_detection": {
                    "type": "server_vad",
                    "threshold": 0.5,
                    "silence_duration_ms": 200
                }
            }
        }
        await ws.send(json.dumps(evento_config))

        # 2. Escutar eventos do servidor
        async for mensagem in ws:
            evento = json.loads(mensagem)
            tipo = evento.get("type")
            
            if tipo == "session.updated":
                print("[Sessão configurada com sucesso]")
            elif tipo == "response.audio.delta":
                # Chunk de áudio PCM16 em base64 gerado pelo modelo
                audio_base64 = evento["delta"]
                # Processar ou reproduzir áudio...
            elif tipo == "response.audio_transcript.delta":
                print(evento["delta"], end="", flush=True)
            elif tipo == "response.done":
                print("\n[Resposta finalizada]")

# asyncio.run(executar_sessao_realtime())
```

---

## 4. Principais Eventos de Cliente (Enviados ao Servidor)

- `session.update`: Modifica instruções, voz, ferramentas ou sensibilidade do VAD.
- `input_audio_buffer.append`: Envia chunk de áudio em Base64 para o buffer de entrada.
- `input_audio_buffer.commit`: Força o processamento do buffer de áudio manualmente.
- `input_audio_buffer.clear`: Limpa o buffer de áudio em caso de cancelamento.
- `response.create`: Solicita explicitamente que o modelo comece a responder.
- `response.cancel`: Interrompe a resposta atual imediatamente.

---

## 5. Referências Cruzadas

- [`../multimidia_e_tempo_real/realtime_api_webrtc.md`](../multimidia_e_tempo_real/realtime_api_webrtc.md)
- [`../multimidia_e_tempo_real/realtime_sip_e_telefonia.md`](../multimidia_e_tempo_real/realtime_sip_e_telefonia.md)
- [`../referencia_api/realtime_calls_e_webhooks.md`](../referencia_api/realtime_calls_e_webhooks.md)
