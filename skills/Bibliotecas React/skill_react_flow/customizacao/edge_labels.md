---
title: "Edge Labels e EdgeLabelRenderer no React Flow"
description: "Renderização de rótulos interativos sobre arestas: EdgeLabelRenderer, EdgeText, posicionamento transform translate e habilitando cliques com pointer-events."
topics: ["edge-labels", "EdgeLabelRenderer", "EdgeText", "interactive-edges", "html-over-svg"]
keywords: ["EdgeLabelRenderer", "EdgeText", "labelX", "labelY", "pointer-events", "nopan", "nodrag"]
source_scope: "React Flow Docs: Learn > Customization > Edge Labels, API Reference > Components (EdgeLabelRenderer, EdgeText)"
---

# Edge Labels e EdgeLabelRenderer no React Flow

O React Flow permite renderizar rótulos em arestas de duas formas:
1. **Labels SVG Nativos (`EdgeText`)**: Adequados para textos estáticos simples dentro do container SVG.
2. **Labels HTML Ricos (`<EdgeLabelRenderer />`)**: Um portal que renderiza elementos HTML padrão (botões, badges, inputs, dropdowns) sobre a aresta com total interatividade.

---

## 1. Por que Usar o `<EdgeLabelRenderer />`?

As arestas são elementos `<svg>`, o que torna difícil renderizar botões HTML, tooltips complexos ou formulários dentro delas devido às limitações do padrão SVG.

O `<EdgeLabelRenderer />` projeta o conteúdo do label para uma camada de HTML que fica exatamente acima do canvas SVG, mantendo o posicionamento perfeito em sincronia com o pan e zoom.

```
+=================================================================+
|  CAMADA DE UI HTML (EdgeLabelRenderer: botões, badges, inputs)  |
+-----------------------------------------------------------------+
|  CAMADA SVG (BaseEdge: linhas, curvas, gradientes, marcadores)   |
+=================================================================+
```

---

## 2. A Fórmula de Posicionamento Matemático

Para posicionar o label no ponto central exato calculado pela função de caminho (`getBezierPath`, `getSmoothStepPath` ou `getStraightPath`), aplique o seguinte estilo inline:

```jsx
<div
  style={{
    position: 'absolute',
    transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
    pointerEvents: 'all',
  }}
  className="nodrag nopan"
>
  {/* Conteúdo HTML do Label */}
</div>
```

### Regras Vitais:
1. **`transform: translate(-50%, -50%) translate(${labelX}px,${labelY}px)`**: Centraliza o label exatamente nas coordenadas `(labelX, labelY)`.
2. **`pointerEvents: 'all'`**: Como o container do `EdgeLabelRenderer` possui `pointer-events: none` por padrão, você DEVE adicionar `pointer-events: all` ao seu elemento para permitir cliques e seleções.
3. **`className="nodrag nopan"`**: Impede que o clique ou arraste no label mova o canvas ou nós adjacentes.

---

## 3. Exemplos Práticos Completos

### Exemplo 1: `BadgeStatusEdge.tsx` (Aresta com Indicador de Latência e Status)
```tsx
import React, { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';

export default function BadgeStatusEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [ativo, setAtivo] = useState(true);

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: ativo ? '#10b981' : '#94a3b8',
          strokeWidth: 2,
          strokeDasharray: ativo ? undefined : '5 5',
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-full shadow-md text-[11px] font-medium"
        >
          <span
            className={`w-2 h-2 rounded-full ${ativo ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}
          />
          <span className="text-zinc-600 dark:text-zinc-300">
            {ativo ? (data?.latency as string || '24ms') : 'Pausado'}
          </span>
          <button
            type="button"
            onClick={() => setAtivo(!ativo)}
            className="ml-1 text-[10px] text-blue-600 hover:text-blue-700 font-bold"
          >
            {ativo ? '⏸' : '▶'}
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```

### Exemplo 2: `EditableLabelEdge.tsx` (Rótulo de Texto com Input Inline)
```tsx
import React, { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';

export default function EditableLabelEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [label, setLabel] = useState((data?.label as string) || 'Clique para editar');

  const onBlur = () => {
    // Persiste a alteração no array de arestas do React Flow
    setEdges((edges) =>
      edges.map((e) => (e.id === id ? { ...e, data: { ...e.data, label } } : e))
    );
  };

  return (
    <>
      <BaseEdge path={edgePath} style={{ stroke: '#6366f1', strokeWidth: 2 }} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={onBlur}
            className="px-2 py-0.5 text-xs bg-white dark:bg-zinc-800 border border-indigo-400 rounded shadow-sm text-center outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            style={{ width: `${Math.max(label.length * 8 + 20, 80)}px` }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```
