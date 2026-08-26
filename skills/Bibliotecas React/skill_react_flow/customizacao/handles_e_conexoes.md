---
title: "Handles e Conexões no React Flow"
description: "Guia completo do componente Handle: portas de conexão, múltiplos handles por nó, handles dinâmicos com useUpdateNodeInternals, ConnectionMode e customização visual."
topics: ["handles", "conexoes", "ports", "multi-handles", "dynamic-handles", "useUpdateNodeInternals", "ConnectionMode"]
keywords: ["<Handle />", "Position", "isConnectable", "isValidConnection", "useUpdateNodeInternals", "useHandleConnections", "ConnectionMode.Loose", "ConnectionMode.Strict"]
source_scope: "React Flow Docs: Learn > Customization > Handles, API Reference > Components (Handle), Hooks"
---

# Handles e Conexões no React Flow

O componente `<Handle />` define os pontos de conexão de entrada (`target`) e saída (`source`) nos nós. Ele é o elemento fundamental que calcula as âncoras vetoriais onde as arestas iniciam e terminam.

---

## 1. Propriedades do Componente `<Handle />`

| Propriedade | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `type` | `'source' \| 'target'` | **Obrigatório** | Define se é porta de saída (`source`) ou entrada (`target`). |
| `position` | `Position` | **Obrigatório** | Posição física na borda do nó: `Position.Top`, `Right`, `Bottom`, `Left`. |
| `id` | `string` | `undefined` | **Obrigatório se houver múltiplos handles do mesmo tipo no nó.** Identifica a porta específica. |
| `isConnectable` | `boolean` | `true` | Se `false`, desabilita a criação de conexões neste handle. |
| `isConnectableStart` | `boolean` | `true` | Se `false`, o usuário não pode iniciar uma conexão arrastando a partir deste handle. |
| `isConnectableEnd` | `boolean` | `true` | Se `false`, o usuário não pode soltar uma conexão sobre este handle. |
| `isValidConnection` | `(connection: Connection) => boolean` | `undefined` | Função local de validação para este handle específico. |

---

## 2. A Regra dos Múltiplos Handles e o `id` Obrigatório

Se um nó possui mais de um handle do tipo `source` ou mais de um do tipo `target`, cada um **DEVE** possuir um `id` único.

Caso o `id` seja omitido em múltiplos handles, o React Flow não saberá a qual porta uma aresta pertence, gerando o erro: `Couldn't create edge for source/target handle`.

```tsx
// ✅ Múltiplos handles de saída com IDs explícitos
<Handle type="source" position={Position.Right} id="output-a" style={{ top: '25%' }} />
<Handle type="source" position={Position.Right} id="output-b" style={{ top: '75%' }} />
```

Na aresta correspondente:
```javascript
const edge = {
  id: 'e-a-to-2',
  source: 'node-1',
  sourceHandle: 'output-a', // Mapeia exatamente para a porta output-a
  target: 'node-2',
};
```

---

## 3. Modos de Conexão: `ConnectionMode.Strict` vs `ConnectionMode.Loose`

Por padrão (`ConnectionMode.Strict`), conexões só podem ser feitas de um `source` para um `target`.

Se você definir `connectionMode={ConnectionMode.Loose}` na tag `<ReactFlow />`, handles podem se conectar livremente (`source` para `source`, `target` para `target`, etc.):

```tsx
import { ReactFlow, ConnectionMode } from '@xyflow/react';

<ReactFlow
  connectionMode={ConnectionMode.Loose}
  ...
/>
```

---

## 4. Handles Dinâmicos em Tempo de Execução e `useUpdateNodeInternals`

Quando handles são adicionados, removidos ou reposicionados dinamicamente após a montagem inicial (ex: quando o usuário clica em "Adicionar Porta"), o React Flow não recalcula automaticamente as posições das âncoras na store interna.

**Para notificar o React Flow de que os handles mudaram, invoque o hook `useUpdateNodeInternals` passando o `id` do nó:**

```tsx
import React, { useState } from 'react';
import { Handle, Position, useUpdateNodeInternals, type NodeProps } from '@xyflow/react';

function DynamicPortsNode({ id }: NodeProps) {
  const [ports, setPorts] = useState(['porta-1']);
  const updateNodeInternals = useUpdateNodeInternals();

  const addPort = () => {
    const novaPorta = `porta-${ports.length + 1}`;
    setPorts([...ports, novaPorta]);
    
    // Notifica o React Flow para recalcular as posições dos handles
    updateNodeInternals(id);
  };

  return (
    <div className="bg-white border rounded p-3 shadow min-w-[160px]">
      <Handle type="target" position={Position.Left} />
      <div className="text-xs font-bold mb-2">Nó com Portas Dinâmicas</div>
      
      <div className="flex flex-col gap-2">
        {ports.map((portId, index) => (
          <div key={portId} className="relative text-xs bg-zinc-100 p-1 rounded">
            <span>{portId}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={portId}
              style={{ top: `${(index + 1) * 25}%` }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={addPort}
        className="nodrag mt-2 text-[10px] bg-blue-500 text-white px-2 py-1 rounded w-full"
      >
        + Adicionar Porta
      </button>
    </div>
  );
}
```

