---
title: "Advanced Installation Instructions"
description: "npm install electron --save-dev The preferred method is to install Electron as a development dependency in your app:"
topics:
  - "Primeiros passos"
keywords:
  - "Advanced Installation Instructions"
  - "electron"
  - "main"
  - "arm64"
  - "ELECTRON_INSTALL_ARCH"
  - "process.arch"
  - "ia32"
  - "win32"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/installation"
---

# Advanced Installation Instructions

npm install electron --save-dev The preferred method is to install Electron as a development dependency in your app:

```javascript
npm install electron --save-dev  

```

See the [Electron versioning doc](/pt/docs/latest/tutorial/electron-versioning) for info on how to manage Electron versions in your apps.

## Binary download step

Under the hood, Electron's JavaScript API binds to a binary that contains its implementations. This binary is crucial to the function of any Electron app, and is downloaded by default the first time you run Electron in development mode (i.e. `electron .`).

If you want to install the binary on demand instead, you can run the `install-electron` bin script included in the `electron` package:

```javascript
npx install-electron --no  

```

## Installing prereleases

Electron [distributes experimental releases of future major versions](/pt/docs/latest/tutorial/electron-timelines) via npm as well.

Nightly builds contain the latest changes from the `main` branch:

```javascript
npm install electron-nightly --save-dev  

```

Alpha and beta builds contain changes slated for the next major version:

```javascript
npm install electron@alpha --save-dev  
npm install electron@beta --save-dev  

```

> 

