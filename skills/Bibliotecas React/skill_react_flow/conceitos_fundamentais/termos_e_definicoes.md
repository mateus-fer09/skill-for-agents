---
title: "Termos e Definições Fundamentais do React Flow"
description: "Glossário exaustivo e arquitetura conceitual do React Flow: Nós, Arestas, Handles, Viewport, Pane, Extent, Conexões, Nós Internos e Store."
topics: ["termos", "definicoes", "conceitos-chave", "glossario", "arquitetura", "InternalNode", "Viewport"]
keywords: ["Node", "Edge", "Handle", "Viewport", "Pane", "Extent", "Connection", "InternalNode", "measured"]
source_scope: "React Flow Docs: Learn > Concepts > Overview (Key Concepts), API Reference > Types"
---

# Termos e Definições Fundamentais do React Flow

Para dominar o React Flow, é fundamental compreender com clareza o vocabulário e a arquitetura que regem o comportamento dos grafos, conexões e renderização.

---

## 1. Glossário de Conceitos Fundamentais

| Termo | Definição Técnica | Papel no React Flow |
| :--- | :--- | :--- |
| **Node (Nó / Vértice)** | Elemento visual posicionado no plano cartesiano `(x, y)` do grafo. | Representa entidades, blocos funcionais, etapas de processo ou cartões interativos. |
| **Edge (Aresta / Conexão)** | Linha ou curva vetorial (SVG) que conecta dois nós. | Representa fluxos de dados, dependências lógicas ou transições de estado. |
| **Handle (Ponto de Conexão / Porta)** | Ponto de ancoragem dentro de um nó onde arestas podem se originar ou terminar. | Pode ser do tipo `source` (origem) ou `target` (destino). |
| **Viewport (Câmera / Janela de Visualização)** | Estado de transformação geométrica composto por `{ x, y, zoom }`. | Converte coordenadas do grafo para pixels visíveis na tela do navegador. |
| **Canvas / Pane** | O plano infinito interativo sobre o qual nós e arestas são desenhados. | Captura eventos de clique, arraste de tela (pan), zoom e seleção em área. |
| **Connection (Tentativa de Conexão)** | Objeto transitório `{ source, target, sourceHandle, targetHandle }` criado enquanto o usuário arrasta uma linha de conexão. | Disparado antes de se tornar uma `Edge` persistida. |
| **InternalNode** | Representação enriquecida do nó mantida na store interna do React Flow. | Contém dimensões medidas pelo DOM (`measured.width`, `measured.height`), limites (`internals.bounds`) e handles mapeados. |
| **Extent (Delimitação)** | Limite de coordenadas geográficas (`[[minX, minY], [maxX, maxY]]` ou `'parent'`) que restringe o arraste de um nó. | Impede que nós saiam de uma área ou dos limites do nó pai em subfluxos. |
| **NodeOrigin** | Ponto de ancoragem relativo para o posicionamento do nó (`[x, y]`, onde `[0, 0]` é topo-esquerdo e `[0.5, 0.5]` é o centro). | Controla como as coordenadas `position: { x, y }` são aplicadas ao elemento. |

---

## 2. Diagrama de Relacionamento entre Conceitos

```
+========================================================================+
|  CANVAS / PANE (Viewport: x=0, y=0, zoom=1.0)                          |
|                                                                        |
|   +--------------------------+          EDGE (SmoothStep)              |
|   | NODE 1 (Type: 'input')   | ------------------------------------+   |
|   | ID: '1'                  |                                     |   |
|   | Pos: { x: 50, y: 100 }   |                                     |   |
|   | +----------------------+ |                                     |   |
|   | | SOURCE HANDLE (Port) | =========================+            |   |
|   | +----------------------+ |                        |            |   |
|   +--------------------------+                        v            |   |
|                                            +---------------------+ |   |
|                                            | TARGET HANDLE (Port)| |   |
|                                            | +-----------------+ | |   |
|                                            | | NODE 2 ('output')| | |   |
|                                            | | ID: '2'         | | |   |
|                                            | | Pos: {300, 250} | | |   |
|                                            | +-----------------+ | |   |
|                                            +---------------------+ |   |
+========================================================================+
```

