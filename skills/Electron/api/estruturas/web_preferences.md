---
title: "WebPreferences Object"
description: "- devTools boolean (optional) - Whether to enable DevTools. If it is set to false , can not use BrowserWindow.webContents.openDevTools() to open DevTools. Por padrão é true ."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "WebPreferences Object"
  - "devTools"
  - "false"
  - "true"
  - "nodeIntegration"
  - "nodeIntegrationInWorker"
  - "nodeIntegrationInSubFrames"
  - "process.isMainFrame"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/web-preferences"
---

# WebPreferences Object

- `devTools` boolean (optional) - Whether to enable DevTools. If it is set to `false`, can not use `BrowserWindow.webContents.openDevTools()` to open DevTools. Por padrão é `true`.

- `nodeIntegration` boolean (optional) - Whether node integration is enabled. Por padrão é `false`.

- `nodeIntegrationInWorker` boolean (optional) - Whether node integration is enabled in web workers. Por padrão é `false`. More about this can be found in [Multithreading](/pt/docs/latest/tutorial/multithreading).

- `nodeIntegrationInSubFrames` boolean (optional) - Experimental option for enabling Node.js support in sub-frames such as iframes and child windows. All your preloads will load for every iframe, you can use `process.isMainFrame` to determine if you are in the main frame or not.

