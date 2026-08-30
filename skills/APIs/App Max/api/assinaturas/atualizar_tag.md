---
title: "Atualizar Tag da Assinatura (PATCH /v1/subscriptions/{id}/tag)"
description: "Define apelidos, etiquetas ou marcadores internos para segmentar e organizar assinaturas."
topics:
  - assinaturas
  - tags
  - marcadores
  - patch-v1-subscriptions-tag
keywords:
  - PATCH /v1/subscriptions/{id}/tag
  - atualizar tag
  - tag
  - label
  - segmentacao
related:
  - ../../index_master.md
  - listar_assinaturas.md
  - criar_assinatura.md
  - consultar_assinatura.md
source_scope:
  - https://docs.appmax.com.br/api-reference/subscriptions/atualizar-tag
---

# Atualizar a tag da assinatura

`PATCH /v1/subscriptions/{id}/tag`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Define o apelido da assinatura — um rótulo livre de até 255 caracteres que
você escolhe para identificar a assinatura nos seus relatórios.

Envie `tag` vazia (`""` ou `null`) para remover o apelido. Sem apelido
definido, todas as respostas da API devolvem o padrão `#assinatura{id}`.

> **A tag não aparece no painel Appmax nem no portal do assinante — ela existe**
>
> apenas nas respostas desta API.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Parâmetros de Caminho

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | integer | sim | Identificador da assinatura. |

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `tag` | string \| null | sim | Apelido da assinatura. Vazio ou `null` remove o apelido e faz a API voltar a devolver o padrão `#assinatura{id}`. |

### Exemplo de requisição

```json
{
  "tag": "Clube do Whey"
}
```

## Respostas

### 200

Tag atualizada. Retorna o detalhe atualizado da assinatura.

### 404

Assinatura não encontrada.

```json
{
  "errors": {
    "message": "Assinatura não encontrada."
  }
}
```

### 422

Erro de validação da tag.

```json
{
  "errors": {
    "message": {
      "tag": [
        "The tag may not be greater than 255 characters."
      ]
    }
  }
}
```

### 500

Erro ao atualizar o apelido da assinatura.

## Veja Também

- [Index Master](../../index_master.md)
- [Listar Assinaturas](listar_assinaturas.md)
- [Criar Assinatura](criar_assinatura.md)
- [Consultar Assinatura](consultar_assinatura.md)
