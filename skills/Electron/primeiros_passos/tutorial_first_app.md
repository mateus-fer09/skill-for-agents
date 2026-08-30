---
title: "Criando seu primeiro aplicativo"
description: "[!NOTE]"
topics:
  - "Primeiros passos"
keywords:
  - "Criando seu primeiro aplicativo"
  - "main.js"
  - "node_modules"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/tutorial-first-app"
---

# Criando seu primeiro aplicativo

> [!NOTE]
> 

> Acompanhe o tutorial

> 

Esta é a **parte 2** do tutorial de Electron.

1. [Pré-requisitos](/pt/docs/latest/tutorial/tutorial-prerequisites)

2. **[Criando seu primeiro aplicativo](/pt/docs/latest/tutorial/tutorial-first-app)**

3. [Usando scripts de pré-carregamento](/pt/docs/latest/tutorial/tutorial-preload)

4. [Adicionando recursos](/pt/docs/latest/tutorial/tutorial-adding-features)

5. [Empacotando seu aplicativo](/pt/docs/latest/tutorial/tutorial-packaging)

6. [Publicando e atualizando](/pt/docs/latest/tutorial/tutorial-publishing-updating)

## Learning goals

Nesta parte do tutorial, você irá aprender como configurar seu projeto Electron e escrever uma aplicação minimamente funcional. Ao final desta seção, você conseguirá executar um aplicativo Electron funcional em modo de desenvolvimento do seu terminal.

## Configurando seu projeto

> [!WARNING]
> 

> Evite utilizar WSL

> 

Se você estiver em uma máquina Windows, por favor não use [Subsistema Windows para Linux](https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2) (WSL) ao seguir este tutorial, pois você terá problemas ao tentar executar o aplicativo.

### Inicializando seu projeto npm

Aplicativos Electron são aninhados utilizando npm, com o arquivo package.json como ponto de entrada. Inicie criando um diretório, e inicializando um pacote npm dentro dele com `npm init`.

- npm
- Yarn

```javascript
mkdir my-electron-app && cd my-electron-app  
npm init  

```

```javascript
mkdir my-electron-app && cd my-electron-app  
yarn init  

```

Este comando irá lhe pedir para configurar alguns campos no seu package.json. Existem algumas regras a seguir para os propósitos deste tutorial:

- *entry point* será `main.js` (você estará criando este arquivo em breve).

- *author*, *license*, and *description* can be any value, but will be necessary for [packaging](/pt/docs/latest/tutorial/tutorial-packaging) later on.

> [!WARNING]
> 

> Install dependencies with a regular `node_modules` folder

> 

Electron's packaging toolchain requires the `node_modules` folder to be physically on disk in the way that npm installs Node dependencies. By default, [Yarn Berry](https://yarnpkg.com/) and [pnpm](http://pnpm.io/) both use alternative installation strategies.

