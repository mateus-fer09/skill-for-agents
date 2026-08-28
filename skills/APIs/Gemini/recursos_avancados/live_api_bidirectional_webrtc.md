---
title: Live API — Comunicação Bidirecional de Áudio e Vídeo sobre WebSockets/WebRTC
description: Guia completo sobre a Live API da Gemini API para conversação full-duplex de voz e vídeo em tempo real com ultra-baixa latência, interrupções (barge-in) e chamada de ferramentas ao vivo.
---

# Live API — Comunicação Bidirecional de Áudio e Vídeo sobre WebSockets/WebRTC

## 1. Visão Geral da Live API

A **Live API** é o protocolo de streaming bidirecional em tempo real do Gemini. Construída sobre conexões persistentes WebSocket, ela permite que um usuário converse em áudio natural ou transmita vídeo continuamente para o modelo com latências inferiores a 300ms.

```text
┌────────────────────────────────────────────────────────┐
│               CLIENTE (Navegador / App)                │
│  - Microfone envia PCM 16-bit 16kHz continuamente      │
│  - Alto-falante reproduz áudio 24kHz recebido          │
└───────────────────────────▲────────────────────────────┘
                            │  WebSocket Bidirecional Full-Duplex
                            ▼
┌────────────────────────────────────────────────────────┐
│                  GEMINI 2.0 FLASH                      │
│  - Voice Activity Detection (VAD) integrado            │
│  - Suporte nativo a Interrupção (Barge-in)             │
│  - Execução de ferramentas em tempo real ao vivo       │
└────────────────────────────────────────────────────────┘
```

---

## 2. Especificações de Áudio e Protocolo

- **Protocolo de Rede:** WebSocket (`wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`)
- **Formato de Áudio de Entrada:** PCM Linear 16-bit, Little-Endian, Mono, taxa de amostragem de 16.000 Hz ou 24.000 Hz (`audio/pcm;rate=16000`).
- **Formato de Áudio de Saída:** PCM 24.000 Hz.
- **Formato de Vídeo/Imagens:** Quadros JPEG enviados continuamente (`image/jpeg`) a 1-5 FPS.

---

## 3. Implementação em Python Assíncrono (`google-genai`)

```python
import asyncio
from google import genai
from google.genai import types

client = genai.Client()

async def audio_receiver(session):
    """Recebe e consome chunks de áudio e texto gerados pelo modelo em tempo real."""
    async for response in session.receive():
        server_content = response.server_content
        if server_content is not None:
            model_turn = server_content.model_turn
            if model_turn is not None:
                for part in model_turn.parts:
                    if part.text:
                        print(f"[Texto]: {part.text}", end="", flush=True)
                    if part.inline_data:
                        # Chunks de áudio PCM brutos para serem enviados à placa de som
                        audio_pcm_bytes = part.inline_data.data
                        # player.write(audio_pcm_bytes)
            
            # Notificação de interrupção (usuário começou a falar enquanto o bot falava)
            if server_content.interrupted:
                print("
[AVISO]: Interrupção detectada (Barge-in). Cancelando reprodução atual.")

async def main():
    # Conexão assíncrona à Live API
    async with client.aio.live.connect(
        model="gemini-2.0-flash",
        config=types.LiveConnectConfig(
            response_modalities=[types.LiveModality.AUDIO], # Resposta em áudio falado
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name="Puck" # Opções de voz: Puck, Charon, Kore, Fenrir, Aoede
                    )
                )
            )
        )
    ) as session:
        print("Sessão Live API conectada com sucesso!")
        
        # Iniciar worker receptor em background
        receive_task = asyncio.create_task(audio_receiver(session))

        # Enviar saudação inicial em texto
        await session.send(
            input=types.LiveClientContent(
                turns=[
                    types.Content(
                        role="user",
                        parts=[types.Part.from_text(text="Olá Gemini! Fale em português de forma breve.")]
                    )
                ],
                turn_complete=True
            )
        )

        # Aguardar 10 segundos de diálogo
        await asyncio.sleep(10)
        receive_task.cancel()

# asyncio.run(main())
```

---

## 4. Capacidades Críticas da Live API

1. **Barge-in / Interrupção:** O modelo suspende imediatamente a geração em andamento assim que o microfone do usuário detecta nova fala.
2. **Function Calling ao Vivo:** O modelo pode invocar funções no meio da conversação oral sem quebrar a sessão WebSocket.
