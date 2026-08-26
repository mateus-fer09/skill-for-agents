---
title: "Construindo um Grafo: Nós e Arestas Declarativos no React Flow"
description: "Estruturação completa e detalhada de nós e arestas: propriedades da API, tipos padrão (default, input, output, group), tipos de arestas e marcadores."
topics: ["construcao-grafo", "node-structure", "edge-structure", "declarative-graph", "markers", "MarkerType"]
keywords: ["Node props", "Edge props", "MarkerType", "Position", "expandParent", "zIndex", "bezier", "smoothstep"]
source_scope: "React Flow Docs: Learn > Concepts > Building a Flow, API Reference > Types (Node, Edge)"
---

# Construindo um Grafo: Nós e Arestas Declarativos

No React Flow, a estrutura do grafo é definida de maneira puramente declarativa através de arrays de objetos JavaScript: uma lista de **Nós (`Node[]`)** e uma lista de **Arestas (`Edge[]`)**.

---

## 1. Referência Completa de Propriedades de um `Node`

Cada objeto `Node` aceita as seguintes propriedades:

| Propriedade | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Obrigatório** | Identificador único exclusivo do nó no grafo. |
| `position` | `{ x: number, y: number }` | **Obrigatório** | Coordenadas no canvas (ou relativas ao nó pai). |
| `data` | `Record<string, any>` | `{}` | Objeto arbitrário contendo dados consumidos pelo componente do nó. |
| `type` | `string` | `'default'` | Tipo do nó: `'input'`, `'default'`, `'output'`, `'group'` ou chave customizada registrada em `nodeTypes`. |
| `style` | `React.CSSProperties` | `undefined` | Estilos CSS inline aplicados ao elemento container do nó. |
| `className` | `string` | `undefined` | Classes CSS aplicadas ao nó. |
| `targetPosition`| `Position` | `Position.Top` | Posição padrão dos handles de entrada (`Top`, `Right`, `Bottom`, `Left`). |
| `sourcePosition`| `Position` | `Position.Bottom`| Posição padrão dos handles de saída (`Top`, `Right`, `Bottom`, `Left`). |
| `hidden` | `boolean` | `false` | Se `true`, o nó e suas conexões são ocultados da renderização. |
| `selected` | `boolean` | `false` | Se `true`, o nó é renderizado no estado selecionado. |
| `draggable` | `boolean` | `true` | Se `false`, o usuário não pode mover o nó com o mouse. |
| `selectable` | `boolean` | `true` | Se `false`, o nó não pode ser selecionado. |
| `deletable` | `boolean` | `true` | Se `false`, o nó não pode ser removido pelo teclado (Backspace/Delete). |
| `connectable` | `boolean` | `true` | Se `false`, handles do nó não permitem novas conexões. |
| `parentId` | `string` | `undefined` | ID do nó pai para criar subfluxos hierárquicos e nós aninhados. |
| `extent` | `'parent' \| CoordinateExtent`| `undefined` | Limites de arraste: `'parent'` restringe ao container pai. |
| `expandParent` | `boolean` | `false` | Se `true`, mover o nó filho expande dinamicamente o tamanho do nó pai. |
| `zIndex` | `number` | `undefined` | Ordem de empilhamento de camadas visual do nó. |
| `origin` | `[number, number]` | `[0, 0]` | Ponto de ancoragem da posição do nó (`[0.5, 0.5]` para centralizado). |

---

## 2. Tipos de Nós Embutidos

O React Flow fornece quatro tipos de nós padrão:

1. **`'input'`**: Possui apenas um handle de saída (`source`). Usado como ponto de partida de fluxos.
2. **`'default'`**: Possui um handle de entrada (`target`) no topo e um de saída (`source`) na base.
3. **`'output'`**: Possui apenas um handle de entrada (`target`). Usado para nós finais.
4. **`'group'`**: Container retangular sem handles por padrão, usado para agrupar visualmente nós filhos via `parentId`.

---

## 3. Referência Completa de Propriedades de uma `Edge`

Cada objeto `Edge` conecta dois nós e aceita as seguintes configurações:

