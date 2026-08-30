---
title: Exemplo Completo — Streaming de Áudio em Tempo Real via WebSocket
description: Implementação em Python assíncrono conectando-se à OpenAI Realtime API via WebSockets para streaming bidirecional de áudio PCM16.
topics:
  - examples
  - realtime-api
  - websockets
  - pcm16-audio
keywords:
  - python
  - websockets
  - wss://api.openai.com/v1/realtime
  - session.update
  - audio-streaming
related:
  - ../multimidia_e_tempo_real/realtime_api_websocket.md
  - ../multimidia_e_tempo_real/realtime_api_webrtc.md
source_scope:
  - https://developers.openai.com/api/docs/guides/realtime-websocket.md
---

# Exemplo Completo — Streaming de Áudio em Tempo Real via WebSocket

Este script demonstra como abrir uma conexão WebSocket com a **Realtime API**, configurar a sessão de voz com detecção automática de silêncio (VAD) e tratar eventos de áudio e transcrição textual simultâneos.

---

## Código Fonte Completo (`realtime_audio_ws.py`)

```python
import os
import json
import base64
import asyncio
import websockets

async def conversar_realtime():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY não definida.")

    url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "OpenAI-Beta": "realtime=v1"
    }

    print("Conectando ao gateway WebSocket Realtime da OpenAI...")
    async with websockets.connect(url, extra_headers=headers) as ws:
        print("Conexão estabelecida!")

        # 1. Configurar parâmetros da sessão de voz
        config_sessao = {
            "type": "session.update",
            "session": {
                "modalities": ["text", "audio"],
                "instructions": "Você é um assistente de voz amigável e extremamente conciso. Responda em no máximo duas frases.",
                "voice": "coral",
                "input_audio_format": "pcm16",
                "output_audio_format": "pcm16",
                "turn_detection": {
                    "type": "server_vad",
                    "threshold": 0.5,
                    "prefix_padding_ms": 300,
                    "silence_duration_ms": 500
                }
            }
        }
        await ws.send(json.dumps(config_sessao))

        # 2. Enviar uma mensagem de texto inicial para disparar a fala do assistente
        mensagem_inicial = {
            "type": "conversation.item.create",
            "item": {
                "type": "message",
                "role": "user",
                "content": [
                    {"type": "input_text", "text": "Olá! Diga uma frase motivacional rápida para o meu dia."}
                ]
            }
        }
        await ws.send(json.dumps(mensagem_inicial))
        await ws.send(json.dumps({"type": "response.create"}))

        # 3. Loop de recebimento de eventos do servidor
        print("\nRecebendo resposta do modelo:")
        bytes_audio_acumulados = bytearray()

        while True:
            try:
                msg_raw = await ws.recv()
                evento = json.loads(msg_raw)
                tipo = evento.get("type")

                # Transcrição textual do áudio que está sendo falado
                if tipo == "response.audio_transcript.delta":
                    print(evento.get("delta", ""), end="", flush=True)

                # Chunks de áudio PCM16 em Base64
                elif tipo == "response.audio.delta":
                    chunk_base64 = evento.get("delta", "")
                    chunk_bytes = base64.b64decode(chunk_base64)
                    bytes_audio_acumulados.extend(chunk_bytes)

                # Resposta concluída
                elif tipo == "response.done":
                    print(f"\n\n[Resposta finalizada | Total de bytes de áudio PCM16 recebidos: {len(bytes_audio_acumulados)}]")
                    break

            except websockets.exceptions.ConnectionClosed:
                print("\nConexão encerrada pelo servidor.")
                break

if __name__ == "__main__":
    asyncio.run(conversar_realtime())
```

---

## Referências Relacionadas

- [`../multimidia_e_tempo_real/realtime_api_websocket.md`](../multimidia_e_tempo_real/realtime_api_websocket.md)
- [`../multimidia_e_tempo_real/realtime_api_webrtc.md`](../multimidia_e_tempo_real/realtime_api_webrtc.md)
- [`../referencia_api/realtime_calls_e_webhooks.md`](../referencia_api/realtime_calls_e_webhooks.md)
