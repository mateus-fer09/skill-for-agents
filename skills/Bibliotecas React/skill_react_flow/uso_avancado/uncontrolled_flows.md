---
title: "Fluxos N?o Controlados (Uncontrolled Flows) no React Flow"
description: "Guia completo sobre a arquitetura de fluxos n?o controlados com defaultNodes e defaultEdges no React Flow v12, comparativo com controlled flows, muta??es imperativas via useReactFlow e casos de uso de alta performance."
topics:
  - "Fluxos Controlados vs N?o Controlados"
  - "defaultNodes e defaultEdges"
  - "Muta??o Imperativa com useReactFlow"
  - "Leitura sob demanda (getNodes, getEdges, toObject)"
  - "Combina??o H?brida de Modos"
keywords:
  - "uncontrolled flow"
  - "defaultNodes"
  - "defaultEdges"
  - "controlled vs uncontrolled"
  - "useReactFlow"
  - "imperative graph"
  - "@xyflow/react"
source_scope: "Learn / Advanced Use / Uncontrolled Flow"
---

# Fluxos N?o Controlados (Uncontrolled Flows) no React Flow

O React Flow suporta dois paradigmas fundamentais de gerenciamento de estado: **Controlado (Controlled)** e **N?o Controlado (Uncontrolled)**.

Enquanto fluxos controlados mant?m `nodes` e `edges` no estado do React (`useState` ou Zustand), os **fluxos n?o controlados** delegam o gerenciamento das estruturas de dados inteiramente para a store interna do React Flow, proporcionando inicializa??o mais simples e excelente performance para diagramas que n?o necessitam de sincroniza??o constante no componente pai.

---

## 1. Comparativo: Controlado vs N?o Controlado

| Caracter?stica | Fluxo Controlado (`nodes`, `edges`) | Fluxo N?o Controlado (`defaultNodes`, `defaultEdges`) |
| :--- | :--- | :--- |
| **Props Obrigat?rias** | `nodes={nodes}`, `edges={edges}`, `onNodesChange`, `onEdgesChange` | `defaultNodes={initialNodes}`, `defaultEdges={initialEdges}` |
| **Onde o estado reside?** | No componente pai ou em uma store externa (Zustand/Redux). | Exclusivamente na store interna do React Flow. |
| **Re-renders do Componente Pai** | A cada movimento de n? (`onNodesChange`), o componente pai re-renderiza. | O componente pai **n?o** re-renderiza durante arrasto ou conex?es. |
| **Como adicionar/modificar n?s?** | `setNodes((nds) => [...nds, newNode])` ou a??o na store. | `addNodes(newNode)` ou `updateNodeData(...)` via `useReactFlow()`. |
| **Melhor Caso de Uso** | Aplica??es colaborativas, fluxos reativos em tempo real, undo/redo global. | Visualizadores est?ticos, editores imperativos, formul?rios com save manual. |

---

## 2. Configura??o de um Fluxo N?o Controlado B?sico

Em um fluxo n?o controlado, voc? passa apenas `defaultNodes` e `defaultEdges`. O React Flow inicializa o grafo e voc? pode usar o `<Background />`, `<Controls />` e `<MiniMap />` imediatamente:

```tsx
import React from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'In?cio do Processo' }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: 'Etapa de Valida??o' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Etapa de Execu??o' }, position: { x: 400, y: 100 } },
  { id: '4', type: 'output', data: { label: 'Relat?rio Final' }, position: { x: 250, y: 220 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
];

export default function UncontrolledApp() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          defaultNodes={initialNodes}
          defaultEdges={initialEdges}
          fitView
        >
          <Background gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
```

---

## 3. Manipula??o Imperativa via `useReactFlow()`

Mesmo sem manter um `useState`, voc? pode ler e mutar o grafo sob demanda utilizando os m?todos imperativos expostos por `useReactFlow()`.

### Exemplo Completo: Painel de Controle Imperativo

```tsx
import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  Background,
  Controls,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: 'a', data: { label: 'N? A' }, position: { x: 100, y: 100 } },
  { id: 'b', data: { label: 'N? B' }, position: { x: 300, y: 100 } },
];

const initialEdges: Edge[] = [
  { id: 'ea-b', source: 'a', target: 'b' }
];

function ActionControls() {
  const {
    getNodes,
    getEdges,
    addNodes,
    addEdges,
    updateNodeData,
    deleteElements,
    toObject,
    fitView
  } = useReactFlow();

  // Adiciona um novo n? imperativamente
  const handleAddNode = useCallback(() => {
    const id = `node_${Date.now()}`;
    const newNode: Node = {
      id,
      data: { label: `Criado dinamicamente (${id.slice(-4)})` },
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
    };
    addNodes(newNode);
  }, [addNodes]);

  // Altera os dados de um n? existente
  const handleUpdateLabel = useCallback(() => {
    const nodes = getNodes();
    if (nodes.length > 0) {
      updateNodeData(nodes[0].id, {
        label: `Alterado em ${new Date().toLocaleTimeString()}`
      });
    }
  }, [getNodes, updateNodeData]);

  // Salva o JSON completo do grafo
  const handleSaveToJSON = useCallback(() => {
    const flowData = toObject();
    const jsonString = JSON.stringify(flowData, null, 2);
    console.log('Grafo Serializado para Exporta??o / Banco de Dados:', jsonString);
    alert(`Fluxo salvo com sucesso!
Total de N?s: ${flowData.nodes.length}
Total de Arestas: ${flowData.edges.length}`);
  }, [toObject]);

  // Remove n?s selecionados
  const handleDeleteSelected = useCallback(() => {
    const selectedNodes = getNodes().filter(n => n.selected);
    const selectedEdges = getEdges().filter(e => e.selected);
    deleteElements({ nodes: selectedNodes, edges: selectedEdges });
  }, [getNodes, getEdges, deleteElements]);

  return (
    <Panel position="top-right" style={{ display: 'flex', flexDirection: 'column', gap: 6, background: '#fff', padding: 10, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <button onClick={handleAddNode}>+ Adicionar N?</button>
      <button onClick={handleUpdateLabel}>Renomear Primeiro N?</button>
      <button onClick={handleDeleteSelected}>Remover Selecionados</button>
      <button onClick={() => fitView({ duration: 400 })}>Ajustar Zoom (Fit View)</button>
      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
      <button onClick={handleSaveToJSON} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>
        Salvar Fluxo (toObject)
      </button>
    </Panel>
  );
}

export default function ImperativeUncontrolledFlow() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          defaultNodes={initialNodes}
          defaultEdges={initialEdges}
          fitView
        >
          <Background />
          <Controls />
          <ActionControls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
```

---

## 4. Modo H?brido: Escutando Eventos sem Controlar o Estado

Voc? pode anexar listeners como `onNodeClick`, `onEdgeClick` e at? mesmo `onNodesChange` para telemetria ou valida??o sem transformar o fluxo em controlado:

```tsx
import React, { useCallback } from 'react';
import { ReactFlow, NodeChange } from '@xyflow/react';

export function MonitoredUncontrolledFlow({ defaultNodes, defaultEdges }) {
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // Loga ou rastreia altera??es sem precisar armazen?-las no estado local
    changes.forEach((change) => {
      if (change.type === 'position' && change.dragging) {
        // console.log(`N? ${change.id} sendo arrastado:`, change.position);
      }
    });
  }, []);

  return (
    <ReactFlow
      defaultNodes={defaultNodes}
      defaultEdges={defaultEdges}
      onNodesChange={handleNodesChange}
    />
  );
}
```
