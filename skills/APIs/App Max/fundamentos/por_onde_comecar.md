---
title: "Por Onde Começar na Appmax"
description: "Guia de orientação inicial para integradores, definindo o caminho de integração para lojistas ou desenvolvedores de apps."
topics:
  - onboarding
  - primeiros-passos
  - orientacao
  - escolha-fluxo
keywords:
  - por onde comecar
  - lojista
  - integrador
  - app privado
  - app publico
  - credenciais
related:
  - ../index_master.md
  - visao_geral.md
  - conceitos.md
  - identificadores_do_app.md
source_scope:
  - https://docs.appmax.com.br/guides/por-onde-comecar
---

# Por onde começar

Novo na Appmax? Este guia ajuda você a entender o modelo de integração e escolher o caminho certo para o seu cenário.

## O que é a Appmax?

A Appmax é uma plataforma de pagamentos com **gateway, antifraude e adquirência** integrados. A integração acontece via uma Loja de Aplicativos (Appstore): você cria um aplicativo, merchants instalam esse app em suas lojas, e a partir daí você processa pagamentos em nome deles.

## Modelo Appstore vs API direta

Se você vem de outros gateways (PagSeguro, Mercado Pago, Stripe), pode estranhar o modelo. A diferença:

| Gateway tradicional | Appmax |
|---|---|
| Você recebe credenciais diretas por email | Credenciais são geradas via fluxo de instalação |
| Uma chave de API por conta | Um par de credenciais **por merchant** que instala seu app |
| Integra direto na API | Cria um app na Appstore → merchant instala → gera credenciais → integra |

> **Essa arquitetura existe para que **um único app** sirva **múltiplos merchants** com isolamento de dados e credenciais por loja.**
>
>
## Escolha seu cenário

### Quero integrar um checkout próprio
Você é um desenvolvedor construindo um checkout customizado para um merchant (ou para si mesmo).

1. [Criar seu aplicativo](../aplicativos/criar_aplicativo.md) (privado se for para um merchant só)
2. [Instalar e obter credenciais](../aplicativos/fluxo_instalacao.md)
3. [Quickstart — primeiro pagamento](../primeiros_passos/quickstart.md)
4. [Exemplo completo de integração](../exemplos/integracao_completa.md)

### Quero construir uma plataforma para múltiplos merchants
Você está criando uma plataforma (ERP, e-commerce, marketplace) que será usada por vários merchants.

1. [Criar seu aplicativo](../aplicativos/criar_aplicativo.md) (público)
2. [Instalação — entender o fluxo de 4 etapas](../aplicativos/fluxo_instalacao.md)
3. [Autenticação — entender app vs merchant credentials](../primeiros_passos/autenticacao.md)
4. [Publicação em produção](../aplicativos/publicacao_producao.md)

### Quero adicionar upsell pós-compra
1. [Quickstart](../primeiros_passos/quickstart.md)
2. [API de Upsell](../api/pedidos/upsell.md)

## Conceitos que vão aparecer

| Conceito | O que é | Onde aprender |
|----------|---------|---------------|
| App vs Merchant credentials | Dois pares de credenciais com escopos diferentes | [Autenticação](../primeiros_passos/autenticacao.md) |
| Health check / URL de validação | Endpoint do seu sistema que a Appmax chama durante a instalação para receber o `external_id` (UUID) que vincula a instalação à loja | [Instalação](../aplicativos/fluxo_instalacao.md) · [Valide sua URL](../aplicativos/validar_url_instalacao.md) |
| Webhook | Notificação em tempo real de eventos (pedido pago, etc) | [Webhooks](../guias_e_recursos/webhooks.md) |
| Sandbox vs Produção | Dois ambientes com URLs diferentes | [Ambientes](ambientes_e_sandbox.md) |
| Valores em centavos | Todos os valores monetários são inteiros em centavos | [Conceitos](conceitos.md) |

## Precisa de ajuda?

- [FAQ](../guias_e_recursos/faq.md) — respostas para dúvidas frequentes
- [Integração com IA](../guias_e_recursos/ia_integracao.md) — conecte Claude, Cursor ou outro agente MCP para acelerar

## Veja Também

- [Index Master](../index_master.md)
- [Visao Geral](visao_geral.md)
- [Conceitos](conceitos.md)
- [Identificadores Do App](identificadores_do_app.md)
