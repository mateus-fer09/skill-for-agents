---
title: "Quickstart e Boilerplate Básico do React Flow"
description: "Construção passo a passo do primeiro fluxo interativo de nós e arestas, explorando nós iniciais, arestas, viewport e código fonte do boilerplate completo."
topics: ["quickstart", "boilerplate", "initialNodes", "initialEdges", "ReactFlow", "hello-world"]
keywords: ["ReactFlow", "initialNodes", "initialEdges", "defaultNodes", "defaultEdges", "fitView", "Position"]
source_scope: "React Flow Docs: Learn > Quick Start > Usage & Result"
---

# Quickstart e Boilerplate Básico do React Flow

Este guia conduz pela criação do primeiro grafo funcional interativo utilizando o `@xyflow/react`. Vamos entender os conceitos de nós, arestas e como montar uma estrutura de código limpa e modular.

---

## 1. Anatomia do Primeiro Grafo

Um grafo no React Flow é composto por três pilares essenciais:
1. **Nós (`Nodes`)**: Os blocos/vértices visuais que representam entidades, ações ou dados.
2. **Arestas (`Edges`)**: As linhas de conexão que representam relacionamentos, dependências ou fluxo de dados entre nós.
3. **Viewport / Canvas**: A área infinita com suporte nativo a zoom e pan (arraste de tela).

```
 +-----------------+              +-----------------+
 |   1. Entrada    |  =========>  | 2. Processador  |
 | (x: 0, y: 0)    |  (Edge e1-2) | (x: 0, y: 100)  |
 +-----------------+              +-----------------+
```

---

## 2. Estrutura de um Objeto `Node`

Cada nó em um array de nós precisa obrigatoriamente de:
- `id` (string única): O identificador do nó.
- `position` (`{ x: number, y: number }`): As coordenadas iniciais no plano cartesiano do grafo.
- `data` (`object`): Objeto contendo os dados passados para renderização (no nó padrão, a propriedade `data.label` é exibida como texto).

```javascript
const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Olá React Flow' },
    type: 'input', // opcional: 'input', 'default', 'output' ou tipo customizado
  },
  {
    id: '2',
    position: { x: 0, y: 120 },
    data: { label: 'Nó de Destino' },
  },
];
```

---

## 3. Estrutura de um Objeto `Edge`

Cada aresta conecta um nó de origem a um nó de destino:
- `id` (string única): O identificador da aresta.
- `source` (string): O `id` do nó de origem.
- `target` (string): O `id` do nó de destino.
- `animated` (boolean, opcional): Exibe uma animação de fluxo na linha.
- `type` (string, opcional): O tipo da curva (`default`, `straight`, `step`, `smoothstep`).

```javascript
const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    label: 'Conexão Ativa',
  },
];
```

---

## 4. Boilerplate Completo e Funcional

Abaixo está o conjunto completo e intacto de arquivos que formam uma aplicação React Flow pronta para execução.

### `App.jsx`
```jsx
import React from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: '1. Início do Processo' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: '2. Etapa de Validação' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: '3. Execução Paralela' },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: '4. Fim do Fluxo' },
    position: { x: 250, y: 220 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4', animated: true },
  { id: 'e3-4', source: '3', target: '4' },
];

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
```

### `index.css`
```css
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

#app {
  width: 100vw;
  height: 100vh;
}
```

### `index.html`
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Flow - Quickstart Boilerplate</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./index.jsx"></script>
  </body>
</html>
```

### `index.jsx`
```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.querySelector('#app');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 5. Versão Tipada em TypeScript (`App.tsx`)

Para projetos TypeScript, utilize os tipos genéricos `Node` e `Edge` exportados diretamente pelo `@xyflow/react`:

```tsx
import React from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

// Tipagem customizada para os dados do nó
interface CustomNodeData {
  label: string;
  descricao?: string;
}

const initialNodes: Node<CustomNodeData>[] = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 50 },
    data: { label: 'Origem de Dados', descricao: 'Carrega payload inicial' },
  },
  {
    id: '2',
    position: { x: 250, y: 180 },
    data: { label: 'Transformação', descricao: 'Aplica filtros' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
];

export default function App(): React.JSX.Element {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

---

## 6. Fluxo Não-Controlado vs Fluxo Controlado

No exemplo acima, utilizamos `defaultNodes` e `defaultEdges`. Esse padrão é chamado de **Uncontrolled Flow** (Fluxo Não-Controlado):
- O React Flow gerencia o estado interno de movimentação e seleção dos nós.
- É ideal para visualizações estáticas ou diagramas que não precisam persistir alterações em banco de dados ou estado global.

Quando precisamos reagir a conexões, exclusões, drag de nós e salvar posições, migramos para o padrão **Controlled Flow** (Fluxo Controlado) com `nodes`, `edges`, `onNodesChange`, `onEdgesChange` e `onConnect`, detalhado na seção de interatividade.

---

## 7. Boas Práticas Iniciais

1. **Sempre use strings para IDs**: IDs numéricos (`1` em vez de `'1'`) podem causar comportamentos inesperados ao pesquisar nós ou arestas.
2. **Ative `fitView`**: A prop `fitView` calcula automaticamente o zoom e o centro da tela para enquadrar todos os nós perfeitamente no primeiro carregamento.
3. **Evite nós sobrepostos**: Atribua espaçamentos mínimos de pelo menos `100px` a `150px` entre coordenadas `x` e `y`.
