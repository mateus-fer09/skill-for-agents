---
title: Exemplo Completo — Responses API em TypeScript / Node.js
description: Implementação completa em TypeScript com tipagem estrita, streaming assíncrono e tratamento de eventos na Responses API.
topics:
  - examples
  - typescript
  - nodejs
  - responses-api
keywords:
  - typescript
  - node.js
  - openai.responses.create
  - async iterator
related:
  - ../responses_api/introducao_e_quickstart.md
  - ../fundamentos/sdks_e_cli.md
source_scope:
  - https://developers.openai.com/api/docs/quickstart.md
---

# Exemplo Completo — Responses API em TypeScript / Node.js

Implementação em TypeScript moderno utilizando o pacote oficial `openai`.

---

## Código Fonte Completo (`index.ts`)

```typescript
import OpenAI from "openai";

// 1. Inicializar cliente (lê automaticamente OPENAI_API_KEY do ambiente)
const openai = new OpenAI({
  maxRetries: 3,
  timeout: 30000,
});

async function main() {
  console.log("=== 1. Executando Resposta Síncrona ===");

  try {
    const response = await openai.responses.create({
      model: "gpt-5.6",
      instructions: "Você é um especialista em arquitetura cloud e microsserviços.",
      input: "Destaque os três pilares fundamentais do padrão Circuit Breaker.",
      temperature: 0.5,
    });

    console.log("\nResposta do Modelo:");
    console.log(response.output_text);
    console.log(`\nTokens Totais: ${response.usage?.total_tokens}`);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(`Erro da API (${error.status}):`, error.message);
    } else {
      console.error("Erro inesperado:", error);
    }
  }

  console.log("\n=== 2. Executando com Streaming (Async Iterator) ===");

  try {
    const stream = await openai.responses.create({
      model: "gpt-5.6",
      input: "Escreva uma função TypeScript genérica para retry com backoff exponencial.",
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === "response.output_item.delta" && event.delta?.text) {
        process.stdout.write(event.delta.text);
      }
    }
    console.log("\n\n[Stream concluído]");
  } catch (error) {
    console.error("Erro durante o streaming:", error);
  }
}

main();
```

---

## Configuração do `package.json`

```json
{
  "name": "openai-responses-ts",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "tsx index.ts"
  },
  "dependencies": {
    "openai": "^5.0.0"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## Referências Relacionadas

- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
- [`../fundamentos/sdks_e_cli.md`](../fundamentos/sdks_e_cli.md)
