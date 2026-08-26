---
title: "Hooks - Referência Completa (18 Hooks) - React Flow API Reference"
description: "Catálogo exaustivo e aprofundado de todos os 18 hooks do React Flow, incluindo assinaturas TypeScript, parâmetros, retornos, exemplos práticos e diretrizes de performance."
topics:
  - "useReactFlow"
  - "useNodes e useEdges"
  - "useNodesData"
  - "useNodeConnections e useConnection"
  - "useNodesInitialized"
  - "useKeyPress"
  - "useViewport"
  - "useInternalNode"
  - "useStore e useStoreApi"
  - "useOnSelectionChange e useOnViewportChange"
  - "useNodesState e useEdgesState"
  - "useNodeId"
  - "useUpdateNodeInternals"
keywords:
  - "useReactFlow"
  - "useNodes"
  - "useEdges"
  - "useNodesData"
  - "useNodeConnections"
  - "useConnection"
  - "useNodesInitialized"
  - "useKeyPress"
  - "useViewport"
  - "useInternalNode"
  - "useStore"
  - "useStoreApi"
  - "useOnSelectionChange"
  - "useOnViewportChange"
  - "useNodesState"
  - "useEdgesState"
  - "useNodeId"
  - "useUpdateNodeInternals"
source_scope: "api-reference/hooks/*"
---

# Catálogo Completo dos Hooks do React Flow (18 Hooks)

O React Flow disponibiliza uma suíte de 18 hooks especializados para gerenciar nós, arestas, conexões, eventos de viewport, seleções, estado reativo e interações de baixo nível com a store interna Zustand.

---

## 1. `useReactFlow<NodeType, EdgeType>()`

O hook mais poderoso do React Flow. Retorna a instância completa do `ReactFlowInstance`, permitindo manipular nós, arestas, viewport e executar queries espaciais sem disparar re-renderizações desnecessárias no componente chamador.

### Assinatura e Retorno
```ts
function useReactFlow<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): ReactFlowInstance<NodeType, EdgeType>;
```

### Exemplo Prático
```tsx
import { useCallback } from 'react';
import { useReactFlow, type Node } from '@xyflow/react';

export function WorkflowActionBar() {
  const {
    getNodes,
    setNodes,
    addNodes,
    deleteElements,
    fitView,
    zoomIn,
    zoomOut,
    screenToFlowPosition,
    updateNodeData,
  } = useReactFlow();

  const handleAddNode = useCallback(() => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      position: screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 }),
      data: { label: 'Novo Processo' },
      type: 'default',
    };
    addNodes(newNode);
  }, [addNodes, screenToFlowPosition]);

  const handleUpdateFirstNode = useCallback(() => {
    const firstNode = getNodes()[0];
    if (firstNode) {
      updateNodeData(firstNode.id, { label: 'Título Atualizado!' });
    }
  }, [getNodes, updateNodeData]);

  return (
    <div className="flex gap-2 p-2">
      <button onClick={handleAddNode}>Adicionar Nó Central</button>
      <button onClick={handleUpdateFirstNode}>Atualizar Primeiro Nó</button>
      <button onClick={() => fitView({ duration: 500, padding: 0.2 })}>Centralizar</button>
      <button onClick={() => zoomIn({ duration: 300 })}>Zoom +</button>
      <button onClick={() => zoomOut({ duration: 300 })}>Zoom -</button>
    </div>
  );
}
```

> [!NOTE]
> Diferente de `useNodes()` ou `useEdges()`, chamar `useReactFlow()` **não re-renderiza** seu componente a cada movimento de nó ou mudança no grafo. Utilize métodos imperativos como `getNodes()` dentro de callbacks.

---

## 2. `useNodes<NodeType>()`

Retorna o array completo de nós ativos no fluxo. O componente que utiliza esse hook **será re-renderizado sempre que qualquer nó for modificado**, selecionado ou arrastado.

### Assinatura
```ts
function useNodes<NodeType extends Node = Node>(): NodeType[];
```

