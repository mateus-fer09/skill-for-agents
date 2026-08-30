---
title: SDK Oficial de TypeScript / JavaScript da Anthropic
description: Guia completo de instalação, uso no Node.js, Bun, Deno e Edge Runtimes, streaming SSE, tipos e controle de concorrência.
topics:
  - typescript
  - javascript
  - nodejs
  - sdk
  - streaming
keywords:
  - @anthropic-ai/sdk
  - TypeScript SDK
  - SSE streaming
  - AbortController
related:
  - primeiros_passos/quickstart.md
  - sdks_e_bibliotecas/sdk_python.md
  - mensagens_e_prompting/messages_api.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/sdks/typescript
---

# SDK Oficial de TypeScript / JavaScript da Anthropic

O pacote `@anthropic-ai/sdk` é o cliente oficial para desenvolvimento em TypeScript, JavaScript, Node.js (18+), Bun, Deno, Cloudflare Workers, Vercel Edge e Next.js.

---

## Instalação

```bash
# npm
npm install @anthropic-ai/sdk

# pnpm
pnpm add @anthropic-ai/sdk

# yarn
yarn add @anthropic-ai/sdk

# bun
bun add @anthropic-ai/sdk
```

---

## Configuração do Cliente

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Padrão: process.env['ANTHROPIC_API_KEY']
  maxRetries: 3,                         // Tentativas automáticas em erros 429/5xx
  timeout: 60 * 1000,                    // 60 segundos de timeout
});
```

---

## Criação de Mensagens Básica

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function run() {
  const message = await anthropic.messages.create({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 1024,
    system: 'Você é um arquiteto de software sênior. Responda em português técnico e preciso.',
    messages: [
      { role: 'user', content: 'Qual o papel do padrão Event Sourcing em sistemas distribuídos?' }
    ],
  });

  console.log(message.content[0]);
  console.log(`Tokens consumidos: Entrada=${message.usage.input_tokens}, Saída=${message.usage.output_tokens}`);
}

run();
```

---

## Streaming em Tempo Real com Helpers

O SDK TypeScript fornece o método helper `.stream()` com emissores de eventos fortemente tipados:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function streamDemo() {
  const stream = anthropic.messages.stream({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 2048,
    messages: [
      { role: 'user', content: 'Escreva um microframework HTTP assíncrono básico em TypeScript.' }
    ],
  })
  .on('text', (textDelta, textSnapshot) => {
    process.stdout.write(textDelta);
  })
  .on('message', (message) => {
    console.log('\nMensagem concluída:', message.id);
  })
  .on('error', (error) => {
    console.error('Erro durante streaming:', error);
  });

  // Aguarda a finalização do stream e obtém a mensagem completa
  const finalMessage = await stream.finalMessage();
  console.log('\nStop reason:', finalMessage.stop_reason);
}

streamDemo();
```

---

## Cancelamento de Requisições com `AbortController`

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const controller = new AbortController();

// Cancela a requisição após 5 segundos se não concluir
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const message = await anthropic.messages.create(
    {
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      messages: [{ role: 'user', content: 'Gere um plano arquitetural detalhado.' }],
    },
    { signal: controller.signal }
  );
  clearTimeout(timeoutId);
  console.log(message);
} catch (error) {
  if (error instanceof Anthropic.APIUserAbortError) {
    console.warn('Requisição cancelada pelo cliente.');
  } else {
    throw error;
  }
}
```

---

## Classes de Erro

```typescript
import Anthropic, { 
  APIError, 
  APIConnectionError, 
  RateLimitError, 
  BadRequestError, 
  AuthenticationError 
} from '@anthropic-ai/sdk';

try {
  // ... chamada da API
} catch (err) {
  if (err instanceof RateLimitError) {
    console.error('Rate limit excedido (429). Retry-After:', err.headers?.['retry-after']);
  } else if (err instanceof AuthenticationError) {
    console.error('Credenciais inválidas (401).');
  } else if (err instanceof APIError) {
    console.error(`Erro da API Anthropic [${err.status}]: ${err.message}`);
  }
}
```

---

## Veja Também

- [`../sdks_e_bibliotecas/sdk_python.md`](../sdks_e_bibliotecas/sdk_python.md)
- [`../mensagens_e_prompting/messages_api.md`](../mensagens_e_prompting/messages_api.md)
- [`../ferramentas_e_agentes/tool_use_visao_geral.md`](../ferramentas_e_agentes/tool_use_visao_geral.md)
