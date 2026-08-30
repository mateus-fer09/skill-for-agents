---
title: "SharedTextureImported Object"
description: "- textureId string - The unique identifier of the imported shared texture."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "SharedTextureImported Object"
  - "textureId"
  - "getVideoFrame"
  - "VideoFrame"
  - "release"
  - "subtle"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-imported"
---

# SharedTextureImported Object

- `textureId` string - The unique identifier of the imported shared texture.

- `getVideoFrame` Function<[VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame)> - Create a `VideoFrame` that uses the imported shared texture in the current process. You can call `VideoFrame.close()` once you've finished using the object. The underlying resources will wait for GPU finish internally.

- `release` Function - Release this object's reference of the imported shared texture. The underlying resource will be alive until every reference is released.

- `subtle` [SharedTextureImportedSubtle](/pt/docs/latest/api/structures/shared-texture-imported-subtle) - Provides subtle APIs to interact with the imported shared texture for advanced users.
