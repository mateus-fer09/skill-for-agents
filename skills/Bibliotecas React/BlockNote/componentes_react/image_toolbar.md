---
title: "File Panel"
description: "The File Panel appears whenever you select a file (e.g. an image or video) that doesn't have a URL, or when you click the "Replace File" button in the [Formatting Toolbar](/docs/re"
topics:
  - "Componentes react"
keywords:
  - "File Panel"
  - "uploadFile"
  - "Promise"
  - "resolveFileUrl"
source_scope:
  - "https://www.blocknotejs.org/docs/react/components/image-toolbar"
---

# [File Panel](#file-panel)

The File Panel appears whenever you select a file (e.g. an image or video) that doesn't have a URL, or when you click the "Replace File" button in the [Formatting Toolbar](/docs/react/components/formatting-toolbar) when a file is selected.

## [File Upload](#file-upload)

You may notice that upon creating a new BlockNote editor, the "Upload" tab in the File Panel is missing. This is because you must provide BlockNote with a function to handle file uploads using the `uploadFile` [Editor Option](/docs/reference/editor/overview#options):

```tsx
type uploadFile = (file: File) => Promise<string>;
```

`file:` The file to upload, in this case an image.

`returns:` A `Promise`, which resolves to the URL that the image can be accessed at.

The example below encodes files as base64 data URLs as a starting point. However, this is only meant for development - in production you should use your own backend:

## [Resolving URLs](#resolving-urls)

Depending on your backend implementation, the URL returned after uploading a file may not point to the file itself, but an API endpoint which lets you access the file. In this case, said file will need to be fetched from when rendering the block.

BlockNote supports this use case using the `resolveFileUrl` [editor option](/docs/reference/editor/overview#options):

```tsx
type resolveFileUrl = (url: string) => Promise<string>;
```
[

Link Toolbar

The Link Toolbar appears whenever you hover a link in the editor.](/docs/react/components/hyperlink-toolbar)[

Block Side Menu

The Block Side Menu appears on the left side whenever you hover a block.](/docs/react/components/side-menu)
