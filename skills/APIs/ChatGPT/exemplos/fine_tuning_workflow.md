---
title: Exemplo Completo — Pipeline de Fine-Tuning e Avaliação
description: Script completo em Python demonstrando validação de dataset JSONL, upload de arquivos, disparo de job de fine-tuning e avaliação de métricas.
topics:
  - examples
  - fine-tuning-pipeline
  - sft
  - monitoring
keywords:
  - python
  - client.fine_tuning.jobs.create
  - client.files.create
  - fine-tuning workflow
related:
  - ../fine_tuning_e_evals/fine_tuning_sft.md
  - ../fine_tuning_e_evals/evals_e_graders.md
  - ../referencia_api/fine_tuning_e_batches.md
source_scope:
  - https://developers.openai.com/api/docs/guides/supervised-fine-tuning.md
---

# Exemplo Completo — Pipeline de Fine-Tuning e Avaliação

Pipeline ponta a ponta para preparar, carregar dataset JSONL, disparar um trabalho de **Supervised Fine-Tuning (SFT)** e monitorar seu progresso até a geração do modelo customizado.

---

## Código Fonte Completo (`pipeline_finetuning.py`)

```python
import time
import json
from openai import OpenAI

client = OpenAI()

# =========================================================
# 1. CRIAR DATASET DE EXEMPLO (JSONL)
# =========================================================

dataset_exemplos = [
    {
        "messages": [
            {"role": "developer", "content": "Você é um classificador de sentimento para suporte técnico."},
            {"role": "user", "content": "O sistema caiu no meio da reunião com a diretoria, preciso de ajuda urgente!"},
            {"role": "assistant", "content": '{"sentimento": "CRITICO_NEGATIVO", "urgencia": "ALTA", "prioridade_fila": 1}'}
        ]
    },
    {
        "messages": [
            {"role": "developer", "content": "Você é um classificador de sentimento para suporte técnico."},
            {"role": "user", "content": "Gostaria de tirar uma dúvida sobre como alterar meu e-mail de faturamento quando tiverem tempo."},
            {"role": "assistant", "content": '{"sentimento": "NEUTRO", "urgencia": "BAIXA", "prioridade_fila": 4}'}
        ]
    },
    {
        "messages": [
            {"role": "developer", "content": "Você é um classificador de sentimento para suporte técnico."},
            {"role": "user", "content": "A nova funcionalidade de relatórios ficou fantástica, parabéns à equipe!"},
            {"role": "assistant", "content": '{"sentimento": "POSITIVO", "urgencia": "NENHUMA", "prioridade_fila": 5}'}
        ]
    }
]

arquivo_dataset = "dataset_sentimento.jsonl"
with open(arquivo_dataset, "w", encoding="utf-8") as f:
    for item in dataset_exemplos:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")

print(f"Dataset salvo em '{arquivo_dataset}'.")

# =========================================================
# 2. UPLOAD DO ARQUIVO PARA A PLATAFORMA OPENAI
# =========================================================

print("\nFazendo upload do arquivo de treinamento...")
with open(arquivo_dataset, "rb") as f:
    arquivo_upload = client.files.create(
        file=f,
        purpose="fine-tune"
    )

print(f"Arquivo carregado com sucesso! File ID: {arquivo_upload.id}")

# =========================================================
# 3. DISPARO DO JOB DE FINE-TUNING
# =========================================================

print("\nIniciando Job de Fine-Tuning...")
job = client.fine_tuning.jobs.create(
    training_file=arquivo_upload.id,
    model="gpt-4.1-mini-2025-04-14",
    hyperparameters={
        "n_epochs": 4
    },
    suffix="classificador-suporte-v1"
)

print(f"Job de Fine-Tuning criado! ID: {job.id} | Status: {job.status}")

# =========================================================
# 4. MONITORAMENTO DO PROGRESSO (POLLING)
# =========================================================

print("\nAguardando processamento do modelo...")
while True:
    status_job = client.fine_tuning.jobs.retrieve(job.id)
    print(f"[{time.strftime('%X')}] Status atual: {status_job.status}")
    
    if status_job.status in ["succeeded", "failed", "cancelled"]:
        break
    time.sleep(15)

if status_job.status == "succeeded":
    modelo_personalizado = status_job.fine_tuned_model
    print(f"\n Fine-Tuning concluído com sucesso!")
    print(f"Identificador do modelo: {modelo_personalizado}")
    
    # 5. TESTAR MODELO AJUSTADO
    print("\nTestando o modelo ajustado com uma nova entrada:")
    teste_resp = client.responses.create(
        model=modelo_personalizado,
        input="Nosso servidor de banco travou e o checkout está fora do ar!"
    )
    print("Saída do modelo:", teste_resp.output_text)
else:
    print(f"\nFalha no treinamento: {status_job.error}")
```

---

## Referências Relacionadas

- [`../fine_tuning_e_evals/fine_tuning_sft.md`](../fine_tuning_e_evals/fine_tuning_sft.md)
- [`../fine_tuning_e_evals/evals_e_graders.md`](../fine_tuning_e_evals/evals_e_graders.md)
- [`../referencia_api/fine_tuning_e_batches.md`](../referencia_api/fine_tuning_e_batches.md)
