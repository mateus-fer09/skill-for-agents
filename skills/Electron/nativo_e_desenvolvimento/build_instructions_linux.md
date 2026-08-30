---
title: "Instruções para Configurar (Linux)"
description: "Follow the guidelines below for building Electron itself on Linux, for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the prebu"
topics:
  - "Nativo e desenvolvimento"
keywords:
  - "Instruções para Configurar (Linux)"
  - "target_cpu"
  - "clang"
  - "libtinfo.so.5"
  - "libncurses"
  - "clang_base_path"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/development/build-instructions-linux"
---

# Instruções para Configurar (Linux)

Follow the guidelines below for building **Electron itself** on Linux, for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the prebuilt Electron binaries, see the [application distribution](/pt/docs/latest/tutorial/application-distribution) guide.

## Pré-requisitos

Due to Electron's dependency on Chromium, prerequisites and dependencies for Electron change over time. [Chromium's documentation on building on Linux](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/linux/build_instructions.md) has up to date information for building Chromium on Linux. This documentation can generally be followed for building Electron on Linux as well.

Additionally, Electron's [Linux dependency installer](https://github.com/electron/build-images/blob/main/tools/install-deps.sh) can be referenced to get the current dependencies that Electron requires in addition to what Chromium installs via [build/install-deps.sh](https://chromium.googlesource.com/chromium/src/+/HEAD/build/install-build-deps.sh).

### Forçar compilação

If you want to build for an `arm` target, you can use Electron's [Linux dependency installer](https://github.com/electron/build-images/blob/main/tools/install-deps.sh) to install the additional dependencies by passing the `--arm argument`:

```javascript
$ sudo install-deps.sh --arm  

```

And to cross-compile for `arm` or targets, you should pass the `target_cpu` parameter to `gn gen`:

```javascript
$ gn gen out/Testing --args='import(...) target_cpu="arm"'  

```

## Compilando

See [Build Instructions: GN](/pt/docs/latest/development/build-instructions-gn)

## Solução de Problemas

### Erro ao carregar bibliotecas compartilhadas: libtinfo.so.5

Prebuilt `clang` will try to link to `libtinfo.so.5`. Depending on the host architecture, symlink to appropriate `libncurses`:

```javascript
$ sudo ln -s /usr/lib/libncurses.so.5 /usr/lib/libtinfo.so.5  

```

## Tópicos Avançados

The default building configuration is targeted for major desktop Linux distributions. To build for a specific distribution or device, the following information may help you.

### Usando o `clang` em vez de fazer o download dos binários de `clang`

Por padrão o Electron é feito com código binário [`clang`](https://clang.llvm.org/get_started.html) pre-produzido e fornecido pelo projeto Chromium. Se por alguma razão quer construir usando `clang` instalado no seu sistema, pode especificar o argumento `clang_base_path` nos argumentos do GN.

Por exemplo, se o `clang` estiver instalado em `/usr/local/bin/clang`:

```javascript
$ gn gen out/Testing --args='import("//electron/build/args/testing.gn") clang_base_path = "/usr/local/bin"'  

```

### Utilizando compiladores diferentes de `clang`

Construir Electron com compiladores diferentes de `clang` não é suportado.[Editar esta página](https://github.com/electron/electron/edit/main/docs/development/build-instructions-linux.md)
