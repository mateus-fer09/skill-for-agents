---
title: "Whiteboard e Recursos de Desenho no React Flow"
description: "Como integrar funcionalidades de quadro branco (whiteboard), anota??es ? m?o livre (freehand drawing), sticky notes (post-its), formas geom?tricas e redimensionamento din?mico com NodeResizer no React Flow v12."
topics:
  - "Transformando o Canvas em Whiteboard"
  - "Sticky Notes (Post-its Customizados)"
  - "N?s de Formas Geom?tricas (Shape Nodes)"
  - "Redimensionamento com NodeResizer e NodeResizeControl"
  - "Sele??o Lasso e Desenho Livre (Freehand SVG / Canvas Overlay)"
keywords:
  - "whiteboard"
  - "freehand drawing"
  - "sticky notes"
  - "shapes"
  - "NodeResizer"
  - "NodeResizeControl"
  - "lasso selection"
  - "@xyflow/react"
source_scope: "Learn / Advanced Use / Whiteboard Features"
---

# Whiteboard e Recursos de Desenho no React Flow

Embora o React Flow seja especializado em diagramas baseados em n?s e arestas, sua arquitetura flex?vel permite transform?-lo em uma ferramenta completa de **Whiteboard (Quadro Branco)** combinando n?s de post-it, formas geom?tricas redimension?veis e camadas de anota??o ? m?o livre.

---

## 1. Implementa??o de Post-it (`StickyNoteNode`)

Um n? de nota adesiva com redimensionamento din?mico via `<NodeResizer />` e edi??o inline de texto.

```tsx
import React, { memo, useState, useCallback } from 'react';
import { NodeProps, NodeResizer, useReactFlow } from '@xyflow/react';

function StickyNoteComponent({ id, data, selected }: NodeProps) {
  const { updateNodeData } = useReactFlow();
  const [text, setText] = useState(data.text || 'Escreva sua anota??o aqui...');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    updateNodeData(id, { text: e.target.value });
  }, [id, updateNodeData]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: data.color || '#fef08a',
        padding: 12,
        borderRadius: 4,
        boxShadow: selected ? '0 6px 18px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        border: selected ? '2px solid #eab308' : '1px solid #facc15'
      }}
    >
      <NodeResizer minWidth={120} minHeight={100} isVisible={selected} />
      <textarea
        value={text}
        onChange={handleChange}
        className="nodrag"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          background: 'transparent',
          resize: 'none',
          outline: 'none',
          fontFamily: 'Comic Sans MS, cursive, sans-serif',
          fontSize: 14,
          color: '#713f12'
        }}
      />
    </div>
  );
}

export const StickyNoteNode = memo(StickyNoteComponent);
```

---

## 2. N?s de Formas Geom?tricas com `<NodeResizer />`

N?s de formas permitem desenhar ret?ngulos, c?rculos e caixas de agrupamento de arquitetura.

```tsx
import React, { memo } from 'react';
import { NodeProps, NodeResizer, Handle, Position } from '@xyflow/react';

function ShapeNodeComponent({ id, data, selected }: NodeProps) {
  const shapeType = data.shape || 'rectangle'; // 'rectangle' | 'circle'

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: data.bg || 'rgba(59, 130, 246, 0.1)',
        border: `2px dashed ${data.borderColor || '#3b82f6'}`,
        borderRadius: shapeType === 'circle' ? '50%' : 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <NodeResizer minWidth={80} minHeight={80} isVisible={selected} lineStyle={{ borderColor: '#3b82f6' }} />
      <Handle type="target" position={Position.Top} />
      <span style={{ fontSize: 12, fontWeight: 600, color: '#1e3a8a' }}>{data.label}</span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export const ShapeNode = memo(ShapeNodeComponent);
```

---

## 3. Camada de Desenho Livre (Freehand SVG Overlay)

Para permitir desenhar ? m?o livre sobre o canvas (anota??es e rabiscos), podemos usar uma sobreposi??o de SVG renderizada dentro da `<ViewportPortal />`:

```tsx
import React, { useState, useCallback } from 'react';
import { ViewportPortal, useReactFlow } from '@xyflow/react';

type Stroke = {
  points: { x: number; y: number }[];
  color: string;
};

export function FreehandDrawingLayer({ isDrawingMode }: { isDrawingMode: boolean }) {
  const { screenToFlowPosition } = useReactFlow();
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isDrawingMode) return;
    const pt = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setCurrentStroke({ points: [pt], color: '#ef4444' });
  }, [isDrawingMode, screenToFlowPosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawingMode || !currentStroke) return;
    const pt = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setCurrentStroke((prev) => prev ? { ...prev, points: [...prev.points, pt] } : null);
  }, [isDrawingMode, currentStroke, screenToFlowPosition]);

  const handlePointerUp = useCallback(() => {
    if (currentStroke) {
      setStrokes((prev) => [...prev, currentStroke]);
      setCurrentStroke(null);
    }
  }, [currentStroke]);

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: isDrawingMode ? 'all' : 'none',
        zIndex: 5
      }}
    >
      <ViewportPortal>
        <svg style={{ position: 'absolute', overflow: 'visible', width: 1, height: 1 }}>
          {[...strokes, currentStroke].filter(Boolean).map((st, idx) => {
            const d = st!.points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
            return (
              <path
                key={idx}
                d={d}
                stroke={st!.color}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </svg>
      </ViewportPortal>
    </div>
  );
}
```
