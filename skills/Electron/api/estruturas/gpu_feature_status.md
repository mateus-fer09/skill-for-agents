---
title: "GPUFeatureStatus Object"
description: "- 2d_canvas string - Canvas."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "GPUFeatureStatus Object"
  - "2d_canvas"
  - "flash_3d"
  - "flash_stage3d"
  - "flash_stage3d_baseline"
  - "gpu_compositing"
  - "multiple_raster_threads"
  - "native_gpu_memory_buffers"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/gpu-feature-status"
---

# GPUFeatureStatus Object

- `2d_canvas` string - Canvas.

- `flash_3d` string - Flash.

- `flash_stage3d` string - Flash Stage3D.

- `flash_stage3d_baseline` string - Flash Stage3D Baseline perfil.

- `gpu_compositing` string - Composição.

- `multiple_raster_threads` string - Multiple Raster Threads.

- `native_gpu_memory_buffers` string - Nativo GpuMemoryBuffers.

- `rasterization` string - Rasterização.

- `video_decode` string - Tipo de descodificador de vídeo.

- `video_decode` string - Tipo de codificador de vídeo.

- `vpx_decode` string - VPx Video Descodificador.

- `webgl` string - WebGL.

- `webgl2` string - WebGL2.

Valores possíveis:

- `disabled_software` - Apenas software. Aceleração de hardware desabilitada (amarelo)

- `disabled_off` - Desativado (vermelho)

- `disabled_off_ok` - Desativado (amarelo)

- `unavailable_software` - Apenas aceleração de software. Não está disponível a de hardware (amarelo)

- `unavailable_off` - Indisponível (vermelho)

- `unavailable_off_ok` - Indisponível (amarelo)

- `enabled_readback` - Aceleração de hardware ativado mas não reduzindo o desempenho (amarelo)

- `enabled_force` - Aceleração de hardware em todas as páginas (verde)

- `enabled_force` - Aceleração de hardware (verde)

- `enabled_on` - Habilitado (verde)

- `enabled_force_on` - Força habilitado (verde)
