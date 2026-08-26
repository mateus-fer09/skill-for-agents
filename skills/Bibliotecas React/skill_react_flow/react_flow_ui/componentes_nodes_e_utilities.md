---
title: "React Flow UI - Componentes de Nós e Utilitários de Layout"
description: "Código completo e documentação dos nós e utilitários de interface do React Flow UI: Base Node, Database Schema Node, Labeled Group Node, Placeholder Node, Node Status Indicator, Node Appendix e Node Tooltip."
topics:
  - "BaseNode (Header, Title, Content, Footer)"
  - "DatabaseSchemaNode (Header, Body, Row, Cell)"
  - "LabeledGroupNode (GroupNode, GroupNodeLabel)"
  - "PlaceholderNode"
  - "NodeStatusIndicator (Border e Overlay Spinner)"
  - "NodeAppendix (Posicionamento Dinâmico)"
  - "NodeTooltip (Context, Trigger, Content)"
keywords:
  - "BaseNode"
  - "DatabaseSchemaNode"
  - "LabeledGroupNode"
  - "PlaceholderNode"
  - "NodeStatusIndicator"
  - "NodeAppendix"
  - "NodeTooltip"
source_scope: "ui/components/*"
---

# Componentes de Nós e Utilitários de Layout (React Flow UI)

Esta seção documenta a implementação completa em TypeScript dos componentes de nós e utilitários modulares desenvolvidos com Tailwind CSS e shadcn/ui.

---

## 1. Base Node

O `BaseNode` é a fundação visual para criação de nós padronizados na aplicação. Semelhante ao componente `Card` do shadcn/ui, ele exporta 5 subcomponentes componíveis: `BaseNode`, `BaseNodeHeader`, `BaseNodeHeaderTitle`, `BaseNodeContent` e `BaseNodeFooter`.

### 1.1 Código-Fonte Completo (`base-node.tsx`)
```tsx
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Contêiner principal do nó com suporte a seleção de foco e hover.
 */
export function BaseNode({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground relative rounded-md border",
        "hover:ring-1",
        // Aplica borda e sombra destacadas quando o nó pai .react-flow__node possui a classe .selected
        "in-[.selected]:border-muted-foreground",
        "in-[.selected]:shadow-lg",
        className,
      )}
      tabIndex={0}
      {...props}
    />
  );
}

/**
 * Cabeçalho estruturado para ícones e títulos do nó.
 */
export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2",
        className,
      )}
    />
  );
}

/**
 * Título do nó com seleção de texto desabilitada para manter sensação nativa de app.
 */
export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn("select-none flex-1 font-semibold text-sm", className)}
      {...props}
    />
  );
}

/**
 * Área de conteúdo principal do nó.
 */
export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn("flex flex-col gap-y-2 p-3", className)}
      {...props}
    />
  );
}

/**
 * Rodapé do nó para ações secundárias ou status.
 */
export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        "flex flex-col items-center gap-y-2 border-t px-3 pb-3 pt-2",
        className,
      )}
      {...props}
    />
  );
}
```

### 1.2 Exemplo de Uso
```tsx
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
  BaseNodeFooter,
} from "@/components/base-node";

export const FeatureCardNode = memo(({ data }: NodeProps) => {
  return (
    <BaseNode className="w-80">
      <Handle type="target" position={Position.Top} />
      <BaseNodeHeader className="border-b">
        <Rocket className="size-4 text-primary" />
        <BaseNodeHeaderTitle>{data.title ?? "Ação Automatizada"}</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <p className="text-xs text-muted-foreground">
          Executa processamento assíncrono e validação de schema.
        </p>
      </BaseNodeContent>
      <BaseNodeFooter>
        <Button variant="outline" size="sm" className="nodrag w-full">
          Configurar Parâmetros
        </Button>
      </BaseNodeFooter>
      <Handle type="source" position={Position.Bottom} />
    </BaseNode>
  );
});
FeatureCardNode.displayName = "FeatureCardNode";
```

---

## 2. Database Schema Node

Projetado especificamente para renderizar esquemas de banco de dados relacionais com múltiplas linhas de colunas e tipos de dados.

