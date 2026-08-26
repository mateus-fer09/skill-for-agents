---
title: "React Flow UI - Handles e Arestas Customizadas"
description: "Implementação completa em TypeScript dos componentes de conexão e arestas do React Flow UI: Base Handle, Labeled Handle, Button Handle, Animated SVG Edge, Button Edge e Data Edge."
topics:
  - "BaseHandle"
  - "LabeledHandle"
  - "ButtonHandle"
  - "AnimatedSvgEdge (<animateMotion />, Shapes)"
  - "ButtonEdge (EdgeLabelRenderer)"
  - "DataEdge (Tipagem com satisfies e useStore)"
keywords:
  - "BaseHandle"
  - "LabeledHandle"
  - "ButtonHandle"
  - "AnimatedSvgEdge"
  - "ButtonEdge"
  - "DataEdge"
  - "animateMotion"
source_scope: "ui/components/*"
---

# Handles e Arestas Customizadas (React Flow UI)

Esta seção reúne o código-fonte de produção e guias de uso dos componentes de pontos de conexão (*Handles*) e arestas avançadas (*Custom Edges*) do ecossistema React Flow UI.

---

## 1. Base Handle

Um componente de handle pré-estilizado com transições suaves e suporte automático ao tema dark/light do Tailwind CSS.

### 1.1 Código-Fonte Completo (`base-handle.tsx`)
```tsx
import type { ComponentProps } from "react";
import { Handle, type HandleProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

export type BaseHandleProps = HandleProps;

export function BaseHandle({
  className,
  children,
  ...props
}: ComponentProps<typeof Handle>) {
  return (
    <Handle
      {...props}
      className={cn(
        "h-[11px] w-[11px] rounded-full border border-slate-300 bg-slate-100 transition-colors duration-150",
        "dark:border-secondary dark:bg-secondary",
        "hover:ring-2 hover:ring-primary/50",
        className,
      )}
    >
      {children}
    </Handle>
  );
}
```

---

## 2. Labeled Handle

Associa um rótulo de texto explicativo adjacente ao handle, ajustando o alinhamento flexível automaticamente de acordo com a posição do handle (`top`, `bottom`, `left`, `right`).

### 2.1 Código-Fonte Completo (`labeled-handle.tsx`)
```tsx
import React, { type ComponentProps } from "react";
import { type HandleProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { BaseHandle } from "./base-handle";

const flexDirections = {
  top: "flex-col",
  right: "flex-row-reverse justify-end",
  bottom: "flex-col-reverse justify-end",
  left: "flex-row",
};

export function LabeledHandle({
  className,
  labelClassName,
  handleClassName,
  title,
  position,
  ...props
}: HandleProps &
  ComponentProps<"div"> & {
    title: string;
    handleClassName?: string;
    labelClassName?: string;
  }) {
  const { ref, ...handleProps } = props;

  return (
    <div
      title={title}
      className={cn(
        "relative flex items-center",
        flexDirections[position],
        className,
      )}
      ref={ref}
    >
      <BaseHandle
        position={position}
        className={handleClassName}
        {...handleProps}
      />
      <label className={cn("text-foreground px-3 text-xs font-medium", labelClassName)}>
        {title}
      </label>
    </div>
  );
}
```

---

## 3. Button Handle

Um handle enriquecido com um botão interativo acoplado por uma haste conectora. O botão pode se ocultar dinamicamente quando uma conexão estiver sendo arrastada no fluxo (via hook `useConnection`).

