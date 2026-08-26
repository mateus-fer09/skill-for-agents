---
title: "Custom Edges: Criando Arestas Personalizadas no React Flow"
description: "Guia completo de criação de Custom Edges: BaseEdge, cálculo de caminhos SVG (getBezierPath, getSmoothStepPath, getStraightPath), arestas animadas, botões de ação e edgeTypes."
topics: ["custom-edges", "edgeTypes", "BaseEdge", "getBezierPath", "getSmoothStepPath", "animated-edges"]
keywords: ["edgeTypes", "BaseEdge", "getBezierPath", "getSmoothStepPath", "getStraightPath", "EdgeProps", "custom edge", "connectionLineComponent"]
source_scope: "React Flow Docs: Learn > Customization > Custom Edges, Examples > Animated SVG Edge, API Reference > Components (BaseEdge)"
---

# Custom Edges: Criando Arestas Personalizadas no React Flow

As arestas no React Flow são caminhos vetoriais SVG que conectam dois nós. Criando **Custom Edges**, você pode desenhar curvas matemáticas personalizadas, animar gradientes de cores, renderizar fluxos de dados em tempo real e adicionar botões interativos.

---

## 1. O Componente `<BaseEdge />` e Funções de Caminho SVG

O React Flow exporta o componente `<BaseEdge />`, que renderiza o elemento `<path>` SVG otimizado, e um conjunto de funções utilitárias que calculam a string do atributo `d` do SVG:

| Função Utilitária | Tipo de Curva Gerada | Parâmetros de Entrada |
| :--- | :--- | :--- |
| `getBezierPath` | Curva de Bézier cúbica suave | `{ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, curvature }` |
| `getSimpleBezierPath` | Bézier simplificada rápida | `{ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition }` |
| `getSmoothStepPath` | Linha ortogonal com cantos arredondados | `{ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius, offset }` |
| `getStraightPath` | Linha reta direta entre os dois pontos | `{ sourceX, sourceY, targetX, targetY }` |

Cada uma dessas funções retorna uma tupla com:
`[edgePath: string, labelX: number, labelY: number, offsetX: number, offsetY: number]`

---

## 2. Anatomia e Props de uma Custom Edge

Uma custom edge recebe as seguintes propriedades via `EdgeProps`:

| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `string` | ID único da aresta. |
| `sourceX`, `sourceY` | `number` | Coordenadas da porta de origem. |
| `targetX`, `targetY` | `number` | Coordenadas da porta de destino. |
| `sourcePosition` | `Position` | Posição da porta de origem (`Top`, `Right`, `Bottom`, `Left`). |
| `targetPosition` | `Position` | Posição da porta de destino (`Top`, `Right`, `Bottom`, `Left`). |
| `style` | `React.CSSProperties` | Estilos SVG passados na definição da aresta. |
| `markerStart`, `markerEnd` | `string` | URLs dos marcadores SVG de início e fim. |
| `data` | `T` (genérico) | Objeto arbitrário com dados customizados. |
| `selected` | `boolean` | `true` quando a aresta está selecionada. |

---

## 3. Registro Obrigatório via `edgeTypes`

Assim como em `nodeTypes`, o objeto `edgeTypes` **DEVE** ser declarado fora do componente ou com `useMemo` para evitar re-montagens infinitas:

```tsx
import ButtonEdge from './ButtonEdge';
import AnimatedGradientEdge from './AnimatedGradientEdge';

const edgeTypes = {
  buttonEdge: ButtonEdge,
  gradient: AnimatedGradientEdge,
};

function Flow() {
  return <ReactFlow edgeTypes={edgeTypes} ... />;
}
```

---

## 4. Exemplos Práticos Completos

### Exemplo 1: `ButtonEdge.tsx` (Aresta com Botão de Excluir)
```tsx
import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
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

  const onEdgeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            type="button"
            onClick={onEdgeClick}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md hover:bg-rose-600 transition-transform hover:scale-110"
            title="Excluir Aresta"
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```

### Exemplo 2: `AnimatedGradientEdge.tsx` (Gradiente Vetorial Animado)
```tsx
import React from 'react';
import {
  BaseEdge,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';

export default function AnimatedGradientEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const gradientId = `grad-${id}`;

  return (
    <>
      <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
        <defs>
          <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
            <stop offset="0%" stopColor="#3b82f6">
              <animate attributeName="stop-color" values="#3b82f6;#8b5cf6;#ec4899;#3b82f6" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#ec4899">
              <animate attributeName="stop-color" values="#ec4899;#3b82f6;#8b5cf6;#ec4899" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
      </svg>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: `url(#${gradientId})`,
          strokeWidth: 3,
        }}
      />
    </>
  );
}
```

### Exemplo 3: `DataFlowEdge.tsx` (Partículas Animadas de Dados com SVG)
```tsx
import React from 'react';
import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';

export default function DataFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Linha de fundo da aresta */}
      <BaseEdge
        path={edgePath}
        style={{ stroke: '#334155', strokeWidth: 2, strokeDasharray: '4 4' }}
      />
      
      {/* Partícula SVG animada viajando pelo caminho */}
      <circle r="4" fill="#38bdf8">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
      <circle r="4" fill="#818cf8">
        <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}
```

---

## 5. Customizando a Linha de Conexão (`connectionLineComponent`)

Enquanto o usuário está criando uma nova aresta com o mouse, você pode substituir a linha pontilhada padrão pelo seu próprio componente:

```tsx
import React from 'react';
import { type ConnectionLineComponentProps, getStraightPath } from '@xyflow/react';

export function CustomConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
}: ConnectionLineComponentProps) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path
        style={{ ...connectionLineStyle, stroke: '#6366f1', strokeWidth: 2 }}
        fill="none"
        d={edgePath}
      />
      <circle cx={toX} cy={toY} fill="#6366f1" r={5} stroke="#ffffff" strokeWidth={1.5} />
    </g>
  );
}
```
