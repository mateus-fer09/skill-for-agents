---
title: "Perguntas Frequentes no Electron"
description: "## Por que estou tendo problemas para instalar o Electron?"
topics:
  - "Referencia"
keywords:
  - "Perguntas Frequentes no Electron"
  - "electron"
  - "ELIFECYCLE"
  - "EAI_AGAIN"
  - "ECONNRESET"
  - "ETIMEDOUT"
  - "localStorage"
  - "sessionStorage"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/faq"
---

# Perguntas Frequentes no Electron

## Por que estou tendo problemas para instalar o Electron?

Ao executar o `npm install electron`, alguns usuários encontram erros de instalação.

Em quase todos os casos, esses problemas são resultado de problemas de rede e não de problemas reais com o pacote npm `electron`. Erros como `ELIFECYCLE`, `EAI_AGAIN`, `ECONNRESET`, e `ETIMEDOUT` são resultados da falta de internet. A melhor solução é tentar trocar de rede, ou aguardar um pouco e tentar instalar novamente.

You can also attempt to download Electron directly from [GitHub Releases](https://github.com/electron/electron/releases) if installing via `npm` is failing.

If you need to install Electron through a custom mirror or proxy, see the [Advanced Installation](/pt/docs/latest/tutorial/installation) documentation for more details.

## How are Electron binaries downloaded?

When you run `npm install electron`, the main `bin` script is downloaded. Once this is run (for example, via `npx electron`), the Electron binary for the corresponding version is downloaded into your project's node_modules folder dynamically via the `install-electron` script.

The download logic is handled by the [`@electron/get`](https://github.com/electron/get) utility package under the hood.

You can also call the `install-electron` script manually.

## When will Electron upgrade to latest Chromium?

Every new major version of Electron releases with a Chromium major version upgrade. By releasing every 8 weeks, Electron is able to pull in every other major Chromium release on the very same day that it releases upstream. Security fixes will be backported to stable release channels ahead of time.

See the [Electron Releases](/pt/docs/latest/tutorial/electron-timelines) documentation for more details or [releases.electronjs.org](https://releases.electronjs.org) to see our Release Status dashboard.

## Quando o Electron será atualizado para a versão mais recente do Node.js?

Quando uma nova versão do Node.js é lançada, geralmente esperamos por cerca de um mês antes de atualizar a do Electron. Assim, podemos evitar sermos afetados por erros introduzidos na nova versão do Node.js, o que acontece muito frequentemente.

Novos recursos do Node.js geralmente são trazidos por atualização da V8, desde que o Electron usa o V8 enviado pelo navegador Chrome. Os novos recursos brilhante do JavaScript de uma nova versão Node.js esta geralmente no Electron.

## Como compartilhar dados entre página da web?

Para compartilhar dados entre páginas web (os processos de renderização) a maneira mais simples é usar as APIs do HTML5 que já estão disponíveis nos navegadores. As melhores opções são [Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage), [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage), e o [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

Como alternativa, você pode usar as ferramentas de IPC que são fornecidos pelo Electron. To share data between the main and renderer processes, you can use the [`ipcMain`](/pt/docs/latest/api/ipc-main) and [`ipcRenderer`](/pt/docs/latest/api/ipc-renderer) modules. To communicate directly between web pages, you can send a [`MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort) from one to the other, possibly via the main process using [`ipcRenderer.postMessage()`](/pt/docs/latest/api/ipc-renderer#ipcrendererpostmessagechannel-message-transfer). A comunicação subsequente através das portas de mensagens é direta e não desvia o processo principal.

## A minha bandeja de aplicativo desapareceu depois de alguns minutos.

Isto acontece quando a variável que é usada para armazenar a bandeja é coletada pelo garbage collector.

Se você encontrar esse problema, esses artigos podem ser úteis:

- [Gerenciamento de Memória](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

- [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

Se você quer uma solução rápida, você pode fazer as variáveis globais, alterando seu código:

```javascript
const { app, Tray } = require('electron')  
  
app.whenReady().then(() =>{  
 const tray = new Tray('/path/to/icon.png')  
 tray.setTitle('hello world')  
})  

```

para isto:

```javascript
const { app, Tray } = require('electron')  
  
let tray = null  
app.whenReady().then(() => {  
  tray = new Tray('/path/to/icon.png')  
  tray.setTitle('hello world')  
})  

```

## Eu não posso usar jQuery/RequireJS/Meteor/AngularJS em Electron.

Devido à integração de Node.js do Electron, existem alguns símbolos extras inseridos o DOM como `module`, `exports` e `require`. Isso causa problemas por causa de algumas bibliotecas que querem inserir os símbolos com os mesmos nomes.

Para resolver isso, você pode desativar a integração com node no Electron:

```javascript
// No processo main.  
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({  
  webPreferences: {  
    nodeIntegration: false  
  }  
})  
win.show()  

```

Mas se você quer manter as habilidades de usar Node.JS e Electron APIs, você tem que renomear os símbolos na página, antes de incluir outras bibliotecas:

```javascript
<head>  
<script>  
window.nodeRequire = require;  
delete window.require;  
delete window.exports;  
delete window.module;  
</script>  
<script type="text/javascript" src="jquery.js"></script>  
</head>  

```

## `require('electron').xxx` é indefinido.

Quando usar o módulo built-in do Electron você pode encontrar um erro como este:

```javascript
> require('electron').webFrame.setZoomFactor(1.0)  
Uncaught TypeError: Cannot read property 'setZoomLevel' of undefined  

```

É bem provável que você esteja utilizando o módulo no processo errado. Por exemplo, `electron.app` pode apenas ser usado pelo processo principal, enquanto `electron.webFrame` está apenas disponível no processo de renderização.

## A fonte parece borrada, o que é isso e o que eu posso fazer?

Se a [anti-aliasing de sub-pixel](https://alienryderflex.com/sub_pixel/) estiver desativada, então os textos nas telas LCD podem aparecer embaçados. Exemplo:

A anti-aliasing de sub-pixel precisa de um fundo não transparente na camada que contem os glyphs de texto. (Veja [esta publicação](https://github.com/electron/electron/issues/6344#issuecomment-420371918) para mais informações).

To achieve this goal, set the background in the constructor for [BrowserWindow](/pt/docs/latest/api/browser-window):

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow({  
  backgroundColor: '#fff'  
})  

```

O efeito é visível apenas em (algumas?) telas de LCD. Mesmo que você não veja diferença, alguns de seus usuários podem. É melhor sempre definir o fundo desta forma, a menos que você tenha razões para não fazê-lo.

Aviso que apenas definir o background no CSS não tem o mesmo efeito desejado.

## Class inheritance does not work with Electron built-in modules

Electron classes cannot be subclassed with the [`extends`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends) keyword (also known as class inheritance). This feature was never implemented in Electron due to the added complexity it would add to C++/JavaScript interop in Electron's internals.

For more information, see [electron/electron#23](https://github.com/electron/electron/issues/23).[Editar esta página](https://github.com/electron/electron/edit/main/docs/faq.md)
