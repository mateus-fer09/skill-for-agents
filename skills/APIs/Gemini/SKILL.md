---
name: gemini-api
description: Base de conhecimento exaustiva e guia de engenharia técnica para a Google Gemini API (@google/genai SDK v1 / google-genai Python SDK / REST API v1beta). Cobre catálogo de modelos (Gemini 2.5 Flash, 2.0 Flash, 2.0 Flash Thinking, 1.5 Pro), multimodalidade nativa (visão, áudio, vídeo, PDF), File API, Structured Outputs com JSON Schema/Pydantic, Function Calling e Tool Use avançado, Sandbox de Code Execution, Grounding com Google Search, Context Caching, Embeddings (text-embedding-004), Batch API assíncrono, Model Tuning, Live API bidirecional WebRTC/WebSocket de baixa latência, Deep Research / Agent Environments, referência completa de endpoints REST, parâmetros de geração, segurança SafetySettings e tratamento de erros/rate limits.
---

# Google Gemini API AI Skill Guide

## 1. Identidade e Propósito da Skill

Esta Skill constitui a representação técnica integral, modular e exaustiva da documentação oficial da **Google Gemini API** (acessível via `@google/genai` no ecossistema Node.js / TypeScript, `google-genai` no ecossistema Python e endpoints REST `v1beta` na Google AI Studio / Vertex AI).

Projetada como uma base de conhecimento autocontida para agentes de IA e engenheiros de software, esta Skill capacita o desenvolvimento de sistemas avançados que demandam:

- **Geração de Conteúdo e Raciocínio Multimodal:** Integração nativa e unificada de texto, imagens de alta resolução, áudios (com timestamps e transcrição), vídeos longos e documentos complexos (PDFs com diagramas e OCR).
- **Saídas Estruturadas Garantidas (*Structured Outputs*):** Forçamento estrito de schemas JSON via `response_mime_type="application/json"` e `response_schema` com Pydantic (Python) ou Schemas declarativos em TypeScript (`Type.OBJECT`).
- **Chamada de Ferramentas (*Function Calling / Tool Use*):** Definição de funções e ferramentas declarativas, modos de controle de ferramenta (`ToolConfig` com modos `AUTO`, `ANY`, `NONE`), execução paralela de chamadas e loops autônomos de agentes.
- **Execução Segura de Código (*Code Execution*):** Ativação de interpretador Python sandbox nativo do Gemini para resolução de cálculos matemáticos, análise de dados e geração de gráficos.
- **Aterramento em Tempo Real (*Grounding with Google Search*):** Enriquecimento de respostas com resultados de busca atualizados, metadados de ancoragem (*Grounding Metadata*) e citação de fontes com URL.
- **Otimização de Custos e Latência:** Aplicação de **Context Caching** explícito para grandes bases de conhecimento (>32k tokens), **Batch API** para processamento assíncrono em larga escala com 50% de desconto e seleção criteriosa de modelos (*Flash* vs *Pro* vs *Thinking*).
- **Comunicação Bidirecional em Tempo Real (*Live API*):** Sessões de baixa latência em áudio e vídeo full-duplex sobre WebSockets/WebRTC com capacidade de interrupção e ferramentas interativas.
- **Embeddings e Busca Semântica:** Vetorização de alta precisão com `text-embedding-004`, suporte a redução de dimensionalidade (`output_dimensionality`) e tipos de tarefas semânticas (`TaskType`).
- **Engenharia de Prompting e Resiliência:** Configuração de parâmetros de amostragem (`temperature`, `top_p`, `top_k`), limites de tokens, diretrizes de segurança (*SafetySettings*) e mitigação de erros (HTTP 429 *Resource Exhausted*, exponential backoff).

---

## 2. Instruções de Operação para o Agente

Ao atuar em qualquer tarefa relacionada à Google Gemini API, siga o fluxo operacional abaixo:

```text
[Solicitação do Desenvolvedor / Tarefa]
                 │
                 ▼
[1. Consulta ao index_master.md]
  ├─ Identificar a intenção primária na Tabela de Roteamento Semântico.
  └─ Localizar o(s) módulo(s) técnico(s) de destino no Mapa de Contexto.
                 │
                 ▼
[2. Leitura Seletiva do Módulo Específico]
  ├─ Carregar apenas os arquivos estritamente necessários para a tarefa.
  └─ Consultar api_referencia/ se parâmetros, types ou erros precisarem de detalhamento.
                 │
                 ▼
[3. Aplicação das 8 Regras Fundamentais da Gemini API]
  ├─ Validar uso exclusivo dos SDKs modernos (google-genai / @google/genai).
  ├─ Garantir tipagem segura (types.GenerateContentConfig / GenerateContentConfig).
  └─ Configurar tratamento de exceções, quotas e rate limits.
                 │
                 ▼
[4. Geração de Código / Solução Técnica Completa]
  ├─ Fornecer código integral, tipado e executável (Python, TypeScript e/ou cURL).
  └─ Preservar boas práticas de segurança (chaves via variáveis de ambiente).
```

---

