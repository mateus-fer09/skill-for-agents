---
name: react-flow-canvas
description: >
  Skill especializada em React Flow (@xyflow/react) para projetar, implementar,
  depurar, otimizar e evoluir editores visuais baseados em nós e arestas.
  Use esta skill sempre que a tarefa envolver React Flow, node editors,
  workflow builders, diagramas interativos, canvases baseados em grafos,
  custom nodes, custom edges, handles, conexões, viewport, layout, subflows,
  persistência, validação de grafos, undo/redo, TypeScript, performance ou SSR.
version: "1.0.0"
library: "@xyflow/react"
documentation:
  - "https://reactflow.dev/learn"
  - "https://reactflow.dev/api-reference"
last_reviewed: "2026-08-24"
---

# Skill: React Flow Canvas — @xyflow/react

## 1. Missão da skill

Esta skill transforma o agente em um especialista operacional em **React Flow**, pacote `@xyflow/react`, capaz de:

- criar editores visuais baseados em grafos;
- implementar canvases controlados ou não controlados;
- criar nodes, edges e handles customizados;
- manipular conexões e validar regras de negócio;
- controlar pan, zoom, viewport, seleção e teclado;
- implementar drag-and-drop;
- criar subflows, grupos e relações pai/filho;
- consultar e computar grafos;
- integrar layout automático;
- salvar e restaurar diagramas;
- implementar copy/paste e undo/redo;
- estruturar estado com React, Zustand ou outra store;
- trabalhar corretamente com TypeScript;
- otimizar renderização para grafos grandes;
- preparar React Flow para SSR/SSG quando necessário;
- depurar erros comuns da biblioteca;
- escolher APIs públicas em vez de depender indevidamente do estado interno.

A skill deve ser aplicada tanto a projetos novos quanto a bases existentes.

---

# 2. Fonte de verdade

Ao trabalhar com React Flow, considere como fonte primária:

- Documentação de aprendizado: https://reactflow.dev/learn
- Referência da API: https://reactflow.dev/api-reference

A biblioteca React atual é importada de:

```bash
npm install @xyflow/react
```

Importações devem vir de:

```ts
import {
  ReactFlow,
  // ...
} from '@xyflow/react';
```

O CSS base é obrigatório:

```ts
import '@xyflow/react/dist/style.css';
```

Não confundir a versão moderna com imports legados de:

```ts
reactflow
```

ou versões antigas chamadas informalmente de "React Flow Renderer".

Quando encontrar código legado, primeiro identifique a versão antes de modificar APIs.

---

# 3. Regras fundamentais que o agente NUNCA deve esquecer

## 3.1 O container precisa ter dimensão

`<ReactFlow />` precisa estar dentro de um elemento com largura e altura utilizáveis.

Exemplo:

```tsx
<div style={{ width: '100vw', height: '100vh' }}>
  <ReactFlow />
</div>
```

Ou:

```css
.flow-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
}
```

Se o canvas não aparecer, esta é uma das primeiras verificações.

---

## 3.2 O CSS base precisa ser carregado

Sem:

```ts
import '@xyflow/react/dist/style.css';
```

a interface poderá aparecer quebrada ou incompleta.

Com Tailwind CSS 4, prefira importar o CSS do React Flow no stylesheet global **depois** do Tailwind.

---

## 3.3 Não recriar `nodeTypes` e `edgeTypes` a cada render

Errado:

```tsx
function Flow() {
  const nodeTypes = {
    custom: CustomNode,
  };

  return <ReactFlow nodeTypes={nodeTypes} />;
}
```

Preferir:

```tsx
const nodeTypes = {
  custom: CustomNode,
};

function Flow() {
  return <ReactFlow nodeTypes={nodeTypes} />;
}
```

Ou `useMemo` quando o mapa realmente depender de valores dinâmicos.

Mesma regra para `edgeTypes`.

---

## 3.4 Event handlers devem ter referência estável

Handlers importantes devem ser definidos fora do componente quando possível ou usando `useCallback`.

Exemplo:

```tsx
const onConnect = useCallback(
  (connection: Connection) => {
    setEdges((edges) => addEdge(connection, edges));
  },
  [setEdges],
);
```

Evite gerar callbacks complexos inline em `<ReactFlow />`.

---

## 3.5 Nunca mutar nodes e edges diretamente

Errado:

```ts
nodes[0].data.label = 'Novo';
setNodes(nodes);
```

Correto:

```ts
setNodes((nodes) =>
  nodes.map((node) =>
    node.id === id
      ? {
          ...node,
          data: {
            ...node.data,
            label: 'Novo',
          },
        }
      : node,
  ),
);
```

Use atualizações imutáveis.

---

# 4. Modelo mental da biblioteca

React Flow representa um **grafo interativo**.

Os elementos fundamentais são:

- **Node**: um vértice do grafo.
- **Edge**: conexão entre dois nodes.
- **Handle**: porta de conexão de um node.
- **Viewport**: transformação visual do canvas (`x`, `y`, `zoom`).
- **Connection**: representação temporária/estrutural de uma nova conexão.
- **ReactFlowInstance**: API imperativa do canvas.
- **NodeChange / EdgeChange**: mudanças produzidas por interações internas.

Fluxo conceitual:

```text
Nodes
  │
  ├── Handles
  │      │
  │      └──── Connection
  │                 │
  │                 ▼
  └─────────────── Edge
                    │
                    ▼
                   Node
```

---

# 5. Quick Start recomendado

Para prototipagem controlada:

```tsx
import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
  },
  {
    id: '2',
    position: { x: 250, y: 120 },
    data: { label: 'Node 2' },
  },
];

const initialEdges: Edge[] = [];

export default function Flow() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) => addEdge(connection, edges));
    },
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}
```

---

# 6. Controlled Flow vs Uncontrolled Flow

## 6.1 Controlled Flow

Use:

```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
/>
```

Características:

- aplicação controla nodes;
- aplicação controla edges;
- fácil persistir;
- fácil sincronizar com backend;
- fácil implementar histórico;
- recomendado para editores sofisticados.

---

## 6.2 Uncontrolled Flow

Use:

```tsx
<ReactFlow
  defaultNodes={initialNodes}
  defaultEdges={initialEdges}
/>
```

A instância interna gerencia as mudanças.

Adequado para:

- demos;
- diagramas simples;
- fluxos que não precisam de sincronização detalhada.

Para aplicações complexas, normalmente prefira controlled flow.

---

# 7. Nodes

Estrutura conceitual:

```ts
type Node = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, unknown>;

  type?: string;

  sourcePosition?: Position;
  targetPosition?: Position;

  hidden?: boolean;
  selected?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  deletable?: boolean;

  parentId?: string;
  extent?: 'parent' | CoordinateExtent;

  style?: CSSProperties;
  className?: string;

  width?: number;
  height?: number;

  // outros campos dependem da versão/API
};
```

Sempre consulte os tipos instalados quando houver dúvida.

---

## 7.1 Identidade do node

`id` deve:

- ser string;
- ser único;
- permanecer estável;
- não depender da posição visual;
- não mudar durante rerenders.

Bom:

```ts
id: crypto.randomUUID()
```

ou ID persistido pelo domínio.

Evitar:

```ts
id: String(nodes.length)
```

em aplicações com delete/reorder.

---

## 7.2 Position

Exemplo:

```ts
position: {
  x: 320,
  y: 180,
}
```

Por padrão, a origem do node corresponde ao canto superior esquerdo.

`nodeOrigin` permite modificar a interpretação.

Exemplo para centralizar a origem:

```tsx
<ReactFlow nodeOrigin={[0.5, 0.5]} />
```

---

# 8. Custom Nodes

React Flow é especialmente adequado a custom nodes.

Defina o componente:

```tsx
import {
  Handle,
  Position,
  type NodeProps,
} from '@xyflow/react';

type NumberNodeData = {
  label: string;
  value: number;
};

type NumberNode = Node<NumberNodeData, 'number'>;

function NumberNodeComponent({
  id,
  data,
  selected,
}: NodeProps<NumberNode>) {
  return (
    <div className={selected ? 'node selected' : 'node'}>
      <Handle
        id="input"
        type="target"
        position={Position.Left}
      />

      <strong>{data.label}</strong>
      <span>{data.value}</span>

      <Handle
        id="output"
        type="source"
        position={Position.Right}
      />
    </div>
  );
}
```

Registrar:

```tsx
const nodeTypes = {
  number: NumberNodeComponent,
};
```

Usar:

```tsx
<ReactFlow nodeTypes={nodeTypes} />
```

Node:

```ts
{
  id: 'node-a',
  type: 'number',
  position: { x: 0, y: 0 },
  data: {
    label: 'Valor',
    value: 10,
  },
}
```

---

# 9. NodeProps

Custom nodes recebem dados/contexto do React Flow.

Entre os campos importantes estão:

- `id`
- `data`
- `type`
- `selected`
- `dragging`
- `isConnectable`
- dimensões e posição quando disponíveis na versão atual

Não duplique em estado local aquilo que já existe como props, salvo quando houver motivo arquitetural claro.

---

# 10. Handles

Handles são portas de conexão.

```tsx
<Handle
  id="output"
  type="source"
  position={Position.Right}
/>
```

