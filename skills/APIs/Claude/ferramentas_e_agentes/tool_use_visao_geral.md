---
title: Chamada de Ferramentas (Tool Use / Function Calling)
description: Conceitos fundamentais de Tool Calling, definição de esquemas JSON Schema, modos tool_choice, ciclo de execução de ferramentas e streaming granular.
topics:
  - tool-use
  - function-calling
  - json-schema
  - tool-choice
  - tool-result
keywords:
  - tool_use
  - tool_result
  - tool_choice
  - input_schema
  - is_error
related:
  - mensagens_e_prompting/messages_api.md
  - ferramentas_e_agentes/ferramentas_nativas.md
  - ferramentas_e_agentes/infraestrutura_e_contexto_de_ferramentas.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/overview
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/tool-reference
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/programmatic-tool-calling
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/fine-grained-tool-streaming
---

# Chamada de Ferramentas (Tool Use / Function Calling)

A funcionalidade de **Tool Use** permite que os modelos Claude interajam com o mundo exterior invocando funções, consultando bancos de dados, chamando APIs REST ou executando comandos sob medida.

---

## O Ciclo Completo de Tool Use (4 Etapas)

```
[1. Aplicação]  ── Envia Mensagem + Lista de Ferramentas (JSON Schema) ──► [Claude API]
                                                                                │
[2. Aplicação]  ◄── Recebe resposta com stop_reason="tool_use" e input_json ────┘
       │
       ▼  (Executa a função localmente: fetch API / SQL / etc.)
[3. Aplicação]  ── Envia histórico + bloco 'tool_result' ─────────────────► [Claude API]
                                                                                │
[4. Aplicação]  ◄── Recebe resposta final formatada em linguagem natural ───────┘
```

---

## 1. Definindo Ferramentas no Parâmetro `tools`

Cada ferramenta é definida por um nome, uma descrição clara e um esquema JSON Schema em `input_schema`:

```json
{
  "tools": [
    {
      "name": "consultar_clima",
      "description": "Retorna as condições meteorológicas e temperatura atual para uma localidade informada.",
      "input_schema": {
        "type": "object",
        "properties": {
          "cidade": {
            "type": "string",
            "description": "Nome da cidade e estado/país, ex: 'São Paulo, SP' ou 'Lisboa, Portugal'"
          },
          "unidade": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "Unidade de temperatura desejada (padrão: celsius)"
          }
        },
        "required": ["cidade"]
      }
    }
  ]
}
```

---

## 2. Controle de Escolha de Ferramentas (`tool_choice`)

O parâmetro opcional `tool_choice` determina como o modelo deve se comportar em relação às ferramentas fornecidas:

| Modo `tool_choice` | Sintaxe JSON | Comportamento |
|---|---|---|
| **Automático** (Padrão) | `{"type": "auto"}` | O modelo decide livremente se responde com texto ou se invoca uma ou mais ferramentas. |
| **Obrigatório Qualquer** | `{"type": "any"}` | O modelo é forçado a invocar **pelo menos uma** ferramenta da lista, sem responder com texto puro. |
| **Ferramenta Específica** | `{"type": "tool", "name": "consultar_clima"}` | O modelo é forçado a invocar **estritamente a ferramenta nomeada**. |

---

## 3. Retornando o Resultado da Ferramenta (`tool_result`)

Quando o modelo emite `stop_reason: "tool_use"`, a aplicação deve executar a ferramenta e retornar o resultado em uma nova mensagem de `role: "user"` contendo o bloco `tool_result` com o mesmo `tool_use_id`:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01XFDUDYJgAACzvnptvVoYEL",
      "content": "{\"temperatura\": 24, \"condicao\": \"Ensolarado\", \"umidade\": 65}"
    }
  ]
}
```

### Tratamento de Erros de Execução (`is_error: true`)

Se a função falhar localmente (ex: timeout ou 404), envie o erro com a flag `is_error: true`. O Claude interpretará a falha e poderá tentar novamente com parâmetros corrigidos:

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01XFDUDYJgAACzvnptvVoYEL",
  "is_error": true,
  "content": "Erro: Cidade 'Atlantis' não foi encontrada na base de dados meteorológica."
}
```

---

## Exemplo Completo no SDK Python

```python
from anthropic import Anthropic

client = Anthropic()

tools = [
    {
        "name": "calcular_desconto",
        "description": "Calcula o valor final após aplicação de percentual de desconto.",
        "input_schema": {
            "type": "object",
            "properties": {
                "valor_original": {"type": "number"},
                "percentual": {"type": "number"}
            },
            "required": ["valor_original", "percentual"]
        }
    }
]

messages = [{"role": "user", "content": "Quanto fica um produto de R$ 350 com 15% de desconto?"}]

# 1. Primeira chamada
response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=tools,
    messages=messages
)

# 2. Verifica se Claude chamou ferramenta
if response.stop_reason == "tool_use":
    tool_block = next(b for b in response.content if b.type == "tool_use")
    print(f"Invocando ferramenta {tool_block.name} com args: {tool_block.input}")
    
    # Executa a função local
    valor = tool_block.input["valor_original"]
    desc = tool_block.input["percentual"]
    resultado = valor * (1 - desc / 100)
    
    # 3. Adiciona a resposta do assistente e o resultado da ferramenta ao histórico
    messages.append({"role": "assistant", "content": response.content})
    messages.append({
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": tool_block.id,
                "content": str(resultado)
            }
        ]
    })
    
    # 4. Segunda chamada para resposta final
    final_response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )
    print("Resposta final:", final_response.content[0].text)
```

---

## Veja Também

- [`../ferramentas_e_agentes/ferramentas_nativas.md`](../ferramentas_e_agentes/ferramentas_nativas.md)
- [`../ferramentas_e_agentes/infraestrutura_e_contexto_de_ferramentas.md`](../ferramentas_e_agentes/infraestrutura_e_contexto_de_ferramentas.md)
- [`../ferramentas_e_agentes/mcp_model_context_protocol.md`](../ferramentas_e_agentes/mcp_model_context_protocol.md)
