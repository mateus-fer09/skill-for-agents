---
title: "TypeScript no React Flow"
description: "Guia exaustivo de tipagem estrita com TypeScript no React Flow v12 (@xyflow/react), incluindo Discriminated Unions para n?s e arestas customizados, generics em hooks, tipagem de handlers e type guards."
topics:
  - "Tipos Fundamentais: Node, Edge, NodeProps, EdgeProps"
  - "Uni?o Discriminada de Tipos (Discriminated Unions)"
  - "Tipando Hooks com Generics"
  - "Tipando Event Handlers e Callbacks"
  - "Type Guards e Valida??o de Tipos em Tempo de Execu??o"
keywords:
  - "typescript"
  - "Node type"
  - "Edge type"
  - "NodeProps"
  - "BuiltInNode"
  - "AppNode"
  - "AppEdge"
  - "type guards"
  - "@xyflow/react"
source_scope: "Learn / Advanced Use / TypeScript"
---

# TypeScript no React Flow

O React Flow v12 foi completamente reescrito com foco em TypeScript de primeira classe. Ao tipar n?s e arestas com **Uni?o Discriminada (Discriminated Unions)**, voc? obt?m autocompletion rigoroso no editor, verifica??o de tipos em handlers e garantia de consist?ncia no `node.data`.

---

## 1. Tipos Fundamentais

O pacote `@xyflow/react` exporta os seguintes tipos essenciais:

```typescript
import {
  Node,                  // Tipo base para n?s: Node<Data, Type>
  Edge,                  // Tipo base para arestas: Edge<Data, Type>
  NodeProps,             // Props passadas aos componentes de n?s customizados
  EdgeProps,             // Props passadas aos componentes de arestas customizadas
  BuiltInNode,           // N?s embutidos ('default' | 'input' | 'output' | 'group')
  BuiltInEdge,           // Arestas embutidas ('default' | 'straight' | 'step' | 'smoothstep')
  NodeChange,            // Tipos de muta??o de n?s (posi??o, sele??o, dimens?o, etc.)
  EdgeChange,            // Tipos de muta??o de arestas
  OnNodesChange,         // Assinatura do handler onNodesChange
  OnEdgesChange,         // Assinatura do handler onEdgesChange
  OnConnect,             // Assinatura do handler onConnect
  Connection,            // Par?metros de uma nova conex?o
  ReactFlowInstance      // Inst?ncia imperativa do React Flow
} from '@xyflow/react';
```

---

## 2. Padr?o Recomendado: Uni?es Discriminadas (`AppNode` e `AppEdge`)

Em projetos de produ??o, defina um arquivo `types.ts` centralizando todos os tipos de n?s e arestas do sistema:

### `types.ts`

```typescript
import { Node, Edge, BuiltInNode } from '@xyflow/react';

// 1. Defini??o dos dados de cada n? customizado
export type SensorNodeData = {
  temperature: number;
  unit: 'celsius' | 'fahrenheit';
  location: string;
};

export type ActuatorNodeData = {
  state: 'open' | 'closed';
  power: number;
};

// 2. Defini??o do Tipo Exato de cada N? (com Type literal)
export type SensorNode = Node<SensorNodeData, 'sensor'>;
export type ActuatorNode = Node<ActuatorNodeData, 'actuator'>;

// 3. Uni?o Discriminada com n?s customizados e embutidos
export type AppNode = SensorNode | ActuatorNode | BuiltInNode;

// 4. Defini??o de Arestas Customizadas
export type DataEdgeData = {
  bandwidth: number;
  protocol: 'mqtt' | 'http';
};

export type DataEdge = Edge<DataEdgeData, 'dataTransfer'>;
export type AppEdge = DataEdge | Edge;
```

---

## 3. Tipando Componentes de N?s Customizados

Ao criar o componente de n? customizado, utilize `NodeProps<SensorNode>` para garantir que `data` seja tipado com precis?o.

```tsx
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { SensorNode } from './types';

function SensorNodeComponent({ id, data, selected }: NodeProps<SensorNode>) {
  return (
    <div style={{
      padding: 12,
      border: selected ? '2px solid #2563eb' : '1px solid #cbd5e1',
      borderRadius: 8,
      background: '#fff',
      fontSize: 12
    }}>
      <Handle type="target" position={Position.Top} />
      <div><strong>Sensor: {data.location}</strong></div>
      <div>Temperatura: {data.temperature}? {data.unit === 'celsius' ? 'C' : 'F'}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export const SensorNodeElement = memo(SensorNodeComponent);
```

---

## 4. Tipando o Componente `<ReactFlow />` e Hooks

Ao instanciar `<ReactFlow>`, passe `AppNode` e `AppEdge` como argumentos gen?ricos para hooks e handlers:

```tsx
import React from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useNodesData,
  NodeTypes,
  OnConnect
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { AppNode, AppEdge, SensorNode } from './types';
import { SensorNodeElement } from './SensorNode';

const nodeTypes: NodeTypes = {
  sensor: SensorNodeElement,
};

export function TypedFlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
  
  const { getNode, addNodes } = useReactFlow<AppNode, AppEdge>();
  const sensorData = useNodesData<SensorNode>('sensor-node-1');

  const onConnect: OnConnect = (connection) => {
    console.log('Nova conex?o:', connection.source, '->', connection.target);
  };

  const handleAddNewSensor = () => {
    const newSensor: AppNode = {
      id: `sensor_${Date.now()}`,
      type: 'sensor',
      position: { x: 100, y: 100 },
      data: {
        location: 'Sala de Servidores',
        temperature: 22.5,
        unit: 'celsius'
      }
    };
    addNodes(newSensor);
  };

  return (
    <div style={{ width: '100%', height: 600 }}>
      <button onClick={handleAddNewSensor}>Adicionar Sensor Tipado</button>
      <ReactFlow<AppNode, AppEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      />
    </div>
  );
}
```

---

## 5. Type Guards para N?s Polim?rficos

Ao iterar sobre `getNodes()`, utilize Type Guards para estreitar os tipos com seguran?a:

```typescript
import { AppNode, SensorNode, ActuatorNode } from './types';

export function isSensorNode(node: AppNode): node is SensorNode {
  return node.type === 'sensor';
}

export function isActuatorNode(node: AppNode): node is ActuatorNode {
  return node.type === 'actuator';
}

export function processNodes(nodes: AppNode[]) {
  nodes.forEach((node) => {
    if (isSensorNode(node)) {
      console.log(`Sensor em ${node.data.location}: ${node.data.temperature}`);
    } else if (isActuatorNode(node)) {
      console.log(`Atuador ligado com ${node.data.power}W`);
    }
  });
}
```
