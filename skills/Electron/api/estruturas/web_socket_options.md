---
title: "WebSocketOptions Object"
description: "- protocols string | string[] (optional) - Requested WebSocket subprotocols."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "WebSocketOptions Object"
  - "protocols"
  - "headers"
  - "origin"
  - "Origin"
  - "useSessionCookies"
  - "false"
  - "session"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/web-socket-options"
---

# WebSocketOptions Object

- `protocols` string | string[] (optional) - Requested WebSocket subprotocols.

- `headers` Record<string, string> (optional) - Extra HTTP headers to send
with the opening handshake.

- `origin` string (optional) - Value of the `Origin` header to send with the
opening handshake. Defaults to the `http(s)` equivalent of the WebSocket
URL's origin (e.g. connecting to `wss://api.example.com` sends
`Origin: https://api.example.com`), so that the connection is treated as
same-origin by the server and by SameSite cookie rules.

- `useSessionCookies` boolean (optional) - Whether to send cookies from the
session with the opening handshake and store cookies received in the
handshake response. Default is `false`.

- `session` Session (optional) - The [`Session`](/pt/docs/latest/api/session) the connection
is associated with.

- `partition` string (optional) - The name of the [`partition`](/pt/docs/latest/api/session)
the connection is associated with. Defaults to the empty string, which
corresponds to the default session. If `session` is provided, `partition`
is ignored.
