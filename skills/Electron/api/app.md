---
title: "app"
description: "Documentação técnica e referência da API de app no Electron."
topics:
  - "Api"
keywords:
  - "app"
  - "ready"
  - "applicationWillFinishLaunching"
  - "NSApplication"
  - "event"
  - "launchInfo"
  - "userInfo"
  - "NSUserNotification"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/app"
---

# app

> 

Controle o ciclo de vida de eventos da sua aplicação.

Process: [Main](/pt/docs/latest/glossary#main-process)

O seguinte exemplo mostra como encerrar a aplicação quando a última janela é fechada:

```javascript
const { app } = require('electron')  
  
app.on('window-all-closed', () => {  
  app.quit()  
})  

```

## Eventos

O objeto `app` emite os seguintes eventos:

### Evento: 'will-finish-launching'

Emitido quando a aplicação termina inicialização básica. No Windows e Linux o evento `will-finish-launching` é o mesmo que o evento `ready`; no macOS, este evento representa a notificação `applicationWillFinishLaunching` de `NSApplication`.

Na maioria dos casos, você deve fazer tudo no manipulador do evento `ready`.

### Evento: 'ready'

Retorna:

- `event` Event

- `launchInfo` Record<string, any> | [NotificationResponse](/pt/docs/latest/api/structures/notification-response) *macOS*

Emitido uma vez, quando o Electron terminou de inicializar. No macOS, `launchInfo` contém a `userInfo` do [`NSUserNotification`](https://developer.apple.com/documentation/foundation/nsusernotification) ou as informações de [`UNNotificationResponse`](https://developer.apple.com/documentation/usernotifications/unnotificationresponse) que foi usado para abrir o aplicativo, se foi lançado pelo Centro de Notificações. Você também pode chamar `app.isReady()` para verificar se este evento já foi acionado e `app.whenReady()` para obter uma Promise que é cumprida quando o Electron é inicializado.

> 

[!NOTE] The `ready` event is only fired after the main process has finished running the first tick of the event loop. If an Electron API needs to be called before the `ready` event, ensure that it is called synchronously in the top-level context of the main process.

### Evento: 'window-all-closed'

Emitido quando todas as janelas foram fechadas.

Se você não escutar esse evento e todas as janelas forem fechadas, o comportamento padrão é fechar a aplicação. No entanto, se você estiver escutando, você controla se a aplicação fecha ou não. Se o usuário pressionou `Cmd + Q` ou o desenvolvedor chamou `app.quit()`, o Electron irá primeiro tentar fechar todas as janelas e então emitir o evento `will-quit` e neste caso, `window-all-closed` não será emitido.

### Evento: 'before-quit'

Retorna:

- `event` Event

Emitido antes da aplicação começar a fechar suas janelas. Chamar o `event.preventDefault()` vai previnir o comportamento padrão, que é encerrar o aplicativo.

> 

[!NOTE] If application quit was initiated by `autoUpdater.quitAndInstall()`, then `before-quit` is emitted *after* emitting `close` event on all windows and closing them.

> 

[!NOTE] On Windows, this event will not be emitted if the app is closed due to a shutdown/restart of the system or a user logout.

### Evento: 'will-quit'

Retorna:

- `event` Event

Emitido quando todas as janelas forem fechadas e o aplicativo será encerrado. Chamar o `event.preventDefault()` vai previnir o comportamento padrão, que é encerrar o aplicativo.

Consulte a descrição do evento `window-all-closed` para as diferenças entre os eventos `will-quit` e `window-all-closed`.

> 

[!NOTE] On Windows, this event will not be emitted if the app is closed due to a shutdown/restart of the system or a user logout.

### Evento: 'quit'

Retorna:

- `event` Event

- `exitCode` Integer

Emitido quando a aplicação esta sendo encerrada(quitting).

> 

[!NOTE] On Windows, this event will not be emitted if the app is closed due to a shutdown/restart of the system or a user logout.

### Evento: 'open-file' *macOS*

Retorna:

- `event` Event

- `path` string

Emitido quando o usuário deseja abrir um arquivo com a aplicação. O evento `open-file` geralmente é emitido quando a aplicação já está aberta e o SO deseja reutilizar a aplicação para abrir o arquivo. `open-file` também é emitido quando um arquivo é solto sobre o dock e a aplicação ainda não está em execução. Certifique-se que o evento `open-file` seja detectado desde o início da aplicação para manipulá-lo (inclusive antes do evento `ready` ser emitido).

Se você deseja manipular esse evento, você deve chamar `event.preventDefault()`.

No Windows, você tem que analisar `process.argv` (no processo principal) para obter o filepath.

### Evento: 'open-url' *macOS*

Retorna:

- `event` Event

- string `url`

Emitido quando o usuário deseja abrir um URL com a aplicação. Your application's `Info.plist` file must define the URL scheme within the `CFBundleURLTypes` key, and set `NSPrincipalClass` to `AtomApplication`.

As with the `open-file` event, be sure to register a listener for the `open-url` event early in your application startup to detect if the application is being opened to handle a URL. If you register the listener in response to a `ready` event, you'll miss URLs that trigger the launch of your application.

### Evento: 'activate' *macOS*

Retorna:

- `event` Event

- `hasVisibleWindows` boolean

Emitido quando a aplicação é ativada. Várias ações podem disparar esse evento, tais como iniciando o aplicativo pela primeira vez, a tentativa de re-iniciar o aplicativo quando ele já está sendo executado, ou clicando no ícone de barra de tarefas ou doca do aplicativo.

### Evento: 'did-become-active' *macOS*

Retorna:

- `event` Event

Emitted when the application becomes active. This differs from the `activate` event in that `did-become-active` is emitted every time the app becomes active, not only when Dock icon is clicked or application is re-launched. It is also emitted when a user switches to the app via the macOS App Switcher.

### Event: 'did-resign-active' *macOS*

Retorna:

- `event` Event

Emitted when the app is no longer active and doesn’t have focus. This can be triggered, for example, by clicking on another application or by using the macOS App Switcher to switch to another application.

### Event: 'continue-activity' *macOS*

Retorna:

- `event` Event

- `type` string - A string identifying the activity. Maps to [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType).

- `userInfo` unknown - Contains app-specific state stored by the activity on another device.

- Objeto `details`

  - `webpageURL` string (optional) - A string identifying the URL of the webpage accessed by the activity on another device, if available.

Emitted during [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) when an activity from a different device wants to be resumed. Você deve chamar `event.preventDefault()` caso queira manipular esse evento.

Uma atividade do usuário pode ser continuada apenas em uma aplicação que tem o mesmo Team ID do desenvolvedor como o aplicativo fonte da atividade e que suporta o tipo da atividade. Tipos de atividade suportadas são especificadas no `Info.plist` do aplicativo sob a chave `NSUserActivityTypes`.

### Event: 'will-continue-activity' *macOS*

Retorna:

- `event` Event

- `type` string - A string identifying the activity. Maps to [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType).

Emitted during [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) before an activity from a different device wants to be resumed. Você deve chamar `event.preventDefault()` caso queira manipular esse evento.

### Event: 'continue-activity-error' *macOS*

Retorna:

- `event` Event

- `type` string - A string identifying the activity. Maps to [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType).

- `error` string - A string with the error's localized description.

Emitted during [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) when an activity from a different device fails to be resumed.

### Event: 'activity-was-continued' *macOS*

Retorna:

- `event` Event

- `type` string - A string identifying the activity. Maps to [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType).

- `userInfo` unknown - Contains app-specific state stored by the activity.

Emitted during [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) after an activity from this device was successfully resumed on another one.

### Event: 'update-activity-state' *macOS*

Retorna:

- `event` Event

- `type` string - A string identifying the activity. Maps to [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType).

- `userInfo` unknown - Contains app-specific state stored by the activity.

Emitted when [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) is about to be resumed on another device. If you need to update the state to be transferred, you should call `event.preventDefault()` immediately, construct a new `userInfo` dictionary and call `app.updateCurrentActivity()` in a timely manner. Caso contrário, a operação irá falhar e `continue-activity-error` será chamado.

### Evento: 'new-window-for-tab' *macOS*

Retorna:

- `event` Event

Emitted when the user clicks the native macOS new tab button. The new tab button is only visible if the current `BrowserWindow` has a `tabbingIdentifier`.

You must create a window in this handler in order for macOS tabbing to work as expected.

### Evento: 'browser-window-blur'

Retorna:

- `event` Event

- `window` [BrowserWindow](/pt/docs/latest/api/browser-window)

Emitted when a [browserWindow](/pt/docs/latest/api/browser-window) gets blurred.

### Evento: 'browser-window-focus'

Retorna:

- `event` Event

- `window` [BrowserWindow](/pt/docs/latest/api/browser-window)

Emitted when a [browserWindow](/pt/docs/latest/api/browser-window) gets focused.

### Evento: 'browser-window-created'

Retorna:

- `event` Event

- `window` [BrowserWindow](/pt/docs/latest/api/browser-window)

Emitted when a new [browserWindow](/pt/docs/latest/api/browser-window) is created.

### Evento: 'web-contents-created'

Retorna:

- `event` Event

- `webContents` [WebContents](/pt/docs/latest/api/web-contents)

Emitted when a new [webContents](/pt/docs/latest/api/web-contents) is created.

### Evento: 'certificate-error'

Retorna:

- `event` Event

- `webContents` [WebContents](/pt/docs/latest/api/web-contents)

- string `url`

- `error` string - The error code

- `certificate` [Certificate](/pt/docs/latest/api/structures/certificate)

- `callback` Function

  - `isTrusted` boolean - Whether to consider the certificate as trusted

- `isMainFrame` boolean

Emitido quando a verificação do `certificate` para o `url` falha, para confiar no certificado você deve prevenir o comportamento padrão com `event.preventDefault()` e chamar `callback(true)`.

```javascript
const { app } = require('electron')  
  
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {  
  if (url === 'https://github.com') {  
    // Lógica de verificação.  
    event.preventDefault()  
    callback(true)  
  } else {  
    callback(false)  
  }  
})  

```

### Evento: 'select-client-certificate'

Retorna:

- `event` Event

- `webContents` [WebContents](/pt/docs/latest/api/web-contents)

- `url` URL

- `certificateList` [Certificate[]](/pt/docs/latest/api/structures/certificate)

- `callback` Function

  - `certificate` [Certificate](/pt/docs/latest/api/structures/certificate) (optional)

Emitido quando um certificado de cliente é solicitado.

O `url` corresponde à entrada de navegação solicitando o certificado do cliente e `callback` pode ser chamado com uma entrada filtrada da lista. Usar `event.preventDefault()` previne a aplicação de utilizar o primeiro certificado da store.

```javascript
const { app } = require('electron')  
  
app.on('select-client-certificate', (event, webContents, url, list, callback) => {  
  event.preventDefault()  
  callback(list[0])  
})  

```

### Evento: 'login'

Retorna:

- `event` Event

- `webContents` [WebContents](/pt/docs/latest/api/web-contents) (optional)

- `authenticationResponseDetails` Object

  - `url` URL

  - `pid` number

  - `isRequestForNavigation` boolean - Indicates whether the request is for a navigation.

  - `firstAuthAttempt` boolean - Indicates whether this is the first authentication attempt.

  - `responseHeaders` Record<string, string | string[]> (optional) - The headers returned in the response.

- Objeto `authInfo`

  - `isProxy` boolean

  - `scheme` string

  - `host` string

  - `port` Integer

  - `realm` string

- `callback` Function

  - `username` string (optional)

  - `password` string (optional)

Emitted when `webContents` or [Utility process](/pt/docs/latest/glossary#utility-process) wants to do basic auth.

O comportamento padrão é cancelar todas as autenticações. Para sobrescrever isso você deve prevenir o comportamento padrão com `event.preventDefault()` e chamar o `callback(username, password)` com as credenciais.

```javascript
const { app } = require('electron')  
  
app.on('login', (event, webContents, details, authInfo, callback) => {  
  event.preventDefault()  
  callback('username', 'secret')  
})  

```

If `callback` is called without a username or password, the authentication request will be cancelled and the authentication error will be returned to the page.

### Event: 'gpu-info-update'

Emitted whenever there is a GPU info update.

### Event: 'render-process-gone'

Retorna:

- `event` Event

- `webContents` [WebContents](/pt/docs/latest/api/web-contents)

- `details` [RenderProcessGoneDetails](/pt/docs/latest/api/structures/render-process-gone-details)

Emitted when the renderer process unexpectedly disappears.  This is normally because it was crashed or killed.

### Event: 'child-process-gone'

Retorna:

- `event` Event

- Objeto `details`

  - `type` string - Process type. Um dos seguintes valores:

    - `Utilidade`

    - `Zygote`

    - `Ajuda ao Sandbox`

    - `GPU`

    - `Pepper Plugin`

    - `Pepper Plugin Broker`

    - `Desconhecido`

  - `reason` string - The reason the child process is gone. Valores possíveis:

    - `clean-exit` - Process exited with an exit code of zero

    - `abnormal-exit` - Process exited with a non-zero exit code

    - `killed` - Process was sent a SIGTERM or otherwise killed externally

    - `crashed` - Process crashed

    - `oom` - Process ran out of memory

    - `launch-failed` - Process never successfully launched

    - `integrity-failure` - Windows code integrity checks failed

    - `memory-eviction` - Process proactively terminated to prevent a future out-of-memory (OOM) situation

  - `exitCode` number - The exit code for the process (e.g. status from waitpid if on POSIX, from GetExitCodeProcess on Windows).

  - `serviceName` string (optional) - The non-localized name of the process.

  - `name` string (optional) - The name of the process. Exemplos para utilidade: `Audio Service`, `Content Decryption Module Service`, `Network Service`, `Video Capture`, etc.

Emitted when the child process unexpectedly disappears. This is normally because it was crashed or killed. It does not include renderer processes.

### Event: 'accessibility-support-changed' no *macOS* e no *Windows*

Retorna:

- `event` Event

- `accessibilitySupportEnabled` boolean - `true` when Chromium's accessibility support is enabled, `false` otherwise.

Emitted when Chromium's accessibility support changes. Este evento é acionado quando a tecnologias assistivas, tais como leitores de tela, estão habilitadas ou desabilitadas. Veja [https://www.chromium.org/developers/design-documents/accessibility](https://www.chromium.org/developers/design-documents/accessibility) para mais detalhes.

### Evento: 'session-created'

Retorna:

- `session` [Session](/pt/docs/latest/api/session)

Emitido quando Electron criar uma nova `session`.

```javascript
const { app } = require('electron')  
  
app.on('session-created', (session) => {  
  console.log(session)  
})  

```

### Evento: 'second-instance'

Retorna:

- `event` Event

- `argv` string[] - Um array dos argumentos da linha de comando da segunda instância

- `workingDirectory` string - O diretório de trabalho da segunda instância

- `additionalData` unknown - A JSON object of additional data passed from the second instance

This event will be emitted inside the primary instance of your application when a second instance has been executed and calls `app.requestSingleInstanceLock()`.

`argv` is an Array of the second instance's command line arguments, and `workingDirectory` is its current working directory. Geralmente, aplicativos reagem a isso tornando a janela principal deles visível e em primeiro plano.

> [!NOTE]
> 

> note

> 

`argv` will not be exactly the same list of arguments as those passed to the second instance. The order might change and additional arguments might be appended. If you need to maintain the exact same arguments, it's advised to use `additionalData` instead.

> 

[!NOTE] If the second instance is started by a different user than the first, the `argv` array will not include the arguments.

Esse evento é garantido que será emitido após o evento `ready` do objeto `app` ser emitido.

> 

[!NOTE] Extra command line arguments might be added by Chromium, such as `--original-process-start-time`.

## Métodos

O objeto `app` tem os seguintes métodos:

> 

[!NOTE] Some methods are only available on specific operating systems and are labeled as such.

### `app.quit()`

Tenta fechar todas as janelas. O evento `before-quit` será emitido primeiro. Se todas as janelas forem fechadas com sucesso, o evento `will-quit` será emitido e por padrão, e o aplicativo será encerrado.

Este método garante que todos os manipuladores de vento `beforeunload` e `unload` seja executados corretamente. É possível que a janela cancele, retornando `false` no manipulador de eventos `beforeunload`.

### `app.exit([exitCode])`

- `exitCode` Integer (opcional)

Exits immediately with `exitCode`. `exitCode` defaults to 0.

All windows will be closed immediately without asking the user, and the `before-quit` and `will-quit` events will not be emitted.

### `app.relaunch([options])`

- Objeto `options` (opcional)

  - `args` string[] (opcional)

  - `execPath` string (opcional)

Relaunches the app when the current instance exits.

By default, the new instance will use the same working directory and command line arguments as the current instance. When `args` is specified, the `args` will be passed as the command line arguments instead. When `execPath` is specified, the `execPath` will be executed for the relaunch instead of the current app.

Note that this method does not quit the app when executed. You have to call `app.quit` or `app.exit` after calling `app.relaunch` to make the app restart.

When `app.relaunch` is called multiple times, multiple instances will be started after the current instance exits.

An example of restarting the current instance immediately and adding a new command line argument to the new instance:

```javascript
const { app } = require('electron')  
  
app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })  
app.exit(0)  

```

### `app.isReady()`

Retorna `boolean` - `true` se o Electron tiver inicializado, `false` caso contrário. See also `app.whenReady()`.

### `app.whenReady()`

Retorna `Promise<void>` - cumprido quando o Electron é inicializado. Pode ser usado como uma alternativa conveniente para a verificação `app.isReady()` e subscrever o evento `ready` se a aplicação ainda não estiver pronta.

### `app.focus([options])`

- Objeto `options` (opcional)

  - `steal` boolean *macOS* - Make the receiver the active app even if another app is currently active.

On macOS, makes the application the active app. On Windows, focuses on the application's first window. On Linux, either focuses on the first visible window (X11) or requests focus but may instead show a notification or flash the app icon (Wayland).

You should seek to use the `steal` option as sparingly as possible.

### `app.isActive()` no *macOS*

Returns `boolean` - `true` if the application is active (i.e. focused).

### `app.hide()` no *macOS*

Oculta todas as janelas do aplicativo sem minimizar-las.

### `app.isHidden()` *macOS*

Returns `boolean` - `true` if the application—including all of its windows—is hidden (e.g. with `Command-H`), `false` otherwise.

### `app.show()` no *macOS*

Shows application windows after they were hidden. Does not automatically focus them.

### `app.setAppLogsPath([path])`

- `path` string (optional) - A custom path for your logs. Must be absolute.

Sets or creates a directory your app's logs which can then be manipulated with `app.getPath()` or `app.setPath(pathName, newPath)`.

Calling `app.setAppLogsPath()` without a `path` parameter will result in this directory being set to `~/Library/Logs/YourAppName` on *macOS*, and inside the `userData` directory on *Linux* and *Windows*.

### `app.getAppPath()`

Retorna `string` - O diretório da aplicação atual.

### `app.getPath(name)`

- `name` string - You can request the following paths by the name:

  - `home` Diretório central do usuário.

  - `appData` Per-user application data directory, which by default points to:

    - `%APPDATA%` no Windows

    - `$XDG_CONFIG_HOME` ou `~/.config` no Linux

    - `~/Library/Application Support` no macOS

  - `assets` The directory where app assets such as `resources.pak` are stored. By default this is the same as the folder containing the `exe` path. Available on Windows and Linux only.

  - `userData` The directory for storing your app's configuration files, which by default is the `appData` directory appended with your app's name. By convention files storing user data should be written to this directory, and it is not recommended to write large files here because some environments may backup this directory to cloud storage. It is recommended to store app-specific files within a subdirectory of `userData` (e.g., `path.join(app.getPath('userData'), 'my-app-data')`) rather than directly in `userData` itself, to avoid naming conflicts with Chromium's own subdirectories (such as `Cache`, `GPUCache`, and `Local Storage`).

  - `sessionData` The directory for storing data generated by `Session`, such as localStorage, cookies, disk cache, downloaded dictionaries, network state, DevTools files. By default this points to `userData`. Chromium may write very large disk cache here, so if your app does not rely on browser storage like localStorage or cookies to save user data, it is recommended to set this directory to other locations to avoid polluting the `userData` directory.

  - `temp` Diretório temporário.

  - `exe` O arquivo executável atual.

  - `module` The location of the Chromium module. By default this is synonymous with `exe`.

  - `desktop` O diretório da Área de Trabalho do usuário atual.

  - `documents` Diretório dos "Meus Documentos" de um usuário.

  - `downloads` Diretório dos Downloads de um usuário.

  - `music` Diretório para a música de um usuário.

  - `pictures` Diretório para as imagens de um usuário.

  - `videos` Diretório para os vídeos de um usuário.

  - `recent` Directory for the user's recent files (Windows only).

  - `logs` Diretório que armazena os logs da aplicação.

  - `crashDumps` Directory where crash dumps are stored.

Returns `string` - A path to a special directory or file associated with `name`. On failure, an `Error` is thrown.

If `app.getPath('logs')` is called without calling `app.setAppLogsPath()` being called first, a default log directory will be created equivalent to calling `app.setAppLogsPath()` without a `path` parameter.

### `app.getFileIcon(path[, options])`

- `path` string

- Objeto `options` (opcional)

  - `size` string

    - `small` - 16x16

    - `normal` - 32x32

    - `large` - 48x48 no *Linux*, 32x32 no *Windows*, não suportado no *macOS*.

Returns `Promise<NativeImage>` - fulfilled with the app's icon, which is a [NativeImage](/pt/docs/latest/api/native-image).

Obtém o ícone associado a um caminho.

On *Windows*, there are 2 kinds of icons:

- Ícones associados a certas extensões de arquivo, como `.mp3`, `.png`, etc.

- Ícones contidos no próprio arquivo, como `.exe`, `.dll`, `.ico`.

On *Linux* and *macOS*, icons depend on the application associated with file mime type.

### `app.setPath(name, path)`

- `name` string

- `path` string

Muda o `path` à um diretório especial ou arquivo relacionado ao `name`. If the path specifies a directory that does not exist, an `Error` is thrown. In that case, the directory should be created with `fs.mkdirSync` or similar.

Você pode modificar apenas caminhos de um `name` definidos no `app.getPath`.

Por padrão, cachês e cookies de páginas web serão guardados dentro do diretório `sessionData`. Se você quer mudar esse local, você deve modificar o caminho `sessionData` antes que o evento `ready` do `app` seja emitido.

### `app.getVersion()`

Retorna `string` - A versão da aplicação carregada. Se nenhuma versão é encontrada no `package.json` da aplicação, a versão do conjunto atual ou executável será retornada.

### `app.getName()`

Retorna `string` - O atual nome da aplicação, que é o nome da aplicação no arquivo `package.json`.

Usually the `name` field of `package.json` is a short lowercase name, according to the npm modules spec. Você normalmente deve especificar um campo `productName`, que é o nome completo da aplicação contendo letras maiúsculas e minúsculas e qual será preferido por `name` pelo Electron.

### `app.setName(name)`

- `name` string

Sobrescreve o atual nome da aplicação.

> 

[!NOTE] This function overrides the name used internally by Electron; it does not affect the name that the OS uses.

### `app.setDesktopName(name)` *Linux*

- `name` string - The `.desktop` filename (e.g. `'my-app.desktop'`).

Sets the [`.desktop` filename](https://specifications.freedesktop.org/desktop-entry/latest/file-naming.html) on Linux. This should match the base filename of the app's installed `.desktop` file. The `.desktop` suffix is optional.

This value is used to determine the default XDG application ID on Wayland and `WM_CLASS` on X11. If it is not set, Electron will attempt to infer a name, but it may not match the packaged app's actual `.desktop` file. This could result in the app showing a generic icon or failing to respond to global keyboard shortcuts.

This API must be called before the `ready` event. The value can also be set using `desktopName` in `package.json`.

### `app.getLocale()`

Returns `string` - The current application locale, fetched using Chromium's `l10n_util` library. Possible return values are documented [here](https://source.chromium.org/chromium/chromium/src/+/main:ui/base/l10n/l10n_util.cc).

To set the locale, you'll want to use a command line switch at app startup, which may be found [here](/pt/docs/latest/api/command-line-switches).

> 

[!NOTE] When distributing your packaged app, you have to also ship the `locales` folder.

> 

[!NOTE] This API must be called after the `ready` event is emitted.

> 

[!NOTE] To see example return values of this API compared to other locale and language APIs, see [`app.getPreferredSystemLanguages()`](#appgetpreferredsystemlanguages).

### `app.getLocaleCountryCode()`

Returns `string` - User operating system's locale two-letter [ISO 3166](https://www.iso.org/iso-3166-country-codes.html) country code. The value is taken from native OS APIs.

> 

[!NOTE] When unable to detect locale country code, it returns empty string.

### `app.getSystemLocale()`

Returns `string` - The current system locale. On Windows and Linux, it is fetched using Chromium's `i18n` library. On macOS, `[NSLocale currentLocale]` is used instead. To get the user's current system language, which is not always the same as the locale, it is better to use [`app.getPreferredSystemLanguages()`](#appgetpreferredsystemlanguages).

Different operating systems also use the regional data differently:

- Windows 11 uses the regional format for numbers, dates, and times.

- macOS Monterey uses the region for formatting numbers, dates, times, and for selecting the currency symbol to use.

Therefore, this API can be used for purposes such as choosing a format for rendering dates and times in a calendar app, especially when the developer wants the format to be consistent with the OS.

> 

[!NOTE] This API must be called after the `ready` event is emitted.

> 

[!NOTE] To see example return values of this API compared to other locale and language APIs, see [`app.getPreferredSystemLanguages()`](#appgetpreferredsystemlanguages).

### `app.getPreferredSystemLanguages()`

Returns `string[]` - The user's preferred system languages from most preferred to least preferred, including the country codes if applicable. A user can modify and add to this list on Windows or macOS through the Language and Region settings.

The API uses `GlobalizationPreferences` (with a fallback to `GetSystemPreferredUILanguages`) on Windows, `\[NSLocale preferredLanguages\]` on macOS, and `g_get_language_names` on Linux.

This API can be used for purposes such as deciding what language to present the application in.

Here are some examples of return values of the various language and locale APIs with different configurations:

On Windows, given application locale is German, the regional format is Finnish (Finland), and the preferred system languages from most to least preferred are French (Canada), English (US), Simplified Chinese (China), Finnish, and Spanish (Latin America):

```javascript
app.getLocale() // 'de'  
app.getSystemLocale() // 'fi-FI'  
app.getPreferredSystemLanguages() // ['fr-CA', 'en-US', 'zh-Hans-CN', 'fi', 'es-419']  

```

On macOS, given the application locale is German, the region is Finland, and the preferred system languages from most to least preferred are French (Canada), English (US), Simplified Chinese, and Spanish (Latin America):

```javascript
app.getLocale() // 'de'  
app.getSystemLocale() // 'fr-FI'  
app.getPreferredSystemLanguages() // ['fr-CA', 'en-US', 'zh-Hans-FI', 'es-419']  

```

Both the available languages and regions and the possible return values differ between the two operating systems.

As can be seen with the example above, on Windows, it is possible that a preferred system language has no country code, and that one of the preferred system languages corresponds with the language used for the regional format. On macOS, the region serves more as a default country code: the user doesn't need to have Finnish as a preferred language to use Finland as the region, and the country code `FI` is used as the country code for preferred system languages that do not have associated countries in the language name.

### `app.addRecentDocument(path)` *macOS* *Windows*

- `path` string

Adiciona o parâmetro `path` à lista de documentos recentes.

This list is managed by the OS. On Windows, you can visit the list from the task bar, and on macOS, you can visit it from dock menu.

### `app.clearRecentDocuments()` *macOS* *Windows*

Limpa a lista de documentos recentes.

### `app.getRecentDocuments()` *macOS* *Windows*

Returns `string[]` - An array containing documents in the most recent documents list.

```javascript
const { app } = require('electron')  
  
const path = require('node:path')  
  
const file = path.join(app.getPath('desktop'), 'foo.txt')  
app.addRecentDocument(file)  
  
const recents = app.getRecentDocuments()  
console.log(recents) // ['/path/to/desktop/foo.txt'}  

```

### `app.setAsDefaultProtocolClient(protocol[, path, args])`

- `protocol` string - O nome do protocolo sem `://`. For example, if you want your app to handle `electron://` links, call this method with `electron` as the parameter.

- `path` string (optional) *Windows* - The path to the Electron executable. O padrão é `process.execPath`

- `args` string[] (optional) *Windows* - Arguments passed to the executable. Defaults to an empty array

Retorna `boolean` - Se a chamada foi realizada com sucesso.

Sets the current executable as the default handler for a protocol (aka URI scheme). It allows you to integrate your app deeper into the operating system. Once registered, all links with `your-protocol://` will be opened with the current executable. The whole link, including protocol, will be passed to your application as a parameter.

> 

[!NOTE] On macOS, you can only register protocols that have been added to your app's `info.plist`, which cannot be modified at runtime. However, you can change the file during build time via [Electron Forge](https://www.electronforge.io/), [Electron Packager](https://github.com/electron/packager), or by editing `info.plist` with a text editor. Please refer to [Apple's documentation](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/TP40009249-102207-TPXREF115) for details.

> 

[!NOTE] In a Windows Store environment (when packaged as an `appx`) this API will return `true` for all calls but the registry key it sets won't be accessible by other applications.  In order to register your Windows Store application as a default protocol handler you must [declare the protocol in your manifest](https://learn.microsoft.com/en-us/uwp/schemas/appxpackage/uapmanifestschema/element-uap-protocol).

The API uses the Windows Registry and `LSSetDefaultHandlerForURLScheme` internally.

### `app.removeAsDefaultProtocolClient(protocol[, path, args])` *macOS* *Windows*

- `protocol` string - O nome do protocolo sem `://`.

- `path` string (opcional) *Windows* - O padrão é `process.execPath`

- `args` string[] (opcional) *Windows* - O padrão é um array vazio

Retorna `boolean` - Se a chamada foi realizada com sucesso.

This method checks if the current executable as the default handler for a protocol (aka URI scheme). If so, it will remove the app as the default handler.

### `app.isDefaultProtocolClient(protocol[, path, args])`

- `protocol` string - O nome do protocolo sem `://`.

- `path` string (opcional) *Windows* - O padrão é `process.execPath`

- `args` string[] (opcional) *Windows* - O padrão é um array vazio

Returns `boolean` - Whether the current executable is the default handler for a protocol (aka URI scheme).

> 

[!NOTE] On macOS, you can use this method to check if the app has been registered as the default protocol handler for a protocol. You can also verify this by checking `~/Library/Preferences/com.apple.LaunchServices.plist` on the macOS machine. Please refer to [Apple's documentation](https://developer.apple.com/documentation/coreservices/1441725-lscopydefaulthandlerforurlscheme?language=objc) for details.

The API uses the Windows Registry and `LSCopyDefaultHandlerForURLScheme` internally.

### `app.getApplicationNameForProtocol(url)`

- `url` string - a URL with the protocol name to check. Unlike the other methods in this family, this accepts an entire URL, including `://` at a minimum (e.g. `https://`).

Returns `string` - Name of the application handling the protocol, or an empty string if there is no handler. For instance, if Electron is the default handler of the URL, this could be `Electron` on Windows and Mac. However, don't rely on the precise format which is not guaranteed to remain unchanged. Expect a different format on Linux, possibly with a `.desktop` suffix.

This method returns the application name of the default handler for the protocol (aka URI scheme) of a URL.

### `app.getApplicationInfoForProtocol(url)`

- `url` string - a URL with the protocol name to check. Unlike the other methods in this family, this accepts an entire URL, including `://` at a minimum (e.g. `https://`).

Returns `Promise<Object>` - Resolve with an object containing the following:

- `icon` NativeImage - the display icon of the app handling the protocol.

- `path` string  - installation path of the app handling the protocol.

- `name` string - display name of the app handling the protocol.

This method returns a promise that contains the application name, icon and path of the default handler for the protocol (aka URI scheme) of a URL.

### `app.setUserTasks(tasks)` *Windows*

- `tasks` [Task[]](/pt/docs/latest/api/structures/task) - Array of `Task` objects

Adds `tasks` to the [Tasks](https://learn.microsoft.com/en-us/windows/win32/shell/taskbar-extensions#tasks) category of the Jump List on Windows.

`tasks` is an array of [Task](/pt/docs/latest/api/structures/task) objects.

Retorna `boolean` - Se a chamada foi realizada com sucesso.

> 

[!NOTE] If you'd like to customize the Jump List even more use `app.setJumpList(categories)` instead.

### `app.getJumpListSettings()` *Windows*

Retorna `Object`:

- `minItems` Integer - The minimum number of items that will be shown in the Jump List (for a more detailed description of this value see the [MSDN docs](https://learn.microsoft.com/en-us/windows/win32/api/shobjidl_core/nf-shobjidl_core-icustomdestinationlist-beginlist)).

- `removedItems` [JumpListItem[]](/pt/docs/latest/api/structures/jump-list-item) - Array of `JumpListItem` objects that correspond to items that the user has explicitly removed from custom categories in the Jump List. Estes itens não devem ser adicionados novamente à Jump List na **próxima** chamada a `app.setJumpList()`. O Windows não irá mostrar nenhuma categoria personalizada que tiver qualquer um dos itens removidos.

### `app.setJumpList(categories)` *Windows*

- `categories` [JumpListCategory[]](/pt/docs/latest/api/structures/jump-list-category) | `null` - Array of `JumpListCategory` objects.

Returns `string`

Define ou remove uma Jump List personalizada para a aplicação e retorna uma das seguintes strings:

- `ok` - Nada deu errado.

- `error` - Um ou mais erros ocorreram. Ative a geração de logs em tempo de execução para descobrir a causa provável.

- `invalidSeparatorError` - An attempt was made to add a separator to a custom category in the Jump List. Separators are only allowed in the standard `Tasks` category.

- `fileTypeRegistrationError` - Foi realizada uma tentativa de adicionar à Jump List um link de arquivo cujo tipo de arquivo não foi registrado para ser manipulado pela aplicação.

- `customCategoryAccessDeniedError` - Categorias personalizadas não podem ser adicionadas à Jump List devido a restrições de privacidade do usuário ou de políticas de grupo.

Se `categories` for `null`, a Jump List personalizada anteriormente definida (se houver) será substituída por uma Jump List padrão para o app (gerenciada pelo Windows).

> 

[!NOTE] If a `JumpListCategory` object has neither the `type` nor the `name` property set then its `type` is assumed to be `tasks`. If the `name` property is set but the `type` property is omitted then the `type` is assumed to be `custom`.

> 

[!NOTE] Users can remove items from custom categories, and Windows will not allow a removed item to be added back into a custom category until **after** the next successful call to `app.setJumpList(categories)`. Any attempt to re-add a removed item to a custom category earlier than that will result in the entire custom category being omitted from the Jump List. The list of removed items can be obtained using `app.getJumpListSettings()`.

> 

[!NOTE] The maximum length of a Jump List item's `description` property is 260 characters. Beyond this limit, the item will not be added to the Jump List, nor will it be displayed.

Aqui vai um exemplo muito simples de como criar uma Jump List personalizada:

```javascript
const { app } = require('electron')  
  
app.setJumpList([  
  {  
    type: 'custom',  
    name: 'Recent Projects',  
    items: [  
      { type: 'file', path: 'C:\\Projects\\project1.proj' },  
      { type: 'file', path: 'C:\\Projects\\project2.proj' }  
    ]  
  },  
  { // has a name so `type` is assumed to be "custom"  
    name: 'Tools',  
    items: [  
      {  
        type: 'task',  
        title: 'Tool A',  
        program: process.execPath,  
        args: '--run-tool-a',  
        iconPath: process.execPath,  
        iconIndex: 0,  
        description: 'Runs Tool A'  
      },  
      {  
        type: 'task',  
        title: 'Tool B',  
        program: process.execPath,  
        args: '--run-tool-b',  
        iconPath: process.execPath,  
        iconIndex: 0,  
        description: 'Runs Tool B'  
      }  
    ]  
  },  
  { type: 'frequent' },  
  { // has no name and no type so `type` is assumed to be "tasks"  
    items: [  
      {  
        type: 'task',  
        title: 'New Project',  
        program: process.execPath,  
        args: '--new-project',  
        description: 'Create a new project.'  
      },  
      { type: 'separator' },  
      {  
        type: 'task',  
        title: 'Recover Project',  
        program: process.execPath,  
        args: '--recover-project',  
        description: 'Recover Project'  
      }  
    ]  
  }  
])  

```

### `app.requestSingleInstanceLock([additionalData])`

- `additionalData` Record<any, any> (optional) - A JSON object containing additional data to send to the first instance.

Retorna `boolean`

The return value of this method indicates whether or not this instance of your application successfully obtained the lock.  If it failed to obtain the lock, you can assume that another instance of your application is already running with the lock and exit immediately.

I.e. This method returns `true` if your process is the primary instance of your application and your app should continue loading.  It returns `false` if your process should immediately quit as it has sent its parameters to another instance that has already acquired the lock.

On macOS, the system enforces single instance automatically when users try to open a second instance of your app in Finder, and the `open-file` and `open-url` events will be emitted for that. However when users start your app in command line, the system's single instance mechanism will be bypassed, and you have to use this method to ensure single instance.

Aqui vai um exemplo de como ativar a janela da instância principal quando uma segunda instância for iniciada:

```javascript
const { app, BrowserWindow } = require('electron')  
  
let myWindow = null  
  
const additionalData = { myKey: 'myValue' }  
const gotTheLock = app.requestSingleInstanceLock(additionalData)  
  
if (!gotTheLock) {  
  app.quit()  
} else {  
  app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {  
    // Print out data received from the second instance.  
    console.log(additionalData)  
  
    // Someone tried to run a second instance, we should focus our window.  
    if (myWindow) {  
      if (myWindow.isMinimized()) myWindow.restore()  
      myWindow.focus()  
    }  
  })  
  
  app.whenReady().then(() => {  
    myWindow = new BrowserWindow({})  
    myWindow.loadURL('https://electronjs.org')  
  })  
}  

```

### `app.hasSingleInstanceLock()`

Retorna `boolean`

This method returns whether or not this instance of your app is currently holding the single instance lock.  You can request the lock with `app.requestSingleInstanceLock()` and release with `app.releaseSingleInstanceLock()`

### `app.releaseSingleInstanceLock()`

Releases all locks that were created by `requestSingleInstanceLock`. This will allow multiple instances of the application to once again run side by side.

### `app.setUserActivity(type, userInfo[, webpageURL])` *macOS*

- `type` string - Identificação única da atividade. Maps to [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType).

- `userInfo` any - App-specific state to store for use by another device.

- `webpageURL` string (optional) - The webpage to load in a browser if no suitable app is installed on the resuming device. The scheme must be `http` or `https`.

Cria um `NSUserActivity` e o define como a atividade atual. The activity is eligible for [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) to another device afterward.

### `app.getCurrentActivityType()` *macOS*

Retorna `string` - O tipo da atividade atualmente em execução.

### `app.invalidateCurrentActivity()` *macOS*

Invalidates the current [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) user activity.

### `app.resignCurrentActivity()` *macOS*

Marks the current [Handoff](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html) user activity as inactive without invalidating it.

### `app.updateCurrentActivity(type, userInfo)` *macOS*

- `type` string - Identificação única da atividade. Maps to [`NSUserActivity.activityType`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType).

- `userInfo` any - App-specific state to store for use by another device.

Atualiza a atividade atual se seu tipo corresponder a `type`, mesclando as entradas de `userInfo` ao seu dicionário `userInfo` atual.

### `app.setAppUserModelId(id)` *Windows*

- `id` string

Changes the [Application User Model ID](https://learn.microsoft.com/en-us/windows/win32/shell/appids) to `id`.

### `app.setToastActivatorCLSID(id)` *Windows*

- `id` string

Changes the [Toast Activator CLSID](https://learn.microsoft.com/en-us/windows/win32/properties/props-system-appusermodel-toastactivatorclsid) to `id`. If one is not set via this method, it will be randomly generated for the app.

- The value must be a valid GUID/CLSID in one of the following forms:

  - Canonical brace-wrapped: `{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}` (preferred)

  - Canonical without braces: `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` (braces will be added automatically)

- Hex digits are case-insensitive.

This method should be called early (before showing notifications) so the value is baked into the registration/shortcut. Supplying an empty string or an unparsable value throws and leaves the existing (or generated) CLSID unchanged. If this method is never called, a random CLSID is generated once per run and exposed via `app.toastActivatorCLSID`.

### `app.setActivationPolicy(policy)` *macOS*

- `policy` string - Can be 'regular', 'accessory', or 'prohibited'.

Sets the activation policy for a given app.

Activation policy types:

- 'regular' - The application is an ordinary app that appears in the Dock and may have a user interface.

- 'accessory' - The application doesn’t appear in the Dock and doesn’t have a menu bar, but it may be activated programmatically or by clicking on one of its windows.

- 'prohibited' - The application doesn’t appear in the Dock and may not create windows or be activated.

### `app.importCertificate(options, callback)` *Linux*

- `options` Object

  - `certificate` string - Caminho para o arquivo pkcs12.

  - `password` string - Passphrase do certificado.

- `callback` Function

  - `result` Integer - Resultado da importação.

Importa o certificado em formato pkcs12 ao armazenamento de certificados da plataforma. `callback` is called with the `result` of import operation, a value of `0` indicates success while any other value indicates failure according to Chromium [net_error_list](https://source.chromium.org/chromium/chromium/src/+/main:net/base/net_error_list.h).

### `app.configureHostResolver(options)`

- `options` Object

  - `enableBuiltInResolver` boolean (optional) - Whether the built-in host resolver is used in preference to getaddrinfo. When enabled, the built-in resolver will attempt to use the system's DNS settings to do DNS lookups itself. Enabled by default on macOS, disabled by default on Windows and Linux.

  - `enableHappyEyeballs` boolean (optional) - Whether the [Happy Eyeballs V3](https://datatracker.ietf.org/doc/draft-pauly-happy-happyeyeballs-v3/) algorithm should be used in creating network connections. When enabled, hostnames resolving to multiple IP addresses will be attempted in parallel to have a chance at establishing a connection more quickly.

  - `secureDnsMode` string (optional) - Can be 'off', 'automatic' or 'secure'. Configures the DNS-over-HTTP mode. When 'off', no DoH lookups will be performed. When 'automatic', DoH lookups will be performed first if DoH is available, and insecure DNS lookups will be performed as a fallback. When 'secure', only DoH lookups will be performed. Defaults to 'automatic'.

  - `secureDnsServers` string[] (optional) - A list of DNS-over-HTTP server templates. See [RFC8484 § 3](https://datatracker.ietf.org/doc/html/rfc8484#section-3) for details on the template format. Most servers support the POST method; the template for such servers is simply a URI. Note that for [some DNS providers](https://source.chromium.org/chromium/chromium/src/+/main:net/dns/public/doh_provider_entry.cc;l=31?q=%22DohProviderEntry::GetList()%22&ss=chromium%2Fchromium%2Fsrc), the resolver will automatically upgrade to DoH unless DoH is explicitly disabled, even if there are no DoH servers provided in this list.

  - `enableAdditionalDnsQueryTypes` boolean (optional) - Controls whether additional DNS query types, e.g. HTTPS (DNS type 65) will be allowed besides the traditional A and AAAA queries when a request is being made via insecure DNS. Has no effect on Secure DNS which always allows additional types. Defaults to true.

Configures host resolution (DNS and DNS-over-HTTPS). By default, the following resolvers will be used, in order:

1. DNS-over-HTTPS, if the [DNS provider supports it](https://source.chromium.org/chromium/chromium/src/+/main:net/dns/public/doh_provider_entry.cc;l=31?q=%22DohProviderEntry::GetList()%22&ss=chromium%2Fchromium%2Fsrc), then

2. the built-in resolver (enabled on macOS only by default), then

3. the system's resolver (e.g. `getaddrinfo`).

This can be configured to either restrict usage of non-encrypted DNS (`secureDnsMode: "secure"`), or disable DNS-over-HTTPS (`secureDnsMode: "off"`). It is also possible to enable or disable the built-in resolver.

To disable insecure DNS, you can specify a `secureDnsMode` of `"secure"`. If you do so, you should make sure to provide a list of DNS-over-HTTPS servers to use, in case the user's DNS configuration does not include a provider that supports DoH.

```javascript
const { app } = require('electron')  
  
app.whenReady().then(() => {  
  app.configureHostResolver({  
    secureDnsMode: 'secure',  
    secureDnsServers: [  
      'https://cloudflare-dns.com/dns-query'  
    ]  
  })  
})  

```

This API must be called after the `ready` event is emitted.

### `app.configureWebAuthn(options)` *macOS*

- `options` Object

  - `touchID` Object (optional) - Enables the Touch ID / Secure Enclave platform authenticator for [Web Authentication](https://www.w3.org/TR/webauthn-2/) requests.

    - `keychainAccessGroup` string - The keychain access group that WebAuthn credentials will be stored under. This value **must** also be present in your app's `keychain-access-groups` code-signing entitlement, and is typically of the form `<TEAM_ID>.<BUNDLE_ID>.webauthn`.

    - `promptReason` string (optional) - Customizes the reason text shown in the macOS Touch ID prompt. macOS renders the prompt as `"<App Name>" is trying to <promptReason>`, so the value should be a lowercase sentence fragment. An optional `$1` placeholder is replaced with the relying party ID (e.g. `example.com`) of the request being authenticated. O padrão é `verify your identity on $1`.

Configures platform authenticators for the Web Authentication API (`navigator.credentials.create()` / `navigator.credentials.get()`). Until this is called, `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` resolves to `false` and platform-authenticator requests are not serviced.

When `touchID` is provided, WebAuthn credentials are stored in the macOS keychain and bound to this device's Secure Enclave. Electron automatically generates and persists a per-[`session`](/pt/docs/latest/api/session) metadata secret so that credentials created in one partition are not visible to another.

```javascript
const { app } = require('electron')  
  
app.configureWebAuthn({  
  touchID: {  
    keychainAccessGroup: 'A1B2C3D4E5.com.example.app.webauthn',  
    promptReason: 'sign in to $1'  
  }  
})  

```

With the matching entitlement in your app's `entitlements.plist`:

```javascript
<key>keychain-access-groups</key>  
<array>  
  <string>A1B2C3D4E5.com.example.app.webauthn</string>  
</array>  

```

> 

[!NOTE] Touch ID WebAuthn credentials are device-bound and are not synced via iCloud Keychain. They are only available on Macs with a Secure Enclave (Apple silicon, or Intel Macs with a T2 chip).

### `app.disableHardwareAcceleration()`

Desativa a aceleração de hardware para o aplicativo atual.

Este método somente pode ser chamado antes do aplicativo estiver pronto.

### `app.isHardwareAccelerationEnabled()`

Returns `boolean` - whether hardware acceleration is currently enabled.

> 

[!NOTE] This information is only usable after the `gpu-info-update` event is emitted.

### `app.disableDomainBlockingFor3DAPIs()`

By default, Chromium disables 3D APIs (e.g. WebGL) until restart on a per domain basis if the GPU process crashes too frequently. This function disables that behavior.

Este método somente pode ser chamado antes do aplicativo estiver pronto.

### `app.getAppMetrics()`

Returns [ProcessMetric[]](/pt/docs/latest/api/structures/process-metric): Array of `ProcessMetric` objects that correspond to memory and CPU usage statistics of all the processes associated with the app.

### `app.getGPUFeatureStatus()`

Returns [GPUFeatureStatus](/pt/docs/latest/api/structures/gpu-feature-status) - The Graphics Feature Status from `chrome://gpu/`.

> 

[!NOTE] This information is only usable after the `gpu-info-update` event is emitted.

### `app.getGPUInfo(infoType)`

- `infoType` string - Pode ser `basic` ou `complete`.

Retorna `Promise<unknown>`

For `infoType` equal to `complete`: Promise is fulfilled with `Object` containing all the GPU Information as in [chromium's GPUInfo object](https://chromium.googlesource.com/chromium/src/+/4178e190e9da409b055e5dff469911ec6f6b716f/gpu/config/gpu_info.cc). This includes the version and driver information that's shown on `chrome://gpu` page.

For `infoType` equal to `basic`: Promise is fulfilled with `Object` containing fewer attributes than when requested with `complete`. Here's an example of basic response:

```javascript
{  
  auxAttributes:  
   {  
     amdSwitchable: true,  
     canSupportThreadedTextureMailbox: false,  
     directComposition: false,  
     directRendering: true,  
     glResetNotificationStrategy: 0,  
     inProcessGpu: true,  
     initializationTime: 0,  
     jpegDecodeAcceleratorSupported: false,  
     optimus: false,  
     passthroughCmdDecoder: false,  
     sandboxed: false,  
     softwareRendering: false,  
     supportsOverlays: false,  
     videoDecodeAcceleratorFlags: 0  
   },  
  gpuDevice:  
   [{ active: true, deviceId: 26657, vendorId: 4098 },  
     { active: false, deviceId: 3366, vendorId: 32902 }],  
  machineModelName: 'MacBookPro',  
  machineModelVersion: '11.5'  
}  

```

Using `basic` should be preferred if only basic information like `vendorId` or `deviceId` is needed.

Promise is rejected if the GPU is completely disabled, i.e. no hardware and software implementations are available.

### `app.setBadgeCount([count])` *Linux* *macOS*

- `count` Integer (optional) - If a value is provided, set the badge to the provided value otherwise, on macOS, display a plain white dot (e.g. unknown number of notifications). On Linux, if a value is not provided the badge will not display.

Retorna `boolean` - Se a chamada foi realizada com sucesso.

Sets the counter badge for current app. Setting the count to `0` will hide the badge.

On macOS, it shows on the dock icon. On Linux, it only works for Unity launcher.

> 

[!NOTE] Unity launcher requires a `.desktop` file to work. For more information, please read the [Unity integration documentation](https://help.ubuntu.com/community/UnityLaunchersAndDesktopFiles#Adding_shortcuts_to_a_launcher).

> 

[!NOTE] On macOS, you need to ensure that your application has the permission to display notifications for this method to work.

### `app.getBadgeCount()` *Linux* *macOS*

Retorna `Integer` - O valor sendo atualmente mostrado no selo contador.

### `app.isUnityRunning()` *Linux*

Retorna `boolean` - Indica se o ambiente de trabalho atual é o Unity ou não.

### `app.getLoginItemSettings([options])` *macOS* *Windows*

- Objeto `options` (opcional)

  - `type` string (optional) *macOS* - Can be `mainAppService`, `agentService`, `daemonService`, or `loginItemService`. O padrão é `mainAppService`. Only available on macOS 13 and up. See [app.setLoginItemSettings](/pt/docs/latest/api/app#appsetloginitemsettingssettings-macos-windows) for more information about each type.

  - `serviceName` string (optional) *macOS* - The name of the service. Required if `type` is non-default. Only available on macOS 13 and up.

  - `path` string (optional) *Windows* - The executable path to compare against. O padrão é `process.execPath`.

  - `args` string[] (optional) *Windows* - The command-line arguments to compare against. Defaults to an empty array.

If you provided `path` and `args` options to `app.setLoginItemSettings`, then you need to pass the same arguments here for `openAtLogin` to be set correctly.

Retorna `Object`:

- `openAtLogin` boolean - `true` se o aplicativo está configurado para abrir no login.

- `openAsHidden` boolean *macOS* *Deprecated* - `true` if the app is set to open as hidden at login. This does not work on macOS 13 and up.

- `wasOpenedAtLogin` boolean *macOS* - `true` if the app was opened at login automatically.

- `wasOpenedAsHidden` boolean *macOS* *Deprecated* - `true` if the app was opened as a hidden login item. Isso indica que o aplicativo não deverá abrir nenhuma janela durante a inicialização. This setting is not available on [MAS builds](/pt/docs/latest/tutorial/mac-app-store-submission-guide) or on macOS 13 and up.

- `restoreState` boolean *macOS* *Deprecated* - `true` if the app was opened as a login item that should restore the state from the previous session. This indicates that the app should restore the windows that were open the last time the app was closed. This setting is not available on [MAS builds](/pt/docs/latest/tutorial/mac-app-store-submission-guide) or on macOS 13 and up.

- `status` string *macOS* - can be `not-registered`, `enabled`, `requires-approval`, or `not-found`.

- `executableWillLaunchAtLogin` boolean *Windows* - `true` if app is set to open at login and its run key is not deactivated. This differs from `openAtLogin` as it ignores the `args` option, this property will be true if the given executable would be launched at login with **any** arguments.

- `launchItems` Object[] *Windows*

  - `name` string *Windows* - name value of a registry entry.

  - `path` string *Windows* - The executable to an app that corresponds to a registry entry.

  - `args` string[] *Windows* - the command-line arguments to pass to the executable.

  - `scope` string *Windows* - can be `user` or `machine`. Indicates whether the registry entry is under `HKEY_CURRENT USER` or `HKEY_LOCAL_MACHINE`.

  - `enabled` boolean *Windows* - `true` if the app registry key is startup approved and therefore shows as `enabled` in Task Manager and Windows settings.

### `app.setLoginItemSettings(settings)` *macOS* *Windows*

- Objeto `settings`

  - `openAtLogin` boolean (optional) - `true` to open the app at login, `false` to remove the app as a login item. O padrão é `false`.

  - `openAsHidden` boolean (optional) *macOS* *Deprecated* - `true` to open the app as hidden. O padrão é `false`. The user can edit this setting from the System Preferences so `app.getLoginItemSettings().wasOpenedAsHidden` should be checked when the app is opened to know the current value. This setting is not available on [MAS builds](/pt/docs/latest/tutorial/mac-app-store-submission-guide) or on macOS 13 and up.

  - `type` string (optional) *macOS* - The type of service to add as a login item. O padrão é `mainAppService`. Only available on macOS 13 and up.

    - `mainAppService` - The primary application.

    - `agentService` - The property list name for a launch agent. The property list name must correspond to a property list in the app’s `Contents/Library/LaunchAgents` directory.

    - `daemonService` string (optional) *macOS* - The property list name for a launch agent. The property list name must correspond to a property list in the app’s `Contents/Library/LaunchDaemons` directory.

    - `loginItemService` string (optional) *macOS* - The property list name for a login item service. The property list name must correspond to a property list in the app’s `Contents/Library/LoginItems` directory.

  - `serviceName` string (optional) *macOS* - The name of the service. Required if `type` is non-default. Only available on macOS 13 and up.

  - `path` string (optional) *Windows* - The executable to launch at login. O padrão é `process.execPath`.

  - `args` string[] (optional) *Windows* - The command-line arguments to pass to the executable. Defaults to an empty array. Take care to wrap paths in quotes.

  - `enabled` boolean (optional) *Windows* - `true` will change the startup approved registry key and `enable / disable` the App in Task Manager and Windows Settings. O padrão é `true`.

  - `name` string (optional) *Windows* - value name to write into registry. Defaults to the app's AppUserModelId().

Define as opções de execução do aplicativo na inicialização do sistema.

To work with Electron's `autoUpdater` on Windows, which uses [Squirrel](https://github.com/Squirrel/Squirrel.Windows), you'll want to set the launch path to your executable's name but a directory up, which is a stub application automatically generated by Squirrel which will automatically launch the latest version.

```javascript
const { app } = require('electron')  
  
const path = require('node:path')  
  
const appFolder = path.dirname(process.execPath)  
const ourExeName = path.basename(process.execPath)  
const stubLauncher = path.resolve(appFolder, '..', ourExeName)  
  
app.setLoginItemSettings({  
  openAtLogin: true,  
  path: stubLauncher,  
  args: [  
    // You might want to pass a parameter here indicating that this  
    // app was launched via login, but you don't have to  
  ]  
})  

```

For more information about setting different services as login items on macOS 13 and up, see [`SMAppService`](https://developer.apple.com/documentation/servicemanagement/smappservice?language=objc).

### `app.isAccessibilitySupportEnabled()` *macOS* *Windows*

Returns `boolean` - `true` if Chromium's accessibility support is enabled, `false` otherwise. Essa API retornará `true` se o uso de tecnologias assistivas, tais como leitores de tela, foi detectado. Consulte [https://www.chromium.org/developers/design-documents/accessibility](https://www.chromium.org/developers/design-documents/accessibility) para mais detalhes.

### `app.setAccessibilitySupportEnabled(enabled)` *macOS* *Windows*

- `enabled` boolean - Ativa ou desativa a renderização da [árvore de acessibilidade](https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/the-accessibility-tree)

Manually enables Chromium's accessibility support, allowing to expose accessibility switch to users in application settings. See [Chromium's accessibility docs](https://www.chromium.org/developers/design-documents/accessibility) for more details. Desativado por padrão.

This API must be called after the `ready` event is emitted.

> 

[!NOTE] Rendering accessibility tree can significantly affect the performance of your app. It should not be enabled by default. Calling this method will enable the following accessibility support features: `nativeAPIs`, `webContents`, `inlineTextBoxes`, and `extendedProperties`.

### `app.getAccessibilitySupportFeatures()` *macOS* *Windows*

Returns `string[]` - Array of strings naming currently enabled accessibility support components. Valores possíveis:

- `nativeAPIs` - Native OS accessibility APIs integration enabled.

- `webContents` - Web contents accessibility tree exposure enabled.

- `inlineTextBoxes` - Inline text boxes (character bounding boxes) enabled.

- `extendedProperties` - Extended accessibility properties enabled.

- `screenReader` - Screen reader specific mode enabled.

- `html` - HTML accessibility tree construction enabled.

- `labelImages` - Accessibility support for automatic image annotations.

- `pdfPrinting` - Accessibility support for PDF printing enabled.

Notas:

- The array may be empty if no accessibility modes are active.

- Use `app.isAccessibilitySupportEnabled()` for the legacy boolean check; prefer this method for granular diagnostics or telemetry.

Exemplo:

```javascript
const { app } = require('electron')  
  
app.whenReady().then(() => {  
  if (app.getAccessibilitySupportFeatures().includes('screenReader')) {  
    // Change some app UI to better work with Screen Readers.  
  }  
})  

```

### `app.setAccessibilitySupportFeatures(features)` *macOS* *Windows*

- `features` string[] - An array of the accessibility features to enable.

Possible values are:

- `nativeAPIs` - Native OS accessibility APIs integration enabled.

- `webContents` - Web contents accessibility tree exposure enabled.

- `inlineTextBoxes` - Inline text boxes (character bounding boxes) enabled.

- `extendedProperties` - Extended accessibility properties enabled.

- `screenReader` - Screen reader specific mode enabled.

- `html` - HTML accessibility tree construction enabled.

- `labelImages` - Accessibility support for automatic image annotations.

- `pdfPrinting` - Accessibility support for PDF printing enabled.

To disable all supported features, pass an empty array `[]`.

Exemplo:

```javascript
const { app } = require('electron')  
  
app.whenReady().then(() => {  
  // Enable a subset of features:  
  app.setAccessibilitySupportFeatures([  
    'screenReader',  
    'pdfPrinting',  
    'webContents'  
  ])  
  
  // Other logic  
  
  // Some time later, disable all features:  
  app.setAccessibilitySupportFeatures([])  
})  

```

### `app.showAboutPanel()`

Show the app's about panel options. These options can be overridden with `app.setAboutPanelOptions(options)`. This function runs asynchronously.

### `app.setAboutPanelOptions(options)`

- `options` Object

  - `applicationName` string (opcional) - O nome do aplicativo.

  - `applicationVersion` string (opcional) - A versão do aplicativo.

  - `copyright` string (opcional) - Informações de copyright.

  - `version` string (optional) *macOS* - The app's build version number.

  - `credits` string (optional) *macOS* *Windows* - Credit information.

  - `authors` string[] (optional) *Linux* - List of app authors.

  - `website` string (optional) *Linux* - The app's website.

  - `iconPath` string (optional) *Linux* *Windows* - Path to the app's icon in a JPEG or PNG file format. On Linux, will be shown as 64x64 pixels while retaining aspect ratio. On Windows, a 48x48 PNG will result in the best visual quality.

Define as opções do painel sobre. This will override the values defined in the app's `.plist` file on macOS. See the [Apple docs](https://developer.apple.com/reference/appkit/nsapplication/1428479-orderfrontstandardaboutpanelwith?language=objc) for more details. On Linux, values must be set in order to be shown; there are no defaults.

If you do not set `credits` but still wish to surface them in your app, AppKit will look for a file named "Credits.html", "Credits.rtf", and "Credits.rtfd", in that order, in the bundle returned by the NSBundle class method main. The first file found is used, and if none is found, the info area is left blank. See Apple [documentation](https://developer.apple.com/documentation/appkit/nsaboutpaneloptioncredits?language=objc) for more information.

### `app.isEmojiPanelSupported()`

Returns `boolean` - whether or not the current OS version allows for native emoji pickers.

### `app.showEmojiPanel()` *macOS* *Windows*

Show the platform's native emoji picker.

### `app.startAccessingSecurityScopedResource(bookmarkData)` *MAS*

- `bookmarkData` string - The base64 encoded security scoped bookmark data returned by the `dialog.showOpenDialog` or `dialog.showSaveDialog` methods.

Returns `Function` - This function **must** be called once you have finished accessing the security scoped file. If you do not remember to stop accessing the bookmark, [kernel resources will be leaked](https://developer.apple.com/reference/foundation/nsurl/1417051-startaccessingsecurityscopedreso?language=objc) and your app will lose its ability to reach outside the sandbox completely, until your app is restarted.

```javascript
const { app, dialog } = require('electron')  
  
const fs = require('node:fs')  
  
let filepath  
let bookmark  
  
dialog.showOpenDialog(null, { securityScopedBookmarks: true }).then(({ filePaths, bookmarks }) => {  
  filepath = filePaths[0]  
  bookmark = bookmarks[0]  
  fs.readFileSync(filepath)  
})  
  
// ... restart app ...  
  
const stopAccessingSecurityScopedResource = app.startAccessingSecurityScopedResource(bookmark)  
fs.readFileSync(filepath)  
stopAccessingSecurityScopedResource()  

```

Start accessing a security scoped resource. With this method, Electron applications that are packaged for the Mac App Store may reach outside their sandbox to access files chosen by the user. See [Apple's documentation](https://developer.apple.com/documentation/professional-video-applications/enabling-security-scoped-bookmark-and-url-access) for a description of how this system works.

### `app.enableSandbox()`

Enables full sandbox mode on the app. This means that all renderers will be launched sandboxed, regardless of the value of the `sandbox` flag in [`WebPreferences`](/pt/docs/latest/api/structures/web-preferences).

Este método somente pode ser chamado antes do aplicativo estiver pronto.

### `app.isInApplicationsFolder()` *macOS*

Returns `boolean` - Whether the application is currently running from the systems Application folder. Use in combination with `app.moveToApplicationsFolder()`

### `app.moveToApplicationsFolder([options])` *macOS*

- Objeto `options` (opcional)

  - `conflictHandler` Função<boolean> (optional) - A handler for potential conflict in move failure.

    - `conflictType` string - The type of move conflict encountered by the handler; can be `exists` or `existsAndRunning`, where `exists` means that an app of the same name is present in the Applications directory and `existsAndRunning` means both that it exists and that it's presently running.

Returns `boolean` - Whether the move was successful. Please note that if the move is successful, your application will quit and relaunch.

No confirmation dialog will be presented by default. If you wish to allow the user to confirm the operation, you may do so using the [`dialog`](/pt/docs/latest/api/dialog) API.

**NOTE:** This method throws errors if anything other than the user causes the move to fail. For instance if the user cancels the authorization dialog, this method returns false. If we fail to perform the copy, then this method will throw an error. The message in the error should be informative and tell you exactly what went wrong.

By default, if an app of the same name as the one being moved exists in the Applications directory and is *not* running, the existing app will be trashed and the active app moved into its place. If it *is* running, the preexisting running app will assume focus and the previously active app will quit itself. This behavior can be changed by providing the optional conflict handler, where the boolean returned by the handler determines whether or not the move conflict is resolved with default behavior.  i.e. returning `false` will ensure no further action is taken, returning `true` will result in the default behavior and the method continuing.

Como por exemplo:

```javascript
const { app, dialog } = require('electron')  
  
app.moveToApplicationsFolder({  
  conflictHandler: (conflictType) => {  
    if (conflictType === 'exists') {  
      return dialog.showMessageBoxSync({  
        type: 'question',  
        buttons: ['Halt Move', 'Continue Move'],  
        defaultId: 0,  
        message: 'An app of this name already exists'  
      }) === 1  
    }  
  }  
})  

```

Would mean that if an app already exists in the user directory, if the user chooses to 'Continue Move' then the function would continue with its default behavior and the existing app will be trashed and the active app moved into its place.

### `app.isSecureKeyboardEntryEnabled()` *macOS*

Returns `boolean` - whether `Secure Keyboard Entry` is enabled.

By default this API will return `false`.

### `app.setSecureKeyboardEntryEnabled(enabled)` *macOS*

- `enabled` boolean - Enable or disable `Secure Keyboard Entry`

Set the `Secure Keyboard Entry` is enabled in your application.

By using this API, important information such as password and other sensitive information can be prevented from being intercepted by other processes.

See [Apple's documentation](https://developer.apple.com/library/archive/technotes/tn2150/_index.html) for more details.

> 

[!NOTE] Enable `Secure Keyboard Entry` only when it is needed and disable it when it is no longer needed.

### `app.setProxy(config)`

- `config` [ProxyConfig](/pt/docs/latest/api/structures/proxy-config)

Returns `Promise<void>` - Resolves when the proxy setting process is complete.

Sets the proxy settings for networks requests made without an associated [Session](/pt/docs/latest/api/session). Currently this will affect requests made with [Net](/pt/docs/latest/api/net) in the [utility process](/pt/docs/latest/glossary#utility-process) and internal requests made by the runtime (ex: geolocation queries).

This method can only be called after app is ready.

### `app.resolveProxy(url)`

- `url` URL

Returns `Promise<string>` - Resolves with the proxy information for `url` that will be used when attempting to make requests using [Net](/pt/docs/latest/api/net) in the [utility process](/pt/docs/latest/glossary#utility-process).

### `app.setClientCertRequestPasswordHandler(handler)`  *Linux*

- 

`handler` Function<Promise<string>>

  - `clientCertRequestParams` Object

    - `hostname` string - the hostname of the site requiring a client certificate

    - `tokenName` string - the token (or slot) name of the cryptographic device

    - `isRetry` boolean - whether there have been previous failed attempts at prompting the password

Returns `Promise<string>` - Resolves with the password

The handler is called when a password is needed to unlock a client certificate for `hostname`.

```javascript
const { app } = require('electron')  
  
async function passwordPromptUI (text) {  
  return new Promise((resolve, reject) => {  
    // display UI to prompt user for password  
    // ...  
    // ...  
    resolve('the password')  
  })  
}  
  
app.setClientCertRequestPasswordHandler(async ({ hostname, tokenName, isRetry }) => {  
  const text = `Please sign in to ${tokenName} to authenticate to ${hostname} with your certificate`  
  const password = await passwordPromptUI(text)  
  return password  
})  

```

## Propriedades

### `app.accessibilitySupportEnabled` *macOS* *Windows*

A `boolean` property that's `true` if Chromium's accessibility support is enabled, `false` otherwise. This property will be `true` if the use of assistive technologies, such as screen readers, has been detected. Setting this property to `true` manually enables Chromium's accessibility support, allowing developers to expose accessibility switch to users in application settings.

See [Chromium's accessibility docs](https://www.chromium.org/developers/design-documents/accessibility) for more details. Desativado por padrão.

This API must be called after the `ready` event is emitted.

> 

[!NOTE] Rendering accessibility tree can significantly affect the performance of your app. It should not be enabled by default.

### `app.applicationMenu`

A `Menu | null` property that returns [`Menu`](/pt/docs/latest/api/menu) if one has been set and `null` otherwise. Users can pass a [Menu](/pt/docs/latest/api/menu) to set this property.

### `app.badgeCount` *Linux* *macOS*

An `Integer` property that returns the badge count for current app. Setting the count to `0` will hide the badge.

On macOS, setting this with any nonzero integer shows on the dock icon. On Linux, this property only works for Unity launcher.

> 

[!NOTE] Unity launcher requires a `.desktop` file to work. For more information, please read the [Unity integration documentation](https://help.ubuntu.com/community/UnityLaunchersAndDesktopFiles#Adding_shortcuts_to_a_launcher).

> 

[!NOTE] On macOS, you need to ensure that your application has the permission to display notifications for this property to take effect.

### `app.commandLine` *Readonly*

A [`CommandLine`](/pt/docs/latest/api/command-line) object that allows you to read and manipulate the command line arguments that Chromium uses.

### `app.dock` *macOS* *Readonly*

A `Dock | undefined` property ([`Dock`](/pt/docs/latest/api/dock) on macOS, `undefined` on all other platforms) that allows you to perform actions on your app icon in the user's dock.

### `app.isPackaged` *Readonly*

A `boolean` property that returns  `true` if the app is packaged, `false` otherwise. For many apps, this property can be used to distinguish development and production environments.

### `app.toastActivatorCLSID` *Windows* *Readonly*

A `string` property that returns the app's [Toast Activator CLSID](https://learn.microsoft.com/en-us/windows/win32/properties/props-system-appusermodel-toastactivatorclsid).

### `app.name`

A `string` property that indicates the current application's name, which is the name in the application's `package.json` file.

Usually the `name` field of `package.json` is a short lowercase name, according to the npm modules spec. Você normalmente deve especificar um campo `productName`, que é o nome completo da aplicação contendo letras maiúsculas e minúsculas e qual será preferido por `name` pelo Electron.

### `app.userAgentFallback`

A `string` which is the user agent string Electron will use as a global fallback.

This is the user agent that will be used when no user agent is set at the `webContents` or `session` level.  It is useful for ensuring that your entire app has the same user agent.  Set to a custom value as early as possible in your app's initialization to ensure that your overridden value is used.

### `app.runningUnderARM64Translation` *Readonly* *macOS* *Windows*

A `boolean` which when `true` indicates that the app is currently running under an ARM64 translator (like the macOS [Rosetta Translator Environment](https://en.wikipedia.org/wiki/Rosetta_(software)) or Windows [WOW](https://en.wikipedia.org/wiki/Windows_on_Windows)).

You can use this property to prompt users to download the arm64 version of your application when they are mistakenly running the x64 version under Rosetta or WOW.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/app.md)[AvançarautoUpdater](/pt/docs/latest/api/auto-updater)
