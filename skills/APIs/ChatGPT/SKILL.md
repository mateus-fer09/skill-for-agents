---
name: openai-api-chatgpt
description: Base de conhecimento completa e oficial da OpenAI API e do ecossistema ChatGPT (Responses API, Agents SDK, Modelos GPT-5/o3/GPT-4.1, Ferramentas Hospedadas, MCP, Realtime WebRTC/WebSocket, Áudio, Visão, Vídeo Sora, Fine-Tuning, Evals, Governança RBAC e Referência REST).
---

# Skill Oficial — OpenAI API & Ecossistema ChatGPT

Bem-vindo à Skill oficial e modular da **OpenAI API e Plataforma ChatGPT**. Esta Skill foi projetada para atuar como o cérebro técnico e manual de referência definitivo para agentes de IA, desenvolvedores e arquitetos que constroem sobre a infraestrutura da OpenAI.

---

## 1. Identidade e Escopo da Skill

- **Tecnologia**: OpenAI API, OpenAI Agents SDK, ChatGPT Apps SDK, Responses API e Plataforma de Desenvolvedores da OpenAI.
- **Documentação de Origem Oficial**: `https://developers.openai.com/api/docs` (incluindo `llms.txt`, guias conceituais e endpoints de referência).
- **Escopo Coberto**:
  - **Fundamentos**: Arquitetura REST, autenticação (API Keys, Admin Keys), Workload Identity Federation, mTLS, SDKs (Python, TypeScript/Node.js, cURL, CLI), Rate Limits e Otimização de Custos/Latência.
  - **Modelos**: Família GPT-5 (GPT-5.6 Sol, GPT-5.5, GPT-5.4, GPT-5.3-Codex, GPT-5-mini), Modelos de Raciocínio (o1, o3, o3-mini, reasoning_effort), Família GPT-4.1 e tabelas comparativas de preços e janelas de contexto.
  - **Responses API**: Ciclo de vida de requisições, Structured Outputs (JSON Schema estrito, Pydantic, Zod), Streaming SSE, Responses WebSocket Mode, Gerenciamento de Estado de Conversa, Continuações de Turno, Compactação de Contexto no Servidor e Prompt Caching.
  - **Ferramentas & MCP**: Function Calling, Programmatic Tool Calling, Ferramentas Hospedadas (Web Search, File Search, Code Interpreter), Computer Use, Apply Patch, Local Shell, Conexão a Servidores MCP Remotos e Secure MCP Tunnels.
  - **OpenAI Agents SDK**: Definição de Agentes (instruções, modelos, ferramentas, contexto local), Orquestração Multi-Agente, Handoffs declarativos, Agentes como Ferramentas, Guardrails de entrada/saída, Aprovação Humana (Human-in-the-Loop), Sandboxes, Agent Builder e ChatKit UI.
  - **Multimídia & Tempo Real**: Text-to-Speech (TTS), Transcrição e Tradução com Whisper, Gestão de Vozes Customizadas, Visão Computacional, Geração/Edição de Imagens (GPT-image-1, DALL-E 3), Geração de Vídeo com Sora (`/v1/videos`), Realtime API via WebRTC (browser/mobile), Realtime API via WebSockets (server-to-server) e Realtime SIP para telefonia PSTN/VoIP.
  - **ChatGPT & Plugins**: ChatGPT Plugins & Apps SDK, Servidores MCP para ChatGPT, Workspace Agents API corporativa e GPT Actions com OpenAPI 3.0.
  - **Fine-Tuning & Evals**: Supervised Fine-Tuning (SFT), Reinforcement Fine-Tuning (RFT), Direct Preference Optimization (DPO), OpenAI Evals, Graders (model_graded, python_graded), Trace Grading, Moderations API e Red Teaming.
  - **Administração & Infraestrutura**: Gestão de Organizações, Projetos, Usuários, Grupos, Service Accounts (RBAC), Audit Logs, Conformidade (Zero Data Retention), Workload Identity Federation (AWS, GCP, Azure, GitHub Actions, Kubernetes, SPIFFE) e Provedor Oficial Terraform da OpenAI.
  - **Referência Completa de Endpoints REST**: Especificação técnica dos 210+ métodos, parâmetros, cabeçalhos e respostas de `/v1/responses`, `/v1/audio/*`, `/v1/images/*`, `/v1/videos/*`, `/v1/files`, `/v1/uploads`, `/v1/vector_stores/*`, `/v1/fine_tuning/*`, `/v1/batches/*`, `/v1/evals/*`, `/v1/containers/*`, `/v1/realtime/*`, `/v1/webhooks` e `/v1/organization/*`.
  - **Exemplos Executáveis**: Códigos completos ponta a ponta prontos para execução em Python e TypeScript.

