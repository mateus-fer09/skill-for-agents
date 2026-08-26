---
title: "Custom Nodes: Criando Nós Personalizados no React Flow"
description: "Guia completo de criação, tipagem TypeScript, registro, manipulação de estado, hooks internos e otimização de performance para Custom Nodes no React Flow."
topics: ["custom-nodes", "nodeTypes", "NodeProps", "custom-ui", "useNodesData", "useReactFlow", "useNodeId"]
keywords: ["nodeTypes", "NodeProps", "memo", "useNodesData", "useNodeId", "updateNodeData", "custom node", "nodrag"]
source_scope: "React Flow Docs: Learn > Customization > Custom Nodes, Computing Flows, API Reference > Types (NodeProps)"
---

# Custom Nodes: Criando Nós Personalizados no React Flow

Um dos maiores diferenciais do React Flow é permitir que qualquer componente React seja renderizado como um nó no grafo. Isso significa que você pode incluir formulários, gráficos, seletores de cor, reprodutores de áudio, widgets de IA e muito mais.

---

## 1. Anatomia e Props de um Custom Node

Quando o React Flow renderiza um nó customizado, ele injeta automaticamente o objeto de propriedades `NodeProps`:

| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `string` | O identificador único deste nó. |
| `data` | `T` (genérico) | Objeto com os dados passados na criação do nó. |
| `type` | `string` | O tipo do nó registrado em `nodeTypes`. |
| `selected` | `boolean` | `true` quando o nó está selecionado na tela. |
| `isConnectable` | `boolean` | `true` se os handles do nó podem receber novas conexões. |
| `positionAbsoluteX` | `number` | Posição X absoluta calculada no grafo. |
| `positionAbsoluteY` | `number` | Posição Y absoluta calculada no grafo. |
| `dragging` | `boolean` | `true` enquanto o nó está sendo ativamente arrastado pelo usuário. |
| `zIndex` | `number` | Ordem de empilhamento de camadas visual do nó. |

---

## 2. A Regra de Ouro: Registro e Memoização de `nodeTypes`

> **⚠️ ATENÇÃO - ERRO MAIS COMUM NO REACT FLOW**:
> **NUNCA** declare o objeto `nodeTypes` dentro da função do componente sem `useMemo`. 
> Se você declarar `const nodeTypes = { meuTipo: MeuComponente }` dentro do componente pai, um novo objeto será criado a cada renderização, fazendo o React Flow desmontar e remontar todos os nós da tela, destruindo o estado interno e perdendo o foco de inputs!

### Forma Incorreta ❌
```jsx
function BadFlow() {
  // ❌ NUNCA FAÇA ISSO: O objeto é recriado a cada render
  const nodeTypes = { custom: MyCustomNode };
  return <ReactFlow nodeTypes={nodeTypes} ... />;
}
```

### Formas Corretas ✅

#### Opção A: Declarar fora do componente (Recomendado)
```jsx
// ✅ Declarado estaticamente fora do componente
const nodeTypes = {
  colorPicker: ColorPickerNode,
  card: CardNode,
};

function GoodFlow() {
  return <ReactFlow nodeTypes={nodeTypes} ... />;
}
```

#### Opção B: Memoizar com `useMemo` (se depender de props)
```jsx
function GoodFlow({ dynamicProp }) {
  const nodeTypes = useMemo(() => ({
    colorPicker: ColorPickerNode,
  }), []);

  return <ReactFlow nodeTypes={nodeTypes} ... />;
}
```

---

## 3. Tipagem TypeScript Estrita

Para máxima segurança de tipos, defina a tipagem com `Node` e `NodeProps`:

```tsx
import { type Node, type NodeProps } from '@xyflow/react';

// 1. Defina a interface dos dados do nó
export type ColorPickerData = {
  label: string;
  color: string;
  onChange?: (color: string) => void;
};

// 2. Crie o tipo de nó especializado
export type ColorPickerNodeType = Node<ColorPickerData, 'colorPicker'>;

// 3. Tipagem do componente
export default function ColorPickerNode({ id, data, selected }: NodeProps<ColorPickerNodeType>) {
  // data.color tem autocompletion completo!
  return <div>{data.label}: {data.color}</div>;
}
```

---

## 4. Manipulação de Estado e Comunicação entre Nós

Existem três maneiras recomendadas para atualizar dados de nós:

### 4.1. Atualizando o `data` via `useReactFlow().updateNodeData`
```tsx
import { useReactFlow } from '@xyflow/react';

function CustomNode({ id, data }: NodeProps) {
  const { updateNodeData } = useReactFlow();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { color: event.target.value });
  };

  return <input className="nodrag" value={data.color as string} onChange={handleChange} />;
}
```

