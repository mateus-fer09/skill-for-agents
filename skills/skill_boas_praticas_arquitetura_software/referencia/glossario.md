---
title: Glossário de arquitetura de software
description: Definições curtas de termos usados pela Skill.
topics:
  - glossary
  - terminology
keywords:
  - architecture
  - ASR
  - ADR
  - SLO
  - RTO
  - RPO
  - boundary
  - coupling
related:
  - ../fundamentos/papel_da_arquitetura.md
  - matriz_de_decisoes.md
source_categories:
  - síntese derivada
---

# Glossário

**ADR (Architectural Decision Record):** registro de uma decisão arquitetural e de sua justificativa/consequências.

**ASR (Architecturally Significant Requirement):** requisito cuja presença altera materialmente a arquitetura.

**Acoplamento:** grau/tipo de dependência entre elementos.

**Backpressure:** mecanismo para impedir que produtores sobrecarreguem consumidores/recursos.

**Blast radius:** extensão do impacto de uma falha.

**Boundary:** fronteira que encapsula responsabilidade, dados ou política e controla interações.

**Bulkhead:** particionamento de recursos/instâncias para isolar falhas.

**Circuit breaker:** mecanismo que interrompe chamadas a dependência degradada após critérios definidos.

**Coesão:** grau em que elementos de um módulo pertencem ao mesmo propósito.

**Consistency eventual:** modelo em que réplicas/visões podem divergir temporariamente e convergem segundo processo definido.

**Container (C4):** aplicação ou data store dentro de um software system; não significa necessariamente container Docker.

**Error budget:** tolerância a falha derivada do SLO dentro de uma janela.

**Fitness function:** verificação objetiva de uma característica arquitetural desejada.

**Idempotência:** propriedade segundo a qual repetir uma operação não produz efeitos adicionais além dos previstos pela semântica.

**Modularidade:** organização em unidades com responsabilidades e interfaces controladas.

**Observabilidade:** capacidade de inferir estado/comportamento do sistema a partir de sinais produzidos.

**RPO:** objetivo de ponto de recuperação; perda aceitável de dados expressa temporalmente.

**RTO:** objetivo de tempo de recuperação.

**Saga:** sequência de transações locais coordenadas/coreografadas com ações compensatórias para falhas distribuídas.

**SLI:** indicador medido de uma propriedade de serviço relevante.

**SLO:** objetivo para um SLI em janela definida.

**Stateless process:** processo que não depende de estado local durável entre execuções/requisições.

**Trade-off:** decisão que melhora certos objetivos ao custo de outros.

**View / Viewpoint:** na documentação arquitetural, view apresenta arquitetura segundo concerns; viewpoint define convenções para construir/usar determinada view.
