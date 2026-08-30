---
title: "Class: TouchBarScrubber"
description: "## Class: TouchBarScrubber"
topics:
  - "Api"
keywords:
  - "Class: TouchBarScrubber"
  - "options"
  - "items"
  - "select"
  - "selectedIndex"
  - "highlight"
  - "highlightedIndex"
  - "selectedStyle"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/touch-bar-scrubber"
---

# Class: TouchBarScrubber

## Class: TouchBarScrubber

> 

Create a scrubber (a scrollable selector)

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### `new TouchBarScrubber(options)`

- `options` Object

  - `items` [ScrubberItem[]](/pt/docs/latest/api/structures/scrubber-item) - An array of items to place in this scrubber.

  - `select` Function (optional) - Called when the user taps an item that was not the last tapped item.

    - `selectedIndex` Integer - The index of the item the user selected.

  - `highlight` Function (optional) - Called when the user taps any item.

    - `highlightedIndex` Integer - The index of the item the user touched.

  - `selectedStyle` string (optional) - Selected item style. Can be `background`, `outline` or `none`. O padrão é `none`.

  - `overlayStyle` string (optional) - Selected overlay item style. Can be `background`, `outline` or `none`. O padrão é `none`.

  - `showArrowButtons` boolean (optional) - Whether to show arrow buttons. Defaults to `false` and is only shown if `items` is non-empty.

  - `mode` string (optional) - Can be `fixed` or `free`. O padrão é `free`.

  - `continuous` boolean (optional) - Defaults to `true`.

### Propriedades da Instância

As seguintes propriedades estão disponíveis em instâncias de `TouchBarScrubber`:

#### `touchBarScrubber.items`

A `ScrubberItem[]` array representing the items in this scrubber. Updating this value immediately updates the control in the touch bar. Updating deep properties inside this array **does not update the touch bar**.

#### `touchBarScrubber.selectedStyle`

A `string` representing the style that selected items in the scrubber should have. Updating this value immediately updates the control in the touch bar. Valores possíveis:

- `background` - Maps to `[NSScrubberSelectionStyle roundedBackgroundStyle]`.

- `outline` - Maps to `[NSScrubberSelectionStyle outlineOverlayStyle]`.

- `none` - Removes all styles.

#### `touchBarScrubber.overlayStyle`

A `string` representing the style that selected items in the scrubber should have. This style is overlaid on top of the scrubber item instead of being placed behind it. Updating this value immediately updates the control in the touch bar. Valores possíveis:

- `background` - Maps to `[NSScrubberSelectionStyle roundedBackgroundStyle]`.

- `outline` - Maps to `[NSScrubberSelectionStyle outlineOverlayStyle]`.

- `none` - Removes all styles.

#### `touchBarScrubber.showArrowButtons`

A `boolean` representing whether to show the left / right selection arrows in this scrubber. Updating this value immediately updates the control in the touch bar.

#### `touchBarScrubber.mode`

A `string` representing the mode of this scrubber. Updating this value immediately updates the control in the touch bar. Valores possíveis:

- `fixed` - Maps to `NSScrubberModeFixed`.

- `free` - Maps to `NSScrubberModeFree`.

#### `touchBarScrubber.continuous`

A `boolean` representing whether this scrubber is continuous or not. Updating this value immediately updates the control in the touch bar.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/touch-bar-scrubber.md)
