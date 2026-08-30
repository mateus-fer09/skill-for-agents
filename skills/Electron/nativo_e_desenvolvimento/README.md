---
title: "Desenvolvendo com Electron"
description: "Estes guias destinam-se a pessoas que trabalham no projeto Electron. For guides on Electron app development, see [/docs/README.md](/pt/docs/latest/README#guides-and-tutorials)."
topics:
  - "Nativo e desenvolvimento"
keywords:
  - "Desenvolvendo com Electron"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/development/README"
---

# Desenvolvendo com Electron

Estes guias destinam-se a pessoas que trabalham no projeto Electron. For guides on Electron app development, see [/docs/README.md](/pt/docs/latest/README#guides-and-tutorials).

## Índice

- [Problemas](/pt/docs/latest/development/issues)

- [Pull Requests](/pt/docs/latest/development/pull-requests)

- [Estilo da Documentação](/pt/docs/latest/development/coding-style#documentation)

- [Estrutura de Diretório do Código Fonte](/pt/docs/latest/development/source-code-directory-structure)

- [Estilo de Codificação](/pt/docs/latest/development/coding-style)

- [Using clang-tidy on C++ Code](/pt/docs/latest/development/clang-tidy)

- [Instruções de Compilação](/pt/docs/latest/development/build-instructions-gn)

  - [macOS](/pt/docs/latest/development/build-instructions-macos)

  - [Windows](/pt/docs/latest/development/build-instructions-windows)

  - [Linux](/pt/docs/latest/development/build-instructions-linux)

- [Desenvolvimento do Chromium](/pt/docs/latest/development/chromium-development)

- [V8 Desenvolvimento](/pt/docs/latest/development/v8-development)

- [Testando](/pt/docs/latest/development/testing)

- [Debugging](/pt/docs/latest/development/debugging)

- [Patches](/pt/docs/latest/development/patches)

## Introdução

In order to contribute to Electron, the first thing you'll want to do is get the code.

[Electron's `build-tools`](https://github.com/electron/build-tools) automate much of the setup for compiling Electron from source with different configurations and build targets.

If you would prefer to build Electron manually, see the [build instructions](/pt/docs/latest/development/build-instructions-gn).

Once you've checked out and built the code, you may want to take a look around the source tree to get a better idea of what each directory is responsible for. The [source code directory structure](/pt/docs/latest/development/source-code-directory-structure) gives a good overview of the purpose of each directory.

## Opening Issues on Electron

For any issue, there are generally three ways an individual can contribute:

1. By opening the issue for discussion

  - If you believe that you have found a new bug in Electron, you should report it by creating a new issue in the [`electron/electron` issue tracker](https://github.com/electron/electron/issues).

2. By helping to triage the issue

  - You can do this either by providing assistive details (a reproducible test case that demonstrates a bug) or by providing suggestions to address the issue.

3. By helping to resolve the issue

  - This can be done by demonstrating that the issue is not a bug or is fixed; but more often, by opening a pull request that changes the source in `electron/electron` in a concrete and reviewable manner.

See [issues](/pt/docs/latest/development/issues) for more information.

## Making a Pull Request to Electron

Most pull requests opened against the `electron/electron` repository include changes to either the C/C++ code in the `shell/` folder, the TypeScript code in the `lib/` folder, the documentation in `docs/`, or tests in the `spec/` folder.

See [pull requests](/pt/docs/latest/development/pull-requests) for more information.

If you want to add a new API module to Electron, you'll want to look in [creating API](/pt/docs/latest/development/creating-api).

## Governança

Electron has a fully-fledged governance system that oversees activity in Electron and whose working groups are responsible for areas like APIs, releases, and upgrades to Electron's dependencies including Chromium and Node.js. Depending on how frequently and to what end you want to contribute, you may want to consider joining a working group.

Details about each group and their responsibilities can be found in the [governance repo](https://github.com/electron/governance).

## Patches in Electron

Electron is built on two major upstream projects: Chromium and Node.js. Each of these projects has several of their own dependencies, too. We try our best to use these dependencies exactly as they are but sometimes we can't achieve our goals without patching those upstream dependencies to fit our use cases.

As such, we maintain a collection of patches as part of our source tree. The process for adding or altering one of these patches to Electron's source tree via a pull request can be found in [patches](/pt/docs/latest/development/patches).

## Debugging

There are many different approaches to debugging issues and bugs in Electron, many of which are platform specific.

For an overview of information related to debugging Electron itself (and not an app *built with Electron*), see [debugging](/pt/docs/latest/development/debugging).[Editar esta página](https://github.com/electron/electron/edit/main/docs/development/README.md)
