# BlockNote Master Knowledge Index & Router

Este arquivo é o roteador mestre da Skill do **BlockNote**. Ele mapeia toda a base de conhecimento oficial organizada para agentes de IA.

## 1. Visão Geral da Tecnologia

O **BlockNote** é um editor de texto rico baseado em blocos (estilo Notion) construído sobre o **ProseMirror** e **Tiptap**, com suporte nativo e de primeira classe para **React**.
Ele oferece uma experiência pronta para uso (`out-of-the-box`) com menus flutuantes, barra de formatação, menu lateral de arraste (+ / handle), comandos de barra (`/slash-menu`), esquemas extensíveis de blocos customizados e colaboração em tempo real via **Yjs**.

## 2. Pacotes e Arquitetura do Ecossistema

- `@blocknote/core`: O núcleo do editor agnóstico de UI, gerenciando o documento, estado, ProseMirror, Yjs e esquemas.
- `@blocknote/react`: Bindings oficiais do React (`useCreateBlockNote`, `BlockNoteView`), componentes de UI padrão e helpers para blocos customizados (`createReactBlockSpec`, `createReactInlineContentSpec`, `createReactStyleSpec`).
- `@blocknote/shadcn` / `@blocknote/mantine` / `@blocknote/ariakit`: Integrações prontas com bibliotecas populares de componentes UI.
- `@blocknote/xl-ai` e `@blocknote/xl-comments`: Módulos de inteligência artificial (geração/edição de texto) e colaboração com threads de comentários.

## 3. Regras Globais de Implementação e Boas Práticas

1. **Inicialização com Hook**: Em React, sempre crie o editor com o hook `useCreateBlockNote()` para garantir estabilidade e evitar recriações indesejadas de estado.
2. **Importação Obrigatória de CSS**: Sempre importe os estilos globais `@blocknote/core/fonts/inter.css` e `@blocknote/react/style.css` (ou o tema correspondente da sua UI library).
3. **Esquema Tipado (`BlockNoteSchema.create()`)**: Para adicionar blocos, estilos ou inline content customizados, sempre passe o schema explicitamente para `useCreateBlockNote({ schema })`.
4. **Imutabilidade e Manipulação de Blocos**: Utilize métodos como `editor.insertBlocks()`, `editor.updateBlock()`, `editor.replaceBlocks()` e `editor.removeBlocks()` para alterar conteúdo de forma determinística.
5. **Colaboração em Tempo Real**: Use `useCreateBlockNote({ collaboration: { provider, fragment, user } })` integrado a provedores Yjs (como Hocuspocus, Liveblocks, PartyKit ou Y-Websocket).

## 4. Roteamento Rápido por Intenção do Usuário

