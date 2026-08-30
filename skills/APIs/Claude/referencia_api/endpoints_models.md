---
title: Referência da Models API
description: Endpoints para listagem e inspeção programática dos modelos Claude disponíveis e seus metadados.
topics:
  - models-api
  - endpoints
keywords:
  - GET /v1/models
  - GET /v1/models/<built-in function id>
related:
  - fundamentos/modelos_e_precos.md
source_scope:
  - https://platform.claude.com/docs/en/api/models
---

# Referência da Models API

---

## 1. `GET /v1/models`

Retorna a lista de todos os modelos disponíveis para o seu workspace.

```bash
curl https://api.anthropic.com/v1/models \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01"
```

### Resposta:

```json
{
  "data": [
    {
      "type": "model",
      "id": "claude-3-7-sonnet-20250219",
      "display_name": "Claude 3.7 Sonnet",
      "created_at": "2025-02-19T00:00:00Z"
    },
    {
      "type": "model",
      "id": "claude-3-5-sonnet-20241022",
      "display_name": "Claude 3.5 Sonnet",
      "created_at": "2024-10-22T00:00:00Z"
    },
    {
      "type": "model",
      "id": "claude-3-5-haiku-20241022",
      "display_name": "Claude 3.5 Haiku",
      "created_at": "2024-10-22T00:00:00Z"
    }
  ],
  "has_more": false,
  "first_id": "claude-3-7-sonnet-20250219",
  "last_id": "claude-3-5-haiku-20241022"
}
```

---

## Veja Também

- [`../fundamentos/modelos_e_precos.md`](../fundamentos/modelos_e_precos.md)
