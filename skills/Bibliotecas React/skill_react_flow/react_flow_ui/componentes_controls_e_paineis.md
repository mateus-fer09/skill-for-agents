---
title: "React Flow UI - Controles, Painéis e DevTools"
description: "Implementação em TypeScript dos módulos avançados de controle, inspeção e navegação do React Flow UI: DevTools (Node Inspector, Change Logger, Viewport Logger), Node Search e Node Search Dialog (com shadcn Command), Zoom Select e Zoom Slider."
topics:
  - "DevTools (Node Inspector, Change Logger, Viewport Logger)"
  - "NodeSearch e NodeSearchDialog (shadcn Command)"
  - "ZoomSelect (Select Dropdown com Níveis Dinâmicos)"
  - "ZoomSlider (Slider Horizontal/Vertical e Botões de Ação)"
keywords:
  - "DevTools"
  - "NodeInspector"
  - "ChangeLogger"
  - "ViewportLogger"
  - "NodeSearch"
  - "NodeSearchDialog"
  - "ZoomSelect"
  - "ZoomSlider"
source_scope: "ui/components/*"
---

# Controles, Painéis e DevTools (React Flow UI)

Esta seção documenta as ferramentas completas de navegação de viewport, busca inteligente de nós e ferramentas de depuração (*DevTools*) construídas sobre os primitivos do shadcn/ui.

---

## 1. DevTools

Um painel completo de diagnóstico que inspeciona o estado em tempo real de cada nó (dimensões, posição absoluta, dados), monitora coordenadas da viewport e registra todas as mutações (`NodeChange`) disparadas pelo fluxo.

