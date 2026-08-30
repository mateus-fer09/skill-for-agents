---
title: "Objeto ShortcutDetails"
description: "- target string - O alvo à ser executado por este atalho."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto ShortcutDetails"
  - "target"
  - "args"
  - "description"
  - "icon"
  - "iconIndex"
  - "appUserModelId"
  - "toastActivatorClsid"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/shortcut-details"
---

# Objeto ShortcutDetails

- `target` string - O alvo à ser executado por este atalho.

- `cwd` string (opcional) - O diretório de trabalho. O padrão é vazio.

- `args` string (opcional) - Os argumentos a serem aplicados ao `target` quando executado por este atalho. O padrão é vazio.

- `description` string (opcional) - A descrição do atalho. O padrão é vazio.

- `icon` string (opcional) - O caminho para o ícone, Pode ser um DLL ou EXE. `icon` e `iconIndex` devem ser definidos juntos. O padrão é 'vazio', que usa o ícone do alvo.

- `iconIndex` number (opcional) - O ID de recurso do icone quando `icon` é uma DLL ou um EXE. O padrão é 0.

- `appUserModelId` string (opcional) - O User Model ID da aplicação. O padrão é vazio.

- `toastActivatorClsid` string (opcional) - O CLSID do Application Toast Activator. Necessário para participação no Action Center.
