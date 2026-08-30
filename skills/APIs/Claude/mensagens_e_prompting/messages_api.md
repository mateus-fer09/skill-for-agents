---
title: Guia Completo da Messages API
description: Estrutura da Messages API, roles de conversação, system prompts de nível superior, suporte a visão multimodal, streaming de eventos SSE e tratamento de stop reasons.
topics:
  - messages-api
  - multimodalidade
  - streaming
  - stop-reasons
  - system-prompt
keywords:
  - Messages API
  - user assistant
  - image content
  - base64
  - streaming SSE
  - stop_reason
related:
  - primeiros_passos/quickstart.md
  - mensagens_e_prompting/prompt_caching.md
  - referencia_api/endpoints_messages.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/build-with-claude/working-with-messages
  - https://platform.claude.com/docs/pt-BR/build-with-claude/handling-stop-reasons
---

# Guia Completo da Messages API

A **Messages API** (`POST /v1/messages`) é o endpoint fundamental da Claude Platform. Ela adota um modelo estritamente estruturado e sem estado (*stateless*), onde o cliente envia um histórico de turnos de diálogo (`messages`) acompanhado de parâmetros de controle e instruções de sistema.

---

## Estrutura do Payload de Requisição

```json
{
  "model": "claude-3-7-sonnet-20250219",
  "max_tokens": 4096,
  "system": "Você é um assistente especializado em engenharia de dados. Responda com precisão e clareza.",
  "messages": [
    {
      "role": "user",
      "content": "Como otimizar consultas complexas com particionamento no PostgreSQL?"
    }
  ],
  "temperature": 0.7
}
```

### Principais Parâmetros da Requisição

| Parâmetro | Tipo | Obrigatório? | Descrição |
|---|---|---|---|
| `model` | string | **Sim** | ID oficial do modelo (ex: `claude-3-7-sonnet-20250219`, `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`). |
| `max_tokens` | integer | **Sim** | Limite máximo de tokens gerados na resposta. |
| `messages` | array | **Sim** | Array de objetos de mensagem contendo `role` (`user` ou `assistant`) e `content`. |
| `system` | string ou array | Não | Instruções de nível superior que guiam a persona, restrições e comportamento do modelo. |
| `temperature` | number | Não | Grau de aleatoriedade (0.0 a 1.0). Valores menores geram respostas mais determinísticas. |
| `top_p` | number | Não | Amostragem por núcleo (*nucleus sampling*). |
| `top_k` | integer | Não | Amostragem pelos top K tokens mais prováveis. |
| `tools` | array | Não | Definições de ferramentas disponíveis para o modelo invocar. |
| `tool_choice` | object | Não | Modo de seleção de ferramentas (`auto`, `any`, `tool`). |
| `stream` | boolean | Não | Se `true`, a resposta é enviada via Server-Sent Events (SSE). |
| `thinking` | object | Não | Configuração do modo de raciocínio estendido (`type: "enabled"`, `budget_tokens: 4096`). |

---

## Regras de Estruturação do Histórico de Conversa

1. **Alternância Estrita de Turnos**: As mensagens devem alternar entre `user` e `assistant`. Não envie duas mensagens consecutivas com o mesmo `role` sem intercalar a resposta.
2. **Primeira Mensagem Deve Ser do Usuário**: O primeiro item do array `messages` deve obrigatoriamente ter `role: "user"`.
3. **Pré-preenchimento da Resposta do Assistente (Assistant Prefill)**: É permitido terminar o array com uma mensagem de `role: "assistant"`. O Claude continuará a geração exatamente a partir do prefixo fornecido:

```json
{
  "model": "claude-3-7-sonnet-20250219",
  "max_tokens": 1024,
  "messages": [
    {"role": "user", "content": "Gere um JSON com nome e idade de 3 pessoas."},
    {"role": "assistant", "content": "{\n  \"pessoas\": ["}
  ]
}
```

---

## Multimodalidade e Envio de Imagens

O Claude suporta imagens nos formatos **JPEG, PNG, GIF e WEBP** (até 32 MB por imagem ou 5 MB em base64 recomendado):

```json
{
  "model": "claude-3-7-sonnet-20250219",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/png",
            "data": "iVBORw0KGgoAAAANSUhEUgAA..."
          }
        },
        {
          "type": "text",
          "text": "Descreva a arquitetura de microsserviços representada neste diagrama."
        }
      ]
    }
  ]
}
```

---

## Streaming de Eventos SSE (Server-Sent Events)

Ao habilitar `stream: true`, a API emite eventos com a seguinte sequência canônica:

1. `event: message_start`: Informa os metadados da mensagem (`id`, `model`, `usage.input_tokens`).
2. `event: content_block_start`: Indica o início de um novo bloco de conteúdo (texto ou ferramenta).
3. `event: content_block_delta`: Emite os fragmentos incrementais de texto (`text_delta`) ou JSON da ferramenta (`input_json_delta`).
4. `event: content_block_stop`: Finaliza o bloco de conteúdo atual.
5. `event: message_delta`: Emite atualizações de encerramento (`stop_reason`, `usage.output_tokens`).
6. `event: message_stop`: Encerra o stream SSE.

```
event: message_start
data: {"type": "message_start", "message": {"id": "msg_123", "model": "claude-3-7-sonnet-20250219", "usage": {"input_tokens": 20}}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Olá!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn"}, "usage": {"output_tokens": 5}}

event: message_stop
data: {"type": "message_stop"}
```

---

## Tratamento de `stop_reason`

O campo `stop_reason` retornado no objeto de resposta indica por que o modelo finalizou o turno:

| Valor | Significado | Ação Recomendada |
|---|---|---|
| `end_turn` | Resposta concluída normalmente | Apresentar a resposta ao usuário. |
| `tool_use` | O modelo invocou uma ferramenta | Executar a função correspondente e retornar o `tool_result`. |
| `max_tokens` | Limite de saída atingido | Se a resposta foi truncada, solicitar continuação com o histórico. |
| `stop_sequence` | Encontrou uma string de parada | Interromper a geração e prosseguir o fluxo. |

---

## Veja Também

- [`../mensagens_e_prompting/prompt_caching.md`](../mensagens_e_prompting/prompt_caching.md)
- [`../mensagens_e_prompting/gerenciamento_de_contexto.md`](../mensagens_e_prompting/gerenciamento_de_contexto.md)
- [`../ferramentas_e_agentes/tool_use_visao_geral.md`](../ferramentas_e_agentes/tool_use_visao_geral.md)
- [`../referencia_api/endpoints_messages.md`](../referencia_api/endpoints_messages.md)
