# Índice Mestre e Roteador de Conhecimento (index_master.md)

Este arquivo é o **Roteador Principal de Conhecimento** da Skill OpenAI API & Ecossistema ChatGPT. Ele permite que agentes de IA e desenvolvedores identifiquem instantaneamente o arquivo correto para qualquer tarefa de implementação, consulta de parâmetros, arquitetura ou troubleshooting.

---

## 1. Visão Geral da Tecnologia

A OpenAI API é a plataforma líder para construção de aplicações cognitivas e agentes autônomos. Seus pilares centrais são:
1. **Responses API (`/v1/responses`)**: O paradigma moderno centrado em conversas, ferramentas nativas integradas e execução contínua.
2. **Modelos de Raciocínio (o-series)**: Cadeia de pensamento deliberativa (*Chain of Thought*) com controle fino via `reasoning_effort`.
3. **OpenAI Agents SDK**: Orquestração multi-agente, transferências declarativas (*handoffs*), guardrails de segurança e suporte a MCP.
4. **Multimodalidade e Tempo Real**: Visão, voz bidirecional de ultra-baixa latência (WebRTC/WebSocket/SIP) e vídeo com Sora.
5. **Governança Empresarial**: Controle de acesso baseado em papéis (RBAC), Workload Identity Federation (sem chaves estáticas) e provedor Terraform oficial.

---

## 2. Regras Globais da Skill

1. **Adote a Responses API para Todas as Novas Aplicações**: Utilize `client.responses.create` em vez do endpoint legado de Chat Completions.
2. **Utilize JSON Schema Estrito (`strict: true`)**: Garanta 100% de precisão de schema em Structured Outputs utilizando modelos Pydantic ou schemas Zod.
3. **Otimize Custos com Prompt Caching**: Mantenha as mensagens de sistema e contexto estático fixos no início do prompt para obter 50% de desconto automático em prompts >= 1.024 tokens.
4. **Isolamento de Segurança por Projeto**: Empregue Project API Keys (`sk-proj-...`) ou tokens OIDC de curta duração via Workload Identity Federation.

---

## 3. Tabela de Roteamento por Intenção do Usuário

