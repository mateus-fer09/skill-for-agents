---
title: SDKs Oficiais e OpenAI CLI
description: Guia de instalação, inicialização, tratamento de erros e uso dos SDKs oficiais em Python e TypeScript/Node.js, além da CLI oficial da OpenAI.
topics:
  - sdks
  - python-sdk
  - node-sdk
  - openai-cli
  - configuration
keywords:
  - openai
  - pip install openai
  - npm install openai
  - openai cli
  - OpenAI client
related:
  - ../fundamentos/overview_e_arquitetura.md
  - ../responses_api/introducao_e_quickstart.md
source_scope:
  - https://developers.openai.com/api/docs/libraries.md
  - https://developers.openai.com/api/docs/libraries/openai-cli.md
---

# SDKs Oficiais e OpenAI CLI

A OpenAI mantém SDKs oficiais para Python e TypeScript/Node.js, gerados com tipagem estrita e suporte completo à Responses API, streaming, tools e Assistants.

---

## 1. SDK Python (`openai`)

### Instalação

```bash
pip install openai
```

### Inicialização e Configuração

```python
from openai import OpenAI, AsyncOpenAI
import os

# Cliente síncrono padrão
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
    organization=os.environ.get("OPENAI_ORG_ID"),     # Opcional
    project=os.environ.get("OPENAI_PROJECT_ID"),       # Opcional
    timeout=30.0,                                      # Timeout em segundos
    max_retries=3                                      # Número de retentativas automáticas
)

# Cliente assíncrono para asyncio / FastAPI
async_client = AsyncOpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)
```

### Exemplo Básico com Responses API

```python
response = client.responses.create(
    model="gpt-5.6",
    input="Liste 3 vantagens do uso de TypeScript."
)

print(response.output_text)
```

---

## 2. SDK TypeScript / JavaScript (`openai`)

### Instalação

```bash
npm install openai
# ou
pnpm add openai
# ou
yarn add openai
```

### Inicialização e Uso

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
  maxRetries: 3,
  timeout: 30000, // 30 segundos
});

async function main() {
  const response = await openai.responses.create({
    model: "gpt-5.6",
    input: "Qual a diferença entre REST e GraphQL?",
  });

  console.log(response.output_text);
}

main();
```

---

## 3. OpenAI CLI (`openai`)

A CLI oficial da OpenAI permite realizar chamadas de API, testar modelos, gerenciar arquivos, disparar fine-tuning e avaliar respostas diretamente do terminal.

### Instalação

A CLI é instalada automaticamente junto com o pacote Python:

```bash
pip install --upgrade openai
```

### Comandos Principais

```bash
# Testar Responses API diretamente
openai api responses.create -m gpt-5.6 -i "Explique computação quântica em 1 frase."

# Listar modelos disponíveis
openai api models.list

# Upload de arquivo para Fine-Tuning ou Vector Store
openai api files.create -f dataset.jsonl -p fine-tune

# Listar arquivos carregados
openai api files.list

# Disparar um job de Fine-Tuning
openai api fine_tuning.jobs.create -t file-abc123xyz -m gpt-4.1-mini-2025-04-14
```

---

## 4. Tratamento de Erros nos SDKs

Os SDKs fornecem classes de exceção estruturadas:

```python
import openai
from openai import OpenAI

client = OpenAI()

try:
    response = client.responses.create(
        model="gpt-5.6",
        input="Olá!"
    )
except openai.APIConnectionError as e:
    print(f"Erro de conexão com o servidor da OpenAI: {e.__cause__}")
except openai.RateLimitError as e:
    print(f"Rate limit atingido (código 429): {e}")
except openai.APIStatusError as e:
    print(f"Erro de status HTTP retornado: {e.status_code} - {e.response}")
```

---

## 5. Referências Cruzadas

- [`../fundamentos/overview_e_arquitetura.md`](../fundamentos/overview_e_arquitetura.md)
- [`../fundamentos/rate_limits_e_custos.md`](../fundamentos/rate_limits_e_custos.md)
- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
