---
title: Model Context Protocol (MCP) e Túneis Seguros
description: Padrão aberto MCP da Anthropic, servidores MCP remotos, MCP Connector, implantação de túneis com Docker e Helm, e arquitetura de segurança.
topics:
  - mcp
  - model-context-protocol
  - mcp-tunnels
  - remote-servers
  - connectors
keywords:
  - Model Context Protocol
  - MCP
  - MCP Tunnels
  - Docker Compose
  - Helm
related:
  - ferramentas_e_agentes/tool_use_visao_geral.md
  - managed_agents/visao_geral_e_arquitetura.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/remote-mcp-servers
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/mcp-connector
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/mcp-tunnels/concepts
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/mcp-tunnels/quickstart
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/mcp-tunnels/deploy-compose
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/mcp-tunnels/deploy-helm
---

# Model Context Protocol (MCP) e Túneis Seguros

O **Model Context Protocol (MCP)** é um protocolo aberto desenvolvido pela Anthropic que estabelece uma interface universal e padronizada para conectar modelos de IA a fontes de dados, repositórios de código, bancos de dados e ferramentas corporativas.

---

## Arquitetura do MCP

```
[Claude / Managed Agent]
          │
          │ Protocolo MCP (JSON-RPC 2.0 sobre SSE / Stdio)
          ▼
[MCP Client / Connector]
          │
    ┌─────┴────────────────────────┐
    ▼                              ▼
[Servidor MCP Local]      [Servidor MCP Remoto (via MCP Tunnel)]
 (PostgreSQL / Git / FS)    (APIs Corporativas / Jira / Snowflake)
```

---

## Componentes Centrais do MCP

1. **Prompts**: Templates reutilizáveis fornecidos pelo servidor para orientar a interação do modelo.
2. **Resources**: Fontes de dados estáticas ou dinâmicas (arquivos, esquemas de bancos, logs) que podem ser lidas pelo cliente.
3. **Tools**: Funções executáveis que o Claude pode invocar diretamente (equivalente a Tool Calling padronizado).

---

## Túneis MCP Seguros (MCP Tunnels)

Os **MCP Tunnels** permitem que Managed Agents ou a Claude API na nuvem acessem com segurança servidores MCP hospedados dentro da rede privada da sua empresa (on-premises ou em VPCs isoladas) sem expor portas públicas na internet.

### Implantação com Docker Compose:

```yaml
version: '3.8'

services:
  mcp-tunnel:
    image: anthropic/mcp-tunnel:latest
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - TUNNEL_ID=${TUNNEL_ID}
      - TUNNEL_SECRET=${TUNNEL_SECRET}
      - TARGET_MCP_SERVER_URL=http://mcp-server:8080
    restart: always

  mcp-server:
    image: meupacote/meu-servidor-mcp:latest
    ports:
      - "8080:8080"
```

### Implantação com Kubernetes (Helm):

```bash
helm repo add anthropic https://charts.anthropic.com
helm install meu-tunel anthropic/mcp-tunnel \
     --set tunnel.id="tun_01XFDUDYJgAACzvnptvVoYEL" \
     --set tunnel.secret="secret_value" \
     --set targetUrl="http://servico-mcp-interno.default.svc.cluster.local:8080"
```

---

## Veja Também

- [`../ferramentas_e_agentes/tool_use_visao_geral.md`](../ferramentas_e_agentes/tool_use_visao_geral.md)
- [`../managed_agents/visao_geral_e_arquitetura.md`](../managed_agents/visao_geral_e_arquitetura.md)
- [`../administracao_e_governanca/admin_api.md`](../administracao_e_governanca/admin_api.md)
