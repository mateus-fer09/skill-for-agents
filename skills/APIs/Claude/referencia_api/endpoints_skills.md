---
title: Referência da Skills API
description: Endpoints REST para criação, versionamento, consulta, atualização e remoção de Agent Skills programáticas.
topics:
  - skills-api
  - endpoints
  - agent-skills
keywords:
  - POST /v1/skills
  - GET /v1/skills
  - GET /v1/skills/<built-in function id>/versions
related:
  - ferramentas_e_agentes/agent_skills.md
  - managed_agents/configuracao_e_ambientes.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/agent-skills/overview
  - https://platform.claude.com/docs/en/api/skills
---

# Referência da Skills API

---

## Endpoints Disponíveis

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/v1/skills` | Cria uma nova Agent Skill na organização |
| `GET` | `/v1/skills` | Lista as Skills registradas |
| `GET` | `/v1/skills/{skill_id}` | Retorna detalhes e arquivos de uma Skill |
| `PUT` | `/v1/skills/{skill_id}` | Atualiza o conteúdo ou arquivos da Skill |
| `DELETE` | `/v1/skills/{skill_id}` | Remove uma Skill |
| `GET` | `/v1/skills/{skill_id}/versions` | Lista o histórico de versões da Skill |

---

## Veja Também

- [`../ferramentas_e_agentes/agent_skills.md`](../ferramentas_e_agentes/agent_skills.md)
