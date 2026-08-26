---
title: "Fluxos de Computa??o Reativos no React Flow"
description: "Guia avan?ado para constru??o de grafos de computa??o direcionados (DAG) e propaga??o de dados em tempo real no React Flow v12 usando useHandleConnections, useNodesData e n?s funcionais."
topics:
  - "Grafos Ac?clicos Direcionados (DAG)"
  - "Propaga??o Reativa de Dados"
  - "useHandleConnections e useNodesData"
  - "Tutorial Completo de Misturador de Cores"
  - "Preven??o de Ciclos e Loops Infinitos"
keywords:
  - "computing flows"
  - "reactive graph"
  - "DAG"
  - "useNodesData"
  - "useHandleConnections"
  - "data transformation"
  - "@xyflow/react"
source_scope: "Learn / Advanced Use / Computing Flows"
---

# Fluxos de Computa??o Reativos no React Flow

Um dos casos de uso mais poderosos do React Flow ? a cria??o de **Grafos de Computa??o** (Data Pipelines, sintetizadores de ?udio, processadores visuais de ETL, editores de shaders e l?gica baseada em n?s).

No React Flow v12, a biblioteca introduziu uma arquitetura reativa nativa baseada nos hooks `useHandleConnections` e `useNodesData`, eliminando a necessidade de propaga??o manual complexa via props.

---

## 1. O Padr?o de Propaga??o Reativa (Pipeline DAG)

Em um fluxo de computa??o t?pico:
1. **N?s Produtores (Sources):** N?s de entrada (como inputs num?ricos, sliders ou seletores) gravam valores no seu pr?prio objeto `data.value`.
2. **N?s Conectores:** As arestas definem o caminho por onde os dados fluem.
3. **N?s Transformadores (Processors):** L?em os dados dos n?s conectados ? sua entrada usando `useHandleConnections` e `useNodesData`, processam o c?lculo (ex: soma, multiplica??o, interpola??o de cor) e gravam o resultado em seu pr?prio `data.value`.
4. **N?s Consumidores (Sinks / Outputs):** Exibem visualiza??es finais (preview de cor, gr?ficos, logs).

---

## 2. Implementa??o Completa do Projeto: Pipeline de Cores RGB

Neste exemplo completo, criamos n?s de entrada num?rica (`NumberInput`), um n? de ajuste de luminosidade (`Lightness`), um n? de renderiza??o de cor calculada (`ColorPreview`) e um n? de hist?rico (`Log`).

### `NumberInput.jsx`

```jsx
import React, { useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export function NumberInput({ id, data }) {
  const { updateNodeData } = useReactFlow();

  const handleChange = useCallback((evt) => {
    const value = Math.max(0, Math.min(255, Number(evt.target.value) || 0));
    updateNodeData(id, { value });
  }, [id, updateNodeData]);

  return (
    <div style={{
      padding: '10px 14px',
      background: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: 8,
      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
      fontSize: 12
    }}>
      <div style={{ fontWeight: 600, color: '#334155', marginBottom: 6 }}>
        {data.label || 'Canal de Cor (0-255)'}
      </div>
      <input
        type="number"
        min={0}
        max={255}
        value={data.value ?? 0}
        onChange={handleChange}
        className="nodrag"
        style={{
          width: '100%',
          padding: '6px 8px',
          borderRadius: 4,
          border: '1px solid #94a3b8',
          fontSize: 13
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="value-out"
        style={{ background: '#3b82f6', width: 8, height: 8 }}
      />
    </div>
  );
}
```

### `Lightness.jsx`

```jsx
import React, { useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export function Lightness({ id, data }) {
  const { updateNodeData } = useReactFlow();

  const handleChange = useCallback((evt) => {
    const lightness = Number(evt.target.value);
    updateNodeData(id, { lightness });
  }, [id, updateNodeData]);

  return (
    <div style={{
      padding: '10px 14px',
      background: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: 8,
      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
      fontSize: 12
    }}>
      <div style={{ fontWeight: 600, color: '#334155', marginBottom: 6 }}>
        Fator de Brilho: {data.lightness ?? 100}%
      </div>
      <input
        type="range"
        min={0}
        max={200}
        value={data.lightness ?? 100}
        onChange={handleChange}
        className="nodrag"
        style={{ width: '100%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="lightness-out"
        style={{ background: '#f59e0b', width: 8, height: 8 }}
      />
    </div>
  );
}
```

### `ColorPreview.jsx`

