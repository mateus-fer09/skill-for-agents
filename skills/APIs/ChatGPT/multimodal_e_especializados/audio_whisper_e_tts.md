---
title: "Áudio, Transcrição (Whisper) e Síntese de Voz (TTS)"
description: "Guia completo de processamento de áudio na OpenAI API. Transcrição e tradução de fala para texto com Whisper-1 (/v1/audio/transcriptions e /v1/audio/translations), granularidade de timestamps de palavra e segmento, síntese de fala com TTS-1 e TTS-1-HD (/v1/audio/speech), vozes naturais, formatos de áudio e streaming."
topics: ["audio", "whisper", "speech-to-text", "text-to-speech", "tts", "timestamps", "voice-synthesis", "translations"]
keywords: ["whisper-1", "tts-1", "tts-1-hd", "/v1/audio/transcriptions", "/v1/audio/speech", "timestamp_granularities", "alloy", "echo", "nova"]
source_scope: "OpenAI API Docs: Guides > Speech to Text (Whisper) & Text to Speech (TTS)"
---

# Áudio, Transcrição (Whisper) e Síntese de Voz (TTS)

A OpenAI disponibiliza endpoints dedicados de processamento de áudio para conversão de fala em texto (*Speech-to-Text*) e geração de voz ultra-realista a partir de texto (*Text-to-Speech*).

---

## 1. Speech-to-Text: Transcrição com Whisper (`whisper-1`)

O modelo `whisper-1` transcreve áudios em mais de 98 idiomas com alta precisão e resistência a ruídos de fundo.

### 1.1. Endpoints Disponíveis
- `POST /v1/audio/transcriptions`: Transcreve o áudio mantendo o idioma original.
- `POST /v1/audio/translations`: Transcreve e traduz qualquer áudio em idioma estrangeiro diretamente para o inglês.

### 1.2. Parâmetros da Requisição

| Parâmetro | Tipo | Descrição |
| :--- | :--- | :--- |
| **`file`** | File (Binário) | Arquivo de áudio (`mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, `webm`). Máximo de **25 MB**. |
| **`model`** | String | Deve ser `"whisper-1"`. |
| **`language`** | String | Código ISO-639-1 do idioma falado (ex: `"pt"`, `"en"`, `"es"`). Melhora a precisão e reduz a latência. |
| **`prompt`** | String | Texto guia para orientar a ortografia de termos técnicos, marcas, jargões ou pontuação desejada. |
| **`response_format`** | String | `"json"` (Padrão), `"text"`, `"srt"`, `"verbose_json"`, `"vtt"`. |
| **`temperature`** | Float | De `0.0` a `1.0`. Valores mais baixos geram transcrições mais literais e consistentes. |
| **`timestamp_granularities[]`** | Array | Requer `response_format="verbose_json"`. Suporta `["word"]`, `["segment"]` ou ambos para legendagem sincronizada. |

---

### 1.3. Implementação de Transcrição em Python com Timestamps de Palavra

```python
from openai import OpenAI

client = OpenAI()

# Abre o arquivo de áudio local
with open("entrevista_podcast.mp3", "rb") as audio_file:
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        language="pt",
        response_format="verbose_json",
        timestamp_granularities=["word", "segment"],
        prompt="Transcrição de podcast técnico sobre Kubernetes, Docker e CI/CD."
    )

# Exibe o texto completo
print("Texto Transcrito:
", transcription.text)

# Exibe timestamps de segmentos para legendagem
print("
--- Segmentos de Áudio ---")
for segment in transcription.segments:
    print(f"[{segment['start']:.2f}s -> {segment['end']:.2f}s]: {segment['text']}")

# Exibe timestamps granulares por palavra
if hasattr(transcription, "words") and transcription.words:
    print("
--- Timestamps por Palavra (Amostra) ---")
    for word in transcription.words[:5]:
        print(f"Palavra: '{word['word']}' ({word['start']}s -> {word['end']}s)")
```

---

## 2. Text-to-Speech: Síntese de Fala (`tts-1` e `tts-1-hd`)

O endpoint `POST /v1/audio/speech` gera áudio falado fotorrealista a partir de texto.

### 2.1. Modelos e Vozes

- **Modelos:**
  - `tts-1`: Otimizado para baixíssima latência (ideal para streaming em aplicações em tempo real).
  - `tts-1-hd`: Otimizado para máxima fidelidade acústica, eliminação de artefatos e projetos de pós-produção/audiolivros.
- **Vozes Disponíveis:** `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`.
- **Formatos de Saída:**
  - `mp3` (Padrão): Alta compatibilidade universal.
  - `opus`: Ideal para streaming em tempo real na web e VoIP (baixa latência).
  - `aac`: Otimizado para compressão em ecossistemas Apple e YouTube.
  - `flac`: Áudio sem perdas (*lossless*) para arquivamento e pós-processamento.
  - `wav` / `pcm`: Áudio sem compressão (24kHz, 16-bit mono).

---

### 2.2. Implementação de Síntese de Voz em Python

```python
from pathlib import Path
from openai import OpenAI

client = OpenAI()

speech_file_path = Path(__file__).parent / "alerta_sistema.mp3"

response = client.audio.speech.create(
    model="tts-1-hd",
    voice="nova", # 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'
    input="Atenção: A transação financeira foi concluída com sucesso. Seu saldo foi atualizado.",
    response_format="mp3",
    speed=1.05 # Velocidade de 0.25 a 4.0 (1.0 padrão)
)

# Salva o arquivo de áudio no disco
response.stream_to_file(speech_file_path)
print(f"Áudio salvo em: {speech_file_path}")
```

### 2.3. Implementação em TypeScript / Node.js (Streaming Direto)

```typescript
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI();

async function gerarAudio() {
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: 'Bem-vindo ao sistema de atendimento automatizado. Como posso ajudar você hoje?',
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  const filePath = path.resolve('./boas_vindas.mp3');
  await fs.promises.writeFile(filePath, buffer);
  console.log(`Áudio gerado em: ${filePath}`);
}

gerarAudio();
```

---

## 3. Tradução Direta de Áudio com Whisper

Para traduzir um áudio em espanhol, francês, alemão ou qualquer outro idioma para texto em inglês:

```python
with open("conversa_alemao.mp3", "rb") as audio:
    translation = client.audio.translations.create(
        model="whisper-1",
        file=audio
    )
print("Tradução para o Inglês:
", translation.text)
```
