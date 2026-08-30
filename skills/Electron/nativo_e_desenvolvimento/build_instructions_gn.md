---
title: "Instruções de Compilação"
description: "Follow the guidelines below for building Electron itself , for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the prebuilt Elec"
topics:
  - "Nativo e desenvolvimento"
keywords:
  - "Instruções de Compilação"
  - "main"
  - "DEPS"
  - "gclient"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/development/build-instructions-gn"
---

# Instruções de Compilação

Follow the guidelines below for building **Electron itself**, for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the prebuilt Electron binaries, see the [application distribution](/pt/docs/latest/tutorial/application-distribution) guide.

## Pré-requisitos da plataforma

Verifique os pré-requisitos de compilação para sua plataforma antes de prosseguir:

- [macOS](/pt/docs/latest/development/build-instructions-macos#prerequisites)

- [Linux](/pt/docs/latest/development/build-instructions-linux#prerequisites)

- [Windows](/pt/docs/latest/development/build-instructions-windows#prerequisites)

## Setting up `@electron/build-tools` (recommended)

[Electron Build Tools](https://github.com/electron/build-tools) automate much of the setup for compiling Electron from source with different configurations and build targets. Most of the [manual setup](#manual-setup-advanced) instructions can be replaced by simpler Build Tools commands.

> 

[!TIP] Build Tools also gives you access to [remote execution and caching of build actions](/pt/docs/latest/development/reclient), which will dramatically improve build times.

Electron Build Tools can be installed globally from npm:

```javascript
npm install -g @electron/build-tools  

```

Once installed, the `e` command should be globally available in your command line. The `e init` command bootstraps a local checkout of Electron:

```javascript
# The 'Hello, World!' of build-tools: get and build `main`  
# Choose the directory where Electron's source and build files will reside.  
# You can specify any path you like; this command defaults to `$PWD/electron`.  
# If you're going to use multiple branches, you may want something like:  
# `--root=~/electron/branch` (e.g. `~/electron-gn/main`)  
e init --root=~/electron --bootstrap testing  

```

The `--bootstrap` flag also runs `e sync` (synchronizes source code branches from [`DEPS`](https://github.com/electron/electron/blob/v43.4.0/DEPS) using [`gclient`](https://chromium.googlesource.com/chromium/tools/depot_tools.git/+/HEAD/README.gclient.md)) and `e build` (compiles the Electron binary into the `${root}/src/out` folder).

> [!NOTE]
> 

> info

> 

Sometime after the initial `e sync` phase, you will be asked to run `e d rbe login` to auth into remote build execution and proceed into the build. This may take about 20-30 minutes!

Once the build is done compiling, you can test it by running `e start` (or by loading it into [Electron Fiddle](http://electronjs.org/fiddle)).

### Navigating the project

Some quick tips on building once your checkout is set up:

- **Directory structure:** Within the project, Chromium code is synced to `${root}/src/` while Electron's code (i.e. code in [https://github.com/electron/electron](https://github.com/electron/electron)) lives in `${root}/src/electron/`. Note that both directories have their own git repositories.

- **Updating your checkout:** Run git commands such as `git checkout <branch>` and `git pull` from `${root}/src/electron`. Whenever you update your commit `HEAD`, make sure to `e sync` before `e build` to sync dependencies such as Chromium and Node.js. This is especially relevant because the Chromium version in [`DEPS`](https://github.com/electron/electron/blob/v43.4.0/DEPS) changes frequently.

- **Rebuilding:** When making changes to code in `${root}/src/electron/` in a local branch, you only need to re-run `e build`.

- **Adding patches:** When contributing changes in `${root}/src/` outside of `${root}/src/electron/`, you need to do so via Electron's [patch system](/pt/docs/latest/development/patches). The `e patches` command can export all relevant patches to `${root}/src/electron/patches/` once your code change is ready.

> 

[!IMPORTANT] Unless you're applying upstream patches, you should treat `${root}/src/` as a read-only folder and spend most of your development time in `${root}/src/electron/`. You should not need to make any changes or run `git` commands in `${root}/src/`.

> 

[!TIP] Detailed documentation for all available `e` commands can be found in the repository's [README.md](https://github.com/electron/build-tools/blob/main/README.md). You can also run `e --help` to list all commands and use the `--help` flag on any command to get more usage info.

> 

[!TIP] For more information on project structure, see the [Source Code Directory Structure](/pt/docs/latest/development/source-code-directory-structure) guide.

**Manual setup (advanced)**

## Manual setup (advanced)

Electron uses [GN](https://gn.googlesource.com/gn) for project generation and [siso](https://chromium.googlesource.com/build/+/refs/heads/main/siso/README.md) for building. Project configurations can be found in the `.gn` and `.gni` files in the `electron/electron` repo.

### GN files

The following `gn` files contain the main rules for building Electron:

- [`BUILD.gn`](https://github.com/electron/electron/blob/v43.4.0/BUILD.gn) defines how Electron itself is built and includes the default configurations for linking with Chromium.

- [`build/args/{testing,release,all}.gn`](https://github.com/electron/electron/tree/main/build/args) contain the default build arguments for building Electron.

### Pré-requisitos GN

Você precisará instalar [`depot_tools`](https://commondatastorage.googleapis.com/chrome-infra-docs/flat/depot_tools/docs/html/depot_tools_tutorial.html#_setting_up), o toolset usado para obter Chromium e suas dependências.

Also, on Windows, you'll need to set the environment variable `DEPOT_TOOLS_WIN_TOOLCHAIN=0`. To do so, open `Control Panel` → `System and Security` → `System` → `Advanced system settings` and add a system variable `DEPOT_TOOLS_WIN_TOOLCHAIN` with value `0`.  This tells `depot_tools` to use your locally installed version of Visual Studio (by default, `depot_tools` will try to download a Google-internal version that only Googlers have access to).

### Setting up the git cache

If you plan on checking out Electron more than once (for example, to have multiple parallel directories checked out to different branches), using the git cache will speed up subsequent calls to `gclient`. To do this, set a `GIT_CACHE_PATH` environment variable:

```javascript
$ export GIT_CACHE_PATH="${HOME}/.git_cache"  
$ mkdir -p "${GIT_CACHE_PATH}"  
# This will use about 16G.  

```

### Getting the code

```javascript
$ mkdir electron && cd electron  
$ gclient config --name "src/electron" --unmanaged https://github.com/electron/electron  
$ gclient sync --with_branch_heads --with_tags  
# This will take a while, go get a coffee.  

```

> 

Instead of `https://github.com/electron/electron`, you can use your own fork here (something like `https://github.com/<username>/electron`).

#### A note on pulling/pushing

If you intend to `git pull` or `git push` from the official `electron` repository in the future, you now need to update the respective folder's origin URLs.

```javascript
$ cd src/electron  
$ git remote remove origin  
$ git remote add origin https://github.com/electron/electron  
$ git checkout main  
$ git branch --set-upstream-to=origin/main  
$ cd -  

```

> [!TIP]
> 

> dica

> 

`gclient` works by checking a file called `DEPS` inside the `${root}/src/electron` folder for dependencies (like Chromium or Node.js). Running `gclient sync -f` ensures that all dependencies required to build Electron match that file.

In order to pull, you'd run the following commands:

```javascript
$ cd src/electron  
$ git pull  
$ gclient sync -f  

```

### Compilando

**Set the environment variable for chromium build tools**

On Linux & MacOS

```javascript
$ cd src  
$ export CHROMIUM_BUILDTOOLS_PATH=`pwd`/buildtools  

```

On Windows:

```javascript
# cmd  
$ cd src  
$ set CHROMIUM_BUILDTOOLS_PATH=%cd%\buildtools  
  
# PowerShell  
$ cd src  
$ $env:CHROMIUM_BUILDTOOLS_PATH = "$(Get-Location)\buildtools"  

```

**To generate Testing build config of Electron:**

On Linux & MacOS

```javascript
$ gn gen out/Testing --args="import(\"//electron/build/args/testing.gn\")"  

```

On Windows:

```javascript
# cmd  
$ gn gen out/Testing --args="import(\"//electron/build/args/testing.gn\")"  
  
# PowerShell  
gn gen out/Testing --args="import(\`"//electron/build/args/testing.gn\`")"  

```

**To generate Release build config of Electron:**

On Linux & MacOS

```javascript
$ gn gen out/Release --args="import(\"//electron/build/args/release.gn\")"  

```

On Windows:

```javascript
# cmd  
$ gn gen out/Release --args="import(\"//electron/build/args/release.gn\")"  
  
# PowerShell  
$ gn gen out/Release --args="import(\`"//electron/build/args/release.gn\`")"  

```

> 

[!NOTE] This will generate a `out/Testing` or `out/Release` build directory under `${root}/src/` with the testing or release build depending upon the configuration passed above. You can replace `Testing|Release` with another names, but it should be a subdirectory of `out`.

Also you shouldn't have to run `gn gen` again—if you want to change the build arguments, you can run `gn args out/Testing` to bring up an editor. To see the list of available build configuration options, run `gn args out/Testing --list`.

**To build, run `ninja` with the `electron` target:** Note: This will also take a while and probably heat up your lap.

For the testing configuration:

```javascript
$ ninja -C out/Testing electron  

```

For the release configuration:

```javascript
$ ninja -C out/Release electron  

```

This will build all of what was previously 'libchromiumcontent' (i.e. the `content/` directory of `chromium` and its dependencies, incl. Blink and V8), so it will take a while.

The built executable will be under `./out/Testing`:

```javascript
$ ./out/Testing/Electron.app/Contents/MacOS/Electron  
# or, on Windows  
$ ./out/Testing/electron.exe  
# or, on Linux  
$ ./out/Testing/electron  

```

#### Empacotando

To package the electron build as a distributable zip file:

```javascript
$ ninja -C out/Release electron:electron_dist_zip  

```

#### Cross-compiling

To compile for a platform that isn't the same as the one you're building on, set the `target_cpu` and `target_os` GN arguments. For example, to compile an x86 target from an x64 host, specify `target_cpu = "x86"` in `gn args`.

```javascript
$ gn gen out/Testing-x86 --args='... target_cpu = "x86"'  

```

Not all combinations of source and target CPU/OS are supported by Chromium.[``](https://gn.googlesource.com/gn/+/main/docs/reference.md#built_in-predefined-variables-target_os_the-desired-operating-system-for-the-build-possible-values)[``](https://gn.googlesource.com/gn/+/main/docs/reference.md#built_in-predefined-variables-target_cpu_the-desired-cpu-architecture-for-the-build-possible-values)

#### 
[](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/windows_build_instructions.md#Visual-Studio)````

```javascript
  
  

```

```javascript
  
  

```
````

### 
``

```javascript
  

```
[](/pt/docs/latest/development/testing#unit-tests)

```javascript
  
  

```

### 

```javascript
  

```
[](https://stackoverflow.com/a/9935126)

```javascript
  

```

## 

### ``
``````

```javascript
  
  
  

```
``````

```javascript
  
  
  
  

```
````

### 
``````````````````````

### 
[](https://time.is/)[](https://github.com/electron/electron/edit/main/docs/development/build-instructions-gn.md)[](/pt/docs/latest/glossary)[](/pt/docs/latest/development/build-instructions-linux)

- 
- [``](#setting-up-electronbuild-tools-recommended)

  - 

- 

  - 
  - 
  - 
  - 

    - 

  - 

    - 
    - 
    - 

  - 
  - 

- 

  - [``](#sync-complains-about-rebase)
  - 
  - 

- [](/pt/docs/latest/)
- [](/pt/docs/latest/api/app)

- [](/pt/docs/latest/tutorial/performance)
- [](/pt/docs/latest/tutorial/security)

- [](https://electronforge.io)
- [](/pt/fiddle)

- [](/pt/governance)
- [](/pt/community)
- [](https://discordapp.com/invite/APGC3k5yaH)
- [](https://bsky.app/profile/electronjs.org)
- [](https://x.com/electronjs)
- [](https://social.lfx.dev/@electronjs)
- [](https://stackoverflow.com/questions/tagged/electron)

- [](https://github.com/electron/electron)
- [](https://opencollective.com/electron)
- [](https://p.datadoghq.com/sb/c44e1df0-85d7-11ee-94c9-da7ad0900002-c245f7ef47d0d0c32abecdc0938c2a85)
[](https://openjsf.org/)[](https://openjsf.org)[](https://openjsf.org)[](https://openjsf.org)[](https://trademark-policy.openjsf.org)[](https://trademark-list.openjsf.org)[](https://trademark-list.openjsf.org)[](https://openjsf.org)[](https://terms-of-use.openjsf.org)[](https://privacy-policy.openjsf.org)[](https://bylaws.openjsf.org)[](https://code-of-conduct.openjsf.org)[](https://trademark-policy.openjsf.org)[](https://trademark-list.openjsf.org)[](https://www.linuxfoundation.org/cookies)