### 3.1 Código-Fonte Completo (`button-handle.tsx`)
```tsx
import { Position, type HandleProps } from "@xyflow/react";
import { BaseHandle } from "./base-handle";

const wrapperClassNames: Record<Position, string> = {
  [Position.Top]: "flex-col-reverse left-1/2 -translate-y-full -translate-x-1/2",
  [Position.Bottom]: "flex-col left-1/2 translate-y-[10px] -translate-x-1/2",
  [Position.Left]: "flex-row-reverse top-1/2 -translate-x-full -translate-y-1/2",
  [Position.Right]: "top-1/2 -translate-y-1/2 translate-x-[10px]",
};

export function ButtonHandle({
  showButton = true,
  position = Position.Bottom,
  children,
  ...props
}: HandleProps & { showButton?: boolean }) {
  const wrapperClassName = wrapperClassNames[position || Position.Bottom];
  const vertical = position === Position.Top || position === Position.Bottom;

  return (
    <BaseHandle position={position} id={props.id} {...props}>
      {showButton && (
        <div
          className={`absolute flex items-center ${wrapperClassName} pointer-events-none`}
        >
          <div
            className={`bg-border ${vertical ? "h-6 w-px" : "h-px w-6"}`}
          />
          <div className="nodrag nopan pointer-events-auto">{children}</div>
        </div>
      )}
    </BaseHandle>
  );
}
```

### 3.2 Exemplo de Uso
```tsx
import { Plus } from "lucide-react";
import { Position, useConnection } from "@xyflow/react";
import { ButtonHandle } from "./button-handle";
import { BaseNode, BaseNodeContent } from "./base-node";
import { Button } from "@/components/ui/button";

export const NodeWithAddButton = () => {
  const connectionInProgress = useConnection((s) => s.inProgress);

  return (
    <BaseNode>
      <BaseNodeContent>
        <span>Processador de Dados</span>
        <ButtonHandle
          type="source"
          position={Position.Bottom}
          showButton={!connectionInProgress}
        >
          <Button
            size="icon"
            variant="secondary"
            className="h-6 w-6 rounded-full shadow"
            onClick={() => alert("Criar próximo nó automaticamente")}
          >
            <Plus size={12} />
          </Button>
        </ButtonHandle>
      </BaseNodeContent>
    </BaseNode>
  );
};
```

---

## 4. Animated SVG Edge

Uma aresta avançada que anima elementos SVG ao longo de todo o traçado da conexão utilizando a tag nativa SVG `<animateMotion />`. Suporta diferentes formas (círculo, pacote, etc.), direções e durações.

