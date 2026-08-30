---
title: "Real-time Collaboration (Multiplayer Text Editor)"
description: "Let's see how you can add Multiplayer capabilities to your BlockNote setup, and allow real-time collaboration between users (similar to Google Docs):"
topics:
  - "Recursos avancados"
keywords:
  - "Real-time Collaboration (Multiplayer Text Editor)"
  - "withCollaboration"
  - "collaboration"
source_scope:
  - "https://www.blocknotejs.org/docs/features/collaboration"
---

# [Real-time Collaboration (Multiplayer Text Editor)](#real-time-collaboration-multiplayer-text-editor)

Let's see how you can add Multiplayer capabilities to your BlockNote setup, and allow real-time collaboration between users (similar to Google Docs):

*Try the live demo on the [homepage](https://www.blocknotejs.org)*

BlockNote uses [Yjs](https://github.com/yjs/yjs) for this, and you can set it up with the `withCollaboration` helper:

```tsx
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { withCollaboration } from "@blocknote/core/yjs";
// ...

const doc = new Y.Doc();

const provider = new WebrtcProvider("my-document-id", doc); // setup a yjs provider (explained below)
const editor = useCreateBlockNote(
  withCollaboration({
    // ...
    collaboration: {
      // The Yjs Provider responsible for transporting updates:
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment("document-store"),
      // Information (name and color) for this user:
      user: {
        name: "My Username",
        color: "#ff0000",
      },
      // When to show user labels on the collaboration cursor. Set by default to
      // "activity" (show when the cursor moves), but can also be set to "always".
      showCursorLabels: "activity",
    },
    // ...
  }),
);
```

The `withCollaboration` function accepts all the regular editor options along with a `collaboration` property, and configures your editor for real-time collaboration.

## [Yjs Providers](#yjs-providers)

When a user edits the document, an incremental change (or "update") is captured and can be shared between users of your app. You can share these updates by setting up a *Yjs Provider*. In the snipped above, we use [y-webrtc](https://github.com/yjs/y-webrtc) which shares updates over WebRTC (and BroadcastChannel), but you might be interested in different providers for production-ready use cases.

- [Liveblocks](https://liveblocks.io/yjs) A fully hosted WebSocket infrastructure and persisted data store for Yjs documents. Includes webhooks, REST API, and browser DevTools, all for Yjs

- [PartyKit](https://www.partykit.io/) A serverless provider that runs on Cloudflare

- [Y-Sweet](https://jamsocket.com/y-sweet) An open-source provider that runs fully managed on [Jamsocket](https://jamsocket.com) or self-hosted in your own cloud

- [Hocuspocus](https://www.hocuspocus.dev/) open source and extensible Node.js server with pluggable storage (scales with Redis)

- [y-websocket](https://github.com/yjs/y-websocket) provider that you can connect to your own websocket server

- [y-indexeddb](https://github.com/yjs/y-indexeddb) for offline storage

- [y-webrtc](https://github.com/yjs/y-webrtc) transmits updates over WebRTC

- [Matrix-CRDT](https://github.com/yousefED/matrix-crdt) syncs updates over Matrix (experimental)

- [Nostr-CRDT](https://github.com/yousefED/nostr-crdt) syncs updates over Nostr (experimental)

## [Liveblocks](#liveblocks)

Liveblocks provides a hosted back-end for Yjs. You can create a fully-featured example project which uses Liveblocks with BlockNote by running the command below (you will need a Liveblocks account for this):

```tsx
npx create-liveblocks-app@latest --example nextjs-blocknote --api-key
```

You can also try the same example in a [live demo](https://liveblocks.io/examples/collaborative-text-editor/nextjs-blocknote).

For a simpler demo, check out [this example](/examples/collaboration/liveblocks), which follows their [getting started guide](https://liveblocks.io/docs/get-started/react-blocknote).

If you want more info on integrating Liveblocks, take a look at their [ready-made features for BlockNote](https://liveblocks.io/docs/ready-made-features/text-editor/blocknote) and [API reference](https://liveblocks.io/docs/api-reference/liveblocks-react-blocknote#AnchoredThreads).

## [Partykit](#partykit)

For development purposes, you can use our Partykit server to test collaborative features. Replace the `WebrtcProvider` provider in the example below with a `YPartyKitProvider`:

```tsx
// npm install y-partykit
import YPartyKitProvider from "y-partykit/provider";

const provider = new YPartyKitProvider(
  "blocknote-dev.yousefed.partykit.dev",
  // use a unique name as a "room" for your application:
  "your-project-name",
  doc,
);
```

To learn how to set up your own development / production servers, check out the [PartyKit docs](https://github.com/partykit/partykit) and the [BlockNote + Partykit example](https://github.com/partykit/partykit/tree/main/examples/blocknote).[

Custom

How to create custom blocks, inline content and styles in BlockNote.](/docs/features/blocks/custom)[

Comments

Learn how to enable comments in your BlockNote editor](/docs/features/collaboration/comments)
