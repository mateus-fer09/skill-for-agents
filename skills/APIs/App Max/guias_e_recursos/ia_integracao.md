---
title: "Integração da API Appmax com IA e MCP"
description: "Como conectar e utilizar agentes de IA (Claude, Cursor, Windsurf) com o servidor MCP oficial da Appmax."
topics:
  - ia
  - mcp
  - model-context-protocol
  - cursor
  - claude
  - windsurf
keywords:
  - ia
  - mcp
  - model context protocol
  - mcp-server
  - cursor
  - claude
  - windsurf
related:
  - ../index_master.md
  - webhooks.md
  - rate_limit.md
  - calculo_parcelas.md
source_scope:
  - https://docs.appmax.com.br/guides/ia
---

# Integração com IA

Sua documentação já está pronta para agentes de IA. Deixe Claude, Cursor ou qualquer cliente **Model Context Protocol (MCP)** escrever o código por você — lendo a referência da API em tempo real, sem você sair do editor.

## Por que usar IA?

Integrar pagamentos é ler documentação. Muita. Autenticação, criação de pedido, tokenização de cartão, webhooks, códigos de erro, rate limit, cálculo de parcelas...

Com o MCP oficial da Appmax, seu agente faz tudo isso sozinho:

- **Menos ida e volta** — o agente consulta a documentação por conta própria enquanto escreve código
- **Diagnóstico instantâneo** — erros HTTP identificados na hora, com causa-raiz e fix sugerido
- **Código pronto** — snippets em curl, Node, Python, PHP e Go com URLs corretas por ambiente
- **Onboarding guiado** — checklists personalizados e schemas tipados de webhooks

## Em ação

### Integrar do zero em minutos

Você pede uma integração completa de checkout — cliente, pedido, pagamento com Pix e cartão — e o agente escreve tudo consultando a API da Appmax em tempo real.

### Diagnóstico automático de erros

O agente recebe um HTTP 401 numa chamada a `/v1/customers`. Em vez de chutar, chama a ferramenta `diagnose_error` e identifica: credenciais de app foram usadas onde deveriam ser de merchant. Correção em segundos.

### Webhooks sem surpresas

A partir de "preciso receber confirmação de pagamento", o agente consulta o schema tipado do evento `order_approved` via `get_webhook_schema` e gera um handler completo com tipos corretos.

### Ajuste fino de payloads

"Adicione Pix como método de pagamento no meu fluxo atual" → o agente valida o payload com `validate_payload` antes de enviar, e gera o diff certo preservando o resto.

## O que seu agente sabe fazer

São **13 ferramentas** que o agente chama sozinho durante a conversa. Aqui vai o resumo por categoria — para a tabela completa com descrições e exemplos de uso detalhados, veja a [página de configuração](llms_txt_mcp.md).

**Documentação**

- `search_docs` — busca semântica na documentação
- `list_pages` — lista páginas disponíveis com filtro por prefixo
- `get_page` — retorna conteúdo completo de uma página
- `get_full_docs` — toda a documentação como texto plano
- `check_health` — status do servidor e estatísticas

**Diagnóstico**

- `diagnose_error` — causa-raiz de erros HTTP (401/422/429/500)
- `validate_payload` — valida payload JSON contra o schema do endpoint
- `validate_order_total` — confere cálculo do valor total de um pedido
- `validate_installation_flow` — audita a implementação do fluxo de instalação a partir de snippets do projeto

**Geração de código**

- `generate_code_snippet` — snippets em curl/Node/Python/PHP/Go
- `get_integration_flow` — fluxo passo-a-passo (checkout, instalação, recorrência)

**Onboarding e webhooks**

- `get_onboarding_checklist` — checklist administrativo por tipo de integração
- `get_webhook_schema` — schema tipado + payload de exemplo para 28 eventos

## Clientes compatíveis

Qualquer cliente que implemente o [Model Context Protocol](https://modelcontextprotocol.io/):

- **Claude Code** e **Claude Desktop**
- **Cursor**
- **Windsurf**
- **VS Code** (com extensão MCP / Copilot)
- **Cline**, **Aider**, **Continue** e outros

## Padrão aberto, sem lock-in

Nosso servidor implementa o [Model Context Protocol](https://modelcontextprotocol.io/) — padrão aberto mantido pela Anthropic para conectar agentes de IA a fontes de dados e ferramentas externas. Qualquer cliente compatível conecta sem adaptador proprietário.

## Próximos passos

- [Configurar o MCP](llms_txt_mcp.md): Configuração completa, tabela de ferramentas e exemplos de uso detalhados.
- [Quickstart](../primeiros_passos/quickstart.md): Prefere começar escrevendo código na mão? Vá direto ao guia rápido.

## Veja Também

- [Index Master](../index_master.md)
- [Webhooks](webhooks.md)
- [Rate Limit](rate_limit.md)
- [Calculo Parcelas](calculo_parcelas.md)
