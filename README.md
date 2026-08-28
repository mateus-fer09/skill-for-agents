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
4. **📚 Cobertura Exaustiva sem Penalidade:** Permite cobrir 100% de APIs complexas (como OpenAI API, Gemini API, React Flow ou Pine Script em dezenas de módulos detalhados) com profundidade de produção sem estourar limites de contexto.

---

## ⚡ Uso Rápido em Qualquer Projeto

Você não precisa navegar pelo GitHub ou copiar arquivos manualmente. No terminal do seu projeto, execute:

### 1. Modo Interativo (Menu Visual)

```bash
npx skill-for-agents
```
*(ou diretamente via repositório GitHub)*:
```bash
npx github:mateus-fer09/skill-for-agents
```

O assistente interativo guiará você passo a passo:
1. **Escolher o diretório de destino** (`.agent/skills/`, `.gemini/skills/`, `.claude/skills/`, `skills/` ou personalizado).
2. **Escolher o modo de seleção**:
   - 📦 **Importar todas as skills** de todas as categorias.
   - 📁 **Escolher por Categoria** (ex: `APIs`, `Bibliotecas React`, `TradingView`, etc.).
   - 🎯 **Selecionar Skills Individuais** da lista com suporte a busca.
3. **Escolher o formato de organização** (direto por pasta da skill ou mantendo as subpastas de categorias).

---

## 🚀 Uso Direto com Flags (Automação / CI)

Você também pode automatizar a instalação informando os parâmetros diretamente na linha de comando:

```bash
# Importar todas as skills para o diretório padrão (.agent/skills/)
npx skill-for-agents --all

# Importar todas as skills de uma categoria específica
npx skill-for-agents --category APIs

# Importar múltiplas categorias
npx skill-for-agents --category "APIs,Bibliotecas React,TradingView"

# Importar skills individuais para uma pasta customizada
npx skill-for-agents --skill chatgpt,react-flow,pine-script --dest ./minhas-skills

# Manter a organização em pastas de categorias no destino
npx skill-for-agents --all --keep-categories

# Listar o catálogo completo de categorias e skills disponíveis
npx skill-for-agents --list
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

## 📚 Catálogo de Categorias e Skills Atuais

O repositório é estruturado em categorias com documentação completa e modular:

```text
skills/
├── APIs/
│   ├── ChatGPT/                             # OpenAI API (24 arquivos de referência)
│   └── Gemini/                              # Google Gemini API (22 arquivos de referência)
├── Banco de Dados/
│   └── better-sqlite3-docs/better-sqlite3/  # Better SQLite3 (11 arquivos de referência)
├── Bibliotecas React/
│   └── skill_react_flow/                    # React Flow v12 (50 arquivos de referência)
├── TradingView/
│   └── skill_pine_script/                   # Pine Script v5 / v6 (35 arquivos de referência)
└── skill_boas_praticas_arquitetura_software/ # Arquitetura de Software (31 arquivos de referência)
```

### 🔌 APIs & Modelos de IA
- **OpenAI / ChatGPT API (`chatgpt`)** — `24 arquivos`: Endpoints REST, Chat Completions, Assistants API v2 (Threads, Vector Stores, Code Interpreter), Realtime API (Voz/WebRTC), Structured Outputs (Pydantic/Zod), Function Calling, Batch API, Fine-Tuning e Multimodalidade (Vision, Whisper, TTS, DALL-E).
- **Google Gemini API (`gemini`)** — `22 arquivos`: Integração com SDK `@google/genai` v1 e Python, chamadas multimodais (áudio/vídeo/imagem), Context Caching, Agent Environment, Deep Research, Batch API, Function Calling e Structured Outputs.

### 🎨 Bibliotecas Front-End & Gráficos
- **React Flow (`react-flow`)** — `50 arquivos`: Arquitetura completa para `@xyflow/react` v12, nós e arestas customizados, layouting com Dagre/Elkjs, subflows, componentes Shadcn UI/React Flow UI, estado com Zustand, SSR e performance.
- **TradingView / Pine Script (`pine-script`)** — `35 arquivos`: Desenvolvimento profissional em Pine Script v5 e v6, estratégias, backtesting avançado, multi-timeframe (`request.security`), arrays, maps, matrizes, UDTs, sistema de alertas e renderização gráfica.

### 💾 Bancos de Dados & Armazenamento
- **Better SQLite3 (`better-sqlite3`)** — `11 arquivos`: Guia completo da API síncrona de alta performance para Node.js, prepared statements, transações atômicas, PRAGMAs otimizados, tabelas virtuais, extensões e migrações.

### 🏛️ Engenharia & Arquitetura de Software
- **Boas Práticas de Arquitetura de Software (`boas-praticas-arquitetura-software`)** — `31 arquivos`: Clean Architecture, Arquitetura Hexagonal, Microsserviços, Monólito Modular, Event-Driven, Decisões de Contratos/APIs, Documentação com ADRs e C4 Model, Heurísticas de Qualidade, Resiliência e Checklist de Revisão.

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