---

## 2. Instruções de Navegação para Agentes de IA

Quando você receber uma consulta, solicitação de código ou dúvida técnica sobre a OpenAI API ou ChatGPT:

1. **Consulte Primeiro o Roteador Central**: Leia [`index_master.md`](index_master.md) para localizar o arquivo específico do tema.
2. **Localize o Arquivo Especializado**: Abra o documento correspondente na pasta temático-funcional.
3. **Consulte a Referência de Endpoints quando Necessário**: Para detalhes minuciosos de parâmetros HTTP, schemas ou tipos de retorno, consulte a pasta [`referencia_api/`](referencia_api/).
4. **Siga os Padrões Oficiais**:
   - Priorize a **Responses API** (`client.responses.create`) em vez do método legado de Chat Completions.
   - Utilize tipagem estrita com **Pydantic** (Python) ou **Zod** (TypeScript) para Structured Outputs.
   - Respeite o parâmetro `reasoning_effort` (`"low"`, `"medium"`, `"high"`) ao trabalhar com modelos da família `o-series` (`o1`, `o3`, `o3-mini`).

---

## 3. Regras Fundamentais para Agentes

> [!IMPORTANT]
> 1. **Prioridade Absoluta da Documentação Oficial**: Baseie todas as suas respostas exclusivamente nos métodos, parâmetros, tipos e comportamentos documentados nesta Skill.
> 2. **Proibição de Alucinação de Parâmetros**: Nunca invente propriedades que não constem na especificação oficial. Caso um parâmetro não esteja documentado, declare expressamente sua ausência.
> 3. **Preservação de Snippets e Sintaxe**: Mantenha os blocos de código completos, com imports corretos e tipagem preservada.
> 4. **Diferenciação de Contexto**: Não confunda ferramentas nativas da Responses API (`web_search`, `file_search`, `code_interpreter`, `computer`, `apply_patch`, `local_shell`) com funções definidas pelo cliente (`function_call`).

---

## 4. Fluxo de Execução Recomendado

```
[ Usuário faz uma pergunta técnica ]
              |
              v
1. [ Agente consulta index_master.md ] ---> Identifica pasta e arquivo temático
              |
              v
2. [ Agente lê o arquivo especializado ] ---> Obtém regras, código e detalhes conceituais
              |
              v
3. [ Agente consulta referencia_api/ se necessário ] ---> Confere tipos e parâmetros REST
              |
              v
4. [ Agente responde com máxima precisão e código oficial testado ]
```

---

## 5. Mapa Rápido da Estrutura

- **Roteador Principal**: [`index_master.md`](index_master.md)
- **Manifesto de Fontes Oficiais**: [`sources_manifest.md`](sources_manifest.md)
- **Relatório de Auditoria de Cobertura**: [`coverage_report.md`](coverage_report.md)
- **Fundamentos & SDKs**: [`fundamentos/`](fundamentos/)
- **Modelos & Raciocínio**: [`modelos/`](modelos/)
- **Responses API**: [`responses_api/`](responses_api/)
- **Ferramentas & MCP**: [`ferramentas_e_mcp/`](ferramentas_e_mcp/)
- **Agents SDK**: [`agents_sdk/`](agents_sdk/)
- **Multimídia, Realtime & Sora**: [`multimidia_e_tempo_real/`](multimidia_e_tempo_real/)
- **ChatGPT & Plugins**: [`chatgpt_e_plugins/`](chatgpt_e_plugins/)
- **Fine-Tuning & Evals**: [`fine_tuning_e_evals/`](fine_tuning_e_evals/)
- **Administração, RBAC & Terraform**: [`administracao_e_infra/`](administracao_e_infra/)
- **Referência Técnica de Endpoints**: [`referencia_api/`](referencia_api/)
- **Exemplos Completos de Código**: [`exemplos/`](exemplos/)
