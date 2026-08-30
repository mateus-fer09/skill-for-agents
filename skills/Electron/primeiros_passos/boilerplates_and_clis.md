---
title: "Boilerplates e CLIs"
description: "O desenvolvimento em Electron não é preconizado - não há "uma maneira única" de se desenvolver, construir, empacotar ou lançar um aplicativo Electron. Recursos adicionais para o El"
topics:
  - "Primeiros passos"
keywords:
  - "Boilerplates e CLIs"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/boilerplates-and-clis"
---

# Boilerplates e CLIs

O desenvolvimento em Electron não é preconizado - não há "uma maneira única" de se desenvolver, construir, empacotar ou lançar um aplicativo Electron. Recursos adicionais para o Electron, tanto para o tempo de construção quanto para o tempo de execução, geralmente pode ser encontrado em pacotes individuais [npm](https://www.npmjs.com/search?q=electron), permitindo que os desenvolvedores criem ambos, o aplicativo e o pipeline de construção de que precisam.

Esse nível de modularidade e extensão garante que todos os desenvolvedores trabalhem com o Electron, ambas pequenas e grandes equipes, nunca serão restritas no que podem ou não fazer em qualquer momento durante o ciclo de vida de desenvolvimento. No entanto, para muitos desenvolvedores, uma das ferramentas de linha de comando ou boilerplates (códigos padrões) orientadas pela comunidade pode tornar dramaticamente mais fácil compilar, empacotar e liberar um aplicativo.

## Boilerplate vs CLI

Um boilerplate é apenas um ponto de partida - uma tela, por assim dizer - a partir do qual você constrói seu aplicativo. Eles geralmente vêm na forma de um repositório que você pode clonar e personalizar para o conteúdo que desejar.

Uma ferramenta de linha de comando, por outro lado, continua a apoiá-lo durante todo o desenvolvimento e liberação. Elas são mais úteis e colaborativas, mas aplicam as diretrizes sobre como seu código deve ser estruturado e construído. *Especialmente para iniciantes, usar uma ferramenta de linha de comando provavelmente será útil*.

## Electron Forge

Electron Forge is a tool for packaging and publishing Electron applications. It unifies Electron's tooling ecosystem into a single extensible interface so that anyone can jump right into making Electron apps.

O Forge vem com [um modelo pronto para usar](https://electronforge.io/templates) usando Webpack como um empacotador. Ele inclui um exemplo de configuração em typescript e fornece dois arquivos de configuração para facilitar a personalização. Ele usa os mesmos módulos de núcleo utilizados pela maior comunidade do Electron (como [`@electron/packager`](https://github.com/electron/packager)) – alterações feitas pelos mantenedores do Electron (como o Slack) beneficiam usuários do Forge, também.

Você pode encontrar mais informações e documentação em [electronforge.io](https://electronforge.io/).

## electron-builder

Uma "solução completa para empacotar e construir um aplicativo Electron pronto para distribuição" que foca em uma experiência integrada. O construtor [`electron-builder`](https://github.com/electron-userland/electron-builder) adiciona uma dependência única focada na simplicidade e gerencia todos os outros requisitos internamente.

`electron-builder` substitui recursos e módulos usados pelos mantenedores do Electron (como o atualizador automático) por um personalizado. Geralmente eles são mais integrados mas terão menos em comum com os populares aplicativos Electron como Atom, Visual Studio Code ou Slack.

Você pode encontrar mais informações e documentação no [repositório](https://github.com/electron-userland/electron-builder).

## electron-react-boilerplate

Se você não quer ferramentas, mas apenas um boilerplate sólido para construir, [`electron-react-boilerplate`](https://github.com/electron-react-boilerplate/electron-react-boilerplate) pode ser útil. É bastante popular na comunidade e usa `o construtor electron-builder` internamente.

## Outras Ferramentas e Boilerplates

A [Lista "Electron Incrível"](https://github.com/sindresorhus/awesome-electron#boilerplates) contém mais ferramentas e boilerplates para escolher. Se você achar que o comprimento da lista intimida, não se esqueça que adicionar ferramentas conforme você avança também é uma abordagem válida.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/boilerplates-and-clis.md)
