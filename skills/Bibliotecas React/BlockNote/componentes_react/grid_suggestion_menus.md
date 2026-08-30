---
title: "Grid Suggestion Menus"
description: "Grid Suggestion Menus appear when the user enters a trigger character, and text after the character is used to filter the menu items."
topics:
  - "Componentes react"
keywords:
  - "Grid Suggestion Menus"
  - "BlockNoteView"
  - "GridSuggestionMenuController"
  - "gridSuggestionMenuComponent"
  - "getItems"
source_scope:
  - "https://www.blocknotejs.org/docs/react/components/grid-suggestion-menus"
---

# [Grid Suggestion Menus](#grid-suggestion-menus)

Grid Suggestion Menus appear when the user enters a trigger character, and text after the character is used to filter the menu items.

Grid Suggestion Menus are similar to regular Suggestion Menus, but results are organized in a grid, and users can use all arrow keys (including left, right) on their keyboard to navigate the results.

## [Emoji Picker](#emoji-picker)

The Emoji Picker is a Grid Suggestion Menu that opens with the `:` character (or when selecting emoji item in the Slash Menu).

It only displays once the user types 2 non-whitespace characters a query, to minimize cases where the user only wants to enter the `:` character.

### [Changing Emoji Picker Columns](#changing-emoji-picker-columns)

By default, the Emoji Picker is rendered with 10 columns, but you can change this to any amount. In the demo below, the Emoji Picker is changed to only display 5 columns.

Passing `emojiPicker={false}` to `BlockNoteView` tells BlockNote not to show the default Emoji Picker. Adding the `GridSuggestionMenuController` with `triggerCharacter={":"}` and `columns={5}` tells BlockNote to show one with 5 columns instead.

### [Replacing the Emoji Picker Component](#replacing-the-emoji-picker-component)

You can replace the React component used for the Emoji Picker with your own, as you can see in the demo below.

Again, we add a `GridSuggestionMenuController` component with `triggerCharacter={":"}` and set `emojiPicker={false}` to replace the default Emoji Picker.

Now, we also pass a component to its `gridSuggestionMenuComponent` prop. The `gridSuggestionMenuComponent` we pass is responsible for rendering the filtered items. The `GridSuggestionMenuController` controls its position and visibility (below the trigger character), and it also determines which items should be shown. Since we don't specify which items to show (the `getItems` prop isn't defined), it will use the default items for a grid, which are the emojis.

## [Creating additional Grid Suggestion Menus](#creating-additional-grid-suggestion-menus)

You can add additional Grid Suggestion Menus to the editor, which can use any trigger character. The demo below adds an example Grid Suggestion Menu for mentions, where each item is the first character of the user's name, and opens with the `@` character.

Changing the column count in the new Grid Suggestion Menu, or the component used to render it, is done the same way as for the [Emoji Picker](/docs/react/components/suggestion-menus). For more information about how the mentions elements work, see [Custom Inline Content](/docs/features/custom-schemas/custom-inline-content).[

Formatting Toolbar

The Formatting Toolbar appears whenever you highlight text in the editor.](/docs/react/components/formatting-toolbar)[

Link Toolbar

The Link Toolbar appears whenever you hover a link in the editor.](/docs/react/components/hyperlink-toolbar)
