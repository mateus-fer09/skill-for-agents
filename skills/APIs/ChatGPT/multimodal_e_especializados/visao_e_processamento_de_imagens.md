---
title: "Visão Computacional e Processamento de Imagens com GPT-4o"
description: "Guia exaustivo de visão computacional na OpenAI API com GPT-4o e GPT-4o-mini. Ingestão de imagens via URLs remotas e strings Base64, parâmetros de detalhe (low, high, auto), fórmula matemática de cálculo de tokens em tiles de 512x512, comparação multi-imagens, OCR e extração estruturada de diagramas e tabelas."
topics: ["visao", "vision", "gpt-4o", "image_url", "base64", "detail-parameter", "token-cost", "ocr", "multimodal"]
keywords: ["image_url", "detail: high", "detail: low", "data:image/jpeg;base64", "gpt-4o vision", "tile calculation"]
source_scope: "OpenAI API Docs: Guides > Vision, Image Understanding & Token Counting Formulas"
---

# Visão Computacional e Processamento de Imagens com GPT-4o

O **GPT-4o** e o **GPT-4o-mini** possuem compreensão visual nativa de ponta a ponta, permitindo processar imagens, gráficos, capturas de tela, documentos escaneados e diagramas de arquitetura junto com prompts textuais na mesma requisição.

---

## 1. Métodos de Ingestão de Imagens

As imagens podem ser fornecidas de duas formas no array de conteúdo (`content`):
1. **URL Pública Remota:** O servidor da OpenAI faz o download direto da URL fornecida via HTTPS.
2. **String Base64:** Os bytes da imagem são codificados localmente em Base64 no formato `data:image/<formato>;base64,<dados>`.

### Formatos e Tamanhos Suportados
- **Formatos:** PNG (`image/png`), JPEG/JPG (`image/jpeg`), WEBP (`image/webp`), GIF não animado (`image/gif`).
- **Tamanho Máximo de Arquivo:** Até 20 MB por imagem.

---

## 2. Parâmetro `detail` e Cálculo Matemático de Tokens

O parâmetro `detail` controla a fidelidade de resolução e o consumo de tokens:

| Valor de `detail` | Comportamento | Resolução Máxima | Consumo Fixo de Tokens |
| :--- | :--- | :--- | :--- |
| **`low`** | O modelo analisa uma versão reduzida em baixa resolução. | 512 x 512 pixels | **85 tokens fixos** (independentemente do tamanho original) |
| **`high`** | O modelo analisa a imagem original em blocos/tiles de alta fidelidade. | Até 2048 x 2048 px escalada | **85 tokens base + (170 tokens × número de tiles)** |
| **`auto` (Padrão)** | O modelo decide dinamicamente entre `low` ou `high` com base nas dimensões da imagem. | Dinâmico | Calculado automaticamente |

### 2.1. Fórmula de Cálculo de Tokens no Modo `high`
1. Se a imagem ultrapassar `2048 x 2048`, ela é redimensionada proporcionalmente para caber nesse limite.
2. O menor lado da imagem é ajustado para `768 pixels`.
3. A imagem é dividida em blocos (*tiles*) de `512 x 512 pixels`.
4. **Total de Tokens:** `(Número de Tiles × 170) + 85 tokens base`.

*Exemplo:* Uma imagem de `1024 x 1024` pixels é dividida em 4 tiles de `512 x 512`.  
Custo: `(4 × 170) + 85 = 765 tokens`.

---

## 3. Implementação em Python

### 3.1. Análise com Imagem Base64 Local e Modo `high`

```python
import base64
from openai import OpenAI

client = OpenAI()

def codificar_imagem_base64(caminho_imagem: str) -> str:
    with open(caminho_imagem, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

# Codifica imagem local
base64_str = codificar_imagem_base64("grafico_financeiro.png")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Analise este gráfico financeiro. Identifique a tendência do EBITDA e aponte eventuais anomalias nos trimestres Q3 e Q4."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{base64_str}",
                        "detail": "high" # 'low', 'high' ou 'auto'
                    }
                }
            ]
        }
    ],
    max_completion_tokens=1000
)

print(response.choices[0].message.content)
```

### 3.2. Comparação de Múltiplas Imagens (Diff Visual)

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Compare as duas versões do layout e liste as divergências de UI."},
                {
                    "type": "image_url",
                    "image_url": {"url": "https://meudominio.com/layout_v1.png"}
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "https://meudominio.com/layout_v2.png"}
                }
            ]
        }
    ]
)
print(response.choices[0].message.content)
```

---

## 4. Implementação em TypeScript / Node.js

```typescript
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI();

async function analisarDocumento() {
  const imageBuffer = fs.readFileSync('./cupom_fiscal.jpg');
  const base64Image = imageBuffer.toString('base64');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Faça o OCR completo deste cupom fiscal e extraia o CNPJ, valor total e lista de itens comprados.',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: 'high',
            },
          },
        ],
      },
    ],
  });

  console.log(response.choices[0]?.message.content);
}

analisarDocumento();
```

---

## 5. Extração com Structured Outputs a partir de Imagens

É possível combinar visão com Structured Outputs (`strict: true`) e Pydantic para obter dados tabulares garantidos:

```python
from pydantic import BaseModel
from typing import List

class ItemCupom(BaseModel):
    descricao: str
    quantidade: float
    valor_unitario: float
    valor_total: float

class CupomFiscal(BaseModel):
    cnpj_emissor: str
    data_emissao: str
    valor_total_nota: float
    itens: List[ItemCupom]

completion = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Extraia os dados estruturados deste cupom fiscal escaneado."},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{base64_str}"}
                }
            ]
        }
    ],
    response_format=CupomFiscal
)

cupom = completion.choices[0].message.parsed
print(f"CNPJ: {cupom.cnpj_emissor} | Total: R$ {cupom.valor_total_nota}")
```
