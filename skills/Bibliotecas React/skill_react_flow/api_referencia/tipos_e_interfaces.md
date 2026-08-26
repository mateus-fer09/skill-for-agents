---
title: "Tipos e Interfaces TypeScript - React Flow API Reference"
description: "Dicionário e catálogo completo de todas as interfaces, tipos genéricos, unioes e enums do ecossistema React Flow e @xyflow/system."
topics:
  - "Tipos de Nós (Node, NodeProps, NodeChange, InternalNode, etc.)"
  - "Tipos de Arestas (Edge, EdgeProps, EdgeChange, EdgeMarker, etc.)"
  - "Tipos de Conexão (Connection, ConnectionState, ConnectionMode, etc.)"
  - "Tipos de Viewport e Geometria (Viewport, Rect, XYPosition, etc.)"
  - "Instâncias e Configurações (ReactFlowInstance, ReactFlowJsonObject, ProOptions, etc.)"
keywords:
  - "Node"
  - "Edge"
  - "Connection"
  - "NodeProps"
  - "EdgeProps"
  - "NodeChange"
  - "EdgeChange"
  - "ReactFlowInstance"
  - "Viewport"
  - "Position"
  - "ConnectionMode"
source_scope: "api-reference/types/*"
---

# Catálogo de Tipos e Interfaces TypeScript do React Flow

O React Flow é 100% desenvolvido em TypeScript. Este documento reúne todas as definições de tipos, tipos genéricos, uniões discriminadas e enums exportados por `@xyflow/react` e `@xyflow/system`.

---

## 1. Tipos Relacionados a Nós (Nodes)

### 1.1 `Node<T, U>`
Representação padrão de um nó no grafo.
```ts
export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string = string
> = {
  id: string;
  position: XYPosition;
  data: NodeData;
  type?: NodeType;
  style?: React.CSSProperties;
  className?: string;
  hidden?: boolean;
  selected?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
  dragHandle?: string;
  width?: number;
  height?: number;
  measured?: {
    width?: number;
    height?: number;
  };
  initialWidth?: number;
  initialHeight?: number;
  parentId?: string;
  zIndex?: number;
  extent?: 'parent' | CoordinateExtent;
  expandParent?: boolean;
  ariaLabel?: string;
  origin?: NodeOrigin;
  handles?: NodeHandle[];
};
```

### 1.2 `NodeProps<NodeType>`
Propriedades recebidas pelo componente customizado do nó.
```ts
export type NodeProps<NodeType extends Node = Node> = {
  id: string;
  data: NodeType['data'];
  type: string;
  selected: boolean;
  isConnectable: boolean;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  zIndex: number;
  dragging: boolean;
  targetPosition?: Position;
  sourcePosition?: Position;
  dragHandle?: string;
};
```

### 1.3 `NodeChange` (União Discriminada)
Notificações de mudança disparadas por `onNodesChange`.
```ts
export type NodeChange<NodeType extends Node = Node> =
  | NodeDimensionChange
  | NodePositionChange
  | NodeSelectionChange
  | NodeRemoveChange
  | NodeAddChange<NodeType>
  | NodeReplaceChange<NodeType>;

export type NodeDimensionChange = {
  id: string;
  type: 'dimensions';
  dimensions?: { width: number; height: number };
  resizing?: boolean;
  setBounds?: boolean;
};

export type NodePositionChange = {
  id: string;
  type: 'position';
  position?: XYPosition;
  positionAbsolute?: XYPosition;
  dragging?: boolean;
};

export type NodeSelectionChange = {
  id: string;
  type: 'select';
  selected: boolean;
};

export type NodeRemoveChange = {
  id: string;
  type: 'remove';
};

export type NodeAddChange<NodeType extends Node = Node> = {
  item: NodeType;
  type: 'add';
  index?: number;
};

export type NodeReplaceChange<NodeType extends Node = Node> = {
  id: string;
  item: NodeType;
  type: 'replace';
};
```

### 1.4 `InternalNode<NodeType>`
Representação interna gerada pelo motor com cálculos de posicionamento absoluto.
```ts
export type InternalNode<NodeType extends Node = Node> = NodeType & {
  internals: {
    positionAbsolute: XYPosition;
    z: number;
    userNode: NodeType;
    handleBounds?: {
      source?: Handle[];
      target?: Handle[];
    };
  };
};
```

### 1.5 `NodeOrigin` e `NodeTypes`
```ts
export type NodeOrigin = [number, number]; // [0, 0] = Top-Left, [0.5, 0.5] = Center

export type NodeTypes = {
  [key: string]: React.ComponentType<NodeProps<any>>;
};
```

---

