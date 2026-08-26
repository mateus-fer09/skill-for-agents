---
title: "Algoritmos de Layout Automático: Dagre e ELKjs no React Flow"
description: "Implementações completas, código fonte funcional e comparativo detalhado de layout automático com Dagre e ELKjs no React Flow (@xyflow/react)."
topics: ["algoritmos-layout", "dagre", "elkjs", "auto-layout", "hierarchical-layout", "force-layout", "radial-layout"]
keywords: ["@dagrejs/dagre", "elkjs", "elk.algorithm: 'layered'", "rankdir", "nodesep", "ranksep", "getLayoutedElements"]
source_scope: "React Flow Docs: Learn > Layouting > Overview (Dagre & Elkjs sections)"
---

# Algoritmos de Layout Automático: Dagre e ELKjs

O posicionamento automático de nós e arestas é fundamental para sistemas que geram grafos a partir de bancos de dados, árvores de decisão ou pipelines de automação.

As duas soluções mais consagradas para o React Flow são o **Dagre** (simples, rápido e síncrono) e o **ELKjs** (robusto, assíncrono e altamente configurável).

---

## 1. Layout com Dagre (`@dagrejs/dagre`)

O Dagre organiza grafos direcionados em camadas hierárquicas (algoritmo de Sugiyama). Ele é a recomendação oficial para 90% dos casos de árvores e fluxogramas verticais ou horizontais.

### Instalação
```bash
npm install @dagrejs/dagre
```

### Implementação Completa e Intacta da Aplicação com Dagre

#### `nodes-edges.js`
```javascript
export const initialNodes = [
  { id: '1', type: 'input', data: { label: 'input' }, position: { x: 0, y: 0 } },
  { id: '2', data: { label: 'node 2' }, position: { x: 0, y: 100 } },
  { id: '2a', data: { label: 'node 2a' }, position: { x: 0, y: 200 } },
  { id: '2b', data: { label: 'node 2b' }, position: { x: 0, y: 300 } },
  { id: '2c', data: { label: 'node 2c' }, position: { x: 0, y: 400 } },
  { id: '2d', data: { label: 'node 2d' }, position: { x: 0, y: 500 } },
  { id: '3', data: { label: 'node 3' }, position: { x: 200, y: 100 } },
];

export const initialEdges = [
  { id: 'e12', source: '1', target: '2', animated: true },
  { id: 'e13', source: '1', target: '3', animated: true },
  { id: 'e22a', source: '2', target: '2a', animated: true },
  { id: 'e22b', source: '2', target: '2b', animated: true },
  { id: 'e22c', source: '2', target: '2c', animated: true },
  { id: 'e2c2d', source: '2c', target: '2d', animated: true },
];
```

#### `App.jsx`
```jsx
import Dagre from '@dagrejs/dagre';
import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
} from '@xyflow/react';

import { initialNodes, initialEdges } from './nodes-edges.js';
import '@xyflow/react/dist/style.css';

const getLayoutedElements = (nodes: Node[], edges: Edge[], options: { direction: 'TB' | 'LR' }) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  
  // Define a direção: 'TB' (Top-to-Bottom) ou 'LR' (Left-to-Right)
  g.setGraph({ rankdir: options.direction, nodesep: 50, ranksep: 80 });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 172,
      height: node.measured?.height ?? 36,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // O Dagre posiciona pelo centro do nó, ajustamos para o canto superior-esquerdo
      const x = position.x - (node.measured?.width ?? 172) / 2;
      const y = position.y - (node.measured?.height ?? 36) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

function LayoutFlow() {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(
    (direction: 'TB' | 'LR') => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      // Enquadra a tela após a reorganização
      window.requestAnimationFrame(() => {
        fitView({ duration: 600 });
      });
    },
    [nodes, edges, fitView, setNodes, setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      colorMode="system"
    >
      <Panel position="top-right" className="flex gap-2 bg-white/80 dark:bg-zinc-900/80 p-2 rounded-lg border shadow">
        <button
          onClick={() => onLayout('TB')}
          className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Layout Vertical (TB)
        </button>
        <button
          onClick={() => onLayout('LR')}
          className="px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded hover:bg-zinc-200"
        >
          Layout Horizontal (LR)
        </button>
      </Panel>
    </ReactFlow>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <LayoutFlow />
      </ReactFlowProvider>
    </div>
  );
}
```