| Intenção do Usuário | Arquivo que Deve Ser Consultado |
|---|---|
| Iniciar um projeto ou fazer a primeira chamada na API | [`fundamentos/overview_e_arquitetura.md`](fundamentos/overview_e_arquitetura.md) e [`responses_api/introducao_e_quickstart.md`](responses_api/introducao_e_quickstart.md) |
| Configurar autenticação, chaves de projeto ou OIDC na nuvem | [`fundamentos/autenticacao_e_seguranca.md`](fundamentos/autenticacao_e_seguranca.md) e [`administracao_e_infra/workload_identity_federation.md`](administracao_e_infra/workload_identity_federation.md) |
| Instalar e configurar SDK Python, TypeScript ou OpenAI CLI | [`fundamentos/sdks_e_cli.md`](fundamentos/sdks_e_cli.md) |
| Escolher o modelo ideal para um caso de uso específico | [`modelos/catalogo_e_selecao.md`](modelos/catalogo_e_selecao.md) |
| Usar modelos de raciocínio (o1, o3, o3-mini) e reasoning_effort | [`modelos/modelos_de_raciocinio.md`](modelos/modelos_de_raciocinio.md) |
| Consultar preços, limites de tokens e custos de contexto | [`modelos/precificacao_e_limites.md`](modelos/precificacao_e_limites.md) |
| Extrair JSON garantido com Pydantic ou Zod | [`responses_api/structured_outputs.md`](responses_api/structured_outputs.md) |
| Implementar streaming Server-Sent Events (SSE) ou WebSockets | [`responses_api/streaming_e_websockets.md`](responses_api/streaming_e_websockets.md) |
| Gerenciar conversas de múltiplos turnos e compactar contexto | [`responses_api/gerenciamento_de_estado.md`](responses_api/gerenciamento_de_estado.md) |
| Otimizar latência e custos com Prompt Caching ou Predicted Outputs | [`responses_api/prompt_caching_e_predicted.md`](responses_api/prompt_caching_e_predicted.md) |
| Definir e executar ferramentas customizadas (Function Calling) | [`ferramentas_e_mcp/function_calling.md`](ferramentas_e_mcp/function_calling.md) |
| Usar Web Search, File Search (Vector Stores) ou Code Interpreter | [`ferramentas_e_mcp/ferramentas_hospedadas.md`](ferramentas_e_mcp/ferramentas_hospedadas.md) |
| Automatizar interfaces com Computer Use ou gerar diffs de código | [`ferramentas_e_mcp/computer_use_e_patch.md`](ferramentas_e_mcp/computer_use_e_patch.md) |
| Conectar servidores MCP remotos ou Secure MCP Tunnels | [`ferramentas_e_mcp/mcp_e_conectores.md`](ferramentas_e_mcp/mcp_e_conectores.md) |
| Criar agentes autônomos com o OpenAI Agents SDK | [`agents_sdk/definicao_de_agentes.md`](agents_sdk/definicao_de_agentes.md) |
| Orquestrar múltiplos agentes com handoffs e triagem | [`agents_sdk/orquestracao_e_fluxos.md`](agents_sdk/orquestracao_e_fluxos.md) |
| Adicionar guardrails, aprovação humana e isolamento em sandbox | [`agents_sdk/guardrails_e_sandboxes.md`](agents_sdk/guardrails_e_sandboxes.md) |
| Usar Agent Builder visual ou componentes front-end ChatKit | [`agents_sdk/agent_builder_e_chatkit.md`](agents_sdk/agent_builder_e_chatkit.md) |
| Gerar áudio com TTS, transcrever gravações ou clonar vozes | [`multimidia_e_tempo_real/audio_e_transcricao.md`](multimidia_e_tempo_real/audio_e_transcricao.md) |
| Analisar imagens com visão computacional ou gerar imagens | [`multimidia_e_tempo_real/visao_e_geracao_imagens.md`](multimidia_e_tempo_real/visao_e_geracao_imagens.md) |
| Gerar vídeos cinematográficos com o modelo Sora | [`multimidia_e_tempo_real/geracao_video_sora.md`](multimidia_e_tempo_real/geracao_video_sora.md) |
| Criar conversas por voz em tempo real no navegador (WebRTC) | [`multimidia_e_tempo_real/realtime_api_webrtc.md`](multimidia_e_tempo_real/realtime_api_webrtc.md) |
| Conectar servidores back-end à Realtime API via WebSockets | [`multimidia_e_tempo_real/realtime_api_websocket.md`](multimidia_e_tempo_real/realtime_api_websocket.md) |
| Integrar agentes de voz com telefonia PSTN/SIP (Twilio, VoIP) | [`multimidia_e_tempo_real/realtime_sip_e_telefonia.md`](multimidia_e_tempo_real/realtime_sip_e_telefonia.md) |
| Criar Plugins para o ChatGPT com o Apps SDK e MCP | [`chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md`](chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md) |
| Disparar Workspace Agents corporativos via API de backend | [`chatgpt_e_plugins/workspace_agents_api.md`](chatgpt_e_plugins/workspace_agents_api.md) |
| Criar GPT Actions com contratos OpenAPI para Custom GPTs | [`chatgpt_e_plugins/gpt_actions.md`](chatgpt_e_plugins/gpt_actions.md) |
| Treinar modelos com Supervised Fine-Tuning (SFT) | [`fine_tuning_e_evals/fine_tuning_sft.md`](fine_tuning_e_evals/fine_tuning_sft.md) |
| Ajustar modelos de raciocínio com RFT ou DPO | [`fine_tuning_e_evals/reinforcement_fine_tuning.md`](fine_tuning_e_evals/reinforcement_fine_tuning.md) |
| Avaliar acurácia de prompts com Evals, Graders e Datasets | [`fine_tuning_e_evals/evals_e_graders.md`](fine_tuning_e_evals/evals_e_graders.md) |
| Filtrar conteúdo ofensivo com Moderação e Red Teaming | [`fine_tuning_e_evals/red_teaming_e_moderacao.md`](fine_tuning_e_evals/red_teaming_e_moderacao.md) |
| Administrar Organizações, Projetos, Usuários e Service Accounts | [`administracao_e_infra/rbac_organizacoes_projetos.md`](administracao_e_infra/rbac_organizacoes_projetos.md) |
| Consultar logs de auditoria e políticas de retenção de dados | [`administracao_e_infra/audit_logs_e_compliance.md`](administracao_e_infra/audit_logs_e_compliance.md) |
| Automatizar infraestrutura da OpenAI com Terraform | [`administracao_e_infra/terraform_e_automacao.md`](administracao_e_infra/terraform_e_automacao.md) |
| Consultar referência exata de parâmetros de qualquer endpoint REST | [`referencia_api/`](referencia_api/) |
| Acessar códigos-fonte de exemplo prontos para rodar | [`exemplos/`](exemplos/) |

