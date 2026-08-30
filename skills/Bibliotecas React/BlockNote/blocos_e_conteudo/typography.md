---
title: "Typography Blocks"
description: "Typography blocks are fundamental elements for displaying text content in your documents. BlockNote supports various typography blocks to help you structure and format your content"
topics:
  - "Blocos e conteudo"
keywords:
  - "Typography Blocks"
  - "true"
  - "allowToggleHeadings"
  - "false"
source_scope:
  - "https://www.blocknotejs.org/docs/features/blocks/typography"
---

# [Typography Blocks](#typography-blocks)

Typography blocks are fundamental elements for displaying text content in your documents. BlockNote supports various typography blocks to help you structure and format your content effectively.

## [Paragraph](#paragraph)

**Type & Props**

```tsx
type ParagraphBlock = {
  id: string;
  type: "paragraph";
  props: DefaultProps;
  content: InlineContent[];
  children: Block[];
};
```

## [Heading](#heading)

**Configuration Options**

```tsx
type HeadingBlockOptions = Partial<{
  defaultLevel?: number;
  levels?: number[];
  allowToggleHeadings?: boolean;
}>;
```

`defaultLevel:` The default level for headings which are created/inserted without a set level, which is `1` by default.

`levels:` The heading levels that the block supports, which is `[1, 2, 3, 4, 5, 6]` by default.

`allowToggleHeadings:` Whether toggle headings should be supported, `true` by default. Toggle headings have a button which toggles between hiding and showing the block's children.

**Type & Props**

```tsx
type HeadingBlock = {
  id: string;
  type: "heading";
  props: {
    level: 1 | 2 | 3 | 4 | 5 | 6 = 1;
    isToggleable?: boolean;
  } & DefaultProps;
  content: InlineContent[];
  children: Block[];
};
```

`level:` The heading level, representing a title (`level: 1`), heading (`level: 2`), and subheadings (`level: 3`, `level: 4`, `level: 5`, `level: 6`). Defaults to `1`.

`isToggleable:` Whether the heading is toggled (children hidden). Only present when `allowToggleHeadings` is `true` (the default). Defaults to `false`.

## [Quote](#quote)

**Type & Props**

```tsx
type QuoteBlock = {
  id: string;
  type: "quote";
  props: {
    backgroundColor: string;
    textColor: string;
  };
  content: InlineContent[];
  children: Block[];
};
```

`backgroundColor:` The background color of the block. Defaults to `"default"`.

`textColor:` The text color of the block. Defaults to `"default"`.

## [Divider](#divider)

A horizontal rule used to separate content.

**Type & Props**

```tsx
type DividerBlock = {
  id: string;
  type: "divider";
  props: {};
  content: undefined;
  children: Block[];
};
```

The divider block has no props and no content. It can be inserted by typing `---` on an empty line.[

Built-in Blocks

BlockNote supports a variety of built-in block and inline content types that are included in the editor by default.](/docs/features/blocks)[

List Types

How to use list types in BlockNote.](/docs/features/blocks/list-types)
