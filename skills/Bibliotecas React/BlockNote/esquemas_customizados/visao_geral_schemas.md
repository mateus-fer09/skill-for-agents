---
title: "Custom Schemas"
description: "By default, BlockNote documents support different kind of blocks, inline content and text styles (see [default schema](/docs/foundations/schemas)). However, you can extend BlockNot"
topics:
  - "Esquemas customizados"
keywords:
  - "Custom Schemas"
  - "BlockNoteSchema.extend"
  - "BlockNoteSchema.create"
source_scope:
  - "https://www.blocknotejs.org/docs/features/custom-schemas"
---

# [Custom Schemas](#custom-schemas)

By default, BlockNote documents support different kind of blocks, inline content and text styles (see [default schema](/docs/foundations/schemas)).
However, you can extend BlockNote and create custom schemas to support your own blocks, inline content and text styles.

## [Custom Blocks](#custom-blocks)

Blocks are the main elements of a document, such as paragraphs, headings, lists, etc.

- [Learn how to create custom blocks for your BlockNote editor](/docs/features/custom-schemas/custom-blocks)

## [Custom Inline Content](#custom-inline-content)

Inline Content are elements that can be inserted inside a text block, such as links, mentions, tags, etc.

- [Learn how to create custom Inline Content for your BlockNote editor](/docs/features/custom-schemas/custom-inline-content)

## [Custom Styles](#custom-styles)

Text Styles are properties that can be applied to a piece of text, such as bold, italic, underline, etc.

- [Learn how to add custom Styles to your BlockNote editor](/docs/features/custom-schemas/custom-styles)

## [Creating your own schema](#creating-your-own-schema)

Once you have defined your custom blocks (see the links above), inline content or styles, you can create a schema and pass this to the initialization of the editor. There are two ways to create a new schema.

### [Extending an existing schema](#extending-an-existing-schema)

You can call `BlockNoteSchema.extend` to add custom blocks, inline content, or styles to an existing schema. While this works for any existing schema, it's most common to use this to extend the default schema.

```tsx
// Creates an instance of the default schema when nothing is passed to
// `BlockNoteSchema.create`.
const schema = BlockNoteSchema.create()
  // Adds custom blocks, inline content, or styles to the default schema.
  .extend({
    blockSpecs: {
      // Add your own custom blocks:
      customBlock: CustomBlock,
      ...
    },
    inlineContentSpecs: {
      // Add your own custom inline content:
      customInlineContent: CustomInlineContent,
      ...
    },
    styleSpecs: {
      // Add your own custom styles:
      customStyle: CustomStyle,
      ...
    },
  });
```

### [Creating a schema from scratch](#creating-a-schema-from-scratch)

Passing custom blocks, inline content, or styles directly into `BlockNoteSchema.create` will produce a new schema with only the things you pass. This can be useful if you only need a few basic things from the default schema, and intend to implement everything else yourself.

```tsx
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Add only the default paragraph block:
    paragraph: defaultBlockSpecs.paragraph,

    // Add your own custom blocks:
    customBlock: CustomBlock,
    ...
  },
  inlineContentSpecs: {
    // Add only the default text inline content:
    text: defaultInlineContentSpecs.text,

    // Add your own custom inline content:
    customInlineContent: CustomInlineContent,
    ...
  },
  styleSpecs: {
    // Add only the default bold style:
    bold: defaultStyleSpecs.bold,

    // Add your own custom styles:
    customStyle: CustomStyle,
    ...
  },
});
```

## [Using your own schema](#using-your-own-schema)

Once you've created an instance of your schema using `BlockNoteSchema.create` or `BlockNoteSchema.extend`, you can pass it to the `schema` option of your BlockNoteEditor (`BlockNoteEditor.create` or `useCreateBlockNote`):

```tsx
const editor = useCreateBlockNote({
  schema,
});
```

## [Usage with TypeScript](#usage-with-typescript)

In contrast to most other editors, BlockNote has been designed for full TypeScript compatibility. This means you can get full type safety and autocompletion *even when using a custom schema*.

By default, the methods, hooks, and types exposed by the API assume you're using the default, built-in schema. If you're using a custom schema, there are 3 ways to get full type safety:

### [Methods that accept an optional `schema` parameter](#methods-that-accept-an-optional-schema-parameter)

Some methods, like the `useBlockNoteEditor` hook, take an optional `schema?: BlockNoteSchema` parameter. If you're using a custom schema, you should pass it here to make sure the return type is correctly typed.

### [Manual typing of types](#manual-typing-of-types)

If you're using types like `BlockNoteEditor`, `Block`, `PartialBlock` directly, you can get the correctly typed variants like this:

```tsx
type MyBlock = Block<
  typeof schema.blockSchema,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;
```

Or even simpler, use the shorthands exposed by the schema:

```tsx
type MyBlockNoteEditor = typeof schema.BlockNoteEditor;
type MyBlock = typeof schema.Block;
type MyPartialBlock = typeof schema.PartialBlock;
```

### [Automatically override all default types (experimental)](#automatically-override-all-default-types-experimental)

Alternatively, the easiest way to get full type safety without any additional work is to override all default types with your custom schema, by using a custom type definition file. See this [example blocknote.d.ts](https://github.com/TypeCellOS/BlockNote/blob/main/examples/06-custom-schema/react-custom-styles/blocknote.d.ts.example). This is an experimental feature - we would love to hear your feedback on this approach.
[

### Custom Blocks
Learn how to create custom block types for your BlockNote editor](/docs/features/custom-schemas/custom-blocks)[

### Custom Inline Content
Learn how to create custom inline content for your BlockNote editor](/docs/features/custom-schemas/custom-inline-content)[

### Custom Styles
Learn how to create custom style schemas for your BlockNote editor](/docs/features/custom-schemas/custom-styles)[

### Source with Preview Blocks
Build custom blocks and inline content that are authored as source code but rendered as a preview — like BlockNote's math and diagram blocks.](/docs/features/custom-schemas/source-with-preview)[

Extensions

Add extensions to the editor to add keyboard shortcuts, input rules, and more.](/docs/features/extensions)[

Custom Blocks

Learn how to create custom block types for your BlockNote editor](/docs/features/custom-schemas/custom-blocks)
