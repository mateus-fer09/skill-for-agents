---
title: Grounding com Google Search — Aterramento e Citações em Tempo Real
description: Guia completo para ativação de Grounding com Google Search na Gemini API, configuração de Dynamic Retrieval, extração de fontes, URLs citadas e Grounding Metadata.
---

# Grounding com Google Search — Aterramento e Citações em Tempo Real

## 1. Visão Geral do Grounding

O recurso de **Grounding com Google Search** conecta o Gemini ao índice de busca em tempo real do Google. Isso permite que o modelo acesse fatos atualizados, cite fontes com links verificáveis e mitigue alucinações sobre eventos recentes.

```text
┌────────────────────────────────────────────────────────┐
│     Usuário pergunta fato recente / notícia atual      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│     Gemini gera buscas automáticas no Google Search    │
│     (Consulta queries como: "vencedores oscar 2026")   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│     Extração de Grounding Chunks & Supports            │
│     (Mapeia trechos de texto com URLs de referência)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│     Resposta Aterrada com Links e Citações Oficiais    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Ativação Básica do Grounding

### 2.1. Python (`google-genai`)
```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Quais foram as principais notícias de tecnologia anunciadas nesta semana?",
    config=types.GenerateContentConfig(
        tools=[types.Tool(google_search=types.GoogleSearch())]
    )
)

print("--- Resposta Aterrada ---")
print(response.text)

# Inspeção dos Metadados de Grounding
if response.candidates[0].grounding_metadata:
    metadata = response.candidates[0].grounding_metadata
    print("
--- Consultas de Busca Realizadas ---")
    print(metadata.web_search_queries)

    print("
--- Fontes Citadas (Grounding Chunks) ---")
    for chunk in metadata.grounding_chunks or []:
        if chunk.web:
            print(f"- {chunk.web.title}: {chunk.web.uri}")
```

### 2.2. TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function runSearchGrounding() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'Quais foram os principais lançamentos espaciais recentes?',
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  console.log('Resposta:', response.text);

  const metadata = response.candidates?.[0]?.groundingMetadata;
  if (metadata?.groundingChunks) {
    console.log('
Fontes Utilizadas:');
    for (const chunk of metadata.groundingChunks) {
      console.log(`- ${chunk.web?.title}: ${chunk.web?.uri}`);
    }
  }
}

runSearchGrounding().catch(console.error);
```

---

## 3. Recuperação Dinâmica (*Dynamic Retrieval*)

Em vez de disparar a busca em 100% das mensagens, o **Dynamic Retrieval** permite configurar um limiar (*threshold*) para que o modelo só consulte a internet quando julgar necessário.

```python
config = types.GenerateContentConfig(
    tools=[
        types.Tool(
            google_search=types.GoogleSearch(
                dynamic_retrieval_config=types.DynamicRetrievalConfig(
                    mode=types.DynamicRetrievalConfigMode.MODE_DYNAMIC,
                    dynamic_threshold=0.3 # 0.0 (sempre busca) a 1.0 (raramente busca)
                )
            )
        )
    ]
)
```

---

## 4. Estrutura do `grounding_metadata`

O objeto retornado na resposta possui os seguintes campos essenciais:

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `web_search_queries` | `List[str]` | Lista de termos de busca formulados e pesquisados no Google. |
| `grounding_chunks` | `List[GroundingChunk]` | Títulos e URLs oficiais das páginas acessadas como fonte. |
| `grounding_supports` | `List[GroundingSupport]` | Mapeia índices de texto da resposta aos trechos e fontes de apoio. |
| `search_entry_point` | `SearchEntryPoint` | Snippet de HTML/código para renderizar o widget oficial de busca do Google. |