---

## 4. Mapa Detalhado de Contexto por Arquivo

### 4.1 Seção `fundamentos/`
- **[`fundamentos/overview_e_arquitetura.md`](fundamentos/overview_e_arquitetura.md)**: Arquitetura REST geral, Base URL, comparação Responses API vs Chat Completions.
- **[`fundamentos/autenticacao_e_seguranca.md`](fundamentos/autenticacao_e_seguranca.md)**: Chaves de projeto, chaves de admin, variáveis de ambiente, mTLS e segurança.
- **[`fundamentos/sdks_e_cli.md`](fundamentos/sdks_e_cli.md)**: Instalação, inicialização e tratamento de exceções em Python, TypeScript e CLI.
- **[`fundamentos/rate_limits_e_custos.md`](fundamentos/rate_limits_e_custos.md)**: Limites de taxa (TPM/RPM), tiers de conta, otimização de latência e controle de custos.

### 4.2 Seção `modelos/`
- **[`modelos/catalogo_e_selecao.md`](modelos/catalogo_e_selecao.md)**: Catálogo de modelos (GPT-5.6 Sol, GPT-5.5, GPT-4.1, o-series) e matriz de seleção.
- **[`modelos/modelos_de_raciocinio.md`](modelos/modelos_de_raciocinio.md)**: Modelos o1, o3, o3-mini, Chain of Thought interna, `reasoning_effort` e boas práticas de prompting.
- **[`modelos/precificacao_e_limites.md`](modelos/precificacao_e_limites.md)**: Tabela de preços por milhão de tokens (entrada, saída, cache), janelas de contexto e limites de output.

### 4.3 Seção `responses_api/`
- **[`responses_api/introducao_e_quickstart.md`](responses_api/introducao_e_quickstart.md)**: Ciclo de vida, métodos `create`, `retrieve`, `cancel` e parâmetros essenciais.
- **[`responses_api/structured_outputs.md`](responses_api/structured_outputs.md)**: JSON Schema estrito, Pydantic, Zod e garantia de formato 100% aderente.
- **[`responses_api/streaming_e_websockets.md`](responses_api/streaming_e_websockets.md)**: Transmissão Server-Sent Events (SSE) e Responses WebSocket Mode.
- **[`responses_api/gerenciamento_de_estado.md`](responses_api/gerenciamento_de_estado.md)**: Continuação de turnos, `conversation_id`, encadeamento e compactação no servidor.
- **[`responses_api/prompt_caching_e_predicted.md`](responses_api/prompt_caching_e_predicted.md)**: Funcionamento do Prompt Caching automático (50% de desconto) e aceleração com Predicted Outputs.

