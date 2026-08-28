---
title: "Function Calling e Tool Use na OpenAI API"
description: "Guia exaustivo de chamada de ferramentas (Function Calling) com a OpenAI API. Definição de ferramentas em tools, chamadas paralelas (parallel_tool_calls), controle de execução com tool_choice, validação estrita com strict: true e ciclo completo de execução de agentes em Python, TypeScript e cURL."
topics: ["function-calling", "tools", "parallel-tool-calls", "tool_choice", "agents", "json-schema", "strict-tools"]
keywords: ["tools", "tool_choice", "tool_calls", "finish_reason: tool_calls", "parallel_tool_calls", "strict: true", "client.chat.completions.create"]
source_scope: "OpenAI API Docs: Guides > Function Calling, Tool Use & Parallel Execution"
---

# Function Calling e Tool Use na OpenAI API

O **Function Calling** permite que modelos GPT conectem sua capacidade de raciocínio a bancos de dados, APIs externas, sistemas corporativos e código local de forma estruturada e determinística.

O modelo não executa o código diretamente: ele analisa o contexto, decide quais funções devem ser acionadas e gera os argumentos JSON exatos. O seu sistema executa a função localmente e devolve o resultado para que o modelo formule a resposta final.

---

## 1. Ciclo de Vida do Function Calling (O Loop do Agente)

```text
1. [Usuário] Pergunta algo que exige dados externos.
         │
         ▼
2. [Aplicação] Envia a mensagem + lista de `tools` para a OpenAI API.
         │
         ▼
3. [Modelo] Detecta a necessidade de ferramenta e retorna:
            `finish_reason == "tool_calls"` com array `tool_calls`.
         │
         ▼
4. [Aplicação] Executa o código local correspondente para cada `tool_call`.
         │
         ▼
5. [Aplicação] Adiciona o retorno com `role: "tool"` e `tool_call_id`.
         │
         ▼
6. [Modelo] Recebe os dados e gera a resposta final ao usuário.
```

---

## 2. Configurações de Controle (`tool_choice` e `parallel_tool_calls`)

| Parâmetro | Valores Possíveis | Comportamento |
| :--- | :--- | :--- |
| **`tool_choice`** | `"auto"` (Padrão) | O modelo decide se responde com texto ou chama uma ou mais ferramentas. |
| | `"none"` | O modelo é proibido de chamar ferramentas (responde apenas em texto). |
| | `"required"` | O modelo é forçado a chamar pelo menos uma ferramenta antes de responder. |
| | `{"type": "function", "function": {"name": "get_weather"}}` | O modelo é obrigado a chamar exatamente a função especificada. |
| **`parallel_tool_calls`** | `True` (Padrão) | Permite que o modelo emita múltiplos `tool_calls` simultâneos na mesma iteração. |
| | `False` | Força a execução estritamente sequencial (uma ferramenta por requisição). |

---

## 3. Implementação Completa em Python (Multi-Tools com Modo Estrito)