## 3. As 8 Regras Fundamentais da Google Gemini API

1. **Uso Exclusivo dos Novos SDKs Unificados (`google-genai` / `@google/genai`):**
   - **Python:** Use SEMPRE `from google import genai` e `from google.genai import types`. NUNCA use a biblioteca legada `google.generativeai` (`google-generativeai`). O cliente é instanciado via `client = genai.Client()`.
   - **Node.js / TypeScript:** Use SEMPRE `@google/genai` via `import { GoogleGenAI } from '@google/genai';`. O cliente é instanciado via `const ai = new GoogleGenAI({});`. NUNCA use `@google/generative-ai` legado.

2. **Gestão Segura de Credenciais e Variáveis de Ambiente:**
   - A chave de API deve ser lida automaticamente da variável de ambiente `GEMINI_API_KEY` (ou `GOOGLE_API_KEY`). NUNCA faça hardcode de chaves em código-fonte.
   - Para Vertex AI, configure `vertexai=True`, `project="meu-projeto"` e `location="us-central1"` na inicialização do cliente `Client()`.

3. **Centralização de Configurações em `GenerateContentConfig`:**
   - Todos os parâmetros de geração (`temperature`, `top_p`, `top_k`, `max_output_tokens`, `system_instruction`, `safety_settings`, `tools`, `response_schema`, `response_mime_type`) devem ser passados dentro do objeto estruturado `types.GenerateContentConfig` (Python) ou `config` (TypeScript).

4. **Uso da Files API para Arquivos Pesados (>20MB ou Vídeos):**
   - Imagens pequenas podem ser enviadas inline em base64 (`types.Part.from_bytes`), mas arquivos grandes, PDFs densos, áudios extensos e vídeos DEVEM ser enviados via `client.files.upload()` para evitar sobrecarga de payload e respeitar o limite de 20MB inline da API REST.
   - Sempre aguarde o estado `ACTIVE` antes de chamar `generate_content` quando processar vídeos.

5. **Structured Outputs com Schema Nativo e Rigoroso:**
   - Ao solicitar saídas JSON, defina `response_mime_type="application/json"` e passe uma classe Pydantic (Python) ou schema em objeto declarativo (TypeScript) no `response_schema`. NUNCA dependa apenas de instruções textuais no prompt para obter JSON válido.

6. **Gerenciamento de Ferramentas (Function Calling) com `ToolConfig` Explícito:**
   - Forneça declarações de funções com nomes claros, docstrings/descrições precisas e parâmetros com tipos explícitos.
   - Controle o modo de execução usando `ToolConfig` com `FunctionCallingConfigMode` (`AUTO`, `ANY`, `NONE`) de acordo com o objetivo (forçar chamada de ferramenta vs decisão autônoma).

7. **Aproveitamento de Context Caching para Eficiência e Custo:**
   - Para contextos repetitivos ou documentos estáticos com mais de 32.768 tokens (ex: manuais, bases de código, livros), crie um cache explícito com `client.cached_contents.create()` e defina um `ttl` (Time to Live). O custo de entrada cai substancialmente.

8. **Resiliência contra HTTP 429 (`RESOURCE_EXHAUSTED`):**
   - Requisições devem ser envolvidas em lógica de retentativa com recuo exponencial (*exponential backoff com jitter*). Em produção com tráfego elevado, utilize filas e respeite os limites de RPM (Requisições Por Minuto) e TPM (Tokens Por Minuto) do seu plano (Tier Gratuito vs Pay-as-you-go).

---

## 4. Mapa Rápido da Estrutura Modular

- [`index_master.md`](./index_master.md) ➔ **Roteador Central de Conhecimento e Mapa de Contexto Geral**.
- [`sources_manifest.md`](./sources_manifest.md) ➔ **Proveniência Documental e Registro de Rotas Oficiais**.
- [`coverage_report.md`](./coverage_report.md) ➔ **Auditoria de Cobertura Documental e Declaração de Cobertura Total**.
- [`primeiros_passos/`](./primeiros_passos/) ➔ Instalação dos novos SDKs, autenticação (AI Studio / Vertex AI), Quickstart (texto, streaming, contagem de tokens) e Catálogo de Modelos (Gemini 2.5 Flash, 2.0 Flash, 1.5 Pro, Flash Thinking).
- [`recursos_centrais/`](./recursos_centrais/) ➔ Multimodalidade nativa (visão, áudio, vídeo, PDF), File API, Structured Outputs (Pydantic/JSON Schema), Function Calling & Tool Use, Code Execution Sandbox e Grounding com Google Search.
- [`recursos_avancados/`](./recursos_avancados/) ➔ Context Caching, Embeddings (`text-embedding-004`), Batch API assíncrono, Model Tuning, Live API bidirecional WebRTC/WebSocket e Ambientes para Agentes / Deep Research.
- [`api_referencia/`](./api_referencia/) ➔ Referência completa dos endpoints REST `v1beta`, tabela exaustiva de Parâmetros de Geração e Segurança (SafetySettings), e Guia de Erros HTTP, Rate Limits e Troubleshooting.
