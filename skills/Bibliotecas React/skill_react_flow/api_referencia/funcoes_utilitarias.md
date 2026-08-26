---
title: "Funções Utilitárias - React Flow API Reference"
description: "Documentação exaustiva de todas as funções utilitárias do React Flow: manipulação de grafos (addEdge, reconnectEdge, getIncomers, getOutgoers, getConnectedEdges), cálculo de caminhos (getBezierPath, getSmoothStepPath, getStraightPath, getSimpleBezierPath), geometria (getNodesBounds, getViewportForBounds), mutação de estado (applyNodeChanges, applyEdgeChanges) e type guards (isNode, isEdge)."
topics:
  - "addEdge e reconnectEdge"
  - "applyNodeChanges e applyEdgeChanges"
  - "Algoritmos de Pathfinding (getBezierPath, getSmoothStepPath, getStraightPath, getSimpleBezierPath)"
  - "Análise de Grafos (getIncomers, getOutgoers, getConnectedEdges)"
  - "Geometria e Viewport (getNodesBounds, getViewportForBounds)"
  - "Type Guards (isNode, isEdge)"
keywords:
  - "addEdge"
  - "applyNodeChanges"
  - "applyEdgeChanges"
  - "getBezierPath"
  - "getSmoothStepPath"
  - "getStraightPath"
  - "getSimpleBezierPath"
  - "getConnectedEdges"
  - "getIncomers"
  - "getOutgoers"
  - "getNodesBounds"
  - "getViewportForBounds"
  - "reconnectEdge"
  - "isNode"
  - "isEdge"
source_scope: "api-reference/utils/*"
---

# Funções Utilitárias do React Flow

O React Flow exporta um conjunto completo de funções utilitárias puras para manipulação de arestas e nós, cálculo de curvas matemáticas em SVG, detecção de conexões em grafos e cálculos geométricos de viewport.

---

## 1. Utilitários de Manipulação de Arestas e Conexões

### 1.1 `addEdge(connection, edges)`
Adiciona uma nova conexão ao array de arestas existente. Executa automaticamente validações de unicidade: **não permite adicionar uma aresta duplicada** se já existir outra com os mesmos `source`, `target`, `sourceHandle` e `targetHandle`.

#### Assinatura
```ts
function addEdge<EdgeType extends Edge = Edge>(
  edgeParams: EdgeType | Connection,
  edges: EdgeType[],
): EdgeType[];
```

#### Exemplo
```ts
import { addEdge, type Connection, type Edge } from '@xyflow/react';

const currentEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' }
];

const newConnection: Connection = {
  source: '2',
  target: '3',
  sourceHandle: 'out-a',
  targetHandle: 'in-b',
};

const updatedEdges = addEdge(newConnection, currentEdges);
// updatedEdges conterá a nova aresta com um id gerado automaticamente (ex: 'xy-edge__2out-a-3in-b')
```

---

### 1.2 `reconnectEdge(oldEdge, newConnection, edges, options?)`
Atualiza uma aresta existente quando o usuário desconecta uma de suas extremidades e a reconecta em um novo nó ou handle.

#### Assinatura
```ts
function reconnectEdge<EdgeType extends Edge = Edge>(
  oldEdge: EdgeType,
  newConnection: Connection,
  edges: EdgeType[],
  options?: { shouldReplaceId?: boolean },
): EdgeType[];
```

#### Exemplo
```tsx
import { useCallback } from 'react';
import { reconnectEdge, type Edge, type Connection } from '@xyflow/react';

export function useEdgeReconnection(setEdges: React.Dispatch<React.SetStateAction<Edge[]>>) {
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((prevEdges) => reconnectEdge(oldEdge, newConnection, prevEdges));
    },
    [setEdges]
  );

  return onReconnect;
}
```

---

## 2. Utilitários de Atualização de Estado

### 2.1 `applyNodeChanges(changes, nodes)`
Aplica um array de objetos `NodeChange` (gerados pelo React Flow durante arrasto, seleção, redimensionamento ou remoção) ao array de nós atual, retornando um novo array imutável.

