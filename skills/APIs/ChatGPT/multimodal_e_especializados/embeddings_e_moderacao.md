---
title: "Embeddings Semânticos e Moderação de Conteúdo"
description: "Guia completo dos endpoints de Embeddings (text-embedding-3-small, text-embedding-3-large) e Moderação (omni-moderation-latest, text-moderation-latest). Redução de dimensionalidade via Matryoshka Representation Learning, cálculo de similaridade de cosseno em Python e TypeScript, detecção de violações e políticas de segurança."
topics: ["embeddings", "text-embedding-3", "matryoshka", "cosine-similarity", "moderation", "content-safety", "rag-vectors"]
keywords: ["text-embedding-3-large", "text-embedding-3-small", "dimensions", "cosine_similarity", "/v1/embeddings", "/v1/moderations", "omni-moderation-latest"]
source_scope: "OpenAI API Docs: Guides > Embeddings & Moderation APIs"
---

# Embeddings Semânticos e Moderação de Conteúdo

A OpenAI fornece modelos de ponta para representação vetorial de textos (*Embeddings*) e sistemas de classificação de conformidade ética e segurança (*Moderation API*).

---

## 1. Modelos de Embeddings Semânticos

| Modelo | Dimensões Padrão | Dimensões Mínimas Recomendadas | Janela Máxima de Entrada | Preço Relativo |
| :--- | :--- | :--- | :--- | :--- |
| **`text-embedding-3-large`** | **3.072** | 256 / 512 / 1024 / 1536 | 8.191 tokens | Alta precisão para RAG corporativo |
| **`text-embedding-3-small`** | **1.536** | 256 / 512 | 8.191 tokens | Custo ultrabaixo com alta fidelidade |
| **`text-embedding-ada-002`** | 1.536 (Legado) | Fixa em 1536 | 8.191 tokens | Modelo legado |

---

## 2. Redução Flexível de Dimensões (*Matryoshka Embeddings*)

Os modelos da série `text-embedding-3` foram treinados com técnicas *Matryoshka*, permitindo reduzir o tamanho do vetor final através do parâmetro `dimensions` sem comprometer substancialmente a precisão semântica. Isso reduz os custos de armazenamento e memória de bancos vetoriais em até **75%**.

### 2.1. Implementação em Python e Cálculo de Similaridade de Cosseno

```python
import numpy as np
from openai import OpenAI

client = OpenAI()

def calcular_similaridade_cosseno(vetor_a: list, vetor_b: list) -> float:
    a = np.array(vetor_a)
    b = np.array(vetor_b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# Gerando embeddings com dimensões truncadas para 512 floats
textos = [
    "Como configurar uma arquitetura de microsserviços com Docker e Kubernetes?",
    "Guia de orquestração de containers com K8s e infraestrutura em nuvem.",
    "Receita tradicional de risoto de cogumelos com parmesão."
]

response = client.embeddings.create(
    model="text-embedding-3-large",
    input=textos,
    dimensions=512 # Reduz de 3072 para 512 dimensões
)

emb_doc1 = response.data[0].embedding
emb_doc2 = response.data[1].embedding
emb_doc3 = response.data[2].embedding

sim_1_2 = calcular_similaridade_cosseno(emb_doc1, emb_doc2)
sim_1_3 = calcular_similaridade_cosseno(emb_doc1, emb_doc3)

print(f"Dimensão real do vetor gerado: {len(emb_doc1)}")
print(f"Similaridade entre Doc 1 e Doc 2 (Tecnologia): {sim_1_2:.4f}")
print(f"Similaridade entre Doc 1 e Doc 3 (Culinária): {sim_1_3:.4f}")
```

### 2.2. Implementação em TypeScript / Node.js

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

async function gerarEmbeddings() {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: ['OpenAI SDK para TypeScript', 'Desenvolvimento de agentes em Node.js'],
    dimensions: 256,
  });

  console.log('Embedding 1 (tamanho):', response.data[0].embedding.length);
  console.log('Total de tokens utilizados:', response.usage.total_tokens);
}

gerarEmbeddings();
```

---

## 3. Moderation API: Classificação de Segurança e Conteúdo

O endpoint `/v1/moderations` verifica se um conteúdo viola as diretrizes de segurança da OpenAI. O uso da Moderation API é **100% gratuito**.

### 3.1. Modelos Disponíveis
- `omni-moderation-latest`: Modelo multimodal moderno que analisa texto e imagens.
- `text-moderation-latest`: O modelo de moderação textual mais recente.

### 3.2. Categorias Avaliadas
- `hate` / `hate/threatening`: Discurso de ódio e ameaças.
- `harassment` / `harassment/threatening`: Assédio e intimidação.
- `self-harm` / `self-harm/intent` / `self-harm/instructions`: Automutilação e suicídio.
- `sexual` / `sexual/minors`: Conteúdo sexual e exploração infantil.
- `violence` / `violence/graphic`: Violência física e representações gráficas.
- `illicit` / `illicit/violent`: Atividades ilegais e planejamento criminoso.

---

### 3.3. Exemplo de Verificação de Conteúdo em Python

```python
from openai import OpenAI

client = OpenAI()

response = client.moderations.create(
    model="omni-moderation-latest",
    input="Exemplo de mensagem enviada por um usuário para verificação prévia."
)

resultado = response.results[0]

print(f"Conteúdo Sinalizado (Flagged): {resultado.flagged}")

if resultado.flagged:
    print("
Categorias violadas:")
    for categoria, violado in resultado.categories.__dict__.items():
        if violado:
            score = getattr(resultado.category_scores, categoria)
            print(f"- {categoria}: Score = {score:.4f}")
else:
    print("Conteúdo em conformidade com as diretrizes de uso seguro.")
```

### 3.4. Exemplo via REST (cURL)

```bash
curl https://api.openai.com/v1/moderations   -H "Content-Type: application/json"   -H "Authorization: Bearer $OPENAI_API_KEY"   -d '{
    "model": "text-moderation-latest",
    "input": "Texto de entrada a ser auditado."
  }'
```
