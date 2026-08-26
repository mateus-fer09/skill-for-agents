---
title: "Server Side Rendering (SSR) e Next.js no React Flow"
description: "Guia definitivo para renderiza??o no lado do servidor (SSR/SSG) com React Flow v12 (@xyflow/react), integra??o com Next.js App Router e Pages Router, Remix, tratamento de hidrata??o e gera??o de imagens Open Graph."
topics:
  - "Suporte a SSR no React Flow v12"
  - "Next.js App Router (Client Components vs Server Components)"
  - "Tratamento de Mismatches de Hidrata??o"
  - "Configura??o de Dimens?es Iniciais (initialWidth, initialHeight)"
  - "fitView no Servidor"
  - "Gera??o Est?tica de Imagens Open Graph (@vercel/og / Satori)"
keywords:
  - "SSR"
  - "Next.js"
  - "server side rendering"
  - "hydration error"
  - "suppressHydrationWarning"
  - "initialWidth"
  - "open graph image"
  - "@xyflow/react"
source_scope: "Learn / Advanced Use / Server Side Rendering"
---

# Server Side Rendering (SSR) e Next.js no React Flow

A partir do React Flow v12 (`@xyflow/react`), a biblioteca oferece suporte oficial ? renderiza??o no servidor (SSR e SSG). Isso possibilita:
- Exibir diagramas em p?ginas de documenta??o est?tica geradas no build.
- Renderizar n?s e arestas com HTML v?lido para SEO e ambientes sem JavaScript habilitado.
- Gerar dinamicamente imagens de pr?-visualiza??o de links (Open Graph images) em rotas do Next.js.

---

## 1. O Desafio do SSR em Grafos Interativos

No servidor, n?o h? objeto `window`, nem ?rvore DOM f?sica para medir larguras (`node.measured.width`) ou alturas (`node.measured.height`).

Para renderizar o diagrama com precis?o geom?trica no servidor antes do JavaScript carregar no cliente, o React Flow v12 introduziu:
1. **Propriedades `width` e `height` expl?citas nos n?s.**
2. **Propriedades `initialWidth` e `initialHeight` no `<ReactFlowProvider />`.**
3. **Suporte a `fitView` est?tico no servidor.**

---

## 2. Implementa??o Completa no Next.js (App Router)

No Next.js (vers?es 13, 14 e 15) com o **App Router**, componentes interativos com hooks do React Flow devem ser marcados com `'use client'`.

### `app/flow-canvas.tsx` (Client Component)

```tsx
'use client';

import React from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface FlowCanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

export function FlowCanvas({ initialNodes, initialEdges }: FlowCanvasProps) {
  return (
    <div style={{ width: '100%', height: '80vh', border: '1px solid #e2e8f0', borderRadius: 8 }}>
      <ReactFlowProvider
        initialWidth={1024}
        initialHeight={768}
      >
        <ReactFlow
          defaultNodes={initialNodes}
          defaultEdges={initialEdges}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
```

### `app/page.tsx` (Server Component)

```tsx
import React from 'react';
import { Node, Edge } from '@xyflow/react';
import { FlowCanvas } from './flow-canvas';

// Dados definidos estaticamente no servidor com dimens?es conhecidas
const serverNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Etapa 1: Ingest?o de Dados' },
    position: { x: 250, y: 50 },
    width: 200,
    height: 50,
  },
  {
    id: '2',
    data: { label: 'Etapa 2: Processamento AI' },
    position: { x: 250, y: 180 },
    width: 200,
    height: 50,
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Etapa 3: Exporta??o de Resultados' },
    position: { x: 250, y: 310 },
    width: 200,
    height: 50,
  },
];

const serverEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function Page() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Visualizador de Pipeline de Dados (Renderizado no Servidor)</h1>
      <p>Este diagrama possui seu HTML inicial gerado diretamente no servidor Next.js.</p>
      <FlowCanvas initialNodes={serverNodes} initialEdges={serverEdges} />
    </main>
  );
}
```

---

## 3. Resolvendo Erros de Hidrata??o (Hydration Mismatch)

Se voc? utiliza componentes com depend?ncias exclusivas de navegador (como leitura de `localStorage` ou detec??o de tema escuro via media query), pode ocorrer diverg?ncia entre o HTML do servidor e do cliente.

### Solu??o 1: Carregamento Din?mico com `ssr: false` (Quando a interatividade for 100% client-side)

```tsx
import dynamic from 'next/dynamic';

const FlowCanvasNoSSR = dynamic(
  () => import('./flow-canvas').then((mod) => mod.FlowCanvas),
  {
    ssr: false,
    loading: () => <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando Canvas...</div>,
  }
);
```

### Solu??o 2: `suppressHydrationWarning` ou Montagem Segura

```tsx
'use client';

import { useState, useEffect } from 'react';

export function SafeHydrationWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: '80vh' }} />;
  }

  return <>{children}</>;
}
```

---

## 4. Gera??o de Imagens Open Graph (@vercel/og / Satori)

Voc? pode usar o HTML est?tico gerado pelo React Flow no servidor para produzir imagens Open Graph autom?ticas ao compartilhar links de diagramas:

```tsx
import { ImageResponse } from 'next/og';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';

export const runtime = 'edge';

export async function GET() {
  const nodes = [
    { id: '1', data: { label: 'Node A' }, position: { x: 50, y: 50 }, width: 120, height: 40 },
    { id: '2', data: { label: 'Node B' }, position: { x: 250, y: 50 }, width: 120, height: 40 },
  ];
  const edges = [{ id: 'e1-2', source: '1', target: '2' }];

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: 'flex', background: '#0f172a' }}>
        <ReactFlowProvider initialWidth={1200} initialHeight={630}>
          <ReactFlow defaultNodes={nodes} defaultEdges={edges} fitView />
        </ReactFlowProvider>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```