Tipos:

```ts
type="source"
type="target"
```

Posições comuns:

```ts
Position.Top
Position.Right
Position.Bottom
Position.Left
```

---

## 10.1 Múltiplos handles

Quando um node possuir vários handles, IDs exclusivos são obrigatórios:

```tsx
<Handle
  id="success"
  type="source"
  position={Position.Right}
/>

<Handle
  id="error"
  type="source"
  position={Position.Bottom}
/>
```

A edge pode especificar:

```ts
{
  id: 'e1',
  source: 'node-a',
  sourceHandle: 'success',
  target: 'node-b',
  targetHandle: 'input',
}
```

---

## 10.2 ConnectionMode.Loose

Para handles sem semântica rígida source/target:

```tsx
import { ConnectionMode } from '@xyflow/react';

<ReactFlow connectionMode={ConnectionMode.Loose} />
```

Use apenas se o domínio realmente exigir conexões bidirecionais/soltas.

---

## 10.3 Handles dinâmicos

Se quantidade/posição dos handles mudar depois do node ter sido renderizado, pode ser necessário:

```tsx
const updateNodeInternals = useUpdateNodeInternals();

updateNodeInternals(nodeId);
```

Use `useUpdateNodeInternals()` quando alterações estruturais no node invalidarem o cálculo interno das portas.

---

# 11. Utility classes essenciais

React Flow utiliza classes utilitárias especiais para controlar interação dentro de custom nodes.

## `nodrag`

Impede que determinada área dispare drag do node.

```tsx
<input className="nodrag" />
```

## `nopan`

Impede pan iniciado naquele elemento.

```tsx
<div className="nopan">
```

## `nowheel`

Evita que wheel naquele elemento controle o canvas.

Útil para:

- textarea;
- scroll interno;
- select;
- painel;
- listas.

---

# 12. Edges

Uma edge conecta:

```text
source → target
```

Estrutura típica:

```ts
{
  id: 'a-b',
  source: 'a',
  target: 'b',
  type: 'smoothstep',
}
```

Tipos built-in:

- `default`
- `straight`
- `step`
- `smoothstep`
- `simplebezier` quando disponível na versão atual

A documentação atual descreve o edge `default` como bezier.

---

# 13. addEdge()

Use `addEdge()` para conexões padrão.

```tsx
const onConnect = useCallback(
  (connection: Connection) => {
    setEdges((edges) => addEdge(connection, edges));
  },
  [setEdges],
);
```

`addEdge()` também valida duplicidade estrutural.

Não implemente manualmente:

```ts
setEdges((edges) => [...edges, connection as Edge]);
```

sem necessidade.

---

# 14. Custom Edges

Custom edges são componentes React responsáveis pela representação da ligação.

Registro:

```tsx
const edgeTypes = {
  custom: CustomEdge,
};
```

Uso:

```ts
{
  id: 'edge-a-b',
  source: 'a',
  target: 'b',
  type: 'custom',
}
```

---

## 14.1 BaseEdge

Para renderizar path padrão:

```tsx
import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';

function CustomEdge(props: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={props.markerEnd}
      style={props.style}
    />
  );
}
```

---

# 15. Path utilities

React Flow fornece helpers para geometria de edges.

## getBezierPath()

Use para curva bezier padrão.

## getSimpleBezierPath()

Use para bezier simplificada.

## getSmoothStepPath()

Use para roteamento ortogonal suavizado.

## getStraightPath()

Use para linha reta.

Os helpers normalmente retornam:

```ts
[
  path,
  labelX,
  labelY,
  offsetX,
  offsetY,
]
```

A assinatura exata deve ser confirmada nos tipos instalados.

---

# 16. Edge labels

Quando labels precisam de HTML interativo sobre SVG, use:

```tsx
<EdgeLabelRenderer>
  <div
    style={{
      position: 'absolute',
      transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
      pointerEvents: 'all',
    }}
    className="nodrag nopan"
  >
    <button>Excluir</button>
  </div>
</EdgeLabelRenderer>
```

Não tente inserir arbitrariamente elementos HTML dentro do `<path>` SVG.

---

# 17. EdgeToolbar

Para controles associados a uma edge, prefira `EdgeToolbar` quando adequado à UX.

Use para:

- excluir;
- editar;
- alterar tipo;
- abrir menu contextual.

---

# 18. Reconnect

Edges podem ser reconectáveis.

Props importantes:

```tsx
<ReactFlow
  edgesReconnectable
  onReconnect={onReconnect}
/>
```

Utility:

```ts
reconnectEdge()
```

Ao implementar reconexão, preserve ID e metadados da edge quando isso fizer sentido para o domínio.

---

# 19. Estado com useNodesState/useEdgesState

API:

```ts
const [nodes, setNodes, onNodesChange] =
  useNodesState(initialNodes);

const [edges, setEdges, onEdgesChange] =
  useEdgesState(initialEdges);
```

São equivalentes conceitualmente a `useState` + callbacks de aplicação das mudanças.

Ótimos para:

- aprendizado;
- protótipos;
- projetos pequenos/médios;
- exemplos.

Podem ser usados em produção, porém para editores complexos considere store dedicada.

---

# 20. applyNodeChanges / applyEdgeChanges

Forma explícita:

```tsx
const onNodesChange = useCallback(
  (changes: NodeChange[]) => {
    setNodes((nodes) =>
      applyNodeChanges(changes, nodes),
    );
  },
  [],
);
```

E:

```tsx
const onEdgesChange = useCallback(
  (changes: EdgeChange[]) => {
    setEdges((edges) =>
      applyEdgeChanges(changes, edges),
    );
  },
  [],
);
```

Útil quando você precisa interceptar mudanças.

Exemplo:

```tsx
const onNodesChange = useCallback(
  (changes: NodeChange[]) => {
    const filtered = changes.filter((change) => {
      if (
        change.type === 'remove' &&
        protectedNodeIds.has(change.id)
      ) {
        return false;
      }

      return true;
    });

    setNodes((nodes) =>
      applyNodeChanges(filtered, nodes),
    );
  },
  [],
);
```

---

# 21. ReactFlowProvider

Use `<ReactFlowProvider />` quando componentes fora da árvore interna direta do `<ReactFlow />` precisam consumir hooks da biblioteca.

```tsx
<ReactFlowProvider>
  <FlowEditor />
  <Sidebar />
</ReactFlowProvider>
```

Importante:

```tsx
function App() {
  const reactFlow = useReactFlow();

  return (
    <ReactFlowProvider>
      ...
    </ReactFlowProvider>
  );
}
```

é incorreto, pois o hook é chamado antes do provider.

Correto:

```tsx
function App() {
  return (
    <ReactFlowProvider>
      <Editor />
    </ReactFlowProvider>
  );
}

function Editor() {
  const reactFlow = useReactFlow();
  // ...
}
```

---

# 22. useReactFlow()

Retorna `ReactFlowInstance`.

```tsx
const reactFlow = useReactFlow();
```

É a principal API imperativa do canvas.

Use quando precisar:

- consultar nodes;
- consultar edges;
- alterar nodes;
- alterar edges;
- fitView;
- zoom;
- centralizar viewport;
- converter coordenadas;
- consultar interseções;
- serializar o fluxo.

Uma diferença importante:

`useReactFlow()` não necessariamente rerenderiza o componente a cada mudança do estado do canvas.

Isso o torna adequado para ações imperativas.

---

# 23. ReactFlowInstance — operações importantes

Dependendo da versão instalada, a instância fornece métodos equivalentes a:

```ts
getNodes()
getNode(id)

getEdges()
getEdge(id)

setNodes(...)
addNodes(...)
updateNode(...)
updateNodeData(...)

setEdges(...)
addEdges(...)
updateEdge(...)
updateEdgeData(...)

deleteElements(...)

fitView(...)
zoomIn(...)
zoomOut(...)
zoomTo(...)

setViewport(...)
getViewport()

setCenter(...)

screenToFlowPosition(...)
flowToScreenPosition(...)

getNodesBounds(...)
getIntersectingNodes(...)
isNodeIntersecting(...)

toObject()
```

Regra da skill:

> Nunca inventar assinatura de método imperativo. Verificar os tipos da versão instalada se a precisão da assinatura for necessária.

---

# 24. Hooks públicos

A referência atual inclui os seguintes hooks principais.

## useConnection()

Observa o estado da conexão que está sendo criada.

Use para:

- destacar destinos válidos;
- UX contextual durante connection drag;
- mostrar informações temporárias.

---

## useEdges()

Obtém edges atuais e rerenderiza quando elas mudam.

Evite em componentes que não precisam acompanhar toda a coleção.

---

## useEdgesState()

Gerenciamento conveniente de edges.

---

## useHandleConnections()

Consulta conexões de um handle específico.

Útil para nodes que precisam saber:

- quantas conexões possuem;
- quem está conectado;
- estado de portas.

---

## useInternalNode()

Acessa representação interna de um node.

Use somente quando a API pública de `Node` não fornecer a informação necessária.

Evite acoplar arquitetura ao formato interno.

---

## useKeyPress()

Detecta teclado.

Útil para:

- atalhos;
- modos de ferramenta;
- Space para pan;
- Shift para seleção customizada.

---