## 2. Tipos Relacionados a Arestas (Edges)

### 2.1 `Edge<T, U>`
Representação completa de uma aresta.
```ts
export type Edge<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string = string
> = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: EdgeType;
  data?: EdgeData;
  style?: React.CSSProperties;
  className?: string;
  animated?: boolean;
  hidden?: boolean;
  selected?: boolean;
  deletable?: boolean;
  selectable?: boolean;
  reconnectable?: boolean | 'source' | 'target';
  markerStart?: EdgeMarkerType;
  markerEnd?: EdgeMarkerType;
  zIndex?: number;
  ariaLabel?: string;
  interactionWidth?: number;
};
```

### 2.2 `EdgeProps<EdgeType>`
Propriedades passadas para componentes customizados de aresta.
```ts
export type EdgeProps<EdgeType extends Edge = Edge> = {
  id: string;
  source: string;
  target: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  data?: EdgeType['data'];
  style?: React.CSSProperties;
  markerStart?: string;
  markerEnd?: string;
  path?: string;
  selected?: boolean;
  animated?: boolean;
  interactionWidth?: number;
};
```

### 2.3 `EdgeChange` (União Discriminada)
```ts
export type EdgeChange<EdgeType extends Edge = Edge> =
  | EdgeAddChange<EdgeType>
  | EdgeRemoveChange
  | EdgeReplaceChange<EdgeType>
  | EdgeSelectionChange;

export type EdgeAddChange<EdgeType extends Edge = Edge> = {
  item: EdgeType;
  type: 'add';
  index?: number;
};

export type EdgeRemoveChange = {
  id: string;
  type: 'remove';
};

export type EdgeReplaceChange<EdgeType extends Edge = Edge> = {
  id: string;
  item: EdgeType;
  type: 'replace';
};

export type EdgeSelectionChange = {
  id: string;
  type: 'select';
  selected: boolean;
};
```

### 2.4 `EdgeMarker`, `MarkerType` e `EdgeTypes`
```ts
export enum MarkerType {
  Arrow = 'arrow',
  ArrowClosed = 'arrowclosed',
}

export type EdgeMarker = {
  type: MarkerType;
  color?: string;
  width?: number;
  height?: number;
  markerUnits?: string;
  strokeWidth?: number;
};

export type EdgeMarkerType = string | EdgeMarker;

export type EdgeTypes = {
  [key: string]: React.ComponentType<EdgeProps<any>>;
};
```

---

## 3. Tipos de Conexão e Interação

### 3.1 `Connection` e `HandleConnection`
```ts
export type Connection = {
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
};

export type HandleConnection = Connection & {
  edgeId: string;
};

export type NodeConnection = Connection & {
  edgeId: string;
};
```

### 3.2 `ConnectionState`
Representa o estado de uma conexão em andamento.
```ts
export type ConnectionState =
  | {
      inProgress: false;
      isValid: null;
      from: null;
      fromHandle: null;
      fromPosition: null;
      fromNode: null;
      to: null;
      toHandle: null;
      toPosition: null;
      toNode: null;
    }
  | {
      inProgress: true;
      isValid: boolean | null;
      from: XYPosition;
      fromHandle: Handle;
      fromPosition: Position;
      fromNode: Node;
      to: XYPosition;
      toHandle: Handle | null;
      toPosition: Position;
      toNode: Node | null;
    };
```

### 3.3 Enums de Conexão e Posicionamento
```ts
export enum ConnectionMode {
  Strict = 'strict',
  Loose = 'loose',
}

export enum ConnectionLineType {
  Bezier = 'default',
  Straight = 'straight',
  Step = 'step',
  SmoothStep = 'smoothstep',
  SimpleBezier = 'simplebezier',
}

export enum Position {
  Left = 'left',
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
}

export type PanelPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center-left'
  | 'center-right';
```

---

## 4. Tipos de Viewport, Geometria e Navegação

### 4.1 Coordenadas e Retângulos
```ts
export type XYPosition = {
  x: number;
  y: number;
};

export type XYZPosition = XYPosition & {
  z: number;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CoordinateExtent = [[number, number], [number, number]];

export type SnapGrid = [number, number];
```

### 4.2 `Viewport` e `FitViewOptions`
```ts
export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};

export type FitViewOptions<NodeType extends Node = Node> = {
  padding?: number;
  includeHiddenNodes?: boolean;
  minZoom?: number;
  maxZoom?: number;
  duration?: number;
  nodes?: (NodeType | { id: string })[];
};
```

---

## 5. `ReactFlowInstance` e Serialização JSON

