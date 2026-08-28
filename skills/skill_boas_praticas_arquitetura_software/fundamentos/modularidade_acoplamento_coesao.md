---
title: Modularidade, acoplamento e coesão
description: Princípios para decompor sistemas e manter mudanças localizadas.
topics:
  - modularidade
  - acoplamento
  - coesão
  - encapsulamento
  - dependências
keywords:
  - modularity
  - coupling
  - cohesion
  - encapsulation
  - information hiding
  - dependency cycle
related:
  - principios_e_heuristicas.md
  - ../decisoes/boundaries_e_ownership.md
  - ../estilos/monolito_modular.md
source_categories:
  - referência técnica
---

# Modularidade, acoplamento e coesão

## Modularidade como capacidade de mudança

Um módulo útil agrupa responsabilidades relacionadas, esconde detalhes internos e expõe uma interface menor e mais estável que sua implementação. O objetivo não é maximizar o número de módulos, mas localizar conhecimento e reduzir o raio de impacto das mudanças.

## Coesão

Coesão descreve quão fortemente os elementos de um módulo pertencem ao mesmo propósito. Uma decomposição coesa tende a mudar por razões relacionadas.

Sinais de baixa coesão:

- módulo “utils” concentrando comportamentos heterogêneos;
- serviço responsável por autenticação, faturamento e relatórios;
- pacote com dezenas de conceitos sem vocabulário comum;
- alterações em uma regra exigindo tocar áreas não relacionadas.

## Acoplamento

Acoplamento descreve o grau de dependência entre elementos. Não é realista eliminar acoplamento; sistemas precisam colaborar. O objetivo é tornar dependências **intencionais, explícitas, mínimas e estáveis**.

Formas relevantes de acoplamento:

- **estrutural:** imports, chamadas e referências diretas;
- **temporal:** componentes precisam estar disponíveis ao mesmo tempo;
- **de dados:** vários módulos dependem do mesmo schema ou representação;
- **semântico:** consumidores dependem de significado ou comportamento implícito;
- **de deployment:** mudanças precisam ser implantadas juntas;
- **operacional:** componentes compartilham recursos e falhas;
- **organizacional:** times precisam coordenar toda alteração.

A comunicação assíncrona reduz acoplamento temporal em alguns contextos, mas não elimina acoplamento semântico nem de dados.

## Information hiding

Esconda decisões com alta probabilidade de mudança atrás de boundaries estáveis. Um módulo deve revelar o mínimo necessário sobre armazenamento, bibliotecas internas e invariantes.

Exemplo: um módulo de pedidos deve expor operações de negócio como `criarPedido` ou `cancelarPedido`, em vez de permitir que consumidores atualizem suas tabelas diretamente.

## Dependências acíclicas

Ciclos tornam ordem de inicialização, testes, reuso e evolução mais difíceis. Quando A depende de B e B depende de A, pergunte:

- responsabilidades estão separadas incorretamente?
- existe um conceito comum que merece módulo próprio?
- uma dependência pode ser invertida por interface/evento?
- boundaries estão sendo atravessados por conveniência?

Não introduza abstrações apenas para “zerar ciclos” sem entender a causa semântica.

## Stable dependencies

Dependências deveriam, em geral, apontar para elementos mais estáveis ou para contratos que mudam menos frequentemente. Lógica de negócio não deveria depender diretamente de detalhes voláteis como SDKs, frameworks ou drivers quando isso compromete testabilidade e evolução.

## Granularidade

Módulo pequeno demais:

- alto overhead de navegação;
- interfaces artificiais;
- fragmentação;
- mais coordenação.

Módulo grande demais:

- baixa coesão;
- alterações amplas;
- ownership nebuloso;
- testes lentos;
- maior chance de conflitos.

A granularidade correta é contextual e deve acompanhar unidades de mudança, domínio e ownership.

## Métricas úteis, mas não soberanas

Ferramentas podem medir ciclos, fan-in/fan-out, dependências ou churn. Use métricas como sinais, não como substitutos para entendimento. Um módulo altamente reutilizado pode ter fan-in alto de maneira legítima.

## Checklist

- O módulo tem uma responsabilidade compreensível?
- Seu nome pertence ao vocabulário do domínio?
- Sua API pública é menor que seus internals?
- Consumidores precisam conhecer schema interno?
- Mudanças comuns ficam localizadas?
- Existem ciclos?
- Há imports “atravessando camadas”?
- É possível testar o módulo sem infraestrutura desnecessária?
- Ownership é claro?

## Regra operacional

**Boundary forte = responsabilidade clara + interface explícita + dados protegidos + dependências controladas.** Separar arquivos ou criar serviços não produz modularidade automaticamente.