| Intenção do Usuário | Arquivo Recomendado |
|---|---|
| Instalar e configurar editor básico no React | [`primeiros_passos/editor_setup.md`](primeiros_passos/editor_setup.md) |
| Integrar com Next.js (SSR / Dynamic Import) | [`primeiros_passos/nextjs.md`](primeiros_passos/nextjs.md) |
| Integrar com componentes ShadCN UI | [`primeiros_passos/shadcn.md`](primeiros_passos/shadcn.md) |
| Integrar com Mantine ou Ariakit | [`primeiros_passos/mantine.md`](primeiros_passos/mantine.md) / [`primeiros_passos/ariakit.md`](primeiros_passos/ariakit.md) |
| Customizar Barra de Formatação (`FormattingToolbar`) | [`componentes_react/formatting_toolbar.md`](componentes_react/formatting_toolbar.md) |
| Customizar Menu Lateral / Handle (`SideMenu`) | [`componentes_react/side_menu.md`](componentes_react/side_menu.md) |
| Customizar Comandos de Barra (`SuggestionMenus` / Slash Menu) | [`componentes_react/suggestion_menus.md`](componentes_react/suggestion_menus.md) |
| Criar Bloco Customizado em React (`createReactBlockSpec`) | [`esquemas_customizados/custom_blocks.md`](esquemas_customizados/custom_blocks.md) |
| Criar Estilo Customizado (ex: highlight, small caps) | [`esquemas_customizados/custom_styles.md`](esquemas_customizados/custom_styles.md) |
| Criar Conteúdo Inline Customizado (ex: menção `@user`, tag) | [`esquemas_customizados/custom_inline_content.md`](esquemas_customizados/custom_inline_content.md) |
| Configurar Colaboração em Tempo Real (Yjs) | [`recursos_avancados/colaboracao_tempo_real.md`](recursos_avancados/colaboracao_tempo_real.md) |
| Adicionar Sistema de Comentários / Threads | [`recursos_avancados/colaboracao_comments.md`](recursos_avancados/colaboracao_comments.md) |
| Integrar Recursos de IA (`@blocknote/xl-ai`) | [`recursos_avancados/ai_rich_text_editing.md`](recursos_avancados/ai_rich_text_editing.md) |
| Importar / Exportar Markdown ou HTML | [`importacao_e_exportacao/export_markdown.md`](importacao_e_exportacao/export_markdown.md) / [`importacao_e_exportacao/export_html.md`](importacao_e_exportacao/export_html.md) |
| Exportar para PDF ou DOCX | [`importacao_e_exportacao/export_pdf.md`](importacao_e_exportacao/export_pdf.md) / [`importacao_e_exportacao/export_docx.md`](importacao_e_exportacao/export_docx.md) |
| Customizar Temas, Cores e CSS | [`estilizacao_e_temas/themes.md`](estilizacao_e_temas/themes.md) / [`estilizacao_e_temas/overriding_css.md`](estilizacao_e_temas/overriding_css.md) |
| Consultar API completa do Editor (`BlockNoteEditor`) | [`referencia_da_api/editor_overview.md`](referencia_da_api/editor_overview.md) |
| Métodos de Manipulação de Blocos | [`referencia_da_api/editor_manipulating_content.md`](referencia_da_api/editor_manipulating_content.md) |
| Gerenciar Cursor, Seleção e Foco | [`referencia_da_api/editor_cursor_selections.md`](referencia_da_api/editor_cursor_selections.md) |
| Escutar Eventos e Mudanças no Editor | [`referencia_da_api/editor_events.md`](referencia_da_api/editor_events.md) |

## 5. Mapa de Contexto e Catálogo Completo de Arquivos

### [`blocos_e_conteudo/blocos_padrao.md`](blocos_e_conteudo/blocos_padrao.md)

- **Título**: Built-in Blocks
- **Descrição**: BlockNote supports a number of built-in blocks, inline content types, and styles that are included in the editor by default. This is called the Default Schema. To create your own c
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/blocks
- **Exemplos de Código**: 3 bloco(s)

### [`blocos_e_conteudo/code_blocks.md`](blocos_e_conteudo/code_blocks.md)

- **Título**: Code Blocks
- **Descrição**: Code blocks are a simple way to display formatted code. By default they're kept deliberately simple, but BlockNote also supports more advanced features:
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/blocks/code-blocks
- **Exemplos de Código**: 8 bloco(s)

### [`blocos_e_conteudo/custom.md`](blocos_e_conteudo/custom.md)

- **Título**: Custom Blocks, Inline Content and Styles
- **Descrição**: You can also extend your editor and create your own Blocks, Inline Content or Styles using React. Skip to [Custom Schemas (advanced)](/docs/features/custom-schemas) to learn how to
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/blocks/custom
- **Exemplos de Código**: 0 bloco(s)

### [`blocos_e_conteudo/diagrams.md`](blocos_e_conteudo/diagrams.md)

