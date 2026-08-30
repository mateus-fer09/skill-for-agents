---
title: "Menu"
description: "## Class: Menu"
topics:
  - "Api"
keywords:
  - "Menu"
  - "menu"
  - "null"
  - "File"
  - "Edit"
  - "View"
  - "Window"
  - "action"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/menu"
---

# Menu

## Class: Menu

> 

Create application menus and context menus.

Process: [Main](/pt/docs/latest/glossary#main-process)

The presentation of menus varies depending on the operating system:

- Under Windows and Linux, menus are visually similar to Chromium.

- Under macOS, these will be native menus.

> 

[!TIP] See also: [A detailed guide about how to implement menus in your application](/pt/docs/latest/tutorial/menus).

> 

[!WARNING] Electron's built-in classes cannot be subclassed in user code. For more information, see [the FAQ](/pt/docs/latest/faq#class-inheritance-does-not-work-with-electron-built-in-modules).

### `new Menu()`

Cria um novo menu.

### Métodos estáticos

A classe `Menu` tem os seguintes métodos estáticos:

#### `Menu.setApplicationMenu(menu)`

- `menu` [Menu](/pt/docs/latest/api/menu) | null

Sets `menu` as the application menu on macOS. On Windows and Linux, the `menu` will be set as each window's top menu.

Also on Windows and Linux, you can use a `&` in the top-level item name to indicate which letter should get a generated accelerator. For example, using `&File` for the file menu would result in a generated `Alt-F` accelerator that opens the associated menu. The indicated character in the button label then gets an underline, and the `&` character is not displayed on the button label.

In order to escape the `&` character in an item name, add a preceding `&`. For example, `&&File` would result in `&File` displayed on the button label.

Passing `null` will suppress the default menu. On Windows and Linux, this has the additional effect of removing the menu bar from the window.

> 

[!NOTE] The default menu will be created automatically if the app does not set one. It contains standard items such as `File`, `Edit`, `View`, and `Window`.

#### `Menu.getApplicationMenu()`

Retorna `Menu | null` - O menu do aplicativo, se definido, ou `null`, se não fora definido.

> 

[!NOTE] The returned `Menu` instance doesn't support dynamic addition or removal of menu items. [Instance properties](#instance-properties) can still be dynamically modified.

#### `Menu.sendActionToFirstResponder(action)` no *macOS*

- `action` string

Sends the `action` to the first responder of application. This is used for emulating default macOS menu behaviors. Usually you would use the [`role`](/pt/docs/latest/tutorial/menus#roles) property of a [`MenuItem`](/pt/docs/latest/api/menu-item).

See the [macOS Cocoa Event Handling Guide](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/EventOverview/EventArchitecture/EventArchitecture.html#//apple_ref/doc/uid/10000060i-CH3-SW7) for more information on macOS' native actions.

#### `Menu.buildFromTemplate(template)`

- `template` ([MenuItemConstructorOptions](/pt/docs/latest/api/menu-item#new-menuitemoptions) | [MenuItem](/pt/docs/latest/api/menu-item))[]

Returns [`Menu`](/pt/docs/latest/api/menu)

Generally, the `template` is an array of `options` for constructing a [MenuItem](/pt/docs/latest/api/menu-item). The usage can be referenced above.

You can also attach other fields to the element of the `template` and they will become properties of the constructed menu items.

### Métodos de Instância

O objeto `menu` possui os seguintes métodos de instância:

#### `menu.popup([options])`

- Objeto `options` (opcional)

  - `window` [BaseWindow](/pt/docs/latest/api/base-window) (optional) - Default is the focused window.

  - `frame` [WebFrameMain](/pt/docs/latest/api/web-frame-main) (optional) - Provide the relevant frame if you want certain OS-level features such as Writing Tools on macOS to function correctly. Typically, this should be `params.frame` from the [`context-menu` event](/pt/docs/latest/api/web-contents#event-context-menu) on a WebContents, or the [`focusedFrame` property](/pt/docs/latest/api/web-contents#contentsfocusedframe-readonly) of a WebContents.

  - `x` number (optional) - Default is the current mouse cursor position. Must be declared if `y` is declared.

  - `y` number (optional) - Default is the current mouse cursor position. Must be declared if `x` is declared.

  - `positioningItem` number (optional) *macOS* - The index of the menu item to be positioned under the mouse cursor at the specified coordinates. Default is -1.

  - `sourceType` string (optional) *Windows* *Linux* - This should map to the `menuSourceType` provided by the `context-menu` event. It is not recommended to set this value manually, only provide values you receive from other APIs or leave it `undefined`. Can be `none`, `mouse`, `keyboard`, `touch`, `touchMenu`, `longPress`, `longTap`, `touchHandle`, `stylus`, `adjustSelection`, or `adjustSelectionReset`.

  - `callback` Function (optional) - Called when menu is closed.

Pops up this menu as a context menu in the [`BaseWindow`](/pt/docs/latest/api/base-window).

> 

[!TIP] For more details, see the [Context Menu](/pt/docs/latest/tutorial/context-menu) guide.

#### `menu.closePopup([window])`

- `window` [BaseWindow](/pt/docs/latest/api/base-window) (optional) - Default is the focused window.

Closes the context menu in the `window`.

#### `menu.append(menuItem)`

- `menuItem` [MenuItem](/pt/docs/latest/api/menu-item)

Acrescenta o `menuItem` ao menu.

#### `menu.getMenuItemById(id)`

- `id` string

Returns [`MenuItem | null`](/pt/docs/latest/api/menu-item) - the item with the specified `id`

#### `menu.Insert(pos, menuItem)`

- `pos` Integer

- `menuItem` [MenuItem](/pt/docs/latest/api/menu-item)

Insere o `menuItem` na posição `pos` do menu.

### Eventos de instância

Objects created with `new Menu` or returned by `Menu.buildFromTemplate` emit the following events:

> 

[!NOTE] Some events are only available on specific operating systems and are labeled as such.

#### Event: 'menu-will-show'

Retorna:

- `event` Event

Emitted when `menu.popup()` is called.

#### Event: 'menu-will-close'

Retorna:

- `event` Event

Emitted when a popup is closed either manually or with `menu.closePopup()`.

### Propriedades da Instância

Objetos `menu` também possuem as seguintes propriedades:

#### `menu.items`

A [`MenuItem[]`](/pt/docs/latest/api/menu-item) array containing the menu's items.

Each `Menu` consists of multiple [`MenuItem`](/pt/docs/latest/api/menu-item) instances and each `MenuItem` can nest a `Menu` into its `submenu` property.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/menu.md)
