---
title: "Atualizando Aplicativos"
description: "Existem várias maneiras de fornecer atualizações automáticas para seu aplicativo Electron. The easiest and officially supported one is taking advantage of the built-in [Squirrel](h"
topics:
  - "Distribuicao e publicacao"
keywords:
  - "Atualizando Aplicativos"
  - "macUpdateManifestBaseUrl"
  - "remoteReleases"
  - "releases.json"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/updates"
---

# Atualizando Aplicativos

Existem várias maneiras de fornecer atualizações automáticas para seu aplicativo Electron. The easiest and officially supported one is taking advantage of the built-in [Squirrel](https://github.com/Squirrel) framework and Electron's [autoUpdater](/pt/docs/latest/api/auto-updater) module.

## Utilizando armazenamento de objeto em nuvem (serverless)

Para um fluxo serverless simples, o módulo autoUpdater do Electron pode verificar se existem atualizações disponívels apontando para uma URL estática que contenha os últimos metadados de versionamento.

Quando uma nova versão está disponível, o metadado precisa ser publicado para o armazenamento em nuvem juntamente da versão em si. O formato dos metadados é diferente para macOS e Windows.

### Publicando metadados de versionamento

Com o Electron Forge, você pode lançar atualizações de arquivos estáticos publicando artefatos de metadados diretamente do ZIP Maker (macOS) com o comando `macUpdateManifestBaseUrl` e do Squirell.Windows Maker (Windows) com `remoteReleases`.

Veja o artigo do Forge [Atualizações automáticas do S3](https://www.electronforge.io/config/publishers/s3#auto-updating-from-s3) para um exemplo completo.
Publicações manuais

No macOS, o Squirell.Mac pode receber atualizações lendo o arquivo `releases.json` com o seguinte formato JSON:releases.json

```javascript
{  
  "currentRelease": "1.2.3",  
  "releases": [  
    {  
      "version": "1.2.1",  
      "updateTo": {  
        "version": "1.2.1",  
        "pub_date": "2023-09-18T12:29:53+01:00",  
        "notes": "These are some release notes innit",  
        "name": "1.2.1",  
        "url": "https://mycompany.example.com/myapp/releases/myrelease"  
      }  
    },  
    {  
      "version": "1.2.3",  
      "updateTo": {  
        "version": "1.2.3",  
        "pub_date": "2024-09-18T12:29:53+01:00",  
        "notes": "These are some more release notes innit",  
        "name": "1.2.3",  
        "url": "https://mycompany.example.com/myapp/releases/myrelease3"  
      }  
    }  
  ]  
}  

```

No Windows, o Squirell.Windows pode receber atualizações lendo o arquivo RELEASES gerado durante o processo de build. Este arquivo detalha o pacote delta `.nupkg` para o qual atualizar.RELEASES

```javascript
B0892F3C7AC91D72A6271FF36905FEF8FE993520 electron-fiddle-0.36.3-full.nupkg 103298365  

```

Estes arquivos devem ficar no mesmo diretório da sua versão, dentro de uma estrutura de pastas que esteja de acordo com a plataforma e arquitetura do seu aplicativo.

Como por exemplo:

```javascript
my-app-updates/  
├─ darwin/  
│  ├─ x64/  
│  │  ├─ my-app-1.0.0-darwin-x64.zip  
│  │  ├─ my-app-1.1.0-darwin-x64.zip  
│  │  ├─ RELEASES.json  
│  ├─ arm64/  
│  │  ├─ my-app-1.0.0-darwin-arm64.zip  
│  │  ├─ my-app-1.1.0-darwin-arm64.zip  
│  │  ├─ RELEASES.json  
├─ win32/  
│  ├─ x64/  
│  │  ├─ my-app-1.0.0-win32-x64.exe  
│  │  ├─ my-app-1.0.0-win32-x64.nupkg  
│  │  ├─ my-app-1.1.0-win32-x64.exe  
│  │  ├─ my-app-1.1.0-win32-x64.nupkg  
│  │  ├─ RELEASES  

```

### Lendo os metadados de versionamento

A maneira mais fácil de consumir os metadados é instalando o [update-electron-app](https://github.com/electron/update-electron-app), um módulo Node.js que configura o autoUpdater e exibe ao usuário uma janela de diálogo nativa.

For static storage updates, point the `updateSource.baseUrl` parameter to the directory containing your release metadata files.
main.js

```javascript
const { updateElectronApp, UpdateSourceType } = require('update-electron-app')  
  
updateElectronApp({  
  updateSource: {  
    type: UpdateSourceType.StaticStorage,  
    baseUrl: `https://my-bucket.s3.amazonaws.com/my-app-updates/${process.platform}/${process.arch}`  
  }  
})  

