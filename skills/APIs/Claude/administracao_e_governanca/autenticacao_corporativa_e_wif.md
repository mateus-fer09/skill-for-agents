---
title: Autenticação Corporativa e Workload Identity Federation (WIF)
description: Configuração de autenticação sem chaves estáticas usando OIDC com AWS, Google Cloud, GitHub Actions, Kubernetes, Okta e App Attest.
topics:
  - wif
  - workload-identity
  - oidc
  - aws-iam
  - gcp
  - github-actions
  - okta
keywords:
  - Workload Identity Federation
  - WIF
  - OIDC
  - AWS IAM
  - GitHub Actions WIF
related:
  - primeiros_passos/autenticacao_e_seguranca.md
  - administracao_e_governanca/admin_api.md
  - referencia_api/endpoints_admin.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/manage-claude/workload-identity-federation
  - https://platform.claude.com/docs/pt-BR/manage-claude/wif-admin-api
  - https://platform.claude.com/docs/pt-BR/manage-claude/wif-reference
  - https://platform.claude.com/docs/pt-BR/manage-claude/wif-providers/aws
  - https://platform.claude.com/docs/pt-BR/manage-claude/wif-providers/gcp
  - https://platform.claude.com/docs/pt-BR/manage-claude/wif-providers/github-actions
  - https://platform.claude.com/docs/pt-BR/manage-claude/wif-providers/kubernetes
  - https://platform.claude.com/docs/pt-BR/manage-claude/wif-providers/okta
  - https://platform.claude.com/docs/pt-BR/manage-claude/app-attest
---

# Autenticação Corporativa e Workload Identity Federation (WIF)

O **Workload Identity Federation (WIF)** permite que cargas de trabalho em nuvem se autentiquem na Claude API usando tokens de identidade federados (OIDC / JWT) de curta duração, eliminando o risco de vazamento de chaves secretas permanentes.

---

## Provedores OIDC Suportados

1. **GitHub Actions**: Autenticação nativa em pipelines de CI/CD sem secrets estáticos.
2. **Amazon Web Services (AWS)**: Tokens assinados via AWS STS / IAM Role.
3. **Google Cloud Platform (GCP)**: Tokens de conta de serviço e Workload Identity do GKE.
4. **Kubernetes (K8s)**: Tokens de ServiceAccount (SAT).
5. **Okta e Ping Identity**: Federação corporativa baseada em provedores de identidade IAM.
6. **App Attest (Apple)**: Validação criptográfica de integridade para aplicativos iOS e macOS.

---

## Fluxo de Autenticação WIF

```
[Seu Servidor / GitHub Action] 
          │
          │ 1. Obtém OIDC Token nativo do provedor (ex: GitHub OIDC / AWS STS)
          ▼
[Anthropic WIF Token Exchange Endpoint]
          │
          │ 2. Valida emissor (Issuer), público (Audience) e Claims de permissão
          ▼
[Token de Sessão Temporário Anthropic (1 hora)]
          │
          │ 3. Utilizado no cabeçalho 'Authorization: Bearer <temp_token>'
          ▼
[Claude API]
```

---

## Configuração do Provedor WIF via Admin API

```bash
curl https://api.anthropic.com/v1/admin/workspaces/wrksp_01XFDUDYJgAACzvnptvVoYEL/wif_providers \
     -H "x-api-key: $ANTHROPIC_ADMIN_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{
       "name": "github-actions-main-repo",
       "issuer_url": "https://token.actions.githubusercontent.com",
       "audience": "https://api.anthropic.com",
       "attribute_mapping": {
         "repository": "claims.repository",
         "ref": "claims.ref"
       },
       "attribute_condition": "claims.repository == \"minha-empresa/meu-repo\" && claims.ref == \"refs/heads/main\""
     }'
```

---

## Veja Também

- [`../primeiros_passos/autenticacao_e_seguranca.md`](../primeiros_passos/autenticacao_e_seguranca.md)
- [`../administracao_e_governanca/admin_api.md`](../administracao_e_governanca/admin_api.md)
