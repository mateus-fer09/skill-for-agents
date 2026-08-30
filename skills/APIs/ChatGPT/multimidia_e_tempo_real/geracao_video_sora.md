---
title: Geração de Vídeo com Sora (/v1/videos)
description: Guia de geração, consulta assíncrona (polling), download e gerenciamento de vídeos com o modelo Sora na OpenAI Videos API.
topics:
  - sora
  - video-generation
  - videos-api
  - async-jobs
keywords:
  - /v1/videos
  - sora-1.0
  - client.videos.create
  - client.videos.retrieve
  - prompt
related:
  - ../multimidia_e_tempo_real/visao_e_geracao_imagens.md
  - ../referencia_api/imagens_e_videos.md
source_scope:
  - https://developers.openai.com/api/docs/guides/video-generation.md
  - https://developers.openai.com/api/reference/resources/videos.md
---

# Geração de Vídeo com Sora (OpenAI Videos API)

A **OpenAI Videos API** (`/v1/videos`) permite gerar vídeos cinematográficos hiper-realistas a partir de descrições em texto utilizando o modelo **Sora**.

---

## 1. Ciclo de Vida Assíncrono de Vídeos

A renderização de vídeos de alta definição é um processo computacionalmente intensivo executado de forma assíncrona:

```
1. POST /v1/videos (Envia prompt + parâmetros de resolução/duração)
              |
              v (Retorna video_id com status "queued" ou "in_progress")
2. GET /v1/videos/{video_id} (Polling periódico até status "completed")
              |
              v
3. Download do arquivo MP4 via URL retornada em video.download_url
```

---

## 2. Exemplo Completo em Python

```python
import time
from openai import OpenAI

client = OpenAI()

# 1. Disparar a criação do vídeo
video_job = client.videos.create(
    model="sora-1.0",
    prompt="Câmera sobrevoando uma metrópole futurista com carros voadores e arranha-céus iluminados em neon, estilo cyberpunk 4k realista.",
    resolution="1080p",     # "720p", "1080p"
    aspect_ratio="16:9",   # "16:9", "9:16", "1:1"
    duration_seconds=5     # Duração em segundos
)

print(f"Vídeo iniciado com ID: {video_job.id}. Status: {video_job.status}")

# 2. Polling até a conclusão
while video_job.status in ["queued", "in_progress"]:
    time.sleep(5)
    video_job = client.videos.retrieve(video_job.id)
    print(f"Progresso: {video_job.status} ({getattr(video_job, 'progress', 0)}%)")

if video_job.status == "completed":
    print(f"Vídeo pronto para download em: {video_job.download_url}")
else:
    print(f"Falha na geração do vídeo: {video_job.error}")
```

---

## 3. Parâmetros de Configuração de Vídeo

| Parâmetro | Tipo | Valores Aceitos | Padrão |
|---|---|---|---|
| `model` | `string` | `"sora-1.0"` | Obrigatório |
| `prompt` | `string` | Descrição detalhada da cena, ângulos de câmera e iluminação | Obrigatório |
| `resolution` | `string` | `"720p"`, `"1080p"` | `"1080p"` |
| `aspect_ratio` | `string` | `"16:9"` (horizontal), `"9:16"` (vertical/reels), `"1:1"` (quadrado) | `"16:9"` |
| `duration_seconds` | `integer` | `5` a `20` segundos | `5` |

---

## 4. Referências Cruzadas

- [`../multimidia_e_tempo_real/visao_e_geracao_imagens.md`](../multimidia_e_tempo_real/visao_e_geracao_imagens.md)
- [`../referencia_api/imagens_e_videos.md`](../referencia_api/imagens_e_videos.md)