```

## Using update.electronjs.org

A equipe do Electron mantém [update.electronjs.org](https://github.com/electron/update.electronjs.org), um webservice gratuito e de código aberto que os aplicativos Electron podem usar para se auto-atualizar. O serviço é destinado para apps Electron que atendem os seguintes critérios:

- O app roda no macOS ou no Windows

- O app tem um repositório GitHub público

- Builds são publicadas em [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)

- Builds are [code-signed](/pt/docs/latest/tutorial/code-signing) **(macOS only)**

A forma mais fácil de usar este serviço é instalando o [update-electron-app](https://github.com/electron/update-electron-app), um módulo Node.js pre-configurado para ser usado com update.electronjs.org.

Instale o módulo usando seu gerenciador de pacotes Node.js de preferência:

- npm
- Yarn

```javascript
npm install update-electron-app  

```

```javascript
yarn add update-electron-app  

```

Em seguida, importe o pacote do atualizador no arquivo principal do projeto:
main.js

```javascript
require('update-electron-app')()  

```

Por padrão, este módulo irá verificar atualizações na inicialização do aplicativo, e a cada dez minutos. Quando uma atualização for encontrada, ela será baixada automaticamente em segundo plano. Quando o download é concluído, uma caixa de diálogo será exibida permitindo que o usuário reinicie o aplicativo.

Se precisar personalizar sua configuração, você pode [passar argumentos para o update-electron-app](https://github.com/electron/update-electron-app) ou [usar o serviço de atualização diretamente](https://github.com/electron/update.electronjs.org).

## Usando outros serviços de atualização

Se você estiver desenvolvendo um aplicativo Electron privado, ou se não é publicado versões no GitHub Releases, pode ser necessário executar o seu próprio servidor de atualização.

### Passo 1: Implementando um servidor de atualização

Dependendo de suas necessidades, você pode escolher um destes:

- [Hazel](https://github.com/vercel/hazel) – Servidor de Atualização para aplicativos privados ou de código aberto que podem ser implantados gratuitamente na [Vercel](https://vercel.com). Ele puxa do [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release) e utiliza o poder dos GitHub CDN.

- [Nuts](https://github.com/GitbookIO/nuts) - Também usar [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release), mas armazena em cache as atualizações do app no disco e suporta repositórios.

- [electron-resease-server](https://github.com/ArekSredzki/electron-release-server) - Fornece um painel para a manipulação de versões e não requer lançamentos que se originam do GitHub.

- [Nucleus](https://github.com/atlassian/nucleus) - Um servidor de atualização completo para Electron apps mantido pela Atlassian. Suporta múltiplas aplicações e canais; usar um armazenamento de arquivo estático para diminuir o custo do servidor.

Dado que você fez implementar no seu servidor de atualizações, você pode modificar o código do seu 'app' para receber e aplicar as atualizações com o módulo [[AutoUpdater]](/pt/docs/latest/api/auto-updater) do Electron.

### Passo 2: Recebendo atualizações no seu 'app'

Primeiro, importe os módulos necessários no arquivo principal do projeto. O código a seguir pode variar para diferentes softwares de servidor, mas ele funciona como descrito ao usar o [Hazel](https://github.com/vercel/hazel).

> [!WARNING]
> 

> Verifique seu ambiente de execução!

> 

Por favor, certifique-se de que o código abaixo será executado apenas no seu aplicativo empacotado, e não em desenvolvimento. You can use the [app.isPackaged](/pt/docs/latest/api/app#appispackaged-readonly) API to check the environment.
main.js

```javascript
const { app, autoUpdater, dialog } = require('electron')  

```

Next, construct the URL of the update server feed and tell [autoUpdater](/pt/docs/latest/api/auto-updater) about it:
main.js

```javascript
const server = 'https://your-deployment-url.com'  
const url = `${server}/update/${process.platform}/${app.getVersion()}`  
  
autoUpdater.setFeedURL({ url })  

```

Como etapa final, verifique se há atualizações. O exemplo abaixo irá verificar a cada minuto:
main.js

```javascript
setInterval(() => {  
  autoUpdater.checkForUpdates()  
}, 60000)  

```

Once your application is [packaged](/pt/docs/latest/tutorial/application-distribution), it will receive an update for each new [GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release) that you publish.

### Passo 3: Notificando os usuários quando atualizações estiverem disponíveis

Agora que você configurou um Sistema de Atualização básico para sua aplicação, você precisa garantir que o usuário será notificado quando houver uma atualização. This can be achieved using the [autoUpdater API events](/pt/docs/latest/api/auto-updater#events):
main.js

```javascript
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {  
  const dialogOpts = {  
    type: 'info',  
    buttons: ['Reiniciar', 'Mais Tarde'],  
    title: 'Atualização Disponivel',  
    message: process.platform === 'win32' ? releaseNotes : releaseName,  
    detail:  
      'Uma nova versão foi Baixada. Restart the application to apply the updates.'  
  }  
  
  dialog.showMessageBox(dialogOpts).then((returnValue) => {  
    if (returnValue.response === 0) autoUpdater.quitAndInstall()  
  })  
})  

