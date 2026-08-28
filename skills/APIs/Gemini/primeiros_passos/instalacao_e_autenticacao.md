---
title: Instalação e Autenticação na Google Gemini API
description: Guia completo para instalação dos novos SDKs google-genai (Python) e @google/genai (Node.js/TypeScript), configuração de chaves de API, variáveis de ambiente e autenticação unificada no Google AI Studio e Google Cloud Vertex AI.
---

# Instalação e Autenticação na Google Gemini API

## 1. Visão Geral dos Novos SDKs Unificados

Em 2025, o Google unificou a experiência de desenvolvimento da Gemini API através de uma nova geração de SDKs oficiais:
- **Python:** `google-genai` (módulo `from google import genai`)
- **TypeScript / JavaScript:** `@google/genai` (módulo `import { GoogleGenAI } from '@google/genai'`)
- **REST API:** `https://generativelanguage.googleapis.com/v1beta/`

> [!IMPORTANT]
> **Aviso de Descontinuação de SDKs Legados:**
> Os pacotes antigos `google-generativeai` (Python) e `@google/generative-ai` (Node.js) estão legados. Toda nova implementação deve utilizar obrigatoriamente os novos SDKs unificados descritos neste guia.

---

## 2. Instalação de Pacotes

### 2.1. Python (`google-genai`)
O SDK Python requer Python 3.10 ou superior.

```bash
# Instalação via pip
pip install google-genai

# Ou via Poetry / uv / Pipenv
poetry add google-genai
uv add google-genai
```

### 2.2. Node.js / TypeScript (`@google/genai`)
O SDK Node.js requer Node.js 18 ou superior.

```bash
# npm
npm install @google/genai

# pnpm
pnpm add @google/genai

# yarn
yarn add @google/genai

# bun
bun add @google/genai
```

---

## 3. Gestão de Credenciais e Variáveis de Ambiente

A Gemini API suporta dois ambientes principais: **Google AI Studio** (ideal para prototipagem rápida e desenvolvimento ágil) e **Google Cloud Vertex AI** (para produção enterprise, governança e conformidade).

### 3.1. Variáveis de Ambiente Padrão

| Variável de Ambiente | Descrição | Plataforma |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Chave de API gerada no Google AI Studio | AI Studio |
| `GOOGLE_API_KEY` | Chave de API alternativa (fallback aceito pelos SDKs) | AI Studio |
| `GOOGLE_GENAI_USE_VERTEXAI` | Definir como `true` para rotear chamadas para Vertex AI | Vertex AI |
| `GOOGLE_CLOUD_PROJECT` | ID do projeto GCP | Vertex AI |
| `GOOGLE_CLOUD_LOCATION` | Região do GCP (ex: `us-central1`, `europe-west1`) | Vertex AI |
| `GOOGLE_APPLICATION_CREDENTIALS` | Caminho para o arquivo JSON de Service Account | Vertex AI / ADC |

### 3.2. Configuração no Shell / Arquivo `.env`

```bash
# Linux / macOS
export GEMINI_API_KEY="AIzaSyYourSecretKeyHere"

# Windows PowerShell
$env:GEMINI_API_KEY="AIzaSyYourSecretKeyHere"

# Arquivo .env (carregado via python-dotenv ou dotenvx)
GEMINI_API_KEY=AIzaSyYourSecretKeyHere
```

---

## 4. Inicialização do Cliente

### 4.1. Google AI Studio (Padrão)

#### Python (`google-genai`)
```python
import os
from google import genai

# Quando GEMINI_API_KEY estiver no ambiente, a inicialização dispensa argumentos:
client = genai.Client()

# Ou passando explicitamente a chave (NÃO recomendado para código em produção):
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Teste básico de conexão
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Responda em uma palavra: 'Conectado!'"
)
print(response.text)
```

#### TypeScript / JavaScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

// Inicialização automática lendo process.env.GEMINI_API_KEY:
const ai = new GoogleGenAI({});

// Ou passando chave explícita:
const aiExplicit = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: "Responda em uma palavra: 'Conectado!'",
  });
  console.log(response.text);
}

main().catch(console.error);
```

#### cURL / REST API Direct
```bash
# Via cabeçalho x-goog-api-key (Recomendado)
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"   -H "Content-Type: application/json"   -H "x-goog-api-key: $GEMINI_API_KEY"   -d '{
    "contents": [{
      "parts": [{"text": "Responda em uma palavra: Conectado!"}]
    }]
  }'
```

---

## 5. Autenticação Enterprise no Google Cloud Vertex AI

Quando executado sob o Vertex AI, o SDK utiliza as credenciais padrão do aplicativo (*Application Default Credentials - ADC*) ou credenciais de conta de serviço (*Service Account*).

### 5.1. Inicialização do Cliente no Vertex AI

#### Python (`google-genai`)
```python
from google import genai

# Inicialização com roteamento nativo para Vertex AI
client = genai.Client(
    vertexai=True,
    project="meu-projeto-gcp-id",
    location="us-central1"
)

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Olá Vertex AI!"
)
print(response.text)
```

#### TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  vertexAI: true,
  project: 'meu-projeto-gcp-id',
  location: 'us-central1',
});

async function runVertex() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'Olá Vertex AI!',
  });
  console.log(response.text);
}

runVertex().catch(console.error);
```

---

## 6. Boas Práticas e Segurança de Credenciais

1. **Nunca comitar chaves de API:** Adicione sempre `.env`, `.env.local` e arquivos `*.json` de credenciais no seu `.gitignore`.
2. **Restrição de Chave no Google Cloud Console:** No console do Google Cloud, restrinja o uso da chave apenas à API `Generative Language API` e, se aplicável, limite por IP ou HTTP Referrer.
3. **Rotação Periódica:** Em sistemas corporativos, estabeleça políticas de rotação de credenciais a cada 90 dias.
4. **Isolamento de Ambientes:** Utilize projetos e chaves segregadas para `desenvolvimento`, `homologação` e `produção`.
