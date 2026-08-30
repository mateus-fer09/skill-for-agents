---
title: "Table Blocks"
description: "Tables are a simple way to display data in a grid."
topics:
  - "Blocos e conteudo"
keywords:
  - "Table Blocks"
  - "tables"
source_scope:
  - "https://www.blocknotejs.org/docs/features/blocks/tables"
---

# [Table Blocks](#table-blocks)

Tables are a simple way to display data in a grid.

Tables by default are a simple way to display data in a grid. But, BlockNote also supports more advanced features like:

- Split cells

- Cell background color

- Cell text color

- Header rows & columns

> [!NOTE]
> 

These features are disabled by default to keep the default table experience
easy to use.

You can enable more advanced features by passing the `tables` option when creating the editor.

```tsx
const editor = new BlockNoteEditor({
  tables: {
    splitCells: true,
    cellBackgroundColor: true,
    cellTextColor: true,
    headers: true,
  },
});
```

You can choose to enable only certain features, or none at all. Giving you the flexibility to use tables how you need in your app.

## [Block Shape](#block-shape)

This describes the shape of a table block in BlockNote.

```tsx
type TableBlock = {
  id: string;
  type: "table";
  props: {
    textColor: string;
  };
  content: TableContent;
  children: Block[];
};

type TableContent = {
  type: "tableContent";
  columnWidths: (number | undefined)[];
  headerRows?: number;
  headerCols?: number;
  rows: {
    cells: TableCell[];
  }[];
};

type TableCell = {
  type: "tableCell";
  props: {
    backgroundColor: string;
    textColor: string;
    textAlignment: "left" | "center" | "right" | "justify";
    colspan?: number;
    rowspan?: number;
  };
  content: InlineContent[];
};
```

`textColor:` The text color of the table block. Defaults to `"default"`.

## [Options](#options)

### [Cell background color](#cell-background-color)

To enable cell background color, you need to pass `cellBackgroundColor: true` to the `tables` option.

```tsx
const editor = new BlockNoteEditor({
  tables: {
    cellBackgroundColor: true,
  },
});
```

### [Cell text color](#cell-text-color)

To enable cell text color, you need to pass `cellTextColor: true` to the `tables` option.

```tsx
const editor = new BlockNoteEditor({
  tables: {
    cellTextColor: true,
  },
});
```

### [Header rows & columns](#header-rows--columns)

BlockNote supports headers in tables, which are the first row and/or first column of a table.

To enable it, you need to pass `headers: true` to the `tables` option.

```tsx
const editor = new BlockNoteEditor({
  tables: {
    headers: true,
  },
});
```

### [Split cells](#split-cells)

Splitting and merging cells is a common feature of more advanced table editors.

To enable it, you need to pass `splitCells: true` to the `tables` option.

```tsx
const editor = new BlockNoteEditor({
  tables: {
    splitCells: true,
  },
});
```
[

List Types

How to use list types in BlockNote.](/docs/features/blocks/list-types)[

Embeds

How to use embeds in BlockNote.](/docs/features/blocks/embeds)
