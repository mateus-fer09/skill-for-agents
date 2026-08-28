---
title: "Batch API: Processamento Assíncrono em Lote com 50% de Desconto"
description: "Guia exaustivo da OpenAI Batch API (/v1/batches). Processamento assíncrono em lote com 50% de economia em tokens de entrada e saída, SLA de 24 horas, formato de arquivo JSONL, endpoints suportados, ciclo de vida dos jobs, polling de status e download de resultados em Python, TypeScript e cURL."
topics: ["batch-api", "custos", "desconto-50", "jsonl", "processamento-assincrono", "files-api", "rate-limits-separados"]
keywords: ["/v1/batches", "client.batches.create", "completion_window: 24h", "purpose: batch", "custom_id", "50% discount", "output_file_id"]
source_scope: "OpenAI API Docs: Guides > Batch API, Cost Optimization & High-Throughput Pipelines"
---

# Batch API: Processamento Assíncrono em Lote com 50% de Desconto

A **Batch API** foi projetada para cargas de trabalho que não exigem resposta síncrona imediata (ex: rotulagem de dados, classificação de catálogos, resumos de grandes bases de documentos, extração de entidades em massa e avaliações offline).

---

## 1. Vantagens Estratégicas da Batch API

| Benefício | Batch API (`/v1/batches`) | API Síncrona Tradicional |
| :--- | :--- | :--- |
| **Economia de Custo** | **50% de desconto imediato** em todos os tokens (entrada e saída) | Preço de tabela cheio |
| **SLA de Conclusão** | Janela garantida de até **24 horas** (geralmente conclui em minutos/horas) | Resposta imediata por requisição |
| **Cotas de Rate Limit** | **Pool separado de rate limits** (não consome suas cotas síncronas de produção) | Compartilha cotas de RPM e TPM do projeto |
| **Volume por Arquivo** | Até 50.000 requisições ou 200 MB por arquivo JSONL | 1 requisição por chamada HTTP |

---

## 2. Endpoints e Métodos Suportados na Batch API

- `POST /v1/chat/completions` (Chat Completions & Structured Outputs)
- `POST /v1/embeddings` (Geração de Embeddings em lote)
- `POST /v1/moderations` (Moderação de conteúdo)

---

## 3. Formato do Arquivo JSONL de Entrada

Cada linha do arquivo deve ser um objeto JSON independente contendo os campos:
- `custom_id`: Identificador único da requisição (definido pela sua aplicação para cruzar com o resultado).
- `method`: Sempre `"POST"`.
- `url`: O endpoint de destino (ex: `"/v1/chat/completions"` ou `"/v1/embeddings"`).
- `body`: O payload exato que seria enviado na requisição síncrona.

### Exemplo de `batch_tarefas.jsonl`:
```json
{"custom_id": "pedido-001", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "Classifique o sentimento: Adorei o atendimento!"}]}}
{"custom_id": "pedido-002", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "Classifique o sentimento: O produto chegou quebrado."}]}}
```

---

## 4. Implementação Completa do Fluxo em Python

```python
import json
import time
from openai import OpenAI

client = OpenAI()

# 1. Gerar o arquivo JSONL com as tarefas
tarefas = [
    {
        "custom_id": f"artigo-{i}",
        "method": "POST",
        "url": "/v1/chat/completions",
        "body": {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "Resuma o texto em exatamente 1 frase curta."},
                {"role": "user", "content": f"Texto longo do artigo número {i} sobre inteligência artificial..."}
            ],
            "max_completion_tokens": 100
        }
    }
    for i in range(1, 101) # 100 tarefas em lote
]

with open("batch_input.jsonl", "w", encoding="utf-8") as f:
    for t in tarefas:
        f.write(json.dumps(t) + "
")

# 2. Upload do arquivo com purpose="batch"
with open("batch_input.jsonl", "rb") as f:
    batch_file = client.files.create(
        file=f,
        purpose="batch"
    )
print(f"Arquivo enviado com ID: {batch_file.id}")

# 3. Criar o Batch Job
batch_job = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h",
    metadata={"ambiente": "producao", "projeto": "resumo_artigos"}
)
print(f"Batch Job criado: {batch_job.id} | Status: {batch_job.status}")

# 4. Acompanhamento de Status (Polling)
while batch_job.status not in ["completed", "failed", "cancelled", "expired"]:
    time.sleep(30)
    batch_job = client.batches.retrieve(batch_job.id)
    counts = batch_job.request_counts
    print(f"Status: {batch_job.status} (Total: {counts.total}, Concluídos: {counts.completed}, Falhas: {counts.failed})")

# 5. Download dos Resultados Concluídos
if batch_job.status == "completed":
    print(f"
Baixando arquivo de saída: {batch_job.output_file_id}")
    output_content = client.files.content(batch_job.output_file_id).text

    # Salva e itera sobre os resultados
    with open("batch_output.jsonl", "w", encoding="utf-8") as f_out:
        f_out.write(output_content)

    for line in output_content.strip().split("
"):
        res = json.loads(line)
        custom_id = res["custom_id"]
        response_body = res["response"]["body"]
        texto_gerado = response_body["choices"][0]["message"]["content"]
        print(f"[{custom_id}] -> {texto_gerado}")

elif batch_job.status == "failed" and batch_job.error_file_id:
    erros = client.files.content(batch_job.error_file_id).text
    print("Erros do lote:
", erros)
```

---

## 5. Implementação em TypeScript / Node.js

```typescript
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI();

async function processarLote() {
  // 1. Upload do arquivo JSONL
  const file = await openai.files.create({
    file: fs.createReadStream('./batch_tarefas.jsonl'),
    purpose: 'batch',
  });

  // 2. Criação do lote
  const batch = await openai.batches.create({
    input_file_id: file.id,
    endpoint: '/v1/chat/completions',
    completion_window: '24h',
  });

  console.log(`Lote criado com ID: ${batch.id}`);

  // 3. Consultar status
  const status = await openai.batches.retrieve(batch.id);
  console.log('Status atual:', status.status);
}

processarLote();
```

---

## 6. Cancelamento de Lote em Execução

Se necessário interromper um lote antes da conclusão:

```python
client.batches.cancel("batch_abc123XYZ")
```
