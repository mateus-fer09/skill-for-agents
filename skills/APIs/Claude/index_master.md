---
title: Master Knowledge Router - Claude Platform Skill
description: Roteador principal de conhecimento para agentes de IA. Mapeia intenções de usuários, conceitos técnicos e APIs para os arquivos Markdown correspondentes.
---

# Master Knowledge Router (Roteador de Conhecimento)

Este arquivo é o índice operacional de navegação para qualquer agente que consulte esta Skill. Ele orienta com exatidão qual arquivo Markdown deve ser lido para responder a cada tipo de dúvida ou tarefa técnica.

---

## 1. Regras Globais da Tecnologia

1. **Autenticação**: Todas as requisições requerem `x-api-key` e `anthropic-version: 2023-06-01`.
2. **Stateless**: O endpoint `/v1/messages` não salva histórico. Todo o contexto deve ser enviado a cada turno no array `messages`.
3. **Turnos Alternados**: O histórico deve alternar estritamente entre `user` e `assistant`. A primeira mensagem deve ter `role: "user"`.
4. **Prompt Caching**: Para blocos estáticos >= 1.024 tokens (Sonnet/Opus) ou >= 2.048 tokens (Haiku), adicione `"cache_control": {"type": "ephemeral"}` para obter 90% de desconto na leitura.
5. **Tool Calling**: Quando o modelo emitir `stop_reason: "tool_use"`, a aplicação deve responder com um turno `user` contendo o bloco `tool_result` com o `tool_use_id` correspondente.
6. **Thinking Mode**: No Claude 3.7 Sonnet, configure `thinking: {"type": "enabled", "budget_tokens": 4096}` e garanta que `max_tokens > budget_tokens`.
7. **Erros e Retries**: Trate códigos 429 (rate limit) e 529 (overloaded) com Exponential Backoff e Jitter aleatório.

---

## 2. Tabela de Roteamento por Intenção do Usuário

