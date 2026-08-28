---
title: "Catálogo Completo de Endpoints REST da OpenAI API"
description: "Referência exaustiva de todos os endpoints HTTP REST da OpenAI API (v1). Métodos HTTP, URLs canônicas, cabeçalhos de autenticação, payloads de requisição e esquemas de resposta para Responses, Chat Completions, Assistants v2, Vector Stores, Embeddings, Áudio, Imagens, Batch, Fine-Tuning e Admin APIs."
topics: ["rest-api", "endpoints", "http-methods", "api-reference", "openapi", "request-payloads", "json-schemas"]
keywords: ["POST /v1/chat/completions", "POST /v1/responses", "POST /v1/embeddings", "/v1/assistants", "/v1/vector_stores", "/v1/batches", "Bearer token"]
source_scope: "OpenAI API Docs: API Reference > All REST Endpoints, Headers & Payload Schemas"
---

# Catálogo Completo de Endpoints REST da OpenAI API

A OpenAI expõe uma interface HTTP REST padronizada na URL base `https://api.openai.com/v1`. Todas as requisições autenticadas utilizam o header `Authorization: Bearer <OPENAI_API_KEY>`.

---

## 1. Geração de Texto, Raciocínio e Respostas

| Método | Endpoint REST | Descrição |
| :--- | :--- | :--- |
| `POST` | `/v1/responses` | Interface unificada moderna para geração de texto, prompts gerenciados e raciocínio. |
| `POST` | `/v1/chat/completions` | Interface conversacional clássica com suporte a Streaming SSE, Structured Outputs e Tools. |
| `POST` | `/v1/completions` | Endpoint legado de autocompletar texto (apenas para modelos base `davinci-002`/`babbage-002`). |

---

## 2. Assistants API v2 (Agentes com Estado e Ferramentas)

| Método | Endpoint REST | Descrição |
| :--- | :--- | :--- |
| `POST` | `/v1/assistants` | Cria um novo Assistente persistente com instruções e ferramentas. |
| `GET` | `/v1/assistants` | Lista os assistentes da organização/projeto com paginação. |
| `GET` | `/v1/assistants/{assistant_id}` | Recupera os metadados e configuração de um assistente. |
| `POST` | `/v1/assistants/{assistant_id}` | Atualiza o modelo, instruções ou ferramentas do assistente. |
| `DELETE` | `/v1/assistants/{assistant_id}` | Exclui permanentemente um assistente. |
| `POST` | `/v1/threads` | Cria uma nova Thread conversacional vazia ou com mensagens iniciais. |
| `GET` | `/v1/threads/{thread_id}` | Recupera uma thread existente. |
| `DELETE` | `/v1/threads/{thread_id}` | Exclui uma thread e todo seu histórico conversacional. |
| `POST` | `/v1/threads/{thread_id}/messages` | Adiciona uma nova mensagem (usuário ou assistente) à thread. |
| `GET` | `/v1/threads/{thread_id}/messages` | Lista as mensagens contidas na thread (ordem cronológica ou inversa). |
| `POST` | `/v1/threads/{thread_id}/runs` | Inicia a execução do Assistente sobre o contexto da thread. |
| `GET` | `/v1/threads/{thread_id}/runs/{run_id}` | Consulta o status de um Run (`in_progress`, `completed`, `requires_action`). |
| `POST` | `/v1/threads/{thread_id}/runs/{run_id}/cancel` | Interrompe um Run em andamento. |
| `POST` | `/v1/threads/{thread_id}/runs/{run_id}/submit_tool_outputs` | Envia as respostas de funções locais para um Run em `requires_action`. |
| `GET` | `/v1/threads/{thread_id}/runs/{run_id}/steps` | Lista os passos detalhados da execução do Run (chamadas de ferramentas e mensagens). |
| `POST` | `/v1/threads/runs` | Cria uma Thread e dispara o Run na mesma requisição atômica (*Create Thread and Run*). |

---

## 3. Vector Stores & File Search (RAG)

