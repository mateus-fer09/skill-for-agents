---
title: Guardrails, Aprovação Humana e Sandboxes
description: Implementação de travas de segurança (guardrails de entrada e saída), aprovação humana (Human-in-the-Loop) e isolamento de execução em Sandboxes.
topics:
  - guardrails
  - human-in-the-loop
  - sandboxes
  - security-checks
keywords:
  - input_guardrails
  - output_guardrails
  - approvals
  - sandbox
  - Human-in-the-Loop
related:
  - ../agents_sdk/definicao_de_agentes.md
  - ../agents_sdk/orquestracao_e_fluxos.md
  - ../fine_tuning_e_evals/red_teaming_e_moderacao.md
source_scope:
  - https://developers.openai.com/api/docs/guides/agents/guardrails-approvals.md
  - https://developers.openai.com/api/docs/guides/agents/sandboxes.md
  - https://developers.openai.com/api/docs/guides/safety-best-practices.md
---

# Guardrails, Aprovação Humana e Ambientes Sandbox

Para garantir segurança, conformidade e confiabilidade em sistemas agênticos em produção, o OpenAI Agents SDK oferece suporte nativo a **Guardrails**, **Aprovações Humanas (*Human-in-the-Loop*)** e execução isolada em **Sandboxes**.

---

## 1. Guardrails de Entrada e Saída

Guardrails atuam como verificadores síncronos que interceptam a entrada antes do agente processar, ou a saída antes de ser entregue ao usuário:

### Exemplo de Guardrail no Agents SDK

```python
from agents import Agent, Guardrail, GuardrailResult

# Definir função de validação de segurança
async def validar_dados_sensiveis(contexto, mensagem: str) -> GuardrailResult:
    # Checar presença de CPF ou números de cartão de crédito
    if "cpf" in mensagem.lower() or "cartao" in mensagem.lower():
        return GuardrailResult(
            passed=False,
            reason="A mensagem contém possíveis dados sensíveis não autorizados para processamento."
        )
    return GuardrailResult(passed=True)

guardrail_privacidade = Guardrail(
    name="Filtro de Privacidade LGPD",
    validator=validar_dados_sensiveis
)

# Associar guardrail ao agente
agente_seguro = Agent(
    name="Assistente Corporativo Seguro",
    instructions="Responda a dúvidas sobre procedimentos internos.",
    model="gpt-5.6",
    input_guardrails=[guardrail_privacidade]
)
```

---

## 2. Aprovação Humana (*Human-in-the-Loop Approvals*)

Para ações de alto impacto (ex.: exclusão de banco de dados, transferências financeiras, envio de e-mails em massa), você pode exigir confirmação humana explícita antes que uma ferramenta seja executada:

```python
from agents import function_tool

@function_tool(requires_approval=True)
def realizar_estorno_pagamento(pedido_id: str, valor: float) -> str:
    """Executa o estorno financeiro de um pedido."""
    return f"Estorno de R$ {valor:.2f} processado para o pedido {pedido_id}."
```

Quando o agente decide acionar esta ferramenta, o runner pausa a execução no estado `waiting_for_approval` e emite uma notificação para que a aplicação ou o operador aprove ou rejeite a ação.

---

## 3. Ambientes Sandbox (Isolamento de Execução)

Ao permitir que agentes executem código Python ou comandos de shell (como no Code Interpreter ou Local Shell), o Agents SDK separa a camada de **orquestração** da camada de **execução**:

```
[ Agente / Orquestrador (LLM) ]
              | (Envia código a ser executado)
              v
[ Container Sandbox Isolado ] ---> Executa sem acesso à rede externa ou variáveis confidenciais
              | (Retorna stdout / stderr / gráficos gerados)
              v
[ Agente / Orquestrador ]
```

### Boas Práticas para Sandboxes
1. Limite de tempo de execução (*timeout*) estrito por comando (ex.: 15 segundos).
2. Limite de memória RAM e CPU alocada por sessão de agente.
3. Desabilite permissões de escrita fora do diretório temporário `/tmp`.

---

## 4. Referências Cruzadas

- [`../agents_sdk/definicao_de_agentes.md`](../agents_sdk/definicao_de_agentes.md)
- [`../agents_sdk/orquestracao_e_fluxos.md`](../agents_sdk/orquestracao_e_fluxos.md)
- [`../fine_tuning_e_evals/red_teaming_e_moderacao.md`](../fine_tuning_e_evals/red_teaming_e_moderacao.md)
