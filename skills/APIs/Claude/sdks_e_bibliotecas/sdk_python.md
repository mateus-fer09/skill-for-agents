---
title: SDK Oficial de Python da Anthropic
description: Guia completo de instalação, clientes síncronos e assíncronos, streaming em tempo real, tratamento de exceções e tipagem com Pydantic.
topics:
  - python
  - sdk
  - streaming
  - async
  - pydantic
keywords:
  - anthropic-python
  - Anthropic
  - AsyncAnthropic
  - stream
  - APIError
related:
  - primeiros_passos/quickstart.md
  - mensagens_e_prompting/messages_api.md
  - ferramentas_e_agentes/tool_use_visao_geral.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/sdks/python
---

# SDK Oficial de Python da Anthropic

O pacote oficial `anthropic` oferece suporte completo e tipado para todas as APIs da Claude Platform, incluindo Messages API, Batches, Prompt Caching, Tool Calling e Streaming.

---

## Instalação e Requisitos

- Requer **Python 3.8+**

```bash
pip install anthropic
```

---

## Inicialização do Cliente

### Cliente Síncrono (`Anthropic`)

```python
import os
from anthropic import Anthropic

# A chave pode ser passada explicitamente ou lida de ANTHROPIC_API_KEY
client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
    max_retries=3,  # Número de tentativas automáticas com exponential backoff
    timeout=60.0    # Timeout em segundos
)
```

### Cliente Assíncrono (`AsyncAnthropic`)

```python
import asyncio
from anthropic import AsyncAnthropic

async def main():
    client = AsyncAnthropic()
    
    response = await client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Explique concorrência assíncrona em Python."}]
    )
    print(response.content[0].text)

asyncio.run(main())
```

---

## Streaming em Tempo Real (Event Streams)

O SDK Python disponibiliza gerenciadores de contexto otimizados para streaming de texto:

### Método 1: Helper `stream()` com Gerenciador de Contexto

```python
from anthropic import Anthropic

client = Anthropic()

with client.messages.stream(
    model="claude-3-7-sonnet-20250219",
    max_tokens=2048,
    messages=[{"role": "user", "content": "Escreva um ensaio sobre a história dos compiladores."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# Acessa a mensagem final completa acumulada após o stream
final_message = stream.get_final_message()
print(f"\n\nUso de Tokens: Entrada={final_message.usage.input_tokens}, Saída={final_message.usage.output_tokens}")
```

### Método 2: Streaming com Async/Await

```python
import asyncio
from anthropic import AsyncAnthropic

async def stream_chat():
    client = AsyncAnthropic()
    
    async with client.messages.stream(
        model="claude-3-7-sonnet-20250219",
        max_tokens=2048,
        messages=[{"role": "user", "content": "Gere uma função de ordenação rápida em Rust."}]
    ) as stream:
        async for chunk in stream.text_stream:
            print(chunk, end="", flush=True)

asyncio.run(stream_chat())
```

---

## Tratamento de Erros e Hierarquia de Exceções

O SDK fornece classes de exceção estruturadas sob `anthropic.APIError`:

```python
from anthropic import (
    Anthropic,
    APIError,
    APIConnectionError,
    RateLimitError,
    APIStatusError,
    BadRequestError,
    AuthenticationError,
    PermissionDeniedError,
    NotFoundError,
    UnprocessableEntityError,
    InternalServerError
)

client = Anthropic()

try:
    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Olá!"}]
    )
except RateLimitError as e:
    print(f"Limite de taxa atingido (429): {e.status_code} - {e.message}")
except AuthenticationError as e:
    print(f"Chave de API inválida (401): {e.message}")
except APIConnectionError as e:
    print(f"Falha de conexão com os servidores da Anthropic: {e.__cause__}")
except APIStatusError as e:
    print(f"Erro de status HTTP {e.status_code}: {e.response.text}")
except APIError as e:
    print(f"Erro genérico da API Anthropic: {e}")
```

---

## Uso com Tool Calling e Tipagem

```python
from anthropic import Anthropic

client = Anthropic()

tools = [
    {
        "name": "obter_cotacao_moeda",
        "description": "Retorna a cotação atualizada de um par de moedas.",
        "input_schema": {
            "type": "object",
            "properties": {
                "par": {
                    "type": "string",
                    "description": "Par de moedas, ex: USD-BRL, EUR-USD"
                }
            },
            "required": ["par"]
        }
    }
]

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=tools,
    messages=[
        {"role": "user", "content": "Qual a cotação atual do dólar para real (USD-BRL)?"}
    ]
)

for block in response.content:
    if block.type == "tool_use":
        print(f"Ferramenta invocada: {block.name}")
        print(f"ID da chamada: {block.id}")
        print(f"Argumentos: {block.input}")
```

---

## Veja Também

- [`../sdks_e_bibliotecas/sdk_typescript.md`](../sdks_e_bibliotecas/sdk_typescript.md)
- [`../mensagens_e_prompting/messages_api.md`](../mensagens_e_prompting/messages_api.md)
- [`../ferramentas_e_agentes/tool_use_visao_geral.md`](../ferramentas_e_agentes/tool_use_visao_geral.md)
