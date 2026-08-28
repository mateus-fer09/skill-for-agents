---
title: "Admin API: Governança Corporativa, Projetos, Chaves e Monitoramento de Uso"
description: "Guia completo da Admin API da OpenAI. Gestão programática de organizações, projetos isolados (/v1/organization/projects), chaves de API restritas, contas de serviço, monitoramento detalhado de uso (/v1/organization/usage/*), auditoria de logs e alocação de limites de consumo."
topics: ["admin-api", "organizacoes", "projetos", "service-accounts", "usage-api", "audit-logs", "cost-management"]
keywords: ["/v1/organization/projects", "/v1/organization/usage/completions", "admin_key", "OPENAI_ADMIN_KEY", "service_accounts", "audit_logs"]
source_scope: "OpenAI API Docs: Guides > Admin API, Enterprise Governance, Project Keys & Usage Limits"
---

# Admin API: Governança Corporativa, Projetos, Chaves e Monitoramento de Uso

A **Admin API** fornece recursos corporativos para gerenciar organizações, segregar ambientes com Projetos (*Projects*), emitir chaves de API com menor privilégio para Contas de Serviço (*Service Accounts*) e auditar o consumo de tokens e custos de forma programática.

---

## 1. Autenticação de Nível Administrativo

As chamadas para endpoints administrativos exigem uma **Admin API Key** (emitida com privilégios de Administrador da Organização):

```bash
# Exportando a chave administrativa
export OPENAI_ADMIN_KEY="sk-admin-xyz987..."
```

---

## 2. Gestão Programática de Projetos (`/v1/organization/projects`)

Projetos permitem isolar dados, limites de taxa (RPM/TPM), logs e chaves de API entre diferentes equipes ou ambientes (ex: `staging`, `production-us`, `finance-squad`).

### 2.1. Criar e Listar Projetos em Python

```python
import os
from openai import OpenAI

# Inicialização com a chave administrativa de organização
admin_client = OpenAI(
    api_key=os.environ.get("OPENAI_ADMIN_KEY")
)

# 1. Criar um novo projeto isolado
novo_projeto = admin_client.organization.projects.create(
    name="Squad-Atendimento-AI"
)
print(f"Projeto criado: {novo_projeto.id} - {novo_projeto.name}")

# 2. Listar projetos existentes
projetos = admin_client.organization.projects.list()
for p in projetos.data:
    print(f"ID: {p.id} | Nome: {p.name} | Status: {p.status} | Criado em: {p.created_at}")

# 3. Criar uma Conta de Serviço e Chave de API para o Projeto
service_account = admin_client.organization.projects.service_accounts.create(
    project_id=novo_projeto.id,
    name="bot-atendimento-svc"
)
print(f"Service Account criada: {service_account.id}")

# A chave secreta é retornada apenas uma vez na criação!
api_key = service_account.api_key.value
print(f"Chave de API do Projeto: {api_key}")
```

---

## 3. Usage API: Monitoramento Detalhado de Consumo

A Usage API permite auditar o volume de tokens e requisições consumidos por modelo, projeto ou usuário em um intervalo de datas.

### 3.1. Endpoints de Uso
- `GET /v1/organization/usage/completions`: Consumo de tokens em Chat e Text Generation.
- `GET /v1/organization/usage/embeddings`: Consumo de tokens em Embeddings.
- `GET /v1/organization/usage/images`: Volume de imagens geradas via DALL-E.
- `GET /v1/organization/usage/audio_speeches`: Caracteres sintetizados via TTS.
- `GET /v1/organization/usage/audio_transcriptions`: Minutos de áudio transcritos via Whisper.

### 3.2. Consulta de Consumo via Python

```python
import os
from openai import OpenAI
from datetime import datetime, timedelta

admin_client = OpenAI(api_key=os.environ.get("OPENAI_ADMIN_KEY"))

# Consulta o consumo das últimas 24 horas
start_time = int((datetime.now() - timedelta(days=1)).timestamp())

usage_completions = admin_client.organization.usage.completions.list(
    start_time=start_time,
    bucket_width="1h", # '1m', '1h' ou '1d'
    group_by=["model", "project_id"]
)

for bucket in usage_completions.data:
    print(f"Horário: {bucket.start_time} -> Total Tokens: {bucket.results[0].input_tokens + bucket.results[0].output_tokens}")
```

---

## 4. Audit Logs: Trilha de Auditoria de Segurança

O endpoint `/v1/organization/audit_logs` fornece rastreabilidade de todas as ações administrativas executadas na organização (criação de chaves, alterações de permissões de usuários, exclusão de projetos).

```python
audit_logs = admin_client.organization.audit_logs.list(limit=10)

for log in audit_logs.data:
    print(f"[{log.created_at}] Ação: {log.action} | Ator: {log.actor.type} ({log.actor.user.email if log.actor.user else 'API Key'})")
```

---

## 5. Boas Práticas de Governança Corporativa

1. **Nunca utilize chaves de usuário em ambientes produtivos:** Crie *Service Accounts* atreladas a Projetos específicos.
2. **Defina Limites de Consumo Mensal por Projeto:** Restrinja o orçamento máximo por equipe para evitar custos imprevistos.
3. **Audite Chaves Inativas Periodicamente:** Revogue automaticamente chaves de API sem atividade por mais de 90 dias via script com a Admin API.
