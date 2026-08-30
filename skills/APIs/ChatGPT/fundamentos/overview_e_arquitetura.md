---
title: Visão Geral e Arquitetura da OpenAI API
description: Introdução à plataforma da OpenAI API, arquitetura moderna com Responses API, convenções REST e fluxo de requisições.
topics:
  - api-overview
  - responses-api-architecture
  - rest-conventions
  - base-url
keywords:
  - OpenAI API
  - Responses API
  - client.responses.create
  - api.openai.com/v1
  - REST
related:
  - ../fundamentos/autenticacao_e_seguranca.md
  - ../fundamentos/sdks_e_cli.md
  - ../responses_api/introducao_e_quickstart.md
source_scope:
  - https://developers.openai.com/api/docs/concepts.md
  - https://developers.openai.com/api/reference/overview.md
---

# Visão Geral e Arquitetura da OpenAI API

A **OpenAI API** oferece uma interface unificada e de alto desempenho para modelos de linguagem natural de última geração (GPT-5, GPT-5.6 Sol, GPT-4.1), modelos de raciocínio avançado (família o1, o3, o3-mini), visão computacional, geração e edição de imagens (GPT-image-1, DALL-E 3), processamento e geração de áudio (TTS e Whisper), geração de vídeo (Sora) e orquestração de agentes autônomos com o OpenAI Agents SDK.

---

## 1. Arquitetura Moderna: Responses API vs Chat Completions

A OpenAI introduziu a **Responses API** (`/v1/responses`) como a arquitetura primária para todas as novas integrações:

| Dimensão | Responses API (`/v1/responses`) | Chat Completions (`/v1/chat/completions`) |
|---|---|---|
| **Paradigma** | Centrado em conversas de múltiplos passos, ferramentas nativas e ciclos agênticos | Centrado em mensagens sequenciais de texto |
| **Ferramentas Nativas** | Web Search, File Search, Code Interpreter, Computer Use, Apply Patch, Remote MCP | Apenas Function Calling básico definido pelo cliente |
| **Gerenciamento de Estado** | Nativo com `conversation_id` e continuações de turnos no servidor | O cliente precisa reenviar todo o histórico em cada chamada |
| **Streaming** | Server-Sent Events (SSE) e WebSocket Mode bidirecional multiplexado | Apenas SSE unidirecional simples |
| **Compactação de Contexto** | Suporte a `compaction` no servidor para conversas longas | Truncamento e sumarização manuais pelo cliente |
| **Raciocínio** | Controle estrito de `reasoning_effort` e persistência de tokens de raciocínio | Suporte básico a reasoning |

> [!IMPORTANT]
> Para todas as novas aplicações, utilize a **Responses API**. A API de Chat Completions continua disponível para compatibilidade retroativa e sistemas legados.

---

## 2. Ponto de Entrada e Convenções REST

Todas as requisições HTTP REST devem ser direcionadas para a Base URL oficial:

```http
https://api.openai.com/v1
```

### Cabeçalhos Padrão de Requisição

```http
POST /v1/responses HTTP/1.1
Host: api.openai.com
Authorization: Bearer YOUR_OPENAI_API_KEY
Content-Type: application/json
OpenAI-Organization: org-xxxxxxxxxxxx  # Opcional (se o usuário pertencer a múltiplas orgs)
OpenAI-Project: proj_xxxxxxxxxxxx      # Opcional (para isolamento por projeto)
```

---

## 3. Estrutura Básica de Requisição (Responses API)

### Exemplo em Python (SDK Oficial `openai`)

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

response = client.responses.create(
    model="gpt-5.6",
    input="Explique o funcionamento de redes neurais residuais em duas frases.",
    tools=[{"type": "web_search"}]
)

print(response.output_text)
```

### Exemplo em TypeScript / JavaScript (Node.js)

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.responses.create({
  model: "gpt-5.6",
  input: "Qual a capital da França?",
});

console.log(response.output_text);
```

### Exemplo com cURL

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": "Resuma a teoria da relatividade geral."
  }'
```

---

## 4. Tipos de Mensagens e Entradas Suportadas

A Responses API aceita múltiplos formatos no parâmetro `input`:
- **String direta**: Texto simples (`input: "Qual a capital do Brasil?"`).
- **Lista de mensagens estruturadas**: Objetos com papéis (`developer`, `user`, `assistant`).
- **Conteúdo multimodal**: Imagens via URL pública ou Base64, áudio e arquivos (PDF, CSV, TXT, DOCX).
- **Itens de ferramentas**: Chamadas de ferramentas (`function_call`) e seus respectivos retornos (`function_call_output`).

---

## 5. Referências Cruzadas

- [`../fundamentos/autenticacao_e_seguranca.md`](../fundamentos/autenticacao_e_seguranca.md)
- [`../fundamentos/sdks_e_cli.md`](../fundamentos/sdks_e_cli.md)
- [`../fundamentos/rate_limits_e_custos.md`](../fundamentos/rate_limits_e_custos.md)
- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
