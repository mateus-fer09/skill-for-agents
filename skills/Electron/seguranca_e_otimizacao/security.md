---
title: "Segurança"
description: "[!NOTE]"
topics:
  - "Seguranca e otimizacao"
keywords:
  - "Segurança"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/security"
---

# Segurança

> [!NOTE]
> 

> Reportando problemas de segurança payment method Received

> 

Para obter informações sobre como divulgar corretamente uma vulnerabilidade do Electron, consulte [SECURITY.md](https://github.com/electron/electron/blob/v43.4.0/SECURITY.md).

Para vulnerabilidades no Chromium upstream: O Electron mantém-se atualizado com lançamentos alternados do Chromium. Para obter mais informações, consulte o documento [Cronogramas de Lançamento do Electron](/pt/docs/latest/tutorial/electron-timelines).

## Prefácio

Como desenvolvedores da web, nós comumente aproveitamos da forte rede de segurança do navegador — os riscos associados com o código que escrevemos são relativamente pequenos. Nossos sites tem poderes limitados em uma caixa de areia e confiamos que nossos usuários desfrutam de num navegador construído por uma grande equipe de engenheiros os quais são capazes de responder rapidamente às ameaças de segurança recém-descobertas.

Ao trabalhar com Electron, é importante entender que Electron não é um navegador web. Isto permite que você construa aplicações desktop ricas com tecnologias web familiar, mas seu código exerce um poder muito maior. JavaScript pode acessar o sistema de arquivos, o shell do usuário e muito mais. Isto permite que você crie aplicativos nativos de alta qualidade, mas os riscos de segurança inerentes escalam com os poderes adicionais concedidos ao seu código.

Com isso em mente, esteja ciente de que exibir conteúdo arbitrário de fontes não confiáveis representa um grave risco de segurança que o Electron não pretende manipular. De fato, os mais populares aplicativos Electron (Atom, Slack, Visual Studio Code, etc.) mostram, primeiramente, conteúdo local (ou confiável, ou que é seguro e remoto, sem alguma interação com Node) — se a sua aplicação executa código de uma fonte online, é sua responsabilidade garantir que o código não seja malicioso.

## Diretrizes gerais

### Segurança é da responsabilidade de todos

É importante lembrar que a segurança do seu aplicativo Electron é o resultado da segurança geral da fundação do framework (*Chromium*, *Node.js*), o Electron em si, todas as dependências NPM e também seu código. Portanto, é sua responsabilidade seguir algumas das importantes boas práticas:

- 

**Mantenha sua aplicação atualizada com a última versão do framework Electron.** Ao lançar seu produto, você também está enviando um pacote composto pelo Electron, Biblioteca Compartilhada do Chromium e Node.js. Vulnerabilidades afetando estes componentes podem afetar a segurança do seu aplicativo. Ao atualizar o Electron para a versão mais recente, você garante que as vulnerabilidades críticas (como *nodeIntegration bypasses*) já estão corrigidas e não podem ser exploradas em seu aplicativo. Para obter mais informações, consulte "[Use uma versão atual do Electron](#16-use-a-current-version-of-electron)".

- 

**Avalie suas dependências.** O NPM fornece meio milhão de pacotes reutilizáveis, mas é sua responsabilidade escolher bibliotecas de terceiros confiáveis. Se você usar bibliotecas desatualizadas afetadas por vulnerabilidades conhecidas ou se depender de código mal mantido, a segurança do aplicativo pode estar comprometida.

- 

**Adote práticas seguras de codificação.** A primeira linha de defesa para seu aplicativo é seu próprio código. Vulnerabilidades comuns na web, como "Cross-Site Scripting" (XSS), têm um impacto maior na segurança de aplicações Electron, portanto é altamente recomendado adotar as melhores práticas de desenvolvimento de software seguro e realizar testes de segurança.

### Isolamento para conteúdo não confiável

Existe um problema de segurança sempre que você recebe código de uma fonte não confiável (por exemplo, de um servidor remoto) e o executa localmente. Por exemplo, considere um site remoto sendo exibido em uma [`BrowserWindow`](/pt/docs/latest/api/browser-window) padrão. Se um invasor de alguma forma conseguir alterar esse conteúdo (seja atacando diretamente a fonte ou ficando entre o seu aplicativo e o destino real), ele poderá executar código nativo na máquina do usuário.

Em nenhuma circunstância você deve carregar e executar código remoto com a integração Node.js habilitada. Em vez disso, use apenas arquivos locais (empacotados junto com o seu aplicativo) para executar código Node.js. Para visualizar o conteúdo, utilize o [`<webview>`](/pt/docs/latest/api/webview-tag) ou [`WebContentsView`](/pt/docs/latest/api/web-contents-view) e certifique-se de que desativou a opção `nodeIntegration` e ative a opção `contextIsolation`.

> [!NOTE]
> 

> Elctron aviso de segurança

> 

Os avisos e recomendações de segurança se encontram na programação do console. Apenas aparece quando o nome do binário é Electron, indicando que um programador está olhando para a console.

Você pode forçar a ativação ou desativação desses avisos definindo `ELECTRON_ENABLE_SECURITY_WARNINGS` ou `ELECTRON_DISABLE_SECURITY_WARNINGS` em `process.env` ou no objeto `window`.

## Lista de verificação: Recomendações de segurança

Você deveria pelo menos seguir esses passos para melhorar a segurança da sua aplicação:

1. [Apenas carregar conteúdo seguro](#1-only-load-secure-content)

2. [Não habilite a integração do Node.js para conteúdo remoto](#2-do-not-enable-nodejs-integration-for-remote-content)

3. [Ativar isolamento de contexto em todos os renderizadores](#3-enable-context-isolation)

4. [Habilitar processo de sandboxing](#4-enable-process-sandboxing)

5. [Use `ses.setPermissionRequestHandler()` em todas as sessões que carregam conteúdo remoto](#5-handle-session-permission-requests-from-remote-content)

6. [Não desabilite o `webSecurity`](#6-do-not-disable-websecurity)

7. [Defina uma `Content-Security-Policy`](#7-define-a-content-security-policy) e use regras restritivas (ou seja, `script-src 'self'`)

8. [Não habilite `allowRunningInsecureContent`](#8-do-not-enable-allowrunninginsecurecontent)

9. [Não habilite recursos experimentais](#9-do-not-enable-experimental-features)

10. [Não use `enableBlinkFeatures`](#10-do-not-use-enableblinkfeatures)

11. [`<webview>`: Do not use `allowpopups`](#11-do-not-use-allowpopups-for-webviews)

12. [`<webview>`: Verify options and params](#12-verify-webview-options-before-creation)

13. [Desativar ou limitar a navegação](#13-disable-or-limit-navigation)

14. [Disable or limit creation of new windows](#14-disable-or-limit-creation-of-new-windows)

15. [Não use `shell.openExternal` com conteúdo não confiável](#15-do-not-use-shellopenexternal-with-untrusted-content)

16. [Use uma versão atual do Electron](#16-use-a-current-version-of-electron)

17. [Validate the `sender` of all IPC messages](#17-validate-the-sender-of-all-ipc-messages)

18. [Evite o uso do protocolo `file://` e prefira o uso de protocolos personalizados](#18-avoid-usage-of-the-file-protocol-and-prefer-usage-of-custom-protocols)

19. [Verifique quais fusíveis você pode trocar](#19-check-which-fuses-you-can-change)

20. [Não exponha as APIs do Electron a conteúdos web não confiáveis](#20-do-not-expose-electron-apis-to-untrusted-web-content)

### 1. Apenas carregar conteúdo seguro

Any resources not included with your application should be loaded using a secure protocol like `HTTPS`. In other words, do not use insecure protocols like `HTTP`. Similarly, we recommend the use of `WSS` over `WS`, `FTPS` over `FTP`, and so on.

#### Por que?

`HTTPS` has two main benefits:

1. Ele garante a integridade dos dados, garantindo que eles não foram modificados durante o trânsito entre o seu aplicativo e o host.

2. Isto criptografa o tráfego entre o usuário e o servidor de destino, tornando-o mais difícil de espionar as informações enviadas entre seu aplicativo e o servidor.

#### Como?

main.js (Main Process)

```javascript
// Bad  
browserWindow.loadURL('http://example.com')  
  
// Good  
browserWindow.loadURL('https://example.com')  

```

index.html (Renderer Process)

```javascript
<!-- Bad -->  
<script crossorigin src="http://example.com/react.js"></script>  
<link rel="stylesheet" href="http://example.com/style.css">  
  
<!-- Good -->  
<script crossorigin src="https://example.com/react.js"></script>  
<link rel="stylesheet" href="https://example.com/style.css">  

```

### 2. Não habilite a integração do Node.js para conteúdo remoto

> [!NOTE]
> 

> info

> 

Esta recomendação é o comportamento padrão no Electron desde a versão 5.0.0.

It is paramount that you do not enable Node.js integration in any renderer ([`BrowserWindow`](/pt/docs/latest/api/browser-window), [`WebContentsView`](/pt/docs/latest/api/web-contents-view), or [`<webview>`](/pt/docs/latest/api/webview-tag)) that loads remote content.

Depois disso, você pode conceder permissões adicionais para 'hosts' específicos. Por Exemplo

#### Por que?

Um ataque cross-site-scripting (XSS) é mais perigoso se um invasor pode pular do processo de renderização e executar o código no computador do usuário. Cross-site-scripting attacks are fairly common - and while an issue, their power is usually limited to messing with the website that they are executed on. Disabling Node.js integration helps prevent an XSS from being escalated into a so-called "Remote Code Execution" (RCE) attack.

#### Como?

main.js (Main Process)

```javascript
// Bad  
const mainWindow = new BrowserWindow({  
  webPreferences: {  
    contextIsolation: false,  
    nodeIntegration: true,  
    nodeIntegrationInWorker: true  
  }  
})  
  
mainWindow.loadURL('https://example.com')  

```

main.js (Main Process)

```javascript
// Good  
const mainWindow = new BrowserWindow({  
  webPreferences: {  
    preload: path.join(app.getAppPath(), 'preload.js')  
  }  
})  
  
mainWindow.loadURL('https://example.com')  

```

index.html (Renderer Process)

```javascript
<!-- Mau -->  
<webview nodeIntegration src="page.html"></webview>  
  
<!-- Bom -->  
<webview src="page.html"></webview>  

```

Ao desabilitar a integração com o Node.js, você ainda pode expor APIs ao seu site que consomem módulos ou recursos do Node.js. Preload scripts continue to have access to `require` and other Node.js features, allowing developers to expose a custom API to remotely loaded content via the [contextBridge API](/pt/docs/latest/api/context-bridge).

### 3. Habilitar isolamento de contexto

> [!NOTE]
> 

> info

> 

O isolamento de contexto é o comportamento padrão no Electron desde a versão 12.0.0.

O isolamento de contexto é um recurso do Electron que permite aos desenvolvedores executar código em scripts de pré-carregamento e em APIs do Electron em um contexto JavaScript dedicado. In practice, that means that global objects like `Array.prototype.push` or `JSON.parse` cannot be modified by scripts running in the renderer process.

Electron uses the same technology as Chromium's [Content Scripts](https://developer.chrome.com/extensions/content_scripts#execution-environment) to enable this behavior.

Even when `nodeIntegration: false` is used, to truly enforce strong isolation and prevent the use of Node primitives `contextIsolation` **must** also be used.

Beware that *disabling context isolation* for a renderer process by setting `nodeIntegration: true` *also disables process sandboxing* for that process. See section below.

> [!NOTE]
> 

> info

> 

For more information on what `contextIsolation` is and how to enable it please see our dedicated [Context Isolation](/pt/docs/latest/tutorial/context-isolation) document.

### 4. Habilitar processo de sandboxing

> [!NOTE]
> 

> info

> 

Esta recomendação é o comportamento padrão no Electron desde a versão 20.0.0.

Additionally, process sandboxing can be enforced for all renderer processes application wide: [Enabling the sandbox globally](/pt/docs/latest/tutorial/sandbox#enabling-the-sandbox-globally)

*Disabling context isolation* (see above) *also disables process sandboxing*, regardless of the default, `sandbox: false` or globally enabled sandboxing!

[Sandboxing](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/design/sandbox.md) is a Chromium feature that uses the operating system to significantly limit what renderer processes have access to. Você deve habilitar o sandbox em todos os renderizadores. Não é aconselhável carregar, ler ou processar qualquer conteúdo não confiável em um processo sem sandbox, incluindo o processo principal.

> [!NOTE]
> 

> info

> 

For more information on what Process Sandboxing is and how to enable it please see our dedicated [Process Sandboxing](/pt/docs/latest/tutorial/sandbox) document.

### 5. Handle session permission requests from remote content

You may have seen permission requests while using Chrome: they pop up whenever the website attempts to use a feature that the user has to manually approve ( like notifications).

The API is based on the [Chromium permissions API](https://developer.chrome.com/extensions/permissions) and implements the same types of permissions.

#### Por que?

By default, Electron will automatically approve all permission requests unless the developer has manually configured a custom handler. While a solid default, security-conscious developers might want to assume the very opposite.

#### Como?

main.js (Main Process)

```javascript
const { session } = require('electron')  
  
const { URL } = require('node:url')  
  
session  
  .defaultSession  
  .setPermissionRequestHandler((webContents, permission, callback) => {  
    const parsedUrl = new URL(webContents.getURL())  
  
    if (permission === 'notifications') {  
      // Approves the permissions request  
      callback(true)  
    }  
  
    // Verify URL  
    if (parsedUrl.protocol !== 'https:' || parsedUrl.host !== 'example.com') {  
      // Denies the permissions request  
      return callback(false)  
    }  
  })  

```

Note: `session.defaultSession` is only available after `app.whenReady` is called.

### 6. Não desabilite o `webSecurity`

> [!NOTE]
> 

> info

> 

This recommendation is Electron's default.

You may have already guessed that disabling the `webSecurity` property on a renderer process ([`BrowserWindow`](/pt/docs/latest/api/browser-window), [`WebContentsView`](/pt/docs/latest/api/web-contents-view), or [`<webview>`](/pt/docs/latest/api/webview-tag)) disables crucial security features.

Do not disable `webSecurity` in production applications.

#### Por que?

Disabling `webSecurity` will disable the same-origin policy and set `allowRunningInsecureContent` property to `true`. In other words, it allows the execution of insecure code from different domains.

#### Como?

main.js (Main Process)

```javascript
// Bad  
const mainWindow = new BrowserWindow({  
  webPreferences: {  
    webSecurity: false  
  }  
})  

```

main.js (Main Process)

```javascript
// Good  
const mainWindow = new BrowserWindow()  

```

index.html (Renderer Process)

```javascript
<!-- Bad -->  
<webview disablewebsecurity src="page.html"></webview>  
  
<!-- Good -->  
<webview src="page.html"></webview>  

```

### 7. Define a Content Security Policy

A Content Security Policy (CSP) is an additional layer of protection against cross-site-scripting attacks and data injection attacks. We recommend that they be enabled by any website you load inside Electron.

#### Por que?

CSP allows the server serving content to restrict and control the resources Electron can load for that given web page. `https://example.com` should be allowed to load scripts from the origins you defined while scripts from `https://evil.attacker.com` should not be allowed to run. Definir um CSP é uma maneira fácil de melhorar a segurança do seu aplicativo.

#### Como?

O CSP a seguir permitirá que o Electron execute scripts do site atual e de `apis.example.com`.

```javascript
// Bad  
Content-Security-Policy: '*'  
  
// Good  
Content-Security-Policy: script-src 'self' https://apis.example.com  

```

#### CSP HTTP headers

Electron respects the [`Content-Security-Policy` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) which can be set using Electron's [`webRequest.onHeadersReceived`](/pt/docs/latest/api/web-request#webrequestonheadersreceivedfilter-listener) handler:
main.js (Main Process)

```javascript
const { session } = require('electron')  
  
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {  
  callback({  
    responseHeaders: {  
      ...details.responseHeaders,  
      'Content-Security-Policy': ['default-src \'none\'']  
    }  
  })  
})  

```

Note: `session.defaultSession` is only available after `app.whenReady` is called.

#### Meta tag CSP

O mecanismo de entrega preferido do CSP é um cabeçalho HTTP. Entretanto, não é possível usar este método ao carregar um recurso usando o protocolo `file://`. Pode ser útil em alguns casos definir uma política em uma página diretamente na marcação usando uma tag `<meta>`:
index.html (Renderer Process)

```javascript
<meta http-equiv="Content-Security-Policy" content="default-src 'none'">  

```

### 8. Não habilite `allowRunningInsecureContent`

> [!NOTE]
> 

> info

> 

This recommendation is Electron's default.

Por padrão, o Electron não permitirá que sites carregados via `HTTPS` carreguem e executem scripts, CSS ou plugins de fontes inseguras (`HTTP`). Setting the property `allowRunningInsecureContent` to `true` disables that protection.

Loading the initial HTML of a website over `HTTPS` and attempting to load subsequent resources via `HTTP` is also known as "mixed content".

#### Por que?

Loading content over `HTTPS` assures the authenticity and integrity of the loaded resources while encrypting the traffic itself. See the section on [only displaying secure content](#1-only-load-secure-content) for more details.

#### Como?

main.js (Main Process)

```javascript
// Bad  
const mainWindow = new BrowserWindow({  
  webPreferences: {  
    allowRunningInsecureContent: true  
  }  
})  

```

main.js (Main Process)

```javascript
// Good  
const mainWindow = new BrowserWindow({})  

```

### 9. Não habilite recursos experimentais

> [!NOTE]
> 

> info

> 

This recommendation is Electron's default.

Advanced users of Electron can enable experimental Chromium features using the `experimentalFeatures` property.

#### Por que?

Os recursos experimentais são, como o nome sugere, experimentais e não foram habilitados para todos os usuários do Chromium. Além disso, seu impacto no Electron no geral provavelmente não foi testado.

Existem casos de uso legítimos, mas, a menos que você saiba o que está fazendo, você não deve habilitar essa propriedade.

#### Como?

main.js (Main Process)

```javascript
// Bad  
const mainWindow = new BrowserWindow({  
  webPreferences: {  
    experimentalFeatures: true  
  }  
})  

```

main.js (Main Process)

```javascript
// Good  
const mainWindow = new BrowserWindow({})  

```

### 10. Não use `enableBlinkFeatures`

> [!NOTE]
> 

> info

> 

This recommendation is Electron's default.

Blink é o nome do mecanismo de renderização por trás do Chromium. As with `experimentalFeatures`, the `enableBlinkFeatures` property allows developers to enable features that have been disabled by default.

#### Por que?

Generally speaking, there are likely good reasons if a feature was not enabled by default. Legitimate use cases for enabling specific features exist. Como desenvolvedor, você deve saber exatamente por que precisa habilitar um recurso, quais são as ramificações e como isso afeta a segurança do seu aplicativo. Em nenhuma circunstância você deve habilitar recursos especulativamente.

#### Como?

main.js (Main Process)

```javascript
// Bad  
const mainWindow = new BrowserWindow({  
  webPreferences: {  
    enableBlinkFeatures: 'ExecCommandInJavaScript'  
  }  
})  

```

main.js (Main Process)

```javascript
// Good  
const mainWindow = new BrowserWindow()  

```

### 11. Não use `allowpopups` para WebViews

> [!NOTE]
> 

> info

> 

This recommendation is Electron's default.

If you are using [`<webview>`](/pt/docs/latest/api/webview-tag), you might need the pages and scripts loaded in your `<webview>` tag to open new windows. The `allowpopups` attribute enables them to create new [`BrowserWindows`](/pt/docs/latest/api/browser-window) using the `window.open()` method. `<webview>` tags are otherwise not allowed to create new windows.

#### Por que?

If you do not need popups, you are better off not allowing the creation of new [`BrowserWindows`](/pt/docs/latest/api/browser-window) by default. Isso segue o princípio de acesso mínimo necessário: não deixe um site criar novos pop-ups, a menos que você saiba que ele precisa desse recurso.

#### Como?

index.html (Renderer Process)

```javascript
<!-- Bad -->  
<webview allowpopups src="page.html"></webview>  
  
<!-- Good -->  
<webview src="page.html"></webview>  

```

### 12. Verifique as opções do WebView antes da criação

Um WebView criado em um processo de renderização que não tenha integração com Node.js habilitada não será capaz de habilitar a integração por si só. However, a WebView will always create an independent renderer process with its own `webPreferences`.

It is a good idea to control the creation of new [`<webview>`](/pt/docs/latest/api/webview-tag) tags from the main process and to verify that their webPreferences do not disable security features.

#### Por que?

Since `<webview>` live in the DOM, they can be created by a script running on your website even if Node.js integration is otherwise disabled.

O Electron permite que os desenvolvedores desabilitem vários recursos de segurança que controlam um processo de renderização. In most cases, developers do not need to disable any of those features - and you should therefore not allow different configurations for newly created [`<webview>`](/pt/docs/latest/api/webview-tag) tags.

#### Como?

Before a [`<webview>`](/pt/docs/latest/api/webview-tag) tag is attached, Electron will fire the `will-attach-webview` event on the hosting `webContents`. Use the event to prevent the creation of `webViews` with possibly insecure options.
main.js (Main Process)

```javascript
app.on('web-contents-created', (event, contents) => {  
  contents.on('will-attach-webview', (event, webPreferences, params) => {  
    // Strip away preload scripts if unused or verify their location is legitimate  
    delete webPreferences.preload  
  
    // Disable Node.js integration  
    webPreferences.nodeIntegration = false  
  
    // Verify URL being loaded  
    if (!params.src.startsWith('https://example.com/')) {  
      event.preventDefault()  
    }  
  })  
})  

```

Again, this list merely minimizes the risk, but does not remove it. Se o seu objetivo é exibir um site, um navegador será uma opção mais segura.

### 13. Desativar ou limitar a navegação

Se o seu aplicativo não precisa navegar ou precisa navegar apenas para páginas conhecidas, é uma boa ideia limitar a navegação totalmente a esse escopo conhecido, não permitindo qualquer outro tipo de navegação.

#### Por que?

A navegação é um vetor de ataque comum. If an attacker can convince your app to navigate away from its current page, they can possibly force your app to open web sites on the Internet. Even if your `webContents` are configured to be more secure (like having `nodeIntegration` disabled or `contextIsolation` enabled), getting your app to open a random web site will make the work of exploiting your app a lot easier.

A common attack pattern is that the attacker convinces your app's users to interact with the app in such a way that it navigates to one of the attacker's pages. This is usually done via links, plugins, or other user-generated content.

#### Como?

If your app has no need for navigation, you can call `event.preventDefault()` in a [`will-navigate`](/pt/docs/latest/api/web-contents#event-will-navigate) handler. If you know which pages your app might navigate to, check the URL in the event handler and only let navigation occur if it matches the URLs you're expecting.

We recommend that you use Node's parser for URLs. Simple string comparisons can sometimes be fooled - a `startsWith('https://example.com')` test would let `https://example.com.attacker.com` through.
main.js (Main Process)

```javascript
const { app } = require('electron')  
  
const { URL } = require('node:url')  
  
app.on('web-contents-created', (event, contents) => {  
  contents.on('will-navigate', (event, navigationUrl) => {  
    const parsedUrl = new URL(navigationUrl)  
  
    if (parsedUrl.origin !== 'https://example.com') {  
      event.preventDefault()  
    }  
  })  
})  

```

### 14. Disable or limit creation of new windows

If you have a known set of windows, it's a good idea to limit the creation of additional windows in your app.

#### Por que?

Much like navigation, the creation of new `webContents` is a common attack vector. Attackers attempt to convince your app to create new windows, frames, or other renderer processes with more privileges than they had before; or with pages opened that they couldn't open before.

If you have no need to create windows in addition to the ones you know you'll need to create, disabling the creation buys you a little bit of extra security at no cost. This is commonly the case for apps that open one `BrowserWindow` and do not need to open an arbitrary number of additional windows at runtime.

#### Como?

[`webContents`](/pt/docs/latest/api/web-contents) will delegate to its [window open handler](/pt/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler) before creating new windows. The handler will receive, amongst other parameters, the `url` the window was requested to open and the options used to create it. We recommend that you register a handler to monitor the creation of windows, and deny any unexpected window creation.
main.js (Main Process)

```javascript
const { app, shell } = require('electron')  
  
app.on('web-contents-created', (event, contents) => {  
  contents.setWindowOpenHandler(({ url }) => {  
    // In this example, we'll ask the operating system  
    // to open this event's url in the default browser.  
    //  
    // See the following item for considerations regarding what  
    // URLs should be allowed through to shell.openExternal.  
    if (isSafeForExternalOpen(url)) {  
      setImmediate(() => {  
        shell.openExternal(url)  
      })  
    }  
  
    return { action: 'deny' }  
  })  
})  

```

### 15. Não use `shell.openExternal` com conteúdo não confiável

The shell module's [`openExternal`](/pt/docs/latest/api/shell#shellopenexternalurl-options) API allows opening a given protocol URI with the desktop's native utilities. No macOS, por exemplo, esta função é semelhante ao utilitário de comando de terminal `open` e abrirá o aplicativo específico com base na URI e na associação do tipo de arquivo.

#### Por que?

Improper use of [`openExternal`](/pt/docs/latest/api/shell#shellopenexternalurl-options) can be leveraged to compromise the user's host. Quando o openExternal é usado com conteúdo não confiável, ele pode ser utilizado para executar comandos arbitrários.

#### Como?

main.js (Main Process)

```javascript
//  Bad  
const { shell } = require('electron')  
  
shell.openExternal(USER_CONTROLLED_DATA_HERE)  

```

main.js (Main Process)

```javascript
//  Good  
const { shell } = require('electron')  
  
shell.openExternal('https://example.com/index.html')  

```

### 16. Use uma versão atual do Electron

Você deve se esforçar para sempre usar a versão mais recente disponível do Electron. Sempre que uma nova versão principal for lançada, você deve tentar atualizar seu aplicativo o mais rápido possível.

#### Por que?

Um aplicativo criado com uma versão mais antiga do Electron, Chromium e Node.js é um alvo mais fácil do que um aplicativo que usa versões mais recentes desses componentes. De modo geral, problemas de segurança e exploits em versões mais antigas do Chromium e do Node.js estão mais amplamente disponíveis.

Tanto o Chromium quanto o Node.js são feitos impressionantes de engenharia, criados por milhares de desenvolvedores talentosos. Dada a sua popularidade, sua segurança é cuidadosamente testada e analisada por pesquisadores de segurança igualmente qualificados. Many of those researchers [disclose vulnerabilities responsibly](https://en.wikipedia.org/wiki/Responsible_disclosure), which generally means that researchers will give Chromium and Node.js some time to fix issues before publishing them. Seu aplicativo será mais seguro se estiver executando uma versão recente do Electron (e, portanto, do Chromium e do Node.js), para a qual os potenciais problemas de segurança não são tão amplamente conhecidos.

#### Como?

Migrate your app one major version at a time, while referring to Electron's [Breaking Changes](/pt/docs/latest/breaking-changes) document to see if any code needs to be updated.

### 17. Validate the `sender` of all IPC messages

You should always validate incoming IPC messages `sender` property to ensure you aren't performing actions or sending information to untrusted renderers.

#### Por que?

Todos os Web Frames podem, em teoria, enviar mensagens IPC para o processo principal, incluindo iframes e janelas filhas em alguns cenários  Se você tiver uma mensagem IPC que retorna dados do usuário ao remetente via `event.reply` ou executa ações privilegiadas que o renderizador não consegue nativamente, você deve garantir que não está ouvindo quadros da web de terceiros.

Você deve validar o `sender` de **all** as mensagens IPC por padrão.

#### Como?

main.js (Main Process)

```javascript
// Bad  
ipcMain.handle('get-secrets', () => {  
  return getSecrets()  
})  
  
// Good  
ipcMain.handle('get-secrets', (e) => {  
  if (!validateSender(e.senderFrame)) return null  
  return getSecrets()  
})  
  
function validateSender (frame) {  
  // Validate the host of the URL using an actual URL parser and an allowlist  
  if ((new URL(frame.url)).host === 'electronjs.org') return true  
  return false  
}  

```

### 18. Evite o uso do protocolo `file://` e prefira o uso de protocolos personalizados

You should serve local pages from a custom protocol instead of the `file://` protocol.

#### Por que?

The `file://` protocol gets more privileges in Electron than in a web browser and even in browsers it is treated differently to http/https URLs. Using a custom protocol allows you to be more aligned with classic web url behavior while retaining even more control about what can be loaded and when.

Pages running on `file://` have unilateral access to every file on your machine meaning that XSS issues can be used to load arbitrary files from the users machine. Using a custom protocol prevents issues like this as you can limit the protocol to only serving a specific set of files.

#### Como?

Follow the [`protocol.handle`](/pt/docs/latest/api/protocol#protocolhandlescheme-handler) examples to learn how to serve files / content from a custom protocol.

### 19. Verifique quais fusíveis você pode trocar

Electron ships with a number of options that can be useful but a large portion of applications probably don't need. In order to avoid having to build your own version of Electron, these can be turned off or on using [Fuses](/pt/docs/latest/tutorial/fuses).

#### Por que?

Some fuses, like `runAsNode` and `nodeCliInspect`, allow the application to behave differently when run from the command line using specific environment variables or CLI arguments. These can be used to execute commands on the device through your application.

This can let external scripts run commands that they potentially would not be allowed to, but that your application might have the rights for.

#### Como?

[`@electron/fuses`](https://npmjs.com/package/@electron/fuses) is a module we made to make flipping these fuses easy. Check out the README of that module for more details on usage and potential error cases, and refer to [How do I flip fuses?](/pt/docs/latest/tutorial/fuses#how-do-i-flip-fuses) in our documentation.

### 20. Não exponha as APIs do Electron a conteúdos web não confiáveis

You should not directly expose Electron's APIs, especially IPC, to untrusted web content in your preload scripts.

#### Por que?

Exposing raw APIs like `ipcRenderer.on` is dangerous because it gives renderer processes direct access to the entire IPC event system, allowing them to listen for any IPC events, not just the ones intended for them.

To avoid that exposure, we also cannot pass callbacks directly through: The first argument to IPC event callbacks is an `IpcRendererEvent` object, which includes properties like `sender` that provide access to the underlying `ipcRenderer` instance. Even if you only listen for specific events, passing the callback directly means the renderer gets access to this event object.

In short, we want the untrusted web content to only have access to necessary information and APIs.

#### Como?

preload

```javascript
// Bad  
contextBridge.exposeInMainWorld('electronAPI', {  
  on: ipcRenderer.on  
})  
  
// Also bad  
contextBridge.exposeInMainWorld('electronAPI', {  
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback)  
})  
  
// Good  
contextBridge.exposeInMainWorld('electronAPI', {  
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value))  
})  

```

> [!NOTE]
> 

> info

> 

For more information on what `contextIsolation` is and how to use it to secure your app, please see the [Context Isolation](/pt/docs/latest/tutorial/context-isolation) document.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/security.md)[AnteriorPerformance](/pt/docs/latest/tutorial/performance)[AvançarExamples Overview](/pt/docs/latest/tutorial/examples)

- [Prefácio](#prefácio)
- [Diretrizes gerais](#diretrizes-gerais)

  - [Segurança é da responsabilidade de todos](#segurança-é-da-responsabilidade-de-todos)
  - [Isolamento para conteúdo não confiável](#isolamento-para-conteúdo-não-confiável)

- [Lista de verificação: Recomendações de segurança](#lista-de-verificação-recomendações-de-segurança)

  - [1. Apenas carregar conteúdo seguro](#1-apenas-carregar-conteúdo-seguro)
  - [2. Não habilite a integração do Node.js para conteúdo remoto](#2-não-habilite-a-integração-do-nodejs-para-conteúdo-remoto)
  - [3. Habilitar isolamento de contexto](#3-habilitar-isolamento-de-contexto)
  - [4. Habilitar processo de sandboxing](#4-habilitar-processo-de-sandboxing)
  - [5. Handle session permission requests from remote content](#5-handle-session-permission-requests-from-remote-content)
  - [6. Não desabilite o `webSecurity`](#6-não-desabilite-o-websecurity)
  - [7. Define a Content Security Policy](#7-define-a-content-security-policy)
  - [8. Não habilite `allowRunningInsecureContent`](#8-não-habilite-allowrunninginsecurecontent)
  - [9. Não habilite recursos experimentais](#9-não-habilite-recursos-experimentais)
  - [10. Não use `enableBlinkFeatures`](#10-não-use-enableblinkfeatures)
  - [11. Não use `allowpopups` para WebViews](#11-não-use-allowpopups-para-webviews)
  - [12. Verifique as opções do WebView antes da criação](#12-verifique-as-opções-do-webview-antes-da-criação)
  - [13. Desativar ou limitar a navegação](#13-desativar-ou-limitar-a-navegação)
  - [14. Disable or limit creation of new windows](#14-disable-or-limit-creation-of-new-windows)
  - [15. Não use `shell.openExternal` com conteúdo não confiável](#15-não-use-shellopenexternal-com-conteúdo-não-confiável)
  - [16. Use uma versão atual do Electron](#16-use-uma-versão-atual-do-electron)
  - [17. Validate the `sender` of all IPC messages](#17-validate-the-sender-of-all-ipc-messages)
  - [18. Evite o uso do protocolo `file://` e prefira o uso de protocolos personalizados](#18-evite-o-uso-do-protocolo-file-e-prefira-o-uso-de-protocolos-personalizados)
  - [19. Verifique quais fusíveis você pode trocar](#19-verifique-quais-fusíveis-você-pode-trocar)
  - [20. Não exponha as APIs do Electron a conteúdos web não confiáveis](#20-não-exponha-as-apis-do-electron-a-conteúdos-web-não-confiáveis)

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