---

## 3. Detalhamento dos Componentes do Sistema

### 3.1. Nós (`Nodes`) e Nós Internos (`InternalNodes`)
Enquanto um desenvolvedor declara um nó com propriedades simples:
```javascript
const node = {
  id: 'node-a',
  position: { x: 100, y: 200 },
  data: { label: 'Minha Etapa' },
};
```
O React Flow processa esse objeto e cria internamente um `InternalNode`, contendo medições reais calculadas pelo DOM:
- `measured.width`: Largura renderizada real em pixels.
- `measured.height`: Altura renderizada real em pixels.
- `internals.handleBounds`: Posições exatas de todos os handles para cálculo dos caminhos SVG das arestas.

### 3.2. Viewport vs Coordenadas de Tela
- **Coordenadas de Tela (Screen/DOM Coordinates)**: Posição do cursor do mouse em pixels relativos à janela (`event.clientX`, `event.clientY`).
- **Coordenadas do Grafo (Flow Coordinates)**: Posição no plano infinito independente do zoom ou pan atual.
- A conversão é feita matematicamente através da fórmula:
  $$	ext{flowX} = rac{	ext{screenX} - 	ext{viewport.x}}{	ext{viewport.zoom}}$$
  $$	ext{flowY} = rac{	ext{screenY} - 	ext{viewport.y}}{	ext{viewport.zoom}}$$

---

## 4. Exemplo Prático Completo: Demonstração Visual de Termos

Este exemplo cria nós anotados com indicadores visuais explicando cada conceito diretamente na tela.

### `AnnotationNode.jsx`
```jsx
import React, { memo } from 'react';

function AnnotationNode({ data }) {
  return (
    <div className="bg-amber-100 border border-amber-300 text-amber-900 rounded-lg p-2.5 text-xs shadow-md max-w-[200px]">
      <div className="font-bold uppercase tracking-wider text-[10px] text-amber-700 mb-1">
        {data.title || 'Conceito'}
      </div>
      <p className="m-0 leading-relaxed">{data.label}</p>
    </div>
  );
}

export default memo(AnnotationNode);
```

### `App.jsx`
```jsx
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Position,
  type Node,
  type Edge,
} from '@xyflow/react';

import AnnotationNode from './AnnotationNode';
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  annotation: AnnotationNode,
};

const initialNodes: Node[] = [
  {
    id: 'node-1',
    type: 'input',
    position: { x: 100, y: 150 },
    data: { label: 'Nó de Entrada (Source)' },
    sourcePosition: Position.Right,
  },
  {
    id: 'anno-node',
    type: 'annotation',
    position: { x: 60, y: 60 },
    data: {
      title: 'Node (Vértice)',
      label: 'Entidade que guarda dados e renderiza handles de conexão.',
    },
    draggable: false,
    selectable: false,
  },
  {
    id: 'node-2',
    position: { x: 450, y: 150 },
    data: { label: 'Nó de Processamento' },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: 'anno-edge',
    type: 'annotation',
    position: { x: 260, y: 60 },
    data: {
      title: 'Edge (Aresta)',
      label: 'Linha vetorial SVG conectando a porta de saída à porta de entrada.',
    },
    draggable: false,
    selectable: false,
  },
  {
    id: 'node-3',
    type: 'output',
    position: { x: 800, y: 150 },
    data: { label: 'Nó de Saída (Target)' },
    targetPosition: Position.Left,
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'node-1',
    target: 'node-2',
    type: 'smoothstep',
    animated: true,
    label: 'Fluxo Ativo',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e2-3',
    source: 'node-2',
    target: 'node-3',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```
