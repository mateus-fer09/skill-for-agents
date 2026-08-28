---
title: Batch API — Processamento Assíncrono em Lote com 50% de Desconto
description: Guia completo para execução de tarefas assíncronas em larga escala com a Batch API da Gemini API, preparação de datasets JSONL, ciclo de vida do job, polling e recuperação de resultados.
---

# Batch API — Processamento Assíncrono em Lote com 50% de Desconto

## 1. Visão Geral da Batch API

A **Batch API** foi projetada para processar grandes volumes de requisições que não demandam respostas imediatas em tempo real (ex: classificação de 100.000 avaliações de clientes, tradução de catálogos inteiros ou extração de dados históricos).

### 1.1. Principais Vantagens
- **Desconto de 50%:** Custo de tokens de entrada e saída pela metade do valor do endpoint síncrono padrão.
- **Cotas Segregadas e Maiores:** Não consome o limite estrito de Requisições Por Minuto (RPM) do endpoint síncrono.
- **SLA de Conclusão:** A maioria dos jobs é concluída em até 24 horas.

---

## 2. Formato do Arquivo de Entrada (`.jsonl`)

Cada linha do arquivo deve ser um objeto JSON independente representando uma requisição `generateContent`:

```jsonl
{"request": {"contents": [{"parts": [{"text": "Classifique o sentimento: O produto chegou antes do prazo e funciona perfeitamente!"}]}]}}
{"request": {"contents": [{"parts": [{"text": "Classifique o sentimento: O produto quebrou no primeiro dia de uso."}]}]}}
{"request": {"contents": [{"parts": [{"text": "Classifique o sentimento: Atendimento padrão, nada de especial."}]}]}}
```

---

## 3. Fluxo de Execução do Batch Job

```text
[ 1. Criar e subir dataset .jsonl via Files API ]
                     │
                     ▼
[ 2. Criar o Batch Job com client.batches.create() ]
  └─ Retorna: batches/job_12345 (JOB_STATE_PENDING)
                     │
                     ▼
[ 3. Polling periódico de estado ]
  ├─ JOB_STATE_RUNNING
  └─ JOB_STATE_SUCCEEDED
                     │
                     ▼
[ 4. Download do arquivo de saída .jsonl com as respostas ]
```

---

## 4. Implementação em Python (`google-genai`)

```python
import time
from google import genai
from google.genai import types

client = genai.Client()

# 1. Upload do dataset JSONL
dataset_file = client.files.upload(
    file="lote_sentimentos.jsonl",
    config={"mime_type": "text/plain"}
)
print(f"Dataset carregado: {dataset_file.name}")

# 2. Criação do Batch Job
batch_job = client.batches.create(
    model="gemini-2.0-flash",
    src=dataset_file.name,
    config=types.CreateBatchJobConfig(
        display_name="job_classificacao_sentimentos"
    )
)

print(f"Batch Job iniciado: {batch_job.name}")
print(f"Estado inicial: {batch_job.state}")

# 3. Polling até a conclusão do job
while batch_job.state in ["JOB_STATE_PENDING", "JOB_STATE_RUNNING"]:
    print(f"Status atual: {batch_job.state}. Aguardando 30 segundos...")
    time.sleep(30)
    batch_job = client.batches.get(name=batch_job.name)

# 4. Verificação do resultado
if batch_job.state == "JOB_STATE_SUCCEEDED":
    print("Job concluído com sucesso!")
    print(f"Arquivo de saída gerado: {batch_job.output_file}")
    
    # Download ou leitura do arquivo de resultados
    output_content = client.files.get(name=batch_job.output_file)
    print(f"Resultado disponível em: {output_content.uri}")
else:
    print(f"Job falhou ou foi cancelado: {batch_job.state} - Erro: {batch_job.error}")
```

---

## 5. Gerenciamento de Batch Jobs

```python
# Listar todos os batch jobs
for job in client.batches.list():
    print(f"Job: {job.name} | Display: {job.display_name} | State: {job.state}")

# Cancelar um job em execução
client.batches.cancel(name="batches/job_12345")
print("Job cancelado.")
```
