# 🧠 Skill for Agents — Hub de Skills para Agentes de IA

> **O seu hub definitivo de skills e diretrizes técnicas para Agentes de IA.** Tenha contexto preciso sobre bibliotecas, APIs e arquitetura no seu agente, eliminando alucinações e respostas imprecisas.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

---

## 🎯 O que é o Skill for Agents?

O **Skill for Agents** é um **Hub de Skills especializado**, criado para fornecer conhecimento técnico aprofundado, documentações estruturadas, regras de arquitetura e melhores práticas diretamente para os seus agentes de IA e assistentes de código.

### 🛑 O Problema: Alucinação e Falta de Contexto
Ao programar com LLMs e agentes autônomos (Google Antigravity, Claude Code, Cursor, Gemini CLI, Windsurf, Copilot, etc.), é comum que os modelos:
- **Alucinem métodos ou parâmetros** inexistentes ou descontinuados.
- Usem padrões legados ou sintaxes incompatíveis com versões recentes de bibliotecas.
- Não sigam as melhores práticas de segurança, tipagem e organização arquitetural do seu ecossistema.

### 💡 A Solução: Contexto Preciso via Skills
Com as skills deste hub, o seu agente de IA recebe documentação de referência autoritativa, contratos de API reais, exemplos práticos e checklists defensivos diretamente no diretório do projeto. O resultado são **respostas precisas, código confiável e zero alucinações com informações falsas**.

---

## ⚡ Por que as Skills deste Hub são Diferentes? (Arquitetura Index-Driven)

Diferente das **skills tradicionais** que concentram toda a documentação em um único arquivo gigantesco (monolítico), as skills deste hub utilizam uma **Arquitetura Modular com Roteamento Semântico**:

```text
[Solicitação do Desenvolvedor]
           │
           ▼
 [1. SKILL.md (Entrada)] ───► Regras críticas e diretrizes imediatas
           │
           ▼
 [2. index_master.md]    ───► Tabela de Roteamento Semântico por Intenção
           │
           ▼
 [3. Módulo Específico]  ───► Leitura EXCLUSIVA do arquivo relevante (ex: structured_outputs.md)
```

### 🏆 As Vantagens dessa Abordagem:

1. **💰 Economia Drástica de Tokens:** O agente não precisa despejar dezenas de milhares de tokens no contexto toda vez que for chamado. Ele consulta o `index_master.md`, localiza o arquivo exato e consome apenas uma fração minúscula do contexto.
2. **🎯 Leitura Just-in-Time (On-Demand):** O agente lê **estritamente o que é necessário** para responder à dúvida ou implementar o recurso solicitado.
3. **🧠 Foco e Retenção Cognitiva:** Reduz o efeito *"lost in the middle"* e a degradação de atenção da LLM, mantendo a janela de contexto limpa para o código do projeto, ferramentas e raciocínio.
4. **📚 Cobertura Exaustiva sem Penalidade:** Permite cobrir 100% de ecossistemas complexos (como Electron em 300+ arquivos ou BlockNote em 77 arquivos) com profundidade de produção sem estourar limites de contexto.

---

## ⚡ Uso Rápido em Qualquer Projeto

Você não precisa navegar pelo GitHub ou copiar arquivos manualmente. No terminal do seu projeto, execute:

### 1. Modo Interativo (Menu Visual)

```bash
npx skill-agents
```
*(ou diretamente via repositório GitHub)*:
```bash
npx github:mateus-fer09/skill-for-agents
```

O assistente interativo guiará você passo a passo:
1. **Escolher o diretório de destino** (`.agent/skills/`, `.gemini/skills/`, `.claude/skills/`, `skills/` ou personalizado).
2. **Escolher o modo de seleção**:
   - 📦 **Importar todas as skills** de todas as categorias.
   - 📁 **Escolher por Categoria** (ex: `APIs`, `Bibliotecas React`, `Electron`, `TradingView`, etc.).
   - 🎯 **Selecionar Skills Individuais** da lista com suporte a busca.
3. **Escolher o formato de organização** (direto por pasta da skill ou mantendo as subpastas de categorias).

---

## 🚀 Uso Direto com Flags (Automação / CI)

Você também pode automatizar a instalação informando os parâmetros diretamente na linha de comando:

