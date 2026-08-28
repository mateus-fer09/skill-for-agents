---
title: Segurança e privacidade por design
description: Princípios arquiteturais para reduzir superfície de ataque e incorporar controles desde o design.
topics:
  - security
  - privacy
  - threat modeling
  - least privilege
  - secure by design
keywords:
  - threat model
  - least privilege
  - zero trust
  - secrets
  - encryption
  - authorization
  - supply chain
related:
  - ../decisoes/boundaries_e_ownership.md
  - observabilidade_e_operabilidade.md
  - ../referencia/checklist_revisao_arquitetural.md
source_categories:
  - fonte normativa
  - referência técnica
---

# Segurança e privacidade por design

## Segurança é atributo arquitetural

Segurança não deve ser adicionada apenas na camada HTTP ou ao final do projeto. Decisões de trust boundaries, identidade, dados e dependências moldam a superfície de ataque.

O NIST SSDF recomenda incorporar práticas de desenvolvimento seguro ao ciclo de vida. O OWASP Secure by Design enfatiza decisões arquiteturais e sistêmicas antes do código.

## Threat modeling

Para cada boundary:

- quais ativos importam?
- quem são os atores?
- onde estão trust boundaries?
- quais entradas existem?
- quais privilégios cada identidade possui?
- como abuso pode ocorrer?
- quais controles reduzem risco?

Use modelos como STRIDE quando úteis, sem transformar metodologia em checkbox.

## Least privilege

Serviços, usuários e automações devem possuir apenas permissões necessárias. Separe identities e scopes; evite credenciais globais compartilhadas.

## Autenticação versus autorização

Autenticação responde quem é; autorização decide o que pode fazer. Centralizar identidade pode ser útil, mas decisões de autorização frequentemente precisam de contexto de domínio.

## Segredos

- não embuta em código/imagem;
- use mecanismo de secrets adequado;
- faça rotação;
- limite escopo;
- audite acesso;
- evite segredos em logs.

## Criptografia

Proteja dados em trânsito e repouso conforme ameaça/compliance. Criptografia não substitui controle de acesso, segregação nem gestão de chaves.

## Dados e privacidade

- minimize coleta;
- defina retenção;
- classifique sensibilidade;
- limite replicação;
- controle logs e telemetria;
- estabeleça deleção e exportação quando aplicável.

## Supply chain

Dependências e builds são parte da arquitetura de segurança. Fixe versões de forma apropriada, verifique origem/integridade, automatize scanning e possua processo de atualização.

## Fail secure

Quando um componente de autorização falha, o sistema não deve silenciosamente conceder acesso. Porém “fail closed” deve ser analisado com disponibilidade e safety do domínio.

## Segregação e blast radius

Isolar redes, tenants, credenciais e dados pode limitar impacto de comprometimento. O nível de isolamento deve acompanhar risco.

## Auditabilidade

Eventos sensíveis devem produzir trilha suficiente para investigação sem vazar dados. Defina identidade, ação, recurso, resultado e correlação.

## Antipadrões

- confiança implícita por “rede interna”;
- autorização apenas no frontend;
- shared admin credentials;
- logs com tokens/senhas;
- service account superprivilegiada;
- segurança tratada apenas por WAF;
- dependências sem ownership de atualização.

## Regra operacional

Modele segurança a partir de ativos, ameaças e trust boundaries. Controles devem ser proporcionais ao risco e verificáveis continuamente.
