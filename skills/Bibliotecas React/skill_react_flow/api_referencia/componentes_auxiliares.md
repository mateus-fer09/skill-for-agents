---
title: "Componentes Auxiliares - React Flow API Reference"
description: "Guia completo dos componentes auxiliares do React Flow: Controls, ControlButton, MiniMap, NodeToolbar, EdgeToolbar, EdgeLabelRenderer, EdgeText, Panel, ViewportPortal, NodeResizer e NodeResizeControl."
topics:
  - "Controls e ControlButton"
  - "MiniMap"
  - "NodeToolbar e EdgeToolbar"
  - "EdgeLabelRenderer e EdgeText"
  - "Panel"
  - "ViewportPortal"
  - "NodeResizer e NodeResizeControl"
keywords:
  - "Controls"
  - "ControlButton"
  - "MiniMap"
  - "NodeToolbar"
  - "EdgeToolbar"
  - "EdgeLabelRenderer"
  - "EdgeText"
  - "Panel"
  - "ViewportPortal"
  - "NodeResizer"
  - "NodeResizeControl"
source_scope: "api-reference/components/*"
---

# Componentes Auxiliares do React Flow

Os componentes auxiliares estendem as capacidades visuais e interativas do React Flow, permitindo adicionar barras de ferramentas em nós e arestas, mapas de navegação em miniatura, overlays flutuantes, renderizadores de labels HTML/React e redimensionamento dinâmico de nós.

---

## 1. `<Controls />` e `<ControlButton />`

O componente `<Controls />` renderiza um painel com botões de atalho para zoom in, zoom out, enquadramento (*fit view*) e bloqueio de interatividade. É possível adicionar botões customizados utilizando o componente `<ControlButton />`.

```tsx
import { ReactFlow, Controls, ControlButton } from '@xyflow/react';
import { Sparkles, Download } from 'lucide-react';

export default function FlowWithControls() {
  return (
    <ReactFlow nodes={[]} edges={[]}>
      <Controls
        position="bottom-left"
        showZoom={true}
        showFitView={true}
        showInteractive={true}
        fitViewOptions={{ padding: 0.2, duration: 400 }}
      >
        <ControlButton
          onClick={() => alert('Ação customizada executada!')}
          title="Executar Mágica"
          aria-label="Executar Mágica"
        >
          <Sparkles size={16} />
        </ControlButton>
        <ControlButton
          onClick={() => console.log('Download do grafo...')}
          title="Exportar Imagem"
        >
          <Download size={16} />
        </ControlButton>
      </Controls>
    </ReactFlow>
  );
}
```

### 1.1 Tabela de Propriedades do `<Controls />`

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `position` | `PanelPosition` | `'bottom-left'` | Posição no canvas: `'top-left'`, `'top-center'`, `'top-right'`, `'bottom-left'`, `'bottom-center'`, `'bottom-right'`. |
| `showZoom` | `boolean` | `true` | Exibe os botões de Zoom In (`+`) e Zoom Out (`-`). |
| `showFitView` | `boolean` | `true` | Exibe o botão de ajuste de visão global (*fit view*). |
| `showInteractive` | `boolean` | `true` | Exibe o botão para travar/destravar a interatividade do canvas (pan/zoom/drag). |
| `fitViewOptions` | `FitViewOptions` | `undefined` | Opções passadas ao disparar o botão de fit view (ex: `padding`, `duration`, `minZoom`). |
| `onZoomIn` | `() => void` | `undefined` | Callback customizado disparado ao clicar no botão Zoom In. |
| `onZoomOut` | `() => void` | `undefined` | Callback customizado disparado ao clicar no botão Zoom Out. |
| `onFitView` | `() => void` | `undefined` | Callback customizado disparado ao clicar no botão Fit View. |
| `onInteractiveChange` | `(interactiveState: boolean) => void` | `undefined` | Callback disparado ao alternar o bloqueio de interatividade. |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Orientação do painel de controles. |
| `className` | `string` | `undefined` | Classes CSS aplicadas ao contêiner de controles. |
| `style` | `CSSProperties` | `undefined` | Estilos inline do painel. |
| `children` | `ReactNode` | `undefined` | Botões customizados `<ControlButton />` adicionados ao final da barra. |

### 1.2 `<ControlButton />`
Aceita todas as propriedades padrão de um elemento HTML `<button>` (`onClick`, `title`, `disabled`, `className`, `style`, `aria-label`).

---

## 2. `<MiniMap />`

O `<MiniMap />` renderiza uma visualização em escala reduzida do fluxo, mostrando as posições relativas de todos os nós e a área visível da viewport atual.

