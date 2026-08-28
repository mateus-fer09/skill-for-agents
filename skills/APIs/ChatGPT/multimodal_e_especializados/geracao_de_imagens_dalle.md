---
title: "Geração, Edição e Variação de Imagens com DALL-E 3 e DALL-E 2"
description: "Guia completo da Images API da OpenAI. Geração de imagens de alta resolução com DALL-E 3 (/v1/images/generations), formatos widescreen/portrait, qualidades standard e hd, estilos vivid e natural, inspeção do prompt revisado (revised_prompt), edição com máscara e variações com DALL-E 2."
topics: ["dall-e-3", "dall-e-2", "images-api", "image-generation", "image-edits", "image-variations", "prompt-engineering"]
keywords: ["/v1/images/generations", "/v1/images/edits", "/v1/images/variations", "dall-e-3", "revised_prompt", "quality: hd", "style: vivid"]
source_scope: "OpenAI API Docs: Guides > Images (DALL-E 3 & DALL-E 2) & Image Generation API"
---

# Geração, Edição e Variação de Imagens com DALL-E 3 e DALL-E 2

A **Images API** permite gerar imagens fotorrealistas ou artísticas a partir de descrições textuais (*DALL-E 3*), além de editar imagens existentes com máscaras transparentes e criar variações visuais (*DALL-E 2*).

---

## 1. DALL-E 3 vs DALL-E 2: Comparação de Recursos

| Recurso / Parâmetro | DALL-E 3 | DALL-E 2 |
| :--- | :--- | :--- |
| **Endpoint Principal** | `POST /v1/images/generations` | `POST /v1/images/generations`, `edits`, `variations` |
| **Resoluções Suportadas** | `1024x1024` (Quadrado)<br>`1024x1792` (Vertical/Portrait)<br>`1792x1024` (Widescreen/Landscape) | `256x256`, `512x512`, `1024x1024` |
| **Níveis de Qualidade** | `"standard"` e `"hd"` (Maior nível de detalhes e iluminação) | Apenas standard |
| **Estilos Visuais** | `"vivid"` (Hiper-realista, cores vibrantes)<br>`"natural"` (Tons neutros e naturais) | Estilo padrão único |
| **Prompt Expansion** | Reescreve e enriquece o prompt automaticamente (`revised_prompt`) | Utiliza o prompt estrito fornecido |
| **Imagens por Requisição (`n`)** | **`n=1` obrigatório** | Suporta `n=1` até `n=10` |
| **Edição e Variação** | Não suportado | Suportado via `/v1/images/edits` e `/v1/images/variations` |

---

## 2. Geração de Imagens com DALL-E 3

### 2.1. Implementação em Python

```python
from openai import OpenAI

client = OpenAI()

response = client.images.generate(
    model="dall-e-3",
    prompt="Uma estação espacial futurista orbitando Saturno, com anéis iluminados por luz estelar difusa, estilo cinematográfico em alta definição.",
    size="1792x1024",       # '1024x1024', '1024x1792' ou '1792x1024'
    quality="hd",           # 'standard' ou 'hd'
    style="vivid",          # 'vivid' ou 'natural'
    response_format="url",  # 'url' (válida por 1 hora) ou 'b64_json'
    n=1
)

# URL temporária da imagem gerada
image_url = response.data[0].url

# O prompt detalhado expandido pelo modelo
revised_prompt = response.data[0].revised_prompt

print("URL da Imagem:", image_url)
print("
Prompt Revisado pelo DALL-E 3:
", revised_prompt)
```

### 2.2. Geração com Retorno Base64 para Armazenamento Local

```python
import base64
from openai import OpenAI

client = OpenAI()

response = client.images.generate(
    model="dall-e-3",
    prompt="Logotipo minimalista para uma startup de inteligência artificial quântica, fundo escuro, vetor limpo.",
    size="1024x1024",
    response_format="b64_json",
)

image_b64 = response.data[0].b64_json

# Grava diretamente em arquivo PNG local
with open("logo_gerado.png", "wb") as f:
    f.write(base64.b64decode(image_b64))

print("Imagem salva com sucesso em 'logo_gerado.png'!")
```

---

## 3. Edição de Imagens com DALL-E 2 (Inpainting / Edits)

O endpoint `/v1/images/edits` permite modificar uma imagem existente substituindo áreas transparentes definidas por uma máscara.

### Requisitos de Arquivo para Edição
- Ambos os arquivos (`image` e `mask`) devem ser imagens PNG quadradas válidas com tamanho inferior a 4 MB.
- A máscara deve conter um canal alpha (transparência) onde as edições devem ocorrer.

```python
from openai import OpenAI

client = OpenAI()

response = client.images.edit(
    model="dall-e-2",
    image=open("sala_estar.png", "rb"),
    mask=open("mascara_sofa_transparente.png", "rb"),
    prompt="Um sofá moderno de couro marrom vintage com duas almofadas amarelas.",
    n=1,
    size="1024x1024"
)

print("Imagem editada:", response.data[0].url)
```

---

## 4. Variações de Imagens com DALL-E 2

Gera novas versões com composição e paleta de cores similares a uma imagem base:

```python
response = client.images.generate_variation(
    model="dall-e-2",
    image=open("foto_original.png", "rb"),
    n=2,
    size="1024x1024"
)

for i, data in enumerate(response.data):
    print(f"Variação {i+1}: {data.url}")
```

---

## 5. Implementação em TypeScript / Node.js

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

async function gerarBanner() {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: 'Paisagem digital de montanhas cibernéticas com linhas de código brilhantes e aurora boreal neon.',
    n: 1,
    size: '1792x1024',
    quality: 'hd',
    style: 'vivid',
  });

  console.log('URL da Imagem:', response.data[0]?.url);
  console.log('Prompt Enriquecido:', response.data[0]?.revised_prompt);
}

gerarBanner();
```
