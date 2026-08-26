---
title: "Multiplayer e Colabora??o em Tempo Real no React Flow"
description: "Guia completo de arquitetura para fluxos colaborativos multiplayer em tempo real com React Flow v12, sincroniza??o de estado com CRDTs (Yjs / Liveblocks / WebSockets), cursores compartilhados e presen?a."
topics:
  - "Arquitetura Multiplayer em Grafos"
  - "Estado Dur?vel (CRDTs / Yjs) vs Estado Ef?mero (Presence / Cursors)"
  - "Sincroniza??o de N?s e Arestas sem Jitter"
  - "Renderiza??o de Cursores de Usu?rios Conectados"
  - "Resolu??o de Conflitos e Travamento de Sele??o"
keywords:
  - "multiplayer"
  - "realtime collaboration"
  - "Yjs"
  - "CRDT"
  - "Liveblocks"
  - "shared cursors"
  - "awareness"
  - "@xyflow/react"
source_scope: "Learn / Advanced Use / Multiplayer"
---

# Multiplayer e Colabora??o em Tempo Real no React Flow

Aplica??es baseadas em n?s s?o inerentemente visuais e explorat?rias. Criar uma experi?ncia de colabora??o em tempo real s?lida exige dividir o estado em duas camadas bem distintas:

1. **Estado Dur?vel (Shared State):** O grafo real (`nodes`, `edges` e propriedades de dados). Este estado deve ser consistente entre todos os usu?rios, sendo sincronizado preferencialmente via **CRDTs (Conflict-free Replicated Data Types)** como **Yjs** ou servi?os como **Liveblocks**.
2. **Estado Ef?mero (Awareness / Presence):** Dados tempor?rios que n?o precisam de persist?ncia no banco, como posi??es de cursores do mouse dos outros usu?rios, sele??o ativa de n?s e status online/offline.

---

## 1. Arquitetura de Sincroniza??o

```
+--------------------------------------------------------------------+
|                         CLIENTE REACT FLOW                         |
|                                                                    |
|  [ ReactFlow Canvas ] <---> [ Zustand Store / useReactFlow ]       |
|                                     ^                              |
|                                     |                              |
|                     +---------------+---------------+              |
|                     |                               |              |
|          [ Yjs Shared Map/Array ]        [ Yjs Awareness ]         |
|          (Nodes, Edges, Data)            (Cursors, Selection)      |
+---------------------+-------------------------------+--------------+
                      ^                               ^
                      | WebSockets Provider           | WebSockets
                      v                               v
+--------------------------------------------------------------------+
|                   SERVIDOR DE WEBSOCKETS (Y-WEBSOCKET)             |
+--------------------------------------------------------------------+
```

---

## 2. Implementa??o de Cursores Compartilhados

Para renderizar cursores de outros usu?rios sobre o canvas com coordenadas precisas, converta as coordenadas da tela para as coordenadas do fluxo utilizando `screenToFlowPosition`:

### `useMultiplayerCursors.ts`

```typescript
import { useCallback, useEffect, useState } from 'react';
import { useReactFlow } from '@xyflow/react';

export type UserPresence = {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
};

export function useMultiplayerCursors() {
  const { screenToFlowPosition } = useReactFlow();
  const [remoteUsers, setRemoteUsers] = useState<UserPresence[]>([]);

  // Envia posi??o do cursor local quando o mouse se move sobre o canvas
  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    const flowPosition = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Exemplo de envio via WebSocket / Awareness
    // awareness.setLocalStateField('cursor', { x: flowPosition.x, y: flowPosition.y });
  }, [screenToFlowPosition]);

  return { remoteUsers, handlePointerMove };
}
```

### `CollaborativeCursorsLayer.tsx`

```tsx
import React from 'react';
import { ViewportPortal } from '@xyflow/react';
import { UserPresence } from './useMultiplayerCursors';

export function CollaborativeCursorsLayer({ users }: { users: UserPresence[] }) {
  return (
    <ViewportPortal>
      {users.map((user) => (
        <div
          key={user.id}
          style={{
            position: 'absolute',
            left: user.x,
            top: user.y,
            pointerEvents: 'none',
            transform: 'translate(-2px, -2px)',
            transition: 'transform 0.08s ease-out',
            zIndex: 1000,
          }}
        >
          {/* ?cone de Cursor SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
              fill={user.color || '#3b82f6'}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </svg>
          {/* Tag de Nome do Usu?rio */}
          <div
            style={{
              backgroundColor: user.color || '#3b82f6',
              color: '#ffffff',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 600,
              marginLeft: 14,
              marginTop: -6,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }}
          >
            {user.name}
          </div>
        </div>
      ))}
    </ViewportPortal>
  );
}
```

---

## 3. Sincroniza??o com Yjs (CRDTs)

Ao sincronizar `nodes` e `edges` com Yjs:

1. Use um `Y.Array` ou `Y.Map` para armazenar n?s.
2. Aplique altera??es locais com `onNodesChange` diretamente no array Yjs.
3. Observe altera??es com `yNodes.observe(...)` para atualizar o estado do React Flow de forma reativa.

```typescript
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Node, Edge } from '@xyflow/react';

export function setupYjsRoom(roomName: string, onUpdate: (nodes: Node[], edges: Edge[]) => void) {
  const doc = new Y.Doc();
  const provider = new WebsocketProvider('wss://demos.yjs.dev', roomName, doc);
  const yNodes = doc.getArray<Node>('nodes');
  const yEdges = doc.getArray<Edge>('edges');

  yNodes.observe(() => {
    onUpdate(yNodes.toArray(), yEdges.toArray());
  });

  return { doc, provider, yNodes, yEdges };
}
```

---

## 4. Boas Pr?ticas para Colabora??o em Grafos

- **N?o sincronize `selected: true` no banco:** A sele??o deve ser um estado ef?mero (Awareness) para que m?ltiplos usu?rios possam selecionar n?s diferentes simultaneamente.
- **Evite conflitos de arrasto simult?neo:** Se o Usu?rio A estiver arrastando o N? 1, envie um evento de bloqueio tempor?rio (lock) via awareness para indicar visualmente que aquele n? est? sendo manipulado por outro membro da equipe.