- **Título**: Diagrams
- **Descrição**: The @blocknote/diagram-block package adds a diagram block : authored as [Mermaid](https://mermaid.js.org/) source in a source popup, rendered as the diagram it describes — flowchar
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/blocks/diagrams
- **Exemplos de Código**: 7 bloco(s)

### [`blocos_e_conteudo/embeds.md`](blocos_e_conteudo/embeds.md)

- **Título**: Embed Blocks
- **Descrição**: Embeds are a way to display content from external sources in your documents. BlockNote supports various embeds to help you structure and format your content effectively.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/blocks/embeds
- **Exemplos de Código**: 7 bloco(s)

### [`blocos_e_conteudo/inline_content.md`](blocos_e_conteudo/inline_content.md)

- **Título**: Inline Content
- **Descrição**: By default, InlineContent (the content of text blocks like paragraphs) in BlockNote can either be a StyledText or a Link object.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/blocks/inline-content
- **Exemplos de Código**: 6 bloco(s)

### [`blocos_e_conteudo/list_types.md`](blocos_e_conteudo/list_types.md)

- **Título**: List Item Blocks
- **Descrição**: List item blocks are used to create different types of lists in your documents. BlockNote supports various list item blocks to help you structure and format your content effectivel
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/blocks/list-types
- **Exemplos de Código**: 4 bloco(s)

### [`blocos_e_conteudo/math.md`](blocos_e_conteudo/math.md)

- **Título**: Math & Equations
- **Descrição**: The @blocknote/math-block package adds mathematical notation to your documents: a math block for standalone equations and inline math that flows with the surrounding text. Both are
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/blocks/math
- **Exemplos de Código**: 10 bloco(s)

### [`blocos_e_conteudo/tables.md`](blocos_e_conteudo/tables.md)

- **Título**: Table Blocks
- **Descrição**: Tables are a simple way to display data in a grid.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/blocks/tables
- **Exemplos de Código**: 6 bloco(s)

### [`blocos_e_conteudo/typography.md`](blocos_e_conteudo/typography.md)

- **Título**: Typography Blocks
- **Descrição**: Typography blocks are fundamental elements for displaying text content in your documents. BlockNote supports various typography blocks to help you structure and format your content
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/blocks/typography
- **Exemplos de Código**: 5 bloco(s)

### [`componentes_react/catalogo_de_componentes.md`](componentes_react/catalogo_de_componentes.md)

- **Título**: UI Components
- **Descrição**: BlockNote includes a number of UI Components (like menus and toolbars) that can be completely customized:
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/components
- **Exemplos de Código**: 1 bloco(s)

### [`componentes_react/formatting_toolbar.md`](componentes_react/formatting_toolbar.md)

- **Título**: Formatting Toolbar
- **Descrição**: The Formatting Toolbar appears whenever you highlight text in the editor.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/components/formatting-toolbar
- **Exemplos de Código**: 0 bloco(s)

### [`componentes_react/grid_suggestion_menus.md`](componentes_react/grid_suggestion_menus.md)

- **Título**: Grid Suggestion Menus
- **Descrição**: Grid Suggestion Menus appear when the user enters a trigger character, and text after the character is used to filter the menu items.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/components/grid-suggestion-menus
- **Exemplos de Código**: 0 bloco(s)

### [`componentes_react/hyperlink_toolbar.md`](componentes_react/hyperlink_toolbar.md)

- **Título**: Link Toolbar
- **Descrição**: The Link Toolbar appears whenever you hover a link in the editor.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/components/hyperlink-toolbar
- **Exemplos de Código**: 0 bloco(s)

### [`componentes_react/image_toolbar.md`](componentes_react/image_toolbar.md)

- **Título**: File Panel
- **Descrição**: The File Panel appears whenever you select a file (e.g. an image or video) that doesn't have a URL, or when you click the "Replace File" button in the [Formatting Toolbar](/docs/re
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/components/image-toolbar
- **Exemplos de Código**: 2 bloco(s)

### [`componentes_react/side_menu.md`](componentes_react/side_menu.md)

- **Título**: Block Side Menu
- **Descrição**: The Block Side Menu appears on the left side whenever you hover a block. By default, it consists of a + button and a drag handle ( ⠿ ):
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/components/side-menu
- **Exemplos de Código**: 0 bloco(s)

### [`componentes_react/suggestion_menus.md`](componentes_react/suggestion_menus.md)

- **Título**: Suggestion Menus
- **Descrição**: Suggestion Menus appear when the user enters a trigger character, and text after the character is used to filter the menu items.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/components/suggestion-menus
- **Exemplos de Código**: 6 bloco(s)

### [`componentes_react/visao_geral_react.md`](componentes_react/visao_geral_react.md)

- **Título**: Using BlockNote With React
- **Descrição**: BlockNote provides a powerful React integration that makes it easy to add rich text editing capabilities to your applications. The React bindings offer a declarative API that integ
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/overview
- **Exemplos de Código**: 4 bloco(s)

### [`esquemas_customizados/custom_blocks.md`](esquemas_customizados/custom_blocks.md)

- **Título**: Custom Block Types
- **Descrição**: In addition to the default block types that BlockNote offers, you can also make your own custom blocks using React components. Take a look at the demo below, in which we add a cust
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/custom-schemas/custom-blocks
- **Exemplos de Código**: 7 bloco(s)

### [`esquemas_customizados/custom_inline_content.md`](esquemas_customizados/custom_inline_content.md)

- **Título**: Custom Inline Content Types
- **Descrição**: In addition to the default inline content types that BlockNote offers, you can also make your own custom inline content using React components. Take a look at the demo below, in wh
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/custom-schemas/custom-inline-content
- **Exemplos de Código**: 6 bloco(s)

### [`esquemas_customizados/custom_styles.md`](esquemas_customizados/custom_styles.md)

- **Título**: Custom Style Types
- **Descrição**: In addition to the default style types that BlockNote offers, you can also make your own custom styles using React components. Take a look at the demo below, in which we add a cust
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/custom-schemas/custom-styles
- **Exemplos de Código**: 5 bloco(s)

### [`esquemas_customizados/source_with_preview.md`](esquemas_customizados/source_with_preview.md)

- **Título**: Source with Preview Blocks
- **Descrição**: Some blocks are authored as source code but are more useful shown as the thing that code produces — a LaTeX formula rendered as a formula, or Mermaid source rendered as a diagram. 
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/custom-schemas/source-with-preview
- **Exemplos de Código**: 4 bloco(s)

### [`esquemas_customizados/visao_geral_schemas.md`](esquemas_customizados/visao_geral_schemas.md)

- **Título**: Custom Schemas
- **Descrição**: By default, BlockNote documents support different kind of blocks, inline content and text styles (see [default schema](/docs/foundations/schemas)). However, you can extend BlockNot
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/custom-schemas
- **Exemplos de Código**: 5 bloco(s)

### [`estilizacao_e_temas/adding_dom_attributes.md`](estilizacao_e_temas/adding_dom_attributes.md)

- **Título**: Adding DOM Attributes
- **Descrição**: BlockNote allows you to add custom HTML attributes to various DOM elements within the editor. This gives you fine-grained control over styling and functionality.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/styling-theming/adding-dom-attributes
- **Exemplos de Código**: 0 bloco(s)

### [`estilizacao_e_temas/overriding_css.md`](estilizacao_e_temas/overriding_css.md)

- **Título**: Overriding CSS
- **Descrição**: BlockNote provides several ways to customize the editor's appearance through CSS. You can override default styles using CSS classes and attributes.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/styling-theming/overriding-css
- **Exemplos de Código**: 0 bloco(s)

### [`estilizacao_e_temas/temas_e_estilizacao.md`](estilizacao_e_temas/temas_e_estilizacao.md)

- **Título**: Styling & Theming
- **Descrição**: You can completely change the look and feel of the BlockNote editor. Change basic styling quickly with [theme CSS variables](/docs/react/styling-theming/themes), or apply more comp
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/styling-theming
- **Exemplos de Código**: 0 bloco(s)

### [`estilizacao_e_temas/themes.md`](estilizacao_e_temas/themes.md)

- **Título**: Themes
- **Descrição**: BlockNote comes with both a light and dark theme. By default, the theme is automatically selected based on the user's system preference, but you can also force either light or dark
- **Fonte Oficial**: https://www.blocknotejs.org/docs/react/styling-theming/themes
- **Exemplos de Código**: 3 bloco(s)

### [`importacao_e_exportacao/export_docx.md`](importacao_e_exportacao/export_docx.md)

- **Título**: DOCX Export
- **Descrição**: It's possible to export BlockNote documents to docx, completely client-side.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/export/docx
- **Exemplos de Código**: 5 bloco(s)

### [`importacao_e_exportacao/export_email.md`](importacao_e_exportacao/export_email.md)

- **Título**: Email Export
- **Descrição**: It's possible to export BlockNote documents to email-compatible HTML, completely client-side.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/export/email
- **Exemplos de Código**: 7 bloco(s)

### [`importacao_e_exportacao/export_html.md`](importacao_e_exportacao/export_html.md)

- **Título**: HTML Export
- **Descrição**: [!NOTE]
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/export/html
- **Exemplos de Código**: 2 bloco(s)

### [`importacao_e_exportacao/export_markdown.md`](importacao_e_exportacao/export_markdown.md)

- **Título**: Markdown Export
- **Descrição**: [!NOTE]
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/export/markdown
- **Exemplos de Código**: 1 bloco(s)

### [`importacao_e_exportacao/export_odt.md`](importacao_e_exportacao/export_odt.md)

- **Título**: ODT Export
- **Descrição**: It's possible to export BlockNote documents to ODT, completely client-side.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/export/odt
- **Exemplos de Código**: 5 bloco(s)

### [`importacao_e_exportacao/export_pdf.md`](importacao_e_exportacao/export_pdf.md)

- **Título**: PDF Export
- **Descrição**: It's possible to export BlockNote documents to PDF, completely client-side.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/export/pdf
- **Exemplos de Código**: 5 bloco(s)

### [`importacao_e_exportacao/import_html.md`](importacao_e_exportacao/import_html.md)

- **Título**: HTML Import
- **Descrição**: It's possible to import HTML content into BlockNote blocks, completely client-side.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/import/html
- **Exemplos de Código**: 1 bloco(s)

### [`importacao_e_exportacao/import_markdown.md`](importacao_e_exportacao/import_markdown.md)

- **Título**: Markdown Import
- **Descrição**: [!NOTE]
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/import/markdown
- **Exemplos de Código**: 1 bloco(s)

### [`importacao_e_exportacao/import_visao_geral.md`](importacao_e_exportacao/import_visao_geral.md)

- **Título**: Importing Content
- **Descrição**: There are two main paths to importing content into BlockNote:
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/import
- **Exemplos de Código**: 1 bloco(s)

### [`introducao_e_fundamentos/document_structure.md`](introducao_e_fundamentos/document_structure.md)

- **Título**: Document Structure
- **Descrição**: Each BlockNote document is made up of a list of blocks. A block is a piece of content like a paragraph, heading, list item or image. Blocks can be dragged around by users in the ed
- **Fonte Oficial**: https://www.blocknotejs.org/docs/foundations/document-structure
- **Exemplos de Código**: 6 bloco(s)

### [`introducao_e_fundamentos/introducao.md`](introducao_e_fundamentos/introducao.md)

- **Título**: Introduction to BlockNote
- **Descrição**: [](https://www.npmjs.com/package/@blocknote/core) [](https://github.com/TypeCellOS/BlockNote)
- **Fonte Oficial**: https://www.blocknotejs.org/docs
- **Exemplos de Código**: 0 bloco(s)

### [`introducao_e_fundamentos/manipulating_content.md`](introducao_e_fundamentos/manipulating_content.md)

- **Título**: Manipulating Blocks
- **Descrição**: BlockNote operates on a block-based architecture , where all content is organized into discrete blocks. Understanding how to manipulate these blocks is fundamental to working with 
- **Fonte Oficial**: https://www.blocknotejs.org/docs/foundations/manipulating-content
- **Exemplos de Código**: 5 bloco(s)

### [`introducao_e_fundamentos/schemas.md`](introducao_e_fundamentos/schemas.md)

- **Título**: Schemas
- **Descrição**: Schemas are the core of how BlockNote works. They are the basic building blocks of the editor, and are used to define the content of the editor.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/foundations/schemas
- **Exemplos de Código**: 0 bloco(s)

### [`introducao_e_fundamentos/supported_formats.md`](introducao_e_fundamentos/supported_formats.md)

- **Título**: Format Interoperability
- **Descrição**: BlockNote is compatible with a few different storage formats, each with its own advantages and disadvantages. This guide will show you how to use each of them.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/foundations/supported-formats
- **Exemplos de Código**: 6 bloco(s)

### [`primeiros_passos/ariakit.md`](primeiros_passos/ariakit.md)

- **Título**: Getting Started With Ariakit
- **Descrição**: [Ariakit](https://ariakit.org/) is an open-source library of unstyled (headless), primitive components with a focus on Accessibility.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/getting-started/ariakit
- **Exemplos de Código**: 1 bloco(s)

### [`primeiros_passos/editor_setup.md`](primeiros_passos/editor_setup.md)

- **Título**: Editor Setup
- **Descrição**: You can customize your editor when you instantiate it. Let's take a closer looks at the basic methods and components to set up your BlockNote editor.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/getting-started/editor-setup
- **Exemplos de Código**: 2 bloco(s)

### [`primeiros_passos/introducao_getting_started.md`](primeiros_passos/introducao_getting_started.md)

- **Título**: Getting Started
- **Descrição**: Getting started with BlockNote is quick and easy. Install the required packages and add the React component to your app.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/getting-started
- **Exemplos de Código**: 2 bloco(s)

### [`primeiros_passos/mantine.md`](primeiros_passos/mantine.md)

- **Título**: Getting Started With Mantine
- **Descrição**: [Mantine](https://mantine.dev/) is an open-source collection of React components.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/getting-started/mantine
- **Exemplos de Código**: 1 bloco(s)

### [`primeiros_passos/nextjs.md`](primeiros_passos/nextjs.md)

- **Título**: Getting Started With Next.js
- **Descrição**: BlockNote is a component that should only be rendered client-side (and not on the server). If you're using Next.js, you need to make sure that Next.js does not try to render BlockN
- **Fonte Oficial**: https://www.blocknotejs.org/docs/getting-started/nextjs
- **Exemplos de Código**: 3 bloco(s)

### [`primeiros_passos/shadcn.md`](primeiros_passos/shadcn.md)

- **Título**: Getting Started With ShadCN
- **Descrição**: [shadcn/ui](https://ui.shadcn.com/) is an open-source collection of React components based on [Radix](https://radix-ui.com/) and [TailwindCSS](https://tailwindcss.com/).
- **Fonte Oficial**: https://www.blocknotejs.org/docs/getting-started/shadcn
- **Exemplos de Código**: 4 bloco(s)

### [`primeiros_passos/vanilla_js.md`](primeiros_passos/vanilla_js.md)

- **Título**: Getting Started With Vanilla JS
- **Descrição**: BlockNote is mainly designed as a quick and easy drop-in block-based editor for React apps, but can also be used in vanilla JavaScript apps. However, this does involve writing your
- **Fonte Oficial**: https://www.blocknotejs.org/docs/getting-started/vanilla-js
- **Exemplos de Código**: 5 bloco(s)

### [`recursos_avancados/ai_backend_integration.md`](recursos_avancados/ai_backend_integration.md)

- **Título**: Backend Integration with BlockNote AI
- **Descrição**: The most common (and recommended) setup to integrate BlockNote AI with an LLM is to have BlockNote AI call your backend, which then calls an LLM of your choice using the [Vercel AI
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/ai/backend-integration
- **Exemplos de Código**: 3 bloco(s)

### [`recursos_avancados/ai_custom_commands.md`](recursos_avancados/ai_custom_commands.md)

- **Título**: Custom AI Menu Items (commands)
- **Descrição**: A central part when users are interacting with the AI agent is the AI Suggestion Menu where users can enter a custom prompt or select a pre-defined command:
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/ai/custom-commands
- **Exemplos de Código**: 3 bloco(s)

### [`recursos_avancados/ai_getting_started.md`](recursos_avancados/ai_getting_started.md)

- **Título**: Getting Started with BlockNote AI
- **Descrição**: This guide walks you through the steps to add AI functionality to your BlockNote rich text editor.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/ai/getting-started
- **Exemplos de Código**: 4 bloco(s)

### [`recursos_avancados/ai_reference.md`](recursos_avancados/ai_reference.md)

- **Título**: AI Reference
- **Descrição**: ## [ AIExtension ](#aiextension)
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/ai/reference
- **Exemplos de Código**: 8 bloco(s)

### [`recursos_avancados/ai_rich_text_editing.md`](recursos_avancados/ai_rich_text_editing.md)

- **Título**: BlockNote AI Integration
- **Descrição**: With BlockNote AI, you can add AI functionality to your rich text editor. Users can work with an AI agent to edit, write and format their documents.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/ai
- **Exemplos de Código**: 0 bloco(s)

### [`recursos_avancados/colaboracao_comments.md`](recursos_avancados/colaboracao_comments.md)

- **Título**: Comments
- **Descrição**: BlockNote supports Comments, Comment Threads (replies) and emoji reactions out of the box.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/collaboration/comments
- **Exemplos de Código**: 5 bloco(s)

### [`recursos_avancados/colaboracao_tempo_real.md`](recursos_avancados/colaboracao_tempo_real.md)

- **Título**: Real-time Collaboration (Multiplayer Text Editor)
- **Descrição**: Let's see how you can add Multiplayer capabilities to your BlockNote setup, and allow real-time collaboration between users (similar to Google Docs):
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/collaboration
- **Exemplos de Código**: 3 bloco(s)

### [`recursos_avancados/extensions.md`](recursos_avancados/extensions.md)

- **Título**: Extensions
- **Descrição**: BlockNote includes an extensions system which lets you expand the editor's behaviour. Extensions can include any of the following features:
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/extensions
- **Exemplos de Código**: 3 bloco(s)

### [`recursos_avancados/localization.md`](recursos_avancados/localization.md)

- **Título**: Localization (i18n)
- **Descrição**: BlockNote is designed to be fully localized, with support for multiple languages. You can easily change the language of your editor or create custom translations.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/localization
- **Exemplos de Código**: 7 bloco(s)

### [`recursos_avancados/server_processing.md`](recursos_avancados/server_processing.md)

- **Título**: Server-side Processing
- **Descrição**: While you can use the BlockNoteEditor on the client side, you can also use ServerBlockNoteEditor from @blocknote/server-util to process BlockNote documents on the server.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/features/server-processing
- **Exemplos de Código**: 3 bloco(s)

### [`referencia_da_api/editor_cursor_selections.md`](referencia_da_api/editor_cursor_selections.md)

- **Título**: Cursor & Selections
- **Descrição**: BlockNote provides APIs to work with cursor positions and text selections, allowing you to understand where users are interacting with the editor and programmatically control the s
- **Fonte Oficial**: https://www.blocknotejs.org/docs/reference/editor/cursor-selections
- **Exemplos de Código**: 6 bloco(s)

### [`referencia_da_api/editor_events.md`](referencia_da_api/editor_events.md)

- **Título**: Events
- **Descrição**: BlockNote provides several event callbacks that allow you to respond to changes in the editor. These events are essential for building reactive applications and tracking user inter
- **Fonte Oficial**: https://www.blocknotejs.org/docs/reference/editor/events
- **Exemplos de Código**: 8 bloco(s)

### [`referencia_da_api/editor_manipulating_content.md`](referencia_da_api/editor_manipulating_content.md)

- **Título**: Manipulating Content
- **Descrição**: BlockNote provides comprehensive APIs for manipulating both blocks and inline content within the editor. This guide covers how to programmatically work with the document structure 
- **Fonte Oficial**: https://www.blocknotejs.org/docs/reference/editor/manipulating-content
- **Exemplos de Código**: 37 bloco(s)

### [`referencia_da_api/editor_overview.md`](referencia_da_api/editor_overview.md)

- **Título**: BlockNote API Overview
- **Descrição**: The BlockNote editor API is a comprehensive set of functions and methods that allow you to interact with the editor and manipulate its content.
- **Fonte Oficial**: https://www.blocknotejs.org/docs/reference/editor/overview
- **Exemplos de Código**: 9 bloco(s)

### [`referencia_da_api/editor_paste_handling.md`](referencia_da_api/editor_paste_handling.md)

- **Título**: Paste Handling
- **Descrição**: BlockNote, by default, attempts to paste content in the following order:
- **Fonte Oficial**: https://www.blocknotejs.org/docs/reference/editor/paste-handling
- **Exemplos de Código**: 2 bloco(s)

### [`referencia_da_api/editor_yjs_utilities.md`](referencia_da_api/editor_yjs_utilities.md)

- **Título**: YJS Utilities
- **Descrição**: The @blocknote/core/yjs export provides utilities for converting between BlockNote blocks and YJS collaborative documents. These utilities are useful when you need to work with YJS
- **Fonte Oficial**: https://www.blocknotejs.org/docs/reference/editor/yjs-utilities
- **Exemplos de Código**: 10 bloco(s)

