---
title: Mensagens de Sistema no Meio da Conversa e Modo de Esforço
description: Injeção dinâmica de mensagens de sistema, alteração de ferramentas em tempo real e controle de raciocínio com Extended Thinking.
topics:
  - system-messages
  - extended-thinking
  - effort-control
  - orchestration
keywords:
  - mid-conversation system
  - thinking budget
  - effort mode
  - orchestration mode
related:
  - mensagens_e_prompting/messages_api.md
  - fundamentos/modelos_e_precos.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/build-with-claude/mid-conversation-system-messages
  - https://platform.claude.com/docs/pt-BR/build-with-claude/mid-conversation-effort-example
---

# Mensagens de Sistema no Meio da Conversa e Modo de Esforço

A Claude Platform suporta técnicas avançadas de orquestração conversacional que permitem ajustar instruções de sistema e orçamentos de raciocínio dinamicamente ao longo de uma interação de múltiplos passos.

---

## Mensagens de Sistema Intermediárias (Mid-Conversation System Messages)

Em fluxos de trabalho multi-etapa, pode ser necessário alterar as diretrizes operacionais do modelo ou trocar as ferramentas disponíveis sem reiniciar o histórico.

### Padrão Recomendado

Para instruir o modelo sobre uma mudança de fase sem violar a alternância de turnos, injete a nova instrução no turno do usuário ou utilize blocos prefixados:

```json
{
  "model": "claude-3-7-sonnet-20250219",
  "max_tokens": 2048,
  "messages": [
    {"role": "user", "content": "Colete os requisitos do projeto."},
    {"role": "assistant", "content": "Requisitos coletados: [...]"},
    {
      "role": "user", 
      "content": "[SISTEMA: A fase de coleta foi concluída. Inicie agora a fase de Arquitetura Técnica. Gere o diagrama em formato Mermaid e não faça perguntas ao usuário.]"
    }
  ]
}
```

---

## Modo de Raciocínio Estendido (Extended Thinking)

No Claude 3.7 Sonnet, o modo de pensamento permite que o modelo gere uma reflexão interna estruturada antes de responder.

### Configuração do Orçamento de Raciocínio (`budget_tokens`)

- O parâmetro `budget_tokens` define a quantidade mínima de tokens alocados para o raciocínio.
- O valor de `max_tokens` deve ser estritamente maior que `budget_tokens`.

```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4096
    },
    messages=[
        {
            "role": "user",
            "content": "Projete uma arquitetura de banco de dados distribuído para transações financeiras com consistência linearizável."
        }
    ]
)

for block in response.content:
    if block.type == "thinking":
        print(f"--- Processo de Raciocínio ({len(block.thinking)} caracteres) ---")
        print(block.thinking[:400] + "...")
    elif block.type == "text":
        print("--- Resposta Final ---")
        print(block.text)
```

---

## Veja Também

- [`../mensagens_e_prompting/messages_api.md`](../mensagens_e_prompting/messages_api.md)
- [`../ferramentas_e_agentes/tool_use_visao_geral.md`](../ferramentas_e_agentes/tool_use_visao_geral.md)
