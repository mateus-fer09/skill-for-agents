---
title: "Componentes Core - React Flow API Reference"
description: "Documentação exaustiva dos componentes principais do React Flow: ReactFlow, ReactFlowProvider, Background, BaseEdge e Handle, com tabelas detalhadas de propriedades, tipagens e exemplos práticos."
topics:
  - "ReactFlow Component"
  - "ReactFlowProvider"
  - "Background"
  - "BaseEdge"
  - "Handle"
  - "Propriedades e Callbacks de Eventos"
keywords:
  - "ReactFlow"
  - "ReactFlowProvider"
  - "Background"
  - "BaseEdge"
  - "Handle"
  - "ReactFlowProps"
  - "ConnectionLine"
  - "Viewport"
source_scope: "api-reference/components/*"
---

# Componentes Core do React Flow

Os componentes Core constituem a espinha dorsal de qualquer aplicação construída com o React Flow. Eles encapsulam o canvas interativo, o provedor de contexto global, a renderização de arestas base, os pontos de conexão (handles) e o plano de fundo customizável.

---

## 1. `<ReactFlow />`

O componente `<ReactFlow />` é o elemento central da biblioteca. Ele renderiza os nós e arestas, gerencia a interação do usuário (arrastar, zoom, seleção, conexões) e pode operar tanto no modo controlado (*controlled*) quanto não controlado (*uncontrolled*).

