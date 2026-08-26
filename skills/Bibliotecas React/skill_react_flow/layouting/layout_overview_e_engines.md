---
title: "Visão Geral de Layout e Engines no React Flow"
description: "Arquitetura de posicionamento automático, ciclo de vida de layout, nós medidos pelo DOM e panorama comparativo das principais engines (Dagre, ELKjs, D3, WebCola)."
topics: ["layout-overview", "layout-engines", "auto-layout", "measured-dimensions", "useNodesInitialized", "graph-layout"]
keywords: ["getLayoutedElements", "measured.width", "useNodesInitialized", "Dagre", "Elkjs", "d3-hierarchy", "d3-force", "WebCola", "libavoid"]
source_scope: "React Flow Docs: Learn > Layouting > Overview"
---

# Visão Geral de Layout e Engines no React Flow

O React Flow é propositalmente **desacoplado de uma engine de layout embutida**. Isso significa que a biblioteca não impõe uma forma rígida de organizar os nós na tela, dando total liberdade para você utilizar o algoritmo ou biblioteca mais adequado ao seu caso de uso (árvores genealógicas, diagramas de arquitetura em camadas, grafos orientados a forças ou redes conceituais).

---

## 1. Como o React Flow Posiciona os Elementos

No React Flow, a posição de um nó é definida pelas propriedades:
- `position: { x: number, y: number }`: Coordenadas cartesianas no canvas (ou relativas ao nó pai).
- `measured: { width: number, height: number }`: Dimensões reais calculadas pelo DOM após a primeira renderização do nó.

Qualquer algoritmo de auto-layout consiste em uma função que recebe a lista atual de nós e arestas e retorna uma nova lista de nós com as coordenadas `{ x, y }` recalculadas:

$$\text{getLayoutedElements}(\text{nodes}, \text{edges}, \text{options}) \longrightarrow \{ \text{nodes}: \text{Node}[], \text{edges}: \text{Edge}[] \}$$

---

## 2. O Ciclo de Vida do Layout Automático

```
[ 1. Render Inicial dos Nós ] 
             |
             v
[ 2. Medição DOM das Dimensões (node.measured.width / height) ]
             |
             v
[ 3. useNodesInitialized() confirma que todos os nós foram medidos ]
             |
             v
[ 4. Execução da Engine de Layout (Dagre / ELKjs / D3) ]
             |
             v
[ 5. setNodes com as Novas Coordenadas (x, y) ]
             |
             v
[ 6. fitView({ duration: 600 }) anima suavemente a câmera ]
```

### O Hook `useNodesInitialized`
Se os seus nós possuem tamanhos dinâmicos baseados em seu conteúdo interno, é essencial aguardar a medição do DOM antes de disparar o layout inicial:

```tsx
import { useNodesInitialized, useReactFlow } from '@xyflow/react';
import { useEffect } from 'react';

function AutoLayoutRunner() {
  const nodesInitialized = useNodesInitialized();
  const { getNodes, setNodes, fitView } = useReactFlow();

  useEffect(() => {
    if (nodesInitialized) {
      // Todos os nós já possuem node.measured.width e node.measured.height
      const layoutedNodes = calculateLayout(getNodes());
      setNodes(layoutedNodes);
      fitView({ duration: 400 });
    }
  }, [nodesInitialized]);

  return null;
}
```

---

## 3. Panorama Comparativo das Principais Engines de Layout

| Engine / Biblioteca | Tipo de Layout | Complexidade | Suporte a Subfluxos | Performance | Melhor Caso de Uso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dagre (`@dagrejs/dagre`)** | Hierárquico / Em Camadas (Sugiyama) | Muito Baixa (Drop-in) | Limitado¹ | Ultrarrápida (Síncrona) | Fluxogramas simples, pipelines CI/CD, árvores direcionadas. |
| **ELKjs (`elkjs`)** | Multi-algoritmo (Layered, Radial, Force, Tree) | Alta (Múltiplas Opções) | Excelente (Nativo) | Excelente (Web Worker / Async) | Grafos empresariais complexos, portas de conexão, subfluxos aninhados. |
| **d3-hierarchy / d3-dag** | Árvores e DAGs Matemáticos | Média | Manual | Rápida | Árvores de decisão, organogramas, árvores genealógicas. |
| **d3-force** | Orientado a Forças Físicas | Média | Não | Interativa / Contínua | Redes sociais, grafos de conhecimento, mapas mentais livres. |
| **WebCola (`webcola`)** | Baseado em Restrições (Constraint-based) | Alta | Bom | Excelente | Grafos com regras de alinhamento e não-sobreposição. |
| **Entitree-flex / d3-flextree** | Árvores Flexíveis com Nós Variados | Média | Não | Rápida | Organogramas com cards de alturas completamente distintas. |

> ¹ *Nota sobre o Dagre*: O Dagre possui uma limitação conhecida ao posicionar nós filhos de subfluxos que possuam conexões diretas com nós externos ao grupo pai. Para subfluxos complexos com conexões inter-grupos, o **ELKjs** é a escolha ideal.

---

## 4. Roteamento Inteligente de Arestas (Edge Routing)

Além de posicionar os nós, você pode querer que as arestas contornem os nós para evitar cruzamentos visuais:

- **`libavoid-js`**: Biblioteca profissional de roteamento ortogonal e poligonal que calcula trajetórias contornando obstáculos retangulares.
- **`react-flow-smart-edge`**: Pacote comunitário para React Flow que substitui arestas padrão por caminhos calculados via algoritmo A* no grid.

---

## 5. Boilerplate de Arquitetura de Layout Reutilizável

```tsx
import React, { createContext, useContext, useCallback } from 'react';
import { useReactFlow, type Node, type Edge } from '@xyflow/react';

interface LayoutContextType {
  runLayout: (direction?: 'TB' | 'LR') => Promise<void>;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { getNodes, setNodes, getEdges, setEdges, fitView } = useReactFlow();

  const runLayout = useCallback(
    async (direction: 'TB' | 'LR' = 'TB') => {
      const nodes = getNodes();
      const edges = getEdges();

      // Aqui você invoca a engine escolhida (ex: Dagre ou ELKjs)
      const layouted = await applyLayoutEngine(nodes, edges, direction);

      setNodes(layouted.nodes);
      setEdges(layouted.edges);
      fitView({ duration: 600 });
    },
    [getNodes, setNodes, getEdges, setEdges, fitView]
  );

  return (
    <LayoutContext.Provider value={{ runLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout deve ser usado dentro de LayoutProvider');
  return ctx;
};
```
