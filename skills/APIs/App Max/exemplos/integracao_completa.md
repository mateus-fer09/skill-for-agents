---
title: "Exemplo Completo de Integração de Ponta a Ponta"
description: "Implementação completa com código funcional para fluxo de criação de cliente, pedido e pagamento no Sandbox."
topics:
  - exemplos
  - integracao-completa
  - codigo-pronto
  - sandbox-flow
keywords:
  - exemplo integracao
  - curl
  - node
  - php
  - fluxo completo
  - token -> cliente -> pedido -> pagamento
related:
  - ../index_master.md
  - pagamento_parcelado.md
source_scope:
  - https://docs.appmax.com.br/guides/exemplo-integracao
---

# Exemplo completo de integração

Este guia mostra o fluxo completo de uma venda — da autenticação até a confirmação do pagamento — usando o ambiente **sandbox** com exemplos prontos para copiar e executar.

> **Todos os exemplos usam URLs de sandbox. Para produção, substitua `sandboxappmax` por `appmax` nas URLs.**
>
>
## O que vamos construir

```
Autenticar → Coletar IP → Criar cliente → Criar pedido → Pagar → Confirmar
```

Ao final deste guia você terá executado uma transação completa no sandbox.

## Pré-requisitos

- `client_id` e `client_secret` do **merchant** (obtidos após [instalação do app](../aplicativos/fluxo_instalacao.md))
- Página HTML para incluir o [Appmax JS](../primeiros_passos/appmax_js.md)
- Endpoint para receber [webhooks](../guias_e_recursos/webhooks.md)

---

## 1. Autenticar

Obtenha um token Bearer com as credenciais do merchant.

```bash
curl --request POST \
     --url https://auth.sandboxappmax.com.br/oauth2/token \
     --header 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode 'grant_type=client_credentials' \
     --data-urlencode 'client_id=SEU_CLIENT_ID' \
     --data-urlencode 'client_secret=SEU_CLIENT_SECRET'
```

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Salve o `access_token`. Ele será usado em todas as chamadas seguintes como `Bearer SEU_TOKEN`. O token expira em 1 hora.

---

## 2. Coletar o IP do cliente

Antes de criar o cliente, é obrigatório coletar o IP usando o [Appmax JS](../primeiros_passos/appmax_js.md). Inclua o script na sua página de checkout:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Checkout</title>
</head>
<body>
  <form id="customer-form" data-appmax-customer>
    <input type="text" name="first_name" placeholder="Nome" required />
    <input type="text" name="last_name" placeholder="Sobrenome" required />
    <input type="email" name="email" placeholder="E-mail" required />
    <input type="text" name="phone" placeholder="Telefone" required />
    <button type="submit">Continuar</button>
  </form>

  <script src="https://scripts.appmax.com.br/appmax.min.js"></script>
  <script>
    let clienteIP = null;

    window.AppmaxScripts.init(
      function onSuccess(data) {
        clienteIP = data.ip;
        console.log('IP coletado:', clienteIP);
      },
      function onError(err) {
        console.error('Erro ao coletar IP:', err);
      }
    );

    document.getElementById('customer-form').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!clienteIP) {
        alert('Aguarde a coleta do IP');
        return;
      }
      // Envie os dados do formulário + clienteIP para seu backend
      enviarParaBackend({
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        email: this.email.value,
        phone: this.phone.value,
        ip: clienteIP
      });
    });
  </script>
</body>
</html>
```

> **No sandbox, se o IP não estiver disponível, use `127.0.0.1` para testes. Em produção, o IP real é obrigatório.**
>
>
---

## 3. Criar o cliente

No seu backend, envie os dados do cliente para a API. A combinação `first_name` + `last_name` + `email` + `phone` + `ip` é a chave única — se já existir, o cliente é atualizado.

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/customers \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "first_name": "Junior",
  "last_name": "Almeida",
  "email": "junior.almeida@email.com",
  "phone": "51983655100",
  "ip": "127.0.0.1",
  "document_number": "25226493029",
  "address": {
    "postcode": "91520270",
    "street": "Rua Francisco Carneiro da Rocha",
    "number": "582",
    "complement": "Casa",
    "district": "Moinhos de Ventos",
    "city": "Porto Alegre",
    "state": "RS"
  }
}'
```

