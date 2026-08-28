---
name: openai-api
description: Base de conhecimento técnica exaustiva e guia de engenharia para a OpenAI API (@openai SDK v4+ no TypeScript/Node.js, openai >=1.0 no Python e REST API). Cobre Responses API, Chat Completions, Structured Outputs estritos com Pydantic/Zod, Function Calling, Realtime API (WebSockets e WebRTC), Assistants API v2 (Threads, Vector Stores, Code Interpreter, File Search), Processamento Multimodal (GPT-4o Vision, Whisper STT, TTS-1/HD, DALL-E 3), Embeddings, Moderação, Batch API com 50% de desconto, Fine-Tuning supervisionado/DPO, Files Storage, Admin APIs de Governança e catálogo completo de endpoints REST com tratamento de erros, rate limits e retries resilientes.
---

# OpenAI API AI Skill Guide

## 1. Identidade e Propósito da Skill

Esta Skill constitui a representação técnica integral, profunda e modular da documentação oficial da **OpenAI API** (`openai` v1.x em Python, `openai` v4.x em TypeScript/Node.js e interface HTTP REST em `https://api.openai.com/v1`). Foi projetada como base de conhecimento autocontida para agentes de IA atuarem em tarefas de engenharia de software e inteligência artificial envolvendo:

- **Arquitetura de Geração Textual e Raciocínio:** Implementação de inferência com a família GPT-4o, GPT-4o-mini e modelos de raciocínio avançado (`o1`, `o3-mini`, `o1-mini`), dominando parâmetros de esforço cognitivo (`reasoning_effort`), orçamentos de tokens e streaming com Server-Sent Events (SSE).
- **Garantia Estrutural de Dados:** Utilização de **Structured Outputs** (`type: "json_schema"`, `strict: true`) com Pydantic no Python e Zod no TypeScript para garantir 100% de adesão a esquemas estritos sem alucinações de campos ou tipos.
- **Chamada de Ferramentas e Agentes Autônomos:** Definição e orquestração de **Function Calling** paralelo, esquemas de ferramentas (`tools`), modos forçados (`tool_choice`) e loops de execução agente-ambiente.
- **Voz Bidirecional e Baixa Latência:** Orquestração da **Realtime API** via WebSockets (`wss://api.openai.com/v1/realtime`) e WebRTC no cliente, gerenciando áudio streaming PCM16, detecção de atividade de voz (VAD/server_vad), interrupções naturais (*turn-taking*) e execução de ferramentas em tempo real.
- **Assistentes de Estado e RAG Integrado:** Arquitetura com **Assistants API v2**, manipulando *Threads*, *Messages*, *Runs*, *Run Steps*, buscas semânticas automáticas com **Vector Stores & File Search** (chunking estático e auto) e sandbox de execução de código Python (**Code Interpreter**).
- **Processamento Multimodal Avançado:** Análise e extração visual de dados com GPT-4o Vision (parâmetros de detalhe `low`/`high`/`auto` e cálculo de tokens em tiles), transcrição e tradução com **Whisper**, síntese de fala com **TTS-1/HD** e geração de imagens via **DALL-E 3**.
- **Otimização Operacional e Escala:** Redução de custos em 50% com a **Batch API** assíncrona (/v1/batches), personalização de pesos com **Fine-Tuning API** (SFT e DPO), gestão de ciclo de vida de arquivos (`/v1/files`) e governança corporativa via Admin APIs (projetos, cotas, auditoria de logs e chaves restritas).
- **Resiliência e Engenharia de Produção:** Tratamento determinístico de códigos de erro HTTP (400, 401, 403, 404, 429, 500, 503), inspeção de headers de rate limit (`x-ratelimit-*`), algoritmos de *Exponential Backoff com Full Jitter* e políticas de retry idempotentes.

---

## 2. Instruções de Operação para o Agente

Ao receber qualquer solicitação relacionada à OpenAI API, siga rigorosamente o fluxo operacional abaixo:

```text
[Solicitação do Desenvolvedor]
         │
         ▼
[1. Consultar index_master.md]
   ├─ Identificar a intenção técnica na Tabela de Roteamento Semântico.
   └─ Localizar os arquivos modulares pertinentes no Mapa de Contexto.
         │
         ▼
[2. Carregamento Seletivo de Módulos]
   ├─ Ler EXCLUSIVAMENTE os arquivos markdown necessários para a tarefa.
   └─ Preservar a janela de contexto evitando leituras redundantes.
         │
         ▼
[3. Cruzamento com Especificações Técnicas]
   ├─ Consultar `api_referencia/parametros_requisicao_e_respostas.md` para parâmetros e payloads.
   └─ Consultar `api_referencia/endpoints_rest_reference.md` para rotas REST e payloads JSON.
         │
         ▼
[4. Geração de Código e Soluções]
   ├─ Respeitar rigorosamente as 8 Regras Fundamentais da OpenAI API.
   ├─ Utilizar sintaxe moderna do SDK Python (openai >= 1.50) e TypeScript (openai >= 4.60).
   └─ Incluir validações de erro, tipagem estrita (Pydantic / Zod) e tratamento assíncrono.
```

