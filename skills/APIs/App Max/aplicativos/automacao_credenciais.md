---
title: "Automação da Criação de Credenciais"
description: "Tutorial completo para implementar onboarding self-service de merchants com recebimento automático de callback."
topics:
  - automacao
  - onboarding-self-service
  - geracao-credenciais
  - servico-backend
keywords:
  - automatizar credenciais
  - self-service
  - url_callback
  - client_id
  - client_secret
  - provisionamento
related:
  - ../index_master.md
  - criar_aplicativo.md
  - validar_url_instalacao.md
  - implementar_url_validacao.md
source_scope:
  - https://docs.appmax.com.br/guides/automatizar-criacao-credenciais
---

# Automatizar a criação de credenciais com `url_callback`

Este tutorial mostra, passo a passo, como montar um serviço que recebe o callback da Appmax ao final de `/app/authorize` e **gera automaticamente as credenciais do merchant**, sem intervenção manual. Ao final você terá um endpoint que transforma um merchant recém-autorizado em uma integração pronta para transacionar.

Se você quer entender o mecanismo por trás do `url_callback` (formato exato, contrato, segurança detalhada), veja [Callback de instalação](callback_instalacao.md). Esta página é um **hands-on** — código completo e decisões operacionais.

## O que você vai construir

```
Merchant autoriza → Callback recebe token → Serviço gera credenciais → Persiste → Pronto para transacionar
```

Um único endpoint HTTP resolve a automação. Não há tela de confirmação manual, não há operador intermediário.

## Pré-requisitos