## useNodeConnections()

Consulta conexões relacionadas a um node.

---

## useNodeId()

Dentro de custom node, fornece ID do node atual.

---

## useNodes()

Obtém coleção atual de nodes e acompanha mudanças.

Cuidado com performance.

---

## useNodesData()

Use quando o componente precisa observar apenas dados de nodes específicos.

Preferível a observar todos os nodes em muitas situações.

---

## useNodesInitialized()

Indica se os nodes já foram medidos/inicializados.

Útil antes de:

- layout dependente de dimensões;
- cálculo geométrico;
- fit customizado.

---

## useNodesState()

Gerenciamento conveniente de nodes.

---

## useOnSelectionChange()

Observa alteração da seleção.

Callbacks devem manter referência estável.

---

## useOnViewportChange()

Observa mudanças no viewport.

Adequado para:

- persistência do viewport;
- HUD;
- sincronização.

---

## useReactFlow()

API imperativa.

---

## useStore()

Permite selecionar estado interno da store.

Use seletor estreito.

Errado:

```tsx
const store = useStore((state) => state);
```

Melhor:

```tsx
const zoom = useStore(
  (state) => state.transform[2],
);
```

Mesmo assim, prefira APIs públicas quando disponíveis.

---

## useStoreApi()

Acesso imperativo à store interna.

É ferramenta avançada.

Não deve ser a primeira escolha.

---

## useUpdateNodeInternals()

Recalcula internals de node após alterações de handles/dimensões estruturais.

---

## useViewport()

Acompanha:

```ts
{
  x,
  y,
  zoom,
}
```

Causa rerender quando viewport muda.

---

# 25. Viewport

Viewport:

```ts
type Viewport = {
  x: number;
  y: number;
  zoom: number;
};
```

Não confundir:

- posição do node no espaço do flow;
- coordenadas de tela;
- transformação do viewport.

---

## 25.1 defaultViewport

```tsx
<ReactFlow
  defaultViewport={{
    x: 100,
    y: 50,
    zoom: 1.2,
  }}
/>
```

Se `fitView` estiver ativo, o viewport inicial pode ser sobrescrito.

---

## 25.2 Controlled viewport

```tsx
const [viewport, setViewport] =
  useState<Viewport>({
    x: 0,
    y: 0,
    zoom: 1,
  });

<ReactFlow
  viewport={viewport}
  onViewportChange={setViewport}
/>
```

Não use controlled viewport sem necessidade; ele aumenta responsabilidades.

---

## 25.3 fitView

Inicial:

```tsx
<ReactFlow fitView />
```

Imperativo:

```ts
await reactFlow.fitView({
  padding: 0.2,
  duration: 500,
});
```

---

## 25.4 Limites

```tsx
<ReactFlow
  minZoom={0.2}
  maxZoom={2.5}
/>
```

Para restringir pan:

```tsx
<ReactFlow
  translateExtent={[
    [-1000, -1000],
    [1000, 1000],
  ]}
/>
```

Para restringir nodes:

```tsx
<ReactFlow
  nodeExtent={[
    [-1000, -1000],
    [1000, 1000],
  ]}
/>
```

---

# 26. Coordenadas de tela ↔ flow

Ao implementar drag-and-drop externo, context menu ou criação de node na posição do mouse, use:

```ts
const position =
  reactFlow.screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });
```

Evite cálculos manuais baseados em:

```ts
clientX - bounds.left
```

sem considerar zoom e pan.

---

# 27. Eventos

Agrupe mentalmente os eventos em:

- gerais;
- nodes;
- edges;
- conexão;
- pane;
- seleção;
- viewport/movimento.

Exemplos frequentes:

```tsx
onInit
onError

onNodeClick
onNodeDoubleClick
onNodeContextMenu
onNodeMouseEnter
onNodeMouseMove
onNodeMouseLeave

onNodeDragStart
onNodeDrag
onNodeDragStop

onNodesChange
onNodesDelete

onEdgeClick
onEdgeDoubleClick
onEdgeContextMenu
onEdgeMouseEnter
onEdgeMouseMove
onEdgeMouseLeave

onEdgesChange
onEdgesDelete

onConnect
onConnectStart
onConnectEnd

onReconnect
onReconnectStart
onReconnectEnd

onPaneClick
onPaneContextMenu
onPaneScroll
onPaneMouseMove

onSelectionChange
onSelectionDragStart
onSelectionDrag
onSelectionDragStop

onMoveStart
onMove
onMoveEnd
```

A assinatura exata deve ser inferida dos tipos exportados.

---

# 28. Interação

Props importantes podem incluir:

```tsx
nodesDraggable
nodesConnectable
nodesFocusable

edgesFocusable
edgesReconnectable

elementsSelectable

panOnDrag
panOnScroll
panOnScrollMode
panOnScrollSpeed

zoomOnScroll
zoomOnPinch
zoomOnDoubleClick

selectionOnDrag
selectionMode

selectNodesOnDrag
```

Escolha conforme o tipo de produto.

---

# 29. Seleção

React Flow suporta seleção individual e múltipla.

Para editor estilo Figma/diagramador:

- definir estratégia de seleção;
- configurar pan;
- evitar conflito entre seleção e drag;
- implementar toolbar baseada em seleção;
- considerar atalhos Delete/Backspace;
- decidir se edges são selecionáveis.

Não mantenha seleção duplicada fora do React Flow sem motivo.

Se precisar de estado derivado:

```ts
const selectedNodes =
  nodes.filter((node) => node.selected);
```

Para store grande, prefira estado dedicado ou seletor otimizado.

---

# 30. Connection validation

Use:

```tsx
isValidConnection={isValidConnection}
```

Exemplo:

```tsx
const isValidConnection = useCallback(
  (connection: Connection) => {
    if (
      connection.source === connection.target
    ) {
      return false;
    }

    return true;
  },
  [],
);
```

Validações comuns:

- impedir self-loop;
- impedir ciclos;
- limitar quantidade de entradas;
- limitar quantidade de saídas;
- validar tipos de porta;
- impedir conexão duplicada;
- validar regra de negócio.

---

# 31. Prevenindo ciclos

Para DAGs/workflows:

1. obtenha o target candidato;
2. percorra seus outgoers;
3. determine se o source seria alcançável;
4. rejeite a conexão se formar ciclo.

APIs úteis:

```ts
getOutgoers()
getIncomers()
getConnectedEdges()
```

Exemplo conceitual:

```ts
function wouldCreateCycle(
  connection: Connection,
  nodes: Node[],
  edges: Edge[],
) {
  // executar DFS/BFS a partir do target
  // se source for alcançável, cria ciclo
}
```

Para grafos grandes, não recalcular o grafo inteiro desnecessariamente.

---

# 32. Computação de grafo

Utilities úteis:

## getIncomers(node, nodes, edges)

Retorna nodes que entram no node informado.

## getOutgoers(node, nodes, edges)

Retorna nodes alcançados diretamente pelas saídas.

## getConnectedEdges(nodes, edges)

Retorna edges conectadas aos nodes informados.

Use para:

- execução de workflow;
- propagação de dados;
- validação;
- delete inteligente;
- análise de dependências.

---

# 33. Delete inteligente

Ao excluir um node intermediário, o domínio pode exigir:

```text
A → B → C

remove B

A → C
```

Isso não é comportamento universal.

Implemente explicitamente:

1. descobrir incomers de B;
2. descobrir outgoers de B;
3. remover B e edges conectadas;
4. gerar novas edges necessárias;
5. impedir duplicatas.

Use apenas quando a semântica do produto exigir.

---

# 34. Subflows e grupos

React Flow permite relações pai/filho.

Conceito:

```ts
{
  id: 'child',
  parentId: 'group',
  extent: 'parent',
  position: { x: 20, y: 20 },
}
```

A posição do child é relativa ao parent.

Cuidados:

- parent precisa aparecer antes dos children na estrutura quando exigido pela implementação/versão;
- dimensionamento do grupo deve considerar os children;
- mover parent normalmente move children visualmente;
- drag/drop entre grupos exige conversão correta de posição.

Nunca trate posição de child como absoluta sem verificar `parentId`.

---

# 35. NodeResizer

Para nodes redimensionáveis:

```tsx
<NodeResizer
  minWidth={120}
  minHeight={80}
/>
```

Geralmente colocado dentro do custom node.

Pode ser condicionado:

```tsx
<NodeResizer
  isVisible={selected}
/>
```

Use quando o próprio usuário precisa alterar dimensões.

---

# 36. NodeResizeControl

API mais granular para criar handles customizados de resize.

Use quando:

- UI precisa de aparência personalizada;
- apenas certas direções podem redimensionar;
- controle precisa conter ícone/elemento customizado.

---

# 37. NodeToolbar

Toolbar associada ao node:

```tsx
<NodeToolbar
  isVisible={selected}
  position={Position.Top}
>
  <button>Editar</button>
  <button>Excluir</button>
</NodeToolbar>
```

A toolbar não deve escalar junto com zoom da mesma forma que o conteúdo normal do node.

---

# 38. Built-in components

A referência inclui componentes como:

```text
Background
BaseEdge
ControlButton
Controls
EdgeLabelRenderer
EdgeText
EdgeToolbar
Handle
MiniMap
NodeResizeControl
NodeResizer
NodeToolbar
Panel
ViewportPortal
```

