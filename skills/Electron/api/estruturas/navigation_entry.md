---
title: "NavigationEntry Object"
description: "- url string"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "NavigationEntry Object"
  - "title"
  - "pageState"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/navigation-entry"
---

# NavigationEntry Object

- `url` string

- `title` string

- `pageState` string (optional) - A base64 encoded data string containing Chromium page state
including information like the current scroll position or form values. It is committed by
Chromium before a navigation event and on a regular interval.