| Intenção / Pergunta do Usuário | Arquivo Especializado a Consultar |
|---|---|
| Começar do zero, criar API key e primeira chamada | [`primeiros_passos/quickstart.md`](primeiros_passos/quickstart.md) |
| Comparar modelos Claude, limites de tokens e tabela de preços | [`fundamentos/modelos_e_precos.md`](fundamentos/modelos_e_precos.md) |
| Escolher o melhor modelo para um caso de uso ou migrar versões | [`fundamentos/escolha_de_modelos_e_migracao.md`](fundamentos/escolha_de_modelos_e_migracao.md) |
| Entender conceitos técnicos (tokens, stop reasons, context) | [`fundamentos/glossario_e_conceitos.md`](fundamentos/glossario_e_conceitos.md) |
| Usar a CLI oficial do Claude no terminal ou em scripts | [`primeiros_passos/cli_anthropic.md`](primeiros_passos/cli_anthropic.md) |
| Configurar autenticação, WIF corporativo ou rotação de chaves | [`primeiros_passos/autenticacao_e_seguranca.md`](primeiros_passos/autenticacao_e_seguranca.md) e [`administracao_e_governanca/autenticacao_corporativa_e_wif.md`](administracao_e_governanca/autenticacao_corporativa_e_wif.md) |
| Programar usando o SDK oficial de Python | [`sdks_e_bibliotecas/sdk_python.md`](sdks_e_bibliotecas/sdk_python.md) |
| Programar usando o SDK oficial de TypeScript / Node.js | [`sdks_e_bibliotecas/sdk_typescript.md`](sdks_e_bibliotecas/sdk_typescript.md) |
| Usar SDKs para Go, Java, PHP, C#/.NET ou Ruby | [`sdks_e_bibliotecas/outros_sdks.md`](sdks_e_bibliotecas/outros_sdks.md) |
| Usar a biblioteca cliente da OpenAI apontando para Claude | [`sdks_e_bibliotecas/compatibilidade_openai_sdk.md`](sdks_e_bibliotecas/compatibilidade_openai_sdk.md) |
| Estruturar chamadas da Messages API, imagens ou streaming SSE | [`mensagens_e_prompting/messages_api.md`](mensagens_e_prompting/messages_api.md) |
| Configurar e otimizar Prompt Caching (economia de 90%) | [`mensagens_e_prompting/prompt_caching.md`](mensagens_e_prompting/prompt_caching.md) |
| Gerenciar janelas de contexto longas e contar tokens pré-chamada | [`mensagens_e_prompting/gerenciamento_de_contexto.md`](mensagens_e_prompting/gerenciamento_de_contexto.md) |
| Usar Extended Thinking (Reasoning) ou mensagens intermediárias | [`mensagens_e_prompting/mensagens_sistema_e_esforco.md`](mensagens_e_prompting/mensagens_sistema_e_esforco.md) |
| Fazer upload de arquivos ou processar documentos PDF nativos | [`mensagens_e_prompting/arquivos_e_pdf.md`](mensagens_e_prompting/arquivos_e_pdf.md) |
| Executar tarefas em lote assíncronas com 50% de desconto (Batches) | [`mensagens_e_prompting/processamento_em_lote_batches.md`](mensagens_e_prompting/processamento_em_lote_batches.md) |
| Implementar Tool Calling / Function Calling personalizado | [`ferramentas_e_agentes/tool_use_visao_geral.md`](ferramentas_e_agentes/tool_use_visao_geral.md) |
| Usar ferramentas nativas (Computer Use, Bash, Text Editor, Memory) | [`ferramentas_e_agentes/ferramentas_nativas.md`](ferramentas_e_agentes/ferramentas_nativas.md) |
| Criar e gerenciar Claude Agent Skills | [`ferramentas_e_agentes/agent_skills.md`](ferramentas_e_agentes/agent_skills.md) |
| Conectar servidores MCP remotos e configurar MCP Tunnels | [`ferramentas_e_agentes/mcp_model_context_protocol.md`](ferramentas_e_agentes/mcp_model_context_protocol.md) |
| Criar e orquestrar Anthropic Managed Agents em sandboxes | [`managed_agents/visao_geral_e_arquitetura.md`](managed_agents/visao_geral_e_arquitetura.md) e [`managed_agents/sessoes_e_delegacao.md`](managed_agents/sessoes_e_delegacao.md) |
| Gerenciar usuários, workspaces e chaves via Admin API | [`administracao_e_governanca/admin_api.md`](administracao_e_governanca/admin_api.md) |
| Monitorar custos, limites de taxa (RPM/TPM) e spend limits | [`administracao_e_governanca/monitoramento_custos_e_limites.md`](administracao_e_governanca/monitoramento_custos_e_limites.md) |
| Atender a auditorias de conformidade (SOC 2, GDPR, Compliance API) | [`administracao_e_governanca/compliance_e_auditoria.md`](administracao_e_governanca/compliance_e_auditoria.md) |
| Usar Claude no Amazon Bedrock ou AWS | [`plataformas_em_nuvem/amazon_bedrock.md`](plataformas_em_nuvem/amazon_bedrock.md) |
| Usar Claude no Google Cloud Vertex AI | [`plataformas_em_nuvem/google_cloud_vertex_ai.md`](plataformas_em_nuvem/google_cloud_vertex_ai.md) |
| Proteger contra prompt injection e vazamento de system prompt | [`testes_seguranca_e_otimizacao/guardrails_e_seguranca.md`](testes_seguranca_e_otimizacao/guardrails_e_seguranca.md) |
| Otimizar latência (TTFT) e reduzir alucinações | [`testes_seguranca_e_otimizacao/otimizacao_latencia_e_precisao.md`](testes_seguranca_e_otimizacao/otimizacao_latencia_e_precisao.md) |
| Desenvolver testes e suítes de Evals | [`testes_seguranca_e_otimizacao/avaliacoes_e_evals.md`](testes_seguranca_e_otimizacao/avaliacoes_e_evals.md) |
| Consultar os System Prompts oficiais dos modelos | [`casos_de_uso_e_exemplos/system_prompts_oficiais.md`](casos_de_uso_e_exemplos/system_prompts_oficiais.md) |
| Consultar a referência exata de parâmetros de qualquer endpoint REST | [`referencia_api/endpoints_messages.md`](referencia_api/endpoints_messages.md) até [`referencia_api/headers_versoes_e_limites.md`](referencia_api/headers_versoes_e_limites.md) |
| Resolver erros da API (400, 401, 403, 404, 429, 500, 529) | [`referencia_api/erros_e_codigos_de_status.md`](referencia_api/erros_e_codigos_de_status.md) |

