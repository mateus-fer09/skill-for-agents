---
title: "PreloadScriptRegistration Object"
description: "- type string - Context type where the preload script will be executed. Possible values include frame or service-worker ."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "PreloadScriptRegistration Object"
  - "type"
  - "frame"
  - "filePath"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/preload-script-registration"
---

# PreloadScriptRegistration Object

- `type` string - Context type where the preload script will be executed.
Possible values include `frame` or `service-worker`.

- `id` string (optional) - Unique ID of preload script. Defaults to a random UUID.

- `filePath` string - Path of the script file. Must be an absolute path.
