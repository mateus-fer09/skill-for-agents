---
title: "Tutorial Completo: Construindo um Aplicativo de Mind Map (Mapa Mental) com React Flow"
description: "Tutorial passo a passo completo e exaustivo para criar uma aplica??o de mapa mental interativo com React Flow v12, n?s customizados expans?veis, arestas org?nicas curvas, store Zustand, auto-layout hier?rquico e atalhos de teclado."
topics:
  - "Estrutura Hier?rquica em ?rvore"
  - "Custom Node com Input Edit?vel e Auto-focus"
  - "Custom Edge com Curvas Suaves"
  - "Store Zustand para ?rvores de N?s"
  - "Navega??o e Atalhos de Teclado"
keywords:
  - "mind map"
  - "tutorial"
  - "MindMapNode"
  - "MindMapEdge"
  - "hierarchical tree"
  - "zustand store"
  - "auto focus"
  - "@xyflow/react"
source_scope: "Tutorials / Mind Map App"
---

# Tutorial Completo: Construindo um Aplicativo de Mind Map (Mapa Mental) com React Flow

Neste tutorial completo, voc? aprender? a construir um aplicativo interativo de **Mapa Mental (Mind Map)** do zero utilizando o React Flow v12 (`@xyflow/react`) e **Zustand**.

O aplicativo final permite:
1. Criar n?s filhos dinamicamente a partir de qualquer n? existente clicando no bot?o `+`.
2. Edi??o de texto inline com redimensionamento autom?tico de largura e foco imediato.
3. Arestas customizadas com curvas org?nicas centralizadas entre os n?s.
4. Gerenciamento de estado hier?rquico com Zustand.
5. Atalhos de teclado para produtividade (Enter / Tab para novos n?s).

---

## 1. Arquitetura e Tipagem do Projeto

O projeto ? estruturado nos seguintes arquivos:
- `src/types.ts`: Tipos do mapa mental, n?s e store.
- `src/store.ts`: Store Zustand gerenciando cria??o de n?s, c?lculo de posi??es relativas e atualiza??o de texto.
- `src/MindMapNode/index.tsx`: Componente de n? customizado com input auto-ajust?vel.
- `src/MindMapEdge/index.tsx`: Componente de aresta customizada curva conectando o centro dos n?s.
- `src/App.tsx`: Componente raiz com React Flow Canvas.
- `src/index.css`: Estilos para n?s sem borda, handles invis?veis e input din?mico.

---

## 2. C?digo Completo dos Arquivos

### `src/types.ts`

```typescript
import { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';

export type MindMapNodeData = {
  label: string;
};

export type MindMapNodeType = Node<MindMapNodeData, 'mindmap'>;

export type MindMapState = {
  nodes: MindMapNodeType[];
  edges: Edge[];
  onNodesChange: OnNodesChange<MindMapNodeType>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeLabel: (targetId: string, label: string) => void;
  addChildNode: (parentNode: MindMapNodeType, position: { x: number; y: number }) => void;
};
```

### `src/store.ts`

```typescript
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { MindMapState, MindMapNodeType } from './types';

const initialNodes: MindMapNodeType[] = [
  {
    id: 'root',
    type: 'mindmap',
    data: { label: 'Ideia Central' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'child-1',
    type: 'mindmap',
    data: { label: 'Planejamento' },
    position: { x: 220, y: -60 },
  },
  {
    id: 'child-2',
    type: 'mindmap',
    data: { label: 'Desenvolvimento' },
    position: { x: 220, y: 60 },
  },
];

const initialEdges = [
  { id: 'e-root-1', source: 'root', target: 'child-1', type: 'mindmap' },
  { id: 'e-root-2', source: 'root', target: 'child-2', type: 'mindmap' },
];

export const useStore = create<MindMapState>((set, get) => ({
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
      edges: addEdge({ ...connection, type: 'mindmap' }, get().edges),
    });
  },

  updateNodeLabel: (targetId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === targetId) {
          return {
            ...node,
            data: { ...node.data, label },
          };
        }
        return node;
      }),
    });
  },

  addChildNode: (parentNode: MindMapNodeType, position: { x: number; y: number }) => {
    const newNode: MindMapNodeType = {
      id: nanoid(),
      type: 'mindmap',
      data: { label: 'Novo T?pico' },
      position,
    };

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
      type: 'mindmap',
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },
}));
```