---

## 5. Hooks de Conexão de Handles

### 5.1. `useHandleConnections`
Descobre quais arestas estão conectadas a um handle específico dentro do custom node:

```tsx
import { useHandleConnections, type NodeProps } from '@xyflow/react';

function MonitoredNode({ id }: NodeProps) {
  // Retorna todas as conexões ativas na porta target 'input-main'
  const connections = useHandleConnections({
    type: 'target',
    id: 'input-main',
  });

  return (
    <div>
      <Handle type="target" position={Position.Top} id="input-main" />
      <div>Conexões ativas nesta porta: {connections.length}</div>
    </div>
  );
}
```

### 5.2. `useNodeConnections`
Obtém todas as conexões de todo o nó (tanto source quanto target):

```tsx
import { useNodeConnections } from '@xyflow/react';

function StatusNode() {
  const connections = useNodeConnections();
  const isConnected = connections.length > 0;

  return (
    <div className={isConnected ? 'border-emerald-500' : 'border-zinc-300'}>
      Status: {isConnected ? 'Online' : 'Desconectado'}
    </div>
  );
}
```

---

## 6. Custom Handles e O Nó Inteiro como Handle

Você pode transformar qualquer elemento HTML ou até o container inteiro do nó em um ponto conectável aplicando estilos de handle que cubram 100% da área:

### Exemplo: `NodeAsHandle.tsx`
```tsx
import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

function NodeAsHandle({ data }: NodeProps) {
  return (
    <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs shadow-lg cursor-pointer">
      {/* Handle invisível cobrindo todo o círculo */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-full !h-full !top-0 !left-0 !transform-none !rounded-full !opacity-0 !border-0"
      />
      
      <span>{data.label as string}</span>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-full !h-full !top-0 !left-0 !transform-none !rounded-full !opacity-0 !border-0"
      />
    </div>
  );
}

export default memo(NodeAsHandle);
```

---

## 7. Exemplo Completo com MultiPortas e Validação

```tsx
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Position,
  Handle,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type NodeProps,
  type Node,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

// Componente com Múltiplas Saídas
function RouterNode({ data }: NodeProps) {
  return (
    <div className="w-56 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-4 shadow-lg">
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-zinc-500" />
      
      <div className="font-bold text-xs text-zinc-800 dark:text-zinc-200 mb-3">
        🔀 {data.label as string}
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300">
          <span>Sucesso (200 OK)</span>
          <Handle
            type="source"
            position={Position.Right}
            id="handle-success"
            className="!w-2.5 !h-2.5 !bg-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded text-amber-700 dark:text-amber-300">
          <span>Aviso (Redirect)</span>
          <Handle
            type="source"
            position={Position.Right}
            id="handle-warn"
            className="!w-2.5 !h-2.5 !bg-amber-500"
          />
        </div>

        <div className="flex items-center justify-between bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded text-rose-700 dark:text-rose-300">
          <span>Erro (500 Fail)</span>
          <Handle
            type="source"
            position={Position.Right}
            id="handle-error"
            className="!w-2.5 !h-2.5 !bg-rose-500"
          />
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  router: RouterNode,
};

const initialNodes: Node[] = [
  { id: '1', type: 'input', position: { x: 50, y: 150 }, data: { label: 'Requisição HTTP' } },
  { id: '2', type: 'router', position: { x: 300, y: 100 }, data: { label: 'Roteador de API' } },
  { id: '3', type: 'output', position: { x: 650, y: 50 }, data: { label: 'Log Sucesso' } },
  { id: '4', type: 'output', position: { x: 650, y: 150 }, data: { label: 'Log Aviso' } },
  { id: '5', type: 'output', position: { x: 650, y: 250 }, data: { label: 'Alerta Slack Erro' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', sourceHandle: 'handle-success', target: '3', style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', sourceHandle: 'handle-warn', target: '4', style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e2-5', source: '2', sourceHandle: 'handle-error', target: '5', style: { stroke: '#ef4444', strokeWidth: 2 } },
];

export default function MultiPortApp() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```
