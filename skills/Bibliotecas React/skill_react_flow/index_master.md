# React Flow Skill ? Index Master

## Identidade da Base de Conhecimento

- **Tecnologia:** React Flow (`@xyflow/react` v12)
- **Tipo:** Biblioteca React para renderiza??o e gerenciamento de grafos, workflows, diagramas e interfaces baseadas em n?s.
- **Escopo Total Coberto:** 100% da documenta??o oficial de `https://reactflow.dev` dividida em 46 m?dulos especializados.

---

## Tabela de Roteamento Sem?ntico por Inten??o

| Inten??o do Desenvolvedor / Pergunta | Arquivo Principal a Consultar | Arquivos Complementares |
| :--- | :--- | :--- |
| Instala??o, setup com Vite/Next.js e templates | [`primeiros_passos/instalacao_e_setup.md`](./primeiros_passos/instalacao_e_setup.md) | [`primeiros_passos/quickstart_e_boilerplate.md`](./primeiros_passos/quickstart_e_boilerplate.md) |
| C?digo inicial m?nimo e estrutura b?sica | [`primeiros_passos/quickstart_e_boilerplate.md`](./primeiros_passos/quickstart_e_boilerplate.md) | [`conceitos_fundamentais/construindo_um_grafo.md`](./conceitos_fundamentais/construindo_um_grafo.md) |
| Configura??o com Tailwind CSS 4 e CSS base | [`primeiros_passos/tailwind_e_estilizacao.md`](./primeiros_passos/tailwind_e_estilizacao.md) | [`react_flow_ui/introducao_e_setup_shadcn.md`](./react_flow_ui/introducao_e_setup_shadcn.md) |
| Gloss?rio, termos t?cnicos e arquitetura | [`conceitos_fundamentais/termos_e_definicoes.md`](./conceitos_fundamentais/termos_e_definicoes.md) | [`conceitos_fundamentais/construindo_um_grafo.md`](./conceitos_fundamentais/construindo_um_grafo.md) |
| Manipula??o de n?s, arestas e estado | [`conceitos_fundamentais/construindo_um_grafo.md`](./conceitos_fundamentais/construindo_um_grafo.md) | [`api_referencia/funcoes_utilitarias.md`](./api_referencia/funcoes_utilitarias.md) |
| Conectar n?s, eventos de clique e arrasto | [`conceitos_fundamentais/adicionando_interatividade.md`](./conceitos_fundamentais/adicionando_interatividade.md) | [`customizacao/handles_e_conexoes.md`](./customizacao/handles_e_conexoes.md) |
| Controle de Viewport (pan, zoom, limites) | [`conceitos_fundamentais/viewport_pan_zoom.md`](./conceitos_fundamentais/viewport_pan_zoom.md) | [`api_referencia/hooks_referencia_completa.md`](./api_referencia/hooks_referencia_completa.md) |
| Usar MiniMap, Controls, Background e Panel | [`conceitos_fundamentais/componentes_embutidos.md`](./conceitos_fundamentais/componentes_embutidos.md) | [`api_referencia/componentes_auxiliares.md`](./api_referencia/componentes_auxiliares.md) |
| Criar N?s Customizados com m?ltiplos Handles | [`customizacao/custom_nodes.md`](./customizacao/custom_nodes.md) | [`customizacao/handles_e_conexoes.md`](./customizacao/handles_e_conexoes.md) |
| Valida??o de conex?es e limites de handles | [`customizacao/handles_e_conexoes.md`](./customizacao/handles_e_conexoes.md) | [`api_referencia/componentes_core.md`](./api_referencia/componentes_core.md) |
| Arestas Customizadas SVG com bot?es | [`customizacao/custom_edges.md`](./customizacao/custom_edges.md) | [`customizacao/edge_labels.md`](./customizacao/edge_labels.md) |
| R?tulos HTML sobre arestas com EdgeLabelRenderer | [`customizacao/edge_labels.md`](./customizacao/edge_labels.md) | [`customizacao/custom_edges.md`](./customizacao/custom_edges.md) |
| Classes utilit?rias `nodrag`, `nopan`, `nowheel` | [`customizacao/classes_utilitarias.md`](./customizacao/classes_utilitarias.md) | [`customizacao/custom_nodes.md`](./customizacao/custom_nodes.md) |
| Theming, Dark Mode e vari?veis CSS | [`customizacao/theming_e_dark_mode.md`](./customizacao/theming_e_dark_mode.md) | [`primeiros_passos/tailwind_e_estilizacao.md`](./primeiros_passos/tailwind_e_estilizacao.md) |
| Layout autom?tico com Dagre ou ELKjs | [`layouting/algoritmos_dagre_elkjs.md`](./layouting/algoritmos_dagre_elkjs.md) | [`layouting/layout_overview_e_engines.md`](./layouting/layout_overview_e_engines.md) |
| Subflows, n?s pais e aninhamento | [`layouting/subflows_e_agrupamentos.md`](./layouting/subflows_e_agrupamentos.md) | [`customizacao/custom_nodes.md`](./customizacao/custom_nodes.md) |
| Gerenciamento de Estado com Zustand | [`uso_avancado/state_management_zustand.md`](./uso_avancado/state_management_zustand.md) | [`uso_avancado/computing_flows.md`](./uso_avancado/computing_flows.md) |
| Fluxos de Computa??o Reativa (Pipeline DAG) | [`uso_avancado/computing_flows.md`](./uso_avancado/computing_flows.md) | [`uso_avancado/state_management_zustand.md`](./uso_avancado/state_management_zustand.md) |
| Tipagem Estrita TypeScript (Discriminated Unions) | [`uso_avancado/typescript.md`](./uso_avancado/typescript.md) | [`api_referencia/tipos_e_interfaces.md`](./api_referencia/tipos_e_interfaces.md) |
| Fluxo N?o Controlado (Uncontrolled Flow) | [`uso_avancado/uncontrolled_flows.md`](./uso_avancado/uncontrolled_flows.md) | [`conceitos_fundamentais/construindo_um_grafo.md`](./conceitos_fundamentais/construindo_um_grafo.md) |
| Otimiza??o de performance para 1000+ n?s | [`uso_avancado/performance_e_otimizacao.md`](./uso_avancado/performance_e_otimizacao.md) | [`customizacao/custom_nodes.md`](./customizacao/custom_nodes.md) |
| Server-Side Rendering (Next.js App/Pages Router) | [`uso_avancado/server_side_rendering.md`](./uso_avancado/server_side_rendering.md) | [`primeiros_passos/instalacao_e_setup.md`](./primeiros_passos/instalacao_e_setup.md) |
| Painel de Debugging e DevTools | [`uso_avancado/devtools_e_debugging.md`](./uso_avancado/devtools_e_debugging.md) | [`react_flow_ui/componentes_controls_e_paineis.md`](./react_flow_ui/componentes_controls_e_paineis.md) |
| Multiplayer em tempo real com Yjs / WebSockets | [`uso_avancado/multiplayer_e_colaboracao.md`](./uso_avancado/multiplayer_e_colaboracao.md) | [`uso_avancado/whiteboard_e_desenho.md`](./uso_avancado/whiteboard_e_desenho.md) |
| Whiteboard, Post-its e Desenho Livre | [`uso_avancado/whiteboard_e_desenho.md`](./uso_avancado/whiteboard_e_desenho.md) | [`customizacao/custom_nodes.md`](./customizacao/custom_nodes.md) |
| Acessibilidade WCAG 2.1 AA e navega??o teclado | [`uso_avancado/acessibilidade.md`](./uso_avancado/acessibilidade.md) | [`api_referencia/componentes_core.md`](./api_referencia/componentes_core.md) |
| Testes E2E e unit?rios (Playwright, Vitest) | [`uso_avancado/testes.md`](./uso_avancado/testes.md) | [`uso_avancado/typescript.md`](./uso_avancado/typescript.md) |
| Componentes Core (`<ReactFlow />`, `<Handle />`) | [`api_referencia/componentes_core.md`](./api_referencia/componentes_core.md) | [`api_referencia/componentes_auxiliares.md`](./api_referencia/componentes_auxiliares.md) |
| Componentes Auxiliares (`<NodeResizer />`, etc.) | [`api_referencia/componentes_auxiliares.md`](./api_referencia/componentes_auxiliares.md) | [`api_referencia/componentes_core.md`](./api_referencia/componentes_core.md) |
| Cat?logo Completo dos 18 Hooks | [`api_referencia/hooks_referencia_completa.md`](./api_referencia/hooks_referencia_completa.md) | [`uso_avancado/hooks_e_providers.md`](./uso_avancado/hooks_e_providers.md) |
| Fun??es Utilit?rias (`addEdge`, `getBezierPath`) | [`api_referencia/funcoes_utilitarias.md`](./api_referencia/funcoes_utilitarias.md) | [`conceitos_fundamentais/construindo_um_grafo.md`](./conceitos_fundamentais/construindo_um_grafo.md) |
| Refer?ncia de Tipos e Interfaces TypeScript | [`api_referencia/tipos_e_interfaces.md`](./api_referencia/tipos_e_interfaces.md) | [`uso_avancado/typescript.md`](./uso_avancado/typescript.md) |
| React Flow UI Setup com shadcn/ui | [`react_flow_ui/introducao_e_setup_shadcn.md`](./react_flow_ui/introducao_e_setup_shadcn.md) | [`primeiros_passos/tailwind_e_estilizacao.md`](./primeiros_passos/tailwind_e_estilizacao.md) |
| Componentes de UI: BaseNode, Status, Tooltip | [`react_flow_ui/componentes_nodes_e_utilities.md`](./react_flow_ui/componentes_nodes_e_utilities.md) | [`customizacao/custom_nodes.md`](./customizacao/custom_nodes.md) |
| Componentes de UI: BaseHandle, AnimatedEdge | [`react_flow_ui/componentes_edges_e_handles.md`](./react_flow_ui/componentes_edges_e_handles.md) | [`customizacao/handles_e_conexoes.md`](./customizacao/handles_e_conexoes.md) |
| Componentes de UI: NodeSearch, ZoomSlider | [`react_flow_ui/componentes_controls_e_paineis.md`](./react_flow_ui/componentes_controls_e_paineis.md) | [`conceitos_fundamentais/componentes_embutidos.md`](./conceitos_fundamentais/componentes_embutidos.md) |
| Template Completo: AI Workflow Editor | [`react_flow_ui/templates_ai_workflow.md`](./react_flow_ui/templates_ai_workflow.md) | [`uso_avancado/computing_flows.md`](./uso_avancado/computing_flows.md) |
| Tutorial Completo: Mind Map App | [`tutoriais_completos/tutorial_mind_map_app.md`](./tutoriais_completos/tutorial_mind_map_app.md) | [`uso_avancado/state_management_zustand.md`](./uso_avancado/state_management_zustand.md) |
| Tutorial Completo: Web Audio Synth App | [`tutoriais_completos/tutorial_web_audio_api.md`](./tutoriais_completos/tutorial_web_audio_api.md) | [`uso_avancado/computing_flows.md`](./uso_avancado/computing_flows.md) |
| Tutorial Completo: Slideshow App | [`tutoriais_completos/tutorial_slideshow_app.md`](./tutoriais_completos/tutorial_slideshow_app.md) | [`conceitos_fundamentais/viewport_pan_zoom.md`](./conceitos_fundamentais/viewport_pan_zoom.md) |
| Resolu??o de Erros Comuns e Warnings | [`referencia_e_troubleshooting/erros_comuns_e_solucoes.md`](./referencia_e_troubleshooting/erros_comuns_e_solucoes.md) | [`primeiros_passos/quickstart_e_boilerplate.md`](./primeiros_passos/quickstart_e_boilerplate.md) |
| Migra??o para React Flow v12 (`@xyflow/react`) | [`referencia_e_troubleshooting/migracao_v12.md`](./referencia_e_troubleshooting/migracao_v12.md) | [`referencia_e_troubleshooting/migracao_v11.md`](./referencia_e_troubleshooting/migracao_v11.md) |
| Migra??o para React Flow v11 (`reactflow`) | [`referencia_e_troubleshooting/migracao_v11.md`](./referencia_e_troubleshooting/migracao_v11.md) | [`referencia_e_troubleshooting/migracao_v10.md`](./referencia_e_troubleshooting/migracao_v10.md) |
| Migra??o para React Flow v10 | [`referencia_e_troubleshooting/migracao_v10.md`](./referencia_e_troubleshooting/migracao_v10.md) | [`referencia_e_troubleshooting/erros_comuns_e_solucoes.md`](./referencia_e_troubleshooting/erros_comuns_e_solucoes.md) |

