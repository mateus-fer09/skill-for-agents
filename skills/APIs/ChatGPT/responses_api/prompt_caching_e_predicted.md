---
title: Prompt Caching e Predicted Outputs
description: Como funciona o Prompt Caching automático da OpenAI (50% de desconto em tokens cacheados) e a aceleração de geração com Predicted Outputs.
topics:
  - prompt-caching
  - predicted-outputs
  - latency-reduction
  - cost-reduction
keywords:
  - prompt_caching
  - cached_tokens
  - prediction
  - predicted_outputs
  - accepted_prediction_tokens
related:
  - ../responses_api/introducao_e_quickstart.md
  - ../fundamentos/rate_limits_e_custos.md
source_scope:
  - https://developers.openai.com/api/docs/guides/prompt-caching.md
  - https://developers.openai.com/api/docs/guides/predicted-outputs.md
---

# Prompt Caching e Predicted Outputs

Dois recursos de hardware e arquitetura na infraestrutura da OpenAI que reduzem drasticamente custos e latência de geração: **Prompt Caching** e **Predicted Outputs**.

---

## 1. Prompt Caching Automático

O **Prompt Caching** armazena automaticamente no cache dos servidores da OpenAI prefixos de contexto frequentes de prompts com **1.024 tokens ou mais**.

### Vantagens
- **Desconto de 50%** no custo por token de entrada nos tokens em cache.
- **Redução de até 80% na latência** de início de resposta (*Time To First Token*).
- **100% automático**: não exige nenhuma flag ou parâmetro de ativação no código.

### Como Estruturar Prompts para Maximizar o Cache Hit

```
[ INÍCIO DO PROMPT ]
  1. Instruções fixas do sistema / Developer messages (SEMPRE NO TOPO)  <--- Cache Hit
  2. Documentação estática / Esquemas JSON / Códigos de referência       <--- Cache Hit
  3. Histórico consolidado de turnos anteriores                          <--- Cache Parcial
  4. Pergunta ou comando novo do usuário (NO FINAL)                     <--- Novo processamento
[ FIM DO PROMPT ]
```

### Verificação de Tokens em Cache no Retorno

```python
response = client.responses.create(
    model="gpt-5.6",
    input=[
        {"role": "developer", "content": long_system_prompt_2000_tokens},
        {"role": "user", "content": "Qual o primeiro passo do procedimento?"}
    ]
)

print(f"Tokens totais de prompt: {response.usage.prompt_tokens}")
if hasattr(response.usage, "prompt_tokens_details"):
    print(f"Tokens em cache (50% desc): {response.usage.prompt_tokens_details.cached_tokens}")
```

---

## 2. Predicted Outputs (Aceleração de Refatoração de Código e Documentos)

Quando grande parte da resposta esperada já é previamente conhecida pela aplicação (por exemplo, ao solicitar a refatoração ou adição de um método a um arquivo existente de 500 linhas), o recurso **Predicted Outputs** permite passar o texto original como uma predição:

### Exemplo em Python

```python
codigo_original = """
class Calculadora:
    def somar(self, a, b):
        return a + b
    def subtrair(self, a, b):
        return a - b
"""

response = client.responses.create(
    model="gpt-5.6",
    input=f"Adicione tipagem estrita e docstrings ao código abaixo:\n\n{codigo_original}",
    prediction={
        "type": "content",
        "content": codigo_original
    }
)

print(response.output_text)
print(f"Tokens preditos aceitos: {response.usage.completion_tokens_details.accepted_prediction_tokens}")
```

### Comportamento
- A OpenAI valida os tokens preditos em paralelo; se o modelo optar por mantê-los, eles são gerados instantaneamente.
- O tempo total de geração pode cair de vários segundos para frações de segundo.

---

## 3. Referências Cruzadas

- [`../responses_api/introducao_e_quickstart.md`](../responses_api/introducao_e_quickstart.md)
- [`../fundamentos/rate_limits_e_custos.md`](../fundamentos/rate_limits_e_custos.md)
- [`../modelos/precificacao_e_limites.md`](../modelos/precificacao_e_limites.md)
