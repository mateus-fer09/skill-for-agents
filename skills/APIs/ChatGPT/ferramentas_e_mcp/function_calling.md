---
title: Function Calling e Programmatic Tool Calling
description: Definição de ferramentas customizadas, schemas JSON estritos de parâmetros, ciclo de execução de ferramentas e Programmatic Tool Calling.
topics:
  - function-calling
  - tools
  - programmatic-tool-calling
  - tool-choice
keywords:
  - tools
  - type: function
  - function_call
  - function_call_output
  - tool_choice
related:
  - ../responses_api/introducao_e_quickstart.md
  - ../responses_api/structured_outputs.md
  - ../ferramentas_e_mcp/ferramentas_hospedadas.md
  - ../exemplos/agent_multi_ferramentas.md
source_scope:
  - https://developers.openai.com/api/docs/guides/function-calling.md
  - https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling.md
---

# Function Calling e Programmatic Tool Calling

O **Function Calling** permite que modelos da OpenAI conectem-se a sistemas externos, bancos de dados, APIs de terceiros e lógica de negócio personalizada.

---

## 1. Fluxo de Execução de Ferramentas

```
1. [Aplicação Cliente] ---> Envia prompt + lista de definições de ferramentas (tools)
              |
              v
2. [Modelo OpenAI]      ---> Decide chamar uma função e emite item "function_call" com argumentos JSON
              |
              v
3. [Aplicação Cliente] ---> Executa a função localmente (ex.: consulta SQL, chamada HTTP)
              |
              v
4. [Aplicação Cliente] ---> Envia o resultado com item "function_call_output" de volta à API
              |
              v
5. [Modelo OpenAI]      ---> Formula a resposta final fundamentada no resultado da ferramenta
```

---

## 2. Exemplo Completo em Python (Responses API)

```python
import json
from openai import OpenAI

client = OpenAI()

# 1. Definição da ferramenta com JSON Schema estrito
ferramentas = [
    {
        "type": "function",
        "name": "obter_clima_cidade",
        "description": "Retorna temperatura atual e condição meteorológica para uma cidade.",
        "parameters": {
            "type": "object",
            "properties": {
                "cidade": {
                    "type": "string",
                    "description": "Nome da cidade (ex.: 'São Paulo', 'Lisboa')."
                },
                "unidade": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Unidade de temperatura."
                }
            },
            "required": ["cidade", "unidade"],
            "additionalProperties": False
        },
        "strict": True
    }
]

# Função local simulada
def executar_obter_clima(cidade: str, unidade: str) -> dict:
    return {"cidade": cidade, "temperatura": 24, "condicao": "Ensolarado", "unidade": unidade}

# 2. Primeira requisição
resp1 = client.responses.create(
    model="gpt-5.6",
    input="Qual o clima atual em São Paulo em graus Celsius?",
    tools=ferramentas
)

# 3. Verificar se o modelo solicitou chamada de função
for item in resp1.output:
    if item.type == "function_call":
        call_id = item.call_id
        nome_funcao = item.name
        args = json.loads(item.arguments)
        print(f"Modelo solicitou: {nome_funcao}({args})")
        
        # Executar a função
        resultado = executar_obter_clima(**args)
        
        # 4. Enviar resultado de volta
        resp_final = client.responses.create(
            model="gpt-5.6",
            previous_response_id=resp1.id,
            input=[
                {
                    "type": "function_call_output",
                    "call_id": call_id,
                    "output": json.dumps(resultado)
                }
            ]
        )
        print("\nResposta Final do Modelo:")
        print(resp_final.output_text)
```

---

## 3. Controle de Seleção de Ferramentas (`tool_choice`)

É possível controlar como o modelo deve escolher as ferramentas através do parâmetro `tool_choice`:

- `"auto"` (Padrão): O modelo decide livremente se gera texto puro ou chama uma ou mais ferramentas.
- `"required"`: Força o modelo a chamar obrigatoriamente pelo menos uma das ferramentas fornecidas.
- `"none"`: Impede o modelo de acionar qualquer ferramenta (força resposta de texto).
- `{"type": "function", "name": "obter_clima_cidade"}`: Força a chamada de uma função específica.

---

## 4. Programmatic Tool Calling

O **Programmatic Tool Calling** permite que modelos escrevam e executem pequenos scripts em sandbox para orquestrar e encadear múltiplas chamadas de ferramentas de forma otimizada em um único passo, reduzindo idas e vindas de rede (*round-trips*).

---

## 5. Referências Cruzadas

- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
- [`../responses_api/structured_outputs.md`](../responses_api/structured_outputs.md)
- [`../ferramentas_e_mcp/ferramentas_hospedadas.md`](../ferramentas_e_mcp/ferramentas_hospedadas.md)
- [`../exemplos/agent_multi_ferramentas.md`](../exemplos/agent_multi_ferramentas.md)
