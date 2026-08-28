---
title: Parâmetros de Geração e Diretrizes de Segurança (SafetySettings)
description: Catálogo exaustivo de hiperparâmetros de inferência (temperature, topP, topK, maxOutputTokens, stopSequences) e políticas de moderação e segurança (HarmCategory e HarmBlockThreshold).
---

# Parâmetros de Geração e Diretrizes de Segurança (SafetySettings)

## 1. Parâmetros de Geração de Conteúdo (`generationConfig`)

Os parâmetros abaixo controlam a aleatoriedade, diversidade de vocabulário e limites de comprimento das respostas geradas pelo Gemini.

| Parâmetro | Tipo | Faixa de Valores | Padrão | Descrição Técnica |
| :--- | :--- | :--- | :---: | :--- |
| `temperature` | Float | `0.0` a `2.0` | `1.0` | Controla a aleatoriedade da amostragem. Valores próximos a `0.0` tornam a resposta determinística e analítica; valores próximos a `2.0` aumentam a criatividade e variabilidade. |
| `topP` | Float | `0.0` a `1.0` | `0.95` | Amostragem por núcleo (*Nucleus Sampling*). O modelo seleciona apenas do subconjunto dos tokens mais prováveis cuja probabilidade acumulada atinge `topP`. |
| `topK` | Integer | `1` a `40` | `40` | Amostragem por Top-K. O modelo restringe a seleção aos `K` tokens mais prováveis a cada passo de decodificação. |
| `maxOutputTokens` | Integer | `1` a `8192` (ou `65536` no Thinking) | Modelo | Número máximo de tokens que o modelo pode gerar na resposta antes de interromper. |
| `stopSequences` | List[String] | Até 5 strings | `[]` | Lista de sequências de texto que, se geradas pelo modelo, interrompem imediatamente a emissão de tokens. |
| `presencePenalty` | Float | `-2.0` a `2.0` | `0.0` | Penaliza tokens já presentes no texto gerado, incentivando o modelo a introduzir novos tópicos. |
| `frequencyPenalty`| Float | `-2.0` a `2.0` | `0.0` | Penaliza tokens proporcionalmente à sua frequência no texto gerado, reduzindo repetições literais. |
| `responseMimeType`| String | `text/plain`, `application/json` | `text/plain` | Formato MIME forçado para a saída do modelo. |
| `responseSchema` | Object | JSON Schema / Pydantic | `None` | Schema formal exigido quando `responseMimeType="application/json"`. |
| `seed` | Integer | Qualquer int | `None` | Semente para amostragem pseudo-determinística em pipelines de teste. |

---

## 2. Configurações de Segurança (*SafetySettings*)

O Gemini possui filtros de moderação nativos para prevenir a geração de conteúdo danoso, configurados via `safety_settings`.

### 2.1. Categorias de Dano (`HarmCategory`)

| Categoria | Descrição |
| :--- | :--- |
| `HARM_CATEGORY_HARASSMENT` | Conteúdo abusivo, intimidação, bullying ou difamação. |
| `HARM_CATEGORY_HATE_SPEECH` | Discurso de ódio direcionado a grupos protegidos. |
| `HARM_CATEGORY_SEXUALLY_EXPLICIT` | Conteúdo explícito ou sexual. |
| `HARM_CATEGORY_DANGEROUS_CONTENT` | Instruções perigosas, violência, armas ou danos físicos. |
| `HARM_CATEGORY_CIVIC_INTEGRITY` | Desinformação eleitoral e ameaças a processos cívicos. |

### 2.2. Limiares de Bloqueio (`HarmBlockThreshold`)

| Limiar | Comportamento |
| :--- | :--- |
| `BLOCK_NONE` | Nenhum conteúdo é bloqueado pelo filtro da categoria. |
| `BLOCK_ONLY_HIGH` | Bloqueia apenas quando a probabilidade/severidade de dano for muito alta. |
| `BLOCK_MEDIUM_AND_ABOVE` (Padrão) | Bloqueia conteúdos com média ou alta probabilidade de dano. |
| `BLOCK_LOW_AND_ABOVE` | Bloqueio estrito de conteúdos mesmo com baixa probabilidade de dano. |
| `OFF` | Desativa totalmente a filtragem da categoria específica. |

---

## 3. Exemplo de Configuração em Código

### Python (`google-genai`)
```python
from google import genai
from google.genai import types

client = genai.Client()

config = types.GenerateContentConfig(
    temperature=0.2,
    top_p=0.8,
    max_output_tokens=1000,
    stop_sequences=["### FIM ###"],
    safety_settings=[
        types.SafetySetting(
            category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold=types.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
        ),
        types.SafetySetting(
            category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold=types.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        )
    ]
)

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Gere uma síntese do relatório.",
    config=config
)
```

### TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

const ai = new GoogleGenAI({});

async function run() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'Gere uma síntese do relatório.',
    config: {
      temperature: 0.2,
      topP: 0.8,
      maxOutputTokens: 1000,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    },
  });
  console.log(response.text);
}
```
