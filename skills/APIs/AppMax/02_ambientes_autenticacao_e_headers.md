# Ambientes, Autenticação e Headers

## Ambientes

### Sandbox

```text
AUTH: https://auth.sandboxappmax.com.br
API:  https://api.sandboxappmax.com.br
```

### Produção

```text
AUTH: https://auth.appmax.com.br
API:  https://api.appmax.com.br
```

Não misture credenciais/URLs de ambientes diferentes.

## OAuth2 Client Credentials

A Appmax usa o grant `client_credentials`.

Exemplo equivalente:

```bash
curl -X POST "https://auth.appmax.com.br/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=client_credentials" \
  --data-urlencode "client_id=SEU_CLIENT_ID" \
  --data-urlencode "client_secret=SEU_CLIENT_SECRET"
```

Resposta típica:

```json
{
  "access_token": "TOKEN_JWT",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Expiração

- `expires_in`: aproximadamente 3600 segundos.
- Não existe refresh token no fluxo documentado.
- Ao expirar, solicite outro token com o mesmo par de credenciais.

Pseudocódigo:

```ts
async function getValidToken(credentials) {
  if (cache.hasValidToken(credentials.clientId)) {
    return cache.get(credentials.clientId);
  }

  const token = await requestClientCredentialsToken(credentials);
  cache.save(token, token.expires_in);
  return token.access_token;
}
```

## Qual credencial usar

### Credenciais do app

Use para instalação:

```text
POST /app/authorize
POST /app/client/generate
```

### Credenciais do merchant

Use para operações transacionais:

```text
/v1/customers
/v1/products
/v1/orders
/v1/payments/*
/v1/subscriptions/*
/v1/payment-link
/v1/recipient/*
```

## Headers gerais

```http
Authorization: Bearer {TOKEN}
Content-Type: application/json
Accept: application/json
```

Algumas rotas específicas podem exigir ou proibir headers adicionais. Verifique o módulo correspondente.

## Envelope de sucesso

Padrão geral:

```json
{
  "data": {
    "...": "..."
  }
}
```

## Erros

Exemplo conceitual:

```json
{
  "error": {
    "message": "Resource not found"
  }
}
```

Validação:

```json
{
  "message": "The given data failed to pass validation.",
  "errors": {
    "campo": [
      "Mensagem de validação"
    ]
  }
}
```

## Códigos HTTP importantes

| HTTP | Uso geral |
|---:|---|
| 200 | sucesso |
| 201 | recurso criado |
| 400 | requisição inválida/regra de negócio |
| 401 | token ausente, inválido ou expirado |
| 404 | recurso não encontrado |
| 409 | conflito de estado/regra |
| 422 | validação |
| 500 | erro interno |

Ao receber `401`, obtenha novo token antes de repetir a chamada.
