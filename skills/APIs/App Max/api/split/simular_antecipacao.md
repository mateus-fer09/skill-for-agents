---
title: "Simular Antecipação de Saque (GET /v1/recipient/{recipient_hash}/withdraw-request/anticipation/simulate)"
description: "Simula taxas, descontos e valor líquido para antecipação de recebíveis do saldo a liberar."
topics:
  - split
  - antecipacao
  - simulacao
  - taxa-antecipacao
keywords:
  - simular antecipacao
  - anticipation simulate
  - taxa de antecipacao
  - valor liquido antecipado
related:
  - ../../index_master.md
  - criar_recebedor.md
  - criar_recebedor_flexivel.md
  - facematch_link.md
source_scope:
  - https://docs.appmax.com.br/api-reference/split/simular-antecipacao
---

# Simular antecipação de saque

`GET /v1/recipient/{recipient_hash}/withdraw-request/anticipation/simulate`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Simula a antecipação de um saque e retorna valor bruto, valor líquido,
taxa aplicada e percentual da taxa.

> ****Nenhuma solicitação de saque é criada** por este endpoint. Ele é**
>
> puramente informativo, para cálculo antes da confirmação real.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `recipient_hash` | string | sim | Hash do recebedor (retornado em `POST /v1/recipient`). |

## Parâmetros de Consulta

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `value` | string | sim | Valor do saque a simular em **centavos**. |

## Respostas

### 200

Simulação concluída.

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

### 404

Recebedor não encontrado.

### 422

Conta bancária inválida.

### 423

Saque já em andamento.

### 500

Erro interno.

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Recebedor](criar_recebedor.md)
- [Criar Recebedor Flexivel](criar_recebedor_flexivel.md)
- [Facematch Link](facematch_link.md)
