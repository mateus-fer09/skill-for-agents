---
title: Model Tuning — Fine-Tuning Supervisionado para Modelos Gemini
description: Guia completo para fine-tuning supervisionado de modelos Gemini (Gemini 1.5 Flash), estruturação de datasets JSONL, hiperparâmetros de treinamento e inferência com modelos customizados.
---

# Model Tuning — Fine-Tuning Supervisionado para Modelos Gemini

## 1. Visão Geral do Model Tuning

O **Model Tuning** (Fine-Tuning Supervisionado - SFT) permite adaptar o comportamento de um modelo base (como o `gemini-1.5-flash`) para responder com um estilo de redação específico, seguir taxonomias corporativas estritas ou executar tarefas de nicho com pouquíssima variabilidade.

### 1.1. Quando usar Tuning vs Prompting / RAG
- **Use Prompting / Few-Shot:** Quando poucos exemplos no prompt resolverem o problema com acurácia suficiente.
- **Use RAG:** Quando a necessidade principal for atualizar fatos dinâmicos ou recuperar conhecimento de bases extensas.
- **Use Model Tuning:** Quando precisar reduzir tokens de prompt em milhares de chamadas repetitivas, aprender uma linguagem/sintaxe muito específica ou padronizar saídas estruturadas complexas.

---

## 2. Formato do Dataset de Treinamento (`.jsonl`)

O formato recomendado é o diálogo conversacional multi-turn:

```jsonl
{"messages": [{"role": "user", "content": "Suporte: O cliente relatou erro 504 no gateway."}, {"role": "model", "content": "CLASSIFICAÇÃO: Severidade Alta | CATEGORIA: Infraestrutura | AÇÃO: Reiniciar Pods do Gateway e notificar SRE."}]}
{"messages": [{"role": "user", "content": "Suporte: Usuário esqueceu a senha de acesso."}, {"role": "model", "content": "CLASSIFICAÇÃO: Severidade Baixa | CATEGORIA: Autenticação | AÇÃO: Disparar fluxo de reset de credenciais."}]}
```

> [!NOTE]
> Recomenda-se um mínimo de 100 a 500 exemplos de alta qualidade para um ajuste supervisionado eficaz.

---

## 3. Criação do Treinamento Supervisionado

### 3.1. Python (`google-genai`)
```python
import time
from google import genai
from google.genai import types

client = genai.Client()

# 1. Início do Tuning Job
tuning_job = client.tunings.tune(
    base_model="models/gemini-1.5-flash-001-tuning",
    training_data=types.Dataset(
        # Pode apontar para um arquivo local ou URI do Cloud Storage / Files API
        jsonl_data="dataset_suporte_tecnico.jsonl"
    ),
    config=types.CreateTuningJobConfig(
        id="meu-modelo-suporte-v1",
        display_name="Classificador Suporte Técnico Tier 1",
        epoch_count=5,
        batch_size=4,
        learning_rate_multiplier=1.0
    )
)

print(f"Tuning iniciado: {tuning_job.name}")
print(f"Status: {tuning_job.state}")

# 2. Polling de status do treinamento
while tuning_job.state == "JOB_STATE_RUNNING":
    time.sleep(60)
    tuning_job = client.tunings.get(name=tuning_job.name)
    print(f"Progresso: {tuning_job.state}")

# 3. Inferência com o Modelo Customizado Ajustado
if tuning_job.state == "JOB_STATE_SUCCEEDED":
    custom_model_id = tuning_job.tuned_model.name
    print(f"Modelo pronto para uso: {custom_model_id}")

    response = client.models.generate_content(
        model=custom_model_id,
        contents="Suporte: O banco de dados PostgreSQL atingiu 100% de uso de disco."
    )
    print("
Resposta do Modelo Tunado:")
    print(response.text)
```
