---
title: "Breaking Changes"
description: "Breaking changes will be documented here, and deprecation warnings added to JS code where possible, at least [one major version](/pt/docs/latest/tutorial/electron-versioning#semver"
topics:
  - "Referencia"
keywords:
  - "Breaking Changes"
  - "chromedriver"
  - "mksnapshot"
  - "ffmpeg"
  - "node.lib"
  - "clipboard"
  - "navigator.clipboard"
  - "contextBridge"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/breaking-changes"
---

# Breaking Changes

Breaking changes will be documented here, and deprecation warnings added to JS code where possible, at least [one major version](/pt/docs/latest/tutorial/electron-versioning#semver) before the change is made.

### Types of Breaking Changes

This document uses the following convention to categorize breaking changes:

- **API Changed:** An API was changed in such a way that code that has not been updated is guaranteed to throw an exception.

- **Behavior Changed:** The behavior of Electron has changed, but not in such a way that an exception will necessarily be thrown.

- **Default Changed:** Code depending on the old default may break, not necessarily throwing an exception. The old behavior can be restored by explicitly specifying the value.

- **Deprecated:** An API was marked as deprecated. The API will continue to function, but will emit a deprecation warning, and will be removed in a future release.

- **Removed:** An API or feature was removed, and is no longer supported by Electron.

## Alterações planejadas na API (44.0)

### Removed: macOS 12 support

macOS 12 (Monterey) is no longer supported by [Chromium](https://chromium-review.googlesource.com/c/chromium/src/+/7907086).

Older versions of Electron will continue to run on Monterey, but macOS 13 (Ventura) or later will be required to run Electron v44.0.0 and higher.

### Removed: Windows 32-bit (ia32) and Linux 32-bit ARM (armv7l) support

Electron no longer publishes prebuilt binaries for 32-bit platforms: Windows x86 (`win32-ia32`) and Linux ARM (`linux-armv7l`). All related release artifacts (`chromedriver`, `mksnapshot`, `ffmpeg`, and the Windows x86 `node.lib` on the Electron headers CDN) are no longer published either.

Older versions of Electron will continue to support these platforms, but Electron v44.0.0 and higher will only be published for 64-bit platforms.

Once the v43 series reaches end of life in January 2027, these 32-bit platforms will no longer be supported.

### Removed: `clipboard` module is no longer available in the renderer process

The `clipboard` module is no longer exposed to renderer processes. It was [previously deprecated](#deprecated-clipboard-api-access-from-renderer-processes) and is now removed in line with [RFC 0019](https://github.com/electron/rfcs/blob/main/text/0019-clipboard-rearchitecture.md#removing-the-clipboard-api-from-the-renderer) to close the security risk of granting non-sandboxed renderers direct clipboard access.

Renderers should use the [`navigator.clipboard` API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) to safely work with the system clipboard. If more advanced usage is necessary, expose the necessary helpers from a preload script using the [`contextBridge` API](/pt/docs/latest/api/context-bridge). When using `contextBridge` care must be taken to ensure that the [`clipboard API` is not exposed to untrusted content](https://www.electronjs.org/docs/latest/tutorial/security#20-do-not-expose-electron-apis-to-untrusted-web-content).

## Alterações planejadas na API (43.0)

### Behavior Changed: Rounded corners on Linux

Frameless windows default to rounded corners on Linux if the desktop environment supports client-side decorations. This can be configured using the existing `roundedCorners` option on `BrowserWindow`, which is now supported on Linux and defaults to `true` on all platforms.

### Behavior Changed: WCO respects the native title bar layout on Linux

Frameless windows with Window Controls Overlay (WCO) now adopt the native title bar layout and user settings on Linux. For example, controls will appear on the left side of the frame on RTL systems, and only the close button will be visible by default on GNOME. Depending on the user's desktop environment and configuration, buttons can appear on the left or right side of the frame (or both). To account for all possibilities, use the CSS variables `env(titlebar-area-x, 0px)` and `env(titlebar-area-width, 100%)` to constrain your app's title bar content to a safe area.

### Behavior Changed: `NativeImage.toBitmap()` now normalizes color space

`NativeImage.toBitmap()` (and its deprecated alias `NativeImage.getBitmap()`) now normalizes pixel data to sRGB by default. Previously, raw pixel data was returned without color space conversion, which meant pixel values from images with different embedded color profiles (e.g., Display P3 on macOS) could differ for the same visual color.

To preserve the previous behavior, pass the image's original color space in the `colorSpace` option. You can also pass `colorSpace` to convert to any other specific color space:

```javascript
const image = nativeImage.createFromPath('photo.png')  
// New default: normalized to sRGB  
const srgbBitmap = image.toBitmap()  
// Convert to Display P3  
const p3Bitmap = image.toBitmap({  
  colorSpace: {  
    primaries: 'p3',  
    transfer: 'srgb',  
    matrix: 'rgb',  
    range: 'full'  
  }  
})  

```

### Behavior Changed: `chrome.scripting` CSS injection matches more fallback frames

Extensions using `chrome.scripting.insertCSS()` or `chrome.scripting.removeCSS()` now follow Chrome's behavior when Electron cannot match a frame's URL directly, such as with `about:blank` or `data:` frames. If the extension has access to the page that created the frame, CSS may now be inserted into or removed from those fallback frames as well.

Apps or extensions that relied on Electron skipping those frames should narrow their injection target, frame IDs, or match patterns.

### Behavior Changed: Dialog methods default to Downloads directory

The `defaultPath` option for the following methods now defaults to the user's Downloads folder (or their home directory if Downloads doesn't exist) when not explicitly provided:

- `dialog.showOpenDialog`

- `dialog.showOpenDialogSync`

- `dialog.showSaveDialog`

- `dialog.showSaveDialogSync`

Previously, when no `defaultPath` was provided, the underlying OS file dialog would determine the initial directory — typically remembering the last directory the user navigated to, or falling back to an OS-specific default. Now, Electron explicitly sets the initial directory to Downloads, which also means the OS will no longer track and restore the last-used directory between dialog invocations.

To preserve the old behavior, you can track the last-used directory yourself and pass it as `defaultPath`:

```javascript
const path = require('node:path')  
  
let lastUsedPath  
const result = await dialog.showOpenDialog({  
  defaultPath: lastUsedPath  
})  
  
if (!result.canceled && result.filePaths.length > 0) {  
  lastUsedPath = path.dirname(result.filePaths[0])  
}  

```

### Removed: `showHiddenFiles` in Dialogs on Linux

The `showHiddenFiles` property is no longer supported on Linux. It continues to work on macOS and Windows. GTK intends for this feature to be a user choice rather than an app choice, and has removed the API to do this programmatically.

## Alterações planejadas na API (42.0)

### Behavior Changed: macOS notifications now use `UNNotification` API

Electron has migrated from the deprecated `NSUserNotification` API to the [`UNNotification`](https://developer.apple.com/documentation/usernotifications) API on macOS. The new API requires that an application be code-signed in order for notifications to be displayed. If an application is not code-signed, notifications will emit a `failed` event on the `Notification` object.

### Behavior Changed: Offscreen rendering will use `1.0` as default device scale factor.

Previously, OSR used the primary display's device scale factor for rendering, which made the output frame size vary across users. Developers had to manually calculate the correct size using `screen.getPrimaryDisplay().scaleFactor`. We now provide an optional property `webPreferences.offscreen.deviceScaleFactor` to specify a custom value when creating an OSR window. At first, if the property is not set, it defaults to the primary display's scale factor (preserving the old behavior). Starting from Electron 42, the default will change to a constant value of `1.0` for more consistent output sizes.

### Behavior Changed: `electron` no longer downloads itself via `postinstall` script

Previously, the `electron` npm package would download the Electron binary from the repository's GitHub Releases in the package's `postinstall` script.

With recent supply chain security attacks against the npm ecosystem with `postinstall` scripts as a common attack vector, Electron will now download itself dynamically the first time that its main `bin` script is run (e.g. via `npx electron`). With this change, you can now use Electron with the npm `--ignore-scripts` flag. See [RFC #22](https://github.com/electron/rfcs/pull/22) for more context.

```javascript
# won't install binary to `node_modules/electron`  
npm install electron --save-dev --ignore-scripts  
  
# will download the binary on demand before starting electron process  
npx electron .  
  
# subsequent runs will used the binary downloaded from the first run  
npx electron .  

```

If you need to download the Electron binary on-demand, you can now call the `install-electron` script, which contains the exact same code from the former `postinstall` script.

```javascript
npm install electron --save-dev --ignore-scripts  
npx install-electron --no  

```

If you need to test changes across platforms or architectures, you should now use the `ELECTRON_INSTALL_ARCH` and `ELECTRON_INSTALL_PLATFORM` environment variables.

```javascript
# before: pass npm config flag on install command  
npm install --platform=mas electron --save-dev  
# after: add env var when you first run the Electron command  
npm install electron --save-dev  
ELECTRON_INSTALL_PLATFORM=mas npx electron . --no  

```

This also means the `ELECTRON_SKIP_BINARY_DOWNLOAD` environment variable is no longer supported, as its primary purpose was to prevent the `postinstall` script from running.

### Removed: `quotas` object from `Session.clearStorageData(options)`

When calling `Session.clearStorageData(options)`, the `options.quotas` object is no longer supported because it has been [removed](https://chromium-review.googlesource.com/c/chromium/src/+/7596126) from upstream Chromium.

### Deprecated: Passing only an array `hslShift` to `nativeImage.createFromNamedImage()`

Passing only an array `hslShift` to `nativeImage.createFromNamedImage()` is deprecated. You should now pass an options object with an `hslShift` property instead:

```javascript
// Deprecated  
nativeImage.createFromNamedImage(imageName, [0, 1, -1])  
// Replace with  
nativeImage.createFromNamedImage(imageName, {  
  hslShift: [0, 1, -1]  
})  

```

## Alterações planejadas na API (41.0)

### Behavior Changed: PDFs no longer create a separate WebContents

Previously, PDF resources created a separate guest [WebContents](https://www.electronjs.org/docs/latest/api/web-contents) for rendering. Now, PDFs are rendered within the same WebContents instead. If you have code to detect PDF resources, use the [frame tree](https://www.electronjs.org/docs/latest/api/web-frame-main) instead of WebContents.

Under the hood, Chromium [enabled](https://chromium-review.googlesource.com/c/chromium/src/+/7239572) a feature that changes PDFs to use out-of-process iframes (OOPIFs) instead of the `MimeHandlerViewGuest` extension.

### Behavior Changed: Updated Cookie Change Cause in the Cookie 'changed' Event

We have updated the [cookie](https://www.electronjs.org/docs/latest/api/cookies#event-changed) change cause in the cookie 'changed' event. When a new cookie is set, the change cause is `inserted`. When a cookie is deleted, the change cause remains `explicit`. When the cookie being set is identical to an existing one (same name, domain, path, and value, with no actual changes), the change cause is `inserted-no-change-overwrite`. When the value of the cookie being set remains unchanged but some of its attributes are updated, such as the expiration attribute, the change cause will be `inserted-no-value-change-overwrite`.

### Deprecated: `showHiddenFiles` in Dialogs on Linux

This property will still be honored on macOS and Windows, but support on Linux will be removed in a future version of Electron. GTK intends for this to be a user choice rather than an app choice and has removed the API to do this programmatically.

## Alterações planejadas na API (40.0)

### Deprecated: `clipboard` API access from renderer processes

Using the `clipboard` API directly in the renderer process is deprecated. If you want to call this API from a renderer process, place the API call in your preload script and expose it using the [contextBridge](https://www.electronjs.org/docs/latest/api/context-bridge) API.

### Behavior Changed: MacOS dSYM files now compressed with tar.xz

Debug symbols for MacOS (dSYM) now use xz compression in order to handle larger file sizes. `dsym.zip` files are now `dsym.tar.xz` files. End users using debug symbols may need to update their zip utilities.

## Alterações planejadas na API (39.0)

### Deprecated: `--host-rules` command line switch

Chromium is deprecating the `--host-rules` switch.

You should use `--host-resolver-rules` instead.

### Behavior Changed: window.open popups are always resizable

Per current [WHATWG spec](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-open-dev), the `window.open` API will now always create a resizable popup window.

To restore previous behavior:

```javascript
webContents.setWindowOpenHandler((details) => {  
  return {  
    action: 'allow',  
    overrideBrowserWindowOptions: {  
      resizable: details.features.includes('resizable=yes')  
    }  
  }  
})  

```

### Behavior Changed: `NSAudioCaptureUsageDescription` should be included in your app's Info.plist file to use `desktopCapturer` (🍏 macOS ≥14.2)

Per [Chromium update](https://source.chromium.org/chromium/chromium/src/+/ad17e8f8b93d5f34891b06085d373a668918255e) which enables Apple's newer [CoreAudio Tap API](https://developer.apple.com/documentation/CoreAudio/capturing-system-audio-with-core-audio-taps#Configure-the-sample-code-project) by default, you now must have `NSAudioCaptureUsageDescription` defined in your `Info.plist` to use `desktopCapturer`.

Electron's `desktopCapturer` will create a dead audio stream if the new permission is absent however no errors or warnings will occur. This is partially a side-effect of Chromium not falling back to the older `Screen & System Audio Recording` permissions system if the new system fails.

To restore previous behavior:

```javascript
// main.js (right beneath your require/import statments)  
app.commandLine.appendSwitch(  
  'disable-features',  
  'MacCatapLoopbackAudioForScreenShare'  
)  

```

### Behavior Changed: shared texture OSR `paint` event data structure

When using shared texture offscreen rendering feature, the `paint` event now emits a more structured object. It moves the `sharedTextureHandle`, `planes`, `modifier` into a unified `handle` property. See the [OffscreenSharedTexture](/pt/docs/latest/api/structures/offscreen-shared-texture) API structure for more details.

## Alterações planejadas na API (38.0)

### Removed: `ELECTRON_OZONE_PLATFORM_HINT` environment variable

The default value of the `--ozone-platform` flag [changed to `auto`](https://chromium-review.googlesource.com/c/chromium/src/+/6775426).

Electron now defaults to running as a native Wayland app when launched in a Wayland session (when `XDG_SESSION_TYPE=wayland`). Users can force XWayland by passing `--ozone-platform=x11`.

### Removed: `ORIGINAL_XDG_CURRENT_DESKTOP` environment variable

Previously, Electron changed the value of `XDG_CURRENT_DESKTOP` internally to `Unity`, and stored the original name of the desktop session in a separate variable. `XDG_CURRENT_DESKTOP` is no longer overridden and now reflects the actual desktop environment.

### Removed: macOS 11 support

macOS 11 (Big Sur) is no longer supported by [Chromium](https://chromium-review.googlesource.com/c/chromium/src/+/6594615).

Older versions of Electron will continue to run on Big Sur, but macOS 12 (Monterey) or later will be required to run Electron v38.0.0 and higher.

### Removed: `plugin-crashed` event

The `plugin-crashed` event has been removed from `webContents`.

### Deprecated: `webFrame.routingId` property

The `routingId` property will be removed from `webFrame` objects.

You should use `webFrame.frameToken` instead.

### Descontinuado: `webFrame.findFrameByRoutingId(routingId)`

The `webFrame.findFrameByRoutingId(routingId)` function will be removed.

You should use `webFrame.findFrameByToken(frameToken)` instead.

## Alterações planejadas na API (37.0)

### Utility Process unhandled rejection behavior change

Utility Processes will now warn with an error message when an unhandled rejection occurs instead of crashing the process.

To restore the previous behavior, you can use:

```javascript
process.on('unhandledRejection', () => {  
  process.exit(1)  
})  

```

### Behavior Changed: `process.exit()` kills utility process synchronously

Calling `process.exit()` in a utility process will now kill the utility process synchronously. This brings the behavior of `process.exit()` in line with Node.js behavior.

Please refer to the [Node.js docs](https://nodejs.org/docs/latest-v22.x/api/process.html#processexitcode) and [PR #45690](https://github.com/electron/electron/pull/45690) to understand the potential implications of that, e.g., when calling `console.log()` before `process.exit()`.

### Behavior Changed: WebUSB and WebSerial Blocklist Support

[WebUSB](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API) and [Web Serial](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) now support the [WebUSB Blocklist](https://wicg.github.io/webusb/#blocklist) and [Web Serial Blocklist](https://wicg.github.io/serial/#blocklist) used by Chromium and outlined in their respective specifications.

To disable these, users can pass `disable-usb-blocklist` and `disable-serial-blocklist` as command line flags.

### Removed: `null` value for `session` property in `ProtocolResponse`

This deprecated feature has been removed.

Previously, setting the `ProtocolResponse.session` property to `null` would create a random independent session. This is no longer supported.

Using single-purpose sessions here is discouraged due to overhead costs; however, old code that needs to preserve this behavior can emulate it by creating a random session with `session.fromPartition(some_random_string)` and then using it in `ProtocolResponse.session`.

### Behavior Changed: `BrowserWindow.IsVisibleOnAllWorkspaces()` on Linux

`BrowserWindow.IsVisibleOnAllWorkspaces()` will now return false on Linux if the window is not currently visible.

## Alterações planejadas na API (36.0)

### Behavior Changes: `app.commandLine`

`app.commandLine` will convert upper-cases switches and arguments to lowercase.

`app.commandLine` was only meant to handle chromium switches (which aren't case-sensitive) and switches passed via `app.commandLine` will not be passed down to any of the child processes.

If you were using `app.commandLine` to control the behavior of the main process, you should do this via `process.argv`.

### Descontinuado: `NativeImage.getBitmap()`

`NativeImage.toBitmap()` returns a newly-allocated copy of the bitmap. `NativeImage.getBitmap()` was originally an alternative function that returned the original instead of a copy. This changed when sandboxing was introduced, so both return a copy and are functionally equivalent.

Client code should call `NativeImage.toBitmap()` instead:

```javascript
// Deprecated  
bitmap = image.getBitmap()  
// Use this instead  
bitmap = image.toBitmap()  

```

### Removed: `isDefault` and `status` properties on `PrinterInfo`

These properties have been removed from the PrinterInfo Object because they have been removed from upstream Chromium.

### Removed: `quota` type `syncable` in `Session.clearStorageData(options)`

When calling `Session.clearStorageData(options)`, the `options.quota` type `syncable` is no longer supported because it has been [removed](https://chromium-review.googlesource.com/c/chromium/src/+/6309405) from upstream Chromium.

### Deprecated: `null` value for `session` property in `ProtocolResponse`

Previously, setting the ProtocolResponse.session property to `null` would create a random independent session. This is no longer supported.

Using single-purpose sessions here is discouraged due to overhead costs; however, old code that needs to preserve this behavior can emulate it by creating a random session with `session.fromPartition(some_random_string)` and then using it in `ProtocolResponse.session`.

### Deprecated: `quota` property in `Session.clearStorageData(options)`

When calling `Session.clearStorageData(options)`, the `options.quota` property is deprecated. Since the `syncable` type was removed, there is only one type left -- `'temporary'` -- so specifying it is unnecessary.

### Deprecated: Extension methods and events on `session`

`session.loadExtension`, `session.removeExtension`, `session.getExtension`, `session.getAllExtensions`, 'extension-loaded' event, 'extension-unloaded' event, and 'extension-ready' events have all moved to the new `session.extensions` class.

### Removido: `systemPreferences.isAeroGlassEnabled()`

The `systemPreferences.isAeroGlassEnabled()` function has been removed without replacement. It has been always returning `true` since Electron 23, which only supports Windows 10+, where DWM composition can no longer be disabled.

[https://learn.microsoft.com/en-us/windows/win32/dwm/composition-ovw#disabling-dwm-composition-windows7-and-earlier](https://learn.microsoft.com/en-us/windows/win32/dwm/composition-ovw#disabling-dwm-composition-windows7-and-earlier)

### Changed: GTK 4 is default when running GNOME

After an [upstream change](https://chromium-review.googlesource.com/c/chromium/src/+/6310469), GTK 4 is now the default when running GNOME.

In rare cases, this may cause some applications or configurations to [error](https://github.com/electron/electron/issues/46538) with the following message:

```javascript
Gtk-ERROR **: 11:30:38.382: GTK 2/3 symbols detected. Using GTK 2/3 and GTK 4 in the same process is not supported  

```

Affected users can work around this by specifying the `gtk-version` command-line flag:

```javascript
$ electron --gtk-version=3   # or --gtk-version=2  

```

The same can be done with the [`app.commandLine.appendSwitch`](https://www.electronjs.org/docs/latest/api/command-line#commandlineappendswitchswitch-value) function.

## Alterações planejadas na API (35.0)

### Behavior Changed: Dialog API's `defaultPath` option on Linux

On Linux, the required portal version for file dialogs has been reverted to 3 from 4. Using the `defaultPath` option of the Dialog API is not supported when using portal file chooser dialogs unless the portal backend is version 4 or higher. The `--xdg-portal-required-version` [command-line switch](/pt/docs/latest/api/command-line-switches#--xdg-portal-required-versionversion) can be used to force a required version for your application. See [#44426](https://github.com/electron/electron/pull/44426) for more details.

### Deprecated: `getFromVersionID` on `session.serviceWorkers`

The `session.serviceWorkers.fromVersionID(versionId)` API has been deprecated in favor of `session.serviceWorkers.getInfoFromVersionID(versionId)`. This was changed to make it more clear which object is returned with the introduction of the `session.serviceWorkers.getWorkerFromVersionID(versionId)` API.

```javascript
// Deprecated  
session.serviceWorkers.fromVersionID(versionId)  
  
// Replace with  
session.serviceWorkers.getInfoFromVersionID(versionId)  

```

### Deprecated: `setPreloads`, `getPreloads` on `Session`

`registerPreloadScript`, `unregisterPreloadScript`, and `getPreloadScripts` are introduced as a replacement for the deprecated methods. These new APIs allow third-party libraries to register preload scripts without replacing existing scripts. Also, the new `type` option allows for additional preload targets beyond `frame`.

```javascript
// Deprecated  
session.setPreloads([path.join(__dirname, 'preload.js')])  
  
// Replace with:  
session.registerPreloadScript({  
  type: 'frame',  
  id: 'app-preload',  
  filePath: path.join(__dirname, 'preload.js')  
})  

```

### Deprecated: `level`, `message`, `line`, and `sourceId` arguments in `console-message` event on `WebContents`

The `console-message` event on `WebContents` has been updated to provide details on the `Event` argument.

```javascript
// Deprecated  
webContents.on('console-message', (event, level, message, line, sourceId) => {})  
  
// Replace with:  
webContents.on('console-message', ({ level, message, lineNumber, sourceId, frame }) => {})  

```

Additionally, `level` is now a string with possible values of `info`, `warning`, `error`, and `debug`.

### Behavior Changed: `urls` property of `WebRequestFilter`.

Previously, an empty urls array was interpreted as including all URLs. To explicitly include all URLs, developers should now use the `<all_urls>` pattern, which is a [designated URL pattern](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns#all_urls) that matches every possible URL. This change clarifies the intent and ensures more predictable behavior.

```javascript
// Deprecated  
const deprecatedFilter = {  
  urls: []  
}  
  
// Replace with  
const newFilter = {  
  urls: ['<all_urls>']  
}  

```

### Descontinuado: `systemPreferences.isAeroGlassEnabled()`

The `systemPreferences.isAeroGlassEnabled()` function has been deprecated without replacement. It has been always returning `true` since Electron 23, which only supports Windows 10+, where DWM composition can no longer be disabled.

[https://learn.microsoft.com/en-us/windows/win32/dwm/composition-ovw#disabling-dwm-composition-windows7-and-earlier](https://learn.microsoft.com/en-us/windows/win32/dwm/composition-ovw#disabling-dwm-composition-windows7-and-earlier)

## Alterações planejadas na API (34.0)

### Behavior Changed: menu bar will be hidden during fullscreen on Windows

This brings the behavior to parity with Linux. Prior behavior: Menu bar is still visible during fullscreen on Windows. New behavior: Menu bar is hidden during fullscreen on Windows.

**Correction**: This was previously listed as a breaking change in Electron 33, but was first released in Electron 34.

## Alterações planejadas na API (33.0)

### Descontinuado: `document.execCommand("paste")`

The synchronous clipboard read API [document.execCommand("paste")](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard) has been deprecated in favor of [async clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API). This is to align with the browser defaults.

The `enableDeprecatedPaste` option on `WebPreferences` that triggers the permission checks for this API and the associated permission type `deprecated-sync-clipboard-read` are also deprecated.

### Behavior Changed: frame properties may retrieve detached WebFrameMain instances or none at all

APIs which provide access to a `WebFrameMain` instance may return an instance with `frame.detached` set to `true`, or possibly return `null`.

When a frame performs a cross-origin navigation, it enters into a detached state in which it's no longer attached to the page. In this state, it may be running [unload](https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event) handlers prior to being deleted. In the event of an IPC sent during this state, `frame.detached` will be set to `true` with the frame being destroyed shortly thereafter.

When receiving an event, it's important to access WebFrameMain properties immediately upon being received. Otherwise, it's not guaranteed to point to the same webpage as when received. To avoid misaligned expectations, Electron will return `null` in the case of late access where the webpage has changed.

```javascript
ipcMain.on('unload-event', (event) => {  
  event.senderFrame // ✅ accessed immediately  
})  
  
ipcMain.on('unload-event', async (event) => {  
  await crossOriginNavigationPromise  
  event.senderFrame // ❌ returns `null` due to late access  
})  

```

### Behavior Changed: custom protocol URL handling on Windows

Due to changes made in Chromium to support [Non-Special Scheme URLs](http://bit.ly/url-non-special), custom protocol URLs that use Windows file paths will no longer work correctly with the deprecated `protocol.registerFileProtocol` and the `baseURLForDataURL` property on `BrowserWindow.loadURL`, `WebContents.loadURL`, and `<webview>.loadURL`.  `protocol.handle` will also not work with these types of URLs but this is not a change since it has always worked that way.

```javascript
// No longer works  
protocol.registerFileProtocol('other', () => {  
  callback({ filePath: '/path/to/my/file' })  
})  
  
const mainWindow = new BrowserWindow()  
mainWindow.loadURL('data:text/html,<script src="loaded-from-dataurl.js"></script>', { baseURLForDataURL: 'other://C:\\myapp' })  
mainWindow.loadURL('other://C:\\myapp\\index.html')  
  
// Replace with  
const path = require('node:path')  
const nodeUrl = require('node:url')  
protocol.handle(other, (req) => {  
  const srcPath = 'C:\\myapp\\'  
  const reqURL = new URL(req.url)  
  return net.fetch(nodeUrl.pathToFileURL(path.join(srcPath, reqURL.pathname)).toString())  
})  
  
mainWindow.loadURL('data:text/html,<script src="loaded-from-dataurl.js"></script>', { baseURLForDataURL: 'other://' })  
mainWindow.loadURL('other://index.html')  

```

### Behavior Changed: `webContents` property on `login` on `app`

The `webContents` property in the `login` event from `app` will be `null` when the event is triggered for requests from the [utility process](/pt/docs/latest/api/utility-process) created with `respondToAuthRequestsFromMainProcess` option.

### Deprecated: `textured` option in `BrowserWindowConstructorOption.type`

The `textured` option of `type` in `BrowserWindowConstructorOptions` has been deprecated with no replacement. This option relied on the [`NSWindowStyleMaskTexturedBackground`](https://developer.apple.com/documentation/appkit/nswindowstylemask/nswindowstylemasktexturedbackground) style mask on macOS, which has been deprecated with no alternative.

### Removed: macOS 10.15 support

macOS 10.15 (Catalina) is no longer supported by [Chromium](https://chromium-review.googlesource.com/c/chromium/src/+/5734361).

Older versions of Electron will continue to run on Catalina, but macOS 11 (Big Sur) or later will be required to run Electron v33.0.0 and higher.

### Behavior Changed: Native modules now require C++20

Due to changes made upstream, both [V8](https://chromium-review.googlesource.com/c/v8/v8/+/5587859) and [Node.js](https://github.com/nodejs/node/pull/45427) now require C++20 as a minimum version. Developers using native node modules should build their modules with `--std=c++20` rather than `--std=c++17`. Images using gcc9 or lower may need to update to gcc10 in order to compile. See [#43555](https://github.com/electron/electron/pull/43555) for more details.

### Descontinuado: `systemPreferences.accessibilityDisplayShouldReduceTransparency`

The `systemPreferences.accessibilityDisplayShouldReduceTransparency` property is now deprecated in favor of the new `nativeTheme.prefersReducedTransparency`, which provides identical information and works cross-platform.

```javascript
// Deprecated  
const shouldReduceTransparency = systemPreferences.accessibilityDisplayShouldReduceTransparency  
  
// Replace with:  
const prefersReducedTransparency = nativeTheme.prefersReducedTransparency  

```

## Alterações planejadas na API (32.0)

### Removed: `File.path`

The nonstandard `path` property of the Web `File` object was added in an early version of Electron as a convenience method for working with native files when doing everything in the renderer was more common. However, it represents a deviation from the standard and poses a minor security risk as well, so beginning in Electron 32.0 it has been removed in favor of the [`webUtils.getPathForFile`](/pt/docs/latest/api/web-utils#webutilsgetpathforfilefile) method.

```javascript
// Before (renderer)  
  
const file = document.querySelector('input[type=file]').files[0]  
alert(`Uploaded file path was: ${file.path}`)  

```

```javascript
// After (renderer)  
  
const file = document.querySelector('input[type=file]').files[0]  
electron.showFilePath(file)  
  
// (preload)  
const { contextBridge, webUtils } = require('electron')  
  
contextBridge.exposeInMainWorld('electron', {  
  showFilePath (file) {  
    // It's best not to expose the full file path to the web content if  
    // possible.  
    const path = webUtils.getPathForFile(file)  
    alert(`Uploaded file path was: ${path}`)  
  }  
})  

```

### Deprecated: `clearHistory`, `canGoBack`, `goBack`, `canGoForward`, `goForward`, `goToIndex`, `canGoToOffset`, `goToOffset` on `WebContents`

The navigation-related APIs are now deprecated.

These APIs have been moved to the `navigationHistory` property of `WebContents` to provide a more structured and intuitive interface for managing navigation history.

```javascript
// Deprecated  
win.webContents.clearHistory()  
win.webContents.canGoBack()  
win.webContents.goBack()  
win.webContents.canGoForward()  
win.webContents.goForward()  
win.webContents.goToIndex(index)  
win.webContents.canGoToOffset()  
win.webContents.goToOffset(index)  
  
// Replace with  
win.webContents.navigationHistory.clear()  
win.webContents.navigationHistory.canGoBack()  
win.webContents.navigationHistory.goBack()  
win.webContents.navigationHistory.canGoForward()  
win.webContents.navigationHistory.goForward()  
win.webContents.navigationHistory.canGoToOffset()  
win.webContents.navigationHistory.goToOffset(index)  

```

### Behavior changed: Directory `databases` in `userData` will be deleted

If you have a directory called `databases` in the directory returned by `app.getPath('userData')`, it will be deleted when Electron 32 is first run. The `databases` directory was used by WebSQL, which was removed in Electron 31. Chromium now performs a cleanup that deletes this directory. See [issue #45396](https://github.com/electron/electron/issues/45396).

## Alterações planejadas na API (31.0)

### Removed: `WebSQL` support

Chromium has removed support for WebSQL upstream, transitioning it to Android only. See [Chromium's intent to remove discussion](https://groups.google.com/a/chromium.org/g/blink-dev/c/fWYb6evVA-w/m/wGI863zaAAAJ) for more information.

### Behavior Changed: `nativeImage.toDataURL` will preserve PNG colorspace

PNG decoder implementation has been changed to preserve colorspace data, the encoded data returned from this function now matches it.

See [crbug.com/332584706](https://issues.chromium.org/issues/332584706) for more information.

### Behavior Changed: `window.flashFrame(bool)` will flash dock icon continuously on macOS

This brings the behavior to parity with Windows and Linux. Prior behavior: The first `flashFrame(true)` bounces the dock icon only once (using the [NSInformationalRequest](https://developer.apple.com/documentation/appkit/nsrequestuserattentiontype/nsinformationalrequest) level) and `flashFrame(false)` does nothing. New behavior: Flash continuously until `flashFrame(false)` is called. This uses the [NSCriticalRequest](https://developer.apple.com/documentation/appkit/nsrequestuserattentiontype/nscriticalrequest) level instead. To explicitly use `NSInformationalRequest` to cause a single dock icon bounce, it is still possible to use [`dock.bounce('informational')`](https://www.electronjs.org/docs/latest/api/dock#dockbouncetype-macos).

## Alterações planejadas na API (30.0)

### Behavior Changed: cross-origin iframes now use Permission Policy to access features

Cross-origin iframes must now specify features available to a given `iframe` via the `allow` attribute in order to access them.

See [documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#allow) for more information.

### Removed: The `--disable-color-correct-rendering` switch

This switch was never formally documented but its removal is being noted here regardless. Chromium itself now has better support for color spaces so this flag should not be needed.

### Behavior Changed: `BrowserView.setAutoResize` behavior on macOS

In Electron 30, BrowserView is now a wrapper around the new [WebContentsView](/pt/docs/latest/api/web-contents-view) API.

Previously, the `setAutoResize` function of the `BrowserView` API was backed by [autoresizing](https://developer.apple.com/documentation/appkit/nsview/1483281-autoresizingmask?language=objc) on macOS, and by a custom algorithm on Windows and Linux. For simple use cases such as making a BrowserView fill the entire window, the behavior of these two approaches was identical. However, in more advanced cases, BrowserViews would be autoresized differently on macOS than they would be on other platforms, as the custom resizing algorithm for Windows and Linux did not perfectly match the behavior of macOS's autoresizing API. The autoresizing behavior is now standardized across all platforms.

If your app uses `BrowserView.setAutoResize` to do anything more complex than making a BrowserView fill the entire window, it's likely you already had custom logic in place to handle this difference in behavior on macOS. If so, that logic will no longer be needed in Electron 30 as autoresizing behavior is consistent.

### Deprecated: `BrowserView`

The [`BrowserView`](/pt/docs/latest/api/browser-view) class has been deprecated and replaced by the new [`WebContentsView`](/pt/docs/latest/api/web-contents-view) class.

`BrowserView` related methods in [`BrowserWindow`](/pt/docs/latest/api/browser-window) have also been deprecated:

```javascript
BrowserWindow.fromBrowserView(browserView)  
win.setBrowserView(browserView)  
win.getBrowserView()  
win.addBrowserView(browserView)  
win.removeBrowserView(browserView)  
win.setTopBrowserView(browserView)  
win.getBrowserViews()  

```

### Removed: `params.inputFormType` property on `context-menu` on `WebContents`

The `inputFormType` property of the params object in the `context-menu` event from `WebContents` has been removed. Use the new `formControlType` property instead.

### Removido: `process.getIOCounters()`

Chromium has removed access to this information.

## Alterações planejadas na API (29.0)

### Behavior Changed: `ipcRenderer` can no longer be sent over the `contextBridge`

Attempting to send the entire `ipcRenderer` module as an object over the `contextBridge` will now result in an empty object on the receiving side of the bridge. This change was made to remove / mitigate a security footgun. You should not directly expose ipcRenderer or its methods over the bridge. Instead, provide a safe wrapper like below:

```javascript
contextBridge.exposeInMainWorld('app', {  
  onEvent: (cb) => ipcRenderer.on('foo', (e, ...args) => cb(args))  
})  

```

### Removed: `renderer-process-crashed` event on `app`

The `renderer-process-crashed` event on `app` has been removed. Use the new `render-process-gone` event instead.

```javascript
// Removed  
app.on('renderer-process-crashed', (event, webContents, killed) => { /* ... */ })  
  
// Replace with  
app.on('render-process-gone', (event, webContents, details) => { /* ... */ })  

```

### Removed: `crashed` event on `WebContents` and `<webview>`

The `crashed` events on `WebContents` and `<webview>` have been removed. Use the new `render-process-gone` event instead.

```javascript
// Removed  
win.webContents.on('crashed', (event, killed) => { /* ... */ })  
webview.addEventListener('crashed', (event) => { /* ... */ })  
  
// Replace with  
win.webContents.on('render-process-gone', (event, details) => { /* ... */ })  
webview.addEventListener('render-process-gone', (event) => { /* ... */ })  

```

### Removed: `gpu-process-crashed` event on `app`

The `gpu-process-crashed` event on `app` has been removed. Use the new `child-process-gone` event instead.

```javascript
// Removed  
app.on('gpu-process-crashed', (event, killed) => { /* ... */ })  
  
// Replace with  
app.on('child-process-gone', (event, details) => { /* ... */ })  

```

## Alterações planejadas na API (28.0)

### Behavior Changed: `WebContents.backgroundThrottling` set to false affects all `WebContents` in the host `BrowserWindow`

`WebContents.backgroundThrottling` set to false will disable frames throttling in the `BrowserWindow` for all `WebContents` displayed by it.

### Removido: `BrowserWindow.setTrafficLightPosition(position)`

`BrowserWindow.setTrafficLightPosition(position)` has been removed, the `BrowserWindow.setWindowButtonPosition(position)` API should be used instead which accepts `null` instead of `{ x: 0, y: 0 }` to reset the position to system default.

```javascript
// Removed in Electron 28  
win.setTrafficLightPosition({ x: 10, y: 10 })  
win.setTrafficLightPosition({ x: 0, y: 0 })  
  
// Replace with  
win.setWindowButtonPosition({ x: 10, y: 10 })  
win.setWindowButtonPosition(null)  

```

### Removido: `BrowserWindow.getTrafficLightPosition()`

`BrowserWindow.getTrafficLightPosition()` has been removed, the `BrowserWindow.getWindowButtonPosition()` API should be used instead which returns `null` instead of `{ x: 0, y: 0 }` when there is no custom position.

```javascript
// Removed in Electron 28  
const pos = win.getTrafficLightPosition()  
if (pos.x === 0 && pos.y === 0) {  
  // No custom position.  
}  
  
// Replace with  
const ret = win.getWindowButtonPosition()  
if (ret === null) {  
  // No custom position.  
}  

```

### Removido: `ipcRenderer.sendTo()`

The `ipcRenderer.sendTo()` API has been removed. It should be replaced by setting up a [`MessageChannel`](/pt/docs/latest/tutorial/message-ports#setting-up-a-messagechannel-between-two-renderers) between the renderers.

The `senderId` and `senderIsMainFrame` properties of `IpcRendererEvent` have been removed as well.

### Removido: `app.runningUnderRosettaTranslation`

The `app.runningUnderRosettaTranslation` property has been removed. Use `app.runningUnderARM64Translation` instead.

```javascript
// Removed  
console.log(app.runningUnderRosettaTranslation)  
// Replace with  
console.log(app.runningUnderARM64Translation)  

```

### Deprecated: `renderer-process-crashed` event on `app`

The `renderer-process-crashed` event on `app` has been deprecated. Use the new `render-process-gone` event instead.

```javascript
// Deprecated  
app.on('renderer-process-crashed', (event, webContents, killed) => { /* ... */ })  
  
// Replace with  
app.on('render-process-gone', (event, webContents, details) => { /* ... */ })  

```

### Deprecated: `params.inputFormType` property on `context-menu` on `WebContents`

The `inputFormType` property of the params object in the `context-menu` event from `WebContents` has been deprecated. Use the new `formControlType` property instead.

### Deprecated: `crashed` event on `WebContents` and `<webview>`

The `crashed` events on `WebContents` and `<webview>` have been deprecated. Use the new `render-process-gone` event instead.

```javascript
// Deprecated  
win.webContents.on('crashed', (event, killed) => { /* ... */ })  
webview.addEventListener('crashed', (event) => { /* ... */ })  
  
// Replace with  
win.webContents.on('render-process-gone', (event, details) => { /* ... */ })  
webview.addEventListener('render-process-gone', (event) => { /* ... */ })  

```

### Deprecated: `gpu-process-crashed` event on `app`

The `gpu-process-crashed` event on `app` has been deprecated. Use the new `child-process-gone` event instead.

```javascript
// Deprecated  
app.on('gpu-process-crashed', (event, killed) => { /* ... */ })  
  
// Replace with  
app.on('child-process-gone', (event, details) => { /* ... */ })  

```

## Alterações planejadas na API (27.0)

### Removed: macOS 10.13 / 10.14 support

macOS 10.13 (High Sierra) and macOS 10.14 (Mojave) are no longer supported by [Chromium](https://chromium-review.googlesource.com/c/chromium/src/+/4629466).

Older versions of Electron will continue to run on these operating systems, but macOS 10.15 (Catalina) or later will be required to run Electron v27.0.0 and higher.

### Descontinuado: `ipcRenderer.sendTo()`

The `ipcRenderer.sendTo()` API has been deprecated. It should be replaced by setting up a [`MessageChannel`](/pt/docs/latest/tutorial/message-ports#setting-up-a-messagechannel-between-two-renderers) between the renderers.

The `senderId` and `senderIsMainFrame` properties of `IpcRendererEvent` have been deprecated as well.

### Removed: color scheme events in `systemPreferences`

The following `systemPreferences` events have been removed:

- `inverted-color-scheme-changed`

- `high-contrast-color-scheme-changed`

Use the new `updated` event on the `nativeTheme` module instead.

```javascript
// Removed  
systemPreferences.on('inverted-color-scheme-changed', () => { /* ... */ })  
systemPreferences.on('high-contrast-color-scheme-changed', () => { /* ... */ })  
  
// Replace with  
nativeTheme.on('updated', () => { /* ... */ })  

```

### Removed: Some `window.setVibrancy` options on macOS

The following vibrancy options have been removed:

- 'claro'

- 'medium-light'

- 'escuro'

- 'ultra-dark'

- 'appearance-based'

These were previously deprecated and have been removed by Apple in 10.15.

### Removido: `webContents.getPrinters`

O método `webContents.getPrinters` foi removido. Use `webContents.getPrintersAsync` instead.

```javascript
const w = new BrowserWindow({ show: false })  
  
// Removed  
console.log(w.webContents.getPrinters())  
// Replace with  
w.webContents.getPrintersAsync().then((printers) => {  
  console.log(printers)  
})  

```

### Removed: `systemPreferences.{get,set}AppLevelAppearance` and `systemPreferences.appLevelAppearance`

The `systemPreferences.getAppLevelAppearance` and `systemPreferences.setAppLevelAppearance` methods have been removed, as well as the `systemPreferences.appLevelAppearance` property. Use the `nativeTheme` module instead.

```javascript
// Removed  
systemPreferences.getAppLevelAppearance()  
// Replace with  
nativeTheme.shouldUseDarkColors  
  
// Removed  
systemPreferences.appLevelAppearance  
// Replace with  
nativeTheme.shouldUseDarkColors  
  
// Removed  
systemPreferences.setAppLevelAppearance('dark')  
// Replace with  
nativeTheme.themeSource = 'dark'  

```

### Removed: `alternate-selected-control-text` value for `systemPreferences.getColor`

The `alternate-selected-control-text` value for `systemPreferences.getColor` has been removed. Use `selected-content-background` instead.

```javascript
// Removed  
systemPreferences.getColor('alternate-selected-control-text')  
// Replace with  
systemPreferences.getColor('selected-content-background')  

```

## Alterações planejadas na API (26.0)

### Descontinuado: `webContents.getPrinters`

The `webContents.getPrinters` method has been deprecated. Use `webContents.getPrintersAsync` instead.

```javascript
const w = new BrowserWindow({ show: false })  
  
// Deprecated  
console.log(w.webContents.getPrinters())  
// Replace with  
w.webContents.getPrintersAsync().then((printers) => {  
  console.log(printers)  
})  

```

### Deprecated: `systemPreferences.{get,set}AppLevelAppearance` and `systemPreferences.appLevelAppearance`

The `systemPreferences.getAppLevelAppearance` and `systemPreferences.setAppLevelAppearance` methods have been deprecated, as well as the `systemPreferences.appLevelAppearance` property. Use the `nativeTheme` module instead.

```javascript
// Deprecated  
systemPreferences.getAppLevelAppearance()  
// Replace with  
nativeTheme.shouldUseDarkColors  
  
// Deprecated  
systemPreferences.appLevelAppearance  
// Replace with  
nativeTheme.shouldUseDarkColors  
  
// Deprecated  
systemPreferences.setAppLevelAppearance('dark')  
// Replace with  
nativeTheme.themeSource = 'dark'  

```

### Deprecated: `alternate-selected-control-text` value for `systemPreferences.getColor`

The `alternate-selected-control-text` value for `systemPreferences.getColor` has been deprecated. Use `selected-content-background` instead.

```javascript
// Deprecated  
systemPreferences.getColor('alternate-selected-control-text')  
// Replace with  
systemPreferences.getColor('selected-content-background')  

```

## Alterações planejadas na API (25.0)

### Deprecated: `protocol.{un,}{register,intercept}{Buffer,String,Stream,File,Http}Protocol` and `protocol.isProtocol{Registered,Intercepted}`

The `protocol.register*Protocol` and `protocol.intercept*Protocol` methods have been replaced with [`protocol.handle`](/pt/docs/latest/api/protocol#protocolhandlescheme-handler).

The new method can either register a new protocol or intercept an existing protocol, and responses can be of any type.

```javascript
// Deprecated in Electron 25  
protocol.registerBufferProtocol('some-protocol', () => {  
  callback({ mimeType: 'text/html', data: Buffer.from('<h5>Response</h5>') })  
})  
  
// Replace with  
protocol.handle('some-protocol', () => {  
  return new Response(  
    Buffer.from('<h5>Response</h5>'), // Could also be a string or ReadableStream.  
    { headers: { 'content-type': 'text/html' } }  
  )  
})  

```

```javascript
// Deprecated in Electron 25  
protocol.registerHttpProtocol('some-protocol', () => {  
  callback({ url: 'https://electronjs.org' })  
})  
  
// Replace with  
protocol.handle('some-protocol', () => {  
  return net.fetch('https://electronjs.org')  
})  

```

```javascript
// Deprecated in Electron 25  
protocol.registerFileProtocol('some-protocol', () => {  
  callback({ filePath: '/path/to/my/file' })  
})  
  
// Replace with  
protocol.handle('some-protocol', () => {  
  return net.fetch('file:///path/to/my/file')  
})  

```

### Descontinuado: `BrowserWindow.setTrafficLightPosition(position)`

`BrowserWindow.setTrafficLightPosition(position)` has been deprecated, the `BrowserWindow.setWindowButtonPosition(position)` API should be used instead which accepts `null` instead of `{ x: 0, y: 0 }` to reset the position to system default.

```javascript
// Deprecated in Electron 25  
win.setTrafficLightPosition({ x: 10, y: 10 })  
win.setTrafficLightPosition({ x: 0, y: 0 })  
  
// Replace with  
win.setWindowButtonPosition({ x: 10, y: 10 })  
win.setWindowButtonPosition(null)  

```

### Descontinuado: `BrowserWindow.getTrafficLightPosition()`

`BrowserWindow.getTrafficLightPosition()` has been deprecated, the `BrowserWindow.getWindowButtonPosition()` API should be used instead which returns `null` instead of `{ x: 0, y: 0 }` when there is no custom position.

```javascript
// Deprecated in Electron 25  
const pos = win.getTrafficLightPosition()  
if (pos.x === 0 && pos.y === 0) {  
  // No custom position.  
}  
  
// Replace with  
const ret = win.getWindowButtonPosition()  
if (ret === null) {  
  // No custom position.  
}  

```

## Alterações planejadas na API (24.0)

### API Alterada: `nativeImage.createThumbnailFromPath(path, size)`

The `maxSize` parameter has been changed to `size` to reflect that the size passed in will be the size the thumbnail created. Previously, Windows would not scale the image up if it were smaller than `maxSize`, and macOS would always set the size to `maxSize`. Behavior is now the same across platforms.

Updated Behavior:

```javascript
// a 128x128 image.  
const imagePath = path.join('path', 'to', 'capybara.png')  
  
// Scaling up a smaller image.  
const upSize = { width: 256, height: 256 }  
nativeImage.createThumbnailFromPath(imagePath, upSize).then(result => {  
  console.log(result.getSize()) // { width: 256, height: 256 }  
})  
  
// Scaling down a larger image.  
const downSize = { width: 64, height: 64 }  
nativeImage.createThumbnailFromPath(imagePath, downSize).then(result => {  
  console.log(result.getSize()) // { width: 64, height: 64 }  
})  

```

Previous Behavior (on Windows):

```javascript
// a 128x128 image  
const imagePath = path.join('path', 'to', 'capybara.png')  
const size = { width: 256, height: 256 }  
nativeImage.createThumbnailFromPath(imagePath, size).then(result => {  
  console.log(result.getSize()) // { width: 128, height: 128 }  
})  

```

## Alterações planejadas na API (23.0)

### Behavior Changed: Draggable Regions on macOS

The implementation of draggable regions (using the CSS property `-webkit-app-region: drag`) has changed on macOS to bring it in line with Windows and Linux. Previously, when a region with `-webkit-app-region: no-drag` overlapped a region with `-webkit-app-region: drag`, the `no-drag` region would always take precedence on macOS, regardless of CSS layering. That is, if a `drag` region was above a `no-drag` region, it would be ignored. Beginning in Electron 23, a `drag` region on top of a `no-drag` region will correctly cause the region to be draggable.

Additionally, the `customButtonsOnHover` BrowserWindow property previously created a draggable region which ignored the `-webkit-app-region` CSS property. This has now been fixed (see [#37210](https://github.com/electron/electron/issues/37210#issuecomment-1440509592) for discussion).

As a result, if your app uses a frameless window with draggable regions on macOS, the regions which are draggable in your app may change in Electron 23.

### Removed: Windows 7 / 8 / 8.1 support

[Windows 7, Windows 8, and Windows 8.1 are no longer supported](https://www.electronjs.org/blog/windows-7-to-8-1-deprecation-notice). Electron follows the planned Chromium deprecation policy, which will [deprecate Windows 7 support beginning in Chromium 109](https://support.google.com/chrome/thread/185534985/sunsetting-support-for-windows-7-8-8-1-in-early-2023?hl=en).

Older versions of Electron will continue to run on these operating systems, but Windows 10 or later will be required to run Electron v23.0.0 and higher.

### Removed: BrowserWindow `scroll-touch-*` events

The deprecated `scroll-touch-begin`, `scroll-touch-end` and `scroll-touch-edge` events on BrowserWindow have been removed. Instead, use the newly available [`input-event` event](/pt/docs/latest/api/web-contents#event-input-event) on WebContents.

```javascript
// Removed in Electron 23.0  
win.on('scroll-touch-begin', scrollTouchBegin)  
win.on('scroll-touch-edge', scrollTouchEdge)  
win.on('scroll-touch-end', scrollTouchEnd)  
  
// Replace with  
win.webContents.on('input-event', (_, event) => {  
  if (event.type === 'gestureScrollBegin') {  
    scrollTouchBegin()  
  } else if (event.type === 'gestureScrollUpdate') {  
    scrollTouchEdge()  
  } else if (event.type === 'gestureScrollEnd') {  
    scrollTouchEnd()  
  }  
})  

```

### Removido: `webContents.incrementCapturerCount(stayHidden, stayAwake)`

The `webContents.incrementCapturerCount(stayHidden, stayAwake)` function has been removed. It is now automatically handled by `webContents.capturePage` when a page capture completes.

```javascript
const w = new BrowserWindow({ show: false })  
  
// Removed in Electron 23  
w.webContents.incrementCapturerCount()  
w.capturePage().then(image => {  
  console.log(image.toDataURL())  
  w.webContents.decrementCapturerCount()  
})  
  
// Replace with  
w.capturePage().then(image => {  
  console.log(image.toDataURL())  
})  

```

### Removido: `webContents.decrementCapturerCount(stayHidden, stayAwake)`

The `webContents.decrementCapturerCount(stayHidden, stayAwake)` function has been removed. It is now automatically handled by `webContents.capturePage` when a page capture completes.

```javascript
const w = new BrowserWindow({ show: false })  
  
// Removed in Electron 23  
w.webContents.incrementCapturerCount()  
w.capturePage().then(image => {  
  console.log(image.toDataURL())  
  w.webContents.decrementCapturerCount()  
})  
  
// Replace with  
w.capturePage().then(image => {  
  console.log(image.toDataURL())  
})  

```

## Alterações planejadas na API (22.0)

### Descontinuado: `webContents.incrementCapturerCount(stayHidden, stayAwake)`

`webContents.incrementCapturerCount(stayHidden, stayAwake)` has been deprecated. It is now automatically handled by `webContents.capturePage` when a page capture completes.

```javascript
const w = new BrowserWindow({ show: false })  
  
// Removed in Electron 23  
w.webContents.incrementCapturerCount()  
w.capturePage().then(image => {  
  console.log(image.toDataURL())  
  w.webContents.decrementCapturerCount()  
})  
  
// Replace with  
w.capturePage().then(image => {  
  console.log(image.toDataURL())  
})  

```

### Descontinuado: `webContents.decrementCapturerCount(stayHidden, stayAwake)`

`webContents.decrementCapturerCount(stayHidden, stayAwake)` has been deprecated. It is now automatically handled by `webContents.capturePage` when a page capture completes.

```javascript
const w = new BrowserWindow({ show: false })  
  
// Removed in Electron 23  
w.webContents.incrementCapturerCount()  
w.capturePage().then(image => {  
  console.log(image.toDataURL())  
  w.webContents.decrementCapturerCount()  
})  
  
// Replace with  
w.capturePage().then(image => {  
  console.log(image.toDataURL())  
})  

```

### Removed: WebContents `new-window` event

The `new-window` event of WebContents has been removed. It is replaced by [`webContents.setWindowOpenHandler()`](/pt/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler).

```javascript
// Removed in Electron 22  
webContents.on('new-window', (event) => {  
  event.preventDefault()  
})  
  
// Replace with  
webContents.setWindowOpenHandler((details) => {  
  return { action: 'deny' }  
})  

```

### Removed: `<webview>` `new-window` event

The `new-window` event of `<webview>` has been removed. There is no direct replacement.

```javascript
// Removed in Electron 22  
webview.addEventListener('new-window', (event) => {})  

```

```javascript
// Replace with  
  
// main.js  
mainWindow.webContents.on('did-attach-webview', (event, wc) => {  
  wc.setWindowOpenHandler((details) => {  
    mainWindow.webContents.send('webview-new-window', wc.id, details)  
    return { action: 'deny' }  
  })  
})  
  
// preload.js  
const { ipcRenderer } = require('electron')  
ipcRenderer.on('webview-new-window', (e, webContentsId, details) => {  
  console.log('webview-new-window', webContentsId, details)  
  document.getElementById('webview').dispatchEvent(new Event('new-window'))  
})  
  
// renderer.js  
document.getElementById('webview').addEventListener('new-window', () => {  
  console.log('got new-window event')  
})  

```

### Deprecated: BrowserWindow `scroll-touch-*` events

The `scroll-touch-begin`, `scroll-touch-end` and `scroll-touch-edge` events on BrowserWindow are deprecated. Instead, use the newly available [`input-event` event](/pt/docs/latest/api/web-contents#event-input-event) on WebContents.

```javascript
// Deprecated  
win.on('scroll-touch-begin', scrollTouchBegin)  
win.on('scroll-touch-edge', scrollTouchEdge)  
win.on('scroll-touch-end', scrollTouchEnd)  
  
// Replace with  
win.webContents.on('input-event', (_, event) => {  
  if (event.type === 'gestureScrollBegin') {  
    scrollTouchBegin()  
  } else if (event.type === 'gestureScrollUpdate') {  
    scrollTouchEdge()  
  } else if (event.type === 'gestureScrollEnd') {  
    scrollTouchEnd()  
  }  
})  

```

## Alterações planejadas na API (21.0)

### Behavior Changed: V8 Memory Cage enabled

The V8 memory cage has been enabled, which has implications for native modules which wrap non-V8 memory with `ArrayBuffer` or `Buffer`. See the [blog post about the V8 memory cage](https://www.electronjs.org/blog/v8-memory-cage) for more details.

### API Changed: `webContents.printToPDF()`

`webContents.printToPDF()` has been modified to conform to [`Page.printToPDF`](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-printToPDF) in the Chrome DevTools Protocol. This has been changed in order to address changes upstream that made our previous implementation untenable and rife with bugs.

**Arguments Changed**

- `pageRanges`

**Arguments Removed**

- `printSelectionOnly`

- `marginsType`

- `headerFooter`

- `scaleFactor`

**Arguments Added**

- `headerTemplate`

- `footerTemplate`

- `displayHeaderFooter`

- `margins`

- `scale`

- `preferCSSPageSize`

```javascript
// Main process  
const { webContents } = require('electron')  
  
webContents.printToPDF({  
  landscape: true,  
  displayHeaderFooter: true,  
  printBackground: true,  
  scale: 2,  
  pageSize: 'Ledger',  
  margins: {  
    top: 2,  
    bottom: 2,  
    left: 2,  
    right: 2  
  },  
  pageRanges: '1-5, 8, 11-13',  
  headerTemplate: '<h1>Title</h1>',  
  footerTemplate: '<div><span class="pageNumber"></span></div>',  
  preferCSSPageSize: true  
}).then(data => {  
  fs.writeFile(pdfPath, data, (error) => {  
    if (error) throw error  
    console.log(`Wrote PDF successfully to ${pdfPath}`)  
  })  
}).catch(error => {  
  console.log(`Failed to write PDF to ${pdfPath}: `, error)  
})  

```

## Alterações planejadas na API (20.0)

### Removed: macOS 10.11 / 10.12 support

macOS 10.11 (El Capitan) and macOS 10.12 (Sierra) are no longer supported by [Chromium](https://chromium-review.googlesource.com/c/chromium/src/+/3646050).

Older versions of Electron will continue to run on these operating systems, but macOS 10.13 (High Sierra) or later will be required to run Electron v20.0.0 and higher.

### Default Changed: renderers without `nodeIntegration: true` are sandboxed by default

Previously, renderers that specified a preload script defaulted to being unsandboxed. This meant that by default, preload scripts had access to Node.js. In Electron 20, this default has changed. Beginning in Electron 20, renderers will be sandboxed by default, unless `nodeIntegration: true` or `sandbox: false` is specified.

If your preload scripts do not depend on Node, no action is needed. If your preload scripts *do* depend on Node, either refactor them to remove Node usage from the renderer, or explicitly specify `sandbox: false` for the relevant renderers.

### Removed: `skipTaskbar` on Linux

On X11, `skipTaskbar` sends a `_NET_WM_STATE_SKIP_TASKBAR` message to the X11 window manager. There is not a direct equivalent for Wayland, and the known workarounds have unacceptable tradeoffs (e.g. Window.is_skip_taskbar in GNOME requires unsafe mode), so Electron is unable to support this feature on Linux.

### API Alterada: `session.setDevicePermissionHandler(handler)`

The handler invoked when `session.setDevicePermissionHandler(handler)` is used has a change to its arguments.  This handler no longer is passed a frame [`WebFrameMain`](/pt/docs/latest/api/web-frame-main), but instead is passed the `origin`, which is the origin that is checking for device permission.

## Alterações planejadas na API (19.0)

### Removido: IA32 Binários Linux

Este é o resultado do Chromium 102.0.4999.0 Desativando o suporte para o Linux IA32. Isso conclui a remoção [do suporte para o IA32 Linux](#removed-ia32-linux-support).

## Alterações planejadas na API (18.0)

### Removido: `nativeWindowOpen`

Prior to Electron 15, `window.open` was by default shimmed to use `BrowserWindowProxy`. This meant that `window.open('about:blank')` did not work to open synchronously scriptable child windows, among other incompatibilities. Since Electron 15, `nativeWindowOpen` has been enabled by default.

See the documentation for [window.open in Electron](/pt/docs/latest/api/window-open) for more details.

## Alterações planejadas na API (17.0)

### Removido: `desktopCapturer.getSources` do renderizador

The `desktopCapturer.getSources` API is now only available in the main process. This has been changed in order to improve the default security of Electron apps.

If you need this functionality, it can be replaced as follows:

```javascript
// Main process  
const { ipcMain, desktopCapturer } = require('electron')  
  
ipcMain.handle(  
  'DESKTOP_CAPTURER_GET_SOURCES',  
  (event, opts) => desktopCapturer.getSources(opts)  
)  

```

```javascript
// Renderer process  
const { ipcRenderer } = require('electron')  
  
const desktopCapturer = {  
  getSources: (opts) => ipcRenderer.invoke('DESKTOP_CAPTURER_GET_SOURCES', opts)  
}  

```

However, you should consider further restricting the information returned to the renderer; for instance, displaying a source selector to the user and only returning the selected source.

### Descontinuado: `nativeWindowOpen`

Prior to Electron 15, `window.open` was by default shimmed to use `BrowserWindowProxy`. This meant that `window.open('about:blank')` did not work to open synchronously scriptable child windows, among other incompatibilities. Since Electron 15, `nativeWindowOpen` has been enabled by default.

See the documentation for [window.open in Electron](/pt/docs/latest/api/window-open) for more details.

## Alterações planejadas na API (16.0)

### Behavior Changed: `crashReporter` implementation switched to Crashpad on Linux

The underlying implementation of the `crashReporter` API on Linux has changed from Breakpad to Crashpad, bringing it in line with Windows and Mac. As a result of this, child processes are now automatically monitored, and calling `process.crashReporter.start` in Node child processes is no longer needed (and is not advisable, as it will start a second instance of the Crashpad reporter).

There are also some subtle changes to how annotations will be reported on Linux, including that long values will no longer be split between annotations appended with `__1`, `__2` and so on, and instead will be truncated at the (new, longer) annotation value limit.

### Descontinuado: `desktopCapturer.getSources` do renderizador

Usage of the `desktopCapturer.getSources` API in the renderer has been deprecated and will be removed. This change improves the default security of Electron apps.

See [here](#removed-desktopcapturergetsources-in-the-renderer) for details on how to replace this API in your app.

## Alterações planejadas na API (15.0)

### Padrão alterado: `nativeWindowOpen` padrão para `true`

Prior to Electron 15, `window.open` was by default shimmed to use `BrowserWindowProxy`. This meant that `window.open('about:blank')` did not work to open synchronously scriptable child windows, among other incompatibilities. `nativeWindowOpen` is no longer experimental, and is now the default.

See the documentation for [window.open in Electron](/pt/docs/latest/api/window-open) for more details.

### Descontinuado: `app.runningUnderRosettaTranslation`

The `app.runningUnderRosettaTranslation` property has been deprecated. Use `app.runningUnderARM64Translation` instead.

```javascript
// Deprecated  
console.log(app.runningUnderRosettaTranslation)  
// Replace with  
console.log(app.runningUnderARM64Translation)  

```

## Alterações planejadas na API (14.0)

### Removed: `remote` module

The `remote` module was deprecated in Electron 12, and will be removed in Electron 14. It is replaced by the [`@electron/remote`](https://github.com/electron/remote) module.

```javascript
// Deprecated in Electron 12:  
const { BrowserWindow } = require('electron').remote  

```

```javascript
// Replace with:  
const { BrowserWindow } = require('@electron/remote')  
  
// In the main process:  
require('@electron/remote/main').initialize()  

```

### Removido: `app.allowRendererProcessReuse`

The `app.allowRendererProcessReuse` property will be removed as part of our plan to more closely align with Chromium's process model for security, performance and maintainability.

For more detailed information see [#18397](https://github.com/electron/electron/issues/18397).

### Removed: Browser Window Affinity

The `affinity` option when constructing a new `BrowserWindow` will be removed as part of our plan to more closely align with Chromium's process model for security, performance and maintainability.

For more detailed information see [#18397](https://github.com/electron/electron/issues/18397).

### API Alterada: `window.open()`

The optional parameter `frameName` will no longer set the title of the window. This now follows the specification described by the [native documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#parameters) under the corresponding parameter `windowName`.

If you were using this parameter to set the title of a window, you can instead use [win.setTitle(title)](/pt/docs/latest/api/browser-window#winsettitletitle).

### Removido: `worldSafeExecuteJavaScript`

No Electron 14, `worldSafeExecuteJavaScript` será removido.  There is no alternative, please ensure your code works with this property enabled.  It has been enabled by default since Electron
12.

You will be affected by this change if you use either `webFrame.executeJavaScript` or `webFrame.executeJavaScriptInIsolatedWorld`. You will need to ensure that values returned by either of those methods are supported by the [Context Bridge API](/pt/docs/latest/api/context-bridge#parameter--error--return-type-support) as these methods use the same value passing semantics.

### Removed: BrowserWindowConstructorOptions inheriting from parent windows

Prior to Electron 14, windows opened with `window.open` would inherit BrowserWindow constructor options such as `transparent` and `resizable` from their parent window. Beginning with Electron 14, this behavior is removed, and windows will not inherit any BrowserWindow constructor options from their parents.

Instead, explicitly set options for the new window with `setWindowOpenHandler`:

```javascript
webContents.setWindowOpenHandler((details) => {  
  return {  
    action: 'allow',  
    overrideBrowserWindowOptions: {  
      // ...  
    }  
  }  
})  

```

### Removido: `additionalFeatures`

The deprecated `additionalFeatures` property in the `new-window` and `did-create-window` events of WebContents has been removed. Since `new-window` uses positional arguments, the argument is still present, but will always be the empty array `[]`. (Though note, the `new-window` event itself is deprecated, and is replaced by `setWindowOpenHandler`.) Bare keys in window features will now present as keys with the value `true` in the options object.

```javascript
// Removed in Electron 14  
// Triggered by window.open('...', '', 'my-key')  
webContents.on('did-create-window', (window, details) => {  
  if (details.additionalFeatures.includes('my-key')) {  
    // ...  
  }  
})  
  
// Replace with  
webContents.on('did-create-window', (window, details) => {  
  if (details.options['my-key']) {  
    // ...  
  }  
})  

```

## Alterações planejadas na API (13.0)

### API Alterada: `session.setPermissionCheckHandler(handler)`

The `handler` methods first parameter was previously always a `webContents`, it can now sometimes be `null`.  You should use the `requestingOrigin`, `embeddingOrigin` and `securityOrigin` properties to respond to the permission check correctly.  As the `webContents` can be `null` it can no longer be relied on.

```javascript
// Old code  
session.setPermissionCheckHandler((webContents, permission) => {  
  if (webContents.getURL().startsWith('https://google.com/') && permission === 'notification') {  
    return true  
  }  
  return false  
})  
  
// Replace with  
session.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {  
  if (new URL(requestingOrigin).hostname === 'google.com' && permission === 'notification') {  
    return true  
  }  
  return false  
})  

```

### Removed: `shell.moveItemToTrash()`

The deprecated synchronous `shell.moveItemToTrash()` API has been removed. Use the asynchronous `shell.trashItem()` instead.

```javascript
// Removed in Electron 13  
shell.moveItemToTrash(path)  
// Replace with  
shell.trashItem(path).then(/* ... */)  

```

### Removido: `BrowserWindow` extensão da API

The deprecated extension APIs have been removed:

- `BrowserWindow.addExtension(path)`

- `BrowserWindow.addDevToolsExtension(path)`

- `BrowserWindow.removeExtension(name)`

- `BrowserWindow.removeDevToolsExtension(name)`

- `BrowserWindow.getExtensions()`

- `BrowserWindow.getDevToolsExtensions()`

Use the session APIs instead:

- `ses.loadExtension(path)`

- `ses.removeExtension(extension_id)`

- `ses.getAllExtensions()`

```javascript
// Removed in Electron 13  
BrowserWindow.addExtension(path)  
BrowserWindow.addDevToolsExtension(path)  
// Replace with  
session.defaultSession.loadExtension(path)  

```

```javascript
// Removed in Electron 13  
BrowserWindow.removeExtension(name)  
BrowserWindow.removeDevToolsExtension(name)  
// Replace with  
session.defaultSession.removeExtension(extension_id)  

```

```javascript
// Removed in Electron 13  
BrowserWindow.getExtensions()  
BrowserWindow.getDevToolsExtensions()  
// Replace with  
session.defaultSession.getAllExtensions()  

```

### Removido: métodos em `systemPreferences`

The following `systemPreferences` methods have been deprecated:

- `systemPreferences.isDarkMode()`

- `systemPreferences.isInvertedColorScheme()`

- `systemPreferences.isHighContrastColorScheme()`

Use the following `nativeTheme` properties instead:

- `nativeTheme.shouldUseDarkColors`

- `nativeTheme.shouldUseInvertedColorScheme`

- `nativeTheme.shouldUseHighContrastColors`

```javascript
// Removed in Electron 13  
systemPreferences.isDarkMode()  
// Replace with  
nativeTheme.shouldUseDarkColors  
  
// Removed in Electron 13  
systemPreferences.isInvertedColorScheme()  
// Replace with  
nativeTheme.shouldUseInvertedColorScheme  
  
// Removed in Electron 13  
systemPreferences.isHighContrastColorScheme()  
// Replace with  
nativeTheme.shouldUseHighContrastColors  

```

### Descontinuado: Evento WebContents `new-window`

The `new-window` event of WebContents has been deprecated. It is replaced by [`webContents.setWindowOpenHandler()`](/pt/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler).

```javascript
// Deprecated in Electron 13  
webContents.on('new-window', (event) => {  
  event.preventDefault()  
})  
  
// Replace with  
webContents.setWindowOpenHandler((details) => {  
  return { action: 'deny' }  
})  

```

## Alterações planejadas na API (12.0)

### Removido: suporte ao Pepper Flash

Chromium has removed support for Flash, and so we must follow suit. See Chromium's [Flash Roadmap](https://www.chromium.org/flash-roadmap) for more details.

### Padrão alterado: `worldSafeExecuteJavaScript` padrão para `true`

In Electron 12, `worldSafeExecuteJavaScript` will be enabled by default.  To restore the previous behavior, `worldSafeExecuteJavaScript: false` must be specified in WebPreferences. Please note that setting this option to `false` is **insecure**.

This option will be removed in Electron 14 so please migrate your code to support the default value.

### Padrão alterado: `contextIsolation` padrão para `true`

In Electron 12, `contextIsolation` will be enabled by default.  To restore the previous behavior, `contextIsolation: false` must be specified in WebPreferences.

We [recommend having contextIsolation enabled](/pt/docs/latest/tutorial/security#3-enable-context-isolation) for the security of your application.

Another implication is that `require()` cannot be used in the renderer process unless `nodeIntegration` is `true` and `contextIsolation` is `false`.

For more details see: [https://github.com/electron/electron/issues/23506](https://github.com/electron/electron/issues/23506)

### Removido: `crashReporter.getCrashesDirectory()`

O método `crashReporter.getCrashesDirectory` foi removido. Usage should be replaced by `app.getPath('crashDumps')`.

```javascript
// Removido no Electron 12  
crashReporter.getCrashesDirectory()  
// Substitua por  
app.getPath('crashDumps')  

```

### Removido: `crashReporter` métodos do processo de renderização

The following `crashReporter` methods are no longer available in the renderer process:

- `crashReporter.start`

- `crashReporter.getLastCrashReport`

- `crashReporter.getUploadedReports`

- `crashReporter.getUploadToServer`

- `crashReporter.setUploadToServer`

- `crashReporter.getCrashesDirectory`

They should be called only from the main process.

See [#23265](https://github.com/electron/electron/pull/23265) for more details.

### Padrão alterado: `crashReporter.start({ compress: true })`

The default value of the `compress` option to `crashReporter.start` has changed from `false` to `true`. This means that crash dumps will be uploaded to the crash ingestion server with the `Content-Encoding: gzip` header, and the body will be compressed.

If your crash ingestion server does not support compressed payloads, you can turn off compression by specifying `{ compress: false }` in the crash reporter options.

### Descontinuado: módulo `remote`

The `remote` module is deprecated in Electron 12, and will be removed in Electron 14. It is replaced by the [`@electron/remote`](https://github.com/electron/remote) module.

```javascript
// Deprecated in Electron 12:  
const { BrowserWindow } = require('electron').remote  

```

```javascript
// Replace with:  
const { BrowserWindow } = require('@electron/remote')  
  
// In the main process:  
require('@electron/remote/main').initialize()  

```

### Descontinuado: `shell.moveItemToTrash()`

The synchronous `shell.moveItemToTrash()` has been replaced by the new, asynchronous `shell.trashItem()`.

```javascript
// Descontinuado no Electron 12  
shell.moveItemToTrash(path)  
// Substitua por  
shell.trashItem(path).then(/* ... */)  

```

## Alterações planejadas na API (11.0)

### Removido: `BrowserView.{destroy, fromId, fromWebContents, getAllViews}` e `id` propriedade de `BrowserView`

The experimental APIs `BrowserView.{destroy, fromId, fromWebContents, getAllViews}` have now been removed. Additionally, the `id` property of `BrowserView` has also been removed.

For more detailed information, see [#23578](https://github.com/electron/electron/pull/23578).

## Alterações planejadas na API (10.0)

### Descontinuado: `companyName` argumento para `crashReporter.start()`

The `companyName` argument to `crashReporter.start()`, which was previously required, is now optional, and further, is deprecated. To get the same behavior in a non-deprecated way, you can pass a `companyName` value in `globalExtra`.

```javascript
// Deprecated in Electron 10  
crashReporter.start({ companyName: 'Umbrella Corporation' })  
// Replace with  
crashReporter.start({ globalExtra: { _companyName: 'Umbrella Corporation' } })  

```

### Descontinuado: `crashReporter.getCrashesDirectory()`

The `crashReporter.getCrashesDirectory` method has been deprecated. Usage should be replaced by `app.getPath('crashDumps')`.

```javascript
// Deprecated in Electron 10  
crashReporter.getCrashesDirectory()  
// Replace with  
app.getPath('crashDumps')  

```

### Descontinuado: `crashReporter` métodos do processo de renderização

Calling the following `crashReporter` methods from the renderer process is deprecated:

- `crashReporter.start`

- `crashReporter.getLastCrashReport`

- `crashReporter.getUploadedReports`

- `crashReporter.getUploadToServer`

- `crashReporter.setUploadToServer`

- `crashReporter.getCrashesDirectory`

The only non-deprecated methods remaining in the `crashReporter` module in the renderer are `addExtraParameter`, `removeExtraParameter` and `getParameters`.

All above methods remain non-deprecated when called from the main process.

See [#23265](https://github.com/electron/electron/pull/23265) for more details.

### Descontinuado: `crashReporter.start({ compress: false })`

Setting `{ compress: false }` in `crashReporter.start` is deprecated. Nearly all crash ingestion servers support gzip compression. This option will be removed in a future version of Electron.

### Padrão alterado: `enableRemoteModule` padrão para `false`

In Electron 9, using the remote module without explicitly enabling it via the `enableRemoteModule` WebPreferences option began emitting a warning. In Electron 10, the remote module is now disabled by default. To use the remote module, `enableRemoteModule: true` must be specified in WebPreferences:

```javascript
const w = new BrowserWindow({  
  webPreferences: {  
    enableRemoteModule: true  
  }  
})  

```

We [recommend moving away from the remote module](https://medium.com/@nornagon/electrons-remote-module-considered-harmful-70d69500f31).

### `protocol.unregisterProtocol`

### `protocol.uninterceptProtocol`

The APIs are now synchronous and the optional callback is no longer needed.

```javascript
// Deprecated  
protocol.unregisterProtocol(scheme, () => { /* ... */ })  
// Replace with  
protocol.unregisterProtocol(scheme)  

```

### `protocol.registerFileProtocol`

### `protocol.registerBufferProtocol`

### `protocol.registerStringProtocol`

### `protocol.registerHttpProtocol`

### `protocol.registerStreamProtocol`

### `protocol.interceptFileProtocol`

### `protocol.interceptStringProtocol`

### `protocol.interceptBufferProtocol`

### `protocol.interceptHttpProtocol`

### `protocol.interceptStreamProtocol`

The APIs are now synchronous and the optional callback is no longer needed.

```javascript
// Deprecated  
protocol.registerFileProtocol(scheme, handler, () => { /* ... */ })  
// Replace with  
protocol.registerFileProtocol(scheme, handler)  

```

The registered or intercepted protocol does not have effect on current page until navigation happens.

### `protocol.isProtocolHandled`

This API is deprecated and users should use `protocol.isProtocolRegistered` and `protocol.isProtocolIntercepted` instead.

```javascript
// Deprecated  
protocol.isProtocolHandled(scheme).then(() => { /* ... */ })  
// Replace with  
const isRegistered = protocol.isProtocolRegistered(scheme)  
const isIntercepted = protocol.isProtocolIntercepted(scheme)  

```

## Alterações planejadas na API (9.0)

### Padrão Alterado: Carregar módulos nativos sem reconhecimento de contexto no processo de renderização, desativado por padrão

As of Electron 9 we do not allow loading of non-context-aware native modules in the renderer process.  This is to improve security, performance and maintainability of Electron as a project.

If this impacts you, you can temporarily set `app.allowRendererProcessReuse` to `false` to revert to the old behavior.  This flag will only be an option until Electron 11 so you should plan to update your native modules to be context aware.

For more detailed information see [#18397](https://github.com/electron/electron/issues/18397).

### Descontinuado: `BrowserWindow` extensão da API

The following extension APIs have been deprecated:

- `BrowserWindow.addExtension(path)`

- `BrowserWindow.addDevToolsExtension(path)`

- `BrowserWindow.removeExtension(name)`

- `BrowserWindow.removeDevToolsExtension(name)`

- `BrowserWindow.getExtensions()`

- `BrowserWindow.getDevToolsExtensions()`

Use the session APIs instead:

- `ses.loadExtension(path)`

- `ses.removeExtension(extension_id)`

- `ses.getAllExtensions()`

```javascript
// Deprecated in Electron 9  
BrowserWindow.addExtension(path)  
BrowserWindow.addDevToolsExtension(path)  
// Replace with  
session.defaultSession.loadExtension(path)  

```

```javascript
// Deprecated in Electron 9  
BrowserWindow.removeExtension(name)  
BrowserWindow.removeDevToolsExtension(name)  
// Replace with  
session.defaultSession.removeExtension(extension_id)  

```

```javascript
// Deprecated in Electron 9  
BrowserWindow.getExtensions()  
BrowserWindow.getDevToolsExtensions()  
// Replace with  
session.defaultSession.getAllExtensions()  

```

### Removido: `<webview>.getWebContents()`

This API, which was deprecated in Electron 8.0, is now removed.

```javascript
// Removed in Electron 9.0  
webview.getWebContents()  
// Replace with  
const { remote } = require('electron')  
remote.webContents.fromId(webview.getWebContentsId())  

```

### Removido: `webFrame.setLayoutZoomLevelLimits()`

Chromium has removed support for changing the layout zoom level limits, and it is beyond Electron's capacity to maintain it. The function was deprecated in Electron 8.x, and has been removed in Electron 9.x. The layout zoom level limits are now fixed at a minimum of 0.25 and a maximum of 5.0, as defined [here](https://chromium.googlesource.com/chromium/src/+/938b37a6d2886bf8335fc7db792f1eb46c65b2ae/third_party/blink/common/page/page_zoom.cc#11).

### Comportamento alterado: Enviar objetos não-JS sobre o IPC agora lança uma exceção

In Electron 8.0, IPC was changed to use the Structured Clone Algorithm, bringing significant performance improvements. To help ease the transition, the old IPC serialization algorithm was kept and used for some objects that aren't serializable with Structured Clone. In particular, DOM objects (e.g. `Element`, `Location` and `DOMMatrix`), Node.js objects backed by C++ classes (e.g. `process.env`, some members of `Stream`), and Electron objects backed by C++ classes (e.g. `WebContents`, `BrowserWindow` and `WebFrame`) are not serializable with Structured Clone. Whenever the old algorithm was invoked, a deprecation warning was printed.

In Electron 9.0, the old serialization algorithm has been removed, and sending such non-serializable objects will now throw an "object could not be cloned" error.

### API alterada: `shell.openItem` alterado para `shell.openPath`

The `shell.openItem` API has been replaced with an asynchronous `shell.openPath` API. Você pode ver a proposta original da API e o raciocínio [aqui](https://github.com/electron/governance/blob/main/wg-api/spec-documents/shell-openitem.md).

## Alterações planejadas na API (8.0)

### Comportamento alterado: os valores enviados por IPC agora são serializados com Algoritmo de Clone Estruturado

The algorithm used to serialize objects sent over IPC (through `ipcRenderer.send`, `ipcRenderer.sendSync`, `WebContents.send` and related methods) has been switched from a custom algorithm to V8's built-in [Structured Clone Algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), the same algorithm used to serialize messages for `postMessage`. This brings about a 2x performance improvement for large messages, but also brings some breaking changes in behavior.

- Sending Functions, Promises, WeakMaps, WeakSets, or objects containing any such values, over IPC will now throw an exception, instead of silently converting the functions to `undefined`.

```javascript
// Previously:  
ipcRenderer.send('channel', { value: 3, someFunction: () => {} })  
// => results in { value: 3 } arriving in the main process  
  
// From Electron 8:  
ipcRenderer.send('channel', { value: 3, someFunction: () => {} })  
// => throws Error("() => {} could not be cloned.")  

```

- `NaN`, `Infinity` and `-Infinity` will now be correctly serialized, instead of being converted to `null`.

- Objects containing cyclic references will now be correctly serialized, instead of being converted to `null`.

- `Set`, `Map`, `Error` and `RegExp` values will be correctly serialized, instead of being converted to `{}`.

- `BigInt` values will be correctly serialized, instead of being converted to `null`.

- Sparse arrays will be serialized as such, instead of being converted to dense arrays with `null`s.

- `Date` objects will be transferred as `Date` objects, instead of being converted to their ISO string representation.

- Typed Arrays (such as `Uint8Array`, `Uint16Array`, `Uint32Array` and so on) will be transferred as such, instead of being converted to Node.js `Buffer`.

- Node.js `Buffer` objects will be transferred as `Uint8Array`s. You can convert a `Uint8Array` back to a Node.js `Buffer` by wrapping the underlying `ArrayBuffer`:

```javascript
Buffer.from(value.buffer, value.byteOffset, value.byteLength)  

```

Sending any objects that aren't native JS types, such as DOM objects (e.g. `Element`, `Location`, `DOMMatrix`), Node.js objects (e.g. `process.env`, `Stream`), or Electron objects (e.g. `WebContents`, `BrowserWindow`, `WebFrame`) is deprecated. In Electron 8, these objects will be serialized as before with a DeprecationWarning message, but starting in Electron 9, sending these kinds of objects will throw a 'could not be cloned' error.

### Descontinuado: `<webview>.getWebContents()`

This API is implemented using the `remote` module, which has both performance and security implications. Therefore its usage should be explicit.

```javascript
// Deprecated  
webview.getWebContents()  
// Replace with  
const { remote } = require('electron')  
remote.webContents.fromId(webview.getWebContentsId())  

```

However, it is recommended to avoid using the `remote` module altogether.

```javascript
// main  
const { ipcMain, webContents } = require('electron')  
  
const getGuestForWebContents = (webContentsId, contents) => {  
  const guest = webContents.fromId(webContentsId)  
  if (!guest) {  
    throw new Error(`Invalid webContentsId: ${webContentsId}`)  
  }  
  if (guest.hostWebContents !== contents) {  
    throw new Error('Access denied to webContents')  
  }  
  return guest  
}  
  
ipcMain.handle('openDevTools', (event, webContentsId) => {  
  const guest = getGuestForWebContents(webContentsId, event.sender)  
  guest.openDevTools()  
})  
  
// renderer  
const { ipcRenderer } = require('electron')  
  
ipcRenderer.invoke('openDevTools', webview.getWebContentsId())  

```

### Descontinuado: `webFrame.setLayoutZoomLevelLimits()`

Chromium has removed support for changing the layout zoom level limits, and it is beyond Electron's capacity to maintain it. The function will emit a warning in Electron 8.x, and cease to exist in Electron 9.x. The layout zoom level limits are now fixed at a minimum of 0.25 and a maximum of 5.0, as defined [here](https://chromium.googlesource.com/chromium/src/+/938b37a6d2886bf8335fc7db792f1eb46c65b2ae/third_party/blink/common/page/page_zoom.cc#11).

### Eventos obsoletos em `systemPreferences`

The following `systemPreferences` events have been deprecated:

- `inverted-color-scheme-changed`

- `high-contrast-color-scheme-changed`

Use the new `updated` event on the `nativeTheme` module instead.

```javascript
// Deprecated  
systemPreferences.on('inverted-color-scheme-changed', () => { /* ... */ })  
systemPreferences.on('high-contrast-color-scheme-changed', () => { /* ... */ })  
  
// Replace with  
nativeTheme.on('updated', () => { /* ... */ })  

```

### Obsoleto: métodos em `systemPreferences`

The following `systemPreferences` methods have been deprecated:

- `systemPreferences.isDarkMode()`

- `systemPreferences.isInvertedColorScheme()`

- `systemPreferences.isHighContrastColorScheme()`

Use the following `nativeTheme` properties instead:

- `nativeTheme.shouldUseDarkColors`

- `nativeTheme.shouldUseInvertedColorScheme`

- `nativeTheme.shouldUseHighContrastColors`

```javascript
// Deprecated  
systemPreferences.isDarkMode()  
// Replace with  
nativeTheme.shouldUseDarkColors  
  
// Deprecated  
systemPreferences.isInvertedColorScheme()  
// Replace with  
nativeTheme.shouldUseInvertedColorScheme  
  
// Deprecated  
systemPreferences.isHighContrastColorScheme()  
// Replace with  
nativeTheme.shouldUseHighContrastColors  

```

## Alterações planejadas na API (7.0)

### Descontinuado: URL dos cabeçalhos do Node Atom.io

This is the URL specified as `disturl` in a `.npmrc` file or as the `--dist-url` command line flag when building native Node modules.  Both will be supported for the foreseeable future but it is recommended that you switch.

Deprecated: [https://atom.io/download/electron](https://atom.io/download/electron)

Replace with: [https://electronjs.org/headers](https://electronjs.org/headers)

### API alterada: `session.clearAuthCache()` não aceita mais opções

The `session.clearAuthCache` API no longer accepts options for what to clear, and instead unconditionally clears the whole cache.

```javascript
// Deprecated  
session.clearAuthCache({ type: 'password' })  
// Replace with  
session.clearAuthCache()  

```

### API alterada: `powerMonitor.querySystemIdleState` alterado para `powerMonitor.getSystemIdleState`

```javascript
// Removed in Electron 7.0  
powerMonitor.querySystemIdleState(threshold, callback)  
// Replace with synchronous API  
const idleState = powerMonitor.getSystemIdleState(threshold)  

```

### API alterada: `powerMonitor.querySystemIdleTime` alterado para `powerMonitor.getSystemIdleTime`

```javascript
// Removed in Electron 7.0  
powerMonitor.querySystemIdleTime(callback)  
// Replace with synchronous API  
const idleTime = powerMonitor.getSystemIdleTime()  

```

### API alterada: `webFrame.setIsolatedWorldInfo` substitui métodos separados

```javascript
// Removed in Electron 7.0  
webFrame.setIsolatedWorldContentSecurityPolicy(worldId, csp)  
webFrame.setIsolatedWorldHumanReadableName(worldId, name)  
webFrame.setIsolatedWorldSecurityOrigin(worldId, securityOrigin)  
// Replace with  
webFrame.setIsolatedWorldInfo(  
  worldId,  
  {  
    securityOrigin: 'some_origin',  
    name: 'human_readable_name',  
    csp: 'content_security_policy'  
  })  

```

### Removed: `marked` property on `getBlinkMemoryInfo`

This property was removed in Chromium 77, and as such is no longer available.

### Behavior Changed: `webkitdirectory` attribute for `<input type="file"/>` now lists directory contents

The `webkitdirectory` property on HTML file inputs allows them to select folders. Previous versions of Electron had an incorrect implementation where the `event.target.files` of the input returned a `FileList` that returned one `File` corresponding to the selected folder.

As of Electron 7, that `FileList` is now list of all files contained within the folder, similarly to Chrome, Firefox, and Edge ([link to MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory)).

As an illustration, take a folder with this structure:

```javascript
folder  
├── file1  
├── file2  
└── file3  

```

In Electron <=6, this would return a `FileList` with a `File` object for:

```javascript
path/to/folder  

```

In Electron 7, this now returns a `FileList` with a `File` object for:

```javascript
/path/to/folder/file3  
/path/to/folder/file2  
/path/to/folder/file1  

```

Note that `webkitdirectory` no longer exposes the path to the selected folder. If you require the path to the selected folder rather than the folder contents, see the `dialog.showOpenDialog` API ([link](/pt/docs/latest/api/dialog#dialogshowopendialogwindow-options)).

### API Changed: Callback-based versions of promisified APIs

Electron 5 and Electron 6 introduced Promise-based versions of existing asynchronous APIs and deprecated their older, callback-based counterparts. In Electron 7, all deprecated callback-based APIs are now removed.

These functions now only return Promises:

- `app.getFileIcon()` [#15742](https://github.com/electron/electron/pull/15742)

- `app.dock.show()` [#16904](https://github.com/electron/electron/pull/16904)

- `contentTracing.getCategories()` [#16583](https://github.com/electron/electron/pull/16583)

- `contentTracing.getTraceBufferUsage()` [#16600](https://github.com/electron/electron/pull/16600)

- `contentTracing.startRecording()` [#16584](https://github.com/electron/electron/pull/16584)

- `contentTracing.stopRecording()` [#16584](https://github.com/electron/electron/pull/16584)

- `contents.executeJavaScript()` [#17312](https://github.com/electron/electron/pull/17312)

- `cookies.flushStore()` [#16464](https://github.com/electron/electron/pull/16464)

- `cookies.get()` [#16464](https://github.com/electron/electron/pull/16464)

- `cookies.remove()` [#16464](https://github.com/electron/electron/pull/16464)

- `cookies.set()` [#16464](https://github.com/electron/electron/pull/16464)

- `debugger.sendCommand()` [#16861](https://github.com/electron/electron/pull/16861)

- `dialog.showCertificateTrustDialog()` [#17181](https://github.com/electron/electron/pull/17181)

- `inAppPurchase.getProducts()` [#17355](https://github.com/electron/electron/pull/17355)

- `inAppPurchase.purchaseProduct()`[#17355](https://github.com/electron/electron/pull/17355)

- `netLog.stopLogging()` [#16862](https://github.com/electron/electron/pull/16862)

- `session.clearAuthCache()` [#17259](https://github.com/electron/electron/pull/17259)

- `session.clearCache()`  [#17185](https://github.com/electron/electron/pull/17185)

- `session.clearHostResolverCache()` [#17229](https://github.com/electron/electron/pull/17229)

- `session.clearStorageData()` [#17249](https://github.com/electron/electron/pull/17249)

- `session.getBlobData()` [#17303](https://github.com/electron/electron/pull/17303)

- `session.getCacheSize()`  [#17185](https://github.com/electron/electron/pull/17185)

- `session.resolveProxy()` [#17222](https://github.com/electron/electron/pull/17222)

- `session.setProxy()`  [#17222](https://github.com/electron/electron/pull/17222)

- `shell.openExternal()` [#16176](https://github.com/electron/electron/pull/16176)

- `webContents.loadFile()` [#15855](https://github.com/electron/electron/pull/15855)

- `webContents.loadURL()` [#15855](https://github.com/electron/electron/pull/15855)

- `webContents.hasServiceWorker()` [#16535](https://github.com/electron/electron/pull/16535)

- `webContents.printToPDF()` [#16795](https://github.com/electron/electron/pull/16795)

- `webContents.savePage()` [#16742](https://github.com/electron/electron/pull/16742)

- `webFrame.executeJavaScript()` [#17312](https://github.com/electron/electron/pull/17312)

- `webFrame.executeJavaScriptInIsolatedWorld()` [#17312](https://github.com/electron/electron/pull/17312)

- `webviewTag.executeJavaScript()` [#17312](https://github.com/electron/electron/pull/17312)

- `win.capturePage()` [#15743](https://github.com/electron/electron/pull/15743)

These functions now have two forms, synchronous and Promise-based asynchronous:

- `dialog.showMessageBox()`/`dialog.showMessageBoxSync()` [#17298](https://github.com/electron/electron/pull/17298)

- `dialog.showOpenDialog()`/`dialog.showOpenDialogSync()` [#16973](https://github.com/electron/electron/pull/16973)

- `dialog.showSaveDialog()`/`dialog.showSaveDialogSync()` [#17054](https://github.com/electron/electron/pull/17054)

## Alterações planejadas na API (6.0)

### API alterada: `win.setMenu(null)` alterado para `win.removeMenu()`

```javascript
// Deprecated  
win.setMenu(null)  
// Replace with  
win.removeMenu()  

```

### API Changed: `electron.screen` in the renderer process should be accessed via `remote`

```javascript
// Deprecated  
require('electron').screen  
// Replace with  
require('electron').remote.screen  

```

### API Changed: `require()`ing node builtins in sandboxed renderers no longer implicitly loads the `remote` version

```javascript
// Deprecated  
require('child_process')  
// Replace with  
require('electron').remote.require('child_process')  
  
// Deprecated  
require('fs')  
// Replace with  
require('electron').remote.require('fs')  
  
// Deprecated  
require('os')  
// Replace with  
require('electron').remote.require('os')  
  
// Deprecated  
require('path')  
// Replace with  
require('electron').remote.require('path')  

```

### Deprecated: `powerMonitor.querySystemIdleState` replaced with `powerMonitor.getSystemIdleState`

```javascript
// Deprecated  
powerMonitor.querySystemIdleState(threshold, callback)  
// Replace with synchronous API  
const idleState = powerMonitor.getSystemIdleState(threshold)  

```

### Deprecated: `powerMonitor.querySystemIdleTime` replaced with `powerMonitor.getSystemIdleTime`

```javascript
// Deprecated  
powerMonitor.querySystemIdleTime(callback)  
// Replace with synchronous API  
const idleTime = powerMonitor.getSystemIdleTime()  

```

### Deprecated: `app.enableMixedSandbox()` is no longer needed

```javascript
// Deprecated  
app.enableMixedSandbox()  

```

Mixed-sandbox mode is now enabled by default.

### Descontinuado: `Tray.setHighlightMode`

Under macOS Catalina our former Tray implementation breaks. Apple's native substitute doesn't support changing the highlighting behavior.

```javascript
// Deprecated  
tray.setHighlightMode(mode)  
// API will be removed in v7.0 without replacement.  

```

## Alterações planejadas na API (5.0)

### Default Changed: `nodeIntegration` and `webviewTag` default to false, `contextIsolation` defaults to true

The following `webPreferences` option default values are deprecated in favor of the new defaults listed below.
````````````````````

```javascript
  
  
  
  
  

```

### ````
``````

### 
````````

### ````

```javascript
  
  
  
  
  
  
  
  
  
  
  
  

```

### ``
````

```javascript
  
  
  
  
  
  
  
  
  
  
  
  

```

### ````
````

```javascript
  
  
  
  
  
  
  

```

```javascript
  
  
  
  
  
  
  

```

## 

### ``

```javascript
  
  
  
  
  
  
  
  
  

```

### ``

```javascript
  
  
  
  

```

### ``

```javascript
  
  
  

```

### ``
``````[](/pt/docs/latest/tutorial/using-native-node-modules)

### 
[](https://www.electronjs.org/blog/linux-32bit-support)

## 

### ``

```javascript
  
  
  
  
  
  
  
  

```

### ``

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```

### ``

```javascript
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

```

### ``

```javascript
  
  
  
  
  
  
  
  
  
  
  
  

```

### ``

```javascript
  
  
  
  
  
  

```

### ``

```javascript
  
  

```

### ``

```javascript
  
  
  
  

```

### ``

```javascript
  
  
  
  
  
  
  
  

```

### ``

```javascript
  
  
  
  
  
  
  
  
  

```

### ``

```javascript
  
  
  
  
  
  
  
  

```

### ``

```javascript
  
  
  
  
  
  
  
  
  

```

### ``

```javascript
  
  
  
  
  
  
  
  
  
  
  

```

### 
``````[](https://atom.io/download/atom-shell)[](https://atom.io/download/electron)

## 

### ``

```javascript
  
  
  
  
  
  
  

```

### ``

```javascript
  
  
  
  
  
  

```

### ``

```javascript
  
  
  
  

```

### ``

```javascript
  
  
  
  
  
  
  
  
  

```

### ``

- ``````

### ``

```javascript
  
  
  
  

```

### ``

```javascript
  
  
  
  

```

### ``

```javascript
  
  
  
  

```

### 
``````**[](https://github.com/electron/electron/pull/6986)[](https://github.com/electron/electron/pull/7189)[](https://github.com/electron/electron/edit/main/docs/breaking-changes.md)[](/pt/docs/latest/tutorial/testing-on-headless-ci)[](/pt/docs/latest/tutorial/electron-timelines)

- 
- 

  - 
  - 
  - [``](#removed-clipboard-module-is-no-longer-available-in-the-renderer-process)

- 

  - 
  - 
  - [``](#behavior-changed-nativeimagetobitmap-now-normalizes-color-space)
  - [``](#behavior-changed-chromescripting-css-injection-matches-more-fallback-frames)
  - 
  - [``](#removed-showhiddenfiles-in-dialogs-on-linux)

- 

  - [``](#behavior-changed-macos-notifications-now-use-unnotification-api)
  - [``](#behavior-changed-offscreen-rendering-will-use-10-as-default-device-scale-factor)
  - [````](#behavior-changed-electron-no-longer-downloads-itself-via-postinstall-script)
  - [````](#removed-quotas-object-from-sessionclearstoragedataoptions)
  - [````](#deprecated-passing-only-an-array-hslshift-to-nativeimagecreatefromnamedimage)

- 

  - 
  - 
  - [``](#deprecated-showhiddenfiles-in-dialogs-on-linux)

- 

  - [``](#deprecated-clipboard-api-access-from-renderer-processes)
  - 

- 

  - [``](#deprecated---host-rules-command-line-switch)
  - 
  - [````](#behavior-changed-nsaudiocaptureusagedescription-should-be-included-in-your-apps-infoplist-file-to-use-desktopcapturer--macos-142)
  - [``](#behavior-changed-shared-texture-osr-paint-event-data-structure)

- 

  - [``](#removed-electron_ozone_platform_hint-environment-variable)
  - [``](#removed-original_xdg_current_desktop-environment-variable)
  - 
  - [``](#removed-plugin-crashed-event)
  - [``](#deprecated-webframeroutingid-property)
  - [``](#descontinuado-webframefindframebyroutingidroutingid)

- 

  - 
  - [``](#behavior-changed-processexit-kills-utility-process-synchronously)
  - 
  - [``````](#removed-null-value-for-session-property-in-protocolresponse)
  - [``](#behavior-changed-browserwindowisvisibleonallworkspaces-on-linux)

- 

  - [``](#behavior-changes-appcommandline)
  - [``](#descontinuado-nativeimagegetbitmap)
  - [``````](#removed-isdefault-and-status-properties-on-printerinfo)
  - [``````](#removed-quota-type-syncable-in-sessionclearstoragedataoptions)
  - [``````](#deprecated-null-value-for-session-property-in-protocolresponse)
  - [````](#deprecated-quota-property-in-sessionclearstoragedataoptions)
  - [``](#deprecated-extension-methods-and-events-on-session)
  - [``](#removido-systempreferencesisaeroglassenabled)
  - 

- 

  - [``](#behavior-changed-dialog-apis-defaultpath-option-on-linux)
  - [````](#deprecated-getfromversionid-on-sessionserviceworkers)
  - [``````](#deprecated-setpreloads-getpreloads-on-session)
  - [````````````](#deprecated-level-message-line-and-sourceid-arguments-in-console-message-event-on-webcontents)
  - [````](#behavior-changed-urls-property-of-webrequestfilter)
  - [``](#descontinuado-systempreferencesisaeroglassenabled)

- 

  - 

- 

  - [``](#descontinuado-documentexeccommandpaste)
  - 
  - 
  - [``````](#behavior-changed-webcontents-property-on-login-on-app)
  - [````](#deprecated-textured-option-in-browserwindowconstructoroptiontype)
  - 
  - 
  - [``](#descontinuado-systempreferencesaccessibilitydisplayshouldreducetransparency)

- 

  - [``](#removed-filepath)
  - [``````````````````](#deprecated-clearhistory-cangoback-goback-cangoforward-goforward-gotoindex-cangotooffset-gotooffset-on-webcontents)
  - [````](#behavior-changed-directory-databases-in-userdata-will-be-deleted)

- 

  - [``](#removed-websql-support)
  - [``](#behavior-changed-nativeimagetodataurl-will-preserve-png-colorspace)
  - [``](#behavior-changed-windowflashframebool-will-flash-dock-icon-continuously-on-macos)

- 

  - 
  - [``](#removed-the---disable-color-correct-rendering-switch)
  - [``](#behavior-changed-browserviewsetautoresize-behavior-on-macos)
  - [``](#deprecated-browserview)
  - [``````](#removed-paramsinputformtype-property-on-context-menu-on-webcontents)
  - [``](#removido-processgetiocounters)

- 

  - [````](#behavior-changed-ipcrenderer-can-no-longer-be-sent-over-the-contextbridge)
  - [````](#removed-renderer-process-crashed-event-on-app)
  - [``````](#removed-crashed-event-on-webcontents-and-webview)
  - [````](#removed-gpu-process-crashed-event-on-app)

- 

  - [``````](#behavior-changed-webcontentsbackgroundthrottling-set-to-false-affects-all-webcontents-in-the-host-browserwindow)
  - [``](#removido-browserwindowsettrafficlightpositionposition)
  - [``](#removido-browserwindowgettrafficlightposition)
  - [``](#removido-ipcrenderersendto)
  - [``](#removido-apprunningunderrosettatranslation)
  - [````](#deprecated-renderer-process-crashed-event-on-app)
  - [``````](#deprecated-paramsinputformtype-property-on-context-menu-on-webcontents)
  - [``````](#deprecated-crashed-event-on-webcontents-and-webview)
  - [````](#deprecated-gpu-process-crashed-event-on-app)

- 

  - 
  - [``](#descontinuado-ipcrenderersendto)
  - [``](#removed-color-scheme-events-in-systempreferences)
  - [``](#removed-some-windowsetvibrancy-options-on-macos)
  - [``](#removido-webcontentsgetprinters)
  - [````](#removed-systempreferencesgetsetapplevelappearance-and-systempreferencesapplevelappearance)
  - [````](#removed-alternate-selected-control-text-value-for-systempreferencesgetcolor)

- 

  - [``](#descontinuado-webcontentsgetprinters)
  - [````](#deprecated-systempreferencesgetsetapplevelappearance-and-systempreferencesapplevelappearance)
  - [````](#deprecated-alternate-selected-control-text-value-for-systempreferencesgetcolor)

- 

  - [````](#deprecated-protocolunregisterinterceptbufferstringstreamfilehttpprotocol-and-protocolisprotocolregisteredintercepted)
  - [``](#descontinuado-browserwindowsettrafficlightpositionposition)
  - [``](#descontinuado-browserwindowgettrafficlightposition)

- 

  - [``](#api-alterada-nativeimagecreatethumbnailfrompathpath-size)

- 

  - 
  - 
  - [``](#removed-browserwindow-scroll-touch--events)
  - [``](#removido-webcontentsincrementcapturercountstayhidden-stayawake)
  - [``](#removido-webcontentsdecrementcapturercountstayhidden-stayawake)

- 

  - [``](#descontinuado-webcontentsincrementcapturercountstayhidden-stayawake)
  - [``](#descontinuado-webcontentsdecrementcapturercountstayhidden-stayawake)
  - [``](#removed-webcontents-new-window-event)
  - [````](#removed-webview-new-window-event)
  - [``](#deprecated-browserwindow-scroll-touch--events)

- 

  - 
  - [``](#api-changed-webcontentsprinttopdf)

- 

  - 
  - [``](#default-changed-renderers-without-nodeintegration-true-are-sandboxed-by-default)
  - [``](#removed-skiptaskbar-on-linux)
  - [``](#api-alterada-sessionsetdevicepermissionhandlerhandler)

- 

  - 

- 

  - [``](#removido-nativewindowopen)

- 

  - [``](#removido-desktopcapturergetsources-do-renderizador)
  - [``](#descontinuado-nativewindowopen)

- 

  - [``](#behavior-changed-crashreporter-implementation-switched-to-crashpad-on-linux)
  - [``](#descontinuado-desktopcapturergetsources-do-renderizador)

- 

  - [````](#padrão-alterado-nativewindowopen-padrão-para-true)
  - [``](#descontinuado-apprunningunderrosettatranslation)

- 

  - [``](#removed-remote-module)
  - [``](#removido-appallowrendererprocessreuse)
  - 
  - [``](#api-alterada-windowopen)
  - [``](#removido-worldsafeexecutejavascript)
  - 
  - [``](#removido-additionalfeatures)

- 

  - [``](#api-alterada-sessionsetpermissioncheckhandlerhandler)
  - [``](#removed-shellmoveitemtotrash)
  - [``](#removido-browserwindow-extensão-da-api)
  - [``](#removido-métodos-em-systempreferences)
  - [``](#descontinuado-evento-webcontents-new-window)

- 

  - 
  - [````](#padrão-alterado-worldsafeexecutejavascript-padrão-para-true)
  - [````](#padrão-alterado-contextisolation-padrão-para-true)
  - [``](#removido-crashreportergetcrashesdirectory)
  - [``](#removido-crashreporter-métodos-do-processo-de-renderização)
  - [``](#padrão-alterado-crashreporterstart-compress-true-)
  - [``](#descontinuado-módulo-remote)
  - [``](#descontinuado-shellmoveitemtotrash)

- 

  - [``````](#removido-browserviewdestroy-fromid-fromwebcontents-getallviews-e-id-propriedade-de-browserview)

- 

  - [````](#descontinuado-companyname-argumento-para-crashreporterstart)
  - [``](#descontinuado-crashreportergetcrashesdirectory)
  - [``](#descontinuado-crashreporter-métodos-do-processo-de-renderização)
  - [``](#descontinuado-crashreporterstart-compress-false-)
  - [````](#padrão-alterado-enableremotemodule-padrão-para-false)
  - [``](#protocolunregisterprotocol)
  - [``](#protocoluninterceptprotocol)
  - [``](#protocolregisterfileprotocol)
  - [``](#protocolregisterbufferprotocol)
  - [``](#protocolregisterstringprotocol)
  - [``](#protocolregisterhttpprotocol)
  - [``](#protocolregisterstreamprotocol)
  - [``](#protocolinterceptfileprotocol)
  - [``](#protocolinterceptstringprotocol)
  - [``](#protocolinterceptbufferprotocol)
  - [``](#protocolintercepthttpprotocol)
  - [``](#protocolinterceptstreamprotocol)
  - [``](#protocolisprotocolhandled)

- 

  - 
  - [``](#descontinuado-browserwindow-extensão-da-api)
  - [``](#removido-webviewgetwebcontents)
  - [``](#removido-webframesetlayoutzoomlevellimits)
  - 
  - [````](#api-alterada-shellopenitem-alterado-para-shellopenpath)

- 

  - 
  - [``](#descontinuado-webviewgetwebcontents)
  - [``](#descontinuado-webframesetlayoutzoomlevellimits)
  - [``](#eventos-obsoletos-em-systempreferences)
  - [``](#obsoleto-métodos-em-systempreferences)

- 

  - 
  - [``](#api-alterada-sessionclearauthcache-não-aceita-mais-opções)
  - [````](#api-alterada-powermonitorquerysystemidlestate-alterado-para-powermonitorgetsystemidlestate)
  - [````](#api-alterada-powermonitorquerysystemidletime-alterado-para-powermonitorgetsystemidletime)
  - [``](#api-alterada-webframesetisolatedworldinfo-substitui-métodos-separados)
  - [````](#removed-marked-property-on-getblinkmemoryinfo)
  - [````](#behavior-changed-webkitdirectory-attribute-for-input-typefile-now-lists-directory-contents)
  - 

- 

  - [````](#api-alterada-winsetmenunull-alterado-para-winremovemenu)
  - [````](#api-changed-electronscreen-in-the-renderer-process-should-be-accessed-via-remote)
  - [````](#api-changed-requireing-node-builtins-in-sandboxed-renderers-no-longer-implicitly-loads-the-remote-version)
  - [````](#deprecated-powermonitorquerysystemidlestate-replaced-with-powermonitorgetsystemidlestate)
  - [````](#deprecated-powermonitorquerysystemidletime-replaced-with-powermonitorgetsystemidletime)
  - [``](#deprecated-appenablemixedsandbox-is-no-longer-needed)
  - [``](#descontinuado-traysethighlightmode)

- 

  - [``````](#default-changed-nodeintegration-and-webviewtag-default-to-false-contextisolation-defaults-to-true)
  - [````](#behavior-changed-nodeintegration-in-child-windows-opened-via-nativewindowopen)
  - 
  - [````](#deprecated-webframesetisolatedworld-replaced-with-webframesetisolatedworldinfo)
  - [``](#api-changed-webframesetspellcheckprovider-now-takes-an-asynchronous-callback)
  - [````](#api-changed-webcontentsgetzoomlevel-and-webcontentsgetzoomfactor-are-now-synchronous)

- 

  - [``](#appmakesingleinstance)
  - [``](#appreleasesingleinstance)
  - [``](#appgetgpuinfo)
  - [``](#win_delay_load_hook)
  - 

- 

  - [``](#app)
  - [``](#browserwindow)
  - [``](#clipboard)
  - [``](#crashreporter)
  - [``](#nativeimage)
  - [``](#process)
  - [``](#screen)
  - [``](#session)
  - [``](#tray)
  - [``](#webcontents)
  - [``](#webframe)
  - [``](#webview)
  - 

- 

  - [``](#autoupdater)
  - [``](#browserwindow-1)
  - [``](#menu)
  - [``](#nativeimage-1)
  - [``](#process-1)
  - [``](#webcontents-1)
  - [``](#webframe-1)
  - [``](#webview-1)
  - 

- [](/pt/docs/latest/)
- [](/pt/docs/latest/api/app)

- [](/pt/docs/latest/tutorial/performance)
- [](/pt/docs/latest/tutorial/security)

- [](https://electronforge.io)
- [](/pt/fiddle)

- [](/pt/governance)
- [](/pt/community)
- [](https://discordapp.com/invite/APGC3k5yaH)
- [](https://bsky.app/profile/electronjs.org)
- [](https://x.com/electronjs)
- [](https://social.lfx.dev/@electronjs)
- [](https://stackoverflow.com/questions/tagged/electron)

- [](https://github.com/electron/electron)
- [](https://opencollective.com/electron)
- [](https://p.datadoghq.com/sb/c44e1df0-85d7-11ee-94c9-da7ad0900002-c245f7ef47d0d0c32abecdc0938c2a85)
[](https://openjsf.org/)[](https://openjsf.org)[](https://openjsf.org)[](https://openjsf.org)[](https://trademark-policy.openjsf.org)[](https://trademark-list.openjsf.org)[](https://trademark-list.openjsf.org)[](https://openjsf.org)[](https://terms-of-use.openjsf.org)[](https://privacy-policy.openjsf.org)[](https://bylaws.openjsf.org)[](https://code-of-conduct.openjsf.org)[](https://trademark-policy.openjsf.org)[](https://trademark-list.openjsf.org)[](https://www.linuxfoundation.org/cookies)
