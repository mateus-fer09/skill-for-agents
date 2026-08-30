---
title: Exemplo Completo — Quickstart Responses API em Python
description: Código Python executável ponta a ponta demonstrando inicialização de cliente, envio de prompts, streaming SSE e tratamento de erros.
topics:
  - examples
  - python
  - responses-api
  - streaming
keywords:
  - python
  - client.responses.create
  - streaming
  - error handling
related:
  - ../responses_api/introducao_e_quickstart.md
  - ../responses_api/streaming_e_websockets.md
source_scope:
  - https://developers.openai.com/api/docs/quickstart.md
---

# Exemplo Completo — Quickstart Responses API em Python

Este exemplo demonstra uma implementação completa em Python utilizando o SDK oficial `openai`, cobrindo requisições síncronas, streaming Server-Sent Events (SSE) e tratamento de exceções.

---

## Código Fonte Completo (`quickstart_responses.py`)

```python
#!/usr/bin/env python3
"""
Exemplo Oficial: Responses API com Python
Requisitos: pip install openai
"""

import os
import sys
import openai
from openai import OpenAI

def main():
    # 1. Obter chave de API do ambiente
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Erro: A variável de ambiente OPENAI_API_KEY não está configurada.", file=sys.stderr)
        sys.exit(1)

    # 2. Inicializar o cliente oficial
    client = OpenAI(api_key=api_key)

    print("=== 1. Chamada Síncrona Padrão ===")
    try:
        response = client.responses.create(
            model="gpt-5.6",
            instructions="Você é um assistente técnico sênior especializado em inteligência artificial.",
            input="Explique o conceito de embeddings em processamento de linguagem natural em dois parágrafos.",
            temperature=0.7,
            max_output_tokens=300
        )
        
        print("\nResposta do Modelo:")
        print(response.output_text)
        print(f"\n[Tokens Utilizados: Prompt={response.usage.prompt_tokens}, Saída={response.usage.completion_tokens}, Total={response.usage.total_tokens}]")

    except openai.RateLimitError as e:
        print(f"Limite de requisições excedido: {e}", file=sys.stderr)
    except openai.APIError as e:
        print(f"Erro na API da OpenAI: {e}", file=sys.stderr)

    print("\n=== 2. Chamada com Streaming em Tempo Real ===")
    try:
        stream = client.responses.create(
            model="gpt-5.6",
            input="Liste 3 boas práticas essenciais para construir agentes de IA autônomos.",
            stream=True
        )

        print("Recebendo stream: ", end="", flush=True)
        for event in stream:
            if event.type == "response.output_item.delta" and hasattr(event.delta, "text"):
                print(event.delta.text, end="", flush=True)
            elif event.type == "response.completed":
                print("\n\n[Streaming finalizado com sucesso]")

    except Exception as e:
        print(f"\nErro no streaming: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()
```

---

## Como Executar

```bash
export OPENAI_API_KEY="sk-proj-..."
python quickstart_responses.py
```

---

## Referências Relacionadas

- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
- [`../responses_api/streaming_e_websockets.md`](../responses_api/streaming_e_websockets.md)
