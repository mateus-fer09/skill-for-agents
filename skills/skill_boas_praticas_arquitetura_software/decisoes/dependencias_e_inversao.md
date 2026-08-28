---
title: Dependências, direção e inversão
description: Como controlar dependências estruturais e proteger políticas centrais de detalhes voláteis.
topics:
  - dependências
  - dependency inversion
  - camadas
  - ports and adapters
  - cycles
keywords:
  - dependency direction
  - dependency inversion
  - ports
  - adapters
  - acyclic dependencies
related:
  - boundaries_e_ownership.md
  - ../estilos/camadas_hexagonal_clean.md
  - ../qualidade/testabilidade.md
source_categories:
  - referência técnica
---

# Dependências, direção e inversão

## Dependência é custo de mudança

Uma dependência existe quando uma parte precisa conhecer outra para funcionar ou evoluir. O objetivo é controlar direção, quantidade, estabilidade e tipo de dependência.

## Dependências estáticas versus runtime

Uma aplicação pode chamar um adapter de banco em runtime, mas ter dependência de código invertida: o domínio declara a porta e o adapter implementa. Distinguir **fluxo de controle** de **direção da dependência de código** evita confusão em arquiteturas hexagonais/clean.

## Regras úteis

- domínio não deve conhecer detalhes acidentais quando isso compromete evolução;
- módulos externos entram por APIs/ports definidos;
- internals não devem ser importados por consumidores;
- ciclos devem ser examinados como smell;
- frameworks devem ficar nas bordas quando o domínio precisa permanecer independente deles.

## Quando Dependency Inversion compensa

- várias implementações reais são necessárias;
- infraestrutura torna testes caros ou não determinísticos;
- tecnologia é volátil;
- política central precisa permanecer estável;
- boundary de domínio precisa impedir vazamento de detalhes.

## Quando vira cerimônia

- interface 1:1 para cada classe sem variação nem boundary;
- abstrações criadas apenas “porque SOLID manda”;
- adapters que apenas repassam chamadas sem traduzir semântica;
- camadas que não agregam política, isolamento ou substituição.

## Dependências transitivas

Mesmo quando A não chama C diretamente, A pode ficar acoplado a C se tipos, erros ou schemas de C vazarem através de B. Crie anti-corruption layers ou modelos próprios quando uma dependência externa não deve dominar o vocabulário interno.

## Framework coupling

Frameworks aceleram desenvolvimento e não devem ser evitados por princípio. O problema aparece quando regras centrais tornam-se impossíveis de testar ou migrar sem o framework. Avalie risco de substituição, maturidade, lock-in e horizonte de vida.

## Guardrails

Possíveis verificações:

- regras de imports por pasta/package;
- testes de arquitetura;
- visibility modifiers;
- módulos/packages privados;
- lint para dependências proibidas;
- pipelines que falham em ciclos novos.

## Exemplo elaborado para esta Skill

`PedidoService` precisa salvar pedidos. Em vez de importar diretamente o SDK do banco, o módulo de aplicação depende de `RepositorioDePedidos`, uma porta pequena alinhada ao domínio. O adapter PostgreSQL implementa essa porta. Isso é útil porque protege testes e domínio. Não é necessário criar uma interface genérica `IRepository<T>` se ela não representa as operações reais do negócio.

## Regra operacional

Inverta dependências **para proteger políticas importantes**, não para maximizar quantidade de interfaces.
