---
title: Visão Geral da Claude Platform
description: Fundamentos, arquitetura, capacidades essenciais e formas de integração com a Claude Platform da Anthropic.
topics:
  - introducao
  - capacidades
  - arquitetura
  - formas-de-integracao
keywords:
  - Claude Platform
  - Anthropic API
  - Messages API
  - Managed Agents
  - Claude Code
related:
  - fundamentos/modelos_e_precos.md
  - primeiros_passos/quickstart.md
  - mensagens_e_prompting/messages_api.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/intro
  - https://platform.claude.com/docs/pt-BR/claude_api_primer
  - https://platform.claude.com/docs/pt-BR/build-with-claude/overview
---

# Visão Geral da Claude Platform

A **Claude Platform** da Anthropic é uma infraestrutura de IA de última geração projetada para desenvolvedores, equipes de engenharia e corporações integrarem inteligência artificial conversacional, analítica, multimodal e agente em suas aplicações.

## O que é o Claude?

O Claude é uma família de modelos de linguagem grandes (LLMs) treinados pela Anthropic com foco em segurança constitucional (Constitutional AI), confiabilidade, alta precisão técnica e forte capacidade de raciocínio, codificação, visão computacional e operação de ferramentas.

### Capacidades Centrais da Plataforma

1. **Raciocínio Avançado e Resolução de Problemas**: Desempenho de ponta em lógica, matemática, ciências, engenharia e análise textual complexa.
2. **Geração e Compreensão de Código**: Criação de arquiteturas completas de software, depuração, refatoração e testes em dezenas de linguagens de programação.
3. **Visão Computacional e Multimodalidade**: Análise nativa de imagens, diagramas técnicos, capturas de tela, gráficos e documentos escaneados.
4. **Chamada de Ferramentas (Tool Calling)**: Execução precisa de funções, integração com APIs externas, chamadas computacionais e orquestração de fluxos de trabalho.
5. **Prompt Caching Efêmero**: Redução de até 90% nos custos e até 85% na latência ao reutilizar contextos estáticos e documentos longos.
6. **Janelas de Contexto Extensas**: Suporte a 200.000 tokens (e até 1.000.000 tokens em modelos e tiers selecionados), permitindo a ingestão de bases de código completas ou livros inteiros.
7. **Agentes Autônomos e Sandboxes**: Plataforma completa de *Managed Agents* em ambientes seguros de nuvem, ferramentas integradas (*Computer Use*, *Bash*, *Text Editor*, *Memory*, *Browser Use*) e suporte ao protocolo aberto *MCP (Model Context Protocol)*.

---

## Formas de Construir com o Claude

A Anthropic oferece múltiplos pontos de entrada e níveis de abstração dependendo da necessidade técnica do projeto:

| Modo de Integração | Descrição | Casos de Uso Recomendados |
|---|---|---|
| **Messages API** | API REST direta e stateless para envio de conversas, streaming SSE e chamadas de ferramentas sob medida | Aplicações web, microsserviços, chatbots customizados, pipelines de processamento sob demanda |
| **Message Batches API** | API assíncrona de processamento em lote com **50% de desconto** no custo | Tarefas assíncronas em larga escala, enriquecimento de bases de dados, rotinas noturnas |
| **Managed Agents** | Execução gerenciada de agentes em ambientes de sandbox isolados na nuvem | Agentes autônomos de longa duração, automação de processos complexos, desenvolvimento autônomo de software |
| **Claude Code** | Ferramenta CLI de linha de comando para automação de tarefas de engenharia no terminal local | Pair programming, refatoração de repositórios locais, criação de testes e documentação |
| **Plataformas de Nuvem (Bedrock, Vertex AI, Foundry)** | Implantação do Claude dentro da infraestrutura em nuvem privada da sua organização | Ambientes corporativos regulados, integração com VPCs corporativas e faturamento unificado na AWS, GCP ou Azure |

---

## Ciclo de Vida de uma Interação na API

A Messages API opera de forma essencialmente **stateless** (sem estado). Isso significa que cada chamada à API é independente e deve conter todo o histórico de mensagens necessário para o modelo contextualizar a resposta:

```
[Cliente / Aplicação]
       │
       │ 1. POST /v1/messages (System Prompt, Contexto Histórico, Nova Mensagem, Tools)
       ▼
[Anthropic Claude API Engine]
       │
       │ 2. Processamento com Prompt Caching (Validação de Prefixo em Cache)
       │ 3. Inferência / Thinking Tokens / Tool Invocation
       ▼
[Resposta Estruturada / Streaming SSE]
       │
       │ 4. Conteúdo textual OU Bloco 'tool_use'
       ▼
[Cliente / Aplicação Executa Ferramenta e Envia 'tool_result']
```

---

## Princípios de Design e Boas Práticas da Plataforma

- **Seja Direto e Explícito**: Claude responde com máxima precisão quando recebe instruções claras, regras bem delimitadas e exemplos *few-shot*.
- **Use System Prompts para Papéis e Regras Globais**: Defina o tom, formato de saída (ex: JSON válido), regras de segurança e restrições no parâmetro de nível superior `system`.
- **Aproveite o Prompt Caching**: Posicione system prompts longos, esquemas de ferramentas e documentos extensos no início da conversa e marque com `cache_control: {"type": "ephemeral"}`.
- **Valide Stop Reasons**: Sempre verifique o campo `stop_reason` retornado (`end_turn`, `tool_use`, `max_tokens`, `stop_sequence`) para garantir o fluxo correto da aplicação.
- **Trate Erros com Backoff Exponencial**: Implemente estratégias de retry com jitter para lidar com códigos 429 (rate limits) e 529 (capacidade temporariamente sobrecarregada).

---

## Veja Também

- [`../fundamentos/modelos_e_precos.md`](../fundamentos/modelos_e_precos.md)
- [`../fundamentos/glossario_e_conceitos.md`](../fundamentos/glossario_e_conceitos.md)
- [`../primeiros_passos/quickstart.md`](../primeiros_passos/quickstart.md)
- [`../mensagens_e_prompting/messages_api.md`](../mensagens_e_prompting/messages_api.md)
