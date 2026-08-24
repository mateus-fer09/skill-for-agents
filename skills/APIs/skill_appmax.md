---
name: appmax-api-integration
description: Guia e referência técnica completa para integração com a plataforma e API da Appmax. Use sempre que o projeto envolver autenticação OAuth 2.0 Appmax, endpoints da API v1 (pedidos, pagamentos, clientes, assinaturas), tokenização de cartão com Appmax JS ou webhooks.
---

# Guia de Integração e Referência da API Appmax

## 1. Visão Geral e Arquitetura

A Appmax oferece um ecossistema completo de pagamentos, gateway, antifraude e adquirência em uma única API.

### Principais Pilares da API

* **Autenticação centralizada:** OAuth 2.0 via `[https://auth.appmax.com.br/oauth2/token](https://auth.appmax.com.br/oauth2/token)`.
* **API RESTful:** Endpoints sob o domínio `[https://api.appmax.com.br/v1](https://api.appmax.com.br/v1)`.
* **Appmax JS (Front-end CDN):** Script cliente para tokenização segura de cartões no navegador e captura de contexto (`externalId`, IP do comprador).
* **Webhooks:** Notificações em tempo real sobre mudanças de status de pedidos, pagamentos e assinaturas.

---

## 2. Tipos de Credenciais e Identificadores

| Conceito | Descrição | Escopo / Uso |
| --- | --- | --- |
| **App Credentials**<br>

<br>`(app_id, client_id, client_secret)` | Emitidos na criação do aplicativo no painel do Appstore da Appmax. | Usados para gerenciar a aplicação e iniciar fluxos OAuth/Instalação. |
| **Merchant Credentials**<br>

<br>`(client_id, client_secret)` | Gerados após a autorização do lojista (merchant). | Usados para obter o Bearer Token de acesso aos endpoints `/v1/*` da loja do merchant. |
| **`external_id`**<br>

<br>`(UUID v4)` | Identificador único da instalação do app em determinada loja. Criado pelo integrador no Health Check de instalação. | Usado no Appmax JS e chamadas de CDN no front-end. **Não** deve ser enviado em chamadas Server-to-Server (`api.appmax.com.br`). |

---

## 3. Fluxo de Instalação do Aplicativo e Autenticação

### 3.1. Fluxo de Instalação (OAuth & Health Check)

1. **Autorização:** Chamada `POST /app/authorize` gerando redirecionamento do lojista para `url_callback` com um token de uso único.
2. **Geração de Credenciais:** O integrador chama `POST /app/client/generate` trocando o token pelas credenciais do lojista (`client_id` e `client_secret`).
3. **Health Check (Validação da Instalação):** Durante o `POST /app/client/generate`, a Appmax realiza uma requisição Server-to-Server para a *Validation URL* configurada pelo integrador. O integrador gera um UUID v4 (`external_id`) único para aquela instalação e responde com HTTP 200 OK:

```json
{
  "external_id": "c1f7a08b-285d-4f11-a83a-4933a1e945c2"
}

```

> O integrador deve salvar o `external_id`, `client_id` e `client_secret` associados à loja do merchant no seu banco de dados.

### 3.2. Obtenção do Bearer Token

Para realizar chamadas à API em nome da loja do merchant, obtenha o token de acesso temporário (expira em 3600s / 1h):

```bash
curl --location 'https://auth.appmax.com.br/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=MERCHANT_CLIENT_ID' \
--data-urlencode 'client_secret=MERCHANT_CLIENT_SECRET'

```

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR...",
  "token_type": "Bearer",
  "expires_in": 3600
}

