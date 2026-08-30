---
title: "Variáveis de Ambiente"
description: "Documentação técnica e referência da API de Variáveis de Ambiente no Electron."
topics:
  - "Api"
keywords:
  - "Variáveis de Ambiente"
  - "NODE_OPTIONS"
  - "nodeOptions"
  - "NODE_EXTRA_CA_CERTS"
  - "GOOGLE_API_KEY"
  - "ELECTRON_NO_ASAR"
  - "ELECTRON_RUN_AS_NODE"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/environment-variables"
---

# Variáveis de Ambiente

> 

Controle configurações e comportamento de aplicações sem mudar o código.

Certos comportamentos do Electron são controlados por variáveis de ambientes porque são inicializados antes que as flags da linha de comando e o código da aplicação.

Exemplo de shell POSIX:

```javascript
$ export ELECTRON_ENABLE_LOGGING=true  
$ electron  

```

Exemplo de console do Windows:

```javascript
> set ELECTRON_ENABLE_LOGGING=true  
> electron  

```

## Production Variables

The following environment variables are intended primarily for use at runtime in packaged Electron applications.

### `NODE_OPTIONS`

Electron includes support for a subset of Node's [`NODE_OPTIONS`](https://nodejs.org/api/cli.html#cli_node_options_options). The majority are supported with the exception of those which conflict with Chromium's use of BoringSSL.

Exemplo:

```javascript
export NODE_OPTIONS="--no-warnings --max-old-space-size=2048"  

```

Unsupported options are:

```javascript
--use-bundled-ca  
--force-fips  
--enable-fips  
--openssl-config  
--use-openssl-ca  

```

`NODE_OPTIONS` are explicitly disallowed in packaged apps, except for the following:

```javascript
--max-http-header-size  
--http-parser  

```

