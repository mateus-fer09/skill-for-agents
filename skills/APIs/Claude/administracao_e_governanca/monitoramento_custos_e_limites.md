---
title: Monitoramento, Custos e Limites de Gastos
description: APIs de medição de consumo, relatórios de custo, limites de taxa (rate limits), spend limits preventivos e Claude Code Analytics.
topics:
  - usage-api
  - cost-reporting
  - rate-limits
  - spend-limits
  - analytics
keywords:
  - Usage and Cost API
  - Rate Limits API
  - Spend Limits API
  - Claude Code Analytics
related:
  - fundamentos/modelos_e_precos.md
  - administracao_e_governanca/admin_api.md
  - referencia_api/endpoints_admin.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/manage-claude/usage-cost-api
  - https://platform.claude.com/docs/pt-BR/manage-claude/rate-limits-api
  - https://platform.claude.com/docs/pt-BR/manage-claude/spend-limits-api
  - https://platform.claude.com/docs/pt-BR/manage-claude/analytics-api
  - https://platform.claude.com/docs/pt-BR/manage-claude/claude-code-analytics-api
---

# Monitoramento, Custos e Limites de Gastos

A Claude Platform fornece um conjunto de endpoints dedicados para controle financeiro, observabilidade de tráfego e proteção contra estouro de orçamento.

---

## 1. API de Uso e Custo (`/v1/admin/usage` e `/v1/admin/cost_report`)

Permite extrair relatórios granulares de consumo por modelo, workspace, usuário e chave de API:

```bash
curl "https://api.anthropic.com/v1/admin/usage?start_time=2026-08-01T00:00:00Z&end_time=2026-08-30T00:00:00Z&group_by=model,workspace_id" \
     -H "x-api-key: $ANTHROPIC_ADMIN_API_KEY" \
     -H "anthropic-version: 2023-06-01"
```

---

## 2. API de Limites de Gastos (Spend Limits API)

Configure limites automáticos mensais em dólares para impedir cobranças inesperadas:

- **Soft Limit (Alerta)**: Envia email e notificação webhook quando atingido (ex: 80% do orçamento).
- **Hard Limit (Bloqueio)**: Interrompe novas requisições daquele workspace até o início do próximo ciclo de faturamento.

---

## 3. API de Limites de Taxa (Rate Limits API)

Consulte quotas ativas em tempo real de Requisições por Minuto (RPM), Tokens por Minuto (TPM) e Tokens por Dia (TPD):

```bash
curl "https://api.anthropic.com/v1/admin/rate_limits" \
     -H "x-api-key: $ANTHROPIC_ADMIN_API_KEY" \
     -H "anthropic-version: 2023-06-01"
```

---

## Veja Também

- [`../fundamentos/modelos_e_precos.md`](../fundamentos/modelos_e_precos.md)
- [`../administracao_e_governanca/admin_api.md`](../administracao_e_governanca/admin_api.md)
- [`../referencia_api/headers_versoes_e_limites.md`](../referencia_api/headers_versoes_e_limites.md)
