---
title: "OpenAI API Skill — Index Master e Roteador Semântico"
description: "Roteador central de conhecimento da OpenAI API Skill. Mapeamento bidirecional de intenções técnicas de desenvolvimento para arquivos modulares e mapa hierárquico dos 24 módulos especializados."
topics: ["index", "roteamento-semantico", "mapa-de-contexto", "intencoes", "openai-api-skill"]
keywords: ["index_master", "tabela de roteamento", "mapa de contexto", "openai api docs"]
source_scope: "OpenAI API Docs: Curated Index, Full Reference & Knowledge Map"
---

# OpenAI API Skill — Index Master

## Identidade da Base de Conhecimento

- **Tecnologia:** OpenAI API & SDKs Oficiais (@openai SDK v4+ no TypeScript/Node.js, `openai` >= 1.50 no Python, REST API v1).
- **Tipo:** Plataforma de Inteligência Artificial para Modelos de Linguagem, Raciocínio, Visão, Áudio, Voz em Tempo Real e Automação de Agentes.
- **Escopo Total Coberto:** 100% da documentação oficial de `https://developers.openai.com/api/docs` dividida em 24 módulos especializados.

---

## Tabela de Roteamento Semântico por Intenção

| Intenção do Desenvolvedor / Pergunta Técnica | Arquivo Principal a Consultar | Arquivos Complementares |
| :--- | :--- | :--- |
| Instalação de SDKs, configuração de API Key, Org ID e Project ID | [`primeiros_passos/instalacao_e_autenticacao.md`](./primeiros_passos/instalacao_e_autenticacao.md) | [`operacao_e_escala/admin_usage_e_projects.md`](./operacao_e_escala/admin_usage_e_projects.md) |
| Primeiro chat, Responses API vs Chat Completions, Streaming SSE | [`primeiros_passos/quickstart_responses_e_chat.md`](./primeiros_passos/quickstart_responses_e_chat.md) | [`api_referencia/parametros_requisicao_e_respostas.md`](./api_referencia/parametros_requisicao_e_respostas.md) |
| Comparação de modelos (GPT-4o, GPT-4o-mini, o1, o3-mini, context window, preços) | [`primeiros_passos/catalogo_de_modelos.md`](./primeiros_passos/catalogo_de_modelos.md) | [`api_referencia/parametros_requisicao_e_respostas.md`](./api_referencia/parametros_requisicao_e_respostas.md) |
| Gerar JSON 100% estrito com Pydantic ou Zod (`strict: true`) | [`recursos_centrais/structured_outputs.md`](./recursos_centrais/structured_outputs.md) | [`recursos_centrais/function_calling_tool_use.md`](./recursos_centrais/function_calling_tool_use.md) |
| Function Calling, definição de ferramentas `tools`, chamadas paralelas e modos forçados | [`recursos_centrais/function_calling_tool_use.md`](./recursos_centrais/function_calling_tool_use.md) | [`recursos_centrais/structured_outputs.md`](./recursos_centrais/structured_outputs.md) |
| Voz bidirecional em tempo real via WebSockets / WebRTC (Realtime API) | [`recursos_centrais/realtime_api_voz_e_webrtc.md`](./recursos_centrais/realtime_api_voz_e_webrtc.md) | [`multimodal_e_especializados/audio_whisper_e_tts.md`](./multimodal_e_especializados/audio_whisper_e_tts.md) |
| Assistants API v2, Threads, Messages, Runs, Run Steps e Streaming | [`recursos_centrais/assistants_api_v2.md`](./recursos_centrais/assistants_api_v2.md) | [`recursos_centrais/file_search_e_vector_stores.md`](./recursos_centrais/file_search_e_vector_stores.md) |
| Busca em arquivos (RAG) com Vector Stores e File Search | [`recursos_centrais/file_search_e_vector_stores.md`](./recursos_centrais/file_search_e_vector_stores.md) | [`operacao_e_escala/files_e_storage_management.md`](./operacao_e_escala/files_e_storage_management.md) |
| Executar código Python em sandbox seguro pelo assistente | [`recursos_centrais/code_interpreter.md`](./recursos_centrais/code_interpreter.md) | [`recursos_centrais/assistants_api_v2.md`](./recursos_centrais/assistants_api_v2.md) |
| Analisar imagens, gráficos e OCR com GPT-4o (parâmetros de detalhe e tokens) | [`multimodal_e_especializados/visao_e_processamento_de_imagens.md`](./multimodal_e_especializados/visao_e_processamento_de_imagens.md) | [`primeiros_passos/catalogo_de_modelos.md`](./primeiros_passos/catalogo_de_modelos.md) |
| Transcrever/traduzir áudio com Whisper ou sintetizar voz com TTS-1/HD | [`multimodal_e_especializados/audio_whisper_e_tts.md`](./multimodal_e_especializados/audio_whisper_e_tts.md) | [`recursos_centrais/realtime_api_voz_e_webrtc.md`](./recursos_centrais/realtime_api_voz_e_webrtc.md) |
| Gerar, editar e variar imagens com DALL-E 3 e DALL-E 2 | [`multimodal_e_especializados/geracao_de_imagens_dalle.md`](./multimodal_e_especializados/geracao_de_imagens_dalle.md) | [`api_referencia/endpoints_rest_reference.md`](./api_referencia/endpoints_rest_reference.md) |
| Gerar embeddings semânticos (`text-embedding-3`) e filtrar conteúdo impróprio | [`multimodal_e_especializados/embeddings_e_moderacao.md`](./multimodal_e_especializados/embeddings_e_moderacao.md) | [`recursos_centrais/file_search_e_vector_stores.md`](./recursos_centrais/file_search_e_vector_stores.md) |
| Processamento massivo assíncrono com 50% de desconto (Batch API) | [`operacao_e_escala/batch_api.md`](./operacao_e_escala/batch_api.md) | [`operacao_e_escala/files_e_storage_management.md`](./operacao_e_escala/files_e_storage_management.md) |
| Treinar e customizar modelos via Fine-Tuning (SFT / DPO) | [`operacao_e_escala/fine_tuning_api.md`](./operacao_e_escala/fine_tuning_api.md) | [`operacao_e_escala/files_e_storage_management.md`](./operacao_e_escala/files_e_storage_management.md) |
| Upload, listagem, download e exclusão de arquivos (/v1/files) | [`operacao_e_escala/files_e_storage_management.md`](./operacao_e_escala/files_e_storage_management.md) | [`recursos_centrais/file_search_e_vector_stores.md`](./recursos_centrais/file_search_e_vector_stores.md) |
| Gestão de projetos, chaves de API, cotas e auditoria de logs (Admin API) | [`operacao_e_escala/admin_usage_e_projects.md`](./operacao_e_escala/admin_usage_e_projects.md) | [`primeiros_passos/instalacao_e_autenticacao.md`](./primeiros_passos/instalacao_e_autenticacao.md) |
| Catálogo completo de endpoints REST, métodos HTTP e payloads | [`api_referencia/endpoints_rest_reference.md`](./api_referencia/endpoints_rest_reference.md) | [`api_referencia/parametros_requisicao_e_respostas.md`](./api_referencia/parametros_requisicao_e_respostas.md) |
| Dicionário de parâmetros (`temperature`, `top_p`, `reasoning_effort`, etc.) | [`api_referencia/parametros_requisicao_e_respostas.md`](./api_referencia/parametros_requisicao_e_respostas.md) | [`api_referencia/endpoints_rest_reference.md`](./api_referencia/endpoints_rest_reference.md) |
| Tratamento de erros (400, 401, 404, 429, 500, 503), Rate Limits e Exponential Backoff | [`api_referencia/erros_rate_limits_e_retries.md`](./api_referencia/erros_rate_limits_e_retries.md) | [`primeiros_passos/instalacao_e_autenticacao.md`](./primeiros_passos/instalacao_e_autenticacao.md) |

