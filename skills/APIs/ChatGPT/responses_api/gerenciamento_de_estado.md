---
title: Gerenciamento de Estado, Conversas e Compactação
description: Como gerenciar conversas de múltiplos turnos com conversation_id, continuação de turnos no servidor e compactação de contexto com Responses API.
topics:
  - conversation-state
  - conversation-id
  - compaction
  - multi-turn
keywords:
  - conversation
  - conversation_id
  - previous_response_id
  - client.responses.compact
  - context window management
related:
  - ../responses_api/introducao_e_quickstart.md
  - ../responses_api/prompt_caching_e_predicted.md
  - ../agents_sdk/orquestracao_e_fluxos.md
source_scope:
  - https://developers.openai.com/api/docs/guides/conversation-state.md
  - https://developers.openai.com/api/docs/guides/compaction.md
  - https://developers.openai.com/api/reference/resources/conversations.md
---

# Gerenciamento de Estado, Conversas e Compactação de Contexto

Na Responses API, gerenciar conversas com múltiplos turnos não exige que a sua aplicação reenvie todo o array histórico de mensagens a cada chamada. A OpenAI oferece gerenciamento de estado no lado do servidor e rotinas automáticas de compactação (*compaction*).

---

## 1. Estratégias de Continuação de Turnos

Existem duas formas principais de encadear turnos na Responses API:

### 1.1 Usando `previous_response_id` (Encadeamento Direto)
Cada resposta retornada pela API contém um identificador único `response.id`. Para responder no mesmo contexto, basta fornecer esse ID na chamada seguinte:

```python
from openai import OpenAI

client = OpenAI()

# Primeiro turno
turno_1 = client.responses.create(
    model="gpt-5.6",
    input="Meu nome é Mateus e estou construindo um agente de documentação."
)
print("Turno 1:", turno_1.output_text)

# Segundo turno encadeado
turno_2 = client.responses.create(
    model="gpt-5.6",
    previous_response_id=turno_1.id,
    input="Qual é o meu nome e o que estou construindo?"
)
print("Turno 2:", turno_2.output_text)
```

### 1.2 Usando `conversation_id` (Conversa Persistente de Longa Duração)
Para fluxos onde múltiplos agentes ou sessões assíncronas colaboram em uma mesma conversa:

```python
# Criar uma conversa
conversa = client.conversations.create(
    metadata={"usuario_id": "usr_9981", "ambiente": "producao"}
)

# Enviar turnos vinculados à conversa
resp = client.responses.create(
    model="gpt-5.6",
    conversation=conversa.id,
    input="Iniciando sessão de suporte técnico."
)
```

---

## 2. Compactação de Contexto (*Compaction*)

Em sessões muito longas com dezenas de turnos e saídas extensas de ferramentas, a janela de contexto pode se aproximar do limite máximo do modelo (200.000 tokens) ou encarecer as requisições.

A OpenAI oferece o endpoint de **compactação**:

```python
# Disparar a compactação no servidor
compacted_response = client.responses.compact(
    response_id=turno_2.id
)

print(f"Tokens antes: {compacted_response.original_token_count}")
print(f"Tokens após compactação: {compacted_response.compacted_token_count}")
```

### O que a Compactação Faz:
1. Sintetiza mensagens intermediárias e histórico antigo em resumos semânticos de alta fidelidade.
2. Remove saídas volumosas e redundantes de chamadas antigas de ferramentas (ex.: páginas inteiras de busca web ou logs brutos de terminal).
3. Preserva fatos essenciais, restrições e diretrizes fornecidas pelo usuário.

---

## 3. Inspeção e Listagem de Itens de Conversa

É possível recuperar o histórico completo armazenado no servidor através de:

```python
itens = client.conversations.items.list(
    conversation_id=conversa.id,
    limit=50
)

for item in itens.data:
    print(f"[{item.role}] {item.content}")
```

---

## 4. Referências Cruzadas

- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
- [`../responses_api/prompt_caching_e_predicted.md`](../responses_api/prompt_caching_e_predicted.md)
- [`../referencia_api/responses_e_chat.md`](../referencia_api/responses_e_chat.md)
