---
title: "Erros, Rate Limits (RPM/TPM), Headers e Retries Resilientes"
description: "Guia completo de tratamento de erros e gestão de concorrência na OpenAI API. Códigos HTTP (400, 401, 403, 404, 429, 500, 503), headers de controle de taxa (x-ratelimit-*), tiers de organização (Free a Tier 5), algoritmo de Exponential Backoff com Full Jitter e padrões de retry nos SDKs Python e TypeScript."
topics: ["erros", "rate-limits", "retries", "exponential-backoff", "http-status", "resiliencia", "x-ratelimit-headers"]
keywords: ["429 Too Many Requests", "RateLimitError", "APIConnectionError", "x-ratelimit-remaining-requests", "x-ratelimit-reset-tokens", "exponential backoff", "jitter"]
source_scope: "OpenAI API Docs: Guides > Rate Limits, Error Codes & Production Best Practices"
---

# Erros, Rate Limits (RPM/TPM), Headers e Retries Resilientes

A estabilidade de aplicações em produção que utilizam a OpenAI API depende de uma estratégia robusta de tratamento de erros HTTP, monitoramento ativo de limites de taxa e implementação de políticas idempotentes de retry com *Exponential Backoff*.

---

## 1. Catálogo de Códigos de Erro HTTP

| Código HTTP | Tipo de Erro | Causa Mais Comum | Solução Recomendada |
| :--- | :--- | :--- | :--- |
| **400** | `invalid_request_error` | Payload JSON malformado, parâmetros incompatíveis ou esquemas estritos inválidos. | Validar parâmetros de entrada e aderência ao schema. |
| **401** | `authentication_error` | Chave de API ausente, incorreta ou revogada. | Verificar `OPENAI_API_KEY` e permissões da chave. |
| **403** | `permission_denied` | A chave de API não possui acesso ao recurso, projeto ou endpoint solicitado. | Verificar restrições de projeto e permissões da conta. |
| **404** | `invalid_request_error` | Modelo inexistente ou ID de recurso (Thread, Assistant, File) incorreto. | Confirmar o nome exato do modelo no `/v1/models`. |
| **422** | `unprocessable_entity` | Falha de validação estrutural no corpo da requisição. | Ajustar formato dos dados enviados. |
| **429** | `rate_limit_exceeded` / `insufficient_quota` | **Rate Limit:** Excedeu RPM (req/min), TPM (tokens/min) ou TPD (tokens/dia).<br>**Quota:** Sem saldo financeiro ou limite mensal atingido. | Aplicar Exponential Backoff ou recarregar créditos de faturamento. |
| **500** | `internal_server_error` | Erro temporário nos servidores da OpenAI. | Tentar novamente com retry após breve intervalo. |
| **503** | `engine_overloaded` | Alta carga ou indisponibilidade temporária de nós de inferência. | Aguardar com backoff e chavear para fallback se persistir. |

---

## 2. Cabeçalhos HTTP de Rate Limit (`x-ratelimit-*`)

A OpenAI retorna o estado atual das cotas em todas as respostas HTTP:

| Cabeçalho HTTP | Descrição |
| :--- | :--- |
| `x-ratelimit-limit-requests` | Limite máximo de requisições permitidas por minuto (RPM). |
| `x-ratelimit-remaining-requests` | Quantidade de requisições restantes na janela de 1 minuto atual. |
| `x-ratelimit-reset-requests` | Tempo restante para o reset da cota de requisições (ex: `120ms`, `5s`). |
| `x-ratelimit-limit-tokens` | Limite máximo de tokens permitidos por minuto (TPM). |
| `x-ratelimit-remaining-tokens` | Quantidade de tokens restantes na janela de 1 minuto atual. |
| `x-ratelimit-reset-tokens` | Tempo restante para o reset da cota de tokens (ex: `1.5s`). |

---

## 3. Tiers de Uso Organizacionais (*Usage Tiers*)

Os limites de RPM e TPM aumentam automaticamente conforme o histórico financeiro e pagamentos da organização:

| Tier | Critério de Elegibilidade | Limite Típico GPT-4o (TPM) | Limite Típico GPT-4o (RPM) |
| :--- | :--- | :--- | :--- |
| **Free** | Usuários sem cartão de crédito cadastrado | 10.000 TPM | 3 RPM |
| **Tier 1** | Pagamento inicial de US$ 5 | 30.000 TPM | 500 RPM |
| **Tier 2** | Pagamento cumulativo >= US$ 50 + 7 dias de conta | 450.000 TPM | 5.000 RPM |
| **Tier 3** | Pagamento cumulativo >= US$ 100 + 7 dias de conta | 800.000 TPM | 5.000 RPM |
| **Tier 4** | Pagamento cumulativo >= US$ 250 + 14 dias de conta | 2.000.000 TPM | 10.000 RPM |
| **Tier 5** | Pagamento cumulativo >= US$ 1.000 + 30 dias de conta | 10.000.000+ TPM | 10.000+ RPM |

---

## 4. Algoritmo de Exponential Backoff com Full Jitter

O algoritmo de *Exponential Backoff com Full Jitter* previne o efeito de manada (*Thundering Herd Problem*) distribuindo os retries aleatoriamente.

$$	ext{sleep} = 	ext{random\_uniform}(0, \min(	ext{cap}, 	ext{base} 	imes 2^{	ext{tentativa}}))$$

### 4.1. Implementação Robusta em Python

```python
import time
import random
from openai import OpenAI, RateLimitError, APIConnectionError, InternalServerError

client = OpenAI(max_retries=0) # Desativa retry padrão para controle manual total

def chamar_openai_com_resiliencia(prompt: str, max_tentativas: int = 5) -> str:
    base_delay = 1.0
    max_delay = 32.0

    for tentativa in range(max_tentativas):
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                timeout=15.0
            )
            return response.choices[0].message.content

        except (RateLimitError, APIConnectionError, InternalServerError) as e:
            if tentativa == max_tentativas - 1:
                print(f"Tentativas esgotadas ({max_tentativas}). Falha final: {e}")
                raise e

            # Cálculo do Exponential Backoff com Full Jitter
            delay_calculado = min(max_delay, base_delay * (2 ** tentativa))
            jitter_delay = random.uniform(0.5, 1.0) * delay_calculado

            print(f"[Aviso] Erro transitório ({type(e).__name__}). Aguardando {jitter_delay:.2f}s (Tentativa {tentativa + 1}/{max_tentativas})...")
            time.sleep(jitter_delay)

# Teste da chamada resiliente
resultado = chamar_openai_com_resiliencia("Resuma as vantagens do padrão circuit breaker em 1 linha.")
print("Resultado:", resultado)
```

---

## 5. Configuração de Retries nos SDKs Oficiais

### 5.1. Python SDK Nativo
O SDK oficial já inclui retries automáticos integrados:

```python
from openai import OpenAI

client = OpenAI(
    max_retries=3, # Tenta até 3 vezes automaticamente em erros 429 e 5xx
    timeout=20.0
)
```

### 5.2. TypeScript / Node.js SDK Nativo

```typescript
import OpenAI, { RateLimitError, APIConnectionError } from 'openai';

const openai = new OpenAI({
  maxRetries: 3,
  timeout: 20 * 1000,
});

async function executarComRetry() {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Olá!' }],
    });
    console.log(res.choices[0]?.message.content);
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.error('Limite de requisições excedido ou falta de créditos!');
    } else if (error instanceof APIConnectionError) {
      console.error('Falha de conexão com a OpenAI.');
    } else {
      console.error('Erro desconhecido:', error);
    }
  }
}
```