```tsx
import { ReactFlow, MiniMap, type Node } from '@xyflow/react';

const nodeColor = (node: Node) => {
  switch (node.type) {
    case 'input':
      return '#3b82f6';
    case 'output':
      return '#10b981';
    case 'group':
      return '#e2e8f0';
    default:
      return '#f59e0b';
  }
};

export default function FlowWithMiniMap() {
  return (
    <ReactFlow nodes={[]} edges={[]}>
      <MiniMap
        position="bottom-right"
        nodeColor={nodeColor}
        nodeStrokeColor="#1e293b"
        nodeStrokeWidth={2}
        nodeBorderRadius={4}
        maskColor="rgba(240, 242, 245, 0.7)"
        maskStrokeColor="#3b82f6"
        maskStrokeWidth={1}
        pannable={true}
        zoomable={true}
        ariaLabel="Mapa de navegação do fluxo"
      />
    </ReactFlow>
  );
}
```

### 2.1 Tabela de Propriedades do `<MiniMap />`

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `position` | `PanelPosition` | `'bottom-right'` | Posição no canvas: `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`, etc. |
| `nodeColor` | `string \| ((node: Node) => string)` | `'#e2e2e2'` | Cor de preenchimento dos nós no minimap. Pode ser estática ou calculada por função. |
| `nodeStrokeColor` | `string \| ((node: Node) => string)` | `'transparent'` | Cor da borda dos nós no minimap. |
| `nodeStrokeWidth` | `number` | `2` | Espessura do contorno dos nós no minimap. |
| `nodeBorderRadius` | `number` | `5` | Raio das bordas dos nós no minimap. |
| `nodeClassName` | `string \| ((node: Node) => string)` | `''` | Classes CSS atribuídas aos retângulos dos nós no SVG do minimap. |
| `nodeComponent` | `ComponentType<MiniMapNodeProps>` | `undefined` | Componente SVG customizado para renderizar nós no minimap. |
| `maskColor` | `string` | `'rgb(240, 240, 240, 0.6)'` | Cor da máscara que cobre a área fora da viewport atual. |
| `maskStrokeColor` | `string` | `'none'` | Cor da borda da caixa que representa a viewport visível. |
| `maskStrokeWidth` | `number` | `1` | Espessura da borda da caixa da viewport. |
| `pannable` | `boolean` | `false` | Permite clicar e arrastar no minimap para mover a viewport do fluxo. |
| `zoomable` | `boolean` | `false` | Permite usar a roda do mouse sobre o minimap para ajustar o zoom do fluxo. |
| `ariaLabel` | `string` | `'Mini Map'` | Rótulo ARIA para leitores de tela e acessibilidade. |
| `width` | `number` | `200` | Largura em pixels do contêiner do minimap. |
| `height` | `number` | `150` | Altura em pixels do contêiner do minimap. |

---

## 3. `<NodeToolbar />` e `<EdgeToolbar />`

Esses componentes renderizam barras de ferramentas e tooltips contextuais posicionadas adjacentes a um nó ou aresta. Um ponto crucial é que o conteúdo dessas toolbars **não sofre redução de escala (*scale invariant*) quando o usuário afasta o zoom**, garantindo legibilidade constante.

```tsx
import { memo } from 'react';
import { Handle, Position, NodeToolbar, type NodeProps, Position as FlowPosition } from '@xyflow/react';
import { Trash2, Copy, Edit } from 'lucide-react';

export const CustomToolbarNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className="rounded-md border bg-white p-4 shadow">
      <NodeToolbar
        isVisible={selected}
        position={FlowPosition.Top}
        align="center"
        offset={8}
      >
        <div className="flex items-center gap-1 rounded bg-slate-900 p-1 text-white shadow-lg">
          <button className="rounded p-1 hover:bg-slate-700" title="Editar">
            <Edit size={14} />
          </button>
          <button className="rounded p-1 hover:bg-slate-700" title="Duplicar">
            <Copy size={14} />
          </button>
          <button className="rounded p-1 text-rose-400 hover:bg-slate-700" title="Deletar">
            <Trash2 size={14} />
          </button>
        </div>
      </NodeToolbar>

      <Handle type="target" position={Position.Left} />
      <div className="font-semibold">{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});
CustomToolbarNode.displayName = 'CustomToolbarNode';
```

