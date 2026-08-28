---
title: Matriz de decisões arquiteturais
description: Atalhos de investigação para decisões recorrentes, sem transformar heurísticas em regras.
topics:
  - decision matrix
  - trade-offs
  - architecture choice
keywords:
  - decision matrix
  - trade-off
  - monolith
  - microservices
  - sync
  - async
  - cache
related:
  - ../fundamentos/drivers_e_asrs.md
  - ../antipadroes/antipadroes_e_smells.md
  - checklist_revisao_arquitetural.md
source_categories:
  - síntese derivada
---

# Matriz de decisões arquiteturais

> Esta matriz é um roteador de investigação. Não substitui ASRs nem análise contextual.

| Situação | Considere primeiro | Evite como default | Investigue |
|---|---|---|---|
| Equipe pequena, domínio mudando | monólito modular | microsserviços prematuros | boundaries, transações, deploy |
| Deploy independente é gargalo comprovado | serviços por capability | serviço por entidade | ownership, plataforma, contratos |
| Dependência remota instável | timeout + retry controlado + circuit breaker | retry ilimitado | idempotência, fallback, SLO |
| Pico de trabalho assíncrono | fila + consumidores | thread/processamento síncrono ilimitado | backlog, DLQ, ordering |
| Muitas leituras repetidas | cache-aside | cache sem invalidação definida | stale tolerance, stampede |
| Reads e writes têm perfis radicalmente diferentes | CQRS | CQRS por moda | consistência, operação |
| Histórico/replay é requisito central | Event Sourcing | Event Sourcing para CRUD | schema evolution, snapshots |
| Transação cruza serviços | saga/compensação ou rever boundary | transação distribuída improvisada | atomicidade real, UX intermediária |
| RTO/RPO estritos | redundância + recovery testado | “backup existe” | failover, correlação de falhas |
| Mudança frequente de integrações | ports/adapters | abstrações genéricas totais | volatilidade, testes |
| Domínio simples CRUD | camadas simples | DDD tático pesado | complexidade real |
| Legado grande em produção | strangler incremental | big-bang rewrite | seams, paridade, dados |
| Multi-tenant com risco de noisy neighbor | quotas/bulkheads/células | pool global ilimitado | custo e isolamento |
| Sistema distribuído difícil de depurar | tracing + correlation + SLIs | logs soltos | sampling, custo |

## Sequência de decisão recomendada

1. Driver e restrição.
2. Cenário mensurável.
3. Opção mais simples plausível.
4. Alternativas.
5. Failure modes.
6. Trade-offs em outros atributos.
7. Evidência/protótipo se necessário.
8. ADR.
9. Fitness function/telemetria.
