# Fontes e Cobertura da Extração

## URLs fornecidas

- https://docs.appmax.com.br/quickstart
- https://docs.appmax.com.br/api-reference/introduction

## Páginas mapeadas diretamente

### Guias

- `/quickstart`
- `/guides/por-onde-comecar`
- `/guides/conceitos`
- `/guides/ambientes`
- `/guides/status-pedidos`
- `/guides/criar-aplicativo`
- `/guides/identificadores-do-app`
- `/guides/validar-url`
- `/guides/implementar-url-validacao`
- `/guides/publicacao-producao`
- `/guides/instalacao`
- `/guides/callback-instalacao`
- `/guides/reaproveitar-loja`
- `/guides/automatizar-criacao-credenciais`
- `/guides/autenticacao`
- `/guides/external-id`
- `/guides/webhooks`
- `/guides/calculo-parcelas`
- `/guides/exemplo-integracao`
- `/guides/exemplo-checkout-completo`
- `/guides/split-pagamentos`
- `/guides/split-status`
- `/guides/bancos-homologados`
- `/guides/split-perguntas-frequentes`
- `/guides/faq`

### API Reference

#### Produtos

- `GET /v1/products`
- `GET /v1/products/{id}`
- `POST /v1/products`
- `PUT /v1/products/{id}`
- `DELETE /v1/products/{id}`

#### Pedidos

- `POST /v1/orders`
- `GET /v1/orders/{order_id}`
- cálculo de valor do pedido
- `POST /v1/orders/shipping-tracking-code`

#### Pagamentos

- `POST /v1/payments/tokenize`
- `POST /v1/payments/credit-card`
- `POST /v1/payments/pix`
- `POST /v1/payments/boleto`
- `POST /v1/payments/apple-pay`
- `POST /v1/apple-pay/merchant-session`
- `POST /v1/payments/installments`

#### Assinaturas

- `POST /v1/subscriptions`
- `GET /v1/subscriptions/{id}`
- `PATCH /v1/subscriptions/{id}/activate`
- `PATCH /v1/subscriptions/{id}/cancel`
- `PATCH /v1/subscriptions/{id}/charge-day`
- `PATCH /v1/subscriptions/{id}/frequency`
- `PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/skip`
- `PATCH /v1/subscriptions/{id}/cycles/{cycleIndex}/unskip`
- `PATCH /v1/subscriptions/{id}/address`
- `PATCH /v1/subscriptions/{id}/tag`
- `GET /v1/subscriptions/{id}/available-products`
- `POST /v1/subscriptions/{id}/products`
- `PATCH /v1/subscriptions/{id}/products/{variantId}/quantity`
- `DELETE /v1/subscriptions/{id}/products/{variantId}`

#### Links de pagamento

- `POST /v1/payment-link`
- `GET /v1/payment-link/{payment_link_id}/orders`

#### Split

- `POST /v1/recipient`
- `POST /v1/recipient/{recipient_hash}/facematch-link`
- `GET /v1/recipient/{recipient_hash}/status`
- `POST /v1/orders/{orderId}/split-order`
- `GET /v1/recipient/{recipient_hash}/balances`
- `GET /v1/recipient/{recipient_hash}/withdraw-request/anticipation/simulate`
- `POST /v1/recipient/{recipient_hash}/withdraw-request/anticipation`
- `POST /v1/recipient/{recipient_hash}/withdraw-request/available`
- `GET /v1/withdraw-request/{withdrawRequestId}`

## Páginas que apresentaram bloqueio/erro de crawler durante a coleta

Algumas rotas de documentação retornaram erro/403 na ferramenta de leitura, apesar de constarem no menu oficial. Entre elas:

- criar/atualizar cliente;
- Appmax JS;
- rate limit;
- recuperação de vendas com IA;
- integração com IA/MCP;
- exemplo de pagamento parcelado;
- upsell;
- listar assinaturas;
- pausar assinatura;
- criar estorno.

### Regra para agentes

A ausência de detalhes completos desses itens neste pacote **não significa que a funcionalidade não existe**.

Ao implementar produção, consulte a documentação oficial atual para confirmar:

```text
método HTTP
path
headers especiais
body/schema
enum
limites
rate limit
status codes
regras de idempotência
```

## Nota de preservação

Este pacote reorganiza e reexpressa o conteúdo técnico consultado para uso por agentes. Endpoints, nomes de campos, enums e regras técnicas foram mantidos quando identificados; os exemplos de código foram normalizados/reconstruídos para evitar dependência de formatação específica do site.

## Data da coleta

```text
24/08/2026
Timezone de referência: America/Fortaleza
```
