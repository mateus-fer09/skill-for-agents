---
title: Erros, Códigos de Status HTTP e Estratégia de Retries
description: Guia exaustivo de tratamento de erros da Claude API (400, 401, 403, 404, 429, 500, 529), schema JSON de erros e padrão de retry com exponential backoff e jitter.
topics:
  - erros
  - status-codes
  - rate-limits
  - retries
  - exponential-backoff
keywords:
  - invalid_request_error
  - authentication_error
  - rate_limit_error
  - overloaded_error
  - 429 529
related:
  - primeiros_passos/quickstart.md
  - sdks_e_bibliotecas/sdk_python.md
  - sdks_e_bibliotecas/sdk_typescript.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/api/errors
---

# Erros, Códigos de Status HTTP e Estratégia de Retries

Quando uma requisição à Claude API falha, a resposta retorna um código de status HTTP correspondente acompanhado de um payload JSON padronizado com detalhes da falha.

---

## Estrutura do Objeto de Erro

```json
{
  "type": "error",
  "error": {
    "type": "rate_limit_error",
    "message": "Number of request tokens has exceeded your per-minute rate limit."
  }
}
```

---

## Catálogo de Códigos de Status e Tipos de Erro

| Código HTTP | Tipo de Erro (`error.type`) | Causa Raiz | Ação Recomendada |
|---|---|---|---|
| **400** | `invalid_request_error` | Parâmetros inválidos, corpo JSON malformado ou violação de esquema. | Corrigir os campos enviados na requisição antes de retentar. |
| **401** | `authentication_error` | Chave de API ausente, expirada ou inválida. | Verificar o header `x-api-key` e a validade da credencial no Console. |
| **403** | `permission_error` | A chave de API não possui permissão para acessar o recurso ou modelo solicitado. | Ajustar as permissões no Workspace ou migrar para chave Admin. |
| **404** | `not_found_error` | O recurso solicitado (arquivo, lote, sessão, skill) não existe. | Validar o identificador informado. |
| **429** | `rate_limit_error` | O limite de requisições por minuto (RPM) ou tokens por minuto (TPM) foi excedido. | Aguardar o tempo indicado no header `Retry-After` e usar exponential backoff. |
| **500** | `api_error` | Erro interno inesperado nos servidores da Anthropic. | Retentar a requisição com backoff exponencial. |
| **529** | `overloaded_error` | A infraestrutura da Anthropic está temporariamente sobrecarregada. | Retentar após um breve intervalo com jitter aleatório. |

---

## Estratégia de Retry Recomendada (Exponential Backoff com Jitter)

Os SDKs oficiais da Anthropic implementam retries automáticos com **jitter** para códigos `429`, `500`, `529` e falhas de conexão de rede.

### Implementação Algorítmica:

```
delay = min(max_delay, base_delay * (2 ** attempt)) + random_jitter
```

### Exemplo em Python Puro:

```python
import time, random, requests

def chamar_claude_com_retry(payload, max_tentativas=5):
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": os.environ["ANTHROPIC_API_KEY"],
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    for tentativa in range(max_tentativas):
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            return response.json()
            
        # Códigos que devem ser retentados
        if response.status_code in [429, 500, 529]:
            retry_after = response.headers.get("retry-after")
            if retry_after:
                delay = float(retry_after)
            else:
                delay = min(60, (2 ** tentativa) + random.uniform(0.1, 1.0))
                
            print(f"Status {response.status_code}. Tentativa {tentativa + 1}/{max_tentativas}. Aguardando {delay:.2f}s...")
            time.sleep(delay)
        else:
            # Erros 400, 401, 403 não devem ser retentados
            response.raise_for_status()
            
    raise Exception("Número máximo de tentativas excedido.")
```

---

## Veja Também

- [`../referencia_api/endpoints_messages.md`](../referencia_api/endpoints_messages.md)
- [`../referencia_api/headers_versoes_e_limites.md`](../referencia_api/headers_versoes_e_limites.md)
