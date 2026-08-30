---
title: "Objeto UsoDaCPU"
description: "- número percentCPUUsage - Porcentagem da CPU usada desde a última chamada de getCPUUsage. A primeira chamada retorna 0."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto UsoDaCPU"
  - "percentCPUUsage"
  - "cumulativeCPUUsage"
  - "idleWakeupsPerSecond"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/cpu-usage"
---

# Objeto UsoDaCPU

- número `percentCPUUsage` - Porcentagem da CPU usada desde a última chamada de getCPUUsage. A primeira chamada retorna 0.

- `cumulativeCPUUsage` number (optional) - Total seconds of CPU time used since process startup.

- `idleWakeupsPerSecond` number - O número médio de ativações por segundo de CPU ociosa desde a última chamada para getCPUUsage. A primeira chamada retorna 0. Sempre retornará 0 no Windows.