### 4.4 Seção `ferramentas_e_mcp/`
- **[`ferramentas_e_mcp/function_calling.md`](ferramentas_e_mcp/function_calling.md)**: Definição de funções customizadas, `tool_choice` e Programmatic Tool Calling.
- **[`ferramentas_e_mcp/ferramentas_hospedadas.md`](ferramentas_e_mcp/ferramentas_hospedadas.md)**: Web Search, File Search (Vector Stores) e Code Interpreter (Python sandbox).
- **[`ferramentas_e_mcp/computer_use_e_patch.md`](ferramentas_e_mcp/computer_use_e_patch.md)**: Automação de interface gráfica com Computer Use, Apply Patch para diffs de código e Local Shell.
- **[`ferramentas_e_mcp/mcp_e_conectores.md`](ferramentas_e_mcp/mcp_e_conectores.md)**: Servidores MCP remotos, conectores corporativos gerenciados e Secure MCP Tunnels.

### 4.5 Seção `agents_sdk/`
- **[`agents_sdk/definicao_de_agentes.md`](agents_sdk/definicao_de_agentes.md)**: Estrutura do objeto `Agent`, instruções dinâmicas, modelos e ferramentas no Agents SDK.
- **[`agents_sdk/orquestracao_e_fluxos.md`](agents_sdk/orquestracao_e_fluxos.md)**: Multi-agentes, handoffs declarativos e o padrão Agente como Ferramenta.
- **[`agents_sdk/guardrails_e_sandboxes.md`](agents_sdk/guardrails_e_sandboxes.md)**: Guardrails de entrada/saída, aprovação humana (*Human-in-the-Loop*) e isolamento em sandbox.
- **[`agents_sdk/agent_builder_e_chatkit.md`](agents_sdk/agent_builder_e_chatkit.md)**: Construção visual com Agent Builder e componentes web prontos com ChatKit.

### 4.6 Seção `multimidia_e_tempo_real/`
- **[`multimidia_e_tempo_real/audio_e_transcricao.md`](multimidia_e_tempo_real/audio_e_transcricao.md)**: Text-to-Speech (`/v1/audio/speech`), Whisper (`/v1/audio/transcriptions`), traduções e vozes.
- **[`multimidia_e_tempo_real/visao_e_geracao_imagens.md`](multimidia_e_tempo_real/visao_e_geracao_imagens.md)**: Visão computacional multimodal e geração de imagem com GPT-image-1 e DALL-E 3.
- **[`multimidia_e_tempo_real/geracao_video_sora.md`](multimidia_e_tempo_real/geracao_video_sora.md)**: API de Vídeos Sora (`/v1/videos`), ciclo de vida assíncrono e download.
- **[`multimidia_e_tempo_real/realtime_api_webrtc.md`](multimidia_e_tempo_real/realtime_api_webrtc.md)**: Conexão direta de navegadores e mobile à Realtime API via WebRTC com tokens efêmeros.
- **[`multimidia_e_tempo_real/realtime_api_websocket.md`](multimidia_e_tempo_real/realtime_api_websocket.md)**: Conexão server-to-server à Realtime API via WebSockets para áudio PCM16 bidirecional.
- **[`multimidia_e_tempo_real/realtime_sip_e_telefonia.md`](multimidia_e_tempo_real/realtime_sip_e_telefonia.md)**: Integração telefônica PSTN/SIP via `/v1/realtime/calls` com Twilio e gateways VoIP.

### 4.7 Seção `chatgpt_e_plugins/`
- **[`chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md`](chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md)**: Criação de Plugins para ChatGPT com Apps SDK, MCP e componentes visuais.
- **[`chatgpt_e_plugins/workspace_agents_api.md`](chatgpt_e_plugins/workspace_agents_api.md)**: Disparo de ChatGPT Workspace Agents corporativos via API REST.
- **[`chatgpt_e_plugins/gpt_actions.md`](chatgpt_e_plugins/gpt_actions.md)**: Criação de GPT Actions com esquemas OpenAPI 3.0 para Custom GPTs.

