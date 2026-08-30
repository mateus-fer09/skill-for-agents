---
title: "Objeto ServiceWorkerInfo"
description: "- scriptUrl string - O URL completo para o script que este service worker executa"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto ServiceWorkerInfo"
  - "scriptUrl"
  - "scope"
  - "renderProcessId"
  - "versionId"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/service-worker-info"
---

# Objeto ServiceWorkerInfo

- `scriptUrl` string - O URL completo para o script que este service worker executa

- `scope` string - O URL base para o qual este service worker está ativo.

- `renderProcessId` number - O ID virtual do processo onde este service worker está executando.  Este não é um PID ao nível de S.O.  Isto se alinha com o conjunto de ID usado para `webContents.getProcessId()`.

- `versionId` number - ID of the service worker version
