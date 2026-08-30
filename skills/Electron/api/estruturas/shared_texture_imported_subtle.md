---
title: "SharedTextureImportedSubtle Object"
description: "- getVideoFrame Function<[VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame) - Create a VideoFrame that uses the imported shared texture in the current proces"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "SharedTextureImportedSubtle Object"
  - "getVideoFrame"
  - "VideoFrame"
  - "release"
  - "SharedTextureImported"
  - "callback"
  - "finishTransferSharedTexture"
  - "startTransferSharedTexture"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-imported-subtle"
---

# SharedTextureImportedSubtle Object

- `getVideoFrame` Function<[VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame)> - Create a `VideoFrame` that uses the imported shared texture in the current process. You can call `VideoFrame.close()` once you've finished using the object. The underlying resources will wait for GPU finish internally.

- `release` Function - Release the resources. If you transferred and get multiple `SharedTextureImported` objects, you have to `release` every one of them. The resource on the GPU process will be destroyed when the last one is released.

  - `callback` Function (optional) - Callback when the GPU command buffer finishes using this shared texture. It provides a precise event to safely release dependent resources. For example, if this object is created by `finishTransferSharedTexture`, you can use this callback to safely release the original one that called `startTransferSharedTexture` in other processes. You can also release the source shared texture that was used to `importSharedTexture` safely.

- `startTransferSharedTexture` Function<[SharedTextureTransfer](/pt/docs/latest/api/structures/shared-texture-transfer)> - Create a `SharedTextureTransfer` that can be serialized and transferred to other processes.

- `getFrameCreationSyncToken` Function<[SharedTextureSyncToken](/pt/docs/latest/api/structures/shared-texture-sync-token)> - This method is for advanced users. If used, it is typically called after `finishTransferSharedTexture`, and should be passed to the object which was called `startTransferSharedTexture` to prevent the source object release the underlying resource before the target object actually acquire the reference at gpu process asyncly.

- `setReleaseSyncToken` Function - This method is for advanced users. If used, this object's underlying resource will not be released until the set sync token is fulfilled at gpu process. By using sync tokens, users are not required to use release callbacks for lifetime management.

  - `syncToken` [SharedTextureSyncToken](/pt/docs/latest/api/structures/shared-texture-sync-token) - The sync token to set.