```tsx
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function Flow() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

### 1.1 Tabela de Propriedades Comuns e Estado

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `nodes` | `Node[]` | `undefined` | Array de nós renderizados no fluxo (modo controlado). |
| `edges` | `Edge[]` | `undefined` | Array de arestas que conectam os nós (modo controlado). |
| `defaultNodes` | `Node[]` | `[]` | Nós iniciais no modo não controlado (*uncontrolled*). |
| `defaultEdges` | `Edge[]` | `[]` | Arestas iniciais no modo não controlado (*uncontrolled*). |
| `nodeTypes` | `NodeTypes` | `undefined` | Dicionário de componentes de nós customizados: `{ [key: string]: ComponentType<NodeProps> }`. |
| `edgeTypes` | `EdgeTypes` | `undefined` | Dicionário de componentes de arestas customizadas: `{ [key: string]: ComponentType<EdgeProps> }`. |
| `colorMode` | `'light' \| 'dark' \| 'system'` | `'light'` | Define o tema visual do canvas e componentes internos. |
| `proOptions` | `ProOptions` | `undefined` | Configurações de subscrição Pro (ex: ocultar atribuição com `{ hideAttribution: true }`). |

---

### 1.2 Tabela de Propriedades de Viewport e Renderização

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `defaultViewport` | `Viewport` | `{ x: 0, y: 0, zoom: 1 }` | Posição e zoom iniciais do canvas no primeiro render. |
| `viewport` | `Viewport` | `undefined` | Viewport controlado (requer `onViewportChange`). |
| `onViewportChange` | `(viewport: Viewport) => void` | `undefined` | Callback acionado durante movimentação controlada da viewport. |
| `minZoom` | `number` | `0.5` | Nível mínimo de zoom permitido. |
| `maxZoom` | `number` | `2` | Nível máximo de zoom permitido. |
| `fitView` | `boolean` | `false` | Se `true`, ajusta automaticamente a visão para enquadrar todos os nós na inicialização. |
| `fitViewOptions` | `FitViewOptions` | `undefined` | Configurações do fitView (ex: `padding`, `includeHiddenNodes`, `duration`). |
| `snapToGrid` | `boolean` | `false` | Se `true`, nós se alinham a uma grade magnética durante arrasto. |
| `snapGrid` | `[number, number]` | `[15, 15]` | Tamanho da grade em pixels `[x, y]` para snapping. |
| `onlyRenderVisibleElements` | `boolean` | `false` | Otimização de performance: renderiza apenas nós e arestas dentro da viewport visível. |
| `translateExtent` | `CoordinateExtent` | `[[-∞, -∞], [+∞, +∞]]` | Limites espaciais para movimentação da viewport `[[minX, minY], [maxX, maxY]]`. |
| `nodeExtent` | `CoordinateExtent` | `[[-∞, -∞], [+∞, +∞]]` | Limites espaciais onde os nós podem ser posicionados. |
| `preventScrolling` | `boolean` | `true` | Previne a rolagem padrão da página quando o cursor estiver sobre o fluxo. |
| `attributionPosition` | `PanelPosition` | `'bottom-right'` | Posição da tag de atribuição do React Flow. |

---

### 1.3 Tabela de Propriedades de Interação e Navegação

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `nodesDraggable` | `boolean` | `true` | Habilita ou desabilita o arrasto de todos os nós globalmente. |
| `nodesConnectable` | `boolean` | `true` | Habilita ou desabilita novas conexões a partir dos nós. |
| `nodesFocusable` | `boolean` | `true` | Permite que os nós recebam foco por clique ou teclado (acessibilidade). |
| `edgesFocusable` | `boolean` | `true` | Permite que as arestas recebam foco. |
| `elementsSelectable` | `boolean` | `true` | Permite que elementos sejam selecionados por clique ou caixa de seleção. |
| `panOnDrag` | `boolean \| number[]` | `true` | Permite arrastar o canvas clicando e movendo (ou array de botões do mouse, ex: `[0, 1]`). |
| `panOnScroll` | `boolean` | `false` | Transforma o scroll da roda do mouse em movimento de pan. |
| `panOnScrollSpeed` | `number` | `0.5` | Velocidade de pan ao utilizar a roda do mouse. |
| `panOnScrollMode` | `'free' \| 'vertical' \| 'horizontal'` | `'free'` | Direção permitida ao utilizar pan via scroll. |
| `zoomOnScroll` | `boolean` | `true` | Habilita zoom através da roda do mouse. |
| `zoomOnPinch` | `boolean` | `true` | Habilita zoom através do gesto pinch em trackpads/touchscreens. |
| `zoomOnDoubleClick` | `boolean` | `true` | Habilita zoom in ao dar duplo clique no canvas. |
| `selectionOnDrag` | `boolean` | `false` | Se `true`, arrastar no canvas cria um retângulo de seleção em vez de mover o canvas. |
| `selectionMode` | `'partial' \| 'full'` | `'full'` | `'partial'` seleciona nós que interceptam o retângulo; `'full'` requer inclusão total. |
| `selectNodesOnDrag` | `boolean` | `true` | Se `true`, nós arrastados tornam-se automaticamente selecionados. |
| `elevateNodesOnSelect` | `boolean` | `true` | Se `true`, nós selecionados ganham `z-index` superior automaticamente. |
| `elevateEdgesOnSelect` | `boolean` | `false` | Se `true`, arestas selecionadas sobem no eixo Z sobrepondo nós e outras arestas. |
| `autoPanOnConnect` | `boolean` | `true` | Move o canvas automaticamente quando a linha de conexão se aproxima das bordas. |
| `autoPanOnNodeDrag` | `boolean` | `true` | Move o canvas automaticamente ao arrastar nós para perto das bordas. |
| `autoPanSpeed` | `number` | `20` | Velocidade de auto-pan ao atingir os limites do canvas. |
| `connectionMode` | `'strict' \| 'loose'` | `'strict'` | `'strict'` conecta apenas source -> target; `'loose'` permite qualquer combinação. |
| `zIndexMode` | `'auto' \| 'basic' \| 'manual'` | `'auto'` | Modo de gerenciamento do zIndex para seleção e subflows. |

---

### 1.4 Tabela de Handlers de Eventos

> [!WARNING]
> Todos os event handlers devem ser declarados com `useCallback` ou fora do componente React para evitar loops infinitos de re-renderização.

| Categoria | Handler Prop | Assinatura | Descrição |
| :--- | :--- | :--- | :--- |
| **Geral** | `onInit` | `(instance: ReactFlowInstance) => void` | Chamado quando o fluxo é inicializado e o viewport medido. |
| | `onError` | `(id: string, message: string) => void` | Captura avisos e erros internos (ex: nós órfãos, tipos ausentes). |
| | `onDelete` | `(params: { nodes: Node[]; edges: Edge[] }) => void` | Acionado após exclusão de nós e arestas. |
| | `onBeforeDelete` | `(params: { nodes: Node[]; edges: Edge[] }) => Promise<boolean \| ...>` | Intercepta e pode cancelar exclusões assincronamente. |
| **Nós** | `onNodesChange` | `(changes: NodeChange[]) => void` | Notifica modificações estruturais, de dimensão, posição ou seleção nos nós. |
| | `onNodeClick` | `(event: React.MouseEvent, node: Node) => void` | Clique simples em um nó. |
| | `onNodeDoubleClick` | `(event: React.MouseEvent, node: Node) => void` | Duplo clique em um nó. |
| | `onNodeDragStart` | `(event: React.MouseEvent, node: Node) => void` | Início do arrasto de um nó. |
| | `onNodeDrag` | `(event: React.MouseEvent, node: Node) => void` | Durante o arrasto contínuo de um nó. |
| | `onNodeDragStop` | `(event: React.MouseEvent, node: Node) => void` | Fim do arrasto de um nó. |
| | `onNodeMouseEnter` | `(event: React.MouseEvent, node: Node) => void` | Ponteiro entra na área de um nó. |
| | `onNodeMouseLeave` | `(event: React.MouseEvent, node: Node) => void` | Ponteiro sai da área de um nó. |
| | `onNodeContextMenu` | `(event: React.MouseEvent, node: Node) => void` | Clique com o botão direito sobre um nó. |
| | `onNodesDelete` | `(nodes: Node[]) => void` | Acionado quando nós são deletados. |
| **Arestas** | `onEdgesChange` | `(changes: EdgeChange[]) => void` | Notifica adições, remoções ou seleções de arestas. |
| | `onEdgeClick` | `(event: React.MouseEvent, edge: Edge) => void` | Clique simples em uma aresta. |
| | `onEdgeDoubleClick` | `(event: React.MouseEvent, edge: Edge) => void` | Duplo clique em uma aresta. |
| | `onEdgeMouseEnter` | `(event: React.MouseEvent, edge: Edge) => void` | Ponteiro sobre a aresta. |
| | `onEdgeMouseLeave` | `(event: React.MouseEvent, edge: Edge) => void` | Ponteiro sai da aresta. |
| | `onEdgeContextMenu` | `(event: React.MouseEvent, edge: Edge) => void` | Clique direito em uma aresta. |
| | `onEdgesDelete` | `(edges: Edge[]) => void` | Acionado quando arestas são deletadas. |
| | `onReconnect` | `(oldEdge: Edge, newConnection: Connection) => void` | Acionado quando uma aresta é reconectada com sucesso. |
| | `onReconnectStart` | `(event: React.MouseEvent, edge: Edge, handleType: HandleType) => void` | Início do arrasto de reconexão de uma aresta. |
| | `onReconnectEnd` | `(event: MouseEvent \| TouchEvent, edge: Edge, handleType: HandleType) => void` | Término ou cancelamento da reconexão. |
| **Conexões** | `onConnect` | `(connection: Connection) => void` | Acionado ao soltar a linha de conexão sobre um handle válido. |
| | `onConnectStart` | `(event: MouseEvent \| TouchEvent, params: OnConnectStartParams) => void` | Início do desenho de uma nova conexão a partir de um handle. |
| | `onConnectEnd` | `(event: MouseEvent \| TouchEvent, state: FinalConnectionState) => void` | Fim do processo de conexão (sucesso ou abortado). |
| | `isValidConnection` | `(connection: Connection \| Edge) => boolean` | Validador customizado: se retornar `false`, a conexão é impedida. |
| **Pane (Fundo)** | `onPaneClick` | `(event: React.MouseEvent) => void` | Clique no fundo vazio do canvas. |
| | `onPaneContextMenu` | `(event: React.MouseEvent) => void` | Clique direito no fundo vazio. |
| | `onPaneScroll` | `(event?: React.WheelEvent) => void` | Scroll sobre a área vazia do canvas. |
| | `onMove` | `(event: MouseEvent \| TouchEvent \| null, viewport: Viewport) => void` | Chamado a cada frame durante pan/zoom da viewport. |
| | `onMoveStart` | `(event: MouseEvent \| TouchEvent \| null, viewport: Viewport) => void` | Início da transformação de viewport. |
| | `onMoveEnd` | `(event: MouseEvent \| TouchEvent \| null, viewport: Viewport) => void` | Término da transformação de viewport. |
| **Seleção** | `onSelectionChange` | `(params: { nodes: Node[]; edges: Edge[] }) => void` | Alteração nos elementos selecionados. |
| | `onSelectionDrag` | `(event: React.MouseEvent, nodes: Node[]) => void` | Arrasto conjunto de nós selecionados. |
| | `onSelectionContextMenu` | `(event: React.MouseEvent, nodes: Node[]) => void` | Clique direito no conjunto selecionado. |

---

### 1.5 Linhas de Conexão e Teclas de Atalho

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `connectionRadius` | `number` | `20` | Raio magnético em pixels para snap ao handle mais próximo. |
| `connectionLineType` | `ConnectionLineType` | `ConnectionLineType.Bezier` | Formato da linha temporária (`'default'`, `'straight'`, `'step'`, `'smoothstep'`, `'simplebezier'`). |
| `connectionLineStyle` | `CSSProperties` | `undefined` | Estilo CSS aplicado na `<path />` da linha temporária. |
| `connectionLineComponent` | `ConnectionLineComponent` | `undefined` | Componente React customizado para desenhar a linha de conexão. |
| `deleteKeyCode` | `KeyCode \| null` | `'Backspace'` | Tecla para deletar nós/arestas selecionados (`null` desabilita). |
| `selectionKeyCode` | `KeyCode \| null` | `'Shift'` | Tecla segurada para criar seleção retangular. |
| `multiSelectionKeyCode` | `KeyCode \| null` | `'Meta'` (Mac) / `'Ctrl'` | Tecla segurada para adicionar múltiplos itens à seleção por clique. |
| `noDragClassName` | `string` | `'nodrag'` | Classe CSS que desabilita o arrasto de nós ao interagir com inputs/botões internos. |
| `noPanClassName` | `string` | `'nopan'` | Classe CSS que desabilita o pan da viewport ao interagir com o elemento. |

---

## 2. `<ReactFlowProvider />`

O `<ReactFlowProvider />` encapsula a store Zustand interna do React Flow em um React Context. Ele permite que qualquer componente filho consuma hooks como `useReactFlow()`, `useNodes()`, `useEdges()` e `useStore()`, mesmo se estiver localizado fora do elemento `<ReactFlow />` (como sidebars, toolbars e headers externos).

```tsx
import { ReactFlow, ReactFlowProvider, useNodes, useReactFlow } from '@xyflow/react';

