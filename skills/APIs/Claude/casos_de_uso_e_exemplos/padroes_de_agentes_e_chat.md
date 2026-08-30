---
title: Padrões de Agentes Conversacionais e Suporte ao Cliente
description: Arquitetura de chatbots inteligentes de atendimento ao cliente, manutenção de histórico, escalonamento para humanos e roteamento de tickets.
topics:
  - customer-support
  - chatbots
  - multi-turn
  - ticket-routing
keywords:
  - customer support agent
  - ticket routing
  - chat patterns
related:
  - mensagens_e_prompting/messages_api.md
  - casos_de_uso_e_exemplos/automacao_e_extracao.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/about-claude/use-case-guides/customer-support-chat
  - https://platform.claude.com/docs/pt-BR/about-claude/use-case-guides/ticket-routing
---

# Padrões de Agentes Conversacionais e Suporte ao Cliente

---

## Arquitetura de Agente de Suporte ao Cliente

Um assistente conversacional corporativo eficiente combina três camadas:
1. **Base de Conhecimento em Cache**: FAQ da empresa e políticas de atendimento carregadas no `system` com Prompt Caching.
2. **Ferramentas de Consulta**: Tool Calling para consultar pedidos (`consultar_pedido(id)`) e status de entrega.
3. **Condição de Escalonamento**: Regra para transferir a conversa a um atendente humano caso o cliente expresse insatisfação reiterada ou solicite reembolso fora das regras automáticas.

```json
{
  "system": "Você é o assistente virtual da Loja Virtual. Seu tom é educado, prestativo e direto. Consulte a base de conhecimento e use ferramentas quando o usuário fornecer o número do pedido. Se o cliente solicitar cancelamento complexo, transfira para a fila humana.",
  "tools": [
    {
      "name": "consultar_status_pedido",
      "description": "Retorna o status atualizado de rastreio e entrega de um pedido.",
      "input_schema": {
        "type": "object",
        "properties": {
          "pedido_id": {"type": "string"}
        },
        "required": ["pedido_id"]
      }
    }
  ]
}
```

---

## Veja Também

- [`../casos_de_uso_e_exemplos/automacao_e_extracao.md`](../casos_de_uso_e_exemplos/automacao_e_extracao.md)
