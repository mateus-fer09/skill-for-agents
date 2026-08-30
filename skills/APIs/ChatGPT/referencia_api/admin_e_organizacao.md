---
title: Referência de API — Administração, Projetos & RBAC
description: Especificação técnica dos endpoints administrativos /v1/organization/projects, /v1/organization/users, /v1/organization/service_accounts e /v1/organization/audit_logs.
topics:
  - api-reference
  - admin-api-reference
  - rbac-reference
  - organization-api
keywords:
  - /v1/organization/projects
  - /v1/organization/users
  - /v1/organization/invites
  - /v1/organization/audit_logs
  - Admin API
related:
  - ../administracao_e_infra/rbac_organizacoes_projetos.md
  - ../administracao_e_infra/audit_logs_e_compliance.md
  - ../administracao_e_infra/terraform_e_automacao.md
source_scope:
  - https://developers.openai.com/api/reference/resources/organization.md
  - https://developers.openai.com/api/reference/resources/projects.md
---

# Referência de API — Administração, Projetos & RBAC

Endpoints acessíveis via **Admin API Key** (`sk-admin-...`) para automação de governança corporativa.

---

## 1. Gestão de Projetos (`/v1/organization/projects`)

- `POST /v1/organization/projects`: Cria um novo projeto isolado.
- `GET /v1/organization/projects`: Lista projetos da organização.
- `GET /v1/organization/projects/{project_id}`: Consulta detalhes do projeto.
- `POST /v1/organization/projects/{project_id}`: Atualiza nome ou status (`active`, `archived`).

---

## 2. Service Accounts do Projeto (`/v1/organization/projects/{project_id}/service_accounts`)

- `POST /v1/organization/projects/{project_id}/service_accounts`: Cria service account e gera chave de API vinculada.
- `GET /v1/organization/projects/{project_id}/service_accounts`: Lista service accounts.
- `DELETE /v1/organization/projects/{project_id}/service_accounts/{service_account_id}`: Revoga service account e todas as suas chaves.

---

## 3. Usuários e Convites Organizacionais (`/v1/organization/*`)

- `POST /v1/organization/invites`: Envia convite por e-mail com papel definido (`owner`, `reader`).
- `GET /v1/organization/users`: Lista membros da organização.
- `POST /v1/organization/users/{user_id}`: Atualiza o papel do usuário.
- `DELETE /v1/organization/users/{user_id}`: Remove o usuário da organização.

---

## 4. Auditoria e Uso (`/v1/organization/audit_logs`)

- `GET /v1/organization/audit_logs`: Consulta eventos de auditoria com filtros por autor, tipo de recurso e data.

---

## 5. Referências Cruzadas

- [`../administracao_e_infra/rbac_organizacoes_projetos.md`](../administracao_e_infra/rbac_organizacoes_projetos.md)
- [`../administracao_e_infra/audit_logs_e_compliance.md`](../administracao_e_infra/audit_logs_e_compliance.md)
- [`../administracao_e_infra/terraform_e_automacao.md`](../administracao_e_infra/terraform_e_automacao.md)
