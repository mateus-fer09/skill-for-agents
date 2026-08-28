---
title: "Quickstart: Responses API vs Chat Completions e Streaming SSE"
description: "Guia completo de geração de texto com a OpenAI API, comparando a interface Responses API (client.responses.create) e Chat Completions API (client.chat.completions.create), gerenciamento de papéis (developer, system, user, assistant, tool), streaming em tempo real com Server-Sent Events e captura de consumo de tokens."
topics: ["chat-completions", "responses-api", "streaming", "sse", "roles", "prompt-engineering", "token-usage"]
keywords: ["client.chat.completions.create", "client.responses.create", "stream=True", "stream_options", "developer message", "system message", "output_text"]
source_scope: "OpenAI API Docs: Guides > Text Generation, Responses API vs Chat Completions, Streaming Responses"
---

# Quickstart: Responses API vs Chat Completions e Streaming SSE

A OpenAI oferece duas interfaces complementares para interação conversacional e geração de texto:
1. **Responses API (`client.responses.create`)**: Interface moderna de alto nível projetada para unificar chamadas com prompts armazenados, execução assíncrona com continuidade de streaming, multimodalidade e raciocínio nativo.
2. **Chat Completions API (`client.chat.completions.create`)**: Interface clássica e universal, amplamente adotada em pipelines de NLP, agentes de inferência rápida e integrações consolidadas.

---

## 1. Comparação Arquitetural: Responses API vs Chat Completions

| Recurso / Característica | Responses API (`client.responses.create`) | Chat Completions API (`client.chat.completions.create`) |
| :--- | :--- | :--- |
| **Endpoint REST** | `POST /v1/responses` | `POST /v1/chat/completions` |
| **Entrada Principal** | `input` (String única, array de mensagens ou itens) | `messages` (Array estrito de objetos de mensagem) |
| **Acesso ao Texto de Saída** | `response.output_text` (Atributo direto de conveniência) | `response.choices[0].message.content` |
| **Prompts Gerenciados** | Suporte nativo via parâmetro `prompt={"id": "..."}` | Necessário injetar o prompt manualmente no array |
| **Recuperação de Stream** | Suporte a re-conexão via `starting_after` | Exige reconexão e re-execução da requisição |
| **Modo Background** | Suporte a execução assíncrona (`background=True`) | Bloqueante ou SSE streaming tradicional |

---

## 2. Implementação com Chat Completions API

### 2.1. Exemplo Síncrono Básico em Python

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "developer", # 'developer' é o padrão recomendado em modelos modernos
            "content": "Você é um arquiteto sênior de software especializado em microsserviços."
        },
        {
            "role": "user",
            "content": "Qual a principal vantagem do padrão CQRS?"
        }
    ],
    temperature=0.7,
    max_completion_tokens=500,
)

# Acessando o texto gerado e metadados de consumo
content = response.choices[0].message.content
usage = response.usage

print("Resposta:", content)
print(f"Tokens de Entrada: {usage.prompt_tokens} | Saída: {usage.completion_tokens} | Total: {usage.total_tokens}")
```

### 2.2. Exemplo em TypeScript / Node.js

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Você é um assistente técnico que responde em formato conciso.',
      },
      {
        role: 'user',
        content: 'Explique o conceito de Event Sourcing em 2 parágrafos.',
      },
    ],
    temperature: 0.5,
  });

  console.log(completion.choices[0]?.message.content);
  console.log('Uso de tokens:', completion.usage);
}

main();
```

---

## 3. Implementação com Responses API

A Responses API simplifica o acesso ao texto gerado e permite combinar inputs complexos.

### 3.1. Exemplo em Python

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-4o",
    input="Analise os principais gargalos de escalabilidade em bancos relacionais com alto volume de escrita.",
    reasoning={"effort": "low"}, # Opcional em modelos que suportam raciocínio
)

# Acesso direto e limpo à saída gerada
print(response.output_text)
```

### 3.2. Exemplo via REST (cURL)

```bash
curl https://api.openai.com/v1/responses   -H "Content-Type: application/json"   -H "Authorization: Bearer $OPENAI_API_KEY"   -d '{
    "model": "gpt-4o",
    "input": "Como funciona o algoritmo de consenso Raft?"
  }'
```

---

## 4. Streaming em Tempo Real com Server-Sent Events (SSE)

O streaming permite receber os tokens gerados incrementalmente, reduzindo o *Time to First Token* (TTFT) percebido pelo usuário final de vários segundos para menos de 300ms.

### 4.1. Streaming em Python com Chat Completions

```python
from openai import OpenAI

client = OpenAI()

stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "Escreva um ensaio curto sobre a exploração espacial."}
    ],
    stream=True,
    # Inclui o objeto final de usage no último chunk do stream
    stream_options={"include_usage": True},
)

for chunk in stream:
    # Captura deltas de conteúdo
    if chunk.choices and len(chunk.choices) > 0:
        delta = chunk.choices[0].delta.content
        if delta:
            print(delta, end="", flush=True)
            
    # Captura estatísticas de consumo emitidas no último evento
    if chunk.usage:
        print(f"\n\n[Consumo Final: {chunk.usage.total_tokens} tokens]")
```

### 4.2. Streaming em TypeScript / Node.js (Async Iterable)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

async function streamChat() {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'user', content: 'Gere um plano de estudos para aprender Rust em 4 semanas.' }
    ],
    stream: true,
    stream_options: { include_usage: true },
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);

    if (chunk.usage) {
      console.log(`\n\nTotal de tokens utilizados: ${chunk.usage.total_tokens}`);
    }
  }
}

streamChat();
```

---

## 5. Papéis de Mensagens (*Roles*) e Boas Práticas de Prompt

A OpenAI suporta diferentes papéis na conversa:

1. **`developer` / `system`:**
   - Define a identidade, diretrizes comportamentais, tom de voz, regras de formatação e limites de segurança.
   - Em modelos modernos (`gpt-4o`, `o1`, `o3-mini`), prefira `role: "developer"`.
2. **`user`:**
   - Representa a mensagem ou comando enviado pelo usuário final (pode conter texto, imagens ou arquivos).
3. **`assistant`:**
   - Respostas geradas anteriormente pelo modelo. Usado para fornecer histórico conversacional ou exemplos *Few-Shot*.
4. **`tool`:**
   - Respostas geradas por funções locais ou APIs externas em resposta a um `tool_call` emitido pelo assistente.

### 5.1. Exemplo de Histórico Multiturno com Few-Shot Learning

```python
messages = [
    {"role": "developer", "content": "Você é um tradutor técnico de terminologias de computação."},
    # Exemplo Few-shot 1
    {"role": "user", "content": "Traduzir: 'deadlock'"},
    {"role": "assistant", "content": "Impasse (bloqueio mútuo de recursos)"},
    # Exemplo Few-shot 2
    {"role": "user", "content": "Traduzir: 'garbage collection'"},
    {"role": "assistant", "content": "Coleta de lixo de memória"},
    # Consulta real
    {"role": "user", "content": "Traduzir: 'thread pool'"}
]

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages
)
print(response.choices[0].message.content)
```
