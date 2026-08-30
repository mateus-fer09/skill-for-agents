---
title: Workload Identity Federation (OIDC / Nuvem)
description: Configuração de Federação de Identidade de Carga de Trabalho (OIDC) com AWS IAM, Google Cloud, Microsoft Azure, GitHub Actions, Kubernetes e SPIFFE.
topics:
  - workload-identity-federation
  - oidc
  - aws-iam
  - gcp-workload-identity
  - github-actions-oidc
keywords:
  - /v1/workload-identity/tokens
  - federation_rules
  - subject_token
  - token-exchange
  - AWS
  - GCP
  - Azure
  - GitHub Actions
related:
  - ../fundamentos/autenticacao_e_seguranca.md
  - ../administracao_e_infra/rbac_organizacoes_projetos.md
  - ../administracao_e_infra/terraform_e_automacao.md
source_scope:
  - https://developers.openai.com/api/docs/guides/workload-identity-federation.md
  - https://developers.openai.com/api/docs/guides/workload-identity-federation/aws.md
  - https://developers.openai.com/api/docs/guides/workload-identity-federation/github-actions.md
  - https://developers.openai.com/api/docs/guides/workload-identity-federation/google-cloud.md
  - https://developers.openai.com/api/docs/guides/workload-identity-federation/microsoft-azure.md
  - https://developers.openai.com/api/docs/guides/workload-identity-federation/kubernetes.md
---

# Workload Identity Federation (OIDC / Nuvem)

A **Workload Identity Federation** permite que aplicações executadas em nuvens públicas e pipelines CI/CD autentiquem-se na OpenAI API utilizando tokens de curta duração emitidos pelo seu próprio provedor de identidade (IdP), eliminando totalmente a necessidade de armazenar segredos estáticos (`OPENAI_API_KEY`) no código ou variáveis de ambiente de longa duração.

---

## 1. Provedores Suportados e Fontes de Tokens

| Provedor de Nuvem | Tipo de Token / Emissor OIDC | Caso de Uso Típico |
|---|---|---|
| **GitHub Actions** | Token OIDC JWT (`actions.githubusercontent.com`) | Execução de testes automatizados e evals em CI/CD |
| **AWS** | AWS Outbound Identity Federation / EKS IRSA | Lambdas, instâncias EC2 e pods EKS |
| **Google Cloud** | Google Service Account OIDC / GKE Workload Identity | Cloud Run, GKE, Cloud Functions |
| **Microsoft Azure** | Azure Managed Identity / AKS | Azure App Service, Azure Container Apps |
| **Kubernetes / SPIFFE** | SPIFFE JWT-SVID ou ServiceAccount token | Clusters Kubernetes privados on-premises ou híbridos |
| **Certificados X.509** | Mutual TLS (mTLS) Client Certificate | Servidores legados com certificados TLS emitidos por CA corporativa |

---

## 2. Exemplo de Configuração: GitHub Actions OIDC

### 2.1 Criar Regra de Federação na OpenAI (via Admin API ou Terraform)

```json
{
  "provider_name": "github-actions-main-repo",
  "issuer": "https://token.actions.githubusercontent.com",
  "audience": "https://api.openai.com/v1",
  "conditions": "claims.repository == 'minha-empresa/meu-repo' && claims.ref == 'refs/heads/main'",
  "project_id": "proj_prod_12345"
}
```

### 2.2 Workflow no GitHub Actions (`.github/workflows/evals.yml`)

```yaml
name: Executar Avaliações Automatizadas
on: [push]

permissions:
  id-token: write # Obrigatório para requisitar token OIDC
  contents: read

jobs:
  run-evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Obter Token OIDC e Trocar por Token OpenAI
        run: |
          # 1. Solicitar token OIDC do GitHub
          OIDC_TOKEN=$(curl -sLS "${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=https://api.openai.com/v1" -H "User-Agent: actions/oidc-client" -H "Authorization: Bearer ${ACTIONS_ID_TOKEN_REQUEST_TOKEN}" | jq -r '.value')
          
          # 2. Trocar por token de acesso da OpenAI
          OPENAI_ACCESS_TOKEN=$(curl -s https://api.openai.com/v1/workload-identity/tokens \
            -H "Content-Type: application/json" \
            -d "{
              \"grant_type\": \"urn:ietf:params:oauth:grant-type:token-exchange\",
              \"subject_token\": \"${OIDC_TOKEN}\",
              \"subject_token_type\": \"urn:ietf:params:oauth:token-type:jwt\",
              \"requested_token_type\": \"urn:ietf:params:oauth:token-type:access_token\"
            }" | jq -r '.access_token')
            
          # 3. Executar script com o token efêmero
          OPENAI_API_KEY=$OPENAI_ACCESS_TOKEN python scripts/run_evals.py
```

---

## 3. Expressões de Condição CEL (*Common Expression Language*)

As regras de federação suportam validação de claims com CEL:
```cel
claims.aud == "https://api.openai.com/v1" &&
claims.iss == "https://accounts.google.com" &&
claims.email.endsWith("@meudominio.com.br")
```

---

## 4. Referências Cruzadas

- [`../fundamentos/autenticacao_e_seguranca.md`](../fundamentos/autenticacao_e_seguranca.md)
- [`../administracao_e_infra/rbac_organizacoes_projetos.md`](../administracao_e_infra/rbac_organizacoes_projetos.md)
- [`../administracao_e_infra/terraform_e_automacao.md`](../administracao_e_infra/terraform_e_automacao.md)
