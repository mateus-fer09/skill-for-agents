---
title: Agent Builder e ChatKit
description: Construção visual de fluxos de agentes com OpenAI Agent Builder, exportação para código e incorporação de interfaces de chat interativas com ChatKit.
topics:
  - agent-builder
  - chatkit
  - ui-components
  - visual-workflows
keywords:
  - Agent Builder
  - ChatKit
  - widgets
  - chatkit-actions
  - node-reference
related:
  - ../agents_sdk/definicao_de_agentes.md
  - ../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md
source_scope:
  - https://developers.openai.com/api/docs/guides/agent-builder.md
  - https://developers.openai.com/api/docs/guides/chatkit.md
  - https://developers.openai.com/api/docs/guides/chatkit-widgets.md
  - https://developers.openai.com/api/docs/guides/chatkit-actions.md
---

# OpenAI Agent Builder e ChatKit

Ferramentas para aceleração do ciclo de design, prototipagem visual e entrega de interfaces conversacionais ricas para agentes de IA.

---

## 1. OpenAI Agent Builder

O **Agent Builder** permite desenhar fluxos de trabalho visuais compostos por nós:
- **Nós de Modelo**: Chamadas LLM com prompts específicos e seleção de modelos.
- **Nós de Ferramenta**: Execução de APIs, consultas a bancos de dados ou servidores MCP.
- **Nós de Condição / Branching**: Roteamento baseado no resultado de etapas anteriores.
- **Nós de Loop e Agregação**: Processamento de coleções de itens.

### Exportação para Código
Todo fluxo criado no Agent Builder pode ser exportado com um clique para:
- Código Python usando o **OpenAI Agents SDK**.
- **ChatGPT Workspace Agents** para execução direta na organização corporativa.

---

## 2. ChatKit: Biblioteca de Interface para Agentes

O **ChatKit** é uma biblioteca de componentes front-end para embutir interfaces de chat prontas, responsivas e tematizáveis em aplicações React / Next.js / Web.

### Instalação

```bash
npm install @openai/chatkit
```

### Exemplo de Incorporação em React

```tsx
import React from "react";
import { ChatKitProvider, ChatView, useChatSession } from "@openai/chatkit";

export function MeuChatAgente() {
  return (
    <ChatKitProvider endpoint="/api/chat-backend">
      <div style={{ height: "600px", width: "100%", maxWidth: "800px" }}>
        <ChatView
          title="Assistente de Suporte"
          placeholder="Digite sua dúvida..."
          theme={{
            primaryColor: "#10a37f",
            borderRadius: "8px"
          }}
        />
      </div>
    </ChatKitProvider>
  );
}
```

---

## 3. Widgets Interativos e ChatKit Actions

O ChatKit permite que o agente renderize elementos interativos inline na mensagem:
- **Botões de Ação Rápida**: Opções selecionáveis com 1 clique.
- **Cards e Tabelas Formatadas**: Exibição estruturada de produtos, voos ou métricas.
- **Formulários Dinâmicos**: Coleta de entradas de usuário validadas antes de continuar a execução.

---

## 4. Referências Cruzadas

- [`../agents_sdk/definicao_de_agentes.md`](../agents_sdk/definicao_de_agentes.md)
- [`../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md`](../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md)
- [`../referencia_api/responses_e_chat.md`](../referencia_api/responses_e_chat.md)
