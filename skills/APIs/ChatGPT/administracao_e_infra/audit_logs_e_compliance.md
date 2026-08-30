---
title: Audit Logs, Retenção de Dados e Compliance
description: Consulta e exportação de Audit Logs da organização (/v1/organization/audit_logs), políticas de retenção de dados (Zero Data Retention) e conformidade.
topics:
  - audit-logs
  - compliance
  - data-retention
  - enterprise-security
keywords:
  - /v1/organization/audit_logs
  - Zero Data Retention
  - ZDR
  - audit_log_events
  - actor
  - resource
related:
  - ../administracao_e_infra/rbac_organizacoes_projetos.md
  - ../fundamentos/autenticacao_e_seguranca.md
  - ../referencia_api/admin_e_organizacao.md
source_scope:
  - https://developers.openai.com/api/docs/guides/your-data.md
  - https://developers.openai.com/api/reference/resources/organization/subresources/audit_logs.md
---

# Audit Logs, Retenção de Dados e Conformidade Corporativa

Para atender a exigências de auditoria interna, SOC 2, ISO 27001, HIPAA e LGPD/GDPR, a OpenAI fornece trilhas completas de auditoria imutáveis e controles rigorosos de retenção de dados.

---

## 1. Consulta de Audit Logs da Organização

O endpoint `/v1/organization/audit_logs` registra todas as ações administrativas realizadas por usuários, service accounts e integrações:

```python
from openai import OpenAI

client = OpenAI(api_key="sk-admin-YOUR_ADMIN_KEY")

# Consultar os últimos 50 eventos de auditoria
logs = client.organization.audit_logs.list(
    limit=50,
    event_types=[
        "api_key.created",
        "api_key.deleted",
        "user.added",
        "project.created"
    ]
)

for evento in logs.data:
    autor = evento.actor.get("user", {}).get("email") or evento.actor.get("type")
    print(f"[{evento.effective_at}] Evento: {evento.type} por {autor}")
```

### Principais Tipos de Eventos Registrados:
- `api_key.created`, `api_key.deleted`, `api_key.updated`
- `user.invited`, `user.added`, `user.deleted`, `user.role_updated`
- `project.created`, `project.updated`, `project.archived`
- `service_account.created`, `service_account.deleted`
- `rate_limit.updated`, `spend_limit.updated`

---

## 2. Política de Uso de Dados e Retenção (Data Privacy)

- **Seus Dados Não São Usados para Treinar Modelos**: A OpenAI não utiliza dados enviados via API corporativa (`/v1/responses`, `/v1/chat/completions`, etc.) para retreinamento de modelos base.
- **Zero Data Retention (ZDR)**: Organizações elegíveis podem solicitar a política ZDR, garantindo que nenhum dado de prompt ou resposta seja persistido em disco nos servidores da OpenAI após o processamento da requisição em memória.

---

## 3. Referências Cruzadas

- [`../administracao_e_infra/rbac_organizacoes_projetos.md`](../administracao_e_infra/rbac_organizacoes_projetos.md)
- [`../fundamentos/autenticacao_e_seguranca.md`](../fundamentos/autenticacao_e_seguranca.md)
- [`../referencia_api/admin_e_organizacao.md`](../referencia_api/admin_e_organizacao.md)
