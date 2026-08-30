---
title: Claude no Google Cloud Vertex AI
description: Integração e implantação dos modelos Claude na infraestrutura do Google Cloud Vertex AI, autenticação IAM e uso de SDKs.
topics:
  - gcp
  - google-cloud
  - vertex-ai
  - gcp-sdk
keywords:
  - Google Cloud Vertex AI
  - AnthropicVertex
  - GCP IAM
related:
  - plataformas_em_nuvem/amazon_bedrock.md
  - plataformas_em_nuvem/microsoft_foundry.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/build-with-claude/claude-on-vertex-ai
---

# Claude no Google Cloud Vertex AI

Os modelos Claude estão disponíveis diretamente no **Google Cloud Vertex AI Model Garden**, permitindo que clientes GCP utilizem suas contas e créditos corporativos com faturamento consolidado.

---

## Exemplo com SDK Anthropic Vertex (`anthropic[vertex]`)

Instalação:
```bash
pip install "anthropic[vertex]"
```

Código Python:
```python
from anthropic import AnthropicVertex

client = AnthropicVertex(
    project_id="meu-projeto-gcp",
    region="us-central1"
)

response = client.messages.create(
    model="claude-3-7-sonnet@20250219",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explique as vantagens do Google Cloud Spanner."}
    ]
)

print(response.content[0].text)
```

---

## Veja Também

- [`../plataformas_em_nuvem/amazon_bedrock.md`](../plataformas_em_nuvem/amazon_bedrock.md)
- [`../plataformas_em_nuvem/microsoft_foundry.md`](../plataformas_em_nuvem/microsoft_foundry.md)
