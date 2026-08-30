---
title: "Adding DOM Attributes"
description: "BlockNote allows you to add custom HTML attributes to various DOM elements within the editor. This gives you fine-grained control over styling and functionality."
topics:
  - "Estilizacao e temas"
keywords:
  - "Adding DOM Attributes"
  - "editor"
  - "block"
  - "blockGroup"
  - "blockContent"
  - "inlineContent"
source_scope:
  - "https://www.blocknotejs.org/docs/react/styling-theming/adding-dom-attributes"
---

# [Adding DOM Attributes](#adding-dom-attributes)

BlockNote allows you to add custom HTML attributes to various DOM elements within the editor. This gives you fine-grained control over styling and functionality.

## [Available DOM Elements](#available-dom-elements)

The following DOM elements can receive custom attributes:

- **`editor`**: The main editor container, excluding menus & toolbars

- **`block`**: The container element for individual blocks

- **`blockGroup`**: Wrapper for top-level and nested blocks

- **`blockContent`**: Wrapper for a block's content

- **`inlineContent`**: Wrapper for rich-text content within blocks

## [Example Usage](#example-usage)

The demo below shows how to add a custom class to the `block` element to create a border around each block:
[

Overriding CSS

You can change any styles applied to the editor by setting your own CSS styles.](/docs/react/styling-theming/overriding-css)[

Overview

An overview of the BlockNote editor API.](/docs/reference/editor/overview)