- `preload` string (optional) - Specifies a script that will be loaded before other scripts run in the page. This script will always have access to node APIs no matter whether node integration is turned on or off. The value should be the absolute file path to the script. When node integration is turned off, the preload script can reintroduce Node global symbols back to the global scope. See example [here](/pt/docs/latest/api/context-bridge#exposing-node-global-symbols).

- `sandbox` boolean (optional) - If set, this will sandbox the renderer associated with the window, making it compatible with the Chromium OS-level sandbox and disabling the Node.js engine. This is not the same as the `nodeIntegration` option and the APIs available to the preload script are more limited. Default is `true` since Electron 20. The sandbox will automatically be disabled when `nodeIntegration` is set to `true`. Read more about the option [here](/pt/docs/latest/tutorial/sandbox).

- `session` [Session](/pt/docs/latest/api/session#class-session) (optional) - Sets the session used by the page. Instead of passing the Session object directly, you can also choose to use the `partition` option instead, which accepts a partition string. When both `session` and `partition` are provided, `session` will be preferred. Default is the default session.

- `partition` string (optional) - Sets the session used by the page according to the session's partition string. If `partition` starts with `persist:`, the page will use a persistent session available to all pages in the app with the same `partition`. If there is no `persist:` prefix, the page will use an in-memory session. By assigning the same `partition`, multiple pages can share the same session. Default is the default session.

- `zoomFactor` number (optional) - The default zoom factor of the page, `3.0` represents `300%`. Por padrão é `1.0`.

- `javascript` boolean (optional) - Enables JavaScript support. Por padrão é `true`.

- `webSecurity` boolean (optional) - When `false`, it will disable the same-origin policy (usually using testing websites by people), and set `allowRunningInsecureContent` to `true` if this option has not been set by user. Por padrão é `true`.

- `allowRunningInsecureContent` boolean (optional) - Allow an https page to run JavaScript, CSS or plugins from http URLs. Por padrão é `false`.

- `images` boolean (optional) - Enables image support. Por padrão é `true`.

- `imageAnimationPolicy` string (optional) - Specifies how to run image animations (E.g. GIFs).  Can be `animate`, `animateOnce` or `noAnimation`.  Por padrão é `animate`.

- `textAreasAreResizable` boolean (optional) - Make TextArea elements resizable. Default is `true`.

- `webgl` boolean (optional) - Enables WebGL support. Por padrão é `true`.

- `plugins` boolean (optional) - Whether plugins should be enabled. Por padrão é `false`.

- `experimentalFeatures` boolean (optional) - Enables Chromium's experimental features. Por padrão é `false`.

- `scrollBounce` boolean (optional) *macOS* - Enables scroll bounce (rubber banding) effect on macOS. Por padrão é `false`.

- `enableBlinkFeatures` string (optional) - A list of feature strings separated by `,`, like `CSSVariables,KeyboardEventKey` to enable. The full list of supported feature strings can be found in the [RuntimeEnabledFeatures.json5](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5) file.

- `disableBlinkFeatures` string (optional) - A list of feature strings separated by `,`, like `CSSVariables,KeyboardEventKey` to disable. The full list of supported feature strings can be found in the [RuntimeEnabledFeatures.json5](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5) file.

- `defaultFontFamily` Object (optional) - Sets the default font for the font-family.

  - `standard` string (optional) - Defaults to `Times New Roman`.

  - `serif` string (optional) - Defaults to `Times New Roman`.

  - `sansSerif` string (optional) - Defaults to `Arial`.

  - `monospace` string (optional) - Defaults to `Courier New`.

  - `cursive` string (optional) - Defaults to `Script`.

  - `fantasy` string (optional) - Defaults to `Impact`.

  - `math` string (optional) - Defaults to `Latin Modern Math`.

- `defaultFontSize` Integer (optional) - Defaults to `16`.

- `defaultMonospaceFontSize` Integer (optional) - Defaults to `13`.

- `minimumFontSize` Integer (optional) - Defaults to `0`.

- `defaultEncoding` string (optional) - Defaults to `ISO-8859-1`.

- `backgroundThrottling` boolean (optional) - Whether to throttle animations and timers when the page becomes background. This also affects the [Page Visibility API](/pt/docs/latest/api/browser-window#page-visibility). When at least one [webContents](/pt/docs/latest/api/web-contents) displayed in a single [browserWindow](/pt/docs/latest/api/browser-window) has disabled `backgroundThrottling` then frames will be drawn and swapped for the whole window and other [webContents](/pt/docs/latest/api/web-contents) displayed by it. O padrão é `true`.

- `offscreen` Object | boolean (optional) - Whether to enable offscreen rendering for the browser window. O padrão é `false`. See the [offscreen rendering tutorial](/pt/docs/latest/tutorial/offscreen-rendering) for more details.

  - `useSharedTexture` boolean (optional) *Experimental* - Whether to use GPU shared texture for accelerated paint event. O padrão é `false`. See the [offscreen rendering tutorial](/pt/docs/latest/tutorial/offscreen-rendering) for more details.

  - `sharedTexturePixelFormat` string (optional) *Experimental* - The requested output format of the shared texture. O padrão é `argb`. The name is originated from Chromium [`media::VideoPixelFormat`](https://source.chromium.org/chromium/chromium/src/+/main:media/base/video_types.h) enum suffix and only subset of them are supported. The actual output pixel format and color space of the texture should refer to [OffscreenSharedTexture](/pt/docs/latest/api/structures/offscreen-shared-texture) object in the `paint` event.

    - `argb` - The requested output texture format is 8-bit unorm RGBA, with SRGB SDR color space.

    - `rgbaf16` - The requested output texture format is 16-bit float RGBA, with scRGB HDR color space.

    - `nv12` - The requested output texture format is 12bpp with Y plane followed by a 2x2 interleaved UV plane, with REC709 color space.

  - `deviceScaleFactor` number (optional) *Experimental* - The device scale factor of the offscreen rendering output. If not set, will use `1` as default.

- `contextIsolation` boolean (optional) - Whether to run Electron APIs and the specified `preload` script in a separate JavaScript context. Defaults to `true`. The context that the `preload` script runs in will only have access to its own dedicated `document` and `window` globals, as well as its own set of JavaScript builtins (`Array`, `Object`, `JSON`, etc.), which are all invisible to the loaded content. The Electron API will only be available in the `preload` script and not the loaded page. This option should be used when loading potentially untrusted remote content to ensure the loaded content cannot tamper with the `preload` script and any Electron APIs being used.  This option uses the same technique used by [Chrome Content Scripts](https://developer.chrome.com/extensions/content_scripts#execution-environment).  You can access this context in the dev tools by selecting the 'Electron Isolated Context' entry in the combo box at the top of the Console tab.

- `webviewTag` boolean (optional) - Whether to enable the [`<webview>` tag](/pt/docs/latest/api/webview-tag). O padrão é `false`. **Note:** The `preload` script configured for the `<webview>` will have node integration enabled when it is executed so you should ensure remote/untrusted content is not able to create a `<webview>` tag with a possibly malicious `preload` script. You can use the `will-attach-webview` event on [webContents](/pt/docs/latest/api/web-contents) to strip away the `preload` script and to validate or alter the `<webview>`'s initial settings.

- `additionalArguments` string[] (optional) - A list of strings that will be appended to `process.argv` in the renderer process of this app.  Useful for passing small bits of data down to renderer process preload scripts.

- `safeDialogs` boolean (optional) - Whether to enable browser style consecutive dialog protection. Por padrão é `false`.

- `safeDialogsMessage` string (optional) - The message to display when consecutive dialog protection is triggered. If not defined the default message would be used, note that currently the default message is in English and not localized.

- `disableDialogs` boolean (optional) - Whether to disable dialogs completely. Overrides `safeDialogs`. Por padrão é `false`.

- `navigateOnDragDrop` boolean (optional) - Whether dragging and dropping a file or link onto the page causes a navigation. Por padrão é `false`.

- `autoplayPolicy` string (optional) - Autoplay policy to apply to content in the window, can be `no-user-gesture-required`, `user-gesture-required`, `document-user-activation-required`. Padrão sendo `no-user-gesture-required`.

- `disableHtmlFullscreenWindowResize` boolean (optional) - Whether to prevent the window from resizing when entering HTML Fullscreen. Default is `false`.

- `accessibleTitle` string (optional) - An alternative title string provided only to accessibility tools such as screen readers. This string is not directly visible to users.

- `spellcheck` boolean (optional) - Whether to enable the builtin spellchecker. Por padrão é `true`.

- `enableWebSQL` boolean (optional) - Whether to enable the [WebSQL api](https://www.w3.org/TR/webdatabase/). Por padrão é `true`.

- `v8CacheOptions` string (optional) - Enforces the v8 code caching policy used by blink. Accepted values are

  - `none` - Disables code caching

  - `code` - Heuristic based code caching

  - `bypassHeatCheck` - Bypass code caching heuristics but with lazy compilation

  - `bypassHeatCheckAndEagerCompile` - Same as above except compilation is eager. Default policy is `code`.

- `enablePreferredSizeMode` boolean (optional) - Whether to enable preferred size mode. The preferred size is the minimum size needed to contain the layout of the document—without requiring scrolling. Enabling this will cause the `preferred-size-changed` event to be emitted on the `WebContents` when the preferred size changes. Por padrão é `false`.

- `transparent` boolean (optional) - Whether to enable background transparency for the guest page. Por padrão é `true`. **Note:** The guest page's text and background colors are derived from the [color scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) of its root element. When transparency is enabled, the text color will still change accordingly but the background will remain transparent.

- `enableDeprecatedPaste` boolean (optional) *Deprecated* - Whether to enable the `paste` [execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand). Por padrão é `false`.

- `focusOnNavigation` boolean (optional) - Whether to focus the WebContents when navigating. Por padrão é `true`.