---

## Mapa de Contexto e Cat?logo dos 46 M?dulos

### 1. `primeiros_passos/`
- **[`instalacao_e_setup.md`](./primeiros_passos/instalacao_e_setup.md)**: Comandos para npm, pnpm, yarn e bun. Templates oficiais Vite (`degit xyflow/vite-react-flow-template`). Requisitos de runtime.
- **[`quickstart_e_boilerplate.md`](./primeiros_passos/quickstart_e_boilerplate.md)**: Boilerplate funcional completo com `useState`, `applyNodeChanges`, `applyEdgeChanges`, `addEdge` e `fitView`.
- **[`tailwind_e_estilizacao.md`](./primeiros_passos/tailwind_e_estilizacao.md)**: Ordem de importa??o no Tailwind CSS 4 com `@layer base` no `global.css`.

### 2. `conceitos_fundamentais/`
- **[`termos_e_definicoes.md`](./conceitos_fundamentais/termos_e_definicoes.md)**: Defini??es formais de Node, Edge, Handle, Viewport, Canvas, Pane, Coordinate Systems (Screen vs Flow).
- **[`construindo_um_grafo.md`](./conceitos_fundamentais/construindo_um_grafo.md)**: Estrutura dos arrays de n?s e arestas, IDs ?nicos e propriedades obrigat?rias.
- **[`adicionando_interatividade.md`](./conceitos_fundamentais/adicionando_interatividade.md)**: Callbacks de eventos, ciclo de vida da conex?o e manipula??o imut?vel de estado.
- **[`viewport_pan_zoom.md`](./conceitos_fundamentais/viewport_pan_zoom.md)**: Propriedades `fitView`, `minZoom`, `maxZoom`, `defaultViewport`, `panOnDrag`, `panOnScroll`.
- **[`componentes_embutidos.md`](./conceitos_fundamentais/componentes_embutidos.md)**: Pain?is embutidos `<MiniMap />`, `<Controls />`, `<Background />`, `<Panel />`.

