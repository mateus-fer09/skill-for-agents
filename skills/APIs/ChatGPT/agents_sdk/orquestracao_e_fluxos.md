---
title: Orquestração Multi-Agente e Handoffs
description: Padrões de orquestração multi-agente no OpenAI Agents SDK, transferências de controle declarativas (handoffs) e agentes como ferramentas.
topics:
  - multi-agent
  - handoffs
  - agent-orchestration
  - agents-as-tools
keywords:
  - handoff
  - handoffs
  - Agent
  - Runner.run
  - triage agent
  - multi-agent orchestration
related:
  - ../agents_sdk/definicao_de_agentes.md
  - ../agents_sdk/guardrails_e_sandboxes.md
  - ../responses_api/gerenciamento_de_estado.md
source_scope:
  - https://developers.openai.com/api/docs/guides/agents/orchestration.md
  - https://developers.openai.com/api/docs/guides/responses-multi-agent.md
  - https://developers.openai.com/api/docs/guides/agents/running-agents.md
---

# Orquestração Multi-Agente e Handoffs

A orquestração multi-agente permite decompor problemas complexos em agentes especialistas menores, delegando tarefas e transferindo o controle da conversa de forma limpa e rastreável.

---

## 1. O Padrão Handoff (Transferência de Controle)

Um **Handoff** ocorre quando um agente (ex.: Agente de Triagem) decide que uma solicitação deve ser tratada por outro agente especialista (ex.: Suporte Técnico ou Faturamento):

```
                     [ Agente de Triagem ]
                            /     \
                (Handoff)  /       \  (Handoff)
                          v         v
             [ Suporte Técnico ]   [ Faturamento ]
```

---

## 2. Implementação Completa de Handoff no Agents SDK

```python
from agents import Agent, Runner, handoff

# 1. Definir Agentes Especialistas
agente_faturamento = Agent(
    name="Especialista em Faturamento",
    instructions="Você resolve dúvidas sobre notas fiscais, reembolsos e assinaturas.",
    model="gpt-5.6"
)

agente_suporte_tecnico = Agent(
    name="Especialista em Suporte Técnico",
    instructions="Você diagnostica falhas de conexão, erros de API e integrações.",
    model="gpt-5.6"
)

# 2. Definir Agente de Triagem com Handoffs Declarativos
agente_triagem = Agent(
    name="Agente de Triagem e Recepção",
    instructions="""
    Você recebe o usuário e avalia a intenção da mensagem.
    - Transfira para o Especialista em Faturamento se o assunto for pagamento, cartão ou nota fiscal.
    - Transfira para o Especialista em Suporte Técnico se o assunto for erro, bug ou API.
    """,
    model="gpt-5-mini",
    handoffs=[
        agente_faturamento,
        agente_suporte_tecnico
    ]
)

# 3. Execução
async def executar_atendimento():
    resultado = await Runner.run(
        agent=agente_triagem,
        input="Minha chamada para a API está retornando erro 403 Forbidden desde ontem."
    )
    print("Agente que finalizou a resposta:", resultado.last_agent.name)
    print("Resposta:", resultado.final_output)

# import asyncio; asyncio.run(executar_atendimento())
```

---

## 3. Padrão Agente como Ferramenta (*Agents-as-Tools*)

Diferente do Handoff (onde o controle da conversa muda de agente), no padrão **Agente como Ferramenta**, um agente coordenador invoca agentes subordinados como se fossem funções, recebendo o resultado de volta para sintetizar a resposta:

```python
from agents import Agent, as_tool

agente_pesquisador = Agent(
    name="Pesquisador Web",
    instructions="Colete dados e resuma notícias com referências.",
    model="gpt-5.6"
)

ferramenta_pesquisa = as_tool(agente_pesquisador)

agente_redator = Agent(
    name="Redator Chefe",
    instructions="Redija um relatório executivo utilizando as descobertas do Pesquisador Web.",
    model="gpt-5.6",
    tools=[ferramenta_pesquisa]
)
```

---

## 4. Rastreamento e Observabilidade de Execuções

O objeto de retorno `RunnerResult` disponibiliza o histórico detalhado de passos:

```python
for passo in resultado.steps:
    print(f"[{passo.agent_name}] Ação: {passo.type} -> {passo.details}")
```

---

## 5. Referências Cruzadas

- [`../agents_sdk/definicao_de_agentes.md`](../agents_sdk/definicao_de_agentes.md)
- [`../agents_sdk/guardrails_e_sandboxes.md`](../agents_sdk/guardrails_e_sandboxes.md)
- [`../exemplos/agent_multi_ferramentas.md`](../exemplos/agent_multi_ferramentas.md)