```jsx
import React, { useEffect } from 'react';
import { Handle, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';

export function ColorPreview({ id }) {
  const { updateNodeData } = useReactFlow();

  const rConnections = useHandleConnections({ type: 'target', id: 'red' });
  const gConnections = useHandleConnections({ type: 'target', id: 'green' });
  const bConnections = useHandleConnections({ type: 'target', id: 'blue' });
  const lightConnections = useHandleConnections({ type: 'target', id: 'lightness' });

  const rData = useNodesData(rConnections.map((c) => c.source));
  const gData = useNodesData(gConnections.map((c) => c.source));
  const bData = useNodesData(bConnections.map((c) => c.source));
  const lightData = useNodesData(lightConnections.map((c) => c.source));

  const factor = (lightData[0]?.lightness ?? 100) / 100;
  const rawR = rData[0]?.value ?? 0;
  const rawG = gData[0]?.value ?? 0;
  const rawB = bData[0]?.value ?? 0;

  const r = Math.min(255, Math.round(rawR * factor));
  const g = Math.min(255, Math.round(rawG * factor));
  const b = Math.min(255, Math.round(rawB * factor));

  const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  useEffect(() => {
    updateNodeData(id, { computedColor: hexColor });
  }, [id, hexColor, updateNodeData]);

  return (
    <div style={{
      padding: 14,
      background: '#ffffff',
      border: '2px solid #0f172a',
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      minWidth: 160
    }}>
      <Handle type="target" position={Position.Left} id="red" style={{ top: '25%', background: '#ef4444' }} />
      <Handle type="target" position={Position.Left} id="green" style={{ top: '50%', background: '#22c55e' }} />
      <Handle type="target" position={Position.Left} id="blue" style={{ top: '75%', background: '#3b82f6' }} />
      <Handle type="target" position={Position.Top} id="lightness" style={{ background: '#f59e0b' }} />

      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#1e293b' }}>
        Preview Composto
      </div>

      <div style={{
        width: '100%',
        height: 60,
        backgroundColor: hexColor,
        borderRadius: 6,
        border: '1px solid rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#000' : '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        fontFamily: 'monospace'
      }}>
        {hexColor.toUpperCase()}
      </div>

      <Handle type="source" position={Position.Right} id="color-out" style={{ background: '#64748b' }} />
    </div>
  );
}
```

### `Log.jsx`

```jsx
import React from 'react';
import { Handle, Position, useHandleConnections, useNodesData } from '@xyflow/react';

export function LogNode({ id }) {
  const connections = useHandleConnections({ type: 'target', id: 'log-in' });
  const connectedData = useNodesData(connections.map((c) => c.source));

  const incomingColor = connectedData[0]?.computedColor || 'N/A';

  return (
    <div style={{
      padding: '10px 14px',
      background: '#0f172a',
      color: '#38bdf8',
      borderRadius: 8,
      fontFamily: 'monospace',
      fontSize: 12,
      minWidth: 150
    }}>
      <Handle type="target" position={Position.Left} id="log-in" style={{ background: '#38bdf8' }} />
      <div style={{ color: '#94a3b8', fontSize: 10, marginBottom: 4 }}>LOGGER MONITOR</div>
      <div>VAL: {incomingColor}</div>
    </div>
  );
}
```

### `App.jsx`

```jsx
import React from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { NumberInput } from './NumberInput';
import { Lightness } from './Lightness';
import { ColorPreview } from './ColorPreview';
import { LogNode } from './Log';

const nodeTypes: NodeTypes = {
  numberInput: NumberInput,
  lightness: Lightness,
  colorPreview: ColorPreview,
  logNode: LogNode,
};

const initialNodes = [
  { id: 'red-input', type: 'numberInput', data: { label: 'Canal Vermelho (R)', value: 240 }, position: { x: 50, y: 50 } },
  { id: 'green-input', type: 'numberInput', data: { label: 'Canal Verde (G)', value: 100 }, position: { x: 50, y: 160 } },
  { id: 'blue-input', type: 'numberInput', data: { label: 'Canal Azul (B)', value: 40 }, position: { x: 50, y: 270 } },
  { id: 'lightness-input', type: 'lightness', data: { lightness: 100 }, position: { x: 280, y: -40 } },
  { id: 'preview', type: 'colorPreview', data: {}, position: { x: 340, y: 120 } },
  { id: 'logger', type: 'logNode', data: {}, position: { x: 580, y: 160 } },
];

const initialEdges = [
  { id: 'e-r', source: 'red-input', sourceHandle: 'value-out', target: 'preview', targetHandle: 'red' },
  { id: 'e-g', source: 'green-input', sourceHandle: 'value-out', target: 'preview', targetHandle: 'green' },
  { id: 'e-b', source: 'blue-input', sourceHandle: 'value-out', target: 'preview', targetHandle: 'blue' },
  { id: 'e-light', source: 'lightness-input', sourceHandle: 'lightness-out', target: 'preview', targetHandle: 'lightness' },
  { id: 'e-log', source: 'preview', sourceHandle: 'color-out', target: 'logger', targetHandle: 'log-in' },
];

export default function ComputingFlowApp() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background gap={12} size={1} />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
```

---

## 3. Preven??o de Loops e Ciclos no Grafo

Em fluxos de computa??o, conex?es circulares (A -> B -> A) causam loops infinitos. Valide conex?es via `isValidConnection`:

```tsx
import { useCallback } from 'react';
import { Connection, getOutgoers, Node, Edge } from '@xyflow/react';

export function useCycleValidation(nodes: Node[], edges: Edge[]) {
  return useCallback(
    (connection: Connection) => {
      const target = nodes.find((n) => n.id === connection.target);
      const hasCycle = (node: Node, visited = new Set<string>()): boolean => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);
        if (node.id === connection.source) return true;
        return getOutgoers(node, nodes, edges).some((outgoer) => hasCycle(outgoer, visited));
      };

      if (!target) return true;
      return !hasCycle(target);
    },
    [nodes, edges]
  );
}
```