### 5.1 `ReactFlowInstance<NodeType, EdgeType>`
Interface com todos os métodos disponíveis via `useReactFlow()`.
```ts
export type ReactFlowInstance<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> = {
  // Leitura e Escrita de Nós
  getNodes: () => NodeType[];
  setNodes: (nodes: NodeType[] | ((nodes: NodeType[]) => NodeType[])) => void;
  addNodes: (nodes: NodeType | NodeType[]) => void;
  getNode: (id: string) => NodeType | undefined;
  getInternalNode: (id: string) => InternalNode<NodeType> | undefined;
  updateNode: (
    id: string,
    nodeUpdate: Partial<NodeType> | ((node: NodeType) => Partial<NodeType>),
    options?: { replace: boolean }
  ) => void;
  updateNodeData: (
    id: string,
    dataUpdate: Partial<NodeType['data']> | ((node: NodeType) => Partial<NodeType['data']>),
    options?: { replace: boolean }
  ) => void;

  // Leitura e Escrita de Arestas
  getEdges: () => EdgeType[];
  setEdges: (edges: EdgeType[] | ((edges: EdgeType[]) => EdgeType[])) => void;
  addEdges: (edges: EdgeType | EdgeType[]) => void;
  getEdge: (id: string) => EdgeType | undefined;
  updateEdge: (
    id: string,
    edgeUpdate: Partial<EdgeType> | ((edge: EdgeType) => Partial<EdgeType>),
    options?: { replace: boolean }
  ) => void;
  updateEdgeData: (
    id: string,
    dataUpdate: Partial<EdgeType['data']> | ((edge: EdgeType) => Partial<EdgeType['data']>),
    options?: { replace: boolean }
  ) => void;

  // Exclusão
  deleteElements: (params: {
    nodes?: (Partial<NodeType> & { id: NodeType['id'] })[];
    edges?: (Partial<EdgeType> & { id: EdgeType['id'] })[];
  }) => Promise<{ deletedNodes: NodeType[]; deletedEdges: EdgeType[] }>;

  // Viewport e Zoom
  zoomIn: (options?: { duration?: number }) => void;
  zoomOut: (options?: { duration?: number }) => void;
  zoomTo: (zoomLevel: number, options?: { duration?: number }) => void;
  getZoom: () => number;
  setViewport: (viewport: Viewport, options?: { duration?: number }) => void;
  getViewport: () => Viewport;
  fitView: (options?: FitViewOptions<NodeType>) => boolean;
  setCenter: (x: number, y: number, options?: { zoom?: number; duration?: number }) => void;
  fitBounds: (bounds: Rect, options?: { padding?: number; duration?: number }) => void;

  // Transformação de Coordenadas
  screenToFlowPosition: (
    clientPosition: XYPosition,
    options?: { snapToGrid?: boolean }
  ) => XYPosition;
  flowToScreenPosition: (flowPosition: XYPosition) => XYPosition;

  // Interseções e Detecção de Colisão
  getIntersectingNodes: (
    nodeOrRect: NodeType | { id: string } | Rect,
    partially?: boolean,
    nodes?: NodeType[]
  ) => NodeType[];
  isNodeIntersecting: (
    nodeOrRect: NodeType | { id: string } | Rect,
    area: Rect,
    partially?: boolean
  ) => boolean;

  // Serialização
  toObject: () => ReactFlowJsonObject<NodeType, EdgeType>;
};
```

### 5.2 `ReactFlowJsonObject<NodeType, EdgeType>`
```ts
export type ReactFlowJsonObject<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> = {
  nodes: NodeType[];
  edges: EdgeType[];
  viewport: Viewport;
};
```

---

## 6. Configurações Globais e Acessibilidade

### 6.1 `ProOptions` e `ColorMode`
```ts
export type ProOptions = {
  hideAttribution?: boolean;
};

export type ColorMode = 'light' | 'dark' | 'system';
export type KeyCode = string | Array<string>;
export type Align = 'start' | 'center' | 'end';
export type ZIndexMode = 'auto' | 'basic' | 'manual';
export type SelectionMode = 'partial' | 'full';
```

### 6.2 `AriaLabelConfig`
```ts
export type AriaLabelConfig = {
  'node.a11yDescription.default': string;
  'node.a11yDescription.keyboardDisabled': string;
  'node.a11yDescription.ariaLiveMessage': (params: { direction: string; x: number; y: number }) => string;
  'edge.a11yDescription.default': string;
  'controls.ariaLabel': string;
  'controls.zoomIn.ariaLabel': string;
  'controls.zoomOut.ariaLabel': string;
  'controls.fitView.ariaLabel': string;
  'controls.interactive.ariaLabel': string;
  'minimap.ariaLabel': string;
  'handle.ariaLabel': string;
};
```