[!TIP] For more information on available Electron releases, see the [Release Status dashboard](https://releases.electronjs.org).

## Running Electron ad-hoc

If you're in a pinch and would prefer to not use `npm install` in your local project, you can also run Electron ad-hoc using the [`npx`](https://docs.npmjs.com/cli/v7/commands/npx) command runner bundled with `npm`:

```javascript
npx electron .  

```

The above command will run the current working directory with Electron. Note that any dependencies in your app will not be installed.

## Personalização

If you want to change the architecture that is downloaded (e.g., `x64` on an `arm64` machine), you can set the `ELECTRON_INSTALL_ARCH` environment variable:

```javascript
# Inside an npm script or with npx  
ELECTRON_INSTALL_ARCH=x64 electron .  

```

Supported architectures are a subset of Node.js [`process.arch`](https://nodejs.org/api/process.html#processarch) values, and include:

- `x64` (Intel Mac and 64-bit Windows)

- `ia32` (32-bit Windows)

- `arm64` (Apple silicon, Windows on ARM, ARM64 Linux)

- `arm` (32-bit ARM)

Além de alterar a arquitetura, você pode também especificar a plataforma (ex: `win32`, `linux`, etc.) usando a opção `--platform`:

```javascript
# Inside an npm script or with npx  
ELECTRON_INSTALL_PLATFORM=mas electron .  

```

Supported platforms are Node-like [platform strings](https://nodejs.org/api/process.html#processplatform):

- `darwin`

- `mas` ([Mac App Store](/pt/docs/latest/tutorial/mac-app-store-submission-guide))

- `win32`

- `linux`

> 

[!TIP] To see all available platform/architecture combinations for a particular release, see the artifacts on [Electron's GitHub Releases](https://github.com/electron/electron/releases).

## Proxies

Se você necessitar usar um HTTP proxy, é preciso adicionar a variável para múltiplos valores,`ELECTRON_GET_USE_PROXY`, além das variáveis de ambientes adicionais, dependendo da versão do Node:

- [Node 10 and above](https://github.com/gajus/global-agent/blob/v2.1.5/README.md#environment-variables)

- [Before Node 10](https://github.com/np-maintain/global-tunnel/blob/v2.7.1/README.md#auto-config)

## Custom mirrors and caches

Durante a instalação, o módulo `electron` vai se conectar para o [`@electron/get`](https://github.com/electron/get) para fazer o download de binários pré-construídos do Electron para a sua plataforma. Ele fará isso entrando em contato a página de lançamento da GitHub (`https://github.com/electron/electron/releases/tag/v$VERSION`, onde `$VERSION` é a versão exata do Electron).

Se você não conseguir acessar o GitHub ou precisar fornecer uma compilação personalizada, poderá fazê-lo fornecendo um espelho ou um diretório de cache existente.

### Mirror (espelhamento)

Você pode usar variáveis de ambiente para substituir a URL base, o caminho no qual procurar por binários Electron e o nome do arquivo binário. The URL used by `@electron/get` is composed as follows:

```javascript
url = ELECTRON_MIRROR + ELECTRON_CUSTOM_DIR + '/' + ELECTRON_CUSTOM_FILENAME  

```

For instance, to use the China CDN mirror:

```javascript
ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"  

```

By default, `ELECTRON_CUSTOM_DIR` is set to `v$VERSION`. To change the format, use the `{{ version }}` placeholder. For example, `version-{{ version }}` resolves to `version-5.0.0`, `{{ version }}` resolves to `5.0.0`, and `v{{ version }}` is equivalent to the default. As a more concrete example, to use the China non-CDN mirror:

```javascript
ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"  
ELECTRON_CUSTOM_DIR="{{ version }}"  

```

The above configuration will download from URLs such as `https://npmmirror.com/mirrors/electron/8.0.0/electron-v8.0.0-linux-x64.zip`.

If your mirror serves artifacts with different checksums to the official Electron release you may have to set `electron_use_remote_checksums=1` directly, or configure it in a `.npmrc` file, to force Electron to use the remote `SHASUMS256.txt` file to verify the checksum instead of the embedded checksums.

### Cache

Como alternativa, você pode substituir o cache local. O `@electron/get` armazenará em cache os binários baixados em um diretório local para não estressar sua rede. Você pode usar essa pasta de cache para fornecer construções personalizadas do Electron ou evitar contato com a rede.

- Linux: `$XDG_CACHE_HOME` ou `~/.cache/electron/`

- macOS: `~/Library/Caches/electron/`

- Windows: `$LOCALAPPDATA/electron/Cache` ou `~/AppData/Local/electron/Cache/`

Em ambientes que usam versões mais antigas do Electron, você pode encontrar cache também em `~/.electron`.

Você também pode sobrescrever o local do cache local fornecendo uma variável `electron_config_cache` de ambiente.

The cache contains the version's official zip file as well as a checksum, and is stored as `[checksum]/[filename]`. A typical cache might look like this:

```javascript
├── a91b089b5dc5b1279966511344b805ec84869b6cd60af44f800b363bba25b915  
│   └── electron-v15.3.1-darwin-x64.zip  

```

## Solução de Problemas

Ao executar o `npm install electron`, alguns usuários encontram erros de instalação.

Em quase todos os casos, esses problemas são resultado de problemas de rede e não de problemas reais com o pacote npm `electron`. Erros como `ELIFECYCLE`, `EAI_AGAIN`, `ECONNRESET`, e `ETIMEDOUT` são resultados da falta de internet. A melhor solução é tentar trocar de rede, ou aguardar um pouco e tentar instalar novamente.

Se a instalação via `npm` falhar, você também pode tentar baixar o Electron diretamente do código fonte em [electron/electron/releases](https://github.com/electron/electron/releases).

Se a instalação falha com um erro `EACCESS`, você precisará [corrgir suas permissões do npm](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

Se o erro acima persistir, o sinalizador [unsafe-perm](https://docs.npmjs.com/misc/config#unsafe-perm) pode precisar ser definido como true:

```javascript
sudo npm install electron --unsafe-perm=true  

```

Em redes mais lentas, pode ser aconselhável usar o sinalizador `--verbose` para mostrar o progresso do download:

```javascript
npm install --verbose electron  

```

Se você precisar forçar um novo download do ativo e o arquivo SHASUM, defina a variável `force_no_cache` do ambiente para `true`.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/installation.md)
