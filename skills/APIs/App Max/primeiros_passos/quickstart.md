---
title: "Quickstart - Primeiro Pagamento"
description: "Guia prático rápido para autenticar e processar o primeiro pagamento de ponta a ponta na API Appmax."
topics:
  - quickstart
  - primeiro-pagamento
  - autenticacao
  - criacao-pedido
  - pagamento
keywords:
  - quickstart
  - token
  - cliente
  - pedido
  - pagamento
  - pix
  - cartao
related:
  - ../index_master.md
  - autenticacao.md
  - appmax_js.md
source_scope:
  - https://docs.appmax.com.br/quickstart
---

# Quickstart

## Antes de começar

Antes de seguir este guia, certifique-se de que você tem:

- Acesso à [Loja de Aplicativos da Appmax](https://appstore.appmax.com.br)
- Um endpoint para receber [webhooks](../guias_e_recursos/webhooks.md)

## Visão geral do fluxo

O fluxo completo de integração com a API da Appmax segue estas etapas:

#### 1. Criar o aplicativo

Crie seu aplicativo (público ou privado) na [Loja de Aplicativos da Appmax](https://appstore.appmax.com.br). Você receberá um `app_id`, `client_id` e `client_secret` do aplicativo.

Veja mais em [Criar aplicativo](../aplicativos/criar_aplicativo.md).

#### 2. Instalar e autorizar

Obtenha o token do aplicativo, gere o hash de autorização e redirecione o merchant para autorizar a instalação. Após a autorização, gere as credenciais do merchant.

Veja mais em [Instalação do aplicativo](../aplicativos/fluxo_instalacao.md).

#### 3. Autenticar na API

Com as credenciais do merchant, obtenha um token Bearer para realizar chamadas à API.

```bash
curl --location 'https://auth.appmax.com.br/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=MERCHANT_CLIENT_ID' \
--data-urlencode 'client_secret=MERCHANT_CLIENT_SECRET'
```

Resposta esperada:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

#### 4. Criar um cliente

Registre os dados do comprador para obter o `customer_id`. O campo `ip` deve ser coletado via [Appmax JS](appmax_js.md).

```bash
curl --request POST \
     --url https://api.appmax.com.br/v1/customers \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Content-Type: application/json' \
     --data '{
  "first_name": "Junior",
  "last_name": "Almeida",
  "email": "junior.almeida@email.com",
  "phone": "51983655100",
  "ip": "127.0.0.1"
}'
```

Resposta esperada — guarde o `id` retornado (será o `customer_id` nas próximas chamadas):

```json
{
  "data": {
    "customer": {
      "id": 1
    }
  }
}
```

Veja mais em [Criar ou atualizar cliente](../api/clientes/criar_atualizar_cliente.md).

#### 5. Criar um pedido

Com o `customer_id`, crie o pedido para obter o `order_id`.

```bash
curl --request POST \
     --url https://api.appmax.com.br/v1/orders \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Content-Type: application/json' \
     --data '{
  "customer_id": 1,
  "products": [
    {
      "sku": "9000010",
      "name": "Livro de receitas",
      "quantity": 1,
      "unit_value": 12300,
      "type": "digital"
    }
  ]
}'
```

Resposta esperada — guarde o `id` retornado (será o `order_id` para o pagamento):

```json
{
  "data": {
    "order": {
      "id": 1,
      "status": "pendente"
    }
  }
}
```

Veja mais em [Criar um pedido](../api/pedidos/criar_pedido.md).

#### 6. Efetuar o pagamento

Processe o pagamento usando um dos métodos disponíveis: cartão de crédito, Pix, boleto ou Apple Pay.

Veja mais em [Pagamento com cartão](../api/pagamentos/cartao_credito.md), [Pix](../api/pagamentos/pix.md) ou [Boleto](../api/pagamentos/boleto.md).

## Próximos passos

- [Conceitos de negócio](../fundamentos/conceitos.md): Entenda os conceitos fundamentais da plataforma Appmax.
- [Ambientes](../fundamentos/ambientes_e_sandbox.md): Conheça os ambientes de sandbox e produção.

## Veja Também

- [Index Master](../index_master.md)
- [Autenticacao](autenticacao.md)
- [Appmax Js](appmax_js.md)
