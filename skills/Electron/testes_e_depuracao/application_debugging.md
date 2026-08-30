---
title: "Depuração de Aplicativos"
description: "Sempre que seu aplicativo Electron não estiver se comportando do jeito que você queria, você pode usar uma gama de ferramentas te dão uma força para descobrir erros no seu código, "
topics:
  - "Testes e depuracao"
keywords:
  - "Depuração de Aplicativos"
  - "BrowserWindow"
  - "BrowserView"
  - "WebView"
  - "webContents"
  - "require"
  - "ELECTRON_ENABLE_LOGGING"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/application-debugging"
---

# Depuração de Aplicativos

Sempre que seu aplicativo Electron não estiver se comportando do jeito que você queria, você pode usar uma gama de ferramentas te dão uma força para descobrir erros no seu código, gargalos de desempenho e oportunidades de otimização.

## Processo de Renderização

A ferramenta mais recomendada para depurar processos de renderização individuais é o Chromium DevTools. Ele está disponível em todos os processos de renderização, incluindo instâncias de `BrowserWindow`, `BrowserView` e `WebView`. Você pode abrí-lo a partir do seu código chamando a API `openDevTools()` no `webContents` da instância:

```javascript
const { BrowserWindow } = require('electron')  
  
const win = new BrowserWindow()  
win.webContents.openDevTools()  

```

O Google oferece [uma excelente documentação de suas ferramentas de desenvolvimento][devtools]. Recomendamos que você aprenda bem a usá-lo - ele está entre as ferramentas mais poderosas no cinto de utilidades de qualquer desenvolvedor Electron.

## Processo Principal

Depurar o processo principal é um pouquinho mais complicado, já que não dá de abrir ferramentas de desenvolvimento pra ele. The Chromium Developer Tools can [be used to debug Electron's main process](https://nodejs.org/en/docs/inspector/) thanks to a closer collaboration between Google / Chrome and Node.js, but you might encounter oddities like `require` not being present in the console.

For more information, see the [Debugging the Main Process documentation][main-debug].

## Travamento V8

Se o contexto V8 parar de funcionar, as ferramentas de desenvolvimento mostratão a seguinte mensagem.

`DevTools was disconnected from the page. Once page is reloaded, DevTools will automatically reconnect.`

Logs para Chromium podem ser habilitados através da variável de ambiente `ELECTRON_ENABLE_LOGGING`. For more information, see the [environment variables documentation](/pt/docs/latest/api/environment-variables#electron_enable_logging).

Alternativamente, o argumento da linha de comando `--enable-logging` pode ser passado. More information is available in the [command line switches documentation](/pt/docs/latest/api/command-line-switches#--enable-loggingfile).

[devtools]: [https://developers](https://developers). google. com/web/tools/chrome-devtools/
[main-debug]: ./debugging-main-process.md[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/application-debugging.md)
