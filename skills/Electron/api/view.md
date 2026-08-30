---
title: "View"
description: "Documentação técnica e referência da API de View no Electron."
topics:
  - "Api"
keywords:
  - "ready"
  - "View"
  - "view"
  - "index"
  - "bounds"
  - "options"
  - "animate"
  - "duration"
source_scope:
  - "https://electronjs.org/docs/latest/api/view"
---

# View

> 

Create and layout native views.

Process: [Main](/docs/latest/glossary#main-process)

This module cannot be used until the `ready` event of the `app`
module is emitted.

```javascript
const { BaseWindow, View } = require('electron')  
  
const win = new BaseWindow()  
const view = new View()  
  
view.setBackgroundColor('red')  
view.setBounds({ x: 0, y: 0, width: 100, height: 100 })  
win.contentView.addChildView(view)  

```

## Class: View

> 

A basic native view.

Process: [Main](/docs/latest/glossary#main-process)

`View` is an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

> [!WARNING]
> 

> warning

> 

Electron's built-in classes cannot be subclassed in user code.
For more information, see [the FAQ](/docs/latest/faq#class-inheritance-does-not-work-with-electron-built-in-modules).

### `new View()`

Creates a new `View`.

### Instance Events

Objects created with `new View` emit the following events:

#### Event: 'bounds-changed'

Emitted when the view's bounds have changed in response to being laid out. The
new bounds can be retrieved with [`view.getBounds()`](#viewgetbounds).

### Instance Methods

Objects created with `new View` have the following instance methods:

#### `view.addChildView(view[, index])`

- `view` View - Child view to add.

- `index` Integer (optional) - Index at which to insert the child view.
Defaults to adding the child at the end of the child list.

If the same View is added to a parent which already contains it, it will be reordered such that
it becomes the topmost view.

#### `view.removeChildView(view)`

- `view` View - Child view to remove.

If the view passed as a parameter is not a child of this view, this method is a no-op.

#### `view.setBounds(bounds[, options])`

- `bounds` [Rectangle](/docs/latest/api/structures/rectangle) - New bounds of the View.

- `options` Object (optional) - Options for setting the bounds.

  - `animate` boolean | Object (optional) - If true, the bounds change will be animated. If an object is passed, it can contain the following properties:

    - `duration` Integer (optional) - Duration of the animation in milliseconds. Default is `250`.

    - `easing` string (optional) - Easing function for the animation. Default is `linear`.

      - `linear`

      - `ease-in`

      - `ease-out`

      - `ease-in-out`

#### `view.getBounds()`

Returns [Rectangle](/docs/latest/api/structures/rectangle) - The bounds of this View, relative to its parent.

#### `view.setBackgroundColor(color)`

- `color` string - Color in Hex, RGB, ARGB, HSL, HSLA or named CSS color format. The alpha channel is
optional for the hex type.

Examples of valid `color` values:

- Hex

  - `#fff` (RGB)

  - `#ffff` (ARGB)

  - `#ffffff` (RRGGBB)

  - `#ffffffff` (AARRGGBB)

- RGB

  - `rgb\(([\d]+),\s*([\d]+),\s*([\d]+)\)`

    - e.g. `rgb(255, 255, 255)`

- RGBA

  - `rgba\(([\d]+),\s*([\d]+),\s*([\d]+),\s*([\d.]+)\)`

    - e.g. `rgba(255, 255, 255, 1.0)`

- HSL

  - `hsl\((-?[\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)`

    - e.g. `hsl(200, 20%, 50%)`

- HSLA

  - `hsla\((-?[\d.]+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)`

    - e.g. `hsla(200, 20%, 50%, 0.5)`

- Color name

  - Options are listed in [SkParseColor.cpp](https://source.chromium.org/chromium/chromium/src/+/main:third_party/skia/src/utils/SkParseColor.cpp;l=11-152;drc=eea4bf52cb0d55e2a39c828b017c80a5ee054148)

  - Similar to CSS Color Module Level 3 keywords, but case-sensitive.

    - e.g. `blueviolet` or `red`

> [!NOTE]
> 

> note

> 

Hex format with alpha takes `AARRGGBB` or `ARGB`, *not* `RRGGBBAA` or `RGB`.

#### `view.setBorderRadius(radius)`

- `radius` Integer - Border radius size in pixels.

> [!NOTE]
> 

> note

> 

The area cutout of the view's border still captures clicks.

#### `view.setBackgroundBlur(blurRadius)`

- `blurRadius` Integer - The radius of the background blur effect (in pixels).

> [!NOTE]
> 

> note

> 

You must set a background color with an alpha channel (e.g. `#80ffffff`) in order for the blur effect to be visible.

#### `view.setVisible(visible)`

- `visible` boolean - If false, the view will be hidden from display.

#### `view.getVisible()`

Returns `boolean` - Whether the view should be drawn. Note that this is
different from whether the view is visible on screen—it may still be obscured
or out of view.

### Instance Properties

Objects created with `new View` have the following properties:

#### `view.children` *Readonly*

A `View[]` property representing the child views of this view.[Edit this page](https://github.com/electron/electron/edit/main/docs/api/view.md)[PreviouswebFrameMain](/docs/latest/api/web-frame-main)[Nextclipboard](/docs/latest/api/clipboard)

- [Class: View](#class-view)

  - [`new View()`](#new-view)
  - [Instance Events](#instance-events)

    - [`'bounds-changed'`](#event-bounds-changed)

  - [Instance Methods](#instance-methods)

    - [`addChildView`](#viewaddchildviewview-index)
    - [`removeChildView`](#viewremovechildviewview)
    - [`setBounds`](#viewsetboundsbounds-options)
    - [`getBounds`](#viewgetbounds)
    - [`setBackgroundColor`](#viewsetbackgroundcolorcolor)
    - [`setBorderRadius`](#viewsetborderradiusradius)
    - [`setBackgroundBlur`](#viewsetbackgroundblurblurradius)
    - [`setVisible`](#viewsetvisiblevisible)
    - [`getVisible`](#viewgetvisible)

  - [Instance Properties](#instance-properties)

    - [`children`](#viewchildren-readonly)

Docs

- [Getting Started](/docs/latest/)
- [API Reference](/docs/latest/api/app)
Checklists

- [Performance](/docs/latest/tutorial/performance)
- [Security](/docs/latest/tutorial/security)
Tools

- [Electron Forge](https://electronforge.io)
- [Electron Fiddle](/fiddle)
Community

- [Governance](/governance)
- [Resources](/community)
- [Discord](https://discordapp.com/invite/APGC3k5yaH)
- [Bluesky](https://bsky.app/profile/electronjs.org)
- [X](https://x.com/electronjs)
- [Mastodon](https://social.lfx.dev/@electronjs)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/electron)
More

- [GitHub](https://github.com/electron/electron)
- [Open Collective](https://opencollective.com/electron)
- [Infrastructure Dashboard](https://p.datadoghq.com/sb/c44e1df0-85d7-11ee-94c9-da7ad0900002-c245f7ef47d0d0c32abecdc0938c2a85)
[](https://openjsf.org/)Copyright [OpenJS Foundation](https://openjsf.org) and Electron contributors. All rights reserved. The [OpenJS Foundation](https://openjsf.org) has registered trademarks and uses trademarks.  For a list of trademarks of the [OpenJS Foundation](https://openjsf.org), please see our [Trademark Policy](https://trademark-policy.openjsf.org) and [Trademark List](https://trademark-list.openjsf.org).  Trademarks and logos not indicated on the [list of OpenJS Foundation trademarks](https://trademark-list.openjsf.org) are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.

[The OpenJS Foundation](https://openjsf.org) | [Terms of Use](https://terms-of-use.openjsf.org) | [Privacy Policy](https://privacy-policy.openjsf.org) | [Bylaws](https://bylaws.openjsf.org) | [Code of Conduct](https://code-of-conduct.openjsf.org) | [Trademark Policy](https://trademark-policy.openjsf.org) | [Trademark List](https://trademark-list.openjsf.org) | [Cookie Policy](https://www.linuxfoundation.org/cookies)Hosting and infrastructure graciously provided by
