---
title: Dados, consistência e transações
description: Ownership de dados, consistência local/distribuída, duplicação e coordenação.
topics:
  - dados
  - consistência
  - transações
  - ownership
  - saga
  - eventual consistency
keywords:
  - ACID
  - eventual consistency
  - distributed transaction
  - saga
  - outbox
  - data ownership
related:
  - boundaries_e_ownership.md
  - comunicacao_sync_async.md
  - estado_cache_e_particionamento.md
source_categories:
  - referência técnica
  - engenharia industrial
---

# Dados, consistência e transações

## Dados são parte da arquitetura

Modelos de dados, ownership, transações e padrões de acesso determinam boundaries e failure modes. Escolher banco antes de entender acesso e consistência costuma inverter a ordem de decisão.

## Princípio de ownership

Um dado deve possuir autoridade clara. Cópias para leitura, cache ou integração podem existir, mas deve ser possível responder quem é a fonte autoritativa e como propagação/atualização funciona.

## Transações locais

Quando operações pertencem ao mesmo boundary e exigem invariantes fortes, uma transação local de banco costuma ser a solução mais simples. Distribuir prematuramente uma operação que precisa de atomicidade forte aumenta coordenação.

## Consistência distribuída

Ao separar dados por serviços, transações ACID globais podem ficar indisponíveis ou indesejáveis. Estratégias incluem:

- sagas com transações locais e compensações;
- outbox transacional para publicar mudança após commit local;
- consumidores idempotentes;
- reconciliação assíncrona;
- estados intermediários explícitos.

Compensar não é “rollback mágico”: uma compensação é uma nova ação de negócio e pode não restaurar perfeitamente o mundo externo.

## Eventual consistency

Consistência eventual deve ser tratada como propriedade de produto, não apenas técnica. Defina:

- quanto atraso é aceitável;
- o que o usuário vê durante convergência;
- quais operações não podem aceitar estado antigo;
- como conflitos são resolvidos;
- como detectar divergência permanente.

## Duplicação de dados

Duplicação pode reduzir acoplamento e melhorar leitura, mas introduz sincronização. Pergunte:

- qual cópia é autoritativa?
- qual atraso é tolerado?
- como backfill ocorre?
- como mudanças de schema são propagadas?
- como reconciliar erros?

## Banco compartilhado

Pode ser pragmático dentro de um monólito ou fase inicial. Torna-se problemático quando múltiplos serviços independentes escrevem livremente nas mesmas tabelas, porque contracts ficam implícitos e deployments precisam coordenar mudanças.

## CQRS e Event Sourcing

Não são defaults. CQRS é útil quando modelos de leitura e escrita têm necessidades significativamente diferentes. Event Sourcing é adequado quando histórico de eventos como fonte de verdade produz valor real. Ambos aumentam complexidade, tooling, migração e debugging.

## Migrações compatíveis

Em sistemas com deploy contínuo, prefira expand-and-contract:

1. adicione estrutura nova compatível;
2. torne código capaz de trabalhar com estados antigo/novo;
3. migre/backfill;
4. remova dependências antigas posteriormente.

## Perguntas diagnósticas

- quais invariantes precisam ser atômicas?
- qual entidade/contexto possui o dado?
- qual tolerância a stale reads?
- operações são idempotentes?
- falha parcial pode ocorrer?
- compensação é possível?
- qual estratégia de replay/reconciliação?

## Regra operacional

**Preserve consistência forte onde ela é realmente necessária e localize-a dentro de boundaries quando possível; aceite consistência eventual apenas com semântica, observabilidade e recuperação explícitas.**
