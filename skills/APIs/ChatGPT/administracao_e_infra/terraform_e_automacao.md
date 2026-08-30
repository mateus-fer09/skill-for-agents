---
title: Provedor Oficial Terraform da OpenAI
description: Gestão de infraestrutura como código (IaC) com o provedor oficial OpenAI Terraform (projetos, permissões, limites de gasto, service accounts e rate limits).
topics:
  - terraform
  - infrastructure-as-code
  - iac
  - openai-terraform-provider
keywords:
  - terraform
  - openai_project
  - openai_project_service_account
  - openai_project_user
  - spend_limits
related:
  - ../administracao_e_infra/rbac_organizacoes_projetos.md
  - ../administracao_e_infra/workload_identity_federation.md
source_scope:
  - https://developers.openai.com/api/docs/guides/terraform.md
  - https://developers.openai.com/api/docs/guides/terraform/projects-and-access.md
  - https://developers.openai.com/api/docs/guides/terraform/service-accounts.md
  - https://developers.openai.com/api/docs/guides/terraform/project-controls.md
  - https://developers.openai.com/api/docs/guides/terraform/rate-limits-and-spend.md
---

# Provedor Oficial Terraform da OpenAI (IaC)

O **OpenAI Terraform Provider** permite gerenciar toda a infraestrutura e governança da OpenAI como código (*Infrastructure as Code - IaC*), automatizando o provisionamento de projetos, atribuição de papéis, service accounts e limites de gastos.

---

## 1. Configuração do Provedor (`main.tf`)

```hcl
terraform {
  required_providers {
    openai = {
      source  = "openai/openai"
      version = "~> 1.0"
    }
  }
}

provider "openai" {
  api_key = var.openai_admin_key # sk-admin-...
}
```

---

## 2. Exemplo Completo: Provisionando Projeto, Service Account e Alertas de Gasto

```hcl
# 1. Criar Projeto Isolado
resource "openai_project" "app_rag_producao" {
  name = "App-RAG-Producao"
}

# 2. Criar Service Account para a aplicação
resource "openai_project_service_account" "sa_backend" {
  project_id = openai_project.app_rag_producao.id
  name       = "sa-backend-rag"
}

# 3. Vincular Usuário Desenvolvedor ao Projeto
resource "openai_project_user" "dev_lead" {
  project_id = openai_project.app_rag_producao.id
  user_id    = "usr_123456789"
  role       = "member"
}

# 4. Configurar Limites de Gasto Mensal
resource "openai_project_spend_limit" "limite_mensal" {
  project_id       = openai_project.app_rag_producao.id
  hard_limit_usd   = 500
  soft_limit_usd   = 400
}

# 5. Restringir Modelos Autorizados no Projeto
resource "openai_project_model_access" "modelos_permitidos" {
  project_id = openai_project.app_rag_producao.id
  allowed_models = [
    "gpt-5.6",
    "gpt-5-mini",
    "text-embedding-3-small"
  ]
}
```

---

## 3. Comandos de Aplicação

```bash
# Inicializar provedor
terraform init

# Visualizar plano de execução
terraform plan

# Aplicar alterações na organização OpenAI
terraform apply -auto-approve
```

---

## 4. Referências Cruzadas

- [`../administracao_e_infra/rbac_organizacoes_projetos.md`](../administracao_e_infra/rbac_organizacoes_projetos.md)
- [`../administracao_e_infra/workload_identity_federation.md`](../administracao_e_infra/workload_identity_federation.md)
- [`../referencia_api/admin_e_organizacao.md`](../referencia_api/admin_e_organizacao.md)
