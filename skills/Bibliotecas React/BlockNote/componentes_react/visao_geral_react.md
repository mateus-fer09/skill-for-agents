---
title: "Using BlockNote With React"
description: "BlockNote provides a powerful React integration that makes it easy to add rich text editing capabilities to your applications. The React bindings offer a declarative API that integ"
topics:
  - "Componentes react"
keywords:
  - "Using BlockNote With React"
  - "useCreateBlockNote"
  - "BlockNoteView"
  - "BlockNoteEditor"
  - "useEditorChange"
  - "useEditorSelectionChange"
source_scope:
  - "https://www.blocknotejs.org/docs/react/overview"
---

# [Using BlockNote With React](#using-blocknote-with-react)

BlockNote provides a powerful React integration that makes it easy to add rich text editing capabilities to your applications. The React bindings offer a declarative API that integrates seamlessly with React's component model and state management patterns.

## [Key Components](#key-components)

The React integration centers around two main pieces:

- **`useCreateBlockNote`** - A React hook that creates and manages editor instances

- **`BlockNoteView`** - A component that renders the editor with a complete UI

## [Quick Start](#quick-start)

Here's a minimal example of how to integrate BlockNote into a React component:

```tsx
import React from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
// Or, you can use ariakit, shadcn, etc.

function MyEditor() {
  const editor = useCreateBlockNote();

  return <BlockNoteView editor={editor} />;
}
```

This gives you a fully functional editor with:

- Text editing and formatting

- Block types (paragraphs, headings, lists, etc.)

- Toolbar for formatting options

- Side menu for block operations

## [BlockNoteView](#blocknoteview)

The `<BlockNoteView>` component is used to render the editor. It also provides a number of props for editor specific events.

### [Props](#props)

Prop

Type

## [Hooks](#hooks)

### [useCreateBlockNote](#usecreateblocknote)

The `useCreateBlockNote` hook is used to create a new `BlockNoteEditor` instance.

```tsx
declare function (
  ?: ,
  ?: React.,
): ;
```

### [useEditorChange](#useeditorchange)

The `useEditorChange` hook is used to listen for changes to the editor.

```tsx
declare function (
  : (
    : ,
    : {
      /**
       * Returns the blocks that were inserted, updated, or deleted by the change that occurred.
       */
      (): ;
    },
  ) => void,
  ?: ,
): ;
```

### [useEditorSelectionChange](#useeditorselectionchange)

The `useEditorSelectionChange` hook is used to listen for changes to the editor selection.

```tsx
declare function (
  /**
   * Callback that runs when the editor's selection changes.
   */
  : () => void,
  ?: ,
): ;
```

## [Next Steps](#next-steps)

The editor is now ready to use! Start typing and explore the various block types and formatting options available in the toolbar.

Now that you have a basic editor working, you can explore:

- [Built-in Block Types](/docs/features/blocks) - Learn about what types of content the BlockNote editor supports by default

- [Styling & Theming](/docs/react/styling-theming) - Customize how the editor looks and feels

- [Custom UI Elements](/docs/react/components) - Replace the default UI components to really personalize your editor

- [Custom Schemas](/docs/features/custom-schemas) - Expand the types of content that users can add to the editor

- [Examples](/examples) - Browse a library of examples created by the BlockNote maintainers and community members

[

Source with Preview Blocks

Build custom blocks and inline content that are authored as source code but rendered as a preview — like BlockNote's math and diagram blocks.](/docs/features/custom-schemas/source-with-preview)[

UI Components

BlockNote includes a number of UI Components (like menus and toolbars) that can be completely customized.](/docs/react/components)