| Método | Endpoint REST | Descrição |
| :--- | :--- | :--- |
| `POST` | `/v1/vector_stores` | Cria uma nova base vetorial indexada com política de expiração. |
| `GET` | `/v1/vector_stores` | Lista as Vector Stores disponíveis. |
| `GET` | `/v1/vector_stores/{vector_store_id}` | Recupera estatísticas e contagem de arquivos de uma Vector Store. |
| `DELETE` | `/v1/vector_stores/{vector_store_id}` | Remove a Vector Store e desindexa seus arquivos. |
| `POST` | `/v1/vector_stores/{vector_store_id}/files` | Anexa e indexa um arquivo individual na Vector Store. |
| `GET` | `/v1/vector_stores/{vector_store_id}/files` | Lista os arquivos contidos em uma Vector Store. |
| `DELETE` | `/v1/vector_stores/{vector_store_id}/files/{file_id}` | Remove um arquivo específico da Vector Store. |
| `POST` | `/v1/vector_stores/{vector_store_id}/file_batches` | Cria um lote de indexação assíncrona de múltiplos arquivos. |
| `GET` | `/v1/vector_stores/{vector_store_id}/file_batches/{batch_id}` | Consulta o progresso do lote de indexação vetorial. |

---

## 4. Embeddings, Moderação e Realtime

| Método | Endpoint REST | Descrição |
| :--- | :--- | :--- |
| `POST` | `/v1/embeddings` | Gera vetores numéricos de alta dimensão (`text-embedding-3`). |
| `POST` | `/v1/moderations` | Classifica texto ou imagens quanto a violações de diretrizes éticas (gratuito). |
| `POST` | `/v1/realtime/sessions` | Cria uma sessão WebRTC efêmera e retorna o token de curta duração para navegadores. |

---

## 5. Áudio e Imagens

| Método | Endpoint REST | Descrição |
| :--- | :--- | :--- |
| `POST` | `/v1/audio/transcriptions` | Converte fala em texto (Speech-to-Text) com Whisper-1. |
| `POST` | `/v1/audio/translations` | Transcreve e traduz áudios em qualquer idioma diretamente para inglês. |
| `POST` | `/v1/audio/speech` | Sintetiza voz falada ultra-realista a partir de texto (Text-to-Speech). |
| `POST` | `/v1/images/generations` | Gera imagens via DALL-E 3 ou DALL-E 2 a partir de um prompt. |
| `POST` | `/v1/images/edits` | Modifica uma imagem com base em uma máscara transparente (DALL-E 2). |
| `POST` | `/v1/images/variations` | Cria variações estilísticas de uma imagem fornecida (DALL-E 2). |

---

## 6. Batch API, Fine-Tuning e Gestão de Arquivos

| Método | Endpoint REST | Descrição |
| :--- | :--- | :--- |
| `POST` | `/v1/batches` | Cria um job de processamento assíncrono em lote com 50% de desconto. |
| `GET` | `/v1/batches/{batch_id}` | Consulta o status e contagem de requisições do lote. |
| `POST` | `/v1/batches/{batch_id}/cancel` | Cancela a execução de um lote pendente. |
| `POST` | `/v1/fine_tuning/jobs` | Dispara o treinamento de um modelo customizado (SFT / DPO). |
| `GET` | `/v1/fine_tuning/jobs` | Lista todos os treinamentos de fine-tuning da organização. |
| `GET` | `/v1/fine_tuning/jobs/{fine_tuning_job_id}` | Recupera o status e métricas de perda do treinamento. |
| `POST` | `/v1/files` | Faz upload de um arquivo (`assistants`, `batch`, `fine-tune`, `vision`). |
| `GET` | `/v1/files` | Lista os arquivos armazenados na organização. |
| `GET` | `/v1/files/{file_id}` | Recupera metadados do arquivo. |
| `GET` | `/v1/files/{file_id}/content` | Baixa o conteúdo bruto/binário do arquivo. |
| `DELETE` | `/v1/files/{file_id}` | Exclui permanentemente o arquivo. |

---

## 7. Modelos e Admin APIs

| Método | Endpoint REST | Descrição |
| :--- | :--- | :--- |
| `GET` | `/v1/models` | Lista todos os modelos ativos disponíveis para consumo. |
| `GET` | `/v1/models/{model}` | Recupera detalhes de um modelo específico ou snapshot. |
| `POST` | `/v1/organization/projects` | Cria um novo projeto isolado na organização (Admin API). |
| `GET` | `/v1/organization/projects` | Lista todos os projetos da organização. |
| `GET` | `/v1/organization/usage/completions` | Consulta métricas horárias/diárias de consumo de tokens em texto. |
| `GET` | `/v1/organization/audit_logs` | Trilha completa de auditoria de segurança da organização. |