### 1.1 Código-Fonte Completo (`devtools.tsx`)
```tsx
"use client";

import {
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  useNodes,
  Panel,
  useStore,
  useStoreApi,
  ViewportPortal,
  useReactFlow,
  PanelPosition,
  type OnNodesChange,
  type NodeChange,
  type XYPosition,
} from "@xyflow/react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const ViewportLogger = () => {
  const viewport = useStore(
    (s) =>
      `x: ${s.transform[0].toFixed(2)}, y: ${s.transform[1].toFixed(2)}, zoom: ${s.transform[2].toFixed(2)}`,
  );

  return (
    <div className="bg-card text-card-foreground rounded border px-3 py-1 text-xs font-mono shadow">
      {viewport}
    </div>
  );
};

type ChangeLoggerProps = {
  color?: string;
  limit?: number;
};

type ChangeInfoProps = {
  change: NodeChange;
};

const ChangeInfo = ({ change }: ChangeInfoProps) => {
  const id = "id" in change ? change.id : "-";
  const { type } = change;

  return (
    <div className="border-b border-border/50 pb-2 mb-2 text-[11px] font-mono">
      <div className="font-bold text-primary">Nó: {id} • Ação: {type}</div>
      <div className="text-muted-foreground">
        {type === "add" ? JSON.stringify(change.item, null, 2) : null}
        {type === "dimensions"
          ? `Dimensões: ${change.dimensions?.width}px × ${change.dimensions?.height}px`
          : null}
        {type === "position"
          ? `Posição: ${change.position?.x.toFixed(1)}, ${change.position?.y.toFixed(1)}`
          : null}
        {type === "remove" ? "Nó excluído" : null}
        {type === "select" ? (change.selected ? "Selecionado" : "Deselecionado") : null}
      </div>
    </div>
  );
};

export const ChangeLogger = ({ limit = 20 }: ChangeLoggerProps) => {
  const [changes, setChanges] = useState<NodeChange[]>([]);
  const store = useStoreApi();

  const handleNodeChanges: OnNodesChange = useCallback(
    (newChanges: NodeChange[]) => {
      setChanges((prevChanges) =>
        [...newChanges, ...prevChanges].slice(0, limit),
      );
    },
    [limit],
  );

  useEffect(() => {
    store.setState({ onNodesChange: handleNodeChanges });
    return () => store.setState({ onNodesChange: undefined });
  }, [handleNodeChanges, store]);

  return (
    <div className="space-y-1">
      {changes.length === 0 ? (
        <div className="text-muted-foreground text-xs">Nenhum evento registrado</div>
      ) : (
        changes.map((change, index) => (
          <ChangeInfo key={index} change={change} />
        ))
      )}
    </div>
  );
};

export const NodeInspector = () => {
  const { getInternalNode } = useReactFlow();
  const nodes = useNodes();

  return (
    <ViewportPortal>
      <div className="pointer-events-none">
        {nodes.map((node) => {
          const internalNode = getInternalNode(node.id);
          if (!internalNode) return null;

          const absPosition = internalNode?.internals.positionAbsolute;

          return (
            <NodeInfo
              key={node.id}
              id={node.id}
              selected={!!node.selected}
              type={node.type || "default"}
              position={node.position}
              absPosition={absPosition}
              width={node.measured?.width ?? 0}
              height={node.measured?.height ?? 0}
              data={node.data}
            />
          );
        })}
      </div>
    </ViewportPortal>
  );
};

type NodeInfoProps = {
  id: string;
  type: string;
  selected: boolean;
  position: XYPosition;
  absPosition: XYPosition;
  width?: number;
  height?: number;
  data: object;
};

const NodeInfo = ({
  id,
  type,
  selected,
  position,
  absPosition,
  width,
  height,
  data,
}: NodeInfoProps) => {
  if (!width || !height) return null;

  const absoluteTransform = `translate(${absPosition.x}px, ${absPosition.y + height + 6}px)`;

  return (
    <div
      style={{
        position: "absolute",
        transform: absoluteTransform,
        width: Math.max(width, 220),
      }}
      className="bg-slate-900/90 text-slate-100 rounded border border-slate-700 p-2 font-mono text-[10px] shadow-xl backdrop-blur"
    >
      <div>ID: <span className="text-yellow-400">{id}</span> ({type})</div>
      <div>Posição: ({position.x.toFixed(1)}, {position.y.toFixed(1)})</div>
      <div>Dimensão: {width} × {height}px</div>
      <div>Status: {selected ? "Selecionado" : "Normal"}</div>
      <div className="mt-1 max-h-16 overflow-y-auto text-slate-300">
        Data: {JSON.stringify(data)}
      </div>
    </div>
  );
};

type Tool = {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  label: string;
  value: string;
};

type DevToolsToggleProps = {
  tools: Tool[];
  position: PanelPosition;
};

const DevToolsToggle = ({ tools, position }: DevToolsToggleProps) => {
  return (
    <Panel position={position} className="bg-card shadow rounded border p-1">
      <ToggleGroup type="multiple">
        {tools.map(({ active, setActive, label, value }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            onClick={() => setActive((prev) => !prev)}
            aria-pressed={active}
            className="text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Panel>
  );
};

export const DevTools = ({ position = "top-right" }: { position?: PanelPosition }) => {
  const [nodeInspectorActive, setNodeInspectorActive] = useState(false);
  const [changeLoggerActive, setChangeLoggerActive] = useState(false);
  const [viewportLoggerActive, setViewportLoggerActive] = useState(false);

  const tools = [
    { active: nodeInspectorActive, setActive: setNodeInspectorActive, label: "Inspector", value: "inspector" },
    { active: changeLoggerActive, setActive: setChangeLoggerActive, label: "Log de Ações", value: "logger" },
    { active: viewportLoggerActive, setActive: setViewportLoggerActive, label: "Viewport", value: "viewport" },
  ];

  return (
    <>
      <DevToolsToggle tools={tools} position={position} />

      {changeLoggerActive && (
        <Panel
          className="mt-14 max-h-72 w-80 overflow-y-auto rounded bg-card p-3 shadow-lg border"
          position="top-right"
        >
          <ChangeLogger />
        </Panel>
      )}

      {nodeInspectorActive && <NodeInspector />}

      {viewportLoggerActive && (
        <Panel position="bottom-left">
          <ViewportLogger />
        </Panel>
      )}
    </>
  );
};
```

