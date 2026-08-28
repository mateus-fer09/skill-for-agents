---
title: Testabilidade e estratégia de validação
description: Como a arquitetura influencia testes, contratos, ambientes e confiança de mudança.
topics:
  - testability
  - testing
  - contract tests
  - integration tests
  - architecture tests
keywords:
  - testability
  - test pyramid
  - contract testing
  - architecture test
  - test seam
related:
  - ../decisoes/dependencias_e_inversao.md
  - ../decisoes/contratos_e_apis.md
  - ../evolucao/evolucao_e_fitness_functions.md
source_categories:
  - referência técnica
  - engenharia industrial
---

# Testabilidade e estratégia de validação

## Testabilidade é atributo de design

Um sistema testável permite controlar entradas, observar saídas e substituir dependências caras quando necessário. Arquitetura que mistura lógica, I/O, tempo e estado global torna testes lentos e frágeis.

## Camadas de validação

- unit tests para lógica local;
- integration tests para adapters e infraestrutura real;
- contract tests para fronteiras;
- end-to-end para jornadas críticas;
- architecture tests para regras estruturais;
- performance/reliability/security tests para atributos específicos.

Não existe proporção universal entre essas categorias.

## Test seams

Ports, adapters, funções puras, clocks injetáveis e boundaries claros criam pontos onde comportamento pode ser exercitado sem o mundo externo.

## Não mocke tudo

Mocks excessivos testam implementação e podem passar enquanto integração real quebra. Use test doubles quando reduzem custo ou controlam failure modes; complemente com testes reais dos adapters.

## Contract tests

Úteis quando produtores/consumidores evoluem independentemente. Devem validar compatibilidade importante, mas não conseguem provar todos os comportamentos distribuídos.

## Testes arquiteturais

Automatize invariantes como:

- domínio não importa infraestrutura;
- módulo A não acessa internals de B;
- não existem ciclos proibidos;
- APIs públicas ficam em namespace específico.

## Ambientes

A Twelve-Factor recomenda reduzir divergência dev/prod para aplicações como serviço. Containers, IaC e dados de teste realistas podem melhorar reprodutibilidade, mas custo deve ser controlado.

## Testes de failure modes

Inclua:

- timeout;
- duplicata;
- mensagem fora de ordem;
- dependency indisponível;
- falha parcial;
- rollback;
- restore de backup;
- overload.

## Regra operacional

Arquitetura boa para mudança fornece feedback rápido no nível local e validação realista nas fronteiras onde risco aumenta.
