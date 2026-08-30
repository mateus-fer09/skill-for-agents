---
title: Cabeçalhos HTTP, Versões de API e Níveis de Serviço (Tiers)
description: Guia de cabeçalhos padrão e beta da Anthropic, versionamento formal, faixas de IP e limites de taxa por Tier (Tier 1 a 5).
topics:
  - headers
  - versioning
  - service-tiers
  - rate-limits
  - ip-addresses
keywords:
  - anthropic-version
  - anthropic-beta
  - service tiers
  - Tier 1 Tier 5
  - rate limits RPM TPM
related:
  - primeiros_passos/autenticacao_e_seguranca.md
  - referencia_api/erros_e_codigos_de_status.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/api/versioning
  - https://platform.claude.com/docs/pt-BR/api/beta-headers
  - https://platform.claude.com/docs/pt-BR/api/service-tiers
  - https://platform.claude.com/docs/pt-BR/api/rate-limits
  - https://platform.claude.com/docs/pt-BR/api/ip-addresses
  - https://platform.claude.com/docs/pt-BR/api/supported-regions
---

# Cabeçalhos HTTP, Versões de API e Níveis de Serviço (Tiers)

---

## 1. Versões de API (`anthropic-version`)

A versão atual e canônica da Claude API é:
- `anthropic-version: 2023-06-01`

Alterações retrocompatíveis são adicionadas de forma contínua sem quebra de versão. Alterações que quebrem contratos de dados serão lançadas sob novas datas formais.

---

## 2. Catálogo de Cabeçalhos Beta (`anthropic-beta`)

Para habilitar recursos em prévia ou novos motores da plataforma, passe os identificadores no cabeçalho `anthropic-beta` (separados por vírgula):

| Flag Beta | Recurso Habilitado |
|---|---|
| `prompt-caching-2024-07-31` | Habilita blocos `cache_control` para Prompt Caching |
| `message-batches-2024-09-24` | Habilita a Message Batches API com 50% de desconto |
| `token-efficient-tools-2025-02-19` | Otimização de contagem de tokens para esquemas de ferramentas |
| `files-2025-01-01` | Habilita a Files API para upload persistente de documentos |
| `managed-agents-2025-02-01` | Habilita a plataforma de Anthropic Managed Agents |
| `skills-2025-01-01` | Habilita o registro e gestão de Agent Skills via API |

---

## 3. Níveis de Serviço (Usage Tiers) e Quotas

A quota de Requisições por Minuto (RPM) e Tokens por Minuto (TPM) aumenta automaticamente conforme o histórico de pagamento da conta:

| Nível (Tier) | Requisito de Depósito / Faturamento | Limite RPM Médio | Limite TPM Médio |
|---|---|---|---|
| **Tier 1** | Depósito inicial de $5 | 50 RPM | 50.000 TPM |
| **Tier 2** | Pagamento acumulado de $40 | 1.000 RPM | 100.000 TPM |
| **Tier 3** | Pagamento acumulado de $200 | 2.000 RPM | 200.000 TPM |
| **Tier 4** | Pagamento acumulado de $400 | 4.000 RPM | 400.000 TPM |
| **Tier 5 / Enterprise** | Pagamento acumulado de $1.000+ ou contrato corporativo | Customizado (10k+ RPM) | Customizado (milhões de TPM) |

---

## Veja Também

- [`../primeiros_passos/autenticacao_e_seguranca.md`](../primeiros_passos/autenticacao_e_seguranca.md)
- [`../referencia_api/erros_e_codigos_de_status.md`](../referencia_api/erros_e_codigos_de_status.md)
