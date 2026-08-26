---
title: "React Flow UI - Templates e Arquitetura de AI Workflow Editor"
description: "Guia arquitetural e técnico dos templates AI Workflow Editor e Workflow Editor do React Flow. Gerenciamento de estado com Zustand, motor de execução sequencial (Workflow Runner), auto-layout com ELKjs, drag-and-drop de nós da sidebar e integração com Vercel AI SDK."
topics:
  - "Tech Stack e Visão Geral dos Templates"
  - "Gerenciamento de Estado com Zustand"
  - "Padrão Drag-and-Drop com screenToFlowPosition"
  - "Layout Automático de Grafos com ELKjs"
  - "Motor de Execução (Workflow Runner Engine)"
  - "Integração com Vercel AI SDK e Streaming"
keywords:
  - "AI Workflow Editor"
  - "Workflow Editor"
  - "Zustand"
  - "ELKjs"
  - "Vercel AI SDK"
  - "screenToFlowPosition"
  - "Workflow Runner"
source_scope: "ui/templates/*"
---

# Templates e Arquitetura de AI Workflow Editor

Os templates **Workflow Editor** e **AI Workflow Editor** do React Flow representam o estado da arte para a criação de sistemas visuais baseados em nós, pipelines de processamento de dados e orquestração de modelos de inteligência artificial (LLMs, agentes e tool calling).

---

## 1. Visão Geral e Tech Stack

| Camada | Tecnologia | Função na Aplicação |
| :--- | :--- | :--- |
| **Framework Base** | Next.js (App Router) / React 19 | Estrutura de rotas, renderização híbrida e suporte a Server Actions. |
| **Canvas & Interações** | `@xyflow/react` + React Flow UI | Renderização do grafo, conexões magnéticas, zoom, pan e seleção. |
| **Estilização & Componentes** | Tailwind CSS 4 + `shadcn/ui` | Design system consistente, paleta temática Dark/Light e acessibilidade. |
| **Gerenciamento de Estado** | `zustand` | Store global e performática desacoplada do ciclo de re-render do React. |
| **Inteligência Artificial** | Vercel AI SDK (`ai`) | Streaming de respostas de LLMs, geração de texto estruturado e tool execution. |
| **Layouting Automático** | `elkjs` | Algoritmos de arranjo espacial hierárquico e ortogonal de nós e arestas. |

---

## 2. Gerenciamento de Estado Global com Zustand

Em aplicações complexas de workflow, centralizar o estado dos nós, arestas e execução em uma store Zustand externa é o padrão recomendado.

### 2.1 Implementação da Store (`useWorkflowStore.ts`)
```ts
import { create } from "zustand";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";

export type WorkflowStatus = "idle" | "running" | "completed" | "error";

export type WorkflowState = {
  nodes: Node[];
  edges: Edge[];
  workflowStatus: WorkflowStatus;
  activeNodeId: string | null;

  // Handlers do React Flow
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // Ações de Manipulação
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  setNodeStatus: (id: string, status: "initial" | "loading" | "success" | "error") => void;

  // Execução
  runWorkflow: () => Promise<void>;
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [
    {
      id: "input-1",
      type: "inputNode",
      position: { x: 50, y: 150 },
      data: { label: "Entrada do Usuário", prompt: "Escreva um resumo executivo..." },
    },
    {
      id: "llm-1",
      type: "aiNode",
      position: { x: 350, y: 150 },
      data: { label: "Processador LLM (Claude 3.5)", model: "claude-3-5-sonnet", status: "initial" },
    },
    {
      id: "output-1",
      type: "outputNode",
      position: { x: 700, y: 150 },
      data: { label: "Resultado Formatado", status: "initial" },
    },
  ],
  edges: [
    { id: "e1-2", source: "input-1", target: "llm-1", animated: false },
    { id: "e2-3", source: "llm-1", target: "output-1", animated: false },
  ],
  workflowStatus: "idle",
  activeNodeId: null,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection: Connection) => {
    set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => setEdges(edges),

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    });
  },

  setNodeStatus: (id, status) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, status } } : node,
      ),
    });
  },

  runWorkflow: async () => {
    const { nodes, edges, setNodeStatus } = get();
    set({ workflowStatus: "running" });

    for (const node of nodes) {
      set({ activeNodeId: node.id });
      setNodeStatus(node.id, "loading");

      // Anima arestas de entrada
      set({
        edges: get().edges.map((e) =>
          e.target === node.id ? { ...e, animated: true } : e,
        ),
      });

      // Simulação de execução assíncrona
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setNodeStatus(node.id, "success");
      set({
        edges: get().edges.map((e) =>
          e.target === node.id ? { ...e, animated: false } : e,
        ),
      });
    }

    set({ workflowStatus: "completed", activeNodeId: null });
  },
}));
```

---

## 3. Padrão Drag-and-Drop a partir de Sidebar Externa

Permite que o usuário arraste blocos de nós da barra lateral e os solte em qualquer ponto do canvas com coordenadas convertidas com exatidão através de `screenToFlowPosition`.

