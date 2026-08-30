---
title: OpenAI Evals, Graders e Datasets
description: Como criar datasets de teste, configurar avaliadores automáticos (graders), executar trace grading e monitorar acurácia de modelos na plataforma OpenAI.
topics:
  - evals
  - graders
  - trace-grading
  - evaluation-runs
  - accuracy-monitoring
keywords:
  - /v1/evals
  - /v1/graders
  - eval_runs
  - grader_type
  - model_graded
  - python_graded
related:
  - ../fine_tuning_e_evals/fine_tuning_sft.md
  - ../fine_tuning_e_evals/reinforcement_fine_tuning.md
  - ../referencia_api/evals_e_containers.md
source_scope:
  - https://developers.openai.com/api/docs/guides/evals.md
  - https://developers.openai.com/api/docs/guides/graders.md
  - https://developers.openai.com/api/docs/guides/evaluation-best-practices.md
  - https://developers.openai.com/api/docs/guides/trace-grading.md
  - https://developers.openai.com/api/reference/resources/evals.md
---

# OpenAI Evals, Graders e Datasets

A plataforma **OpenAI Evals** oferece ferramentas automatizadas para medir, auditar e otimizar quantitativamente a qualidade, a precisão e a segurança dos modelos e prompts antes e depois do lançamento em produção.

---

## 1. Componentes do Sistema de Avaliação

```
[ Dataset de Teste (Casos de Entrada e Saída Esperada) ]
                            |
                            v
               [ Execução do Modelo / Prompt ]
                            |
                            v (Respostas Geradas)
                [ Graders (Avaliadores) ]
            /               |               \
 [ LLM-as-a-Judge ] [ Script Python/Regex ] [ Match Exato/JSON ]
                            |
                            v
       [ Relatório de Métricas & Pontuação de Acurácia ]
```

---

## 2. Tipos de Graders Suportados

1. **`model_graded` (LLM-as-a-Judge)**: Um modelo de alta capacidade (ex.: `gpt-5.6` ou `o3`) avalia se a resposta atendeu aos critérios de completude, tom e correção factual com base em um prompt de rubrica.
2. **`python_graded` (Avaliador Programático)**: Executa um script Python em sandbox para validar respostas (ex.: conferir se um JSON é válido, se um cálculo bate exatamente ou se um código compila).
3. **`exact_match` / `regex`**: Validação determinística de strings e padrões.

---

## 3. Criação de Grader e Execução de Avaliação via API

### 3.1 Criando um Grader Model-Graded

```python
from openai import OpenAI

client = OpenAI()

grader = client.graders.create(
    name="Avaliador de Tom e Precisão Técnica",
    type="model_graded",
    model="gpt-5.6",
    instructions="""
    Avalie a resposta do modelo seguindo a rubrica:
    - 1.0 ponto: Resposta 100% precisa, sem alucinações e em tom formal.
    - 0.5 ponto: Resposta parcialmente correta ou prolixa.
    - 0.0 ponto: Resposta incorreta ou com falhas técnicas.
    Retorne a pontuação numérica final e a justificativa.
    """
)

print(f"Grader criado com ID: {grader.id}")
```

### 3.2 Disparando uma Rodada de Avaliação (*Evaluation Run*)

```python
eval_job = client.evals.create(
    name="Avaliação de Prompt de Suporte v2",
    dataset_file_id="file-dataset-eval-9988",
    model="gpt-5.6",
    grader_ids=[grader.id]
)

print(f"Eval job iniciado: {eval_job.id}. Status: {eval_job.status}")
```

---

## 4. Trace Grading (Avaliação de Sessões de Agentes Reais)

O **Trace Grading** permite capturar sessões de produção do OpenAI Agents SDK (contendo múltiplos passos de pensamento, chamadas de ferramentas e handoffs) e submetê-las diretamente aos graders para identificar em qual passo o agente errou ou desviou do plano.

---

## 5. Referências Cruzadas

- [`../fine_tuning_e_evals/fine_tuning_sft.md`](../fine_tuning_e_evals/fine_tuning_sft.md)
- [`../fine_tuning_e_evals/reinforcement_fine_tuning.md`](../fine_tuning_e_evals/reinforcement_fine_tuning.md)
- [`../referencia_api/evals_e_containers.md`](../referencia_api/evals_e_containers.md)
