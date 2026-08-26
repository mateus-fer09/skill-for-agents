---
title: "Hooks e ReactFlowProvider no React Flow"
description: "Guia completo e exaustivo de todos os hooks e do componente ReactFlowProvider no React Flow v12 (@xyflow/react), detalhando ciclo de vida, assinaturas TypeScript, m?todos do useReactFlow, reatividade fina e boas pr?ticas."
topics:
  - "ReactFlowProvider"
  - "useReactFlow"
  - "useNodes e useEdges"
  - "useNodesData e useHandleConnections"
  - "useConnection e useNodeConnections"
  - "useInternalNode e useNodesInitialized"
  - "useUpdateNodeInternals"
  - "useOnSelectionChange e useOnViewportChange"
  - "useKeyPress e useViewport"
  - "useStore e useStoreApi"
keywords:
  - "useReactFlow"
  - "ReactFlowProvider"
  - "useNodesData"
  - "useHandleConnections"
  - "useUpdateNodeInternals"
  - "useStoreApi"
  - "useStore"
  - "useViewport"
  - "@xyflow/react"
source_scope: "API Reference / Hooks e Learn / Advanced Use / Hooks and Providers"
---

# Hooks e ReactFlowProvider no React Flow

O ecossistema do React Flow v12 (`@xyflow/react`) oferece uma su?te completa de hooks e contextos projetados para permitir o controle imperativo e reativo do canvas, dos n?s, das arestas e da viewport. Esta documenta??o detalha cada hook, seu prop?sito, assinatura TypeScript e casos de uso pr?ticos.

---

## 1. O Componente `<ReactFlowProvider />`

O `<ReactFlowProvider />` ? um provedor de contexto (baseado no React Context e Zustand) que torna poss?vel acessar o estado interno de um fluxo fora do componente `<ReactFlow />`.

### Quando Utilizar o `<ReactFlowProvider />`

1. **Uso de Hooks Fora do `<ReactFlow />`:** Hooks como `useReactFlow()`, `useNodes()`, `useEdges()` ou `useStore()` exigem o contexto do provedor quando chamados em componentes irm?os ou pais do `<ReactFlow />` (como sidebars, barras de ferramentas externas e modais).
2. **M?ltiplos Fluxos na Mesma Aplica??o:** Quando sua aplica??o renderiza dois ou mais diagramas simultaneamente, cada um deve estar dentro de seu pr?prio `<ReactFlowProvider />` para manter estados isolados.
3. **Persist?ncia em Roteadores:** Ao utilizar roteadores client-side (como React Router ou Next.js), colocar o provedor em um n?vel superior preserva o estado ao alternar rotas.
4. **Renderiza??o no Servidor (SSR):** Permite configurar dimens?es iniciais antes da hidrata??o no cliente.

### Exemplo de Estrutura com `<ReactFlowProvider />`

```tsx
import React from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useNodes,
  useEdges,
  Background,
  Controls,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'In?cio' }, position: { x: 250, y: 25 } },
  { id: '2', data: { label: 'Processamento' }, position: { x: 250, y: 125 } },
  { id: '3', type: 'output', data: { label: 'Fim' }, position: { x: 250, y: 225 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

function SidebarInfo() {
  const nodes = useNodes();
  const edges = useEdges();

  return (
    <aside style={{
      position: 'absolute',
      right: 10,
      top: 10,
      zIndex: 4,
      background: '#ffffff',
      padding: 12,
      borderRadius: 8,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontSize: 13
    }}>
      <h4>Estat?sticas do Fluxo</h4>
      <p>Total de N?s: <strong>{nodes.length}</strong></p>
      <p>Total de Conex?es: <strong>{edges.length}</strong></p>
      <ul>
        {nodes.map((node) => (
          <li key={node.id}>
            {node.data?.label || node.id} (x: {Math.round(node.position.x)}, y: {Math.round(node.position.y)})
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default function FlowApp() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactFlowProvider>
        <ReactFlow
          defaultNodes={initialNodes}
          defaultEdges={initialEdges}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        <SidebarInfo />
      </ReactFlowProvider>
    </div>
  );
}
```

