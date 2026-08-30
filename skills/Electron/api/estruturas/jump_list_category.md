---
title: "Objeto JumpListCategory"
description: "- type string (opcional) - Um dos seguintes:"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto JumpListCategory"
  - "type"
  - "tarefas"
  - "frequente"
  - "recent"
  - "custom"
  - "name"
  - "items"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/jump-list-category"
---

# Objeto JumpListCategory

- `type` string (opcional) - Um dos seguintes:

  - `tarefas` - itens nesta categoria serão colocados na categoria de `tarefas` padrão. Só pode existir um de cada categoria, e sempre será mostrado no final da Jump List.

  - `frequente` - Exibe uma lista de arquivos abertos recentemente pelo aplicativo, o nome da categoria e seus itens são definidos pelo Windows.

  - `recent` - Exibe uma lista de arquivos abertos recentemente pelo aplicativo, o nome e a categoria de seus itens são definidos pelo Windows. Itens podem ser adicionados indiretamente a esta categoria usando `app.addRecentDocument(path)`.

  - `custom` - Exibe tarefas ou links para arquivos, o `name` precisa ser definido pelo aplicativo.

- `name` string (opcional) - Precisa ser definido se o `type` é `custom`, caso contrário deverá ser omitido.

- `items` JumpListItem[] (optional) - Array of [JumpListItem](/pt/docs/latest/api/structures/jump-list-item) objects if `type` is `tasks` or `custom`, otherwise it should be omitted.

> 

[!NOTE] If a `JumpListCategory` object has neither the `type` nor the `name` property set then its `type` is assumed to be `tasks`. If the `name` property is set but the `type` property is omitted then the `type` is assumed to be `custom`.

> 

[!NOTE] The maximum length of a Jump List item's `description` property is 260 characters. Beyond this limit, the item will not be added to the Jump List, nor will it be displayed.
