---
title: "Instalação e Setup do React Flow (@xyflow/react)"
description: "Guia completo de instalação do pacote @xyflow/react, configuração de ambiente React 18+, importação de folhas de estilo e inicialização com templates modernos (Vite, Next.js)."
topics: ["instalacao", "setup", "xyflow-react", "templates", "vite", "nextjs", "css-import"]
keywords: ["npm install @xyflow/react", "react flow v12", "degit xyflow", "style.css", "container dimensions", "vite-react-flow-template"]
source_scope: "React Flow Docs: Learn > Quick Start > Installation & Templates, Getting Started with React Flow UI"
---

# Instalação e Setup do React Flow

O React Flow (distribuído sob o pacote oficial `@xyflow/react` a partir da versão 12) é a biblioteca líder para criação de interfaces interativas baseadas em nós, fluxogramas, editores de automação, diagramas técnicos e grafos dinâmicos no ecossistema React.

---

## 1. Do Pacote Legado `reactflow` para o `@xyflow/react`

A partir da versão 12, a equipe da xyflow consolidou a biblioteca sob o escopo `@xyflow/react`, unificando a arquitetura entre o React Flow e o Svelte Flow (`@xyflow/svelte`). 

| Propriedade | Pacote Moderno (v12+) | Pacote Legado (v11 e inferiores) |
| :--- | :--- | :--- |
| **Nome no NPM** | `@xyflow/react` | `reactflow` |
| **Folha de Estilos** | `@xyflow/react/dist/style.css` | `reactflow/dist/style.css` |
| **Suporte a SSR** | Nativo (SSR / SSG simplificado) | Exigia wrappers complexos |
| **Variáveis CSS** | Prefixadas com `--xy-*` | Prefixadas com `--react-flow-*` |
| **Suporte a Dark Mode** | Prop `colorMode="light" | "dark" | "system"` | Apenas via CSS manual |

---

## 2. Requisitos de Ambiente

- **Node.js**: Versão `18.0.0` ou superior.
- **React**: Versão `18.0.0` ou superior (total compatibilidade com React 18 concorrente e React 19).
- **TypeScript** (opcional, recomendado): Versão `5.0` ou superior.

---

## 3. Instalação via Gerenciadores de Pacotes

Execute o comando de instalação de acordo com o gerenciador de pacotes utilizado em seu projeto:

### npm
```bash
npm install @xyflow/react
```

### yarn
```bash
yarn add @xyflow/react
```

### pnpm
```bash
pnpm add @xyflow/react
```

### bun
```bash
bun add @xyflow/react
```

---

## 4. Importação Obrigatória de Estilos

O React Flow depende de regras fundamentais de CSS para o cálculo de geometria, posicionamento absoluto de nós, renderização de SVG de conexões, mini-mapas e barras de ferramentas.

No ponto de entrada de sua aplicação (ex: `App.jsx`, `App.tsx`, `index.jsx` ou no layout raiz do Next.js), faça a importação:

```javascript
import '@xyflow/react/dist/style.css';
```

> **Aviso Importante**: Sem a importação de `@xyflow/react/dist/style.css`, os nós não serão renderizados corretamente, os handles não ficarão ancorados nas posições corretas e a viewport de navegação não responderá aos eventos de mouse/toque.

Caso você prefira estilizar tudo do zero e queira apenas as regras estruturais mínimas (sem estilos visuais padrão de bordas e cores), você pode importar a versão base:

```javascript
import '@xyflow/react/dist/base.css';
```

---

## 5. Requisito Crítico: Dimensões do Container DOM

O React Flow utiliza uma medição do container pai (`ResizeObserver`) para renderizar a viewport, calcular o centro do grafo e posicionar nós. 

**O elemento pai direto do componente `<ReactFlow />` DEVE ter largura (`width`) e altura (`height`) explicitamente definidas em pixels, porcentagem ou unidades de viewport (`vw`/`vh`).**

### Exemplo Incorreto (Tela em Branco)
```jsx
// ❌ O elemento pai não possui altura definida. O React Flow terá altura 0 e nada será exibido.
function BrokenFlow() {
  return (
    <div>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}
```

### Exemplo Correto
```jsx
// ✅ Container com largura e altura explícitas via style ou classes CSS
function WorkingFlow() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}
```

---

## 6. Inicialização com Templates Oficiais

Se você deseja iniciar um projeto novo pronto para produção, a equipe do React Flow disponibiliza templates oficiais para Vite.

### Template Oficial Vite com React Flow
Para clonar o template oficial usando `degit`:

```bash
npx degit xyflow/vite-react-flow-template meu-fluxo-app
cd meu-fluxo-app
npm install
npm run dev
```

### Criando do Zero com Vite + React (TypeScript)

1. Crie a aplicação base com Vite:
```bash
npm create vite@latest meu-fluxo-app -- --template react-ts
```

2. Acesse a pasta e instale as dependências:
```bash
cd meu-fluxo-app
npm install
npm install @xyflow/react
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

---

## 7. Setup em Diferentes Frameworks

### 7.1. Configuração no Next.js (App Router)

Como o React Flow interage diretamente com o DOM, eventos de janela e o objeto `window`, componentes que instanciam `<ReactFlow />` no Next.js App Router devem ser declarados como **Client Components** utilizando a diretiva `'use client'`.

#### `app/flow/page.tsx`
```tsx
'use client';

import React from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: 'Nó Inicial Next.js' },
  },
  {
    id: '2',
    position: { x: 100, y: 250 },
    data: { label: 'Nó de Destino' },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
];

export default function FlowPage() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 60px)' }}>
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

### 7.2. Configuração com Vite e React

#### `src/App.tsx`
```tsx
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Entrada Principal' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Processamento' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Resultado Final' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        fitView
      >
        <Background gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
```

#### `src/main.tsx`
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

#### `src/index.css`
```css
html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
```

---

## 8. Resumo de Verificação do Setup

Antes de prosseguir para a construção de fluxos complexos, valide os seguintes pontos:
1. O pacote `@xyflow/react` está instalado no `package.json`.
2. O arquivo de estilo `@xyflow/react/dist/style.css` foi importado.
3. O container que envolve o `<ReactFlow />` possui largura e altura definidas (ex: `100vw` e `100vh` ou `w-full h-screen`).
4. Em frameworks com SSR (Next.js, Remix), a diretiva `'use client'` ou importação dinâmica (`next/dynamic` com `ssr: false`) está configurada quando necessário.
