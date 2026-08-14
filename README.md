# 🧠 Skill for Agents

> Importe diretrizes de alta qualidade e skills de inteligência artificial para qualquer projeto com apenas um comando via **`npx`**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

---

## ⚡ Uso Rápido em Qualquer Projeto

Você não precisa mais abrir o GitHub, navegar até o repositório e copiar arquivos manualmente. No terminal do seu projeto, execute:

### 1. Modo Interativo (Menu Visual)

```bash
npx skill-for-agents
```
*(ou se ainda não publicou no NPM)*:
```bash
npx github:mateus-fer09/skill-for-agents
```

O assistente interativo guiará você para:
- Escolher a pasta de destino (`.agent/skills/`, `.gemini/skills/`, `.claude/skills/`, `skills/` ou personalizada).
- Escolher o formato de saída (pastas estruturadas `<nome>/SKILL.md` ou arquivos avulsos).
- Selecionar **todas as skills** ou escolher manualmente da lista.

---

## 🚀 Uso Direto com Flags (Automação)

Você também pode passar parâmetros diretamente na linha de comando:

```bash
# Importar todas as skills para a pasta padrão (.agent/skills/)
npx skill-for-agents --all

# Importar para uma pasta customizada
npx skill-for-agents --all --dest ./skills

# Importar apenas skills específicas
npx skill-for-agents --skill front-end,firebase,security --dest .agent/skills

# Importar no formato de arquivos avulsos (.md) em vez de pastas
npx skill-for-agents --all --format file

# Listar o catálogo de skills disponíveis
npx skill-for-agents --list
```

---

## 📋 Opções Disponíveis

| Flag | Atalho | Descrição | Padrão |
|---|---|---|---|
| `--all` | `-a` | Importa todas as skills disponíveis | `false` |
| `--dest <caminho>` | `-d` | Define o diretório de destino | `.agent/skills` |
| `--skill <nomes>` | `-s` | Lista de skills separadas por vírgula | - |
| `--format <formato>` | `-f` | Formato de saída: `folder` ou `file` | `folder` |
| `--list` | `-l` | Lista todas as skills e descrições | - |
| `--no-overwrite` | - | Não sobrescreve arquivos já existentes | `false` |
| `--help` | `-h` | Exibe a mensagem de ajuda | - |
| `--version` | `-v` | Exibe a versão do pacote | - |

---

## 📦 Catálogo de Skills Incluídas

| ID | Nome | Descrição |
|---|---|---|
| `front-end` | `boas-praticas-fullstack` | Diretrizes essenciais para React, TypeScript, TailwindCSS e Node.js. |
| `firebase` | `firebase-integration` | Melhores práticas para Firebase Auth e regras de segurança Firestore. |
| `security` | `seguranca-app-fullstack` | Checklist de segurança defensiva, headers, sanitização e JWT. |
| `ui_ux` | `uiux-layout-projeto` | Padrões de design system, acessibilidade e layouts modernos. |
| `electron` | `electron-packaging` | Empacotamento, assinatura e auto-update com electron-builder. |
| `electron_browser` | `electron-navegador-react-ts` | Criação de navegadores desktop nativos com abas isoladas. |
| `electron_ipc` | `electron-ipc` | Comunicação IPC segura via contextBridge e preload scripts. |
| `kotlin` | `implementacao-kotlin-android` | Padrões para Jetpack Compose, ViewModels e Coroutines no Android. |
| `react_para_kotlin` | `react-para-kotlin-planejamento` | Roteiro de migração e equivalência entre React e Kotlin. |
| `appmax` | `appmax-api-integration` | Guia completo de integração com APIs REST e webhooks Appmax. |

---

## 🤖 Compatibilidade com Agentes e Assistentes

As skills geradas são compatíveis com os principais ecossistemas de agentes de código:

- **Google Antigravity / Gemini CLI**: `.agent/skills/` ou `.gemini/skills/`
- **Claude Code**: `.claude/skills/`
- **Cursor / Windsurf / Copilot Workspace**: `skills/` ou `.agent/skills/`

---

## 📤 Como Publicar suas Próprias Atualizações no NPM

Caso queira disponibilizar o comando `npx skill-for-agents` globalmente no registro oficial do NPM:

1. Faça login na sua conta do NPM:
   ```bash
   npm login
   ```
2. Publique o pacote:
   ```bash
   npm publish --access public
   ```
*(Se o nome `skill-for-agents` já estiver registrado por outro usuário no npmjs.com, altere o campo `"name"` no `package.json` para `@mateus-fer09/skill-for-agents` e use `npx @mateus-fer09/skill-for-agents`).*

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).
