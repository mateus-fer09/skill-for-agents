# BlockNote — Índice Mestre

## Visão geral

BlockNote é um editor rich-text baseado em blocos. Documentos são representados como listas de objetos `Block`; blocos podem conter conteúdo inline e filhos. A biblioteca é orientada a React, mas também oferece uso Vanilla JS. Possui UI integrada, schemas extensíveis, conversão entre formatos, colaboração via Yjs, suporte a extensões e pacotes XL para recursos adicionais.

## Regras globais

- O formato nativo e recomendado para persistência é o JSON de blocos (`editor.document`) quando é necessário preservar a estrutura sem perdas.
- `BlockNoteView` é tratado como componente não controlado; o conteúdo inicial deve ser passado na criação do editor, enquanto mudanças são lidas pela API/eventos do editor.
- Customizações estruturais são modeladas por `BlockNoteSchema` e specs de bloco/inline/style.
- Recursos visuais flutuantes podem ser substituídos/desativados individualmente e montados por controllers React.
- Conversões para HTML padrão ou Markdown podem ser lossy; a Skill separa interoperabilidade de persistência nativa.
- Colaboração é baseada em Yjs e exige provider/documento/fragmento apropriados.

## Mapa de contexto

| Intenção | Arquivo |
|---|---|
| Instalar e iniciar | `getting_started/quickstart.md` |
| Mantine, Ariakit, ShadCN, Next.js ou Vanilla JS | `getting_started/integracoes.md` |
| Configurar `useCreateBlockNote` / `BlockNoteView` | `getting_started/editor_setup.md` |
| Entender `Block`, `InlineContent`, children e tabelas | `foundations/document_structure.md` |
| Entender schemas | `foundations/schemas.md` |
| Alterar blocos e conteúdo | `reference/editor/manipulating_content.md` |
| Converter/importar/exportar formatos | `foundations/interoperability.md` |
| Consultar blocos padrão | `features/blocks/default_blocks.md` |
| Tipografia, listas, tabelas e embeds | `features/blocks/content_blocks.md` |
| Code, Math e Diagram blocks | `features/blocks/advanced_blocks.md` |
| Inline content e links | `features/blocks/inline_content.md` |
| Criar schemas/blocos/styles customizados | `features/custom_schemas/overview.md` |
| Colaboração e comentários | `features/collaboration.md` |
| Import, servidor, i18n e extensões | `features/platform_features.md` |
| React hooks e `BlockNoteView` | `react/overview.md` |
| Toolbars, menus e file panel | `react/components/ui_components.md` |
| Temas, CSS e atributos DOM | `react/styling/theming.md` |
| API geral do editor | `reference/editor/overview.md` |
| Cursor e seleção | `reference/editor/cursor_selections.md` |
| Eventos | `reference/editor/events.md` |
| Yjs utilities | `reference/editor/yjs_utilities.md` |
| Paste handling | `reference/editor/paste_handling.md` |
| Encontrar exemplos por categoria | `examples/index.md` |
| Exemplos Basic/Backend | `examples/basic_backend.md` |
| Exemplos UI/Theming | `examples/ui_theming.md` |
| Exemplos interoperabilidade | `examples/interoperability.md` |
| Exemplos custom schema | `examples/custom_schemas.md` |
| Exemplos colaboração/extensões | `examples/collaboration_extensions.md` |
| Exemplos AI/Vanilla | `examples/ai_vanilla.md` |
| Auditar fontes | `sources_manifest.md` |
| Auditar cobertura/limitações | `coverage_report.md` |

## Roteamento por API

- `BlockNoteEditor`, `isEditable`, `focus`, `undo`, `redo`, paste e opções → `reference/editor/overview.md`
- `insertBlocks`, `updateBlock`, `removeBlocks`, `replaceBlocks`, move/nest, estilos e links → `reference/editor/manipulating_content.md`
- seleção/cursor → `reference/editor/cursor_selections.md`
- eventos → `reference/editor/events.md`
- Yjs conversion/utilities → `reference/editor/yjs_utilities.md`
- `BlockNoteSchema`, specs e custom schema → `foundations/schemas.md` + `features/custom_schemas/overview.md`
- `FormattingToolbar`, `SuggestionMenuController`, Side Menu, Link Toolbar → `react/components/ui_components.md`
