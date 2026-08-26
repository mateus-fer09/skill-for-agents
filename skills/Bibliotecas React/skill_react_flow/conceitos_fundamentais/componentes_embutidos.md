---
title: "Componentes Embutidos do React Flow"
description: "Guia completo de todos os componentes visuais utilitários embutidos: Background, Controls, MiniMap, Panel, NodeResizer, NodeToolbar, EdgeToolbar e ViewportPortal."
topics: ["componentes-embutidos", "Background", "Controls", "MiniMap", "Panel", "NodeResizer", "NodeToolbar", "EdgeToolbar", "ViewportPortal"]
keywords: ["BackgroundVariant", "ControlButton", "nodeColor", "MiniMapNodeProps", "NodeResizer", "NodeResizeControl", "NodeToolbar", "EdgeToolbar", "ViewportPortal"]
source_scope: "React Flow Docs: Learn > Concepts > Built-In Components, API Reference > Components"
---

# Componentes Embutidos do React Flow

O `@xyflow/react` inclui uma suíte completa de componentes utilitários prontos para uso, projetados para serem inseridos diretamente como filhos (`children`) de `<ReactFlow />`.

---

## 1. `<Background />` (Plano de Fundo)

Renderiza padrões gráficos repetidos no fundo do canvas, que escalam e se movem em sincronia com o pan e zoom.

### Propriedades do `<Background />`
| Propriedade | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `variant` | `BackgroundVariant` | `BackgroundVariant.Dots` | Padrão visual: `'dots'`, `'lines'`, `'cross'`. |
| `gap` | `number \| [number, number]` | `20` | Espaçamento entre os pontos ou linhas em pixels. |
| `size` | `number` | `1` | Raio dos pontos (`dots`) ou tamanho das cruzes (`cross`). |
| `lineWidth` | `number` | `1` | Espessura das linhas (`lines`) ou traços das cruzes. |
| `color` | `string` | `undefined` | Cor do padrão (usa CSS variable por padrão). |
| `bgColor` | `string` | `undefined` | Cor de fundo sólido do canvas. |

### Sobreposição de Múltiplos Backgrounds
Você pode combinar múltiplos backgrounds para criar grids complexos com linhas principais e secundárias:

```jsx
<ReactFlow defaultNodes={nodes} defaultEdges={edges}>
  {/* Grid Menor com Pontos Finos */}
  <Background id="bg-dots" variant={BackgroundVariant.Dots} gap={15} size={1} color="#cbd5e1" />
  {/* Grid Maior com Linhas Espaçadas */}
  <Background id="bg-lines" variant={BackgroundVariant.Lines} gap={75} lineWidth={0.5} color="#94a3b8" />
</ReactFlow>
```

---

## 2. `<Controls />` e `<ControlButton />` (Controles de Câmera)

Renderiza botões de zoom in, zoom out, fit view e trava de interatividade.

### Propriedades do `<Controls />`
| Propriedade | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `showZoom` | `boolean` | `true` | Exibe botões de `+` e `-`. |
| `showFitView` | `boolean` | `true` | Exibe botão de enquadramento. |
| `showInteractive` | `boolean` | `true` | Exibe botão de travar/destravar arraste. |
| `position` | `PanelPosition` | `'bottom-left'` | Posição na tela (`top-left`, `top-right`, `bottom-left`, `bottom-right`). |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Orientação dos botões. |

### Adicionando Botões Customizados com `<ControlButton />`
```tsx
import { Controls, ControlButton } from '@xyflow/react';

<Controls>
  <ControlButton onClick={() => alert('Ação personalizada!')} title="Ação Customizada">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  </ControlButton>
</Controls>
```

---

## 3. `<MiniMap />` (Mapa de Navegação)

Exibe uma visão geral minificada de todo o grafo, permitindo navegação rápida e visualização de nós distantes.

### Propriedades do `<MiniMap />`
| Propriedade | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `nodeColor` | `string \| (node: Node) => string` | `undefined` | Cor de preenchimento dos nós no minimapa. |
| `nodeStrokeColor`| `string \| (node: Node) => string`| `undefined` | Cor da borda dos nós no minimapa. |
| `nodeBorderRadius`| `number` | `5` | Arredondamento dos nós no minimapa. |
| `nodeStrokeWidth`| `number` | `2` | Espessura da borda dos nós no minimapa. |
| `maskColor` | `string` | `rgba(240, 240, 240, 0.6)` | Cor da máscara que cobre a área fora da visão atual. |
| `maskStrokeColor`| `string` | `undefined` | Cor da borda do retângulo da viewport ativa. |
| `position` | `PanelPosition` | `'bottom-right'` | Posição no canvas. |
| `pannable` | `boolean` | `false` | Se `true`, permite arrastar a viewport clicando no minimapa. |
| `zoomable` | `boolean` | `false` | Se `true`, permite dar zoom usando a roda do mouse sobre o minimapa. |

