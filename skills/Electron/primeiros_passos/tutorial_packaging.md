---
title: "Empacotando seu aplicativo"
description: "[!NOTE]"
topics:
  - "Primeiros passos"
keywords:
  - "Empacotando seu aplicativo"
  - "devDependencies"
  - "package.json"
  - "make"
  - "forge.config.js"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/tutorial-packaging"
---

# Empacotando seu aplicativo

> [!NOTE]
> 

> Acompanhe o tutorial

> 

Esta é a **parte 5** do tutorial de Electron.

1. [Pré-requisitos](/pt/docs/latest/tutorial/tutorial-prerequisites)

2. [Criando seu primeiro aplicativo](/pt/docs/latest/tutorial/tutorial-first-app)

3. [Usando scripts de pré-carregamento](/pt/docs/latest/tutorial/tutorial-preload)

4. [Adicionando recursos](/pt/docs/latest/tutorial/tutorial-adding-features)

5. **[Empacotando seu aplicativo](/pt/docs/latest/tutorial/tutorial-packaging)**

6. [Publicando e atualizando](/pt/docs/latest/tutorial/tutorial-publishing-updating)

## Learning goals

In this part of the tutorial, we'll be going over the basics of packaging and distributing your app with [Electron Forge](https://www.electronforge.io).

## Using Electron Forge

Electron does not have any tooling for packaging and distribution bundled into its core modules. Once you have a working Electron app in dev mode, you need to use additional tooling to create a packaged app you can distribute to your users (also known as a **distributable**). Distributables can be either installers (e.g. MSI on Windows) or portable executable files (e.g. `.app` on macOS).

Electron Forge is an all-in-one tool that handles the packaging and distribution of Electron apps. Under the hood, it combines a lot of existing Electron tools (e.g. [`@electron/packager`](https://github.com/electron/packager), [`@electron/osx-sign`](https://github.com/electron/osx-sign), [`electron-winstaller`](https://github.com/electron/windows-installer), etc.) into a single interface so you do not have to worry about wiring them all together.

### Importing your project into Forge

You can install Electron Forge's CLI in your project's `devDependencies` and import your existing project with a handy conversion script.

- npm
- Yarn

```javascript
npm install --save-dev @electron-forge/cli  
npx electron-forge import  

```

```javascript
yarn add --dev @electron-forge/cli  
yarn electron-forge import  

```

Once the conversion script is done, Forge should have added a few scripts to your `package.json` file.
package.json

```javascript
  //...  
  "scripts": {  
    "start": "electron-forge start",  
    "package": "electron-forge package",  
    "make": "electron-forge make"  
  },  
  //...  

```

> [!NOTE]
> 

> CLI documentation

> 

For more information on `make` and other Forge APIs, check out the [Electron Forge CLI documentation](https://www.electronforge.io/cli#commands).

You should also notice that your package.json now has a few more packages installed under `devDependencies`, and a new `forge.config.js` file that exports a configuration object. You should see multiple makers (packages that generate distributable app bundles) in the pre-populated configuration, one for each target platform.

### Creating a distributable

To create a distributable, use your project's new `make` script, which runs the `electron-forge make` command.

- npm
- Yarn

```javascript
npm run make  

```

```javascript
yarn make  

```

This `make` command contains two steps:

1. It will first run `electron-forge package` under the hood, which bundles your app code together with the Electron binary. The packaged code is generated into a folder.

2. It will then use this packaged app folder to create a separate distributable for each configured maker.

After the script runs, you should see an `out` folder containing both the distributable and a folder containing the packaged application code.
macOS output example

```javascript
out/  
├── out/make/zip/darwin/x64/my-electron-app-darwin-x64-1.0.0.zip  
├── ...  
└── out/my-electron-app-darwin-x64/my-electron-app.app/Contents/MacOS/my-electron-app  

```

The distributable in the `out/make` folder should be ready to launch! You have now created your first bundled Electron application.

> [!TIP]
> 

> Distributable formats

> 

Electron Forge can be configured to create distributables in different OS-specific formats (e.g. DMG, deb, MSI, etc.). See Forge's [Makers](https://www.electronforge.io/config/makers) documentation for all configuration options.

> [!TIP]
> 

> Creating and adding application icons

> 

Setting custom application icons requires a few additions to your config. Check out [Forge's icon tutorial](https://www.electronforge.io/guides/create-and-add-icons) for more information.

> [!NOTE]
> 

> Packaging without Electron Forge

> 

If you want to manually package your code, or if you're just interested understanding the mechanics behind packaging an Electron app, check out the full [Application Packaging](/pt/docs/latest/tutorial/application-distribution) documentation.

## Important: signing your code

In order to distribute desktop applications to end users, we *highly recommend* that you **code sign** your Electron app. Code signing is an important part of shipping desktop applications, and is mandatory for the auto-update step in the final part of the tutorial.

Code signing is a security technology that you use to certify that a desktop app was created by a known source. Windows and macOS have their own OS-specific code signing systems that will make it difficult for users to download or launch unsigned applications.

On macOS, code signing is done at the app packaging level. On Windows, distributable installers are signed instead. If you already have code signing certificates for Windows and macOS, you can set your credentials in your Forge configuration.

> [!NOTE]
> 

> info

> 

For more information on code signing, check out the [Signing macOS Apps](https://www.electronforge.io/guides/code-signing) guide in the Forge docs.

- macOS
- Windows
forge.config.js

```javascript
module.exports = {  
  packagerConfig: {  
    osxSign: {},  
    // ...  
    osxNotarize: {  
      tool: 'notarytool',  
      appleId: process.env.APPLE_ID,  
      appleIdPassword: process.env.APPLE_PASSWORD,  
      teamId: process.env.APPLE_TEAM_ID  
    }  
    // ...  
  }  
}  

```
forge.config.js

```javascript
module.exports = {  
  // ...  
  makers: [  
    {  
      name: '@electron-forge/maker-squirrel',  
      config: {  
        certificateFile: './cert.pfx',  
        certificatePassword: process.env.CERTIFICATE_PASSWORD  
      }  
    }  
  ]  
  // ...  
}  

```

## Sumário

Electron applications need to be packaged to be distributed to users. In this tutorial, you imported your app into Electron Forge and configured it to package your app and generate installers.

In order for your application to be trusted by the user's system, you need to digitally certify that the distributable is authentic and untampered by code signing it. Your app can be signed through Forge once you configure it to use your code signing certificate information.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/tutorial-5-packaging.md)[AnteriorAdicionando recursos](/pt/docs/latest/tutorial/tutorial-adding-features)[AvançarPublicando e atualizando](/pt/docs/latest/tutorial/tutorial-publishing-updating)

- [Learning goals](#learning-goals)
- [Using Electron Forge](#using-electron-forge)

  - [Importing your project into Forge](#importing-your-project-into-forge)
  - [Creating a distributable](#creating-a-distributable)

- [Important: signing your code](#important-signing-your-code)
- [Sumário](#sumário)
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
