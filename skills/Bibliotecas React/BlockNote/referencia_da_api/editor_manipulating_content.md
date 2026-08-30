---
title: "Manipulating Content"
description: "BlockNote provides comprehensive APIs for manipulating both blocks and inline content within the editor. This guide covers how to programmatically work with the document structure "
topics:
  - "Referencia da api"
keywords:
  - "Manipulating Content"
  - "BlockIdentifier"
  - "string"
  - "Block"
  - "PartialBlock"
  - "PartialInlineContent"
  - "PartialLink"
  - "StyledText"
source_scope:
  - "https://www.blocknotejs.org/docs/reference/editor/manipulating-content"
---

# [Manipulating Content](#manipulating-content)

BlockNote provides comprehensive APIs for manipulating both blocks and inline content within the editor. This guide covers how to programmatically work with the document structure (blocks) and the content within those blocks (text, links, styling).

## [Overview](#overview)

The content manipulation APIs fall into two main categories:

### [Block Manipulation](#block-manipulation)

- **[Reading blocks](#reading-blocks)** - Accessing existing blocks and their relationships

- **[Creating blocks](#creating-blocks)** - Inserting new blocks into the document

- **[Updating blocks](#updating-blocks)** - Modifying existing block content and properties

- **[Removing blocks](#removing-blocks)** - Deleting blocks from the document

- **[Replacing blocks](#replacing-blocks)** - Swapping existing blocks with new ones

- **[Moving blocks](#moving-blocks)** - Reordering blocks within the document

- **[Nesting blocks](#nesting-blocks)** - Creating hierarchical relationships between blocks

### [Inline Content Manipulation](#inline-content-manipulation)

- **[Inserting content](#inserting-inline-content)** - Adding text, links, and styled content

- **[Reading content](#reading-content)** - Getting selected text and active styles

- **[Styling text](#styling-text)** - Adding, removing, and toggling text styles

- **[Working with links](#working-with-links)** - Creating and accessing link content

## [Common Types](#common-types)

### [Block Identifiers](#block-identifiers)

Most block methods require a `BlockIdentifier` to reference existing blocks:

```tsx
type BlockIdentifier = string | { id: string };
```

You can pass either:

- A `string` representing the block ID

- Any object with an `id: string` property, such as a `Block`

### [Partial Blocks](#partial-blocks)

When creating or updating blocks, you use `PartialBlock` objects which have optional properties:

```tsx
type PartialBlock = {
  id?: string; // Auto-generated if not provided
  type?: string; // Block type (paragraph, heading, etc.)
  props?: Partial<Record<string, any>>; // Block-specific properties
  content?: string | InlineContent[] | TableContent; // Block content
  children?: PartialBlock[]; // Nested blocks
};
```

### [Partial Inline Content](#partial-inline-content)

When creating or updating inline content, you use `PartialInlineContent` which allows for flexible content specification:

```tsx
type PartialLink = {
  type: "link";
  content: string | StyledText[];
  href: string;
};

type PartialInlineContent = string | (string | PartialLink | StyledText)[];
```

This type allows you to:

- Pass a simple string for plain text

- Pass an array of mixed content (strings, links, styled text)

- Use `PartialLink` for link content

- Use `StyledText` for text with formatting

## [Block Manipulation](#block-manipulation-1)

### [Reading Blocks](#reading-blocks)

#### [Getting the Document](#getting-the-document)

Retrieve all top-level blocks in the editor:

```tsx
const blocks = editor.document;
```

Returns a snapshot of all top-level (non-nested) blocks in the document.

#### [Getting Specific Blocks](#getting-specific-blocks)

```tsx
// Single block
getBlock(blockIdentifier: BlockIdentifier): Block | undefined

// Previous block
getPrevBlock(blockIdentifier: BlockIdentifier): Block | undefined

// Next block
getNextBlock(blockIdentifier: BlockIdentifier): Block | undefined

// Parent block
getParentBlock(blockIdentifier: BlockIdentifier): Block | undefined
```

```tsx
const block = editor.getBlock("block-123");
const prevBlock = editor.getPrevBlock("block-123");
const nextBlock = editor.getNextBlock("block-123");
const parentBlock = editor.getParentBlock("nested-block-123");
```

#### [Traversing All Blocks](#traversing-all-blocks)

```tsx
forEachBlock(
  callback: (block: Block) => boolean,
  reverse: boolean = false
): void
```

Traverses all blocks depth-first and executes a callback for each.

```tsx
editor.forEachBlock((block) => {
  console.log(`Block ${block.id}: ${block.type}`);
  return true; // Continue traversal
});
```

### [Creating Blocks](#creating-blocks)

#### [Inserting Blocks](#inserting-blocks)

```tsx
insertBlocks(
  blocksToInsert: PartialBlock[],
  referenceBlock: BlockIdentifier,
  placement: "before" | "after" = "before"
): void
```

Inserts new blocks relative to an existing block.

```tsx
// Insert a paragraph before an existing block
editor.insertBlocks(
  [{ type: "paragraph", content: "New paragraph" }],
  "existing-block-id",
  "before",
);

// Insert multiple blocks after an existing block
editor.insertBlocks(
  [
    { type: "heading", content: "New Section", props: { level: 2 } },
    { type: "paragraph", content: "Section content" },
  ],
  "existing-block-id",
  "after",
);
```

### [Updating Blocks](#updating-blocks)

#### [Modifying Existing Blocks](#modifying-existing-blocks)

```tsx
updateBlock(
  blockToUpdate: BlockIdentifier,
  update: PartialBlock
): void
```

Updates an existing block with new properties.

```tsx
// Change a paragraph to a heading
editor.updateBlock("block-123", {
  type: "heading",
  props: { level: 2 },
});

// Update content only
editor.updateBlock("block-123", {
  content: "Updated content",
});

// Update multiple properties
editor.updateBlock("block-123", {
  type: "heading",
  content: "New heading text",
  props: { level: 1 },
});
```

### [Removing Blocks](#removing-blocks)

#### [Deleting Blocks](#deleting-blocks)

```tsx
removeBlocks(blocksToRemove: BlockIdentifier[]): void
```

Removes one or more blocks from the document.

```tsx
// Remove a single block
editor.removeBlocks(["block-123"]);

// Remove multiple blocks
editor.removeBlocks(["block-123", "block-456", "block-789"]);
```

### [Replacing Blocks](#replacing-blocks)

#### [Swapping Blocks](#swapping-blocks)

```tsx
replaceBlocks(
  blocksToRemove: BlockIdentifier[],
  blocksToInsert: PartialBlock[]
): void
```

Replaces existing blocks with new ones.

```tsx
// Replace a paragraph with a heading
editor.replaceBlocks(
  ["paragraph-block"],
  [{ type: "heading", content: "New Heading", props: { level: 2 } }],
);

// Replace multiple blocks with different content
editor.replaceBlocks(
  ["block-1", "block-2"],
  [
    { type: "paragraph", content: "Replacement content" },
    { type: "bulletListItem", content: "List item" },
  ],
);
```

### [Moving Blocks](#moving-blocks)

#### [Reordering Blocks](#reordering-blocks)

```tsx
moveBlocksUp(blockIdentifier?: BlockIdentifier): void
moveBlocksDown(blockIdentifier?: BlockIdentifier): void
```

Moves the currently selected blocks up or down in the document. If a
`blockIdentifier` is provided, that block is moved instead of the selection,
and the selection is left unchanged.

```tsx
// Move selected blocks up
editor.moveBlocksUp();

// Move selected blocks down
editor.moveBlocksDown();

// Move a specific block up, without changing the selection
editor.moveBlocksUp("block-123");

// Move a specific block down, without changing the selection
editor.moveBlocksDown("block-123");
```

### [Nesting Blocks](#nesting-blocks)

#### [Creating Hierarchical Structures](#creating-hierarchical-structures)

```tsx
canNestBlock(): boolean
nestBlock(): void
canUnnestBlock(): boolean
unnestBlock(): void
```

Manages the nesting level of blocks (indentation).

```tsx
// Check if current block can be nested
if (editor.canNestBlock()) {
  editor.nestBlock(); // Indent the block
}

// Check if current block can be un-nested
if (editor.canUnnestBlock()) {
  editor.unnestBlock(); // Outdent the block
}
```

## [Inline Content Manipulation](#inline-content-manipulation-1)

### [Inserting Inline Content](#inserting-inline-content)

#### [Basic Insertion](#basic-insertion)

```tsx
insertInlineContent(
  content: PartialInlineContent,
  options?: { updateSelection?: boolean }
): void
```

Inserts content at the current cursor position or replaces the current selection.

```tsx
// Insert plain text
editor.insertInlineContent("Hello, world!");

// Insert mixed content
editor.insertInlineContent([
  "Hello ",
  { type: "text", text: "World", styles: { bold: true } },
  "! Welcome to ",
  { type: "link", content: "BlockNote", href: "https://blocknotejs.org" },
]);

// Insert with selection update
editor.insertInlineContent("New content", { updateSelection: true });
```

#### [Advanced Content Examples](#advanced-content-examples)

```tsx
// Insert styled text
editor.insertInlineContent([
  {
    type: "text",
    text: "Bold and italic",
    styles: { bold: true, italic: true },
  },
]);

// Insert link with styled content
editor.insertInlineContent([
  {
    type: "link",
    content: [
      { type: "text", text: "Visit ", styles: {} },
      { type: "text", text: "BlockNote", styles: { bold: true } },
    ],
    href: "https://blocknotejs.org",
  },
]);

// Insert complex mixed content
editor.insertInlineContent([
  "This is ",
  { type: "text", text: "important", styles: { bold: true, textColor: "red" } },
  " and you should ",
  { type: "link", content: "read more", href: "https://example.com" },
  " about it.",
]);
```

### [Reading Content](#reading-content)

#### [Getting Selected Text](#getting-selected-text)

```tsx
getSelectedText(): string
```

Retrieves the currently selected text as a plain string.

```tsx
const selectedText = editor.getSelectedText();
console.log("Selected text:", selectedText);

// Example: Copy selected text to clipboard
if (selectedText) {
  navigator.clipboard.writeText(selectedText);
}
```

#### [Getting Active Styles](#getting-active-styles)

```tsx
getActiveStyles(): Styles
```

Returns the active text styles at the current cursor position or at the end of the current selection.

```tsx
const activeStyles = editor.getActiveStyles();
console.log("Active styles:", activeStyles);

// Example: Check if text is bold
if (activeStyles.bold) {
  console.log("Text is bold");
}

// Example: Get text color
if (activeStyles.textColor) {
  console.log("Text color:", activeStyles.textColor);
}
```

#### [Getting Selected Link](#getting-selected-link)

```tsx
getSelectedLinkUrl(): string | undefined
```

Returns the URL of the last link in the current selection, or `undefined` if no links are selected.

```tsx
const linkUrl = editor.getSelectedLinkUrl();

if (linkUrl) {
  console.log("Selected link URL:", linkUrl);
  // Open link in new tab
  window.open(linkUrl, "_blank");
} else {
  console.log("No link selected");
}
```

### [Styling Text](#styling-text)

#### [Adding Styles](#adding-styles)

```tsx
addStyles(styles: Styles): void
```

Applies styles to the currently selected text.

```tsx
// Add single style
editor.addStyles({ bold: true });

// Add multiple styles
editor.addStyles({
  bold: true,
  italic: true,
  textColor: "red",
});

// Add background color
editor.addStyles({ backgroundColor: "yellow" });
```

#### [Removing Styles](#removing-styles)

```tsx
removeStyles(styles: Styles): void
```

Removes specific styles from the currently selected text.

```tsx
// Remove single style
editor.removeStyles({ bold: true });

// Remove multiple styles
editor.removeStyles({ bold: true, italic: true });

// Remove color styles
editor.removeStyles({ textColor: "red", backgroundColor: "yellow" });
```

#### [Toggling Styles](#toggling-styles)

```tsx
toggleStyles(styles: Styles): void
```

Toggles styles on the currently selected text (adds if not present, removes if present).

```tsx
// Toggle single style
editor.toggleStyles({ bold: true });

// Toggle multiple styles
editor.toggleStyles({ bold: true, italic: true });

// Toggle color
editor.toggleStyles({ textColor: "blue" });
```

### [Working with Links](#working-with-links)

#### [Creating Links](#creating-links)

```tsx
createLink(url: string, text?: string): void
```

Creates a new link, optionally replacing the currently selected text.

```tsx
// Create link from selected text
editor.createLink("https://blocknotejs.org");

// Create link with custom text
editor.createLink("https://blocknotejs.org", "Visit BlockNote");

// Create link with empty URL (removes link)
editor.createLink("");
```
