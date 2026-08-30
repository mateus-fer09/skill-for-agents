---
title: "Criação de Aplicativos na AppStore"
description: "Como criar aplicativos públicos ou privados na Loja de Aplicativos da Appmax, requisitos e formulários."
topics:
  - criar-app
  - appstore
  - app-privado
  - app-publico
  - configuracao
keywords:
  - criar aplicativo
  - app publico
  - app privado
  - loja de aplicativos
  - appstore
  - urls do app
related:
  - ../index_master.md
  - validar_url_instalacao.md
  - implementar_url_validacao.md
  - fluxo_instalacao.md
source_scope:
  - https://docs.appmax.com.br/guides/criar-aplicativo
---

# Criar aplicativo

Este guia cobre a criação do aplicativo no painel da Appmax: a decisão entre público e privado, o que você precisa antes de começar, e as três etapas do formulário.

Para a referência dos **identificadores e URLs** que o app expõe depois de criado (App UUID, App Numerical ID, Host, URL de validação, URL de webhook), veja [Identificadores e URLs do aplicativo](../fundamentos/identificadores_do_app.md).

## Público ou privado?

A primeira decisão é o tipo do aplicativo. Ela não pode ser alterada depois — escolha com base no público que vai usar.

| Aspecto | Público | Privado |
|---------|---------|---------|
| Visibilidade | Listado na Appstore para qualquer merchant | Visível apenas para merchants que você convidar |
| Ideal para | Plataformas, ERPs, integradores que atendem múltiplos merchants | Integração interna ou cliente único |
| Merchants | Ilimitados — qualquer merchant pode instalar | Apenas merchants autorizados por você |
| Homologação | Exigida pela equipe Appmax antes de publicar | Não exigida |

> **Quando usar público?**
>
> Se você está construindo uma plataforma que será usada por múltiplos merchants (ex.: ERP, gateway, e-commerce), escolha **público**. Isso permite que qualquer merchant na Appstore instale seu app sem precisar de convite.
## Requisitos

### De negócio

- **CNPJ ativo** — necessário para criar conta na Appstore como desenvolvedor.

### Técnicos

Antes de submeter o formulário você precisa de duas URLs públicas no seu sistema:

| URL | Quando é chamada | Referência |
| --- | --- | --- |
| **URL de validação** | A Appmax faz um `POST` server-to-server durante o último passo da instalação (`/app/client/generate`). Sua URL precisa responder `HTTP 200` com `{ "external_id": "<UUID>" }`. | [Fluxo de instalação — health check](fluxo_instalacao.md#health-check) |
| **URL de webhook** | A Appmax envia eventos (pedido criado, pago, estornado, etc.) durante a operação do merchant. | [Webhooks](../guias_e_recursos/webhooks.md) |

> **Teste a URL de validação antes de criar o app**
>
> A instalação inteira aborta com `500` se a URL de validação não responder corretamente. Use a [ferramenta interativa](validar_url_instalacao.md) para validar o contrato (HTTP 200 + `external_id` UUID único por chamada) **antes** de submeter o formulário.
## Etapas de criação

O formulário no painel tem três etapas.

### 1. Sobre o aplicativo

Informe os dados básicos:

- **Nome do aplicativo** — nome exibido para os merchants (até 30 caracteres).
- **E-mail de suporte** — endereço para que usuários entrem em contato. Também é onde a Appmax envia comunicações sobre o status de análise — use uma caixa monitorada.
- **Descrição do aplicativo** — objetivo, benefícios e serviços oferecidos (até 100 caracteres).
- **Modelo de cobrança** — escolha entre:
  - **Cobrança via plataforma externa** — a cobrança é realizada na sua plataforma, sem envolvimento da Appmax.
  - **Cobrança via Appmax** — valor fixo mensal cobrado do merchant, descontado do saldo parceiro.

### 2. Imagens do aplicativo

Faça o upload da imagem que servirá como avatar do aplicativo.

> **Especificação obrigatória da imagem**
>
> - Formato quadrado de **1200px x 1200px**
> - **PNG ou JPG**
> - Sem cantos arredondados
### 3. Configurações do aplicativo

Escolha os **eventos de webhook** que seu aplicativo vai receber. A Appstore expõe 29 eventos em 4 categorias:

- **Order** — criação, pagamento, estorno, chargeback e variações (Pix, boleto, upsell).
- **Customer** — criação, contato e interesse.
- **Payment** — autorização tardia e não autorização.
- **Subscription** — criação, cancelamento, cobrança recorrente.

Marque apenas os eventos que sua integração realmente processa — assinar eventos que você ignora aumenta carga sem benefício e atrapalha auditoria. A lista completa, payloads e exemplos por evento estão em [Webhooks](../guias_e_recursos/webhooks.md).

> **Você pode alterar a seleção de eventos a qualquer momento no painel, sem precisar recriar o aplicativo.**
>
>
## Após a submissão

Ao concluir as três etapas, você verá um modal com duas opções:

- **Enviar para análise** — direciona o aplicativo para análise da equipe Appmax. Necessário para apps **públicos**.
- **Testar** — a equipe entra em contato para fornecer acessos ao ambiente de homologação.

Clique em **"Consultar Aplicativo"** e depois em **"Desenvolver"** para ver os identificadores e URLs gerados — esses dados são a base para implementar o fluxo de instalação. Veja [Identificadores e URLs do aplicativo](../fundamentos/identificadores_do_app.md) para a referência completa de cada campo.

## Próximos passos

- [Identificadores e URLs do aplicativo](../fundamentos/identificadores_do_app.md) — App UUID vs Numerical ID, URLs configuradas.
- [Validar URL de instalação](validar_url_instalacao.md) — testar a URL de validação antes da homologação.
- [Fluxo de instalação](fluxo_instalacao.md) — implementar `/app/authorize` → redirect → `/app/client/generate`.
- [Publicação em produção](publicacao_producao.md) — checklist de go-live e processo de homologação.

## Veja Também

- [Index Master](../index_master.md)
- [Validar Url Instalacao](validar_url_instalacao.md)
- [Implementar Url Validacao](implementar_url_validacao.md)
- [Fluxo Instalacao](fluxo_instalacao.md)