---

# 39. Background

Exemplo:

```tsx
import {
  Background,
  BackgroundVariant,
} from '@xyflow/react';

<Background
  variant={BackgroundVariant.Dots}
  gap={16}
  size={1}
/>
```

Pode usar variantes como dots/lines/cross conforme versão.

---

# 40. Controls

```tsx
<Controls />
```

Fornece controles de viewport.

Pode ser customizado e complementado com `ControlButton`.

---

# 41. MiniMap

```tsx
<MiniMap />
```

Útil para canvases extensos.

Pode customizar:

- cor;
- stroke;
- nodeColor;
- pannable;
- zoomable;
- mask.

Em grafos muito grandes, meça impacto de performance.

---

# 42. Panel

Para UI posicionada sobre o canvas:

```tsx
<Panel position="top-right">
  <button>Salvar</button>
</Panel>
```

Prefira `Panel` para controles ancorados ao viewport.

---

# 43. ViewportPortal

Renderiza conteúdo alinhado ao espaço transformado do flow.

Use quando precisa posicionar elementos customizados no espaço do canvas sem convertê-los em nodes.

---

# 44. Snap to grid

```tsx
<ReactFlow
  snapToGrid
  snapGrid={[20, 20]}
/>
```

Útil para:

- diagramadores;
- BPMN-like;
- editores técnicos.

---

# 45. Drag-and-drop de novos nodes

Arquitetura recomendada:

```text
Sidebar
  ↓ drag
ReactFlow wrapper
  ↓ drop
screenToFlowPosition()
  ↓
createNode()
  ↓
setNodes()
```

Exemplo:

```tsx
const onDrop = useCallback(
  (event: React.DragEvent) => {
    event.preventDefault();

    const type =
      event.dataTransfer.getData(
        'application/reactflow',
      );

    if (!type) return;

    const position =
      reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

    const newNode: Node = {
      id: crypto.randomUUID(),
      type,
      position,
      data: {
        label: type,
      },
    };

    setNodes((nodes) => [...nodes, newNode]);
  },
  [reactFlow, setNodes],
);
```

---

# 46. Context menu

Node:

```tsx
onNodeContextMenu={(event, node) => {
  event.preventDefault();
  // abrir menu
}}
```

Pane:

```tsx
onPaneContextMenu={(event) => {
  event.preventDefault();
}}
```

Ao posicionar menu HTML, use coordenadas de tela.

Ao criar node na posição do menu, converta para coordenadas do flow.

---

# 47. Estado de domínio vs estado visual

Separe:

## Estado visual

- posição;
- seleção;
- dragging;
- dimensions;
- viewport.

## Estado de domínio

- nome da etapa;
- configuração;
- parâmetros;
- condição;
- ID de integração;
- status;
- schema de input/output.

Exemplo:

```ts
type WorkflowNodeData = {
  title: string;
  operation: string;
  config: OperationConfig;
};
```

Evite transformar `data` em um depósito arbitrário de estado global.

---

# 48. Zustand para aplicações maiores

A própria documentação demonstra integração com Zustand.

Estrutura recomendada:

```ts
type FlowState = {
  nodes: AppNode[];
  edges: AppEdge[];

  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange<AppEdge>;
  onConnect: OnConnect;

  addNode: (node: AppNode) => void;
  updateNodeData: (
    id: string,
    patch: Partial<AppNode['data']>,
  ) => void;

  removeNode: (id: string) => void;
};
```

Use:

```ts
createWithEqualityFn()
```

ou seletores estreitos conforme versão do Zustand.

Não faça:

```tsx
const store = useFlowStore();
```

em componentes pesados se só precisam de 1 campo.

Prefira:

```tsx
const nodes = useFlowStore(
  (state) => state.nodes,
);
```

Melhor ainda, selecione apenas o dado necessário.

---

# 49. Performance — regra crítica

React Flow é altamente interativo. Arrastar um node produz muitas atualizações.

O maior risco é rerender excessivo.

## Sempre considerar

- `React.memo`;
- `useMemo`;
- `useCallback`;
- seletores de store;
- evitar observar coleção inteira sem necessidade;
- evitar componentes complexos dentro de todos os nodes;
- evitar efeitos globais em cada movimento;
- virtualização lógica quando aplicável;
- `onlyRenderVisibleElements` quando medido como vantajoso.

---

# 50. Memoizar custom nodes

```tsx
export const CustomNode =
  memo(function CustomNode(props: NodeProps<AppNode>) {
    // ...
  });
```

Não é obrigatório em todos os casos, mas é frequentemente útil em editores grandes.

---

# 51. Memoizar handlers

```tsx
const onNodeClick = useCallback(
  (_event, node) => {
    setSelectedId(node.id);
  },
  [],
);
```

Evite handlers inline em centenas de nodes quando eles causarem invalidação de props.

---

# 52. Não depender de `nodes` inteiro para seleção

Problemático em store:

```tsx
const nodes = useStore(
  (state) => state.nodes,
);

const selectedIds =
  nodes
    .filter((node) => node.selected)
    .map((node) => node.id);
```

Isso rerenderiza em qualquer movimento de node.

Melhor manter:

```ts
selectedNodeIds: string[]
```

se o produto exigir alta performance.

---

# 53. onlyRenderVisibleElements

```tsx
<ReactFlow
  onlyRenderVisibleElements
/>
```

Pode ajudar em grandes grafos.

Porém a própria opção possui overhead.

Regra:

> Não ativar por superstição. Medir.

---

# 54. Dados pesados

Não renderize gráficos, editores de código ou previews caros em centenas de nodes sem estratégia.

Considere:

- render simplificado quando node não está selecionado;
- lazy rendering;
- modo de detalhe baseado em zoom;
- abrir configuração pesada em sidebar;
- memoização.

---

# 55. TypeScript — regra base

Tipar nodes e edges do domínio.

Exemplo:

```ts
import type {
  Node,
  Edge,
} from '@xyflow/react';

type TextNode = Node<
  {
    text: string;
  },
  'text'
>;

type MathNode = Node<
  {
    operation: 'add' | 'subtract';
  },
  'math'
>;

export type AppNode =
  | TextNode
  | MathNode;

export type AppEdge =
  Edge<
    {
      condition?: string;
    },
    'workflow'
  >;
```

Isso permite unions discriminadas.

---

# 56. NodeTypes tipado

```tsx
import type {
  NodeTypes,
} from '@xyflow/react';

export const nodeTypes = {
  text: TextNodeComponent,
  math: MathNodeComponent,
} satisfies NodeTypes;
```

Quando possível, use `satisfies`.

---

# 57. EdgeTypes tipado

```tsx
import type {
  EdgeTypes,
} from '@xyflow/react';

export const edgeTypes = {
  workflow: WorkflowEdge,
} satisfies EdgeTypes;
```

---

# 58. Generics nos hooks

```tsx
const [nodes, setNodes, onNodesChange] =
  useNodesState<AppNode>(initialNodes);

const [edges, setEdges, onEdgesChange] =
  useEdgesState<AppEdge>(initialEdges);

const reactFlow =
  useReactFlow<AppNode, AppEdge>();
```

---

# 59. Nunca usar `any` como solução padrão

Evite:

```ts
Node<any>
Edge<any>
NodeProps<any>
```

Prefira tipos explícitos.

Use `unknown` quando os dados realmente forem desconhecidos.

---

# 60. Persistência

Um workflow precisa normalmente persistir:

```ts
{
  version,
  nodes,
  edges,
  viewport,
  metadata,
}
```

Exemplo:

```ts
type SavedFlow = {
  schemaVersion: 1;
  nodes: AppNode[];
  edges: AppEdge[];
  viewport: Viewport;
};
```

---

# 61. toObject()

A instância fornece serialização do estado visual relevante.

Conceito:

```ts
const snapshot =
  reactFlow.toObject();
```

Mesmo assim, mantenha `schemaVersion` próprio.

Nunca dependa eternamente do shape de uma versão externa sem migração.

---

# 62. Save & Restore

Fluxo recomendado:

```text
Save
 ↓
ReactFlow state
 ↓
normalize
 ↓
schemaVersion
 ↓
JSON/backend

Restore
 ↓
parse
 ↓
validate
 ↓
migrate
 ↓
setNodes/setEdges/setViewport
```

Valide dados recebidos de backend/localStorage.

Considere Zod.

---

# 63. Undo / Redo

Não grave snapshot a cada pixel de drag.

Melhores estratégias:

- snapshot em `onNodeDragStop`;
- comandos semânticos;
- transaction batching;
- temporal Zustand;
- history reducer.

Exemplo de eventos que devem gerar checkpoint:

- adicionar node;
- remover node;
- conexão criada;
- conexão removida;
- drag finalizado;
- edição de config finalizada;
- resize finalizado.

---

# 64. Copy / Paste

Ao copiar nodes:

1. coletar selected nodes;
2. coletar edges cuja source e target estão dentro da seleção;
3. gerar novos IDs;
4. criar mapa oldID → newID;
5. aplicar offset de posição;
6. reescrever source/target das edges;
7. preservar sourceHandle/targetHandle.

