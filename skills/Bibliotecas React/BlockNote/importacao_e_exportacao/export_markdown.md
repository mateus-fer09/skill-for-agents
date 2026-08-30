---
title: "Markdown Export"
description: "[!NOTE]"
topics:
  - "Importacao e exportacao"
keywords:
  - "Markdown Export"
  - "blocksToMarkdownLossy"
  - "Block"
source_scope:
  - "https://www.blocknotejs.org/docs/features/export/markdown"
---

# [Markdown Export](#markdown-export)

> [!NOTE]
> 

The functions to export to Markdown are considered "lossy"; some information might be dropped when you export Blocks to Markdown.

To serialize Blocks to a non-lossy format (for example, to store the contents of the editor in your backend), simply export the built-in Block format using `JSON.stringify(editor.document)`.

BlockNote can export Blocks to Markdown. Note that this is also considered "lossy", as not all structures can be entirely represented in Markdown.

### [Export Markdown](#export-markdown)

`blocksToMarkdownLossy` converts `Block` objects to a Markdown string:

```tsx
blocksToMarkdownLossy(blocks?: Block[]): string;

// Usage
const markdownFromBlocks = editor.blocksToMarkdownLossy(blocks);
```

`blocks:` The blocks to convert. If not provided, the entire document (all top-level blocks) is used.

`returns:` The blocks, serialized as a Markdown string.

The output is simplified as Markdown does not support all features of BlockNote (e.g.: children of blocks which aren't list items are un-nested and certain styles are removed).

**Demo**
[

Comments

Learn how to enable comments in your BlockNote editor](/docs/features/collaboration/comments)[

HTML

It's possible to export Blocks to HTML, completely client-side.](/docs/features/export/html)