### 4.2. Lendo Dados Reativos de Outros Nós com `useNodesData`
Se o Nó B precisa reagir imediatamente aos dados do Nó A:

```tsx
import { useNodesData } from '@xyflow/react';

function ConsumerNode({ id }: NodeProps) {
  // Lê dados do nó de origem 'node-1' de forma reativa
  const sourceNodeData = useNodesData<ColorPickerNodeType>('node-1');

  return (
    <div>
      Cor recebida do Nó 1: {sourceNodeData?.data?.color ?? '#ffffff'}
    </div>
  );
}
```

---

## 5. Três Exemplos Práticos Completos

### Exemplo 1: `ColorPickerNode.tsx`
```tsx
import React, { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow, type NodeProps, type Node } from '@xyflow/react';

export type ColorPickerData = {
  label: string;
  color: string;
};

export type ColorPickerNode = Node<ColorPickerData, 'colorPicker'>;

function ColorPickerNode({ id, data, isConnectable }: NodeProps<ColorPickerNode>) {
  const { updateNodeData } = useReactFlow();

  const handleColorChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { color: evt.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-md dark:border-zinc-800 dark:bg-zinc-900 min-w-[180px]">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-zinc-400"
      />

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {data.label}
        </span>
        <div
          className="h-5 w-5 rounded-full border border-black/10 shadow-inner"
          style={{ backgroundColor: data.color }}
        />
      </div>

      <div className="mt-2 flex items-center gap-2">
        <input
          type="color"
          value={data.color}
          onChange={handleColorChange}
          className="nodrag h-7 w-full cursor-pointer rounded border border-zinc-300 dark:border-zinc-700 bg-transparent p-0.5"
        />
        <span className="text-[11px] font-mono text-zinc-500 uppercase">
          {data.color}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-blue-500"
      />
    </div>
  );
}

export default memo(ColorPickerNode);
```

### Exemplo 2: `NumberInputNode.tsx` (Nó Computacional)
```tsx
import React, { memo } from 'react';
import { Handle, Position, useReactFlow, type NodeProps, type Node } from '@xyflow/react';

export type NumberInputData = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
};

export type NumberInputNode = Node<NumberInputData, 'numberInput'>;

function NumberInputNode({ id, data }: NodeProps<NumberInputNode>) {
  const { updateNodeData } = useReactFlow();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { value: parseFloat(e.target.value) || 0 });
  };

  return (
    <div className="rounded-xl border-2 border-indigo-500/30 bg-slate-950 p-4 text-white shadow-xl min-w-[200px]">
      <Handle type="target" position={Position.Left} className="!bg-indigo-400" />
      
      <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
        {data.label}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <input
          type="number"
          value={data.value}
          min={data.min ?? 0}
          max={data.max ?? 100}
          step={data.step ?? 1}
          onChange={onChange}
          className="nodrag w-20 rounded bg-slate-900 px-2 py-1 text-sm font-mono border border-slate-700 focus:border-indigo-500 outline-none"
        />
        <input
          type="range"
          value={data.value}
          min={data.min ?? 0}
          max={data.max ?? 100}
          step={data.step ?? 1}
          onChange={onChange}
          className="nodrag nopan w-full accent-indigo-500 cursor-pointer"
        />
      </div>

      <Handle type="source" position={Position.Right} className="!bg-indigo-400" />
    </div>
  );
}

export default memo(NumberInputNode);
```

### Exemplo 3: `App.tsx` Registrando e Utilizando os Nós Customizados
```tsx
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
} from '@xyflow/react';

import ColorPickerNode, { type ColorPickerNode as ColorNodeType } from './ColorPickerNode';
import NumberInputNode, { type NumberInputNode as NumberNodeType } from './NumberInputNode';
import '@xyflow/react/dist/style.css';

// Registro FORA do componente
const nodeTypes = {
  colorPicker: ColorPickerNode,
  numberInput: NumberInputNode,
};

type AppNode = ColorNodeType | NumberNodeType;

const initialNodes: AppNode[] = [
  {
    id: 'color-1',
    type: 'colorPicker',
    position: { x: 100, y: 100 },
    data: { label: 'Cor Primária', color: '#6366f1' },
  },
  {
    id: 'num-1',
    type: 'numberInput',
    position: { x: 400, y: 100 },
    data: { label: 'Intensidade / Opacidade', value: 75, min: 0, max: 100 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'color-1', target: 'num-1', animated: true },
];

export default function CustomNodesApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
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
