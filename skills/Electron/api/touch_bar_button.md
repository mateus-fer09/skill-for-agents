---
title: "Class: TouchBarButton"
description: "## Class: TouchBarButton"
topics:
  - "Api"
keywords:
  - "Class: TouchBarButton"
  - "options"
  - "label"
  - "accessibilityLabel"
  - "backgroundColor"
  - "icon"
  - "iconPosition"
  - "left"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/touch-bar-button"
---

# Class: TouchBarButton

## Class: TouchBarButton

> 

Create a button in the touch bar for native macOS applications

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### `new TouchBarButton(options)`

- `options` Object

  - `label` string (optional) - Button text.

  - `accessibilityLabel` string (optional) - A short description of the button for use by screenreaders like VoiceOver.

  - `backgroundColor` string (optional) - Button background color in hex format, i.e `#ABCDEF`.

  - `icon` [NativeImage](/pt/docs/latest/api/native-image) | string (optional) - Button icon.

  - `iconPosition` string (optional) - Can be `left`, `right` or `overlay`. O padrão é `overlay`.

  - `click` Function (optional) - Function to call when the button is clicked.

  - `enabled` boolean (optional) - Whether the button is in an enabled state.  Por padrão é `true`.

When defining `accessibilityLabel`, ensure you have considered macOS [best practices](https://developer.apple.com/documentation/appkit/nsaccessibilitybutton/1524910-accessibilitylabel?language=objc).

### Propriedades da Instância

As seguintes propriedades estão disponíveis em instâncias de `TouchBarButton`:

#### `touchBarButton.accessibilityLabel`

A `string` representing the description of the button to be read by a screen reader. Will only be read by screen readers if no label is set.

#### `touchBarButton.label`

A `string` representing the button's current text. Changing this value immediately updates the button in the touch bar.

#### `touchBarButton.backgroundColor`

A `string` hex code representing the button's current background color. Changing this value immediately updates the button in the touch bar.

#### `touchBarButton.icon`

A `NativeImage` representing the button's current icon. Changing this value immediately updates the button in the touch bar.

#### `touchBarButton.iconPosition`

A `string` - Can be `left`, `right` or `overlay`.  O padrão é `overlay`.

#### `touchBarButton.enabled`

A `boolean` representing whether the button is in an enabled state.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/touch-bar-button.md)
