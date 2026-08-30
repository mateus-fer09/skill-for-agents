---
title: Referência de API — Evals, Graders & Containers
description: Especificação técnica dos endpoints /v1/evals, /v1/graders e /v1/containers (gerenciamento de ambientes de execução isolados).
topics:
  - api-reference
  - evals-api-reference
  - graders-reference
  - containers-reference
keywords:
  - /v1/evals
  - /v1/graders
  - /v1/containers
  - eval_runs
  - sandboxes
related:
  - ../fine_tuning_e_evals/evals_e_graders.md
  - ../agents_sdk/guardrails_e_sandboxes.md
source_scope:
  - https://developers.openai.com/api/reference/resources/evals.md
  - https://developers.openai.com/api/reference/resources/graders.md
  - https://developers.openai.com/api/reference/resources/containers.md
---

# Referência de API — Evals, Graders & Containers

---

## 1. Graders (`/v1/graders`)

Avaliadores automáticos de qualidade de respostas:

```http
POST /v1/graders
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY

{
  "name": "Classificador de Precisão Factual",
  "type": "model_graded",
  "model": "gpt-5.6",
  "instructions": "Avalie se a resposta atende aos critérios factuais da rubrica."
}
```

- `GET /v1/graders`: Lista avaliadores cadastrados.
- `GET /v1/graders/{grader_id}`: Detalhes do avaliador.
- `DELETE /v1/graders/{grader_id}`: Remove um avaliador.

---

## 2. Evals & Runs (`/v1/evals`)

Execução de rodadas de teste automatizado:

```http
POST /v1/evals
Content-Type: application/json
Authorization: Bearer $OPENAI_API_KEY

{
  "name": "Suite de Testes de Regressão v1",
  "dataset_file_id": "file-eval-data-001",
  "model": "gpt-5.6",
  "grader_ids": ["grd_abc123"]
}
```

- `GET /v1/evals`: Lista suítes de avaliação.
- `GET /v1/evals/{eval_id}`: Resultados consolidados e pontuação média.
- `POST /v1/evals/{eval_id}/runs/{run_id}/cancel`: Cancela uma rodada em andamento.

---

## 3. Containers (`/v1/containers`)

Gerencia ambientes isolados (containers sandbox) para execução remota de scripts, testes de código e ferramentas de agentes:

- `POST /v1/containers`: Cria uma nova instância de container efêmero.
- `GET /v1/containers`: Lista containers ativos na organização.
- `GET /v1/containers/{container_id}`: Consulta status e consumo de recursos.
- `DELETE /v1/containers/{container_id}`: Encerra e destrói o container.
- `POST /v1/containers/{container_id}/files`: Faz upload de arquivos binários para o sistema de arquivos interno do container.
- `GET /v1/containers/{container_id}/files/{file_id}/content`: Baixa arquivos gerados dentro do container.

---

## 4. Referências Cruzadas

- [`../fine_tuning_e_evals/evals_e_graders.md`](../fine_tuning_e_evals/evals_e_graders.md)
- [`../agents_sdk/guardrails_e_sandboxes.md`](../agents_sdk/guardrails_e_sandboxes.md)