### `src/MindMapNode/index.tsx`

```tsx
import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useStore } from '../store';
import { MindMapNodeType } from '../types';

export function MindMapNode({ id, data }: NodeProps<MindMapNodeType>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const addChildNode = useStore((state) => state.addChildNode);

  // Auto-dimensionamento da largura do input com base no texto
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${Math.max(80, (data.label.length + 2) * 9)}px`;
    }
  }, [data.label]);

  const handleAddChild = () => {
    if (!inputRef.current) return;
    // Calcula a nova posi??o deslocada para a direita
    addChildNode(
      { id, type: 'mindmap', data, position: { x: 0, y: 0 } },
      { x: 220, y: (Math.random() - 0.5) * 120 }
    );
  };

  return (
    <div className="mindmap-node">
      <Handle type="target" position={Position.Left} className="mindmap-handle" />

      <input
        ref={inputRef}
        value={data.label}
        onChange={(evt) => updateNodeLabel(id, evt.target.value)}
        className="mindmap-input nodrag"
      />

      <button onClick={handleAddChild} className="mindmap-button nodrag">
        +
      </button>

      <Handle type="source" position={Position.Right} className="mindmap-handle" />
    </div>
  );
}
```

### `src/MindMapEdge/index.tsx`

```tsx
import React from 'react';
import { BaseEdge, EdgeProps, getStraightPath } from '@xyflow/react';

export function MindMapEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;

  // Curva Bezier personalizada conectando pontos de forma suave
  const deltaX = targetX - sourceX;
  const deltaY = targetY - sourceY;
  const controlX = sourceX + deltaX * 0.5;

  const path = `M ${sourceX} ${sourceY} C ${controlX} ${sourceY}, ${controlX} ${targetY}, ${targetX} ${targetY}`;

  return (
    <BaseEdge
      path={path}
      {...props}
      style={{
        stroke: '#475569',
        strokeWidth: 2.5,
      }}
    />
  );
}
```

### `src/App.tsx`

```tsx
import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Panel,
  useReactFlow,
  NodeTypes,
  EdgeTypes
} from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';
import '@xyflow/react/dist/style.css';

import { useStore } from './store';
import { MindMapNode } from './MindMapNode';
import { MindMapEdge } from './MindMapEdge';

const nodeTypes: NodeTypes = {
  mindmap: MindMapNode,
};

const edgeTypes: EdgeTypes = {
  mindmap: MindMapEdge,
};

export default function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
    }))
  );

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0f172a' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodeOrigin={[0.5, 0.5]}
          fitView
        >
          <Background gap={20} color="#334155" />
          <Controls />
          <Panel position="top-left" style={{ color: '#f8fafc', fontSize: 14, fontWeight: 'bold' }}>
            ?? Mind Map Interativo
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
```

### `src/index.css`

```css
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

.mindmap-node {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1e293b;
  padding: 6px 10px;
  border-radius: 20px;
  border: 1.5px solid #475569;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
}

.mindmap-node:focus-within {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.3);
}

.mindmap-input {
  background: transparent;
  border: none;
  color: #f8fafc;
  font-size: 13px;
  font-weight: 600;
  outline: none;
  padding: 2px 4px;
}

.mindmap-button {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: #38bdf8;
  color: #0f172a;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.mindmap-button:hover {
  transform: scale(1.15);
  background: #7dd3fc;
}

.mindmap-handle {
  opacity: 0;
  pointer-events: none;
}
```
