---
title: Checklist de revisão arquitetural
description: Checklist operacional para revisar uma arquitetura ou proposta.
topics:
  - architecture review
  - checklist
  - risk
  - trade-offs
keywords:
  - architecture review
  - ASR
  - risk
  - trade-off
  - ADR
related:
  - matriz_de_decisoes.md
  - ../fundamentos/drivers_e_asrs.md
  - ../evolucao/documentacao_adrs_c4.md
source_categories:
  - síntese derivada
---

# Checklist de revisão arquitetural

## Contexto e drivers

- [ ] Problema de negócio está explícito?
- [ ] Stakeholders e constraints relevantes foram identificados?
- [ ] ASRs estão priorizados?
- [ ] Requisitos vagos foram convertidos em métricas/cenários?
- [ ] RTO, RPO e SLO existem quando relevantes?

## Estrutura

- [ ] Boundaries possuem responsabilidade clara?
- [ ] Ownership de módulos/serviços/dados é conhecido?
- [ ] Dependências possuem direção compreensível?
- [ ] Existem ciclos significativos?
- [ ] Internals vazam por contratos?
- [ ] Mudanças frequentes ficam localizadas?

## Dados

- [ ] Fonte autoritativa de cada dado crítico está clara?
- [ ] Invariantes e transações foram identificadas?
- [ ] Consistência eventual tem janela e UX definidas?
- [ ] Migrações são backward-compatible quando necessário?
- [ ] Backup e restore são testados?

## Comunicação

- [ ] Síncrono/assíncrono foi escolhido por semântica e não moda?
- [ ] Chamadas remotas possuem timeout?
- [ ] Retries são limitados e idempotentes?
- [ ] Filas têm política de backlog/DLQ/replay?
- [ ] Eventos possuem schema e compatibilidade?

## Qualidade

- [ ] Failure modes críticos estão mapeados?
- [ ] Blast radius é aceitável?
- [ ] Performance foi medida com carga representativa?
- [ ] Segurança possui threat model proporcional ao risco?
- [ ] Observabilidade cobre jornadas e dependências críticas?
- [ ] Arquitetura é testável?

## Operação

- [ ] Deploy é automatizado e reproduzível?
- [ ] Rollback/rollforward é conhecido?
- [ ] Configuração é controlada?
- [ ] Runbooks existem para falhas críticas?
- [ ] Alertas são acionáveis?

## Evolução

- [ ] Decisões significativas possuem ADR?
- [ ] Diagramas/views correspondem à realidade?
- [ ] Existem fitness functions para propriedades críticas?
- [ ] Dívida arquitetural tem risco e gatilho de revisão?
- [ ] Estratégia de modernização é incremental quando apropriado?

## Teste final

Pergunte: **qual decisão desta arquitetura possui maior custo de reversão e qual evidência sustenta que ela é necessária agora?**
