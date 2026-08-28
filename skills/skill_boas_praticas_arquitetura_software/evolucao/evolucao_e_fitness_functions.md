---
title: Evolução arquitetural e fitness functions
description: Como preservar propriedades arquiteturais ao longo do tempo por meio de feedback e validações contínuas.
topics:
  - evolutionary architecture
  - fitness functions
  - governança
  - evolução
keywords:
  - evolutionary architecture
  - fitness function
  - architecture governance
  - continuous architecture
related:
  - documentacao_adrs_c4.md
  - modernizacao_de_legado.md
  - ../qualidade/observabilidade_e_operabilidade.md
source_categories:
  - referência técnica
  - engenharia industrial
---

# Evolução arquitetural e fitness functions

## Arquitetura é hipótese contínua

Uma arquitetura é adequada enquanto seus drivers, restrições e resultados continuarem alinhados. Crescimento de produto, equipe e tráfego pode invalidar decisões corretas no passado.

## Fitness function

Uma fitness function é uma verificação objetiva de uma característica arquitetural. Pode ser automatizada ou manual, contínua ou periódica.

Exemplos:

- teste impede dependência proibida entre módulos;
- p99 de uma operação deve permanecer abaixo de limite;
- restore de backup precisa cumprir RTO;
- nenhuma dependência possui vulnerabilidade acima de política definida;
- contrato deve permanecer backward-compatible;
- blast radius de célula não pode atravessar tenants críticos.

## Características de uma boa fitness function

- ligada a driver importante;
- possui critério observável;
- falha gera ação clara;
- custo de manutenção é proporcional ao risco;
- não congela arquitetura desnecessariamente.

## Governança leve

Governança arquitetural não precisa ser um comitê central para toda mudança. Prefira:

- princípios curtos;
- ADRs para decisões significativas;
- guardrails automatizados;
- revisão proporcional ao risco;
- ownership distribuído;
- métricas de resultado.

## Debt arquitetural

Registre dívida como trade-off consciente: contexto, risco, custo de manutenção e gatilho para revisão. “Fazer depois” sem condição de disparo tende a virar abandono.

## Gatilhos de reavaliação

- SLO não é mais atendido;
- deployment é gargalo frequente;
- ciclos e change coupling aumentaram;
- custo operacional cresce desproporcionalmente;
- nova regulação;
- mudança de escala;
- reorganização de ownership;
- tecnologia entra em fim de vida.

## Regra operacional

Arquitetura evolutiva significa criar **feedback suficiente para detectar quando uma decisão deixou de servir**, não tentar prever antecipadamente todas as mudanças futuras.
