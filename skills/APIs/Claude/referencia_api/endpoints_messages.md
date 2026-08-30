---
title: Referência da Messages API
description: Especificação técnica detalhada dos endpoints de envio de mensagens e contagem de tokens (POST /v1/messages e POST /v1/messages/count_tokens).
topics:
  - messages-api
  - api-reference
  - endpoints
  - count-tokens
keywords:
  - POST /v1/messages
  - POST /v1/messages/count_tokens
  - parameters
  - response schema
related:
  - mensagens_e_prompting/messages_api.md
  - referencia_api/erros_e_codigos_de_status.md
  - referencia_api/headers_versoes_e_limites.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/api/overview
  - https://platform.claude.com/docs/en/api/messages
---

# Referência da Messages API

---

## 1. `POST /v1/messages`

Cria e envia uma mensagem estruturada para um modelo Claude.

### URL do Endpoint:
`https://api.anthropic.com/v1/messages`

### Cabeçalhos Necessários:
```http
x-api-key: <sua-chave-api>
anthropic-version: 2023-06-01
content-type: application/json
```

### Parâmetros do Corpo da Requisição (Request Body):

| Campo | Tipo | Obrigatório? | Descrição |
|---|---|---|---|
| `model` | string | **Sim** | O identificador do modelo Claude (ex: `claude-3-7-sonnet-20250219`, `claude-3-5-sonnet-20241022`). |
| `max_tokens` | integer | **Sim** | Número máximo de tokens a serem gerados antes de interromper. |
| `messages` | array | **Sim** | Lista de mensagens de entrada (`role` e `content`). |
| `system` | string ou array | Não | Prompt de sistema para orientar o comportamento e contexto global. |
| `tools` | array | Não | Lista de ferramentas (JSON Schema) disponíveis para chamada. |
| `tool_choice` | object | Não | Modo de seleção de ferramentas (`auto`, `any`, `tool`). |
| `temperature` | number | Não | Quantidade de aleatoriedade na resposta (0.0 a 1.0). Padrão: 1.0. |
| `top_p` | number | Não | Amostragem por corte cumulativo de probabilidade (0.0 a 1.0). |
| `top_k` | integer | Não | Amostragem considerando apenas os K tokens mais prováveis. |
| `stop_sequences` | array de strings | Não | Sequências textuais personalizadas que forçam a parada da geração. |
| `stream` | boolean | Não | Se `true`, emite eventos via Server-Sent Events (SSE). |
| `thinking` | object | Não | Configuração do Extended Thinking (`{"type": "enabled", "budget_tokens": 4096}`). |
| `metadata` | object | Não | Metadados opcionais da requisição (ex: `{"user_id": "usr_123"}`). |

### Exemplo de Resposta (Status 200 OK):

```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "model": "claude-3-7-sonnet-20250219",
  "content": [
    {
      "type": "text",
      "text": "Olá! Como posso ajudar você hoje?"
    }
  ],
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 15,
    "output_tokens": 12,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0
  }
}
```

---

## 2. `POST /v1/messages/count_tokens`

Calcula o consumo exato de tokens de uma requisição sem realizar a inferência de geração.

### URL do Endpoint:
`https://api.anthropic.com/v1/messages/count_tokens`

### Exemplo de Resposta (Status 200 OK):

```json
{
  "input_tokens": 2048
}
```

---

## Veja Também

- [`../mensagens_e_prompting/messages_api.md`](../mensagens_e_prompting/messages_api.md)
- [`../referencia_api/erros_e_codigos_de_status.md`](../referencia_api/erros_e_codigos_de_status.md)
- [`../referencia_api/headers_versoes_e_limites.md`](../referencia_api/headers_versoes_e_limites.md)
