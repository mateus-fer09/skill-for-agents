---
title: "Server-side Processing"
description: "While you can use the BlockNoteEditor on the client side, you can also use ServerBlockNoteEditor from @blocknote/server-util to process BlockNote documents on the server."
topics:
  - "Recursos avancados"
keywords:
  - "Server-side Processing"
  - "BlockNoteEditor"
  - "ServerBlockNoteEditor"
  - "ServerBlockNoteEditor.create"
  - "useCreateBlockNote"
  - "BlockNoteEditor.create"
  - "blocksToFullHTML"
  - "blocksToHTMLLossy"
source_scope:
  - "https://www.blocknotejs.org/docs/features/server-processing"
---

# [Server-side Processing](#server-side-processing)

While you can use the `BlockNoteEditor` on the client side, you can also use `ServerBlockNoteEditor` from `@blocknote/server-util` to process BlockNote documents on the server.

For example, use the following code to convert a BlockNote document to HTML on the server:

```tsx
import { ServerBlockNoteEditor } from "@blocknote/server-util";

const editor = ServerBlockNoteEditor.create();
const html = await editor.blocksToFullHTML(blocks);
```

`ServerBlockNoteEditor.create` takes the same BlockNoteEditorOptions as `useCreateBlockNote` and `BlockNoteEditor.create` ([see docs](/docs/getting-started)),
so you can pass the same configuration (for example, your custom schema) to your server-side BlockNote editor as on the client.

## [Functions for converting blocks](#functions-for-converting-blocks)

`ServerBlockNoteEditor` exposes the same functions for converting blocks as the client side editor ([HTML](/docs/features/import/html), [Markdown](/docs/features/import/markdown)):

- `blocksToFullHTML`

- `blocksToHTMLLossy` and `tryParseHTMLToBlocks`

- `blocksToMarkdownLossy` and `tryParseMarkdownToBlocks`

## [Yjs processing](#yjs-processing)

Additionally, `ServerBlockNoteEditor` provides functions for processing Yjs documents in case you use Yjs collaboration:

- `yDocToBlocks` or `yXmlFragmentToBlocks`: use this to convert a Yjs document or XML Fragment to BlockNote blocks

- `blocksToYDoc` or `blocksToYXmlFragment`: use this to convert a BlockNote document (blocks) to a Yjs document or XML Fragment

## [React compatibility](#react-compatibility)

If you use [custom schemas in React](/docs/features/custom-schemas), you can use the same schema on the server side.
Functions like `blocksToFullHTML` will use your custom React rendering functions to export blocks to HTML, similar to how these functions work on the client.
However, it could be that your React components require access to a React context (e.g. a theme or localization context).

For these use-cases, we provide a function `withReactContext` that allows you to pass a React context to the server-side editor.
This example exports a BlockNote document to HTML within a React context `YourContext`, so that even Custom Blocks built in React that require `YourContext` will be exported correctly:

```tsx
const html = await editor.withReactContext(
  ({ children }) => (
    <YourContext.Provider value={true}>{children}</YourContext.Provider>
  ),
  async () => editor.blocksToFullHTML(blocks),
);
```

## [Next.js App Router](#nextjs-app-router)

If you're using `@blocknote/server-util` in a Next.js App Router API route (Route Handler), you need to add the BlockNote packages to `serverExternalPackages` in your `next.config.ts`:

```tsx
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@blocknote/core",
    "@blocknote/react",
    "@blocknote/server-util",
  ],
};

export default nextConfig;
```
[

Markdown

It's possible to import Markdown content into BlockNote blocks, completely client-side.](/docs/features/import/markdown)[

Localization (i18n)

Learn how to localize BlockNote to support multiple languages and customize text strings](/docs/features/localization)
