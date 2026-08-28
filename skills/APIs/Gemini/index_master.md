---
title: Google Gemini API Skill — Index Master
description: Roteador semântico de conhecimento, tabela de intenções e mapa de contexto completo para a Google Gemini API.
---

# Google Gemini API Skill — Index Master

## 1. Identidade da Base de Conhecimento

- **Tecnologia:** Google Gemini API (`@google/genai` v1 Node.js/TypeScript / `google-genai` Python SDK / REST API `v1beta`).
- **Plataformas Suportadas:** Google AI Studio e Google Cloud Vertex AI.
- **Escopo Total Coberto:** 100% da documentação oficial de `https://ai.google.dev/gemini-api/docs` e `https://ai.google.dev/api` dividida em 22 módulos especializados.

---

## 2. Tabela de Roteamento Semântico por Intenção

| Intenção do Desenvolvedor / Pergunta Técnica | Arquivo Principal a Consultar | Arquivos Complementares |
| :--- | :--- | :--- |
| Instalar novos SDKs (`google-genai` / `@google/genai`) e configurar API Keys / Vertex AI | [`primeiros_passos/instalacao_e_autenticacao.md`](./primeiros_passos/instalacao_e_autenticacao.md) | [`primeiros_passos/quickstart_generate_content.md`](./primeiros_passos/quickstart_generate_content.md) |
| Primeiro `generate_content`, streaming, system instructions e contagem de tokens | [`primeiros_passos/quickstart_generate_content.md`](./primeiros_passos/quickstart_generate_content.md) | [`api_referencia/parametros_geracao_e_seguranca.md`](./api_referencia/parametros_geracao_e_seguranca.md) |
| Escolher modelos (Gemini 2.5 Flash, 2.0 Flash, Flash Thinking, 1.5 Pro, limites) | [`primeiros_passos/modelos_e_capacidades.md`](./primeiros_passos/modelos_e_capacidades.md) | [`recursos_avancados/agent_environment_e_deep_research.md`](./recursos_avancados/agent_environment_e_deep_research.md) |
| Enviar imagens, analisar áudio com timestamps, vídeos e documentos PDF | [`recursos_centrais/multimodalidade_visao_audio_video.md`](./recursos_centrais/multimodalidade_visao_audio_video.md) | [`recursos_centrais/file_api_upload_gerenciamento.md`](./recursos_centrais/file_api_upload_gerenciamento.md) |
| Upload de arquivos pesados (>20MB), ciclo de vida, polling e deleção via Files API | [`recursos_centrais/file_api_upload_gerenciamento.md`](./recursos_centrais/file_api_upload_gerenciamento.md) | [`recursos_centrais/multimodalidade_visao_audio_video.md`](./recursos_centrais/multimodalidade_visao_audio_video.md) |
| Obter saídas JSON estritas com Pydantic ou JSON Schema (`response_schema`) | [`recursos_centrais/structured_outputs_json_schema.md`](./recursos_centrais/structured_outputs_json_schema.md) | [`recursos_centrais/function_calling_tool_use.md`](./recursos_centrais/function_calling_tool_use.md) |
| Declarar ferramentas, Function Calling, ToolConfig (`AUTO`, `ANY`, `NONE`) e loops de agente | [`recursos_centrais/function_calling_tool_use.md`](./recursos_centrais/function_calling_tool_use.md) | [`recursos_avancados/agent_environment_e_deep_research.md`](./recursos_avancados/agent_environment_e_deep_research.md) |
| Execução de código Python em sandbox pelo modelo (`code_execution`) | [`recursos_centrais/code_execution.md`](./recursos_centrais/code_execution.md) | [`recursos_centrais/function_calling_tool_use.md`](./recursos_centrais/function_calling_tool_use.md) |
| Aterramento com Google Search, SearchEntryPoint e metadados de fontes | [`recursos_centrais/grounding_google_search.md`](./recursos_centrais/grounding_google_search.md) | [`api_referencia/parametros_geracao_e_seguranca.md`](./api_referencia/parametros_geracao_e_seguranca.md) |
| Cache explícito de prompts longos (>32k tokens), TTL e redução de custos | [`recursos_avancados/context_caching.md`](./recursos_avancados/context_caching.md) | [`primeiros_passos/modelos_e_capacidades.md`](./primeiros_passos/modelos_e_capacidades.md) |
| Embeddings de texto (`text-embedding-004`), MRL (dimensão reduzida) e `TaskType` | [`recursos_avancados/embeddings_e_busca_semantica.md`](./recursos_avancados/embeddings_e_busca_semantica.md) | [`api_referencia/endpoints_rest_reference.md`](./api_referencia/endpoints_rest_reference.md) |
| Processamento assíncrono em lote (Batch API) com 50% de desconto em tokens | [`recursos_avancados/batch_api.md`](./recursos_avancados/batch_api.md) | [`api_referencia/endpoints_rest_reference.md`](./api_referencia/endpoints_rest_reference.md) |
| Fine-Tuning supervisionado de modelos Gemini com datasets JSONL | [`recursos_avancados/model_tuning.md`](./recursos_avancados/model_tuning.md) | [`primeiros_passos/modelos_e_capacidades.md`](./primeiros_passos/modelos_e_capacidades.md) |
| Live API bidirecional de áudio/vídeo sobre WebSockets/WebRTC de ultra-baixa latência | [`recursos_avancados/live_api_bidirectional_webrtc.md`](./recursos_avancados/live_api_bidirectional_webrtc.md) | [`recursos_centrais/function_calling_tool_use.md`](./recursos_centrais/function_calling_tool_use.md) |
| Arquiteturas para Agentes Autônomos, Deep Research, Coding Agents e memória | [`recursos_avancados/agent_environment_e_deep_research.md`](./recursos_avancados/agent_environment_e_deep_research.md) | [`recursos_centrais/function_calling_tool_use.md`](./recursos_centrais/function_calling_tool_use.md) |
| Referência exaustiva de endpoints HTTP REST `v1beta` (request/response schemas) | [`api_referencia/endpoints_rest_reference.md`](./api_referencia/endpoints_rest_reference.md) | [`api_referencia/parametros_geracao_e_seguranca.md`](./api_referencia/parametros_geracao_e_seguranca.md) |
| Configurar `temperature`, `top_p`, `top_k`, `max_output_tokens` e `safety_settings` | [`api_referencia/parametros_geracao_e_seguranca.md`](./api_referencia/parametros_geracao_e_seguranca.md) | [`primeiros_passos/quickstart_generate_content.md`](./primeiros_passos/quickstart_generate_content.md) |
| Diagnóstico de erros HTTP (400, 401, 403, 404, 429, 500), rate limits e retentativas | [`api_referencia/erros_rate_limits_e_troubleshooting.md`](./api_referencia/erros_rate_limits_e_troubleshooting.md) | [`api_referencia/endpoints_rest_reference.md`](./api_referencia/endpoints_rest_reference.md) |