### 3.1 Tabela de Propriedades do `<NodeToolbar />`

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `nodeId` | `string` | *Injetado via Contexto* | ID do nó ao qual a toolbar pertence (desnecessário se usada dentro do nó). |
| `isVisible` | `boolean` | `undefined` | Se omitido, a toolbar é exibida automaticamente apenas quando o nó está selecionado. |
| `position` | `Position` | `Position.Top` | Posição relativa ao nó: `Position.Top`, `Position.Bottom`, `Position.Left`, `Position.Right`. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alinhamento ao longo do eixo da posição escolhida. |
| `offset` | `number` | `10` | Distância em pixels entre a borda do nó e a toolbar. |

### 3.2 Tabela de Propriedades do `<EdgeToolbar />`

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `edgeId` | `string` | **Obrigatório** | ID da aresta correspondente. |
| `x` | `number` | **Obrigatório** | Coordenada X absoluta onde posicionar a toolbar (normalmente o `labelX` ou centro). |
| `y` | `number` | **Obrigatório** | Coordenada Y absoluta onde posicionar a toolbar (normalmente o `labelY` ou centro). |
| `isVisible` | `boolean` | `undefined` | Se omitido, visível apenas quando a aresta estiver selecionada. |
| `position` | `Position` | `Position.Top` | Posição relativa ao ponto `(x, y)` da aresta. |

---

## 4. `<EdgeLabelRenderer />` e `<EdgeText />`

Como arestas são nativamente elementos SVG, adicionar elementos interativos complexos (como botões, inputs, tooltips, tags HTML) dentro do SVG tradicional é problemático. O `<EdgeLabelRenderer />` resolve isso criando um **Portal React** diretamente sobre a camada de nós em um contêiner HTML `<div>`.

```tsx
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import { X } from 'lucide-react';

export function InteractiveEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex items-center gap-2 rounded-full border bg-white px-2 py-1 shadow"
        >
          <span className="text-xs font-medium text-slate-700">{data?.label ?? 'Aresta'}</span>
          <button
            onClick={() => alert(`Aresta ${id} clicada`)}
            className="rounded-full p-0.5 hover:bg-slate-100"
          >
            <X size={12} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```

> [!IMPORTANT]
> O `<EdgeLabelRenderer />` desabilita eventos de ponteiro por padrão (`pointer-events: none`). Para permitir cliques e interações nos seus elementos de label, defina explicitamente `pointer-events: all` e aplique as classes `nodrag` e `nopan`.

### 4.1 `<EdgeText />`
O `<EdgeText />` é o helper para renderização pura de texto SVG dentro de custom edges.

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `x` | `number` | **Obrigatório** | Coordenada X no SVG. |
| `y` | `number` | **Obrigatório** | Coordenada Y no SVG. |
| `label` | `ReactNode` | `undefined` | Texto a ser renderizado. |
| `labelStyle` | `CSSProperties` | `undefined` | Estilos SVG aplicados ao elemento `<text />` (ex: `fill: '#fff'`). |
| `labelShowBg` | `boolean` | `true` | Exibe retângulo de fundo atrás do texto para contraste. |
| `labelBgStyle` | `CSSProperties` | `undefined` | Estilos do retângulo de fundo `<rect />` (ex: `fill: '#000'`). |
| `labelBgPadding` | `[number, number]` | `[2, 4]` | Padding interno `[y, x]` do fundo. |
| `labelBgBorderRadius` | `number` | `2` | Raio das bordas do fundo. |

---

## 5. `<Panel />`

O `<Panel />` é um contêiner utilitário absoluto que posiciona elementos flutuantes sobre o fluxo (como menus superiores, dashboards, botões de ação rápida e filtros), mantendo-se imune às transformações de pan e zoom.

```tsx
import { ReactFlow, Panel } from '@xyflow/react';

export default function FlowWithPanels() {
  return (
    <ReactFlow nodes={[]} edges={[]}>
      <Panel position="top-left" className="m-4 flex gap-2 rounded bg-white p-2 shadow-md">
        <button className="px-3 py-1 font-semibold">Salvar</button>
        <button className="px-3 py-1 text-slate-600">Exportar</button>
      </Panel>
      <Panel position="top-right" className="m-4 text-xs font-mono text-slate-500">
        v2.4.0 • Produção
      </Panel>
    </ReactFlow>
  );
}
```

### 5.1 Tabela de Propriedades do `<Panel />`

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `position` | `PanelPosition` | `'top-left'` | Posição fixa no viewport: `'top-left'`, `'top-center'`, `'top-right'`, `'bottom-left'`, `'bottom-center'`, `'bottom-right'`, `'center-left'`, `'center-right'`. |
| `className` | `string` | `undefined` | Classes CSS aplicadas ao painel. |
| `style` | `CSSProperties` | `undefined` | Estilos inline. |
| `children` | `ReactNode` | `undefined` | Conteúdo React posicionado dentro do painel. |

