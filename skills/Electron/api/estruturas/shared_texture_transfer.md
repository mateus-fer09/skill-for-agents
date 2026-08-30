---
title: "SharedTextureTransfer Object"
description: "- transfer string Readonly - The opaque transfer data of the shared texture. This can be transferred across Electron processes."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "SharedTextureTransfer Object"
  - "transfer"
  - "syncToken"
  - "pixelFormat"
  - "codedSize"
  - "visibleRect"
  - "timestamp"
  - "VideoFrame"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-transfer"
---

# SharedTextureTransfer Object

- `transfer` string *Readonly* - The opaque transfer data of the shared texture. This can be transferred across Electron processes.

- `syncToken` string *Readonly* - The opaque sync token data for frame creation.

- `pixelFormat` string *Readonly* - The pixel format of the transferring texture.

- `codedSize` [Size](/pt/docs/latest/api/structures/size) *Readonly* - The full dimensions of the shared texture.

- `visibleRect` [Rectangle](/pt/docs/latest/api/structures/rectangle) *Readonly* - A subsection of [0, 0, codedSize.width(), codedSize.height()]. In common cases, it is the full section area.

- `timestamp` number *Readonly* - A timestamp in microseconds that will be reflected to `VideoFrame`.

Use `sharedTexture.subtle.finishTransferSharedTexture` to get [SharedTextureImportedSubtle](/pt/docs/latest/api/structures/shared-texture-imported-subtle) back.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/structures/shared-texture-transfer.md)
