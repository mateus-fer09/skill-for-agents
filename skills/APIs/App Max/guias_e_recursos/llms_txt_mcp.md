---
title: "Recursos para LLMs (llms.txt e Prompting)"
description: "Orientações para consumo da API Appmax por modelos de linguagem, estrutura do llms.txt e boas práticas."
topics:
  - llms-txt
  - ia
  - prompts
  - padroes-ia
keywords:
  - llms.txt
  - llms-full.txt
  - system prompts
  - agentes ia
  - context window
related:
  - ../index_master.md
  - webhooks.md
  - rate_limit.md
  - calculo_parcelas.md
source_scope:
  - https://docs.appmax.com.br/llms.md
---

# MCP & llms.txt

Configure seu agente de IA para acessar a documentação da Appmax — via arquivo de texto plano ou servidor MCP com 13 ferramentas integradas.

## llms.txt

Disponibilizamos toda a documentação da Appmax API em um único arquivo de texto plano, seguindo o padrão [llms.txt](https://llmstxt.org/), para facilitar o consumo por modelos de linguagem (LLMs), agentes de IA e ferramentas de automação.

### Download

- [llms.txt](https://docs.appmax.com.br/llms.txt): Arquivo completo com toda a documentação em texto plano (~269 KB, 54 seções).
- [llms.txt (English)](https://docs.appmax.com.br/llms-en.txt): Full documentation in plain text, English version (~262 KB, 54 sections).

### O que é o llms.txt?

O [llms.txt](https://llmstxt.org/) é um padrão aberto que permite que sites disponibilizem seu conteúdo em formato otimizado para LLMs. Similar ao `robots.txt` para crawlers, o `llms.txt` facilita que agentes de IA acessem e compreendam a documentação de forma eficiente.

### O que está incluído

O arquivo contém todas as páginas da documentação em formato Markdown limpo:

- **Guias** — Quickstart, por onde começar, autenticação, instalação e callback, external-id, webhooks, rate limit, ambientes, publicação em produção, FAQ, IA & MCP
- **Exemplos** — Integração completa, parcelamento, recorrência, checkout
- **API Reference** — Clientes, pedidos, pagamentos (cartão, Pix, boleto, Apple Pay, Apple Pay merchant session), estornos, recorrência, links de pagamento
- **Split de pagamentos** — Guias (visão geral, status, bancos homologados, FAQ) + endpoints (recebedor, facematch, split de pedido, saldos, antecipação, saque)

### Como usar

#### Com Claude, ChatGPT ou outro LLM

Cole o conteúdo do arquivo como contexto na conversa:

```
Aqui está a documentação da API da Appmax:

[conteúdo do llms.txt]

Com base nessa documentação, me ajude a implementar...
```

#### Com agentes de IA

Aponte seu agente diretamente para a URL:

```
https://docs.appmax.com.br/llms.txt
```

## Servidor MCP

> **Padrão aberto**
>
> Nosso servidor implementa o [**Model Context Protocol**](https://modelcontextprotocol.io/) — o padrão aberto mantido pela Anthropic para conectar agentes de IA a fontes de dados e ferramentas externas. Qualquer cliente compatível com MCP (Claude Code, Claude Desktop, Cursor, Windsurf, VS Code com Copilot, entre outros) consegue se conectar sem adaptações proprietárias.
O servidor expõe **13 ferramentas**:

**Documentação**

| Ferramenta | Descrição |
| ---------- | --------- |
| `list_pages` | Lista páginas disponíveis. Suporta filtro por `prefix` (ex: `api-` para listar só endpoints). |
| `get_page` | Retorna o conteúdo completo de uma página por ID |
| `search_docs` | Busca por termo na documentação (top 10 por relevância) |
| `get_full_docs` | Retorna toda a documentação como texto plano (~140 KB) |
| `check_health` | Status do servidor e estatísticas da documentação |

**Diagnóstico**

| Ferramenta | Descrição |
| ---------- | --------- |
| `diagnose_error` | Diagnostica erros HTTP (401/422/429/500) com causa provável e fix sugerido |
| `validate_payload` | Valida payload JSON contra o schema do endpoint antes de enviar à API |
| `validate_order_total` | Confere o cálculo do valor total de um pedido localmente |
| `validate_installation_flow` | Audita a implementação do fluxo de instalação (4 etapas + URL de validação) a partir de snippets do projeto, reportando pass/fail por etapa |

**Geração de código**

| Ferramenta | Descrição |
| ---------- | --------- |
| `generate_code_snippet` | Gera snippet executável em curl/Node/Python/PHP/Go para qualquer endpoint |
| `get_integration_flow` | Retorna fluxo passo-a-passo completo (checkout, instalação, recorrência, etc.) |

**Onboarding e webhooks**

| Ferramenta | Descrição |
| ---------- | --------- |
| `get_onboarding_checklist` | Checklist administrativo personalizado por tipo de integração e estágio |
| `get_webhook_schema` | Schema tipado + payload de exemplo para qualquer dos 28 eventos de webhook |

### Health check

Antes de usar o MCP, verifique se o servidor está operacional:

```bash
curl https://m7nwi1m199.execute-api.us-east-1.amazonaws.com/health
```

Resposta esperada:

```json
{
  "status": "healthy",
  "name": "appmax-docs",
  "version": "1.0.0",
  "tools": ["list_pages", "get_page", "search_docs", "get_full_docs", "check_health",
            "diagnose_error", "validate_payload", "validate_order_total",
            "validate_installation_flow", "generate_code_snippet",
            "get_integration_flow", "get_onboarding_checklist", "get_webhook_schema"]
}
```

### Configuração

#### Claude Code

Adicione ao `.mcp.json` na raiz do seu projeto:

```json
{
  "mcpServers": {
    "appmax-docs": {
      "type": "http",
      "url": "https://m7nwi1m199.execute-api.us-east-1.amazonaws.com/mcp"
    }
  }
}
```

#### Claude Desktop

Claude Desktop ainda conecta via stdio nativamente, então é preciso o shim [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) (instalado sob demanda via `npx`) para bridgear stdio ↔ HTTP.

Adicione ao seu `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "appmax-docs": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://m7nwi1m199.execute-api.us-east-1.amazonaws.com/mcp"
      ]
    }
  }
}
```

Requer Node.js instalado no sistema (o `npx` vem junto).

#### Qualquer cliente MCP compatível

Aponte para o endpoint:

```
https://m7nwi1m199.execute-api.us-east-1.amazonaws.com/mcp
```

## Teste rápido

Após configurar, teste com uma chamada simples. Exemplo com `search_docs`:

```
Você: "Como funciona o webhook de confirmação de pagamento?"

O agente chama: search_docs({ "query": "webhook confirmação pagamento" })

Retorno: trechos relevantes dos guias de webhooks e status de pedidos.
```

Se o agente respondeu com conteúdo da documentação da Appmax, a conexão está funcionando. Agora você tem acesso às 13 ferramentas.

[Ver referência completa de todas as ferramentas →](ia_ferramentas_mcp.md)

## Próximos passos

- [Por que usar IA?](ia_integracao.md): Veja os benefícios, vídeos demonstrativos e como a IA acelera sua integração.
- [Quickstart](../primeiros_passos/quickstart.md): Prefere começar escrevendo código na mão? Vá direto ao guia rápido.

## Veja Também

- [Index Master](../index_master.md)
- [Webhooks](webhooks.md)
- [Rate Limit](rate_limit.md)
- [Calculo Parcelas](calculo_parcelas.md)
