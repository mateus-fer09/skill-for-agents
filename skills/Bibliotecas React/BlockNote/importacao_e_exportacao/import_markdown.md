---
title: "Markdown Import"
description: "[!NOTE]"
topics:
  - "Importacao e exportacao"
keywords:
  - "Markdown Import"
  - "marked"
  - "remark"
  - "tryParseHTMLToBlocks"
  - "tryParseMarkdownToBlocks"
  - "Block"
  - "InlineContent"
  - "ServerBlockNoteEditor"
source_scope:
  - "https://www.blocknotejs.org/docs/features/import/markdown"
---

# [Markdown Import](#markdown-import)

> [!NOTE]
> 

The functions to import from Markdown are considered "lossy"; some information might be dropped when converting Markdown to Blocks.

To serialize Blocks to a non-lossy format (for example, to store the contents of the editor in your backend), simply export the built-in Block format using `JSON.stringify(editor.document)`.

BlockNote can import Markdown content into Block objects. Note that this is considered "lossy", as not all Markdown structures can be entirely represented as BlockNote blocks.

> [!NOTE]
> 

**BlockNote ships a minimal Markdown parser.** It covers the common subset used by most users (CommonMark + GFM basics: headings, paragraphs, lists, task lists, tables, code, blockquotes, links, images, emphasis, strikethrough, hard breaks).

There are many Markdown specifications (CommonMark, GFM, MDX, Pandoc, and various dialect-specific extensions) and supporting all of them inside a rich text editor is not a goal of BlockNote. **If you need to handle Markdown beyond this minimal subset, parse it to HTML yourself with a parser of your choice (e.g. [`marked`](https://github.com/markedjs/marked), [`markdown-it`](https://github.com/markdown-it/markdown-it), or [`remark`](https://github.com/remarkjs/remark)) and pass the resulting HTML to [`tryParseHTMLToBlocks`](/docs/features/import) instead.** BlockNote's HTML interoperability is much broader, since HTML is the format the editor uses internally for arbitrary pastes.

## [Markdown to Blocks](#markdown-to-blocks)

Use `tryParseMarkdownToBlocks` to try parsing a Markdown string into `Block` objects:

```tsx
tryParseMarkdownToBlocks(markdown: string): Block[];

// Usage
const blocksFromMarkdown = editor.tryParseMarkdownToBlocks(markdown);
```

`returns:` The blocks parsed from the Markdown string.

Tries to create `Block` and `InlineContent` objects based on Markdown syntax, though not all symbols are recognized. If BlockNote doesn't recognize a symbol, it will parse it as text.

**Demo**
[

HTML

It's possible to export or import Blocks to and from HTML.](/docs/features/import/html)[

Server-side processing

Use `ServerBlockNoteEditor` to process Blocks on the server.](/docs/features/server-processing)
