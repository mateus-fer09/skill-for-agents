---
title: "Guia de Migra??o para o React Flow 12 (@xyflow/react)"
description: "Guia de migra??o completo e exaustivo do React Flow v11 (reactflow) para o React Flow v12 (@xyflow/react), detalhando o novo nome de pacote, mudan?as de tipagem TypeScript, novas propriedades de dimens?es (measured), SSR e novos hooks."
topics:
  - "Novo Nome de Pacote: @xyflow/react e @xyflow/system"
  - "Novo Atributo node.measured (width e height)"
  - "Renomea??o de onEdgeUpdate para onReconnect"
  - "Renomea??o de parentNode para parentId"
  - "Tipagem TypeScript com Discriminated Unions"
  - "Novos Hooks de Reatividade: useNodesData e useHandleConnections"
  - "Suporte a Server Side Rendering (SSR)"
  - "Checklist Passo a Passo de Migra??o"
keywords:
  - "migration v12"
  - "@xyflow/react"
  - "reactflow v12"
  - "node.measured"
  - "onReconnect"
  - "parentId"
  - "useNodesData"
  - "breaking changes"
source_scope: "Learn / Advanced Use / Migrate to React Flow 12"
---

# Guia de Migra??o para o React Flow 12 (`@xyflow/react`)

O **React Flow v12** ? uma das maiores atualiza??es da hist?ria da biblioteca, trazendo suporte a **Server Side Rendering (SSR)**, arquitetura reativa para computa??o de fluxos, sistema de theming com CSS variables e reestrutura??o do pacote npm para o ecossistema `@xyflow`.

Este guia fornece todas as etapas necess?rias para atualizar uma base de c?digo existente do React Flow v11 (`reactflow`) para o React Flow v12 (`@xyflow/react`).

---

## 1. Novo Nome do Pacote NPM

O pacote `reactflow` foi renomeado para `@xyflow/react`:

```bash
# 1. Remova a vers?o antiga
npm uninstall reactflow

# 2. Instale o novo pacote v12
npm install @xyflow/react
```

### Atualiza??o dos Imports

```tsx
// ? ANTES (v11)
import ReactFlow, { useReactFlow, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

// ? AGORA (v12)
import { ReactFlow, useReactFlow, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
```

---

## 2. Nova Estrutura de Dimens?es: `node.measured`

Na v11, larguras e alturas medidas pelo navegador sobrescreviam as propriedades `node.width` e `node.height`. Na v12:
- `node.width` e `node.height`: Dimens?es **iniciais/definidas pelo usu?rio**.
- `node.measured.width` e `node.measured.height`: Dimens?es **reais medidas no DOM**.

```tsx
// ? ANTES (v11)
const w = node.width;
const h = node.height;

// ? AGORA (v12)
const w = node.measured?.width ?? node.width;
const h = node.measured?.height ?? node.height;
```

---

## 3. Renomea??es de Propriedades e APIs

### `onEdgeUpdate` renomeado para `onReconnect`

```tsx
// ? ANTES (v11)
<ReactFlow
  onEdgeUpdate={onEdgeUpdate}
  onEdgeUpdateStart={onEdgeUpdateStart}
  onEdgeUpdateEnd={onEdgeUpdateEnd}
  edgeUpdaterRadius={10}
/>

// ? AGORA (v12)
<ReactFlow
  onReconnect={onReconnect}
  onReconnectStart={onReconnectStart}
  onReconnectEnd={onReconnectEnd}
  reconnectRadius={10}
/>
```

### `parentNode` renomeado para `parentId`

Para subflows e n?s agrupados:

```tsx
// ? ANTES (v11)
{ id: '2', parentNode: '1', position: { x: 10, y: 10 } }

// ? AGORA (v12)
{ id: '2', parentId: '1', position: { x: 10, y: 10 } }
```

### `nodeInternals` renomeado para `nodeLookup`

Na store interna Zustand:

```tsx
// ? ANTES (v11)
const nodeInternals = store.getState().nodeInternals;

// ? AGORA (v12)
const nodeLookup = store.getState().nodeLookup; // Map<string, InternalNode>
```

---

## 4. Mudan?as em TypeScript

Na v12, a tipagem de n?s ? baseada em uni?es discriminadas pelo campo literal `type`:

```typescript
// ? Padr?o v12
import { Node, Edge, BuiltInNode } from '@xyflow/react';

export type CustomNode = Node<{ label: string; count: number }, 'custom'>;
export type AppNode = CustomNode | BuiltInNode;

export type AppEdge = Edge;
```

---

## 5. Novos Recursos Dispon?veis no v12

Ao migrar para a v12, voc? ganha acesso aos seguintes recursos nativos:

1. **`useNodesData(id)`**: Reatividade granular para assinar dados de outros n?s sem re-renderizar todo o grafo.
2. **`useHandleConnections({ type, id })`**: Inspe??o de conex?es ativas anexadas a portas espec?ficas.
3. **`useConnection()`**: Dados da conex?o sendo arrastada em tempo real.
4. **Modo Escuro Nativo (`colorMode="dark" | "light" | "system"`)**: Suporte a temas via CSS variables.
5. **Server Side Rendering (SSR)**: Pr?-renderiza??o no Next.js App Router e Remix com `<ReactFlowProvider initialWidth={...} initialHeight={...}>`.

---

## 6. Tabela Resumo de De-Para (v11 -> v12)

| Recurso / Propriedade | React Flow v11 (`reactflow`) | React Flow v12 (`@xyflow/react`) |
| :--- | :--- | :--- |
| **Pacote NPM** | `reactflow` | `@xyflow/react` |
| **Import CSS** | `'reactflow/dist/style.css'` | `'@xyflow/react/dist/style.css'` |
| **N? Pai / Subflow** | `node.parentNode` | `node.parentId` |
| **Reconex?o de Arestas** | `onEdgeUpdate` | `onReconnect` |
| **In?cio de Reconex?o** | `onEdgeUpdateStart` | `onReconnectStart` |
| **Fim de Reconex?o** | `onEdgeUpdateEnd` | `onReconnectEnd` |
| **Raio de Reconex?o** | `edgeUpdaterRadius` | `reconnectRadius` |
| **Dimens?es Medidas no DOM** | `node.width` / `node.height` | `node.measured.width` / `node.measured.height` |
| **Store Interna de N?s** | `state.nodeInternals` | `state.nodeLookup` (`Map`) |
| **Ponto de Origem do N?** | Padr?o `[0, 0]` (topo-esquerda) | Suporte nativo a `nodeOrigin={[0.5, 0.5]}` |
