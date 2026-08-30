---
title: Configuração de Agentes, Ambientes e Sandboxes
description: Definição de agentes gerenciados, configuração de sandboxes em nuvem, políticas de permissão, ferramentas conectadas e integração com repositórios GitHub.
topics:
  - agent-setup
  - environments
  - sandboxes
  - permission-policies
  - github
keywords:
  - agent definition
  - cloud sandboxes
  - permission policy
  - github integration
related:
  - managed_agents/visao_geral_e_arquitetura.md
  - managed_agents/sessoes_e_delegacao.md
  - referencia_api/endpoints_beta_managed_agents.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/managed-agents/agent-setup
  - https://platform.claude.com/docs/pt-BR/managed-agents/environments
  - https://platform.claude.com/docs/pt-BR/managed-agents/permission-policies
  - https://platform.claude.com/docs/pt-BR/managed-agents/tools
  - https://platform.claude.com/docs/pt-BR/managed-agents/skills
  - https://platform.claude.com/docs/pt-BR/managed-agents/github
---

# Configuração de Agentes, Ambientes e Sandboxes

A configuração de um Managed Agent define a identidade, instruções do sistema, ferramentas autorizadas, políticas de segurança e a infraestrutura de sandbox onde ele irá atuar.

---

## 1. Criando a Definição de um Agente (`POST /v1/beta/agents`)

```bash
curl https://api.anthropic.com/v1/beta/agents \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "anthropic-beta: managed-agents-2025-02-01" \
     -H "content-type: application/json" \
     -d '{
       "name": "engenheiro-software-autonomo",
       "model": "claude-3-7-sonnet-20250219",
       "system_prompt": "Você é um engenheiro de software sênior autônomo. Você investiga bugs, cria reproduções em testes unitários, implementa correções e garante que todos os testes passem antes de concluir a sessão.",
       "tools": [
         {"type": "bash_20250124"},
         {"type": "text_editor_20250124"}
       ],
       "environment": {
         "type": "cloud_sandbox",
         "image": "ubuntu-24.04-node-python",
         "resources": {
           "cpu": 2,
           "memory_gb": 4
         }
       }
     }'
```

---

## 2. Políticas de Permissão (Permission Policies)

Para garantir segurança operacional, você pode definir regras estritas sobre quais ações requerem aprovação humana ou são restritas:

```json
{
  "permission_policies": [
    {
      "tool_name": "bash",
      "action": "execute",
      "rules": [
        {"pattern": "rm -rf *", "policy": "deny"},
        {"pattern": "git push --force*", "policy": "deny"},
        {"pattern": "*", "policy": "allow"}
      ]
    }
  ]
}
```

---

## 3. Integração com GitHub

O Managed Agents permite conectar repositórios privados do GitHub diretamente na sandbox:

```json
{
  "integrations": [
    {
      "type": "github",
      "repository": "minha-empresa/meu-projeto",
      "branch": "main",
      "permissions": ["read", "write"]
    }
  ]
}
```

---

## Veja Também

- [`../managed_agents/visao_geral_e_arquitetura.md`](../managed_agents/visao_geral_e_arquitetura.md)
- [`../managed_agents/sessoes_e_delegacao.md`](../managed_agents/sessoes_e_delegacao.md)
- [`../referencia_api/endpoints_beta_managed_agents.md`](../referencia_api/endpoints_beta_managed_agents.md)
