---
title: Modernização de legado
description: Estratégias incrementais para reduzir risco em migrações, substituições e decomposição de sistemas existentes.
topics:
  - legacy
  - modernization
  - strangler fig
  - migration
  - incremental change
keywords:
  - legacy modernization
  - strangler fig
  - migration
  - anti-corruption layer
  - parallel run
related:
  - evolucao_e_fitness_functions.md
  - ../estilos/monolito_modular.md
  - ../estilos/microsservicos.md
source_categories:
  - engenharia industrial
  - referência técnica
---

# Modernização de legado

## Legado não significa “ruim”

Sistema legado é sistema existente com valor, dependências e restrições acumuladas. Reescrita total remove código conhecido e simultaneamente remove conhecimento embutido, criando risco de regressão.

## Primeiro estabilize conhecimento

Antes de migrar:

- identifique journeys críticos;
- meça comportamento e SLO;
- adicione observabilidade;
- mapeie integrações e dados;
- capture regras desconhecidas por testes de caracterização;
- documente boundaries e dependências.

## Strangler Fig

Substitua partes incrementalmente, roteando funcionalidades para nova implementação e reduzindo o legado ao longo do tempo. É útil quando boundaries de migração podem ser encontrados e tráfego pode ser interceptado.

## Anti-corruption layer

Quando modelo legado ou externo possui semântica incompatível, traduza na fronteira em vez de permitir que conceitos antigos contaminem todo o novo modelo.

## Migração de dados

Estratégias possíveis:

- dual read;
- dual write com muito cuidado;
- CDC/event replication;
- backfill;
- shadow reads;
- cutover com janela.

Toda estratégia precisa definir autoridade durante a transição e mecanismo de reconciliação.

## Reescrita total

Pode ser justificável quando sistema é pequeno, comportamento bem compreendido e custo de coexistência supera risco. Em sistemas grandes e críticos, exige evidência forte.

## Métricas de sucesso

Não use “percentual migrado” apenas. Meça:

- incidentes;
- lead time;
- custo operacional;
- performance;
- defeitos;
- dependências removidas;
- capacidade de mudança.

## Antipadrões

- big-bang rewrite sem paridade observável;
- migrar arquitetura e tecnologia simultaneamente sem necessidade;
- decompor em serviços antes de entender domínio;
- deixar sync bidirecional indefinidamente;
- manter duas fontes autoritativas.

## Regra operacional

Modernize em fatias que entregam valor e produzem aprendizado, mantendo rollback ou coexistência até que evidência permita remover o caminho antigo.