```

Also make sure that errors are [being handled](/pt/docs/latest/api/auto-updater#event-error). Segue um exemplo como debugar e enviar para o `stderr`:
main.js

```javascript
autoUpdater.on('error', (message) => {  
  console.error('Ocorreu um erro ao atualizar o aplicativo')  
  console.error(message)  
})  

```

> [!NOTE]
> 

> Manipulando atualizações manualmente

> 

Como as solicitações feitas pelo autoUpdate não estão sob seu controle direto, você pode encontrar situações difíceis ao manusear (como caso o servidor de atualização estiver por trás de uma autenticação). O campo `url` suporta o protocolo `file://`, o que significa que, com algum esforço, você pode evitar o aspecto de comunicação do servidor do processo, enviando sua atualização a partir de um diretório local. [Aqui está um exemplo de como isso pode funcionar](https://github.com/electron/electron/issues/5020#issuecomment-477636990).

## Update server specification

For advanced deployment needs, you can also roll out your own Squirrel-compatible update server. For example, you may want to have percentage-based rollouts, distribute your app through separate release channels, or put your update server behind an authentication check.

Squirrel.Windows and Squirrel.Mac clients require different response formats, but you can use a single server for both platforms by sending requests to different endpoints depending on the value of `process.platform`.
main.js

```javascript
const { app, autoUpdater } = require('electron')  
  
const server = 'https://your-deployment-url.com'  
// e.g. for Windows and app version 1.2.3  
// https://your-deployment-url.com/update/win32/1.2.3  
const url = `${server}/update/${process.platform}/${app.getVersion()}`  
  
autoUpdater.setFeedURL({ url })  

```

### Windows

A Squirrel.Windows client expects the update server to return the `RELEASES` artifact of the latest available build at the `/RELEASES` subpath of your endpoint.

For example, if your feed URL is `https://your-deployment-url.com/update/win32/1.2.3`, then the `https://your-deployment-url.com/update/win32/1.2.3/RELEASES` endpoint should return the contents of the `RELEASES` artifact of the version you want to serve.
https://your-deployment-url.com/update/win32/1.2.3/RELEASES

```javascript
B0892F3C7AC91D72A6271FF36905FEF8FE993520 https://your-static.storage/your-app-1.2.3-full.nupkg 103298365  

```

Squirrel.Windows does the comparison check to see if the current app should update to the version returned in `RELEASES`, so you should return a response even when no update is available.

### macOS

When an update is available, the Squirrel.Mac client expects a JSON response at the feed URL's endpoint. This object has a mandatory `url` property that maps to a ZIP archive of the app update. All other properties in the object are optional.
https://your-deployment-url.com/update/darwin/0.31.0

```javascript
{  
    "url": "https://your-static.storage/your-app-1.2.3-darwin.zip",  
    "name": "1.2.3",  
    "notes": "These are some release notes innit",  
    "pub_date": "2024-09-18T12:29:53+01:00"  
}  

```

If no update is available, the server should return a [`204 No Content`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204) HTTP response.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/updates.md)[AnteriorAssinando Código](/pt/docs/latest/tutorial/code-signing)[AvançarGuia para Mac App Store](/pt/docs/latest/tutorial/mac-app-store-submission-guide)

- [Utilizando armazenamento de objeto em nuvem (serverless)](#utilizando-armazenamento-de-objeto-em-nuvem-serverless)

  - [Publicando metadados de versionamento](#publicando-metadados-de-versionamento)
  - [Lendo os metadados de versionamento](#lendo-os-metadados-de-versionamento)

- [Using update.electronjs.org](#using-updateelectronjsorg)
- [Usando outros serviços de atualização](#usando-outros-serviços-de-atualização)

  - [Passo 1: Implementando um servidor de atualização](#passo-1-implementando-um-servidor-de-atualização)
  - [Passo 2: Recebendo atualizações no seu 'app'](#passo-2-recebendo-atualizações-no-seu-app)
  - [Passo 3: Notificando os usuários quando atualizações estiverem disponíveis](#passo-3-notificando-os-usuários-quando-atualizações-estiverem-disponíveis)

- [Update server specification](#update-server-specification)

  - [Windows](#windows)
  - [macOS](#macos)

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
