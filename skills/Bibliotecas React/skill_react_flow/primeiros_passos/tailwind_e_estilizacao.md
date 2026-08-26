---
title: "Tailwind CSS e Estilização no React Flow"
description: "Guia completo de integração do Tailwind CSS com React Flow (@xyflow/react), estilização de custom nodes, handles, painéis e suporte nativo a temas Dark Mode."
topics: ["tailwind-css", "estilizacao", "react-flow-ui", "theming", "dark-mode-tailwind"]
keywords: ["tailwindcss", "@xyflow/react", "dark mode", "shadcn/ui", "custom styling", "base-handle", "tailwind plugins"]
source_scope: "React Flow Docs: Learn > Getting started with React Flow UI, Theming > TailwindCSS"
---

# Tailwind CSS e Estilização no React Flow

O Tailwind CSS é o framework utilitário ideal para construir interfaces de nós ricas, elegantes e responsivas no React Flow. Com classes utilitárias, é possível desenhar cards com bordas suaves, efeitos de glow, tipografia refinada e suporte instantâneo a Dark Mode.

---

## 1. Configurando Tailwind CSS com Vite e React Flow

### Passo 1: Instalação das dependências do Tailwind
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Passo 2: Configuração do `tailwind.config.js`
Certifique-se de que os caminhos dos componentes e nós customizados estejam cobertos:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Suporte a alternância via classe .dark
  theme: {
    extend: {
      colors: {
        flow: {
          border: '#e2e8f0',
          darkBorder: '#334155',
          bg: '#f8fafc',
          darkBg: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}
```

### Passo 3: Folha de Estilos Global (`src/index.css`)
Importe as diretivas do Tailwind juntamente com a folha de estilos base do React Flow:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Folha de estilos fundamental do React Flow */
@import '@xyflow/react/dist/style.css';

html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
```

---

## 2. Estilizando Custom Nodes com Classes Utilitárias

A grande vantagem de nós customizados no React Flow é que o conteúdo interno é HTML puro renderizado pelo React. Você pode aplicar qualquer classe Tailwind diretamente.

### Componente de Nó Estilizado: `CardNode.tsx`
```tsx
import React, { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';

export type CardNodeData = {
  title: string;
  description: string;
  status: 'active' | 'pending' | 'failed';
  icon?: string;
};

export type CardNodeType = Node<CardNodeData, 'cardNode'>;

function CardNode({ data, selected }: NodeProps<CardNodeType>) {
  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    failed: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  return (
    <div
      className={`
        w-64 rounded-xl border bg-white p-4 shadow-sm transition-all duration-200
        dark:bg-zinc-900 dark:text-zinc-100
        ${selected 
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-blue-500/10' 
          : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
        }
      `}
    >
      {/* Porta de Entrada (Target Handle) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white dark:!border-zinc-900 transition-transform hover:scale-125"
      />

      {/* Cabeçalho do Card */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
          {data.title}
        </h3>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[data.status]}`}
        >
          {data.status}
        </span>
      </div>

      {/* Corpo com descrição */}
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
        {data.description}
      </p>

      {/* Rodapé com Ações */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
          Node ID
        </span>
        <button
          type="button"
          className="nodrag text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={() => alert(`Ação disparada no nó: ${data.title}`)}
        >
          Configurar
        </button>
      </div>

      {/* Porta de Saída (Source Handle) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white dark:!border-zinc-900 transition-transform hover:scale-125"
      />
    </div>
  );
}

export default memo(CardNode);
```

---

## 3. Estilizando Handles com Tailwind e CSS

Por padrão, os handles possuem estilos inline aplicados pelo React Flow. Para sobrescrever com classes utilitárias Tailwind de forma limpa:

1. Use o modificador de prioridade `!` (important) do Tailwind nas classes de cor e tamanho (ex: `!w-3 !h-3 !bg-indigo-500`).
2. Ou crie uma classe de handle reutilizável:

```tsx
import React from 'react';
import { Handle, Position, HandleProps } from '@xyflow/react';

interface LabeledHandleProps extends HandleProps {
  label?: string;
}

export function LabeledHandle({ label, className, ...props }: LabeledHandleProps) {
  return (
    <div className="relative flex items-center">
      {label && props.position === Position.Left && (
        <span className="mr-2 text-[10px] font-medium text-zinc-400 dark:text-zinc-500 select-none">
          {label}
        </span>
      )}
      <Handle
        {...props}
        className={`!w-2.5 !h-2.5 !rounded-full !border-2 !border-white dark:!border-zinc-900 !bg-zinc-400 hover:!bg-blue-500 transition-colors ${className}`}
      />
      {label && props.position === Position.Right && (
        <span className="ml-2 text-[10px] font-medium text-zinc-400 dark:text-zinc-500 select-none">
          {label}
        </span>
      )}
    </div>
  );
}
```

---

## 4. Suporte a Dark Mode com Tailwind e a Prop `colorMode`

O React Flow v12 possui suporte nativo a temas claros e escuros através da propriedade `colorMode="light" | "dark" | "system"`.

Ao utilizar Tailwind com a estratégia `darkMode: 'class'`, podemos alternar a classe `.dark` no elemento pai ou no `<html>` e passar a propriedade `colorMode` correspondente ao `<ReactFlow />`.

### `App.tsx` com Alternador de Tema
```tsx
import React, { useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  BackgroundVariant,
  type Node,
  type Edge,
} from '@xyflow/react';

import CardNode from './CardNode';
import '@xyflow/react/dist/style.css';

// Registrar os tipos de nós fora do componente (ou com useMemo)
const nodeTypes = {
  cardNode: CardNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'cardNode',
    position: { x: 100, y: 100 },
    data: {
      title: 'Webhook de Pagamento',
      description: 'Recebe eventos de checkout da Stripe e valida a assinatura criptográfica.',
      status: 'active',
    },
  },
  {
    id: '2',
    type: 'cardNode',
    position: { x: 450, y: 100 },
    data: {
      title: 'Disparo de Notificação',
      description: 'Envia email de confirmação e mensagem no canal do Slack.',
      status: 'pending',
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
];

export default function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="w-screen h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
        <ReactFlow
          defaultNodes={initialNodes}
          defaultEdges={initialEdges}
          nodeTypes={nodeTypes}
          colorMode={isDark ? 'dark' : 'light'}
          fitView
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color={isDark ? '#3f3f46' : '#cbd5e1'}
          />
          <Controls className="!bg-white dark:!bg-zinc-900 !border-zinc-200 dark:!border-zinc-800 !shadow-lg" />
          
          <Panel position="top-right" className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Alternar para Tema {isDark ? 'Claro' : 'Escuro'}
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
```

---

## 5. Boas Práticas na Estilização com Tailwind

1. **Lembre-se da classe `nodrag`**: Qualquer elemento interativo (botões, inputs, switches) dentro de um custom node estilizado com Tailwind DEVE receber a classe CSS `nodrag` para evitar que o clique acione o arraste do nó.
2. **Utilize `select-none` em textos decorativos**: Evita que seleções de texto acidentais aconteçam ao arrastar o mouse sobre nós.
3. **Controle a largura com classes fixas ou `min-w`**: Nós customizados funcionam melhor quando têm largura previsível (`w-64`, `min-w-[200px]`), permitindo cálculos estáveis de posicionamento dos handles.