Therefore, you must set [`nodeLinker: node-modules`](https://yarnpkg.com/configuration/yarnrc#nodeLinker) in Yarn or [`nodeLinker: hoisted`](https://pnpm.io/settings#nodelinker) in pnpm if you are using those package managers.

Em seguida, instale o Electron dentro das **devDependencies** do seu aplicativo, que é a lista de dependências externas que não são necessárias em produção, apenas em desenvolvimento.

> [!NOTE]
> 

> Why is Electron a dev dependency?

> 

Isto pode parecer contraintuitivo já que seu código de produção está executando Electron APIs. Under the hood, Electron's JavaScript API binds to a binary that contains its implementations. The packaging step for Electron handles the bundling of this binary, eliminating the need to specify it as a production dependency.

- npm
- Yarn

```javascript
npm install electron --save-dev  

```

```javascript
yarn add electron --dev  

```

Seu arquivo package.json deve se parecer com algo assim após inicializar seu pacote e instalar o Electron. Você também deve ter um diretório chamado `node_modules` contendo o executável do Electron, assim como um arquivo de bloqueio `package-lock.json` que especifica as versões dependências a serem instaladas.
package.json

```javascript
{  
  "name": "my-electron-app",  
  "version": "1.0.0",  
  "description": "Hello World!",  
  "main": "main.js",  
  "scripts": {  
    "test": "echo \"Error: no test specified\" && exit 1"  
  },  
  "author": "Jane Doe",  
  "license": "MIT",  
  "devDependencies": {  
    "electron": "23.1.3"  
  }  
}  

```

> [!NOTE]
> 

> Passos avançados de instalação do Electron

> 

If installing Electron directly fails, please refer to our [Advanced Installation](/pt/docs/latest/tutorial/installation) documentation for instructions on download mirrors, proxies, and troubleshooting steps.

### Adicionando um arquivo .gitignore

O arquivo [`.gitignore`](https://git-scm.com/docs/gitignore) especifica quais arquivos e diretórios não devem ser rastreados pelo Git. Você deve colocar uma cópia do [GitHub's Node.js gitignore template](https://github.com/github/gitignore/blob/main/Node.gitignore) no diretório raiz do seu projeto para evitar realizar commit do diretório `node_modules`.

## Rodando um aplicativo Electron

> [!TIP]
> 

> Further reading

> 

Read [Electron's process model](/pt/docs/latest/tutorial/process-model) documentation to better understand how Electron's multiple processes work together.

O script [`main`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#main) que você definiu no package.json é o ponto de entrada de qualquer aplicação Electron. Este script controla o **processo principal**, que é executado em um ambiente Node.js e é responsável por controlar o ciclo de vida do seu aplicativo, exibindo interfaces nativas, realizando todas as operações necessárias e gerenciando os processos de renderização (mais sobre isso mais tarde).

Antes de criar seu aplicativo Electron, você primeiro irá usar um script trivial para garantir que seu processo principal de ponto de entrada está configurado corretamente. Crie um arquivo `main.js` no diretório raiz do seu projeto com uma única linha de código:
main.js

```javascript
console.log('Hello from Electron 👋')  

```

Because Electron's main process is a Node.js runtime, you can execute arbitrary Node.js code with the `electron` command (you can even use it as a [REPL](/pt/docs/latest/tutorial/repl)). Para executar este script, adicione `electron .` ao comando `start` no campo [`scripts`](https://docs.npmjs.com/cli/v7/using-npm/scripts) do seu package.json. Este comando dirá ao executável Electron para procurar o script principal no diretório atual e executá-lo no modo de desenvolvimento.
package.json

```javascript
{  
  "name": "my-electron-app",  
  "version": "1.0.0",  
  "description": "Hello World!",  
  "main": "main.js",  
  "scripts": {  
    "start": "electron .",  
    "test": "echo \"Error: no test specified\" && exit 1"  
  },  
  "author": "Jane Doe",  
  "license": "MIT",  
  "devDependencies": {  
    "electron": "23.1.3"  
  }  
}  

```

- npm
- Yarn

```javascript
npm run start  

```

```javascript
yarn run start  

```

Seu terminal deve imprimir `Hello from Electron 👋`. Parabéns, você executou sua primeira linha de código no Electron! Em seguida, você aprenderá como criar interfaces de usuário com HTML e carregá-las em uma janela nativa.

## Carregando uma página web com BrowserWindow

No Electron, cada janela exibe uma página web que pode ser carregada de um arquivo HTML local ou de um endereço web remoto. Neste exemplo, você estará carregando em um arquivo local. Start by creating a barebones web page in an `index.html` file in the root folder of your project:
index.html

```javascript
<!DOCTYPE html>  
<html>  
  <head>  
    <meta charset="UTF-8" />  
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->  
    <meta  
      http-equiv="Content-Security-Policy"  
      content="default-src 'self'; script-src 'self'"  
    />  
    <meta  
      http-equiv="X-Content-Security-Policy"  
      content="default-src 'self'; script-src 'self'"  
    />  
    <title>Hello from Electron renderer!</title>  
  </head>  
  <body>  
    <h1>Hello from Electron renderer!</h1>  
    <p>👋</p>  
  </body>  
</html>  

```

Now that you have a web page, you can load it into an Electron [BrowserWindow](/pt/docs/latest/api/browser-window). Replace the contents of your `main.js` file with the following code. We will explain each highlighted block separately.
main.js

```javascript
const { app, BrowserWindow } = require('electron')  
  
const createWindow = () => {  
  const win = new BrowserWindow({  
    width: 800,  
    height: 600  
  })  
  
  win.loadFile('index.html')  
}  
  
app.whenReady().then(() => {  
  createWindow()  
})  

```

### Importing modules

main.js (Line 1)

```javascript
const { app, BrowserWindow } = require('electron')  

```

In the first line, we are importing two Electron modules with CommonJS module syntax:

- [app](/pt/docs/latest/api/app), which controls your application's event lifecycle.

- [BrowserWindow](/pt/docs/latest/api/browser-window), which creates and manages app windows.

Module capitalization conventions

You might have noticed the capitalization difference between the **a**pp and **B**rowser**W**indow modules. Electron follows typical JavaScript conventions here, where PascalCase modules are instantiable class constructors (e.g. BrowserWindow, Tray, Notification) whereas camelCase modules are not instantiable (e.g. app, ipcRenderer, webContents).
Typed import aliases

For better type checking when writing TypeScript code, you can choose to import main process modules from `electron/main`.

```javascript
const { app, BrowserWindow } = require('electron/main')  

```

For more information, see the [Process Model docs](/pt/docs/latest/tutorial/process-model#process-specific-module-aliases-typescript).

> [!NOTE]
> 

> ES Modules in Electron

> 

[ECMAScript modules](https://nodejs.org/api/esm.html) (i.e. using `import` to load a module) are supported in Electron as of Electron 28. You can find more information about the state of ESM in Electron and how to use them in our app in [our ESM guide](/pt/docs/latest/tutorial/esm).

### Writing a reusable function to instantiate windows

The `createWindow()` function loads your web page into a new BrowserWindow instance:

```javascript

```

### Calling your function when the app is ready

main.js (Lines 12-14)

```javascript
app.whenReady().then(() => {  
  createWindow()  
})  

```

Many of Electron's core modules are Node.js [event emitters](https://nodejs.org/api/events.html#events) that adhere to Node's asynchronous event-driven architecture. The app module is one of these emitters.

In Electron, BrowserWindows can only be created after the app module's [`ready`](/pt/docs/latest/api/app#event-ready) event is fired. You can wait for this event by using the [`app.whenReady()`](/pt/docs/latest/api/app#appwhenready) API and calling `createWindow()` once its promise is fulfilled.

> [!NOTE]
> 

> info

> 

You typically listen to Node.js events by using an emitter's `.on` function.

```javascript
+ app.on('ready', () => {  
- app.whenReady().then(() => {  
  createWindow()  
})  

```

However, Electron exposes `app.whenReady()` as a helper specifically for the `ready` event to avoid subtle pitfalls with directly listening to that event in particular. See [electron/electron#21972](https://github.com/electron/electron/pull/21972) for details.

At this point, running your Electron application's `start` command should successfully open a window that displays your web page!

Each web page your app displays in a window will run in a separate process called a **renderer** process (or simply *renderer* for short). Renderer processes have access to the same JavaScript APIs and tooling you use for typical front-end web development, such as using [webpack](https://webpack.js.org) to bundle and minify your code or [React](https://reactjs.org) to build your user interfaces.

## Managing your app's window lifecycle

Application windows behave differently on each operating system. Rather than enforce these conventions by default, Electron gives you the choice to implement them in your app code if you wish to follow them. You can implement basic window conventions by listening for events emitted by the app and BrowserWindow modules.

> [!TIP]
> 

> Process-specific control flow

> 

Checking against Node's [`process.platform`](https://nodejs.org/api/process.html#process_process_platform) variable can help you to run code conditionally on certain platforms. Note that there are only three possible platforms that Electron can run in: `win32` (Windows), `linux` (Linux), and `darwin` (macOS).

### Encerrar a aplicação quando todas as janelas estiverem fechadas (Windows e Linux)

On Windows and Linux, closing all windows will generally quit an application entirely. To implement this pattern in your Electron app, listen for the app module's [`window-all-closed`](/pt/docs/latest/api/app#event-window-all-closed) event, and call [`app.quit()`](/pt/docs/latest/api/app#appquit) to exit your app if the user is not on macOS.

```javascript
app.on('window-all-closed', () => {  
  if (process.platform !== 'darwin') app.quit()  
})  

```

### Open a window if none are open (macOS)

In contrast, macOS apps generally continue running even without any windows open. Activating the app when no windows are available should open a new one.

To implement this feature, listen for the app module's [`activate`](/pt/docs/latest/api/app#event-activate-macos) event, and call your existing `createWindow()` method if no BrowserWindows are open.

Because windows cannot be created before the `ready` event, you should only listen for `activate` events after your app is initialized. Do this by only listening for activate events inside your existing `whenReady()` callback.

```javascript
app.whenReady().then(() => {  
  createWindow()  
  
  app.on('activate', () => {  
    if (BrowserWindow.getAllWindows().length === 0) createWindow()  
  })  
})  

```

## Final starter code

[docs/fiddles/tutorial-first-app (43.4.0)](https://github.com/electron/electron/tree/v43.4.0/docs/fiddles/tutorial-first-app)[Open in Fiddle](https://fiddle.electronjs.org/launch?target=electron/v43.4.0/docs/fiddles/tutorial-first-app)

- main.js
- index.html

```javascript
const { app, BrowserWindow } = require('electron/main')  
  
const createWindow = () => {  
  const win = new BrowserWindow({  
    width: 800,  
    height: 600  
  })  
  
  win.loadFile('index.html')  
}  
  
app.whenReady().then(() => {  
  createWindow()  
  
  app.on('activate', () => {  
    if (BrowserWindow.getAllWindows().length === 0) {  
      createWindow()  
    }  
  })  
})  
  
app.on('window-all-closed', () => {  
  if (process.platform !== 'darwin') {  
    app.quit()  
  }  
})  

```

```javascript
<!DOCTYPE html>  
<html>  
  <head>  
    <meta charset="UTF-8" />  
    <meta  
      http-equiv="Content-Security-Policy"  
      content="default-src 'self'; script-src 'self'"  
    />  
    <meta  
      http-equiv="X-Content-Security-Policy"  
      content="default-src 'self'; script-src 'self'"  
    />  
    <title>Hello from Electron renderer!</title>  
  </head>  
  <body>  
    <h1>Hello from Electron renderer!</h1>  
    <p>👋</p>  
    <p id="info"></p>  
  </body>  
  <script src="./renderer.js"></script>  
</html>  

```

## Optional: Debugging from VS Code

If you want to debug your application using VS Code, you need to attach VS Code to both the main and renderer processes. Here is a sample configuration for you to run. Create a launch.json configuration in a new `.vscode` folder in your project:
.vscode/launch.json

```javascript
{  
  "version": "0.2.0",  
  "compounds": [  
    {  
      "name": "Main + renderer",  
      "configurations": ["Main", "Renderer"],  
      "stopAll": true  
    }  
  ],  
  "configurations": [  
    {  
      "name": "Renderer",  
      "port": 9222,  
      "request": "attach",  
      "type": "chrome",  
      "webRoot": "${workspaceFolder}"  
    },  
    {  
      "name": "Main",  
      "type": "node",  
      "request": "launch",  
      "cwd": "${workspaceFolder}",  
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",  
      "windows": {  
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"  
      },  
      "args": [".", "--remote-debugging-port=9222"],  
      "outputCapture": "std",  
      "console": "integratedTerminal"  
    }  
  ]  
}  

```

The "Main + renderer" option will appear when you select "Run and Debug" from the sidebar, allowing you to set breakpoints and inspect all the variables among other things in both the main and renderer processes.

What we have done in the `launch.json` file is to create 3 configurations:

- `Main` is used to start the main process and also expose port 9222 for remote debugging (`--remote-debugging-port=9222`). This is the port that we will use to attach the debugger for the `Renderer`. Because the main process is a Node.js process, the type is set to `node`.

- `Renderer` is used to debug the renderer process. Because the main process is the one that creates the process, we have to "attach" to it (`"request": "attach"`) instead of creating a new one. The renderer process is a web one, so the debugger we have to use is `chrome`.

- `Main + renderer` is a [compound task](https://code.visualstudio.com/Docs/editor/tasks#_compound-tasks) that executes the previous ones simultaneously.

:::atenção

Because we are attaching to a process in `Renderer`, it is possible that the first lines of your code will be skipped as the debugger will not have had enough time to connect before they are being executed. You can work around this by refreshing the page or setting a timeout before executing the code in development mode.

:::

> [!NOTE]
> 

> Further reading

> 

If you want to dig deeper in the debugging area, the following guides provide more information:

- [Depuração de Aplicativos](/pt/docs/latest/tutorial/application-debugging)

- [DevTools Extensions](/pt/docs/latest/tutorial/devtools-extension)

## Sumário

Electron applications are set up using npm packages. The Electron executable should be installed in your project's `devDependencies` and can be run in development mode using a script in your package.json file.

The executable runs the JavaScript entry point found in the `main` property of your package.json. This file controls Electron's **main process**, which runs an instance of Node.js and is responsible for your app's lifecycle, displaying native interfaces, performing privileged operations, and managing renderer processes.

**Renderer processes** (or renderers for short) are responsible for displaying graphical content. You can load a web page into a renderer by pointing it to either a web address or a local HTML file. Renderers behave very similarly to regular web pages and have access to the same web APIs.

In the next section of the tutorial, we will be learning how to augment the renderer process with privileged APIs and how to communicate between processes.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/tutorial-2-first-app.md)[AnteriorPré-requisitos](/pt/docs/latest/tutorial/tutorial-prerequisites)[AvançarUsando scripts de pré-carregamento](/pt/docs/latest/tutorial/tutorial-preload)

- [Learning goals](#learning-goals)
- [Configurando seu projeto](#configurando-seu-projeto)

  - [Inicializando seu projeto npm](#inicializando-seu-projeto-npm)
  - [Adicionando um arquivo .gitignore](#adicionando-um-arquivo-gitignore)

- [Rodando um aplicativo Electron](#rodando-um-aplicativo-electron)
- [Carregando uma página web com BrowserWindow](#carregando-uma-página-web-com-browserwindow)

  - [Importing modules](#importing-modules)
  - [Writing a reusable function to instantiate windows](#writing-a-reusable-function-to-instantiate-windows)
  - [Calling your function when the app is ready](#calling-your-function-when-the-app-is-ready)

- [Managing your app's window lifecycle](#managing-your-apps-window-lifecycle)

  - [Encerrar a aplicação quando todas as janelas estiverem fechadas (Windows e Linux)](#encerrar-a-aplicação-quando-todas-as-janelas-estiverem-fechadas-windows-e-linux)
  - [Open a window if none are open (macOS)](#open-a-window-if-none-are-open-macos)

- [Final starter code](#final-starter-code)
- [Optional: Debugging from VS Code](#optional-debugging-from-vs-code)
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
