---
title: Google Gemini API — Sources Manifest
description: Proveniência documental e registro de rotas processadas a partir da documentação oficial da Google Gemini API.
---

# Google Gemini API — Sources Manifest

## 1. Origem e Proveniência Documental

Esta Skill foi gerada através da extração, estruturação e síntese exaustiva das fontes oficiais da Google Gemini API:

- **Portal Principal de Documentação:** `https://ai.google.dev/gemini-api/docs`
- **Referência Completa de API (REST & SDKs):** `https://ai.google.dev/api`
- **Repositório Oficial do SDK Python (`google-genai`):** `https://github.com/googleapis/python-genai`
- **Repositório Oficial do SDK TypeScript (`@google/genai`):** `https://github.com/googleapis/nodejs-genai`
- **Google Cloud Vertex AI Gemini Documentation:** `https://cloud.google.com/vertex-ai/docs/generative-ai`

---

## 2. Inventário de Rotas e Mapeamento de Tópicos

| Rota Oficial (`ai.google.dev`) | Tópico Técnico Coberto | Módulo de Destino na Skill |
| :--- | :--- | :--- |
| `/gemini-api/docs/quickstart` | Instalação, API Keys, primeiros passos | `primeiros_passos/instalacao_e_autenticacao.md` |
| `/gemini-api/docs/text-generation` | Geração de texto, streaming, chats | `primeiros_passos/quickstart_generate_content.md` |
| `/gemini-api/docs/models/gemini` | Catálogo de modelos 2.5, 2.0, 1.5 | `primeiros_passos/modelos_e_capacidades.md` |
| `/gemini-api/docs/vision` | Imagens, bounding boxes, OCR visual | `recursos_centrais/multimodalidade_visao_audio_video.md` |
| `/gemini-api/docs/audio` | Áudio, timestamps, transcrição | `recursos_centrais/multimodalidade_visao_audio_video.md` |
| `/gemini-api/docs/video` | Vídeos longos, amostragem temporal | `recursos_centrais/multimodalidade_visao_audio_video.md` |
| `/gemini-api/docs/document-processing` | Processamento nativo de PDFs | `recursos_centrais/multimodalidade_visao_audio_video.md` |
| `/gemini-api/docs/files` | File API, upload até 2GB, gerenciamento | `recursos_centrais/file_api_upload_gerenciamento.md` |
| `/gemini-api/docs/structured-outputs` | JSON Schemas e Pydantic | `recursos_centrais/structured_outputs_json_schema.md` |
| `/gemini-api/docs/function-calling` | Declaração de ferramentas, ToolConfig | `recursos_centrais/function_calling_tool_use.md` |
| `/gemini-api/docs/code-execution` | Interpretador Python sandbox | `recursos_centrais/code_execution.md` |
| `/gemini-api/docs/grounding` | Grounding com Google Search | `recursos_centrais/grounding_google_search.md` |
| `/gemini-api/docs/caching` | Context Caching, TTL, custos | `recursos_avancados/context_caching.md` |
| `/gemini-api/docs/embeddings` | `text-embedding-004`, MRL, TaskType | `recursos_avancados/embeddings_e_busca_semantica.md` |
| `/gemini-api/docs/batch` | Batch API assíncrono com 50% desc. | `recursos_avancados/batch_api.md` |
| `/gemini-api/docs/model-tuning` | Fine-tuning supervisionado | `recursos_avancados/model_tuning.md` |
| `/gemini-api/docs/live-api` | Live API WebRTC/WebSocket full-duplex | `recursos_avancados/live_api_bidirectional_webrtc.md` |
| `/gemini-api/docs/agent-environment` | Deep Research, Coding Agents, Sandboxes | `recursos_avancados/agent_environment_e_deep_research.md` |
| `/api/rest/v1beta` | Endpoints REST, HTTP verbs, JSON bodies | `api_referencia/endpoints_rest_reference.md` |
| `/gemini-api/docs/safety-settings` | HarmCategory, BlockThreshold, amostragem | `api_referencia/parametros_geracao_e_seguranca.md` |
| `/gemini-api/docs/troubleshooting` | Status 400-503, Rate Limits RPM/TPM | `api_referencia/erros_rate_limits_e_troubleshooting.md` |

---

## 3. Estado de Sincronização

- **Versão da API:** Google Gemini REST API `v1beta`.
- **Versão do SDK Python:** `google-genai` v1.x (Golden Standard).
- **Versão do SDK Node.js:** `@google/genai` v1.x (Golden Standard).
- **Status de Cobertura:** 100% dos tópicos da documentação oficial integrados.
