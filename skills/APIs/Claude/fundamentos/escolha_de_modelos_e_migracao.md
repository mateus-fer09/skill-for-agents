---
title: Escolha de Modelos e Guia de Migração
description: Matriz de decisão técnica para seleção de modelos Claude, estratégias de otimização de custo vs latência e guias de migração de versões.
topics:
  - selecao-de-modelos
  - tradeoffs
  - migracao
  - otimizacao-de-custos
keywords:
  - model selection
  - migration guide
  - latency optimization
  - cost intelligence
related:
  - fundamentos/modelos_e_precos.md
  - mensagens_e_prompting/messages_api.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/about-claude/models/choosing-a-model
  - https://platform.claude.com/docs/pt-BR/about-claude/models/migration-guide
  - https://platform.claude.com/docs/pt-BR/about-claude/models/optimizing-for-cost-and-intelligence
---

# Escolha de Modelos e Guia de Migração

## Matriz de Seleção por Caso de Uso

A escolha do modelo ideal deve ponderar a complexidade do raciocínio exigido, a tolerância à latência e o volume orçamentário da operação:

```
                  Complexidade do Raciocínio
                      ▲
                      │         [Claude 3 Opus]
                      │         [Claude 3.7 Sonnet com Thinking]
                      │
                      │   [Claude 3.7 Sonnet / 3.5 Sonnet]
                      │
                      │ [Claude 3.5 Haiku]
                      │ [Claude 3 Haiku]
                      └─────────────────────────────► Velocidade e Economia
```

### Recomendações por Cenário

1. **Desenvolvimento de Software, Arquitetura e Pair Programming**:
   - **Recomendado**: `claude-3-7-sonnet-20250219` ou `claude-3-5-sonnet-20241022`.
   - **Motivo**: Liderança em benchmarks SWE-bench, capacidade de interpretar bases de código inteiras e geração precisa de código livre de erros sintáticos.

2. **Agentes Autônomos com Tool Calling Contínuo**:
   - **Recomendado**: `claude-3-7-sonnet-20250219` (com *thinking* para planejamento e ferramentas nativas) ou `claude-3.5-sonnet-20241022`.
   - **Motivo**: Alta obediência a esquemas JSON Schema, robustez na recuperação de erros de ferramentas e baixa taxa de alucinação de parâmetros.

3. **Extração de Dados, Classificação e Moderação em Alta Escala**:
   - **Recomendado**: `claude-3-5-haiku-20241022` ou `claude-3-haiku-20240307`.
   - **Motivo**: Latência submétrica de segundos, custo fracionário e precisão excelente para tarefas bem delimitadas com system prompts concisos.

4. **Análise Documental Profunda e Auditoria Regulatória**:
   - **Recomendado**: `claude-3-opus-20240229` ou `claude-3-7-sonnet-20250219`.
   - **Motivo**: Sensibilidade extrema a nuances de linguagem, raciocínio hipotético e síntese exaustiva de documentos densos.

---

## Estratégias de Otimização: Roteamento Inteligente (Model Routing)

Para sistemas de alto tráfego, combine múltiplos modelos em um pipeline em cascata:

1. **Camada de Triagem (Haiku)**: Analisa a entrada do usuário, classifica a intenção e detecta complexidade. Se for uma consulta simples (FAQ, extração, categorização), responde diretamente.
2. **Camada de Execução Complexa (Sonnet / Sonnet com Thinking)**: Se a consulta exigir raciocínio em múltiplos passos, depuração de código ou orquestração de ferramentas, o pipeline roteia a requisição para o Sonnet.

---

## Guia de Migração entre Versões

### Migrando do Claude 3 Opus / Claude 3 Sonnet para Claude 3.5/3.7 Sonnet

1. **Atualize o Model ID**:
   - De: `claude-3-opus-20240229` ou `claude-3-sonnet-20240229`
   - Para: `claude-3-7-sonnet-20250219` ou `claude-3-5-sonnet-20241022`
2. **Ajuste o `max_tokens`**:
   - O Claude 3.5 e 3.7 Sonnet suportam até **8.192 tokens** de saída por padrão (em vez de 4.096).
3. **Verifique System Prompts**:
   - Modelos mais novos são mais diretos e assertivos. Reduza redundâncias nos prompts e evite instruções excessivamente defensivas.
4. **Habilite Prompt Caching**:
   - Aproveite a redução de custo adicionando `cache_control` nos system prompts longos e ferramentas.

---

## Veja Também

- [`../fundamentos/modelos_e_precos.md`](../fundamentos/modelos_e_precos.md)
- [`../mensagens_e_prompting/prompt_caching.md`](../mensagens_e_prompting/prompt_caching.md)
- [`../ferramentas_e_agentes/tool_use_visao_geral.md`](../ferramentas_e_agentes/tool_use_visao_geral.md)