---

## 3. Mapa de Contexto Detalhado dos Arquivos

### Fundamentos
- **`fundamentos/visao_geral.md`**: Capacidades centrais da plataforma, arquitetura e modos de integração.
- **`fundamentos/modelos_e_precos.md`**: IDs dos modelos, tabela de preços por milhão de tokens (input/output/cache/batch) e janelas de contexto.
- **`fundamentos/escolha_de_modelos_e_migracao.md`**: Matriz de escolha por inteligência vs custo, roteamento de modelos e guias de migração.
- **`fundamentos/glossario_e_conceitos.md`**: Glossário formal de termos técnicos (tokens, context window, stop reasons, prompt caching, thinking).

### Primeiros Passos
- **`primeiros_passos/quickstart.md`**: Guia prático de criação de chave e primeira chamada em curl, Python e TypeScript.
- **`primeiros_passos/autenticacao_e_seguranca.md`**: Headers `x-api-key`, `anthropic-version`, `anthropic-beta` e boas práticas de segredos.
- **`primeiros_passos/cli_anthropic.md`**: Instalação, login interativo, comandos de barra e scripting unix com a Anthropic CLI.

### SDKs e Bibliotecas
- **`sdks_e_bibliotecas/sdk_python.md`**: Cliente síncrono e assíncrono, helpers de streaming, tipagem Pydantic e tratamento de exceções.
- **`sdks_e_bibliotecas/sdk_typescript.md`**: Pacote `@anthropic-ai/sdk`, streaming SSE tipado, abort controllers e runtimes Node/Bun/Edge.
- **`sdks_e_bibliotecas/outros_sdks.md`**: Bibliotecas oficiais para Go, Java, PHP, C#/.NET e Ruby.
- **`sdks_e_bibliotecas/compatibilidade_openai_sdk.md`**: Como instanciar o cliente OpenAI com a base_url da Anthropic.
- **`sdks_e_bibliotecas/middleware_e_integracoes.md`**: Interceptadores HTTP, logging, métricas OpenTelemetry e Apple Foundation Models.

### Mensagens e Prompting
- **`mensagens_e_prompting/messages_api.md`**: Estrutura completa de `/v1/messages`, system prompts, multimodalidade/imagens e streaming SSE.
- **`mensagens_e_prompting/prompt_caching.md`**: Blocos `cache_control: {"type": "ephemeral"}`, limiares mínimos e economia de 90%.
- **`mensagens_e_prompting/gerenciamento_de_contexto.md`**: Janelas de 200k a 1M tokens, estratégias de compactação e endpoint `count_tokens`.
- **`mensagens_e_prompting/mensagens_sistema_e_esforco.md`**: System messages intermediárias e modo de Extended Thinking com budget de tokens.
- **`mensagens_e_prompting/arquivos_e_pdf.md`**: Files API persistente e suporte nativo a parsing visual/textual de PDFs com OCR.
- **`mensagens_e_prompting/processamento_em_lote_batches.md`**: Message Batches API com 50% de desconto e ciclo de vida assíncrono.

### Ferramentas e Agentes
- **`ferramentas_e_agentes/tool_use_visao_geral.md`**: Tool calling, esquemas JSON Schema, modos `tool_choice`, `tool_use` e `tool_result`.
- **`ferramentas_e_agentes/ferramentas_nativas.md`**: Ferramentas nativas: Bash Tool, Text Editor Tool, Computer Use Tool, Browser Use, Memory e Tool Search.
- **`ferramentas_e_agentes/infraestrutura_e_contexto_de_ferramentas.md`**: Caching de ferramentas, filtragem de saídas volumosas e streaming granular.
- **`ferramentas_e_agentes/agent_skills.md`**: Arquitetura de Agent Skills, empacotamento modular e endpoints de Skills API.
- **`ferramentas_e_agentes/mcp_model_context_protocol.md`**: Padrão aberto MCP, servidores remotos e implantação de MCP Tunnels com Docker e Helm.

