---
title: "Built-in Blocks"
description: "BlockNote supports a number of built-in blocks, inline content types, and styles that are included in the editor by default. This is called the Default Schema. To create your own c"
topics:
  - "Blocos e conteudo"
keywords:
  - "Built-in Blocks"
source_scope:
  - "https://www.blocknotejs.org/docs/features/blocks"
---

# [Built-in Blocks](#built-in-blocks)

BlockNote supports a number of built-in blocks, inline content types, and styles that are included in the editor by default. This is called the Default Schema. To create your own content types, see [Custom Schemas](/docs/features/custom-schemas).

The demo below showcases each of BlockNote's built-in block and inline content types:

## [Default Block Properties](#default-block-properties)

There are some default block props that BlockNote uses for the built-in blocks:

```tsx
type  = {
  /**
   * The background color of the block, which also applies to nested blocks.
   * @default "default"
   */
  : string;
  /**
   * The text color of the block, which also applies to nested blocks.
   * @default "default"
   */
  : string;
  /**
   * The text alignment of the block.
   * @default "left"
   */
  : "left" | "center" | "right" | "justify";
};
```

## [Configuring Default Blocks](#configuring-default-blocks)

Some default blocks can be configured with options. For example, headings can be configured to have different available levels:

```tsx
// Creates a new instance of the default heading block.
const heading = createHeadingBlockSpec({
  // Sets the block to support only heading levels 1-3.
  levels: [1, 2, 3],
});
```

Each default block type can be instantiated using their respective `create...BlockSpec` function. If the block can be configured, i.e. if it has options, you can pass them in an object to the function. To see which options each block type supports, read on to the next pages.

To add your configured block to the editor, you must pass in a [custom schema](/docs/features/custom-schemas) with it. The simplest way to do this is by [extending the default schema](/docs/features/custom-schemas#extending-an-existing-schema):

```tsx
const editor = useCreateBlockNote({
  // Creates a default schema and extends it with the configured heading block.
  schema: BlockNoteSchema.create().extend({
    blockSpecs: {
      heading: createHeadingBlockSpec({
        // Sets the allowed heading levels.
        levels: [1, 2, 3],
      }),
    },
  }),
});
```

You can see this in action in a working demo [here](/examples/custom-schema/configuring-blocks).

## [Explore](#explore)

[

### Typography
How to use typography blocks in BlockNote.](/docs/features/blocks/typography)[

### List Types
How to use list types in BlockNote.](/docs/features/blocks/list-types)[

### Tables
How to use tables in BlockNote.](/docs/features/blocks/tables)[

### Embeds
How to use embeds in BlockNote.](/docs/features/blocks/embeds)[

### Code Blocks
How to use code blocks, and how to add syntax highlighting to them.](/docs/features/blocks/code-blocks)[

### Math & Equations
LaTeX math blocks and inline math for BlockNote — rendered as formulas in the editor, and exportable to Markdown, PDF, DOCX, ODT, and email.](/docs/features/blocks/math)[

### Diagrams
Mermaid diagram blocks for BlockNote — rendered as diagrams in the editor, and exportable to Markdown, PDF, DOCX, ODT, and email.](/docs/features/blocks/diagrams)[

### Inline Content
How to use inline content in BlockNote.](/docs/features/blocks/inline-content)[

### Custom
How to create custom blocks, inline content and styles in BlockNote.](/docs/features/blocks/custom)[

BlockNote AI Reference

Reference documentation for the BlockNote AI extension](/docs/features/ai/reference)[

Typography

How to use typography blocks in BlockNote.](/docs/features/blocks/typography)
