---
title: "Notificação"
description: "Documentação técnica e referência da API de Notificação no Electron."
topics:
  - "Api"
keywords:
  - "Notificação"
  - "failed"
  - "Notification"
  - "options"
  - "boolean"
  - "callback"
  - "details"
  - "handleActivation"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/notification"
---

# Notificação

> 

Criar notificações para o desktop do sistema

Process: [Main](/pt/docs/latest/glossary#main-process)

> 

[!NOTE] If you want to show notifications from a renderer process you should use the [web Notifications API](/pt/docs/latest/tutorial/notifications)

> 

[!NOTE] On MacOS, notifications use the UNNotification API as their underlying framework. This API requires an application to be code-signed in order for notifications to appear. Unsigned binaries will emit a `failed` event when notifications are called.

## Class: Notification

> 

Criar notificações para o desktop do sistema

Process: [Main](/pt/docs/latest/glossary#main-process)

`Notification` é um [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).

O mesmo cria um novo `Notification` com propriedades nativas informadas como a opção `options`.

> 

[!WARNING] Electron's built-in classes cannot be subclassed in user code. For more information, see [the FAQ](/pt/docs/latest/faq#class-inheritance-does-not-work-with-electron-built-in-modules).

### Métodos estáticos

A classe `Notification` tem os seguintes métodos estáticos:

#### `Notification.isSupported()`

Retorna `boolean` - se as notificações do desktop são suportadas ou não pelo atual sistema

#### `Notification.handleActivation(callback)` *Windows*

- `callback` Function

  - `details` [ActivationArguments](/pt/docs/latest/api/structures/activation-arguments) - Details about the notification activation.

Registers a callback to handle all notification activations. The callback is invoked whenever a notification is clicked, replied to, or has an action button pressed - regardless of whether the original `Notification` object is still in memory.

This method handles timing automatically:

- If an activation already occurred before calling this method, the callback is invoked immediately with those details.

- For all subsequent activations, the callback is invoked when they occur.

The callback remains registered until replaced by another call to `handleActivation`.

This provides a centralized way to handle notification interactions that works in all scenarios:

- Cold start (app launched from notification click)

- Notifications persisted in AC that have no in-memory representation after app re-start

- Notification object was garbage collected

- Notification object is still in memory (callback is invoked in addition to instance events)

```javascript
const { Notification, app } = require('electron')  
  
app.whenReady().then(() => {  
  // Register handler for all notification activations  
  Notification.handleActivation((details) => {  
    console.log('Notification activated:', details.type)  
    if (details.type === 'reply') {  
      console.log('User reply:', details.reply)  
    } else if (details.type === 'action') {  
      console.log('Action index:', details.actionIndex)  
    }  
  })  
})  

```

#### `Notification.getHistory()` no *macOS*

Returns `Promise<Notification[]>` - Resolves with an array of `Notification` objects representing all delivered notifications still present in Notification Center.

Each returned `Notification` is a live object connected to the corresponding delivered notification. Interaction events (`click`, `reply`, `action`, `close`) will fire on these objects when the user interacts with the notification in Notification Center. This is useful after an app restart to re-attach event handlers to notifications from a previous session.

The returned notifications have their `id`, `groupId`, `title`, `subtitle`, and `body` properties populated from information available in the Notification Center. Other properties (e.g., `actions`, `silent`, `icon`) are not available from delivered notifications and will have default values.

> 

[!NOTE] Like all macOS notification APIs, this method requires the application to be code-signed. In unsigned development builds, notifications are not delivered to Notification Center and this method will resolve with an empty array.

> 

[!NOTE] Unlike notifications created with `new Notification()`, notifications returned by `getHistory()` will remain visible in Notification Center when the object is garbage collected. Calling `show()` on a restored notification will remove the original from Notification Center and post a new one with the same properties.

```javascript
const { Notification, app } = require('electron')  
  
app.whenReady().then(async () => {  
  // Restore notifications from a previous session  
  const notifications = await Notification.getHistory()  
  for (const n of notifications) {  
    console.log(`Found delivered notification: ${n.id} - ${n.title}`)  
    n.on('click', () => {  
      console.log(`User clicked: ${n.id}`)  
    })  
    n.on('reply', (event) => {  
      console.log(`User replied to ${n.id}: ${event.reply}`)  
    })  
  }  
  // Keep references so events continue to fire  
})  

```

#### `Notification.remove(id)` *macOS*

- `id` (string | string[]) - The notification identifier(s) to remove. These correspond to the `id` values set in the [`Notification` constructor](#new-notificationoptions).

Removes one or more delivered notifications from Notification Center by their identifier(s).

```javascript
const { Notification } = require('electron')  
  
// Remove a single notification  
Notification.remove('my-notification-id')  
  
// Remove multiple notifications  
Notification.remove(['msg-1', 'msg-2', 'msg-3'])  

```

#### `Notification.removeAll()` no *macOS*

Removes all of the app's delivered notifications from Notification Center.

```javascript
const { Notification } = require('electron')  
  
Notification.removeAll()  

```

#### `Notification.removeGroup(groupId)` *macOS*

- `groupId` string - The group identifier of the notifications to remove. This corresponds to the `groupId` value set in the [`Notification` constructor](#new-notificationoptions).

Removes all delivered notifications with the given `groupId` from Notification Center.

```javascript
const { Notification } = require('electron')  
  
// Remove all notifications in the 'chat-thread-1' group  
Notification.removeGroup('chat-thread-1')  

```

### `new Notification([options])`

- Objeto `options` (opcional)

  - `id` string (optional) *macOS* *Windows* - A unique identifier for the notification. On macOS, maps to `UNNotificationRequest`'s [`identifier`](https://developer.apple.com/documentation/usernotifications/unnotificationrequest/identifier) property. On Windows, maps to the toast notification's [`Tag`](https://learn.microsoft.com/en-us/uwp/api/windows.ui.notifications.toastnotification.tag) property. Defaults to a random UUID if not provided or if an empty string is passed. Use this identifier with [`Notification.remove()`](#notificationremoveid-macos) to remove specific delivered notifications, or with [`Notification.getHistory()`](#notificationgethistory-macos) to identify them.

  - `groupId` string (optional) *macOS* *Windows* - A string identifier used to visually group notifications together in Notification Center / Action Center. On macOS, maps to `UNNotificationContent`'s [`threadIdentifier`](https://developer.apple.com/documentation/usernotifications/unnotificationcontent/threadidentifier) property. On Windows, maps to the toast notification's [`Group`](https://learn.microsoft.com/en-us/uwp/api/windows.ui.notifications.toastnotification.group) property. Use this identifier with [`Notification.removeGroup()`](#notificationremovegroupgroupid-macos) to remove all notifications in a group.

  - `groupTitle` string (optional) *Windows* - A title for the notification group header. When both `groupId` and `groupTitle` are specified, Windows will display a header above the notification that groups related notifications together. Maps to the toast notification's [`header`](https://learn.microsoft.com/en-us/windows/apps/design/shell/tiles-and-notifications/toast-headers) element.

  - `title` string (optional) - A title for the notification, which will be displayed at the top of the notification window when it is shown.

  - `subtitle` string (optional) *macOS* - A subtitle for the notification, which will be displayed below the title.

  - `body` string (optional) - The body text of the notification, which will be displayed below the title or subtitle.

  - `silent` boolean (optional) - Whether or not to suppress the OS notification noise when showing the notification.

  - `icon` (string | [NativeImage](/pt/docs/latest/api/native-image)) (optional) - An icon to use in the notification. If a string is passed, it must be a valid path to a local icon file.

  - `hasReply` boolean (optional) *macOS* *Windows* - Whether or not to add an inline reply option to the notification.

  - `timeoutType` string (optional) *Linux* *Windows* - The timeout duration of the notification. Can be 'default' or 'never'.

  - `replyPlaceholder` string (optional) *macOS* *Windows* - The placeholder to write in the inline reply input field.

  - `sound` string (optional) *macOS* - The name of the sound file to play when the notification is shown.

  - `urgency` string (optional) *Linux* *Windows* - The urgency level of the notification. Can be 'normal', 'critical', or 'low'.

  - `actions` [NotificationAction[]](/pt/docs/latest/api/structures/notification-action) (optional) *macOS* *Windows* - Actions to add to the notification. Please read the available actions and limitations in the `NotificationAction` documentation.

  - `closeButtonText` string (optional) *macOS* - A custom title for the close button of an alert. An empty string will cause the default localized text to be used.

  - `toastXml` string (optional) *Windows* - A custom description of the Notification on Windows superseding all properties above. Provides full customization of design and behavior of the notification.

> 

[!NOTE] On Windows, `urgency` type 'critical' sorts the notification higher in Action Center (above default priority notifications), but does not prevent auto-dismissal. To prevent auto-dismissal, you should also set `timeoutType` to 'never'.

### Eventos de instância

Objects created with `new Notification` emit the following events:

> [!NOTE]
> 

> info

> 

Some events are only available on specific operating systems and are labeled as such.

#### Evento: 'show'

Retorna:

- `event` Event

Emitted when the notification is shown to the user. Note that this event can be fired multiple times as a notification can be shown multiple times through the `show()` method.

```javascript
const { Notification, app } = require('electron')  
  
app.whenReady().then(() => {  
  const n = new Notification({  
    title: 'Title!',  
    subtitle: 'Subtitle!',  
    body: 'Body!'  
  })  
  
  n.on('show', () => console.log('Notification shown!'))  
  
  n.show()  
})  

```

#### Event: 'click'

Retorna:

- `event` Event

Emitted when the notification is clicked by the user.

```javascript
const { Notification, app } = require('electron')  
  
app.whenReady().then(() => {  
  const n = new Notification({  
    title: 'Title!',  
    subtitle: 'Subtitle!',  
    body: 'Body!'  
  })  
  
  n.on('click', () => console.log('Notification clicked!'))  
  
  n.show()  
})  

```

#### Evento: 'close'

Retorna:

- `details` Evento<>

  - `reason` *Windows* string (optional) - The reason the notification was closed. This can be 'userCanceled', 'applicationHidden', or 'timedOut'.

Emitted when the notification is closed by manual intervention from the user.

This event is not guaranteed to be emitted in all cases where the notification is closed.

On Windows, the `close` event can be emitted in one of three ways: programmatic dismissal with `notification.close()`, by the user closing the notification, or via system timeout. If a notification is in the Action Center after the initial `close` event is emitted, a call to `notification.close()` will remove the notification from the action center but the `close` event will not be emitted again.

```javascript
const { Notification, app } = require('electron')  
  
app.whenReady().then(() => {  
  const n = new Notification({  
    title: 'Title!',  
    subtitle: 'Subtitle!',  
    body: 'Body!'  
  })  
  
  n.on('close', () => console.log('Notification closed!'))  
  
  n.show()  
})  

```

#### Event: 'reply' *macOS* *Windows*

Retorna:

- `details` Evento<>

  - `reply` string - The string the user entered into the inline reply field.

- `reply` string *Deprecated*

Emitted when the user clicks the "Reply" button on a notification with `hasReply: true`.

```javascript
const { Notification, app } = require('electron')  
  
app.whenReady().then(() => {  
  const n = new Notification({  
    title: 'Send a Message',  
    body: 'Body Text',  
    hasReply: true,  
    replyPlaceholder: 'Message text...'  
  })  
  
  n.on('reply', (e, reply) => console.log(`User replied: ${reply}`))  
  n.on('click', () => console.log('Notification clicked'))  
  
  n.show()  
})  

```

#### Event: 'action' *macOS* *Windows*

Retorna:

- `details` Evento<>

  - `actionIndex` number - The index of the action that was activated.

  - `selectionIndex` number *Windows* - The index of the selected item, if one was chosen. -1 if none was chosen.

- `actionIndex` number *Deprecated*

- `selectionIndex` number *Windows* *Deprecated*

```javascript
const { Notification, app } = require('electron')  
  
app.whenReady().then(() => {  
  const items = ['One', 'Two', 'Three']  
  const n = new Notification({  
    title: 'Choose an Action!',  
    actions: [  
      { type: 'button', text: 'Action 1' },  
      { type: 'button', text: 'Action 2' },  
      { type: 'selection', text: 'Apply', items }  
    ]  
  })  
  
  n.on('click', () => console.log('Notification clicked'))  
  n.on('action', (e) => {  
    console.log(`User triggered action at index: ${e.actionIndex}`)  
    if (e.selectionIndex > -1) {  
      console.log(`User chose selection item '${items[e.selectionIndex]}'`)  
    }  
  })  
  
  n.show()  
})  

```

#### Event: 'failed' *macOS* *Windows*

Retorna:

- `event` Event

- `error` string - The error encountered during execution of the `show()` method.

Emitted when an error is encountered while creating and showing the native notification.

```javascript
const { Notification, app } = require('electron')  
  
app.whenReady().then(() => {  
  const n = new Notification({  
    title: 'Bad Action'  
  })  
  
  n.on('failed', (e, err) => {  
    console.log('Notification failed: ', err)  
  })  
  
  n.show()  
})  

```

### Métodos de Instância

Objects created with the `new Notification()` constructor have the following instance methods:

#### `notification.show()`

Immediately shows the notification to the user. Unlike the web notification API, instantiating a `new Notification()` does not immediately show it to the user. Instead, you need to call this method before the OS will display it.

If the notification has been shown before, this method will dismiss the previously shown notification and create a new one with identical properties.

On macOS, calling `show()` on a notification returned by `Notification.getHistory()` will remove the original notification from Notification Center and post a new one with the same properties.

```javascript
const { Notification, app } = require('electron')  
  
app.whenReady().then(() => {  
  const n = new Notification({  
    title: 'Title!',  
    subtitle: 'Subtitle!',  
    body: 'Body!'  
  })  
  
  n.show()  
})  

```

#### `notification.close()`

Dismisses the notification.

On Windows, calling `notification.close()` while the notification is visible on screen will dismiss the notification and remove it from the Action Center. If `notification.close()` is called after the notification is no longer visible on screen, calling `notification.close()` will try remove it from the Action Center.

```javascript
const { Notification, app } = require('electron')  
  
app.whenReady().then(() => {  
  const n = new Notification({  
    title: 'Title!',  
    subtitle: 'Subtitle!',  
    body: 'Body!'  
  })  
  
  n.show()  
  
  setTimeout(() => n.close(), 5000)  
})  

```

### Propriedades da Instância

#### `notification.id` *macOS* *Windows* *Readonly*

A `string` property representing the unique identifier of the notification. This is set at construction time — either from the `id` option or as a generated UUID if none was provided.

#### `notification.groupId` *macOS* *Windows* *Readonly*

A `string` property representing the group identifier of the notification. Notifications with the same `groupId` will be visually grouped together in Notification Center (macOS) or Action Center (Windows).

#### `notification.groupTitle` *Windows* *Readonly*

A `string` property representing the title of the notification group header.

#### `notification.title`

A `string` property representing the title of the notification.

#### `notification.subtitle`

A `string` property representing the subtitle of the notification.

#### `notification.body`

A `string` property representing the body of the notification.

#### `notification.replyPlaceholder`

A `string` property representing the reply placeholder of the notification.

#### `notification.sound`

A `string` property representing the sound of the notification.

#### `notification.closeButtonText`

A `string` property representing the close button text of the notification.

#### `notification.silent`

A `boolean` property representing whether the notification is silent.

#### `notification.hasReply`

A `boolean` property representing whether the notification has a reply action.

#### `notification.urgency` *Linux*

A `string` property representing the urgency level of the notification. Can be 'normal', 'critical', or 'low'.

Default is 'low' - see [NotifyUrgency](https://developer-old.gnome.org/notification-spec/#urgency-levels) for more information.

#### `notification.timeoutType` *Linux* *Windows*

A `string` property representing the type of timeout duration for the notification. Can be 'default' or 'never'.

If `timeoutType` is set to 'never', the notification never expires. It stays open until closed by the calling API or the user.

#### `notification.actions`

A [NotificationAction[]](/pt/docs/latest/api/structures/notification-action) property representing the actions of the notification.

#### `notification.toastXml` *Windows*

A `string` property representing the custom Toast XML of the notification.

### Playing Sounds

On macOS, you can specify the name of the sound you'd like to play when the notification is shown. Any of the default sounds (under System Preferences > Sound) can be used, in addition to custom sound files. Be sure that the sound file is copied under the app bundle (e.g., `YourApp.app/Contents/Resources`), or one of the following locations:

- `~/Library/Sounds`

- `/Library/Sounds`

- `/Network/Library/Sounds`

- `/System/Library/Sounds`

See the [`NSSound`](https://developer.apple.com/documentation/appkit/nssound) docs for more information.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/notification.md)[AnteriornetLog](/pt/docs/latest/api/net-log)[AvançarpowerMonitor](/pt/docs/latest/api/power-monitor)
