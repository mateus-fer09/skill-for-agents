---
title: "HTML Import"
description: "It's possible to import HTML content into BlockNote blocks, completely client-side."
topics:
  - "Importacao e exportacao"
keywords:
  - "HTML Import"
  - "tryParseHTMLToBlocks"
  - "Block"
  - "InlineContent"
source_scope:
  - "https://www.blocknotejs.org/docs/features/import/html"
---

# [HTML Import](#html-import)

It's possible to import HTML content into BlockNote blocks, completely client-side.

> [!NOTE]
> 

The functions to import from HTML are considered "lossy"; some information might be dropped when converting HTML to Blocks.

To serialize Blocks to a non-lossy format (for example, to store the contents of the editor in your backend), simply export the built-in Block format using `JSON.stringify(editor.document)`.

### [HTML to Blocks](#html-to-blocks)

Use `tryParseHTMLToBlocks` to parse an HTML string to `Block` objects:

```tsx
tryParseHTMLToBlocks(html: string): Block[];

// Usage
const blocksFromHTML = editor.tryParseHTMLToBlocks(html);
```

`returns:` The blocks parsed from the HTML string.

Tries to create `Block` objects out of any HTML block-level elements, and `InlineContent` objects from any HTML inline elements, though not all HTML tags are recognized. If BlockNote doesn't recognize an element's tag, it will parse it as a paragraph or plain text.

**Demo**
[

Import

It's possible to import content into BlockNote.](/docs/features/import)[

Markdown

It's possible to import Markdown content into BlockNote blocks, completely client-side.](/docs/features/import/markdown)
