---
title: Áudio, Text-to-Speech (TTS) e Transcrição (Whisper)
description: Síntese de voz com Text-to-Speech (/v1/audio/speech), transcrição e tradução com Whisper (/v1/audio/transcriptions, /v1/audio/translations) e gerenciamento de vozes customizadas.
topics:
  - audio
  - text-to-speech
  - whisper
  - speech-to-text
  - voice-consents
keywords:
  - /v1/audio/speech
  - /v1/audio/transcriptions
  - /v1/audio/translations
  - tts-1
  - tts-1-hd
  - whisper-1
  - voices
related:
  - ../multimidia_e_tempo_real/realtime_api_webrtc.md
  - ../multimidia_e_tempo_real/realtime_api_websocket.md
  - ../referencia_api/audio_e_voz.md
source_scope:
  - https://developers.openai.com/api/docs/guides/audio.md
  - https://developers.openai.com/api/docs/guides/text-to-speech.md
  - https://developers.openai.com/api/docs/guides/speech-to-text.md
  - https://developers.openai.com/api/docs/guides/transcription.md
---

# Áudio, Text-to-Speech (TTS) e Transcrição (Whisper)

A OpenAI oferece endpoints especializados para síntese de voz natural e transcrição precisa de áudio em dezenas de idiomas.

---

## 1. Text-to-Speech (TTS) — `/v1/audio/speech`

Converte texto escrito em áudio falado natural em múltiplos formatos (`mp3`, `opus`, `aac`, `flac`, `wav`, `pcm`).

### Modelos Disponíveis
- `tts-1`: Otimizado para baixa latência em aplicações de tempo real.
- `tts-1-hd`: Otimizado para máxima fidelidade e clareza acústica.

### Vozes Oficiais Disponíveis
`alloy`, `ash`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, `verse`.

### Exemplo em Python (TTS)

```python
from openai import OpenAI

client = OpenAI()

# Gerar arquivo de áudio falado
audio_response = client.audio.speech.create(
    model="tts-1",
    voice="coral",
    input="Bem-vindo à plataforma de inteligência artificial da OpenAI. Como posso ajudar hoje?",
    response_format="mp3",
    speed=1.0
)

# Salvar arquivo em disco
audio_response.stream_to_file("boas_vindas.mp3")
print("Áudio salvo com sucesso!")
```

---

## 2. Transcrição com Whisper — `/v1/audio/transcriptions`

Transcreve arquivos de áudio gravados para texto com carimbos de data/hora (*timestamps*) por palavra ou segmento.

### Formatos de Arquivo Suportados
`mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, `webm` (limite de até 25 MB por requisição).

### Exemplo de Transcrição com Timestamps em Python

```python
with open("gravacao_reuniao.mp3", "rb") as arquivo_audio:
    transcricao = client.audio.transcriptions.create(
        model="whisper-1",
        file=arquivo_audio,
        response_format="verbose_json",
        timestamp_granularities=["word", "segment"],
        language="pt"
    )

print("Texto completo:")
print(transcricao.text)

print("\nSegmentos identificados:")
for seg in transcricao.segments:
    print(f"[{seg['start']:.2f}s -> {seg['end']:.2f}s]: {seg['text']}")
```

---

## 3. Tradução de Áudio — `/v1/audio/translations`

Traduz áudio falado em qualquer idioma suportado diretamente para texto em inglês:

```python
with open("entrevista_frances.mp3", "rb") as audio_fr:
    traducao = client.audio.translations.create(
        model="whisper-1",
        file=audio_fr
    )

print("Transcrição traduzida para inglês:")
print(traducao.text)
```

---

## 4. Gestão de Vozes Customizadas e Voice Consents

Para criar vozes clonadas autorizadas ou personalizadas em aplicações corporativas, a OpenAI disponibiliza endpoints para gerenciar termos de consentimento formal do locutor (`/v1/audio/voice_consents`) antes do registro da voz (`/v1/audio/voices`).

---

## 5. Referências Cruzadas

- [`../multimidia_e_tempo_real/realtime_api_webrtc.md`](../multimidia_e_tempo_real/realtime_api_webrtc.md)
- [`../multimidia_e_tempo_real/realtime_api_websocket.md`](../multimidia_e_tempo_real/realtime_api_websocket.md)
- [`../referencia_api/audio_e_voz.md`](../referencia_api/audio_e_voz.md)
- [`../exemplos/realtime_audio_streaming.md`](../exemplos/realtime_audio_streaming.md)
