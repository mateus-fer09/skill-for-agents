---
title: "Implementação da URL de Validação (Health Check)"
description: "Como construir o endpoint do servidor para responder ao health check da Appmax com exemplos em Go, Node.js e PHP."
topics:
  - implementacao
  - health-check
  - url-validacao
  - exemplos-servidor
keywords:
  - implementar url validacao
  - go
  - nodejs
  - php
  - express
  - json response
  - status ok
related:
  - ../index_master.md
  - criar_aplicativo.md
  - validar_url_instalacao.md
  - fluxo_instalacao.md
source_scope:
  - https://docs.appmax.com.br/guides/implementar-url-validacao
---

# Implementar a URL de validação

> **Antes de começar — você está implementando, não chamando**
>
> A **URL de validação** é um endpoint que **você cria no seu próprio servidor**. A Appmax **chama esse endpoint** durante a instalação (`POST /app/client/generate`) — você **não chama nada da Appmax aqui**.
>
> Se você está tentando descobrir qual endpoint da Appmax invocar para "validar a URL", está no caminho errado. O que existe é:
>
> - A Appmax envia um `POST` para a sua URL com um payload conhecido.
> - Você responde com `HTTP 200` e um JSON contendo `external_id` (UUID v4 gerado por você).
>
> Para **testar** o endpoint depois de implementado, use a ferramenta interativa em [Validar URL de instalação](validar_url_instalacao.md).
Este guia entrega o handler pronto para rodar em Go, Node.js e PHP. Copie, ajuste a rota e cadastre a URL pública no painel do aplicativo.

## Contrato

