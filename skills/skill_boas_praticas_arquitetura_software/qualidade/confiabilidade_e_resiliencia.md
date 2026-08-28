---
title: Confiabilidade e resiliência
description: Failure modes, redundância, timeouts, retries, circuit breakers, bulkheads e recuperação.
topics:
  - reliability
  - resilience
  - failure modes
  - timeouts
  - retries
  - SLO
keywords:
  - reliability
  - resilience
  - timeout
  - retry
  - backoff
  - jitter
  - circuit breaker
  - bulkhead
related:
  - ../decisoes/comunicacao_sync_async.md
  - observabilidade_e_operabilidade.md
  - ../fundamentos/atributos_de_qualidade.md
source_categories:
  - engenharia industrial
  - referência técnica
---

# Confiabilidade e resiliência

## Falhas são parte do modelo

Sistemas confiáveis não presumem ausência de falhas; definem comportamento diante delas. Identifique dependências, blast radius, modos de degradação e mecanismos de recuperação.

## Comece por SLO, RTO e RPO

Confiabilidade sem objetivo mensurável leva a overengineering. SLOs devem refletir experiência do usuário. Error budgets ajudam a equilibrar confiabilidade e velocidade de mudança.

## Failure Mode Analysis

Para cada componente/dependência:

1. Como pode falhar?
2. Como detectamos?
3. Qual impacto?
4. Falha se propaga?
5. Existe fallback?
6. Como recupera?
7. Quanto tempo/dados podemos perder?
8. Como testamos a hipótese?

## Timeouts

Chamadas remotas devem ter tempo limite consciente. Timeout infinito consome recursos e facilita cascatas. Timeout curto demais gera falsos erros e retries adicionais. Baseie valores em latência observada, SLO e orçamento de tempo do request.

## Retries

Retry é seguro apenas quando:

- falha é potencialmente transitória;
- operação é idempotente ou protegida;
- tentativas são limitadas;
- existe backoff;
- jitter evita sincronização;
- deadline global é respeitado.

Retries em todas as camadas multiplicam carga. Defina onde a responsabilidade pertence.

## Circuit breaker

Evita insistir em dependência persistentemente degradada. Pode reduzir pressão e permitir fallback. Exige critérios de abertura, janela, half-open e observabilidade.

## Bulkhead

Particione recursos ou instâncias para limitar blast radius. Pools de conexão separados, filas independentes, células ou tenants isolados são exemplos. Isolamento custa capacidade e operação.

## Redundância

Redundância só melhora confiabilidade se falhas não forem altamente correlacionadas e failover funcionar. Duas instâncias com mesma dependência única continuam possuindo single point of failure.

## Degradação graciosa

Decida capacidades essenciais e opcionais. Exemplo: recomendação pode falhar sem impedir checkout. Fallback deve ser testado e não esconder corrupção.

## Backups

Backup não é recovery até a restauração ser testada. Meça restore time e valide integridade.

## Chaos e game days

Experimentos de falha podem validar hipóteses, mas devem ter blast radius controlado, objetivo explícito e maturidade operacional adequada.

## Antipadrões

- retry sem timeout;
- retry ilimitado;
- dependência “muito confiável” sem fallback;
- health check que testa apenas processo e não capacidade útil;
- redundância sem testar failover;
- alertas de infraestrutura sem relação com usuário;
- SLO 100% por padrão.

## Sinais principais

Google SRE recomenda observar latência, tráfego, erros e saturação como quatro sinais básicos para serviços user-facing. Complemente com métricas específicas do domínio e SLIs.

## Regra operacional

Projete confiabilidade como **controle de risco mensurável**, não como coleção de padrões. Cada mecanismo deve responder a um failure mode concreto.
