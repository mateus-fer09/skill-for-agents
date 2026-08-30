---
title: "Criar Link de Facematch KYC (POST /v1/recipient/{recipient_hash}/facematch-link)"
description: "Gera o link de verificação facial e prova de vida para validação antifraude e KYC do recebedor."
topics:
  - split
  - facematch
  - kyc
  - verificacao-facial
  - seguranca
keywords:
  - POST /v1/recipient/{recipient_hash}/facematch-link
  - facematch
  - kyc
  - biometria
  - prova de vida
related:
  - ../../index_master.md
  - criar_recebedor.md
  - criar_recebedor_flexivel.md
  - consultar_recebedor.md
source_scope:
  - https://docs.appmax.com.br/api-reference/split/facematch-link
---

# Criar link de facematch (KYC)

`POST /v1/recipient/{recipient_hash}/facematch-link`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Gera o link de facematch (KYC) para um recebedor recém-criado e envia
um SMS com esse link para o telefone informado.

> **SMS **não são enviados em homologação**. Teste o disparo do facematch**
>
> em produção.
> **O telefone enviado neste endpoint **não precisa ser o mesmo** do**
>
> `account.phone` usado na criação do recebedor.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `recipient_hash` | string | sim | Hash do recebedor (retornado em `POST /v1/recipient`). |

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `phone` | string | sim | Telefone que recebe o SMS (formato com DDD: `11999999999`). |

### Exemplo de requisição

```json
{
  "phone": "11999999999"
}
```

## Respostas

### 201

Link de facematch criado e SMS disparado.

```json
{
  "message": "Facematch created successfully"
}
```

### 500

Erro interno.

## Veja Também

- [Index Master](../../index_master.md)
- [Criar Recebedor](criar_recebedor.md)
- [Criar Recebedor Flexivel](criar_recebedor_flexivel.md)
- [Consultar Recebedor](consultar_recebedor.md)
