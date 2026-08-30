---
title: "MenuItem"
description: "## Class: MenuItem"
topics:
  - "Api"
keywords:
  - "MenuItem"
  - "Menu"
  - "options"
  - "click"
  - "menuItem"
  - "window"
  - "event"
  - "role"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/menu-item"
---

# MenuItem

## Class: MenuItem

> 

Adicione itens para menus e menus de contexto para aplicações nativas.

Process: [Main](/pt/docs/latest/glossary#main-process)

See [`Menu`](/pt/docs/latest/api/menu) for examples.

> 

[!WARNING] Electron's built-in classes cannot be subclassed in user code. For more information, see [the FAQ](/pt/docs/latest/faq#class-inheritance-does-not-work-with-electron-built-in-modules).

### `new MenuItem(options)`

- `options` Object

  - `click` Function (optional) - Will be called with `click(menuItem, window, event)` when the menu item is clicked.

    - `menuItem` [MenuItem](/pt/docs/latest/api/menu-item)

    - `window` [BaseWindow](/pt/docs/latest/api/base-window) | undefined - This will not be defined if no window is open.

    - `event` [KeyboardEvent](/pt/docs/latest/api/structures/keyboard-event)

  - `role` string (optional) - Can be `undo`, `redo`, `cut`, `copy`, `paste`, `pasteAndMatchStyle`, `delete`, `selectAll`, `reload`, `forceReload`, `toggleDevTools`, `resetZoom`, `zoomIn`, `zoomOut`, `toggleSpellChecker`, `togglefullscreen`, `window`, `minimize`, `close`, `help`, `about`, `services`, `hide`, `hideOthers`, `unhide`, `quit`, `showSubstitutions`, `toggleSmartQuotes`, `toggleSmartDashes`, `toggleTextReplacement`, `startSpeaking`, `stopSpeaking`, `zoom`, `front`, `appMenu`, `fileMenu`, `editMenu`, `viewMenu`, `shareMenu`, `recentDocuments`, `toggleTabBar`, `selectNextTab`, `selectPreviousTab`, `showAllTabs`, `mergeAllWindows`, `clearRecentDocuments`, `moveTabToNewWindow` or `windowMenu` - Define the action of the menu item, when specified the `click` property will be ignored. See [roles](/pt/docs/latest/tutorial/menus#roles).

  - `features` string (opcional)

    - `normal`

    - `separator`

    - `submenu`

    - `caixa de seleção`

    - `rádio`

    - `header` - Only available on macOS 14 and up.

    - `palette` - Only available on macOS 14 and up.

  - `label` string (opcional)

  - `accessibilityLabel` string (optional) *macOS*

  - `sublabel` string (optional) *macOS* - Available in macOS >= 14.4

  - `toolTip` string (optional) *macOS* - Hover text for this menu item.

  - `accelerator` string (optional) - An [Accelerator](/pt/docs/latest/tutorial/keyboard-shortcuts#accelerators) string.

  - `icon` ([NativeImage](/pt/docs/latest/api/native-image) | string) (optional) - Can be a [NativeImage](/pt/docs/latest/api/native-image) or the file path of an icon.

  - `enabled` boolean (optional) - Se falso, o item do menu vai ser não-clicável e cinza.

  - `acceleratorWorksWhenHidden` boolean (optional) *macOS* - default is `true`, and when `false` will prevent the accelerator from triggering the item if the item is not visible.

  - `visible` boolean (opcional) - Se falso, o item do menu será inteiramente escondido.

  - `checked` boolean (opcinal) - Deve ser especificado apenas para `checkbox` ou `radio` tipos de item de menu.

  - `registerAccelerator` boolean (optional) *Linux* *Windows* - If false, the accelerator won't be registered with the system, but it will still be displayed. Defaults to true.

  - `sharingItem` [SharingItem](/pt/docs/latest/api/structures/sharing-item) (optional) *macOS* - The item to share when the `role` is `shareMenu`.

  - `submenu` ([MenuItemConstructorOptions](#new-menuitemoptions)[] | [Menu](/pt/docs/latest/api/menu)) (optional) - Should be specified for `submenu` type menu items. If `submenu` is specified, the `type: 'submenu'` can be omitted. If the value is not a [`Menu`](/pt/docs/latest/api/menu) then it will be automatically converted to one using `Menu.buildFromTemplate`.

  - `id` string (optional) - Unique within a single menu. If defined then it can be used as a reference to this item by the position attribute.

  - `before` string[] (optional) - Inserts this item before the item with the specified id. If the referenced item doesn't exist the item will be inserted at the end of  the menu. Also implies that the menu item in question should be placed in the same “group” as the item.

  - `after` string[] (optional) - Inserts this item after the item with the specified id. If the referenced item doesn't exist the item will be inserted at the end of the menu.

  - `beforeGroupContaining` string[] (optional) - Provides a means for a single context menu to declare the placement of their containing group before the containing group of the item with the specified id.

  - `afterGroupContaining` string[] (optional) - Provides a means for a single context menu to declare the placement of their containing group after the containing group of the item with the specified id.

> [!NOTE]
> 

> note

> 

`acceleratorWorksWhenHidden` is specified as being macOS-only because accelerators always work when items are hidden on Windows and Linux. The option is exposed to users to give them the option to turn it off, as this is possible in native macOS development.

### Propriedades da Instância

As seguintes propriedades estão disponíveis em instâncias de `MenuItem`:

#### `menuItem.id`

A `string` indicating the item's unique id.

This property can be dynamically changed.

#### `menuItem.label`

A `string` indicating the item's visible label.

This property can be dynamically changed.

#### `menuItem.accessibilityLabel` no *macOS*

A `string` indicating the item's accessibility label (used by assistive technology), if set.

This property can be dynamically changed.

#### `menuItem.click`

Uma `Function` que é ativada quando um item de menu recebe um evento de clique. It can be called with `menuItem.click(event, focusedWindow, focusedWebContents)`.

- `event` [KeyboardEvent](/pt/docs/latest/api/structures/keyboard-event)

- `focusedWindow` [BaseWindow](/pt/docs/latest/api/base-window)

- `focusedWebContents` [WebContents](/pt/docs/latest/api/web-contents)

#### `menuItem.submenu`

A [`Menu`](/pt/docs/latest/api/menu) (optional) containing the menu item's submenu, if present.

#### `menuItem.type`

A `string` indicating the type of the item. Can be `normal`, `separator`, `submenu`, `checkbox`, `radio`, `header` or `palette`.

> [!NOTE]
> 

> note

> 

`header` and `palette` are only available on macOS 14 and up.

#### `menuItem.role`

A `string` (optional) indicating the item's role, if set. Can be `undo`, `redo`, `cut`, `copy`, `paste`, `pasteAndMatchStyle`, `delete`, `selectAll`, `reload`, `forceReload`, `toggleDevTools`, `resetZoom`, `zoomIn`, `zoomOut`, `toggleSpellChecker`, `togglefullscreen`, `window`, `minimize`, `close`, `help`, `about`, `services`, `hide`, `hideOthers`, `unhide`, `quit`, `startSpeaking`, `stopSpeaking`, `zoom`, `front`, `appMenu`, `fileMenu`, `editMenu`, `viewMenu`, `shareMenu`, `recentDocuments`, `toggleTabBar`, `selectNextTab`, `selectPreviousTab`, `showAllTabs`, `mergeAllWindows`, `clearRecentDocuments`, `moveTabToNewWindow` or `windowMenu`

#### `menuItem.accelerator`

An [`Accelerator | null`](/pt/docs/latest/tutorial/keyboard-shortcuts#accelerators) indicating the item's accelerator, if set.

#### `menuItem.userAccelerator` *Readonly* *macOS*

An [`Accelerator | null`](/pt/docs/latest/tutorial/keyboard-shortcuts#accelerators) indicating the item's [user-assigned accelerator](https://developer.apple.com/documentation/appkit/nsmenuitem/1514850-userkeyequivalent?language=objc) for the menu item.

> 

[!NOTE] This property is only initialized after the `MenuItem` has been added to a `Menu`. Either via `Menu.buildFromTemplate` or via `Menu.append()/insert()`.  Accessing before initialization will just return `null`.

#### `menuItem.icon`

A `NativeImage | string` (optional) indicating the item's icon, if set.

This property can be dynamically changed.

#### `menuItem.sublabel`

A `string` indicating the item's sublabel.

This property can be dynamically changed.

#### `menuItem.toolTip` *macOS*

A `string` indicating the item's hover text.

#### `menuItem.enabled`

A `boolean` indicating whether the item is enabled.

This property can be dynamically changed.

#### `menuItem.visible`

A `boolean` indicating whether the item is visible.

This property can be dynamically changed.

#### `menuItem.checked`

A `boolean` indicating whether the item is checked.

This property can be dynamically changed.

Um item do menu de um `checkbox` irá mudar a propriedade `checked` para ativa ou não quando selecionada.

Um item do menu de um `radio` irá ativar a sua propriedade `checked` quando clicado, e irá desativar essa propriedade para todos os itens adjacentes no mesmo menu.

Você pode adicionar uma função `click` para comportamentos adicionais.

#### `menuItem.registerAccelerator`

A `boolean` indicating if the accelerator should be registered with the system or just displayed.

This property can be dynamically changed.

#### `menuItem.sharingItem` *macOS*

A [SharingItem](/pt/docs/latest/api/structures/sharing-item) indicating the item to share when the `role` is `shareMenu`.

This property can be dynamically changed.

#### `menuItem.commandId`

A `number` indicating an item's sequential unique id.

#### `menuItem.menu`

A [`Menu`](/pt/docs/latest/api/menu) that the item is a part of.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/menu-item.md)[AnteriorMenu](/pt/docs/latest/api/menu)[AvançarMessageChannelMain](/pt/docs/latest/api/message-channel-main)
