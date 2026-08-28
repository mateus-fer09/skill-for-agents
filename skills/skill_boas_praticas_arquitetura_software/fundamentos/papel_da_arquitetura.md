---
title: Papel da arquitetura de software
description: O que é arquitetura de software, quais decisões são arquiteturalmente significativas e como relacioná-las a contexto e valor.
topics:
  - arquitetura de software
  - decisões arquiteturais
  - stakeholders
  - restrições
  - valor de negócio
keywords:
  - software architecture
  - architectural decision
  - stakeholder
  - constraint
  - business driver
  - ASR
related:
  - drivers_e_asrs.md
  - atributos_de_qualidade.md
  - ../evolucao/documentacao_adrs_c4.md
source_categories:
  - fonte normativa
  - referência técnica
---

# Papel da arquitetura de software

## Definição operacional

Arquitetura de software é o conjunto de decisões estruturais que moldam um sistema: seus elementos relevantes, responsabilidades, relações, boundaries, mecanismos de comunicação, dados, restrições e princípios de evolução. Nem toda decisão de implementação é arquitetural. Uma decisão torna-se arquiteturalmente significativa quando sua alteração posterior possui custo, risco ou impacto transversal relevante, ou quando influencia atributos de qualidade importantes.

A ISO/IEC/IEEE 42010:2022 trata **arquitetura** e **descrição de arquitetura** como conceitos distintos. A norma especifica requisitos para descrever arquiteturas por meio de viewpoints, views e model kinds, mas não impõe um método único de projeto. Isso é importante: diagramas, ADRs e modelos documentam a arquitetura; eles não são a arquitetura em si.

## Arquitetura como resposta a forças

Uma arquitetura deve responder simultaneamente a forças como:

- objetivos e capacidades de negócio;
- requisitos funcionais críticos;
- atributos de qualidade, como disponibilidade, modificabilidade e segurança;
- restrições regulatórias, organizacionais, tecnológicas e financeiras;
- competências e tamanho da equipe;
- horizonte de evolução do produto;
- características de carga e dados;
- dependências externas;
- riscos conhecidos e incertezas.

A pergunta central não é “qual arquitetura é melhor?”, mas “qual conjunto de decisões atende melhor aos drivers prioritários dentro das restrições e riscos conhecidos?”.

## Decisões arquiteturalmente significativas

Exemplos típicos:

- decomposição em módulos, serviços ou subsistemas;
- boundaries de domínio e ownership;
- direção das dependências;
- estilo de integração síncrono, assíncrono ou híbrido;
- modelo de consistência e transação;
- isolamento de falhas;
- topologia de deployment;
- estratégia de escalabilidade;
- mecanismos de identidade e autorização;
- políticas de observabilidade;
- contratos externos e versionamento;
- escolha de tecnologias que criam forte lock-in ou afetam atributos críticos.

A escolha de uma biblioteca local facilmente substituível normalmente não merece o mesmo peso que uma decisão sobre particionamento de dados ou fronteiras de serviços.

## Arquitetura não é organograma técnico

Evite tratar arquitetura como uma coleção de caixas nomeadas “frontend”, “backend”, “database” sem responsabilidades, relações, contratos e motivos. Uma descrição útil deve permitir responder:

1. O que cada elemento faz?
2. Quem é responsável por ele?
3. Com quem ele se comunica e por quê?
4. Quais dados possui?
5. Quais dependências são permitidas?
6. Quais atributos de qualidade a estrutura tenta preservar?
7. Quais decisões e trade-offs levaram à estrutura atual?

## Princípios de trabalho

### Comece pelos drivers

Requisitos de negócio e atributos de qualidade devem orientar decisões. Projetar para milhões de usuários sem evidência de demanda pode introduzir custo e complexidade sem benefício; ignorar uma meta explícita de RTO/RPO pode tornar a solução incapaz de cumprir o objetivo operacional.

### Prefira decisões reversíveis quando possível

Quanto maior a incerteza, maior o valor de preservar opções. Escolhas que podem ser alteradas localmente e com baixo custo permitem aprendizado. Decisões irreversíveis ou de alto custo devem receber análise proporcional ao risco.

### Mantenha arquitetura executável e verificável

Uma regra arquitetural é mais valiosa quando pode ser validada por testes, análise estática, políticas de CI ou observabilidade. Exemplo: “módulos de domínio não dependem de adapters” é melhor quando a direção da dependência é testada automaticamente.

### Arquitetura evolui

A arquitetura não termina após o design inicial. Mudanças de produto, equipe, escala e regulamentação alteram os drivers. Práticas adequadas incluem revisão periódica, ADRs, fitness functions, métricas operacionais e modernização incremental.

## Sinais de arquitetura saudável

- boundaries correspondem a responsabilidades compreensíveis;
- dependências possuem direção previsível;
- mudanças comuns ficam localizadas;
- falhas tendem a permanecer isoladas;
- contratos são explícitos e versionáveis;
- os principais atributos de qualidade possuem critérios mensuráveis;
- decisões relevantes têm justificativa e consequências documentadas;
- o sistema pode ser operado, observado e diagnosticado;
- a estrutura é tão simples quanto o contexto permite.

## Sinais de deterioração

- qualquer mudança atravessa muitas áreas não relacionadas;
- módulos importam internals uns dos outros;
- compartilhamento de banco cria acoplamento implícito;
- retries, caches e filas são adicionados sem modelo de falha;
- documentação descreve uma estrutura que o código não respeita;
- decisões são justificadas apenas por moda ou preferência;
- ninguém consegue explicar ownership ou responsabilidades;
- complexidade operacional cresce mais rápido que o valor entregue.

## Exemplo elaborado para esta Skill

Uma plataforma SaaS pequena, mantida por seis desenvolvedores, precisa lançar rapidamente, possui carga moderada e não exige deployment independente por domínio. O fato de microsserviços permitirem isolamento e deploy independente não implica que sejam a melhor escolha. Um monólito modular pode preservar boundaries, reduzir custo operacional e manter caminho de extração futura caso drivers reais apareçam.

## Heurística final

**Adicione complexidade arquitetural somente quando um driver concreto justificar seu custo.** Simplicidade não significa ausência de estrutura; significa eliminar mecanismos, abstrações e distribuição que não pagam pelo problema que resolvem.

## Fontes principais

- ISO/IEC/IEEE 42010:2022 — Architecture description.
- SEI — Quality Attributes; ATAM e literatura de táticas arquiteturais.
- Microsoft Azure Architecture Center — design principles e architecture styles.
- AWS Well-Architected Framework — princípios e pilares de qualidade operacional.

## Veja também

- [`drivers_e_asrs.md`](drivers_e_asrs.md)
- [`atributos_de_qualidade.md`](atributos_de_qualidade.md)
- [`../evolucao/documentacao_adrs_c4.md`](../evolucao/documentacao_adrs_c4.md)