---

## 3. As 8 Regras Fundamentais da OpenAI API

1. **Sintaxe Obrigatória dos SDKs Modernos (v1+ Python / v4+ Node.js):**
   - Em Python: Nunca utilize a sintaxe legada `openai.ChatCompletion.create(...)`. Use sempre `client = OpenAI()` seguido de `client.chat.completions.create(...)` ou `client.responses.create(...)`.
   - Em Node.js: Nunca instancie via `Configuration`. Use sempre `import OpenAI from 'openai'; const client = new OpenAI();`.

2. **Structured Outputs Estritos (`strict: true`):**
   - Ao exigir saídas estruturadas em JSON, defina `response_format={"type": "json_schema", "json_schema": {"name": "...", "strict": True, "schema": {...}}}` ou utilize os parsers nativos `client.beta.chat.completions.parse()` com modelos Pydantic (Python) ou schemas Zod via `zodResponseFormat` (TypeScript).
   - O schema DEVE conter `additionalProperties: false` em todos os objetos e todos os campos devem constar no array `required`.

3. **Orçamento e Nomenclatura de Tokens nos Modelos de Raciocínio (`o1`, `o3-mini`):**
   - Para modelos da série de raciocínio (`o1`, `o1-mini`, `o3-mini`), o parâmetro `max_tokens` está depreciado; utilize SEMPRE `max_completion_tokens`.
   - Lembre-se de que `completion_tokens` inclui tanto os tokens visíveis gerados quanto os `reasoning_tokens` (tokens de pensamento interno). Ajuste o teto de tokens para acomodar o raciocínio.
   - Modelos de raciocínio suportam `developer` message ou `user` message (não utilize instruções `system` em modelos que exigem `developer`).

4. **Gerenciamento de Ferramentas (Function Calling) com Modos Estritos:**
   - Em `tools`, defina funções com `parameters` em formato JSON Schema válido contendo `"strict": true`, `additionalProperties: false` e todos os campos em `required`.
   - Trate sempre o ciclo completo: requisição inicial -> inspeção de `finish_reason == "tool_calls"` -> execução do código local -> envio de mensagem com `role: "tool"`, `tool_call_id` correspondente -> obtenção da resposta final consolidada.

5. **Streaming Robusto com Server-Sent Events (SSE):**
   - Ao habilitar `stream=True` / `stream: true`, faça a iteração assíncrona segura e configure `stream_options={"include_usage": True}` para capturar a contagem exata de tokens no chunk final sem requisições adicionais.

6. **Assistants API v2 e Isolamento de Estado:**
   - A Assistants API v2 utiliza *Vector Stores* dedicadas para RAG (`tool_resources.file_search.vector_store_ids`).
   - Sempre consulte o status de um *Run* (`client.beta.threads.runs.retrieve`) ou utilize o streaming nativo (`client.beta.threads.runs.stream`) para evitar loops infinitos de polling bloqueante.

7. **Batch API para Processamentos em Lote Assíncronos:**
   - Para volumes massivos sem exigência de resposta em tempo real (ex: classificação de catálogos, síntese de documentos em lote), utilize a **Batch API** (`/v1/batches`) com arquivos JSONL para obter **50% de desconto imediato em tokens de entrada e saída** e cotas separadas de rate limit.

8. **Resiliência contra Rate Limits (429) e Erros Transitórios (500/503):**
   - Configure clientes com retries automáticos (`max_retries=3`), capture exceções granulares (`RateLimitError`, `APIConnectionError`, `InternalServerError`) e inspecione os headers `x-ratelimit-reset-requests` e `x-ratelimit-reset-tokens`.

---

## 4. Mapa Rápido da Estrutura Modular

- [`index_master.md`](./index_master.md) — **Roteador Central de Conhecimento e Mapa de Contexto**.
- [`sources_manifest.md`](./sources_manifest.md) — Proveniência documental e rotas processadas de `developers.openai.com`.
- [`coverage_report.md`](./coverage_report.md) — Relatório de auditoria e cobertura integral de rotas.
- [`primeiros_passos/`](./primeiros_passos/) — Instalação, autenticação de projetos, quickstarts de Chat/Responses e catálogo completo de modelos.
- [`recursos_centrais/`](./recursos_centrais/) — Structured Outputs, Function Calling, Realtime API (WebSockets/WebRTC), Assistants API v2, File Search / Vector Stores e Code Interpreter.
- [`multimodal_e_especializados/`](./multimodal_e_especializados/) — Visão computacional com GPT-4o, Áudio Whisper e TTS, geração de imagens DALL-E 3 e Embeddings com Moderação.
- [`operacao_e_escala/`](./operacao_e_escala/) — Batch API (50% desconto), Fine-Tuning supervisionado/DPO, gestão de arquivos e Admin APIs de projetos e uso.
- [`api_referencia/`](./api_referencia/) — Catálogo exaustivo de todos os endpoints REST, dicionário aprofundado de parâmetros e guia de erros com rate limits e retries.