---

## 2. `useReactFlow()`

O hook `useReactFlow` fornece acesso direto ? inst?ncia do React Flow (`ReactFlowInstance`) e a seus m?todos utilit?rios para consultar e alterar o grafo e a viewport de forma imperativa.

### Tabela de M?todos de `useReactFlow<NodeType, EdgeType>()`

| M?todo | Retorno | Descri??o |
| :--- | :--- | :--- |
| `getNode(id)` | `NodeType | undefined` | Retorna o n? correspondente ao ID informado. |
| `getNodes()` | `NodeType[]` | Retorna o array atual com todos os n?s. |
| `getEdge(id)` | `EdgeType | undefined` | Retorna a aresta correspondente ao ID informado. |
| `getEdges()` | `EdgeType[]` | Retorna o array atual com todas as arestas. |
| `setNodes(nodes | updater)` | `void` | Atualiza a lista completa de n?s. |
| `setEdges(edges | updater)` | `void` | Atualiza a lista completa de arestas. |
| `addNodes(nodes)` | `void` | Adiciona um ou mais n?s ao fluxo. |
| `addEdges(edges)` | `void` | Adiciona uma ou mais arestas ao fluxo. |
| `updateNode(id, nodeUpdate, options)` | `void` | Atualiza propriedades parciais de um n? espec?fico. |
| `updateNodeData(id, dataUpdate, options)` | `void` | Atualiza o objeto `data` de um n? de forma imut?vel. |
| `deleteElements(params)` | `Promise<{ deletedNodes, deletedEdges }>` | Remove n?s e arestas do canvas por ID ou objeto. |
| `getIntersectingNodes(nodeOrRect, partially?, nodes?)` | `NodeType[]` | Retorna n?s que interceptam outro n? ou ret?ngulo. |
| `isNodeIntersecting(nodeOrRect, area, partially?)` | `boolean` | Verifica se h? sobreposi??o entre ?reas. |
| `screenToFlowPosition(clientPosition, options?)` | `XYPosition` | Converte coordenadas de tela/cursor (clientX/Y) para coordenadas do canvas. |
| `flowToScreenPosition(flowPosition)` | `XYPosition` | Converte coordenadas do canvas para a tela do navegador. |
| `fitView(options?)` | `Promise<boolean>` | Ajusta o zoom e o enquadramento para exibir todos os n?s. |
| `fitBounds(bounds, options?)` | `Promise<boolean>` | Enquadra uma caixa delimitadora retangular espec?fica. |
| `zoomIn(options?)` | `Promise<boolean>` | Aumenta o n?vel de zoom. |
| `zoomOut(options?)` | `Promise<boolean>` | Diminui o n?vel de zoom. |
| `zoomTo(zoomLevel, options?)` | `Promise<boolean>` | Define um n?vel de zoom absoluto. |
| `getViewport()` | `Viewport` | Retorna `{ x, y, zoom }` atual. |
| `setViewport(viewport, options?)` | `Promise<boolean>` | Define a posi??o e zoom do canvas. |
| `setCenter(x, y, options?)` | `Promise<boolean>` | Centraliza a viewport nas coordenadas informadas. |
| `toObject()` | `ReactFlowJsonObject` | Serializa o fluxo completo em JSON `{ nodes, edges, viewport }`. |

### Exemplo com `useReactFlow`

