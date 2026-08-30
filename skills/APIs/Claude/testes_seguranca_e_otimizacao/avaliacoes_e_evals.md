---
title: Desenvolvimento de Testes, Critérios de Sucesso e Evals
description: Como projetar suítes de avaliação automatizadas (Evals), métricas de acurácia e benchmarks contínuos para aplicações com Claude.
topics:
  - evals
  - testes
  - benchmarks
  - metricas
keywords:
  - develop evals
  - LLM evaluation
  - test suites
  - accuracy metrics
related:
  - testes_seguranca_e_otimizacao/guardrails_e_seguranca.md
  - testes_seguranca_e_otimizacao/otimizacao_latencia_e_precisao.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/test-and-evaluate/develop-tests
---

# Desenvolvimento de Testes, Critérios de Sucesso e Evals

Avaliações sistemáticas (*Evals*) são indispensáveis para garantir que alterações em prompts, modelos ou ferramentas não introduzam regressões em produção.

---

## 1. Tipos de Evals Recomendados

1. **Evals Determinísticos**:
   - Validação de formato (ex: JSON válido via `json.loads` ou Zod Schema).
   - Presença de palavras-chave obrigatórias ou chamadas corretas de ferramentas.
2. **Evals de Extração / Match Exato**:
   - Comparação direta com gabaritos rotulados (*ground truth*).
3. **LLM-as-a-Judge**:
   - Uso de um modelo de nível superior (ex: `claude-3-7-sonnet` ou `claude-3-opus`) com uma rubrica de pontuação formal (1 a 5) para avaliar clareza, tom e aderência a requisitos.

---

## Veja Também

- [`../testes_seguranca_e_otimizacao/otimizacao_latencia_e_precisao.md`](../testes_seguranca_e_otimizacao/otimizacao_latencia_e_precisao.md)
