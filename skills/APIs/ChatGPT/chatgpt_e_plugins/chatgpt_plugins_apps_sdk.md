---
title: ChatGPT Plugins e Apps SDK (MCP & Componentes de UI)
description: Guia de desenvolvimento de Plugins para ChatGPT usando Apps SDK, servidores MCP com autenticação OAuth, componentes de interface e submissão na loja.
topics:
  - chatgpt-plugins
  - apps-sdk
  - mcp-servers
  - plugin-ui
  - store-submission
keywords:
  - Plugins
  - Apps SDK
  - MCP
  - manifest
  - OAuth
  - Plugin UI
related:
  - ../chatgpt_e_plugins/workspace_agents_api.md
  - ../chatgpt_e_plugins/gpt_actions.md
  - ../ferramentas_e_mcp/mcp_e_conectores.md
source_scope:
  - https://developers.openai.com/plugins/llms.txt
  - https://developers.openai.com/plugins/build/app-quickstart.md
  - https://developers.openai.com/plugins/reference.md
  - https://developers.openai.com/plugins/deploy/submission.md
---

# ChatGPT Plugins e Apps SDK (MCP & Componentes de UI)

O **ChatGPT Apps SDK** permite estender a experiência do ChatGPT e do Codex através de Plugins construídos sobre o padrão **Model Context Protocol (MCP)**, combinando ferramentas de backend com interfaces visuais interativas.

---

## 1. Arquitetura de um Plugin ChatGPT Moderno

Um Plugin no ecossistema atual é estruturado como um **Servidor MCP** com manifesto de metadados:

```
[ ChatGPT Interface / Usuário ]
              |
              v (Executa ferramentas e renderiza componentes visuais)
[ Servidor MCP do Plugin ]
  ├── Ferramentas MCP (tools/list, tools/call)
  ├── Autenticação (OAuth 2.0 PKCE / API Keys)
  └── Componentes Visuais (React / HTML declarativo)
```

---

## 2. Estrutura do Manifesto do Plugin (`openai-app.json`)

```json
{
  "schema_version": "v1",
  "name_for_human": "Gestor de Tarefas Pro",
  "name_for_model": "gestor_tarefas_pro",
  "description_for_human": "Gerencie seus projetos, crie tarefas e consulte prazos no ChatGPT.",
  "description_for_model": "Plugin para gerenciar projetos, criar tarefas, alterar status e listar pendências do usuário.",
  "auth": {
    "type": "oauth",
    "client_url": "https://auth.meusite.com/oauth/authorize",
    "scope": "read:tasks write:tasks",
    "authorization_url": "https://auth.meusite.com/oauth/token",
    "authorization_content_type": "application/json"
  },
  "api": {
    "type": "mcp",
    "url": "https://api.meusite.com/mcp/sse"
  },
  "logo_url": "https://meusite.com/logo.png",
  "contact_email": "dev@meusite.com",
  "legal_info_url": "https://meusite.com/termos"
}
```

---

## 3. Renderização de UI Customizada no ChatGPT

Plugins podem retornar componentes visuais declarativos para serem renderizados diretamente no feed de conversa do ChatGPT:

```typescript
// Resposta de uma ferramenta MCP com payload de interface
return {
  content: [
    {
      type: "text",
      text: "Encontrei 3 tarefas pendentes para hoje."
    }
  ],
  ui: {
    type: "card_list",
    items: [
      {
        id: "task-101",
        title: "Revisar PR de autenticação",
        priority: "alta",
        due_date: "2026-08-30",
        action: {
          label: "Marcar como Concluída",
          event: "complete_task",
          params: { taskId: "task-101" }
        }
      }
    ]
  }
};
```

---

## 4. Processo de Testes e Submissão

1. **Modo Desenvolvedor**: Instale o plugin no ChatGPT via URL local (`localhost:8080/mcp`) habilitando o modo desenvolvedor.
2. **Validação de Segurança e CSAM**: Verifique aderência às políticas de dados e limites de taxa.
3. **Submissão**: Envie para revisão oficial através do OpenAI Developer Dashboard.

---

## 5. Referências Cruzadas

- [`../chatgpt_e_plugins/workspace_agents_api.md`](../chatgpt_e_plugins/workspace_agents_api.md)
- [`../chatgpt_e_plugins/gpt_actions.md`](../chatgpt_e_plugins/gpt_actions.md)
- [`../ferramentas_e_mcp/mcp_e_conectores.md`](../ferramentas_e_mcp/mcp_e_conectores.md)
