---
title: Modelos de Raciocínio (o1, o3, o3-mini)
description: Guia técnico de modelos de raciocínio da OpenAI, cadeia de pensamento interna (Chain of Thought), reasoning_effort, gerenciamento de tokens de raciocínio e boas práticas de prompting.
topics:
  - reasoning-models
  - o1
  - o3
  - o3-mini
  - reasoning-effort
  - chain-of-thought
keywords:
  - reasoning_effort
  - reasoning_tokens
  - o1
  - o3
  - o3-mini
  - Chain of Thought
related:
  - ../modelos/catalogo_e_selecao.md
  - ../responses_api/introducao_e_quickstart.md
  - ../responses_api/structured_outputs.md
source_scope:
  - https://developers.openai.com/api/docs/guides/reasoning.md
  - https://developers.openai.com/api/docs/guides/reasoning-best-practices.md
---

# Modelos de Raciocínio (Família o-series: o1, o3, o3-mini)

Os modelos de raciocínio da OpenAI (**o1**, **o3**, **o3-mini**) utilizam aprendizado por reforço em larga escala para gerar uma cadeia de pensamento (*Chain of Thought*) interna antes de produzir a resposta visível.

---

## 1. Como Funcionam os Modelos de Raciocínio

1. Ao receber uma requisição, o modelo gera **tokens de raciocínio** (*reasoning tokens*) não visíveis diretamente, decompondo problemas complexos, explorando hipóteses e auto-corrigindo equívocos lógicos.
2. Após convergir para a solução, o modelo gera os **tokens de saída** visíveis (*completion tokens*).
3. Os tokens de raciocínio são cobrados na fatura como tokens de saída, mas são contabilizados separadamente no objeto `usage`.

```json
"usage": {
  "prompt_tokens": 150,
  "completion_tokens": 420,
  "total_tokens": 570,
  "completion_tokens_details": {
    "reasoning_tokens": 320,
    "accepted_prediction_tokens": 0,
    "rejected_prediction_tokens": 0
  }
}
```

---

## 2. Parâmetro `reasoning_effort`

Nos modelos `o3`, `o3-mini` e `o1`, é possível controlar o tempo e profundidade dedicados ao raciocínio através do parâmetro `reasoning_effort`:

| Valor de `reasoning_effort` | Comportamento | Casos Recomendados |
|---|---|---|
| `"low"` | Raciocínio conciso e rápido | Tarefas de lógica intermediária, consultas rápidas com Structured Outputs |
| `"medium"` (Padrão) | Raciocínio equilibrado | Resolução de bugs em código, redação técnica fundamentada |
| `"high"` | Raciocínio profundo e exaustivo | Demonstrações matemáticas, refatorações críticas de arquitetura, análises de vulnerabilidades |

### Exemplo de Uso em Python

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="o3-mini",
    input="Projete um algoritmo de ordenação customizado para streaming de eventos temporais com tolerância a out-of-order de 5 segundos.",
    reasoning_effort="high"
)

print(response.output_text)
```

---

## 3. Recursos Suportados pelos Modelos de Raciocínio

- **Function Calling e Ferramentas**: Suportado nativamente em `o3-mini` e `o3`.
- **Structured Outputs (`response_format: json_schema`)**: Suportado com 100% de aderência estrita.
- **Visão Computacional**: Suportado em `o1` e `o3`.
- **Streaming**: Suportado com Server-Sent Events.

---

## 4. Melhores Práticas de Prompting para Modelos o-series

> [!TIP]
> 1. **Não peça explicitamente 'Pense passo a passo'**: O modelo já faz isso nativamente de forma muito mais profunda em sua cadeia de pensamento oculta. Instruções manuais de CoT reduzem a eficácia do raciocínio interno.
> 2. **Forneça restrições e objetivos claros**: Especifique entradas, saídas esperadas, limitações e critérios de sucesso detalhados.
> 3. **Use Structured Outputs quando precisar de formato estrito**: Combine `response_format` com Pydantic/Zod para garantir JSON perfeito.

---

## 5. Referências Cruzadas

- [`../modelos/catalogo_e_selecao.md`](../modelos/catalogo_e_selecao.md)
- [`../responses_api/structured_outputs.md`](../responses_api/structured_outputs.md)
- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
