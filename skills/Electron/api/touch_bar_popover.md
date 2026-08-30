---
title: "Class: TouchBarPopover"
description: "## Class: TouchBarPopover"
topics:
  - "Api"
keywords:
  - "Class: TouchBarPopover"
  - "options"
  - "label"
  - "icon"
  - "items"
  - "showCloseButton"
  - "true"
  - "false"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/touch-bar-popover"
---

# Class: TouchBarPopover

## Class: TouchBarPopover

> 

Create a popover in the touch bar for native macOS applications

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### `new TouchBarPopover(options)`

- `options` Object

  - `label` string (optional) - Popover button text.

  - `icon` [NativeImage](/pt/docs/latest/api/native-image) (optional) - Popover button icon.

  - `items` [TouchBar](/pt/docs/latest/api/touch-bar) - Items to display in the popover.

  - `showCloseButton` boolean (optional) - `true` to display a close button on the left of the popover, `false` to not show it. Por padrão é `true`.

### Propriedades da Instância

As seguintes propriedades estão disponíveis em instâncias de `TouchBarPopover`:

#### `touchBarPopover.label`

A `string` representing the popover's current button text. Changing this value immediately updates the popover in the touch bar.

#### `touchBarPopover.icon`

A `NativeImage` representing the popover's current button icon. Changing this value immediately updates the popover in the touch bar.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/touch-bar-popover.md)
