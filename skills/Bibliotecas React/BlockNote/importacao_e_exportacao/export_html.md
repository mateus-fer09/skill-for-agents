---
title: "HTML Export"
description: "[!NOTE]"
topics:
  - "Importacao e exportacao"
keywords:
  - "HTML Export"
  - "editor.blocksToFullHTML"
  - "blocksToHTMLLossy"
  - "Block"
source_scope:
  - "https://www.blocknotejs.org/docs/features/export/html"
---

# [HTML Export](#html-export)

> [!NOTE]
> 

The functions to export to HTML are considered "lossy"; some information might be dropped when you export Blocks to HTML.

To serialize Blocks to a non-lossy format (for example, to store the contents of the editor in your backend), simply export the built-in Block format using `JSON.stringify(editor.document)`.

## [Export to BlockNote HTML](#export-to-blocknote-html)

Use `editor.blocksToFullHTML` to export blocks with their full HTML structure, the same as BlockNote uses in its rendered HTML.

For example, you an use this for static rendering documents that have been created in the editor.

> [!NOTE]
> 

For the exported HTML to look the same as the editor, make sure to wrap it in the same `div`s that the editor renders, and add the same stylesheets. To learn more, see [this example](/examples/backend/rendering-static-documents).

```tsx
blocksToFullHTML(blocks?: Block[]): string;

// Usage
const HTMLFromBlocks = editor.blocksToFullHTML(blocks);
```

`blocks:` The blocks to convert. If not provided, the entire document (all top-level blocks) is used.

`returns:` The blocks, exported to an HTML string.

## [Export to Interoperable HTML](#export-to-interoperable-html)

The editor exposes functions to convert Blocks to and from HTML for interoperability with other applications.

Converting Blocks to HTML this way will lose some information such as the nesting of nodes in order to export a simple HTML structure.

Use `blocksToHTMLLossy` to export `Block` objects to an HTML string:

```tsx
blocksToHTMLLossy(blocks?: Block[]): string;

// Usage
const HTMLFromBlocks = editor.blocksToHTMLLossy(blocks);
```

`blocks:` The blocks to convert. If not provided, the entire document (all top-level blocks) is used.

`returns:` The blocks, exported to an HTML string.

To better conform to HTML standards, children of blocks which aren't list items are un-nested in the output HTML.

**Demo**
[

Markdown

It's possible to export Blocks to Markdown, completely client-side.](/docs/features/export/markdown)[

PDF

Export BlockNote documents to a PDF.](/docs/features/export/pdf)
