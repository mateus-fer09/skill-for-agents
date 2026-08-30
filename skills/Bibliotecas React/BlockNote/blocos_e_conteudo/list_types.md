---
title: "List Item Blocks"
description: "List item blocks are used to create different types of lists in your documents. BlockNote supports various list item blocks to help you structure and format your content effectivel"
topics:
  - "Blocos e conteudo"
keywords:
  - "List Item Blocks"
source_scope:
  - "https://www.blocknotejs.org/docs/features/blocks/list-types"
---

# [List Item Blocks](#list-item-blocks)

List item blocks are used to create different types of lists in your documents. BlockNote supports various list item blocks to help you structure and format your content effectively.

### [Bullet List Item](#bullet-list-item)

A bullet list item is a list item that is not numbered.

**Type & Props**

```tsx
type BulletListItemBlock = {
  id: string;
  type: "bulletListItem";
  props: DefaultProps;
  content: InlineContent[];
  children: Block[];
};
```

### [Numbered List Item](#numbered-list-item)

A numbered list item is a list item that is numbered.

**Type & Props**

```tsx
type NumberedListItemBlock = {
  id: string;
  type: "numberedListItem";
  props: DefaultProps & {
    start?: number;
  };
  content: InlineContent[];
  children: Block[];
};
```

`start:` The number of this list item. If not provided, it defaults to `1`, or is incremented from the previous item.

### [Check List Item](#check-list-item)

A check list item is a list item that can be checked or unchecked.

**Type & Props**

```tsx
type CheckListItemBlock = {
  id: string;
  type: "checkListItem";
  props: DefaultProps & {
    checked: boolean;
  };
  content: InlineContent[];
  children: Block[];
};
```

`checked:` Whether the list item is checked or not.

### [Toggle List Item](#toggle-list-item)

A toggle list item is a list item that can show or hide it's children.

**Type & Props**

```tsx
type ToggleListItemBlock = {
  id: string;
  type: "toggleListItem";
  props: DefaultProps;
  content: InlineContent[];
  children: Block[];
};
```
[

Typography

How to use typography blocks in BlockNote.](/docs/features/blocks/typography)[

Tables

How to use tables in BlockNote.](/docs/features/blocks/tables)
