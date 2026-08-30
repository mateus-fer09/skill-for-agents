---
title: "Overriding CSS"
description: "BlockNote provides several ways to customize the editor's appearance through CSS. You can override default styles using CSS classes and attributes."
topics:
  - "Estilizacao e temas"
keywords:
  - "Overriding CSS"
  - "blockType"
source_scope:
  - "https://www.blocknotejs.org/docs/react/styling-theming/overriding-css"
---

# [Overriding CSS](#overriding-css)

BlockNote provides several ways to customize the editor's appearance through CSS. You can override default styles using CSS classes and attributes.

## [Basic Example](#basic-example)

In the demo below, we create additional CSS rules to make the editor text and hovered slash menu items blue:

## [CSS Selectors Reference](#css-selectors-reference)

### [BlockNote CSS Classes](#blocknote-css-classes)

BlockNote uses classes with the `bn-` prefix to style editor elements. Here are the key classes you can target:

#### [Editor Structure](#editor-structure)

- `.bn-root`: Container class both the floating menus / toolbars and the editor

- `.bn-container`: Container around `.bn-editor`

- `.bn-editor`: Main editor element (the "contenteditable").

- `.bn-block`: Individual block element (including nested).

- `.bn-block-group`: Container for nested blocks.

- `.bn-block-content`: Block content wrapper.

- `.bn-inline-content`: Block's editable rich text content.

#### [UI Components](#ui-components)

- `.bn-toolbar`: Formatting & link toolbars.

- `.bn-side-menu`: Side menu element.

- `.bn-drag-handle-menu`: Drag handle menu.

- `.bn-suggestion-menu`: Suggestion menu.

### [BlockNote CSS Attributes](#blocknote-css-attributes)

BlockNote uses data attributes to target specific block types and properties:

- `[data-content-type="blockType"]`: Targets blocks of type `blockType`.

- `[data-propName="propValue"]`: Targets blocks with specific prop values. If the value is the same as the default value, the `data-propName` attribute will not be added.

[

Themes

Themes let you quickly change the basic look of the editor UI, including colors, borders, shadows, and font.](/docs/react/styling-theming/themes)[

Adding DOM Attributes

BlockNote allows you to change how the editor UI looks. You can change the theme of the default UI, or override its CSS styles.](/docs/react/styling-theming/adding-dom-attributes)
