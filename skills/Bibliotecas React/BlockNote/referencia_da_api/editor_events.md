---
title: "Events"
description: "BlockNote provides several event callbacks that allow you to respond to changes in the editor. These events are essential for building reactive applications and tracking user inter"
topics:
  - "Referencia da api"
keywords:
  - "Events"
  - "onMount"
  - "onUnmount"
  - "onSelectionChange"
  - "onChange"
  - "getChanges"
  - "onBeforeChange"
  - "false"
source_scope:
  - "https://www.blocknotejs.org/docs/reference/editor/events"
---

# [Events](#events)

BlockNote provides several event callbacks that allow you to respond to changes in the editor. These events are essential for building reactive applications and tracking user interactions.

## [Overview](#overview)

The editor emits events for:

- **Editor lifecycle** - When the editor is created, mounted, unmounted, etc.

- **Content changes** - When blocks are inserted, updated, or deleted

- **Selection changes** - When the cursor position or selection changes

## [`onMount`](#onmount)

The `onMount` callback is called when the editor has been mounted.

```tsx
editor.onMount(() => {
  console.log("Editor is mounted");
});
```

## [`onUnmount`](#onunmount)

The `onUnmount` callback is called when the editor has been unmounted.

```tsx
editor.onUnmount(() => {
  console.log("Editor is unmounted");
});
```

## [`onSelectionChange`](#onselectionchange)

The `onSelectionChange` callback is called whenever the editor's selection changes, including cursor movements and text selections.

```tsx
editor.onSelectionChange((editor) => {
  console.log("Selection changed");

  // Get current selection information
  const selection = editor.getSelection();
  const textCursorPosition = editor.getTextCursorPosition();

  console.log("Current selection:", selection);
  console.log("Text cursor position:", textCursorPosition);
});
```

## [`onChange`](#onchange)

The `onChange` callback is called whenever the editor's content changes. This is the primary way to track modifications to the document.

```tsx
editor.onChange((editor, { getChanges }) => {
  console.log("Editor content changed");

  // Get detailed information about what changed
  const changes = getChanges();
  console.log("Changes:", changes);

  // Save content, update UI, etc.
});
```

See [Understanding Changes](#understanding-changes) for more information about the `getChanges` function.

## [`onBeforeChange`](#onbeforechange)

The `onBeforeChange` callback is called before any change is applied to the editor, allowing you to cancel the change.

```tsx
editor.onBeforeChange(({ getChanges, tr }) => {
  if (
    // Cancel inserting new blocks
    getChanges().some((change) => change.type === "insert")
  ) {
    // By returning `false`, the change will be canceled & not applied to the editor.
    return false;
  }
});
```

See [Understanding Changes](#understanding-changes) for more information about the `getChanges` function.

## [Understanding Changes](#understanding-changes)

The `getChanges()` function returns detailed information about what blocks were affected. It includes three types of changes:

- Insertions - When a new block is inserted

- Deletions - When a block is deleted

- Updates - When a block's content is changed

- Moves - When a block is moved to a new position (which can also update the block's content)

```tsx
/**
 * The changes that occurred in the editor.
 */
type BlocksChanged = Array<
  | {
      type: "insert" | "delete";
      // The affected block (when inserting, this is the new block, when deleting, this is the block that was deleted)
      block: Block;
      // The source of the change
      source: BlockChangeSource;
      // Insert and delete changes don't have a previous block
      prevBlock: undefined;
    }
  | {
      type: "update";
      // The affected block
      block: Block;
      // The source of the change
      source: BlockChangeSource;
      // The block before the update
      prevBlock: Block;
    }
  | {
      type: "move";
      // The source of the change
      source: BlockChangeSource;
      // The affected block
      block: Block;
      // The block before the move (since a move can also update the block's content)
      prevBlock: Block;
      /**
       * The previous parent block (if it existed).
       */
      prevParent?: Block;
      /**
       * The current parent block (if it exists).
       */
      currentParent?: Block;
    }
>;
```

### [Change Sources](#change-sources)

Each change includes a source that indicates what triggered the modification:

```tsx
type BlockChangeSource = {
  type:
    | "local" // Triggered by local user (default)
    | "paste" // From paste operation
    | "drop" // From drop operation
    | "undo" // From undo operation (local-only)
    | "redo" // From redo operation (local-only)
    | "undo-redo" // From undo/redo operations (collaboration-only)
    | "yjs-remote"; // From remote user (collaboration-only)
};
```

## [Event Cleanup](#event-cleanup)

All event callbacks return cleanup functions that you can call to remove the event listener:

```tsx
// Set up event listeners
const cleanupOnChange = editor.onChange((editor, { getChanges }) => {
  console.log("Content changed");
});

const cleanupOnSelection = editor.onSelectionChange((editor) => {
  console.log("Selection changed");
});

// Later, clean up event listeners
cleanupOnChange();
cleanupOnSelection();
```
