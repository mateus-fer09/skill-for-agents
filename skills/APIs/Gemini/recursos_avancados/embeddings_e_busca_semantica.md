---
title: Embeddings e Busca Semântica — text-embedding-004 e MRL
description: Guia completo para geração de embeddings semânticos com text-embedding-004, redução de dimensionalidade (MRL), TaskTypes para RAG e cálculo de similaridade de cosseno.
---

# Embeddings e Busca Semântica — text-embedding-004 e MRL

## 1. Visão Geral do Modelo `text-embedding-004`

O modelo `text-embedding-004` converte textos em vetores densos de alta fidelidade semântica para indexação em Vector DBs (Pinecone, Qdrant, Chroma, pgvector), sistemas de busca vetorial e Retrieval-Augmented Generation (RAG).

### 1.1. Principais Características
- **Dimensão Nativa Padrão:** 768 dimensões.
- **Janela de Entrada:** até 2.048 tokens por texto.
- **Matryoshka Representation Learning (MRL):** Permite truncar o vetor para 512, 256 ou 128 dimensões com perda mínima de precisão, economizando espaço em disco e acelerando a busca vetorial.

---

## 2. Tipos de Tarefas (`TaskType`)

A parametrização do `task_type` ajusta a representação vetorial para a finalidade específica do caso de uso:

| TaskType | Finalidade | Quando Utilizar |
| :--- | :--- | :--- |
| **`RETRIEVAL_DOCUMENT`** | Indexação de Chunks | Ao vetorizar documentos que serão armazenados no banco vetorial. |
| **`RETRIEVAL_QUERY`** | Consulta do Usuário | Ao vetorizar a pergunta/query de busca antes de consultar o banco. |
| **`SEMANTIC_SIMILARITY`**| Similaridade Par a Par | Comparação semântica direta entre duas frases/textos (STS). |
| **`CLASSIFICATION`** | Classificação Supervisionada | Para treinar classificadores baseados em embeddings. |
| **`CLUSTERING`** | Agrupamento Não Supervisionado| Para clusters semânticos (ex: K-means). |
| **`QUESTION_ANSWERING`** | Resposta a Perguntas | Otimizado para sistemas de Q&A baseados em trechos. |

---

## 3. Geração de Embeddings

### 3.1. Python (`google-genai`)
```python
import numpy as np
from google import genai
from google.genai import types

client = genai.Client()

# 1. Gerar embedding de documento para indexação com dimensão reduzida (MRL 512)
doc_response = client.models.embed_content(
    model="text-embedding-004",
    contents="A fotossíntese é o processo biológico pelo qual plantas convertem luz em energia química.",
    config=types.EmbedContentConfig(
        task_type=types.TaskType.RETRIEVAL_DOCUMENT,
        title="Biologia Vegetal: Fotossíntese",
        output_dimensionality=512 # MRL: Redução de 768 para 512
    )
)

doc_vector = doc_response.embedding.values
print(f"Dimensão do vetor gerado: {len(doc_vector)}")

# 2. Gerar embedding de query do usuário
query_response = client.models.embed_content(
    model="text-embedding-004",
    contents="Como as plantas transformam luz solar em energia?",
    config=types.EmbedContentConfig(
        task_type=types.TaskType.RETRIEVAL_QUERY,
        output_dimensionality=512
    )
)

query_vector = query_response.embedding.values

# 3. Cálculo de Similaridade de Cosseno
def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

score = cosine_similarity(doc_vector, query_vector)
print(f"Score de Similaridade Semântica: {score:.4f}")
```

### 3.2. TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI, TaskType } from '@google/genai';

const ai = new GoogleGenAI({});

async function generateEmbeddings() {
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: 'Arquitetura de microsserviços distribuídos com mensageria Kafka.',
    config: {
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      outputDimensionality: 512,
    },
  });

  console.log('Vetor gerado com dimensão:', response.embedding?.values?.length);
}

generateEmbeddings().catch(console.error);
```

### 3.3. Geração em Lote (Batch Embedding)

```python
# Embedding de múltiplos textos em uma única requisição
batch_response = client.models.embed_content(
    model="text-embedding-004",
    contents=[
        "Primeiro parágrafo do artigo sobre inteligência artificial.",
        "Segundo parágrafo tratando de redes neurais profundas.",
        "Terceiro parágrafo abordando transformers e atenção."
    ],
    config=types.EmbedContentConfig(
        task_type=types.TaskType.RETRIEVAL_DOCUMENT
    )
)

print(f"Total de vetores retornados: {len(batch_response.embeddings)}")
```
