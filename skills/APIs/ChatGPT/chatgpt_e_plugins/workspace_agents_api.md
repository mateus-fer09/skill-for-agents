---
title: Workspace Agents API (Disparo de Agentes Corporativos)
description: Como disparar, autenticar e monitorar execuções de ChatGPT Workspace Agents publicados na organização corporativa via API REST.
topics:
  - workspace-agents
  - enterprise-agents
  - trigger-runs
  - automation
keywords:
  - workspace_agents
  - trigger_run
  - agent_id
  - execution_status
  - Enterprise ChatGPT
related:
  - ../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md
  - ../agents_sdk/definicao_de_agentes.md
  - ../administracao_e_infra/rbac_organizacoes_projetos.md
source_scope:
  - https://developers.openai.com/workspace-agents/llms.txt
  - https://developers.openai.com/workspace-agents/trigger-runs.md
  - https://developers.openai.com/workspace-agents/authentication.md
---

# Workspace Agents API (Disparo de Agentes Corporativos)

A **Workspace Agents API** permite que sistemas de backend, rotinas cron e pipelines de automação (CI/CD, ERP, CRM) disparem execuções de **Agentes de Workspace** previamente criados e publicados dentro da organização do ChatGPT Work / Enterprise.

---

## 1. Autenticação

As chamadas para a Workspace Agents API utilizam tokens de serviço dedicados (*Workspace Agent Access Tokens*) ou Project API Keys com a permissão `workspace_agents:run`:

```http
POST /v1/workspace_agents/runs HTTP/1.1
Host: api.openai.com
Authorization: Bearer YOUR_WORKSPACE_AGENT_TOKEN
Content-Type: application/json
```

---

## 2. Disparando uma Execução de Agente (`trigger_runs`)

### Exemplo em Python

```python
from openai import OpenAI

client = OpenAI()

# Disparar execução do agente
run = client.workspace_agents.runs.create(
    agent_id="agnt_corp_relatorio_diario_123",
    input={
        "data_referencia": "2026-08-29",
        "departamentos": ["Engenharia", "Suporte", "Vendas"],
        "enviar_resumo_slack": True
    },
    metadata={
        "origem": "cron_diario_airflow",
        "job_id": "job_998811"
    }
)

print(f"Execução disparada! Run ID: {run.id}. Status inicial: {run.status}")
```

---

## 3. Consultando o Status e Resultados da Execução

```python
# Polling de status da execução
execucao = client.workspace_agents.runs.retrieve(
    run_id=run.id
)

print(f"Status atual: {execucao.status}")

if execucao.status == "completed":
    print("Resultado retornado pelo agente:")
    print(execucao.output)
elif execucao.status == "failed":
    print(f"Erro na execução: {execucao.error_message}")
```

---

## 4. Estados de Execução (*Run Lifecycle*)

- `queued`: Na fila de processamento da organização.
- `in_progress`: Agente executando nós de modelo e ferramentas.
- `waiting_for_input`: Aguardando resposta ou aprovação humana.
- `completed`: Concluído com sucesso, saída disponível em `output`.
- `failed`: Falha de execução ou violação de política/permissão.
- `cancelled`: Cancelado pela aplicação ou administrador.

---

## 5. Referências Cruzadas

- [`../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md`](../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md)
- [`../agents_sdk/definicao_de_agentes.md`](../agents_sdk/definicao_de_agentes.md)
- [`../administracao_e_infra/rbac_organizacoes_projetos.md`](../administracao_e_infra/rbac_organizacoes_projetos.md)
