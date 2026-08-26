---
title: "Guia de Migra??o para o React Flow v11 (reactflow)"
description: "Guia completo de atualiza??o do React Flow v10 (react-flow-renderer) para o React Flow v11 (reactflow), detalhando a unifica??o do useReactFlow, applyNodeChanges, novas APIs de viewport e remo??o de entrypoints legados."
topics:
  - "Novo Pacote ?nico: reactflow"
  - "Import Obrigat?rio do CSS"
  - "Unifica??o de useZoomPanHelper em useReactFlow"
  - "defaultViewport unificando defaultPosition e defaultZoom"
  - "applyNodeChanges e applyEdgeChanges"
  - "useNodesState e useEdgesState"
keywords:
  - "migration v11"
  - "reactflow v11"
  - "react-flow-renderer"
  - "useReactFlow"
  - "defaultViewport"
  - "applyNodeChanges"
  - "applyEdgeChanges"
source_scope: "Reference / Migration / Migrate to v11"
---

# Guia de Migra??o para o React Flow v11 (`reactflow`)

O lan?amento do **React Flow v11** marcou a transi??o hist?rica do antigo pacote `react-flow-renderer` para o pacote unificado `reactflow`, al?m de consolidar helpers de manipula??o de viewport dentro de `useReactFlow()`.

---

## 1. Mudan?a de Pacote NPM

O pacote `react-flow-renderer` foi descontinuado em favor do `reactflow`:

```bash
# ? Vers?o legada
npm uninstall react-flow-renderer

# ? Instala??o da v11
npm install reactflow
```

---

## 2. Importa??o Obrigat?ria de CSS

Na v10 existia um entrypoint experimental `nocss`. Na v11, o CSS tornou-se 100% obrigat?rio:

```tsx
// ? Import obrigat?rio em qualquer aplica??o React Flow v11
import 'reactflow/dist/style.css';
```

---

## 3. `defaultPosition` e `defaultZoom` Unificados em `defaultViewport`

```tsx
// ? ANTES (v10)
<ReactFlow
  defaultPosition={[100, 100]}
  defaultZoom={1.5}
/>

// ? AGORA (v11)
<ReactFlow
  defaultViewport={{ x: 100, y: 100, zoom: 1.5 }}
/>
```

---

## 4. Unifica??o de Helpers de Viewport no `useReactFlow()`

Na v10, era necess?rio importar o hook separado `useZoomPanHelper` para controlar o zoom. Na v11, todos esses m?todos foram incorporados ao `useReactFlow()`:

```tsx
// ? ANTES (v10)
import { useZoomPanHelper } from 'react-flow-renderer';

const { zoomIn, zoomOut, setCenter, fitView, project } = useZoomPanHelper();

// ? AGORA (v11)
import { useReactFlow } from 'reactflow';

const { zoomIn, zoomOut, setCenter, fitView, project } = useReactFlow();
```

---

## 5. Introdu??o de `useNodesState()` e `useEdgesState()`

A v11 introduziu hooks auxiliares para simplificar a cria??o de fluxos controlados r?pidos:

```tsx
import { ReactFlow, useNodesState, useEdgesState } from 'reactflow';

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    />
  );
}
```

---

## 6. Tabela Resumo de Mudan?as (v10 -> v11)

| Recurso | React Flow v10 (`react-flow-renderer`) | React Flow v11 (`reactflow`) |
| :--- | :--- | :--- |
| **Pacote NPM** | `react-flow-renderer` | `reactflow` |
| **Estilos CSS** | `import 'react-flow-renderer/dist/style.css'` | `import 'reactflow/dist/style.css'` |
| **Viewport Inicial** | `defaultPosition` e `defaultZoom` | `defaultViewport={{ x, y, zoom }}` |
| **Hook de C?mera** | `useZoomPanHelper()` | Unificado em `useReactFlow()` |
| **Helper de Estado** | Gest?o manual com `useState` | `useNodesState` e `useEdgesState` |
