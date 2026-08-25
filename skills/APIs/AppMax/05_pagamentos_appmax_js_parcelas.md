# Pagamentos, Tokenização, Appmax JS e Parcelas

## Pré-requisitos gerais

Antes de pagar:

```text
customer_id
order_id
Bearer token do merchant
```

Métodos documentados:

- cartão de crédito;
- Pix;
- boleto;
- Apple Pay.

---

# Cartão de crédito

## Fluxo

```text
dados do cartão
  ↓
tokenização
  ↓
token de uso controlado
  ↓
POST /v1/payments/credit-card
  ↓
resultado do pagamento
```

## Tokenização

```http
POST /v1/payments/tokenize
```

A documentação enfatiza:

- não enviar PAN/CVV diretamente ao endpoint final de pagamento;
- preferir tokenização no frontend;
- tokenização server-side envolve requisitos PCI-DSS.

Exemplo conceitual do pagamento:

```json
{
  "order_id": 1001,
  "customer_id": 501,
  "token": "CARD_TOKEN",
  "installments": 3
}
```

Endpoint:

```http
POST /v1/payments/credit-card
```

## Appmax JS

O Appmax JS participa do checkout para reduzir exposição de dados sensíveis e fornecer informações usadas pela integração, incluindo dados associados à sessão/cliente.

Ao gerar um checkout, trate o script da Appmax como componente de segurança e não como biblioteca opcional de UI.

---

# Pix

Endpoint:

```http
POST /v1/payments/pix
```

Retorno inclui informações como:

- QR Code;
- EMV copia-e-cola;
- data de expiração.

Regra importante:

```ts
const remainingMs =
  new Date(pix_expiration_date).getTime() - Date.now();
```

Não hardcode `5 min`, `15 min` etc.

---

# Boleto

Endpoint:

```http
POST /v1/payments/boleto
```

Retorno inclui:

```text
pdf_url
digitable_line
```

Exibição recomendada:

```text
[Baixar boleto] -> redireciona para pdf_url
[Copiar linha digitável] -> copia digitable_line
```

Evite abrir o PDF embutido em iframe.

---

# Apple Pay

Pagamento:

```http
POST /v1/payments/apple-pay
```

Merchant validation:

```http
POST /v1/apple-pay/merchant-session
```

Para `merchant-session`, o identificador da loja é enviado no body como `external_id`; a documentação destaca que essa rota não usa o header `external-id`.

No frontend Apple Pay, a resposta da merchant validation é utilizada em:

```js
session.completeMerchantValidation(merchantSession);
```

Compatibilidade descrita:

- Safari;
- dispositivos/ecossistema Apple compatível.

---

# Parcelas

Endpoint:

```http
POST /v1/payments/installments
```

A API retorna valores totais com juros por modalidade. O frontend pode derivar o valor individual:

```ts
const installmentValue = totalWithInterest / numberOfInstallments;
```

Faixa documentada:

```text
1 a 12 parcelas
```

A disponibilidade/condições podem variar por merchant.

Modalidades mencionadas:

- `PP`: taxa aplicada por parcela;
- `AM`: modelo de financiamento com juros sobre saldo devedor.

Regra: use o retorno da Appmax como fonte de verdade para condições exibidas ao comprador.
