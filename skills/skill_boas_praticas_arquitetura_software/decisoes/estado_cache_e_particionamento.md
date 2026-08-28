---
title: Estado, cache e particionamento
description: Como tratar estado, caching, sessão e particionamento sem ocultar problemas de consistência.
topics:
  - estado
  - cache
  - particionamento
  - sharding
  - stateless
keywords:
  - state
  - cache
  - cache invalidation
  - partition key
  - sharding
  - session
related:
  - dados_consistencia_transacoes.md
  - ../qualidade/performance_e_escalabilidade.md
  - ../qualidade/confiabilidade_e_resiliencia.md
source_categories:
  - engenharia industrial
---

# Estado, cache e particionamento

## Estado deve ter localização explícita

“Stateless” normalmente significa que instâncias de aplicação não dependem de estado local persistente entre requisições. O estado durável continua existindo em bancos, objetos, filas ou outros backing services.

A metodologia Twelve-Factor recomenda processos stateless/share-nothing para aplicações como serviço, o que facilita substituição e escala horizontal. Isso é uma heurística de deployment, não uma proibição universal de estado em memória.

## Sessão

Sticky sessions podem ser aceitáveis em alguns contextos, mas aumentam acoplamento entre usuário e instância. Alternativas incluem estado de sessão externo ou tokens adequados. Analise custo, segurança e latência.

## Cache

Cache troca trabalho/latência por complexidade de consistência.

Antes de adicionar:

- qual dado é caro de obter?
- qual hit rate esperado?
- qual stale window é aceitável?
- quem invalida?
- o que ocorre no cache miss?
- uma falha do cache derruba a origem por stampede?

Padrões incluem cache-aside, write-through e write-behind, cada um com trade-offs.

## Cache stampede

Muitos misses simultâneos podem sobrecarregar a origem. Estratégias possíveis: request coalescing, jitter de TTL, refresh antecipado, locks controlados e rate limiting.

## Particionamento

Particione quando limites reais de storage/throughput/isolamento justificarem. Escolha de partition key influencia distribuição, hotspots e consultas.

### Tipos

- horizontal por chave/faixa/hash;
- vertical por conjunto de colunas/responsabilidade;
- funcional por domínio/tenant;
- geográfico.

## Hotspots

Uma chave monotônica ou tenant dominante pode concentrar carga. Avalie distribuição real e crescimento antes de escolher esquema.

## Sharding prematuro

Sharding adiciona roteamento, rebalanceamento, migrações, queries cross-shard e operação. Antes dele, verifique índices, modelagem, cache, replicas, escala vertical e particionamento nativo do banco.

## Regra operacional

Estado, cache e particionamento devem ser decisões baseadas em padrões de acesso e métricas, não mecanismos adicionados “por escalabilidade” em abstrato.
