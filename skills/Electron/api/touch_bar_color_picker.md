---
title: "Class: TouchBarColorPicker"
description: "## Class: TouchBarColorPicker"
topics:
  - "Api"
keywords:
  - "Class: TouchBarColorPicker"
  - "options"
  - "availableColors"
  - "selectedColor"
  - "change"
  - "color"
  - "TouchBarColorPicker"
  - "touchBarColorPicker.availableColors"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/touch-bar-color-picker"
---

# Class: TouchBarColorPicker

## Class: TouchBarColorPicker

> 

Create a color picker in the touch bar for native macOS applications

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### `new TouchBarColorPicker(options)`

- `options` Object

  - `availableColors` string[] (optional) - Array of hex color strings to appear as possible colors to select.

  - `selectedColor` string (optional) - The selected hex color in the picker, i.e `#ABCDEF`.

  - `change` Function (optional) - Function to call when a color is selected.

    - `color` string - The color that the user selected from the picker.

### Propriedades da Instância

As seguintes propriedades estão disponíveis em instâncias de `TouchBarColorPicker`:

#### `touchBarColorPicker.availableColors`

A `string[]` array representing the color picker's available colors to select. Changing this value immediately updates the color picker in the touch bar.

#### `touchBarColorPicker.selectedColor`

A `string` hex code representing the color picker's currently selected color. Changing this value immediately updates the color picker in the touch bar.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/touch-bar-color-picker.md)
