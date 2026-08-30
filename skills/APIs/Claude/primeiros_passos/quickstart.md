---
title: Início Rápido (Quickstart) com Claude API
description: Guia prático passo a passo para criar sua conta no Console, obter uma chave de API e realizar sua primeira requisição com curl, Python e TypeScript.
topics:
  - quickstart
  - instalacao
  - primeira-requisicao
keywords:
  - api key
  - curl
  - python
  - typescript
  - console
related:
  - primeiros_passos/autenticacao_e_seguranca.md
  - sdks_e_bibliotecas/sdk_python.md
  - sdks_e_bibliotecas/sdk_typescript.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/get-started
  - https://platform.claude.com/docs/pt-BR/get-api-key
---

# Início Rápido (Quickstart) com Claude API

Este guia conduz você desde a criação da sua conta no Console da Anthropic até a execução bem-sucedida da sua primeira chamada à Messages API.

---

## Passo 1: Obter sua Chave de API (API Key)

1. Acesse o **Anthropic Console** em [console.anthropic.com](https://console.anthropic.com/).
2. Crie uma conta ou faça login.
3. Navegue até a seção **API Keys** no menu de configurações do seu Workspace.
4. Clique em **Create Key**, atribua um nome descritivo (ex: `dev-local-key`) e copie o valor da chave gerada (iniciada por `sk-ant-api03-...`).
5. Armazene a chave em uma variável de ambiente segura no seu sistema:

### No Linux / macOS:
```bash
export ANTHROPIC_API_KEY="sk-ant-api03-sua-chave-aqui"
```

### No Windows (PowerShell):
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-api03-sua-chave-aqui"
```

---

## Passo 2: Executar sua Primeira Chamada

### Opção A: Usando cURL

```bash
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data '{
       "model": "claude-3-7-sonnet-20250219",
       "max_tokens": 1024,
       "messages": [
         {"role": "user", "content": "Olá, Claude! Responda em uma frase explicando o que você é."}
       ]
     }'
```

### Opção B: Usando Python

Instale o SDK oficial:
```bash
pip install anthropic
```

Crie o arquivo `quickstart.py`:
```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Olá, Claude! Responda em uma frase explicando o que você é."}
    ]
)

print(response.content[0].text)
```

### Opção C: Usando TypeScript / Node.js

Instale o pacote:
```bash
npm install @anthropic-ai/sdk
```

Crie o arquivo `quickstart.ts`:
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
  const response = await anthropic.messages.create({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: 'Olá, Claude! Responda em uma frase explicando o que você é.' }
    ],
  });

  console.log(response.content[0].text);
}

main();
```

---

## Exemplo de Resposta Retornada pela API

```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "model": "claude-3-7-sonnet-20250219",
  "content": [
    {
      "type": "text",
      "text": "Eu sou o Claude, um modelo de inteligência artificial desenvolvido pela Anthropic focado em segurança, precisão e colaboração."
    }
  ],
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 25,
    "output_tokens": 36
  }
}
```

---

## Próximos Passos

1. Aprenda sobre a anatomia completa de mensagens em [`../mensagens_e_prompting/messages_api.md`](../mensagens_e_prompting/messages_api.md).
2. Configure **Prompt Caching** para economizar até 90% em [`../mensagens_e_prompting/prompt_caching.md`](../mensagens_e_prompting/prompt_caching.md).
3. Habilite **Tool Calling** para integrar suas próprias funções em [`../ferramentas_e_agentes/tool_use_visao_geral.md`](../ferramentas_e_agentes/tool_use_visao_geral.md).
