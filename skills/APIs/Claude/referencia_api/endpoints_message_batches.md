---
title: Referência da Message Batches API
description: Especificação técnica dos endpoints de criação, consulta, download de resultados, cancelamento e listagem de lotes assíncronos.
topics:
  - batches-api
  - api-reference
  - async-batches
keywords:
  - POST /v1/messages/batches
  - GET /v1/messages/batches/<built-in function id>
  - GET /v1/messages/batches/<built-in function id>/results
related:
  - mensagens_e_prompting/processamento_em_lote_batches.md
  - referencia_api/endpoints_messages.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/api/messages/batches
---

# Referência da Message Batches API

---

## Lista de Endpoints de Lotes

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/v1/messages/batches` | Cria um novo lote contendo até 10.000 requisições |
| `GET` | `/v1/messages/batches/{message_batch_id}` | Consulta o status e contadores de progresso do lote |
| `GET` | `/v1/messages/batches/{message_batch_id}/results` | Faz streaming dos resultados concluídos em formato JSONL |
| `POST` | `/v1/messages/batches/{message_batch_id}/cancel` | Cancela o processamento de requisições pendentes no lote |
| `GET` | `/v1/messages/batches` | Lista todos os lotes criados no workspace |
| `DELETE` | `/v1/messages/batches/{message_batch_id}` | Exclui o lote e seus resultados armazenados |

---

## Estrutura do Objeto `MessageBatch`

```json
{
  "id": "msgbatch_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message_batch",
  "processing_status": "in_progress",
  "request_counts": {
    "processing": 50,
    "succeeded": 950,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2026-08-29T20:00:00Z",
  "expires_at": "2026-08-30T20:00:00Z",
  "results_url": "https://api.anthropic.com/v1/messages/batches/msgbatch_01XFDUDYJgAACzvnptvVoYEL/results"
}
```

---

## Veja Também

- [`../mensagens_e_prompting/processamento_em_lote_batches.md`](../mensagens_e_prompting/processamento_em_lote_batches.md)
- [`../referencia_api/endpoints_messages.md`](../referencia_api/endpoints_messages.md)
