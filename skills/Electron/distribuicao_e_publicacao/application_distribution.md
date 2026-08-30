---
title: "Empacotamento de Aplicativos"
description: "To distribute your app with Electron, you need to package and rebrand it. To do this, you can either use specialized tooling or manual approaches."
topics:
  - "Distribuicao e publicacao"
keywords:
  - "Empacotamento de Aplicativos"
  - "Electron.app"
  - "electron"
  - "electron.exe"
  - "asar"
  - "app.asar"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/application-distribution"
---

# Empacotamento de Aplicativos

To distribute your app with Electron, you need to package and rebrand it. To do this, you can either use specialized tooling or manual approaches.

## With tooling

There are a couple tools out there that exist to package and distribute your Electron app. We recommend using [Electron Forge](/pt/docs/latest/tutorial/forge-overview). You can check out its [documentation](https://www.electronforge.io) directly, or refer to the [Packaging and Distribution](/pt/docs/latest/tutorial/tutorial-packaging) part of the Electron tutorial.

## Manual packaging

If you prefer the manual approach, there are 2 ways to distribute your application:

- With prebuilt binaries

- With an app source code archive

### With prebuilt binaries

To distribute your app manually, you need to download Electron's [prebuilt binaries](https://github.com/electron/electron/releases). Depois disso, a pasta contendo seu aplicativo deve ser renomeada para `app` e colocada dentro do diretório de recursos (resources) do Electron como mostrado nos seguintes exemplos.

> [!NOTE]
> 

> note

> 

The location of Electron's prebuilt binaries is indicated with `electron/` in the examples below.
macOS

```javascript
electron/Electron.app/Contents/Resources/app/  
├── package.json  
├── main.js  
└── index.html  

```

Windows and Linux

```javascript
electron/resources/app  
├── package.json  
├── main.js  
└── index.html  

```

Then execute `Electron.app` on macOS, `electron` on Linux, or `electron.exe` on Windows, and Electron will start as your app. The `electron` directory will then be your distribution to deliver to users.

### With an app source code archive (asar)

Instead of shipping your app by copying all of its source files, you can package your app into an [asar](https://github.com/electron/asar) archive to improve the performance of reading files on platforms like Windows, if you are not already using a bundler such as Parcel or Webpack.

Para usar um arquivo `asar` para substituir a pasta `app`, você precisa renomear o arquivo para `app.asar` e colocá-lo dentro da pasta de recursos do Electron como mostrado abaixo, e o Electron irá então ler o arquivo e executar seu app.
macOS

```javascript
electron/Electron.app/Contents/Resources/  
└── app.asar  

```

Windows

```javascript
electron/resources/  
└── app.asar  

```

You can find more details on how to use `asar` in the [`electron/asar` repository](https://github.com/electron/asar).

### Rebranding with downloaded binaries

Após deixar seu app Electron pronto para usar, você pode querer personalizar os executáveis do Electron antes de distribuí-los aos usuários.

- 

**Windows:** You can rename `electron.exe` to any name you like, and edit its icon and other information with tools like [rcedit](https://github.com/electron/rcedit).

- 

**Linux:** You can rename the `electron` executable to any name you like.

- 

**macOS:** You can rename `Electron.app` to any name you want, and you also have to rename the `CFBundleDisplayName`, `CFBundleIdentifier` and `CFBundleName` fields in the following files:

  - `Electron.app/Contents/Info.plist`

  - `Electron.app/Contents/Frameworks/Electron Helper.app/Contents/Info.plist`

Você também pode renomear o app auxiliar para evitar de mostrar `Electron Helper` no Monitor de Atividade, mas não esqueça de renomear o arquivo executável do app auxiliar.

Veja como ficaria a estrutura de um aplicativo renomeado:

```javascript
MyApp.app/Contents  
├── Info.plist  
├── MacOS/  
│   └── MyApp  
└── Frameworks/  
    └── MyApp Helper.app  
        ├── Info.plist  
        └── MacOS/  
            └── MyApp Helper  

```

> [!NOTE]
> 

> note

> 

também é possível remarcar o Electron mudando o nome do produto e construindo a partir fonte. To do this you need to set the build argument corresponding to the product name (`electron_product_name = "YourProductName"`) in the `args.gn` file and rebuild.

Keep in mind this is not recommended as setting up the environment to compile from source is not trivial and takes significant time.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/application-distribution.md)[AnteriorDistribution Overview](/pt/docs/latest/tutorial/distribution-overview)[AvançarAssinando Código](/pt/docs/latest/tutorial/code-signing)
