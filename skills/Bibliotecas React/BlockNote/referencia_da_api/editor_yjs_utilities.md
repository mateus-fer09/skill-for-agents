---
title: "YJS Utilities"
description: "The @blocknote/core/yjs export provides utilities for converting between BlockNote blocks and YJS collaborative documents. These utilities are useful when you need to work with YJS"
topics:
  - "Referencia da api"
keywords:
  - "YJS Utilities"
  - "blocksToYDoc"
  - "editor"
  - "blocks"
  - "xmlFragment"
  - "blocksToYXmlFragment"
source_scope:
  - "https://www.blocknotejs.org/docs/reference/editor/yjs-utilities"
---

# [YJS Utilities](#yjs-utilities)

The `@blocknote/core/yjs` export provides utilities for converting between BlockNote blocks and YJS collaborative documents. These utilities are useful when you need to work with YJS documents outside of the standard collaboration setup, such as importing existing content or working with YJS documents programmatically.

> [!NOTE]
> 

**Important:** This package is for advanced use cases where you need to
convert between BlockNote blocks and YJS documents programmatically. For most
use cases, you should use the [collaboration
features](/docs/features/collaboration) directly instead.

## [Import](#import)

```tsx
import {
  blocksToYDoc,
  blocksToYXmlFragment,
  yDocToBlocks,
  yXmlFragmentToBlocks,
} from "@blocknote/core/yjs";
```

## [Overview](#overview)

YJS utilities enable bidirectional conversion between:

- **BlockNote blocks** ↔ **Y.Doc** (YJS document)

- **BlockNote blocks** ↔ **Y.XmlFragment** (YJS XML fragment)

These conversions are essential for:

- Importing existing BlockNote content into a YJS document for collaboration

- Exporting content from a YJS document back to BlockNote blocks

- Working with YJS documents programmatically without an active editor instance

## [Converting Blocks to YJS Documents](#converting-blocks-to-yjs-documents)

### [`blocksToYDoc`](#blockstoydoc)

Converts BlockNote blocks into a Y.Doc. This is useful when importing existing content to a Y.Doc for the first time.

> [!NOTE]
> 

**Important:** This should not be used to rehydrate a Y.Doc from a database
once collaboration has begun, as all history will be lost.

```tsx
function blocksToYDoc<
  BSchema extends BlockSchema,
  ISchema extends InlineContentSchema,
  SSchema extends StyleSchema,
>(
  editor: BlockNoteEditor<BSchema, ISchema, SSchema>,
  blocks: PartialBlock<BSchema, ISchema, SSchema>[],
  xmlFragment?: string,
): Y.Doc;
```

**Parameters:**

- `editor` - The BlockNote editor instance

- `blocks` - Array of blocks to convert

- `xmlFragment` - Optional XML fragment name (defaults to `"prosemirror"`)

**Returns:** A new Y.Doc containing the converted blocks

**Example:**

```tsx
import { BlockNoteEditor } from "@blocknote/core";
import { blocksToYDoc } from "@blocknote/core/yjs";
import * as Y from "yjs";

const editor = BlockNoteEditor.create();

const blocks = [
  {
    type: "paragraph",
    content: "Hello, world!",
  },
  {
    type: "heading",
    props: { level: 1 },
    content: "My Document",
  },
];

// Convert blocks to Y.Doc
const ydoc = blocksToYDoc(editor, blocks);

// Now you can use this Y.Doc with a YJS provider for collaboration
const provider = new WebrtcProvider("my-room", ydoc);
```

### [`blocksToYXmlFragment`](#blockstoyxmlfragment)

Converts BlockNote blocks into a Y.XmlFragment. This is useful when you want to work with a specific XML fragment within a Y.Doc.

```tsx
function blocksToYXmlFragment<
  BSchema extends BlockSchema,
  ISchema extends InlineContentSchema,
  SSchema extends StyleSchema,
>(
  editor: BlockNoteEditor<BSchema, ISchema, SSchema>,
  blocks: Block<BSchema, ISchema, SSchema>[],
  xmlFragment?: Y.XmlFragment,
): Y.XmlFragment;
```

**Parameters:**

- `editor` - The BlockNote editor instance

- `blocks` - Array of blocks to convert

