---
title: "Realtime API: Voz Bidirecional e Baixa Latência via WebSockets e WebRTC"
description: "Guia técnico avançado da OpenAI Realtime API. Arquitetura de voz ponta a ponta com WebSockets (wss://api.openai.com/v1/realtime) e WebRTC no cliente, catálogo de eventos cliente/servidor, controle de áudio PCM16/G.711, detecção de voz no servidor (server_vad), interrupções naturais e execução de ferramentas em tempo real."
topics: ["realtime-api", "websockets", "webrtc", "audio-streaming", "pcm16", "server_vad", "voice-agents", "ephemeral-tokens"]
keywords: ["/v1/realtime", "gpt-4o-realtime-preview", "session.update", "input_audio_buffer.append", "response.audio.delta", "server_vad", "WebRTC session"]
source_scope: "OpenAI API Docs: Guides > Realtime API, WebSockets / WebRTC Protocol & Server-Sent Events"
---

# Realtime API: Voz Bidirecional e Baixa Latência via WebSockets e WebRTC

A **Realtime API** da OpenAI permite interações conversacionais multimodal de fala para fala (*Speech-to-Speech*) com latência ultrabaixa (~300ms), contornando os gargalos tradicionais de pipelines desacoplados de STT -> LLM -> TTS.

---

## 1. Modos de Conexão: WebSockets vs WebRTC

| Arquitetura | Protocolo de Transporte | Cenário de Uso Recomendado | Autenticação |
| :--- | :--- | :--- | :--- |
| **WebSockets (Server-to-Server)** | `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview` | Backends, centrais telefônicas VoIP (Twilio/Asterisk), bots de atendimento | `Authorization: Bearer <API_KEY>` |
| **WebRTC (Client-to-Server)** | WebRTC PeerConnection via `/v1/realtime/sessions` | Aplicações Web (navegadores) e Mobile (iOS/Android) sem expor a API Key secreta | Tokens Efêmeros (*Ephemeral Tokens*) gerados pelo backend |

---

## 2. Formato de Áudio e Parâmetros de Sessão

- **Formato Padrão:** Áudio PCM Linear 16-bit, 24.000 Hz (24kHz), mono, Little-Endian, codificado em Base64 nos eventos JSON.
- **Formatos Telefônicos:** Suporte a G.711 u-law e A-law (8kHz) para integração direta com redes PSTN.
- **Detecção de Voz (*Turn-Taking*):**
  - `server_vad` (Padrão): O servidor detecta o início e fim da fala do usuário, interrompendo a fala do assistente instantaneamente se o usuário começar a falar.
  - Manual (*Push-to-Talk*): A aplicação envia eventos `input_audio_buffer.commit` manualmente.

---

## 3. Catálogo de Eventos da Realtime API

### 3.1. Eventos Enviados pelo Cliente (Client Events)
- `session.update`: Atualiza configurações da sessão (voz, instruções, ferramentas, VAD, formatos).
- `input_audio_buffer.append`: Envia pedaços de áudio PCM16 em base64 para o buffer de entrada.
- `input_audio_buffer.commit`: Força o commit do buffer atual (usado em push-to-talk).
- `input_audio_buffer.clear`: Limpa o buffer de entrada.
- `conversation.item.create`: Injeta mensagens ou resultados de ferramentas no histórico.
- `conversation.item.truncate`: Corta o áudio do assistente quando o usuário interrompe a conversa.
- `response.create`: Solicita a geração imediata de uma resposta de voz/texto.
- `response.cancel`: Cancela uma resposta em andamento.

### 3.2. Eventos Emitidos pelo Servidor (Server Events)
- `session.created` / `session.updated`: Confirmação da configuração da sessão.
- `input_audio_buffer.speech_started`: O servidor detectou que o usuário começou a falar.
- `input_audio_buffer.speech_stopped`: O usuário parou de falar; o buffer foi fechado.
- `response.audio.delta`: Pedaço de áudio PCM16 gerado pelo assistente para reprodução imediata.
- `response.audio_transcript.delta`: Transcrição textual em tempo real do que o assistente está falando.
- `response.function_call_arguments.delta`: Argumentos de ferramentas sendo gerados em streaming.
- `response.done`: Conclusão da resposta atual.
- `error`: Notificação de erro de protocolo ou inferência.

