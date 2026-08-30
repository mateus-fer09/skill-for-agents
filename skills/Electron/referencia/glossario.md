---
title: "Glossário"
description: "Esta página define alguns termos usados frequentemente no desenvolvimento com Electron."
topics:
  - "Referencia"
keywords:
  - "Glossário"
  - "node_modules"
  - "contextBridge"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/glossary"
---

# Glossário

Esta página define alguns termos usados frequentemente no desenvolvimento com Electron.

### ASAR

ASAR significa formato de arquivo Atom Shell (em inglês, Atom Shell Archive Format). Um arquivo de [asar](https://github.com/electron/asar) é um simples `tar` formato que juntas os arquivos para um único arquivo. Electron pode ler arquivos arbitrários sem descompactar o arquivo inteiro.

O formato ASAR foi criado principalmente para melhorar o desempenho no Windows quando ler grandes quantidades de arquivos pequenos (ex. ao carregar a árvore de dependências JavaScript do seu aplicativo de `node_modules`).

### ASAR integrity

ASAR integrity is a security feature that validates the contents of your app's ASAR archives at runtime. When enabled, your Electron app will verify the header hash of its ASAR archive on runtime. If no hash is present or if there is a mismatch in the hashes, the app will forcefully terminate.

See the [ASAR Integrity](/pt/docs/latest/tutorial/asar-integrity) guide for more details.

### code signing

Code signing é um processo em que um desenvolvedor de um aplicativo assina digitalmente seu código para assegurar que ele não tenha sido adulterado após packaging. Tanto Windows quanto macOS implementam sua própria versão de assinatura de código. Como desenvolvedor de aplicativos de desktop, é importante que você assine seu código se você planeja distribuí-lo para o público em geral.

For more information, read the [Code Signing](/pt/docs/latest/tutorial/code-signing) tutorial.

### context isolation

Context isolation é uma medida de segurança no Electron que garante que seu script de pré-carga não possa vazar APIs privilegiadas de Electron ou Node.js para a web em seu processo de renderização. Com context isolation habilitado, a única forma de expor APIs do seu script de pré-carga é através da API `contextBridge`.

For more information, read the [Context Isolation](/pt/docs/latest/tutorial/context-isolation) tutorial.

Veja também: [script de pré-carga](#preload-script), [processo de renderização](#renderer-process)

### CRT

A biblioteca C Run-time (CRT) é a parte padrão da C++ Standard Library que incorpora a biblioteca padrão ISO C99. As bibliotecas do Visual C++ que implementam o CRT apoiar o desenvolvimento de código nativo e misto de código nativo e gerenciado e código gerenciado puro para desenvolvimento .NET.

### DMG

Uma imagem de disco da Apple é um formato de embalagem usado pelo macOS. DMG arquivos são componentes usados para distribuir um aplicativo "instaladores".

### IME

Editor de Método de Entrada. Um programa que permite os usuários inserir caracteres e símbolos não encontrados no seu teclado. Por exemplo, isso permite que usuários com teclado Latinos teclados troque as entradas de caracteres para Chinês, Japonês e Koreano.

### IDL

Linguagem de descrição da interface (Interface description language). Escreve assinaturas de funções e tipos de dados em um formato que pode ser usado para gerar interfaces em Java, C++, JavaScript, etc.

### IPC

Comunicação entre processos (Inter-Process Communication). Electron usa a IPC para enviar mensagens JSON serializadas entre o processo principal e de renderização.

consulte também: [processo principal](#main-process), [processo de processador](#renderer-process)

### main process

O processo principal, comumente um arquivo chamado `main.js`, é o ponto de entrada de todo aplicativo Electron. Ele controla a vida do aplicativo, da abertura até o fechamento. Isso também é gerencia elementos nativos, como o Menu, Barra de Menus, Dock, Bandeja e etc. O processo principal é responsável por criar cada novo processo de renderização no aplicativo. A API completa de Node está incorporada.

O arquivo de processo principal de cada aplicativo é especificado na propriedade `main` em `package.json`. É assim que `electron .` sabe qual arquivo deve ser executado na inicialização.

No Chromium, esse processo é referido como o "processo do navegador". É renomeado no Electron para evitar confusão com processos de renderização.

Consulte também: [processo](#process), [processo de processador](#renderer-process)

### MAS

Sigla para Mac App Store da Apple (Apple's Mac App Store). For details on submitting your app to the MAS, see the [Mac App Store Submission Guide](/pt/docs/latest/tutorial/mac-app-store-submission-guide).

### Mojo

An IPC system for communicating intra- or inter-process, and that's important because Chrome is keen on being able to split its work into separate processes or not, depending on memory pressures etc.

Veja [https://chromium.googlesource.com/chromium/src/+/main/mojo/README.md](https://chromium.googlesource.com/chromium/src/+/main/mojo/README.md)

Veja também: [IPC](#ipc)

### MSI

No Windows, os pacotes MSI são usados pelo serviço Windows Installer (também conhecido como Microsoft Installer) para instalar e configurar aplicativos.

Mais informações podem ser encontradas na [documentação da Microsoft](https://learn.microsoft.com/en-us/windows/win32/msi/windows-installer-portal).

### native modules

Módulos nativos (também chamados [addons](https://nodejs.org/api/addons.html) em Node.Js) são módulos escritos em C ou C++ que pode ser carregado em Node.js ou Electron usando a função require() e fazer o uso de modo como se fossem um módulo comum de Node.js. Eles são usados principalmente para fornecer uma interface entre o JavaScript em execução em bibliotecas de Node.js e C/C++.

Os módulos nativos do Node são suportados pelo Electron, mas considerando que o Electron provavelmente irá utilizar uma versão do V8 dos binários do Node instalados no seu sistema, você deve especificar manualmente a localização dos headers do Electron quando for copilar módulos nativos.

For more information, read the [Native Node Modules](/pt/docs/latest/tutorial/using-native-node-modules) tutorial.

### notarization

Notarization is a macOS-specific process where a developer can send a code-signed app to Apple servers to get verified for malicious components through an automated service.

Veja também: [code signing](#code-signing)

### OSR

OSR (offscreen rendering) can be used for loading a heavy page in background and then displaying it after (it will be much faster). It allows you to render a page without showing it on screen.

For more information, read the [Offscreen Rendering](/pt/docs/latest/tutorial/offscreen-rendering) tutorial.

### preload script

Preload scripts contain code that executes in a renderer process before its web contents begin loading. These scripts run within the renderer context, but are granted more privileges by having access to Node.js APIs.

Veja também: [renderer process](#renderer-process), [context isolation](#context-isolation)

### process

Um processo é uma instância de um programa de computador que está sendo executado. Apps de Electron que fazem usam do [main](#main-process) e um ou vários processo de [renderer](#renderer-process) estão executando vários programas simultaneamente.

Em Node.js e Electron, cada processo em execução tem um objeto de `process`. Este objeto é um global que fornece informações sobre e controle sobre, o atual processo. Como um global, é sempre disponível para aplicações sem o uso de require().

Consulte também: [processo principal](#main-process), [processo de processador](#renderer-process)

### renderer process

The renderer process is a browser window in your app. Unlike the main process, there can be multiple of these and each is run in a separate process. They can also be hidden.

Consulte também: [process](#process), [main process](#main-process)

### sandbox

The sandbox is a security feature inherited from Chromium that restricts your renderer processes to a limited set of permissions.

For more information, read the [Process Sandboxing](/pt/docs/latest/tutorial/sandbox) tutorial.

Veja também: [process](#process)

### Squirrel

Squirrel é um framework de código aberto que permite que aplicativos de elétron atualizar automaticamente como novas versões são lançadas. See the [autoUpdater](/pt/docs/latest/api/auto-updater) API for info about getting started with Squirrel.

### userland

Este termo originou-se da comunidade Unix, onde "userland" ou "userspace" refere-se a programas que são executados fora da kernel do sistema operacional. Mais recentemente, o termo foi popularizado na comunidade Node e npm para distinguir entre os recursos disponíveis em "Node core" de pacotes publicados no registro do npm pela maior comunidade "usuários".

Como Node, o Electron é focado em ter um pequeno conjunto de APIs que fornecem todos os primitivos necessários para o desenvolvimento de aplicativos de multi-plataformas desktop. Esta filosofia do projeto permite que o Electron permaneça uma ferramenta flexível sem ser excessivamente prescritiva sobre como deve ser usado. Userland permite que os usuários criar e compartilhar ferramentas que fornecem funcionalidade adicional em cima do que é disponível no "Núcleo".

### utility process

The utility process is a child of the main process that allows running any untrusted services that cannot be run in the main process. Chromium uses this process to perform network I/O, audio/video processing, device inputs etc. In Electron, you can create this process using [UtilityProcess](/pt/docs/latest/api/utility-process) API.

Consulte também: [process](#process), [main process](#main-process)

### V8

V8 is Google's open source JavaScript engine. It is written in C++ and is used in Google Chrome. V8 can run standalone, or can be embedded into any C++ application.

Electron forma o V8 como parte do Chromium e em seguida, aponta o Node ao V8 quando construindo.

V8's version numbers always correspond to those of Google Chrome. Chrome 59 includes V8 5.9, Chrome 58 includes V8 5.8, etc.

- [v8.dev](https://v8.dev/)

- [nodejs.org/api/v8.html](https://nodejs.org/api/v8.html)

- [docs/development/v8-development.md](/pt/docs/latest/development/v8-development)

### webview

`webview` tags are used to embed 'guest' content (such as external web pages) in your Electron app. They are similar to `iframe`s, but differ in that each webview runs in a separate process. Ele não tem a mesma permissões como sua página web e todas as interações entre seu aplicativo e conteúdo incorporado será assíncrono. Isso mantém seu aplicativo seguro do conteúdo incorporado.[Editar esta página](https://github.com/electron/electron/edit/main/docs/glossary.md)
