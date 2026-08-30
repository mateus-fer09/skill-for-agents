---
title: Modelos Claude e Tabela de Preços
description: Catálogo completo de modelos da família Claude (Sonnet, Opus, Haiku, Mythos, Fable), especificações, limites de contexto e precificação oficial.
topics:
  - modelos
  - precos
  - context-window
  - benchmarks
  - token-pricing
keywords:
  - claude-3-7-sonnet
  - claude-3-5-sonnet
  - claude-3-5-haiku
  - claude-3-opus
  - claude-4
  - claude-5
  - pricing
related:
  - fundamentos/escolha_de_modelos_e_migracao.md
  - mensagens_e_prompting/prompt_caching.md
  - mensagens_e_prompting/processamento_em_lote_batches.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/about-claude/models/overview
  - https://platform.claude.com/docs/pt-BR/about-claude/pricing
  - https://platform.claude.com/docs/en/models/overview
---

# Modelos Claude e Tabela de Preços

A Anthropic desenvolve modelos sob três pilares de classificação: **Opus** (máxima inteligência e raciocínio profundo), **Sonnet** (equilíbrio ideal entre alta inteligência, velocidade e custo operacional) e **Haiku** (máxima velocidade, custo ultrabaixo e respostas quase instantâneas).

---

## Catálogo de Modelos Oficiais

| Família / Modelo | ID da API (Model ID) | Janela de Contexto | Saída Máxima (Output) | Principais Habilidades |
|---|---|---|---|---|
| **Claude 3.7 Sonnet** | `claude-3-7-sonnet-20250219` | 200.000 tokens | 8.192 tokens (até 64k com thinking) | Raciocínio Híbrido (*Hybrid Reasoning/Thinking*), codificação de elite, visão e tool calling avançado |
| **Claude 3.5 Sonnet** | `claude-3-5-sonnet-20241022` | 200.000 tokens | 8.192 tokens | Padrão da indústria para engenharia de software, raciocínio em múltiplos passos e visão |
| **Claude 3.5 Haiku** | `claude-3-5-haiku-20241022` | 200.000 tokens | 8.192 tokens | Altíssima velocidade, custo econômico, classificação, extração e chatbots responsivos |
| **Claude 3 Opus** | `claude-3-opus-20240229` | 200.000 tokens | 4.096 tokens | Análise conceitual densa, redação especializada, tarefas acadêmicas e raciocínio sutil |
| **Claude 3 Sonnet** *(Legado)* | `claude-3-sonnet-20240229` | 200.000 tokens | 4.096 tokens | Substituído com ampla vantagem pelo Claude 3.5 / 3.7 Sonnet |
| **Claude 3 Haiku** | `claude-3-haiku-20240307` | 200.000 tokens | 4.096 tokens | Custo ultrabaixo para tarefas simples de alta volumetria |
| **Claude Opus 4 / 4.5 / 5** | Modelos corporativos e de pesquisa avançada | 200k - 1M tokens | 8k - 128k tokens | Raciocínio de fronteira autônomo, orquestração de longo prazo e pesquisa profunda |

---

## Tabela Oficial de Preços (por Milhão de Tokens - USD)

A precificação na Claude Platform é dividida em tokens de entrada (*Input*), tokens de saída (*Output*), escrita de cache (*Prompt Cache Write*), leitura de cache (*Prompt Cache Read*) e processamento em lote (*Batch API*).

| Modelo | Entrada Padrão (MTok) | Saída Padrão (MTok) | Cache Write (MTok) | Cache Read (MTok) | Batch Entrada (MTok) | Batch Saída (MTok) |
|---|---|---|---|---|---|---|
| **Claude 3.7 Sonnet** | $3,00 | $15,00 | $3,75 | $0,30 | $1,50 | $7,50 |
| **Claude 3.5 Sonnet** | $3,00 | $15,00 | $3,75 | $0,30 | $1,50 | $7,50 |
| **Claude 3.5 Haiku** | $0,80 | $4,00 | $1,00 | $0,08 | $0,40 | $2,00 |
| **Claude 3 Opus** | $15,00 | $75,00 | $18,75 | $1,50 | $7,50 | $37,50 |
| **Claude 3 Haiku** | $0,25 | $1,25 | $0,30 | $0,03 | $0,125 | $0,625 |

### Estrutura de Economia com Recursos Avançados

1. **Prompt Caching**:
   - **Economia de 90%** no custo dos tokens lidos do cache (`Cache Read` = 10% do valor do Input padrão).
   - O custo de escrita (`Cache Write`) é de apenas 1,25x o custo de entrada padrão e tem validade de 5 minutos (renovada a cada leitura).
2. **Message Batches API**:
   - **Desconto fixo de 50%** em todos os tokens de entrada e saída para processamento assíncrono concluído em até 24 horas.
3. **Thinking / Reasoning Tokens**:
   - Tokens gerados no processo de reflexão interna (*thinking*) são faturados exatamente como tokens de saída padrão (*Output*).

---

## Modos de Operação dos Modelos

### 1. Modo Padrão (Standard Inference)
Para interações cotidianas, streaming de respostas rápidas, ferramentas convencionais e geração de texto direto.

### 2. Modo com Raciocínio Estendido (Extended Thinking)
Disponível a partir do Claude 3.7 Sonnet. Permite alocar um orçamento de tokens (`thinking.budget_tokens`) para o modelo planejar, raciocinar e depurar internamente antes de emitir a resposta final:

```json
{
  "model": "claude-3-7-sonnet-20250219",
  "max_tokens": 16000,
  "thinking": {
    "type": "enabled",
    "budget_tokens": 4096
  },
  "messages": [
    {"role": "user", "content": "Analise esta prova matemática e identifique inconsistências formais..."}
  ]
}
```

---

## Veja Também

- [`../fundamentos/escolha_de_modelos_e_migracao.md`](../fundamentos/escolha_de_modelos_e_migracao.md)
- [`../mensagens_e_prompting/prompt_caching.md`](../mensagens_e_prompting/prompt_caching.md)
- [`../mensagens_e_prompting/processamento_em_lote_batches.md`](../mensagens_e_prompting/processamento_em_lote_batches.md)
- [`../referencia_api/endpoints_models.md`](../referencia_api/endpoints_models.md)
