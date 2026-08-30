---
title: "Pré-requisitos"
description: "[!NOTE]"
topics:
  - "Primeiros passos"
keywords:
  - "Pré-requisitos"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/tutorial-prerequisites"
---

# Pré-requisitos

> [!NOTE]
> 

> Acompanhe o tutorial

> 

Esta é a **parte 1** do tutorial de Electron.

1. **[Pré-requisitos](/pt/docs/latest/tutorial/tutorial-prerequisites)**

2. [Criando seu primeiro aplicativo](/pt/docs/latest/tutorial/tutorial-first-app)

3. [Usando scripts de pré-carregamento](/pt/docs/latest/tutorial/tutorial-preload)

4. [Adicionando recursos](/pt/docs/latest/tutorial/tutorial-adding-features)

5. [Empacotando seu aplicativo](/pt/docs/latest/tutorial/tutorial-packaging)

6. [Publicando e atualizando](/pt/docs/latest/tutorial/tutorial-publishing-updating)

Electron é um framework que te permite criar aplicações desktop com JavaScript, HTML e CSS. Ao incorporar [Chromium](https://www.chromium.org/) e[ Node.js](https://nodejs.org/) em um único arquivo binário, o Electron permite que você crie aplicativos multiplataformas que funcionam no Windows, macOS e Linux com um único código JavaScript.

Este tutorial irá guia-lo através do processo de desenvolvimento de uma aplicação desktop com Electron, e distribui-la aos usuários finais.

## Objetivos

Este tutorial começa guiando você através do processo de construção de um aplicativo mínimo Electron a partir do zero, em seguida ensinar a você como empacotar e distribuir aos usuários usando Electron Forge.

Se você prefere começar um projeto com um único comando boilerplate, recomendamos que você inicie com o comando Electron Forge [`create-electron-app`](https://www.electronforge.io/).

## Pressupostos

Electron é uma camada wrapper nativa para aplicativos web sendo executado em um ambiente Node.js. Portanto, este tutorial presume que você está familiarizado com o Node e os conceitos básicos de desenvolvimento web de front-end. Se você precisar fazer alguma leitura em segundo plano antes de continuar, recomendamos os seguintes recursos:

- [Começando com a Web (MDN Web Docs)](https://developer.mozilla.org/en-US/docs/Learn/)

- [Introdução ao Node.js](https://nodejs.dev/en/learn/)

## Ferramentas necessárias

### Editor de código

Você vai precisar de um editor de texto para escrever seu código. Recomendamos usar o [Visual Studio Code](https://code.visualstudio.com/), embora possa escolher qualquer um que preferir.

### Linha de comando

Ao longo do tutorial, pediremos que você use várias interfaces com linha de comando (CLIs). Você pode digitar estes comandos no seu terminal padrão do sistema:

- Windows: Prompt de Comando ou PowerShell

- macOS: Terminal

- Linux: vários dependendo da distribuição (por exemplo, GNOME Terminal, Konsole)

A maioria dos editores de código também vem com um terminal integrado, que você também pode usar.

### Git e GitHub

Git é um sistema comum de controle de versão para código-fonte, e o GitHub é uma plataforma de desenvolvimento colaborativa construída sobre ela. Embora nenhum seja necessário para construir uma aplicação Electron, usaremos versões GitHub para configurar atualizações automáticas mais tarde no tutorial. Portanto, precisamos que você:

- [Crie uma conta no GitHub](https://github.com/join)

- [Instale o Git](https://github.com/git-guides/install-git)

Se você não estiver familiarizado com a forma que o Git funciona, recomendamos que leia o [Guia Git](https://github.com/git-guides/) do GitHub. Você também pode usar o aplicativo [GitHub Desktop](https://desktop.github.com/) se você prefere uma interface visual em vez da linha de comando.

Recomendamos que você crie um repositório Git local e publique-o no GitHub antes de começar o tutorial, e faça um commit do seu código após cada passo.

> [!NOTE]
> 

> Instalando Git via GitHub Desktop

> 

GitHub Desktop irá instalar no seu sistema a versão mais recente do Git se você ainda não tem instalado.

### Node.js e npm

Para começar a desenvolver um aplicativo Electron, você precisa instalar o [Node.js](https://nodejs.org/en/download/) runtime e seu gerenciador de pacotes npm ao seu sistema. Nós recomendamos que você use a última versão long-term-support (LTS).

Por favor, instale o Node.js usando instaladores específicos para sua plataforma. Caso contrário, você pode encontrar problemas de incompatibilidade com ferramentas de desenvolvimento diferentes. Se você estiver usando macOS, recomendamos que use um gerenciador de pacotes como [Homebrew](https://brew.sh/) ou [nvm](https://github.com/nvm-sh/nvm) para evitar quais problemas de permissão de diretório.

Para verificar se o Node.js foi instalando corretamente, você pode usar `-v` quando executando os comandos `node` e `npm`. Estas devem imprimir as versões instaladas.

```javascript
$ node -v  
v16.14.2  
$ npm -v  
8.7.0  

```

:::atenção

Embora você precisa do Node.js instalado localmente para fazer um projeto Electron, Electron **não usa o Node.js do seu sistema para executar o seu código**. Ao invés disso, vem com seu próprio Node.js runtime. Isto significa que seus usuários finais não precisam instalar o Node.js com pré-requisito para executar seu aplicativo.

Para verificar qual versão do Node.js está sendo executada em seu aplicativo, você pode acessar a variável global [`process.versions`](https://nodejs.org/api/process.html#processversions) no processo principal ou no script de pré-carregamento. Você pode referenciar também [https://releases.electronjs.org/releases.json](https://releases.electronjs.org/releases.json).

:::[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/tutorial-1-prerequisites.md)[AnteriorPor que Electron](/pt/docs/latest/por-que-electron)[AvançarCriando seu primeiro aplicativo](/pt/docs/latest/tutorial/tutorial-first-app)

- [Objetivos](#objetivos)
- [Pressupostos](#pressupostos)
- [Ferramentas necessárias](#ferramentas-necessárias)

  - [Editor de código](#editor-de-código)
  - [Linha de comando](#linha-de-comando)
  - [Git e GitHub](#git-e-github)
  - [Node.js e npm](#nodejs-e-npm)

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
