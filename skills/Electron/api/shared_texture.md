---
title: "sharedTexture"
description: "Documentação técnica e referência da API de sharedTexture no Electron."
topics:
  - "Api"
keywords:
  - "VideoFrame"
  - "sharedTexture"
  - "options"
  - "textureInfo"
  - "allReferencesReleased"
  - "frame"
  - "WebContents"
  - "webContents.mainFrame"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/shared-texture"
---

# sharedTexture

> 

Import shared textures into Electron and converts platform specific handles into [`VideoFrame`](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame). Supports all Web rendering systems, and can be transferred across Electron processes. Read [here](https://github.com/electron/electron/blob/v43.4.0/shell/common/api/shared_texture/README.md) for more information.

Process: [Main](/pt/docs/latest/glossary#main-process), [Renderer](/pt/docs/latest/glossary#renderer-process)

## Métodos

The `sharedTexture` module has the following methods:

**Note:** Experimental APIs are marked as such and could be removed in the future.

### `sharedTexture.importSharedTexture(options)` *Experimental*

- `options` Object - Options for importing shared textures.

  - `textureInfo` [SharedTextureImportTextureInfo](/pt/docs/latest/api/structures/shared-texture-import-texture-info) - The information of the shared texture to import.

  - `allReferencesReleased` Function (optional) - Called when all references in all processes are released. You should keep the imported texture valid until this callback is called.

Imports the shared texture from the given options.

> [!NOTE]
> 

> note

> 

This method is only available in the main process.

Returns [SharedTextureImported](/pt/docs/latest/api/structures/shared-texture-imported) - The imported shared texture.

### `sharedTexture.sendSharedTexture(options, ...args)` *Experimental*

- `options` Object - Options for sending shared texture.

  - `frame` [WebFrameMain](/pt/docs/latest/api/web-frame-main) - The target frame to transfer the shared texture to. For `WebContents`, you can pass `webContents.mainFrame`. If you provide a `webFrameMain` that is not a main frame, you'll need to enable `webPreferences.nodeIntegrationInSubFrames` for this, since this feature requires [IPC](https://www.electronjs.org/docs/latest/api/web-frame-main#frameipc-readonly) between main and the frame.

  - `importedSharedTexture` [SharedTextureImported](/pt/docs/latest/api/structures/shared-texture-imported) - The imported shared texture.

- `...args` any[] - Additional arguments to pass to the renderer process.

Send the imported shared texture to a renderer process. You must register a receiver at renderer process before calling this method. This method has a 1000ms timeout. Ensure the receiver is set and the renderer process is alive before calling this method.

> [!NOTE]
> 

> note

> 

This method is only available in the main process.

Returns `Promise<void>` - Resolves when the transfer is complete.

### `sharedTexture.setSharedTextureReceiver(callback)` *Experimental*

- `callback` Function<Promise<void>> - The function to receive the imported shared texture.

  - `receivedSharedTextureData` Object - The data received from the main process.

    - `importedSharedTexture` [SharedTextureImported](/pt/docs/latest/api/structures/shared-texture-imported) - The imported shared texture.

  - `...args` any[] - Additional arguments passed from the main process.

Set a callback to receive imported shared textures from the main process.

> [!NOTE]
> 

> note

> 

This method is only available in the renderer process.

## Propriedades

The `sharedTexture` module has the following properties:

### `sharedTexture.subtle` *Experimental*

A [SharedTextureSubtle](/pt/docs/latest/api/structures/shared-texture-subtle) property, provides subtle APIs for interacting with shared texture for advanced users.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/shared-texture.md)[Anteriorsession](/pt/docs/latest/api/session)[AvançarShareMenu](/pt/docs/latest/api/share-menu)

- [Métodos](#métodos)

  - [`importSharedTexture`](#sharedtextureimportsharedtextureoptions-experimental)
  - [`sendSharedTexture`](#sharedtexturesendsharedtextureoptions-args-experimental)
  - [`setSharedTextureReceiver`](#sharedtexturesetsharedtexturereceivercallback-experimental)

- [Propriedades](#propriedades)

  - [`subtle`](#sharedtexturesubtle-experimental)

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