```bash
# Importar todas as skills para o diretório padrão (.agent/skills/)
npx skill-agents --all

# Importar todas as skills de uma categoria específica
npx skill-agents --category APIs
npx skill-agents --category Electron
npx skill-agents --category "Bibliotecas React"

# Importar múltiplas categorias simultaneamente
npx skill-agents --category "APIs,Bibliotecas React,TradingView,Electron"

# Importar skills individuais para uma pasta customizada
npx skill-agents --skill chatgpt,claude,blocknote,electron --dest ./minhas-skills

# Manter a organização em pastas de categorias no destino
npx skill-agents --all --keep-categories

# Listar o catálogo completo de categorias e skills disponíveis
npx skill-agents --list
```

---

## 📋 Opções Disponíveis

| Flag | Atalho | Descrição | Padrão |
|---|---|---|---|
| `--all` | `-a` | Importa todas as skills disponíveis no hub | `false` |
| `--category <nomes>` | `-c` | Importa todas as skills de categorias específicas (separadas por vírgula) | - |
| `--skill <nomes>` | `-s` | Importa skills específicas por ID ou nome (separadas por vírgula) | - |
| `--dest <caminho>` | `-d` | Define o diretório de destino no projeto | `.agent/skills` |
| `--keep-categories` | - | Mantém a estrutura de pastas das categorias no destino | `false` |
| `--list` | `-l` | Lista todas as categorias, skills e contagem de arquivos | - |
| `--no-overwrite` | - | Não sobrescreve arquivos já existentes | `false` |
| `--help` | `-h` | Exibe a mensagem de ajuda e uso | - |
| `--version` | `-v` | Exibe a versão instalada do pacote | - |

---

## 📚 Catálogo Completo de Categorias e Skills

Atualmente o hub conta com **10 skills completas** e mais de **730 arquivos** de referência técnica altamente estruturados:

```text
skills/
├── APIs/
│   ├── App Max/                             # Appmax API & Pagamentos (93 arquivos)
│   ├── ChatGPT/                             # OpenAI API & ChatGPT (55 arquivos)
│   ├── Claude/                              # Anthropic Claude Platform (54 arquivos)
│   └── Gemini/                              # Google Gemini API (22 arquivos)
├── Bibliotecas React/
│   ├── BlockNote/                           # BlockNote Editor WYSIWYG (77 arquivos)
│   └── skill_react_flow/                    # React Flow v12 (50 arquivos)
├── Electron/                                # Electron Desktop Completo (302 arquivos)
├── TradingView/
│   └── skill_pine_script/                   # Pine Script v5 / v6 (35 arquivos)
├── Banco de Dados/
│   └── better-sqlite3-docs/better-sqlite3/  # Better SQLite3 (11 arquivos)
└── skill_boas_praticas_arquitetura_software/ # Arquitetura de Software (31 arquivos)
```

---