### Exemplo
```tsx
import { useNodes } from '@xyflow/react';

export function NodesListSidebar() {
  const nodes = useNodes();

  return (
    <aside className="w-64 border-r p-4">
      <h3>Total de Nós: {nodes.length}</h3>
      <ul>
        {nodes.map((node) => (
          <li key={node.id} className={node.selected ? 'font-bold text-blue-600' : ''}>
            {node.id} — ({node.position.x.toFixed(0)}, {node.position.y.toFixed(0)})
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

---

## 3. `useEdges<EdgeType>()`

Retorna todas as arestas do fluxo. O componente é re-renderizado sempre que qualquer aresta for adicionada, removida ou alterada.

### Assinatura
```ts
function useEdges<EdgeType extends Edge = Edge>(): EdgeType[];
```

### Exemplo
```tsx
import { useEdges } from '@xyflow/react';

export function EdgesCountBadge() {
  const edges = useEdges();
  return <div className="badge">Conexões ativas: {edges.length}</div>;
}
```

---

## 4. `useNodesData<NodeType>(nodeId | nodeIds)`

Permite subscrever de forma cirúrgica às mudanças ocorridas apenas no objeto `data` de um nó específico ou de uma lista de nós. Evita re-renderizações causadas por movimentação de nós não relacionados.

### Assinatura
```ts
function useNodesData<NodeType extends Node = Node>(nodeId: string): NodeType['data'] | null;
function useNodesData<NodeType extends Node = Node>(nodeIds: string[]): (NodeType['data'] | null)[];
```

### Exemplo
```tsx
import { memo } from 'react';
import { useNodesData, Handle, Position } from '@xyflow/react';

export const NodeInspectorDisplay = memo(({ targetNodeId }: { targetNodeId: string }) => {
  const nodeData = useNodesData<{ label: string; count: number }>(targetNodeId);

  if (!nodeData) return <div>Nó {targetNodeId} não encontrado</div>;

  return (
    <div className="rounded border bg-slate-50 p-2 text-xs">
      <p>Label: {nodeData.label}</p>
      <p>Contador: {nodeData.count}</p>
    </div>
  );
});
```

---

## 5. `useNodeConnections({ handleType, handleId, nodeId })`

Retorna um array com todas as conexões ativas associadas a um nó, tipo de handle (`'source'` ou `'target'`) ou ID de handle específico.

### Assinatura
```ts
type UseNodeConnectionsParams = {
  type?: 'source' | 'target';
  handleType?: 'source' | 'target';
  handleId?: string | null;
  nodeId?: string;
};

function useNodeConnections(params?: UseNodeConnectionsParams): NodeConnection[];
```

### Exemplo
```tsx
import { memo } from 'react';
import { Handle, Position, useNodeConnections, type NodeProps } from '@xyflow/react';

export const MultiPortNode = memo((props: NodeProps) => {
  const targetConnections = useNodeConnections({
    handleType: 'target',
    handleId: 'main-input',
  });

  const isConnected = targetConnections.length > 0;

  return (
    <div className="rounded border bg-white p-3 shadow">
      <Handle
        type="target"
        position={Position.Left}
        id="main-input"
        className={isConnected ? '!bg-emerald-500' : '!bg-slate-300'}
      />
      <div className="text-xs font-medium">
        Entradas ativas: {targetConnections.length}
      </div>
      <Handle type="source" position={Position.Right} id="main-output" />
    </div>
  );
});
```

---

## 6. `useConnection(selector?)`

Retorna o estado da conexão atualmente em andamento pelo usuário (quando o usuário clica e arrasta um fio de conexão). Caso não haja conexão ativa, retorna `inProgress: false` e todos os campos como `null`.

### Assinatura
```ts
function useConnection<T = ConnectionState>(selector?: (state: ConnectionState) => T): T;
```

### Exemplo
```tsx
import { memo } from 'react';
import { Handle, Position, useConnection, type NodeProps } from '@xyflow/react';

export const DynamicTargetNode = memo((props: NodeProps) => {
  // Observa se existe qualquer conexão sendo arrastada no canvas
  const inProgress = useConnection((s) => s.inProgress);
  const fromNodeId = useConnection((s) => s.fromNode?.id);

  return (
    <div className={`rounded border p-4 ${inProgress ? 'border-dashed border-blue-400 bg-blue-50/50' : 'bg-white'}`}>
      <Handle
        type="target"
        position={Position.Top}
        className={inProgress ? '!h-4 !w-4 !bg-blue-600 animate-pulse' : ''}
      />
      <p className="text-xs">
        {inProgress ? `Conectando a partir de ${fromNodeId}...` : 'Aguardando sinal'}
      </p>
    </div>
  );
});
```

---

## 7. `useNodesInitialized(options?)`

Retorna `true` apenas quando todos os nós do fluxo tiverem sido completamente renderizados no DOM e tiveram suas dimensões (`width` e `height`) calculadas pelo React Flow.

### Assinatura
```ts
type UseNodesInitializedOptions = {
  includeHiddenNodes?: boolean;
};

