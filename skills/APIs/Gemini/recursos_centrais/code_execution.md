---
title: Code Execution Sandbox — Execução Segura de Código Python
description: Guia completo para ativação do ambiente sandbox de execução de código Python embutido no Gemini para cálculos exatos, processamento de dados e simulações matemáticas.
---

# Code Execution Sandbox — Execução Segura de Código Python

## 1. Visão Geral do Code Execution

A ferramenta **Code Execution** permite que o modelo gere e execute código Python em um ambiente seguro e isolado (*sandbox*) durante o processo de geração. O modelo observa a saída padrão (`stdout`) ou mensagens de erro do script e utiliza esses resultados para compor sua resposta final com precisão matemática estrita.

```text
┌────────────────────────────────────────────────────────┐
│  Usuário faz pergunta matemática / cálculo analítico   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│       Gemini gera código Python embutido               │
│       ```python                                        │
│       import numpy as np                               │
│       ...                                              │
│       print(resultado)                                 │
│       ```                                              │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│       Sandbox do Google executa o script Python        │
│       (Captura stdout, stderr, variáveis)              │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│       Gemini formula resposta com cálculo 100% exato   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Ativação da Ferramenta

### 2.1. Python (`google-genai`)
```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Calcule a soma dos primeiros 100 números primos e me diga o resultado exato.",
    config=types.GenerateContentConfig(
        tools=[types.Tool(code_execution=types.ToolCodeExecution())]
    )
)

print("Resposta Final:")
print(response.text)

# Inspeção do código e da saída de execução nas partes da resposta
for part in response.candidates[0].content.parts:
    if part.executable_code:
        print("
--- Código Python Gerado pelo Modelo ---")
        print(part.executable_code.code)
    if part.code_execution_result:
        print("
--- Saída da Execução (Stdout) ---")
        print(part.code_execution_result.output)
```

### 2.2. TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function runCodeExecution() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'Qual é o desvio padrão da seguinte lista: [12, 45, 67, 89, 23, 56, 78, 90, 11, 34]?',
    config: {
      tools: [{ codeExecution: {} }],
    },
  });

  console.log('Resposta:', response.text);
}

runCodeExecution().catch(console.error);
```

### 2.3. cURL / REST API
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"   -H "Content-Type: application/json"   -H "x-goog-api-key: $GEMINI_API_KEY"   -d '{
    "contents": [{
      "parts": [{"text": "Calcule 2 elevado a 64 menos 1."}]
    }],
    "tools": [{
      "code_execution": {}
    }]
  }'
```

---

## 3. Bibliotecas Python Pré-Instaladas no Sandbox

O ambiente de execução inclui as bibliotecas científicas mais populares do ecossistema Python:
- `numpy`
- `pandas`
- `scipy`
- `sympy`
- `matplotlib` (gera código analítico)
- Módulos padrão da biblioteca Python (`math`, `statistics`, `datetime`, `itertools`, `re`, etc.)
