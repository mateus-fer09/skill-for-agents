---
title: Sessões, Streaming de Eventos e Orçamentos no Managed Agents
description: Iniciação de sessões, streaming de eventos em tempo real, orçamentos de sessão (budgets), definição de metas (outcomes) e cofres de credenciais (vaults).
topics:
  - sessions
  - event-stream
  - budgets
  - outcomes
  - vaults
keywords:
  - session operations
  - session events
  - budget tokens
  - outcomes
  - vaults
related:
  - managed_agents/visao_geral_e_arquitetura.md
  - managed_agents/configuracao_e_ambientes.md
  - referencia_api/endpoints_beta_managed_agents.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/managed-agents/sessions
  - https://platform.claude.com/docs/pt-BR/managed-agents/session-operations
  - https://platform.claude.com/docs/pt-BR/managed-agents/events-and-streaming
  - https://platform.claude.com/docs/pt-BR/managed-agents/budgets
  - https://platform.claude.com/docs/pt-BR/managed-agents/define-outcomes
  - https://platform.claude.com/docs/pt-BR/managed-agents/vaults
---

# Sessões, Streaming de Eventos e Orçamentos no Managed Agents

Uma **Sessão** (`Session`) representa a execução ativa de um agente delegado a resolver um problema específico.

---

## 1. Iniciando uma Sessão com Metas e Orçamento

```bash
curl https://api.anthropic.com/v1/beta/agents/sessions \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "anthropic-beta: managed-agents-2025-02-01" \
     -H "content-type: application/json" \
     -d '{
       "agent_id": "ag_01XFDUDYJgAACzvnptvVoYEL",
       "prompt": "Investigue por que o endpoint /api/v1/checkout está retornando 500 para usuários com moedas internacionais. Crie um teste de regressão e envie um Pull Request corrigindo o bug.",
       "budget": {
         "max_tokens": 100000,
         "max_usd_cost": 5.00,
         "max_duration_seconds": 1800
       },
       "outcomes": [
         {"name": "testes_passando", "description": "O comando 'npm test' deve retornar status 0 com 100% de sucesso."},
         {"name": "pr_criado", "description": "Um PR no GitHub deve ter sido aberto apontando para a branch main."}
       ]
     }'
```

---

## 2. Acompanhamento de Eventos em Tempo Real (Session Event Stream)

Você pode abrir uma conexão SSE para receber todos os pensamentos, comandos de terminal executados, saídas e status da sessão em tempo real:

```bash
curl https://api.anthropic.com/v1/beta/agents/sessions/sess_01XFDUDYJgAACzvnptvVoYEL/events \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "anthropic-beta: managed-agents-2025-02-01" \
     -H "Accept: text/event-stream"
```

### Principais Tipos de Eventos:
- `session.started`: A sessão foi inicializada e o container da sandbox foi provisionado.
- `agent.thought`: O agente registrou um plano ou raciocínio intermediário.
- `tool.execution_started`: O agente iniciou a execução de um comando bash ou edição de arquivo.
- `tool.execution_completed`: A execução da ferramenta retornou stdout/stderr.
- `session.completed`: A sessão atingiu todos os outcomes com sucesso.
- `session.budget_exceeded`: A sessão foi interrompida com segurança por atingir o teto de custo ou tempo.

---

## 3. Cofres de Credenciais Seguras (Vaults)

Os **Vaults** permitem que agentes acessem chaves de API externas (ex: AWS, Stripe, GitHub Tokens) durante a sessão sem que o valor secreto bruto seja exposto no histórico de diálogo:

```json
{
  "vaults": [
    {
      "name": "prod-deployment-secrets",
      "secrets": ["GITHUB_TOKEN", "NPM_TOKEN"]
    }
  ]
}
```

---

## Veja Também

- [`../managed_agents/visao_geral_e_arquitetura.md`](../managed_agents/visao_geral_e_arquitetura.md)
- [`../managed_agents/orquestracao_avancada_e_webhooks.md`](../managed_agents/orquestracao_avancada_e_webhooks.md)
- [`../referencia_api/endpoints_beta_managed_agents.md`](../referencia_api/endpoints_beta_managed_agents.md)
