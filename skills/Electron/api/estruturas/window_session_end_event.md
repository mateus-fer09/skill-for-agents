---
title: "WindowSessionEndEvent Object extends"
description: "- reasons string[] - List of reasons for shutdown. Can be 'shutdown', 'close-app', 'critical', or 'logoff'."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "WindowSessionEndEvent Object extends"
  - "Event"
  - "reasons"
  - "WM_ENDSESSION"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/window-session-end-event"
---

# WindowSessionEndEvent Object extends `Event`

- `reasons` string[] - List of reasons for shutdown. Can be 'shutdown', 'close-app', 'critical', or 'logoff'.

Unfortunately, Windows does not offer a way to differentiate between a shutdown and a reboot, meaning the 'shutdown'
reason is triggered in both scenarios. For more details on the `WM_ENDSESSION` message and its associated reasons,
refer to the [MSDN documentation](https://learn.microsoft.com/en-us/windows/win32/shutdown/wm-endsession).[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/structures/window-session-end-event.md)