---

## 2. Node Search e Node Search Dialog

Barra de busca de nós no estilo Command K (Spotlight). Ao selecionar um nó na lista de resultados, o componente o marca como selecionado e move a viewport com animação suave (*fitView*) até ele.

### 2.1 Código-Fonte Completo (`node-search.tsx`)
```tsx
"use client";

import { useCallback, useState } from "react";
import {
  BuiltInEdge,
  useReactFlow,
  type Node,
  type PanelProps,
} from "@xyflow/react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface NodeSearchProps extends Omit<PanelProps, "children"> {
  onSearch?: (searchString: string) => Node[];
  onSelectNode?: (node: Node) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NodeSearchInternal({
  onSearch,
  onSelectNode,
  open,
  onOpenChange,
}: NodeSearchProps) {
  const [searchResults, setSearchResults] = useState<Node[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const { getNodes, fitView, setNodes } = useReactFlow<Node, BuiltInEdge>();

  const defaultOnSearch = useCallback(
    (search: string) => {
      const nodes = getNodes();
      return nodes.filter((node) => {
        const label = String(node.data?.label ?? "");
        return label.toLowerCase().includes(search.toLowerCase()) || node.id.includes(search);
      });
    },
    [getNodes],
  );

  const onChange = useCallback(
    (search: string) => {
      setSearchString(search);
      if (search.length > 0) {
        onOpenChange?.(true);
        const results = (onSearch || defaultOnSearch)(search);
        setSearchResults(results);
      }
    },
    [defaultOnSearch, onOpenChange, onSearch],
  );

  const defaultOnSelectNode = useCallback(
    (node: Node) => {
      setNodes((nodes) =>
        nodes.map((n) => (n.id === node.id ? { ...n, selected: true } : { ...n, selected: false })),
      );
      fitView({ nodes: [node], duration: 500, padding: 0.5 });
    },
    [fitView, setNodes],
  );

  const onSelect = useCallback(
    (node: Node) => {
      (onSelectNode || defaultOnSelectNode)?.(node);
      setSearchString("");
      onOpenChange?.(false);
    },
    [onSelectNode, defaultOnSelectNode, onOpenChange],
  );

  return (
    <>
      <CommandInput
        placeholder="Buscar nós no fluxo..."
        onValueChange={onChange}
        value={searchString}
        onFocus={() => onOpenChange?.(true)}
      />

      {open && (
        <CommandList>
          {searchResults.length === 0 ? (
            <CommandEmpty>Nenhum nó encontrado para "{searchString}".</CommandEmpty>
          ) : (
            <CommandGroup heading="Nós Disponíveis">
              {searchResults.map((node) => (
                <CommandItem key={node.id} onSelect={() => onSelect(node)}>
                  <span>{String(node.data?.label ?? node.id)}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                    ID: {node.id}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </>
  );
}

export function NodeSearch({
  className,
  onSearch,
  onSelectNode,
  ...props
}: NodeSearchProps) {
  const [open, setOpen] = useState(false);
  return (
    <Command shouldFilter={false} className="rounded-lg border shadow-md md:min-w-[360px]">
      <NodeSearchInternal
        className={className}
        onSearch={onSearch}
        onSelectNode={onSelectNode}
        open={open}
        onOpenChange={setOpen}
        {...props}
      />
    </Command>
  );
}

export interface NodeSearchDialogProps extends NodeSearchProps {
  title?: string;
}

export function NodeSearchDialog({
  className,
  onSearch,
  onSelectNode,
  open,
  onOpenChange,
  ...props
}: NodeSearchDialogProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <NodeSearchInternal
        className={className}
        onSearch={onSearch}
        onSelectNode={onSelectNode}
        open={open}
        onOpenChange={onOpenChange}
        {...props}
      />
    </CommandDialog>
  );
}
```

---

## 3. Zoom Select

