---
title: "Class: TouchBarLabel"
description: "## Class: TouchBarLabel"
topics:
  - "Api"
keywords:
  - "Class: TouchBarLabel"
  - "options"
  - "label"
  - "accessibilityLabel"
  - "textColor"
  - "TouchBarLabel"
  - "touchBarLabel.label"
  - "string"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/touch-bar-label"
---

# Class: TouchBarLabel

## Class: TouchBarLabel

> 

Create a label in the touch bar for native macOS applications

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### `new TouchBarLabel(options)`

- `options` Object

  - `label` string (optional) - Text to display.

  - `accessibilityLabel` string (optional) - A short description of the button for use by screenreaders like VoiceOver.

  - `textColor` string (optional) - Hex color of text, i.e `#ABCDEF`.

When defining `accessibilityLabel`, ensure you have considered macOS [best practices](https://developer.apple.com/documentation/appkit/nsaccessibilitybutton/1524910-accessibilitylabel?language=objc).

### Propriedades da Instância

As seguintes propriedades estão disponíveis em instâncias de `TouchBarLabel`:

#### `touchBarLabel.label`

A `string` representing the label's current text. Changing this value immediately updates the label in the touch bar.

#### `touchBarLabel.accessibilityLabel`

A `string` representing the description of the label to be read by a screen reader.

#### `touchBarLabel.textColor`

A `string` hex code representing the label's current text color. Changing this value immediately updates the label in the touch bar.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/touch-bar-label.md)
