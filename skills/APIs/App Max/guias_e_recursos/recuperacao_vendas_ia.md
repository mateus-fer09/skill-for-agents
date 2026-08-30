---
title: "Recuperação de Vendas com Inteligência Artificial"
description: "Como registrar carrinhos abandonados na API para ativar o robô de recuperação de vendas inteligente via WhatsApp/E-mail."
topics:
  - ia
  - carrinho-abandonado
  - recuperacao-vendas
  - conversao
keywords:
  - recuperacao de vendas
  - ia
  - carrinho abandonado
  - whatsapp
  - remarketing
  - conversao
related:
  - ../index_master.md
  - webhooks.md
  - rate_limit.md
  - calculo_parcelas.md
source_scope:
  - https://docs.appmax.com.br/guides/recuperacao-vendas-ia
---

# Recuperação de vendas com IA

> **Funcionalidade em fase beta**
>
>
A recuperação de vendas com IA permite registrar um **carrinho abandonado** — um cliente que iniciou a compra mas não concluiu o pagamento — para que a Appmax tente recuperar essa venda automaticamente usando inteligência artificial.

Não existe uma rota separada para isso: o carrinho abandonado é criado através do mesmo endpoint de [criar ou atualizar cliente](../api/clientes/criar_atualizar_cliente.md), enviando o campo adicional `cart_link` com a URL do carrinho.

> **Pré-requisito**
>
> Para criar um cliente, você precisa ter feito a coleta de IP utilizando o script [Appmax JS](../primeiros_passos/appmax_js.md).
## Requisição

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
  "document_number": "25226493029",
  "cart_link": "https://subdomain.domain.com/cart/123-345-678",
  "address": {
    "postcode": "91520270",
    "street": "Rua Francisco Carneiro da Rocha",
    "number": "582",
    "complement": "Casa",
    "district": "Moinhos de Ventos",
    "city": "Porto Alegre",
    "state": "RS"
  },
  "ip": "127.0.0.1",
  "products": [
    {
      "sku": "9000010",
      "name": "Livro de receitas",
      "quantity": 1,
      "unit_value": 12300,
      "type": "digital"
    }
  ],
  "tracking": {
    "utm_source": "google",
    "utm_campaign": "teste"
  }
}'
```

### Campos do body

| Campo             | Tipo   | Obrigatório | Descrição                          |
| ------------------ | ------ | :----------: | ----------------------------------- |
| `first_name`       | string |      ✅      | Nome do cliente                     |
| `last_name`        | string |      ✅      | Sobrenome do cliente                |
| `email`            | string |      ✅      | E-mail válido                       |
| `phone`            | string |      ✅      | Telefone com DDD                    |
| `ip`               | string |      ✅      | IP de origem                        |
| `products`         | array  |      ✅      | Lista de produtos vinculados        |
| `cart_link`        | string |      ✅      | URL do carrinho abandonado          |
| `document_number`  | string |      ❌      | CPF ou CNPJ                         |
| `address`          | object |      ❌      | Endereço do cliente                 |
| `tracking`         | object |      ❌      | Dados de origem da visita (UTMs)    |

Os demais campos seguem o mesmo contrato do endpoint de [criar ou atualizar cliente](../api/clientes/criar_atualizar_cliente.md).

## Resposta

**201 — cliente criado com sucesso**

```json
{
  "data": {
    "customer": {
      "id": 1
    }
  }
}
```

> **Importante**
>
> Guarde o valor de `customer_id` retornado nesta etapa, mesmo que temporariamente. Ele será necessário para criar o pedido caso o cliente conclua a compra.
**422 — erro de validação**

```json
{
  "message": "The given data failed to pass validation.",
  "errors": {
    "message": {
      "first_name": ["The first_name field is required."],
      "last_name": ["The last_name field is required."],
      "phone": ["The phone field must be a string.", "The phone field must have a maximum of 11 characters."],
      "email": ["The email field is required.", "The email field must be a string."],
      "ip": ["The ip field is required."]
    }
  }
}
```

## Veja também

- [Criar ou atualizar cliente](../api/clientes/criar_atualizar_cliente.md)
- [Appmax JS](../primeiros_passos/appmax_js.md)
- [Como criar um pedido](../api/pedidos/criar_pedido.md)

## Veja Também

- [Index Master](../index_master.md)
- [Webhooks](webhooks.md)
- [Rate Limit](rate_limit.md)
- [Calculo Parcelas](calculo_parcelas.md)
