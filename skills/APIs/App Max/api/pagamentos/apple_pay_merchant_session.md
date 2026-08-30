---
title: "Apple Pay Merchant Session"
description: "Geração da sessão de merchant necessária para autorizar transações Apple Pay no navegador do cliente."
topics:
  - apple-pay
  - merchant-session
  - validacao-sessao
keywords:
  - merchant session
  - apple pay
  - validationURL
  - session token
related:
  - ../../index_master.md
  - visao_geral.md
  - cartao_credito.md
  - pix.md
source_scope:
  - https://docs.appmax.com.br/api-reference/payments/apple-pay-merchant-session
---

[ [[**Referência][**Playground]][[[[[[[[]

# [Apple Pay merchant session]

] [

```bash
POST/v1/apple-pay/merchant-session
```

][

Obtém a Merchant Session assinada pela Apple para iniciar o fluxo Apple
Pay no navegador. O retorno é repassado a
`session.completeMerchantValidation(...)` da `ApplePaySession`.

> [!WARNING]
> **Header `external-id` é obrigatório**
> Diferente do que uma versão anterior desta página chegou a afirmar,
este endpoint **exige** o header `external-id` — além do campo
`external_id` no body. Envie os dois com o mesmo valor. Sem o header,
a requisição falha com parâmetro ausente.

][ ][ ][[

## [Corpo da Requisição]

application/json[[[[[[Esquema]][[[default]][[JSON]]]]]v-if[[[ 

```json
JSON{  "store_url": "checkout.minhaloja.com.br",  "external_id": "37bb0791-ee0b-457d-860c-186e32978bcd"}
```

]]v-if]]]]][[[[

## [Respostas]

[[[v-if[[[200]][[400]][[422]][[500]]]] ]][[[

Merchant Session retornada (opaque para o integrador).

[[Content-Type]]application/json ]]v-ifv-ifv-if]]]]][

```bash
POST/v1/apple-pay/merchant-session
```

][][

## [Exemplos]

 ] []]]]]][[[[Sandbox`https://api.sandboxappmax.com.br`] []  Authorization (Bearer)[[]] Cole uma vez e use em todos os playgrounds — o token fica salvo somente nesta aba do navegador e é apagado quando ela for fechada. Corpo  

```
{
  "store_url": "checkout.minhaloja.com.br",
  "external_id": "37bb0791-ee0b-457d-860c-186e32978bcd"
}
```

[[[]Editar ][[]Copiar ]Duplo clique no JSON para editar][[]Testar ] ]]]]]

## Veja Também

- [Index Master](../../index_master.md)
- [Visao Geral](visao_geral.md)
- [Cartao Credito](cartao_credito.md)
- [Pix](pix.md)
