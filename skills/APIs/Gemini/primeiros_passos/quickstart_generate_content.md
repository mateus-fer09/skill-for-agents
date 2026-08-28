---
title: Quickstart — Generate Content, Streaming e Chat
description: Guia prático com código completo para geração de texto síncrona, streaming de respostas, instruções de sistema (system instructions), conversação multi-turn (Chat) e contagem precisa de tokens.
---

# Quickstart — Generate Content, Streaming e Chat

## 1. Geração de Conteúdo Síncrona

A operação principal para inferência é `client.models.generate_content` (Python) ou `ai.models.generateContent` (TypeScript).

### 1.1. Exemplo Básico de Texto

#### Python (`google-genai`)
```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Explique a teoria da relatividade geral em 3 tópicos didáticos.",
    config=types.GenerateContentConfig(
        temperature=0.7,
        max_output_tokens=500,
        system_instruction="Você é um professor premiado de física moderna."
    )
)

print(response.text)
```

#### TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function generateExplanation() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'Explique a teoria da relatividade geral em 3 tópicos didáticos.',
    config: {
      temperature: 0.7,
      maxOutputTokens: 500,
      systemInstruction: 'Você é um professor premiado de física moderna.',
    },
  });

  console.log(response.text);
}

generateExplanation().catch(console.error);
```

#### cURL / REST API
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"   -H "Content-Type: application/json"   -H "x-goog-api-key: $GEMINI_API_KEY"   -d '{
    "system_instruction": {
      "parts": [{"text": "Você é um professor premiado de física moderna."}]
    },
    "contents": [{
      "role": "user",
      "parts": [{"text": "Explique a teoria da relatividade geral em 3 tópicos didáticos."}]
    }],
    "generationConfig": {
      "temperature": 0.7,
      "maxOutputTokens": 500
    }
  }'
```

---

## 2. Streaming de Respostas em Tempo Real

O streaming reduz a percepção de latência enviando pedaços (*chunks*) de resposta à medida que são gerados pelo modelo.

### 2.1. Exemplo de Streaming

#### Python (`google-genai`)
```python
from google import genai

client = genai.Client()

response_stream = client.models.generate_content_stream(
    model="gemini-2.0-flash",
    contents="Escreva uma crônica curta sobre um astronauta admirando a Terra à distância."
)

for chunk in response_stream:
    if chunk.text:
        print(chunk.text, end="", flush=True)

print()
```

#### TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function streamStory() {
  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-2.0-flash',
    contents: 'Escreva uma crônica curta sobre um astronauta admirando a Terra à distância.',
  });

  for await (const chunk of responseStream) {
    if (chunk.text) {
      process.stdout.write(chunk.text);
    }
  }
  console.log();
}

streamStory().catch(console.error);
```

#### cURL / Server-Sent Events (SSE)
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse"   -H "Content-Type: application/json"   -H "x-goog-api-key: $GEMINI_API_KEY"   -d '{
    "contents": [{
      "parts": [{"text": "Escreva uma crônica curta sobre um astronauta."}]
    }]
  }'
```

---

## 3. Conversação Multi-Turn (Chat com Estado)

A API fornece a interface `chats` para manter o histórico de mensagens automaticamente entre turnos do usuário e do assistente.

### 3.1. Exemplo de Chat Stateful

#### Python (`google-genai`)
```python
from google import genai
from google.genai import types

client = genai.Client()

# Criação da sessão de chat com instruções de sistema
chat = client.chats.create(
    model="gemini-2.0-flash",
    config=types.GenerateContentConfig(
        system_instruction="Você é um assistente de suporte técnico conciso e empático."
    )
)

# Primeiro turno
response1 = chat.send_message("Olá! O meu monitor parou de exibir vídeo após uma atualização de driver.")
print("Assistente:", response1.text)

# Segundo turno (o modelo preserva a memória do turno anterior)
response2 = chat.send_message("Qual cabo você recomenda eu checar primeiro?")
print("Assistente:", response2.text)

# Inspeção do histórico acumulado
for message in chat.get_history():
    print(f"[{message.role.upper()}]: {message.parts[0].text}")
```

#### TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function runChat() {
  const chat = ai.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: 'Você é um assistente de suporte técnico conciso e empático.',
    },
  });

  const res1 = await chat.sendMessage({
    message: 'Olá! O meu monitor parou de exibir vídeo após uma atualização de driver.',
  });
  console.log('Assistente:', res1.text);

  const res2 = await chat.sendMessage({
    message: 'Qual cabo você recomenda eu checar primeiro?',
  });
  console.log('Assistente:', res2.text);

  // Recuperação do histórico
  const history = await chat.getHistory();
  for (const turn of history) {
    console.log(`[${turn.role?.toUpperCase()}]: ${turn.parts?.[0]?.text}`);
  }
}

runChat().catch(console.error);
```

---

## 4. Contagem Precisa de Tokens e Auditoria

Antes de enviar requisições gigantescas ou caches de contexto, você pode consultar o endpoint `count_tokens` para auditar a quantidade exata de tokens de entrada.

### 4.1. Exemplo de Contagem de Tokens

#### Python (`google-genai`)
```python
from google import genai
from google.genai import types

client = genai.Client()

prompt_text = "Esta é uma análise técnica sobre arquitetura de microsserviços em larga escala. " * 50

token_count_response = client.models.count_tokens(
    model="gemini-2.0-flash",
    contents=prompt_text,
    config=types.GenerateContentConfig(
        system_instruction="Instrução do sistema de auditoria."
    )
)

print(f"Total de Tokens: {token_count_response.total_tokens}")
print(f"Caracteres Faturáveis: {token_count_response.total_billable_characters}")
```

#### TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function checkTokens() {
  const promptText = 'Esta é uma análise técnica sobre arquitetura de microsserviços em larga escala. '.repeat(50);

  const result = await ai.models.countTokens({
    model: 'gemini-2.0-flash',
    contents: promptText,
    config: {
      systemInstruction: 'Instrução do sistema de auditoria.',
    },
  });

  console.log(`Total de Tokens: ${result.totalTokens}`);
  console.log(`Caracteres Faturáveis: ${result.totalBillableCharacters}`);
}

checkTokens().catch(console.error);
```

#### cURL / REST API
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:countTokens"   -H "Content-Type: application/json"   -H "x-goog-api-key: $GEMINI_API_KEY"   -d '{
    "contents": [{
      "parts": [{"text": "Qual é a contagem exata de tokens deste texto de teste?"}]
    }]
  }'
```
