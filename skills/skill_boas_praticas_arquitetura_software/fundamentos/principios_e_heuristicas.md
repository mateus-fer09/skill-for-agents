---
title: Princípios e heurísticas arquiteturais
description: Princípios práticos, com limites, para orientar decisões sem criar dogmas.
topics:
  - simplicidade
  - separation of concerns
  - encapsulamento
  - YAGNI
  - reversibilidade
keywords:
  - KISS
  - YAGNI
  - separation of concerns
  - dependency inversion
  - reversibility
  - evolution
related:
  - modularidade_acoplamento_coesao.md
  - ../decisoes/dependencias_e_inversao.md
  - ../antipadroes/antipadroes_e_smells.md
source_categories:
  - referência técnica
  - engenharia industrial
---

# Princípios e heurísticas arquiteturais

## Princípios não são absolutos

Princípios arquiteturais funcionam como heurísticas para reduzir espaço de decisão. Eles devem ser aplicados com contexto e não como slogans.

## Simplicidade suficiente

Prefira a solução estrutural menos complexa que satisfaça drivers conhecidos. Simplicidade reduz superfície de falha, operação e carga cognitiva.

**Quando não basta:** requisitos reais de disponibilidade, compliance, isolamento ou escala podem justificar redundância e distribuição.

## Separation of Concerns

Separe responsabilidades que mudam por motivos diferentes ou possuem políticas distintas. A separação pode ocorrer por módulos, camadas, processos ou serviços.

**Risco:** separar cedo demais cria abstrações sem evidência e aumenta custo de coordenação.

## Encapsulamento

Detalhes voláteis devem permanecer atrás de contratos. Não exponha tabelas, estruturas de cache ou SDKs internos como parte do contrato de domínio sem necessidade.

## Dependency Inversion

Políticas centrais devem depender de abstrações adequadas e não de detalhes acidentais. A inversão é útil quando protege lógica relevante de tecnologia volátil ou melhora testabilidade.

**Risco:** criar interfaces para cada classe sem um boundary real gera indirection sem benefício.

## Explicit over implicit

Contratos, ownership, invariantes, timeouts, versões e políticas de retry devem ser explícitos. Acoplamentos implícitos são difíceis de observar e governar.

## Fail fast onde apropriado

Erros de configuração e invariantes violadas devem emergir cedo. Para falhas remotas transitórias, “fail fast” pode significar timeout e circuit breaker, não abortar todo o sistema.

## Reversibilidade

Sob incerteza, prefira escolhas fáceis de substituir. Para decisões caras de reverter, invista mais em experimentação, análise e documentação.

## YAGNI arquitetural

Não implemente capacidades especulativas “para o futuro” sem driver plausível. Exemplos comuns:

- multi-region sem RTO/RPO que justifiquem;
- event sourcing sem necessidade de histórico/replay;
- microsserviços para equipe pequena sem deploy independente;
- abstração multi-cloud sem requisito real.

## Automação de guardrails

Regras importantes devem migrar de documentação para verificações automáticas quando possível:

- testes de dependência;
- linters arquiteturais;
- políticas de CI;
- contract tests;
- checks de segurança;
- validação de manifests e infraestrutura.

## Mudanças pequenas e reversíveis

O AWS Well-Architected recomenda mudanças frequentes, pequenas e reversíveis no contexto de excelência operacional. Como heurística geral, lotes menores reduzem blast radius e facilitam diagnóstico, desde que automação e testes sustentem a cadência.

## Não force pureza arquitetural

Arquiteturas existem para servir ao sistema, não a um diagrama ideal. Uma exceção consciente, localizada e documentada pode ser melhor que uma abstração cara criada apenas para preservar “pureza”.

## Perguntas antes de introduzir complexidade

1. Qual problema concreto resolve?
2. Como saberemos se funcionou?
3. Qual custo operacional introduz?
4. Qual nova failure mode aparece?
5. Quem será responsável por operar isso?
6. É reversível?
7. Existe uma alternativa mais simples?
8. O problema já existe ou é hipotético?

## Síntese

Boas práticas arquiteturais convergem em alguns padrões de raciocínio: localizar mudança, explicitar contratos, reduzir acoplamento desnecessário, preservar opções, projetar para falhas relevantes, automatizar validações e manter complexidade proporcional aos drivers.
