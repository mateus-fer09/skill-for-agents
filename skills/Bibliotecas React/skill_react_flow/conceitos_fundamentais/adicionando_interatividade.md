---
title: "Adicionando Interatividade: Fluxos Controlados, Eventos e Conexões"
description: "Guia completo de gerenciamento de estado e interatividade no React Flow: useNodesState, useEdgesState, onNodesChange, onEdgesChange, onConnect, addEdge, isValidConnection e reconexão."
topics: ["interatividade", "fluxo-controlado", "useNodesState", "useEdgesState", "onConnect", "addEdge", "isValidConnection"]
keywords: ["applyNodeChanges", "applyEdgeChanges", "onNodesChange", "onEdgesChange", "onConnect", "reconnectEdge", "onDelete", "NodeChange", "EdgeChange"]
source_scope: "React Flow Docs: Learn > Concepts > Adding Interactivity, API Reference > Hooks & Utils"
---

# Adicionando Interatividade: Fluxos Controlados, Eventos e Conexões

Por padrão, quando você passa arrays estáticos para as propriedades `nodes` e `edges`, o React Flow funciona em **modo controlado (Controlled Flow)**: nenhuma alteração de posição, seleção, conexão ou exclusão será refletida na tela a menos que você informe ao React Flow como atualizar esse estado.

---

## 1. Os Hooks de Estado `useNodesState` e `useEdgesState`

O `@xyflow/react` fornece dois hooks utilitários convenientes que combinam `useState`, `useCallback` e as funções de cálculo de delta `applyNodeChanges` e `applyEdgeChanges`:

```jsx
import { useNodesState, useEdgesState } from '@xyflow/react';

function InteractiveFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    />
  );
}
```

### O que acontece internamente?
Os hooks implementam o padrão abaixo utilizando `applyNodeChanges` e `applyEdgeChanges`:

```jsx
import { useState, useCallback } from 'react';
import { applyNodeChanges, applyEdgeChanges, type NodeChange, type EdgeChange } from '@xyflow/react';

// Equivalente manual ao useNodesState:
const [nodes, setNodes] = useState(initialNodes);
const onNodesChange = useCallback(
  (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
  []
);

// Equivalente manual ao useEdgesState:
const [edges, setEdges] = useState(initialEdges);
const onEdgesChange = useCallback(
  (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  []
);
```

---

## 2. Tipos de Alterações Atômicas (`NodeChange` e `EdgeChange`)

Quando qualquer interação ocorre no grafo, o React Flow emite um lote (`array`) de objetos de mudança contendo apenas o delta da ação:

### Variantes de `NodeChange`
- **`NodePositionChange`**: `{ id, type: 'position', position: { x, y }, dragging: boolean }`
- **`NodeDimensionChange`**: `{ id, type: 'dimensions', dimensions: { width, height }, resizing: boolean }`
- **`NodeSelectionChange`**: `{ id, type: 'select', selected: boolean }`
- **`NodeRemoveChange`**: `{ id, type: 'remove' }`
- **`NodeAddChange`**: `{ item: Node, type: 'add' }`
- **`NodeReplaceChange`**: `{ id, item: Node, type: 'replace' }`

### Variantes de `EdgeChange`
- **`EdgeSelectionChange`**: `{ id, type: 'select', selected: boolean }`
- **`EdgeRemoveChange`**: `{ id, type: 'remove' }`
- **`EdgeAddChange`**: `{ item: Edge, type: 'add' }`
- **`EdgeReplaceChange`**: `{ id, item: Edge, type: 'replace' }`

---

## 3. Conectando Nós com `onConnect` e a Função `addEdge`

Quando o usuário arrasta uma linha de conexão de um handle e solta sobre outro handle compatível, o callback `onConnect` é disparado recebendo um objeto `Connection`:
`{ source: string, target: string, sourceHandle: string | null, targetHandle: string | null }`.

A função utilitária `addEdge` converte esse objeto `Connection` em uma nova `Edge` e anexa ao array de arestas existente:

```jsx
import { useCallback } from 'react';
import { addEdge, type Connection } from '@xyflow/react';

const onConnect = useCallback(
  (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
  [setEdges]
);
```

Você também pode personalizar a aresta gerada passando configurações extras para o `addEdge`:

```jsx
const onConnect = useCallback(
  (connection: Connection) => {
    const customEdge = {
      ...connection,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
    };
    setEdges((eds) => addEdge(customEdge, eds));
  },
  [setEdges]
);
```

---

## 4. Validação de Conexões com `isValidConnection`

Para restringir quais nós ou handles podem se conectar (por exemplo, impedir conexões circulares ou tipos de dados incompatíveis), utilize a prop `isValidConnection`:

```tsx
import { useCallback } from 'react';
import { type Connection, type Edge } from '@xyflow/react';

const isValidConnection = useCallback(
  (connection: Connection | Edge) => {
    // Regra 1: Impedir auto-conexão (nó conectando a si mesmo)
    if (connection.source === connection.target) {
      return false;
    }

    // Regra 2: Impedir conexões duplicadas
    const jaExiste = edges.some(
      (e) => e.source === connection.source && e.target === connection.target
    );
    if (jaExiste) {
      return false;
    }

    return true;
  },
  [edges]
);
```

---

## 5. Reconectando Arestas com `onReconnect`

Para permitir que o usuário pegue a extremidade de uma aresta existente e a reconecte a outro nó, use o evento `onReconnect` em conjunto com a função auxiliar `reconnectEdge`:

```tsx
import { useCallback } from 'react';
import { reconnectEdge, type Edge, type Connection } from '@xyflow/react';

const onReconnect = useCallback(
  (oldEdge: Edge, newConnection: Connection) => {
    setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
  },
  [setEdges]
);
```

---

## 6. Exclusão de Elementos e Callbacks de Ciclo de Vida

O React Flow oferece controle total sobre exclusões de nós e arestas:

```tsx
// Callback disparado ANTES da exclusão (permite cancelar retornando false)
const onBeforeDelete = useCallback(
  async ({ nodes, edges }) => {
    const confirmou = window.confirm(
      `Deseja realmente excluir ${nodes.length} nó(s) e ${edges.length} aresta(s)?`
    );
    return confirmou;
  },
  []
);

// Callbacks disparados após a exclusão efetiva
const onNodesDelete = useCallback((deletedNodes) => {
  console.log('Nós removidos:', deletedNodes);
}, []);

const onEdgesDelete = useCallback((deletedEdges) => {
  console.log('Arestas removidas:', deletedEdges);
}, []);
```

---

## 7. Exemplo Completo de Aplicação Interativa

```tsx
import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  MarkerType,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: '1. Origem de Dados' },
    position: { x: 250, y: 50 },
  },
  {
    id: '2',
    data: { label: '2. Processamento A' },
    position: { x: 100, y: 180 },
  },
  {
    id: '3',
    data: { label: '3. Processamento B' },
    position: { x: 400, y: 180 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: '4. Destino Final' },
    position: { x: 250, y: 320 },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export default function InteractiveGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Manipulador de novas conexões
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  // Manipulador de reconexão de arestas
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
    },
    [setEdges]
  );

  // Validador de conexão
  const isValidConnection = useCallback(
    (connection: Connection | Edge) => connection.source !== connection.target,
    []
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        isValidConnection={isValidConnection}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
```
