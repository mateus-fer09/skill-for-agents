---
title: Monólito modular
description: Como usar um único deploy mantendo boundaries fortes e caminho de evolução.
topics:
  - monólito modular
  - modularidade
  - deployment
  - boundaries
keywords:
  - modular monolith
  - monolith
  - module boundary
  - deployment unit
related:
  - ../decisoes/boundaries_e_ownership.md
  - microsservicos.md
  - ../evolucao/modernizacao_de_legado.md
source_categories:
  - referência técnica
  - engenharia industrial
---

# Monólito modular

## Conceito

Um monólito modular mantém a aplicação como unidade de deployment relativamente coesa, mas estrutura o código em módulos com boundaries, APIs e ownership claros. “Monólito” descreve sobretudo topologia de deployment; não implica automaticamente código sem estrutura.

## Quando é forte candidato

- equipe pequena ou média;
- domínio ainda sendo descoberto;
- transações locais têm alto valor;
- deployment independente não é requisito crítico;
- simplicidade operacional é prioridade;
- volume pode ser atendido por escala vertical/horizontal do conjunto ou por poucos workers especializados.

## Benefícios

- chamadas locais simples;
- transações ACID locais mais fáceis;
- menor overhead de rede, observabilidade e infraestrutura;
- refatorações entre módulos mais simples que entre serviços remotos;
- debugging end-to-end geralmente mais direto;
- menor custo de plataforma.

## Riscos

- boundaries podem degradar porque acesso direto é fácil;
- build/deploy podem crescer;
- uma falha de processo pode afetar o conjunto;
- escala independente é limitada;
- ownership pode ficar difuso em equipes muito grandes.

## Práticas essenciais

- módulos por capacidade/domínio, não apenas camada técnica;
- APIs internas explícitas;
- internals privados;
- acesso a dados controlado pelo módulo;
- testes de arquitetura para imports/dependências;
- ciclos proibidos ou fortemente controlados;
- eventos internos quando ajudam a desacoplar sem introduzir distribuição;
- observabilidade por módulo onde possível.

## Monólito modular não é “etapa inferior”

Pode ser arquitetura final adequada. A adoção de microsserviços deve responder a drivers concretos. Martin Fowler destaca pré-requisitos operacionais para microsserviços; sem automação, monitoramento e capacidade de operação, a distribuição pode piorar o sistema.

## Extração futura

Um bom boundary modular reduz custo de extração para serviço, mas não garante extração trivial. Antes de separar:

- meça necessidade de deployment independente;
- identifique dependências de dados;
- faça contratos explícitos;
- reduza transações cruzadas;
- introduza observabilidade;
- migre incrementalmente.

## Antipadrões

- módulos apenas por pastas, com imports livres;
- “shared” como depósito de lógica;
- acesso direto às tabelas de outros módulos;
- camada de services global que coordena tudo;
- evento interno usado para esconder fluxo impossível de rastrear.

## Regra operacional

Prefira um monólito modular quando ele satisfaz os drivers. Distribuição deve ser uma resposta a necessidades de autonomia, escala, isolamento ou organização — não uma recompensa por maturidade.
