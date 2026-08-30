---
title: "SharedTextureHandle Object"
description: "- ntHandle Buffer (optional) Windows - NT HANDLE holds the shared texture. Note that this NT HANDLE is local to current process. Output textures of rgba , bgra , rgbaf16 formats do"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "SharedTextureHandle Object"
  - "ntHandle"
  - "rgba"
  - "bgra"
  - "rgbaf16"
  - "nv12"
  - "ioSurface"
  - "nativePixmap"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-handle"
---

# SharedTextureHandle Object

- `ntHandle` Buffer (optional) *Windows* - NT HANDLE holds the shared texture. Note that this NT HANDLE is local to current process.  Output textures of `rgba`, `bgra`, `rgbaf16` formats don't have a keyed mutex on the texture handle, but `nv12` format texture handles do have a keyed mutex.

- `ioSurface` Buffer (optional) *macOS* - IOSurfaceRef holds the shared texture. Note that this IOSurface is local to current process (not global).

- `nativePixmap` Object (optional) *Linux* - Structure contains planes of shared texture.

  - `planes` Object[] *Linux* - Each plane's info of the shared texture.

    - `stride` number - The strides and offsets in bytes to be used when accessing the buffers via a memory mapping. One per plane per entry.

    - `offset` number - The strides and offsets in bytes to be used when accessing the buffers via a memory mapping. One per plane per entry.

    - `size` number - Size in bytes of the plane. This is necessary to map the buffers.

    - `fd` number - File descriptor for the underlying memory object (usually dmabuf).

  - `modifier` string *Linux* - The modifier is retrieved from GBM library and passed to EGL driver.

  - `supportsZeroCopyWebGpuImport` boolean *Linux* - Indicates whether supports zero copy import to WebGPU.
