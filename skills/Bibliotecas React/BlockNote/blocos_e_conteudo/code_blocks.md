---
title: "Code Blocks"
description: "Code blocks are a simple way to display formatted code. By default they're kept deliberately simple, but BlockNote also supports more advanced features:"
topics:
  - "Blocos e conteudo"
keywords:
  - "Code Blocks"
  - "true"
  - "text"
  - "content"
  - "syntaxHighlighter"
  - "codeBlockOptions"
  - "SyntaxHighlightingExtension"
source_scope:
  - "https://www.blocknotejs.org/docs/features/blocks/code-blocks"
---

# [Code Blocks](#code-blocks)

Code blocks are a simple way to display formatted code. By default they're kept deliberately simple, but BlockNote also supports more advanced features:

- Syntax highlighting

- Custom themes

- Multiple languages

- Tab indentation

> [!NOTE]
> 

These features are disabled by default to keep the default code block
experience easy to use and reduce bundle size. They can be individually added
when [configuring the
block](/docs/features/blocks#configuring-default-blocks).

**Configuration Options**

```tsx
type CodeBlockOptions = {
  indentLineWithTab?: boolean;
  defaultLanguage?: string;
  supportedLanguages?: Record<
    string,
    {
      name: string;
      aliases?: string[];
    }
  >;
};
```

`indentLineWithTab:` Whether the Tab key should indent lines, or not be handled by the code block specially. Defaults to `true`.

`defaultLanguage:` The syntax highlighting default language for code blocks which are created/inserted without a set language, which is `text` by default (no syntax highlighting).

`supportedLanguages:` The syntax highlighting languages supported by the code block. Empty by default.

**Type & Props**

```tsx
type CodeBlock = {
  id: string;
  type: "codeBlock";
  props: {
    language: string;
  };
  content: StyledText[];
  children: Block[];
};
```

`language:` The syntax highlighting language to use. Defaults to `text`, which has no highlighting.

Unlike most blocks, the code block's `content` is [plain text](/docs/foundations/document-structure#plain-text-content).

## [Syntax Highlighting](#syntax-highlighting)

The easiest way to enable syntax highlighting is the `@blocknote/code-block` package. It ships a ready-to-use highlighter supporting a wide range of languages:

```tsx
npm install @blocknote/code-block
```

Add its `syntaxHighlighter` extension to your editor, and pass the matching `codeBlockOptions` (the supported language list) to the code block spec:

```tsx
import { createCodeBlockSpec } from "@blocknote/core";
import { codeBlockOptions, syntaxHighlighter } from "@blocknote/code-block";

const editor = useCreateBlockNote({
  extensions: [syntaxHighlighter],
  schema: BlockNoteSchema.create().extend({
    blockSpecs: {
      codeBlock: createCodeBlockSpec(codeBlockOptions),
    },
  }),
});
```

That's all — see it in action in [this example](/examples/theming/code-block).

> [!NOTE]
> 

The same extension also highlights other source-authored blocks, like the
[math](/docs/features/blocks/math) and
[diagram](/docs/features/blocks/diagrams) blocks' source popups.

## [Custom Syntax Highlighting](#custom-syntax-highlighting)

Under the hood, highlighting is split into two parts, which you can also wire up yourself for full control over the bundle:

- 

The `SyntaxHighlightingExtension` (from `@blocknote/core`) provides the highlighter — a [Shiki](https://shiki.style) instance with your choice of languages, themes, and engine:

```tsx
type SyntaxHighlightingOptions = {
  createHighlighter: () => Promise<HighlighterGeneric<any, any>>;
};

const syntaxHighlighter = SyntaxHighlightingExtension(options);
```

`createHighlighter:` Creates the [Shiki highlighter](https://shiki.style/guide/load-theme) to use for syntax highlighting.

- 

Each block decides if and how its text is highlighted, via the `highlight` callback in the block spec's `meta`:

```tsx
// In the block spec's `meta`:
highlight?: (block: Block) => string | undefined;
```

It runs for each instance of the block and returns the language to highlight the block's text with (one of the languages supported by the highlighter), or `undefined` for no highlighting. The default code block already implements it, returning its `language` prop — while `codeBlockOptions` supplies the matching set of supported languages for the bundled highlighter.

To create your own highlighter, the [shiki-codegen](https://shiki.style/packages/codegen) CLI generates the code for your chosen languages and themes. For example, for a highlighter using the optimized JavaScript engine with javascript, typescript, and vue, plus light and dark themes:

```tsx
npx shiki-codegen --langs javascript,typescript,vue --themes light-plus,dark-plus --engine javascript --precompiled ./shiki.bundle.ts
```

This generates a `shiki.bundle.ts` file that you use to create the extension — added to the editor exactly like the pre-configured one above, alongside a `createCodeBlockSpec` configured with your matching languages:

```tsx
import { SyntaxHighlightingExtension } from "@blocknote/core";
import { createHighlighter } from "./shiki.bundle.js";

const syntaxHighlighter = SyntaxHighlightingExtension({
  createHighlighter: () =>
    createHighlighter({
      themes: ["light-plus", "dark-plus"],
      langs: [],
    }),
});
```

The example below shows the complete setup:

## [Related](#related)

Looking for blocks that are *authored* as code but *rendered* as what the code produces? See the [math](/docs/features/blocks/math) and [diagram](/docs/features/blocks/diagrams) blocks, or [build your own](/docs/features/custom-schemas/source-with-preview).[

Embeds

How to use embeds in BlockNote.](/docs/features/blocks/embeds)[

Math & Equations

LaTeX math blocks and inline math for BlockNote — rendered as formulas in the editor, and exportable to Markdown, PDF, DOCX, ODT, and email.](/docs/features/blocks/math)
