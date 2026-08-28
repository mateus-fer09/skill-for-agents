---
title: "Fine-Tuning API: Customização Supervisionada e DPO de Modelos"
description: "Guia completo de Fine-Tuning na OpenAI API. Treinamento supervisionado (SFT) e otimização por preferência direta (DPO) para gpt-4o e gpt-4o-mini, validação e formatação de datasets JSONL, hiperparâmetros (n_epochs, batch_size, learning_rate), monitoramento de métricas e inferência com modelos customizados."
topics: ["fine-tuning", "sft", "dpo", "custom-models", "jsonl-datasets", "hyperparameters", "model-training"]
keywords: ["/v1/fine_tuning/jobs", "client.fine_tuning.jobs.create", "purpose: fine-tune", "gpt-4o-mini-2024-07-18", "dpo", "n_epochs", "learning_rate_multiplier"]
source_scope: "OpenAI API Docs: Guides > Fine-Tuning, Supervised Fine-Tuning & Direct Preference Optimization (DPO)"
---

# Fine-Tuning API: Customização Supervisionada e DPO de Modelos

O **Fine-Tuning** permite ajustar os pesos de um modelo fundacional da OpenAI para dominar uma tarefa específica, seguir uma formatação de resposta estrita e complexa, adotar um tom de voz corporativo proprietário ou reduzir custos e latência encurtando prompts longos.

---

## 1. Quando Fazer Fine-Tuning?

| Abordagem | Quando Utilizar | Vantagens |
| :--- | :--- | :--- |
| **Prompt Engineering & Few-Shot** | Início do projeto, prototipagem, tarefas dinâmicas | Rápido, sem custo de treino |
| **RAG (File Search / Embeddings)** | Recuperar fatos dinâmicos e bases de conhecimento externas | Mantém conhecimento sempre atualizado |
| **Fine-Tuning Supervisionado (SFT)** | Ensinar um estilo rígido, sintaxe complexa ou comprimir prompts longos | Reduz tokens de prompt em até 80%, latência menor |
| **Direct Preference Optimization (DPO)** | Ajustar nuances de qualidade comparando respostas boas vs ruins | Alinhamento fino de comportamento sem RL complexo |

---

## 2. Modelos Suportados para Fine-Tuning

- `gpt-4o-mini-2024-07-18` (Recomendado para a grande maioria dos casos)
- `gpt-4o-2024-08-06`
- `babbage-002` e `davinci-002` (Apenas completions legadas)

---

## 3. Formato do Dataset de Treinamento (JSONL)

### 3.1. Formato Conversacional Padrão (SFT)
Cada linha deve conter o array `messages` com a conversa esperada:

```json
{"messages": [{"role": "system", "content": "Você é o assistente de suporte da CloudCorp."}, {"role": "user", "content": "Como crio uma chave SSH?"}, {"role": "assistant", "content": "Acesse Painel > Segurança > Chaves SSH e clique em 'Adicionar Nova'."}]}
{"messages": [{"role": "system", "content": "Você é o assistente de suporte da CloudCorp."}, {"role": "user", "content": "Qual o limite de instâncias?"}, {"role": "assistant", "content": "O limite padrão é de 20 instâncias por região."}]}
```

### 3.2. Formato com Chamada de Ferramentas (Function Calling)
O dataset de fine-tuning suporta exemplos de invocação de ferramentas com o objeto `tools` e mensagens `role: "tool"`.

### 3.3. Formato de Preferência Direta (DPO)
Para DPO, o dataset inclui a resposta preferida e a não preferida:

```json
{
  "input": {
    "messages": [
      {"role": "user", "content": "Explique o que é polimorfismo em POO."}
    ]
  },
  "preferred_output": [
    {"role": "assistant", "content": "Polimorfismo é a capacidade de objetos de diferentes classes responderem à mesma mensagem de maneiras distintas..."}
  ],
  "non_preferred_output": [
    {"role": "assistant", "content": "É quando uma coisa tem várias formas no código."}
  ]
}
```

---

## 4. Implementação Completa em Python

```python
import time
from openai import OpenAI

client = OpenAI()

# 1. Upload do arquivo de treino e arquivo de validação
with open("treino_dataset.jsonl", "rb") as f_train:
    train_file = client.files.create(file=f_train, purpose="fine-tune")

with open("validacao_dataset.jsonl", "rb") as f_val:
    val_file = client.files.create(file=f_val, purpose="fine-tune")

print(f"Arquivos enviados: Treino={train_file.id} | Validação={val_file.id}")

# 2. Iniciar o Job de Fine-Tuning
ft_job = client.fine_tuning.jobs.create(
    training_file=train_file.id,
    validation_file=val_file.id,
    model="gpt-4o-mini-2024-07-18",
    hyperparameters={
        "n_epochs": 3,
        "batch_size": "auto",
        "learning_rate_multiplier": "auto"
    },
    suffix="cloudcorp-suporte-v1"
)
print(f"Job de Fine-Tuning iniciado: {ft_job.id} | Status: {ft_job.status}")

# 3. Monitoramento de Eventos e Métricas
while ft_job.status not in ["succeeded", "failed", "cancelled"]:
    time.sleep(30)
    ft_job = client.fine_tuning.jobs.retrieve(ft_job.id)
    print(f"Status atual: {ft_job.status} (Tokens treinados: {ft_job.trained_tokens})")

# 4. Utilizando o Modelo Treinado em Produção
if ft_job.status == "succeeded":
    modelo_customizado = ft_job.fine_tuned_model
    print(f"
Modelo pronto para inferência: {modelo_customizado}")

    response = client.chat.completions.create(
        model=modelo_customizado,
        messages=[
            {"role": "system", "content": "Você é o assistente de suporte da CloudCorp."},
            {"role": "user", "content": "Como renovo meu certificado SSL?"}
        ]
    )
    print("Resposta do Modelo Customizado:
", response.choices[0].message.content)
```

---

## 5. Validação de Dataset e Boas Práticas

1. **Quantidade Mínima Recomendada:** Embora 10 exemplos sejam o mínimo técnico, para resultados expressivos em produção utilize entre **50 e 500 exemplos de alta qualidade**.
2. **Consistência de System Prompt:** Mantenha exatamente as mesmas instruções de sistema em todos os exemplos de treino e nas chamadas de produção.
3. **Divisão de Validação (Split):** Reserve sempre 10% a 20% do dataset para o arquivo de validação a fim de monitorar `valid_loss` e evitar *overfitting*.