Não copie IDs originais.

---

# 65. Layout

React Flow não é, por si só, uma engine completa de auto-layout.

Integrações comuns:

- Dagre;
- ELK;
- D3 hierarchy;
- force-directed layouts;
- engines próprias.

Processo:

```text
nodes + edges
    ↓
layout engine
    ↓
positions
    ↓
setNodes
    ↓
fitView
```

---

# 66. Dagre

Adequado para:

- trees;
- DAGs;
- workflows lineares.

Limitações:

- layouts complexos;
- múltiplas handles;
- nodes com dimensões dinâmicas;
- grupos avançados.

---

# 67. ELK

Preferível para cenários avançados:

- múltiplas portas;
- hierarquia;
- roteamento;
- layouts configuráveis.

Tem custo de complexidade maior.

---

# 68. Layout com dimensões

Se o layout depende de width/height real do node:

```tsx
const initialized =
  useNodesInitialized();
```

Depois de medidos:

```tsx
useEffect(() => {
  if (!initialized) return;

  // calcular layout
}, [initialized]);
```

Evite layout prematuro com dimensões inexistentes.

---

# 69. SSR / SSG

React Flow pode ser usado em cenários SSR/SSG, mas dimensões dos nodes são particularmente importantes.

Quando o servidor precisa produzir geometria correta:

- forneça `width`/`height` quando necessário;
- ou dados de handle/dimensões exigidos pela configuração atual;
- evite depender exclusivamente de medições do DOM;
- valide diferenças de hidratação.

Não trate SSR igual a canvas puramente client-side.

---

# 70. Next.js

Para editor interativo, frequentemente será necessário marcar o componente como client component:

```tsx
'use client';
```

Não aplicar cegamente em toda a árvore.

Isole o editor no menor boundary client-side razoável.

---

# 71. Accessibility

React Flow possui suporte a navegação e ARIA.

Ao criar custom nodes:

- use elementos semânticos;
- preserve foco;
- não remova outline sem substituto;
- dê labels a botões;
- não dependa só de cor;
- garanta teclado para ações importantes;
- use `ariaLabelConfig` quando precisar de localização/customização.

---

# 72. Keyboard

Props podem controlar teclas para:

- delete;
- seleção múltipla;
- seleção;
- zoom;
- interação.

Ao implementar atalhos próprios:

- não capture digitação dentro de input/textarea;
- respeite Ctrl/Cmd;
- trate Windows/macOS;
- evite conflito com browser.

---

# 73. Theming

A biblioteca oferece CSS base e variáveis/classes para personalização.

Estratégia recomendada:

```css
.react-flow {
  --xy-node-border-radius: 12px;
}
```

A lista exata de variáveis deve ser consultada na documentação da versão atual.

Também existe:

```tsx
<ReactFlow colorMode="dark" />
```

ou modos aceitos pela versão.

---

# 74. Tailwind

Tailwind pode estilizar custom nodes normalmente.

Exemplo:

```tsx
<div className="rounded-xl border bg-background p-4 shadow-sm">
```

Para classes internas do React Flow, use CSS global quando necessário.

Nunca depender de classes geradas dinamicamente que o Tailwind não consegue detectar sem safelist.

---

# 75. Dark mode

Escolha uma estratégia única:

- `colorMode` do React Flow;
- classe de tema global;
- CSS variables da aplicação.

Não crie duas fontes de verdade independentes.

---

# 76. Markers

Edges podem usar markers para setas.

Use `MarkerType`.

Exemplo conceitual:

```ts
markerEnd: {
  type: MarkerType.ArrowClosed,
}
```

Quando precisar de marker customizado, consulte a API atual.

---

# 77. Default edge options

Para padronizar edges:

```tsx
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
};

<ReactFlow
  defaultEdgeOptions={defaultEdgeOptions}
/>
```

Mantenha o objeto estável.

---

# 78. Intersections

ReactFlowInstance possui APIs de interseção úteis para:

- drag into group;
- collision;
- drop zones;
- seleção espacial;
- snapping customizado.

Não implemente geometria do zero antes de verificar as APIs existentes.

---

# 79. Whiteboard-like features

React Flow pode servir como base para:

- lasso;
- rectangle;
- freehand;
- eraser;
- sticky notes;
- shapes.

Porém esses recursos podem exigir lógica adicional além da biblioteca core.

Trate React Flow como infraestrutura do grafo/canvas, não como editor whiteboard completo pronto.

---

# 80. Arquitetura recomendada para projeto profissional

```text
src/
  flow/
    components/
      FlowCanvas.tsx
      FlowToolbar.tsx
      FlowSidebar.tsx

    nodes/
      TriggerNode.tsx
      ActionNode.tsx
      ConditionNode.tsx
      nodeTypes.ts

    edges/
      WorkflowEdge.tsx
      edgeTypes.ts

    hooks/
      useFlowShortcuts.ts
      useFlowPersistence.ts
      useFlowClipboard.ts
      useFlowHistory.ts
      useAutoLayout.ts

    store/
      flow.store.ts
      flow.selectors.ts

    domain/
      flow.types.ts
      flow.validation.ts
      flow.serialization.ts
      flow.migrations.ts

    utils/
      graph.ts
      positions.ts
      ids.ts
```

Não colocar toda a lógica no `FlowCanvas.tsx`.

---

# 81. Separação de responsabilidades

## FlowCanvas

Responsável por:

- `<ReactFlow />`;
- registro de types;
- eventos principais;
- componentes built-in.

## Store

Responsável por:

- nodes;
- edges;
- commands;
- seleção de domínio;
- histórico.

## Node components

Responsáveis por:

- UI local;
- interação local;
- handles.

## Domain services

Responsáveis por:

- validação;
- execução;
- persistência;
- schemas;
- regras de negócio.

---

# 82. Padrão de commands

Em vez de espalhar `setNodes()`:

```ts
addNode()
removeNode()
duplicateNode()
updateNodeConfig()
connectNodes()
disconnectEdge()
groupNodes()
ungroupNodes()
```

Isso torna:

- undo/redo;
- testes;
- validação;
- telemetria;
- persistência

mais fáceis.

---

# 83. IDs

Utilize:

```ts
crypto.randomUUID()
```

ou IDs gerados no backend.

Não use timestamp puro se colisões importarem.

Para edges, IDs podem ser:

```ts
crypto.randomUUID()
```

Não dependa de concatenação source-target quando múltiplas conexões iguais forem semanticamente possíveis.

---

# 84. Schema do domínio

Exemplo robusto:

```ts
type PortDefinition = {
  id: string;
  label: string;
  dataType:
    | 'string'
    | 'number'
    | 'boolean'
    | 'json';
};

type WorkflowNodeData = {
  title: string;
  description?: string;

  inputs: PortDefinition[];
  outputs: PortDefinition[];

  operation: string;

  config: Record<string, unknown>;
};
```

Handles:

```tsx
{data.inputs.map((input) => (
  <Handle
    key={input.id}
    id={input.id}
    type="target"
    position={Position.Left}
  />
))}
```

Se a lista mudar dinamicamente, chamar `useUpdateNodeInternals`.

---

# 85. Tipagem de portas

React Flow conecta handles, mas a compatibilidade semântica é responsabilidade da aplicação.

Implemente:

```ts
function canConnectPorts(
  sourcePort: PortDefinition,
  targetPort: PortDefinition,
) {
  return (
    sourcePort.dataType ===
    targetPort.dataType
  );
}
```

Use isso em `isValidConnection`.

---

# 86. Data flow entre nodes

Não confundir:

```text
Edge visual
```

com:

```text
execução de dados
```

React Flow representa a topologia, mas a aplicação decide:

- ordem de execução;
- transformação de dados;
- concorrência;
- erros;
- retries;
- loops;
- scheduling.

---

# 87. Topological sort

Para workflow DAG:

1. validar ausência de ciclos;
2. computar indegree;
3. aplicar Kahn ou DFS;
4. executar nodes na ordem;
5. paralelizar nodes independentes se permitido.

Não derive "ordem de execução" da posição x/y.

---

# 88. Conexões inválidas

Forneça feedback visual.

Exemplos:

- handle fica vermelho;
- cursor proibido;
- tooltip;
- toast;
- mensagem contextual.

Não espere o usuário soltar a conexão para explicar uma regra simples se você pode prever a invalidade.

---

# 89. Atualização de node data

Com store local:

```tsx
setNodes((nodes) =>
  nodes.map((node) =>
    node.id === id
      ? {
          ...node,
          data: {
            ...node.data,
            ...patch,
          },
        }
      : node,
  ),
);
```

Com `ReactFlowInstance`, versões modernas oferecem métodos de atualização específicos.

Consulte a assinatura instalada antes de usar.

---

# 90. Inputs dentro de custom nodes

Use:

```tsx
<input
  className="nodrag"
  value={value}
  onChange={...}
/>
```

Para textarea com scroll:

```tsx
<textarea
  className="nodrag nowheel"
/>
```

Se clicar no input estiver arrastando o node, esta é a primeira correção.

---

# 91. Forms complexos

Não coloque formulários enormes dentro do node se prejudicarem UX/performance.

Preferir:

```text
Node compacto
   ↓ selecionar
Inspector/sidebar
   ↓ editar config
Store
   ↓ atualiza node.data
```

