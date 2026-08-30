---
title: Visão Computacional e Geração/Edição de Imagens
description: Análise de imagens com modelos multimodais (GPT-5.6 / GPT-4.1) e geração, edição e variações de imagens com GPT-image-1 e DALL-E 3 (/v1/images/*).
topics:
  - computer-vision
  - image-generation
  - dall-e-3
  - gpt-image-1
  - image-edits
keywords:
  - /v1/images/generations
  - /v1/images/edits
  - /v1/images/variations
  - dall-e-3
  - gpt-image-1
  - vision
  - image_url
related:
  - ../multimidia_e_tempo_real/geracao_video_sora.md
  - ../responses_api/introducao_e_quickstart.md
  - ../referencia_api/imagens_e_videos.md
source_scope:
  - https://developers.openai.com/api/docs/guides/images-vision.md
  - https://developers.openai.com/api/docs/guides/image-generation.md
  - https://developers.openai.com/api/docs/guides/tools-image-generation.md
---

# Visão Computacional e Geração/Edição de Imagens

A OpenAI integra capacidades completas de compreensão visual e síntese gráfica de alta fidelidade.

---

## 1. Visão Computacional (Compreensão de Imagens)

Modelos como `gpt-5.6` e `gpt-4.1` recebem imagens via URL pública ou string codificada em Base64 diretamente no `input`:

### Exemplo em Python (Análise de Imagem)

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Descreva o diagrama de arquitetura nesta imagem e liste possíveis gargalos de infraestrutura."},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://meusite.com/diagrama-arquitetura.png",
                        "detail": "high"  # "low", "high" ou "auto"
                    }
                }
            ]
        }
    ]
)

print(response.output_text)
```

---

## 2. Geração de Imagens — `/v1/images/generations`

Gera novas imagens a partir de prompts descritivos com `gpt-image-1` ou `dall-e-3`:

### Exemplo em Python

```python
resposta_imagem = client.images.generate(
    model="gpt-image-1",
    prompt="Ilustração conceitual moderna em 3D de um assistente de IA modular processando dados em nuvem, iluminação suave, fundo minimalista.",
    size="1024x1024",
    quality="standard",
    n=1,
    response_format="url"
)

url_gerada = resposta_imagem.data[0].url
print("URL da imagem gerada:", url_gerada)
```

---

## 3. Edição e Variação de Imagens — `/v1/images/edits`

Permite editar partes específicas de uma imagem existente fornecendo uma máscara (*mask*) ou instrução de alteração:

```python
with open("imagem_original.png", "rb") as img, open("mascara.png", "rb") as mask:
    imagem_editada = client.images.edit(
        image=img,
        mask=mask,
        prompt="Substitua o fundo por uma vista panorâmica de montanhas ao entardecer.",
        size="1024x1024"
    )

print("Imagem editada:", imagem_editada.data[0].url)
```

---

## 4. Referências Cruzadas

- [`../multimidia_e_tempo_real/geracao_video_sora.md`](../multimidia_e_tempo_real/geracao_video_sora.md)
- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
- [`../referencia_api/imagens_e_videos.md`](../referencia_api/imagens_e_videos.md)
