---
title: Referência Completa de Endpoints HTTP REST (v1beta)
description: Catálogo exaustivo e schemas JSON dos endpoints da Google Gemini REST API v1beta (generateContent, streamGenerateContent, countTokens, embedContent, files, cachedContents, batches).
---

# Referência Completa de Endpoints HTTP REST (v1beta)

## 1. Base URL e Autenticação

- **Base URL:** `https://generativelanguage.googleapis.com/v1beta/`
- **Cabeçalho de Autenticação:** `x-goog-api-key: $GEMINI_API_KEY` ou parâmetro de consulta `?key=$GEMINI_API_KEY`
- **Content-Type Padrão:** `application/json`

---

## 2. Tabela Geral de Endpoints

| Método HTTP | Rota do Endpoint | Finalidade |
| :--- | :--- | :--- |
| `POST` | `/v1beta/models/{model}:generateContent` | Geração síncrona de texto/mídia/ferramentas. |
| `POST` | `/v1beta/models/{model}:streamGenerateContent` | Geração com streaming via Server-Sent Events (`?alt=sse`). |
| `POST` | `/v1beta/models/{model}:countTokens` | Contagem de tokens e caracteres faturáveis. |
| `POST` | `/v1beta/models/{model}:embedContent` | Geração de embedding vetorial para um único texto. |
| `POST` | `/v1beta/models/{model}:batchEmbedContents` | Geração de embeddings vetoriais em lote. |
| `GET` | `/v1beta/models` | Listagem de todos os modelos disponíveis. |
| `GET` | `/v1beta/models/{model}` | Obtenção de metadados de um modelo específico. |
| `POST` | `/upload/v1beta/files` | Upload de arquivos na Files API (resumable/direct). |
| `GET` | `/v1beta/files` | Listagem de arquivos carregados pelo projeto. |
| `GET` | `/v1beta/files/{name}` | Obtenção do estado/metadados de um arquivo. |
| `DELETE` | `/v1beta/files/{name}` | Exclusão imediata de um arquivo da Files API. |
| `POST` | `/v1beta/cachedContents` | Criação explícita de um Context Cache. |
| `GET` | `/v1beta/cachedContents` | Listagem de Context Caches ativos. |
| `PATCH` | `/v1beta/cachedContents/{name}` | Atualização de TTL de um Context Cache. |
| `DELETE` | `/v1beta/cachedContents/{name}` | Exclusão manual de um Context Cache. |
| `POST` | `/v1beta/batches` | Criação de um Batch Job assíncrono. |
| `GET` | `/v1beta/batches/{name}` | Consulta de status e resultado de um Batch Job. |
| `POST` | `/v1beta/batches/{name}:cancel` | Cancelamento de um Batch Job ativo. |

---

## 3. Schemas de Requisição e Resposta dos Principais Endpoints

### 3.1. `generateContent`

#### Requisição (`POST /v1beta/models/gemini-2.0-flash:generateContent`)
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "Qual a capital do Brasil?" }
      ]
    }
  ],
  "system_instruction": {
    "parts": [{ "text": "Responda de forma concisa." }]
  },
  "generationConfig": {
    "temperature": 0.7,
    "topP": 0.95,
    "topK": 40,
    "maxOutputTokens": 100
  },
  "safetySettings": [
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
  ]
}
```

#### Resposta
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          { "text": "A capital do Brasil é Brasília." }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0,
      "safetyRatings": [
        {
          "category": "HARM_CATEGORY_HARASSMENT",
          "probability": "NEGLIGIBLE"
        }
      ]
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 16,
    "candidatesTokenCount": 8,
    "totalTokenCount": 24
  }
}
```

### 3.2. `countTokens`

#### Requisição (`POST /v1beta/models/gemini-2.0-flash:countTokens`)
```json
{
  "contents": [
    {
      "parts": [{ "text": "Texto para contagem de tokens de teste." }]
    }
  ]
}
```

#### Resposta
```json
{
  "totalTokens": 8,
  "totalBillableCharacters": 41
}
```

### 3.3. `embedContent`

#### Requisição (`POST /v1beta/models/text-embedding-004:embedContent`)
```json
{
  "content": {
    "parts": [{ "text": "Texto a ser vetorizado para busca semântica." }]
  },
  "taskType": "RETRIEVAL_DOCUMENT",
  "title": "Documento Teste",
  "outputDimensionality": 512
}
```

#### Resposta
```json
{
  "embedding": {
    "values": [0.0123, -0.0456, 0.0789, "... (512 floats)"]
  }
}
```