function CustomSidebar() {
  const nodes = useNodes();
  const { addNodes } = useReactFlow();

  return (
    <aside className="w-64 border-r p-4">
      <p>Nós ativos: {nodes.length}</p>
      <button
        onClick={() =>
          addNodes({
            id: `node-${Date.now()}`,
            position: { x: 100, y: 100 },
            data: { label: 'Novo Nó' },
          })
        }
      >
        Adicionar Nó
      </button>
    </aside>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen">
        <CustomSidebar />
        <ReactFlow nodes={initialNodes} edges={initialEdges} />
      </div>
    </ReactFlowProvider>
  );
}
```

### Regras de Ouro do ReactFlowProvider
1. **Múltiplos Fluxos:** Se sua página renderiza dois fluxos independentes, envolva cada um em seu próprio `<ReactFlowProvider />`.
2. **Roteamento SPA:** Se você precisa preservar o estado do fluxo entre transições de rotas, posicione o provider acima do roteador (`RouterProvider` / `BrowserRouter`).

---

## 3. `<Background />`

O componente `<Background />` renderiza padrões geométricos escaláveis no fundo do canvas. Suporta múltiplas instâncias sobrepostas para criar grades complexas.

```tsx
import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';

export default function Flow() {
  return (
    <ReactFlow defaultNodes={[]} defaultEdges={[]}>
      {/* Grade fina */}
      <Background
        id="bg-fine"
        gap={12}
        size={1}
        color="#e2e8f0"
        variant={BackgroundVariant.Dots}
      />
      {/* Grade mestra destacada */}
      <Background
        id="bg-coarse"
        gap={120}
        size={2}
        color="#cbd5e1"
        variant={BackgroundVariant.Lines}
      />
    </ReactFlow>
  );
}
```

### 3.1 Tabela de Propriedades do `<Background />`

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `undefined` | Identificador único (obrigatório quando houver mais de um `<Background />`). |
| `variant` | `BackgroundVariant \| 'dots' \| 'lines' \| 'cross'` | `BackgroundVariant.Dots` | Padrão visual desenhado no fundo. |
| `gap` | `number \| [number, number]` | `20` | Espaçamento entre repetições do padrão (número único ou `[gapX, gapY]`). |
| `size` | `number` | `1` | Raio dos pontos (`dots`), espessura das linhas (`lines`) ou tamanho da cruz (`cross`). |
| `lineWidth` | `number` | `1` | Espessura do traço quando o padrão for `lines` ou `cross`. |
| `color` | `string` | `#81818a` (light) / `#424242` (dark) | Cor do padrão em formato CSS (hex, rgb, hsl). |
| `bgColor` | `string` | `undefined` | Cor sólida de preenchimento de todo o fundo do canvas. |
| `className` | `string` | `undefined` | Classes CSS aplicadas ao contêiner SVG. |
| `style` | `CSSProperties` | `undefined` | Estilos inline aplicados ao elemento. |

