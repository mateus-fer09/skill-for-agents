---
title: "Importing Content"
description: "There are two main paths to importing content into BlockNote:"
topics:
  - "Importacao e exportacao"
keywords:
  - "Importing Content"
  - "editor.tryParseHTMLToBlocks"
  - "editor.blocksToHTMLLossy"
source_scope:
  - "https://www.blocknotejs.org/docs/features/import"
---

# [Importing Content](#importing-content)

There are two main paths to importing content into BlockNote:

- **HTML**: (Recommended) Import HTML content into BlockNote.

- **Markdown**: Import Markdown content into BlockNote.

## [Migrating Between Editors](#migrating-between-editors)

When switching editors, there are several migration strategies to consider:

- **Legacy Editor Approach**: Keep both the old and new editors running in parallel. Use the legacy editor for existing content while creating new content in BlockNote.

  - Minimizes disruption to your existing application

  - Can segment usage by content type, organization, or other criteria

- **Hard Cutoff**: Migrate all content at once on a specific date

  - Provides a clean break and fresh start

  - May require more upfront preparation

- **Gradual Migration**: Convert content progressively, such as when files are opened

  - Smoother transition with less immediate impact

  - Migration period may extend over a longer time

Choose the strategy that best fits your specific needs and constraints.

### [Importing to BlockNote](#importing-to-blocknote)

The recommended approach for importing content into BlockNote is to convert your source content to HTML first, then use `editor.tryParseHTMLToBlocks`:

```tsx
const existingContent = "<p>This is a paragraph.</p>";

const blocks = await editor.tryParseHTMLToBlocks(existingContent);

await storeToDB(blocks);
```

> [!NOTE]
> 

For details on server-side processing, see our [server-side
guide](/docs/features/server-processing).

### [Migrating from BlockNote](#migrating-from-blocknote)

To migrate content out of BlockNote, convert it to HTML using the `editor.blocksToHTMLLossy` method.

HTML is widely supported and can be easily imported into most other editors.

> [!NOTE]
> 

For details on server-side processing, see our [server-side
guide](/docs/features/server-processing).[

ODT

Export BlockNote documents to an ODT (Open Document Text) file.](/docs/features/export/odt)[

HTML

It's possible to export or import Blocks to and from HTML.](/docs/features/import/html)