```json
{
  "data": {
    "customer": {
      "id": 2023
    }
  }
}
```

Salve `data.customer.id` — este é o **customer_id** que será usado no pedido.

---

## 4. Criar o pedido

Vincule o pedido ao cliente. Os valores são em **centavos** (R$ 123,00 = `12300`).

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/orders \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "customer_id": 2023,
  "products": [
    {
      "sku": "LIVRO-001",
      "name": "Livro de receitas",
      "quantity": 1,
      "unit_value": 12300,
      "type": "digital"
    }
  ],
  "shipping_value": 0,
  "discount_value": 0
}'
```

```json
{
  "data": {
    "order": {
      "id": 3531,
      "status": "pendente"
    }
  }
}
```

Salve `data.order.id` — este é o **order_id** que será usado no pagamento. O status começa como `pendente`.

---

## 5. Processar o pagamento

Escolha um dos métodos abaixo. No sandbox, use o [cartão de teste](../api/pagamentos/cartao_credito.md#cartoes-de-teste) `4000000000000010` para simular sucesso.

##### Cartão de crédito

Existem duas formas: via **token** (recomendado) ou via **Appmax JS**. Este exemplo usa tokenização:

**Passo 1 — Tokenizar o cartão:**

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/payments/tokenize \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "payment_data": {
    "credit_card": {
      "number": "4000000000000010",
      "cvv": "123",
      "expiration_month": "12",
      "expiration_year": "28",
      "holder_name": "Junior Almeida"
    }
  }
}'
```

```json
{
  "data": {
    "token": "422146c7523a46119d6073ea56193913"
  }
}
```

**Passo 2 — Pagar com o token:**

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/payments/credit-card \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "order_id": 3531,
  "customer_id": 2023,
  "payment_data": {
    "credit_card": {
      "token": "422146c7523a46119d6073ea56193913",
      "holder_document_number": "25226493029",
      "holder_name": "Junior Almeida",
      "installments": 1,
      "soft_descriptor": "MINHALOJA"
    }
  }
}'
```

```json
{
  "data": {
    "order": {
      "id": 3531,
      "status": "autorizado"
    },
    "payment": {
      "method": "creditcard",
      "installments": 1,
      "paid_at": "2025-03-15 14:30:00"
    },
    "upsell_hash": "4000114202503117156088040208561001715608804"
  }
}
```

O status `autorizado` indica que o pagamento foi aceito e está em análise antifraude. Aguarde o webhook `order_approved` para confirmação.

##### Pix

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/payments/pix \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "order_id": 3531,
  "payment_data": {
    "pix": {
      "document_number": "25226493029"
    }
  }
}'
```

```json
{
  "data": {
    "order": {
      "id": 3531,
      "status": "pendente"
    },
    "pix": {
      "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS...",
      "emv_code": "00020126580014br.gov.bcb.pix0136a1b2c3d4...",
      "expires_at": "2025-03-15 15:30:00"
    }
  }
}
```

Exiba o `qr_code` como imagem e o `emv_code` como texto copiável. Aguarde o webhook `order_paid_by_pix` para confirmação.