---

## 4. `<Panel />` (Containers Flutuantes de UI)

O componente `<Panel />` posiciona elementos de interface (títulos, formulários, botões de ação) nos cantos ou laterais do canvas sem serem afetados pelo zoom ou pan do grafo.

### Posições Suportadas:
- `'top-left'`, `'top-center'`, `'top-right'`
- `'bottom-left'`, `'bottom-center'`, `'bottom-right'`

```tsx
import { Panel } from '@xyflow/react';

<Panel position="top-left" className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur p-3 rounded-lg border shadow">
  <h2 className="text-sm font-bold">Editor de Automação</h2>
  <p className="text-xs text-zinc-500">Arraste nós para conectar etapas</p>
</Panel>
```

---

## 5. `<NodeResizer />` e `<NodeResizeControl />` (Redimensionamento)

Permitem que o usuário redimensione nós interativamente arrastando as bordas ou cantos do nó.

### Exemplo em um Custom Node: `ResizableNode.tsx`
```tsx
import React, { memo } from 'react';
import { Handle, Position, NodeResizer, type NodeProps } from '@xyflow/react';

function ResizableNode({ data, selected }: NodeProps) {
  return (
    <div className="h-full w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg p-4 shadow-sm relative">
      <NodeResizer
        minWidth={120}
        minHeight={80}
        isVisible={selected}
        lineClassName="!border-blue-500"
        handleClassName="!w-2.5 !h-2.5 !bg-blue-500 !border-white"
      />
      <Handle type="target" position={Position.Top} />
      <div className="text-xs font-semibold">{data.label as string}</div>
      <div className="text-[10px] text-zinc-400 mt-1">Redimensione quando selecionado</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(ResizableNode);
```

---

## 6. `<NodeToolbar />` e `<EdgeToolbar />` (Menus Flutuantes)

Renderizam barras contextuais de botões ancoradas a um nó ou a uma aresta quando selecionados.

### Exemplo em um Custom Node: `ToolbarNode.tsx`
```tsx
import React, { memo } from 'react';
import { Handle, Position, NodeToolbar, type NodeProps } from '@xyflow/react';

function ToolbarNode({ data, selected }: NodeProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 shadow-md">
      <NodeToolbar isVisible={selected} position={Position.Top} align="center" offset={8}>
        <div className="flex gap-1 bg-zinc-900 text-white p-1 rounded-md shadow-lg text-xs">
          <button className="px-2 py-0.5 hover:bg-zinc-700 rounded" onClick={() => alert('Duplicar')}>
            📋 Duplicar
          </button>
          <button className="px-2 py-0.5 hover:bg-rose-600 rounded text-rose-300" onClick={() => alert('Deletar')}>
            🗑️ Excluir
          </button>
        </div>
      </NodeToolbar>

      <Handle type="target" position={Position.Top} />
      <div className="text-xs font-medium">{data.label as string}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(ToolbarNode);
```

---

## 7. `<ViewportPortal />`

Renderiza componentes React arbitrários que residem **dentro** da camada de coordenadas do viewport, mas fora da árvore de nós e arestas (ex: réguas de medição customizadas, sombras globais ou overlays vetoriais).

```tsx
import { ViewportPortal } from '@xyflow/react';

<ReactFlow defaultNodes={nodes} defaultEdges={edges}>
  <ViewportPortal>
    <div style={{ position: 'absolute', transform: 'translate(100px, 100px)' }}>
      Elemento ancorado no plano cartesiano do grafo!
    </div>
  </ViewportPortal>
</ReactFlow>
```

---

## 8. Exemplo Completo com Todos os Componentes Embutidos

```tsx
import React from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  ControlButton,
  MiniMap,
  Panel,
  type Node,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', type: 'input', position: { x: 250, y: 50 }, data: { label: 'Entrada' } },
  { id: '2', position: { x: 100, y: 180 }, data: { label: 'Processamento' } },
  { id: '3', type: 'output', position: { x: 250, y: 300 }, data: { label: 'Saída' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

const getNodeColor = (node: Node) => {
  switch (node.type) {
    case 'input':
      return '#10b981';
    case 'output':
      return '#ef4444';
    default:
      return '#3b82f6';
  }
};

export default function CompleteBuiltInDemo() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls orientation="vertical" position="bottom-left">
          <ControlButton onClick={() => alert('Backup salvo!')} title="Salvar">
            💾
          </ControlButton>
        </Controls>
        <MiniMap
          nodeColor={getNodeColor}
          nodeStrokeWidth={2}
          pannable
          zoomable
          position="bottom-right"
        />
        <Panel position="top-left" className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-md">
          <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Pipeline de Dados</h1>
          <span className="text-[11px] text-zinc-500">Status: Operacional</span>
        </Panel>
      </ReactFlow>
    </div>
  );
}
```
