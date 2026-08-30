---
title: Exemplo Completo — Agente Multi-Ferramentas com Agents SDK
description: Implementação de um agente autônomo completo com o OpenAI Agents SDK combinando busca web, ferramentas personalizadas em Python e handoffs.
topics:
  - examples
  - agents-sdk
  - multi-tool-agent
  - handoff-example
keywords:
  - Agent
  - Runner
  - function_tool
  - web_search
  - handoff
related:
  - ../agents_sdk/definicao_de_agentes.md
  - ../agents_sdk/orquestracao_e_fluxos.md
  - ../ferramentas_e_mcp/function_calling.md
source_scope:
  - https://developers.openai.com/api/docs/guides/agents/quickstart.md
---

# Exemplo Completo — Agente Multi-Ferramentas com Agents SDK

Implementação de um sistema multi-agente com o **OpenAI Agents SDK**, combinando ferramentas locais de banco de dados, busca na web e transferência automática de atendimento (*handoff*).

---

## Código Fonte Completo (`agente_suporte_investimentos.py`)

```python
import asyncio
from typing import Dict, Any
from agents import Agent, Runner, function_tool

# =========================================================
# 1. DEFINIÇÃO DE FERRAMENTAS LOCAIS
# =========================================================

@function_tool
def consultar_carteira_investimentos(usuario_id: str) -> Dict[str, Any]:
    """Consulta a carteira atual de ativos de um cliente."""
    # Simulação de consulta ao banco de dados interno
    return {
        "usuario_id": usuario_id,
        "ativos": [
            {"codigo": "TESOURO_IPCA_2035", "tipo": "Renda Fixa", "valor": 45000.00},
            {"codigo": "FII_HGLG11", "tipo": "Imobiliário", "valor": 22000.00},
            {"codigo": "PETR4", "tipo": "Ações", "valor": 15000.00}
        ],
        "patrimonio_total": 82000.00
    }

@function_tool
def simular_rendimento_cdi(valor: float, meses: int, taxa_cdi_anual: float = 10.5) -> Dict[str, float]:
    """Calcula a estimativa de rendimento bruto de um valor aplicado a 100% do CDI."""
    taxa_mensal = (1 + taxa_cdi_anual / 100) ** (1 / 12) - 1
    valor_final = valor * ((1 + taxa_mensal) ** meses)
    lucro = valor_final - valor
    return {
        "valor_inicial": valor,
        "meses": meses,
        "taxa_cdi_anual": taxa_cdi_anual,
        "valor_final_estimado": round(valor_final, 2),
        "lucro_bruto": round(lucro, 2)
    }

# =========================================================
# 2. AGENTE ESPECIALISTA EM INVESTIMENTOS
# =========================================================

agente_investimentos = Agent(
    name="Especialista em Investimentos",
    instructions="""
    Você é um assessor de investimentos credenciado.
    - Utilize sempre as ferramentas consultar_carteira_investimentos e simular_rendimento_cdi para embasar suas análises.
    - Nunca prometa rentabilidade garantida em renda variável.
    - Apresente os dados em tabelas limpas.
    """,
    model="gpt-5.6",
    tools=[
        consultar_carteira_investimentos,
        simular_rendimento_cdi,
        {"type": "web_search"} # Permite pesquisar cotações recentes na web
    ]
)

# =========================================================
# 3. AGENTE DE TRIAGEM PRINCIPAL
# =========================================================

agente_triagem = Agent(
    name="Recepção Central",
    instructions="""
    Você é o assistente inicial do banco digital.
    - Se a mensagem do cliente envolver investimentos, carteira, saldo aplicado ou simulações, faça o handoff imediatamente para o Especialista em Investimentos.
    - Para dúvidas institucionais gerais, responda diretamente com cordialidade.
    """,
    model="gpt-5-mini",
    handoffs=[agente_investimentos]
)

# =========================================================
# 4. EXECUÇÃO DO FLUXO
# =========================================================

async def main():
    pergunta_cliente = (
        "Olá! Sou o cliente com ID 'USR-7732'. Gostaria de ver minha carteira atual "
        "e saber quanto renderia aplicar mais R$ 10.000 em CDI por 12 meses."
    )

    print(f"Pergunta do Cliente:\n{pergunta_cliente}\n")
    print("--- Executando Sistema Agêntico ---")

    resultado = await Runner.run(
        agent=agente_triagem,
        input=pergunta_cliente
    )

    print(f"\nAgente Final: {resultado.last_agent.name}")
    print("\nResposta Final do Agente:")
    print(resultado.final_output)

if __name__ == "__main__":
    asyncio.run(main())
```

---

## Referências Relacionadas

- [`../agents_sdk/definicao_de_agentes.md`](../agents_sdk/definicao_de_agentes.md)
- [`../agents_sdk/orquestracao_e_fluxos.md`](../agents_sdk/orquestracao_e_fluxos.md)
- [`../ferramentas_e_mcp/function_calling.md`](../ferramentas_e_mcp/function_calling.md)
