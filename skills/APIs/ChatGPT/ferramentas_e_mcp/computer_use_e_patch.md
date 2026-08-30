---
title: Computer Use, Apply Patch e Local Shell
description: Guia de ferramentas avançadas para automação de interface com Computer Use, refatoração de código com Apply Patch e execução de comandos em Local Shell.
topics:
  - computer-use
  - apply-patch
  - local-shell
  - coding-agents
keywords:
  - computer_use
  - apply_patch
  - local_shell
  - diff
  - screenshots
  - GUI automation
related:
  - ../ferramentas_e_mcp/function_calling.md
  - ../ferramentas_e_mcp/ferramentas_hospedadas.md
  - ../agents_sdk/definicao_de_agentes.md
source_scope:
  - https://developers.openai.com/api/docs/guides/tools-computer-use.md
  - https://developers.openai.com/api/docs/guides/tools-apply-patch.md
  - https://developers.openai.com/api/docs/guides/tools-local-shell.md
---

# Computer Use, Apply Patch e Local Shell

Ferramentas especializadas para agentes de desenvolvimento de software, automação de interface gráfica (GUI) e execução de tarefas de infraestrutura e terminal.

---

## 1. Computer Use (`type: "computer"`)

Permite que o modelo interaja diretamente com interfaces gráficas (desktop ou browser), inspecionando capturas de tela (*screenshots*) e emitindo ações de clique, digitação, rolagem e movimentação do cursor.

### Ações Suportadas
- `click`: Clique em coordenadas específicas `(x, y)`.
- `double_click` e `triple_click`.
- `type`: Digitação de sequências de texto.
- `key_combination`: Atalhos de teclado (ex.: `Ctrl+S`, `Cmd+V`, `Enter`).
- `scroll`: Rolagem vertical/horizontal com deltas.
- `screenshot`: Solicitação de uma nova captura de tela do ambiente.

### Exemplo de Configuração

```python
response = client.responses.create(
    model="gpt-5.6",
    input="Abra o navegador, acesse o painel de status e clique no botão de atualizar.",
    tools=[
        {
            "type": "computer",
            "display_width_px": 1920,
            "display_height_px": 1080
        }
    ]
)
```

---

## 2. Apply Patch (`type: "apply_patch"`)

Permite que o modelo emita alterações estruturadas de código no formato de diffs unificados (*patches*), ideais para agentes de engenharia de software e refatoração de código.

### Vantagens em relação à reescrita completa
- Reduz drasticamente o consumo de tokens de saída.
- Garante precisão cirúrgica na alteração de linhas específicas.
- Permite validação e aplicação direta com ferramentas padrão (como `git apply` ou parsers de diff).

### Exemplo de Retorno de Patch

```json
{
  "type": "apply_patch_call",
  "call_id": "call_patch_123",
  "path": "src/utils/math.py",
  "diff": "@@ -10,3 +10,4 @@\n def somar(a, b):\n-    return a+b\n+    # Validar tipos\n+    return float(a) + float(b)\n"
}
```

---

## 3. Local Shell (`type: "local_shell"`)

Permite que agentes autônomos executem comandos de terminal em um ambiente local controlado pelo desenvolvedor:

```python
response = client.responses.create(
    model="gpt-5.6",
    input="Verifique se todos os testes unitários em pytest estão passando.",
    tools=[
        {"type": "local_shell"}
    ]
)
```

> [!CAUTION]
> Ao habilitar `local_shell`, implemente sempre confirmação humana (*Human-in-the-Loop*) ou execute em containers efêmeros e sandboxes isolados para prevenir execução de comandos destrutivos.

---

## 4. Referências Cruzadas

- [`../ferramentas_e_mcp/function_calling.md`](../ferramentas_e_mcp/function_calling.md)
- [`../agents_sdk/definicao_de_agentes.md`](../agents_sdk/definicao_de_agentes.md)
- [`../agents_sdk/guardrails_e_sandboxes.md`](../agents_sdk/guardrails_e_sandboxes.md)
