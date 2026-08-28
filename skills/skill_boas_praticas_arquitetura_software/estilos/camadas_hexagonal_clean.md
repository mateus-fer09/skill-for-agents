---
title: Camadas, Hexagonal e Clean Architecture
description: Comparação de estruturas baseadas em separação de responsabilidades e direção de dependências.
topics:
  - layered architecture
  - hexagonal architecture
  - clean architecture
  - ports and adapters
keywords:
  - layers
  - hexagonal
  - ports and adapters
  - clean architecture
  - dependency rule
related:
  - ../decisoes/dependencias_e_inversao.md
  - ../fundamentos/modularidade_acoplamento_coesao.md
  - monolito_modular.md
source_categories:
  - referência técnica
---

# Camadas, Hexagonal e Clean Architecture

## Arquitetura em camadas

Divide responsabilidades em camadas, por exemplo apresentação, aplicação, domínio e dados. É simples de comunicar e adequada a muitos sistemas empresariais.

### Benefícios

- estrutura familiar;
- responsabilidades técnicas previsíveis;
- facilidade de onboarding;
- boa adequação a sistemas CRUD e domínios simples.

### Riscos

- lógica de domínio pode se diluir em camadas técnicas;
- mudança de feature atravessa várias camadas horizontais;
- camada “service” pode virar centro de tudo;
- dependências podem apontar indiscriminadamente para infraestrutura.

## Hexagonal / Ports and Adapters

Coloca regras centrais atrás de portas e conecta infraestrutura por adapters. O valor principal é proteger o núcleo de detalhes externos e tornar interações substituíveis/testáveis.

### Use quando

- domínio possui lógica relevante;
- múltiplos canais/integrações acessam mesma política;
- infraestrutura muda ou é cara de testar;
- clareza de boundaries é importante.

### Evite caricaturas

Não é necessário criar dezenas de interfaces ou wrappers. Uma porta deve representar uma necessidade do núcleo ou uma capacidade oferecida a ele, não simplesmente reproduzir toda API de uma biblioteca.

## Clean Architecture

Agrupa ideias de separação de políticas e detalhes com uma regra de dependência: detalhes externos dependem de políticas mais internas. Na prática, as fronteiras e nomes de camadas podem variar.

## Comparação operacional

| Contexto | Camadas tradicionais | Hexagonal/Clean |
|---|---|---|
| CRUD simples | geralmente suficiente | pode ser overhead |
| domínio complexo | risco de domínio anêmico se mal usado | pode proteger regras centrais |
| testes sem infraestrutura | possível, depende do design | favorecido por ports |
| troca de adapters | exige disciplina | objetivo explícito |
| curva de aprendizado | baixa | moderada |

## Vertical slices

Uma alternativa/complemento é organizar por feature/capacidade, mantendo dentro de cada slice as separações necessárias. Isso pode reduzir dispersão de mudanças comparado a uma árvore puramente horizontal.

## Regra operacional

Escolha estrutura que torne **dependências e unidades de mudança** explícitas. Não replique diagramas canônicos se o sistema não ganha testabilidade, autonomia ou clareza.