```

---

## 4. Passo a Passo Completo de Processamento de Pagamento

A integração padrão de checkout com a Appmax segue a seguinte sequência de 4 etapas:

`[1. Autenticar]` $\rightarrow$ `[2. Criar Cliente]` $\rightarrow$ `[3. Criar Pedido]` $\rightarrow$ `[4. Processar Pagamento]`

### Etapa 1: Criar / Atualizar Cliente (`POST /v1/customers`)

Registra ou atualiza os dados do comprador.

* **Endpoint:** `[https://api.appmax.com.br/v1/customers](https://api.appmax.com.br/v1/customers)`
* **Header:** `Authorization: Bearer YOUR_TOKEN`
* **Body Exemplo:**

```json
{
  "first_name": "Mateus",
  "last_name": "Oliveira",
  "email": "mateus@exemplo.com",
  "phone": "83999999999",
  "cpf": "12345678900",
  "ip": "189.100.10.1",
  "address": {
    "street": "Avenida Epitacio Pessoa",
    "number": "1000",
    "district": "Tambau",
    "city": "Joao Pessoa",
    "state": "PB",
    "zip_code": "58000000"
  }
}

```

* **Retorno Esperado:** Salve o `customer_id` (ex: `1`).

---

### Etapa 2: Criar Pedido (`POST /v1/orders`)

Cria o pedido associado ao cliente antes de efetuar o pagamento.

* **Endpoint:** `[https://api.appmax.com.br/v1/orders](https://api.appmax.com.br/v1/orders)`
* **Header:** `Authorization: Bearer YOUR_TOKEN`
* **Body Exemplo:**

```json
{
  "customer_id": 1,
  "products": [
    {
      "sku": "PROD-101",
      "name": "Curso de Desenvolvimento Web",
      "quantity": 1,
      "unit_value": 15000,
      "type": "digital"
    }
  ]
}

```

> **Nota:** `unit_value` é expresso em centavos (ex: R$ 150,00 = `15000`).

* **Retorno Esperado:** Salve o `order_id` (ex: `1001`).

---

### Etapa 3: Processar Pagamento

#### A) Cartão de Crédito (`POST /v1/payments/credit-card`)

```json
{
  "order_id": 1001,
  "customer_id": 1,
  "payment_data": {
    "token": "CARD_TOKEN_GERADO_PELO_APPMAX_JS",
    "installments": 1,
    "soft_descriptor": "MINHALOJA"
  }
}

```

#### B) Pix (`POST /v1/payments/pix`)

```json
{
  "order_id": 1001,
  "customer_id": 1
}

```

* **Resposta:** Retorna a string copia e cola (`pix_emv`) e a imagem/URL do QR Code (`pix_qrcode_url` / Base64).

#### C) Boleto Bancário (`POST /v1/payments/boleto`)

```json
{
  "order_id": 1001,
  "customer_id": 1
}

```

* **Resposta:** Retorna a linha digitável e a URL do PDF do boleto para impressão.

#### D) Apple Pay (`POST /v1/payments/apple-pay`)

Utiliza o token obtido pelo Safari `PaymentSheet` através do Appmax JS no front-end.

---

## 5. Integração Front-end com Appmax JS

O **Appmax JS** é o SDK em JavaScript para navegador, responsável por tokenizar cartões de crédito e autenticar requisições de front-end usando o `externalId`.

### Inicialização do Script

```html
<script src="https://scripts.appmax.com.br/appmax.js"></script>
<script>
  window.AppmaxScripts.init(
    function onSuccess(data) {
      console.log('Appmax JS inicializado:', data);
    },
    function onError(error) {
      console.error('Erro na inicialização do Appmax JS:', error);
    },
    'EXTERNAL_ID_DA_LOJA_OBTIDO_NO_BANCO_DE_DADOS'
  );
</script>

```

---

## 6. Webhooks e Notificações em Tempo Real

A Appmax envia notificações de eventos via HTTP POST para a Webhook URL cadastrada no painel do aplicativo.

### Categorias de Eventos (Total de 29 eventos)

* **Order:** Criado, Pago, Estornado, Chargeback, Pix Gerado, Boleto Gerado, etc.
* **Customer:** Criação, atualização de contato e interesse.
* **Payment:** Autorização pendente, recusada, aprovada.
* **Subscription:** Assinatura criada, cancelada, cobrança recorrente efetuada.

### Boas Práticas de Webhook

1. Responder sempre com **HTTP 200 OK** de forma rápida e assíncrona.
2. Implementar **verificação de idempotência** (evitar reprocessamento do mesmo evento usando `event_id` ou `order_id` + status).

---

## 7. Recorrência (Assinaturas) e Estornos

### Assinaturas Recorrentes

* **Endpoint:** `POST /v1/subscriptions`
* Permite vincular um plano a um cliente para cobranças automáticas periódicas.

### Estornos (Refunds)

* **Endpoint:** `POST /v1/refunds`
* Permite estorno total ou parcial de transações processadas.
* **Parâmetros principais:** `order_id`, `amount` (para estorno parcial) ou omitir para estorno total.

---

## 8. Exemplo Prático em TypeScript / Node.js

Abaixo está um exemplo modular em TypeScript para autenticação e criação de checkout Pix:

```typescript
import axios from 'axios';

interface AppmaxAuthConfig {
  clientId: string;
  clientSecret: string;
}

interface CustomerPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cpf: string;
  ip?: string;
}

export class AppmaxService {
  private baseUrl = 'https://api.appmax.com.br/v1';
  private authUrl = 'https://auth.appmax.com.br/oauth2/token';

  constructor(private config: AppmaxAuthConfig) {}

  async getAccessToken(): Promise<string> {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.config.clientId);
    params.append('client_secret', this.config.clientSecret);

    const response = await axios.post(this.authUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return response.data.access_token;
  }

  async createCustomer(token: string, customer: CustomerPayload) {
    const response = await axios.post(`${this.baseUrl}/customers`, customer, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data.data.customer.id;
  }

  async createOrder(
    token: string,
    customerId: number,
    productSKU: string,
    productName: string,
    priceInCents: number
  ) {
    const payload = {
      customer_id: customerId,
      products: [
        {
          sku: productSKU,
          name: productName,
          quantity: 1,
          unit_value: priceInCents,
          type: 'digital'
        }
      ]
    };

    const response = await axios.post(`${this.baseUrl}/orders`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data.data.order.id;
  }

  async payWithPix(token: string, orderId: number, customerId: number) {
    const response = await axios.post(
      `${this.baseUrl}/payments/pix`,
      { order_id: orderId, customer_id: customerId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  }
}

```

---

## 9. Lista de Controle e Checklist para Produção

* [ ] Criar Aplicativo no Appstore Appmax (Público ou Privado)
* [ ] Implementar Endpoint de Validação / Health Check que responde HTTP 200 com UUID `external_id`
* [ ] Configurar Armazenamento do `external_id`, `client_id` e `client_secret` vinculados a cada loja
* [ ] Implementar Obtenção e Caching de Token Bearer (`/oauth2/token`)
* [ ] Carregar Appmax JS no Front-end com o `externalId` correto por loja
* [ ] Tratar Respostas de Webhook de forma assíncrona com ID de Idempotência
* [ ] Testar no Ambiente de Sandbox antes da homologação final

---

## 10. Links e Referências Úteis

* Appmax API Documentation
* Quickstart Guide
* Guia do `external-id`
* Criação de Aplicativos
