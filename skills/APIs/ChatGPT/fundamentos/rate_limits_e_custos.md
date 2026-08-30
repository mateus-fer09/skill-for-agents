---
title: Rate Limits, Latência e Otimização de Custos
description: Gestão de limites de taxa (RPM, RPD, TPM, TPD), tiers de uso, otimização de latência, prompt caching, flex processing e spend limits.
topics:
  - rate-limits
  - cost-optimization
  - latency-optimization
  - prompt-caching
  - flex-processing
keywords:
  - TPM
  - RPM
  - 429 Too Many Requests
  - Retry-After
  - Prompt Caching
  - Flex Mode
  - Fast Mode
related:
  - ../fundamentos/overview_e_arquitetura.md
  - ../modelos/precificacao_e_limites.md
  - ../responses_api/prompt_caching_e_predicted.md
source_scope:
  - https://developers.openai.com/api/docs/guides/rate-limits.md
  - https://developers.openai.com/api/docs/guides/cost-optimization.md
  - https://developers.openai.com/api/docs/guides/latency-optimization.md
  - https://developers.openai.com/api/docs/guides/fast-mode.md
  - https://developers.openai.com/api/docs/guides/flex-processing.md
---

# Rate Limits, Latência e Otimização de Custos

---

## 1. Como Funcionam os Rate Limits

Os limites de taxa da OpenAI são medidos em 4 dimensões principais:
1. **RPM (Requests Per Minute)**: Máximo de requisições por minuto.
2. **RPD (Requests Per Day)**: Máximo de requisições por dia.
3. **TPM (Tokens Per Minute)**: Máximo de tokens processados (soma de input e output) por minuto.
4. **TPD (Tokens Per Day)**: Máximo de tokens por dia.

### Cabeçalhos de Resposta HTTP de Rate Limit

```http
x-ratelimit-limit-requests: 5000
x-ratelimit-limit-tokens: 2000000
x-ratelimit-remaining-requests: 4998
x-ratelimit-remaining-tokens: 1995400
x-ratelimit-reset-requests: 12ms
x-ratelimit-reset-tokens: 138ms
```

Ao receber o código de status **HTTP 429 (Too Many Requests)**, examine o cabeçalho `Retry-After` ou aplique **Exponential Backoff com Jitter**.

---

## 2. Tiers de Uso da Organização

A OpenAI classifica organizações em faixas (*tiers*) baseadas no histórico cumulativo de pagamentos:
- **Tier 1**: $5 pagos. Limites básicos para prototipagem.
- **Tier 2**: $50 pagos e 7+ dias de histórico.
- **Tier 3**: $100 pagos e 7+ dias de histórico.
- **Tier 4**: $250 pagos e 14+ dias de histórico.
- **Tier 5**: $1,000+ pagos e 30+ dias de histórico. Acesso a limites máximos de TPM/RPM.

---

## 3. Estratégias de Otimização de Custos

### 3.1 Prompt Caching Automático
- Para prompts com 1.024 tokens ou mais, a OpenAI aplica automaticamente **50% de desconto** nos tokens de entrada em cache.
- Mantenha instruções do sistema e documentos de contexto fixos no início da entrada para maximizar o cache hit.

### 3.2 Flex Processing
- Para cargas de trabalho assíncronas (que não exigem baixa latência imediata), o **Flex Processing** oferece até **50% de economia** adicional.

### 3.3 Batch API
- Processamento assíncrono em lote (com conclusão garantida em até 24 horas) com **50% de desconto** em relação à API síncrona.

### 3.4 Seleção Eficiente de Modelo
- Use modelos da família `mini` (ex.: `gpt-5-mini`, `gpt-4.1-mini`, `o3-mini`) para tarefas de classificação, extração e roteamento, reservando modelos topo de linha (`gpt-5.6`, `o3`) para raciocínio complexo e orquestração final.

---

## 4. Estratégias de Redução de Latência

1. **Streaming (SSE)**: Retorna tokens progressivamente, reduzindo o *Time to First Token (TTFT)* percibido pelo usuário.
2. **Predicted Outputs**: Permite antecipar partes conhecidas do texto (ex.: código sendo refatorado), acelerando drasticamente a geração.
3. **Fast Mode**: Habilita execução até 2.5x mais rápida para modelos suportados.
4. **reasoning_effort**: Para modelos de raciocínio (`o1`, `o3-mini`), configure `reasoning_effort: "low"` ou `"medium"` quando respostas ultra-profundas não forem necessárias.

---

## 5. Referências Cruzadas

- [`../fundamentos/overview_e_arquitetura.md`](../fundamentos/overview_e_arquitetura.md)
- [`../modelos/precificacao_e_limites.md`](../modelos/precificacao_e_limites.md)
- [`../responses_api/prompt_caching_e_predicted.md`](../responses_api/prompt_caching_e_predicted.md)
