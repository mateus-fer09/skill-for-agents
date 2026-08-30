---
title: Anthropic CLI e Claude Code
description: Instalação, configuração de autenticação, comandos operacionais e automação de scripts via linha de comando.
topics:
  - cli
  - terminal
  - automacao
  - scripting
keywords:
  - anthropic cli
  - claude code
  - terminal commands
  - scripting
related:
  - primeiros_passos/quickstart.md
  - sdks_e_bibliotecas/sdk_python.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/cli/quickstart
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/cli/using
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/cli/scripting
  - https://platform.claude.com/docs/pt-BR/cli-sdks-libraries/cli/authentication
---

# Anthropic CLI e Claude Code

A CLI oficial da Anthropic permite que desenvolvedores interajam com os modelos Claude diretamente do terminal, construam scripts de automação, processem arquivos locais em pipelines e realizem pair programming interativo.

---

## Instalação

A CLI pode ser instalada globalmente via gerenciadores de pacotes:

```bash
# Via npm
npm install -g @anthropic-ai/claude-cli

# Ou via Homebrew (macOS/Linux)
brew install anthropic/tap/claude
```

---

## Autenticação

Configure sua chave de API para o terminal:

```bash
# Método 1: Login interativo
claude login

# Método 2: Variável de ambiente
export ANTHROPIC_API_KEY="sk-ant-api03-..."
```

---

## Comandos Principais e Modos de Uso

### 1. Modo Interativo (Chat no Terminal)

Inicie uma sessão interativa no terminal:
```bash
claude
```

Durante o chat, você pode usar comandos de barra:
- `/help`: Exibe lista de comandos disponíveis.
- `/clear`: Limpa o histórico da sessão atual.
- `/model <id>`: Alterna o modelo em execução (ex: `/model claude-3-7-sonnet-20250219`).
- `/exit` ou `Ctrl+C`: Encerra a sessão.

### 2. Prompt Direto em Linha de Comando

```bash
claude "Explique a diferença entre mutex e semaphore em C++"
```

### 3. Processamento com Pipes Unix

Encaminhe a saída de outros comandos ou arquivos para o Claude:

```bash
# Análise de logs em tempo real
cat /var/log/nginx/error.log | claude "Identifique os 3 erros mais frequentes e suas causas raízes"

# Revisão de código de um diff git
git diff main | claude "Revise este pull request identificando bugs potenciais e problemas de segurança"

# Geração de documentação a partir de um arquivo
cat server.py | claude "Gere uma documentação OpenAPI/Swagger para estes endpoints" > openapi.yaml
```

---

## Scripting e Automação

Você pode utilizar a CLI dentro de scripts Bash ou PowerShell com formatação de saída controlada:

```bash
#!/usr/bin/env bash
set -e

INPUT_FILE="$1"
OUTPUT_FILE="$2"

echo "Processando $INPUT_FILE com Claude..."
claude --model claude-3-5-haiku-20241022 \
       --system "Você é um extrator de dados. Retorne estritamente um array JSON válido." \
       "Extraia todos os clientes e valores do seguinte texto: $(cat $INPUT_FILE)" > "$OUTPUT_FILE"

echo "Resultado salvo em $OUTPUT_FILE"
```

---

## Veja Também

- [`../primeiros_passos/quickstart.md`](../primeiros_passos/quickstart.md)
- [`../sdks_e_bibliotecas/sdk_python.md`](../sdks_e_bibliotecas/sdk_python.md)
- [`../sdks_e_bibliotecas/sdk_typescript.md`](../sdks_e_bibliotecas/sdk_typescript.md)