A Appmax executa **uma única chamada** server-to-server contra a URL de validação cadastrada no painel, dentro do processamento de [`POST /app/client/generate`](fluxo_instalacao.md#health-check). Sua URL precisa atender ao contrato abaixo exatamente.

### Request — o que a Appmax envia para você

| Item | Valor |
| ---- | ----- |
| Método | `POST` |
| Content-Type | `application/json` |
| Corpo | JSON com os campos abaixo — **somente `app_id` é garantido**; os demais são opcionais |

```json
{
  "app_id": 123,
  "client_id": "MERCHANT_CLIENT_ID",
  "client_secret": "MERCHANT_CLIENT_SECRET",
  "client_key": "EXTERNAL_KEY",
  "external_key": "EXTERNAL_KEY"
}
```

| Campo | Tipo | Obrigatório | Descrição |
| ----- | ---- | ----------- | --------- |
| `app_id` | integer | Sim | **App Numerical ID** do aplicativo (ID numérico, ex.: `123`) — **não é o UUID**. Único campo sempre presente. |
| `client_id` | string | Não | Client ID gerado para o merchant nessa instalação. Pode não ser enviado. |
| `client_secret` | string | Não | Client Secret gerado para o merchant nessa instalação. Pode não ser enviado. |
| `client_key` | string | Não | Mesmo valor de `external_key` (mantido por compatibilidade). Pode não ser enviado. |
| `external_key` | string | Não | Chave fornecida pelo merchant na criação da instalação (`store_id`, `merchant_id` etc.). Pode não ser enviada. |

> **Seu handler deve validar apenas a presença do `app_id` — os demais campos são **opcionais** e a ausência deles não deve ser tratada como erro. Lembre que o `app_id` chega como **Numerical ID** (numérico), não como UUID.**
>
>
### Response — o que você precisa devolver

| Item | Valor |
| ---- | ----- |
| Status HTTP | `200` (exatamente — `201`, `204` e `2xx` em geral **não** valem) |
| Content-Type | `application/json` |
| Corpo | JSON com `external_id` (obrigatório) e `alias` (opcional) |

```json
{
  "external_id": "37bb0791-ee0b-457d-860c-186e32978bcd",
  "alias": "Minha Loja"
}
```

| Campo | Tipo | Obrigatório | Descrição |
| ----- | ---- | ----------- | --------- |
| `external_id` | string (UUID v1-v5) | Sim | UUID **gerado por você**, **único por instalação**. A Appmax persiste esse valor e o devolve depois como header `external-id` em chamadas do front via CDN. |
| `alias` | string | Não | Nome de exibição da loja na Appmax. Se omitido, a Appmax usa o nome padrão. |

> **Falhas que abortam a instalação**
>
> Se sua URL responder com status diferente de `200`, sem JSON parseável, ou sem um `external_id` em formato UUID válido, o passo `POST /app/client/generate` retorna `500` e **nenhuma credencial de merchant é emitida**. Detalhes em [Instalação — health check](fluxo_instalacao.md#health-check).
## Implementação

Os exemplos abaixo são handlers mínimos que cumprem o contrato. Em produção, antes de responder `200`, persista a tripla `external_key` → `client_id`/`client_secret` → `external_id` no seu banco (veja a seção [Persistência](#persistencia)).

##### Go

Dependência mínima — só `net/http` da stdlib + `github.com/google/uuid` para gerar UUID v4.

```bash
go mod init meu-app
go get github.com/google/uuid
```

```go
package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
)

type request struct {
	AppID        int64  `json:"app_id"`
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	ClientKey    string `json:"client_key"`
	ExternalKey  string `json:"external_key"`
}

type response struct {
	ExternalID string `json:"external_id"`
	Alias      string `json:"alias,omitempty"`
}

func validationHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", "POST")
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if req.AppID == 0 {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}

	// Em produção: persistir req.ClientID, req.ClientSecret e externalID
	// vinculados a req.ExternalKey no seu banco antes de responder.
	externalID := uuid.New().String()

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(response{ExternalID: externalID})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/appmax/validate", validationHandler)

	log.Println("escutando em :8080 — POST /appmax/validate")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}
```

##### Node.js

Dependência mínima — Express + `crypto.randomUUID` da stdlib.

```bash
npm init -y
npm install express
```

```js
import express from 'express'
import crypto from 'node:crypto'

const app = express()
app.use(express.json())

app.post('/appmax/validate', (req, res) => {
  const { app_id, client_id, client_secret, client_key, external_key } = req.body ?? {}

  if (!app_id) {
    return res.status(400).json({ error: 'invalid payload' })
  }

  // Em produção: persistir client_id, client_secret e externalId
  // vinculados a external_key no seu banco antes de responder.
  const externalId = crypto.randomUUID()

  res.status(200).json({ external_id: externalId })
})

app.listen(3000, () => {
  console.log('escutando em :3000 — POST /appmax/validate')
})
```

##### PHP

Sem framework — `json_decode` direto do `php://input` e UUID v4 gerado com `random_bytes`.

```php
<?php
declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body) || empty($body['app_id'])) {
    http_response_code(400);
    exit;
}

function uuidV4(): string {
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

// Em produção: persistir client_id, client_secret e externalId
// vinculados a external_key no seu banco antes de responder.
$externalId = uuidV4();

header('Content-Type: application/json; charset=utf-8');
http_response_code(200);
echo json_encode(['external_id' => $externalId], JSON_THROW_ON_ERROR);
```

## Persistência
O `external_id` **não é descartável**. Ele volta como header `external-id` em toda chamada do front via CDN (tokenização, Apple Pay). **Gere um UUID novo a cada requisição do health check** — a Appmax rejeita valores repetidos: se o `external_id` recebido já existir na base, ele é descartado e substituído automaticamente pelo `client_id` da instalação. Persista no momento em que gerar e, se o health check for refeito para a mesma loja, guarde sempre o **último** valor devolvido e descarte o anterior.

A estrutura mínima de persistência é:

| Coluna | Origem | Uso |
| ------ | ------ | --- |
| `external_key` | recebida no payload | Vincula a linha ao merchant da plataforma. |
| `client_id` | recebida no payload | Credencial usada depois nas chamadas server-to-server. |
| `client_secret` | recebida no payload | Credencial usada depois nas chamadas server-to-server. |
| `external_id` | **gerada por você** | Devolvida no response e reutilizada como header `external-id` no front. |
| `alias` | opcional | Nome de exibição. |

Para um exemplo completo de serviço (callback + health check + Postgres) que monta isso de ponta a ponta, veja [Automatizar a criação de credenciais](automacao_credenciais.md). Para o ciclo de vida do `external_id` depois da instalação, veja [`external-id`](../fundamentos/external_id.md).

## Cadastrar a URL no painel

Depois de subir o handler em uma URL pública, abra **Consultar Aplicativo → Desenvolver** e preencha o campo **URL de validação** com a URL completa (incluindo o caminho do endpoint, ex.: `https://onboarding.meuapp.com/appmax/validate`). Detalhes dos demais campos do painel em [Identificadores e URLs do aplicativo](../fundamentos/identificadores_do_app.md).

Antes de submeter para homologação ou iniciar uma instalação real, valide o handler em [Validar URL de instalação](validar_url_instalacao.md) — a ferramenta faz duas chamadas com `external_key` distintos e mostra os dois UUIDs lado a lado para garantir que você não está devolvendo um valor hardcoded.

## Limitações comuns

- **`localhost` não funciona** — a Appmax não alcança redes privadas. Em dev, use [ngrok](https://ngrok.com), [beeceptor](https://beeceptor.com) ou similar e cadastre a URL pública gerada.
- **HTTPS é obrigatório em produção** — em produção a Appmax só chama URLs `https://`. Em sandbox a ferramenta de validação aceita HTTP, mas evite essa configuração.
- **Sem follow de redirects** — o health check não segue `301`/`302`. Se sua URL redireciona (ex.: barra final, subdomínio canônico), responda no destino direto e cadastre essa URL no painel.
- **Timeout curto** — responda em menos de 5 segundos. Lógica pesada (sincronização com terceiros, e-mail de boas-vindas) precisa ir para uma fila assíncrona depois do `200`.
- **Status HTTP precisa ser exatamente `200`** — `201`, `202` e `204` falham a instalação.
- **`external_id` precisa ser único por instalação** — não retorne um UUID hardcoded. A ferramenta de validação detecta isso e marca como falha.

## Veja também

- [Instalação do aplicativo — health check](fluxo_instalacao.md#health-check) — fluxo completo onde a URL é chamada.
- [Validar URL de instalação](validar_url_instalacao.md) — ferramenta interativa para testar o contrato.
- [`external-id`](../fundamentos/external_id.md) — ciclo de vida do UUID que você devolve aqui.
- [Automatizar a criação de credenciais](automacao_credenciais.md) — exemplo completo com callback + persistência em Postgres.
- [Identificadores e URLs do aplicativo](../fundamentos/identificadores_do_app.md) — referência dos campos do painel.

## Veja Também

- [Index Master](../index_master.md)
- [Criar Aplicativo](criar_aplicativo.md)
- [Validar Url Instalacao](validar_url_instalacao.md)
- [Fluxo Instalacao](fluxo_instalacao.md)
