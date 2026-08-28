---
title: Function Calling e Tool Use Avançado
description: Guia completo sobre declaração de ferramentas, ToolConfig com modos AUTO, ANY, NONE, execução paralela de funções e loop conversacional multi-turn com a Google Gemini API.
---

# Function Calling e Tool Use Avançado

## 1. Arquitetura de Function Calling

O recurso de **Function Calling** permite conectar os modelos Gemini a bancos de dados, APIs externas, sistemas corporativos e código customizado.

```text
[ 1. Usuário envia Pergunta ]
             │
             ▼
[ 2. Gemini decide invocar Ferramenta ]
  └─ Retorna: functionCall { name: "consultar_saldo", args: { contaId: "123" } }
             │
             ▼
[ 3. Sua Aplicação executa a Função Real ]
  └─ Consulta DB / API e obtém: { saldo: 5420.50, moeda: "BRL" }
             │
             ▼
[ 4. Aplicação envia functionResponse ao Gemini ]
  └─ Envia: types.Part.from_function_response(...)
             │
             ▼
[ 5. Gemini sintetiza a Resposta Final em Linguagem Natural ]
  └─ "O saldo atual da sua conta 123 é de R$ 5.420,50."
```

---

## 2. Modos de Controle de Ferramentas (`ToolConfig`)

Você pode controlar estritamente o comportamento do modelo via `function_calling_config`:

| Modo (`FunctionCallingConfigMode`) | Comportamento do Modelo |
| :--- | :--- |
| **`AUTO`** (Padrão) | O modelo decide livremente se responde em texto ou se invoca uma ou mais funções declaradas. |
| **`ANY`** (Forçado) | O modelo é OBRIGADO a invocar uma função. É possível restringir para um subconjunto com `allowed_function_names`. |
| **`NONE`** | O modelo é proibido de invocar funções (mesmo que ferramentas estejam declaradas). |

---

## 3. Implementação Completa em Python (`google-genai`)

```python
from google import genai
from google.genai import types

client = genai.Client()

# 1. Definição da função de negócio
def cotacao_moeda(moeda_origem: str, moeda_destino: str) -> dict:
    """Consulta a taxa de câmbio atual entre duas moedas internacionais.
    
    Args:
        moeda_origem: Código ISO da moeda de origem (ex: USD, EUR, BTC)
        moeda_destino: Código ISO da moeda de destino (ex: BRL, USD)
    """
    taxas = {
        ("USD", "BRL"): 5.85,
        ("EUR", "BRL"): 6.15,
        ("BTC", "USD"): 95000.00
    }
    taxa = taxas.get((moeda_origem.upper(), moeda_destino.upper()), 1.0)
    return {"moeda_origem": moeda_origem, "moeda_destino": moeda_destino, "taxa": taxa}

# 2. Execução do primeiro turno de geração com ferramenta
prompt = "Quantos reais eu recebo se converter 200 dólares hoje?"

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=prompt,
    config=types.GenerateContentConfig(
        tools=[cotacao_moeda],
        tool_config=types.ToolConfig(
            function_calling_config=types.FunctionCallingConfig(
                mode=types.FunctionCallingConfigMode.AUTO
            )
        )
    )
)

# 3. Verificação e execução da chamada
if response.function_calls:
    call = response.function_calls[0]
    print(f"Modelo solicitou a função: {call.name}")
    print(f"Argumentos recebidos: {call.args}")

    # Execução local da função
    resultado = cotacao_moeda(**call.args)

    # 4. Envio do retorno da função de volta ao modelo
    final_response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            types.Content(role="user", parts=[types.Part.from_text(text=prompt)]),
            response.candidates[0].content,
            types.Content(
                role="user",
                parts=[
                    types.Part.from_function_response(
                        name=call.name,
                        response={"result": resultado}
                    )
                ]
            )
        ]
    )

    print("
Resposta Final do Assistente:")
    print(final_response.text)
```

---

## 4. Implementação em TypeScript (`@google/genai`)

```typescript
import { GoogleGenAI, Type, FunctionCallingMode } from '@google/genai';

const ai = new GoogleGenAI({});

const toolCotacao = {
  functionDeclarations: [
    {
      name: 'cotacaoMoeda',
      description: 'Consulta a taxa de câmbio atual entre duas moedas.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          moedaOrigem: { type: Type.STRING, description: 'Ex: USD, EUR' },
          moedaDestino: { type: Type.STRING, description: 'Ex: BRL' },
        },
        required: ['moedaOrigem', 'moedaDestino'],
      },
    },
  ],
};

async function runFunctionCalling() {
  const prompt = 'Quantos reais eu recebo ao converter 100 euros?';

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      tools: [toolCotacao],
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingMode.AUTO,
        },
      },
    },
  });

  if (response.functionCalls && response.functionCalls.length > 0) {
    const call = response.functionCalls[0];
    const resultadoSimulado = { taxa: 6.15, valorConvertido: 615.0 };

    const finalResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        { role: 'user', parts: [{ text: prompt }] },
        response.candidates![0].content!,
        {
          role: 'user',
          parts: [
            {
              functionResponse: {
                name: call.name!,
                response: { output: resultadoSimulado },
              },
            },
          ],
        },
      ],
    });

    console.log('Resposta final:', finalResponse.text);
  }
}

runFunctionCalling().catch(console.error);
```
