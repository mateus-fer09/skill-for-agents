---
title: "BlockNote API Overview"
description: "The BlockNote editor API is a comprehensive set of functions and methods that allow you to interact with the editor and manipulate its content."
topics:
  - "Referencia da api"
keywords:
  - "BlockNote API Overview"
  - "isEditable"
  - "false"
  - "focus"
  - "undo"
  - "redo"
  - "BlockNoteEditor.create"
source_scope:
  - "https://www.blocknotejs.org/docs/reference/editor/overview"
---

# [BlockNote API Overview](#blocknote-api-overview)

The BlockNote editor API is a comprehensive set of functions and methods that allow you to interact with the editor and manipulate its content.

## [Editable](#editable)

The editor is editable by default, but you can make it read-only by setting the `isEditable` property to `false`.

```tsx
editor.isEditable = false;
```

## [Focus](#focus)

To focus the editor, you can use the `focus` method.

```tsx
editor.focus();
```

Check if the editor has focus.

```tsx
const isFocused = editor.isFocused();
```

## [Undo/Redo](#undoredo)

To undo the last operation, you can use the `undo` method.

```tsx
editor.undo();
```

To redo the last undone operation, you can use the `redo` method.

```tsx
editor.redo();
```

## [Events](#events)

To read more about events, see the [Events](/docs/reference/editor/events) reference.

## [Document Manipulation](#document-manipulation)

To read more about block manipulation, see the [Block Manipulation](/docs/reference/editor/manipulating-content#block-manipulation) reference.
To read more about inline content manipulation, see the [Inline Content Manipulation](/docs/reference/editor/manipulating-content#inline-content-manipulation) reference.

### [Transactions](#transactions)

BlockNote supports transactions, which allow you to group multiple changes into a single operation. This is useful for a better user experience, since undo/redo of changes is much more natural.

```tsx
// ✅ Good - This is a single undo/redo operation
editor.transact(() => {
  editor.insertBlocks([{ type: "paragraph", content: "Hello, world!" }], "abc");
  editor.replaceBlocks([{ id: "123" }], {
    type: "paragraph",
    content: "Hello, world!",
  });
});

// ❌ Avoid - This is two separate undo/redo operations
editor.insertBlocks([{ type: "paragraph", content: "Hello, world!" }], "abc");
editor.replaceBlocks([{ id: "123" }], {
  type: "paragraph",
  content: "Hello, world!",
});
```

## [Cursor & Selections](#cursor--selections)

To read more about cursor and selection manipulation, see the [Cursor & Selections](/docs/reference/editor/cursor-selections) reference.

## [Paste Operations](#paste-operations)

### [Paste HTML](#paste-html)

Paste HTML content into the editor.

```tsx
// Paste and convert to BlockNote format (default)
editor.pasteHTML("<p>Hello, world!</p>");

// Paste as raw HTML
editor.pasteHTML("<p>Hello, world!</p>", true);
```

### [Paste Text](#paste-text)

Paste text content into the editor.

```tsx
editor.pasteText("Hello, world!");
```

### [Paste Markdown](#paste-markdown)

Paste Markdown content into the editor.

```tsx
editor.pasteMarkdown("# Hello\n\nThis is **bold** text.");
```

## [Options](#options)

The editor can be configured with the following options when using `BlockNoteEditor.create`:

Prop

Type

## [YJS Utilities](#yjs-utilities)

BlockNote provides utilities for working with YJS collaborative documents. These utilities allow you to convert between BlockNote blocks and YJS documents programmatically.

To read more about YJS utilities, see the [YJS Utilities](/docs/reference/editor/yjs-utilities) reference.

## [Related Documentation](#related-documentation)

For more detailed information about specific areas:

- [Manipulating Content](/docs/foundations/manipulating-content) - Reading and writing document Content

- [Block Types](/docs/features/blocks) - Understanding different block types
