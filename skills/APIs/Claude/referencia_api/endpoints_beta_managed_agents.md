---
title: Referência da API Beta de Managed Agents
description: Especificação completa dos endpoints de Agents, Environments, Sessions, Event Stream, Sandboxes, Vaults e Webhooks.
topics:
  - beta-api
  - managed-agents-api
  - sessions-api
keywords:
  - POST /v1/beta/agents
  - POST /v1/beta/agents/sessions
  - GET /v1/beta/agents/sessions/<built-in function id>/events
related:
  - managed_agents/visao_geral_e_arquitetura.md
  - managed_agents/sessoes_e_delegacao.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/managed-agents/reference
  - https://platform.claude.com/docs/en/api/beta/agents
---

# Referência da API Beta de Managed Agents

---

## Endpoints Principais

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/v1/beta/agents` | Registra a definição de um novo agente |
| `GET` | `/v1/beta/agents` | Lista os agentes da organização |
| `GET` | `/v1/beta/agents/{agent_id}` | Recupera detalhes da definição do agente |
| `POST` | `/v1/beta/agents/sessions` | Cria e inicia uma sessão autônoma |
| `GET` | `/v1/beta/agents/sessions/{session_id}` | Consulta o estado e contadores da sessão |
| `GET` | `/v1/beta/agents/sessions/{session_id}/events` | Abre stream SSE de eventos em tempo real |
| `POST` | `/v1/beta/agents/sessions/{session_id}/cancel` | Interrompe uma sessão em execução |
| `POST` | `/v1/beta/agents/vaults` | Cria um cofre seguro de credenciais |

---

## Veja Também

- [`../managed_agents/visao_geral_e_arquitetura.md`](../managed_agents/visao_geral_e_arquitetura.md)
- [`../managed_agents/sessoes_e_delegacao.md`](../managed_agents/sessoes_e_delegacao.md)
