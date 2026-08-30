---
title: Catálogo de Modelos e Guia de Seleção
description: Visão completa da família de modelos OpenAI (GPT-5.6 Sol, GPT-5.5, GPT-5.4, GPT-5.3-Codex, GPT-4.1, o-series), especialidades e diretrizes de seleção.
topics:
  - models-catalog
  - model-selection
  - gpt-5-family
  - gpt-4-family
keywords:
  - gpt-5.6
  - gpt-5.6-sol
  - gpt-5.5
  - gpt-5.4
  - gpt-5.3-codex
  - gpt-4.1
  - gpt-4.1-mini
related:
  - ../modelos/modelos_de_raciocinio.md
  - ../modelos/precificacao_e_limites.md
  - ../responses_api/introducao_e_quickstart.md
source_scope:
  - https://developers.openai.com/api/docs/models.md
  - https://developers.openai.com/api/docs/guides/model-selection.md
  - https://developers.openai.com/api/docs/guides/latest-model/gpt-5.6.md
  - https://developers.openai.com/api/docs/guides/prompt-guidance-gpt-5p6.md
---

# Catálogo de Modelos e Guia de Seleção

A OpenAI oferece modelos otimizados para diversas tarefas, desde raciocínio profundo e geração de código complexo até operações ultra-rápidas e de baixo custo.

---

## 1. Principais Famílias de Modelos

### 1.1 Família GPT-5.6 / GPT-5 (Flagship Multimodal & Agentes)
- **`gpt-5.6` / `gpt-5.6-sol`**: O modelo de inteligência geral mais avançado da OpenAI. Otimizado para seguir instruções complexas, tool calling de múltiplos passos, raciocínio contextual extenso e arquitetura agêntica.
- **`gpt-5.5`**: Modelo topo de linha anterior com excelente equilíbrio entre precisão, geração de código e aderência a instruções.
- **`gpt-5.4`**: Modelo emblemático para fluxos empresariais e análises multimodais.
- **`gpt-5.3-codex`**: Especializado em engenharia de software, geração de diffs, refatoração de grandes repositórios e uso no Codex/IDE.
- **`gpt-5-mini`**: Versão compacta e econômica, ideal para tarefas que exigem alta taxa de transferência (throughput) e baixa latência.

### 1.2 Família de Raciocínio (o-series: o1, o3, o3-mini)
- **`o3`**: Modelo de raciocínio de última geração para matemática avançada, lógica formal, ciência e análise de segurança de código.
- **`o3-mini`**: Modelo de raciocínio de alta velocidade e baixo custo, com suporte a Structured Outputs, Function Calling e controle de `reasoning_effort` (`low`, `medium`, `high`).
- **`o1`**: Modelo pioneiro de raciocínio deliberativo com cadeia de pensamento interna (*Chain of Thought*).

### 1.3 Família GPT-4.1 (Confiabilidade e Alta Eficiência)
- **`gpt-4.1`**: Modelo de alta capacidade e estabilidade para tarefas gerais de processamento de texto.
- **`gpt-4.1-mini`**: Modelo ultra-rápido e econômico para extração, classificação, sumarização e moderação.

### 1.4 Modelos Especializados
- **Áudio e Voz**: `gpt-4o-realtime-preview`, `tts-1`, `tts-1-hd`, `whisper-1`.
- **Visão e Imagem**: `gpt-image-1`, `dall-e-3`, `dall-e-2`.
- **Vídeo**: `sora-1.0`.
- **Embeddings**: `text-embedding-3-small`, `text-embedding-3-large`.
- **Moderação**: `omni-moderation-latest`, `text-moderation-latest`.

---

## 2. Matriz de Decisão: Qual Modelo Escolher?

| Caso de Uso | Modelo Recomendado | Justificativa |
|---|---|---|
| **Agentes complexos e Tool Calling avançado** | `gpt-5.6` | Máxima precisão em planejar múltiplos passos e lidar com MCP e ferramentas externas |
| **Engenharia de software e geração de código** | `gpt-5.3-codex` ou `gpt-5.6` | Especializado em semântica de código, patches e raciocínio técnico |
| **Matemática, lógica pesada e ciência de dados** | `o3` ou `o3-mini` | Capacidade de pensar deliberadamente antes de responder |
| **Extração de dados com JSON estrito** | `gpt-5-mini` ou `o3-mini` | 100% de confiabilidade em Structured Outputs a baixo custo |
| **Conversação por voz em tempo real** | `gpt-4o-realtime-preview` | Suporte nativo a áudio bidirecional via WebRTC/WebSocket |
| **Classificação, roteamento e RAG de alto volume** | `gpt-4.1-mini` ou `gpt-5-mini` | Menor latência e menor custo por milhão de tokens |

---

## 3. Diretrizes de Prompting para GPT-5.6

Para extrair a máxima performance do **GPT-5.6 / GPT-5.6 Sol**:
1. **Evite redundância no System Prompt**: O GPT-5.6 compreende comandos diretos sem necessidade de reforços excessivos.
2. **Defina explicitamente critérios de parada**: Ao delegar tarefas abertas, defina quando o modelo deve concluir ou consultar ferramentas.
3. **Use Developer Messages**: Mensagens com `role: "developer"` recebem prioridade máxima de aderência sobre mensagens de `user`.

---

## 4. Referências Cruzadas

- [`../modelos/modelos_de_raciocinio.md`](../modelos/modelos_de_raciocinio.md)
- [`../modelos/precificacao_e_limites.md`](../modelos/precificacao_e_limites.md)
- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