#### Assinatura
```ts
function applyNodeChanges<NodeType extends Node = Node>(
  changes: NodeChange<NodeType>[],
  nodes: NodeType[],
): NodeType[];
```

#### Exemplo
```ts
import { applyNodeChanges, type NodeChange, type Node } from '@xyflow/react';

const onNodesChange = (changes: NodeChange[]) => {
  setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
};
```

---

### 2.2 `applyEdgeChanges(changes, edges)`
Aplica um array de objetos `EdgeChange` (gerados por seleção, remoção ou adição de arestas) ao array de arestas atual.

#### Assinatura
```ts
function applyEdgeChanges<EdgeType extends Edge = Edge>(
  changes: EdgeChange<EdgeType>[],
  edges: EdgeType[],
): EdgeType[];
```

#### Exemplo
```ts
import { applyEdgeChanges, type EdgeChange, type Edge } from '@xyflow/react';

const onEdgesChange = (changes: EdgeChange[]) => {
  setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges));
};
```

---

## 3. Algoritmos de Cálculo de Traçado (Pathfinding SVG)

Todas as funções de cálculo de path retornam uma tupla com 5 posições:
1. `path`: A string de comando SVG `d` pronta para ser usada em `<path d={path} />` ou `<BaseEdge path={path} />`.
2. `labelX`: Coordenada X central do traçado para posicionamento de labels.
3. `labelY`: Coordenada Y central do traçado.
4. `offsetX`: Deslocamento absoluto no eixo X entre a origem e o ponto central.
5. `offsetY`: Deslocamento absoluto no eixo Y entre a origem e o ponto central.

---

### 3.1 `getBezierPath(params)`
Calcula uma curva cúbica de Bézier suave conectando os pontos de origem e destino, respeitando as direções dos handles de entrada e saída.

#### Assinatura
```ts
type GetBezierPathParams = {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  curvature?: number; // Padrão: 0.25
};

function getBezierPath(params: GetBezierPathParams): [
  path: string,
  labelX: number,
  labelY: number,
  offsetX: number,
  offsetY: number,
];
```

#### Exemplo
```ts
import { getBezierPath, Position } from '@xyflow/react';

const [path, labelX, labelY] = getBezierPath({
  sourceX: 0,
  sourceY: 50,
  sourcePosition: Position.Right,
  targetX: 200,
  targetY: 150,
  targetPosition: Position.Left,
  curvature: 0.3,
});
// path: "M0,50 C100,50 100,150 200,150"
```

---

### 3.2 `getSmoothStepPath(params)`
Calcula um traçado em ângulos retos ortogonais (degraus) com cantos arredondados configuráveis via `borderRadius`.

#### Assinatura
```ts
type GetSmoothStepPathParams = {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  borderRadius?: number; // Padrão: 5. Se definido como 0, resulta em uma step edge reta
  offset?: number;       // Distância mínima antes do primeiro desvio (Padrão: 20)
};

function getSmoothStepPath(params: GetSmoothStepPathParams): [
  path: string,
  labelX: number,
  labelY: number,
  offsetX: number,
  offsetY: number,
];
```

---

### 3.3 `getStraightPath(params)`
Calcula a linha reta euclidiana direta entre as coordenadas de origem e destino.

#### Assinatura
```ts
type GetStraightPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

function getStraightPath(params: GetStraightPathParams): [
  path: string,
  labelX: number,
  labelY: number,
  offsetX: number,
  offsetY: number,
];
```

---

### 3.4 `getSimpleBezierPath(params)`
Calcula uma curva de Bézier simples baseada em controles horizontais ou verticais diretos, ideal para conexões rápidas e limpas.

#### Assinatura
```ts
function getSimpleBezierPath(params: GetBezierPathParams): [
  path: string,
  labelX: number,
  labelY: number,
  offsetX: number,
  offsetY: number,
];
```

---

## 4. Análise de Conectividade em Grafos

### 4.1 `getIncomers(node, nodes, edges)`
Retorna todos os nós que são **origem direta** de arestas cujo destino é o nó alvo fornecido (nós predecessores).