```tsx
import React, { useCallback } from 'react';
import { useReactFlow, Panel, Node } from '@xyflow/react';

export function FlowToolbar() {
  const {
    getNodes,
    addNodes,
    zoomIn,
    zoomOut,
    fitView,
    setCenter,
    updateNodeData
  } = useReactFlow();

  const handleAddNode = useCallback(() => {
    const id = `node_${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'default',
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: { label: `N? ${id.slice(-4)}` }
    };
    addNodes(newNode);
  }, [addNodes]);

  const handleFocusNode = useCallback(() => {
    const nodes = getNodes();
    if (nodes.length > 0) {
      const target = nodes[0];
      setCenter(target.position.x + 50, target.position.y + 20, { zoom: 1.5, duration: 800 });
    }
  }, [getNodes, setCenter]);

  return (
    <Panel position="top-left" style={{ display: 'flex', gap: 8, background: '#fff', padding: 8, borderRadius: 6 }}>
      <button onClick={handleAddNode}>+ Adicionar N?</button>
      <button onClick={handleFocusNode}>Centralizar 1? N?</button>
      <button onClick={() => zoomIn({ duration: 300 })}>Zoom +</button>
      <button onClick={() => zoomOut({ duration: 300 })}>Zoom -</button>
      <button onClick={() => fitView({ duration: 500, padding: 0.2 })}>Fit View</button>
    </Panel>
  );
}
```

---

## 3. `useNodesData()` e Reatividade Fina

O hook `useNodesData` permite assinar exclusivamente altera??es nos dados (`node.data`) de um ou m?ltiplos n?s por ID, sem re-renderizar todo o fluxo quando posi??es mudam.

### Assinaturas TypeScript

```tsx
function useNodesData<NodeType extends Node = Node>(
  nodeId: string
): NodeType['data'] | null;

function useNodesData<NodeType extends Node = Node>(
  nodeIds: string[]
): Array<NodeType['data'] | null>;
```

### Exemplo de Leitura Reativa de N? Conectado

```tsx
import React from 'react';
import { Handle, Position, useNodesData, NodeProps, Node } from '@xyflow/react';

type InputNode = Node<{ text: string }, 'textInput'>;

export function TextDisplayNode({ id }: NodeProps) {
  const sourceData = useNodesData<InputNode>('input-1');

  return (
    <div style={{ padding: 12, border: '2px solid #2563eb', borderRadius: 8, background: '#eff6ff' }}>
      <Handle type="target" position={Position.Left} />
      <div>Texto Recebido em Tempo Real:</div>
      <strong>{sourceData?.text || '(Aguardando digita??o...)'}</strong>
    </div>
  );
}
```

---

## 4. `useHandleConnections()` e `useNodeConnections()`

Esses hooks fornecem a lista de conex?es anexadas a um Handle espec?fico ou ao N? inteiro.

### `useHandleConnections({ type, id })`

```tsx
import React from 'react';
import { Handle, Position, useHandleConnections, useNodesData, NodeProps } from '@xyflow/react';

export function AggregatorNode({ id }: NodeProps) {
  const connections = useHandleConnections({
    type: 'target',
    id: 'sum-handle'
  });

  const sourceIds = connections.map((c) => c.source);
  const sourcesData = useNodesData<{ value: number }>(sourceIds);

  const total = sourcesData.reduce((sum, item) => sum + (item?.value || 0), 0);

  return (
    <div style={{ padding: 10, border: '1px solid #475569', borderRadius: 6, background: '#fff' }}>
      <Handle type="target" position={Position.Left} id="sum-handle" />
      <div>Conex?es Ativas: {connections.length}</div>
      <div><strong>Soma Calculada: {total}</strong></div>
      <Handle type="source" position={Position.Right} id="output-handle" />
    </div>
  );
}
```

---

## 5. `useConnection()`: Conex?o em Progresso

O `useConnection()` exp?e os dados da aresta que o usu?rio est? criando e arrastando no momento exato da intera??o.

```tsx
import React from 'react';
import { useConnection } from '@xyflow/react';

export function ConnectionIndicator() {
  const connection = useConnection();

  if (!connection.inProgress) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '8px 16px',
      background: '#1e293b',
      color: '#f8fafc',
      borderRadius: 20,
      fontSize: 12,
      zIndex: 1000
    }}>
      Conectando de <strong>{connection.fromNode?.id}</strong> ({connection.fromHandle?.id || 'padr?o'})
    </div>
  );
}
```

---

## 6. `useInternalNode()` e `useNodesInitialized()`

### `useInternalNode(id)`

Retorna a representa??o interna calculada pelo React Flow:
- `internals.positionAbsolute`: Coordenadas absolutas calculadas (levando em considera??o hierarquias de n?s pais e subflows).
- `measured`: Largura e altura reais medidas no DOM (`width`, `height`).
- `internals.handleBounds`: Bounds exatos dos handles de entrada e sa?da.

### `useNodesInitialized(options?)`

Retorna `true` apenas quando todos os n?s foram renderizados no DOM e tiveram suas dimens?es reais medidas.

```tsx
import { useEffect } from 'react';
import { useReactFlow, useNodesInitialized } from '@xyflow/react';

