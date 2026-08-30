---
title: "pushNotifications"
description: "Process: [Main](/pt/docs/latest/glossary#main-process)"
topics:
  - "Api"
keywords:
  - "pushNotifications"
  - "pushNotification"
  - "event"
  - "userInfo"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/push-notifications"
---

# pushNotifications

Process: [Main](/pt/docs/latest/glossary#main-process)

> 

Register for and receive notifications from remote push notification services

For example, when registering for push notifications via Apple push notification services (APNS):

```javascript
const { pushNotifications, Notification } = require('electron')  
  
pushNotifications.registerForAPNSNotifications().then((token) => {  
  // forward token to your remote notification server  
})  
  
pushNotifications.on('received-apns-notification', (event, userInfo) => {  
  // generate a new Notification object with the relevant userInfo fields  
})  

```

## Eventos

O módulo `pushNotification` emite os seguintes eventos:

#### Event: 'received-apns-notification' *macOS*

Retorna:

- `event` Event

- `userInfo` Record<String, any>

Emitted when the app receives a remote notification while running. See: [https://developer.apple.com/documentation/appkit/nsapplicationdelegate/1428430-application?language=objc](https://developer.apple.com/documentation/appkit/nsapplicationdelegate/1428430-application?language=objc)

## Métodos

O módulo `pushNotification` tem os seguintes métodos:

### `pushNotifications.registerForAPNSNotifications()` no *macOS*

Retorna `Promise<string>`

Registers the app with Apple Push Notification service (APNS) to receive [Badge, Sound, and Alert](https://developer.apple.com/documentation/appkit/nsremotenotificationtype?language=objc) notifications. If registration is successful, the promise will be resolved with the APNS device token. Otherwise, the promise will be rejected with an error message. See: [https://developer.apple.com/documentation/appkit/nsapplication/1428476-registerforremotenotificationtyp?language=objc](https://developer.apple.com/documentation/appkit/nsapplication/1428476-registerforremotenotificationtyp?language=objc)

### `pushNotifications.unregisterForAPNSNotifications()` no *macOS*

Unregisters the app from notifications received from APNS.

Apps unregistered through this method can always reregister.

See: [https://developer.apple.com/documentation/appkit/nsapplication/1428747-unregisterforremotenotifications?language=objc](https://developer.apple.com/documentation/appkit/nsapplication/1428747-unregisterforremotenotifications?language=objc)[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/push-notifications.md)
