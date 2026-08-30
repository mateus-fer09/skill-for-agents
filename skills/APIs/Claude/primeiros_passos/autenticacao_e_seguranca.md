---
title: Autenticação e Segurança da API
description: Headers de autenticação, versionamento, beta flags, gerenciamento seguro de credenciais e boas práticas de segurança.
topics:
  - autenticacao
  - api-keys
  - headers
  - seguranca
keywords:
  - x-api-key
  - anthropic-version
  - anthropic-beta
  - credential rotation
related:
  - primeiros_passos/quickstart.md
  - referencia_api/headers_versoes_e_limites.md
  - administracao_e_governanca/autenticacao_corporativa_e_wif.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/manage-claude/authentication
  - https://platform.claude.com/docs/pt-BR/api/beta-headers
---

# Autenticação e Segurança da API

Todas as requisições enviadas para a Claude API da Anthropic devem ser autenticadas via HTTPS utilizando cabeçalhos HTTP específicos.

---

## Cabeçalhos HTTP Obrigatórios

| Cabeçalho | Obrigatório? | Descrição | Exemplo |
|---|---|---|---|
| `x-api-key` | **Sim** | Chave secreta de API da Anthropic | `sk-ant-api03-abcdef123456...` |
| `anthropic-version` | **Sim** | Versão formal do protocolo da API | `2023-06-01` |
| `content-type` | **Sim** | Tipo do corpo da requisição | `application/json` |
| `anthropic-beta` | *Opcional* | Habilita recursos experimentais ou betas | `prompt-caching-2024-07-31,token-efficient-tools-2025-02-19` |

---

## Formas de Autenticação

### 1. API Keys Individuais (Padrão)
Geradas no Console Anthropic no nível de Workspace. Indicadas para desenvolvimento, automações e servidores backend.

```bash
curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{ ... }'
```

### 2. Admin API Keys
Chaves com permissões administrativas elevadas para gerenciamento de organizações, usuários, workspaces e faturamento.
- Cabeçalho utilizado: `x-api-key: sk-ant-admin01-...`

### 3. Workload Identity Federation (WIF)
Para ambientes corporativos que eliminam o uso de chaves estáticas de longa duração. Permite trocar tokens OIDC de provedores de nuvem (AWS IAM, Google Cloud, GitHub Actions, Kubernetes, Okta) por tokens de sessão temporários.
- Consulte detalhes em [`../administracao_e_governanca/autenticacao_corporativa_e_wif.md`](../administracao_e_governanca/autenticacao_corporativa_e_wif.md).

---

## Boas Práticas de Segurança e Conformidade

1. **Nunca Exponha Chaves no Frontend**: Nunca utilize a chave de API diretamente em código client-side (React, Vue, mobile apps, extensões de navegador). Todas as requisições devem passar por um servidor backend intermediário.
2. **Utilize Variáveis de Ambiente**: Carregue chaves a partir de variáveis de ambiente (`process.env.ANTHROPIC_API_KEY` ou `os.environ["ANTHROPIC_API_KEY"]`) ou gerenciadores de segredos (AWS Secrets Manager, GCP Secret Manager, Vault).
3. **Limite de Escopo por Workspace**: Crie workspaces separados para ambientes de `desenvolvimento`, `staging` e `produção` com chaves distintas.
4. **Estabeleça Rotação Periódica**: Implemente rotação de chaves a cada 90 dias ou imediatamente em caso de suspeita de comprometimento.
5. **Configure Spend Limits**: Defina limites mensais de gastos no Console Anthropic para prevenir custos acidentais causados por loops infinitos de agentes.

---

## Veja Também

- [`../primeiros_passos/quickstart.md`](../primeiros_passos/quickstart.md)
- [`../administracao_e_governanca/autenticacao_corporativa_e_wif.md`](../administracao_e_governanca/autenticacao_corporativa_e_wif.md)
- [`../referencia_api/headers_versoes_e_limites.md`](../referencia_api/headers_versoes_e_limites.md)
