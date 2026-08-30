---
title: Compliance API, Auditoria e Retenção de Dados
description: Feed de auditoria de conformidade, exportação de conversas e projetos, transcrições de sessão, residência de dados e políticas de privacidade.
topics:
  - compliance-api
  - audit-feed
  - data-retention
  - data-residency
  - access-transparency
keywords:
  - Compliance API
  - activity feed
  - session transcripts
  - data residency
  - GDPR SOC2
related:
  - administracao_e_governanca/admin_api.md
  - referencia_api/endpoints_compliance.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/manage-claude/compliance-api
  - https://platform.claude.com/docs/pt-BR/manage-claude/compliance-api-access
  - https://platform.claude.com/docs/pt-BR/manage-claude/compliance-activity-feed
  - https://platform.claude.com/docs/pt-BR/manage-claude/compliance-content-data
  - https://platform.claude.com/docs/pt-BR/manage-claude/compliance-sessions
  - https://platform.claude.com/docs/pt-BR/manage-claude/compliance-org-data
  - https://platform.claude.com/docs/pt-BR/manage-claude/data-residency
  - https://platform.claude.com/docs/pt-BR/manage-claude/api-and-data-retention
  - https://platform.claude.com/docs/pt-BR/manage-claude/access-transparency
---

# Compliance API, Auditoria e Retenção de Dados

Para atender a exigências rigorosas de conformidade regulatória (SOC 2 Type II, HIPAA, GDPR, ISO 27001), a Anthropic disponibiliza a **Compliance API**.

---

## 1. Feed de Atividades de Auditoria (Activity Feed)

Gera um log imutável de todas as ações de segurança e administrativas da organização:
- Criação e exclusão de chaves de API.
- Adição e remoção de membros.
- Alterações em políticas de WIF e sandboxes.
- Exportações de dados.

```bash
curl "https://api.anthropic.com/v1/compliance/activities?limit=100" \
     -H "x-api-key: $ANTHROPIC_COMPLIANCE_KEY" \
     -H "anthropic-version: 2023-06-01"
```

---

## 2. Exportação de Dados e Transcrições de Sessão

Permite que equipes de segurança exportem transcrições completas de chats, arquivos e logs de sessões de Managed Agents para sistemas corporativos de SIEM / DLP.

---

## 3. Políticas de Retenção e Residência de Dados (Data Residency)

- **Não Treinamento em Dados de Clientes da API**: A Anthropic **não utiliza** dados enviados para a API ou respostas geradas para treinar seus modelos fundamentais.
- **Residência de Dados Geográfica**: Clientes corporativos podem restringir o processamento e retenção de dados a regiões geográficas específicas (ex: União Europeia ou Estados Unidos).

---

## Veja Também

- [`../administracao_e_governanca/admin_api.md`](../administracao_e_governanca/admin_api.md)
- [`../referencia_api/endpoints_compliance.md`](../referencia_api/endpoints_compliance.md)
