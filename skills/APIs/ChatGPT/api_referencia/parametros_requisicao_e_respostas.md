---
title: "Dicionário de Parâmetros de Requisição e Anatomia de Respostas"
description: "Referência completa de todos os hiperparâmetros da OpenAI API (temperature, top_p, max_completion_tokens, reasoning_effort, stream_options, seed, logprobs, presence_penalty, frequency_penalty, tool_choice, response_format) e anatomia detalhada do objeto de resposta com discriminação de tokens de raciocínio e cache."
topics: ["parametros", "temperature", "top_p", "reasoning_effort", "max_completion_tokens", "seed", "logprobs", "response-anatomy", "token-usage"]
keywords: ["temperature", "top_p", "reasoning_effort", "max_completion_tokens", "presence_penalty", "frequency_penalty", "completion_tokens_details", "prompt_tokens_details"]
source_scope: "OpenAI API Docs: API Reference > Chat Create Parameters, Reasoning Effort & Response Body"
---

# Dicionário de Parâmetros de Requisição e Anatomia de Respostas

Este módulo documenta exaustivamente todos os parâmetros de amostragem, limites, formatos de saída e a estrutura dos objetos de retorno da OpenAI API.

---

## 1. Dicionário de Hiperparâmetros de Entrada

### 1.1. Amostragem e Criatividade
- **`temperature` (Float, Padrão: `1.0`, Faixa: `0.0` a `2.0`):**
  - Controla o grau de aleatoriedade na amostragem de tokens.
  - Valores próximos de `0.0` tornam a resposta determinística, analítica e focada (ideal para código e extração de dados).
  - Valores próximos de `1.0` a `1.5` geram respostas criativas e diversificadas.
  - *Nota:* Não suportado nos modelos de raciocínio `o1` e `o3-mini`.
- **`top_p` (Float, Padrão: `1.0`, Faixa: `0.0` a `1.0`):**
  - Amostragem por núcleo (*Nucleus Sampling*). O modelo considera apenas os tokens com massa de probabilidade acumulada `top_p`.
  - Recomenda-se alterar `temperature` OU `top_p`, nunca ambos simultaneamente.
- **`presence_penalty` (Float, Padrão: `0.0`, Faixa: `-2.0` a `2.0`):**
  - Penaliza tokens com base na sua presença prévia no texto gerado, incentivando o modelo a introduzir novos tópicos.
- **`frequency_penalty` (Float, Padrão: `0.0`, Faixa: `-2.0` a `2.0`):**
  - Penaliza tokens com base na sua frequência exata no texto, reduzindo repetições literais de palavras e frases.

---

### 1.2. Limites de Saída e Raciocínio
- **`max_completion_tokens` (Inteiro, Opcional):**
  - Define o teto máximo de tokens gerados pelo modelo na resposta.
  - **Obrigatório para modelos de raciocínio (`o1`, `o3-mini`)**, onde este limite DEVE acomodar a soma dos tokens de raciocínio interno (`reasoning_tokens`) e os tokens visíveis finais.
- **`max_tokens` (Inteiro, Legado):**
  - Teto de tokens de saída para modelos GPT tradicionais (substituído por `max_completion_tokens` nos modelos modernos).
- **`reasoning_effort` (String, Padrão: `"medium"`, Valores: `"low"`, `"medium"`, `"high"`):**
  - Exclusivo dos modelos de raciocínio (`o1`, `o3-mini`). Controla a profundidade e a quantidade de tokens gastos na cadeia de pensamento interna antes de emitir a resposta.
- **`stop` (String ou Array de Strings, até 4 sequências):**
  - Sequências de parada onde o modelo interrompe a geração imediatamente.

---

### 1.3. Formatação e Determinismo
- **`response_format` (Objeto):**
  - `{"type": "text"}`: Resposta tradicional em texto plano ou markdown.
  - `{"type": "json_object"}`: Garante sintaxe JSON válida (requer instrução explícita de JSON no prompt).
  - `{"type": "json_schema", "json_schema": {"name": "...", "strict": true, "schema": {...}}}`: Structured Outputs com 100% de garantia de esquema.
- **`seed` (Inteiro, Opcional):**
  - Semente determinística para amostragem pseudo-aleatória repetível.
- **`stream` (Booleano, Padrão: `false`):**
  - Habilita o streaming de chunks via Server-Sent Events (SSE).
- **`stream_options` (Objeto):**
  - `{"include_usage": true}`: Emite o objeto final de consumo de tokens no último chunk do stream.
- **`logprobs` (Booleano, Padrão: `false`) e `top_logprobs` (Inteiro, 0 a 20):**
  - Retorna as probabilidades logarítmicas dos tokens gerados para análise de confiança.

---

## 2. Anatomia do Objeto de Resposta (`ChatCompletion`)

### 2.1. Estrutura JSON Completa

```json
{
  "id": "chatcmpl-Ai8Qv9k2xLp3...",
  "object": "chat.completion",
  "created": 1724832000,
  "model": "gpt-4o-2024-08-06",
  "system_fingerprint": "fp_831e089d82",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Aqui está a resposta explicativa gerada pelo modelo.",
        "refusal": null,
        "tool_calls": null
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 128,
    "total_tokens": 170,
    "prompt_tokens_details": {
      "cached_tokens": 0,
      "audio_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  }
}
```

---

## 3. Motivos de Conclusão (`finish_reason`)

O campo `finish_reason` indica por que a geração foi encerrada:

| `finish_reason` | Significado Técnico | Ação Recomendada |
| :--- | :--- | :--- |
| **`"stop"`** | O modelo completou naturalmente a resposta ou encontrou uma sequência de parada `stop`. | Resposta completa e pronta para uso. |
| **`"length"`** | O modelo atingiu o teto de `max_completion_tokens` ou o limite da janela de contexto antes de terminar. | Aumentar `max_completion_tokens` ou encurtar o prompt. |
| **`"tool_calls"`** | O modelo decidiu invocar uma ou mais ferramentas (`tools`). | Executar as ferramentas e submeter os resultados. |
| **`"content_filter"`** | A geração foi interrompida pelo sistema de filtros de moderação da OpenAI. | Ajustar o conteúdo do prompt para respeitar as políticas. |

---

## 4. Detalhamento de Consumo de Tokens (`usage`)

- **`prompt_tokens`:** Total de tokens na entrada da requisição.
  - `prompt_tokens_details.cached_tokens`: Tokens de prompt que se beneficiaram de **Prompt Caching** (desconto de 50% na entrada para prompts longos repetidos).
- **`completion_tokens`:** Total de tokens gerados na saída.
  - `completion_tokens_details.reasoning_tokens`: Quantidade de tokens gastos na cadeia de raciocínio interno (em modelos `o1` e `o3-mini`).
