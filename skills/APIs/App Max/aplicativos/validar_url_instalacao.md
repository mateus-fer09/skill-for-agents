---
title: "Validação da URL de Instalação"
description: "Ferramenta e regras do health check de validação de URL do aplicativo disparado pela Appmax."
topics:
  - validacao
  - url-validacao
  - health-check
  - contrato-api
keywords:
  - validar url
  - health check
  - url_validacao
  - status 200
  - external_id
  - alias
related:
  - ../index_master.md
  - criar_aplicativo.md
  - implementar_url_validacao.md
  - fluxo_instalacao.md
source_scope:
  - https://docs.appmax.com.br/guides/validar-url
---

# Valide sua URL de validação

Antes de submeter seu aplicativo à homologação ou disparar a primeira instalação real, garanta que sua **URL de validação** está respondendo corretamente ao health check da Appmax. Esta ferramenta faz um `POST` sintético — com o mesmo payload usado pela Appmax em `POST /app/client/generate` — e roda todas as asserções do contrato.

> **Ainda não implementou?**
>
> Veja o guia [Implementar a URL de validação](implementar_url_validacao.md) com exemplos em Go, Node.js e PHP prontos para rodar.
> **O que é o health check?**
>
> Durante o último passo da [instalação do aplicativo](fluxo_instalacao.md#health-check), a Appmax executa um `POST` server-to-server na URL de validação cadastrada no painel. Sua URL precisa responder **HTTP 200 + JSON com `external_id` UUID** para a instalação ser concluída. Detalhes do contrato em [Instalação do aplicativo](fluxo_instalacao.md#health-check) e [`external-id`](../fundamentos/external_id.md).
> Ferramenta interativa disponível na versão web desta página.

## O que é validado

A ferramenta dispara **duas chamadas em sequência** com `external_key` distintos. Isso permite comparar o `external_id` devolvido em cada uma e detectar handlers que retornam um UUID hardcoded — bug comum que silenciosamente quebra novas instalações.

| Asserção                                            | Critério                                                                                                       |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **URL alcançável**                                  | A URL responde dentro de 8 segundos sem erro de DNS, conexão recusada ou TLS.                                   |
| **HTTP 200**                                        | O status code é exatamente `200`. Quando outro código aparece, o detalhe tenta classificar a causa (WAF anti-bot, auth, 5xx do seu servidor). |
| **Devolve `external_id` em UUID válido**            | O body parseia como JSON e o campo `external_id` está presente como string no formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (8-4-4-4-12 hex). |
| **`external_id` muda a cada chamada (não-hardcoded)** | A segunda chamada (com `external_key` diferente) devolve um UUID **distinto**. Se vier igual, seu handler está hardcoded — cada instalação precisa de um `external_id` único. |

> **Por que essas asserções?**
>
> O contrato real é simples: a Appmax precisa de um **200** com um `external_id` UUID **único por instalação**. A ferramenta executa o cenário em dose dupla e mostra os dois UUIDs lado a lado para você comparar.
## O payload enviado

A ferramenta dispara o mesmo shape que a Appmax usa no health check real:

```json
{
  "app_id": "DEMO_APP_ID",
  "client_id": "DEMO_CLIENT_ID",
  "client_secret": "DEMO_CLIENT_SECRET",
  "client_key": "DEMO_EXTERNAL_KEY",
  "external_key": "DEMO_EXTERNAL_KEY"
}
```

Os valores são placeholders óbvios para que apareçam no seu log de servidor como **chamada de teste**. Em produção a Appmax envia o `client_id`/`client_secret` real do merchant — o seu handler precisa aceitar qualquer payload nesse formato.

## Resposta esperada do seu handler

```json
{
  "external_id": "37bb0791-ee0b-457d-860c-186e32978bcd",
  "alias": "Minha Loja"
}
```

> **Persista o `external_id`**
>
> O UUID que você devolve aqui não é descartável — vira o identificador atual da instalação e é exigido em toda chamada do front via CDN. A cada nova instalação a Appmax exige um valor novo, e o anterior deixa de valer. Veja [`external-id`](../fundamentos/external_id.md) para o ciclo de vida completo.
## Limitações desta ferramenta

- **Sem chamadas para IPs privados**: a ferramenta recusa URLs que resolvem para `localhost`, `10.x`, `192.168.x`, `172.16-31.x` ou link-local — use [ngrok](https://ngrok.com) / [beeceptor](https://beeceptor.com) para expor um endpoint local.
- **Sem follow de redirects**: um `302` é tratado como falha — o health check real da Appmax também não segue redirects.
- **Timeout de 8s**: se sua URL não responder nesse prazo, recebe `Timeout` (na produção o timeout da Appmax é maior, mas atrasos > 5s são considerados problema operacional).
- **HTTPS ou HTTP**: ambos são aceitos aqui, mas em produção a Appmax **só** chama URLs HTTPS — recuse HTTP no seu domínio definitivo.

## Quando usar

- Antes de submeter o app à homologação.
- Depois de atualizar o handler de health check.
- Quando uma instalação falhar com erro `500` no `POST /app/client/generate` — provavelmente a URL de validação não respondeu como esperado. Veja [Troubleshooting](fluxo_instalacao.md#troubleshooting).

## Veja Também

- [Index Master](../index_master.md)
- [Criar Aplicativo](criar_aplicativo.md)
- [Implementar Url Validacao](implementar_url_validacao.md)
- [Fluxo Instalacao](fluxo_instalacao.md)
