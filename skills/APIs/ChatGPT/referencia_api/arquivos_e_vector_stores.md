---
title: Referência de API — Arquivos, Uploads & Vector Stores
description: Especificação técnica dos endpoints /v1/files, /v1/uploads (multipart chunks) e /v1/vector_stores (bancos vetoriais gerenciados).
topics:
  - api-reference
  - files-api-reference
  - uploads-reference
  - vector-stores-reference
keywords:
  - /v1/files
  - /v1/uploads
  - /v1/vector_stores
  - vector_store_id
  - file_batches
related:
  - ../ferramentas_e_mcp/ferramentas_hospedadas.md
  - ../fine_tuning_e_evals/fine_tuning_sft.md
source_scope:
  - https://developers.openai.com/api/reference/resources/files.md
  - https://developers.openai.com/api/reference/resources/uploads.md
  - https://developers.openai.com/api/reference/resources/vector_stores.md
---

# Referência de API — Arquivos, Uploads & Vector Stores

---

## 1. Arquivos (`/v1/files`)

### 1.1 Upload de Arquivo (`POST /v1/files`)

```http
POST /v1/files
Content-Type: multipart/form-data
Authorization: Bearer $OPENAI_API_KEY
```

- `file`: Binário do arquivo.
- `purpose`: Finalidade (`"assistants"`, `"fine-tune"`, `"user_data"`, `"evals"`).

### 1.2 Métodos de Gestão de Arquivos
- `GET /v1/files`: Lista arquivos carregados.
- `GET /v1/files/{file_id}`: Recupera metadados do arquivo.
- `GET /v1/files/{file_id}/content`: Baixa o conteúdo do arquivo binário.
- `DELETE /v1/files/{file_id}`: Exclui o arquivo da plataforma.

---

## 2. Uploads em Múltiplas Partes (`/v1/uploads`)

Para arquivos grandes (> 100MB e até 5GB):
1. `POST /v1/uploads`: Inicia a sessão de upload informando `filename`, `purpose`, `bytes` e `mime_type`.
2. `POST /v1/uploads/{upload_id}/parts`: Envia partes sequenciais de bytes (*chunks*).
3. `POST /v1/uploads/{upload_id}/complete`: Finaliza a montagem do arquivo e retorna o `file_id`.
4. `POST /v1/uploads/{upload_id}/cancel`: Cancela o upload.

---

## 3. Vector Stores (`/v1/vector_stores`)

Bancos de dados vetoriais gerenciados pela OpenAI para indexação semântica e busca via `file_search`:

### 3.1 Criar Vector Store (`POST /v1/vector_stores`)

```http
POST /v1/vector_stores
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY

{
  "name": "Base de Conhecimento Jurídica",
  "file_ids": ["file-123", "file-456"],
  "expires_after": {
    "anchor": "last_active_at",
    "days": 7
  }
}
```

### 3.2 File Batches e Busca Vetorial Direta
- `POST /v1/vector_stores/{vector_store_id}/file_batches`: Adiciona lotes de arquivos para indexação paralela.
- `POST /v1/vector_stores/{vector_store_id}/search`: Executa busca semântica direta por similaridade de cosseno retornando chunks de texto mais relevantes.
- `DELETE /v1/vector_stores/{vector_store_id}`: Remove o vector store e seus índices.

---

## 4. Referências Cruzadas

- [`../ferramentas_e_mcp/ferramentas_hospedadas.md`](../ferramentas_e_mcp/ferramentas_hospedadas.md)
- [`../fine_tuning_e_evals/fine_tuning_sft.md`](../fine_tuning_e_evals/fine_tuning_sft.md)
