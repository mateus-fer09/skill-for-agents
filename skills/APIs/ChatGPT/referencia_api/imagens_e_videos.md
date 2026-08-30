---
title: Referência de API — Imagens & Vídeos (Sora)
description: Especificação técnica dos endpoints /v1/images/generations, /v1/images/edits, /v1/images/variations e /v1/videos/* (Sora API).
topics:
  - api-reference
  - images-api-reference
  - videos-api-reference
  - sora-reference
keywords:
  - POST /v1/images/generations
  - POST /v1/images/edits
  - POST /v1/images/variations
  - POST /v1/videos
  - GET /v1/videos/{video_id}
related:
  - ../multimidia_e_tempo_real/visao_e_geracao_imagens.md
  - ../multimidia_e_tempo_real/geracao_video_sora.md
source_scope:
  - https://developers.openai.com/api/reference/resources/images.md
  - https://developers.openai.com/api/reference/resources/videos.md
---

# Referência de API — Imagens & Vídeos (Sora)

---

## 1. Geração de Imagens (`POST /v1/images/generations`)

```http
POST /v1/images/generations
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY
```

### Parâmetros

| Campo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `prompt` | `string` | **Obrigatório** | Descrição em texto da imagem desejada. |
| `model` | `string` | `"gpt-image-1"` | `"gpt-image-1"`, `"dall-e-3"`, `"dall-e-2"`. |
| `n` | `integer` | `1` | Número de imagens a gerar (1 para DALL-E 3). |
| `quality` | `string` | `"standard"` | `"standard"` ou `"hd"`. |
| `response_format` | `string` | `"url"` | `"url"` ou `"b64_json"`. |
| `size` | `string` | `"1024x1024"` | `"1024x1024"`, `"1792x1024"`, `"1024x1792"`. |

---

## 2. Edição de Imagens (`POST /v1/images/edits`)

```http
POST /v1/images/edits
Content-Type: multipart/form-data
Authorization: Bearer $OPENAI_API_KEY
```

- `image`: Arquivo PNG original (< 4MB).
- `mask`: Arquivo PNG com transparência (< 4MB) demarcando a área a ser editada.
- `prompt`: Instrução textual da alteração.

---

## 3. Geração de Vídeo com Sora (`POST /v1/videos`)

```http
POST /v1/videos
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY

{
  "model": "sora-1.0",
  "prompt": "Cena cinematográfica em 4k de drone sobrevoando floresta tropical ao nascer do sol.",
  "resolution": "1080p",
  "aspect_ratio": "16:9",
  "duration_seconds": 5
}
```

### Endpoints de Consulta e Gestão de Vídeos
- `GET /v1/videos/{video_id}`: Consulta status e obtém URL de download.
- `GET /v1/videos`: Lista vídeos gerados na conta.
- `DELETE /v1/videos/{video_id}`: Remove arquivo de vídeo armazenado.

---

## 4. Referências Cruzadas

- [`../multimidia_e_tempo_real/visao_e_geracao_imagens.md`](../multimidia_e_tempo_real/visao_e_geracao_imagens.md)
- [`../multimidia_e_tempo_real/geracao_video_sora.md`](../multimidia_e_tempo_real/geracao_video_sora.md)