#### Assinatura
```ts
function getIncomers<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  node: NodeType | { id: string },
  nodes: NodeType[],
  edges: EdgeType[],
): NodeType[];
```

#### Exemplo
```ts
import { getIncomers } from '@xyflow/react';

const predecessors = getIncomers(currentNode, allNodes, allEdges);
console.log('Nós que apontam para este nó:', predecessors.map(n => n.id));
```

---

### 4.2 `getOutgoers(node, nodes, edges)`
Retorna todos os nós que são **destino direto** de arestas cuja origem é o nó alvo fornecido (nós sucessores).

#### Assinatura
```ts
function getOutgoers<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  node: NodeType | { id: string },
  nodes: NodeType[],
  edges: EdgeType[],
): NodeType[];
```

#### Exemplo
```ts
import { getOutgoers } from '@xyflow/react';

const successors = getOutgoers(currentNode, allNodes, allEdges);
console.log('Próximos passos no workflow:', successors.map(n => n.id));
```

---

### 4.3 `getConnectedEdges(nodes, edges)`
Filtra e retorna apenas as arestas conectadas a pelo menos um dos nós presentes no array fornecido (como origem ou como destino).

#### Assinatura
```ts
function getConnectedEdges<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  nodes: NodeType[],
  edges: EdgeType[],
): EdgeType[];
```

#### Exemplo (Exclusão em Cascata)
```ts
import { getConnectedEdges } from '@xyflow/react';

const nodesToDelete = selectedNodes;
const edgesToDelete = getConnectedEdges(nodesToDelete, allEdges);
```

---

## 5. Cálculos Geométricos e Viewport

### 5.1 `getNodesBounds(nodes, options?)`
Calcula o retângulo delimitador (*Bounding Box*) mínimo que envolve todos os nós passados no array.

#### Assinatura
```ts
function getNodesBounds(
  nodes: (Node | InternalNode)[],
  options?: { nodeOrigin?: NodeOrigin },
): Rect;
```

#### Retorno (`Rect`)
```ts
type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

---

### 5.2 `getViewportForBounds(bounds, width, height, minZoom, maxZoom, padding?)`
Calcula a posição `(x, y)` e o fator de escala `zoom` exatos necessários para enquadrar um determinado retângulo delimitador (`Rect`) dentro das dimensões de tela fornecidas.

#### Assinatura
```ts
function getViewportForBounds(
  bounds: Rect,
  width: number,
  height: number,
  minZoom: number,
  maxZoom: number,
  padding?: number,
): Viewport;
```

#### Exemplo (Cálculo no Servidor ou SSR)
```ts
import { getNodesBounds, getViewportForBounds } from '@xyflow/react';

const bounds = getNodesBounds(nodes);
const targetViewport = getViewportForBounds(
  bounds,
  1920, // Largura da tela
  1080, // Altura da tela
  0.5,  // Min Zoom
  2.0,  // Max Zoom
  0.1   // Padding (10%)
);

console.log('Viewport calculada:', targetViewport);
// { x: 142.5, y: 85.0, zoom: 1.25 }
```

---

## 6. Type Guards

### 6.1 `isNode(element)`
Type Guard do TypeScript que verifica em tempo de execução se um determinado objeto possui a estrutura necessária para ser um `Node`.

#### Assinatura
```ts
function isNode<NodeType extends Node = Node>(
  element: unknown,
): element is NodeType;
```

---

### 6.2 `isEdge(element)`
Type Guard do TypeScript que verifica se um determinado objeto possui os campos obrigatórios de uma `Edge` (`id`, `source`, `target`).

#### Assinatura
```ts
function isEdge<EdgeType extends Edge = Edge>(
  element: unknown,
): element is EdgeType;
```

#### Exemplo de Uso com Type Guards
```ts
import { isNode, isEdge } from '@xyflow/react';

function processGraphElement(element: unknown) {
  if (isNode(element)) {
    console.log('É um Nó com posição:', element.position.x, element.position.y);
  } else if (isEdge(element)) {
    console.log('É uma Aresta de', element.source, 'para', element.target);
  }
}
```
