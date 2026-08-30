---
title: Referência da Admin API
description: Endpoints administrativos para controle de Organizations, Workspaces, Usuários, Chaves de API, Cost Reports, WIF Providers e Spend Limits.
topics:
  - admin-api
  - endpoints
  - governance
keywords:
  - GET /v1/admin/workspaces
  - POST /v1/admin/api_keys
  - GET /v1/admin/usage
  - GET /v1/admin/cost_report
related:
  - administracao_e_governanca/admin_api.md
  - administracao_e_governanca/monitoramento_custos_e_limites.md
source_scope:
  - https://platform.claude.com/docs/en/api/admin
---

# Referência da Admin API

---

## Principais Endpoints Administrativos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/v1/admin/organizations` | Detalhes da organização |
| `GET` | `/v1/admin/workspaces` | Lista todos os workspaces |
| `POST` | `/v1/admin/workspaces` | Cria um novo workspace |
| `GET` | `/v1/admin/users` | Lista usuários e funções |
| `POST` | `/v1/admin/invites` | Convida novo membro para a organização |
| `GET` | `/v1/admin/api_keys` | Lista chaves de API ativas |
| `POST` | `/v1/admin/api_keys` | Emite nova chave de API |
| `GET` | `/v1/admin/usage` | Métricas de uso agrupadas por modelo/data |
| `GET` | `/v1/admin/cost_report` | Relatório consolidado de faturamento |
| `GET` | `/v1/admin/rate_limits` | Limites de RPM/TPM configurados |

---

## Veja Também

- [`../administracao_e_governanca/admin_api.md`](../administracao_e_governanca/admin_api.md)
- [`../administracao_e_governanca/monitoramento_custos_e_limites.md`](../administracao_e_governanca/monitoramento_custos_e_limites.md)
