---
title: Documentação arquitetural, ADRs e C4
description: Como documentar estrutura, decisões e views de maneira útil e sustentável.
topics:
  - documentation
  - ADR
  - C4
  - architecture views
  - decision log
keywords:
  - ADR
  - architecture decision record
  - C4 model
  - context diagram
  - container diagram
  - viewpoint
related:
  - evolucao_e_fitness_functions.md
  - ../fundamentos/papel_da_arquitetura.md
  - ../referencia/checklist_revisao_arquitetural.md
source_categories:
  - fonte normativa
  - referência técnica
---

# Documentação arquitetural, ADRs e C4

## Documente para decisões e comunicação

Documentação útil responde “como o sistema está estruturado?”, “por que está assim?”, “quais restrições existem?” e “como isso é operado?”. Evite documento estático gigantesco separado da evolução do código.

## ISO/IEC/IEEE 42010

A norma atual enfatiza architecture descriptions, concerns, stakeholders, viewpoints, views e model kinds. Uma consequência prática é produzir diferentes views para diferentes preocupações, em vez de tentar colocar tudo em um diagrama universal.

## ADRs

Um Architectural Decision Record captura uma decisão significativa e sua justificativa. Um ADR deve normalmente registrar:

- contexto/problema;
- drivers;
- opções consideradas;
- decisão;
- consequências positivas e negativas;
- status;
- data;
- links/evidências.

ADRs formam um decision log e ajudam a evitar “knowledge vaporization”. Não reescreva ADR antigo como se a decisão nunca tivesse existido; substitua/supersede quando necessário.

## O que merece ADR

- escolha de estilo arquitetural;
- mudança de ownership de dados;
- adoção de broker crítico;
- estratégia de autenticação;
- modelo de consistência;
- tecnologia de alto lock-in;
- decisão que afeta múltiplos times;
- trade-off difícil de reverter.

Não crie ADR para cada detalhe trivial.

## C4

O modelo C4 usa zoom hierárquico:

1. **System Context** — pessoas e sistemas externos;
2. **Container** — aplicações e data stores dentro do sistema;
3. **Component** — componentes de um container quando agrega valor;
4. **Code** — detalhe opcional e geralmente gerável por tooling.

Diagramas de deployment, dynamic e system landscape complementam o conjunto.

O site oficial do C4 recomenda Context e Container para a maioria dos times e enfatiza título, escopo, legenda, nomes claros e relações rotuladas.

## Diagrams as code versus desenho manual

Diagrams as code ajudam diff, revisão e versionamento. Ferramentas visuais ajudam workshops. Escolha com base em audiência, colaboração e longevidade. O mais importante é consistência semântica.

## Documentação viva

Mantenha junto ao repositório quando adequado, revise em PRs, gere diagramas a partir de modelo se possível e automatize links/checks. Documentação deve mudar quando decisões e boundaries mudam.

## Checklist de diagrama

- título e tipo estão claros?
- escopo é explícito?
- elementos têm nome e responsabilidade?
- relações possuem direção e intenção?
- tecnologia aparece no nível apropriado?
- legenda explica notação?
- abstrações não são misturadas?
- público-alvo é conhecido?

## Regra operacional

Use **ADRs para o porquê** e **views/diagramas para o quê e como estrutural**. Nenhum substitui código, testes e telemetria como fontes de verdade operacional.
