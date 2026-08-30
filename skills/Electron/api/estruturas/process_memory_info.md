---
title: "Objeto ProcessMemoryInfo"
description: "- residentSet Integer Linux Windows - A quantidade de memória atualmente fixada para a RAM física real em Kilobytes."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto ProcessMemoryInfo"
  - "residentSet"
  - "private"
  - "shared"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/process-memory-info"
---

# Objeto ProcessMemoryInfo

- `residentSet` Integer *Linux* *Windows* - A quantidade de memória atualmente fixada para a RAM física real em Kilobytes.

- `private` Integer - A quantidade de memória não compartilhada por outros prcessos, como JS heap ou conteúdo HTML em Kilobytes.

- `shared` Integer - A quantidade de memória compartilhada entre processos, normalmente memória consumida pelo próprio código Electron em Kilobytes.
