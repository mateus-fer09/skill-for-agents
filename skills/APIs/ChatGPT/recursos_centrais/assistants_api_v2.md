---
title: "Assistants API v2: Assistentes, Threads, Messages, Runs e Streaming"
description: "Guia completo de arquitetura e implementação da Assistants API v2 na OpenAI API. Gerenciamento de estado com Threads, ciclo de vida de Runs e Run Steps, streaming em tempo real com eventos, integração com ferramentas (File Search, Code Interpreter e Custom Functions) e migração da v1 para v2."
topics: ["assistants-api-v2", "threads", "runs", "messages", "run-steps", "streaming", "stateful-agents", "tool-resources"]
keywords: ["client.beta.assistants", "client.beta.threads", "client.beta.threads.runs.stream", "run.status", "tool_resources", "vector_store_ids", "code_interpreter"]
source_scope: "OpenAI API Docs: Assistants > Overview, Threads, Runs & Streaming Events (v2)"
---

# Assistants API v2: Assistentes, Threads, Messages, Runs e Streaming

A **Assistants API v2** permite construir agentes de IA com estado persistente (*stateful*), gerenciando o histórico conversacional em threads automáticas e integrando ferramentas nativas de busca vetorial (*File Search*) e execução de código (*Code Interpreter*).

---

## 1. Arquitetura dos Quatro Componentes Centrais

```text
┌──────────────────────────────────────────────────────────┐
│                   1. ASSISTANT                           │
│  - Modelo (ex: gpt-4o)                                   │
│  - Instruções Globais (System Prompt)                    │
│  - Ferramentas Habilitadas (File Search, Code Interpreter)│
│  - Tool Resources (Vector Stores anexadas)               │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                     2. THREAD                            │
│  - Sessão conversacional de um usuário específico        │
│  - Histórico infinito de mensagens (auto-gerenciado)     │
│  - Anexo de arquivos específicos da sessão               │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                    3. MESSAGES                           │
│  - Mensagens com texto, imagens e arquivos               │
│  - Papéis (user, assistant)                              │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                4. RUN & RUN STEPS                        │
│  - Execução da inferência do Assistant sobre a Thread    │
│  - Ciclo de estados e chamadas de ferramentas            │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Ciclo de Vida de um Run

Um Run transita pelos seguintes estados:
- `queued`: O run foi agendado e aguarda recursos.
- `in_progress`: O modelo está processando o contexto da thread.
- `requires_action`: O modelo solicitou a execução de funções locais (*Function Calling*).
- `cancelling` / `cancelled`: O run foi interrompido.
- `failed`: Ocorreu um erro de execução ou violação de política.
- `completed`: A resposta foi gerada e gravada na thread.
- `expired`: O run expirou por inatividade em `requires_action`.

---

## 3. Implementação Completa em Python com Streaming

O streaming na v2 elimina a necessidade de loops de polling (`time.sleep`) para checar o status do Run.

```python
from openai import OpenAI, AssistantEventHandler
from typing_extensions import override

client = OpenAI()

# 1. Criação do Assistente
assistant = client.beta.assistants.create(
    name="Analista Financeiro IA",
    instructions="Você é um analista financeiro sênior. Responda com clareza utilizando formatação Markdown.",
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}],
)
print(f"Assistente criado com ID: {assistant.id}")

# 2. Criação da Thread Conversacional
thread = client.beta.threads.create()
print(f"Thread criada com ID: {thread.id}")

# 3. Adicionando mensagem do usuário
client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Calcule o retorno composto de um investimento de R$ 10.000 a 12% ao ano durante 5 anos.",
)

# 4. Configuração do Event Handler para Streaming
class EventHandler(AssistantEventHandler):
    @override
    def on_text_created(self, text) -> None:
        print("
[Assistente]: ", end="", flush=True)

    @override
    def on_text_delta(self, delta, snapshot):
        print(delta.value, end="", flush=True)

    @override
    def on_tool_call_created(self, tool_call):
        print(f"
[Executando ferramenta: {tool_call.type}]", flush=True)

    @override
    def on_tool_call_delta(self, delta, snapshot):
        if delta.type == 'code_interpreter':
            if delta.code_interpreter.input:
                print(delta.code_interpreter.input, end="", flush=True)

# 5. Execução do Run com Streaming
with client.beta.threads.runs.stream(
    thread_id=thread.id,
    assistant_id=assistant.id,
    event_handler=EventHandler(),
) as stream:
    stream.until_done()
```

---

## 4. Implementação em TypeScript / Node.js

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

async function main() {
  // 1. Criar assistente
  const assistant = await openai.beta.assistants.create({
    name: 'Assistente de Código',
    instructions: 'Você é um engenheiro de software focado em Node.js e TypeScript.',
    model: 'gpt-4o-mini',
    tools: [{ type: 'code_interpreter' }],
  });

  // 2. Criar thread e mensagem
  const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: 'Escreva um algoritmo de ordenação QuickSort em TypeScript.',
  });

  // 3. Executar streaming do Run
  const runStream = openai.beta.threads.runs.stream(thread.id, {
    assistant_id: assistant.id,
  });

  runStream
    .on('textDelta', (textDelta) => {
      process.stdout.write(textDelta.value || '');
    })
    .on('end', () => {
      console.log('
--- Execução Concluída ---');
    });
}

main();
```

---

## 5. Tratamento do Estado `requires_action` em Assistentes

Quando o Assistente utiliza funções customizadas (`tools: [{"type": "function", ...}]`), a execução pausa em `requires_action` até que os resultados sejam submetidos via `.submit_tool_outputs`.

```python
# Polling tradicional com submissão de outputs
run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id,
    assistant_id=assistant.id
)

if run.status == "requires_action":
    tool_calls = run.required_action.submit_tool_outputs.tool_calls
    tool_outputs = []

    for tc in tool_calls:
        func_name = tc.function.name
        # Executa a função local...
        tool_outputs.append({
            "tool_call_id": tc.id,
            "output": '{"status": "ok", "dados": 123}'
        })

    # Submete os retornos e continua o Run
    run = client.beta.threads.runs.submit_tool_outputs_and_poll(
        thread_id=thread.id,
        run_id=run.id,
        tool_outputs=tool_outputs
    )
```
