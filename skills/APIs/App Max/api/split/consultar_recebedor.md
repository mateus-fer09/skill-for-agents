---
title: "Consultar Status do Recebedor (GET /v1/recipient/{recipient_hash}/status)"
description: "Verifica a situação cadastral do recebedor (pendente, aprovado, reprovado, KYC) na plataforma."
topics:
  - split
  - status-recebedor
  - get-v1-recipient-status
  - aprovacao
keywords:
  - GET /v1/recipient/{recipient_hash}/status
  - recipient status
  - aprovado
  - pendente
  - kyc status
related:
  - ../../index_master.md
  - criar_recebedor.md
  - criar_recebedor_flexivel.md
  - facematch_link.md
source_scope:
  - https://docs.appmax.com.br/api-reference/split/consultar-recebedor
---

# Consultar status do recebedor

`GET /v1/recipient/{recipient_hash}/status`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Retorna o status atual do onboarding do recebedor. Use para descobrir
se o recebedor está pronto para receber splits (`Onboarding completed`).

Para a referência completa dos status, veja
[Status do split de pagamentos](../../guias_e_recursos/split_status.md).

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `recipient_hash` | string | sim | Hash do recebedor (retornado em `POST /v1/recipient`). |

## Respostas

### 200

Status retornado.

```json
{
  "data": "Onboarding completed"
}
```

### 500

Erro interno.

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Recebedor](criar_recebedor.md)
- [Criar Recebedor Flexivel](criar_recebedor_flexivel.md)
- [Facematch Link](facematch_link.md)
