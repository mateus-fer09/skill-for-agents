---
title: Microsserviços
description: Critérios, pré-requisitos, benefícios, custos e failure modes do estilo de microsserviços.
topics:
  - microsserviços
  - sistemas distribuídos
  - autonomia
  - deployment independente
keywords:
  - microservices
  - service boundary
  - distributed monolith
  - database per service
  - independent deploy
related:
  - monolito_modular.md
  - ../decisoes/boundaries_e_ownership.md
  - ../decisoes/comunicacao_sync_async.md
  - ../antipadroes/antipadroes_e_smells.md
source_categories:
  - engenharia industrial
  - referência técnica
---

# Microsserviços

## O que caracteriza o estilo

Microsserviços decompõem o sistema em serviços pequenos o suficiente para possuir responsabilidade e evolução relativamente independentes, comunicando-se por contratos remotos. O tamanho em linhas de código não define o estilo; autonomia, boundaries e deployment são mais relevantes.

## Drivers legítimos

- times precisam implantar capacidades independentemente;
- partes têm perfis de escala muito diferentes;
- isolamento de falha ou segurança precisa de processos/deployments distintos;
- domínio tem boundaries maduros;
- organização possui plataforma e automação capazes de sustentar muitos serviços;
- ciclos de release independentes geram valor significativo.

## Pré-requisitos operacionais

A literatura de Martin Fowler destaca competências como provisioning rápido, monitoramento técnico, automação de deployment e cultura DevOps. Acrescente na prática:

- CI/CD confiável;
- observabilidade distribuída;
- gestão de segredos e identidade entre serviços;
- service discovery/networking;
- incident response;
- ownership por serviço;
- gestão de contratos e schemas;
- capacidade de operar filas, retries e falhas parciais.

## Benefícios potenciais

- deployment independente;
- escala granular;
- isolamento de algumas falhas;
- autonomia de equipe;
- possibilidade de tecnologias distintas em boundaries justificados.

Esses benefícios só aparecem se os serviços forem realmente independentes. Deployment conjunto obrigatório e banco compartilhado podem produzir um **distributed monolith**: custo distribuído sem autonomia.

## Custos inevitáveis

- chamadas remotas falham;
- latência e variabilidade;
- consistência distribuída;
- observabilidade mais difícil;
- debugging end-to-end;
- contratos e versionamento;
- duplicação controlada de dados;
- infraestrutura e plataforma;
- testes integrados mais caros;
- maior custo cognitivo.

## Granularidade

Serviços muito finos criam comunicação excessiva e transações distribuídas. Serviços muito grandes perdem autonomia. Use domain boundaries, ownership, mudança e requisitos operacionais como critérios.

## Banco por serviço

É uma prática para preservar ownership e autonomia, não uma regra estética. Se múltiplos serviços escrevem diretamente nas mesmas tabelas, mudanças de schema e invariantes ficam acopladas.

## Orquestração versus coreografia

- **Orquestração:** fluxo coordenado explicitamente; visibilidade maior, risco de centralizador excessivo.
- **Coreografia:** serviços reagem a eventos; desacoplamento de produtores, mas fluxo global pode ficar difícil de entender.

Escolha por complexidade do processo e necessidade de visibilidade/governança.

## Sinais de adoção prematura

- “todo sistema moderno usa”;
- equipe não possui CI/CD automatizado;
- boundaries de domínio ainda mudam diariamente;
- serviços fazem chamadas em cadeia para cada operação;
- cada mudança exige PR em muitos repositórios;
- ausência de tracing e SLOs;
- necessidade constante de transação global.

## Migração

Prefira extração incremental por capability/strangler, com métricas antes/depois. Não reescreva tudo para microsserviços sem estratégia de risco.

## Regra operacional

Microsserviços compram **autonomia e isolamento** pagando com **complexidade distribuída**. Só faça a troca quando os drivers valorizarem claramente a autonomia mais do que o custo.