### 3. `customizacao/`
- **[`custom_nodes.md`](./customizacao/custom_nodes.md)**: Cria??o de n?s com formul?rios, dados reativos e memoiza??o de `nodeTypes`.
- **[`handles_e_conexoes.md`](./customizacao/handles_e_conexoes.md)**: Posicionamento de handles (`Position.Top/Bottom/Left/Right`), valida??o com `isValidConnection` e limites de conex?es.
- **[`custom_edges.md`](./customizacao/custom_edges.md)**: Arestas personalizadas com SVG, caminhos B?zier/SmoothStep e bot?es interativos.
- **[`edge_labels.md`](./customizacao/edge_labels.md)**: Renderiza??o de r?tulos HTML interativos com `<EdgeLabelRenderer />`.
- **[`classes_utilitarias.md`](./customizacao/classes_utilitarias.md)**: Uso de `nodrag`, `nopan` e `nowheel` para isolar elementos interativos internos.
- **[`theming_e_dark_mode.md`](./customizacao/theming_e_dark_mode.md)**: Prop `colorMode` (`dark`, `light`, `system`) e personaliza??o de vari?veis CSS.

### 4. `layouting/`
- **[`layout_overview_e_engines.md`](./layouting/layout_overview_e_engines.md)**: Vis?o geral dos motores de layout (Dagre, ELKjs, D3-hierarchy, D3-force).
- **[`subflows_e_agrupamentos.md`](./layouting/subflows_e_agrupamentos.md)**: N?s pais com `parentId`, posi??es relativas e `extent="parent"`.
- **[`algoritmos_dagre_elkjs.md`](./layouting/algoritmos_dagre_elkjs.md)**: Implementa??es completas de c?lculo de coordenadas com Dagre e ELKjs.

