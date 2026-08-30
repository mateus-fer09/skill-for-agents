---
title: Supervised Fine-Tuning (SFT)
description: Guia de Fine-Tuning Supervisionado na OpenAI API, preparação de datasets JSONL, hiperparâmetros, checkpoints e ciclo de vida de jobs.
topics:
  - fine-tuning
  - sft
  - supervised-learning
  - checkpoints
  - jsonl-dataset
keywords:
  - /v1/fine_tuning/jobs
  - fine_tuning
  - training_file
  - hyperparameters
  - n_epochs
  - checkpoints
related:
  - ../fine_tuning_e_evals/reinforcement_fine_tuning.md
  - ../fine_tuning_e_evals/evals_e_graders.md
  - ../referencia_api/fine_tuning_e_batches.md
source_scope:
  - https://developers.openai.com/api/docs/guides/supervised-fine-tuning.md
  - https://developers.openai.com/api/docs/guides/fine-tuning-best-practices.md
  - https://developers.openai.com/api/reference/resources/fine_tuning.md
---

# Supervised Fine-Tuning (SFT) na OpenAI API

O **Supervised Fine-Tuning (SFT)** permite treinar modelos pré-existentes da OpenAI com centenas ou milhares de pares de exemplos específicos do seu domínio, melhorando a aderência a estilos de resposta complexos, terminologia proprietária e formatos estritos.

---

## 1. Formato do Arquivo de Treinamento (`JSONL`)

O dataset de treino deve ser formatado como um arquivo de linhas JSON (`.jsonl`), onde cada linha representa uma conversa completa com o formato da Responses API ou Chat Completions:

### Exemplo de `treino.jsonl`

```json
{"messages": [{"role": "developer", "content": "Você é um assistente de triagem médica."}, {"role": "user", "content": "Paciente relata dor torácica aguda e falta de ar."}, {"role": "assistant", "content": "Classificação: URGÊNCIA GRAVE (Vermelho). Encaminhar imediatamente para sala de emergência e monitoramento cardíaco."}]}
{"messages": [{"role": "developer", "content": "Você é um assistente de triagem médica."}, {"role": "user", "content": "Paciente com febre moderada há 2 dias sem outros sintomas."}, {"role": "assistant", "content": "Classificação: POUCO URGENTE (Verde). Encaminhar para consulta médica ambulatorial."}]}
```

---

## 2. Passo a Passo Completo em Python

```python
from openai import OpenAI

client = OpenAI()

# 1. Carregar arquivo de treinamento
arquivo_treino = client.files.create(
    file=open("treino.jsonl", "rb"),
    purpose="fine-tune"
)
print(f"Arquivo de treino carregado com ID: {arquivo_treino.id}")

# 2. Iniciar o Job de Fine-Tuning
job = client.fine_tuning.jobs.create(
    training_file=arquivo_treino.id,
    model="gpt-4.1-mini-2025-04-14",
    hyperparameters={
        "n_epochs": 3,
        "batch_size": "auto",
        "learning_rate_multiplier": "auto"
    },
    suffix="triagem-medica-v1"
)

print(f"Job de fine-tuning criado com ID: {job.id}. Status: {job.status}")
```

---

## 3. Monitoramento e Checkpoints

Durante o treinamento, a OpenAI emite eventos de métricas de perda (*training loss*) e salva **checkpoints**:

```python
# Listar eventos do job
eventos = client.fine_tuning.jobs.list_events(fine_tuning_job_id=job.id, limit=10)
for ev in eventos.data:
    print(f"[{ev.created_at}] {ev.message}")

# Consultar checkpoints gerados
checkpoints = client.fine_tuning.jobs.checkpoints.list(fine_tuning_job_id=job.id)
for cp in checkpoints.data:
    print(f"Checkpoint: {cp.id} | Step: {cp.step_number} | Loss: {cp.metrics.get('train_loss')}")
```

---

## 4. Utilizando o Modelo Ajustado

Após a conclusão com status `succeeded`, o campo `job.fine_tuned_model` conterá o identificador do seu modelo personalizado:

```python
response = client.responses.create(
    model=job.fine_tuned_model,  # ex.: "ft:gpt-4.1-mini:minha-org:triagem-medica-v1:abc123xyz"
    input="Paciente com tontura e pressão 18/11."
)

print(response.output_text)
```

---

## 5. Referências Cruzadas

- [`../fine_tuning_e_evals/reinforcement_fine_tuning.md`](../fine_tuning_e_evals/reinforcement_fine_tuning.md)
- [`../fine_tuning_e_evals/evals_e_graders.md`](../fine_tuning_e_evals/evals_e_graders.md)
- [`../referencia_api/fine_tuning_e_batches.md`](../referencia_api/fine_tuning_e_batches.md)