##### Boleto

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/payments/boleto \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "order_id": 3531,
  "payment_data": {
    "boleto": {
      "document_number": "25226493029"
    }
  }
}'
```

```json
{
  "data": {
    "order": {
      "id": 3531,
      "status": "pendente"
    },
    "boleto": {
      "pdf_url": "https://boleto.sandboxappmax.com.br/pdf/abc123...",
      "digitable_line": "23793.38128 60000.000003 00000.000400 1 84340000012300",
      "due_date": "2025-03-22"
    }
  }
}
```

Ofereça o `pdf_url` como botão de download e a `digitable_line` como texto copiável. Aguarde o webhook `order_paid` quando o boleto for compensado.

---

## 6. Confirmar o pagamento

A confirmação é assíncrona. Há duas formas de saber que o pagamento foi aprovado:

### Via webhook (recomendado)

Seu endpoint receberá um POST quando o status mudar:

```json
{
  "event": "order_approved",
  "event_type": "order",
  "data": {
    "order": {
      "id": 3531,
      "status": "aprovado",
      "total_paid": 12300
    },
    "customer": {
      "id": 2023,
      "name": "Junior Almeida",
      "email": "junior.almeida@email.com"
    },
    "payment": {
      "method": "creditcard",
      "installments": 1,
      "paid_at": "2025-03-15 14:30:00"
    }
  }
}
```

Responda com **HTTP 200** para confirmar o recebimento.

### Via consulta (polling)

Se precisar verificar o status manualmente:

```bash
curl --request GET \
     --url https://api.sandboxappmax.com.br/v1/orders/3531 \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json'
```

```json
{
  "data": {
    "order": {
      "id": 3531,
      "status": "aprovado",
      "total_paid": 12300,
      "amounts": {
        "sub_total": 12300,
        "shipping_value": 0,
        "discount": 0,
        "installment_fee": 0
      }
    },
    "customer": {
      "id": 2023,
      "name": "Junior Almeida",
      "email": "junior.almeida@email.com"
    },
    "payment": {
      "method": "creditcard",
      "installments": 1,
      "paid_at": "2025-03-15 14:30:00"
    }
  }
}
```

Veja todos os [status possíveis](../fundamentos/status_pedidos.md).

---

## 7. Após o pagamento

### Produtos físicos: cadastrar código de rastreio

Para liberar os saques do merchant, atualize o pedido com o código de rastreio:

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/orders/shipping-tracking-code \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "order_id": 3531,
  "shipping_tracking_code": "BR123456789XX"
}'
```

### Estorno (se necessário)

Para solicitar um reembolso total:

```bash
curl --request POST \
     --url https://api.sandboxappmax.com.br/v1/orders/refund-request \
     --header 'Authorization: Bearer SEU_TOKEN' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "order_id": 3531,
  "type": "total",
  "value": 12300
}'
```

---

## Resumo do fluxo

| Etapa | Endpoint | Resultado |
|-------|----------|-----------|
| Autenticar | `POST /oauth2/token` | `access_token` |
| Criar cliente | `POST /v1/customers` | `customer_id` |
| Criar pedido | `POST /v1/orders` | `order_id` (status: `pendente`) |
| Tokenizar cartão | `POST /v1/payments/tokenize` | `token` |
| Pagar | `POST /v1/payments/credit-card` | status: `autorizado` |
| Confirmar | Webhook `order_approved` | status: `aprovado` |
| Rastreio | `POST /v1/orders/shipping-tracking-code` | Rastreio vinculado |

## Testando cenários de erro

Use o cartão `4000000000000028` para simular falha no pagamento. A API retornará:

```json
{
  "error": {
    "message": "Payment not authorized"
  }
}
```

Veja mais [cartões de teste](../api/pagamentos/cartao_credito.md#cartoes-de-teste) na documentação de cartão de crédito.

---

## Próximos passos

- [Cálculo de parcelas](../guias_e_recursos/calculo_parcelas.md): Implemente parcelamento consultando as taxas da Appmax.
- [Upsell](../api/pedidos/upsell.md): Ofereça produtos complementares após o pagamento.
- [Recorrência](../api/assinaturas/criar_assinatura.md): Configure cobranças periódicas automáticas.
- [Apple Pay](../api/pagamentos/apple_pay.md): Aceite pagamentos via Apple Pay no Safari.

## Veja Também

- [Index Master](../index_master.md)
- [Pagamento Parcelado](pagamento_parcelado.md)
