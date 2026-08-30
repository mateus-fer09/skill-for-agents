---
title: MCP (Model Context Protocol) e Conectores Gerenciados
description: Como integrar servidores MCP (Model Context Protocol) remotos, conectar serviços corporativos populares e usar Secure MCP Tunnels com a OpenAI API.
topics:
  - mcp
  - model-context-protocol
  - connectors
  - secure-mcp-tunnels
  - remote-tools
keywords:
  - mcp
  - Model Context Protocol
  - mcp_servers
  - connectors
  - Secure MCP Tunnel
related:
  - ../ferramentas_e_mcp/function_calling.md
  - ../ferramentas_e_mcp/ferramentas_hospedadas.md
  - ../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md
source_scope:
  - https://developers.openai.com/api/docs/guides/tools-connectors-mcp.md
  - https://developers.openai.com/api/docs/guides/secure-mcp-tunnels.md
  - https://developers.openai.com/api/docs/mcp.md
---

# MCP (Model Context Protocol) e Conectores Gerenciados

A OpenAI suporta nativamente o padrão aberto **Model Context Protocol (MCP)**, permitindo que os modelos descubram e executem ferramentas, recursos de dados e prompts hospedados em servidores MCP remotos ou locais.

---

## 1. O que é o Model Context Protocol (MCP)?

O MCP é um protocolo de comunicação aberto que padroniza como agentes de IA interagem com fontes de contexto externas. Ele permite:
- Descoberta dinâmica de ferramentas disponíveis (`tools/list`).
- Execução de ferramentas remotas com argumentos estruturados (`tools/call`).
- Leitura de recursos estáticos ou dinâmicos (`resources/read`).

---

## 2. Conectando Servidores MCP Remotos na Responses API

Você pode apontar a Responses API diretamente para endpoints MCP compatíveis com transporte SSE ou HTTP POST:

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input="Consulte a issue #42 no nosso repositório interno e resuma os comentários.",
    tools=[
        {
            "type": "mcp",
            "server_url": "https://mcp.minhaempresa.com/sse",
            "authorization": "Bearer MEU_TOKEN_MCP_INTERNO"
        }
    ]
]

print(response.output_text)
```

O modelo da OpenAI realiza a negociação automática com o servidor MCP, descobre as ferramentas necessárias (ex.: `github_get_issue`), executa as chamadas e formula a resposta fundamentada.

---

## 3. Conectores Gerenciados da OpenAI

A OpenAI oferece conectores pré-configurados e gerenciados para serviços empresariais populares:
- **GitHub & GitLab**: Acesso a código, commits, pull requests e issues.
- **PostgreSQL / MySQL / Snowflake / BigQuery**: Consultas seguras com sanitização de schema.
- **Slack & Microsoft Teams**: Envio e leitura de mensagens e canais.
- **Jira & Confluence**: Leitura e criação de tickets e artigos de conhecimento.
- **Google Drive & Microsoft OneDrive**: Busca e indexação de documentos.

---

## 4. Secure MCP Tunnels

Para conectar servidores MCP executados em redes locais, intranets corporativas ou VPCs privadas sem expor portas públicas na internet, a OpenAI disponibiliza o **Secure MCP Tunnel**:

```
[ Servidor MCP Privado / On-Prem ]
              | (Conexão de saída segura via TLS)
              v
[ Secure MCP Tunnel da OpenAI ]
              |
              v
[ OpenAI Responses API / Modelos ]
```

### Configuração do Agente de Túnel

```bash
# Iniciar túnel de saída seguro para um servidor MCP local na porta 8080
openai tunnel start --target-url http://localhost:8080 --name mcp-erp-interno
```

---

## 5. Referências Cruzadas

- [`../ferramentas_e_mcp/function_calling.md`](../ferramentas_e_mcp/function_calling.md)
- [`../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md`](../chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md)
- [`../agents_sdk/definicao_de_agentes.md`](../agents_sdk/definicao_de_agentes.md)