---

## 6. `<ViewportPortal />`

O `<ViewportPortal />` renderiza elementos HTML que compartilham o **mesmo sistema de coordenadas dos nós e arestas**, sofrendo as transformações completas de zoom e pan da viewport. É ideal para renderizar anotações, seleções de grupo customizadas, cursores multiplayer e marcas d'água no espaço 2D do canvas.

```tsx
import { ViewportPortal } from '@xyflow/react';

export function MultiplayerCursor({ x, y, userName, color }: { x: number; y: number; userName: string; color: string }) {
  return (
    <ViewportPortal>
      <div
        style={{
          transform: `translate(${x}px, ${y}px)`,
          position: 'absolute',
          pointerEvents: 'none',
        }}
        className="flex items-center gap-1 transition-transform duration-75"
      >
        <div style={{ backgroundColor: color }} className="h-3 w-3 rounded-full" />
        <span style={{ backgroundColor: color }} className="rounded px-1.5 py-0.5 text-[10px] text-white">
          {userName}
        </span>
      </div>
    </ViewportPortal>
  );
}
```

---

## 7. `<NodeResizer />` e `<NodeResizeControl />`

O `<NodeResizer />` adiciona controles interativos nas bordas e vértices de nós customizados, permitindo que o usuário altere a largura e altura do nó livremente ou preservando proporções (*aspect ratio*).

```tsx
import { memo } from 'react';
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';

export const ResizableCardNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className="h-full w-full rounded border bg-white p-4 shadow">
      <NodeResizer
        isVisible={selected}
        minWidth={160}
        minHeight={100}
        maxWidth={600}
        maxHeight={400}
        keepAspectRatio={false}
        handleClassName="!h-2.5 !w-2.5 !border-blue-600 !bg-white"
        lineClassName="!border-blue-400"
      />
      <Handle type="target" position={Position.Top} />
      <h3 className="text-sm font-bold">{data.label}</h3>
      <p className="text-xs text-slate-500">{data.description}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});
ResizableCardNode.displayName = 'ResizableCardNode';
```

### 7.1 Tabela de Propriedades do `<NodeResizer />`

| Prop | Tipo | Default | Descrição |
| :--- | :--- | :--- | :--- |
| `nodeId` | `string` | *Injetado via Contexto* | ID do nó a ser redimensionado. |
| `isVisible` | `boolean` | `true` | Controla se os controles visuais estão ativos e visíveis. |
| `minWidth` | `number` | `10` | Largura mínima permitida em pixels. |
| `minHeight` | `number` | `10` | Altura mínima permitida em pixels. |
| `maxWidth` | `number` | `Number.MAX_VALUE` | Largura máxima permitida em pixels. |
| `maxHeight` | `number` | `Number.MAX_VALUE` | Altura máxima permitida em pixels. |
| `keepAspectRatio` | `boolean` | `false` | Força a preservação da proporção original durante o redimensionamento. |
| `shouldResize` | `(event: ResizeDragEvent, params: ResizeParams) => boolean` | `undefined` | Validador: se retornar `false`, cancela o evento de redimensionamento. |
| `onResizeStart` | `(event: ResizeDragEvent, params: ResizeParams) => void` | `undefined` | Callback acionado no início do redimensionamento. |
| `onResize` | `(event: ResizeDragEvent, params: ResizeParams) => void` | `undefined` | Callback acionado a cada mudança de dimensão. |
| `onResizeEnd` | `(event: ResizeDragEvent, params: ResizeParams) => void` | `undefined` | Callback acionado no término do redimensionamento. |
| `handleClassName` | `string` | `undefined` | Classes CSS aplicadas nos 8 puxadores (cantos e laterais). |
| `handleStyle` | `CSSProperties` | `undefined` | Estilos inline para os puxadores. |
| `lineClassName` | `string` | `undefined` | Classes CSS aplicadas nas 4 linhas limites. |
| `lineStyle` | `CSSProperties` | `undefined` | Estilos inline para as linhas limites. |

### 7.2 `<NodeResizeControl />`
Para criar uma alça de redimensionamento customizada (por exemplo, um ícone no canto inferior direito):

```tsx
import { NodeResizeControl, Position } from '@xyflow/react';
import { GripHorizontal } from 'lucide-react';

<NodeResizeControl position={Position.BottomRight} minWidth={100} minHeight={80}>
  <GripHorizontal className="h-4 w-4 text-slate-400" />
</NodeResizeControl>
```
