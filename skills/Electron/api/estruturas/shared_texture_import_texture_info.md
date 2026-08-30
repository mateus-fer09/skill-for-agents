---
title: "SharedTextureImportTextureInfo Object"
description: "- pixelFormat string - The pixel format of the texture."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "SharedTextureImportTextureInfo Object"
  - "pixelFormat"
  - "bgra"
  - "rgba"
  - "rgbaf16"
  - "nv12"
  - "nv16"
  - "p010le"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-import-texture-info"
---

# SharedTextureImportTextureInfo Object

- `pixelFormat` string - The pixel format of the texture.

  - `bgra` - 32bpp BGRA (byte-order), 1 plane.

  - `rgba` - 32bpp RGBA (byte-order), 1 plane.

  - `rgbaf16` - Half float RGBA, 1 plane.

  - `nv12` - 12bpp with Y plane followed by a 2x2 interleaved UV plane.

  - `nv16` - 16bpp with Y plane followed by a 2x1 interleaved UV plane.

  - `p010le` - 4:2:0 10-bit YUV (little-endian), Y plane followed by a 2x2 interleaved UV plane.

- `colorSpace` [ColorSpace](/pt/docs/latest/api/structures/color-space) (optional) - The color space of the texture.

- `codedSize` [Size](/pt/docs/latest/api/structures/size) - The full dimensions of the shared texture.

- `visibleRect` [Rectangle](/pt/docs/latest/api/structures/rectangle) (optional) - A subsection of [0, 0, codedSize.width, codedSize.height]. In common cases, it is the full section area.

- `timestamp` number (optional) - A timestamp in microseconds that will be reflected to `VideoFrame`.

- `handle` [SharedTextureHandle](/pt/docs/latest/api/structures/shared-texture-handle) - The shared texture handle.
