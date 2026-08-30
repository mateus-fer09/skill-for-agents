---
title: "Objeto WebRequestFilter"
description: "- urls string[] - Array of [URL patterns](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns) used to include requests that match these patterns."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto WebRequestFilter"
  - "urls"
  - "excludeUrls"
  - "types"
  - "mainFrame"
  - "subFrame"
  - "stylesheet"
  - "script"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/web-request-filter"
---

# Objeto WebRequestFilter

- `urls` string[] - Array of [URL patterns](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns) used to include requests that match these patterns. Use the pattern `<all_urls>` to match all URLs.

- `excludeUrls` string[] (optional) - Array of [URL patterns](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns) used to exclude requests that match these patterns.

- `types` string[] (optional) - Array of types that will be used to filter out the requests that do not match the types. When not specified, all types will be matched. Can be `mainFrame`, `subFrame`, `stylesheet`, `script`, `image`, `font`, `object`, `xhr`, `ping`, `cspReport`, `media` or `webSocket`.
