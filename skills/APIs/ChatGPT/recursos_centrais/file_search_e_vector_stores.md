---
title: "File Search e Vector Stores: RAG Nativo na Assistants API v2"
description: "Guia completo de busca semântica em documentos (RAG) com File Search e Vector Stores. Criação de vector stores, upload de arquivos e lotes (file batches), estratégias de chunking estático vs auto, rankeamento, limites de arquivos e integração com assistentes."
topics: ["file-search", "vector-stores", "rag", "chunking", "semantic-search", "embeddings", "file-batches"]
keywords: ["client.beta.vector_stores", "file_search", "tool_resources", "chunking_strategy", "max_chunk_size_tokens", "chunk_overlap_tokens", "expires_after"]
source_scope: "OpenAI API Docs: Assistants > Tools > File Search, Vector Stores API & Chunking Strategies"
---

# File Search e Vector Stores: RAG Nativo na Assistants API v2

O **File Search** é a ferramenta nativa de RAG (*Retrieval-Augmented Generation*) da OpenAI que automatiza a indexação, quebra de texto (*chunking*), geração de embeddings e busca por similaridade vetorial com re-rankeamento sem a necessidade de manter uma infraestrutura externa de banco vetorial (como Pinecone ou Qdrant).

---

## 1. Estrutura e Ciclo de Indexação de Vector Stores

```text
[Arquivos PDF / DOCX / TXT / MD]
               │
               ▼  (POST /v1/vector_stores/{id}/file_batches)
┌──────────────────────────────────────────────┐
│             VECTOR STORE                     │
│  - Extração de Texto e Limpeza               │
│  - Estratégia de Chunking (Static ou Auto)   │
│  - Geração de Embeddings (text-embedding-3)  │
│  - Indexação Vetorial + BM25 Híbrido         │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│           CONSULTA DO ASSISTENTE             │
│  - Re-rankeamento por relevância             │
│  - Injeção automática de trechos no contexto │
│  - Citações automáticas com referências      │
└──────────────────────────────────────────────┘
```

---

## 2. Estratégias de Chunking (*Chunking Strategy*)

Na criação da Vector Store ou anexo de arquivos, é possível configurar a estratégia de divisão de texto:

| Tipo de Chunking | Parâmetros | Descrição |
| :--- | :--- | :--- |
| **`auto` (Padrão)** | Automático | O sistema ajusta o tamanho dos chunks dinamicamente com base no tipo e tamanho do documento. |
| **`static`** | `max_chunk_size_tokens`: 100 a 4.096<br>`chunk_overlap_tokens`: 0 até `max_chunk_size / 2` | Define o tamanho fixo de cada pedaço e a sobreposição de contexto entre blocos contíguos. |

---

## 3. Implementação Completa em Python

### 3.1. Criação da Vector Store, Upload em Lote e Associação ao Assistente

```python
from openai import OpenAI

client = OpenAI()

# 1. Criar uma Vector Store dedicada com expiração automática após 7 dias de inatividade
vector_store = client.beta.vector_stores.create(
    name="Base Conhecimento Políticas Corporativas",
    expires_after={
        "anchor": "last_active_at",
        "days": 7
    },
    chunking_strategy={
        "type": "static",
        "static": {
            "max_chunk_size_tokens": 800,
            "chunk_overlap_tokens": 200
        }
    }
)
print(f"Vector Store ID: {vector_store.id}")

# 2. Upload e indexação de arquivos em lote (Batch Upload)
arquivos_locais = ["politica_reembolso.pdf", "manual_seguranca.docx"]
file_streams = [open(path, "rb") for path in arquivos_locais]

# Envia o lote e aguarda a conclusão da indexação
file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
    vector_store_id=vector_store.id,
    files=file_streams
)

print(f"Status da Indexação: {file_batch.status} ({file_batch.file_counts.completed} concluídos)")

# 3. Criar o Assistente conectado à Vector Store
assistant = client.beta.assistants.create(
    name="Especialista em Compliance",
    instructions="Você responde dúvidas corporativas baseando-se estritamente nos documentos anexados via File Search. Sempre cite a fonte.",
    model="gpt-4o",
    tools=[{"type": "file_search"}],
    tool_resources={
        "file_search": {
            "vector_store_ids": [vector_store.id]
        }
    }
)
print(f"Assistente configurado: {assistant.id}")
```

---

## 4. Implementação em TypeScript / Node.js

```typescript
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI();

async function configurarRAG() {
  // 1. Criar a Vector Store
  const vectorStore = await openai.beta.vector_stores.create({
    name: 'Documentação Técnica de APIs',
  });

  // 2. Upload de arquivo para a Vector Store
  const fileStream = fs.createReadStream('./docs_arquitetura.pdf');
  const file = await openai.files.create({
    file: fileStream,
    purpose: 'assistants',
  });

  await openai.beta.vector_stores.files.createAndPoll(vectorStore.id, {
    file_id: file.id,
  });

  console.log(`Arquivo ${file.id} indexado na Vector Store ${vectorStore.id}`);

  // 3. Atualizar assistente existente com a nova base vetorial
  const assistant = await openai.beta.assistants.create({
    name: 'Arquiteto de Soluções',
    model: 'gpt-4o',
    tools: [{ type: 'file_search' }],
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });

  console.log(`Assistente criado: ${assistant.id}`);
}

configurarRAG();
```

---

## 5. Limites, Formatos Suportados e Custos

- **Formatos Suportados:** `.c`, `.cpp`, `.docx`, `.html`, `.java`, `.json`, `.md`, `.pdf`, `.php`, `.pptx`, `.py`, `.rb`, `.tex`, `.txt`, `.css`, `.js`, `.sh`, `.ts`.
- **Limites de Tamanho:**
  - Máximo de 512 MB por arquivo individual.
  - Máximo de 5.000.000 de tokens por arquivo.
  - Até 10.000 arquivos por Vector Store.
- **Cobrança de Armazenamento:** A OpenAI concede 1 GB de armazenamento vetorial gratuito por organização. Acima disso, há uma taxa de US$ 0,10 por GB/dia de indexação ativa.
