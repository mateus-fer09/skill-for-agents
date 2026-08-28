---
title: Performance e escalabilidade
description: Método para projetar, medir e evoluir capacidade sem otimização prematura.
topics:
  - performance
  - scalability
  - capacity
  - latency
  - throughput
keywords:
  - latency
  - throughput
  - percentile
  - capacity planning
  - horizontal scaling
  - queue
related:
  - ../decisoes/estado_cache_e_particionamento.md
  - confiabilidade_e_resiliencia.md
  - observabilidade_e_operabilidade.md
source_categories:
  - engenharia industrial
  - referência técnica
---

# Performance e escalabilidade

## Defina carga e resposta

Performance precisa de cenário: volume, distribuição, ambiente e resposta esperada. Meça percentis de latência e não apenas médias.

## Métricas

- throughput;
- p50/p95/p99 de latência;
- taxa de erro;
- utilização/saturação;
- queue depth e age;
- hit rate de cache;
- tempo de query;
- conexões;
- custo por transação.

## Escala vertical versus horizontal

Vertical é simples e frequentemente subestimada. Horizontal aumenta capacidade e resiliência potencial, mas exige estado compartilhado adequado, balanceamento, coordenação e observabilidade.

## Remova trabalho antes de adicionar máquinas

Investigue:

- algoritmos e complexidade;
- N+1 queries;
- índices;
- serialização;
- round trips;
- payloads;
- batching;
- cache;
- compressão;
- concorrência.

## Lei do gargalo

O throughput do sistema é limitado pelo recurso crítico. Escalar camada sem remover gargalo do banco, fila ou dependency pode apenas aumentar pressão.

## Coordenação

Minimizar coordenação pode melhorar escala, mas coordenação existe para preservar invariantes. Remova-a apenas quando semântica permitir.

## Filas

Filas suavizam picos e desacoplam processamento, porém backlog ilimitado representa dívida de trabalho. Defina limites, alertas e política de shedding.

## Load shedding e rate limiting

Sob saturação, rejeitar parte do trabalho de forma controlada pode preservar funções essenciais. Priorize requests/tenants quando o negócio justificar.

## Particionamento

Particionamento deve seguir padrões de acesso e evitar hotspots. Cross-partition queries e rebalanceamento são custos reais.

## Testes de carga

- use carga representativa;
- inclua warm-up;
- teste limites e recuperação após overload;
- modele dependências externas;
- observe saturação e caudas de latência;
- compare antes/depois.

## Antipadrões

- otimizar sem baseline;
- cachear tudo;
- sharding antecipado;
- usar média como única métrica;
- ignorar cauda p99;
- escalar produtores sem consumidores;
- benchmark sintético não representativo.

## Regra operacional

Primeiro meça; depois localize gargalo; então escolha a intervenção menos complexa que atende o cenário de carga.
