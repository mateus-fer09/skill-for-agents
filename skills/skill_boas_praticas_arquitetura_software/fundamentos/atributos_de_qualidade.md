---
title: Atributos de qualidade e trade-offs
description: Como modelar e negociar propriedades sistêmicas que direcionam decisões arquiteturais.
topics:
  - quality attributes
  - trade-offs
  - cenários
  - táticas arquiteturais
keywords:
  - availability
  - reliability
  - modifiability
  - performance
  - security
  - testability
  - operability
related:
  - drivers_e_asrs.md
  - modularidade_acoplamento_coesao.md
  - ../qualidade/confiabilidade_e_resiliencia.md
source_categories:
  - referência técnica
  - engenharia industrial
---

# Atributos de qualidade e trade-offs

## Conceito

Atributos de qualidade descrevem propriedades observáveis do sistema além da funcionalidade. Eles se manifestam em condições concretas e devem ser tratados como objetivos mensuráveis, não como adjetivos abstratos.

A literatura do SEI enfatiza que arquitetura influencia fortemente atributos como performance, disponibilidade, segurança e modificabilidade. **Táticas arquiteturais** são decisões que alteram parâmetros associados à resposta de um atributo.

## Atributos recorrentes

### Modificabilidade

Pergunta: quanto custa realizar uma classe de mudança?

Táticas e mecanismos comuns:

- coesão alta e baixo acoplamento;
- encapsulamento;
- abstrações estáveis;
- boundaries por responsabilidade;
- interfaces explícitas;
- evitar dependências cíclicas;
- minimizar conhecimento compartilhado.

### Disponibilidade e confiabilidade

Pergunta: como o sistema mantém ou restaura serviço quando algo falha?

Mecanismos:

- redundância;
- health checks;
- timeouts;
- retries controlados;
- circuit breaker;
- bulkheads;
- failover;
- degradação graciosa;
- backups e restauração testada.

### Performance

Pergunta: qual resposta deve ser obtida sob determinada carga?

Mecanismos:

- reduzir trabalho por requisição;
- cache;
- concorrência;
- paralelismo;
- batching;
- índices;
- redução de round trips;
- filas para desacoplamento temporal;
- escalabilidade horizontal ou vertical.

### Segurança

Pergunta: como preservar confidencialidade, integridade, disponibilidade e controle de acesso diante de ameaças?

Mecanismos:

- least privilege;
- autenticação e autorização;
- segmentação;
- criptografia;
- gestão de segredos;
- validação de entrada;
- threat modeling;
- auditabilidade;
- hardening de dependências e supply chain.

### Testabilidade

Pergunta: quão facilmente o sistema pode ser observado, controlado e verificado em teste?

Mecanismos:

- dependências substituíveis;
- contratos claros;
- determinismo quando possível;
- separação entre lógica e I/O;
- test seams;
- ambientes reproduzíveis;
- contract tests para integrações.

### Operabilidade e observabilidade

Pergunta: operadores conseguem entender e controlar o sistema em produção?

Mecanismos:

- logs estruturados;
- métricas;
- traces;
- correlação;
- dashboards;
- runbooks;
- feature flags;
- rollback;
- deploy seguro;
- alertas baseados em impacto ao usuário.

## Trade-offs reais

### Consistência versus disponibilidade/latência

Coordenação síncrona forte entre nós ou serviços aumenta garantias, mas pode elevar latência e reduzir disponibilidade durante partições ou falhas.

### Isolamento versus custo

Redundância, células, regiões independentes e bancos separados reduzem blast radius, porém elevam infraestrutura, observabilidade e operação.

### Flexibilidade versus simplicidade

Camadas extras, abstrações genéricas e brokers podem facilitar certas extensões, mas também tornam caminhos de execução mais difíceis de compreender.

### Performance versus modificabilidade

Otimizações que quebram boundaries, duplicam dados ou introduzem cache agressivo podem aumentar performance e simultaneamente elevar complexidade de consistência e manutenção.

## Processo de decisão

1. Expresse o atributo como cenário mensurável.
2. Estabeleça prioridade relativa.
3. Identifique riscos e pontos sensíveis.
4. Liste táticas possíveis.
5. Analise efeitos colaterais em outros atributos.
6. Prototipe ou meça quando houver incerteza relevante.
7. Registre a decisão e as consequências.
8. Verifique em produção com indicadores adequados.

## Antipadrões

- “precisamos de máxima disponibilidade, performance e consistência” sem custo ou prioridades;
- tratar atributo como propriedade binária;
- escolher tecnologia como substituto para requisitos;
- confundir redundância com confiabilidade sem testar failover;
- otimizar média e ignorar percentis de latência;
- medir apenas infraestrutura e não experiência do usuário.

## Regra operacional

Nunca declare uma arquitetura “boa” sem dizer **boa para quais atributos, em qual contexto, sob quais restrições e a que custo**.