If the [`nodeOptions` fuse](/pt/docs/latest/tutorial/fuses#nodeoptions) is disabled, `NODE_OPTIONS` will be ignored.

### `NODE_EXTRA_CA_CERTS`

See [Node.js cli documentation](https://github.com/nodejs/node/blob/main/doc/api/cli.md#node_extra_ca_certsfile) for details.

```javascript
export NODE_EXTRA_CA_CERTS=/path/to/cert.pem   

```

If the [`nodeOptions` fuse](/pt/docs/latest/tutorial/fuses#nodeoptions) is disabled, `NODE_EXTRA_CA_CERTS` will be ignored.

### `GOOGLE_API_KEY`

Geolocation support in Electron requires the use of Google Cloud Platform's geolocation webservice. To enable this feature, acquire a [Google API key](https://developers.google.com/maps/documentation/geolocation/get-api-key) and place the following code in your main process file, before opening any browser windows that will make geolocation requests:

```javascript
process.env.GOOGLE_API_KEY = 'YOUR_KEY_HERE'  

```

By default, a newly generated Google API key may not be allowed to make geolocation requests. To enable the geolocation webservice for your project, enable it through the [API library](https://console.cloud.google.com/apis/library).

N.B. You will need to add a [Billing Account](https://cloud.google.com/billing/docs/how-to/payment-methods#add_a_payment_method) to the project associated to the API key for the geolocation webservice to work.

### `ELECTRON_NO_ASAR`

Disables ASAR support. This variable is only supported in forked child processes and spawned child processes that set `ELECTRON_RUN_AS_NODE`.

### `ELECTRON_RUN_AS_NODE`

Starts the process as a normal Node.js process.

In this mode, you will be able to pass [cli options](https://nodejs.org/api/cli.html) to Node.js as you would when running the normal Node.js executable, with the exception of the following flags:

- "--openssl-config"

- "--use-bundled-ca"

- "--use-openssl-ca",

- "--force-fips"

- "--enable-fips"

These flags are disabled owing to the fact that Electron uses BoringSSL instead of OpenSSL when building Node.js' `crypto` module, and so will not work as designed.

If the [`runAsNode` fuse](/pt/docs/latest/tutorial/fuses#runasnode) is disabled, `ELECTRON_RUN_AS_NODE` will be ignored.

### `ELECTRON_NO_ATTACH_CONSOLE` *Windows*

Don't attach to the current console session.

### `ELECTRON_FORCE_WINDOW_MENU_BAR` *Linux*

Don't use the global menu bar on Linux.

### `ELECTRON_TRASH` *Linux*

Set the trash implementation on Linux. Por padrão é `gio`.

Opções:

- `gvfs-trash`

- `trash-cli`

- `kioclient5`

- `kioclient`

## Variáveis de desenvolvimento

As seguintes variáveis de ambiente são destinadas principalmente para fins de depuração e desenvolvimento.

### `ELECTRON_ENABLE_LOGGING`

Prints Chromium's internal logging to the console.

Setting this variable is the same as passing `--enable-logging` on the command line. For more info, see `--enable-logging` in [command-line switches](/pt/docs/latest/api/command-line-switches#--enable-loggingfile).

### `ELECTRON_LOG_FILE`

Sets the file destination for Chromium's internal logging.

Setting this variable is the same as passing `--log-file` on the command line. For more info, see `--log-file` in [command-line switches](/pt/docs/latest/api/command-line-switches#--log-filepath).

### `ELECTRON_DEBUG_NOTIFICATIONS`

Adds extra logs to [`Notification`](/pt/docs/latest/api/notification) lifecycles on macOS to aid in debugging. Extra logging will be displayed when new Notifications are created or activated. They will also be displayed when common actions are taken: a notification is shown, dismissed, its button is clicked, or it is replied to.

Sample output:

```javascript
Notification created (com.github.Electron:notification:EAF7B87C-A113-43D7-8E76-F88EC9D73D44)  
Notification displayed (com.github.Electron:notification:EAF7B87C-A113-43D7-8E76-F88EC9D73D44)  
Notification activated (com.github.Electron:notification:EAF7B87C-A113-43D7-8E76-F88EC9D73D44)  
Notification replied to (com.github.Electron:notification:EAF7B87C-A113-43D7-8E76-F88EC9D73D44)  

```

### `ELECTRON_DEBUG_MSIX_UPDATER`

Adds extra logs to MSIX updater operations on Windows to aid in debugging. Extra logging will be displayed when MSIX update operations are initiated, including package updates, package registration, and restart registration. This helps diagnose issues with MSIX package updates and deployments.

Sample output:

```javascript
UpdateMsix called with URI: https://example.com/app.msix  
DoUpdateMsix: Starting  
Calling AddPackageByUriAsync... URI: https://example.com/app.msix  
Update options - deferRegistration: true, developerMode: false, forceShutdown: false, forceTargetShutdown: false, forceUpdateFromAnyVersion: false  
Waiting for deployment...  
Deployment finished.  
MSIX Deployment completed.  

```

### `ELECTRON_LOG_ASAR_READS`

When Electron reads from an ASAR file, log the read offset and file path to the system `tmpdir`. The resulting file can be provided to the ASAR module to optimize file ordering.

### `ELECTRON_ENABLE_STACK_DUMPING`

Imprime o rastreamento da pilha para o console quando o Electron trava.

Essa variável de ambiente não funcionará se o `crashReporter` tiver iniciado.

### `ELECTRON_DEFAULT_ERROR_MODE` *Windows*

Mostra a caixa de diálogo de travamento do Windows quando o Electron trava.

Essa variável de ambiente não funcionará se o `crashReporter` tiver iniciado.

### `ELECTRON_OVERRIDE_DIST_PATH`

When running from the `electron` package, this variable tells the `electron` command to use the specified build of Electron instead of the one downloaded by `npm install`. Usando:

```javascript
export ELECTRON_OVERRIDE_DIST_PATH=/Users/username/projects/electron/out/Testing  

```

### `ELECTRON_INSTALL_PLATFORM`

Manually overrides platform used by `electron` package during an install. This can be useful if you are on one platform (e.g macOS) but want to download binaries for another platform (e.g Windows or Linux). Usando:

```javascript
ELECTRON_INSTALL_PLATFORM=darwin npm install  

```

### `ELECTRON_INSTALL_ARCH`

Manually overrides architecture used by `electron` package during an install. This can be useful if you are on one arch (e.g `arm64`) but want to download binaries meant for another arch. Note that this will not work under Rosetta. Usando:

```javascript
ELECTRON_INSTALL_ARCH=arm64 npm install  

```