---

## 4. `<BaseEdge />`

O `<BaseEdge />` é o bloco primitivo SVG utilizado internamente para renderizar caminhos de arestas. Ele gera tanto o caminho visível com markers quanto uma linha invisível espessa (*interaction path*) que facilita cliques e hovers do usuário.

```tsx
import React from 'react';
import {
  BaseEdge,
  getStraightPath,
  type EdgeProps,
} from '@xyflow/react';

export function CustomStraightEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerStart,
  markerEnd,
  style,
  interactionWidth,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={style}
      markerStart={markerStart}
      markerEnd={markerEnd}
      interactionWidth={interactionWidth ?? 20}
      labelX={labelX}
      labelY={labelY}
    />
  );
}
```

### 4.1 Tabela de Propriedades do `<BaseEdge />`

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `undefined` | Identificador único da aresta no DOM SVG. |
| `path` | `string` | `undefined` | String de comando SVG `d` gerada por utilitários de path (ex: `getBezierPath`). |
| `interactionWidth` | `number` | `20` | Espessura da área invisível em pixels para capturar eventos de mouse com facilidade. |
| `markerStart` | `string` | `undefined` | URL do marcador SVG inicial (`url(#marker-id)`). |
| `markerEnd` | `string` | `undefined` | URL do marcador SVG final (`url(#marker-id)`). |
| `style` | `CSSProperties` | `undefined` | Estilos aplicados diretamente à `<path />` visível (stroke, strokeWidth, dasharray). |
| `className` | `string` | `undefined` | Classes CSS adicionais. |