### 🔌 1. APIs & Modelos de IA
- **Appmax API (`app-max`)** — `93 arquivos`: Base de conhecimento oficial e exaustiva para pagamentos (Cartão de Crédito com tokenização PCI, Pix QR Code/EMV, Boleto Bancário, Apple Pay), criação de pedidos, clientes, catálogo de produtos, assinaturas recorrentes, split de pagamentos para marketplaces com KYC Facematch, webhooks e servidor MCP para agentes.
- **OpenAI / ChatGPT API (`chatgpt`)** — `55 arquivos`: Cobertura oficial da OpenAI API e ecossistema ChatGPT (Responses API, Agents SDK, modelos GPT-5, o3, GPT-4.1 e GPT-4o, Assistants API v2 com Vector Stores/Code Interpreter, Realtime API de voz/WebRTC, Structured Outputs com Pydantic/Zod, Function Calling, Batch API e Fine-Tuning).
- **Claude Platform API (`claude`)** — `54 arquivos`: Guia oficial da Anthropic Claude Platform (Messages API, Batches API, Prompt Caching, Tool Calling, Managed Agents, modelos Claude 3.7 Sonnet com Extended Thinking / Hybrid Reasoning, Claude 3.5 Sonnet/Haiku, SDKs em TypeScript/Python/Go/Java/C#/PHP, Bedrock, Vertex AI e compliance).
- **Google Gemini API (`gemini`)** — `22 arquivos`: Integração com SDK `@google/genai` v1 e Python, processamento multimodal de alta fidelidade (áudio, vídeo, imagem), Context Caching, Agent Environment, Deep Research, Batch API, Grounding com Google Search e Structured Outputs com JSON Schema.

---

### 🎨 2. Bibliotecas Front-End & Editores
- **BlockNote Editor (`blocknote`)** — `77 arquivos`: Editor de texto rico baseado em blocos (estilo Notion) para React e TypeScript (ProseMirror + Yjs), custom schemas (`createReactBlockSpec`, `createReactInlineContentSpec`), componentes de UI (FormattingToolbar, SideMenu, Slash Menu), colaboração em tempo real, BlockNote AI e exportação (Markdown, HTML, DOCX, PDF).
- **React Flow (`react-flow`)** — `50 arquivos`: Arquitetura completa para `@xyflow/react` v12, nós e arestas customizados, layouting automático (Dagre/Elkjs), subflows agrupados, componentes de interface Shadcn UI / React Flow UI, gerenciamento de estado complexo com Zustand, suporte SSR e testes automatizados.

---

### 🖥️ 3. Desktop & Aplicações Nativas
- **Electron Desktop (`electron`)** — `302 arquivos`: Enciclopédia técnica completa para desenvolvimento desktop com Electron (Chromium + Node.js), modelo multi-processo (Main, Renderer, Preload, UtilityProcess), IPC seguro com `contextBridge`, gerenciamento de janelas e `BrowserView`/`WebContentsView`, menus, tray, notificações nativas, checklist de hardening e segurança, Electron Forge, empacotamento com auto-update e integração nativa com SO (Windows, macOS, Linux).

---

### 📈 4. Trading & Análise Financeira
- **TradingView / Pine Script (`pine-script`)** — `35 arquivos`: Desenvolvimento profissional em Pine Script v5 e v6, indicadores, estratégias completas com backtesting e métricas anti-repainting, multi-timeframe (`request.security`), estruturas avançadas (Arrays, Maps, Matrizes, UDTs/Objetos e Métodos), alertas determinísticos e renderização gráfica (plots, tabelas, caixas, polilinhas).

---

### 💾 5. Bancos de Dados & Armazenamento
- **Better SQLite3 (`better-sqlite3`)** — `11 arquivos`: Guia completo da API síncrona de alta performance para Node.js, prepared statements com binding de parâmetros, transações atômicas seguras, PRAGMAs otimizados, tabelas virtuais, extensões nativas e migrações.

---

### 🏛️ 6. Engenharia & Arquitetura de Software
- **Boas Práticas de Arquitetura de Software (`boas-praticas-arquitetura-software`)** — `31 arquivos`: Clean Architecture, Arquitetura Hexagonal (Ports & Adapters), Microsserviços, Monólito Modular, Event-Driven Architecture, design de contratos e APIs, documentação arquitetural com ADRs e C4 Model, heurísticas de qualidade (confiabilidade, observabilidade, performance) e checklist de revisão.

---

## 🤖 Compatibilidade com Agentes e IDEs

As skills geradas seguem o padrão oficial de mercado (`SKILL.md` com metadados YAML e árvores de arquivos modulares), sendo 100% compatíveis com:

- **Google Antigravity / Gemini CLI**: `.agent/skills/` ou `.gemini/skills/`
- **Claude Code**: `.claude/skills/`
- **Cursor / Windsurf / GitHub Copilot Workspace**: `skills/` ou `.agent/skills/`
- **Qualquer agente baseado em arquivos de contexto / markdown**

---

## 🤝 Contribuindo com Novas Skills

Deseja adicionar uma nova categoria ou biblioteca ao hub?
1. Crie uma pasta dentro de `skills/<NomeDaCategoria>/skill_<nome_da_skill>/`.
2. Adicione o arquivo `SKILL.md` contendo o cabeçalho YAML (`name` e `description`) com a visão geral.
3. Adicione o arquivo `index_master.md` com a tabela de roteamento semântico.
4. Distribua a documentação em subpastas temáticas (ex: `primeiros_passos/`, `api_referencia/`, `recursos_avancados/`).
5. Envie um Pull Request!

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).
