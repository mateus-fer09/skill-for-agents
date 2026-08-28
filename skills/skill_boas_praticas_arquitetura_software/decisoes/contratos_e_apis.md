---
title: Contratos, APIs e evolução
description: Como projetar contratos explícitos, compatíveis, idempotentes e evolutivos.
topics:
  - API
  - contratos
  - versionamento
  - compatibilidade
  - idempotência
keywords:
  - API contract
  - backward compatibility
  - schema evolution
  - idempotency
  - consumer
related:
  - comunicacao_sync_async.md
  - dados_consistencia_transacoes.md
  - ../evolucao/evolucao_e_fitness_functions.md
source_categories:
  - fonte normativa
  - engenharia industrial
---

# Contratos, APIs e evolução

## Contrato é boundary

Um contrato define o que consumidores podem depender: operações, schema, semântica, erros, autenticação, limites, idempotência e expectativas de disponibilidade.

## Minimize superfície pública

Tudo que se torna público precisa ser sustentado. Exponha capacidades necessárias, não internals de implementação.

## Compatibilidade

Mudanças comuns:

- **backward-compatible:** consumidores antigos continuam funcionando;
- **breaking:** exige coordenação ou migração;
- **behavioral breaking:** schema parece compatível, mas semântica muda.

A última categoria é frequentemente subestimada.

## Estratégia expand-and-contract

Para contratos utilizados por múltiplos consumidores:

1. adicione novo campo/operação de maneira compatível;
2. atualize consumidores;
3. observe adoção;
4. descontinue caminho antigo;
5. remova apenas após janela definida.

## Idempotência

HTTP define alguns métodos como idempotentes semanticamente, mas operações de negócio também podem precisar de chaves de idempotência. Em pagamentos, por exemplo, retry não pode criar cobrança duplicada.

## Erros

Contratos devem distinguir:

- erro do cliente;
- conflito de negócio;
- falha transitória;
- indisponibilidade;
- timeout;
- limitação de taxa.

Isso permite políticas de retry corretas.

## Versionamento

Versionamento por URL, header ou schema registry é mecanismo; o mais importante é política de compatibilidade e depreciação. Evite manter versões indefinidamente sem estratégia.

## Contract testing

Em integrações críticas, testes de contrato podem detectar incompatibilidades antes do deploy. Eles complementam, não substituem, testes end-to-end e observabilidade.

## APIs internas também são contratos

Mesmo sem exposição pública, interfaces entre times ou serviços exigem compatibilidade e ownership. “Interno” não significa “pode quebrar sem coordenação”.

## Regra operacional

Projete contratos para evolução previsível: superfície mínima, semântica explícita, compatibilidade consciente, depreciação observável e idempotência onde retries podem ocorrer.
