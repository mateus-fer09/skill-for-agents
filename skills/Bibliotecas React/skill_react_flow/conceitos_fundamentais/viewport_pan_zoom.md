---
title: "Viewport, Pan e Zoom no React Flow"
description: "Guia completo de controle de câmera e navegação: propriedades de viewport, pan, zoom, fitView, useViewport, useOnViewportChange e useReactFlow."
topics: ["viewport", "pan", "zoom", "fitView", "screenToFlowPosition", "useReactFlow", "useViewport", "useOnViewportChange"]
keywords: ["panOnDrag", "zoomOnScroll", "defaultViewport", "fitViewOptions", "screenToFlowPosition", "flowToScreenPosition", "zoomIn", "zoomOut", "setCenter"]
source_scope: "React Flow Docs: Learn > Concepts > Panning and Zooming, API Reference > ReactFlow (Viewport Props), Hooks (useViewport, useReactFlow)"
---

# Viewport, Pan e Zoom no React Flow

O React Flow gerencia uma câmera virtual infinita bidimensional descrita pelo objeto **Viewport**: `{ x: number, y: number, zoom: number }`. Compreender e manipular a viewport é a chave para criar experiências de navegação fluidas, estilo Figma, Miro ou Canva.

---

## 1. Propriedades de Configuração da Viewport no `<ReactFlow />`

| Propriedade | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `defaultViewport` | `Viewport` | `{ x: 0, y: 0, zoom: 1 }` | Posição e zoom iniciais caso `fitView` não esteja ativo. |
| `minZoom` | `number` | `0.5` | Nível mínimo de afastamento permitido (ex: `0.1` para 10%). |
| `maxZoom` | `number` | `2` | Nível máximo de aproximação permitido (ex: `4` para 400%). |
| `fitView` | `boolean` | `false` | Se `true`, calcula automaticamente a viewport para enquadrar todos os nós. |
| `fitViewOptions` | `FitViewOptions` | `{ padding: 0.1 }` | Opções de enquadramento (`padding`, `duration`, `includeHiddenNodes`, `minZoom`, `maxZoom`). |
| `panOnDrag` | `boolean \| number[]` | `true` | Habilita arrastar o canvas clicando no fundo (pode passar array com botões do mouse permitidos, ex: `[0, 1, 2]`). |
| `panOnScroll` | `boolean` | `false` | Se `true`, girar a roda do mouse realiza pan (rolagem) em vez de zoom. |
| `panOnScrollMode` | `PanOnScrollMode` | `'free'` | Direção do pan no scroll: `'free'`, `'vertical'`, `'horizontal'`. |
| `panOnScrollSpeed`| `number` | `0.5` | Multiplicador de velocidade de pan via scroll do mouse. |
| `zoomOnScroll` | `boolean` | `true` | Se `true`, a roda do mouse altera o zoom. |
| `zoomOnPinch` | `boolean` | `true` | Se `true`, gestos de pinça no trackpad ou telas de toque alteram o zoom. |
| `zoomOnDoubleClick`| `boolean` | `true` | Se `true`, duplo clique no fundo aproxima o zoom. |
| `preventScrolling`| `boolean` | `true` | Impede a rolagem padrão da página web ao usar o scroll dentro do canvas. |

---

## 2. Perfis de Navegação: Padrão vs Ferramentas de Design (Figma/Miro)

Você pode configurar o React Flow para se comportar exatamente como ferramentas de design profissionais:

```jsx
// 🎨 Perfil Ferramenta de Design (Estilo Figma)
<ReactFlow
  panOnScroll={true}
  selectionOnDrag={true}
  panOnDrag={[1, 2]} // Pan apenas com botão do meio (roda) ou botão direito
  zoomOnPinch={true}
/>
```

---

## 3. Hooks de Leitura da Viewport

### 3.1. `useViewport()`
Retorna reativamente o estado atual da câmera `{ x, y, zoom }`:

```tsx
import { useViewport } from '@xyflow/react';

function ViewportIndicator() {
  const { x, y, zoom } = useViewport();

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full font-mono">
      X: {Math.round(x)} | Y: {Math.round(y)} | Zoom: {(zoom * 100).toFixed(0)}%
    </div>
  );
}
```

### 3.2. `useOnViewportChange()`
Registra listeners para os eventos de transição da viewport:

