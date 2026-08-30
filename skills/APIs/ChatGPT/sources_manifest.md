# Manifesto de Fontes Oficiais (sources_manifest.md)

Este documento registra a proveniência e o mapeamento de rastreabilidade de todas as páginas documentais oficiais consultadas e processadas para a construção desta Skill.

---

## 1. Metadados de Proveniência

- **Domínio Autorizado**: `developers.openai.com`
- **URL Inicial Fornecida**: `https://developers.openai.com/api/docs`
- **Manifestos de Descoberta Oficiais**:
  - `https://developers.openai.com/llms.txt`
  - `https://developers.openai.com/api/llms.txt`
  - `https://developers.openai.com/api/docs/llms.txt`
  - `https://developers.openai.com/api/reference/llms.txt`
  - `https://developers.openai.com/plugins/llms.txt`
  - `https://developers.openai.com/workspace-agents/llms.txt`
- **Versão Documentada**: OpenAI API Platform (Arquitetura Responses API, Agents SDK, GPT-5 / GPT-5.6 Sol / o-series / GPT-4.1)
- **Data de Extração**: Agosto de 2026

---

## 2. Mapeamento de Páginas Oficiais para Arquivos da Skill

| URL Oficial na OpenAI | Título da Página / Recurso | Arquivo de Destino na Skill | Status |
|---|---|---|---|
| `https://developers.openai.com/api/docs/concepts.md` | Key Concepts | `fundamentos/overview_e_arquitetura.md` | Processada |
| `https://developers.openai.com/api/reference/overview.md` | API Overview | `fundamentos/overview_e_arquitetura.md` | Processada |
| `https://developers.openai.com/api/docs/guides/workload-identity-federation.md` | Workload Identity Federation Overview | `fundamentos/autenticacao_e_seguranca.md` | Processada |
| `https://developers.openai.com/api/docs/guides/admin-apis.md` | Admin APIs | `fundamentos/autenticacao_e_seguranca.md` | Processada |
| `https://developers.openai.com/api/docs/guides/mutual-tls.md` | Mutual TLS (mTLS) | `fundamentos/autenticacao_e_seguranca.md` | Processada |
| `https://developers.openai.com/api/docs/guides/ip-allowlist.md` | IP Allowlist | `fundamentos/autenticacao_e_seguranca.md` | Processada |
| `https://developers.openai.com/api/docs/libraries.md` | Official SDKs and Libraries | `fundamentos/sdks_e_cli.md` | Processada |
| `https://developers.openai.com/api/docs/libraries/openai-cli.md` | OpenAI CLI | `fundamentos/sdks_e_cli.md` | Processada |
| `https://developers.openai.com/api/docs/guides/rate-limits.md` | Rate Limits | `fundamentos/rate_limits_e_custos.md` | Processada |
| `https://developers.openai.com/api/docs/guides/cost-optimization.md` | Cost Optimization | `fundamentos/rate_limits_e_custos.md` | Processada |
| `https://developers.openai.com/api/docs/guides/latency-optimization.md` | Latency Optimization | `fundamentos/rate_limits_e_custos.md` | Processada |
| `https://developers.openai.com/api/docs/guides/fast-mode.md` | Fast Mode | `fundamentos/rate_limits_e_custos.md` | Processada |
| `https://developers.openai.com/api/docs/guides/flex-processing.md` | Flex Processing | `fundamentos/rate_limits_e_custos.md` | Processada |
| `https://developers.openai.com/api/docs/models.md` | Models Catalog | `modelos/catalogo_e_selecao.md` | Processada |
| `https://developers.openai.com/api/docs/models/all.md` | All Models | `modelos/catalogo_e_selecao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/model-selection.md` | Model Selection Guide | `modelos/catalogo_e_selecao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/latest-model/gpt-5.6.md` | Using GPT-5.6 | `modelos/catalogo_e_selecao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/prompt-guidance-gpt-5p6.md` | Prompting Guidance for GPT-5.6 Sol | `modelos/catalogo_e_selecao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/latest-model/gpt-5.5.md` | Using GPT-5.5 | `modelos/catalogo_e_selecao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/latest-model/gpt-5.4.md` | Using GPT-5.4 | `modelos/catalogo_e_selecao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/latest-model/gpt-5.3-codex.md` | Using GPT-5.3-Codex | `modelos/catalogo_e_selecao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/latest-model/gpt-4.1.md` | Using GPT-4.1 | `modelos/catalogo_e_selecao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/reasoning.md` | Reasoning Models | `modelos/modelos_de_raciocinio.md` | Processada |
| `https://developers.openai.com/api/docs/guides/reasoning-best-practices.md` | Reasoning Best Practices | `modelos/modelos_de_raciocinio.md` | Processada |
| `https://developers.openai.com/api/docs/pricing.md` | Pricing | `modelos/precificacao_e_limites.md` | Processada |
| `https://developers.openai.com/api/docs/models/compare.md` | Compare Models | `modelos/precificacao_e_limites.md` | Processada |
| `https://developers.openai.com/api/docs/quickstart.md` | Developer Quickstart | `responses_api/introducao_e_quickstart.md` | Processada |
| `https://developers.openai.com/api/reference/resources/responses/methods/create.md` | Responses Create Method | `responses_api/introducao_e_quickstart.md` | Processada |
| `https://developers.openai.com/api/docs/guides/migrate-to-responses.md` | Migrate to Responses API | `responses_api/introducao_e_quickstart.md` | Processada |
| `https://developers.openai.com/api/docs/guides/structured-outputs.md` | Structured Model Outputs | `responses_api/structured_outputs.md` | Processada |
| `https://developers.openai.com/api/docs/guides/streaming-responses.md` | Streaming API Responses | `responses_api/streaming_e_websockets.md` | Processada |
| `https://developers.openai.com/api/docs/guides/websocket-mode.md` | WebSocket Mode | `responses_api/streaming_e_websockets.md` | Processada |
| `https://developers.openai.com/api/docs/guides/conversation-state.md` | Conversation State | `responses_api/gerenciamento_de_estado.md` | Processada |
| `https://developers.openai.com/api/docs/guides/compaction.md` | Context Compaction | `responses_api/gerenciamento_de_estado.md` | Processada |
| `https://developers.openai.com/api/docs/guides/prompt-caching.md` | Prompt Caching | `responses_api/prompt_caching_e_predicted.md` | Processada |
| `https://developers.openai.com/api/docs/guides/predicted-outputs.md` | Predicted Outputs | `responses_api/prompt_caching_e_predicted.md` | Processada |
| `https://developers.openai.com/api/docs/guides/function-calling.md` | Function Calling | `ferramentas_e_mcp/function_calling.md` | Processada |
| `https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling.md` | Programmatic Tool Calling | `ferramentas_e_mcp/function_calling.md` | Processada |
| `https://developers.openai.com/api/docs/guides/tools.md` | Using Tools | `ferramentas_e_mcp/ferramentas_hospedadas.md` | Processada |
| `https://developers.openai.com/api/docs/guides/tools-web-search.md` | Web Search Tool | `ferramentas_e_mcp/ferramentas_hospedadas.md` | Processada |
| `https://developers.openai.com/api/docs/guides/tools-file-search.md` | File Search Tool | `ferramentas_e_mcp/ferramentas_hospedadas.md` | Processada |
| `https://developers.openai.com/api/docs/guides/tools-code-interpreter.md` | Code Interpreter Tool | `ferramentas_e_mcp/ferramentas_hospedadas.md` | Processada |
| `https://developers.openai.com/api/docs/guides/tools-computer-use.md` | Computer Use Tool | `ferramentas_e_mcp/computer_use_e_patch.md` | Processada |
| `https://developers.openai.com/api/docs/guides/tools-apply-patch.md` | Apply Patch Tool | `ferramentas_e_mcp/computer_use_e_patch.md` | Processada |
| `https://developers.openai.com/api/docs/guides/tools-local-shell.md` | Local Shell Tool | `ferramentas_e_mcp/computer_use_e_patch.md` | Processada |
| `https://developers.openai.com/api/docs/guides/tools-connectors-mcp.md` | MCP and Connectors | `ferramentas_e_mcp/mcp_e_conectores.md` | Processada |
| `https://developers.openai.com/api/docs/guides/secure-mcp-tunnels.md` | Secure MCP Tunnel | `ferramentas_e_mcp/mcp_e_conectores.md` | Processada |
| `https://developers.openai.com/api/docs/mcp.md` | Building MCP Servers | `ferramentas_e_mcp/mcp_e_conectores.md` | Processada |
| `https://developers.openai.com/api/docs/guides/agents.md` | Agents SDK Overview | `agents_sdk/definicao_de_agentes.md` | Processada |
| `https://developers.openai.com/api/docs/guides/agents/define-agents.md` | Agent Definitions | `agents_sdk/definicao_de_agentes.md` | Processada |
| `https://developers.openai.com/api/docs/guides/agents/quickstart.md` | Agents SDK Quickstart | `agents_sdk/definicao_de_agentes.md` | Processada |
| `https://developers.openai.com/api/docs/guides/agents/orchestration.md` | Orchestration and Handoffs | `agents_sdk/orquestracao_e_fluxos.md` | Processada |
| `https://developers.openai.com/api/docs/guides/responses-multi-agent.md` | Multi-Agent Responses | `agents_sdk/orquestracao_e_fluxos.md` | Processada |
| `https://developers.openai.com/api/docs/guides/agents/running-agents.md` | Running Agents | `agents_sdk/orquestracao_e_fluxos.md` | Processada |
| `https://developers.openai.com/api/docs/guides/agents/guardrails-approvals.md` | Guardrails and Human Review | `agents_sdk/guardrails_e_sandboxes.md` | Processada |
| `https://developers.openai.com/api/docs/guides/agents/sandboxes.md` | Sandbox Agents | `agents_sdk/guardrails_e_sandboxes.md` | Processada |
| `https://developers.openai.com/api/docs/guides/agent-builder.md` | Agent Builder | `agents_sdk/agent_builder_e_chatkit.md` | Processada |
| `https://developers.openai.com/api/docs/guides/chatkit.md` | ChatKit Overview | `agents_sdk/agent_builder_e_chatkit.md` | Processada |
| `https://developers.openai.com/api/docs/guides/chatkit-widgets.md` | ChatKit Widgets | `agents_sdk/agent_builder_e_chatkit.md` | Processada |
| `https://developers.openai.com/api/docs/guides/chatkit-actions.md` | ChatKit Actions | `agents_sdk/agent_builder_e_chatkit.md` | Processada |
| `https://developers.openai.com/api/docs/guides/audio.md` | Audio and Speech | `multimidia_e_tempo_real/audio_e_transcricao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/text-to-speech.md` | Text to Speech | `multimidia_e_tempo_real/audio_e_transcricao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/speech-to-text.md` | Speech to Text (Whisper) | `multimidia_e_tempo_real/audio_e_transcricao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/images-vision.md` | Images and Vision | `multimidia_e_tempo_real/visao_e_geracao_imagens.md` | Processada |
| `https://developers.openai.com/api/docs/guides/image-generation.md` | Image Generation | `multimidia_e_tempo_real/visao_e_geracao_imagens.md` | Processada |
| `https://developers.openai.com/api/docs/guides/video-generation.md` | Video Generation with Sora | `multimidia_e_tempo_real/geracao_video_sora.md` | Processada |
| `https://developers.openai.com/api/docs/guides/realtime.md` | Realtime API Overview | `multimidia_e_tempo_real/realtime_api_webrtc.md` | Processada |
| `https://developers.openai.com/api/docs/guides/realtime-webrtc.md` | Realtime API with WebRTC | `multimidia_e_tempo_real/realtime_api_webrtc.md` | Processada |
| `https://developers.openai.com/api/docs/guides/realtime-websocket.md` | Realtime API with WebSocket | `multimidia_e_tempo_real/realtime_api_websocket.md` | Processada |
| `https://developers.openai.com/api/docs/guides/realtime-sip.md` | Realtime API with SIP | `multimidia_e_tempo_real/realtime_sip_e_telefonia.md` | Processada |
| `https://developers.openai.com/plugins/llms.txt` | ChatGPT Plugins Index | `chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md` | Processada |
| `https://developers.openai.com/plugins/build/app-quickstart.md` | Plugins Quickstart | `chatgpt_e_plugins/chatgpt_plugins_apps_sdk.md` | Processada |
| `https://developers.openai.com/workspace-agents/trigger-runs.md` | Workspace Agents API | `chatgpt_e_plugins/workspace_agents_api.md` | Processada |
| `https://developers.openai.com/api/docs/actions/introduction.md` | GPT Actions Introduction | `chatgpt_e_plugins/gpt_actions.md` | Processada |
| `https://developers.openai.com/api/docs/actions/authentication.md` | GPT Action Authentication | `chatgpt_e_plugins/gpt_actions.md` | Processada |
| `https://developers.openai.com/api/docs/guides/supervised-fine-tuning.md` | Supervised Fine-Tuning | `fine_tuning_e_evals/fine_tuning_sft.md` | Processada |
| `https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning.md` | Reinforcement Fine-Tuning | `fine_tuning_e_evals/reinforcement_fine_tuning.md` | Processada |
| `https://developers.openai.com/api/docs/guides/direct-preference-optimization.md` | Direct Preference Optimization | `fine_tuning_e_evals/reinforcement_fine_tuning.md` | Processada |
| `https://developers.openai.com/api/docs/guides/evals.md` | Evals Guide | `fine_tuning_e_evals/evals_e_graders.md` | Processada |
| `https://developers.openai.com/api/docs/guides/graders.md` | Graders Reference | `fine_tuning_e_evals/evals_e_graders.md` | Processada |
| `https://developers.openai.com/api/docs/guides/moderation.md` | Moderation Guide | `fine_tuning_e_evals/red_teaming_e_moderacao.md` | Processada |
| `https://developers.openai.com/api/docs/guides/rbac.md` | RBAC Permissions | `administracao_e_infra/rbac_organizacoes_projetos.md` | Processada |
| `https://developers.openai.com/api/docs/guides/your-data.md` | Data Controls & Retention | `administracao_e_infra/audit_logs_e_compliance.md` | Processada |
| `https://developers.openai.com/api/docs/guides/terraform.md` | Terraform Provider Guide | `administracao_e_infra/terraform_e_automacao.md` | Processada |
| `https://developers.openai.com/api/reference/resources/responses.md` | Responses Endpoint Group | `referencia_api/responses_e_chat.md` | Processada |
| `https://developers.openai.com/api/reference/resources/audio.md` | Audio Endpoint Group | `referencia_api/audio_e_voz.md` | Processada |
| `https://developers.openai.com/api/reference/resources/images.md` | Images Endpoint Group | `referencia_api/imagens_e_videos.md` | Processada |
| `https://developers.openai.com/api/reference/resources/videos.md` | Videos Endpoint Group | `referencia_api/imagens_e_videos.md` | Processada |
| `https://developers.openai.com/api/reference/resources/files.md` | Files Endpoint Group | `referencia_api/arquivos_e_vector_stores.md` | Processada |
| `https://developers.openai.com/api/reference/resources/vector_stores.md` | Vector Stores Group | `referencia_api/arquivos_e_vector_stores.md` | Processada |
| `https://developers.openai.com/api/reference/resources/fine_tuning.md` | Fine Tuning Group | `referencia_api/fine_tuning_e_batches.md` | Processada |
| `https://developers.openai.com/api/reference/resources/batches.md` | Batches Endpoint Group | `referencia_api/fine_tuning_e_batches.md` | Processada |
| `https://developers.openai.com/api/reference/resources/evals.md` | Evals Endpoint Group | `referencia_api/evals_e_containers.md` | Processada |
| `https://developers.openai.com/api/reference/resources/containers.md` | Containers Group | `referencia_api/evals_e_containers.md` | Processada |
| `https://developers.openai.com/api/reference/resources/realtime.md` | Realtime Calls Group | `referencia_api/realtime_calls_e_webhooks.md` | Processada |
| `https://developers.openai.com/api/reference/resources/webhooks.md` | Webhooks Event Group | `referencia_api/realtime_calls_e_webhooks.md` | Processada |
| `https://developers.openai.com/api/reference/resources/organization.md` | Organization Admin Group | `referencia_api/admin_e_organizacao.md` | Processada |
| `https://developers.openai.com/api/reference/resources/projects.md` | Projects Admin Group | `referencia_api/admin_e_organizacao.md` | Processada |
