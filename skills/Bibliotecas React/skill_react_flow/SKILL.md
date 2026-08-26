---
name: react-flow
description: Base de conhecimento exaustiva e guia de arquitetura t?cnica para React Flow (@xyflow/react v12). Cobre conceitos fundamentais, n?s e arestas customizados, layouting autom?tico (Dagre/ELKjs), gerenciamento de estado (Zustand), computa??o reativa DAG, cat?logo exaustivo de APIs (componentes, 18 hooks, utilit?rios, types TypeScript), tutoriais completos e ecossistema React Flow UI com shadcn/ui e Tailwind CSS 4.
---

# React Flow AI Skill Guide

## 1. Identidade e Prop?sito da Skill

Esta Skill constitui a representa??o t?cnica integral e modular da documenta??o oficial do **React Flow** (`@xyflow/react` v12 / ecossistema xyflow). Foi projetada como base de conhecimento autocontida para agentes de IA atuarem em tarefas de engenharia de software envolvendo:

- Constru??o de interfaces baseadas em n?s (*node-based UIs*), grafos interativos, workflows, diagramas e editores visuais.
- Implementa??o de n?s customizados (*custom nodes*) com m?ltiplos handles, formul?rios, gr?ficos e comportamento reativo.
- Customiza??o de arestas (*custom edges*) SVG, r?tulos interativos em HTML (`<EdgeLabelRenderer />`) e caminhos flutuantes.
- Integra??o de motores de layout autom?tico hier?rquico e ortogonal (**Dagre**, **ELKjs**, **D3-hierarchy**, **D3-force**).
- Gerenciamento de estado complexo em grafos (Zustand com seletores at?micos `useShallow`, Undo/Redo com `zundo`, computa??o DAG reativa).
- Uso rigoroso de **TypeScript** com uni?es discriminadas (*Discriminated Unions*), `NodeProps` e tipagem estrita de `AppNode` / `AppEdge`.
- Ecossistema de componentes prontos **React Flow UI** baseados em **shadcn/ui** e **Tailwind CSS 4**.
- Resolu??o de problemas, conformidade com acessibilidade (WCAG 2.1 AA) e testes automatizados (Playwright, Cypress, Vitest).

---

## 2. Instru??es de Opera??o para o Agente

Ao receber uma solicita??o de usu?rio relacionada a React Flow, siga o fluxo operacional abaixo para m?xima efici?ncia e precis?o:

```text
[Solicita??o do Usu?rio]
         ?
         ?
[1. Consultar index_master.md]
  ? Identificar a inten??o na Tabela de Roteamento Sem?ntico.
  ? Localizar os arquivos modulares relevantes no Mapa de Contexto.
         ?
         ?
[2. Carregamento Seletivo de M?dulos]
  ? Ler APENAS os arquivos espec?ficos necess?rios para a tarefa atual.
  ? Evitar carregar todos os m?dulos para otimizar a janela de contexto.
         ?
         ?
[3. Cruzamento de Refer?ncias]
  ? Se o m?dulo referenciar tipos ou hooks auxiliares, consultar a se??o correspondente em api_referencia/.
         ?
         ?
[4. Gera??o de C?digo / Resposta]
  ? Respeitar as 8 Regras Fundamentais do React Flow v12.
  ? Utilizar c?digo TypeScript/TSX completo, sem simplifica??es ou supress?es de imports.
```

---

## 3. As 8 Regras Fundamentais do React Flow v12

1. **Importa??o Obrigat?ria da Folha de Estilos:**
   O pacote `@xyflow/react` exige a importa??o do CSS `@xyflow/react/dist/style.css`. Sem ele, as posi??es absolutas, conex?es e handles n?o renderizam corretamente.

2. **Dimens?es Obrigat?rias no Container Pai:**
   O componente `<ReactFlow />` preenche `100%` da largura e altura do seu elemento pai. O container pai **deve ter dimens?es expl?citas** (ex: `style={{ width: '100vw', height: '100vh' }}` ou classes `w-screen h-screen` / `w-full h-[600px]`).

3. **Ordem Cr?tica de Estilos no Tailwind CSS 4:**
   No Tailwind CSS 4, o CSS do React Flow deve ser importado obrigatoriamente dentro de `@layer base` no arquivo `global.css` (ou `index.css`) **ap?s** `@import "tailwindcss";`. Nunca importe em `App.tsx` nesse cen?rio.

4. **Memoiza??o Estrita de `nodeTypes` e `edgeTypes`:**
   Os objetos `nodeTypes` e `edgeTypes` devem ser definidos **fora do componente** React ou memoizados com `useMemo`. Se forem recriados a cada renderiza??o, o React Flow desmontar? e remontar? todos os n?s do grafo, causando perda de estado e quebra de performance.

5. **Manipula??o Imut?vel com Fun??es Utilit?rias:**
   Em fluxos controlados, atualize o estado sempre via:
   - `onNodesChange` -> `applyNodeChanges(changes, nodes)`
   - `onEdgesChange` -> `applyEdgeChanges(changes, edges)`
   - `onConnect` -> `addEdge(connectionParams, edges)`

6. **Contexto Obrigat?rio para Hooks:**
   Hooks como `useReactFlow()`, `useNodesData()`, `useNodeConnections()` e `useInternalNode()` s? funcionam dentro de um componente filho de `<ReactFlow />` ou dentro de `<ReactFlowProvider />`.

7. **Notifica??o de Mudan?as no DOM do N?:**
   Se a altura, largura ou quantidade de handles de um n? mudar dinamicamente ap?s a renderiza??o inicial, dispare `useUpdateNodeInternals()(nodeId)` para recalcular as ?ncoras de conex?o.

8. **Tipagem Estrita com Discriminated Unions:**
   Em TypeScript, defina o tipo uni?o de todos os n?s customizados:
   `type AppNode = BuiltInNode | CustomNodeA | CustomNodeB;` e passe para `<ReactFlow<AppNode, AppEdge> />`.

---

## 4. Mapa R?pido da Estrutura Modular

- [`index_master.md`](./index_master.md) ? **Roteador Central de Conhecimento e Mapa de Contexto**.
- [`primeiros_passos/`](./primeiros_passos/) ? Instala??o, setup, boilerplate funcional e regras do Tailwind CSS 4.
- [`conceitos_fundamentais/`](./conceitos_fundamentais/) ? Termos, cria??o de n?s/arestas, interatividade, viewport e componentes nativos.
- [`customizacao/`](./customizacao/) ? N?s customizados com m?ltiplos handles, arestas SVG, `<EdgeLabelRenderer />`, theming e classes utilit?rias.
- [`layouting/`](./layouting/) ? Layouts autom?ticos com Dagre e ELKjs, subflows e grafos aninhados.
- [`uso_avancado/`](./uso_avancado/) ? Zustand, computa??o DAG, TypeScript rigoroso, SSR/Next.js, devtools, multiplayer e testes.
- [`api_referencia/`](./api_referencia/) ? Cat?logo detalhado de todos os componentes, 18 hooks com assinaturas completas, fun??es utilit?rias e tipos.
- [`react_flow_ui/`](./react_flow_ui/) ? Blocos de UI prontos no padr?o shadcn/ui, templates de AI Workflow e Workflow Editor.
- [`tutoriais_completos/`](./tutoriais_completos/) ? Projetos completos multi-arquivos (Mind Map, Web Audio API, Slideshow).
- [`referencia_e_troubleshooting/`](./referencia_e_troubleshooting/) ? Guia dos 8 erros mais comuns e manuais de migra??o (v10, v11, v12).
