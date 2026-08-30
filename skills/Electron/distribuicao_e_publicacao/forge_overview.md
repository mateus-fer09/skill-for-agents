---
title: "Distributing Apps With Electron Forge"
description: "Electron Forge is a tool for packaging and publishing Electron applications. It unifies Electron's build tooling ecosystem into a single extensible interface so that anyone can jum"
topics:
  - "Distribuicao e publicacao"
keywords:
  - "Distributing Apps With Electron Forge"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/forge-overview"
---

# Distributing Apps With Electron Forge

Electron Forge is a tool for packaging and publishing Electron applications. It unifies Electron's build tooling ecosystem into a single extensible interface so that anyone can jump right into making Electron apps.
Alternative tooling

If you do not want to use Electron Forge for your project, there are other third-party tools you can use to distribute your app.

These tools are maintained by members of the Electron community, and do not come with official support from the Electron project.

**Electron Builder**

Uma "solução completa para empacotar e construir um aplicativo Electron pronto para distribuição" que foca em uma experiência integrada. [`electron-builder`](https://github.com/electron-userland/electron-builder) adds a single dependency and manages all further requirements internally.

`electron-builder` substitui recursos e módulos usados pelos mantenedores do Electron (como o atualizador automático) por um personalizado.

**Hydraulic Conveyor**

A [desktop app deployment tool](https://hydraulic.dev) that supports cross-building/signing of all packages from any OS without the need for multi-platform CI, can do synchronous web-style updates on each start of the app, requires no code changes, can use plain HTTP servers for updates and which focuses on ease of use. Conveyor replaces the Electron auto-updaters with Sparkle on macOS, MSIX on Windows, and Linux package repositories.

Conveyor is a commercial tool that is free for open source projects. There's an example of [how to package GitHub Desktop](https://hydraulic.dev/blog/8-packaging-electron-apps.html) which can be used for learning.

## Guia de Introdução

The [Electron Forge docs](https://www.electronforge.io/) contain detailed information on taking your application from source code to your end users' machines. Isto inclui:

- Packaging your application [(package)](https://www.electronforge.io/cli#package)

- Generating executables and installers for each OS [(make)](https://www.electronforge.io/cli#make), and,

- Publishing these files to online platforms to download [(publish)](https://www.electronforge.io/cli#publish).

For beginners, we recommend following through Electron's [tutorial](/pt/docs/latest/tutorial/tutorial-prerequisites) to develop, build, package and publish your first Electron app. If you have already developed an app on your machine and want to start on packaging and distribution, start from [step 5](/pt/docs/latest/tutorial/tutorial-packaging) of the tutorial.

## Você precisa de ajuda

- If you need help with developing your app, our [community Discord server](https://discord.gg/APGC3k5yaH) is a great place to get advice from other Electron app developers.

- If you suspect you're running into a bug with Forge, please check the [GitHub issue tracker](https://github.com/electron/forge/issues) to see if any existing issues match your problem. If not, feel free to fill out our bug report template and submit a new issue.

[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/forge-overview.md)[AnteriorNative Code and Electron: C++ (Linux)](/pt/docs/latest/tutorial/native-code-and-electron-cpp-linux)[AvançarDistribution Overview](/pt/docs/latest/tutorial/distribution-overview)

- [Guia de Introdução](#guia-de-introdução)
- [Você precisa de ajuda](#você-precisa-de-ajuda)
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