- `xmlFragment` - Optional existing Y.XmlFragment to populate (creates new one if not provided)

**Returns:** A Y.XmlFragment containing the converted blocks

**Example:**

```tsx
import { BlockNoteEditor } from "@blocknote/core";
import { blocksToYXmlFragment } from "@blocknote/core/yjs";
import * as Y from "yjs";

const editor = BlockNoteEditor.create();
const doc = new Y.Doc();
const fragment = doc.getXmlFragment("my-fragment");

const blocks = [
  {
    type: "paragraph",
    content: "Content for fragment",
  },
];

// Convert blocks to the XML fragment
blocksToYXmlFragment(editor, blocks, fragment);
```

## [Converting YJS Documents to Blocks](#converting-yjs-documents-to-blocks)

### [`yDocToBlocks`](#ydoctoblocks)

Converts a Y.Doc back into BlockNote blocks. This is useful for reading content from a YJS document.

```tsx
function yDocToBlocks<
  BSchema extends BlockSchema,
  ISchema extends InlineContentSchema,
  SSchema extends StyleSchema,
>(
  editor: BlockNoteEditor<BSchema, ISchema, SSchema>,
  ydoc: Y.Doc,
  xmlFragment?: string,
): Block<BSchema, ISchema, SSchema>[];
```

**Parameters:**

- `editor` - The BlockNote editor instance

- `ydoc` - The Y.Doc to convert

- `xmlFragment` - Optional XML fragment name (defaults to `"prosemirror"`)

**Returns:** Array of BlockNote blocks

**Example:**

```tsx
import { BlockNoteEditor } from "@blocknote/core";
import { yDocToBlocks } from "@blocknote/core/yjs";
import * as Y from "yjs";

const editor = BlockNoteEditor.create();
const ydoc = new Y.Doc();

// ... Y.Doc is populated through collaboration or other means ...

// Convert Y.Doc back to blocks
const blocks = yDocToBlocks(editor, ydoc);

console.log(blocks); // Array of BlockNote blocks
```

### [`yXmlFragmentToBlocks`](#yxmlfragmenttoblocks)

Converts a Y.XmlFragment back into BlockNote blocks.

```tsx
function yXmlFragmentToBlocks<
  BSchema extends BlockSchema,
  ISchema extends InlineContentSchema,
  SSchema extends StyleSchema,
>(
  editor: BlockNoteEditor<BSchema, ISchema, SSchema>,
  xmlFragment: Y.XmlFragment,
): Block<BSchema, ISchema, SSchema>[];
```

**Parameters:**

- `editor` - The BlockNote editor instance

- `xmlFragment` - The Y.XmlFragment to convert

**Returns:** Array of BlockNote blocks

**Example:**

```tsx
import { BlockNoteEditor } from "@blocknote/core";
import { yXmlFragmentToBlocks } from "@blocknote/core/yjs";
import * as Y from "yjs";

const editor = BlockNoteEditor.create();
const doc = new Y.Doc();
const fragment = doc.getXmlFragment("my-fragment");

// ... Fragment is populated through collaboration or other means ...

// Convert fragment back to blocks
const blocks = yXmlFragmentToBlocks(editor, fragment);
```

## [Round-trip Conversion](#round-trip-conversion)

All conversion functions support round-trip conversion, meaning you can convert blocks → YJS → blocks and get back the same content:

```tsx
import { BlockNoteEditor } from "@blocknote/core";
import { blocksToYDoc, yDocToBlocks } from "@blocknote/core/yjs";

const editor = BlockNoteEditor.create();

const originalBlocks = [
  {
    type: "paragraph",
    content: "Test content",
  },
];

// Convert to Y.Doc and back
const ydoc = blocksToYDoc(editor, originalBlocks);
const convertedBlocks = yDocToBlocks(editor, ydoc);

// originalBlocks and convertedBlocks are equivalent
console.log(originalBlocks); // Same structure as convertedBlocks
```

## [Related Documentation](#related-documentation)

- [Real-time Collaboration](/docs/features/collaboration) - Learn how to set up collaboration in BlockNote

- [Manipulating Content](/docs/reference/editor/manipulating-content) - Working with blocks and inline content

- [Server Processing](/docs/features/server-processing) - Server-side processing for BlockNote (uses these YJS utilities internally)