| Propriedade | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Obrigatório** | Identificador único exclusivo da aresta. |
| `source` | `string` | **Obrigatório** | `id` do nó de origem da conexão. |
| `target` | `string` | **Obrigatório** | `id` do nó de destino da conexão. |
| `sourceHandle` | `string` | `undefined` | `id` do handle específico no nó de origem (obrigatório se o nó tiver múltiplos handles de saída). |
| `targetHandle` | `string` | `undefined` | `id` do handle específico no nó de destino (obrigatório se o nó tiver múltiplos handles de entrada). |
| `type` | `string` | `'default'` | Tipo de curva: `'default'` / `'bezier'`, `'straight'`, `'step'`, `'smoothstep'` ou tipo customizado registrado em `edgeTypes`. |
| `animated` | `boolean` | `false` | Renderiza tracejado com animação contínua de fluxo. |
| `label` | `string \| ReactNode` | `undefined` | Rótulo de texto ou elemento React exibido no centro da aresta. |
| `labelStyle` | `React.CSSProperties` | `undefined` | Estilo CSS aplicado ao texto do label. |
| `labelShowBg` | `boolean` | `true` | Exibe caixa de fundo retangular sob o label para legibilidade. |
| `labelBgStyle` | `React.CSSProperties` | `undefined` | Estilo da caixa de fundo do label (ex: `{ fill: '#1e293b' }`). |
| `style` | `React.CSSProperties` | `undefined` | Estilos SVG inline aplicados ao caminho da linha (`stroke`, `strokeWidth`, `strokeDasharray`). |
| `markerStart` | `EdgeMarker \| MarkerType`| `undefined` | Marcador (seta/círculo) na extremidade de origem. |
| `markerEnd` | `EdgeMarker \| MarkerType`| `undefined` | Marcador (seta/círculo) na extremidade de destino. |
| `hidden` | `boolean` | `false` | Se `true`, oculta a aresta. |
| `deletable` | `boolean` | `true` | Se `false`, impede que a aresta seja excluída pelo usuário. |
| `zIndex` | `number` | `undefined` | Ordem de sobreposição da linha SVG. |

---

## 4. Tipos de Arestas e Marcadores

### 4.1. Tipos de Curvas Embutidas
- **`'bezier'`** (ou `'default'`): Curva suave de Bézier cúbica com transição natural.
- **`'straight'`**: Linha reta direta conectando os dois pontos `(sourceX, sourceY)` e `(targetX, targetY)`.
- **`'step'`**: Linha poligonal ortogonal com ângulos vivos de 90 graus.
- **`'smoothstep'`**: Linha poligonal ortogonal com cantos arredondados suaves (`borderRadius`).

### 4.2. Marcadores de Extremidade (`MarkerType`)
Importe o enum `MarkerType` de `@xyflow/react`:
- `MarkerType.Arrow`: Seta aberta tradicional.
- `MarkerType.ArrowClosed`: Seta triangular preenchida.

```javascript
import { MarkerType } from '@xyflow/react';

const edge = {
  id: 'e1-2',
  source: '1',
  target: '2',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#ef4444',
  },
};
```

---

## 5. Exemplo Completo: Grafo Declarativo Rico

```tsx
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Position,
  type Node,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const nodes: Node[] = [
  {
    id: 'n1',
    type: 'input',
    position: { x: 250, y: 20 },
    data: { label: '🚀 Início da Pipeline' },
    sourcePosition: Position.Bottom,
    style: {
      background: '#ecfdf5',
      borderColor: '#10b981',
      borderWidth: 2,
      fontWeight: 'bold',
    },
  },
  {
    id: 'n2',
    type: 'default',
    position: { x: 100, y: 140 },
    data: { label: '⚙️ Build & Lint' },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'n3',
    type: 'default',
    position: { x: 400, y: 140 },
    data: { label: '🧪 Testes E2E' },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'n4',
    type: 'output',
    position: { x: 250, y: 280 },
    data: { label: '📦 Deploy em Produção' },
    targetPosition: Position.Top,
    style: {
      background: '#eff6ff',
      borderColor: '#3b82f6',
      borderWidth: 2,
      fontWeight: 'bold',
    },
  },
];

const edges: Edge[] = [
  {
    id: 'e1-2',
    source: 'n1',
    target: 'n2',
    type: 'smoothstep',
    animated: true,
    label: 'branch: main',
    style: { stroke: '#10b981', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#10b981',
    },
  },
  {
    id: 'e1-3',
    source: 'n1',
    target: 'n3',
    type: 'smoothstep',
    animated: true,
    label: 'paralelo',
    style: { stroke: '#10b981', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#10b981',
    },
  },
  {
    id: 'e2-4',
    source: 'n2',
    target: 'n4',
    type: 'smoothstep',
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#64748b',
    },
  },
  {
    id: 'e3-4',
    source: 'n3',
    target: 'n4',
    type: 'smoothstep',
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#64748b',
    },
  },
];

export default function PipelineFlow() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        defaultNodes={nodes}
        defaultEdges={edges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```
