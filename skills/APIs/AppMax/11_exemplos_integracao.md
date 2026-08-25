# Exemplos de Integração

## 1. Cliente → Pedido → Pix

```ts
async function createPixCheckout(input) {
  const token = await getMerchantToken();

  const customer = await appmax.post(
    "/v1/customers",
    {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone,
      ip: input.ip
    },
    token
  );

  const customerId = customer.data.customer.id;

  const order = await appmax.post(
    "/v1/orders",
    {
      customer_id: customerId,
      products: input.products.map(p => ({
        sku: p.sku,
        name: p.name,
        quantity: p.quantity,
        unit_value: p.unitValueCents,
        type: p.type
      }))
    },
    token
  );

  const orderId = order.data.order.id;

  const pix = await appmax.post(
    "/v1/payments/pix",
    {
      order_id: orderId,
      customer_id: customerId
    },
    token
  );

  return {
    customerId,
    orderId,
    pix
  };
}
```

## 2. Token cache

```ts
let cachedToken: {
  accessToken: string;
  expiresAt: number;
} | null = null;

async function getMerchantToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 30_000) {
    return cachedToken.accessToken;
  }

  const response = await fetch(`${AUTH_BASE}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.APPMAX_MERCHANT_CLIENT_ID!,
      client_secret: process.env.APPMAX_MERCHANT_CLIENT_SECRET!
    })
  });

  const json = await response.json();

  cachedToken = {
    accessToken: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000
  };

  return cachedToken.accessToken;
}
```

## 3. Instalação multi-merchant

```ts
async function startInstallation(merchantLocalId: string) {
  const appToken = await getAppToken();

  const auth = await appmax.post(
    "/app/authorize",
    {
      app_id: process.env.APPMAX_APP_ID,
      external_key: merchantLocalId,
      url_callback: `${PUBLIC_URL}/appmax/install/callback`
    },
    appToken
  );

  return buildAppmaxAuthorizationUrl(auth.data.token);
}
```

## 4. Health check

```ts
app.post("/appmax/health", async (req, res) => {
  const merchantRef = resolveMerchantFromValidationRequest(req);

  let installation = await db.installations.findByMerchant(merchantRef);

  if (!installation) {
    installation = await db.installations.create({
      merchantRef,
      externalId: crypto.randomUUID()
    });
  }

  res.status(200).json({
    external_id: installation.externalId
  });
});
```

## 5. Webhook idempotente

```ts
app.post("/appmax/webhook", async (req, res) => {
  res.sendStatus(200);

  const event = req.body;

  const resourceId =
    event.data?.order_id ??
    event.data?.subscription_id ??
    event.data?.customer_id ??
    "unknown";

  const key = `${event.event}:${resourceId}:${event.site_id}`;

  if (await processedEvents.exists(key)) return;

  await processedEvents.mark(key);
  await processAppmaxEvent(event);
});
```

## 6. Criar split antes do pagamento

```ts
async function prepareMarketplaceOrder(orderId, recipients) {
  for (const r of recipients) {
    const status = await appmax.get(
      `/v1/recipient/${r.hash}/status`
    );

    if (status.data !== "Onboarding completed") {
      throw new Error(`Recipient ${r.hash} ainda não está aprovado`);
    }
  }

  return appmax.post(
    `/v1/orders/${orderId}/split-order`,
    {
      recipients: recipients.map(r => ({
        recipient_hash: r.hash,
        value: r.valueCents
      }))
    }
  );
}
```

## 7. Exibir Pix

```ts
function startPixCountdown(expirationDate: string, onTick) {
  const end = new Date(expirationDate).getTime();

  return setInterval(() => {
    const remaining = Math.max(0, end - Date.now());
    onTick(remaining);
  }, 1000);
}
```

## 8. Estratégia de retry

Só execute retry automático quando seguro.

```text
401 → gere novo token e repita
429 → respeite política de rate limit vigente
5xx → retry com backoff e idempotência
4xx de validação → não repetir sem corrigir payload
```

Para operações financeiras mutáveis, sempre use chave/controle idempotente local para evitar duplicidade.
