---
title: Gerenciamento de Contexto e Contagem de Tokens
description: Janelas de contexto extensas, estratégias de compactação, edição de histórico de diálogo e contagem de tokens pré-execução via API.
topics:
  - context-window
  - compactacao
  - token-counting
  - context-editing
keywords:
  - context window
  - 200k tokens
  - compaction
  - count_tokens
related:
  - mensagens_e_prompting/messages_api.md
  - mensagens_e_prompting/prompt_caching.md
  - referencia_api/endpoints_messages.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/build-with-claude/context-windows
  - https://platform.claude.com/docs/pt-BR/build-with-claude/compaction
  - https://platform.claude.com/docs/pt-BR/build-with-claude/context-editing
  - https://platform.claude.com/docs/pt-BR/build-with-claude/token-counting
---

# Gerenciamento de Contexto e Contagem de Tokens

A Claude Platform oferece uma das maiores janelas de contexto da indústria (**200.000 tokens** por padrão em todos os modelos e até **1.000.000 tokens** em tiers selecionados), permitindo a análise de livros completos, bases de código e grandes históricos de conversa.

---

## Contagem de Tokens Pré-Execução (`/v1/messages/count_tokens`)

Antes de disparar uma inferência cara ou de longa duração, você pode validar o consumo exato de tokens da requisição sem gerar nenhuma saída:

### Requisição cURL:

```bash
curl https://api.anthropic.com/v1/messages/count_tokens \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{
       "model": "claude-3-7-sonnet-20250219",
       "system": "Você é um assistente técnico.",
       "messages": [
         {"role": "user", "content": "Texto a ser medido para planejamento de custo..."}
       ]
     }'
```

### Resposta:

```json
{
  "input_tokens": 1842
}
```

### No SDK Python:

```python
from anthropic import Anthropic

client = Anthropic()

token_count = client.messages.count_tokens(
    model="claude-3-7-sonnet-20250219",
    system="Instrução do sistema...",
    messages=[{"role": "user", "content": "Exemplo de mensagem..."}]
)

print(f"Total de tokens de entrada calculados: {token_count.input_tokens}")
```

---

## Estratégias de Compactação de Contexto (Compaction)

Em conversas prolongadas ou agentes de longo curso que operam por horas, o histórico pode se aproximar do limite de 200k tokens. Três estratégias oficiais são recomendadas:

1. **Sumarização Progressiva em Janela Deslizante**:
   - A cada N turnos (ex: 20 turnos), utilize o `claude-3-5-haiku` para sumarizar os primeiros 15 turnos em um resumo conciso.
   - Substitua os turnos antigos pelo bloco sumarizado como uma mensagem inicial do sistema ou usuário.
2. **Edição de Contexto (Context Editing)**:
   - Remova saídas intermediárias de ferramentas volumosas (`tool_result` com logs gigantes ou dumps JSON desnecessários) após a extração da informação relevante pelo assistente.
3. **Arquivamento em Banco Vetorial / Files API**:
   - Mantenha no histórico ativo apenas metadados e IDs, buscando o conteúdo sob demanda via tool calling.

---

## Veja Também

- [`../mensagens_e_prompting/messages_api.md`](../mensagens_e_prompting/messages_api.md)
- [`../mensagens_e_prompting/prompt_caching.md`](../mensagens_e_prompting/prompt_caching.md)
- [`../referencia_api/endpoints_messages.md`](../referencia_api/endpoints_messages.md)
