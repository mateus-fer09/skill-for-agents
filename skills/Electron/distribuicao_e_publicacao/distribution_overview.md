---
title: "Distribution Overview"
description: "Once your app is ready for production, there are a couple steps you need to take before you can deliver it to your users."
topics:
  - "Distribuicao e publicacao"
keywords:
  - "Distribution Overview"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/distribution-overview"
---

# Distribution Overview

Once your app is ready for production, there are a couple steps you need to take before you can deliver it to your users.

## Empacotando

To distribute your app with Electron, you need to package all your resources and assets into an executable and rebrand it. To do this, you can either use specialized tooling like Electron Forge or do it manually. See the [Application Packaging](/pt/docs/latest/tutorial/application-distribution) tutorial for more information.

## Code signing

Code signing is a security technology that you use to certify that an app was created by you. You should sign your application so it does not trigger the security checks of your user's operating system.

To get started with each operating system's code signing process, please read the [Code Signing](/pt/docs/latest/tutorial/code-signing) docs.

## Publicar

Once your app is packaged and signed, you can freely distribute your app directly to users by uploading your installers online.

To reach more users, you can also choose to upload your app to each operating system's digital distribution platform (i.e. app store). These require another build step aside from your direct download app. For more information, check out each individual app store guide:

- [Mac App Store](/pt/docs/latest/tutorial/mac-app-store-submission-guide)

- [Windows Store](/pt/docs/latest/tutorial/windows-store-guide)

- [Snapcraft (Linux)](/pt/docs/latest/tutorial/snapcraft)

## Atualizando

Electron's auto-updater allows you to deliver application updates to users without forcing them to manually download new versions of your application. Check out the [Updating Applications](/pt/docs/latest/tutorial/updates) guide for details on implementing automatic updates with Electron.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/distribution-overview.md)
