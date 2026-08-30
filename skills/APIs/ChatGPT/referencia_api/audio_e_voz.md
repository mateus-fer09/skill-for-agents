---
title: Referência de API — Áudio e Voz
description: Especificação técnica dos endpoints /v1/audio/speech, /v1/audio/transcriptions, /v1/audio/translations, /v1/audio/voices e /v1/audio/voice_consents.
topics:
  - api-reference
  - audio-api-reference
  - tts-reference
  - whisper-reference
keywords:
  - POST /v1/audio/speech
  - POST /v1/audio/transcriptions
  - POST /v1/audio/translations
  - POST /v1/audio/voices
  - GET /v1/audio/voices
related:
  - ../multimidia_e_tempo_real/audio_e_transcricao.md
  - ../multimidia_e_tempo_real/realtime_api_webrtc.md
source_scope:
  - https://developers.openai.com/api/reference/resources/audio.md
  - https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create.md
  - https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create.md
  - https://developers.openai.com/api/reference/resources/audio/subresources/translations/methods/create.md
---

# Referência de API — Áudio e Voz

---

## 1. Criar Fala / Text-to-Speech (`POST /v1/audio/speech`)

Gera áudio falado a partir de texto de entrada.

```http
POST /v1/audio/speech
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY
```

### Parâmetros da Requisição

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|---|---|---|---|---|
| `model` | `string` | **Sim** | - | `"tts-1"` ou `"tts-1-hd"`. |
| `input` | `string` | **Sim** | - | Texto a ser falado (máximo de 4.096 caracteres). |
| `voice` | `string` | **Sim** | - | Nome da voz (`alloy`, `ash`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, `verse`). |
| `response_format` | `string` | Não | `"mp3"` | Formato do áudio: `"mp3"`, `"opus"`, `"aac"`, `"flac"`, `"wav"`, `"pcm"`. |
| `speed` | `number` | Não | `1.0` | Velocidade de reprodução de `0.25` a `4.0`. |

---

## 2. Criar Transcrição (`POST /v1/audio/transcriptions`)

Transcreve arquivo de áudio para texto.

```http
POST /v1/audio/transcriptions
Content-Type: multipart/form-data
Authorization: Bearer $OPENAI_API_KEY
```

### Parâmetros (Form Data)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `file` | `file` | **Sim** | Arquivo de áudio binário (`mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, `webm` até 25MB). |
| `model` | `string` | **Sim** | Identificador do modelo (`"whisper-1"`). |
| `language` | `string` | Não | Código ISO-639-1 do idioma falado (ex.: `"pt"`, `"en"`, `"es"`). |
| `prompt` | `string` | Não | Texto opcional para orientar o estilo de transcrição ou vocabulário técnico. |
| `response_format` | `string` | Não | `"json"`, `"text"`, `"srt"`, `"verbose_json"`, `"vtt"`. Padrão: `"json"`. |
| `temperature` | `number` | Não | Amostragem de `0.0` a `1.0`. Padrão: `0`. |
| `timestamp_granularities[]` | `array` | Não | Níveis de timestamp (`["word"]`, `["segment"]` ou ambos). Requer `verbose_json`. |

---

## 3. Criar Tradução (`POST /v1/audio/translations`)

Traduz arquivo de áudio de qualquer idioma diretamente para inglês em formato de texto.

---

## 4. Gerenciamento de Vozes Customizadas (`/v1/audio/voices`)

- `POST /v1/audio/voice_consents`: Cria registro de consentimento formal do locutor.
- `POST /v1/audio/voices`: Cria um perfil de voz customizado a partir de amostras de áudio autorizadas.
- `GET /v1/audio/voices`: Lista vozes customizadas disponíveis na organização.

---

## 5. Referências Cruzadas

- [`../multimidia_e_tempo_real/audio_e_transcricao.md`](../multimidia_e_tempo_real/audio_e_transcricao.md)
- [`../multimidia_e_tempo_real/realtime_api_webrtc.md`](../multimidia_e_tempo_real/realtime_api_webrtc.md)
