---
title: Erros HTTP, Rate Limits e Guia de Troubleshooting
description: Diagnóstico detalhado de códigos de status HTTP (400, 401, 403, 404, 429, 500, 503), headers de cota RPM/TPM e padrões de resiliência com Exponential Backoff.
---

# Erros HTTP, Rate Limits e Guia de Troubleshooting

## 1. Tabela de Códigos de Status HTTP e Diagnóstico

| Código HTTP | Status RPC | Causa Raiz | Ação Recomendada |
| :---: | :--- | :--- | :--- |
| **`400`** | `INVALID_ARGUMENT` | Payload JSON malformado, Schema inválido ou parâmetro fora da faixa permitida. | Valide o JSON Schema e verifique se `temperature` está entre `0.0` e `2.0`. |
| **`401`** | `UNAUTHENTICATED` | Chave de API ausente ou inválida. | Verifique se a variável `GEMINI_API_KEY` está configurada corretamente no ambiente. |
| **`403`** | `PERMISSION_DENIED` | Chave de API sem permissões para a Generative Language API ou restrição de IP violada. | Verifique as restrições da chave no console do Google Cloud e faturamento do projeto. |
| **`404`** | `NOT_FOUND` | Modelo inexistente (`model`), arquivo da Files API expirado ou Cache deletado. | Verifique o ID exato do modelo (ex: `gemini-2.0-flash`) e se o arquivo não expirou (48h). |
| **`429`** | `RESOURCE_EXHAUSTED` | Limite de taxa de Requisições Por Minuto (RPM) ou Tokens Por Minuto (TPM) excedido. | Implemente **Exponential Backoff com Jitter** ou solicite aumento de cota. |
| **`500`** | `INTERNAL` | Erro transitório interno nos servidores do Google. | Tente novamente após um breve intervalo usando retentativa exponencial. |
| **`503`** | `UNAVAILABLE` | Servidor temporariamente sobrecarregado. | Aguarde alguns segundos e repita a requisição. |

---

## 2. Cotas e Tiers da Gemini API

```text
┌────────────────────────────────────────────────────────┐
│                   TIER GRATUITO (Free)                 │
│  - Até 15 RPM (Requisições Por Minuto)                 │
│  - Até 1.000.000 TPM (Tokens Por Minuto)               │
│  - Até 1.500 RPD (Requisições Por Dia)                 │
│  - Ideal para desenvolvimento, testes e protótipos     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                TIER PAGO (Pay-as-you-go)               │
│  - Até 2.000+ RPM                                      │
│  - Até 4.000.000+ TPM                                  │
│  - Sem limite diário rígido de requisições             │
│  - Requer projeto GCP com faturamento ativado          │
└────────────────────────────────────────────────────────┘
```

---

## 3. Padrão de Resiliência: Exponential Backoff com Jitter

Para ambientes de produção, envolva as chamadas em retentativas com recuo exponencial aleatorizado (*jitter*):

### 3.1. Implementação em Python
```python
import time
import random
from google import genai
from google.genai.errors import APIError

client = genai.Client()

def generate_with_retry(prompt: str, max_retries: int = 5) -> str:
    delay = 1.0
    for attempt in range(1, max_retries + 1):
        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            return response.text
        except APIError as e:
            if e.code in [429, 500, 503] and attempt < max_retries:
                # Jitter aleatório entre 0.8x e 1.2x do delay
                sleep_time = delay * (1 + random.uniform(-0.2, 0.2))
                print(f"[Aviso]: Erro {e.code}. Tentativa {attempt}/{max_retries}. Aguardando {sleep_time:.2f}s...")
                time.sleep(sleep_time)
                delay *= 2.0 # Recuo exponencial dobrando o intervalo
            else:
                raise e
    raise RuntimeError("Falha após atingir o número máximo de retentativas.")
```

### 3.2. Implementação em TypeScript
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function generateWithRetry(prompt: string, maxRetries = 5): Promise<string> {
  let delay = 1000;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      return response.text || '';
    } catch (err: any) {
      const status = err?.status || err?.code;
      if ([429, 500, 503].includes(status) && attempt < maxRetries) {
        const jitter = delay * (1 + (Math.random() * 0.4 - 0.2));
        console.warn(`[Aviso]: Status ${status}. Tentativa ${attempt}/${maxRetries}. Aguardando ${Math.round(jitter)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, jitter));
        delay *= 2;
      } else {
        throw err;
      }
    }
  }
  throw new Error('Falha após atingir o número máximo de tentativas.');
}
```

---

## 4. Checklist de Diagnóstico Rápido

1. **Sua chave `GEMINI_API_KEY` está ativa?** Teste com um cURL básico no modelo `gemini-2.0-flash`.
2. **O modelo chamado existe no catálogo?** Verifique a ortografia exata (ex: `gemini-2.0-flash`, e não `gemini-2.0-flash-001` incorreto).
3. **Seu payload excedeu 20MB?** Se sim, use a `Files API` (`client.files.upload()`) em vez de inline base64.
4. **O vídeo ou áudio enviado ainda está em `PROCESSING`?** Implemente o loop de polling verificando se `state == 'ACTIVE'`.
5. **O Context Cache expirou?** Lembre-se de que caches têm TTL configurável e são deletados automaticamente após o prazo.
