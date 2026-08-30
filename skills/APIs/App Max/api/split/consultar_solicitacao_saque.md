---
title: "Consultar Solicitação de Saque (GET /v1/withdraw-request/{withdrawRequestId})"
description: "Consulta o status de processamento e dados bancários de uma solicitação de saque ou antecipação."
topics:
  - split
  - consultar-saque
  - status-saque
  - get-v1-withdraw-request-id
keywords:
  - GET /v1/withdraw-request/{withdrawRequestId}
  - consultar saque
  - withdraw status
  - comprovante saque
related:
  - ../../index_master.md
  - criar_recebedor.md
  - criar_recebedor_flexivel.md
  - facematch_link.md
source_scope:
  - https://docs.appmax.com.br/api-reference/split/consultar-solicitacao-saque
---

# Consultar solicitação de saque

`GET /v1/withdraw-request/{withdrawRequestId}`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Retorna os detalhes de uma solicitação de saque específica pelo seu
identificador (`withdrawRequestId`), incluindo status atual, valores
e a conta bancária vinculada.

Cobre tanto solicitações criadas via
[saldo disponível](saque_disponivel.md) quanto via
[antecipação](solicitar_antecipacao.md).

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `withdrawRequestId` | integer | sim | ID da solicitação de saque. |

## Respostas

### 200

Solicitação encontrada.

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
    "source_type": "recipient",
    "source_id": "4471b2d1-5e30-5f4d-a64b-c18d72c82a79",
    "bank_account": {
      "id": 9,
      "bank": "66",
      "agency": "512",
      "account": "9260373",
      "name": null,
      "type": "national_pj",
      "profile": "CC",
      "register_number": null,
      "pix_key": "test@test.com",
      "bank_account_type": null
    }
  }
}
```

### 403

Não autorizado.

```json
{
  "message": "Unauthorized"
}
```

### 404

Solicitação de saque não encontrada.

```json
{
  "error": "Withdraw request not found"
}
```

### 500

Erro interno.

```json
{
  "error": "Internal Server Error"
}
```

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Recebedor](criar_recebedor.md)
- [Criar Recebedor Flexivel](criar_recebedor_flexivel.md)
- [Facematch Link](facematch_link.md)
