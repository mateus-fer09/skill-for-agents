---
name: claude-platform-api
description: Conhecimento técnico oficial exaustivo da Claude Platform da Anthropic, cobrindo Messages API, Prompt Caching, Tool Calling, Managed Agents, SDKs (Python, TypeScript, Go, Java, C#, PHP), Bedrock/Vertex/Foundry, Admin API, Compliance e Boas Práticas.
---

# Skill: Claude Platform & Anthropic APIs

## 1. Identidade e Propósito da Skill
Esta Skill é a base de conhecimento técnica canônica e oficial sobre a **Claude Platform** e as APIs da **Anthropic**. Ela foi projetada para que agentes de IA autônomos, engenheiros de software e assistentes de programação desenvolvam, depurem, integrem e orquestrem soluções baseadas nos modelos Claude com máxima precisão, sem recorrer a adivinhações ou suposições.

- **Tecnologia Principal**: Anthropic Claude Platform (Messages API, Batches API, Files API, Skills API, Admin API, Compliance API).
- **Modelos Suportados**: Claude 3.7 Sonnet (com Hybrid Reasoning / Extended Thinking), Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus, Claude 4 e Claude 5.
- **Documentação de Origem**: `https://platform.claude.com/docs/pt-BR/home` e `https://docs.anthropic.com`.
- **Escopo Coberto**: 100% da documentação oficial (687 páginas e subpáginas técnicas).

---

## 2. Instruções de Navegação para Agentes de IA

Ao atender uma solicitação do usuário sobre a Claude Platform ou APIs da Anthropic, siga o fluxo rigoroso de roteamento:

```
[Pergunta do Usuário]
         │
         ▼
1. Consulte 'index_master.md' (Tabela de Intenções do Usuário e Mapa de Contexto)
         │
         ▼
2. Identifique o(s) arquivo(s) especializado(s) correspondente(s)
         │
         ▼
3. Leia o módulo técnico relevante e extraia os parâmetros e exemplos exatos
         │
         ▼
4. Siga as convenções de código oficiais (Python, TypeScript, cURL, etc.)
         │
         ▼
5. Responda com precisão estrita, citando os endpoints e limites oficiais
```

---

## 3. Regras Fundamentais da Skill

1. **Prioridade Absoluta da Documentação Oficial**: Nunca invente nomes de parâmetros, headers ou endpoints inexistentes. Todas as assinaturas devem seguir a especificação da Anthropic.
2. **Messages API é Stateless**: Lembre-se sempre de que a Messages API (`/v1/messages`) não armazena histórico. O cliente deve enviar o histórico completo no array `messages`, alternando turnos entre `user` e `assistant`.
3. **Prompt Caching em Primeiro Lugar**: Sempre oriente e utilize `cache_control: {"type": "ephemeral"}` em system prompts e ferramentas longas para economizar 90% dos custos e reduzir 85% da latência.
4. **Respeite o Limite de Tokens**:
   - Claude 3.7 / 3.5 Sonnet e Haiku: Janela de contexto de **200.000 tokens** e saída padrão de **8.192 tokens**.
5. **Trate Stop Reasons Adequadamente**: Valide `stop_reason` (`end_turn`, `tool_use`, `max_tokens`, `stop_sequence`) em todos os loops de agentes.

---

## 4. Estrutura Modular da Skill

| Módulo / Diretório | Conteúdo Principal |
|---|---|
| [`fundamentos/`](fundamentos/visao_geral.md) | Visão geral, catálogo completo de modelos, tabela de preços e glossário de conceitos. |
| [`primeiros_passos/`](primeiros_passos/quickstart.md) | Quickstart passo a passo, autenticação, headers obrigatórios e Anthropic CLI. |
| [`sdks_e_bibliotecas/`](sdks_e_bibliotecas/sdk_python.md) | Guias dos SDKs de Python, TypeScript, Go, Java, C#, PHP e compatibilidade OpenAI. |
| [`mensagens_e_prompting/`](mensagens_e_prompting/messages_api.md) | Messages API, Prompt Caching, Context Windows, Extended Thinking, Files & PDF e Batches API. |
| [`ferramentas_e_agentes/`](ferramentas_e_agentes/tool_use_visao_geral.md) | Tool Calling, Native Tools (Computer Use, Bash, Text Editor), Agent Skills e MCP. |
| [`managed_agents/`](managed_agents/visao_geral_e_arquitetura.md) | Sandboxes em nuvem gerenciadas, sessões, budgets, outcomes, vaults e webhooks. |
| [`administracao_e_governanca/`](administracao_e_governanca/admin_api.md) | Admin API, Workspaces, WIF (OIDC com AWS/GCP/GitHub), monitoramento de custos e Compliance API. |
| [`plataformas_em_nuvem/`](plataformas_em_nuvem/amazon_bedrock.md) | Implantação e SDKs no Amazon Bedrock, Google Cloud Vertex AI e Microsoft Foundry. |
| [`testes_seguranca_e_otimizacao/`](testes_seguranca_e_otimizacao/guardrails_e_seguranca.md) | Guardrails, mitigação de prompt injection, otimização de latência e suítes de Evals. |
| [`casos_de_uso_e_exemplos/`](casos_de_uso_e_exemplos/padroes_de_agentes_e_chat.md) | Chatbots de suporte, sumarização jurídica, extração JSON e System Prompts oficiais. |
| [`referencia_api/`](referencia_api/endpoints_messages.md) | Referência completa de todos os endpoints REST, parâmetros, erros (429, 529) e Tiers. |

---

Consulte [`index_master.md`](index_master.md) para roteamento operacional detalhado.