### 4.8 Seção `fine_tuning_e_evals/`
- **[`fine_tuning_e_evals/fine_tuning_sft.md`](fine_tuning_e_evals/fine_tuning_sft.md)**: Supervised Fine-Tuning (SFT), datasets JSONL, hiperparâmetros e checkpoints.
- **[`fine_tuning_e_evals/reinforcement_fine_tuning.md`](fine_tuning_e_evals/reinforcement_fine_tuning.md)**: Reinforcement Fine-Tuning (RFT) e Direct Preference Optimization (DPO).
- **[`fine_tuning_e_evals/evals_e_graders.md`](fine_tuning_e_evals/evals_e_graders.md)**: OpenAI Evals, Graders (model_graded, python_graded) e Trace Grading.
- **[`fine_tuning_e_evals/red_teaming_e_moderacao.md`](fine_tuning_e_evals/red_teaming_e_moderacao.md)**: Moderations API (`/v1/moderations`), mitigação de prompt injection e red teaming.

### 4.9 Seção `administracao_e_infra/`
- **[`administracao_e_infra/rbac_organizacoes_projetos.md`](administracao_e_infra/rbac_organizacoes_projetos.md)**: Gestão hierárquica de Organizações, Projetos, Usuários e Service Accounts.
- **[`administracao_e_infra/audit_logs_e_compliance.md`](administracao_e_infra/audit_logs_e_compliance.md)**: Logs de auditoria corporativa e políticas de privacidade Zero Data Retention (ZDR).
- **[`administracao_e_infra/workload_identity_federation.md`](administracao_e_infra/workload_identity_federation.md)**: Federação OIDC com AWS, GCP, Azure, GitHub Actions e Kubernetes.
- **[`administracao_e_infra/terraform_e_automacao.md`](administracao_e_infra/terraform_e_automacao.md)**: Provedor oficial Terraform da OpenAI para gestão de infraestrutura como código.

### 4.10 Seção `referencia_api/`
- **[`referencia_api/responses_e_chat.md`](referencia_api/responses_e_chat.md)**: Endpoints `/v1/responses`, cancel, retrieve, compact e chat legado.
- **[`referencia_api/audio_e_voz.md`](referencia_api/audio_e_voz.md)**: Endpoints `/v1/audio/speech`, transcriptions, translations e voices.
- **[`referencia_api/imagens_e_videos.md`](referencia_api/imagens_e_videos.md)**: Endpoints `/v1/images/*` e `/v1/videos/*` (Sora API).
- **[`referencia_api/arquivos_e_vector_stores.md`](referencia_api/arquivos_e_vector_stores.md)**: Endpoints `/v1/files`, `/v1/uploads` e `/v1/vector_stores`.
- **[`referencia_api/fine_tuning_e_batches.md`](referencia_api/fine_tuning_e_batches.md)**: Endpoints `/v1/fine_tuning/jobs` e `/v1/batches`.
- **[`referencia_api/evals_e_containers.md`](referencia_api/evals_e_containers.md)**: Endpoints `/v1/evals`, `/v1/graders` e `/v1/containers`.
- **[`referencia_api/realtime_calls_e_webhooks.md`](referencia_api/realtime_calls_e_webhooks.md)**: Endpoints `/v1/realtime/*` e validação de assinatura de Webhooks.
- **[`referencia_api/admin_e_organizacao.md`](referencia_api/admin_e_organizacao.md)**: Endpoints `/v1/organization/*` e `/v1/projects/*`.

### 4.11 Seção `exemplos/`
- **[`exemplos/quickstart_responses_python.md`](exemplos/quickstart_responses_python.md)**: Quickstart executável em Python.
- **[`exemplos/quickstart_responses_typescript.md`](exemplos/quickstart_responses_typescript.md)**: Quickstart executável em TypeScript.
- **[`exemplos/agent_multi_ferramentas.md`](exemplos/agent_multi_ferramentas.md)**: Agente multi-ferramentas com busca web e handoffs.
- **[`exemplos/realtime_audio_streaming.md`](exemplos/realtime_audio_streaming.md)**: Áudio bidirecional via WebSocket em Python.
- **[`exemplos/structured_data_extraction.md`](exemplos/structured_data_extraction.md)**: Extração estruturada de faturas com Pydantic.
- **[`exemplos/fine_tuning_workflow.md`](exemplos/fine_tuning_workflow.md)**: Pipeline completo de fine-tuning e validação.
