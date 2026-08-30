---
title: Compatibilidade com o SDK da OpenAI
description: Como utilizar os clientes oficiais da OpenAI em Python e TypeScript para chamar os modelos Claude na infraestrutura da Anthropic.
topics:
  - openai-compatibility
  - interoperabilidade
  - base-url
keywords:
  - openai sdk
  - baseURL
  - migration
  - compatibility layer
related:
  - sdks_e_bibliotecas/sdk_python.md
  - sdks_e_bibliotecas/sdk_typescript.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/libraries/openai-sdk
---

# Compatibilidade com o SDK da OpenAI

Para simplificar a adoção e evitar refatorações em bases de código existentes que já utilizam as bibliotecas clientes da OpenAI, a Anthropic oferece compatibilidade direta através de cabeçalhos e roteamento de baseURL.

---

## Como Funciona

Você pode instanciar o cliente padrão da OpenAI apontando a `base_url` para o gateway compatível da Anthropic e enviando a sua chave `ANTHROPIC_API_KEY`.

---

## Exemplo em Python (OpenAI Client)

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
    base_url="https://api.anthropic.com/v1"
)

# Nota: Ao usar a Claude API diretamente via Messages API, 
# utilize os nomes dos modelos Claude correspondentes
response = client.chat.completions.create(
    model="claude-3-7-sonnet-20250219",
    messages=[
        {"role": "system", "content": "Você é um assistente técnico prestativo."},
        {"role": "user", "content": "Explique o Teorema CAP de forma resumida."}
    ]
)

print(response.choices[0].message.content)
```

---

## Exemplo em TypeScript / JavaScript (OpenAI Node SDK)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://api.anthropic.com/v1',
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'claude-3-7-sonnet-20250219',
    messages: [
      { role: 'system', content: 'Você é um assistente técnico.' },
      { role: 'user', content: 'Explique a diferença entre gRPC e REST.' },
    ],
  });

  console.log(completion.choices[0].message.content);
}

main();
```

---

## Diferenças e Recursos Nativos Recomendados

Embora a camada de compatibilidade seja útil para migrações rápidas, os **SDKs nativos da Anthropic (`anthropic` e `@anthropic-ai/sdk`) são altamente recomendados** para usufruir de recursos exclusivos da Claude Platform:
1. **Prompt Caching** nativo com blocos `cache_control`.
2. **Extended Thinking** (`budget_tokens`).
3. **Computer Use**, **Bash Tool** e ferramentas integradas.
4. **Message Batches API** com 50% de desconto.
5. **Contagem exata de tokens** com `messages/count_tokens`.

---

## Veja Também

- [`../sdks_e_bibliotecas/sdk_python.md`](../sdks_e_bibliotecas/sdk_python.md)
- [`../sdks_e_bibliotecas/sdk_typescript.md`](../sdks_e_bibliotecas/sdk_typescript.md)
