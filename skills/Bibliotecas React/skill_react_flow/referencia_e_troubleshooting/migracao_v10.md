---
title: "Guia de Migra??o para o React Flow v10"
description: "Documenta??o de refer?ncia sobre a transi??o para o React Flow v10, detalhando a separa??o da prop elements em nodes e edges, ado??o do padr?o controlled flow, migra??o de Redux para Zustand interno e novas assinaturas de custom nodes."
topics:
  - "Substitui??o de elements por nodes e edges"
  - "Introdu??o do Padr?o de Fluxo Controlado (Controlled Flow)"
  - "defaultNodes e defaultEdges para Fluxos N?o Controlados"
  - "Migra??o Interna de Redux para Zustand"
  - "onInit substituindo onLoad"
  - "panOnDrag substituindo paneMoveable"
  - "Novas Assinaturas de Custom Nodes"
keywords:
  - "migration v10"
  - "elements to nodes edges"
  - "controlled flow pattern"
  - "defaultNodes"
  - "defaultEdges"
  - "redux to zustand"
  - "onInit"
source_scope: "Reference / Migration / Migrate to v10"
---

# Guia de Migra??o para o React Flow v10

A vers?o **v10** do React Flow foi uma das maiores revolu??es arquiteturais da biblioteca, introduzindo a separa??o definitiva entre n?s e arestas, substituindo a antiga store Redux interna pelo Zustand e padronizando o modelo de fluxo controlado adotado pelo React moderno.

---

## 1. Separa??o de `elements` em `nodes` e `edges`

Nas vers?es anteriores (v9 e anteriores), n?s e conex?es eram misturados em um ?nico array monol?tico chamado `elements`.

Na v10, o React Flow passou a exigir `nodes` e `edges` separados:

### Padr?o Controlado (Controlled Flow)

```tsx
// ? ANTES (v9)
const [elements, setElements] = useState([
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 0, y: 0 } },
  { id: 'e1-2', source: '1', target: '2' },
]);

<ReactFlow elements={elements} onElementsRemove={onElementsRemove} onConnect={onConnect} />

// ? AGORA (v10)
const [nodes, setNodes] = useState([
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 0, y: 0 } },
]);
const [edges, setEdges] = useState([
  { id: 'e1-2', source: '1', target: '2' },
]);

<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
/>
```

### Padr?o N?o Controlado (Uncontrolled Flow)

```tsx
// ? Suporte nativo a defaultNodes e defaultEdges
<ReactFlow
  defaultNodes={initialNodes}
  defaultEdges={initialEdges}
/>
```

---

## 2. Substitui??o do Redux Interno por Zustand

Na v9, o React Flow utilizava Redux internamente. Na v10, a arquitetura interna foi reescrita em **Zustand**, resultando em:
- Redu??o de mais de 40% no tamanho final do bundle.
- Renderiza??es muito mais r?pidas durante intera??es de arrasto.
- Elimina??o de provedores pesados na raiz.

---

## 3. Renomea??es de Props e Callbacks

| Prop Antiga (v9) | Nova Prop (v10) | Observa??es |
| :--- | :--- | :--- |
| `elements` | `nodes` e `edges` | Arrays separados para n?s e conex?es. |
| `onLoad` | `onInit` | Disparado quando a inst?ncia ? montada com sucesso. |
| `paneMoveable` | `panOnDrag` | Controla se o usu?rio pode arrastar o fundo da tela. |
| `isHidden` | `hidden` | Propriedade booleana em n?s e arestas. |
| `arrowHeadType` | `markerEnd: { type: MarkerType.ArrowClosed }` | Marcadores padronizados. |
| `onElementsRemove` | Substitu?do por `onNodesChange` / `onEdgesChange` | Handlers at?micos de mudan?as. |

---

## 4. Nova Assinatura para Componentes de N?s Customizados

Os componentes de n?s customizados passaram a receber props expl?citas e imut?veis (`id`, `data`, `selected`, `type`, `xPos`, `yPos`), eliminando depend?ncias globais ocultas:

```tsx
// ? Assinatura v10 de N? Customizado
export function CustomNode({ id, data, selected }: NodeProps) {
  return (
    <div style={{ border: selected ? '2px solid red' : '1px solid black' }}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```
