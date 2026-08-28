---
title: Boundaries, decomposição e ownership
description: Como definir fronteiras estruturais alinhadas a responsabilidades, domínio, mudança e ownership.
topics:
  - boundaries
  - decomposição
  - ownership
  - bounded context
  - team boundaries
keywords:
  - boundary
  - bounded context
  - service boundary
  - module boundary
  - ownership
  - change coupling
related:
  - ../fundamentos/modularidade_acoplamento_coesao.md
  - dependencias_e_inversao.md
  - ../estilos/monolito_modular.md
  - ../estilos/microsservicos.md
source_categories:
  - referência técnica
  - engenharia industrial
---

# Boundaries, decomposição e ownership

## O boundary é uma decisão semântica

Um boundary deve separar responsabilidades, regras ou ciclos de mudança relevantes. Diretórios, packages, processos e serviços são mecanismos de implementação; a qualidade da fronteira depende do que ela protege.

## Critérios para descobrir boundaries

Procure por:

- capacidades de negócio distintas;
- vocabulários e invariantes diferentes;
- dados com ownership diferente;
- ritmos de mudança independentes;
- requisitos de escala ou disponibilidade distintos;
- necessidades de segurança/isolamento específicas;
- times com responsabilidade fim a fim;
- dependências que podem ser expressas por contratos claros.

Em domínios complexos, conceitos de Domain-Driven Design como bounded contexts podem ajudar, mas não devem ser aplicados mecanicamente.

## Boundary forte

Um boundary forte normalmente possui:

- responsabilidade explícita;
- API ou contrato explícito;
- controle sobre seus dados e invariantes;
- pouca exposição de internals;
- ownership identificável;
- regras de dependência verificáveis;
- estratégia para evolução de contrato.

## Ownership de dados

Compartilhar um schema de banco entre módulos ou serviços cria acoplamento que pode ser maior que o acoplamento de APIs. Consumidores que leem tabelas internas passam a depender de estrutura, semântica e timing de atualização.

Em um monólito modular, separar schemas ou restringir acesso por módulo pode fortalecer boundaries. Em microsserviços, banco por serviço/contexto é uma prática comum justamente para preservar autonomia; isso vem com custo de consistência distribuída e duplicação de dados.

## Change coupling

Analise histórico de mudanças. Se dois componentes quase sempre mudam juntos, pode existir um boundary artificial. Se um componente muda por muitos motivos independentes, pode haver baixa coesão.

## Ownership organizacional

Um componente sem dono tende a deteriorar. Ownership útil significa que uma equipe sabe:

- qual comportamento é garantido;
- quais SLOs e riscos existem;
- como implantar e reverter;
- quem aprova mudanças de contrato;
- quais consumidores existem.

Evite transformar Conway's Law em determinismo, mas reconheça que estruturas de comunicação e software influenciam uma à outra.

## Quando dividir

Sinais que justificam investigar uma divisão:

- mudanças independentes bloqueiam umas às outras;
- regras de domínio são misturadas e difíceis de proteger;
- uma parte exige escala ou disponibilidade muito diferente;
- compliance exige isolamento;
- ownership tornou-se ambíguo;
- deployment conjunto é gargalo real.

## Quando não dividir

- separação baseada apenas em entidades CRUD;
- equipe pequena sem necessidade de autonomia operacional;
- domínio ainda incerto e mudando rapidamente;
- comunicação entre partes seria extremamente “chatty”;
- transações fortes atravessariam o boundary constantemente;
- overhead de operação seria maior que o benefício.

## Exemplo elaborado para esta Skill

Em um SaaS, “Faturamento” e “Catálogo” possuem ciclos e invariantes diferentes. Faturamento precisa de auditabilidade financeira e integração com provedor; Catálogo é leitura intensiva e aceita cache agressivo. Mesmo em um único processo, módulos separados com dados e APIs internas protegidas fazem sentido. Separá-los em serviços só é necessário se drivers adicionais justificarem distribuição.

## Checklist

- A fronteira corresponde a uma unidade de responsabilidade?
- Há uma linguagem interna coerente?
- O consumidor precisa conhecer internals?
- Quem possui os dados?
- Qual contrato conecta os lados?
- O contrato muda com que frequência?
- A comunicação seria local ou remota? Qual custo?
- Falhas precisam ser isoladas?
- Há necessidade real de deployment independente?

## Regra operacional

**Primeiro encontre boundaries semânticos; depois escolha se eles serão packages, módulos, processos ou serviços.**
