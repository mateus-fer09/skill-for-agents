---
title: "Identificadores e URLs do Aplicativo"
description: "Referência completa dos identificadores (UUID e Numerical ID) e das URLs de callback e validação do aplicativo."
topics:
  - identificadores
  - uuid
  - numerical-id
  - urls-configuradas
  - app-id
keywords:
  - app_id
  - external_id
  - numerical id
  - uuid
  - url_callback
  - url_instalacao
  - url_validacao
related:
  - ../index_master.md
  - visao_geral.md
  - por_onde_comecar.md
  - conceitos.md
source_scope:
  - https://docs.appmax.com.br/guides/identificadores-do-app
---

# Identificadores e URLs do aplicativo

Depois de [criar o aplicativo](../aplicativos/criar_aplicativo.md), o painel expõe um conjunto de identificadores e URLs em **Consultar Aplicativo → Desenvolver**. Esta página é a referência de cada campo e em que ponto do fluxo ele é consumido.

## Identificadores

Seu aplicativo tem **dois identificadores diferentes** no painel. Confundi-los é a causa mais comum de `422 Unprocessable Entity` no fluxo de instalação.

| Identificador | Formato | Onde usar |
| --- | --- | --- |
| **App UUID** | `f9e8d7c6-b5a4-3210-fedc-ba0987654321` | Em **todos** os endpoints da API (incluindo `POST /app/authorize`), exceto onde o campo for explicitamente marcado como "Numerical ID". |
| **App Numerical ID** | `699` (inteiro) | Apenas em campos explicitamente marcados como "Numerical ID" (raro). |

> **Use o UUID, não o Numerical ID**
>
> Em `POST /app/authorize` e `POST /app/client/generate`, envie sempre o **App UUID**. Se você enviar o Numerical ID, recebe `422 Unprocessable Entity`.
>
> Se está recebendo `422` no `authorize`, verifique antes de tudo qual dos dois IDs está enviando. Diagnóstico completo em [Troubleshooting da instalação](../aplicativos/fluxo_instalacao.md#troubleshooting).
## URLs configuradas

O painel mostra quatro URLs ligadas ao aplicativo. Cada uma é usada em um momento diferente do ciclo de vida.

### Host

URL base do seu sistema. Usada pela Appmax como destino dos webhooks de eventos do merchant.

- **Quem chama:** Appmax
- **Quem recebe:** seu sistema
- **Quando:** durante toda a operação do merchant, sempre que um evento configurado ocorre

Detalhes do envelope e dos 29 eventos disponíveis em [Webhooks](../guias_e_recursos/webhooks.md).

### URL do sistema

URL pública do seu sistema, **disponibilizada ao merchant** para acesso após a instalação. Não é usada pela Appmax em chamadas server-to-server — é apenas o link que aparece no painel do merchant.

- **Quem chama:** merchant (clique manual no painel)
- **Quem recebe:** seu sistema
- **Quando:** quando o merchant quer acessar o painel/configurações do seu app

### URL de validação

Endpoint do seu sistema que a Appmax chama durante `POST /app/client/generate` para registrar a instalação — é o **health check**.

- **Quem chama:** Appmax (server-to-server)
- **Quem recebe:** seu sistema
- **Quando:** uma vez por instalação, durante o último passo do fluxo

**Contrato:**

| Direção | Payload |
| --- | --- |
| Appmax → seu sistema (`POST`) | `{ app_id, client_id?, client_secret?, client_key?, external_key? }` — somente `app_id` (Numerical ID, numérico) é garantido; os demais campos são opcionais |
| Seu sistema → Appmax (`200 OK`) | `{ "external_id": "<UUID v1-v5>", "alias"?: "<nome da loja>" }` |

O `external_id` que você devolve é **gerado pelo seu sistema** e vira o identificador atual daquela instalação — é o mesmo valor consumido depois pelo Appmax JS no checkout como header `external-id`. A cada nova instalação a Appmax exige um valor novo, e o anterior deixa de valer.

> **A instalação falha se a URL de validação não responder corretamente**
>
> Se sua URL de validação não estiver pública, responder com status diferente de `200` ou não devolver um `external_id` UUID válido, o `POST /app/client/generate` aborta com `500` e nenhuma credencial de merchant é emitida. Teste antes em [Validar URL de instalação](../aplicativos/validar_url_instalacao.md).
Detalhes completos do contrato, exemplos de payload e tratamento de erro em [Fluxo de instalação — health check](../aplicativos/fluxo_instalacao.md#health-check). Ciclo de vida do `external_id` (geração no health check, uso no front via CDN) em [`external-id`](external_id.md).

### URL de webhook

Onde a Appmax envia notificações de eventos selecionados na etapa 3 da criação do aplicativo (pedido criado, pago, estornado, etc.).

- **Quem chama:** Appmax
- **Quem recebe:** seu sistema
- **Quando:** sempre que um evento assinado ocorre na plataforma do merchant

Envelope, lista de eventos e exemplos por tipo em [Webhooks](../guias_e_recursos/webhooks.md).

## Resumo — qual URL é chamada em quê

| URL | Direção | Acionada por |
| --- | --- | --- |
| Host | Appmax → você | Evento de webhook |
| URL do sistema | Merchant → você | Acesso manual via painel |
| URL de validação | Appmax → você | Health check em `POST /app/client/generate` |
| URL de webhook | Appmax → você | Evento assinado na criação do app |

## Próximos passos

- [Validar URL de instalação](../aplicativos/validar_url_instalacao.md) — ferramenta interativa para checar o contrato da URL de validação.
- [Fluxo de instalação](../aplicativos/fluxo_instalacao.md) — usar o App UUID e a URL de validação em produção.
- [Webhooks](../guias_e_recursos/webhooks.md) — payloads e exemplos por evento entregue no Host / URL de webhook.
- [`external-id`](external_id.md) — ciclo de vida do identificador devolvido pela URL de validação.

## Veja Também

- [Index Master](../index_master.md)
- [Visao Geral](visao_geral.md)
- [Por Onde Comecar](por_onde_comecar.md)
- [Conceitos](conceitos.md)
