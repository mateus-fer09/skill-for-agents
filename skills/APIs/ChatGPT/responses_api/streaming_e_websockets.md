---
title: Streaming de Respostas e WebSocket Mode
description: Guia de streaming em tempo real na Responses API usando Server-Sent Events (SSE) e Responses WebSocket Mode para conexões bidirecionais persistentes.
topics:
  - streaming
  - server-sent-events
  - websocket-mode
  - real-time-responses
keywords:
  - stream
  - Server-Sent Events
  - SSE
  - WebSocket Mode
  - response.delta
  - wss://api.openai.com/v1/responses
related:
  - ../responses_api/introducao_e_quickstart.md
  - ../responses_api/gerenciamento_de_estado.md
  - ../multimidia_e_tempo_real/realtime_api_websocket.md
source_scope:
  - https://developers.openai.com/api/docs/guides/streaming-responses.md
  - https://developers.openai.com/api/docs/guides/websocket-mode.md
  - https://developers.openai.com/api/reference/resources/beta/subresources/responses/streaming-events.md
  - https://developers.openai.com/api/reference/resources/beta/subresources/responses/websocket-events.md
---

# Streaming de Respostas e Responses WebSocket Mode

A OpenAI oferece duas abordagens para streaming de respostas:
1. **Server-Sent Events (SSE)**: Unidirecional sobre HTTP/1.1 ou HTTP/2 para aplicações web tradicionais e backends.
2. **Responses WebSocket Mode**: Canal full-duplex bidirecional e multiplexado sobre WebSockets (`wss://`), ideal para conexões persistentes, interrupções instantâneas e múltiplos turnos.

---

## 1. Streaming via Server-Sent Events (SSE)

### Exemplo em Python com Iterador de Stream

```python
from openai import OpenAI

client = OpenAI()

stream = client.responses.create(
    model="gpt-5.6",
    input="Escreva um ensaio curto sobre a história da criptografia.",
    stream=True
)

for event in stream:
    # Captura deltas de texto emitidos progressivamente
    if event.type == "response.output_item.delta":
        delta = event.delta
        if hasattr(delta, "text"):
            print(delta.text, end="", flush=True)
    elif event.type == "response.completed":
        print("\n\n[Resposta concluída com sucesso]")
```

### Exemplo em TypeScript / JavaScript

```typescript
import OpenAI from "openai";

const client = new OpenAI();

async function streamResponse() {
  const stream = await client.responses.create({
    model: "gpt-5.6",
    input: "Explique como funciona o algoritmo Raft.",
    stream: true,
  });

  for await (const event of stream) {
    if (event.type === "response.output_item.delta" && event.delta?.text) {
      process.stdout.write(event.delta.text);
    }
  }
}

streamResponse();
```

---

## 2. Eventos Principais do Stream SSE

| Nome do Evento | Descrição |
|---|---|
| `response.created` | Emitido quando a resposta foi inicializada no servidor. |
| `response.output_item.added` | Emitido quando um novo item (texto, chamada de ferramenta, etc.) inicia. |
| `response.output_item.delta` | Contém o fragmento incremental (`text`, `audio`, etc.). |
| `response.output_item.done` | Item específico finalizado. |
| `response.completed` | Resposta inteira finalizada, contendo objeto `usage` com contagem final de tokens. |
| `error` | Erro ocorrido durante a transmissão. |

---

## 3. Responses WebSocket Mode

O **Responses WebSocket Mode** permite manter uma única conexão persistente para múltiplos comandos e respostas:

### Endpoint WebSocket

```text
wss://api.openai.com/v1/responses
```

### Cabeçalhos de Conexão

```http
Authorization: Bearer YOUR_OPENAI_API_KEY
OpenAI-Beta: responses_websockets=v1
```

### Fluxo de Mensagens WebSocket

1. **Cliente envia `response.create`**:
```json
{
  "type": "response.create",
  "response": {
    "model": "gpt-5.6",
    "input": "Analise a performance deste loop for."
  }
}
```

2. **Servidor transmite eventos em tempo real**:
```json
{
  "type": "response.output_item.delta",
  "response_id": "resp_12345",
  "delta": { "text": "O " }
}
```

3. **Cliente pode enviar `response.cancel` a qualquer momento para interromper**:
```json
{
  "type": "response.cancel",
  "response_id": "resp_12345"
}
```

---

## 4. Reconexão e Recuperação de Stream

Caso a conexão de rede caia no meio de uma resposta:
1. Armazene o `response.id` recebido no primeiro evento `response.created`.
2. Reconecte chamando `client.responses.stream(response_id, starting_after=last_sequence_id)`.

---

## 5. Referências Cruzadas

- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
- [`../responses_api/gerenciamento_de_estado.md`](../responses_api/gerenciamento_de_estado.md)
- [`../multimidia_e_tempo_real/realtime_api_websocket.md`](../multimidia_e_tempo_real/realtime_api_websocket.md)
- [`../referencia_api/responses_e_chat.md`](../referencia_api/responses_e_chat.md)