function useNodesInitialized(options?: UseNodesInitializedOptions): boolean;
```

### Exemplo (Auto-Layout com ELKjs / Dagre)
```tsx
import { useEffect } from 'react';
import { useReactFlow, useNodesInitialized } from '@xyflow/react';

export function AutoLayoutManager() {
  const { getNodes, setNodes } = useReactFlow();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    if (nodesInitialized) {
      const nodes = getNodes();
      // Executa algoritmo de layout que depende de width e height reais medidos
      console.log('Todos os nós foram medidos com sucesso:', nodes.map(n => n.measured));
    }
  }, [nodesInitialized, getNodes, setNodes]);

  return null;
}
```

---

## 8. `useKeyPress(keyCode, options?)`

Escuta teclas e combinações de teclas no teclado, retornando um booleano que indica se a tecla especificada está atualmente pressionada.

### Assinatura
```ts
type UseKeyPressOptions = {
  target?: HTMLElement | Document | null;
  actInsideInputWithModifier?: boolean;
};

function useKeyPress(
  keyCode: string | string[],
  options?: UseKeyPressOptions,
): boolean;
```

### Exemplo
```tsx
import { useKeyPress } from '@xyflow/react';

export function KeyboardShortcutsWatcher() {
  const isShiftPressed = useKeyPress('Shift');
  const isSpacePressed = useKeyPress('Space');
  const isSavePressed = useKeyPress(['Meta+s', 'Control+s']);

  return (
    <div className="fixed bottom-4 left-4 rounded bg-slate-900 px-3 py-1 text-xs text-white">
      {isShiftPressed && <span>[Modo Multisseleção Ativo] </span>}
      {isSpacePressed && <span>[Modo Pan Livre] </span>}
      {isSavePressed && <span>[Salvando...] </span>}
    </div>
  );
}
```

---

## 9. `useViewport()`

Lê as coordenadas espaciais `x`, `y` e o fator de escala `zoom` da viewport atual em tempo real. Dispara re-renderização a cada frame durante pan ou zoom.

### Assinatura
```ts
function useViewport(): { x: number; y: number; zoom: number };
```

### Exemplo
```tsx
import { useViewport } from '@xyflow/react';

export function ViewportCoordinatesWidget() {
  const { x, y, zoom } = useViewport();

  return (
    <div className="rounded bg-white/90 p-2 font-mono text-xs shadow backdrop-blur">
      X: {x.toFixed(1)} | Y: {y.toFixed(1)} | Zoom: {(zoom * 100).toFixed(0)}%
    </div>
  );
}
```

---

## 10. `useInternalNode(nodeId)`

Retorna a representação interna de baixo nível do nó (`InternalNode`), contendo informações cruciais calculadas pelo motor do React Flow, como `internals.positionAbsolute` (levando em consideração posições de nós-pai em subflows).

### Assinatura
```ts
function useInternalNode<NodeType extends Node = Node>(id: string): InternalNode<NodeType> | undefined;
```

### Exemplo
```tsx
import { useInternalNode } from '@xyflow/react';

export function NodeAbsolutePositionTracker({ nodeId }: { nodeId: string }) {
  const internalNode = useInternalNode(nodeId);

  if (!internalNode) return null;

  const { x, y } = internalNode.internals.positionAbsolute;
  return (
    <div className="text-xs">
      Posição Absoluta no Canvas: ({x.toFixed(1)}, {y.toFixed(1)})
    </div>
  );
}
```

---

## 11. `useStore(selector, equalityFn?)`

Permite subscrever a qualquer propriedade da store Zustand interna do React Flow via seletores puros. Esta é a ferramenta definitiva para extrair dados reativos com máximo controle de performance.

### Assinatura
```ts
function useStore<T>(
  selector: (state: ReactFlowState) => T,
  equalityFn?: (a: T, b: T) => boolean,
): T;
```

### Exemplo
```tsx
import { useStore } from '@xyflow/react';

// Seletor reativo otimizado: só re-renderiza se a quantidade de nós mudar
const nodesCountSelector = (state: any) => state.nodes.length;
// Seletor dos limites de zoom configurados
const zoomBoundsSelector = (state: any) => ({ minZoom: state.minZoom, maxZoom: state.maxZoom });

