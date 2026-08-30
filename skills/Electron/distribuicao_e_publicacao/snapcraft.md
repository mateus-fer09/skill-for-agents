---
title: "Snapcraft Guide (Linux)"
description: "This guide provides information on how to package your Electron application for any Snapcraft environment, including the Ubuntu Software Center."
topics:
  - "Distribuicao e publicacao"
keywords:
  - "Snapcraft Guide (Linux)"
  - "snapcraft"
  - "snap"
  - "node_modules"
  - "PATH"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/snapcraft"
---

# Snapcraft Guide (Linux)

This guide provides information on how to package your Electron application for any Snapcraft environment, including the Ubuntu Software Center.

## Contexto e Requisitos

Together with the broader Linux community, Canonical aims to address common software installation issues through the [`snapcraft`](https://snapcraft.io/) project. Snaps are containerized software packages that include required dependencies, auto-update, and work on all major Linux distributions without system modification.

There are three ways to create a `.snap` file:

1. Using [Electron Forge](https://github.com/electron/forge) or [`electron-builder`](https://github.com/electron-userland/electron-builder), both tools that come with `snap` support out of the box. This is the easiest option. 2) Using `electron-installer-snap`, which takes `@electron/packager`'s output. 3) Using an already created `.deb` package.

Em alguns casos, você precisará ter a ferramenta `snapcraft` instalada. Instruções para instalar `snapcraft` para sua distribuição específica estão disponíveis [aqui](https://snapcraft.io/docs/installing-snapcraft).

## Usando o `electron-installer-snap`

The module works like [`electron-winstaller`](https://github.com/electron/windows-installer) and similar modules in that its scope is limited to building snap packages. Você pode testá-lo com:

```javascript
npm install --save-dev electron-installer-snap  

```

### Etapa 1: Empacotar sua aplicação Electron

Package the application using [@electron/packager](https://github.com/electron/packager) (or a similar tool). Make sure to remove `node_modules` that you don't need in your final application, since any module you don't actually need will increase your application's size.

A saída deve ser algo mais ou menos assim:

```javascript
.  
└── dist  
    └── app-linux-x64  
        ├── LICENSE  
        ├── LICENSES.chromium.html  
        ├── content_shell.pak  
        ├── app  
        ├── icudtl.dat  
        ├── libgcrypt.so.11  
        ├── libnode.so  
        ├── locales  
        ├── resources  
        ├── v8_context_snapshot.bin  
        └── version  

```

### Step 2: Running `electron-installer-snap`

From a terminal that has `snapcraft` in its `PATH`, run `electron-installer-snap` with the only required parameter `--src`, which is the location of your packaged Electron application created in the first step.

```javascript
npx electron-installer-snap --src=out/myappname-linux-x64  

```

If you have an existing build pipeline, you can use `electron-installer-snap` programmatically. For more information, see the [Snapcraft API docs](https://docs.snapcraft.io/build-snaps/syntax).

```javascript
const snap = require('electron-installer-snap')  
  
snap(options)  
  .then(snapPath => console.log(`Created snap at ${snapPath}!`))  

```

## Using `snapcraft` with `@electron/packager`

### Step 1: Create Sample Snapcraft Project

```javascript
$ npx create-electron-app@latest my-app  

```

### Step 2: Create Sample Snapcraft Project

Create a `snap` directory in your project root and add the following to `snap/snapcraft.yaml`:

```javascript
name: electron-packager-hello-world  
version: '0.1'  
summary: Hello World Electron app  
description: |  
  Simple Hello World Electron app as an example  
base: core22  
confinement: strict  
grade: stable  
  
apps:  
  electron-packager-hello-world:  
    command: my-app/my-app --no-sandbox  
    extensions: [gnome]  
    plugs:  
    - browser-support  
    - network  
    - network-bind  
    environment:  
      # Correct the TMPDIR path for Chromium Framework/Electron to ensure  
      # libappindicator has readable resources.  
      TMPDIR: $XDG_RUNTIME_DIR  
  
parts:  
  my-app:  
    plugin: nil  
    source: .  
    override-build: |  
        npm install electron @electron/packager  
        npx electron-packager . --overwrite --platform=linux --output=release-build --prune=true  
        cp -rv ./my-app-linux-* $SNAPCRAFT_PART_INSTALL/my-app  
    build-snaps:  
    - node/14/stable  
    build-packages:  
    - unzip  
    stage-packages:  
    - libnss3  
    - libnspr4  

```

If you want to apply this example to an existing project, replace all instances of `my-app` with your project's name.

### Step 3: Build the snap

```javascript
$ snapcraft  
  
<output snipped>  
Snapped electron-packager-hello-world_0.1_amd64.snap  

```

### Step 4: Install the snap

```javascript
sudo snap install electron-packager-hello-world_0.1_amd64.snap --dangerous  

```

### Step 5: Run the snap

```javascript
electron-packager-hello-world  

```

## Using an Existing Debian Package

Snapcraft is capable of taking an existing `.deb` file and turning it into a `.snap` file. The creation of a snap is configured using a `snapcraft.yaml` file that describes the sources, dependencies, description, and other core building blocks.

### Step 1: Create a Debian Package

If you do not already have a `.deb` package, using `electron-installer-snap` might be an easier path to create snap packages. However, multiple solutions for creating Debian packages exist, including [Electron Forge](https://github.com/electron/forge), [`electron-builder`](https://github.com/electron-userland/electron-builder) or [`electron-installer-debian`](https://github.com/electron-userland/electron-installer-debian).

### Step 2: Create a snapcraft.yaml

For more information on the available configuration options, see the [documentation on the snapcraft syntax](https://docs.snapcraft.io/build-snaps/syntax). Let's look at an example:

```javascript
name: myApp  
version: '2.0.0'  
summary: A little description for the app.  
description: |  
 You know what? This app is amazing! It does all the things  
 for you. Some say it keeps you young, maybe even happy.  
  
grade: stable  
confinement: classic  
  
parts:  
  slack:  
    plugin: dump  
    source: my-deb.deb  
    source-type: deb  
    after:  
      - desktop-gtk3  
    stage-packages:  
      - libasound2  
      - libnotify4  
      - libnspr4  
      - libnss3  
      - libpcre3  
      - libpulse0  
      - libxss1  
      - libxtst6  
  electron-launch:  
    plugin: dump  
    source: files/  
    prepare: |  
      chmod +x bin/electron-launch  
  
apps:  
  myApp:  
    command: bin/electron-launch $SNAP/usr/lib/myApp/myApp  
    desktop: usr/share/applications/myApp.desktop  
    # Correct the TMPDIR path for Chromium Framework/Electron to ensure  
    # libappindicator has readable resources.  
    environment:  
      TMPDIR: $XDG_RUNTIME_DIR  

```

As you can see, the `snapcraft.yaml` instructs the system to launch a file called `electron-launch`. In this example, it passes information on to the app's binary:

```javascript
#!/bin/sh  
  
exec "$@" --executed-from="$(pwd)" --pid=$$ > /dev/null 2>&1 &  

```

Alternatively, if you're building your `snap` with `strict` confinement, you can use the `desktop-launch` command:

```javascript
apps:  
  myApp:  
    # Correct the TMPDIR path for Chromium Framework/Electron to ensure  
    # libappindicator has readable resources.  
    command: env TMPDIR=$XDG_RUNTIME_DIR PATH=/usr/local/bin:${PATH} ${SNAP}/bin/desktop-launch $SNAP/myApp/desktop  
    desktop: usr/share/applications/desktop.desktop  

```

## Optional: Enabling desktop capture

Capturing the desktop requires PipeWire library in some Linux configurations that use the Wayland protocol. To bundle PipeWire with your application, ensure that the base snap is set to `core22` or newer. Next, create a part called `pipewire` and add it to the `after` section of your application:

```javascript
  pipewire:  
    plugin: nil  
    build-packages: [libpipewire-0.3-dev]  
    stage-packages: [pipewire]  
    prime:  
      - usr/lib/*/pipewire-*  
      - usr/lib/*/spa-*  
      - usr/lib/*/libpipewire*.so*  
      - usr/share/pipewire  

```

Finally, configure your application's environment for PipeWire:

```javascript
    environment:  
      SPA_PLUGIN_DIR: $SNAP/usr/lib/$CRAFT_ARCH_TRIPLET/spa-0.2  
      PIPEWIRE_CONFIG_NAME: $SNAP/usr/share/pipewire/pipewire.conf  
      PIPEWIRE_MODULE_DIR: $SNAP/usr/lib/$CRAFT_ARCH_TRIPLET/pipewire-0.3  

```
