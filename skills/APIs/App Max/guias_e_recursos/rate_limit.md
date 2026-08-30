---
title: "Rate Limit e Throttling"
description: "Limites de requisições por minuto e hora na API Appmax, cabeçalhos de resposta HTTP 429 e estratégias de retry com backoff."
topics:
  - rate-limit
  - throttling
  - http-429
  - retry-after
  - backoff-exponencial
keywords:
  - rate limit
  - 429 Too Many Requests
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - backoff
related:
  - ../index_master.md
  - webhooks.md
  - calculo_parcelas.md
  - recuperacao_vendas_ia.md
source_scope:
  - https://docs.appmax.com.br/guides/rate-limit
---

# Rate Limit

## Visão geral

A API da Appmax aplica limites de requisições em dois níveis para garantir estabilidade e disponibilidade para todos os integradores. Sua requisição precisa passar por ambos para ser processada.

## Níveis de controle

### Nível 1 — Limite por credencial

Aplicado por `client_id` do merchant. Controla a taxa e o volume total de requisições.

| Métrica | Limite | Descrição |
| ------- | ------ | --------- |
| **Burst** | 50 requisições | Máximo de requisições simultâneas (pico instantâneo) |
| **Rate** | 5 requisições/segundo | Taxa sustentada de requisições |
| **Quota mensal** | 100.000 requisições/mês | Total de requisições por mês (reseta no dia 1) |

### Nível 2 — Limite por rota

Aplicado por **email + IP de origem**. Controla o uso de rotas individuais.

| Tipo de rota | Limite | Janela |
| ------------ | ------ | ------ |
| Rotas transacionais (padrão) | 60 requisições | 1 minuto |
| Operações sensíveis (login, credenciais) | 5 requisições | 1 minuto |

> **Na prática, você pode fazer um burst de até 50 requisições instantâneas, e depois manter uma taxa sustentada de 5 requisições por segundo sem ser limitado. Se o limite for excedido, a requisição é rejeitada com `429`.**
>
>
### Quota mensal

Além do rate limit por segundo, há um limite mensal de **100.000 requisições** por `client_id`:

- O contador é incrementado a cada requisição
- Reseta automaticamente no primeiro dia de cada mês

> **Quando a quota mensal é excedida, todas as requisições são bloqueadas com `429` até o próximo mês.**
>
>
> **Os limites existem para garantir a segurança e estabilidade da plataforma, mas são totalmente flexíveis. Se a sua integração precisa de limites maiores, entre em contato com o nosso time — ajustamos conforme a sua necessidade.**
>
>
## Resposta de rate limit

Quando o limite é excedido, a API retorna status **HTTP 429** com headers informativos:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
Retry-After: 45
```

```json
{
  "message": "Too many requests",
  "retryAfter": "45(s)"
}
```

| Header | Descrição |
| ------ | --------- |
| `X-RateLimit-Limit` | Número máximo de requisições permitidas na janela |
| `X-RateLimit-Remaining` | Requisições restantes na janela atual |
| `Retry-After` | Segundos até poder tentar novamente |

## Boas práticas

1. **Implemente retry com backoff exponencial.** Ao receber `429`, aguarde o tempo indicado no header `Retry-After`. Se não houver header, use backoff exponencial (1s, 2s, 4s, 8s...).

2. **Use filas para operações em lote.** Se precisa criar muitos pedidos ou clientes, enfileire as requisições e processe respeitando o rate de 5 req/s.

3. **Cache o token Bearer.** O token dura 1 hora. Reutilize-o em vez de gerar um novo a cada requisição — a autenticação também consome quota.

4. **Monitore os headers de rate limit.** Use `X-RateLimit-Remaining` para ajustar a velocidade antes de atingir o limite.

5. **Agrupe operações quando possível.** Prefira criar cliente + pedido em sequência rápida em vez de múltiplas chamadas distribuídas.

## Exemplo de retry com backoff

##### Go

```go
func requestWithRetry(client *http.Client, req *http.Request) (*http.Response, error) {
	maxRetries := 3

	for attempt := 0; attempt <= maxRetries; attempt++ {
		resp, err := client.Do(req)
		if err != nil {
			return nil, err
		}

		if resp.StatusCode != http.StatusTooManyRequests {
			return resp, nil
		}
		resp.Body.Close()

		retryAfter := resp.Header.Get("Retry-After")
		wait, _ := strconv.Atoi(retryAfter)
		if wait == 0 {
			wait = 1 << attempt // backoff: 1s, 2s, 4s
		}

		log.Printf("Rate limited, retrying in %ds (attempt %d/%d)", wait, attempt+1, maxRetries)
		time.Sleep(time.Duration(wait) * time.Second)
	}

	return nil, fmt.Errorf("rate limit exceeded after %d retries", maxRetries)
}
```

##### Node.js

```javascript
async function requestWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);

    if (response.status !== 429) {
      return response;
    }

    const retryAfter = response.headers.get('Retry-After');
    const wait = retryAfter ? parseInt(retryAfter) : Math.pow(2, attempt);

    console.log(`Rate limited, retrying in ${wait}s (attempt ${attempt + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, wait * 1000));
  }

  throw new Error(`Rate limit exceeded after ${maxRetries} retries`);
}
```

##### Python

```python
import time
import requests

def request_with_retry(method, url, max_retries=3, **kwargs):
    for attempt in range(max_retries + 1):
        response = requests.request(method, url, **kwargs)

        if response.status_code != 429:
            return response

        retry_after = response.headers.get('Retry-After')
        wait = int(retry_after) if retry_after else 2 ** attempt

        print(f"Rate limited, retrying in {wait}s (attempt {attempt + 1}/{max_retries})")
        time.sleep(wait)

    raise Exception(f"Rate limit exceeded after {max_retries} retries")
```

##### PHP

```php
function requestWithRetry(string $method, string $url, array $options, int $maxRetries = 3): Response
{
    $client = new \GuzzleHttp\Client();

    for ($attempt = 0; $attempt <= $maxRetries; $attempt++) {
        $response = $client->request($method, $url, $options + [
            'http_errors' => false,
        ]);

        if ($response->getStatusCode() !== 429) {
            return $response;
        }

        $retryAfter = $response->getHeader('Retry-After')[0] ?? null;
        $wait = $retryAfter ? (int) $retryAfter : pow(2, $attempt);

        Log::warning("Rate limited, retrying in {$wait}s (attempt " . ($attempt + 1) . "/{$maxRetries})");
        sleep($wait);
    }

    throw new \Exception("Rate limit exceeded after {$maxRetries} retries");
}
```

## Veja Também

- [Index Master](../index_master.md)
- [Webhooks](webhooks.md)
- [Calculo Parcelas](calculo_parcelas.md)
- [Recuperacao Vendas Ia](recuperacao_vendas_ia.md)
