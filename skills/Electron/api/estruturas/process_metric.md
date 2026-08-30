---
title: "Processamento de Objeto"
description: "- pid Integer - Processo id of proccesso."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Processamento de Objeto"
  - "type"
  - "Browser"
  - "Utilidade"
  - "Zygote"
  - "Desconhecido"
  - "serviceName"
  - "name"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/process-metric"
---

# Processamento de Objeto

- `pid` Integer - Processo id of proccesso.

- `type` string - Process type. Um dos seguintes valores:

  - `Browser`

  - `Tab`

  - `Utilidade`

  - `Zygote`

  - `Ajuda ao Sandbox`

  - `GPU`

  - `Pepper Plugin`

  - `Pepper Plugin Broker`

  - `Desconhecido`

- `serviceName` string (optional) - The non-localized name of the process.

- `name` string (optional) - The name of the process. Exemplos para utilidade: `Audio Service`, `Content Decryption Module Service`, `Network Service`, `Video Capture`, etc.

- `cpu` [CPUUsage](/pt/docs/latest/api/structures/cpu-usage) - CPU usage of the process.

- `creationTime` number - Tempo de criação para este processo. O tempo é representado como número de milissegundos desde epoch. Já que `pid` pode ser reutilizado depois que um processo termina, é útil usar ambos `pid` e `creationTime` para identificar unicamente um processo.

- `memory` [MemoryInfo](/pt/docs/latest/api/structures/memory-info) - Memory information for the process.

- `sandboxed` boolean (opcional) *macOS* *Windows* - Se o processo é sandboxed em nível de SO.

- `integrityLevel` string (opcional) *Windows* - Um dos seguintes valores:

  - `untrusted`

  - `baixo`

  - `medium`

  - `alto`

  - `desconhecido`