---

## 3. Mapa de Contexto e Catálogo dos 22 Módulos

### 3.1. Arquivos Raiz
- **[`SKILL.md`](./SKILL.md)**: Documento de entrada para agentes, diretrizes e as 8 regras fundamentais da API.
- **[`index_master.md`](./index_master.md)**: Roteador de conhecimento técnico e mapa geral.
- **[`sources_manifest.md`](./sources_manifest.md)**: Proveniência de todas as fontes oficiais da Google Gemini API.
- **[`coverage_report.md`](./coverage_report.md)**: Relatório de auditoria de cobertura documental e métricas.

### 3.2. `primeiros_passos/`
- **[`instalacao_e_autenticacao.md`](./primeiros_passos/instalacao_e_autenticacao.md)**: Instalação dos novos pacotes (`google-genai` / `@google/genai`), variáveis de ambiente e autenticação unificada (AI Studio vs Vertex AI).
- **[`quickstart_generate_content.md`](./primeiros_passos/quickstart_generate_content.md)**: Chamadas síncronas, streaming, system instructions, conversação multi-turn (Chat) e contagem de tokens.
- **[`modelos_e_capacidades.md`](./primeiros_passos/modelos_e_capacidades.md)**: Matriz comparativa de modelos (Gemini 2.5 Flash, 2.0 Flash, 2.0 Flash Thinking, 1.5 Pro, 1.5 Flash), capacidades e limites de janela de contexto.