### 3.1 Componente da Sidebar (`Sidebar.tsx`)
```tsx
import React from "react";
import { Sparkles, Database, FileText, Send } from "lucide-react";

export function WorkflowSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    event.dataTransfer.setData("application/reactflow/label", label);
    event.dataTransfer.effectAllowed = "move";
  };

  const nodePalette = [
    { type: "aiNode", label: "Agente IA (LLM)", icon: Sparkles },
    { type: "dbNode", label: "Consulta SQL", icon: Database },
    { type: "promptNode", label: "Template Prompt", icon: FileText },
    { type: "outputNode", label: "Saída HTTP", icon: Send },
  ];

  return (
    <aside className="w-64 border-r bg-card p-4 space-y-3">
      <h3 className="font-semibold text-sm text-foreground">Biblioteca de Nós</h3>
      <p className="text-xs text-muted-foreground">Arraste para o canvas para adicionar.</p>

      <div className="space-y-2">
        {nodePalette.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              className="flex items-center gap-2 p-2.5 rounded-md border bg-background hover:bg-accent cursor-grab active:cursor-grabbing text-xs font-medium transition shadow-xs"
              draggable
              onDragStart={(e) => onDragStart(e, item.type, item.label)}
            >
              <Icon className="h-4 w-4 text-primary" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
```

### 3.2 Captura de Drop no Canvas (`FlowCanvas.tsx`)
```tsx
import React, { useCallback, useRef } from "react";
import { ReactFlow, useReactFlow } from "@xyflow/react";
import { useWorkflowStore } from "./useWorkflowStore";

export function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useWorkflowStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow/type");
      const label = event.dataTransfer.getData("application/reactflow/label");

      if (!type) return;

      // Converte a posição do ponteiro do mouse na tela para a coordenada espacial do fluxo
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: { label, status: "initial" },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode],
  );

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
      />
    </div>
  );
}
```

---

## 4. Algoritmo de Auto-Layouting com ELKjs

O [ELKjs](https://github.com/kieler/elkjs) é uma biblioteca de ponta para cálculo automático de grafos hierárquicos (*layered graphs*), evitando cruzamento de arestas e organizando nós em colunas ou linhas limpas.

### 4.1 Implementação do Utilitário de Layout (`useAutoLayout.ts`)
```ts
import ELK, { type ElkNode } from "elkjs/lib/elk.bundled.js";
import { useReactFlow, type Node, type Edge } from "@xyflow/react";
import { useCallback } from "react";

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT", // Layout Horizontal (esquerda para a direita)
  "elk.spacing.nodeNode": "80",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.padding": "[top=20,left=20,bottom=20,right=20]",
};

export function useAutoLayout() {
  const { getNodes, getEdges, setNodes, fitView } = useReactFlow();

  const layoutGraph = useCallback(async () => {
    const nodes = getNodes();
    const edges = getEdges();

    const graph: ElkNode = {
      id: "root",
      layoutOptions: elkOptions,
      children: nodes.map((node) => ({
        id: node.id,
        // Utiliza as dimensões reais medidas ou valores padrão de fallback
        width: node.measured?.width ?? node.initialWidth ?? 250,
        height: node.measured?.height ?? node.initialHeight ?? 120,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    const layoutedGraph = await elk.layout(graph);

    const layoutedNodes = nodes.map((node) => {
      const elkNode = layoutedGraph.children?.find((n) => n.id === node.id);
      return {
        ...node,
        position: {
          x: elkNode?.x ?? node.position.x,
          y: elkNode?.y ?? node.position.y,
        },
      };
    });

    setNodes(layoutedNodes);
    setTimeout(() => fitView({ duration: 400, padding: 0.2 }), 50);
  }, [getNodes, getEdges, setNodes, fitView]);

  return { layoutGraph };
}
```

---

## 5. Integração com Vercel AI SDK dentro de Custom Nodes

Exemplo de nó customizado que consome o endpoint de streaming de IA da aplicação e renderiza a saída em tempo real dentro do nó.

### 5.1 Nó com Streaming de IA (`AiProcessorNode.tsx`)
```tsx
import React, { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
  BaseNodeFooter,
} from "./base-node";
import { NodeStatusIndicator, type NodeStatus } from "./node-status-indicator";

export const AiProcessorNode = memo(({ id, data }: NodeProps) => {
  const [output, setOutput] = useState<string>("");
  const [status, setStatus] = useState<NodeStatus>("initial");

  const handleGenerate = async () => {
    setStatus("loading");
    setOutput("");

    try {
      const response = await fetch("/api/ai-completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: data.prompt ?? "Resuma o texto recebido" }),
      });

      if (!response.ok) throw new Error("Falha na geração");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value));
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <NodeStatusIndicator status={status} variant="border">
      <BaseNode className="w-80">
        <Handle type="target" position={Position.Left} />
        <BaseNodeHeader className="border-b">
          <Sparkles className="size-4 text-purple-500" />
          <BaseNodeHeaderTitle>{data.label ?? "Agente LLM"}</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="text-xs text-muted-foreground font-mono max-h-32 overflow-y-auto bg-muted/40 p-2 rounded">
            {output || "Aguardando execução do prompt..."}
          </div>
        </BaseNodeContent>

        <BaseNodeFooter>
          <Button
            size="sm"
            className="nodrag w-full gap-1.5"
            onClick={handleGenerate}
            disabled={status === "loading"}
          >
            <Play className="h-3.5 w-3.5" />
            {status === "loading" ? "Gerando..." : "Executar Passo"}
          </Button>
        </BaseNodeFooter>
        <Handle type="source" position={Position.Right} />
      </BaseNode>
    </NodeStatusIndicator>
  );
});
AiProcessorNode.displayName = "AiProcessorNode";
```
