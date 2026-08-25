# AppStore, Instalação e `external_id`

## Objetivo

Converter a autorização do merchant em credenciais próprias daquela instalação.

## Etapa 1 — token do app

Use as credenciais do aplicativo no endpoint OAuth2.

```bash
curl -X POST "https://auth.appmax.com.br/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=client_credentials" \
  --data-urlencode "client_id=APP_CLIENT_ID" \
  --data-urlencode "client_secret=APP_CLIENT_SECRET"
```

## Etapa 2 — iniciar autorização

Endpoint:

```http
POST /app/authorize
```

Exemplo de body:

```json
{
  "app_id": "APP_ID",
  "external_key": "IDENTIFICADOR_LOCAL",
  "url_callback": "https://seu-dominio.com/appmax/callback"
}
```

A resposta contém um token/hash de autorização.

## Etapa 3 — redirecionar merchant

Produção:

```text
https://admin.appmax.com.br/appstore/integration/{HASH}
```

Sandbox:

```text
https://breakingcode.sandboxappmax.com.br/appstore/integration/{HASH}
```

O redirecionamento é parte obrigatória da autorização.

## Etapa 4 — callback e geração de credenciais

Após a autorização, o integrador recebe o retorno e conclui a geração das credenciais com:

```http
POST /app/client/generate
```

Durante esse processo ocorre o health check da URL de validação cadastrada.

## Health check

Seu endpoint de validação deve:

1. estar publicamente acessível;
2. responder ao contrato esperado;
3. gerar ou recuperar o identificador da instalação;
4. retornar `HTTP 200`;
5. devolver o `external_id`.

Exemplo conceitual:

```json
{
  "external_id": "9f11785f-70d7-4a40-bb83-caf79a224cd0"
}
```

## `external_id` vs `external-id`

É o mesmo valor.

### Em JSON

```json
{
  "external_id": "UUID"
}
```

### Em HTTP header

```http
external-id: UUID
```

## Propriedades do `external_id`

- É gerado pelo integrador.
- A Appmax persiste o vínculo com a loja.
- Não substitui autenticação.
- Não é `client_id`.
- Não é `client_secret`.
- Deve ser persistido por instalação/merchant.
- É reutilizado em fluxos do checkout/browser que precisam identificar a loja correta.

## Modelo de persistência sugerido

```sql
CREATE TABLE appmax_installations (
  id BIGSERIAL PRIMARY KEY,
  merchant_local_id VARCHAR(255) NOT NULL,
  external_id UUID NOT NULL UNIQUE,
  merchant_client_id TEXT,
  merchant_client_secret TEXT,
  appmax_site_id TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

## Fluxo resumido

```text
APP credentials
   ↓
POST /oauth2/token
   ↓
POST /app/authorize
   ↓
merchant authorization UI
   ↓
url_callback
   ↓
POST /app/client/generate
   ↓
Appmax chama health check
   ↓
seu servidor retorna external_id
   ↓
merchant credentials
   ↓
operações /v1/*
```

## Reinstalação/reaproveitamento de loja

O merchant pode selecionar loja existente durante a instalação. Portanto:

- não assuma que cada instalação representa uma loja criada naquele instante;
- trate reinstalação de forma idempotente;
- procure associação pelo identificador local/externo antes de duplicar registros;
- atualize credenciais quando uma nova instalação gerar novo par.
