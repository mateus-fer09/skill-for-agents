---
title: "Inline Content"
description: "By default, InlineContent (the content of text blocks like paragraphs) in BlockNote can either be a StyledText or a Link object."
topics:
  - "Blocos e conteudo"
keywords:
  - "Inline Content"
  - "InlineContent"
  - "StyledText"
  - "Link"
  - "links"
  - "HTMLAttributes"
  - "onClick"
  - "undefined"
source_scope:
  - "https://www.blocknotejs.org/docs/features/blocks/inline-content"
---

# [Inline Content](#inline-content)

By default, `InlineContent` (the content of text blocks like paragraphs) in BlockNote can either be a `StyledText` or a `Link` object.

Here's an overview of all default inline content and the properties they support:

## [Styled Text](#styled-text)

`StyledText` is a type of `InlineContent` used to display pieces of text with styles:

```tsx
type  = {
  : "text";
  /**
   * The text content.
   */
  : string;
  /**
   * The styles of the text.
   */
  : ;
};
```

## [Link](#link)

`Link` objects represent links to a URL:

```tsx
type  = {
  : "link";
  /**
   * The content of the link.
   */
  : [];
  /**
   * The href of the link.
   */
  : string;
};
```

### [Customizing Links](#customizing-links)

You can customize how links are rendered and how they respond to clicks with the `links` editor option.

```tsx
const editor = BlockNoteEditor.create({
  links: {
    HTMLAttributes: {
      class: "my-link-class",
      target: "_blank",
    },
    onClick: (event) => {
      // Custom click logic, e.g. routing without a page reload.
    },
  },
});
```

#### [`HTMLAttributes`](#htmlattributes)

Additional HTML attributes that should be added to rendered link elements.

```tsx
const editor = BlockNoteEditor.create({
  links: {
    HTMLAttributes: {
      class: "my-link-class",
      target: "_blank",
    },
  },
});
```

#### [`onClick`](#onclick)

Custom handler invoked when a link is clicked. If left `undefined`, links are opened in a new window on click (the default behavior). If provided, that default behavior is disabled and this function is called instead.

Returning `false` will let BlockNote run other click handlers after this one. Returning `true` or nothing (the default) marks the event as handled.

```tsx
const editor = BlockNoteEditor.create({
  links: {
    onClick: (event) => {
      // Do something when a link is clicked.
    },
  },
});
```

## [Default Styles](#default-styles)

The default text formatting options in BlockNote are represented by the `Styles` in the default schema:

```tsx
type  = {
  /**
   * Whether the text is bold.
   * @default false
   */
  : boolean;
  /**
   * Whether the text is italic.
   * @default false
   */
  : boolean;
  /**
   * Whether the text is underlined.
   * @default false
   */
  : boolean;
  /**
   * Whether the text is struck through.
   * @default false
   */
  : boolean;
  /**
   * Whether the text is rendered as inline code.
   * @default false
   */
  : boolean;
  /**
   * The text color.
   * @default "default"
   */
  : string;
  /**
   * The background color of the text.
   * @default "default"
   */
  : string;
};
```
[

Diagrams

Mermaid diagram blocks for BlockNote — rendered as diagrams in the editor, and exportable to Markdown, PDF, DOCX, ODT, and email.](/docs/features/blocks/diagrams)[

Custom

How to create custom blocks, inline content and styles in BlockNote.](/docs/features/blocks/custom)
