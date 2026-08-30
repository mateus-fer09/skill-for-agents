---
title: "Link Toolbar"
description: "The Link Toolbar appears whenever you hover a link in the editor."
topics:
  - "Componentes react"
keywords:
  - "Link Toolbar"
  - "AlertButton"
  - "useComponentsContext"
  - "Components.LinkToolbar.Button"
  - "LinkToolbar"
  - "LinkToolbarController"
  - "BlockNoteView"
source_scope:
  - "https://www.blocknotejs.org/docs/react/components/hyperlink-toolbar"
---

# [Link Toolbar](#link-toolbar)

The Link Toolbar appears whenever you hover a link in the editor.

## [Changing the Link Toolbar](#changing-the-link-toolbar)

You can change or replace the Link Toolbar with your own React component. In the demo below, a button is added to the default Link Toolbar, which opens a browser alert.

We first define our custom `AlertButton`. The `useComponentsContext` hook gets all components used internally by BlockNote, so we want to use `Components.LinkToolbar.Button` for this.

We use the `LinkToolbar` component to create a custom Link Toolbar. By specifying its children, we can replace the default buttons in the toolbar with our own.

This custom Link Toolbar is passed to a `LinkToolbarController`, which controls its position and visibility (above or below the hovered link).

Setting `linkToolbar={false}` on `BlockNoteView` tells BlockNote not to show the default Link Toolbar.[

Grid Suggestion Menus

In addition to displaying Suggestion Menus as stacks, BlockNote also supports displaying them as grids.](/docs/react/components/grid-suggestion-menus)[

File Panel

The File Panel appears whenever you select an image that doesn't have a URL, or when you click the "Replace File" button in the Formatting Panel when an image is selected.](/docs/react/components/image-toolbar)
