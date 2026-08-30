---
title: Ferramentas Nativas da Anthropic (Native Tools)
description: Catálogo completo de ferramentas integradas fornecidas pela Anthropic: Bash Tool, Text Editor Tool, Computer Use Tool, Browser Use Tool, Memory Tool e Tool Search Tool.
topics:
  - native-tools
  - computer-use
  - bash-tool
  - text-editor
  - memory-tool
  - browser-use
keywords:
  - bash_20250124
  - text_editor_20250124
  - computer_20241022
  - memory_tool
  - tool_search
related:
  - ferramentas_e_agentes/tool_use_visao_geral.md
  - managed_agents/visao_geral_e_arquitetura.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/bash-tool
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/text-editor-tool
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/computer-use-tool
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/browser-use-tool
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/memory-tool
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/tool-search-tool
---

# Ferramentas Nativas da Anthropic (Native Tools)

A Anthropic disponibiliza definições padronizadas e otimizadas de ferramentas de sistema (*Native Tools*) para as quais os modelos Claude possuem treinamento e sintonia fina específicos.

---

## 1. Bash Tool (`bash_20250124`)

Permite ao Claude executar comandos de terminal Bash em ambientes seguros ou sandboxes:

```json
{
  "tools": [
    {
      "type": "bash_20250124",
      "name": "bash"
    }
  ]
}
```

### Ações Suportadas:
- Execução de comandos de shell: `{ "command": "git status && npm test" }`
- Reinicialização de sessão bash.

---

## 2. Text Editor Tool (`text_editor_20250124`)

Permite visualização, criação e edição cirúrgica de arquivos com substituição exata de blocos (*str_replace*):

```json
{
  "tools": [
    {
      "type": "text_editor_20250124",
      "name": "str_replace_editor"
    }
  ]
}
```

### Comandos do Editor:
- `view`: Exibe conteúdo ou trechos de arquivos com números de linha (`path`, `view_range`).
- `create`: Cria um novo arquivo com o conteúdo fornecido (`path`, `file_text`).
- `str_replace`: Substitui uma sequência de texto exata por um novo conteúdo (`path`, `old_str`, `new_str`).
- `insert`: Insere linhas após uma linha específica (`path`, `insert_line`, `new_str`).
- `undo_edit`: Reverte a última modificação no arquivo.

---

## 3. Computer Use Tool (`computer_20241022`)

Permite ao Claude interagir diretamente com interfaces gráficas de usuário (GUI) de sistemas operacionais:

```json
{
  "tools": [
    {
      "type": "computer_20241022",
      "name": "computer",
      "display_width_px": 1024,
      "display_height_px": 768,
      "display_number": 1
    }
  ]
}
```

### Ações Suportadas pelo Computer Use:
- `action: "screenshot"`: Captura a tela atual para o Claude inspecionar visualmente.
- `action: "mouse_move"`, `coordinate: [x, y]`: Move o cursor para as coordenadas especificadas na tela.
- `action: "left_click"`, `"right_click"`, `"double_click"`, `"triple_click"`, `"middle_click"`.
- `action: "type"`, `text: "hello"`: Digita texto no componente focado.
- `action: "key"`, `text: "Return"`: Pressiona teclas especiais (`Return`, `BackSpace`, `Tab`, `ctrl+c`, `ctrl+v`).
- `action: "left_click_drag"`, `coordinate: [x, y]`: Arrasta o mouse.
- `action: "cursor_position"`: Obtém as coordenadas atuais do cursor.

---

## 4. Browser Use Tool (`browser_use_tool`)

Permite que o Claude navegue na web, acerte formulários, clique em botões e extraia conteúdo estruturado de páginas web dinâmicas.

---

## 5. Memory Tool (`memory_tool`)

Permite que agentes mantenham e recuperem memórias semânticas de longo prazo entre diferentes conversas e sessões de trabalho.

---

## 6. Tool Search Tool (`tool_search_tool`)

Para ecossistemas que possuem dezenas ou centenas de ferramentas disponíveis. Em vez de enviar todas as definições no payload de cada requisição (o que consumiria tokens excessivos), o modelo pesquisa e carrega apenas as ferramentas relevantes para a tarefa atual sob demanda.

---

## Veja Também

- [`../ferramentas_e_agentes/tool_use_visao_geral.md`](../ferramentas_e_agentes/tool_use_visao_geral.md)
- [`../managed_agents/visao_geral_e_arquitetura.md`](../managed_agents/visao_geral_e_arquitetura.md)
- [`../ferramentas_e_agentes/mcp_model_context_protocol.md`](../ferramentas_e_agentes/mcp_model_context_protocol.md)