---

## 4. Implementação de Conexão WebSocket em Python

```python
import asyncio
import base64
import json
import os
import websockets

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
URL = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview"

async def realtime_voice_agent():
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "OpenAI-Beta": "realtime=v1"
    }

    async with websockets.connect(URL, extra_headers=headers) as ws:
        print("Conectado à Realtime API!")

        # 1. Configurar a sessão
        session_config = {
            "type": "session.update",
            "session": {
                "modalities": ["audio", "text"],
                "instructions": "Você é um assistente de suporte técnico simpático e objetivo. Fale em português do Brasil.",
                "voice": "alloy",
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
        await ws.send(json.dumps(session_config))

        # 2. Loop de escuta de eventos do servidor
        async def listen_server():
            async for message in ws:
                event = json.loads(message)
                event_type = event.get("type")

                if event_type == "response.audio_transcript.delta":
                    print(event.get("delta"), end="", flush=True)

                elif event_type == "response.audio.delta":
                    audio_bytes = base64.b64decode(event.get("delta"))
                    # Enviar para o speaker / dispositivo de áudio

                elif event_type == "input_audio_buffer.speech_started":
                    print("
[Usuário começou a falar - Interrompendo assistente]")

                elif event_type == "error":
                    print(f"
Erro recebido: {event.get('error')}")

        asyncio.create_task(listen_server())

        # 3. Manter a sessão ativa
        await asyncio.sleep(60)

if __name__ == "__main__":
    asyncio.run(realtime_voice_agent())
```

---

## 5. Arquitetura WebRTC Segura no Navegador com Tokens Efêmeros

Para evitar expor a `OPENAI_API_KEY` no front-end, o servidor cria uma sessão efêmera e retorna o token de curta duração para o navegador estabelecer o canal WebRTC.

### 5.1. Rota de Backend em Node.js (Geração de Token Efêmero)

```typescript
import express from 'express';
import OpenAI from 'openai';

const app = express();
const openai = new OpenAI();

app.post('/api/realtime-token', async (req, res) => {
  try {
    const session = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview',
        voice: 'echo',
      }),
    });

    const data = await session.json();
    // Retorna o token efêmero com segurança para o front-end
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao criar sessão de voz' });
  }
});
```

### 5.2. Front-End WebRTC no Navegador

```typescript
async function iniciarVozWebRTC() {
  // 1. Obter o token efêmero do backend próprio
  const tokenRes = await fetch('/api/realtime-token', { method: 'POST' });
  const tokenData = await tokenRes.json();
  const ephemeralKey = tokenData.client_secret.value;

  // 2. Criar a conexão WebRTC PeerConnection
  const pc = new RTCPeerConnection();

  // 3. Configurar elemento de áudio remoto para reproduzir a voz da IA
  const audioEl = document.createElement('audio');
  audioEl.autoplay = true;
  pc.ontrack = (event) => {
    audioEl.srcObject = event.streams[0];
  };

  // 4. Capturar o microfone local do usuário
  const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  pc.addTrack(localStream.getTracks()[0]);

  // 5. Criar DataChannel para envio e recepção de eventos JSON
  const dc = pc.createDataChannel('oai-events');
  dc.onmessage = (e) => {
    const event = JSON.parse(e.data);
    if (event.type === 'response.audio_transcript.delta') {
      console.log('IA:', event.delta);
    }
  };

  // 6. Estabelecer oferta SDP com a OpenAI
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const baseUrl = 'https://api.openai.com/v1/realtime';
  const model = 'gpt-4o-realtime-preview';
  const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
    method: 'POST',
    body: offer.sdp,
    headers: {
      Authorization: `Bearer ${ephemeralKey}`,
      'Content-Type': 'application/sdp',
    },
  });

  const answer = {
    type: 'answer' as RTCSdpType,
    sdp: await sdpResponse.text(),
  };

  await pc.setRemoteDescription(answer);
  console.log('Canal WebRTC conectado com sucesso!');
}
```
