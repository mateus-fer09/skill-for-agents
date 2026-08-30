---
title: "Manipulating Blocks"
description: "BlockNote operates on a block-based architecture , where all content is organized into discrete blocks. Understanding how to manipulate these blocks is fundamental to working with "
topics:
  - "Introducao e fundamentos"
keywords:
  - "Manipulating Blocks"
source_scope:
  - "https://www.blocknotejs.org/docs/foundations/manipulating-content"
---

# [Manipulating Blocks](#manipulating-blocks)

BlockNote operates on a **block-based architecture**, where all content is organized into discrete blocks. Understanding how to manipulate these blocks is fundamental to working with BlockNote effectively.

## [Block-Based Architecture](#block-based-architecture)

In BlockNote, everything is a block. A paragraph is a block, a heading is a block, a list item is a block, and even complex structures like tables are composed of blocks. This unified approach makes document manipulation consistent and predictable.

## [Core Block Operations](#core-block-operations)

BlockNote provides a comprehensive set of operations for manipulating blocks, all working at the block level:

### [Reading Blocks](#reading-blocks)

- **Get the entire document** - Retrieve all top-level blocks

- **Get specific blocks** - Access individual blocks by ID or reference

- **Navigate relationships** - Find previous, next, or parent blocks

- **Traverse all blocks** - Iterate through the entire document structure

[See more in the API reference](/docs/reference/editor/manipulating-content#reading-blocks)

```tsx
// Get the entire document
const document: Block[] = editor.document;

// Get a specific block
const block = editor.getBlock(blockId);

// Get the previous block
const previousBlock = editor.getPreviousBlock(blockId);

// Get the next block
const nextBlock = editor.getNextBlock(blockId);
```

### [Creating Blocks](#creating-blocks)

- **Insert new blocks** - Add blocks before or after existing ones

- **Create complex structures** - Build nested blocks like lists and tables

- **Generate blocks programmatically** - Create blocks from data or user input

[See more in the API reference](/docs/reference/editor/manipulating-content#inserting-blocks)

```tsx
// Insert a simple paragraph block
editor.insertBlocks(
  [{ type: "paragraph", content: "Hello, world!" }],
  referenceBlock,
);

// Create a complex block structure
editor.insertBlocks(
  [
    { type: "heading", content: "My Heading" },
    { type: "paragraph", content: "Some content" },
    { type: "bulletListItem", content: "List item 1" },
    { type: "bulletListItem", content: "List item 2" },
  ],
  referenceBlock,
);
```

### [Modifying Blocks](#modifying-blocks)

- **Update existing blocks** - Change block type, content, or properties

- **Replace blocks** - Swap one or more blocks with new blocks

- **Move blocks** - Reorder blocks by moving them up or down

- **Nest and unnest** - Change the hierarchy by indenting or outdenting blocks

[See more in the API reference](/docs/reference/editor/manipulating-content#updating-blocks)

```tsx
// Change a block's type
editor.updateBlock(blockId, { type: "heading" });

// Update block content and properties
editor.updateBlock(blockId, {
  content: "Updated content",
  props: { level: 2 },
});
```

### [Removing Blocks](#removing-blocks)

- **Delete specific blocks** - Remove individual blocks or groups of blocks

- **Clear selections** - Remove blocks based on user selection

[See more in the API reference](/docs/reference/editor/manipulating-content#removing-blocks)

```tsx
// Remove specific blocks
editor.removeBlocks([blockId1, blockId2]);

// Replace blocks with new blocks
editor.replaceBlocks(
  [oldBlockId],
  [{ type: "paragraph", content: "New content" }],
);
```

## [Working with Cursor and Selections](#working-with-cursor-and-selections)

- **Read cursor position** - Get information about where the user's cursor is located

- **Set cursor position** - Move the cursor to specific blocks

- **Read selections** - Access blocks currently selected by the user

- **Set selections** - Programmatically select ranges of blocks

[See more in the API reference](/docs/reference/editor/cursor-selections)

```tsx
// Get cursor position information
const cursorPosition = editor.getTextCursorPosition();

// Set cursor to a specific block
editor.setTextCursorPosition(blockId, "start");

// Get current selection
const selection = editor.getSelection();

// Set selection programmatically
editor.setSelection(startBlockId, endBlockId);
```

## [Best Practices](#best-practices)

1. **Work with block references** - Use existing blocks as references for positioning new blocks

2. **Handle errors gracefully** - Operations can fail if blocks don't exist or are invalid

3. **Consider user experience** - Think about how your block manipulations affect the user's workflow

4. **Group related operations** - Use [transactions](/docs/reference/editor/overview#transactions) to group multiple block changes into a single undo/redo operation

## [Next Steps](#next-steps)

This overview covers the fundamental concepts of block manipulation in BlockNote. For detailed API reference and specific examples, see:

- [Manipulating Blocks Reference](/docs/reference/editor/manipulating-content) - Complete API documentation

- [Cursor & Selections](/docs/reference/editor/cursor-selections) - Working with user selections

- [Block Types](/docs/features/blocks) - Understanding different block types and their properties

[

Schemas

Learn about how content types are defined in the editor.](/docs/foundations/schemas)[

Format Interoperability

Learn about the formats BlockNote supports for importing and exporting content.](/docs/foundations/supported-formats)
