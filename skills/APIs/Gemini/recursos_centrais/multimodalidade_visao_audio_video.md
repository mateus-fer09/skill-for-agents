---
title: Multimodalidade Nativa — Visão, Áudio, Vídeo e Documentos PDF
description: Guia completo para processamento e raciocínio multimodal unificado com a Google Gemini API. Cobre imagens (PNG/JPEG/WEBP), áudio (MP3/WAV/AAC) com timestamps, vídeos longos (MP4) e documentos PDF complexos com tabelas e gráficos.
---

# Multimodalidade Nativa — Visão, Áudio, Vídeo e Documentos PDF

## 1. Visão Geral da Multimodalidade no Gemini

Diferente de modelos tradicionais que acoplam módulos OCR ou transcritores externos, o Gemini foi treinado de forma nativamente multimodal. Isso significa que ele processa texto, imagens, sinais de áudio e fluxos de vídeo no mesmo espaço latente de representação.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        ENTRADAS MULTIMODAIS                            │
│  [ Imagens (PNG/JPG) ]   [ Áudios (WAV/MP3) ]   [ Vídeos / PDFs ]      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     MODELO MULTIMODAL GEMINI                           │
│     (Processamento nativo unificado no mesmo espaço de tokens)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SAÍDA GERADA (Texto / JSON)                     │
│  - Raciocínio visual, Bounding Boxes, Transcrições com Timestamps      │
│  - Extração de tabelas, Análise de gráficos e Sumarização temporal     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Processamento de Imagens (Visão Computacional)

O Gemini suporta formatos `image/png`, `image/jpeg`, `image/webp`, `image/heic` e `image/heif`.

### 2.1. Envio de Imagens Inline (Base64 / Bytes)

#### Python (`google-genai`)
```python
from google import genai
from google.genai import types

client = genai.Client()

# Carregar arquivo de imagem local em bytes
with open("grafico_vendas.png", "rb") as f:
    image_bytes = f.read()

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[
        types.Part.from_bytes(
            data=image_bytes,
            mime_type="image/png"
        ),
        "Analise este gráfico e descreva a tendência de crescimento do Q3 vs Q4."
    ]
)

print(response.text)
```

#### TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';

const ai = new GoogleGenAI({});

async function analyzeImage() {
  const imageBuffer = fs.readFileSync('grafico_vendas.png');
  const base64Image = imageBuffer.toString('base64');

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        inlineData: {
          mimeType: 'image/png',
          data: base64Image,
        },
      },
      'Analise este gráfico e descreva a tendência de crescimento do Q3 vs Q4.',
    ],
  });

  console.log(response.text);
}

analyzeImage().catch(console.error);
```

### 2.2. Detecção e Bounding Boxes
O Gemini pode detectar objetos e retornar coordenadas normalizadas `[ymin, xmin, ymax, xmax]` em uma escala de `0` a `1000`.

```python
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
        "Localize todas as pessoas e carros nesta imagem. Retorne uma lista JSON com o rótulo e as coordenadas no formato [ymin, xmin, ymax, xmax]."
    ],
    config=types.GenerateContentConfig(
        response_mime_type="application/json"
    )
)
print(response.text)
```

---

## 3. Processamento de Áudio e Fala

Formatos suportados: `audio/mp3`, `audio/wav`, `audio/aac`, `audio/ogg`, `audio/flac`.

### 3.1. Transcrição e Análise com Timestamps

#### Python (`google-genai`)
```python
from google import genai

client = genai.Client()

# Upload do arquivo de áudio via Files API
audio_file = client.files.upload(file="reuniao_estrategica.mp3")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[
        audio_file,
        "Transcreva os principais pontos discutidos nesta reunião, informando os timestamps [MM:SS] de cada decisão tomada."
    ]
)

print(response.text)
```

#### TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function processAudio() {
  const audioFile = await ai.files.upload({
    file: 'reuniao_estrategica.mp3',
    mimeType: 'audio/mp3',
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      audioFile,
      'Transcreva os principais pontos discutidos nesta reunião, informando os timestamps [MM:SS] de cada decisão tomada.',
    ],
  });

  console.log(response.text);
}

processAudio().catch(console.error);
```

---

## 4. Processamento de Vídeos Longos

O Gemini pode analisar vídeos de até várias horas (Gemini 1.5 Pro / 2.0 Flash) através da Files API. Ele extrai áudio e quadros de vídeo simultaneamente.

### 4.1. Fluxo de Vídeo com Polling de Processamento

#### Python (`google-genai`)
```python
import time
from google import genai

client = genai.Client()

# 1. Upload do vídeo via Files API
video_file = client.files.upload(file="palestra_tecnica.mp4")
print(f"Vídeo enviado: {video_file.name}. Aguardando processamento...")

# 2. Polling até que o vídeo atinja o estado ACTIVE
while video_file.state.name == "PROCESSING":
    time.sleep(5)
    video_file = client.files.get(name=video_file.name)

if video_file.state.name == "FAILED":
    raise ValueError("Falha no processamento do vídeo.")

print("Vídeo pronto para análise!")

# 3. Consulta temporal ao vídeo
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[
        video_file,
        "Descreva o que o palestrante desenha no quadro aos 04:32 e resuma a conclusão final."
    ]
)

print(response.text)
```

---

## 5. Processamento de Documentos Complexos (PDFs)

O Gemini processa documentos de até 1.000 páginas nativamente, interpretando texto corrido, tipografia, notas de rodapé, tabelas multi-colunares e diagramas sem necessidade de conversão prévia para texto puro.

#### Python (`google-genai`)
```python
from google import genai

client = genai.Client()

# Upload de relatório financeiro em PDF
pdf_file = client.files.upload(file="relatorio_anual_2025.pdf")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[
        pdf_file,
        "Extraia a tabela do balanço patrimonial da página 42 no formato de tabela Markdown."
    ]
)

print(response.text)
```

#### cURL / REST API
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"   -H "Content-Type: application/json"   -H "x-goog-api-key: $GEMINI_API_KEY"   -d '{
    "contents": [{
      "parts": [
        {"file_data": {"mime_type": "application/pdf", "file_uri": "https://generativelanguage.googleapis.com/v1beta/files/abc123"}},
        {"text": "Extraia a tabela do balanço patrimonial da página 42."}
      ]
    }]
  }'
```
