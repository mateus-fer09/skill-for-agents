---
title: Autenticação, Segurança e Chaves de Acesso
description: Métodos de autenticação na OpenAI API, tipos de chaves (Project Keys, Admin Keys, Restricted Keys), mTLS, IP allowlists e Workload Identity Federation.
topics:
  - authentication
  - api-keys
  - admin-keys
  - workload-identity-federation
  - mtls
keywords:
  - Authorization
  - Bearer
  - OPENAI_API_KEY
  - Project API Keys
  - Admin API Keys
  - OIDC
  - Workload Identity
related:
  - ../fundamentos/overview_e_arquitetura.md
  - ../administracao_e_infra/workload_identity_federation.md
  - ../administracao_e_infra/rbac_organizacoes_projetos.md
source_scope:
  - https://developers.openai.com/api/docs/guides/workload-identity-federation.md
  - https://developers.openai.com/api/docs/guides/admin-apis.md
  - https://developers.openai.com/api/docs/guides/mutual-tls.md
  - https://developers.openai.com/api/docs/guides/ip-allowlist.md
---

# Autenticação, Segurança e Chaves de Acesso

A segurança na OpenAI API baseia-se no princípio do menor privilégio (*least privilege*), suportando múltiplos mecanismos de autenticação e credenciais seguras para ambientes de desenvolvimento e produção.

---

## 1. Tipos de Chaves de API

### 1.1 Project API Keys (Padrão Recomendado)
- **Formato**: Chaves com prefixo `sk-proj-...` vinculadas exclusivamente a um **Projeto** específico dentro de uma organização.
- **Vantagens**:
  - Limitam o acesso aos recursos, vector stores e dados daquele projeto.
  - Permitem definir permissões granulares por modelo, ferramenta e taxa de gasto.
  - Não expõem dados organizacionais ou faturamento global.

### 1.2 Admin API Keys (Automação de Gestão)
- **Formato**: Chaves com prefixo `sk-admin-...`.
- **Finalidade**: Gerenciar usuários, convites, grupos, projetos, service accounts e consultar Audit Logs via Admin API.
- **Segurança**: Nunca utilize Admin API Keys em código de aplicação ou cliente final.

### 1.3 Restricted API Keys
- Chaves configuradas com permissões de somente leitura ou restritas a endpoints específicos (ex.: apenas `/v1/responses`, sem permissão de `/v1/fine_tuning`).

---

## 2. Configuração de Variáveis de Ambiente

Por padrão, todos os SDKs oficiais buscam a chave na variável de ambiente `OPENAI_API_KEY`:

```bash
# Linux / macOS
export OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export OPENAI_ORG_ID="org-xxxxxxxxxxxxxxxxxxxxxxxx"      # Opcional
export OPENAI_PROJECT_ID="proj_xxxxxxxxxxxxxxxxxxxxxxxx" # Opcional

# Windows PowerShell
$env:OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:OPENAI_ORG_ID="org-xxxxxxxxxxxxxxxxxxxxxxxx"
$env:OPENAI_PROJECT_ID="proj_xxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## 3. Workload Identity Federation (Sem Chaves Estáticas)

Para ambientes em nuvem (AWS, GCP, Azure, Kubernetes, GitHub Actions, SPIFFE), a OpenAI suporta **Workload Identity Federation**:

```
[ Provedor de Identidade Nuvem ] ---> Emite JWT OIDC / Certificado X.509
              |
              v
[ OpenAI Token Exchange API ]   ---> Troca por token de acesso efêmero (1 hora)
              |
              v
[ OpenAI API Request ]          ---> Autenticação segura sem segredos estáticos no código
```

### Exemplo de Troca de Token (Token Exchange via cURL)

```bash
curl -X POST https://api.openai.com/v1/workload-identity/tokens \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
    "subject_token": "eyJhbGciOiJSUzI1NiIs...",
    "subject_token_type": "urn:ietf:params:oauth:token-type:jwt",
    "requested_token_type": "urn:ietf:params:oauth:token-type:access_token",
    "scope": "https://api.openai.com/v1/responses"
  }'
```

Para a configuração detalhada de provedores (AWS IAM, GCP Service Accounts, GitHub Actions OIDC), consulte [`../administracao_e_infra/workload_identity_federation.md`](../administracao_e_infra/workload_identity_federation.md).

---

## 4. Mutual TLS (mTLS) e IP Allowlist

- **Mutual TLS (mTLS)**: Permite estabelecer um canal criptografado onde o cliente apresenta um certificado X.509 validado pela OpenAI.
- **IP Allowlists**: Permite restringir as chamadas da API exclusivamente a blocos CIDR autorizados da sua infraestrutura corporativa.

---

## 5. Boas Práticas de Segurança

> [!CAUTION]
> 1. **Nunca versione chaves de API no Git** nem as inclua diretamente no código-fonte.
> 2. **Nunca use chaves com escopo de organização em aplicações front-end.** Utilize sempre um backend intermediário ou tokens efêmeros da Realtime API.
> 3. **Rotacione chaves periodicamente** e revogue imediatamente chaves comprometidas.
> 4. **Defina Spend Limits (limites de gasto mensal)** na organização e nos projetos.

---

## 6. Referências Cruzadas

- [`../fundamentos/overview_e_arquitetura.md`](../fundamentos/overview_e_arquitetura.md)
- [`../administracao_e_infra/workload_identity_federation.md`](../administracao_e_infra/workload_identity_federation.md)
- [`../administracao_e_infra/rbac_organizacoes_projetos.md`](../administracao_e_infra/rbac_organizacoes_projetos.md)
