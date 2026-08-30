---
title: "Class: TouchBarSlider"
description: "## Class: TouchBarSlider"
topics:
  - "Api"
keywords:
  - "Class: TouchBarSlider"
  - "options"
  - "label"
  - "value"
  - "minValue"
  - "maxValue"
  - "change"
  - "newValue"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/touch-bar-slider"
---

# Class: TouchBarSlider

## Class: TouchBarSlider

> 

Create a slider in the touch bar for native macOS applications

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### `new TouchBarSlider(options)`

- `options` Object

  - `label` string (optional) - Label text.

  - `value` Integer (optional) - Selected value.

  - `minValue` Integer (optional) - Minimum value.

  - `maxValue` Integer (optional) - Maximum value.

  - `change` Function (optional) - Function to call when the slider is changed.

    - `newValue` number - The value that the user selected on the Slider.

### Propriedades da Instância

As seguintes propriedades estão disponíveis em instâncias de `TouchBarSlider`:

#### `touchBarSlider.label`

A `string` representing the slider's current text. Changing this value immediately updates the slider in the touch bar.

#### `touchBarSlider.value`

A `number` representing the slider's current value. Changing this value immediately updates the slider in the touch bar.

#### `touchBarSlider.minValue`

A `number` representing the slider's current minimum value. Changing this value immediately updates the slider in the touch bar.

#### `touchBarSlider.maxValue`

A `number` representing the slider's current maximum value. Changing this value immediately updates the slider in the touch bar.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/touch-bar-slider.md)