---

## 2. Layout com ELKjs (`elkjs`)

O **ELK (Eclipse Layout Kernel)** é a engine de layout mais poderosa do ecossistema. Ele opera de forma assíncrona (compatível com Web Workers) e suporta subfluxos complexos, multi-portas e diferentes famílias de algoritmos (`layered`, `radial`, `force`, `mrtree`).

### Instalação
```bash
npm install elkjs
```

### Implementação Completa e Intacta com ELKjs

#### `App.jsx`
```jsx
import ELK from 'elkjs/lib/elk.bundled.js';
import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';

import { initialNodes, initialEdges } from './nodes-edges.js';
import '@xyflow/react/dist/style.css';

const elk = new ELK();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80,
  };

  const getLayoutedElements = useCallback((options) => {
    const layoutOptions = { ...defaultOptions, ...options };
    const graph = {
      id: 'root',
      layoutOptions: layoutOptions,
      children: getNodes().map((node) => ({
        ...node,
        width: node.measured?.width ?? 172,
        height: node.measured?.height ?? 36,
      })),
      edges: getEdges(),
    };

    elk.layout(graph).then(({ children }) => {
      // Atualiza as posições calculadas pelo ELK
      const updatedNodes = children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      }));

      setNodes(updatedNodes);
      window.requestAnimationFrame(() => {
        fitView({ duration: 600 });
      });
    });
  }, [getNodes, getEdges, setNodes, fitView]);

  return { getLayoutedElements };
};

const LayoutFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { getLayoutedElements } = useLayoutedElements();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      colorMode="system"
    >
      <Panel position="top-right" className="grid grid-cols-2 gap-2 bg-white/90 dark:bg-zinc-900/90 p-3 rounded-xl border shadow-xl">
        <button
          onClick={() =>
            getLayoutedElements({
              'elk.algorithm': 'layered',
              'elk.direction': 'DOWN',
            })
          }
          className="px-2.5 py-1 text-xs bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700"
        >
          Hierárquico Vertical
        </button>
        <button
          onClick={() =>
            getLayoutedElements({
              'elk.algorithm': 'layered',
              'elk.direction': 'RIGHT',
            })
          }
          className="px-2.5 py-1 text-xs bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700"
        >
          Hierárquico Horizontal
        </button>
        <button
          onClick={() =>
            getLayoutedElements({
              'elk.algorithm': 'org.eclipse.elk.radial',
            })
          }
          className="px-2.5 py-1 text-xs bg-purple-600 text-white rounded font-medium hover:bg-purple-700"
        >
          Layout Radial
        </button>
        <button
          onClick={() =>
            getLayoutedElements({
              'elk.algorithm': 'org.eclipse.elk.force',
            })
          }
          className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700"
        >
          Layout de Força
        </button>
      </Panel>
    </ReactFlow>
  );
};

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <LayoutFlow />
      </ReactFlowProvider>
    </div>
  );
}
```

---

## 3. Tabela Comparativa Detalhada: Dagre vs ELKjs

| Critério | Dagre (`@dagrejs/dagre`) | ELKjs (`elkjs`) |
| :--- | :--- | :--- |
| **Peso do Pacote** | ~40 KB (Muito Leve) | ~1.5 MB (Bundle Completo WebAssembly/JS) |
| **Execução** | Síncrona | Assíncrona (Promise / Web Worker) |
| **Subfluxos Aninhados** | Limitado (conflito em conexões externas) | Suporte Nativo Completo |
| **Famílias de Algoritmos** | Apenas Hierárquico (Sugiyama) | Layered, Radial, Force, Tree, Box |
| **Espaçamento de Portas** | Básico | Totalmente Configurável |
| **Curva de Aprendizado** | 5 minutos | Moderada a Alta |
| **Recomendação** | Comece sempre com Dagre | Use quando precisar de subfluxos complexos ou layouts não-lineares |
