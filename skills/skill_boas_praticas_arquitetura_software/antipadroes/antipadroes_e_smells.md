---
title: Antipadrões e smells arquiteturais
description: Sinais recorrentes de deterioração estrutural, causas, impactos e correções.
topics:
  - antipattern
  - architecture smells
  - distributed monolith
  - big ball of mud
  - overengineering
keywords:
  - big ball of mud
  - distributed monolith
  - shared database
  - chatty services
  - overengineering
  - premature abstraction
related:
  - ../fundamentos/modularidade_acoplamento_coesao.md
  - ../estilos/microsservicos.md
  - ../evolucao/evolucao_e_fitness_functions.md
source_categories:
  - referência técnica
  - engenharia industrial
---

# Antipadrões e smells arquiteturais

## 1. Big Ball of Mud

**Sintoma:** dependências sem direção, responsabilidades misturadas, alterações imprevisíveis.

**Causas:** crescimento sem boundaries, prazos acumulados, ownership fraco.

**Detectar:** ciclos, churn espalhado, dificuldade de explicar módulos.

**Corrigir:** mapear capacidades, criar seams, proteger boundaries incrementalmente, testar regras de dependência.

## 2. Distributed Monolith

**Sintoma:** muitos serviços, mas precisam ser implantados juntos; chamadas síncronas em cadeia; banco compartilhado; cada mudança cruza repositórios.

**Consequência:** custo de rede e operação sem autonomia.

**Corrigir:** revisar boundaries, ownership de dados, contratos, granularidade; em alguns casos recombinar serviços.

## 3. Shared Database como integration bus

**Sintoma:** serviços leem/escrevem tabelas de outros serviços.

**Consequência:** schema vira API implícita, mudanças exigem coordenação.

**Correção:** estabelecer ownership, APIs/eventos ou views de integração controladas; migrar gradualmente.

## 4. Chatty services

**Sintoma:** uma requisição do usuário dispara dezenas de chamadas pequenas.

**Causa:** boundaries por entidade ou granularidade excessiva.

**Impacto:** latência, falhas em cascata, tracing complexo.

**Correção:** reavaliar boundary, agregar operações, mover lógica/dados.

## 5. Retry storm

**Sintoma:** uma dependência degrada e clientes multiplicam tentativas.

**Correção:** deadlines, retries limitados, backoff+jitter, circuit breaker, uma camada responsável.

## 6. Premature abstraction

**Sintoma:** interfaces e frameworks internos genéricos antes de existir variação real.

**Impacto:** indirection, conceitos vazios, dificuldade de mudança.

**Correção:** abstrair após padrões aparecerem ou quando boundary real exige.

## 7. Overengineering

**Sintoma:** sharding, multi-region, event sourcing, service mesh ou microsserviços sem drivers mensuráveis.

**Correção:** voltar a ASRs, estimar custo total, escolher opção mais simples.

## 8. Architecture by vendor diagram

**Sintoma:** arquitetura é catálogo de produtos cloud, sem responsabilidades ou semântica.

**Correção:** modele primeiro domínio, dados, contratos e atributos; depois mapeie tecnologia.

## 9. God service / god module

**Sintoma:** um componente coordena quase tudo e conhece todos os modelos.

**Correção:** identificar responsabilidades e invariantes; mover comportamento para boundaries adequados.

## 10. Anemic boundaries

**Sintoma:** “serviços” CRUD que expõem tabelas remotamente, sem ownership semântico.

**Correção:** modelar capacidade e invariantes, não apenas entidades.

## 11. Hidden temporal coupling

**Sintoma:** sequência específica de chamadas é obrigatória, mas contrato não expressa.

**Correção:** modelar workflow/estado explicitamente, validar transições.

## 12. Observability afterthought

**Sintoma:** incidentes são diagnosticados por SSH e grep manual, sem correlação.

**Correção:** definir telemetria e SLO como parte do design.

## 13. Golden hammer

**Sintoma:** mesma arquitetura ou tecnologia para todo problema.

**Correção:** comparar drivers e opções explicitamente.

## 14. Resume-driven architecture

**Sintoma:** tecnologia escolhida por novidade ou currículo.

**Correção:** ADR exige problema, alternativas e consequências.

## 15. Architecture astronautics

**Sintoma:** modelos e abstrações sofisticados sem contato com código, operação ou usuários.

**Correção:** vincular decisões a métricas, protótipos, implementação e feedback.

## Regra operacional

Um smell é sinal para investigação, não prova automática de erro. Corrija a causa estrutural e valide se o resultado melhora atributos prioritários.