### 4.1 Código-Fonte Completo (`animated-svg-edge.tsx`)
```tsx
import React from "react";
import type { Edge, EdgeProps, Position } from "@xyflow/react";
import {
  BaseEdge,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
} from "@xyflow/react";

export type AnimatedSvgEdge = Edge<{
  /** Duração em segundos para percorrer o traçado */
  duration: number;
  /** Direção do movimento */
  direction?: "forward" | "reverse" | "alternate" | "alternate-reverse";
  /** Algoritmo de pathfinding do React Flow */
  path?: "bezier" | "smoothstep" | "step" | "straight";
  /** Quantidade de repetições */
  repeat?: number | "indefinite";
  /** Identificador da forma SVG */
  shape: keyof typeof shapes;
}>;

export function AnimatedSvgEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = {
    duration: 2,
    direction: "forward",
    path: "bezier",
    repeat: "indefinite",
    shape: "circle",
  },
  ...delegated
}: EdgeProps<AnimatedSvgEdge>) {
  const Shape = shapes[data.shape ?? "circle"];

  const [path] = getPath({
    type: data.path ?? "bezier",
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const animateMotionProps = getAnimateMotionProps({
    duration: data.duration ?? 2,
    direction: data.direction ?? "forward",
    repeat: data.repeat ?? "indefinite",
    path,
  });

  return (
    <>
      <BaseEdge id={id} path={path} {...delegated} />
      <Shape animateMotionProps={animateMotionProps} />
    </>
  );
}

type AnimateMotionProps = {
  dur: string;
  keyTimes: string;
  keyPoints: string;
  repeatCount: number | "indefinite";
  path: string;
  calcMode: string;
};

type AnimatedSvg = ({
  animateMotionProps,
}: {
  animateMotionProps: AnimateMotionProps;
}) => React.ReactElement;

const shapes = {
  circle: ({ animateMotionProps }) => (
    <circle r="4" fill="#3b82f6">
      <animateMotion {...animateMotionProps} />
    </circle>
  ),

  package: ({ animateMotionProps }) => (
    <g fill="#f59e0b" stroke="#1e293b" transform="translate(-8,-8)">
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <path d="M12 22V12" />
      <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
      <path d="m7.5 4.27 9 5.15" />
      <animateMotion {...animateMotionProps} />
    </g>
  ),
} satisfies Record<string, AnimatedSvg>;

function getPath({
  type,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: {
  type: "bezier" | "smoothstep" | "step" | "straight";
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
}) {
  switch (type) {
    case "bezier":
      return getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
    case "smoothstep":
      return getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
    case "step":
      return getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 0 });
    case "straight":
      return getStraightPath({ sourceX, sourceY, targetX, targetY });
  }
}

function getAnimateMotionProps({
  duration,
  direction,
  repeat,
  path,
}: {
  duration: number;
  direction: "forward" | "reverse" | "alternate" | "alternate-reverse";
  repeat: number | "indefinite";
  path: string;
}): AnimateMotionProps {
  const base = {
    path,
    repeatCount: repeat,
    calcMode: "linear",
  };

  switch (direction) {
    case "forward":
      return { ...base, dur: `${duration}s`, keyTimes: "0;1", keyPoints: "0;1" };
    case "reverse":
      return { ...base, dur: `${duration}s`, keyTimes: "0;1", keyPoints: "1;0" };
    case "alternate":
      return { ...base, dur: `${duration * 2}s`, keyTimes: "0;0.5;1", keyPoints: "0;1;0" };
    case "alternate-reverse":
      return { ...base, dur: `${duration * 2}s`, keyTimes: "0;0.5;1", keyPoints: "1;0;1" };
  }
}
```

---

## 5. Button Edge

Aresta que projeta um botão HTML interativo diretamente no ponto médio da curva utilizando `<EdgeLabelRenderer />`.

### 5.1 Código-Fonte Completo (`button-edge.tsx`)
```tsx
import { type ReactNode } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";

export function ButtonEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  children,
}: EdgeProps & { children: ReactNode }) {
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
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          {children}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```

---

## 6. Data Edge

Uma aresta reativa que lê uma propriedade específica do objeto `data` do nó de origem via seletor Zustand (`useStore`) e renderiza o valor em tempo real sobre a linha.

### 6.1 Código-Fonte Completo (`data-edge.tsx`)
```tsx
import { useMemo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Position,
  useStore,
  type Edge,
  type EdgeProps,
  type Node,
} from "@xyflow/react";

export type DataEdge<T extends Node = Node> = Edge<{
  /** Chave do objeto `data` do nó de origem a ser observada */
  key?: keyof T["data"];
  path?: "bezier" | "smoothstep" | "step" | "straight";
}>;

export function DataEdge({
  data = { path: "bezier" },
  id,
  markerEnd,
  source,
  sourcePosition,
  sourceX,
  sourceY,
  style,
  targetPosition,
  targetX,
  targetY,
}: EdgeProps<DataEdge>) {
  // Consulta cirúrgica ao estado do nó de origem na store
  const sourceNodeData = useStore((state) => state.nodeLookup.get(source)?.data);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const label = useMemo(() => {
    if (data.key && sourceNodeData) {
      const value = sourceNodeData[data.key];
      if (typeof value === "object") return JSON.stringify(value);
      return String(value ?? "");
    }
    return "";
  }, [data, sourceNodeData]);

  const transform = `translate(${labelX}px,${labelY}px) translate(-50%, -50%)`;

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {data.key && (
        <EdgeLabelRenderer>
          <div
            className="bg-card text-card-foreground absolute rounded border px-2 py-0.5 shadow-sm text-xs font-mono"
            style={{ transform }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
```