### 5. `uso_avancado/`
- **[`hooks_e_providers.md`](./uso_avancado/hooks_e_providers.md)**: M?todos de `useReactFlow()` e arquitetura com `<ReactFlowProvider />`.
- **[`state_management_zustand.md`](./uso_avancado/state_management_zustand.md)**: Store Zustand desacoplada com seletores at?micos `useShallow` e Undo/Redo.
- **[`computing_flows.md`](./uso_avancado/computing_flows.md)**: Pipeline reativo DAG de transmiss?o de dados entre n?s conectados.
- **[`typescript.md`](./uso_avancado/typescript.md)**: Discriminated Unions para `AppNode` e `AppEdge`, tipagem estrita de n?s e generics.
- **[`uncontrolled_flows.md`](./uso_avancado/uncontrolled_flows.md)**: Uso de `defaultNodes`/`defaultEdges` e serializa??o com `toObject()`.
- **[`performance_e_otimizacao.md`](./uso_avancado/performance_e_otimizacao.md)**: As 5 regras de ouro para alta performance (1000+ n?s a 60 FPS).
- **[`server_side_rendering.md`](./uso_avancado/server_side_rendering.md)**: Next.js (App Router e Pages Router), hidrata??o e Open Graph com Satori.
- **[`devtools_e_debugging.md`](./uso_avancado/devtools_e_debugging.md)**: Painel de inspe??o de n?s, logs de mudan?as e contornos de handles.
- **[`multiplayer_e_colaboracao.md`](./uso_avancado/multiplayer_e_colaboracao.md)**: Colabora??o em tempo real com Yjs, CRDTs e cursores compartilhados.
- **[`whiteboard_e_desenho.md`](./uso_avancado/whiteboard_e_desenho.md)**: Canvas infinito para post-its, formas geom?tricas e desenho ? m?o livre.
- **[`acessibilidade.md`](./uso_avancado/acessibilidade.md)**: Conformidade WCAG 2.1 AA, navega??o por teclado e `ariaLabelConfig`.
- **[`testes.md`](./uso_avancado/testes.md)**: Testes E2E com Playwright e testes unit?rios com Vitest.