export function CanvasStatus() {
  const count = useStore(nodesCountSelector);
  const { minZoom, maxZoom } = useStore(zoomBoundsSelector);

  return (
    <div>
      Nós totais: {count} | Limites de Zoom: [{minZoom}, {maxZoom}]
    </div>
  );
}
```

---

## 12. `useStoreApi<NodeType, EdgeType>()`

Retorna o objeto da store Zustand em si (`StoreApi<ReactFlowState>`). Não cria subscrição reativa. Permite consultar o estado instantâneo sob demanda via `store.getState()` ou despachar ações diretamente via `store.setState()`.

### Assinatura
```ts
function useStoreApi<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): StoreApi<ReactFlowState<NodeType, EdgeType>>;
```

### Exemplo
```tsx
import { useCallback } from 'react';
import { useStoreApi } from '@xyflow/react';

export function DirectActionDispatcher() {
  const store = useStoreApi();

  const handleInspectStateOnDemand = useCallback(() => {
    const currentState = store.getState();
    console.log('Nós atuais sem re-render:', currentState.nodes);
    console.log('Transform atual:', currentState.transform);
  }, [store]);

  return <button onClick={handleInspectStateOnDemand}>Inspecionar Store sob Demanda</button>;
}
```

---

## 13. `useOnSelectionChange({ onChange })`

Escuta eventos de mudança na seleção tanto de nós quanto de arestas.

### Assinatura
```ts
type UseOnSelectionChangeParams = {
  onChange: (params: { nodes: Node[]; edges: Edge[] }) => void;
};

function useOnSelectionChange(params: UseOnSelectionChangeParams): void;
```

> [!WARNING]
> A função passada em `onChange` **precisa impreterivelmente ser envolvida em `useCallback`**, sob risco de disparar re-renderizações infinitas.

### Exemplo
```tsx
import { useState, useCallback } from 'react';
import { useOnSelectionChange, type Node, type Edge } from '@xyflow/react';

export function SelectionWatcher() {
  const [selectionInfo, setSelectionInfo] = useState({ nodeCount: 0, edgeCount: 0 });

  const handleSelectionChange = useCallback(({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    setSelectionInfo({
      nodeCount: nodes.length,
      edgeCount: edges.length,
    });
  }, []);

  useOnSelectionChange({ onChange: handleSelectionChange });

  return (
    <div className="text-xs">
      Selecionados: {selectionInfo.nodeCount} nós, {selectionInfo.edgeCount} arestas
    </div>
  );
}
```

---

## 14. `useOnViewportChange({ onStart, onChange, onEnd })`

Escuta o ciclo de vida das modificações na viewport (pan e zoom).

### Assinatura
```ts
type UseOnViewportChangeParams = {
  onStart?: (viewport: Viewport) => void;
  onChange?: (viewport: Viewport) => void;
  onEnd?: (viewport: Viewport) => void;
};

function useOnViewportChange(params: UseOnViewportChangeParams): void;
```

### Exemplo
```tsx
import { useCallback } from 'react';
import { useOnViewportChange, type Viewport } from '@xyflow/react';

export function ViewportAnalyticsLogger() {
  const handleViewportEnd = useCallback((viewport: Viewport) => {
    console.log('Usuário finalizou movimento na viewport:', viewport);
  }, []);

  useOnViewportChange({
    onEnd: handleViewportEnd,
  });

  return null;
}
```

---

## 15. `useNodesState(initialNodes)` e 16. `useEdgesState(initialEdges)`

Hooks utilitários que facilitam a prototipagem rápida de fluxos controlados. Funcionam como o `useState` do React, mas já fornecem os handlers `onNodesChange` e `onEdgesChange` pré-configurados com `applyNodeChanges` e `applyEdgeChanges`.

### Assinatura
```ts
function useNodesState<NodeType extends Node = Node>(
  initialNodes: NodeType[]
): [NodeType[], Dispatch<SetStateAction<NodeType[]>>, OnNodesChange<NodeType>];

function useEdgesState<EdgeType extends Edge = Edge>(
  initialEdges: EdgeType[]
): [EdgeType[], Dispatch<SetStateAction<EdgeType[]>>, OnEdgesChange<EdgeType>];
```

### Exemplo
```tsx
import { ReactFlow, useNodesState, useEdgesState, addEdge, type OnConnect } from '@xyflow/react';
import { useCallback } from 'react';

const initialNodes = [{ id: '1', position: { x: 0, y: 0 }, data: { label: 'Início' } }];
const initialEdges = [];

export default function SimpleFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    />
  );
}
```

---

## 17. `useNodeId()`

Retorna a string do ID do nó no qual o componente está aninhado. Elimina a necessidade de repassar a prop `id` através de múltiplos níveis de componentes filhos dentro de um nó customizado (*prop drilling*).

### Assinatura
```ts
function useNodeId(): string | null;
```

### Exemplo
```tsx
import { useNodeId, useReactFlow } from '@xyflow/react';