### 2.1 Código-Fonte Completo (`database-schema-node.tsx`)
```tsx
import React, { type ReactNode } from "react";
import { BaseNode, BaseNodeContent, BaseNodeHeader } from "./base-node";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";

export type DatabaseSchemaNodeHeaderProps = {
  children?: ReactNode;
};

export const DatabaseSchemaNodeHeader = ({
  children,
}: DatabaseSchemaNodeHeaderProps) => {
  return (
    <BaseNodeHeader className="bg-secondary text-muted-foreground rounded-tl-md rounded-tr-md p-2 text-center text-sm font-semibold">
      <h2>{children}</h2>
    </BaseNodeHeader>
  );
};

export type DatabaseSchemaNodeBodyProps = {
  children?: ReactNode;
};

export const DatabaseSchemaNodeBody = ({
  children,
}: DatabaseSchemaNodeBodyProps) => {
  return (
    <BaseNodeContent className="p-0">
      <table className="w-full border-spacing-0 overflow-visible">
        <TableBody>{children}</TableBody>
      </table>
    </BaseNodeContent>
  );
};

export type DatabaseSchemaTableRowProps = {
  children: ReactNode;
  className?: string;
};

export const DatabaseSchemaTableRow = ({
  children,
  className,
}: DatabaseSchemaTableRowProps) => {
  return (
    <TableRow className={`relative text-xs ${className || ""}`}>
      {children}
    </TableRow>
  );
};

export type DatabaseSchemaTableCellProps = {
  className?: string;
  children?: ReactNode;
};

export const DatabaseSchemaTableCell = ({
  className,
  children,
}: DatabaseSchemaTableCellProps) => {
  return <TableCell className={className}>{children}</TableCell>;
};

export type DatabaseSchemaNodeProps = {
  className?: string;
  children?: ReactNode;
};

export const DatabaseSchemaNode = ({
  className,
  children,
}: DatabaseSchemaNodeProps) => {
  return <BaseNode className={className}>{children}</BaseNode>;
};
```

---

## 3. Labeled Group Node

Um nó de agrupamento (para subflows) com suporte a rótulos customizados posicionáveis nos cantos ou laterais do grupo.

### 3.1 Código-Fonte Completo (`labeled-group-node.tsx`)
```tsx
import React, { type ReactNode, type ComponentProps } from "react";
import { Panel, type NodeProps, type PanelPosition } from "@xyflow/react";
import { BaseNode } from "./base-node";
import { cn } from "@/lib/utils";

export type GroupNodeLabelProps = ComponentProps<"div">;

export function GroupNodeLabel({
  children,
  className,
  ...props
}: GroupNodeLabelProps) {
  return (
    <div className="h-full w-full" {...props}>
      <div
        className={cn(
          "text-card-foreground bg-secondary w-fit p-2 text-xs font-semibold uppercase tracking-wider",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export type GroupNodeProps = Partial<NodeProps> & {
  label?: ReactNode;
  position?: PanelPosition;
};

export function GroupNode({ label, position = "top-left", ...props }: GroupNodeProps) {
  const getLabelClassName = (pos?: PanelPosition) => {
    switch (pos) {
      case "top-left": return "rounded-br-sm";
      case "top-center": return "rounded-b-sm";
      case "top-right": return "rounded-bl-sm";
      case "bottom-left": return "rounded-tr-sm";
      case "bottom-right": return "rounded-tl-sm";
      case "bottom-center": return "rounded-t-sm";
      default: return "rounded-br-sm";
    }
  };

  return (
    <BaseNode
      className="h-full min-h-[120px] min-w-[200px] overflow-hidden rounded-sm bg-muted/30 border-dashed"
      {...props}
    >
      <Panel className="m-0 p-0" position={position}>
        {label && (
          <GroupNodeLabel className={getLabelClassName(position)}>
            {label}
          </GroupNodeLabel>
        )}
      </Panel>
    </BaseNode>
  );
}
```

---

## 4. Placeholder Node

Um nó com borda tracejada e botão de criação rápida. Ao ser clicado, converte-se automaticamente em um nó funcional no fluxo.

### 4.1 Código-Fonte Completo (`placeholder-node.tsx`)
```tsx
"use client";

import React, { useCallback, type ReactNode } from "react";
import {
  useReactFlow,
  useNodeId,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import { BaseNode } from "./base-node";
import { Plus } from "lucide-react";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
};

export function PlaceholderNode({ children }: PlaceholderNodeProps) {
  const id = useNodeId();
  const { setNodes, setEdges } = useReactFlow();

  const handleClick = useCallback(() => {
    if (!id) return;

    // Desanima arestas conectadas
    setEdges((edges) =>
      edges.map((edge) =>
        edge.target === id ? { ...edge, animated: false } : edge,
      ),
    );

    // Converte o placeholder em um nó real
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            type: "default",
            data: { ...node.data, label: "Novo Passo Criado" },
          };
        }
        return node;
      }),
    );
  }, [id, setEdges, setNodes]);

  return (
    <BaseNode
      className="bg-card hover:bg-accent/50 w-[160px] cursor-pointer border-2 border-dashed border-muted-foreground/40 p-4 text-center text-muted-foreground transition-all shadow-none hover:border-primary"
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <Plus className="h-5 w-5" />
        <span className="text-xs font-medium">{children ?? "Adicionar Nó"}</span>
      </div>
      <Handle
        type="target"
        style={{ visibility: "hidden" }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: "hidden" }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
}
```

---

## 5. Node Status Indicator

Envolve qualquer nó com indicadores visuais de estado de execução: `"loading"`, `"success"`, `"error"` ou `"initial"`. No modo `loading`, suporta a variante `border` (gradiente cônico giratório) ou `overlay` (spinner com backdrop blur).

