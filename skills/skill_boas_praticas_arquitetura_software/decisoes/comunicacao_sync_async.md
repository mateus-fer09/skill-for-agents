---
title: Comunicação síncrona e assíncrona
description: Critérios para escolher chamadas diretas, APIs, filas e eventos e gerenciar seus trade-offs.
topics:
  - síncrono
  - assíncrono
  - mensageria
  - eventos
  - temporal coupling
keywords:
  - sync
  - async
  - queue
  - event
  - messaging
  - backpressure
  - delivery semantics
related:
  - contratos_e_apis.md
  - dados_consistencia_transacoes.md
  - ../estilos/event_driven.md
  - ../qualidade/confiabilidade_e_resiliencia.md
source_categories:
  - engenharia industrial
  - referência técnica
---

# Comunicação síncrona e assíncrona

## Não existe vencedor universal

Síncrono e assíncrono resolvem problemas diferentes. Escolha com base em semântica, latência, consistência, disponibilidade e operação.

## Comunicação síncrona

Exemplos: chamada de função, HTTP/RPC entre serviços.

### Vantagens

- fluxo de controle simples de acompanhar;
- resposta imediata;
- erros podem retornar diretamente;
- menor infraestrutura em sistemas simples.

### Custos

- acoplamento temporal: dependência precisa estar disponível;
- cadeia de latência;
- risco de falhas em cascata;
- retries podem amplificar carga;
- longas cadeias tornam diagnóstico difícil.

## Comunicação assíncrona

Exemplos: filas, pub/sub, streams.

### Vantagens

- desacoplamento temporal;
- buffering de picos;
- consumidores independentes;
- possibilidade de fan-out;
- recuperação posterior.

### Custos

- consistência eventual;
- duplicatas e reprocessamento;
- ordenação complexa;
- dead letters;
- rastreamento distribuído;
- schema evolution;
- necessidade de idempotência.

## Command versus event

- **Command:** solicita uma ação a um destinatário lógico; existe intenção explícita.
- **Event:** registra algo que ocorreu; produtores não deveriam depender de consumidores específicos para completar sua responsabilidade principal.

Misturar os dois produz “eventos” imperativos e acoplamento oculto.

## Delivery semantics

Na prática, sistemas distribuídos frequentemente precisam lidar com entrega **at least once**, portanto consumidores devem tolerar duplicação. “Exactly once” depende do escopo e normalmente exige coordenação, deduplicação ou garantias específicas da plataforma; não use o termo sem definir exatamente o que é garantido.

## Idempotência

Um consumidor idempotente reconhece operação repetida e evita repetir efeitos indevidos. IDs de operação, chaves de idempotência e registro de mensagens processadas são mecanismos comuns.

## Backpressure

Filas não eliminam sobrecarga; apenas deslocam e absorvem temporariamente. Monitore profundidade, idade da mensagem e throughput. Defina políticas de throttling, autoscaling ou rejeição controlada.

## Timeouts e retries

Toda chamada remota deve ter política de timeout consciente. Retries devem:

- ocorrer apenas para falhas plausivelmente transitórias;
- ser limitados;
- usar backoff e jitter quando apropriado;
- respeitar idempotência;
- evitar retries em múltiplas camadas sem coordenação.

## Perguntas de decisão

- o chamador precisa da resposta agora?
- a operação pode completar depois?
- duplicatas são aceitáveis?
- a ordem importa?
- qual atraso máximo é aceitável?
- é preciso fan-out?
- qual comportamento durante indisponibilidade do consumidor?
- como detectar backlog?

## Heurística

Use síncrono para interações simples que exigem resposta imediata e possuem dependências confiáveis; considere assíncrono quando desacoplamento temporal, absorção de picos ou processamento independente têm valor concreto.
