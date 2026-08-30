---
title: "JumpListItem Object"
description: "- type string (opcional) - Um dos seguintes:"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "JumpListItem Object"
  - "type"
  - "task"
  - "separator"
  - "Tasks"
  - "file"
  - "path"
  - "program"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/jump-list-item"
---

# JumpListItem Object

- `type` string (opcional) - Um dos seguintes:

  - `task` - Uma tarefa vai carregar um aplicativo com argumentos específicos.

  - `separator` - Pode ser usado para separar itens na categoria padrão `Tasks`.

  - `file` - O arquivo link será aberto um arquivo usando o app que criou a lista de atalhos, para isso funcionar o app deve ser registrado como um manipulador para o tipo de arquivo (embora não precisa ser o manipulador padrão).

- `path` string (opcional) - Caminho do arquivo para abrir, só deve ser definido se o `type` é `file`.

- `program` string (opcional) - Caminho do programa para executar, geralmente você deve especificar `process.execPath` que abre o programa atual. Só deve ser definido se o `type` é `task`.

- `args` string (opicional) - A linha de comando quando `program` é executado. Só deve ser definido se o `type` é `task`.

- `title` string (opcional) - O texto a ser exibido para o item na Jump List. Só deve ser definido se o `type` é `task`.

- `description` string (opcional) - Descrição da tarefa (exibida em uma dica de ferramenta). Só deve ser definido se o `type` é `task`. Comprimento máximo 260 caracteres.

- `iconPath` string (opcional) - O caminho absoluto para um ícone a ser exibido em uma lista de atalhos, que pode ser um recurso arbitrário do arquivo que contém um ícone (exemplo: `.ico`, `.exe` e `.dll`). Geralmente, você pode especificar `process.execPath` para mostrar o ícone do programa.

- `iconIndex` número (opcional) - O índice do ícone no arquivo de recurso. Se um arquivo de recurso contém vários ícones esse valor pode ser usado para especificar o índice baseado em zero do ícone a ser exibido para esta tarefa. Se um arquivo de recurso contém apenas um ícone, esta propriedade deve ser definida como zero.

- `workingDirectory` string (opcional) - O diretório de trabalho. O padrão é vazio.