### Managed Agents
- **`managed_agents/visao_geral_e_arquitetura.md`**: Conceitos de Managed Agents e sandboxes de execução em nuvem gerenciadas.
- **`managed_agents/configuracao_e_ambientes.md`**: Definição de agentes, políticas de permissão de ferramentas e integração com GitHub.
- **`managed_agents/sessoes_e_delegacao.md`**: Criação de sessões, streaming de eventos em tempo real, orçamentos (budgets) e cofres (vaults).
- **`managed_agents/orquestracao_avancada_e_webhooks.md`**: Orquestração multiagente, deploys agendados e webhooks de notificação.

### Administração e Governança
- **`administracao_e_governanca/admin_api.md`**: Gestão de organizações, usuários, workspaces e emissão centralizada de chaves.
- **`administracao_e_governanca/autenticacao_corporativa_e_wif.md`**: Workload Identity Federation (WIF) com AWS, GCP, GitHub Actions, K8s e Okta.
- **`administracao_e_governanca/monitoramento_custos_e_limites.md`**: APIs de uso, relatórios de custo, spend limits preventivos e rate limits.
- **`administracao_e_governanca/compliance_e_auditoria.md`**: Compliance API, feeds imutáveis de atividade, retenção e residência de dados.

### Plataformas em Nuvem
- **`plataformas_em_nuvem/amazon_bedrock.md`**: Claude no Amazon Bedrock, IDs de modelo, SDK `boto3` e `AnthropicBedrock`.
- **`plataformas_em_nuvem/google_cloud_vertex_ai.md`**: Claude no Google Cloud Vertex AI com SDK `anthropic[vertex]`.
- **`plataformas_em_nuvem/microsoft_foundry.md`**: Implantação e integração corporativa no Microsoft Foundry.

### Testes, Segurança e Otimização
- **`testes_seguranca_e_otimizacao/guardrails_e_seguranca.md`**: Mitigação de jailbreak, injeções de prompt indiretas e isolamento XML.
- **`testes_seguranca_e_otimizacao/otimizacao_latencia_e_precisao.md`**: Otimização de latência (TTFT), consistência de saídas e redução de alucinações.
- **`testes_seguranca_e_otimizacao/avaliacoes_e_evals.md`**: Construção de suítes de teste de IA, critérios de sucesso e LLM-as-a-judge.

### Casos de Uso e Exemplos
- **`casos_de_uso_e_exemplos/padroes_de_agentes_e_chat.md`**: Chatbots de suporte, manutenção de estado e escalonamento para humanos.
- **`casos_de_uso_e_exemplos/automacao_e_extracao.md`**: Sumarização jurídica e extração estruturada de JSON com Assistant Prefill.
- **`casos_de_uso_e_exemplos/system_prompts_oficiais.md`**: Catálogo completo dos System Prompts oficiais de todos os modelos Claude.

### Referência de API
- **`referencia_api/endpoints_messages.md`**: Especificação completa de `POST /v1/messages` e `POST /v1/messages/count_tokens`.
- **`referencia_api/endpoints_message_batches.md`**: Especificação de criação, consulta e streaming de lotes assíncronos.
- **`referencia_api/endpoints_files.md`**: Especificação de upload, metadados e download de arquivos da Files API.
- **`referencia_api/endpoints_skills.md`**: Especificação de registro e versionamento de Agent Skills via API.
- **`referencia_api/endpoints_models.md`**: Especificação de listagem de modelos `GET /v1/models`.
- **`referencia_api/endpoints_beta_managed_agents.md`**: Especificação completa das rotas Beta de Managed Agents.
- **`referencia_api/endpoints_admin.md`**: Especificação de endpoints de Workspace, Usuários, Chaves e Custos da Admin API.
- **`referencia_api/endpoints_compliance.md`**: Especificação de endpoints de Auditoria e Conformidade.
- **`referencia_api/erros_e_codigos_de_status.md`**: Catálogo de erros (400, 401, 403, 404, 429, 500, 529) e algoritmo de retry.
- **`referencia_api/headers_versoes_e_limites.md`**: Cabeçalhos HTTP, versionamento, flags beta e limites por Tier de uso.
