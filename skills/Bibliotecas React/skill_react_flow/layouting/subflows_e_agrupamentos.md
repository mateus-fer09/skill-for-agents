---
title: "Subflows e Agrupamentos no React Flow"
description: "Guia completo de nós aninhados, subfluxos, agrupamentos com parentId, coordenadas relativas, extent: 'parent' e expandParent no React Flow."
topics: ["subflows", "agrupamentos", "parentId", "extent-parent", "expandParent", "nested-nodes", "group-nodes"]
keywords: ["parentId", "extent: 'parent'", "expandParent: true", "type: 'group'", "relative coordinates", "zIndex"]
source_scope: "React Flow Docs: Learn > Layouting > Sub Flows, Examples > Labeled Group Node"
---

# Subflows e Agrupamentos no React Flow

Um **Subflow (Subfluxo)** no React Flow é um fluxo de nós contido dentro de outro nó pai. Esse recurso é a base para criar agrupamentos lógicos de etapas, zonas de isolamento, microsserviços, raias de processo (swimlanes) e nós compostos.

---

## 1. A Propriedade `parentId` e Coordenadas Relativas

Para transformar um nó em filho de outro nó, atribua a propriedade `parentId` com o `id` do nó pai:

```javascript
const nodes = [
  // 1. Nó Pai (Container do Grupo)
  {
    id: 'group-1',
    type: 'group',
    position: { x: 100, y: 100 },
    style: { width: 400, height: 250, backgroundColor: 'rgba(240, 240, 240, 0.4)' },
    data: { label: 'Grupo de Processamento' },
  },
  // 2. Nó Filho A (Posicionado relativo ao canto superior-esquerdo do pai)
  {
    id: 'child-1',
    parentId: 'group-1',
    position: { x: 20, y: 40 }, // Coordenadas relativas a (100, 100) do pai
    data: { label: 'Etapa 1.1' },
  },
  // 3. Nó Filho B
  {
    id: 'child-2',
    parentId: 'group-1',
    position: { x: 20, y: 140 },
    data: { label: 'Etapa 1.2' },
  },
];
```

> **Comportamento Fundamental**: Quando o usuário arrasta o nó pai (`group-1`), todos os nós filhos são movidos juntos automaticamente mantendo suas posições relativas.

---

## 2. A REGRA CRÍTICA: Ordem dos Nós no Array

> **⚠️ REGRA OBRIGATÓRIA**:
> No array de `nodes`, os **nós pais DEVEM aparecer antes de seus nós filhos**!
> Se um nó filho for listado no array antes do seu `parentId`, o React Flow não conseguirá calcular a posição absoluta corretamente e emitirá avisos no console.

```javascript
// ✅ Correto: Pai antes dos filhos
const nodes = [parentA, childA1, childA2, parentB, childB1];

// ❌ Incorreto: Filho antes do pai
const nodes = [childA1, parentA, childA2];
```

---

## 3. Restringindo o Arraste com `extent: 'parent'`

Por padrão, um nó filho pode ser arrastado para fora das bordas visuais do nó pai.

Ao adicionar `extent: 'parent'` ao nó filho, o React Flow restringe o movimento do nó para que ele permaneça estritamente dentro da caixa delimitadora (`bounding box`) do nó pai:

```javascript
{
  id: 'child-locked',
  parentId: 'group-1',
  extent: 'parent', // 🔒 O nó não pode ser arrastado para fora do pai
  position: { x: 30, y: 50 },
  data: { label: 'Filho Preso no Container' },
}
```

---

## 4. Expansão Automática com `expandParent: true`

Se você deseja permitir que o usuário arraste o nó filho além dos limites e que o container pai se redimensione automaticamente para acomodá-lo, use `expandParent: true`:

```javascript
{
  id: 'child-resizable',
  parentId: 'group-1',
  expandParent: true, // 🔄 O pai aumenta de tamanho ao arrastar o filho para as bordas
  position: { x: 30, y: 50 },
  data: { label: 'Filho que Expande o Pai' },
}
```

---

## 5. Custom Group Nodes (Nós de Grupo com Cabeçalho e Ações)

Embora o React Flow inclua o tipo `type: 'group'`, você pode criar componentes customizados de grupo com títulos, ícones de status, botões de colapso e cores dinâmicas:

### `GroupNode.tsx`
```tsx
import React, { memo } from 'react';
import { type NodeProps } from '@xyflow/react';

function GroupNode({ data }: NodeProps) {
  return (
    <div className="h-full w-full rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20 p-3 shadow-inner">
      <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-800/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            {data.title as string || 'Grupo de Microsserviços'}
          </span>
        </div>
        <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-mono font-semibold">
          {data.badge as string || 'VPC-1'}
        </span>
      </div>
    </div>
  );
}

export default memo(GroupNode);
```

---

## 6. Exemplo Completo: Subfluxo Hierárquico Rico

```tsx
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Position,
  type Node,
  type Edge,
} from '@xyflow/react';

import GroupNode from './GroupNode';
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  customGroup: GroupNode,
};

const initialNodes: Node[] = [
  // 1. Nó Fora do Grupo (Origem)
  {
    id: 'node-ext-1',
    type: 'input',
    position: { x: 50, y: 150 },
    data: { label: '🌐 Entrada Web (API Gateway)' },
    sourcePosition: Position.Right,
  },

  // 2. Nó Pai (Grupo 1)
  {
    id: 'group-auth',
    type: 'customGroup',
    position: { x: 300, y: 50 },
    style: { width: 320, height: 260 },
    data: { title: 'Cluster de Autenticação (OAuth2)', badge: 'Private Subnet' },
  },

  // 3. Filhos do Grupo 1 (parentId: 'group-auth')
  {
    id: 'auth-validator',
    parentId: 'group-auth',
    extent: 'parent',
    position: { x: 30, y: 50 },
    data: { label: '🔑 Validação JWT' },
    targetPosition: Position.Left,
    sourcePosition: Position.Bottom,
  },
  {
    id: 'auth-db',
    parentId: 'group-auth',
    extent: 'parent',
    position: { x: 30, y: 160 },
    data: { label: '🗄️ Sessões Redis' },
    targetPosition: Position.Top,
    sourcePosition: Position.Right,
  },

  // 4. Nó Fora do Grupo (Destino)
  {
    id: 'node-ext-2',
    type: 'output',
    position: { x: 700, y: 210 },
    data: { label: '🚀 Processamento do Pedido' },
    targetPosition: Position.Left,
  },
];

const initialEdges: Edge[] = [
  // Conexão do nó externo para dentro do subfluxo
  {
    id: 'e-ext-to-child',
    source: 'node-ext-1',
    target: 'auth-validator',
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  // Conexão interna entre os dois nós filhos
  {
    id: 'e-child-to-child',
    source: 'auth-validator',
    target: 'auth-db',
    type: 'smoothstep',
    style: { stroke: '#6366f1', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
  },
  // Conexão de dentro do subfluxo para o destino externo
  {
    id: 'e-child-to-ext',
    source: 'auth-db',
    target: 'node-ext-2',
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

export default function SubflowApp() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
```