---

## Mapa de Contexto e Catálogo dos 24 Módulos

### 1. `primeiros_passos/`
- **[`instalacao_e_autenticacao.md`](./primeiros_passos/instalacao_e_autenticacao.md)**: Instalação dos SDKs Python e TypeScript, autenticação via chaves de projeto (`sk-proj-...`), organização, timeouts, proxies e headers customizados.
- **[`quickstart_responses_e_chat.md`](./primeiros_passos/quickstart_responses_e_chat.md)**: Primeiros passos práticos com Chat Completions e a nova Responses API, streaming com SSE e manipulação de mensagens.
- **[`catalogo_de_modelos.md`](./primeiros_passos/catalogo_de_modelos.md)**: Matriz comparativa de capacidades, preços, janelas de contexto e limites da família GPT-4o, GPT-4o-mini, modelos de raciocínio `o1`/`o3-mini`, DALL-E, Whisper e Embeddings.

### 2. `recursos_centrais/`
- **[`structured_outputs.md`](./recursos_centrais/structured_outputs.md)**: Modo rigoroso `strict: true` garantindo 100% de conformidade com schemas JSON, integração com Pydantic (Python) e Zod (TypeScript).
- **[`function_calling_tool_use.md`](./recursos_centrais/function_calling_tool_use.md)**: Definição de ferramentas `tools`, chamadas paralelas, modos `tool_choice` forçados e loop de execução de agentes.
- **[`realtime_api_voz_e_webrtc.md`](./recursos_centrais/realtime_api_voz_e_webrtc.md)**: Sessões de voz bidirecional de baixíssima latência via WebSockets e WebRTC, eventos de áudio PCM16, VAD e execução de tools.
- **[`assistants_api_v2.md`](./recursos_centrais/assistants_api_v2.md)**: Assistentes persistentes, gerenciamento de Threads, Messages, ciclo de vida de Runs, Run Steps e streaming.
- **[`file_search_e_vector_stores.md`](./recursos_centrais/file_search_e_vector_stores.md)**: Mecanismo de RAG automático com Vector Stores, estratégias de chunking estático/auto, indexação e busca vetorial.
- **[`code_interpreter.md`](./recursos_centrais/code_interpreter.md)**: Ambiente sandbox isolado para execução de código Python em tempo de inferência, manipulação de arquivos de entrada e gráficos/planilhas de saída.

