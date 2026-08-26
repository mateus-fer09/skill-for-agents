---
title: "Performance e Otimiza??o no React Flow"
description: "Guia t?cnico avan?ado para maximizar a taxa de quadros (60fps), reduzir re-renderiza??es desnecess?rias e manipular grafos de mais de 1000 n?s no React Flow v12 (@xyflow/react)."
topics:
  - "Gargalos Comuns de Performance em Grafos"
  - "Memoiza??o de N?s e Arestas Customizados (React.memo)"
  - "Declara??o Est?tica de nodeTypes e edgeTypes"
  - "Virtualiza??o com onlyRenderVisibleElements"
  - "Otimiza??es de Viewport e minZoom"
  - "Subscri??es Granulares com useNodesData e useShallow"
  - "Manipula??o de Grafos com 1000+ N?s"
keywords:
  - "performance"
  - "optimization"
  - "React.memo"
  - "onlyRenderVisibleElements"
  - "nodeTypes memoization"
  - "large graphs"
  - "60fps"
  - "@xyflow/react"
source_scope: "Learn / Advanced Use / Performance"
---

# Performance e Otimiza??o no React Flow

O React Flow ? altamente otimizado por padr?o, mas aplica??es que lidam com centenas de n?s, anima??es complexas ou componentes customizados pesados podem enfrentar quedas de FPS durante opera??es de arraste (drag) e pan/zoom.

Esta documenta??o detalha as regras de ouro para manter seu fluxo executando a 60 FPS est?veis mesmo com milhares de elementos.

---

## 1. As 5 Regras de Ouro da Performance

### Regra 1: Declarar `nodeTypes` e `edgeTypes` Fora do Componente

> [!CAUTION]
> **O Erro Mais Comum:** Definir o objeto `nodeTypes` ou `edgeTypes` inline dentro do corpo do componente pai faz com que o React Flow recrie todos os n?s do canvas a cada ciclo de renderiza??o do React.

```tsx
// ? INCORRETO: Recria o objeto a cada renderiza??o do componente pai
export default function BadFlow() {
  const nodeTypes = { custom: MyCustomNode }; // Novo objeto a cada render!
  return <ReactFlow nodeTypes={nodeTypes} ... />;
}

// ? CORRETO: Declarado uma ?nica vez fora do componente ou memoizado com useMemo
const nodeTypes = {
  custom: MyCustomNode,
};

export default function GoodFlow() {
  return <ReactFlow nodeTypes={nodeTypes} ... />;
}
```

---

### Regra 2: Memoizar N?s e Arestas Customizados com `React.memo`

Componentes customizados de n?s recebem atualiza??es de propriedades frequentemente. Envolva todos os n?s e arestas com `React.memo` para evitar que n?s inalterados sejam re-renderizados quando outro n? ? movido.

```tsx
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

function HeavyNodeComponent({ id, data, selected }: NodeProps) {
  return (
    <div style={{ padding: 10, border: selected ? '2px solid blue' : '1px solid gray' }}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// ? Exporta??o memoizada
export const HeavyNode = memo(HeavyNodeComponent);
```

---

### Regra 3: Evitar Assinar a Lista Completa de N?s (`useNodes`) em Componentes Filhos

Se um n? customizado precisa ler dados de um n? vizinho, **nunca** use `useNodes()` dentro dele. Use `useNodesData(targetNodeId)` ou `useHandleConnections()`.

```tsx
// ? P?SSIMO: Re-renderiza este n? sempre que QUALQUER n? no canvas se mover 1 pixel
function BadChildNode() {
  const nodes = useNodes();
  const partner = nodes.find(n => n.id === 'partner-id');
  return <div>{partner?.data?.value}</div>;
}

// ? EXCELENTE: Re-renderiza APENAS quando o data do n? especificado sofrer altera??o
function OptimizedChildNode() {
  const partnerData = useNodesData('partner-id');
  return <div>{partnerData?.value}</div>;
}
```

---

## 2. Virtualiza??o de Elementos: `onlyRenderVisibleElements`

Para grafos grandes (mais de 200 n?s), renderizar n?s fora do campo de vis?o da viewport consome ciclos preciosos de GPU e CPU.

Ative `onlyRenderVisibleElements`:

```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  // ? Virtualiza??o: renderiza no DOM apenas os n?s e arestas vis?veis na tela
  onlyRenderVisibleElements={true}
  // Evita re-ordena??o de n?s no DOM ao selecionar (ganho em layouts densos)
  elevateNodesOnSelect={false}
  // Otimiza??o de n?s com ponto de piv? centralizado
  nodeOrigin={[0.5, 0.5]}
  // Limita zoom m?nimo para n?o renderizar n?s min?sculos demais
  minZoom={0.2}
  maxZoom={2.5}
/>
```

---

## 3. Otimiza??o de Fun??es de Callback

Passe sempre fun??es com `useCallback` para evitar que `<ReactFlow />` interprete novas refer?ncias como altera??es de propriedades:

```tsx
const onNodesChange = useCallback((changes) => {
  setNodes((nds) => applyNodeChanges(changes, nds));
}, []);

const onConnect = useCallback((connection) => {
  setEdges((eds) => addEdge(connection, eds));
}, []);
```

---

## 4. Estrat?gias para Grafos com 1000+ N?s

Quando voc? precisa renderizar milhares de n?s:
1. **Agrupamento e Colapso (Subgraphs):** N?s pais contendo sub-grafos colaps?veis que s? expandem sob demanda.
2. **N?s Simplificados para Zoom Baixo:** Renderize n?s simplificados (apenas ret?ngulos SVG ou divs planas sem inputs ou sombras) quando o n?vel de zoom for baixo.
3. **Desative Sombras CSS e Filtros Complexos:** `box-shadow` e `backdrop-filter` causam repaints caros no navegador durante o pan/zoom. Substitua por bordas s?lidas simples (`1px solid #ccc`).

---

## Checklist de Auditoria de Performance

| Item de Verifica??o | Status |
| :--- | :--- |
| `nodeTypes` e `edgeTypes` declarados fora da fun??o do componente? | [ ] |
| Todos os n?s e arestas customizados encapsulados com `React.memo`? | [ ] |
| Handlers (`onNodesChange`, `onConnect`, etc.) envolvidos em `useCallback`? | [ ] |
| `onlyRenderVisibleElements={true}` habilitado para grafos com >100 n?s? | [ ] |
| `useNodesData(id)` utilizado em vez de `useNodes()` dentro de n?s customizados? | [ ] |
| `useShallow` utilizado ao extrair m?ltiplas propriedades de stores Zustand? | [ ] |