---

# 92. Inspector panel

Seleção:

```ts
selectedNodeId
```

Inspector:

```tsx
const node =
  useFlowStore((state) =>
    state.nodes.find(
      (node) =>
        node.id === state.selectedNodeId,
    ),
  );
```

Em stores grandes, prefira estrutura indexada:

```ts
nodesById
```

se performance justificar.

---

# 93. Contexto externo

Evite passar dezenas de callbacks por `node.data`.

Ruim:

```ts
data: {
  onDelete: () => ...,
  onRename: () => ...,
}
```

Problemas:

- serialização;
- referências instáveis;
- acoplamento.

Prefira store/hooks.

`data` deve ser preferencialmente serializável.

---

# 94. Persistência e funções

Nunca persista:

```ts
data: {
  onClick: () => {}
}
```

JSON não preserva função.

Store de ações deve ficar fora dos dados serializados.

---

# 95. Segurança de dados

Ao carregar fluxo externo:

- validar IDs;
- validar tipos de node;
- validar edge source/target;
- validar handles;
- validar config;
- rejeitar tipos desconhecidos quando necessário.

React Flow não substitui validação do domínio.

---

# 96. Error handling

Use `onError` para observabilidade:

```tsx
<ReactFlow
  onError={(code, message) => {
    console.error(
      '[ReactFlow]',
      code,
      message,
    );
  }}
/>
```

A assinatura exata pode variar; verifique os tipos.

Não silencie todos os erros.

---

# 97. Debug

A prop:

```tsx
debug
```

pode registrar eventos/informações úteis.

Use durante desenvolvimento, não como solução permanente.

---

# 98. Common debugging checklist

Quando o canvas não funciona, verificar na ordem:

1. CSS importado?
2. container possui width/height?
3. nodes possuem `id` único?
4. nodes possuem `position`?
5. custom `type` está registrado?
6. handle IDs são únicos?
7. source/target da edge existem?
8. callbacks estão estáveis?
9. arrays estão sendo mutados?
10. provider existe para hook utilizado?
11. nodeTypes/edgeTypes estão sendo recriados?
12. `fitView` está escondendo problema de posição?
13. parent/child está usando coordenada relativa?
14. z-index/CSS está cobrindo handles?
15. `pointer-events` está bloqueando interação?
16. `nodrag/nopan/nowheel` estão corretos?
17. versão da documentação corresponde à versão instalada?

---

# 99. Erro: "node type not found"

Causas:

```ts
node.type = 'custom'
```

mas:

```ts
const nodeTypes = {
  myCustom: CustomNode,
};
```

Corrigir os nomes.

---

# 100. Edge invisível

Verificar:

- source existe;
- target existe;
- handles existem;
- sourceHandle/targetHandle correspondem;
- nodes já foram medidos;
- CSS de edge não está transparente;
- z-index/overflow;
- custom edge retorna path válido.

---

# 101. Handles não conectam

Verificar:

- `type`;
- `isConnectable`;
- `nodesConnectable`;
- `connectionMode`;
- IDs;
- `isValidConnection`;
- elemento por cima bloqueando pointer;
- handle oculto com `display: none`.

Para ocultar handle preservando medição, prefira `visibility: hidden` ou `opacity: 0` conforme o caso, não `display: none`.

---

# 102. Node pula de posição

Investigar:

- controlled vs uncontrolled misturado;
- atualização de state sobrescrevendo position;
- auto-layout rodando repetidamente;
- parentId alterado;
- nodeOrigin;
- snap grid;
- React key incorreta;
- restore de estado concorrente.

---

# 103. Infinite rerender

Verificar:

```tsx
<ReactFlow
  onNodesChange={(changes) => ...}
/>
```

ou objetos criados inline continuamente, especialmente quando combinados com store/effects.

Estabilize callbacks.

---

# 104. Grande quantidade de nodes

Estratégia:

```text
1. medir
2. profiler
3. memoizar nodes
4. reduzir subscriptions
5. simplificar conteúdo
6. considerar onlyRenderVisibleElements
7. reduzir operações durante drag
8. mover cálculos para eventos finais
```

Não otimizar cegamente.

---

# 105. Mouse/touch

Teste:

- desktop mouse;
- trackpad;
- touchscreen;
- zoom por pinch;
- pan;
- selection;
- context menu alternativo.

Não assumir que hover existe em touch.

---

# 106. Mobile

React Flow pode funcionar em touch, mas editores densos exigem UX adaptada.

Considere:

- handles maiores;
- menos toolbar;
- zoom mínimo apropriado;
- botão explícito para conectar;
- painel modal em vez de sidebar fixa.

---

# 107. Mini-map e controles em Electron

Em Electron/desktop:

- React Flow funciona normalmente no renderer;
- persistência em arquivo deve passar por IPC seguro;
- node data não deve carregar APIs Node privilegiadas;
- renderer não deve receber `fs` irrestrito.

Separe:

```text
React Flow UI
     ↓
preload API
     ↓
IPC
     ↓
main process
```

---

# 108. Canvas em aplicações desktop

Para workflow local:

```text
flow.json
```

pode armazenar:

```json
{
  "schemaVersion": 1,
  "nodes": [],
  "edges": [],
  "viewport": {
    "x": 0,
    "y": 0,
    "zoom": 1
  }
}
```

Faça escrita atômica para evitar corrupção de arquivos.

---

# 109. Testes

Teste três níveis.

## Unit

- validação de conexão;
- graph utilities;
- migrations;
- commands.

## Component

- custom node;
- custom edge;
- inspector.

## E2E

- arrastar node;
- conectar handles;
- salvar;
- restaurar;
- delete;
- undo;
- zoom/pan.

---

# 110. JSDOM

Medição de elementos pode ser problemática em testes DOM simulados.

Quando a lógica depende de:

- ResizeObserver;
- dimensões reais;
- SVG;
- bounding boxes,

prefira E2E/browser quando necessário.

---

# 111. Component API index

O agente deve reconhecer rapidamente:

```text
<ReactFlow />
<ReactFlowProvider />

<Background />
<BaseEdge />
<ControlButton />
<Controls />
<EdgeLabelRenderer />
<EdgeText />
<EdgeToolbar />
<Handle />
<MiniMap />
<NodeResizeControl />
<NodeResizer />
<NodeToolbar />
<Panel />
<ViewportPortal />
```

---

# 112. Hooks API index

```text
useConnection()
useEdges()
useEdgesState()
useHandleConnections()
useInternalNode()
useKeyPress()
useNodeConnections()
useNodeId()
useNodes()
useNodesData()
useNodesInitialized()
useNodesState()
useOnSelectionChange()
useOnViewportChange()
useReactFlow()
useStore()
useStoreApi()
useUpdateNodeInternals()
useViewport()
```

---

# 113. Utility API index

```text
addEdge()
applyEdgeChanges()
applyNodeChanges()

getBezierPath()
getSimpleBezierPath()
getSmoothStepPath()
getStraightPath()

getConnectedEdges()
getIncomers()
getOutgoers()

getNodesBounds()
getViewportForBounds()

isEdge()
isNode()

reconnectEdge()
```

---

# 114. Types index

O agente deve conhecer e consultar quando necessário:

```text
Align
AriaLabelConfig
BackgroundVariant
ColorMode
Connection
ConnectionLineComponent
ConnectionLineComponentProps
ConnectionLineType
ConnectionMode
ConnectionState
CoordinateExtent
DefaultEdgeOptions
DeleteElements
Edge
EdgeChange
EdgeMarker
EdgeMouseHandler
EdgeProps
EdgeTypes
FitViewOptions
Handle
HandleConnection
InternalNode
IsValidConnection
KeyCode
MarkerType
MiniMapNodeProps
Node
NodeChange
NodeConnection
NodeHandle
NodeMouseHandler
NodeOrigin
NodeProps
NodeTypes
OnBeforeDelete
OnConnect
OnConnectEnd
OnConnectStart
OnDelete
OnEdgesChange
OnEdgesDelete
OnError
OnInit
OnMove
OnNodeDrag
OnNodesChange
OnNodesDelete
OnReconnect
OnSelectionChangeFunc
PanOnScrollMode
PanelPosition
Position
ProOptions
ReactFlowInstance
ReactFlowJsonObject
Rect
ResizeParams
SelectionDragHandler
SelectionMode
SnapGrid
Viewport
XYPosition
ZIndexMode
```

Não é necessário memorizar cada propriedade de cada type; a função da skill é saber **quando usar** e consultar assinatura exata quando necessário.

---

# 115. Props importantes de `<ReactFlow />`

## Dados

```text
nodes
edges
defaultNodes
defaultEdges
nodeTypes
edgeTypes
defaultEdgeOptions
```

## Viewport

```text
defaultViewport
viewport
onViewportChange
fitView
fitViewOptions
minZoom
maxZoom
translateExtent
nodeExtent
snapToGrid
snapGrid
onlyRenderVisibleElements
preventScrolling
```

## Conexão

```text
onConnect
onConnectStart
onConnectEnd
isValidConnection
connectionMode
connectionLineType
connectionLineStyle
connectionLineComponent
connectionRadius
connectionDragThreshold
```

## Interação