### 5.1 Código-Fonte Completo (`node-status-indicator.tsx`)
```tsx
import { type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type NodeStatus = "loading" | "success" | "error" | "initial";
export type NodeStatusVariant = "overlay" | "border";

export type NodeStatusIndicatorProps = {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  children: ReactNode;
};

export const SpinnerLoadingIndicator = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      <StatusBorder className="border-blue-600/40">{children}</StatusBorder>
      <div className="bg-background/50 backdrop-blur-xs absolute inset-0 z-50 rounded-md" />
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <span className="absolute inline-block h-10 w-10 animate-ping rounded-full bg-blue-600/20" />
        <LoaderCircle className="size-6 animate-spin text-blue-600" />
      </div>
    </div>
  );
};

export const BorderLoadingIndicator = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="absolute -left-px -top-px h-[calc(100%+2px)] w-[calc(100%+2px)]">
        <style>
          {`
            @keyframes rf-spin {
              from { transform: translate(-50%, -50%) rotate(0deg); }
              to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .rf-status-spinner {
              animation: rf-spin 2s linear infinite;
              position: absolute;
              left: 50%;
              top: 50%;
              width: 140%;
              aspect-ratio: 1;
              transform-origin: center;
            }
          `}
        </style>
        <div className="absolute inset-0 overflow-hidden rounded-md">
          <div className="rf-status-spinner rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,rgb(37,99,235)_0deg,rgba(37,99,235,0)_360deg)]" />
        </div>
      </div>
      {children}
    </>
  );
};

const StatusBorder = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div
        className={cn(
          "absolute -left-px -top-px h-[calc(100%+2px)] w-[calc(100%+2px)] rounded-md border-2",
          className,
        )}
      />
      {children}
    </>
  );
};

export const NodeStatusIndicator = ({
  status,
  variant = "border",
  children,
}: NodeStatusIndicatorProps) => {
  switch (status) {
    case "loading":
      if (variant === "overlay") return <SpinnerLoadingIndicator>{children}</SpinnerLoadingIndicator>;
      return <BorderLoadingIndicator>{children}</BorderLoadingIndicator>;
    case "success":
      return <StatusBorder className="border-emerald-500">{children}</StatusBorder>;
    case "error":
      return <StatusBorder className="border-rose-500">{children}</StatusBorder>;
    default:
      return <>{children}</>;
  }
};
```

---

## 6. Node Appendix

Contêiner acoplado externamente a um nó (em cima, embaixo, à esquerda ou à direita) para exibir métricas, contadores de tokens ou tags complementares.

### 6.1 Código-Fonte Completo (`node-appendix.tsx`)
```tsx
import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const appendixVariants = cva(
  "node-appendix absolute flex w-full flex-col items-center rounded-md border bg-card p-1.5 text-card-foreground shadow-sm",
  {
    variants: {
      position: {
        top: "-translate-y-full -my-1",
        bottom: "top-full my-1",
        left: "-left-full -mx-1",
        right: "left-full mx-1",
      },
    },
    defaultVariants: {
      position: "top",
    },
  },
);

export interface NodeAppendixProps
  extends ComponentProps<"div">,
    VariantProps<typeof appendixVariants> {
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function NodeAppendix({
  children,
  className,
  position,
  ...props
}: NodeAppendixProps) {
  return (
    <div className={cn(appendixVariants({ position }), className)} {...props}>
      {children}
    </div>
  );
}
```

---

## 7. Node Tooltip

Sistema contextual de tooltips em nós construído sobre o componente primitivo `NodeToolbar`.

### 7.1 Código-Fonte Completo (`node-tooltip.tsx`)
```tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type ComponentProps,
} from "react";
import { NodeToolbar, type NodeToolbarProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

type TooltipContextType = {
  isVisible: boolean;
  showTooltip: () => void;
  hideTooltip: () => void;
};

const TooltipContext = createContext<TooltipContextType | null>(null);

export function NodeTooltip({ children }: ComponentProps<"div">) {
  const [isVisible, setIsVisible] = useState(false);
  const showTooltip = useCallback(() => setIsVisible(true), []);
  const hideTooltip = useCallback(() => setIsVisible(false), []);

  return (
    <TooltipContext.Provider value={{ isVisible, showTooltip, hideTooltip }}>
      <div className="relative">{children}</div>
    </TooltipContext.Provider>
  );
}

export function NodeTooltipTrigger(props: ComponentProps<"div">) {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("NodeTooltipTrigger must be used within NodeTooltip");

  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      props.onMouseEnter?.(e);
      context.showTooltip();
    },
    [props, context],
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      props.onMouseLeave?.(e);
      context.hideTooltip();
    },
    [props, context],
  );

  return <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...props} />;
}

export function NodeTooltipContent({
  children,
  position,
  className,
  ...props
}: NodeToolbarProps) {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("NodeTooltipContent must be used within NodeTooltip");

  return (
    <NodeToolbar
      isVisible={context.isVisible}
      className={cn("bg-popover text-popover-foreground rounded border p-2 text-xs shadow-md", className)}
      tabIndex={-1}
      position={position}
      {...props}
    >
      {children}
    </NodeToolbar>
  );
}
```
