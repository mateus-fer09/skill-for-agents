---
title: Referência da Compliance API
description: Endpoints de auditoria, exportação de conversas, transcrições de sessão e feed de atividades corporativas.
topics:
  - compliance-api
  - audit-endpoints
keywords:
  - GET /v1/compliance/activities
  - GET /v1/compliance/sessions
  - GET /v1/compliance/content
related:
  - administracao_e_governanca/compliance_e_auditoria.md
source_scope:
  - https://platform.claude.com/docs/en/api/compliance
---

# Referência da Compliance API

---

## Endpoints de Conformidade e Auditoria

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/v1/compliance/activities` | Lista eventos imutáveis do feed de auditoria |
| `GET` | `/v1/compliance/content/chats` | Exporta histórico de conversas |
| `GET` | `/v1/compliance/content/projects` | Exporta dados de projetos |
| `GET` | `/v1/compliance/sessions` | Exporta transcrições de sessões de agentes |

---

## Veja Também

- [`../administracao_e_governanca/compliance_e_auditoria.md`](../administracao_e_governanca/compliance_e_auditoria.md)
