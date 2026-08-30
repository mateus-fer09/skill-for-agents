---
title: Referência de API — Fine-Tuning & Batches
description: Especificação técnica dos endpoints /v1/fine_tuning/jobs, /v1/fine_tuning/checkpoints e /v1/batches (processamento assíncrono em lote).
topics:
  - api-reference
  - fine-tuning-reference
  - batches-api-reference
  - async-batching
keywords:
  - POST /v1/fine_tuning/jobs
  - GET /v1/fine_tuning/jobs/{job_id}
  - POST /v1/batches
  - GET /v1/batches/{batch_id}
related:
  - ../fine_tuning_e_evals/fine_tuning_sft.md
  - ../fine_tuning_e_evals/reinforcement_fine_tuning.md
  - ../fundamentos/rate_limits_e_custos.md
source_scope:
  - https://developers.openai.com/api/reference/resources/fine_tuning.md
  - https://developers.openai.com/api/reference/resources/batches.md
---

# Referência de API — Fine-Tuning & Batches

---

## 1. Fine-Tuning Jobs (`/v1/fine_tuning/jobs`)

### 1.1 Criar Job de Fine-Tuning (`POST /v1/fine_tuning/jobs`)

```http
POST /v1/fine_tuning/jobs
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY

{
  "training_file": "file-abc123xyz",
  "validation_file": "file-val9988",
  "model": "gpt-4.1-mini-2025-04-14",
  "hyperparameters": {
    "n_epochs": 3,
    "batch_size": "auto",
    "learning_rate_multiplier": "auto"
  },
  "suffix": "classificador-v1"
}
```

### 1.2 Métodos de Gestão de Fine-Tuning
- `GET /v1/fine_tuning/jobs`: Lista todos os jobs de fine-tuning.
- `GET /v1/fine_tuning/jobs/{fine_tuning_job_id}`: Consulta status e métricas.
- `POST /v1/fine_tuning/jobs/{fine_tuning_job_id}/cancel`: Cancela job em andamento.
- `GET /v1/fine_tuning/jobs/{fine_tuning_job_id}/events`: Lista eventos de log e progresso.
- `GET /v1/fine_tuning/jobs/{fine_tuning_job_id}/checkpoints`: Lista checkpoints gerados durante o treino.

---

## 2. Batch API (`/v1/batches`)

Permite processar milhares de requisições de forma assíncrona com **50% de desconto** e prazo de entrega em até 24 horas.

### 2.1 Criar Lote de Execução (`POST /v1/batches`)

```http
POST /v1/batches
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY

{
  "input_file_id": "file-batch-input-123",
  "endpoint": "/v1/responses",
  "completion_window": "24h",
  "metadata": {
    "descricao": "Processamento noturno de 100k resumos"
  }
}
```

### 2.2 Consultar e Baixar Resultados
- `GET /v1/batches/{batch_id}`: Retorna status (`validating`, `in_progress`, `completed`, `failed`).
- `output_file_id`: ID do arquivo com as respostas geradas em JSONL.
- `error_file_id`: ID do arquivo com linhas que falharam na validação.
- `POST /v1/batches/{batch_id}/cancel`: Cancela a execução do lote.

---

## 3. Referências Cruzadas

- [`../fine_tuning_e_evals/fine_tuning_sft.md`](../fine_tuning_e_evals/fine_tuning_sft.md)
- [`../fundamentos/rate_limits_e_custos.md`](../fundamentos/rate_limits_e_custos.md)