### 3.3. `recursos_centrais/`
- **[`multimodalidade_visao_audio_video.md`](./recursos_centrais/multimodalidade_visao_audio_video.md)**: Processamento de imagens, áudio com timestamps, vídeos longos com amostragem temporal e documentos PDF complexos.
- **[`file_api_upload_gerenciamento.md`](./recursos_centrais/file_api_upload_gerenciamento.md)**: Ciclo de vida da Files API para payloads até 2GB, polling de estado, listagem, download e deleção.
- **[`structured_outputs_json_schema.md`](./recursos_centrais/structured_outputs_json_schema.md)**: Extração garantida de JSON estruturado com Pydantic em Python e Schemas tipados em TypeScript.
- **[`function_calling_tool_use.md`](./recursos_centrais/function_calling_tool_use.md)**: Declaração de ferramentas, modos `ToolConfig` (`AUTO`, `ANY`, `NONE`), execução paralela e loop multi-turn de ferramentas.
- **[`code_execution.md`](./recursos_centrais/code_execution.md)**: Sandbox de execução de código Python embutido no modelo para matemática, análise e computação precisa.
- **[`grounding_google_search.md`](./recursos_centrais/grounding_google_search.md)**: Aterramento dinâmico com Google Search, extração de citações e metadados de ancoragem.

### 3.4. `recursos_avancados/`
- **[`context_caching.md`](./recursos_avancados/context_caching.md)**: Cache explícito de tokens para contextos acima de 32k tokens, TTL, gerenciamento de ciclo de vida e economia de custos.
- **[`embeddings_e_busca_semantica.md`](./recursos_avancados/embeddings_e_busca_semantica.md)**: Modelo `text-embedding-004`, redução de dimensionalidade (MRL), `TaskType` e busca por similaridade de cosseno.
- **[`batch_api.md`](./recursos_avancados/batch_api.md)**: Processamento em lote assíncrono com desconto de 50% em tokens e cotas segregadas.
- **[`model_tuning.md`](./recursos_avancados/model_tuning.md)**: Fine-tuning supervisionado de modelos Gemini com datasets JSONL e hiperparâmetros customizados.
- **[`live_api_bidirectional_webrtc.md`](./recursos_avancados/live_api_bidirectional_webrtc.md)**: Comunicação de áudio/vídeo em tempo real full-duplex sobre WebSockets com cancelamento de eco e interrupções.
- **[`agent_environment_e_deep_research.md`](./recursos_avancados/agent_environment_e_deep_research.md)**: Padrões de arquitetura para agentes autônomos, Deep Research, Coding Agents e gestão de memória.

### 3.5. `api_referencia/`
- **[`endpoints_rest_reference.md`](./api_referencia/endpoints_rest_reference.md)**: Especificação completa dos endpoints REST `v1beta`, schemas JSON de requisição e resposta.
- **[`parametros_geracao_e_seguranca.md`](./api_referencia/parametros_geracao_e_seguranca.md)**: Catálogo exaustivo de hiperparâmetros de amostragem e configurações de segurança (*SafetySettings* / *HarmCategory*).
- **[`erros_rate_limits_e_troubleshooting.md`](./api_referencia/erros_rate_limits_e_troubleshooting.md)**: Guia completo de códigos de erro HTTP, limites de RPM/TPM por tier e padrões de retentativa com recuo exponencial.
