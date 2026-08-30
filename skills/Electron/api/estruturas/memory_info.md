---
title: "Objeto MemoryInfo"
description: "- workingSetSize Integer - A quantidade de memória atualmente fixado a RAM físico real."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto MemoryInfo"
  - "workingSetSize"
  - "peakWorkingSetSize"
  - "privateBytes"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/memory-info"
---

# Objeto MemoryInfo

- `workingSetSize` Integer - A quantidade de memória atualmente fixado a RAM físico real.

- `peakWorkingSetSize` Integer - A quantidade máxima de memória que já foi fixada na RAM física real.

- `privateBytes` Integer (opcional) *Windows* - A quantidade de memória não compartilhada por outros processos, como heap JS ou conteúdo HTML.

Note-se que todas as estatísticas são relatadas em Kilobytes.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/structures/memory-info.md)
