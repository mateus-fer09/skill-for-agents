---
title: "Task Object"
description: "- program string - Caminho do programa para executar, geralmente você deve especificar process.execPath que abre o programa atual."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Task Object"
  - "program"
  - "process.execPath"
  - "arguments"
  - "programa"
  - "title"
  - "description"
  - "iconPath"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/task"
---

# Task Object

- `program` string - Caminho do programa para executar, geralmente você deve especificar `process.execPath` que abre o programa atual.

- `arguments` string - os argumentos de linha de comando quando o `programa` é executado.

- `title` string - A string a ser exibida em um JumpList.

- `description` string - Descrição desta tarefa.

- `iconPath` string - O caminho absoluto para um ícone a ser exibido em um JumpList, que pode ser um arquivo de recurso arbitrário que contenha um ícone. Geralmente, você pode especificar `process.execPath` para mostrar o ícone do programa.

- `iconIndex` number - O índice de ícone no arquivo de ícone. Se um arquivo de ícone é composto por dois ou mais ícones, defina esse valor para identificar o ícone. Se um arquivo de ícone consiste em um único ícone, esse valor é 0.

- `workingDirectory` string (opcional) - O diretório de trabalho. O padrão é vazio.
