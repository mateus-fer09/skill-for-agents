---
title: "Class: TouchBarSpacer"
description: "## Class: TouchBarSpacer"
topics:
  - "Api"
keywords:
  - "Class: TouchBarSpacer"
  - "options"
  - "size"
  - "small"
  - "NSTouchBarItemIdentifierFixedSpaceSmall"
  - "large"
  - "NSTouchBarItemIdentifierFixedSpaceLarge"
  - "flexible"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/touch-bar-spacer"
---

# Class: TouchBarSpacer

## Class: TouchBarSpacer

> 

Create a spacer between two items in the touch bar for native macOS applications

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### `new TouchBarSpacer(options)`

- `options` Object

  - `size` string (optional) - Size of spacer, possible values are:

    - `small` - Small space between items. Maps to `NSTouchBarItemIdentifierFixedSpaceSmall`. This is the default.

    - `large` - Large space between items. Maps to `NSTouchBarItemIdentifierFixedSpaceLarge`.

    - `flexible` - Take up all available space. Maps to `NSTouchBarItemIdentifierFlexibleSpace`.

### Propriedades da Instância

As seguintes propriedades estão disponíveis em instâncias de `TouchBarSpacer`:

#### `touchBarSpacer.size`

A `string` representing the size of the spacer.  Can be `small`, `large` or `flexible`.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/touch-bar-spacer.md)