### 6. `api_referencia/`
- **[`componentes_core.md`](./api_referencia/componentes_core.md)**: Tabelas exaustivas de props para `<ReactFlow />`, `<ReactFlowProvider />`, `<Background />`, `<BaseEdge />`, `<Handle />`.
- **[`componentes_auxiliares.md`](./api_referencia/componentes_auxiliares.md)**: Props de `<Controls />`, `<MiniMap />`, `<NodeToolbar />`, `<EdgeToolbar />`, `<NodeResizer />`, `<Panel />`, `<ViewportPortal />`.
- **[`hooks_referencia_completa.md`](./api_referencia/hooks_referencia_completa.md)**: Documenta??o exaustiva de todos os 18 hooks com par?metros, retornos e exemplos.
- **[`funcoes_utilitarias.md`](./api_referencia/funcoes_utilitarias.md)**: `addEdge`, `applyNodeChanges`, `getBezierPath`, `getConnectedEdges`, `getIncomers`, `isNode`, `isEdge`, etc.
- **[`tipos_e_interfaces.md`](./api_referencia/tipos_e_interfaces.md)**: Defini??es TypeScript completas de `Node`, `Edge`, `NodeChange`, `EdgeChange`, `ConnectionState`, etc.

### 7. `react_flow_ui/`
- **[`introducao_e_setup_shadcn.md`](./react_flow_ui/introducao_e_setup_shadcn.md)**: Filosofia copy-paste do shadcn/ui, `npx shadcn@latest add` e integra??o Tailwind 4.
- **[`componentes_nodes_e_utilities.md`](./react_flow_ui/componentes_nodes_e_utilities.md)**: `BaseNode`, `DatabaseSchemaNode`, `LabeledGroupNode`, `PlaceholderNode`, `NodeStatusIndicator`, `NodeTooltip`.
- **[`componentes_edges_e_handles.md`](./react_flow_ui/componentes_edges_e_handles.md)**: `BaseHandle`, `LabeledHandle`, `ButtonHandle`, `AnimatedSvgEdge`, `ButtonEdge`, `DataEdge`.
- **[`componentes_controls_e_paineis.md`](./react_flow_ui/componentes_controls_e_paineis.md)**: `DevTools`, `NodeSearch`, `ZoomSelect`, `ZoomSlider`.
- **[`templates_ai_workflow.md`](./react_flow_ui/templates_ai_workflow.md)**: Arquitetura completa de templates AI Workflow Editor e Workflow Editor.

### 8. `tutoriais_completos/`
- **[`tutorial_mind_map_app.md`](./tutoriais_completos/tutorial_mind_map_app.md)**: Aplica??o de Mapa Mental multi-arquivos com cria??o din?mica de filhos e store Zustand.
- **[`tutorial_web_audio_api.md`](./tutoriais_completos/tutorial_web_audio_api.md)**: Sintetizador Web Audio API multi-arquivos conectado ao grafo em tempo real.
- **[`tutorial_slideshow_app.md`](./tutoriais_completos/tutorial_slideshow_app.md)**: Apresenta??o de slides interativa no canvas infinito com navega??o por c?mera.

### 9. `referencia_e_troubleshooting/`
- **[`erros_comuns_e_solucoes.md`](./referencia_e_troubleshooting/erros_comuns_e_solucoes.md)**: Resolu??o dos 8 erros e avisos mais frequentes do React Flow.
- **[`migracao_v12.md`](./referencia_e_troubleshooting/migracao_v12.md)**: Guia passo a passo de migra??o para React Flow v12 (`@xyflow/react`).
- **[`migracao_v11.md`](./referencia_e_troubleshooting/migracao_v11.md)**: Guia de migra??o para a v11 (`reactflow`).
- **[`migracao_v10.md`](./referencia_e_troubleshooting/migracao_v10.md)**: Guia hist?rico de migra??o para a v10.
