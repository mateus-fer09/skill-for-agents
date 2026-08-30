---
title: "Pagamento com Cartão de Crédito"
description: "Fluxo completo de cartão de crédito: tokenização (POST /v1/payments/tokenize) e cobrança (POST /v1/payments/credit-card)."
topics:
  - pagamentos
  - cartao-credito
  - tokenizacao
  - credit-card
  - antifraude
keywords:
  - POST /v1/payments/credit-card
  - POST /v1/payments/tokenize
  - card_token
  - installments
  - cvv
  - antifraude
related:
  - ../../index_master.md
  - visao_geral.md
  - pix.md
  - boleto.md
source_scope:
  - https://docs.appmax.com.br/api-reference/payments/cartao-credito
---

# Pagamento com cartão de crédito

`POST /v1/payments/tokenize`

**Base URL**

- Produção: https://api.appmax.com.br
- Sandbox: https://api.sandboxappmax.com.br

Substitui os dados reais do cartão (número, CVV, validade) por um token
único e seguro, permitindo realizar transações sem expor as informações
originais.

> **Tokenização server-side exige PCI-DSS**
>
> Quando você tokeniza pelo seu backend, o seu servidor toca o número de
> cartão e o CVV em claro. Isso **só é permitido** se sua arquitetura
> está em escopo PCI-DSS. Se você não tem certeza, use o caminho via CDN
> — o script Appmax JS isola os dados sensíveis do seu servidor.
Existem dois caminhos de autenticação distintos para este endpoint:
via CDN (header `external-id`) ou via backend (header `Authorization:
Bearer`). Veja [`external-id`](../../fundamentos/external_id.md) para o contexto.

## Autenticação

- `Authorization: Bearer <token>`
  Token Bearer do **merchant** obtido via `POST /oauth2/token` usando as credenciais do merchant (não do app). Veja [Autenticação](../../primeiros_passos/autenticacao.md).

## Corpo da requisição (obrigatório)

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `payment_data` | object | sim |  |
| `payment_data.credit_card` | object | sim |  |
| `payment_data.credit_card.number` | string | sim | Número do cartão de crédito. |
| `payment_data.credit_card.cvv` | string | sim | Código de segurança (máximo 4 caracteres). |
| `payment_data.credit_card.expiration_month` | string | sim | Mês de expiração (1 a 12). |
| `payment_data.credit_card.expiration_year` | string | sim | Ano de expiração (2 a 4 caracteres). |
| `payment_data.credit_card.holder_name` | string | sim | Nome do titular do cartão. |

### Exemplo de requisição

```json
{
  "payment_data": {
    "credit_card": {
      "number": "4444222222222222",
      "cvv": "123",
      "expiration_month": "12",
      "expiration_year": "28",
      "holder_name": "John Doe"
    }
  }
}
```

## Respostas

### 201

Token gerado com sucesso.

```json
{
  "data": {
    "token": "422146c7523a46119d6073ea56193913"
  }
}
```

### 401

Nem `external-id` nem `Authorization` foram enviados.

### 404

`external-id` enviado mas não corresponde a nenhuma instalação ativa.

### 422

Body inválido (campos faltando ou em formato incorreto).

O pagamento com cartão de crédito acontece em **duas etapas, nesta ordem**:

1. **[Tokenização](#tokenizacao)** — os dados sensíveis do cartão (número, CVV, validade) são trocados por um `token` de uso único. É esse token, nunca o número do cartão, que trafega até a API de pagamento.
2. **[Pagamento](#pagamento)** — o token é enviado em `POST /v1/payments/credit-card`, junto com `order_id` e `customer_id`, para efetivar a cobrança.

Vai testar no sandbox? Consulte os [cartões de teste](#cartoes-de-teste) no fim desta página.

> **Tokenizando pelo front-end?**
>
> No checkout, a tokenização normalmente é feita pelo `appmax.js` via CDN — veja [Appmax JS](../../primeiros_passos/appmax_js.md). O endpoint da etapa 1 documenta o contrato subjacente, útil para implementações custom (sem o script) e para debug.
## 1. Tokenização
## 2. Pagamento
## Cartões de teste
Para testar o fluxo no ambiente de **sandbox**, utilize os cartões abaixo com uma **data de expiração futura**:

| Número do cartão      | Cenário                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `4000000000000010`    | **Aprovado e capturado.** O pedido fica `aprovado`, com `paid_at` e `captured_at` preenchidos.   |
| `4000000000000028`    | **Aprovado sem captura** (pré-autorização). O pedido fica `autorizado`, com `captured_at` vazio. |
| `4000000000000002`    | **Recusado pelo emissor.** O pagamento retorna erro e o pedido é cancelado.                      |
| `4000000000000036`    | **Erro na transação.** Falha no processamento; o pagamento retorna erro.                         |
| `4000000000000044`    | **Falha no pedido.** O pedido falha no gateway; o pagamento retorna erro.                        |
| `4000000000009999`    | **Gateway indisponível.** Simula indisponibilidade do provedor de pagamento.                     |
| Qualquer outro cartão | Recusado.                                                                                        |

Os cenários valem tanto enviando os dados do cartão diretamente em `POST /v1/payments/credit-card` quanto no fluxo tokenizado (`POST /v1/payments/tokenize` e depois o pagamento com o `token`): o token gerado a partir de um cartão de teste reproduz o cenário dele.

> **Utilize o cartão `4000000000000010` para testar o fluxo completo de pagamento com sucesso, e o cartão `4000000000000002` para testar o tratamento de erros de pagamento. Repare que o `4000000000000028` **aprova** a transação, apenas sem capturar.**
>
>

## Veja Também

- [Index Master](../../index_master.md)
- [Visao Geral](visao_geral.md)
- [Pix](pix.md)
- [Boleto](boleto.md)
