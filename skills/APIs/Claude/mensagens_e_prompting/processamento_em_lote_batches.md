---
title: Message Batches API (Processamento em Lote)
description: Execução de até 10.000 requisições assíncronas com 50% de desconto no custo por token, ciclo de vida, polling e download de resultados.
topics:
  - batches
  - processamento-em-lote
  - desconto
  - assincrono
keywords:
  - Message Batches API
  - 50% discount
  - async processing
  - batch results
related:
  - fundamentos/modelos_e_precos.md
  - mensagens_e_prompting/messages_api.md
  - referencia_api/endpoints_message_batches.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/build-with-claude/message-batches
  - https://platform.claude.com/docs/pt-BR/api/messages/batches
---

# Message Batches API (Processamento em Lote)

A **Message Batches API** permite enviar até **10.000 requisições de mensagens** em uma única operação assíncrona com **50% de desconto fixo** em relação aos preços da Messages API padrão.

---

## Características e Garantias Operacionais

- **Economia de 50%**: Válida para todos os tokens de entrada e saída em todos os modelos.
- **SLA de Processamento**: Os lotes são processados e concluídos em até **24 horas** (tipicamente em poucos minutos/horas dependendo da carga).
- **Isolamento de Erros**: Se uma requisição do lote falhar (por exemplo, erro de validação ou timeout), as demais requisições continuam sendo processadas normalmente.

---

## Ciclo de Vida de um Lote (Batch Lifecycle)

1. **Criação (`POST /v1/messages/batches`)**: Envio do array de requisições com IDs customizados (`custom_id`).
2. **Processamento (`in_progress`)**: O cluster da Anthropic distribui e executa as mensagens.
3. **Conclusão (`ended`)**: O lote é finalizado e os resultados ficam disponíveis para streaming/download.

---

## Exemplo Completo no SDK Python

### 1. Criando o Lote de Mensagens

```python
from anthropic import Anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming

client = Anthropic()

# Lista de até 10.000 requisições
requests = [
    {
        "custom_id": "cliente-req-001",
        "params": MessageCreateParamsNonStreaming(
            model="claude-3-7-sonnet-20250219",
            max_tokens=500,
            messages=[{"role": "user", "content": "Classifique o sentimento deste feedback: Adorei o atendimento!"}]
        )
    },
    {
        "custom_id": "cliente-req-002",
        "params": MessageCreateParamsNonStreaming(
            model="claude-3-7-sonnet-20250219",
            max_tokens=500,
            messages=[{"role": "user", "content": "Classifique o sentimento deste feedback: A entrega atrasou muito."}]
        )
    }
]

batch = client.messages.batches.create(requests=requests)
print(f"Lote criado com sucesso! ID: {batch.id} | Status: {batch.processing_status}")
```

### 2. Consultando o Status e Baixando Resultados

```python
import time
from anthropic import Anthropic

client = Anthropic()
batch_id = "msgbatch_01XFDUDYJgAACzvnptvVoYEL"

# Polling de status
while True:
    batch = client.messages.batches.retrieve(batch_id)
    print(f"Status atual: {batch.processing_status} (Concluídos: {batch.request_counts.succeeded}/{batch.request_counts.processing})")
    
    if batch.processing_status == "ended":
        break
    time.sleep(30)

# Iterando sobre os resultados em streaming JSONL
print("\n--- Resultados do Lote ---")
for result in client.messages.batches.results(batch_id):
    custom_id = result.custom_id
    if result.result.type == "succeeded":
        message = result.result.message
        print(f"[{custom_id}] Resposta: {message.content[0].text}")
    elif result.result.type == "errored":
        print(f"[{custom_id}] Erro: {result.result.error}")
```

---

## Veja Também

- [`../fundamentos/modelos_e_precos.md`](../fundamentos/modelos_e_precos.md)
- [`../mensagens_e_prompting/messages_api.md`](../mensagens_e_prompting/messages_api.md)
- [`../referencia_api/endpoints_message_batches.md`](../referencia_api/endpoints_message_batches.md)
