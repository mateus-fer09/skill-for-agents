---
title: Prompt Caching na Claude API
description: Guia de arquitetura, configuração de blocos efêmeros, limiares de tokens, redução de 90% em custos e diagnósticos de cache.
topics:
  - prompt-caching
  - performance
  - reducao-de-custos
  - latencia
keywords:
  - cache_control
  - ephemeral
  - cache write
  - cache read
  - cache diagnostics
related:
  - fundamentos/modelos_e_precos.md
  - mensagens_e_prompting/messages_api.md
  - referencia_api/endpoints_messages.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/build-with-claude/prompt-caching
  - https://platform.claude.com/docs/pt-BR/build-with-claude/cache-diagnostics
---

# Prompt Caching na Claude API

O **Prompt Caching** é um recurso de infraestrutura de alto desempenho que permite armazenar na memória do servidor o estado de processamento de blocos de contexto que não mudam entre requisições.

---

## Benefícios Técnicos

1. **Redução de Custos de até 90%**: Os tokens lidos do cache (`cache_read_input_tokens`) custam apenas 10% do valor do token de entrada padrão.
2. **Redução de Latência de até 85%**: Elimina a necessidade de reprocessar matrizes de atenção para documentos longos e system prompts extensos.
3. **Validade Efêmera de 5 Minutos**: Cada leitura bem-sucedida reinicia o contador de TTL (Time-To-Live) de 5 minutos.

---

## Regras e Limiares Mínimos de Tokens

Para que um bloco seja aceito no cache, o prefixo acumulado até o ponto de interrupção (*breakpoint*) deve atender ao tamanho mínimo exigido pelo modelo:

| Modelo | Limiar Mínimo para Caching |
|---|---|
| **Claude 3.7 Sonnet / Claude 3.5 Sonnet / Claude 3 Opus** | **1.024 tokens** |
| **Claude 3.5 Haiku / Claude 3 Haiku** | **2.048 tokens** |

> [!IMPORTANT]
> É possível definir no máximo **4 pontos de cache (breakpoints)** por requisição utilizando o bloco `cache_control: {"type": "ephemeral"}`.

---

## Como Configurar o Prompt Caching

O bloco `cache_control` pode ser adicionado em:
1. **System Prompts**: No final de um bloco de instruções de sistema longo.
2. **Definições de Ferramentas (`tools`)**: No último item da lista de ferramentas.
3. **Mensagens (`messages`)**: Em turnos específicos do usuário com documentos grandes ou histórico consolidado.

### Exemplo em JSON Direto

```json
{
  "model": "claude-3-7-sonnet-20250219",
  "max_tokens": 2048,
  "system": [
    {
      "type": "text",
      "text": "Você é um auditor financeiro. Analise os demonstrativos a seguir com rigor técnico."
    },
    {
      "type": "text",
      "text": "=== MANUAL DE NORMAS IFRS E CÓDIGO TRIBUTÁRIO (15.000 tokens) ===\n...",
      "cache_control": {"type": "ephemeral"}
    }
  ],
  "messages": [
    {
      "role": "user",
      "content": "Com base no manual em cache, como reconhecer receita de contratos plurianuais?"
    }
  ]
}
```

### Exemplo no SDK Python

```python
from anthropic import Anthropic

client = Anthropic()

# Carrega documento grande
with open("base_conhecimento.txt", "r", encoding="utf-8") as f:
    documento = f.read()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": documento,
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {"role": "user", "content": "Qual a cláusula de rescisão contratual?"}
    ]
)

# Inspecionando o uso de cache retornado
usage = response.usage
print(f"Tokens normais de entrada: {usage.input_tokens}")
print(f"Tokens gravados no cache: {getattr(usage, 'cache_creation_input_tokens', 0)}")
print(f"Tokens lidos do cache (90% desc): {getattr(usage, 'cache_read_input_tokens', 0)}")
```

---

## Métricas de Resposta de Cache

No objeto `usage` retornado pela API:
- `cache_creation_input_tokens`: Quantidade de tokens que foram computados e gravados no cache pela primeira vez (cobrados a 1,25x da entrada padrão).
- `cache_read_input_tokens`: Quantidade de tokens lidos diretamente da memória com **90% de desconto**.
- `input_tokens`: Quantidade de tokens não cacheados que foram processados normalmente.

---

## Veja Também

- [`../fundamentos/modelos_e_precos.md`](../fundamentos/modelos_e_precos.md)
- [`../mensagens_e_prompting/messages_api.md`](../mensagens_e_prompting/messages_api.md)
- [`../mensagens_e_prompting/gerenciamento_de_contexto.md`](../mensagens_e_prompting/gerenciamento_de_contexto.md)