export function AutoLayoutManager() {
  const { getNodes, setNodes } = useReactFlow();
  const nodesInitialized = useNodesInitialized({ includeHiddenNodes: false });

  useEffect(() => {
    if (nodesInitialized) {
      const nodes = getNodes();
      console.log('Todos os n?s foram medidos no DOM:', nodes.map(n => ({ id: n.id, measured: n.measured })));
    }
  }, [nodesInitialized]);

  return null;
}
```

---

## 7. `useUpdateNodeInternals()`: Handles Din?micos

Quando um n? customizado adiciona, remove ou reposiciona handles dinamicamente durante o ciclo de vida do componente, o React Flow precisa ser notificado para atualizar os bounds dos handles.

```tsx
import React, { useState, useCallback } from 'react';
import { Handle, Position, useUpdateNodeInternals, NodeProps } from '@xyflow/react';

export function DynamicPortsNode({ id }: NodeProps) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [ports, setPorts] = useState<number[]>([0]);

  const addPort = useCallback(() => {
    setPorts((prev) => {
      const next = [...prev, prev.length];
      setTimeout(() => updateNodeInternals(id), 0);
      return next;
    });
  }, [id, updateNodeInternals]);

  return (
    <div style={{ padding: 12, border: '1px solid #0f172a', borderRadius: 8, background: '#fff' }}>
      <Handle type="target" position={Position.Left} id="input" />
      <div><strong>N? de M?ltiplas Sa?das</strong></div>
      <button onClick={addPort} style={{ marginTop: 6, fontSize: 11 }}>+ Adicionar Porta</button>
      
      {ports.map((portIndex) => (
        <Handle
          key={portIndex}
          type="source"
          position={Position.Right}
          id={`out-${portIndex}`}
          style={{ top: `${((portIndex + 1) / (ports.length + 1)) * 100}%` }}
        />
      ))}
    </div>
  );
}
```

---

## 8. `useKeyPress()`, `useViewport()`, `useStore()` e `useStoreApi()`

### `useKeyPress(key | key[])`
Escuta atalhos de teclado de forma reativa:
```tsx
const isSpacePressed = useKeyPress('Space');
const isSaveShortcut = useKeyPress(['Meta+s', 'Control+s']);
```

### `useViewport()`
Retorna `{ x, y, zoom }` em tempo real. Re-renderiza a cada movimento da c?mera.

### `useStoreApi()`
Retorna a inst?ncia direta da store Zustand interna do React Flow:
```tsx
const store = useStoreApi();
const nodes = store.getState().nodes;
```

### `useStore(selector)`
Assina seletivamente propriedades internas do React Flow:
```tsx
const selectedCount = useStore((state) => state.nodes.filter(n => n.selected).length);
```

---

## Resumo de Performance dos Hooks

| Hook | Re-renderiza? | Melhor Aplica??o |
| :--- | :--- | :--- |
| `useReactFlow()` | **Nunca** | Bot?es, toolbars, handlers de eventos e muta??es imperativas. |
| `useStoreApi()` | **Nunca** | Leitura instant?nea de n?s/arestas sob demanda (sem assinar estado). |
| `useNodesData(id)` | **Apenas no n? alterado** | Comunica??o reativa entre n?s conectados sem cascata de re-renders. |
| `useNodes()` | **A cada movimento de n?** | Sidebars externas e contadores globais fora do fluxo. |
| `useViewport()` | **A cada pixel de pan/zoom** | Minimapas, r?guas e mostradores de coordenadas. |