### 3. `multimodal_e_especializados/`
- **[`visao_e_processamento_de_imagens.md`](./multimodal_e_especializados/visao_e_processamento_de_imagens.md)**: Análise visual com GPT-4o, URLs remotas, base64, parâmetros de detalhe `low`/`high`/`auto` e fórmulas de cálculo de tokens.
- **[`audio_whisper_e_tts.md`](./multimodal_e_especializados/audio_whisper_e_tts.md)**: Transcrição e tradução com Whisper-1 (timestamps de palavra/segmento) e síntese de voz natural com TTS-1 e TTS-1-HD.
- **[`geracao_de_imagens_dalle.md`](./multimodal_e_especializados/geracao_de_imagens_dalle.md)**: Criação de imagens de alta fidelidade com DALL-E 3 (`standard`/`hd`, estilos `vivid`/`natural`) e edição/variação com DALL-E 2.
- **[`embeddings_e_moderacao.md`](./multimodal_e_especializados/embeddings_e_moderacao.md)**: Geração de vetores semânticos com `text-embedding-3-small/large` (redução de dimensões) e verificação de segurança com a Text Moderation API.

### 4. `operacao_e_escala/`
- **[`batch_api.md`](./operacao_e_escala/batch_api.md)**: Processamento de requisições em lote com 50% de desconto em tokens, ciclo de vida dos jobs em arquivos JSONL e SLAs de 24 horas.
- **[`fine_tuning_api.md`](./operacao_e_escala/fine_tuning_api.md)**: Ajuste fino supervisionado (SFT) e otimização por preferência direta (DPO) para gpt-4o e gpt-4o-mini, validação e hiperparâmetros.
- **[`files_e_storage_management.md`](./operacao_e_escala/files_e_storage_management.md)**: Endpoints `/v1/files`, propósitos (`assistants`, `batch`, `fine-tune`), cotas de armazenamento e scripts de limpeza.
- **[`admin_usage_e_projects.md`](./operacao_e_escala/admin_usage_e_projects.md)**: Governança corporativa, gestão programática de projetos, rate limits, alocação de créditos e auditoria de logs.

### 5. `api_referencia/`
- **[`endpoints_rest_reference.md`](./api_referencia/endpoints_rest_reference.md)**: Catálogo exaustivo com todos os endpoints HTTP REST da OpenAI API, métodos, cabeçalhos e esquemas de payload.
- **[`parametros_requisicao_e_respostas.md`](./api_referencia/parametros_requisicao_e_respostas.md)**: Dicionário detalhado de todos os hiperparâmetros de amostragem (`temperature`, `top_p`, `reasoning_effort`, `stream_options`, `logprobs`, `seed`) e anatomia de respostas.
- **[`erros_rate_limits_e_retries.md`](./api_referencia/erros_rate_limits_e_retries.md)**: Guia completo de códigos de erro HTTP, cabeçalhos de taxa de consumo (RPM/TPM), tiers organizacionais e estratégias de retry com backoff.
