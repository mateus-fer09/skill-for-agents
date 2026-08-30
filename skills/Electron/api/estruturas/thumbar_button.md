---
title: "Objeto ThumbarButton"
description: "- icon [NativeImage](/pt/docs/latest/api/native-image) - The icon showing in thumbnail toolbar."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto ThumbarButton"
  - "icon"
  - "click"
  - "tooltip"
  - "flags"
  - "string"
  - "enabled"
  - "disabled"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/thumbar-button"
---

# Objeto ThumbarButton

- `icon` [NativeImage](/pt/docs/latest/api/native-image) - The icon showing in thumbnail toolbar.

- `click` Function

- `tooltip` string (opcional) - O texto do tooltip do botão.

- `flags` string[] (opcional) - Controla estados específicos e comportamentos do botão. Por padrão, é `['enabled']`.

As `flags` são um array que pode conter as seguintes `string`s:

- `enabled` - O botão está ativo e disponível ao usuário.

- `disabled` - O botão está desativado. O botão está presente, mas está em um estado visual indicando que não vai responder à ação do usuário.

- `dismissonclick` - Quando o botão é clicado, o janela da miniatura é fechada imediatamente.

- `nobackground` - Não desenha a borda do botão, utiliza apenas a imagem.

- `hidden` - O botão não é exibido ao usuário.

- `noninteractive` - O botão está ativado, mas não interativo; nenhum estado de botão pressionado é desenhado. Este valor é destinado a instâncias onde o botão é usado em uma notificação.
