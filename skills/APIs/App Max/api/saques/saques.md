---
title: "Gestão de Saques e Transferências"
description: "Visão consolidada da gestão de saques, regras operacionais de TED/PIX e prazos de liquidação."
topics:
  - saques
  - liquidacao
  - prazos
  - transferencias
keywords:
  - saques
  - withdrawals
  - transferencias
  - prazos de liquidacao
  - ted
  - pix
related:
  - ../../index_master.md
source_scope:
  - https://docs.appmax.com.br/api-reference/withdrawals/index
---

# Saques

> [!WARNING]
> **Documentação em validação**
> Esta página ainda não foi publicada na navegação do site. As rotas e os parâmetros de gateway vêm da configuração do API Gateway. Os corpos de requisição e resposta seguem os contratos da família de saque por recebedor (Split), que usa o mesmo backend, e ainda precisam de confirmação com respostas reais destas rotas.

## Visão geral

Estas rotas operam o saque a nível de **site**: o site é resolvido pelo `client_id` do token, sem identificador na URL. Elas convivem com a família de saque por recebedor do Split, que identifica o alvo pelo `recipient_hash` na URL e já tem [documentação pública](../split/saque_disponivel.md).

O fluxo típico tem três passos:

1. Consultar os [saldos](#consultar-saldos) do site e o que já existe com a [listagem](#listar-solicitacoes) ou a [consulta por id](#consultar-solicitacao).
2. Se a intenção é antecipar, [simular](#simular-antecipacao) para conhecer valores e taxa antes de confirmar.
3. Criar a solicitação com [saldo disponível](#saque-do-saldo-disponivel) ou por [antecipação](#antecipacao).

## Rotas disponíveis

| Endpoint | Ação |
| --- | --- |
| GET /v1/withdraw-request/balances | Consultar saldos |
| GET /v1/withdraw-requests | Listar solicitações |
| GET /v1/withdraw-request/{withdraw_request_id} | Consultar solicitação |
| GET /v1/withdraw-request/anticipation/simulate | Simular antecipação |
| POST /v1/withdraw-request/available | Saque do saldo disponível |
| POST /v1/withdraw-request/anticipation | Antecipação |

## Autenticação e convenções

O contrato de autenticação é o mesmo dos demais recursos da API v4, com token `client_credentials` (OAuth2) enviado em `Authorization: Bearer`. O passo a passo está em [Autenticação e autorização](../../primeiros_passos/autenticacao.md).

| Ambiente | Gateway | Emissor do token |
| --- | --- | --- |
| Produção | https://api.appmax.com.br | https://auth.appmax.com.br/oauth2/token |
| Sandbox / HLG | https://api.sandboxappmax.com.br | https://auth.sandboxappmax.com.br/oauth2/token |

Valores monetários trafegam em **centavos** (inteiro positivo), tanto no corpo das solicitações quanto na simulação.

## Consultar saldos

**Endpoint:** `GET /v1/withdraw-request/balances`

Retorna os saldos do site já com as taxas de saque e de antecipação descontadas, ou seja, o valor que efetivamente pode ser sacado em cada modalidade. Saldo negativo é apresentado como `0`.

| Parâmetro (query) | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| types[] | string | Não | Filtra os tipos retornados: available_withdrawal (saldo disponível) e/ou available_anticipation (saldo a liberar, passível de antecipação). Sem o filtro, retorna os dois. |
| currency | string | Não | Moeda ISO. Hoje apenas BRL (padrão). |

```bash
curl -s "https://api.appmax.com.br/v1/withdraw-request/balances" \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "data": [
    {
      "balance_type": "available_withdrawal",
      "currency": "BRL",
      "amount": 10000
    },
    {
      "balance_type": "available_anticipation",
      "currency": "BRL",
      "amount": 9700
    }
  ],
  "withdraw_type": "v2"
}
```

`withdraw_type` indica a versão do fluxo de saque configurada para a empresa (`v2` ou `v3`). Se o saque da empresa estiver bloqueado, os saldos retornam zerados (ou `404` com corpo vazio quando a consulta não informa `types[]`).

## Listar solicitações

**Endpoint:** `GET /v1/withdraw-requests`

Lista as solicitações de saque do site, com paginação.

| Parâmetro (query) | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| page | integer | Não | Página da consulta. |
| per_page | integer | Não | Registros por página. |

```bash
curl -s "https://api.appmax.com.br/v1/withdraw-requests?page=1&per_page=10" \
  -H "Authorization: Bearer $TOKEN"
```

## Consultar solicitação

**Endpoint:** `GET /v1/withdraw-request/{withdraw_request_id}`

Retorna o detalhe de uma solicitação: status, valores, taxa e a conta bancária vinculada. Esta rota também tem [documentação pública na seção Split](../split/consultar_solicitacao_saque.md), pois cobre solicitações criadas por qualquer um dos dois caminhos.

```json
{
  "data": {
    "withdraw_request_id": 69,
    "status": "pending",
    "net_value": 984,
    "gross_value": 1000,
    "withdraw_tax": 0,
    "currency": "BRL",
    "created_at": "2025-12-30 11:08:04",
    "bank_account": {
      "id": 9,
      "bank": "66",
      "agency": "512",
      "account": "9260373",
      "type": "national_pj",
      "pix_key": "[email protected]"
    }
  }
}
```

## Simular antecipação

**Endpoint:** `GET /v1/withdraw-request/anticipation/simulate`

Calcula valor bruto, valor líquido, taxa e percentual da taxa de uma antecipação, sem criar nada. Use antes da confirmação real.

| Parâmetro (query) | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| value | string | Sim | Valor do saque a simular, em centavos. |

```bash
curl -s "https://api.appmax.com.br/v1/withdraw-request/anticipation/simulate?value=10000" \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "data": {
    "value": 10000,
    "net_value": 4700,
    "withdraw_tax": 300,
    "tax_percentage": 300
  }
}
```

## Saque do saldo disponível

**Endpoint:** `POST /v1/withdraw-request/available`

Cria uma solicitação de saque com o saldo já liberado do site. Não há taxa de antecipação.

| Campo (body) | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| value | integer | Sim | Valor do saque em centavos (inteiro positivo). |

```bash
curl -s -X POST "https://api.appmax.com.br/v1/withdraw-request/available" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value": 1000}'
```

Resposta `201` com a solicitação criada em status pendente:

```json
{
  "data": {
    "withdraw_request_id": 1,
    "status": 2,
    "value": 1000,
    "net_value": 1000,
    "withdraw_tax": 0
  }
}
```

## Antecipação

**Endpoint:** `POST /v1/withdraw-request/anticipation`

Cria uma solicitação real de antecipação com saldo ainda em compensação. Ao contrário da [simulação](#simular-antecipacao), este endpoint movimenta o saldo e cobra a taxa de antecipação.

O corpo é o mesmo do saque do disponível (`value` em centavos) e a resposta `201` tem o mesmo formato, com `withdraw_tax` maior que zero.

## Códigos de status

| Status | Significado |
| --- | --- |
| 200 / 201 | Consulta com resultado ou solicitação criada (status 2 = pending). |
| 403 | Token inválido, ou saque não permitido para o site (Withdraw not allowed). |
| 404 | Solicitação de saque não encontrada. |
| 409 | Já existe saque em andamento. |
| 422 | Validação ou regra de negócio: Insufficient balance, Invalid bank account, limite. |
| 423 | Saque já em andamento (na simulação). |

## Veja Também

- [Index Master](../../index_master.md)
