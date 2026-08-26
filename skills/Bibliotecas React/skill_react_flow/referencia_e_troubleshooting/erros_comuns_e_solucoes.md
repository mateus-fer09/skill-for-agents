---
title: "Erros Comuns e Solu??es (Troubleshooting) no React Flow"
description: "Cat?logo exaustivo dos principais erros, warnings do console, problemas de renderiza??o e falhas de conex?o no React Flow v12 (@xyflow/react), com causas-raiz detalhadas e solu??es em c?digo."
topics:
  - "Warning: Seems like you have not used zustand provider as an ancestor"
  - "Canvas com Largura/Altura Zero (Container 0px height/width)"
  - "Estilos CSS n?o Carregados (@xyflow/react/dist/style.css)"
  - "Recria??o Excessiva de nodeTypes / edgeTypes"
  - "Stale Closures em Handlers e Callbacks"
  - "IDs Duplicados em N?s e Arestas"
  - "Problemas com Handles e useUpdateNodeInternals"
  - "Erros de ParentExtent e Subflows"
keywords:
  - "troubleshooting"
  - "common errors"
  - "zustand provider warning"
  - "0px height"
  - "missing styles"
  - "stale closure"
  - "useUpdateNodeInternals"
  - "@xyflow/react"
source_scope: "Reference / Troubleshooting / Common Errors"
---

# Erros Comuns e Solu??es (Troubleshooting) no React Flow

Este cat?logo re?ne as mensagens de erro e comportamentos an?malos mais frequentes no React Flow v12, explicando por que acontecem e como corrigi-los de imediato.

---

## 1. `Warning: Seems like you have not used zustand provider as an ancestor.`

### Causa-Raiz
Voc? chamou um hook do React Flow (como `useReactFlow()`, `useNodes()`, `useEdges()`, `useStore()`, `useStoreApi()` ou `useViewport()`) em um componente que est? **fora** da ?rvore do `<ReactFlowProvider />`.

### Solu??o

Envolva o componente pai com `<ReactFlowProvider>`:

```tsx
import { ReactFlow, ReactFlowProvider, useReactFlow } from '@xyflow/react';

// ? ERRADO: Sidebar chama useReactFlow sem estar encapsulada por ReactFlowProvider
export function BadApp() {
  return (
    <div>
      <SidebarWithHook />
      <ReactFlow nodes={[]} edges={[]} />
    </div>
  );
}

// ? CORRETO: ReactFlowProvider encapsula tanto o ReactFlow quanto componentes que usam hooks
export function GoodApp() {
  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <SidebarWithHook />
        <ReactFlow nodes={[]} edges={[]} />
      </div>
    </ReactFlowProvider>
  );
}
```

---

## 2. O Canvas N?o Aparece ou Fica Totalmente Invis?vel (Altura 0px)

### Sintoma
O elemento `<ReactFlow />` ? montado no DOM, mas nenhum n? ou grade de fundo aparece na tela. No inspecionar elemento do navegador, a `div` possui `height: 0px`.

### Causa-Raiz
Por padr?o, o componente `<ReactFlow />` ocupa `100%` da largura e da altura de seu elemento pai. Se o container pai n?o tiver dimens?es CSS expl?citas, sua altura colapsa para `0px`.

### Solu??o

Defina uma altura expl?cita (ex: `height: 100vh` ou `height: 600px`) no container pai:

```tsx
// ? Defina sempre largura e altura no container pai
export default function FlowContainer() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}
```

---

## 3. N?s Aparecem Desconfigurados, Empilhados no Canto ou Sem Estilo

### Causa-Raiz
O arquivo CSS obrigat?rio da biblioteca n?o foi importado no ponto de entrada do projeto.

### Solu??o

Adicione o import do CSS no topo do arquivo raiz (`App.tsx` ou `main.tsx`):

```tsx
import '@xyflow/react/dist/style.css';
```

---

## 4. `It looks like you have created a new nodeTypes or edgeTypes object.`

### Causa-Raiz
O objeto `nodeTypes` ou `edgeTypes` foi declarado inline dentro do corpo de um componente React, sendo recriado a cada render. Isso destr?i e remonta todos os n?s a cada ciclo de renderiza??o.

### Solu??o

Declare `nodeTypes` e `edgeTypes` fora do componente ou envolva-os com `useMemo`:

```tsx
// ? Declarado no escopo do m?dulo
const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function MyFlow() {
  return <ReactFlow nodeTypes={nodeTypes} edgeTypes={edgeTypes} ... />;
}
```

---

## 5. Handles Adicionados Dinamicamente N?o Conectam Arestas

### Sintoma
Um n? customizado adiciona portas/handles dinamicamente ap?s um clique de bot?o, mas as arestas n?o se conectam a eles ou conectam na posi??o errada.

### Causa-Raiz
O React Flow calcula as coordenadas absolutas dos handles na montagem inicial. Quando o DOM do n? muda dinamicamente, os novos handles ainda n?o foram medidos.

### Solu??o

Chame o hook `useUpdateNodeInternals()` para for?ar a medi??o:

```tsx
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';

export function DynamicNode({ id }) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [ports, setPorts] = useState([0]);

  const addPort = () => {
    setPorts(prev => {
      const next = [...prev, prev.length];
      setTimeout(() => updateNodeInternals(id), 0);
      return next;
    });
  };

  return (
    <div>
      <button onClick={addPort}>+ Adicionar Porta</button>
      {ports.map(p => (
        <Handle key={p} type="source" position={Position.Right} id={`p-${p}`} style={{ top: p * 20 }} />
      ))}
    </div>
  );
}
```

---

## 6. Stale Closures em Handlers (`onConnect`, `onNodeClick`)

### Sintoma
Ao clicar em um n? ou conectar uma aresta, o callback acessa valores desatualizados do estado React.

### Solu??o

Utilize atualizadores funcionais (`setNodes((nds) => ...)` / `setEdges((eds) => ...)`) ou centralize o estado no Zustand:

```tsx
// ? PODE CAUSAR STALE CLOSURE
const onConnect = useCallback((params) => {
  setEdges(addEdge(params, edges)); // 'edges' pode estar desatualizado
}, [edges]);

// ? SEMPRE ATUALIZADO (Functional Updater)
const onConnect = useCallback((params) => {
  setEdges((currentEdges) => addEdge(params, currentEdges));
}, []);
```

---

## 7. `Only child nodes can use a parent extent.`

### Causa-Raiz
Um n? configurou `extent: 'parent'`, mas n?o definiu `parentId` apontando para um n? pai v?lido.

### Solu??o

```tsx
const nodes = [
  { id: 'group-1', type: 'group', position: { x: 0, y: 0 }, style: { width: 300, height: 300 } },
  // ? N? filho deve referenciar parentId
  { id: 'child-1', parentId: 'group-1', extent: 'parent', position: { x: 20, y: 20 }, data: { label: 'Filho' } },
];
```

---

## 8. IDs Duplicados em N?s ou Arestas

### Sintoma
Comportamento err?tico ao arrastar, n?s se duplicando ou arestas conectando em n?s errados.

### Causa-Raiz
Cada `node.id` e `edge.id` **deve ser globalmente ?nico** como string no fluxo.

### Solu??o
Utilize geradores de ID seguros como `nanoid` ou `crypto.randomUUID()`:

```tsx
import { nanoid } from 'nanoid';

const newNode = {
  id: nanoid(),
  type: 'default',
  position: { x: 100, y: 100 },
  data: { label: 'N? com ID ?nico' }
};
```
