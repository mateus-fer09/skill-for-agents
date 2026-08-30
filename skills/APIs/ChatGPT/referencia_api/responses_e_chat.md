---
title: Referência de API — Responses & Chat Completions
description: Especificação técnica completa de endpoints REST, parâmetros, payloads, headers e respostas para /v1/responses, /v1/chat/completions e /v1/completions.
topics:
  - api-reference
  - responses-api-reference
  - chat-completions-reference
  - streaming-events
keywords:
  - POST /v1/responses
  - GET /v1/responses/{response_id}
  - POST /v1/responses/{response_id}/cancel
  - POST /v1/responses/{response_id}/compact
  - POST /v1/chat/completions
related:
  - ../responses_api/introducao_e_quickstart.md
  - ../responses_api/structured_outputs.md
  - ../responses_api/streaming_e_websockets.md
source_scope:
  - https://developers.openai.com/api/reference/resources/responses.md
  - https://developers.openai.com/api/reference/resources/responses/methods/create.md
  - https://developers.openai.com/api/reference/resources/responses/methods/retrieve.md
  - https://developers.openai.com/api/reference/resources/responses/methods/cancel.md
  - https://developers.openai.com/api/reference/resources/responses/methods/compact.md
  - https://developers.openai.com/api/reference/resources/chat.md
---

# Referência de API — Responses & Chat Completions

---

## 1. Responses API (`/v1/responses`)

### 1.1 Criar uma Resposta (`POST /v1/responses`)

Cria uma resposta a partir de mensagens, chamadas de ferramentas e entradas multimodais.

```http
POST /v1/responses
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY
```

#### Parâmetros do Corpo da Requisição (Request Body)

| Campo | Tipo | Obrigatório | Padrão | Descrição |
|---|---|---|---|---|
| `model` | `string` | **Sim** | - | ID do modelo a ser utilizado (ex.: `"gpt-5.6"`, `"o3-mini"`). |
| `input` | `string` \| `array` | **Sim** | - | Mensagem de texto ou array estruturado de itens de entrada. |
| `instructions` | `string` | Não | `null` | Instruções do sistema para orientar o comportamento geral. |
| `tools` | `array` | Não | `[]` | Lista de ferramentas (funções, web search, file search, MCP). |
| `tool_choice` | `string` \| `object` | Não | `"auto"` | Controle de seleção de ferramentas (`"auto"`, `"required"`, `"none"`). |
| `temperature` | `number` | Não | `1.0` | Valor de amostragem entre `0.0` e `2.0`. |
| `max_output_tokens` | `integer` | Não | `null` | Limite de tokens gerados na saída. |
| `reasoning_effort` | `string` | Não | `"medium"` | Nível de raciocínio para modelos o-series (`"low"`, `"medium"`, `"high"`). |
| `response_format` | `object` | Não | `null` | Formato estruturado de saída (`{"type": "json_schema", ...}`). |
| `stream` | `boolean` | Não | `false` | Se `true`, transmite deltas via Server-Sent Events (SSE). |
| `previous_response_id` | `string` | Não | `null` | ID da resposta anterior para encadeamento contínuo. |
| `conversation` | `string` | Não | `null` | ID da conversa persistente no servidor. |
| `prediction` | `object` | Não | `null` | Conteúdo prévio esperado para Predicted Outputs. |

#### Exemplo de Resposta de Sucesso (`HTTP 200 OK`)

```json
{
  "id": "resp_abc123xyz",
  "object": "response",
  "created_at": 1724976000,
  "model": "gpt-5.6",
  "status": "completed",
  "output": [
    {
      "type": "message",
      "id": "msg_001",
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "Aqui está a análise solicitada..."
        }
      ]
    }
  ],
  "output_text": "Aqui está a análise solicitada...",
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 128,
    "total_tokens": 170,
    "prompt_tokens_details": {
      "cached_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  }
}
```

---

### 1.2 Recuperar uma Resposta (`GET /v1/responses/{response_id}`)
Recupera os detalhes, status e itens de saída de uma resposta previamente gerada.

### 1.3 Cancelar uma Resposta (`POST /v1/responses/{response_id}/cancel`)
Interrompe imediatamente o processamento de uma resposta em execução.

### 1.4 Compactar Contexto (`POST /v1/responses/{response_id}/compact`)
Executa a compactação e sumarização dos itens da conversa no servidor para redução de contexto.

---

## 2. Chat Completions Legado (`/v1/chat/completions`)

Mantido para compatibilidade retroativa:

```http
POST /v1/chat/completions
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY

{
  "model": "gpt-4.1",
  "messages": [
    {"role": "system", "content": "Você é um assistente prestativo."},
    {"role": "user", "content": "Olá!"}
  ]
}
```

---

## 3. Referências Cruzadas

- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
- [`../responses_api/structured_outputs.md`](../responses_api/structured_outputs.md)
- [`../responses_api/streaming_e_websockets.md`](../responses_api/streaming_e_websockets.md)
