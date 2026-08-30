---
title: Middleware do SDK e Integrações
description: Criação de interceptadores de requisição, logging de auditoria, observabilidade com OpenTelemetry e integração com Apple Foundation Models.
topics:
  - middleware
  - interceptors
  - observabilidade
  - telemetria
keywords:
  - middleware
  - opentelemetry
  - hooks
  - apple foundation models
related:
  - sdks_e_bibliotecas/sdk_python.md
  - sdks_e_bibliotecas/sdk_typescript.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/middleware
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/libraries/apple-foundation-models
---

# Middleware do SDK e Integrações

Os SDKs da Anthropic suportam a injeção de middlewares personalizados e hooks para interceptar requisições e respostas HTTP.

---

## Casos de Uso Comuns para Middlewares

1. **Auditoria e Logging de Conformidade**: Gravação de metadados de requisições, IDs de mensagens e contagem de tokens para controle de custos.
2. **Rastreamento Distribuído (Distributed Tracing)**: Injeção de cabeçalhos W3C `traceparent` / OpenTelemetry.
3. **Métricas de Latência (Time-to-First-Token - TTFT)**: Medição precisa do tempo entre o disparo da requisição e o primeiro chunk de streaming.
4. **Tratamento Customizado de Rate Limits**: Enfileiramento e roteamento automático em caso de esgotamento de quota.

---

## Exemplo de Middleware em Python (com `httpx` Customizado)

O SDK `anthropic` utiliza internamente a biblioteca `httpx`, permitindo registrar interceptadores (`Event Hooks`):

```python
import time
import httpx
from anthropic import Anthropic

def log_request(request: httpx.Request):
    request.state_start_time = time.time()
    print(f"[HTTP Request] {request.method} {request.url}")

def log_response(response: httpx.Response):
    duration = time.time() - getattr(response.request, "state_start_time", time.time())
    print(f"[HTTP Response] Status {response.status_code} em {duration:.3f}s")
    if "anthropic-ratelimit-requests-remaining" in response.headers:
        print(f"  Requests restantes: {response.headers['anthropic-ratelimit-requests-remaining']}")

# Criação do cliente HTTP customizado com hooks
http_client = httpx.Client(
    event_hooks={
        "request": [log_request],
        "response": [log_response]
    }
)

client = Anthropic(http_client=http_client)

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=100,
    messages=[{"role": "user", "content": "Status do sistema?"}]
)
```

---

## Exemplo de Middleware em TypeScript (Fetch Interceptor)

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  fetch: async (url, init) => {
    const startTime = Date.now();
    console.log(`[API Call Início] ${init?.method} ${url}`);

    const response = await fetch(url, init);
    const duration = Date.now() - startTime;

    console.log(`[API Call Fim] Status: ${response.status} (${duration}ms)`);
    return response;
  },
});
```

---

## Veja Também

- [`../sdks_e_bibliotecas/sdk_python.md`](../sdks_e_bibliotecas/sdk_python.md)
- [`../sdks_e_bibliotecas/sdk_typescript.md`](../sdks_e_bibliotecas/sdk_typescript.md)
- [`../administracao_e_governanca/monitoramento_custos_e_limites.md`](../administracao_e_governanca/monitoramento_custos_e_limites.md)