export function NodeDeleteButton() {
  const nodeId = useNodeId();
  const { deleteElements } = useReactFlow();

  if (!nodeId) return null;

  return (
    <button
      className="nodrag text-rose-500 hover:text-rose-700"
      onClick={() => deleteElements({ nodes: [{ id: nodeId }] })}
      title="Excluir este nó"
    >
      ✕
    </button>
  );
}
```

---

## 18. `useUpdateNodeInternals()`

Função imperativa para notificar o React Flow de que as dimensões de um nó ou seus handles mudaram dinamicamente (por exemplo, quando handles são adicionados/removidos condicionalmente, ou o conteúdo do nó expande via animação/accordion).

### Assinatura
```ts
function useUpdateNodeInternals(): (nodeId: string | string[]) => void;
```

### Exemplo
```tsx
import { useState, useCallback } from 'react';
import { Handle, Position, useUpdateNodeInternals, type NodeProps } from '@xyflow/react';

export function DynamicPortsNode({ id, data }: NodeProps) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [portCount, setPortCount] = useState(1);

  const handleAddPort = useCallback(() => {
    setPortCount((prev) => {
      const next = prev + 1;
      // Notifica o React Flow para recalcular os pontos de snap dos novos handles
      setTimeout(() => updateNodeInternals(id), 0);
      return next;
    });
  }, [id, updateNodeInternals]);

  return (
    <div className="rounded border bg-white p-4 shadow">
      <p className="font-bold">{data.label}</p>
      <button className="nodrag text-xs text-blue-600" onClick={handleAddPort}>
        + Adicionar Porta de Saída
      </button>

      <Handle type="target" position={Position.Left} />

      {Array.from({ length: portCount }).map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Right}
          id={`port-${index}`}
          style={{ top: `${((index + 1) / (portCount + 1)) * 100}%` }}
        />
      ))}
    </div>
  );
}
```

---

## Resumo dos 18 Hooks

| Hook | Finalidade Principal | Re-renderiza o Componente? |
| :--- | :--- | :--- |
| `useReactFlow` | Acesso imperativo aos métodos do fluxo e manipulação global | Não |
| `useNodes` | Array de nós ativos | Sim (a qualquer mudança de nó) |
| `useEdges` | Array de arestas ativas | Sim (a qualquer mudança de aresta) |
| `useNodesData` | Subscrição a `data` de nós específicos | Sim (apenas quando o `data` selecionado mudar) |
| `useNodeConnections` | Lista conexões associadas a um handle/nó | Sim (quando conexões mudarem) |
| `useConnection` | Informações da conexão sendo arrastada em tempo real | Sim (durante o arrasto de nova aresta) |
| `useNodesInitialized` | Status de medição inicial de todos os nós | Sim (quando a inicialização concluir) |
| `useKeyPress` | Estado de teclas pressionadas no teclado | Sim (no keydown / keyup) |
| `useViewport` | Coordenadas X, Y e Zoom da viewport | Sim (a cada frame de pan/zoom) |
| `useInternalNode` | Dados internos (`positionAbsolute`, handles) | Sim (quando o nó mudar) |
| `useStore` | Subscrição cirúrgica com seletor Zustand | Sim (quando o valor do seletor mudar) |
| `useStoreApi` | Acesso à instância da store Zustand | Não |
| `useOnSelectionChange` | Listener de seleção de nós e arestas | Não (executa callback) |
| `useOnViewportChange` | Listener de eventos de movimentação da viewport | Não (executa callback) |
| `useNodesState` | Prototipagem de estado controlado de nós | Sim (gerencia useState interno) |
| `useEdgesState` | Prototipagem de estado controlado de arestas | Sim (gerencia useState interno) |
| `useNodeId` | Recupera ID do nó pai via contexto | Não |
| `useUpdateNodeInternals` | Força recálculo das dimensões e handles do nó | Não |