- Aplicativo cadastrado no painel com **App UUID** e **credenciais do app** (`client_id`/`client_secret`). Ver [Criar aplicativo](criar_aplicativo.md).
- **URL de validação** cadastrada no painel (usada no health check de `/app/client/generate`). Ver [Instalação](fluxo_instalacao.md#health-check).
- Endpoint HTTPS público para o `url_callback` (em produção; em dev use ngrok ou similar).
- Banco de dados para associar `merchant_ref` ↔ `client_id`/`client_secret`.
- Um cofre/variáveis de ambiente para manter as credenciais do app fora do código.

> **URL de validação e url_callback são coisas diferentes**
>
> - **URL de validação** — cadastrada no painel, recebe o health check server-to-server durante `/app/client/generate`.
> - **`url_callback`** — enviada em `/app/authorize`, recebe o redirect do navegador com o `token`.
>
> Este tutorial é sobre o segundo. O primeiro precisa estar funcionando como pré-requisito.
---

## 1. Disparar a instalação com `url_callback`

Do seu backend (ou painel do integrador), chame `/app/authorize` apontando `url_callback` para o serviço de automação que você vai construir nos próximos passos.

```bash
curl --location 'https://api.appmax.com.br/app/authorize' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer APP_ACCESS_TOKEN' \
  --data '{
    "app_id": "8f2c1d3e-5a4b-4c7d-9e1f-2a3b4c5d6e7f",
    "external_key": "store_42",
    "url_callback": "https://onboarding.meuapp.com/appmax/callback?merchant_ref=42"
  }'
```

```json
{
  "data": {
    "token": "12083w36219d223f33ecf48f2a7f5ccf143b0bc554"
  }
}
```

> **Inclua seu próprio identificador**
>
> Passe um `merchant_ref` (ou qualquer identificador interno) na query string da `url_callback`. Ele volta intocado no callback e permite ligar o token recebido ao merchant certo no seu banco.
Com o hash em mãos, redirecione o merchant:

| Ambiente  | URL                                                                      |
| --------- | ------------------------------------------------------------------------ |
| Sandbox   | `https://breakingcode.sandboxappmax.com.br/appstore/integration/HASH`    |
| Produção  | `https://admin.appmax.com.br/appstore/integration/HASH`                  |

Após o merchant autorizar, a Appmax redireciona para `https://onboarding.meuapp.com/appmax/callback?merchant_ref=42&token=12083w36219d223f33ecf48f2a7f5ccf143b0bc554`.

---

## 2. Implementar o handler do callback

O handler tem três responsabilidades, nesta ordem:

1. Ler `token` e `merchant_ref` da query string.
2. Trocar o `token` pelas credenciais do merchant chamando `/app/client/generate`.
3. Persistir as credenciais e confirmar o sucesso ao merchant.

Exemplo completo em **Go 1.26**, usando apenas `net/http` da stdlib (com `http.ServeMux` padrão) + `pgx/v5` para Postgres. Os quatro arquivos abaixo formam um serviço pronto para rodar.

##### main.go

```go
package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	pool, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
	if err != nil {
		logger.Error("db.connect", "err", err)
		os.Exit(1)
	}
	defer pool.Close()

	repo := NewRepository(pool)
	appmax := NewAppmaxClient(AppmaxConfig{
		AuthURL:      getenv("APPMAX_AUTH_URL", "https://auth.appmax.com.br/oauth2/token"),
		APIURL:       getenv("APPMAX_API_URL", "https://api.appmax.com.br"),
		ClientID:     os.Getenv("APPMAX_APP_CLIENT_ID"),
		ClientSecret: os.Getenv("APPMAX_APP_CLIENT_SECRET"),
	})

	mux := http.NewServeMux()
	mux.HandleFunc("GET /appmax/callback", handleCallback(repo, appmax))

	srv := &http.Server{
		Addr:              ":3000",
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		logger.Info("server.start", "addr", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server.error", "err", err)
			stop()
		}
	}()

	<-ctx.Done()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = srv.Shutdown(shutdownCtx)
}

func handleCallback(repo *Repository, appmax *AppmaxClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := r.URL.Query().Get("token")
		merchantRef := r.URL.Query().Get("merchant_ref")

		if token == "" || merchantRef == "" {
			http.Error(w, "missing token or merchant_ref", http.StatusBadRequest)
			return
		}

		ctx := r.Context()
		log := slog.With("merchant_ref", merchantRef)

		// Idempotencia: se ja provisionamos esse merchant, pula a troca.
		if existing, err := repo.Find(ctx, merchantRef); err != nil {
			log.Error("repo.find", "err", err)
			http.Error(w, "internal error", http.StatusInternalServerError)
			return
		} else if existing != nil {
			http.Redirect(w, r, "/onboarding/concluido", http.StatusFound)
			return
		}

		creds, err := appmax.GenerateClient(ctx, token)
		if err != nil {
			switch {
			case errors.Is(err, ErrInvalidToken):
				log.Warn("appmax.invalid_token")
				http.Error(w, "token invalid or already consumed", http.StatusConflict)
			case errors.Is(err, ErrHealthCheckFailed):
				log.Error("appmax.health_check_failed")
				http.Error(w, "health check failed — restart the flow", http.StatusBadGateway)
			default:
				log.Error("appmax.generate", "err", err)
				http.Error(w, "failed to generate merchant credentials", http.StatusBadGateway)
			}
			return
		}

		if err := repo.Save(ctx, merchantRef, creds); err != nil {
			// Neste ponto o token da Appmax JA foi consumido. Nao ha como refazer
			// sem um novo /app/authorize — logue alto e responda 5xx.
			log.Error("repo.save", "err", err)
			http.Error(w, "failed to persist credentials", http.StatusInternalServerError)
			return
		}

		log.Info("onboarding.ok")
		http.Redirect(w, r, "/onboarding/concluido", http.StatusFound)
	}
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
```

##### appmax_client.go

```go
package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

// Erros tipados que o handler pode tratar diferente via errors.Is.
var (
	ErrInvalidToken      = errors.New("appmax: invalid or already consumed token")
	ErrHealthCheckFailed = errors.New("appmax: health check failed")
)

type AppmaxConfig struct {
	AuthURL      string
	APIURL       string
	ClientID     string
	ClientSecret string
}

type AppmaxClient struct {
	cfg  AppmaxConfig
	http *http.Client

	mu        sync.Mutex
	appToken  string
	appExpiry time.Time
}

func NewAppmaxClient(cfg AppmaxConfig) *AppmaxClient {
	return &AppmaxClient{
		cfg:  cfg,
		http: &http.Client{Timeout: 15 * time.Second},
	}
}

// MerchantCredentials e o par retornado por /app/client/generate.
type MerchantCredentials struct {
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
}

// appToken busca (ou reusa) o Bearer do APP via OAuth2 client_credentials.
// Renova 60s antes da expiracao real para evitar corrida.
func (c *AppmaxClient) appAccessToken(ctx context.Context) (string, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.appToken != "" && time.Now().Before(c.appExpiry) {
		return c.appToken, nil
	}

	form := url.Values{
		"grant_type":    {"client_credentials"},
		"client_id":     {c.cfg.ClientID},
		"client_secret": {c.cfg.ClientSecret},
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.cfg.AuthURL, strings.NewReader(form.Encode()))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := c.http.Do(req)
	if err != nil {
		return "", fmt.Errorf("auth request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("auth status %d: %s", resp.StatusCode, body)
	}

	var out struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return "", fmt.Errorf("auth decode: %w", err)
	}

	c.appToken = out.AccessToken
	c.appExpiry = time.Now().Add(time.Duration(out.ExpiresIn-60) * time.Second)
	return c.appToken, nil
}

// GenerateClient troca o token recebido no url_callback pelas credenciais
// definitivas do merchant. O corpo real aceito pela API e apenas {"token": ...} —
// app_id e external_key foram persistidos pela Appmax durante /app/authorize.
func (c *AppmaxClient) GenerateClient(ctx context.Context, token string) (*MerchantCredentials, error) {
	bearer, err := c.appAccessToken(ctx)
	if err != nil {
		return nil, err
	}

	body, _ := json.Marshal(map[string]string{"token": token})
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.cfg.APIURL+"/app/client/generate", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+bearer)

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, fmt.Errorf("generate request: %w", err)
	}
	defer resp.Body.Close()

	raw, _ := io.ReadAll(resp.Body)

	switch resp.StatusCode {
	case http.StatusOK:
		var out struct {
			Data struct {
				Client MerchantCredentials `json:"client"`
			} `json:"data"`
		}
		if err := json.Unmarshal(raw, &out); err != nil {
			return nil, fmt.Errorf("generate decode: %w", err)
		}
		return &out.Data.Client, nil
	case http.StatusUnprocessableEntity:
		// Hash invalido, expirado, ou ja consumido.
		return nil, fmt.Errorf("%w: %s", ErrInvalidToken, raw)
	case http.StatusInternalServerError:
		// Normalmente significa que o health check na URL de validacao falhou.
		return nil, fmt.Errorf("%w: %s", ErrHealthCheckFailed, raw)
	default:
		return nil, fmt.Errorf("generate status %d: %s", resp.StatusCode, raw)
	}
}
```

##### repository.go

```go
package main

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

type StoredCredentials struct {
	MerchantRef  string
	ClientID     string
	ClientSecret string
	CreatedAt    time.Time
}

// Find retorna nil, nil quando o merchant ainda nao foi provisionado.
func (r *Repository) Find(ctx context.Context, merchantRef string) (*StoredCredentials, error) {
	const q = `SELECT merchant_ref, client_id, client_secret, created_at
	           FROM merchant_credentials WHERE merchant_ref = $1`

	row := r.pool.QueryRow(ctx, q, merchantRef)
	var c StoredCredentials
	if err := row.Scan(&c.MerchantRef, &c.ClientID, &c.ClientSecret, &c.CreatedAt); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &c, nil
}

// Save e idempotente — o ON CONFLICT mantem o primeiro provisionamento bem-sucedido.
func (r *Repository) Save(ctx context.Context, merchantRef string, creds *MerchantCredentials) error {
	const q = `INSERT INTO merchant_credentials (merchant_ref, client_id, client_secret, created_at)
	           VALUES ($1, $2, $3, NOW())
	           ON CONFLICT (merchant_ref) DO NOTHING`

	_, err := r.pool.Exec(ctx, q, merchantRef, creds.ClientID, creds.ClientSecret)
	return err
}
```

##### schema.sql

```sql
CREATE TABLE merchant_credentials (
    merchant_ref   TEXT PRIMARY KEY,
    client_id      TEXT NOT NULL,
    client_secret  TEXT NOT NULL,
    external_id    UUID NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Em producao, considere criptografar client_secret em repouso (pgcrypto, KMS,
-- envelope encryption) ou guardar no cofre e manter so a referencia aqui.
```

> **Por que persistir `external_id`**
>
> Esse UUID é o **mesmo valor** que sua URL de validação devolve no health check do `/app/client/generate`. Você vai precisar dele toda vez que renderizar o checkout do merchant — é o terceiro parâmetro de `AppmaxScripts.init(...)` e o header `external-id` das chamadas da CDN. Sem persistir, você perde acesso ao identificador da instalação. Referência completa em [`external-id`](../fundamentos/external_id.md).
Para rodar:

```bash
go mod init onboarding && go mod tidy
export DATABASE_URL=postgres://user:pass@localhost:5432/onboarding
export APPMAX_APP_CLIENT_ID=...
export APPMAX_APP_CLIENT_SECRET=...
go run .
```

> **`client_secret` é credencial sensível**
>
> Em produção, criptografe o `client_secret` no banco (ex.: `pgcrypto`, KMS, envelope encryption) ou guarde em cofre (AWS Secrets Manager, Vault) e mantenha apenas a referência na tabela.
---

## 3. Consumir as credenciais do merchant

Com as credenciais persistidas, seu app transaciona em nome do merchant autenticando-se em `/oauth2/token` com o par do **merchant** (não do app). O token retornado tem escopo transacional.

```go
// merchant_token.go — obtem um Bearer do MERCHANT a partir do repositorio
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

func MerchantAccessToken(ctx context.Context, repo *Repository, merchantRef string) (string, error) {
	creds, err := repo.Find(ctx, merchantRef)
	if err != nil {
		return "", err
	}
	if creds == nil {
		return "", fmt.Errorf("merchant %q not provisioned", merchantRef)
	}

	form := url.Values{
		"grant_type":    {"client_credentials"},
		"client_id":     {creds.ClientID},
		"client_secret": {creds.ClientSecret},
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost,
		"https://auth.appmax.com.br/oauth2/token", strings.NewReader(form.Encode()))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var out struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return "", err
	}
	return out.AccessToken, nil
}
```

Daí em diante, qualquer chamada transacional (clientes, pedidos, pagamentos) usa esse token. Ver [Autenticação](../primeiros_passos/autenticacao.md) e [Exemplo completo de integração](../exemplos/integracao_completa.md).

```go
token, err := MerchantAccessToken(ctx, repo, "42")
if err != nil {
	return err
}

req, _ := http.NewRequestWithContext(ctx, http.MethodPost,
	"https://api.appmax.com.br/v1/customers", bytes.NewReader(payload))
req.Header.Set("Authorization", "Bearer "+token)
req.Header.Set("Content-Type", "application/json")

resp, err := http.DefaultClient.Do(req)
```

---

## Dicas de produção

### Idempotência

O `token` recebido no callback é **uso único** — a Appmax o apaga do cache assim que `/app/client/generate` responde com sucesso. Isso tem duas consequências:

- **Retry não funciona com o mesmo token**. Se o merchant der refresh na página ou o callback for reentregue, o segundo POST em `/app/client/generate` volta `Invalid token`.
- **Para tornar o handler idempotente**, consulte seu banco por `merchant_ref` antes de tentar trocar o token. Se já há credenciais, trate como sucesso e redirecione — foi isso que o exemplo acima faz.

### Tratamento de erro

| Situação                                            | O que fazer |
| ---------------------------------------------------- | ----------- |
| `/app/client/generate` retorna `Invalid token`       | Token já consumido ou expirado (>1h). Direcione o merchant para reiniciar a instalação, ou se seu banco já tem as credenciais, só conclua. |
| `/app/client/generate` retorna `500` (health check falhou) | Sua URL de validação não respondeu `HTTP 200` com `external_id` UUID. O token **foi** consumido — precisa refazer o `/app/authorize`. Veja [Troubleshooting](fluxo_instalacao.md#troubleshooting). |
| Timeout na chamada a `/app/client/generate`          | Não refaça a chamada com o mesmo token. Verifique no seu banco se as credenciais chegaram — se não chegaram, reinicie o fluxo. |
| Falha ao persistir no banco                          | Você tem `client_id`/`client_secret` em memória — persista antes de responder. Se o insert falhar, retorne `5xx` e não confirme ao merchant. Você vai precisar refazer o fluxo. |

### Observabilidade

- Emita métricas por etapa: `authorize_started`, `callback_received`, `credentials_generated`, `credentials_persisted`, `onboarding_failed`. Tags: `app_id`, sem PII.
- Logue `merchant_ref`, status HTTP da Appmax e mensagem de erro. **Nunca logue** `token`, `client_secret` ou o Bearer do app sem mascarar.
- Alerta quando a taxa de falha passa de um limite (ex.: >5% em 15 min) — indica quase sempre que o health check está caindo.

### Segurança

- **HTTPS obrigatório** no `url_callback`. Token em query string sobre HTTP vaza.
- **Valide `merchant_ref`** — antes de chamar `/app/client/generate`, confirme que existe uma tentativa de instalação legítima do seu lado para esse ref. Ajuda a mitigar alguém reutilizando um link de callback vazado.
- **Credenciais do app** ficam no serviço de onboarding e em lugar nenhum mais. Cofre de segredos em produção.
- **Timeout curto** na chamada a `/app/client/generate` (10–15s). Falhas demoradas travam o callback do merchant.
- **Não reutilize** o token do APP entre processos sem cache coordenado — o `expires_in` é de 1h, mas múltiplas instâncias gerando tokens em paralelo é desperdício, não problema de segurança.

### Onde executar o serviço

O handler é stateless o bastante para rodar em qualquer ambiente:

- **Container (ECS, Cloud Run, Kubernetes)** quando você já tem infra pronta.
- **Função serverless (Lambda + API Gateway, Cloud Functions)** para pagar só pelo uso. O cache em memória do token do APP ainda ajuda dentro da mesma execução, mas use um cache compartilhado (ElastiCache/Redis) se quiser economizar chamadas em `/oauth2/token`.
- **Monolito do integrador** — simplesmente adicione a rota. Funciona, só perde a separação de domínio.

## Próximos passos

- [Callback de instalação](callback_instalacao.md) — referência técnica completa do contrato do `url_callback`.
- [Instalação do aplicativo](fluxo_instalacao.md) — fluxo de 4 etapas, inclusive health check.
- [Autenticação](../primeiros_passos/autenticacao.md) — diferença entre credenciais do app e do merchant.
- [Exemplo completo de integração](../exemplos/integracao_completa.md) — primeira transação depois que as credenciais estão provisionadas.

## Veja Também

- [Index Master](../index_master.md)
- [Criar Aplicativo](criar_aplicativo.md)
- [Validar Url Instalacao](validar_url_instalacao.md)
- [Implementar Url Validacao](implementar_url_validacao.md)
