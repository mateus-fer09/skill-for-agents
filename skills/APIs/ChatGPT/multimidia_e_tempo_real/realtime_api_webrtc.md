---
title: Realtime API com WebRTC (Navegadores e Mobile)
description: Como conectar aplicações web e mobile diretamente à OpenAI Realtime API usando WebRTC, tokens de sessão efêmeros e áudio bidirecional de ultra-baixa latência.
topics:
  - realtime-api
  - webrtc
  - browser-audio
  - ephemeral-tokens
keywords:
  - Realtime API
  - WebRTC
  - RTCPeerConnection
  - client_secret
  - /v1/realtime/client_secrets
related:
  - ../multimidia_e_tempo_real/realtime_api_websocket.md
  - ../multimidia_e_tempo_real/realtime_sip_e_telefonia.md
  - ../multimidia_e_tempo_real/audio_e_transcricao.md
source_scope:
  - https://developers.openai.com/api/docs/guides/realtime-webrtc.md
  - https://developers.openai.com/api/docs/guides/realtime.md
  - https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets.md
---

# Realtime API com WebRTC (Navegadores e Aplicações Cliente)

A **OpenAI Realtime API com WebRTC** permite estabelecer conversas de voz bidirecionais de ultra-baixa latência (< 300ms) diretamente entre o navegador do usuário (ou aplicativo mobile) e os modelos de voz da OpenAI, sem intermediar streaming de áudio bruto no seu servidor.

---

## 1. Arquitetura Segura de Sessão Efêmera

Para nunca expor a chave secreta principal `OPENAI_API_KEY` no front-end:

```
1. [Navegador do Usuário]  ---> GET /api/session (Seu Backend)
2. [Seu Servidor Backend]   ---> POST https://api.openai.com/v1/realtime/client_secrets
3. [OpenAI API]             ---> Retorna token efêmero de curta duração (válido por 1 min)
4. [Seu Servidor Backend]   ---> Entrega token efêmero ao Navegador
5. [Navegador do Usuário]  ---> Inicia handshake SDP WebRTC direto com OpenAI
6. [Navegador <---> OpenAI] ---> Streaming de áudio e dados peer-to-peer via WebRTC
```

---

## 2. Passo 1: Gerando o Token Efêmero no Backend (Node.js)

```typescript
import express from "express";
import OpenAI from "openai";

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/api/session", async (req, res) => {
  const session = await openai.realtime.clientSecrets.create({
    model: "gpt-4o-realtime-preview",
    voice: "coral",
    instructions: "Você é um assistente de atendimento fluente e prestativo."
  });

  res.json({ client_secret: session.value });
});

app.listen(3000);
```

---

## 3. Passo 2: Conectando via WebRTC no Front-End (JavaScript)

```javascript
async function iniciarConversaRealtime() {
  // 1. Obter token efêmero do seu backend
  const tokenResponse = await fetch("/api/session");
  const data = await tokenResponse.json();
  const ephemeralKey = data.client_secret;

  // 2. Criar RTCPeerConnection
  const pc = new RTCPeerConnection();

  // 3. Capturar áudio do microfone do usuário
  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  pc.addTrack(mediaStream.getTracks()[0]);

  // 4. Receber áudio do modelo e tocar nos alto-falantes
  const audioEl = document.createElement("audio");
  audioEl.autoplay = true;
  pc.ontrack = (event) => {
    audioEl.srcObject = event.streams[0];
  };

  // 5. Criar Data Channel para eventos estruturados e tools
  const dc = pc.createDataChannel("oai-events");
  dc.onmessage = (event) => {
    const realtimeEvent = JSON.parse(event.data);
    console.log("Evento recebido da OpenAI:", realtimeEvent);
  };

  // 6. Negociação de SDP (Offer / Answer)
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const baseUrl = "https://api.openai.com/v1/realtime";
  const model = "gpt-4o-realtime-preview";
  const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
    method: "POST",
    body: offer.sdp,
    headers: {
      Authorization: `Bearer ${ephemeralKey}`,
      "Content-Type": "application/sdp"
    }
  });

  const answer = {
    type: "answer",
    sdp: await sdpResponse.text()
  };
  await pc.setRemoteDescription(answer);

  console.log("Conexão WebRTC Realtime estabelecida com sucesso!");
}
```

---

## 4. Voice Activity Detection (VAD) Automático

Por padrão, a OpenAI aplica detecção de atividade de voz no servidor (*Server VAD*), interrompendo automaticamente a fala do modelo quando o usuário começa a falar (*barge-in*).

---

## 5. Referências Cruzadas

- [`../multimidia_e_tempo_real/realtime_api_websocket.md`](../multimidia_e_tempo_real/realtime_api_websocket.md)
- [`../multimidia_e_tempo_real/realtime_sip_e_telefonia.md`](../multimidia_e_tempo_real/realtime_sip_e_telefonia.md)
- [`../referencia_api/realtime_calls_e_webhooks.md`](../referencia_api/realtime_calls_e_webhooks.md)
