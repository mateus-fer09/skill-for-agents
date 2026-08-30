---
title: Preços, Limites de Contexto e Comparativo de Modelos
description: Tabela detalhada de preços por milhão de tokens (input, output, cached input), janelas de contexto máximo e limites de output.
topics:
  - pricing
  - context-window
  - token-limits
  - compare-models
keywords:
  - pricing
  - context_window
  - max_output_tokens
  - token costs
  - prompt caching discount
related:
  - ../modelos/catalogo_e_selecao.md
  - ../fundamentos/rate_limits_e_custos.md
source_scope:
  - https://developers.openai.com/api/docs/pricing.md
  - https://developers.openai.com/api/docs/models/compare.md
---

# Preços, Janelas de Contexto e Comparativo de Modelos

Tabela de referência das características operacionais e custos por milhão de tokens (USD / 1M tokens) para os modelos oficiais da OpenAI API.

---

## 1. Tabela Comparativa de Modelos

| Modelo | Janela de Contexto Total | Máximo de Tokens de Saída | Entrada (por 1M tokens) | Entrada em Cache (por 1M tokens) | Saída (por 1M tokens) |
|---|---|---|---|---|---|
| **`gpt-5.6`** | 200.000 tokens | 16.384 tokens | $5.00 | $2.50 | $15.00 |
| **`gpt-5.5`** | 200.000 tokens | 16.384 tokens | $4.00 | $2.00 | $12.00 |
| **`gpt-5.4`** | 200.000 tokens | 16.384 tokens | $3.00 | $1.50 | $10.00 |
| **`gpt-5-mini`** | 200.000 tokens | 16.384 tokens | $0.25 | $0.125 | $1.00 |
| **`o3`** | 200.000 tokens | 100.000 tokens | $10.00 | $5.00 | $30.00 |
| **`o3-mini`** | 200.000 tokens | 100.000 tokens | $1.10 | $0.55 | $4.40 |
| **`o1`** | 200.000 tokens | 100.000 tokens | $15.00 | $7.50 | $60.00 |
| **`gpt-4.1`** | 128.000 tokens | 16.384 tokens | $2.50 | $1.25 | $10.00 |
| **`gpt-4.1-mini`**| 128.000 tokens | 16.384 tokens | $0.15 | $0.075 | $0.60 |

---

## 2. Modelos Especializados

### 2.1 Modelos de Embeddings
| Modelo | Dimensões Padrão | Custo por 1M Tokens de Entrada |
|---|---|---|
| **`text-embedding-3-small`** | 1536 (reduzível) | $0.02 |
| **`text-embedding-3-large`** | 3072 (reduzível) | $0.13 |

### 2.2 Modelos de Áudio e Voz
| Modelo | Função | Preço |
|---|---|---|
| **`whisper-1`** | Transcrição de áudio | $0.006 / minuto |
| **`tts-1`** | Text-to-Speech padrão | $15.00 / 1M caracteres |
| **`tts-1-hd`** | Text-to-Speech alta definição | $30.00 / 1M caracteres |
| **`gpt-4o-realtime-preview`** | Realtime áudio bidirecional | $5.00 / 1M input texto; $100.00 / 1M input áudio |

### 2.3 Geração de Imagem
| Modelo | Resolução / Qualidade | Preço por Imagem |
|---|---|---|
| **`gpt-image-1`** | 1024x1024 / Padrão | $0.040 |
| **`dall-e-3`** | 1024x1024 / HD | $0.080 |
| **`dall-e-3`** | 1024x1792 ou 1792x1024 / HD | $0.120 |

---

## 3. Descontos Especiais

- **Prompt Caching**: **50% de desconto** automático nos tokens de entrada que coincidirem com prefixos em cache (mínimo de 1.024 tokens).
- **Batch API**: **50% de desconto** em todas as requisições enviadas em lote assíncrono via `/v1/batches`.
- **Flex Processing**: Até **50% de economia** para requisições com tolerância a latência flexível.

---

## 4. Referências Cruzadas

- [`../fundamentos/rate_limits_e_custos.md`](../fundamentos/rate_limits_e_custos.md)
- [`../modelos/catalogo_e_selecao.md`](../modelos/catalogo_e_selecao.md)
- [`../responses_api/prompt_caching_e_predicted.md`](../responses_api/prompt_caching_e_predicted.md)