```tsx
import { useOnViewportChange, type Viewport } from '@xyflow/react';

function ViewportWatcher() {
  useOnViewportChange({
    onStart: (viewport: Viewport) => console.log('Iniciou navegação:', viewport),
    onChange: (viewport: Viewport) => console.log('Navegando:', viewport),
    onEnd: (viewport: Viewport) => console.log('Parou navegação:', viewport),
  });

  return null;
}
```

---

## 4. Métodos Imperativos de Câmera via `useReactFlow()`

O hook `useReactFlow()` expõe funções para controle programático da câmera:

| Método | Assinatura | Descrição |
| :--- | :--- | :--- |
| `setViewport` | `(viewport: Viewport, options?: { duration: number }) => void` | Define `x`, `y` e `zoom` com animação opcional. |
| `getViewport` | `() => Viewport` | Retorna o snapshot atual da viewport. |
| `fitView` | `(options?: FitViewOptions) => Promise<boolean>` | Enquadra os nós com duração de transição suave. |
| `fitBounds` | `(bounds: Rect, options?: { padding: number, duration: number }) => void` | Foca uma área retangular específica. |
| `zoomIn` | `(options?: { duration: number }) => void` | Aumenta o zoom em um incremento. |
| `zoomOut` | `(options?: { duration: number }) => void` | Diminui o zoom em um incremento. |
| `zoomTo` | `(zoomLevel: number, options?: { duration: number }) => void` | Define o nível absoluto de zoom. |
| `setCenter` | `(x: number, y: number, options?: { zoom: number, duration: number }) => void` | Centraliza a câmera nas coordenadas especificadas. |

---

## 5. Conversão de Coordenadas Tela-Canvas (`screenToFlowPosition`)

Ao implementar **Drag-and-Drop** de nós a partir de uma barra lateral externa para o canvas, você obtém as coordenadas em pixels de tela do mouse (`event.clientX`, `event.clientY`).

O método `screenToFlowPosition` calcula as coordenadas exatas no plano do grafo:

```tsx
import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

function DropCanvas({ onAddNode }) {
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow-type');
      if (!type) return;

      // Conversão vital de tela para o plano cartesiano do grafo
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: { label: `Novo Nó (${type})` },
      };

      onAddNode(newNode);
    },
    [screenToFlowPosition, onAddNode]
  );

  return (
    <div onDragOver={onDragOver} onDrop={onDrop} style={{ width: '100%', height: '100%' }}>
      {/* ReactFlow */}
    </div>
  );
}
```

---

## 6. Exemplo Completo com Painel de Controle de Câmera

```tsx
import React from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Panel,
  useReactFlow,
  useViewport,
  type Node,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Origem (0, 0)' } },
  { id: '2', position: { x: 300, y: 200 }, data: { label: 'Ponto Médio (300, 200)' } },
  { id: '3', position: { x: 600, y: 400 }, data: { label: 'Destino (600, 400)' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

function CameraToolbar() {
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();
  const { x, y, zoom } = useViewport();

  return (
    <Panel position="top-right" className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col gap-2">
      <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
        Viewport: X={Math.round(x)} Y={Math.round(y)} ({(zoom * 100).toFixed(0)}%)
      </div>
      <div className="flex gap-2">
        <button
          className="px-2.5 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded font-medium"
          onClick={() => zoomIn({ duration: 300 })}
        >
          Zoom +
        </button>
        <button
          className="px-2.5 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded font-medium"
          onClick={() => zoomOut({ duration: 300 })}
        >
          Zoom -
        </button>
        <button
          className="px-2.5 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 rounded font-medium"
          onClick={() => fitView({ padding: 0.2, duration: 800 })}
        >
          Enquadrar (FitView)
        </button>
        <button
          className="px-2.5 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded font-medium"
          onClick={() => setCenter(300, 200, { zoom: 1.5, duration: 800 })}
        >
          Focar no Meio
        </button>
      </div>
    </Panel>
  );
}

export default function ViewportDemo() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          defaultNodes={initialNodes}
          defaultEdges={initialEdges}
          minZoom={0.2}
          maxZoom={4}
          fitView
        >
          <Background gap={20} size={1} />
          <Controls />
          <CameraToolbar />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
```
