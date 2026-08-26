---
title: "Gerenciamento de Estado com Zustand no React Flow"
description: "Padr?o de arquitetura profissional para gerenciamento de estado global com Zustand no React Flow v12, desacoplando l?gica de UI, a??es at?micas, n?s customizados reativos, Undo/Redo com zundo e seletores otimizados."
topics:
  - "Zustand Store Architecture"
  - "Sincroniza??o de Nodes e Edges"
  - "A??es At?micas e Node Data Updates"
  - "Custom Nodes conectados ? Store"
  - "Undo/Redo com Zundo (Temporal)"
  - "Performance e useShallow"
keywords:
  - "zustand"
  - "state management"
  - "React Flow store"
  - "applyNodeChanges"
  - "applyEdgeChanges"
  - "useShallow"
  - "undo redo"
  - "@xyflow/react"
source_scope: "Learn / Guides / State Management & Tutorial Web Audio/Mindmap"
---

# Gerenciamento de Estado com Zustand no React Flow

? medida que uma aplica??o baseada em grafos cresce, gerenciar `nodes` e `edges` apenas no estado local do componente pai (`useState` ou `useNodesState`) torna-se limitante. Fun??es passadas atrav?s do objeto `data` violam princ?pios de imutabilidade e poluem a ?rvore de componentes.

Integrar o **Zustand** centraliza o grafo em uma store global ?nica, permitindo que n?s customizados, menus contextuais e sidebars disparem a??es at?micas diretamente.

---

## 1. Arquitetura da Store

Uma store Zustand t?pica para React Flow gerencia:
- `nodes`: Array de n?s do grafo.
- `edges`: Array de conex?es/arestas.
- `onNodesChange`: Aplica altera??es de arrasto, sele??o e dele??o via `applyNodeChanges`.
- `onEdgesChange`: Aplica altera??es de conex?es via `applyEdgeChanges`.
- `onConnect`: Cria novas arestas via `addEdge`.
- **A??es Customizadas**: Como `updateNodeColor`, `addNode`, `deleteNodeHierarchy`, etc.

---

## 2. Implementa??o Completa da Aplica??o Multi-arquivos

Abaixo est? a implementa??o completa de um aplicativo onde cada n? possui um seletor de cores que atualiza a cor de fundo do pr?prio n? e propaga dados pela store global.

### `types.ts`

```typescript
import { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';

export type ColorNodeData = {
  color: string;
  label?: string;
};

export type CustomNode = Node<ColorNodeData, 'colorChooser'>;

export type AppState = {
  nodes: CustomNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<CustomNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeColor: (nodeId: string, color: string) => void;
  addNewNode: () => void;
};
```

### `store.ts`

```typescript
import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { AppState, CustomNode } from './types';

const initialNodes: CustomNode[] = [
  {
    id: '1',
    type: 'colorChooser',
    data: { color: '#4f46e5', label: 'Origem Prim?ria' },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'colorChooser',
    data: { color: '#06b6d4', label: 'N? Secund?rio' },
    position: { x: 400, y: 100 },
  },
  {
    id: '3',
    type: 'colorChooser',
    data: { color: '#10b981', label: 'N? Destino' },
    position: { x: 250, y: 300 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  updateNodeColor: (nodeId: string, color: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              color,
            },
          };
        }
        return node;
      }),
    });
  },

  addNewNode: () => {
    const id = `node_${Date.now()}`;
    const newNode: CustomNode = {
      id,
      type: 'colorChooser',
      data: { color: '#f59e0b', label: `N? ${id.slice(-4)}` },
      position: {
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
      },
    };

    set({
      nodes: [...get().nodes, newNode],
    });
  },
}));
```

### `ColorChooserNode.tsx`

```tsx
import React, { memo, ChangeEvent } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useStore } from './store';
import { CustomNode } from './types';

function ColorChooserNodeComponent({ id, data }: NodeProps<CustomNode>) {
  const updateNodeColor = useStore((state) => state.updateNodeColor);

  const handleColorChange = (evt: ChangeEvent<HTMLInputElement>) => {
    updateNodeColor(id, evt.target.value);
  };

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: 10,
        background: data.color || '#ffffff',
        color: '#ffffff',
        border: '2px solid rgba(255,255,255,0.7)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
        minWidth: 160,
        fontFamily: 'sans-serif'
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#fff', width: 10, height: 10 }}
      />
      
      <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 8, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
        {data.label || id}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.2)', padding: 6, borderRadius: 6 }}>
        <input
          type="color"
          value={data.color}
          onChange={handleColorChange}
          className="nodrag"
          style={{ cursor: 'pointer', border: 'none', width: 28, height: 28, borderRadius: 4, background: 'transparent' }}
        />
        <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{data.color}</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#fff', width: 10, height: 10 }}
      />
    </div>
  );
}

export const ColorChooserNode = memo(ColorChooserNodeComponent);
```

### `App.tsx`

```tsx
import React from 'react';
import { ReactFlow, Background, Controls, Panel, NodeTypes } from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';
import '@xyflow/react/dist/style.css';

import { useStore } from './store';
import { ColorChooserNode } from './ColorChooserNode';

const nodeTypes: NodeTypes = {
  colorChooser: ColorChooserNode,
};

export default function App() {
  // useShallow evita re-renders se os arrays nodes e edges n?o mudarem por refer?ncia rasa
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNewNode } = useStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      addNewNode: state.addNewNode,
    }))
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background gap={16} size={1} />
        <Controls />
        <Panel position="top-right">
          <button
            onClick={addNewNode}
            style={{
              padding: '10px 16px',
              background: '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.4)'
            }}
          >
            + Adicionar N? de Cor
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
```

---

## 3. Implementando Undo / Redo com Zundo (Temporal)

O pacote `zundo` adiciona hist?rico de a??es ? store Zustand sem complexidade adicional.

```bash
npm install zundo
```

### Configura??o da Store com Hist?rico

```typescript
import { create } from 'zustand';
import { temporal } from 'zundo';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { AppState } from './types';

export const useStore = create<AppState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
      onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
      updateNodeColor: (id, color) => {
        set({
          nodes: get().nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, color } } : n)),
        });
      },
      addNewNode: () => {
        // implementa??o
      }
    }),
    {
      limit: 50,
      equality: (pastState, currentState) => 
        pastState.nodes === currentState.nodes && pastState.edges === currentState.edges,
    }
  )
);
```

---

## 4. Boas Pr?ticas e Otimiza??o

1. **Sempre use `useShallow` ou Seletores Individuais:** Evite chamar `useStore()` sem argumentos para prevenir re-renders globais desnecess?rios.
2. **Defina `nodeTypes` Fora do Componente:** Declarar `nodeTypes` fora da fun??o do componente garante refer?ncias est?veis de renderiza??o.
3. **Mantenha a Imutabilidade:** Ao atualizar n?s na store, utilize `.map()` criando um novo objeto para o n? modificado.
