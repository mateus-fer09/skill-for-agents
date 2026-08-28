---
title: "Gestão de Arquivos e Armazenamento (/v1/files)"
description: "Guia completo da Files API (/v1/files) da OpenAI. Upload, listagem, recuperação, download de conteúdo binário e exclusão de arquivos para propósitos como assistants, batch, fine-tune e vision, cotas de armazenamento e automação de limpeza."
topics: ["files-api", "storage-management", "upload", "download", "assistants-files", "batch-files", "retention-policy"]
keywords: ["/v1/files", "client.files.create", "client.files.list", "client.files.content", "client.files.delete", "purpose: assistants", "purpose: batch"]
source_scope: "OpenAI API Docs: API Reference > Files & Storage Lifecycle Management"
---

# Gestão de Arquivos e Armazenamento (/v1/files)

A **Files API** gerencia o armazenamento de arquivos utilizados em assistentes, processamentos em lote (Batch), treinamentos de modelos (Fine-Tuning) e artefatos gerados pelo Code Interpreter.

---

## 1. Propósitos de Arquivos (*Purposes*)

Ao fazer upload de um arquivo via `POST /v1/files`, é obrigatório declarar o parâmetro `purpose`:

| Propósito (`purpose`) | Descrição | Extensões Comuns |
| :--- | :--- | :--- |
| **`assistants`** | Documentos e dados anexados a Assistentes, Threads ou Vector Stores. | `.pdf`, `.docx`, `.txt`, `.csv`, `.py`, `.md` |
| **`batch`** | Arquivos JSONL de entrada contendo requisições da Batch API. | `.jsonl` |
| **`fine-tune`** | Datasets JSONL de treino e validação para a Fine-Tuning API. | `.jsonl` |
| **`vision`** | Imagens temporárias enviadas para análise visual. | `.png`, `.jpg`, `.jpeg`, `.webp` |

---

## 2. Métodos e Endpoints da Files API

| Ação | Endpoint HTTP | Método Python SDK | Método Node.js SDK |
| :--- | :--- | :--- | :--- |
| **Upload de Arquivo** | `POST /v1/files` | `client.files.create(file=..., purpose=...)` | `openai.files.create({ file, purpose })` |
| **Listar Arquivos** | `GET /v1/files` | `client.files.list(purpose=...)` | `openai.files.list({ purpose })` |
| **Recuperar Metadados** | `GET /v1/files/{file_id}` | `client.files.retrieve(file_id)` | `openai.files.retrieve(file_id)` |
| **Baixar Conteúdo** | `GET /v1/files/{file_id}/content` | `client.files.content(file_id)` | `openai.files.content(file_id)` |
| **Excluir Arquivo** | `DELETE /v1/files/{file_id}` | `client.files.delete(file_id)` | `openai.files.delete(file_id)` |

---

## 3. Implementação Completa em Python

```python
import os
from openai import OpenAI

client = OpenAI()

# 1. Upload de Arquivo
with open("relatorio_q3.pdf", "rb") as f:
    uploaded_file = client.files.create(
        file=f,
        purpose="assistants"
    )
print(f"Upload realizado com sucesso! ID: {uploaded_file.id} ({uploaded_file.bytes} bytes)")

# 2. Listagem de Todos os Arquivos de um Propósito Específico
assistants_files = client.files.list(purpose="assistants")
print(f"
Total de arquivos de assistentes: {len(assistants_files.data)}")
for f in assistants_files.data[:5]:
    print(f"- {f.id} | {f.filename} | {f.bytes / 1024:.1f} KB | Criado em: {f.created_at}")

# 3. Baixar Conteúdo Binário de um Arquivo Gerado (ex: pelo Code Interpreter)
def baixar_arquivo_binario(file_id: str, caminho_destino: str):
    response_content = client.files.content(file_id)
    with open(caminho_destino, "wb") as f_dest:
        f_dest.write(response_content.read())
    print(f"Arquivo {file_id} salvo em: {caminho_destino}")

# 4. Script de Limpeza Automática de Arquivos Antigos (Purge)
def purgar_arquivos_antigos_batch():
    batch_files = client.files.list(purpose="batch")
    for b_file in batch_files.data:
        print(f"Deletando arquivo de lote antigo: {b_file.id} ({b_file.filename})")
        client.files.delete(b_file.id)

# purgar_arquivos_antigos_batch()
```

---

## 4. Implementação em TypeScript / Node.js

```typescript
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI();

async function gerenciarArquivos() {
  // Upload
  const file = await openai.files.create({
    file: fs.createReadStream('./dataset.jsonl'),
    purpose: 'fine-tune',
  });
  console.log(`Arquivo criado: ${file.id}`);

  // Download do conteúdo
  const content = await openai.files.content(file.id);
  const buffer = Buffer.from(await content.arrayBuffer());
  fs.writeFileSync('./download_dataset.jsonl', buffer);

  // Exclusão
  const deleted = await openai.files.delete(file.id);
  console.log(`Arquivo excluído: ${deleted.deleted}`);
}

gerenciarArquivos();
```

---

## 5. Limites e Políticas de Armazenamento

- **Limite por Arquivo Individual:** Até **512 MB**.
- **Limite Total de Armazenamento da Organização:** Padrão de **100 GB** por organização (expansível mediante contato comercial).
- **Retenção de Arquivos de Batch e Fine-Tuning:** Recomenda-se a exclusão programada de arquivos intermediários após a conclusão dos jobs para liberar espaço de cota.