```text
nodesDraggable
nodesConnectable
nodesFocusable
edgesFocusable
edgesReconnectable
elementsSelectable

panOnDrag
panOnScroll
zoomOnScroll
zoomOnPinch
zoomOnDoubleClick

selectionOnDrag
selectionMode
```

## Eventos

```text
onNodeClick
onNodeDoubleClick
onNodeContextMenu
onNodeDragStart
onNodeDrag
onNodeDragStop

onEdgeClick
onEdgeDoubleClick
onEdgeContextMenu

onNodesChange
onEdgesChange

onNodesDelete
onEdgesDelete
onDelete
onBeforeDelete

onMoveStart
onMove
onMoveEnd

onPaneClick
onPaneContextMenu

onSelectionChange
```

Verificar documentação/tipos da versão instalada antes de usar props menos comuns.

---

# 116. Arquitetura para AI Workflow Editor

Para um editor de workflows de IA:

```text
TriggerNode
   ↓
PromptNode
   ↓
LLMNode
   ↓
ParserNode
   ↓
ConditionNode
  ↙     ↘
True   False
```

Node `data`:

```ts
type LLMNodeData = {
  provider: string;
  model: string;
  systemPrompt: string;
  temperature: number;
};
```

Ports:

```text
input.text
input.context
output.text
output.usage
```

Validação deve ser orientada por tipo.

---

# 117. Fluxo de execução separado do canvas

Crie:

```text
Editor Graph
   ↓ compile
Execution Graph
   ↓ validate
Runtime
```

Não execute diretamente componentes React como lógica do workflow.

O canvas é editor/representação.

Runtime deve ser independente.

---

# 118. Compile step

Exemplo:

```ts
function compileWorkflow(
  nodes: AppNode[],
  edges: AppEdge[],
): ExecutableWorkflow
```

Pode:

- remover propriedades visuais;
- validar portas;
- resolver dependências;
- construir adjacency list;
- ordenar;
- gerar erros de compilação.

---

# 119. Versionamento de workflows

```ts
{
  schemaVersion: 3,
  appVersion: '1.8.0',
  nodes,
  edges,
}
```

Migrations:

```ts
migrateV1ToV2()
migrateV2ToV3()
```

Nunca assumir que arquivos antigos sempre terão schema atual.

---

# 120. Undo/redo + persistência

Não persistir backend em cada pixel de drag.

Melhor:

```text
onNodeDrag
  → UI somente

onNodeDragStop
  → commit history
  → mark dirty
  → autosave debounce
```

---

# 121. Autosave

Fluxo:

```text
graph changed
   ↓
mark dirty
   ↓
debounce 500–1500ms
   ↓
serialize
   ↓
persist
```

Em desktop, também salvar ao fechar quando seguro.

---

# 122. Collaborative editing

React Flow pode participar de colaboração multiplayer, mas a biblioteca não resolve sozinha:

- CRDT;
- awareness;
- conflict resolution;
- presence;
- backend realtime.

Integre Yjs/Liveblocks/engine similar conforme requisitos.

Nunca sincronizar indiscriminadamente o array inteiro a cada pixel se a solução colaborativa exigir operações incrementais.

---

# 123. Checklist antes de implementar feature

O agente deve responder internamente:

1. Isso é estado do React Flow ou do domínio?
2. Controlled ou uncontrolled?
3. Preciso de hook reativo ou API imperativa?
4. Existe API pública para isso?
5. A feature afeta performance durante drag?
6. Precisa persistir?
7. Precisa entrar no undo/redo?
8. Precisa funcionar em touch?
9. Precisa considerar grupos?
10. Precisa validar grafo?
11. Precisa converter coordenadas?
12. Precisa recalcular internals?
13. Precisa de layout?
14. Precisa de TypeScript generics?

---

# 124. Processo obrigatório do agente para novas tarefas

## Etapa 1 — identificar contexto

Verificar:

- versão instalada;
- React;
- TypeScript;
- Vite/Next/Electron;
- store;
- node types existentes;
- edge types existentes.

---

## Etapa 2 — localizar arquitetura

Encontrar:

```text
ReactFlow component
nodes state
edges state
nodeTypes
edgeTypes
provider
store
```

---

## Etapa 3 — entender domínio

Não modificar topologia sem entender:

- tipos de nodes;
- portas;
- conexão;
- persistência;
- execução.

---

## Etapa 4 — escolher API mínima

Preferência:

```text
API pública específica
      ↓
ReactFlowInstance
      ↓
hook público
      ↓
store interna (último recurso)
```

`useStore` não deve ser default.

---

## Etapa 5 — implementar

Garantir:

- tipagem;
- callbacks estáveis;
- objetos estáveis;
- atualizações imutáveis;
- IDs consistentes.

---

## Etapa 6 — validar

Testar:

- drag;
- connect;
- delete;
- pan;
- zoom;
- selection;
- save/restore;
- edge cases.

---

# 125. Política de alteração em projeto existente

Nunca reescrever o editor inteiro só porque uma implementação ideal diferente existe.

Primeiro:

1. entender código atual;
2. identificar bug/requisito;
3. fazer menor mudança segura;
4. preservar API local;
5. refatorar somente se trouxer benefício mensurável.

---

# 126. Anti-patterns

Evitar:

```tsx
nodeTypes={{ custom: CustomNode }}
```

inline.

Evitar:

```tsx
edgeTypes={{ custom: CustomEdge }}
```

inline.

Evitar:

```tsx
const nodes = useNodes();
```

em dezenas de custom nodes sem necessidade.

Evitar:

```ts
setNodes(nodes);
```

depois de mutação direta.

Evitar funções em `node.data`.

Evitar usar posição x/y para inferir dependência de execução.

Evitar controlar viewport sem motivo.

Evitar acessar store interna se `useReactFlow()` resolve.

Evitar chamar auto-layout em todo `onNodesChange`.

Evitar persistir em todo `onNodeDrag`.

Evitar recriar todo grafo para alterar label.

---

# 127. Padrão recomendado de atualização de data

Helper:

```ts
function updateNodeData<T>(
  nodes: Node<T>[],
  id: string,
  patch: Partial<T>,
): Node<T>[] {
  return nodes.map((node) =>
    node.id === id
      ? {
          ...node,
          data: {
            ...node.data,
            ...patch,
          },
        }
      : node,
  );
}
```

Se a versão atual oferecer `updateNodeData`, pode ser preferível.

---

# 128. Padrão recomendado para criação de edge

```tsx
const onConnect: OnConnect =
  useCallback(
    (connection) => {
      if (!validateConnection(connection)) {
        return;
      }

      setEdges((edges) =>
        addEdge(
          {
            ...connection,
            type: 'workflow',
          },
          edges,
        ),
      );
    },
    [setEdges],
  );
```

---

# 129. Padrão recomendado para delete

Use callbacks/APIs específicas da biblioteca quando possível.

Ao deletar:

- atualizar domínio;
- limpar seleção;
- atualizar history;
- limpar configs dependentes;
- persistir.

---

# 130. Padrão recomendado de custom node

```tsx
import { memo } from 'react';

import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from '@xyflow/react';

type ActionData = {
  title: string;
};

type ActionNode =
  Node<ActionData, 'action'>;

export const ActionNodeComponent =
  memo(function ActionNodeComponent({
    data,
    selected,
  }: NodeProps<ActionNode>) {
    return (
      <div
        className={[
          'action-node',
          selected ? 'is-selected' : '',
        ].join(' ')}
      >
        <Handle
          id="input"
          type="target"
          position={Position.Left}
        />

        <div>{data.title}</div>

        <Handle
          id="output"
          type="source"
          position={Position.Right}
        />
      </div>
    );
  });
```

---

# 131. Padrão recomendado do canvas

```tsx
const nodeTypes = {
  action: ActionNodeComponent,
} satisfies NodeTypes;

const edgeTypes = {
  workflow: WorkflowEdge,
} satisfies EdgeTypes;

export function FlowCanvas() {
  const nodes = useFlowStore(
    (state) => state.nodes,
  );

  const edges = useFlowStore(
    (state) => state.edges,
  );

  const onNodesChange = useFlowStore(
    (state) => state.onNodesChange,
  );

  const onEdgesChange = useFlowStore(
    (state) => state.onEdgesChange,
  );

  const onConnect = useFlowStore(
    (state) => state.onConnect,
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}
```

---

# 132. Quando usar `useNodes()`

Use quando:

- componente externo precisa reagir a qualquer mudança de nodes;
- painel de estatísticas;
- debug;
- visão global pequena.

Não usar quando precisa só de:

```text
node X.data.status
```

Nesse caso prefira `useNodesData` ou store seletiva.

---

# 133. Quando usar `useReactFlow()`

Use para ações pontuais:

```text
clicou botão → fitView()
clicou node → setCenter()
drop → screenToFlowPosition()
salvar → toObject()
```

Não use para substituir todas as subscriptions.

---

# 134. Quando usar `useViewport()`

Use quando UI depende continuamente do zoom/pan.

Exemplo:

- nível de detalhes;
- display de zoom;
- overlay.

Se só precisa ler viewport no clique de um botão, prefira `useReactFlow().getViewport()`.

---

# 135. Quando usar `useStore()`

Somente quando:

- API pública não cobre o caso;
- existe ganho específico;
- selector é estreito;
- acoplamento interno é aceitável.

Documente o motivo.

---

# 136. LOD — level of detail baseado em zoom

Para graph editors grandes:

```tsx
const { zoom } = useViewport();

if (zoom < 0.4) {
  return <CompactNode />;
}
```

Use com cautela porque cada mudança de zoom pode rerenderizar muitos nodes.

Uma store/estratégia de thresholds pode reduzir churn.

---

# 137. Resizing e layout

Após resize:

- atualizar dimensões se o domínio precisa persistir;
- gerar history apenas ao final;
- recalcular layout somente se requerido;
- evitar loop resize → layout → resize.

---

# 138. Grupos redimensionáveis

Ao criar groups:

- definir política de bounds;
- decidir se group autoexpande;
- decidir se child pode sair;
- converter posição ao mover child entre parents.

Esse comportamento pertence à aplicação.

---

# 139. Edge routing

React Flow fornece paths built-in, mas não um roteador universal anti-colisão.

Se edges precisam evitar nodes:

- ELK;
- algoritmo customizado;
- edge routing específico.

Não prometer roteamento ortogonal perfeito apenas com `smoothstep`.

---

# 140. Edge animation

`animated: true` pode indicar fluxo.

Não abuse em centenas/milhares de edges.

Animação SVG pode ser cara.

Use estados semânticos:

```ts
data: {
  status: 'running'
}
```

e animar apenas edges ativas.

---

# 141. Z-index

Ao lidar com groups/edges/toolbars:

- entender stacking context;
- selected nodes podem ser elevados;
- edges podem ser elevadas com configuração;
- HTML overlays possuem contexto diferente de SVG.

Não resolver tudo com `z-index: 999999`.

---

# 142. Fit após carregar

Ao restaurar viewport salvo, não usar automaticamente `fitView`, pois isso sobrescreve experiência salva.

Escolher um:

```text
restore viewport
OU
fitView
```

conforme intenção.

---

# 143. Fit após layout

Após auto-layout:

```ts
setNodes(layoutedNodes);

requestAnimationFrame(() => {
  reactFlow.fitView({
    padding: 0.2,
  });
});
```

Em casos complexos espere nodes inicializarem/medirem.

---

# 144. Node dimensions

Não derive dimensões de CSS hardcoded se nodes podem variar.

Use medições internas disponibilizadas pela biblioteca quando necessário.

Para SSR, fornecer dimensões explícitas pode ser necessário.

---

# 145. Dirty state

Mantenha:

```ts
isDirty
lastSavedAt
```

se houver editor com persistência.

Mudanças puramente de seleção talvez não devam marcar documento como alterado.

Decida quais mudanças são persistentes:

```text
position      yes
node data     yes
edges         yes
viewport      maybe
selection     normally no
hover         no
dragging      no
```

---

# 146. Histórico semântico

Não salve:

```text
selected: true
dragging: true
```

como mudança de documento quando não fizer sentido.

Normalize snapshots antes de comparar/historicizar.

---

# 147. Normalize before save

Remova estados efêmeros.

Conceito:

```ts
function serializeNode(node: AppNode) {
  const {
    selected,
    dragging,
    ...persistent
  } = node;

  return persistent;
}
```

Faça apenas para campos que realmente não fazem parte do formato salvo.

---

# 148. Backend

Não exponha diretamente o JSON de React Flow como API eterna do domínio.

Melhor:

```text
FlowDocument DTO
```

com versão.

Isso protege a aplicação de mudanças futuras da biblioteca.

---

# 149. Integração com banco

Tabela possível:

```text
workflows
  id
  name
  schema_version
  graph_json
  created_at
  updated_at
```

Para consultas profundas por node, normalize dados específicos em tabelas separadas.

---

# 150. Observabilidade

Em aplicações complexas registre eventos semânticos:

```text
node_created
node_deleted
edge_created
edge_deleted
layout_applied
flow_saved
flow_loaded
validation_failed
```

Não telemetrar cada pixel de drag.

---

# 151. Regras para respostas do agente

Quando o usuário pedir implementação:

1. adaptar à stack atual;
2. preferir TypeScript;
3. indicar arquivos;
4. não sugerir APIs inexistentes;
5. fornecer código compilável;
6. não remover recursos existentes;
7. explicar mudanças arquiteturais relevantes;
8. mencionar dependências novas;
9. incluir tratamento de edge cases;
10. considerar performance.

---

# 152. Quando consultar documentação online novamente

A skill deve instruir o agente a confirmar documentação atual quando:

- usuário pedir "API mais recente";
- ocorrer erro de TypeScript em assinatura;
- prop/hook parecer deprecated;
- projeto usar versão diferente;
- feature foi adicionada recentemente;
- houver divergência entre skill e tipos instalados.

A versão instalada no projeto sempre tem prioridade prática sobre exemplos genéricos da skill.

---

# 153. Estratégia de verificação de versão

Verificar:

```bash
npm list @xyflow/react
```

ou:

```json
"@xyflow/react": "^..."
```

no `package.json`.

Se necessário consultar:

```bash
node -p "require('@xyflow/react/package.json').version"
```

quando o ambiente permitir.

---

# 154. Não misturar versões

Se código contém:

```ts
import ReactFlow from 'reactflow';
```

não trocar imports parcialmente.

Planeje migração completa.

Evite estado híbrido de APIs antigas e novas.

---

# 155. Feature decision matrix

| Requisito | API recomendada |
|---|---|
| adicionar conexão | `addEdge()` + `onConnect` |
| reagir a drag de node | `onNodeDrag*` |
| salvar estado | controlled state / `toObject()` |
| centralizar node | `useReactFlow()` |
| converter drop | `screenToFlowPosition()` |
| acompanhar zoom | `useViewport()` |
| consultar zoom pontualmente | `getViewport()` |
| node customizado | `nodeTypes` + `NodeProps` |
| edge customizada | `edgeTypes` + `BaseEdge` |
| múltiplas portas | múltiplos `<Handle id>` |
| handles dinâmicos | `useUpdateNodeInternals()` |
| toolbar do node | `<NodeToolbar />` |
| resize | `<NodeResizer />` |
| minimap | `<MiniMap />` |
| background | `<Background />` |
| controles | `<Controls />` |
| painel overlay | `<Panel />` |
| impedir ciclo | `isValidConnection` + graph traversal |
| incomers | `getIncomers()` |
| outgoers | `getOutgoers()` |
| edges conectadas | `getConnectedEdges()` |
| estado pequeno | `useNodesState/useEdgesState` |
| estado complexo | Zustand/store dedicada |
| acesso interno avançado | `useStore/useStoreApi` com cautela |

---

# 156. Checklist de qualidade final

Antes de considerar uma implementação pronta:

- [ ] package correto: `@xyflow/react`
- [ ] CSS importado
- [ ] container possui tamanho
- [ ] nodes tipados
- [ ] edges tipadas
- [ ] IDs únicos
- [ ] nodeTypes estável
- [ ] edgeTypes estável
- [ ] handlers estáveis
- [ ] estado atualizado imutavelmente
- [ ] handles possuem IDs quando múltiplos
- [ ] conexões são validadas
- [ ] drag/drop converte coordenadas
- [ ] forms usam `nodrag`
- [ ] scroll interno usa `nowheel` se necessário
- [ ] provider existe para hooks externos
- [ ] layout não roda em loop
- [ ] persistência possui schema version
- [ ] undo não salva cada pixel
- [ ] performance foi considerada
- [ ] fluxo foi testado com zoom/pan
- [ ] save/restore foi testado
- [ ] versão da API foi confirmada se necessário

---

# 157. Resumo operacional

Pense em React Flow assim:

```text
ReactFlow
│
├── data
│   ├── nodes
│   └── edges
│
├── rendering
│   ├── nodeTypes
│   └── edgeTypes
│
├── connectivity
│   ├── Handle
│   ├── Connection
│   ├── onConnect
│   └── isValidConnection
│
├── interaction
│   ├── selection
│   ├── drag
│   ├── keyboard
│   └── reconnect
│
├── viewport
│   ├── pan
│   ├── zoom
│   ├── fitView
│   └── coordinates
│
├── state
│   ├── useNodesState
│   ├── useEdgesState
│   ├── Zustand
│   └── ReactFlowInstance
│
└── advanced
    ├── layout
    ├── groups
    ├── persistence
    ├── undo/redo
    ├── SSR
    ├── performance
    └── collaboration
```

A prioridade do agente deve ser:

```text
correção
  ↓
API pública
  ↓
tipagem
  ↓
arquitetura simples
  ↓
UX
  ↓
performance medida
```

Não utilizar hacks internos quando uma API pública resolver o problema.

---

# 158. Referências oficiais

Documentação principal:

https://reactflow.dev/learn

API:

https://reactflow.dev/api-reference

Pacote:

```text
@xyflow/react
```

Ao encontrar divergências, use a seguinte precedência:

```text
1. tipos da versão instalada no projeto
2. documentação oficial da mesma versão
3. documentação oficial atual
4. esta skill
```

Esta skill é um guia operacional abrangente, não um substituto para verificar assinaturas que possam ter mudado entre versões.
