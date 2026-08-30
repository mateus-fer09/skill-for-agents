---
title: Claude na Amazon Web Services (AWS) e Bedrock
description: Guia de implantação e utilização dos modelos Claude no Amazon Bedrock (Opus 4.7+, Claude 3.5/3.7 Sonnet) e Claude Platform on AWS com permissões IAM.
topics:
  - aws
  - amazon-bedrock
  - iam
  - bedrock-sdk
keywords:
  - Amazon Bedrock
  - Claude on AWS
  - boto3
  - IAM actions
related:
  - fundamentos/modelos_e_precos.md
  - plataformas_em_nuvem/google_cloud_vertex_ai.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/build-with-claude/claude-in-amazon-bedrock
  - https://platform.claude.com/docs/pt-BR/build-with-claude/claude-on-amazon-bedrock-legacy
  - https://platform.claude.com/docs/pt-BR/build-with-claude/claude-platform-on-aws
  - https://platform.claude.com/docs/pt-BR/api/claude-platform-on-aws-iam-actions
---

# Claude na Amazon Web Services (AWS) e Bedrock

A Anthropic mantém parceria estratégica com a AWS para oferecer os modelos Claude totalmente integrados ao **Amazon Bedrock** e via **Claude Platform on AWS**.

---

## Model IDs no Amazon Bedrock

| Modelo | Model ID no Bedrock (Converse API) |
|---|---|
| **Claude 3.7 Sonnet** | `us.anthropic.claude-3-7-sonnet-20250219-v1:0` |
| **Claude 3.5 Sonnet** | `us.anthropic.claude-3-5-sonnet-20241022-v2:0` |
| **Claude 3.5 Haiku** | `us.anthropic.claude-3-5-haiku-20241022-v1:0` |
| **Claude 3 Opus** | `us.anthropic.claude-3-opus-20240229-v1:0` |

---

## Exemplo de Invocação com Python (`boto3` e `Converse API`)

```python
import boto3

bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-east-1"
)

response = bedrock.converse(
    modelId="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    messages=[
        {
            "role": "user",
            "content": [{"text": "Como projetar uma arquitetura serverless orientada a eventos na AWS?"}]
        }
    ],
    inferenceConfig={
        "maxTokens": 1024,
        "temperature": 0.7
    }
)

output_text = response["output"]["message"]["content"][0]["text"]
print(output_text)
```

---

## Usando o SDK Oficial `anthropic` com AWS Bedrock Client

O SDK oficial da Anthropic possui suporte nativo ao Bedrock:

```python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(
    aws_region="us-east-1"
)

response = client.messages.create(
    model="anthropic.claude-3-7-sonnet-20250219-v1:0",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Olá via Bedrock!"}]
)

print(response.content[0].text)
```

---

## Veja Também

- [`../plataformas_em_nuvem/google_cloud_vertex_ai.md`](../plataformas_em_nuvem/google_cloud_vertex_ai.md)
- [`../plataformas_em_nuvem/microsoft_foundry.md`](../plataformas_em_nuvem/microsoft_foundry.md)
