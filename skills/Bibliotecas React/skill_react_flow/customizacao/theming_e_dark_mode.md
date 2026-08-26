---
title: "Theming, CSS Variables e Dark Mode no React Flow"
description: "Guia completo de customização visual, CSS Variables oficiais (--xy-*), colorMode nativo ('light' | 'dark' | 'system') e temas customizados no React Flow v12."
topics: ["theming", "dark-mode", "css-variables", "colorMode", "styling", "custom-theme"]
keywords: ["colorMode", "--xy-node-background-color", "--xy-edge-stroke-default", "react-flow__node", "theming", "dark mode"]
source_scope: "React Flow Docs: Learn > Customization > Theming, Migration to v12 (Dark mode & CSS variables)"
---

# Theming, CSS Variables e Dark Mode no React Flow

O React Flow v12 introduziu uma arquitetura de estilização moderna baseada em **Variáveis CSS customizáveis (`--xy-*`)** e na propriedade nativa **`colorMode`**.

---

## 1. A Propriedade Nativa `colorMode`

O componente `<ReactFlow />` aceita a propriedade `colorMode`:

```tsx
<ReactFlow
  colorMode="dark" // 'light' | 'dark' | 'system'
  ...
/>
```

- `'light'`: Aplica os valores padrão claros das variáveis CSS.
- `'dark'`: Aplica automaticamente o esquema escuro (fundo grafite, nós escuros, arestas contrastantes).
- `'system'`: Escuta o media query `prefers-color-scheme` do sistema operacional e alterna dinamicamente.

---

## 2. Tabela Completa de Variáveis CSS (`--xy-*`)

Você pode sobrescrever qualquer variável CSS do React Flow no seu arquivo `.css` global ou em uma classe de tema:

### Variáveis de Nós e Canvas
| Variável CSS | Padrão (Tema Claro) | Padrão (Tema Escuro) | Descrição |
| :--- | :--- | :--- | :--- |
| `--xy-node-background-color` | `#ffffff` | `#1f2937` | Cor de fundo do container do nó. |
| `--xy-node-border-default` | `1px solid #1a192b` | `1px solid #374151` | Borda padrão dos nós. |
| `--xy-node-border-radius-default` | `5px` | `5px` | Arredondamento dos cantos dos nós. |
| `--xy-node-color-default` | `#222222` | `#f9fafb` | Cor do texto padrão nos nós. |
| `--xy-node-boxshadow-default` | `none` | `none` | Sombra padrão dos nós. |
| `--xy-node-selected-boxshadow-default` | `0 0 0 1px #1a192b` | `0 0 0 1px #60a5fa` | Sombra/Glow de seleção do nó. |

### Variáveis de Handles
| Variável CSS | Padrão (Tema Claro) | Padrão (Tema Escuro) | Descrição |
| :--- | :--- | :--- | :--- |
| `--xy-handle-background-color` | `#1a192b` | `#ffffff` | Cor de preenchimento dos handles. |
| `--xy-handle-border-color` | `#ffffff` | `#1f2937` | Cor da borda dos handles. |

### Variáveis de Arestas
| Variável CSS | Padrão (Tema Claro) | Padrão (Tema Escuro) | Descrição |
| :--- | :--- | :--- | :--- |
| `--xy-edge-stroke-default` | `#b1b1b7` | `#4b5563` | Cor padrão da linha das arestas. |
| `--xy-edge-stroke-selected` | `#555555` | `#9ca3af` | Cor da aresta quando selecionada. |
| `--xy-edge-stroke-width-default` | `1` | `1` | Espessura padrão da linha. |
| `--xy-edge-label-color-default` | `#222222` | `#f3f4f6` | Cor do texto do label da aresta. |
| `--xy-edge-label-background-color-default`| `#ffffff` | `#111827` | Cor de fundo do label da aresta. |

### Variáveis de Controles, MiniMap e Background
| Variável CSS | Padrão (Tema Claro) | Padrão (Tema Escuro) | Descrição |
| :--- | :--- | :--- | :--- |
| `--xy-controls-button-background-color` | `#fefefe` | `#1f2937` | Fundo dos botões do Controls. |
| `--xy-minimap-background-color-default` | `#ffffff` | `#111827` | Fundo do container do MiniMap. |
| `--xy-minimap-mask-background-color-default` | `rgba(240, 240, 240, 0.6)` | `rgba(0, 0, 0, 0.6)` | Máscara da viewport do MiniMap. |
| `--xy-background-pattern-color-default` | `#91919a` | `#374151` | Cor dos pontos/linhas do Background. |

---

## 3. Criando Temas Customizados com Folhas de Estilo

Você pode criar temas personalizados (ex: Cyberpunk, Monocromático, Pastel) apenas redefinindo variáveis CSS em um seletor de classe:

### `theme-cyberpunk.css`
```css
.react-flow.theme-cyberpunk {
  --xy-node-background-color: #0f172a;
  --xy-node-border-default: 2px solid #06b6d4;
  --xy-node-border-radius-default: 8px;
  --xy-node-color-default: #38bdf8;
  --xy-node-selected-boxshadow-default: 0 0 15px #06b6d4;

  --xy-handle-background-color: #f43f5e;
  --xy-handle-border-color: #0f172a;

  --xy-edge-stroke-default: #06b6d4;
  --xy-edge-stroke-selected: #f43f5e;
  --xy-edge-stroke-width-default: 2;

  --xy-background-pattern-color-default: #1e293b;
  background-color: #020617;
}
```

---

## 4. Exemplo Completo com Seletor Dinâmico de Temas

```tsx
import React, { useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
  type Node,
  type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', type: 'input', position: { x: 100, y: 100 }, data: { label: '🛰️ Módulo de Controle' } },
  { id: '2', position: { x: 350, y: 100 }, data: { label: '⚡ Reator Principal' } },
  { id: '3', type: 'output', position: { x: 600, y: 100 }, data: { label: '🚀 Propulsor Iônico' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export default function ThemeDemo() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'cyberpunk'>('dark');

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        colorMode={theme === 'cyberpunk' ? 'dark' : theme}
        className={theme === 'cyberpunk' ? 'theme-cyberpunk' : ''}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
        <MiniMap />

        <Panel position="top-right" className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur p-2 rounded-xl border shadow-lg flex gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`px-3 py-1 text-xs rounded-md font-semibold ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-800'}`}
          >
            Tema Claro
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-3 py-1 text-xs rounded-md font-semibold ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-200'}`}
          >
            Tema Escuro
          </button>
          <button
            onClick={() => setTheme('cyberpunk')}
            className={`px-3 py-1 text-xs rounded-md font-semibold ${theme === 'cyberpunk' ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-cyan-400'}`}
          >
            Tema Cyberpunk
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
```
