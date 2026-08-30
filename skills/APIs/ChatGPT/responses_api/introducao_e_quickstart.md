---
title: Introdução e Quickstart da Responses API
description: Guia completo de inicialização e ciclo de vida da Responses API (/v1/responses), parâmetros create, retrieve, cancel e inspect.
topics:
  - responses-api
  - quickstart
  - client-responses-create
  - input-types
  - responses-lifecycle
keywords:
  - client.responses.create
  - responses
  - model
  - input
  - instructions
  - tools
  - output_text
related:
  - ../responses_api/structured_outputs.md
  - ../responses_api/streaming_e_websockets.md
  - ../responses_api/gerenciamento_de_estado.md
  - ../ferramentas_e_mcp/function_calling.md
source_scope:
  - https://developers.openai.com/api/docs/quickstart.md
  - https://developers.openai.com/api/reference/resources/responses/methods/create.md
  - https://developers.openai.com/api/docs/guides/migrate-to-responses.md
---

# Introdução e Quickstart da Responses API

A **Responses API** (`/v1/responses`) é a interface central e recomendada da OpenAI para processamento de linguagem, raciocínio, uso de ferramentas nativas e fluxos agênticos contínuos.

---

## 1. Ciclo de Vida de uma Resposta

Quando uma requisição é enviada para `client.responses.create`:
1. **Entrada de Contexto**: A API ingere o `input` (texto, mensagens estruturadas, imagens, arquivos ou retornos de ferramentas).
2. **Execução de Ferramentas (se aplicável)**: O modelo pode acionar ferramentas nativas (Web Search, File Search, Code Interpreter) ou solicitar a execução de funções (`function_call`) no cliente.
3. **Resolução de Raciocínio**: Para modelos como `o3` ou `o3-mini`, a cadeia interna de pensamento é processada com base em `reasoning_effort`.
4. **Emissão de Saída**: O objeto `response` é retornado contendo `output_text`, itens estruturados em `output` e metadados de consumo em `usage`.

---

## 2. Parâmetros Principais de `client.responses.create`

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|---|---|---|---|---|
| `model` | `string` | **Sim** | - | Identificador do modelo (ex.: `"gpt-5.6"`, `"o3-mini"`, `"gpt-5-mini"`). |
| `input` | `string` \| `array` | **Sim** | - | Conteúdo ou lista de itens de entrada da conversa. |
| `instructions` | `string` | Não | `null` | Diretriz de nível de sistema para orientar o comportamento do modelo. |
| `tools` | `array` | Não | `[]` | Lista de ferramentas habilitadas (ex.: `[{"type": "web_search"}]`). |
| `temperature` | `number` | Não | `1.0` | Variabilidade das respostas (0.0 a 2.0). Em modelos `o-series`, use padrão. |
| `max_output_tokens`| `integer` | Não | `null` | Limite máximo de tokens gerados na resposta. |
| `reasoning_effort`| `string` | Não | `"medium"` | Nível de raciocínio para modelos o-series (`"low"`, `"medium"`, `"high"`). |
| `response_format` | `object` | Não | `null` | Formato estruturado de saída (ex.: `json_schema` estrito). |
| `stream` | `boolean` | Não | `false` | Se `true`, ativa transmissão Server-Sent Events (SSE). |
| `conversation` | `string` \| `object` | Não | `null` | ID da conversa existente para manter histórico no servidor. |

---

## 3. Exemplo Completo em Python

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    instructions="Você é um arquiteto de software sênior focado em microsserviços.",
    input="Quais os trade-offs entre arquitetura orientada a eventos vs REST síncrono?",
    temperature=0.7,
    max_output_tokens=1500
)

# Acesso direto ao texto gerado
print("Resposta do Modelo:")
print(response.output_text)

# Métricas de consumo de tokens
print("\nUso de Tokens:")
print(f"Prompt Tokens: {response.usage.prompt_tokens}")
print(f"Completion Tokens: {response.usage.completion_tokens}")
print(f"Total: {response.usage.total_tokens}")
```

---

## 4. Exemplo Completo em TypeScript

```typescript
import OpenAI from "openai";

const client = new OpenAI();

async function run() {
  const response = await client.responses.create({
    model: "gpt-5.6",
    instructions: "Você é um assistente técnico conciso.",
    input: "Como implementar autenticação JWT de forma segura?",
  });

  console.log(response.output_text);
}

run();
```

---

## 5. Métodos Complementares da Responses API

- **`client.responses.retrieve(response_id)`**: Recupera o estado e os itens de uma resposta previamente gerada.
- **`client.responses.cancel(response_id)`**: Cancela uma resposta em execução assíncrona ou streaming.
- **`client.responses.compact(response_id)`**: Executa a compactação do contexto histórico no lado do servidor.

---

## 6. Referências Cruzadas

- [`../responses_api/structured_outputs.md`](../responses_api/structured_outputs.md)
- [`../responses_api/streaming_e_websockets.md`](../responses_api/streaming_e_websockets.md)
- [`../responses_api/gerenciamento_de_estado.md`](../responses_api/gerenciamento_de_estado.md)
- [`../referencia_api/responses_e_chat.md`](../referencia_api/responses_e_chat.md)
