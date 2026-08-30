---
title: Admin API e Gerenciamento de Organização
description: Guia da Admin API para gerenciamento programático de usuários, workspaces, convites e chaves de API centralizadas.
topics:
  - admin-api
  - user-management
  - workspaces
  - api-keys
keywords:
  - Admin API
  - workspaces
  - user roles
  - admin api keys
related:
  - administracao_e_governanca/autenticacao_corporativa_e_wif.md
  - administracao_e_governanca/monitoramento_custos_e_limites.md
  - referencia_api/endpoints_admin.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/manage-claude/admin-api
  - https://platform.claude.com/docs/pt-BR/manage-claude/user-management
  - https://platform.claude.com/docs/pt-BR/manage-claude/workspaces
  - https://platform.claude.com/docs/pt-BR/manage-claude/admin-api-keys
---

# Admin API e Gerenciamento de Organização

A **Admin API** da Anthropic permite que administradores de TI e equipes de DevOps gerenciem programaticamente a estrutura organizacional, membros da equipe, workspaces isolados e chaves de acesso.

---

## 1. Workspaces e Isolamento de Recursos

Workspaces dividem sua organização em ambientes com quotas, chaves de API e membros separados:

### Criando um Workspace via Admin API:

```bash
curl https://api.anthropic.com/v1/admin/workspaces \
     -H "x-api-key: $ANTHROPIC_ADMIN_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{
       "name": "Equipe-Engenharia-Data",
       "display_color": "blue"
     }'
```

---

## 2. Gerenciamento de Usuários e Funções (Roles)

Funções disponíveis na organização:
- `primary_owner`: Proprietário principal da conta com permissões totais de faturamento e administração.
- `owner`: Administrador da organização.
- `admin`: Administrador com gestão de chaves e membros.
- `member`: Usuário padrão com acesso aos workspaces designados.

---

## 3. Emissão e Revogação Centralizada de Chaves

A Admin API permite auditar e criar chaves de API sem precisar acessar manualmente o painel web:

```bash
curl https://api.anthropic.com/v1/admin/workspaces/wrksp_01XFDUDYJgAACzvnptvVoYEL/api_keys \
     -H "x-api-key: $ANTHROPIC_ADMIN_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{
       "name": "ci-cd-pipeline-key"
     }'
```

---

## Veja Também

- [`../administracao_e_governanca/autenticacao_corporativa_e_wif.md`](../administracao_e_governanca/autenticacao_corporativa_e_wif.md)
- [`../administracao_e_governanca/monitoramento_custos_e_limites.md`](../administracao_e_governanca/monitoramento_custos_e_limites.md)
- [`../referencia_api/endpoints_admin.md`](../referencia_api/endpoints_admin.md)
