---
title: "Web Embeds"
description: "## Visão Geral"
topics:
  - "Recursos e guias"
  - "Web e dispositivos"
keywords:
  - "Web Embeds"
  - "BrowserWindow"
  - "WebContentsView"
  - "sandbox"
  - "iframe"
  - "webviewTag"
  - "true"
  - "webPreferences"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/web-embeds"
---

# Web Embeds

## Visão Geral

If you want to embed (third-party) web content in an Electron `BrowserWindow`, there are three options available to you: `<iframe>` tags, `<webview>` tags, and `WebContentsView`. Each one offers slightly different functionality and is useful in different situations. To help you choose between these, this guide explains the differences and capabilities of each option.

### Iframes

Iframes no Electron se comportam como em navegadores regulares. An `<iframe>` element in your page can show external web pages, provided that their [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) allows it. To limit the number of capabilities of a site in an `<iframe>` tag, it is recommended to use the [`sandbox` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox) and only allow the capabilities you want to support.

### WebViews

> [!NOTE]
> 

> info

> 

[We do not recommend you to use WebViews](/pt/docs/latest/api/webview-tag#warning), as this tag undergoes dramatic architectural changes that may affect stability of your application. Consider switching to alternatives, like `iframe` and Electron's [`WebContentsView`](/pt/docs/latest/api/web-contents-view), or an architecture that avoids embedded content by design.

[WebViews](/pt/docs/latest/api/webview-tag) are based on Chromium's WebViews and are not explicitly supported by Electron. We do not guarantee that the WebView API will remain available in future versions of Electron. To use `<webview>` tags, you will need to set `webviewTag` to `true` in the `webPreferences` of your `BrowserWindow`.

WebView is a custom element (`<webview>`) that will only work inside Electron. Eles são implementados como um "iframe fora de processo". This means that all communication with the `<webview>` is done asynchronously using IPC. The `<webview>` element has many custom methods and events, similar to `webContents`, that provide you with greater control over the content.

Compared to an `<iframe>`, `<webview>` tends to be slightly slower but offers much greater control in loading and communicating with the third-party content and handling various events.

### WebContentsView

[`WebContentsView`](/pt/docs/latest/api/web-contents-view)s are not a part of the DOM—instead, they are created, controlled, positioned, and sized by your Main process. Using `WebContentsView`, you can combine and layer many pages together in the same [`BaseWindow`](/pt/docs/latest/api/base-window).

`WebContentsView`s offer the greatest control over their contents, since they implement the `webContents` similarly to how `BrowserWindow` does it. However, as `WebContentsView`s are not elements inside the DOM, positioning them accurately with respect to DOM content requires coordination between the Main and Renderer processes.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/web-embeds.md)[AnteriorSpellChecker](/pt/docs/latest/tutorial/spellchecker)[AvançarTaskbar Customization](/pt/docs/latest/tutorial/windows-taskbar)
