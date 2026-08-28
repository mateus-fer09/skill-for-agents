---
title: Context Caching — Otimização de Custos e Latência para Prompts Longos
description: Guia completo sobre Context Caching explícito na Google Gemini API para reutilização de prompts acima de 32k tokens, configuração de TTL (Time to Live), cálculo de economia financeira e ciclo de vida.
---

# Context Caching — Otimização de Custos e Latência para Prompts Longos

## 1. Visão Geral do Context Caching

O recurso de **Context Caching** permite pré-processar e armazenar o estado de atenção (*Key-Value cache*) de grandes volumes de dados (documentos extensos, bases de código, gravações de áudio/vídeo ou bibliotecas de prompts) nos servidores do Google. 

Em chamadas subsequentes que referenciam o mesmo cache, você paga uma fração do custo de tokens de entrada normais e obtém uma latência significativamente menor (Time to First Token - TTFT).

```text
┌────────────────────────────────────────────────────────┐
│               CRIAÇÃO DO CACHE (1ª VEZ)                │
│  - Conteúdo extenso (>32.768 tokens)                   │
│  - Define TTL (ex: 1 hora)                             │
│  - Retorna: cachedContents/abc123cache                 │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             CONSULTAS SUBSEQUENTES (N VEZES)           │
│  - Envia apenas a pergunta do usuário                  │
│  - cached_content = "cachedContents/abc123cache"       │
│  - Economia de até 75% no custo de entrada             │
│  - TTFT ultra-rápido (sem reprocessar o contexto)      │
└────────────────────────────────────────────────────────┘
```

---

## 2. Requisitos e Limites Mínimos de Tokens

- **Gemini 1.5 Pro / 2.5 Pro / 2.0 Flash:** Exige um mínimo de **32.768 tokens** de conteúdo para habilitar o cache explícito.
- **TTL Padrão:** 1 hora (3.600 segundos), configurável e renovável programaticamente.

---

## 3. Criação e Uso do Cache

### 3.1. Python (`google-genai`)
```python
from google import genai
from google.genai import types

client = genai.Client()

# 1. Upload do arquivo grande (ex: livro ou base jurídica)
documento = client.files.upload(file="codigo_fonte_completo.txt")

# 2. Criação explícita do cache com TTL de 2 horas
cache = client.cached_contents.create(
    model="gemini-2.0-flash",
    config=types.CreateCachedContentConfig(
        contents=[documento],
        display_name="cache_codebase_v1",
        system_instruction="Você é o arquiteto sênior especialista neste codebase.",
        ttl="7200s" # 2 horas
    )
)

print(f"Cache criado com sucesso: {cache.name}")
print(f"Expira em: {cache.expire_time}")

# 3. Execução de consulta utilizando o cache criado
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Onde está implementada a função de validação de token JWT?",
    config=types.GenerateContentConfig(
        cached_content=cache.name
    )
)

print("
Resposta da Consulta:")
print(response.text)
```

### 3.2. TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function runCaching() {
  const file = await ai.files.upload({
    file: 'manual_tecnico_extenso.pdf',
    mimeType: 'application/pdf',
  });

  // Criação do Cache
  const cache = await ai.cachedContents.create({
    model: 'gemini-2.0-flash',
    config: {
      contents: [file],
      displayName: 'cache_manual_tecnico',
      ttl: '3600s',
    },
  });

  console.log(`Cache ID: ${cache.name}`);

  // Consulta usando o cache
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'Qual é o procedimento de calibração descrito na seção 5.4?',
    config: {
      cachedContent: cache.name,
    },
  });

  console.log(response.text);
}

runCaching().catch(console.error);
```

---

## 4. Gerenciamento do Ciclo de Vida do Cache

### 4.1. Atualizar TTL (Renovação de Expiração)

#### Python
```python
# Renovar o cache por mais 1 hora a partir de agora
client.cached_contents.update(
    name=cache.name,
    config=types.UpdateCachedContentConfig(
        ttl="3600s"
    )
)
print("TTL do cache atualizado!")
```

### 4.2. Listar e Excluir Caches

```python
# Listar todos os caches ativos no projeto
for c in client.cached_contents.list():
    print(f"ID: {c.name} | Display: {c.display_name} | Expira: {c.expire_time}")

# Deletar cache manualmente para liberar custos de armazenamento
client.cached_contents.delete(name=cache.name)
print("Cache removido.")
```
