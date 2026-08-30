---
title: Definição de Agentes no OpenAI Agents SDK
description: Guia completo do OpenAI Agents SDK, definição de instruções, modelos, ferramentas locais/remotas, contexto e ciclo de execução de agentes.
topics:
  - agents-sdk
  - agent-definition
  - instructions
  - agent-tools
  - python-agents
keywords:
  - Agent
  - Runner
  - Agents SDK
  - instructions
  - tools
  - handoffs
related:
  - ../agents_sdk/orquestracao_e_fluxos.md
  - ../agents_sdk/guardrails_e_sandboxes.md
  - ../ferramentas_e_mcp/function_calling.md
source_scope:
  - https://developers.openai.com/api/docs/guides/agents.md
  - https://developers.openai.com/api/docs/guides/agents/define-agents.md
  - https://developers.openai.com/api/docs/guides/agents/quickstart.md
---

# Definição de Agentes no OpenAI Agents SDK

O **OpenAI Agents SDK** é uma biblioteca oficial de alto nível projetada para construir, executar, orquestrar e monitorar agentes autônomos orientados a objetivos com suporte a múltiplos modelos, ferramentas, handoffs e guardrails.

---

## 1. Instalação do SDK de Agentes

```bash
pip install openai-agents
```

---

## 2. Conceitos Centrais: O Objeto `Agent`

Um agente no Agents SDK é composto por:
- **`name`**: Nome identificador do agente.
- **`instructions`**: Diretrizes de personalidade, regras de negócio e objetivos (pode ser uma string estática ou uma função dinâmica que recebe o contexto da execução).
- **`model`**: Modelo padrão a ser utilizado (ex.: `"gpt-5.6"`, `"o3-mini"`).
- **`tools`**: Lista de funções Python decoradas, ferramentas nativas ou servidores MCP.
- **`handoffs`**: Lista de outros agentes para os quais este agente pode transferir o controle.

---

## 3. Exemplo de Definição e Execução de Agente

```python
from agents import Agent, Runner, function_tool
from typing import Dict

# 1. Definir uma ferramenta com decorator
@function_tool
def consultar_saldo_cliente(cliente_id: str) -> Dict[str, float]:
    """Consulta o saldo bancário disponível para um cliente específico."""
    # Simulação de consulta ao banco de dados
    return {"cliente_id": cliente_id, "saldo_disponivel": 14520.50, "moeda": "BRL"}

# 2. Definir o agente
agente_financeiro = Agent(
    name="Agente de Consultoria Financeira",
    instructions="""
    Você é um consultor financeiro corporativo.
    Sempre consulte o saldo do cliente antes de recomendar investimentos.
    Seja formal, objetivo e forneça cálculos precisos.
    """,
    model="gpt-5.6",
    tools=[consultar_saldo_cliente]
)

# 3. Executar o agente com Runner
async def main():
    resultado = await Runner.run(
        agent=agente_financeiro,
        input="Qual o meu saldo e qual percentual posso alocar em renda fixa com segurança para o cliente_id 'CLI-8891'?"
    )
    print(resultado.final_output)

# Em ambiente assíncrono:
# import asyncio; asyncio.run(main())
```

---

## 4. Instruções Dinâmicas Baseadas em Contexto

As instruções do agente podem ser geradas dinamicamente com base no estado da sessão:

```python
def gerar_instrucoes_dinamicas(contexto) -> str:
    idioma = contexto.get("idioma", "pt-BR")
    perfil = contexto.get("perfil_risco", "moderado")
    return f"Atenda o cliente no idioma '{idioma}'. Considere que o perfil de investimento é '{perfil}'."

agente_personalizado = Agent(
    name="Agente Dinâmico",
    instructions=gerar_instrucoes_dinamicas,
    model="gpt-5.6"
)
```

---

## 5. Referências Cruzadas

- [`../agents_sdk/orquestracao_e_fluxos.md`](../agents_sdk/orquestracao_e_fluxos.md)
- [`../agents_sdk/guardrails_e_sandboxes.md`](../agents_sdk/guardrails_e_sandboxes.md)
- [`../ferramentas_e_mcp/function_calling.md`](../ferramentas_e_mcp/function_calling.md)
- [`../exemplos/agent_multi_ferramentas.md`](../exemplos/agent_multi_ferramentas.md)
