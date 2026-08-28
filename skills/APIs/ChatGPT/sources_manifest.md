---
title: "Sources Manifest — Proveniência Documental da OpenAI API Skill"
description: "Mapeamento formal de proveniência documental das rotas processadas a partir da documentação oficial da OpenAI (developers.openai.com/api/docs) para a arquitetura modular da skill."
topics: ["sources-manifest", "proveniencia-documental", "rotas-oficiais", "mapeamento-de-fontes"]
keywords: ["sources_manifest", "developers.openai.com", "llms-full.txt", "rotas processadas"]
source_scope: "OpenAI API Official Documentation & Platform Guides"
---

# Sources Manifest — Proveniência Documental

## 1. Domínio Autorizado e Escopo de Fontes

- **Domínio Autorizado Primário:** `https://developers.openai.com/api/docs` e `https://platform.openai.com/docs`
- **Arquivo Fonte Consolidado:** `developers.openai.com_api_llms-full.txt.txt` (3,96 MB de texto oficial consolidado)
- **Versão das Tecnologias Analisadas:**
  - OpenAI Python SDK: `>= 1.50.0`
  - OpenAI TypeScript/Node.js SDK: `>= 4.60.0`
  - OpenAI REST API: `v1` (com endpoints modernos de Responses, Realtime, Batch e Assistants v2)

---

## 2. Política de Aquisição e Extração de Conhecimento

Esta Skill foi construída através da extração sistemática, curadoria e modularização direta de toda a documentação oficial da OpenAI. Nenhuma fonte secundária não oficial (fóruns de terceiros, artigos desatualizados de blogs ou dados legados pré-v1.0) foi utilizada para fundamentar as regras técnicas.

Todas as recomendações de engenharia, tabelas de parâmetros, esquemas JSON Schema, limites de cotas e assinaturas de SDK refletem com precisão as especificações vigentes da plataforma OpenAI.

---

## 3. Mapeamento de Rotas Documentais para Arquivos Modulares da Skill

| Seção / Rota Oficial da OpenAI | Tópico Documental | Arquivo Markdown de Destino | Status |
| :--- | :--- | :--- | :---: |
| `/docs/quickstart` | Instalação dos SDKs e Autenticação | `primeiros_passos/instalacao_e_autenticacao.md` | Processada |
| `/docs/guides/text-generation` | Chat Completions, Responses API e Streaming | `primeiros_passos/quickstart_responses_e_chat.md` | Processada |
| `/docs/models` | Famílias GPT-4o, o1, o3-mini, Whisper, TTS, DALL-E | `primeiros_passos/catalogo_de_modelos.md` | Processada |
| `/docs/guides/structured-outputs` | JSON Schema estrito (`strict: true`), Pydantic e Zod | `recursos_centrais/structured_outputs.md` | Processada |
| `/docs/guides/function-calling` | Definição de ferramentas `tools` e chamadas paralelas | `recursos_centrais/function_calling_tool_use.md` | Processada |
| `/docs/guides/realtime` | Realtime API via WebSockets e WebRTC | `recursos_centrais/realtime_api_voz_e_webrtc.md` | Processada |
| `/docs/assistants/overview` | Assistants API v2, Threads, Messages e Runs | `recursos_centrais/assistants_api_v2.md` | Processada |
| `/docs/assistants/tools/file-search` | Vector Stores, Chunking e File Search | `recursos_centrais/file_search_e_vector_stores.md` | Processada |
| `/docs/assistants/tools/code-interpreter` | Sandbox de execução de código Python | `recursos_centrais/code_interpreter.md` | Processada |
| `/docs/guides/vision` | GPT-4o Vision, imagens remotas/base64 e tokens | `multimodal_e_especializados/visao_e_processamento_de_imagens.md` | Processada |
| `/docs/guides/speech-to-text` | Whisper API (transcrição e tradução de áudio) | `multimodal_e_especializados/audio_whisper_e_tts.md` | Processada |
| `/docs/guides/text-to-speech` | Síntese de voz com TTS-1 e TTS-1-HD | `multimodal_e_especializados/audio_whisper_e_tts.md` | Processada |
| `/docs/guides/images` | Geração, edição e variações com DALL-E 3 e DALL-E 2 | `multimodal_e_especializados/geracao_de_imagens_dalle.md` | Processada |
| `/docs/guides/embeddings` | Embeddings semânticos (`text-embedding-3`) | `multimodal_e_especializados/embeddings_e_moderacao.md` | Processada |
| `/docs/guides/moderation` | Verificação de conformidade com Moderation API | `multimodal_e_especializados/embeddings_e_moderacao.md` | Processada |
| `/docs/guides/batch` | Processamento assíncrono em lote (50% desconto) | `operacao_e_escala/batch_api.md` | Processada |
| `/docs/guides/fine-tuning` | Fine-tuning supervisionado e DPO | `operacao_e_escala/fine_tuning_api.md` | Processada |
| `/docs/api-reference/files` | Gestão de arquivos `/v1/files` | `operacao_e_escala/files_e_storage_management.md` | Processada |
| `/docs/guides/admin-api` | Governança corporativa, projetos, cotas e auditoria | `operacao_e_escala/admin_usage_e_projects.md` | Processada |
| `/docs/api-reference/*` | Catálogo completo de endpoints REST | `api_referencia/endpoints_rest_reference.md` | Processada |
| `/docs/api-reference/chat/create` | Parâmetros de amostragem e respostas | `api_referencia/parametros_requisicao_e_respostas.md` | Processada |
| `/docs/guides/rate-limits` | Rate Limits (RPM/TPM), erros HTTP e retries | `api_referencia/erros_rate_limits_e_retries.md` | Processada |