```python
import json
from openai import OpenAI

client = OpenAI()

# 1. Definição das funções locais do sistema
def consultar_cotacao_moeda(moeda_origem: str, moeda_destino: str) -> dict:
    # Simulação de consulta a API financeira
    taxas = {
        ("USD", "BRL"): 5.65,
        ("EUR", "BRL"): 6.15,
        ("BTC", "USD"): 68500.0,
    }
    taxa = taxas.get((moeda_origem.upper(), moeda_destino.upper()), 1.0)
    return {"origem": moeda_origem, "destino": moeda_destino, "cotacao": taxa}

def enviar_notificacao_slack(canal: str, mensagem: str) -> dict:
    return {"status": "sucesso", "canal": canal, "mensagem_enviada": mensagem}

# Mapa de dispatch para execução local
FUNCOES_DISPONIVEIS = {
    "consultar_cotacao_moeda": consultar_cotacao_moeda,
    "enviar_notificacao_slack": enviar_notificacao_slack,
}

# 2. Definição do catálogo de ferramentas (JSON Schema com strict: True)
tools = [
    {
        "type": "function",
        "function": {
            "name": "consultar_cotacao_moeda",
            "description": "Obtém a taxa de câmbio atual entre duas moedas.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "moeda_origem": {
                        "type": "string",
                        "description": "Código ISO da moeda de origem (ex: USD, EUR, BTC)"
                    },
                    "moeda_destino": {
                        "type": "string",
                        "description": "Código ISO da moeda de destino (ex: BRL, USD)"
                    }
                },
                "required": ["moeda_origem", "moeda_destino"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "enviar_notificacao_slack",
            "description": "Envia um alerta para um canal corporativo no Slack.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "canal": { "type": "string", "description": "Nome do canal (#financeiro, #alertas)" },
                    "mensagem": { "type": "string", "description": "Conteúdo do alerta" }
                },
                "required": ["canal", "mensagem"],
                "additionalProperties": False
            }
        }
    }
]

# 3. Requisição Inicial do Usuário
messages = [
    {"role": "developer", "content": "Você é um assistente de tesouraria corporativa."},
    {"role": "user", "content": "Verifique a cotação atual de USD para BRL e EUR para BRL, e avise no canal #financeiro se o dólar estiver acima de R$ 5,50."}
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice="auto",
    parallel_tool_calls=True,
)

response_message = response.choices[0].message
messages.append(response_message)

# 4. Processamento dos Tool Calls
if response_message.tool_calls:
    print(f"O modelo solicitou {len(response_message.tool_calls)} chamadas de ferramenta:")
    
    for tool_call in response_message.tool_calls:
        func_name = tool_call.function.name
        func_args = json.loads(tool_call.function.arguments)
        print(f"-> Executando '{func_name}' com args: {func_args}")
        
        # Executa a função correspondente
        func_target = FUNCOES_DISPONIVEIS.get(func_name)
        if func_target:
            resultado = func_target(**func_args)
        else:
            resultado = {"erro": "Função não encontrada"}
            
        # Adiciona a resposta da ferramenta com o ID único
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(resultado)
        })

    # 5. Segunda chamada para sintetizar a resposta final
    final_response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )
    
    print("
Resposta Final do Modelo:
", final_response.choices[0].message.content)
```

---

## 4. Implementação em TypeScript / Node.js

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'obter_status_pedido',
      description: 'Consulta o status de entrega e localização de um pedido de e-commerce.',
      parameters: {
        type: 'object',
        properties: {
          pedidoId: { type: 'string', description: 'Número do pedido (ex: PED-9988)' },
        },
        required: ['pedidoId'],
        additionalProperties: false,
      },
      strict: true,
    },
  },
];

async function executarAgente() {
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'user', content: 'Onde está meu pedido PED-9988?' },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    tools,
  });

  const message = response.choices[0]?.message;

  if (message?.tool_calls && message.tool_calls.length > 0) {
    messages.push(message);

    for (const toolCall of message.tool_calls) {
      if (toolCall.function.name === 'obter_status_pedido') {
        const args = JSON.parse(toolCall.function.arguments);
        console.log(`Buscando pedido: ${args.pedidoId}`);
        
        // Resposta mock da base de dados
        const resultadoMock = {
          pedidoId: args.pedidoId,
          status: 'EM_TRANSITO',
          localizacaoAtual: 'Centro de Distribuição São Paulo',
          previsaoEntrega: '2026-08-30',
        };

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(resultadoMock),
        });
      }
    }

    const respostaFinal = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    console.log('Resposta ao cliente:', respostaFinal.choices[0]?.message.content);
  }
}

executarAgente();
```

---

## 5. Boas Práticas de Engenharia para Function Calling

1. **Descrições Ricas e Semânticas:** O modelo depende fortemente do campo `description` da função e dos parâmetros para decidir quando e como invocá-los.
2. **Ative Sempre `strict: true`:** Garante que argumentos ausentes ou com tipos incompatíveis nunca sejam gerados.
3. **Trate Falhas de Execução Elegantemente:** Se o código local falhar (ex: timeout de banco de dados), devolva um JSON com `{"error": "Motivo da falha"}` para que o modelo informe o usuário com clareza.
4. **Proteção contra Loops Infinitos:** Em arquiteturas de agentes autônomos recursivos, limite o número máximo de iterações do loop (ex: no máximo 5 passos por requisição).