---

## 5. `<Handle />`

O componente `<Handle />` define pontos de conexão em nós customizados. Ele pode funcionar como origem (`source`) ou destino (`target`).

```tsx
import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';

export type CustomNodeData = {
  title: string;
};

export const CustomCardNode = memo(({ data, isConnectable }: NodeProps<Node<CustomNodeData>>) => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {/* Handle de entrada superior */}
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        isConnectable={isConnectable}
        className="!bg-blue-500"
      />

      <h4 className="font-medium text-slate-800">{data.title}</h4>

      {/* Múltiplos handles de saída com IDs únicos */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-success"
        style={{ left: '25%' }}
        className="!bg-emerald-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-fail"
        style={{ left: '75%' }}
        className="!bg-rose-500"
      />
    </div>
  );
});
CustomCardNode.displayName = 'CustomCardNode';
```

### 5.1 Tabela de Propriedades do `<Handle />`

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `type` | `'source' \| 'target'` | **Obrigatório** | Define se o ponto envia conexões (`source`) ou recebe conexões (`target`). |
| `position` | `Position` | **Obrigatório** | Posição física na borda do nó: `Position.Top`, `Position.Right`, `Position.Bottom`, `Position.Left`. |
| `id` | `string` | `undefined` | Identificador do handle. **Obrigatório quando o nó tiver mais de um handle do mesmo tipo.** |
| `isConnectable` | `boolean \| number` | `true` | Se `boolean`, habilita/desabilita conexões; se `number`, define o limite máximo de conexões simultâneas. |
| `isConnectableStart` | `boolean` | `true` | Permite iniciar novas conexões arrastando a partir deste handle. |
| `isConnectableEnd` | `boolean` | `true` | Permite finalizar conexões soltando sobre este handle. |
| `isValidConnection` | `(connection: Connection) => boolean` | `undefined` | Função validadora específica para este handle (sobrepõe o handler global). |
| `onConnect` | `(connection: Connection) => void` | `undefined` | Callback disparado assim que uma conexão for conectada a este handle. |
| `className` | `string` | `undefined` | Classes CSS aplicadas ao handle. |
| `style` | `CSSProperties` | `undefined` | Estilos inline para posicionamento fino (ex: `left: '30%'`). |