Um seletor dropdown inteligente que calcula automaticamente todos os níveis de zoom permitidos no fluxo (com base em `minZoom` e `maxZoom`) em incrementos percentuais e disponibiliza a opção `"Best Fit"`.

### 3.1 Código-Fonte Completo (`zoom-select.tsx`)
```tsx
"use client";

import React, { useCallback } from "react";
import { Panel, useReactFlow, useStore, type PanelProps } from "@xyflow/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function ZoomSelect({
  className,
  ...props
}: Omit<PanelProps, "children">) {
  const { zoomTo, fitView } = useReactFlow();

  const handleZoomChange = useCallback(
    (value: string) => {
      if (value === "best-fit") {
        fitView({ duration: 400 });
      } else {
        const zoomValue = parseFloat(value);
        if (!isNaN(zoomValue)) {
          zoomTo(zoomValue, { duration: 300 });
        }
      }
    },
    [fitView, zoomTo],
  );

  const zoomLevels = useStore((state) => {
    const { minZoom, maxZoom } = state;
    const levels = [];
    const zoomIncrement = 25; // Intervalos de 25%

    for (
      let i = Math.ceil(minZoom * 100);
      i <= Math.floor(maxZoom * 100);
      i += zoomIncrement
    ) {
      levels.push((i / 100).toString());
    }

    return levels;
  });

  return (
    <Panel className={cn("bg-card text-card-foreground rounded border shadow", className)} {...props}>
      <Select onValueChange={handleZoomChange}>
        <SelectTrigger className="w-[120px] h-8 text-xs">
          <SelectValue placeholder="Zoom" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="best-fit">Enquadrar (Fit)</SelectItem>
          <div className="mx-2 my-1 border-t" />
          {zoomLevels.map((level) => (
            <SelectItem key={level} value={level}>
              {`${(parseFloat(level) * 100).toFixed(0)}%`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Panel>
  );
}
```

---

## 4. Zoom Slider

Controle visual completo de zoom com suporte a orientação horizontal ou vertical, botões de incremento/decremento rápido, reset para 100% e enquadramento total.

### 4.1 Código-Fonte Completo (`zoom-slider.tsx`)
```tsx
"use client";

import React from "react";
import { Maximize, Minus, Plus } from "lucide-react";
import {
  Panel,
  useViewport,
  useStore,
  useReactFlow,
  type PanelProps,
} from "@xyflow/react";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ZoomSlider({
  className,
  orientation = "horizontal",
  ...props
}: Omit<PanelProps, "children"> & {
  orientation?: "horizontal" | "vertical";
}) {
  const { zoom } = useViewport();
  const { zoomTo, zoomIn, zoomOut, fitView } = useReactFlow();
  const minZoom = useStore((state) => state.minZoom);
  const maxZoom = useStore((state) => state.maxZoom);

  return (
    <Panel
      className={cn(
        "bg-card text-card-foreground flex items-center gap-1 rounded-md border p-1 shadow-md",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex items-center gap-1",
          orientation === "horizontal" ? "flex-row" : "flex-col-reverse",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => zoomOut({ duration: 300 })}
          title="Diminuir Zoom"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <Slider
          className={cn(
            orientation === "horizontal" ? "w-28" : "h-28",
          )}
          orientation={orientation}
          value={[zoom]}
          min={minZoom}
          max={maxZoom}
          step={0.01}
          onValueChange={(values) => zoomTo(values[0])}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => zoomIn({ duration: 300 })}
          title="Aumentar Zoom"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <Button
        className={cn(
          "tabular-nums text-xs h-7",
          orientation === "horizontal" ? "w-14" : "w-auto",
        )}
        variant="ghost"
        onClick={() => zoomTo(1, { duration: 300 })}
        title="Resetar para 100%"
      >
        {(100 * zoom).toFixed(0)}%
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => fitView({ duration: 300 })}
        title="Enquadrar Vista"
      >
        <Maximize className="h-3.5 w-3.5" />
      </Button>
    </Panel>
  );
}
```
