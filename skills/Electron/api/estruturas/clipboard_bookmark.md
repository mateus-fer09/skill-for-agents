---
title: "ClipboardBookmark Object"
description: "- title string - The title of the bookmark."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "ClipboardBookmark Object"
  - "title"
  - "ClipboardBookmark"
  - "ClipboardItem"
  - "data"
source_scope:
  - "https://electronjs.org/docs/latest/api/structures/clipboard-bookmark"
---

# ClipboardBookmark Object

- `title` string - The title of the bookmark.

- `url` string - The URL of the bookmark.

A `ClipboardBookmark` is the payload used by the `electron application/bookmark`
clipboard custom format. It is passed to
[`clipboard.write()`](/docs/latest/api/clipboard#clipboardwritedata) as a
[`ClipboardItem`](/docs/latest/api/clipboard-item) `data` value, and is what
`getType('electron application/bookmark')` resolves to when reading via
[`clipboard.read()`](/docs/latest/api/clipboard#clipboardread).[Edit this page](https://github.com/electron/electron/edit/main/docs/api/structures/clipboard-bookmark.md)
