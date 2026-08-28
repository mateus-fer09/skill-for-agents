---
title: Arquitetura orientada a eventos
description: Princípios, padrões, contratos e riscos de sistemas event-driven.
topics:
  - event-driven
  - eventos
  - pub/sub
  - streams
  - coreografia
keywords:
  - event-driven architecture
  - event
  - pubsub
  - stream
  - choreography
  - event schema
related:
  - ../decisoes/comunicacao_sync_async.md
  - ../decisoes/dados_consistencia_transacoes.md
  - microsservicos.md
source_categories:
  - engenharia industrial
  - referência técnica
---

# Arquitetura orientada a eventos

## Conceito

Em arquiteturas orientadas a eventos, componentes publicam fatos sobre mudanças e outros componentes reagem. O estilo é útil quando múltiplos consumidores precisam responder de forma independente ou quando desacoplamento temporal possui valor.

## Tipos de mensagem

Diferencie:

- notification event: informa que algo ocorreu, poucos dados;
- event-carried state transfer: evento carrega dados suficientes para consumidor atualizar cópia;
- stream: sequência contínua de registros ordenados segundo regras da plataforma;
- command: pedido direcionado, não evento.

## Benefícios

- fan-out;
- integração assíncrona;
- buffering;
- menor dependência temporal;
- possibilidade de processamento paralelo;
- extensão por novos consumidores.

## Riscos

- fluxo de negócio distribuído e difícil de visualizar;
- duplicatas;
- ordenação parcial;
- replay;
- schemas incompatíveis;
- consumidores lentos;
- eventos órfãos;
- observabilidade complexa;
- consistência eventual.

## Contratos de eventos

Defina:

- nome semântico;
- versão/schema;
- identificador do evento;
- timestamp com semântica clara;
- aggregate/entity ID quando relevante;
- correlation/causation IDs;
- política de compatibilidade;
- retenção;
- dados sensíveis permitidos.

## Idempotência e replay

Assuma que reprocessamento pode ocorrer. Consumidores devem conhecer política de deduplicação e efeitos externos. Replays precisam evitar disparar emails, pagamentos ou side effects históricos indevidos sem controle.

## Ordenação

Não assuma ordenação global. Muitas plataformas garantem ordem apenas por partition key. Projete invariantes para o escopo de ordenação disponível.

## Dead-letter queues

DLQ é mecanismo de isolamento, não solução final. Monitore tamanho/idade, registre contexto, crie processo de replay e corrija causas sistêmicas.

## Event sourcing não é sinônimo

Um sistema pode ser event-driven sem usar Event Sourcing. Event Sourcing torna o log de eventos a fonte de verdade do estado e traz requisitos próprios de versionamento, replay e evolução.

## Regra operacional

Use eventos quando fatos independentes e assíncronos são parte natural do domínio ou quando desacoplamento temporal/fan-out resolve problema real. Evite eventos como mecanismo universal para esconder dependências.
