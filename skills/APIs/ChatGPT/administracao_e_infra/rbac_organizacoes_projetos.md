---
title: RBAC, Organizações, Projetos e Service Accounts
description: Gestão de acesso baseado em papéis (RBAC), controle hierárquico de Organizações e Projetos, Service Accounts e permissões na OpenAI API.
topics:
  - rbac
  - organization-management
  - projects
  - service-accounts
  - access-control
keywords:
  - /v1/organization/projects
  - /v1/organization/users
  - service_accounts
  - project_api_keys
  - roles
related:
  - ../fundamentos/autenticacao_e_seguranca.md
  - ../administracao_e_infra/workload_identity_federation.md
  - ../administracao_e_infra/terraform_e_automacao.md
  - ../referencia_api/admin_e_organizacao.md
source_scope:
  - https://developers.openai.com/api/docs/guides/rbac.md
  - https://developers.openai.com/api/reference/resources/organization.md
  - https://developers.openai.com/api/reference/resources/projects.md
---

# RBAC, Organizações, Projetos e Service Accounts

A OpenAI disponibiliza um modelo robusto de **Controle de Acesso Baseado em Papéis (RBAC)** estruturado em hierarquia de Organização e Projetos.

---

## 1. Hierarquia de Governança

```
[ Organização (Organization) ]
  ├── Faturamento Global & Spend Limits
  ├── Usuários Organizacionais & Grupos
  ├── Audit Logs
  └── [ Projetos (Projects) ]
        ├── Project API Keys (sk-proj-...)
        ├── Service Accounts (Serviços e CI/CD)
        ├── Vector Stores e Arquivos Isolados
        ├── Limites de Modelos Autorizados
        └── Limites de Taxa e Gastos Específicos
```

---

## 2. Gestão de Projetos e Service Accounts via Admin API

Utilizando uma **Admin API Key** (`sk-admin-...`), é possível automatizar o provisionamento de ambientes:

### 2.1 Criando um Novo Projeto

```python
from openai import OpenAI

client = OpenAI(api_key="sk-admin-YOUR_ADMIN_KEY")

projeto = client.organization.projects.create(
    name="Ambiente-Producao-App-Mobile"
)

print(f"Projeto criado com ID: {projeto.id}")
```

### 2.2 Criando uma Service Account para o Projeto

```python
service_account = client.organization.projects.service_accounts.create(
    project_id=projeto.id,
    name="sa-backend-api"
)

print(f"Service Account ID: {service_account.id}")
print(f"Chave de API gerada: {service_account.api_key.value}")
```

---

## 3. Papéis Padrão (Default Roles)

| Nível | Papel | Permissões |
|---|---|---|
| **Organização** | `owner` | Acesso total a membros, faturamento, projetos e chaves de admin. |
| **Organização** | `reader` | Visualização de métricas e estrutura sem poder alterar configurações. |
| **Projeto** | `owner` | Gestão de membros, service accounts, chaves de API e limites do projeto. |
| **Projeto** | `member` | Permissão para consumir modelos e endpoints vinculados ao projeto. |

---

## 4. Referências Cruzadas

- [`../fundamentos/autenticacao_e_seguranca.md`](../fundamentos/autenticacao_e_seguranca.md)
- [`../administracao_e_infra/workload_identity_federation.md`](../administracao_e_infra/workload_identity_federation.md)
- [`../administracao_e_infra/terraform_e_automacao.md`](../administracao_e_infra/terraform_e_automacao.md)
- [`../referencia_api/admin_e_organizacao.md`](../referencia_api/admin_e_organizacao.md)
