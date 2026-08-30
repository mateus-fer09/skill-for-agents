---
title: "Class: Extensions"
description: "## Class: Extensions"
topics:
  - "Api"
keywords:
  - "Class: Extensions"
  - "Extensions"
  - "extensions"
  - "Session"
  - "event"
  - "extension"
  - "Extensions.loadExtension"
  - "Session.removeExtension"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/extensions-api"
---

# Class: Extensions

## Class: Extensions

> 

Load and interact with extensions.

Process: [Main](/pt/docs/latest/glossary#main-process)  

*This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

Instances of the `Extensions` class are accessed by using `extensions` property of
a `Session`.

### Eventos de instância

The following events are available on instances of `Extensions`:

#### Event: 'extension-loaded'

Retorna:

- `event` Event

- `extension` [Extension](/pt/docs/latest/api/structures/extension)

Emitted after an extension is loaded. This occurs whenever an extension is
added to the "enabled" set of extensions. Isto inclui:

- Extensions being loaded from `Extensions.loadExtension`.

- Extensions being reloaded:

  - from a crash.

  - if the extension requested it ([`chrome.runtime.reload()`](https://developer.chrome.com/extensions/runtime#method-reload)).

#### Event: 'extension-unloaded'

Retorna:

- `event` Event

- `extension` [Extension](/pt/docs/latest/api/structures/extension)

Emitted after an extension is unloaded. This occurs when
`Session.removeExtension` is called.

#### Event: 'extension-ready'

Retorna:

- `event` Event

- `extension` [Extension](/pt/docs/latest/api/structures/extension)

Emitted after an extension is loaded and all necessary browser state is
initialized to support the start of the extension's background page.

### Métodos de Instância

The following methods are available on instances of `Extensions`:

#### `extensions.loadExtension(path[, options])`

- `path` string - Path to a directory containing an unpacked Chrome extension

- `options` Object (optional)

  - `allowFileAccess` boolean - Whether to allow the extension to read local files over `file://`
protocol and inject content scripts into `file://` pages. This is required e.g. for loading
DevTools extensions on `file://` URLs. Defaults to false.

Returns `Promise<Extension>` - resolves when the extension is loaded.

This method will raise an exception if the extension could not be loaded. If
there are warnings when installing the extension (e.g. if the extension
requests an API that Electron does not support) then they will be logged to the
console.

Note that Electron does not support the full range of Chrome extensions APIs.
See [Supported Extensions APIs](/pt/docs/latest/api/extensions#supported-extensions-apis) for
more details on what is supported.

Note that in previous versions of Electron, extensions that were loaded would
be remembered for future runs of the application. This is no longer the case:
`loadExtension` must be called on every boot of your app if you want the
extension to be loaded.

```javascript
const { app, session } = require('electron')  
  
const path = require('node:path')  
  
app.whenReady().then(async () => {  
  await session.defaultSession.extensions.loadExtension(  
    path.join(__dirname, 'react-devtools'),  
    // allowFileAccess is required to load the DevTools extension on file:// URLs.  
    { allowFileAccess: true }  
  )  
  // Note that in order to use the React DevTools extension, you'll need to  
  // download and unzip a copy of the extension.  
})  

```

This API does not support loading packed (.crx) extensions.

> [!NOTE]
> 

> note

> 

This API cannot be called before the `ready` event of the `app` module
is emitted.

> [!NOTE]
> 

> note

> 

Loading extensions into in-memory (non-persistent) sessions is not
supported and will throw an error.

#### `extensions.removeExtension(extensionId)`

- `extensionId` string - ID of extension to remove

Unloads an extension.

> [!NOTE]
> 

> note

> 

This API cannot be called before the `ready` event of the `app` module
is emitted.

#### `extensions.getExtension(extensionId)`

- `extensionId` string - ID of extension to query

Returns `Extension | null` - The loaded extension with the given ID.

> [!NOTE]
> 

> note

> 

This API cannot be called before the `ready` event of the `app` module
is emitted.

#### `extensions.getAllExtensions()`

Returns `Extension[]` - A list of all loaded extensions.

> [!NOTE]
> 

> note

> 

This API cannot be called before the `ready` event of the `app` module
is emitted.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/extensions-api.md)[AnteriorClass: DownloadItem](/pt/docs/latest/api/download-item)[AvançarClass: IncomingMessage](/pt/docs/latest/api/incoming-message)

- [Class: Extensions](#class-extensions)

  - [Eventos de instância](#eventos-de-instância)

    - [`'extension-loaded'`](#event-extension-loaded)
    - [`'extension-unloaded'`](#event-extension-unloaded)
    - [`'extension-ready'`](#event-extension-ready)

  - [Métodos de Instância](#métodos-de-instância)

    - [`loadExtension`](#extensionsloadextensionpath-options)
    - [`removeExtension`](#extensionsremoveextensionextensionid)
    - [`getExtension`](#extensionsgetextensionextensionid)
    - [`getAllExtensions`](#extensionsgetallextensions)

Documentação

- [Introdução](/pt/docs/latest/)
- [Referência da API](/pt/docs/latest/api/app)
Listas de verificação

- [Performance](/pt/docs/latest/tutorial/performance)
- [Segurança](/pt/docs/latest/tutorial/security)
Ferramentas

- [Electron Forge](https://electronforge.io)
- [Electron Fiddle](/pt/fiddle)
Comunidade

- [Governança](/pt/governance)
- [Recursos](/pt/community)
- [Discord](https://discordapp.com/invite/APGC3k5yaH)
- [Bluesky](https://bsky.app/profile/electronjs.org)
- [X](https://x.com/electronjs)
- [Mastodon](https://social.lfx.dev/@electronjs)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/electron)
Mais

- [GitHub](https://github.com/electron/electron)
- [Open Collective](https://opencollective.com/electron)
- [Painel de infraestrutura](https://p.datadoghq.com/sb/c44e1df0-85d7-11ee-94c9-da7ad0900002-c245f7ef47d0d0c32abecdc0938c2a85)
[](https://openjsf.org/)Direitos autorais © [OpenJS Foundation](https://openjsf.org) e contribuidores do Electron. Todos os direitos reservados. A [OpenJS Foundation](https://openjsf.org) possui marcas registradas e utiliza marcas comerciais. Para uma lista de marcas da [OpenJS Foundation](https://openjsf.org), consulte nossa [Política de Marcas](https://trademark-policy.openjsf.org) e [Lista de Marcas](https://trademark-list.openjsf.org). Marcas e logotipos não indicados na [lista de marcas da OpenJS Foundation](https://trademark-list.openjsf.org) são marcas™™ ou marcas registradas®® de seus respectivos proprietários. O uso delas não implica qualquer afiliação ou endosso por parte deles.

[A OpenJS Foundation](https://openjsf.org) | [Termos de Uso](https://terms-of-use.openjsf.org) | [Política de Privacidade](https://privacy-policy.openjsf.org) | [Estatuto](https://bylaws.openjsf.org) | [Código de Conduta](https://code-of-conduct.openjsf.org) | [Política de Marcas](https://trademark-policy.openjsf.org) | [Lista de Marcas](https://trademark-list.openjsf.org) | [Política de Cookies](https://www.linuxfoundation.org/cookies)Hosting and infrastructure graciously provided by
