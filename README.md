# 🧠 Skill for Agents — Hub de Skills para Agentes de IA

> **O seu hub definitivo de skills e diretrizes técnicas para Agentes de IA.** Tenha contexto preciso sobre bibliotecas, APIs e arquitetura no seu agente, eliminando alucinações e respostas imprecisas.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

---

## 🎯 O que é o Skill for Agents?

O **Skill for Agents** é um **Hub de Skills especializado**, criado para fornecer conhecimento técnico aprofundado, documentações estruturadas, regras de arquitetura e melhores práticas diretamente para os seus agentes de IA e assistentes de código.

### 🛑 O Problema: Alucinação e Falta de Contexto
Ao programar com LLMs e agentes autônomos (Google Antigravity, Claude Code, Cursor, Gemini CLI, Windsurf, etc.), é comum que os modelos:
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

1. **💰 Economia Drástica de Tokens:** O agente não precisa despejar dezenas de milhares de tokens no contexto toda vez que for chamado. Ele consulta o `index_master.md` (ou `index.md`), localiza o arquivo exato e consome apenas uma fração minúscula do contexto.
2. **🎯 Leitura Just-in-Time (On-Demand):** O agente lê **estritamente o que é necessário** para responder à dúvida ou implementar o recurso solicitado.
3. **🧠 Foco e Retenção Cognitiva:** Reduz o efeito *"lost in the middle"* e a degradação de atenção da LLM, mantendo a janela de contexto limpa para o código do projeto, ferramentas e raciocínio.
4. **📚 Cobertura Exaustiva sem Penalidade:** Permite cobrir 100% de APIs complexas (como OpenAI API, Electron ou React Flow em 20+ módulos detalhados) com profundidade de produção sem explodir o limite de tokens.

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

## 📚 Categorias do Hub de Skills

O hub cobre uma vasta gama de tópicos essenciais para desenvolvimento moderno:

### 🔌 APIs & Modelos de IA
- **OpenAI / ChatGPT API**: Endpoints REST, Assistants API v2, Realtime API (Voz/WebRTC), Structured Outputs, Function Calling e Fine-tuning.
- **Gemini API**: Integração com SDK Google Gen AI, chamadas multimodais, Context Caching e Agent Environment.
- **Google Drive API**: Autenticação OAuth2/Service Account, upload, download, permissões e gerenciamento de arquivos.
- **Appmax API**: Integração de pagamentos, checkout, pedidos e webhooks.

### 🎨 Front-End & Bibliotecas React
- **React Flow**: Criação de fluxogramas interativos, nós e arestas customizados, layouts e estado complexo.
- **TradingView / Pine Script**: Criação de scripts, indicadores, estratégias de backtesting e visualizações gráficas.
- **Boas Práticas Fullstack / Front-End**: Diretrizes essenciais de React, TypeScript, TailwindCSS e estado global.
- **UI/UX & Design Systems**: Acessibilidade, componentes modulares e padrões visuais modernos.

### 🖥️ Desktop & Mobile
- **Electron Completo**: Arquitetura multi-processo, IPC seguro via `contextBridge`/`preload`, gerenciamento de janelas/views, hardening e empacotamento com `electron-builder`.
- **Kotlin & Jetpack Compose**: Padrões modernos para Android nativo, ViewModels, Coroutines e migração React ➔ Kotlin.

### 🔒 Back-End, Segurança & Bancos de Dados
- **Segurança Fullstack**: Checklist defensivo, headers HTTP, sanitização contra XSS/CSRF, autenticação e JWT.
- **Firebase Integration**: Firebase Auth, Firestore e regras de segurança granulares.
- **Better SQLite3**: Operações síncronas de alta performance, schemas e migrações.
- **Boas Práticas de Arquitetura de Software**: Clean Architecture, SOLID, Design Patterns e desacoplamento de código.

---

## 🤖 Compatibilidade com Agentes e IDEs

As skills geradas seguem o formato padrão de mercado (`SKILL.md` com metadados YAML e referências estruturadas), sendo 100% compatíveis com:

- **Google Antigravity / Gemini CLI**: `.agent/skills/` ou `.gemini/skills/`
- **Claude Code**: `.claude/skills/`
- **Cursor / Windsurf / GitHub Copilot Workspace**: `skills/` ou `.agent/skills/`
- **Qualquer agente baseado em arquivos de contexto / markdown**

---

## 🤝 Contribuindo com Novas Skills

Deseja adicionar uma nova biblioteca ou framework ao hub?
1. Crie uma pasta dentro de `skills/<Categoria>/skill_<nome_da_skill>/`.
2. Adicione o arquivo `SKILL.md` contendo o cabeçalho YAML (`name` e `description`) e a documentação aprofundada.
3. Adicione arquivos de referência na pasta `references/` ou subpastas conforme necessário.
4. Envie um Pull Request!

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).

