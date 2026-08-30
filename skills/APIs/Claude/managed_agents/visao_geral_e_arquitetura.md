---
title: Visão Geral e Arquitetura do Managed Agents
description: Conceitos de agentes gerenciados pela Anthropic, sandboxes isoladas na nuvem, ciclo de vida de execução e diferenças em relação a chamadas avulsas.
topics:
  - managed-agents
  - cloud-sandboxes
  - autonomous-agents
  - lifecycle
keywords:
  - Managed Agents
  - cloud sandboxes
  - autonomous execution
  - session lifecycle
related:
  - managed_agents/configuracao_e_ambientes.md
  - managed_agents/sessoes_e_delegacao.md
  - referencia_api/endpoints_beta_managed_agents.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/managed-agents/overview
  - https://platform.claude.com/docs/pt-BR/managed-agents/quickstart
  - https://platform.claude.com/docs/pt-BR/managed-agents/onboarding
  - https://platform.claude.com/docs/pt-BR/managed-agents/migration
---

# Visão Geral e Arquitetura do Managed Agents

O **Anthropic Managed Agents** é uma plataforma gerenciada que permite instanciar, configurar e delegar tarefas complexas a agentes de IA totalmente autônomos que operam em **ambientes seguros de sandbox na nuvem**.

---

## Por que Usar Managed Agents?

Em vez de sua aplicação gerenciar o loop de inferência, estados intermediários, timeouts de rede, orquestração de ferramentas e ambientes de execução local, o Managed Agents transfere essa complexidade para a infraestrutura gerenciada da Anthropic:

| Aspecto | Messages API Tradicional | Anthropic Managed Agents |
|---|---|---|
| **Estado e Memória** | Stateless (o cliente precisa gerenciar e reenviar todo o histórico) | Stateful (a sessão mantém o estado completo na nuvem) |
| **Execução de Ferramentas** | O cliente executa cada função localmente e envia o resultado | As ferramentas executam nativamente na sandbox em nuvem |
| **Duração da Tarefa** | Requisições HTTP síncronas de curto prazo | Sessões assíncronas de longa duração (minutos ou horas) |
| **Isolamento de Segurança** | O cliente é responsável por isolar a execução de comandos | Sandboxes efêmeras e isoladas com controle de permissões |
| **Controle de Custo** | Gerenciado por chamada | Orçamentos rígidos por sessão (`budgets`) |

---

## Arquitetura de Execução

```
[Sua Aplicação / Backend]
          │
          │ 1. POST /v1/beta/agents/sessions (Cria Sessão com Meta/Outcome)
          ▼
[Anthropic Managed Agents Orchestrator]
          │
          ├── Provisiona Cloud Sandbox Segura (Linux Container isolado)
          ├── Carrega Repositórios GitHub, Arquivos e Secrets (Vaults)
          ├── Conecta Ferramentas Nativas (Bash, Editor, Browser) e Servidores MCP
          │
          ▼
[Loop Autônomo de Execução do Claude]
   (Planeja ➔ Executa Comandos ➔ Testa ➔ Corrige Bugs ➔ Valida Critérios)
          │
          │ 2. Emite Eventos SSE em Tempo Real (Event Stream)
          ▼
[Sua Aplicação / Webhook] ◄── Recebe notificação de conclusão da sessão
```

---

## Veja Também

- [`../managed_agents/configuracao_e_ambientes.md`](../managed_agents/configuracao_e_ambientes.md)
- [`../managed_agents/sessoes_e_delegacao.md`](../managed_agents/sessoes_e_delegacao.md)
- [`../managed_agents/orquestracao_avancada_e_webhooks.md`](../managed_agents/orquestracao_avancada_e_webhooks.md)
- [`../referencia_api/endpoints_beta_managed_agents.md`](../referencia_api/endpoints_beta_managed_agents.md)
