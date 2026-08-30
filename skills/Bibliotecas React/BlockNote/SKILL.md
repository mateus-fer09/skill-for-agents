---
name: blocknote
description: "Skill técnica completa e modular para desenvolvimento com BlockNote, o editor de texto rico baseado em blocos (estilo Notion) para React e TypeScript (ProseMirror + Yjs). Cobre inicialização (useCreateBlockNote, BlockNoteView), custom schemas (custom blocks, styles, inline content), componentes de UI (FormattingToolbar, SideMenu, Slash Menu), colaboração Yjs, BlockNote AI, import/export (Markdown, HTML, DOCX, PDF) e API de manipulação de blocos."
---

# BlockNote Technical Knowledge Skill

Esta Skill fornece conhecimento técnico exaustivo, modular e oficial para agentes de IA que implementam, customizam e estendem editores de texto rico baseados em blocos utilizando o **BlockNote**.

## 1. Identidade e Propósito
- **Tecnologia**: [BlockNote](https://www.blocknotejs.org/) (Editor WYSIWYG baseado em blocos para React, ProseMirror e Yjs)
- **Documentação de Origem**: Site Oficial do BlockNote (`https://www.blocknotejs.org/docs`)
- **Escopo Coberto**:
  - Fundamentos (Document Structure, Block Schemas, Formatos e Interoperabilidade)
  - Configuração e Setup (React, Next.js com Dynamic Import/SSR-safe, ShadCN, Mantine, Ariakit, Vanilla JS)
  - Componentes de UI (`BlockNoteView`, `FormattingToolbar`, `SideMenu`, `SuggestionMenu`, `HyperlinkToolbar`, `FilePanel`)
  - Blocos Nativos (Parágrafos, Títulos H1-H6, Listas com bullets/números/check, Tabelas, Código, Diagramas, Fórmulas Matemáticas KaTeX, Embeds)
  - Esquemas Customizados (`createReactBlockSpec`, `createReactInlineContentSpec`, `createReactStyleSpec`, `BlockNoteSchema.create()`)
  - Colaboração e Tempo Real (Yjs, Liveblocks, PartyKit, Hocuspocus, comentários em threads com `@blocknote/xl-comments`)
  - Recursos de IA (`@blocknote/xl-ai`, streaming, comandos customizados, prompts e backend integration)
  - Importação e Exportação (HTML, Markdown, DOCX, PDF, ODT, Email)
  - Temas e Estilização (CSS Variables, Dark/Light Mode, Tailwind, Atributos DOM)
  - Referência Completa da API do Editor (`BlockNoteEditor`, `insertBlocks`, `updateBlock`, `replaceBlocks`, eventos, seleções, Yjs utils)

## 2. Instruções de Navegação para o Agente
1. **Consulte [`index_master.md`](index_master.md)** para identificar o arquivo correspondente ao seu caso de uso ou API.
2. **Utilize a tabela de intenções** no `index_master.md` para encontrar o caminho do arquivo rapidamente.
3. **Leia o arquivo de destino específico** para obter assinaturas de funções, tipos TypeScript, exemplos executáveis e propriedades aceitas.
4. **Para schemas customizados**, consulte a pasta [`esquemas_customizados/`](esquemas_customizados/).
5. **Para customização de UI / Menus**, consulte a pasta [`componentes_react/`](componentes_react/).
6. **Para métodos de manipulação de blocos e cursor**, consulte a pasta [`referencia_da_api/`](referencia_da_api/).

## 3. Regras Fundamentais de Implementação
1. **Padrão de Criação em React**:
   ```tsx
   import "@blocknote/core/fonts/inter.css";
   import { BlockNoteView } from "@blocknote/mantine"; // ou @blocknote/shadcn, @blocknote/react
   import "@blocknote/mantine/style.css";
   import { useCreateBlockNote } from "@blocknote/react";

   export default function App() {
     const editor = useCreateBlockNote({
       initialContent: [
         {
           type: "paragraph",
           content: "Bem-vindo ao BlockNote!",
         },
       ],
     });

     return <BlockNoteView editor={editor} />;
   }
   ```
2. **Compatibilidade com Next.js**: No Next.js App Router ou Pages Router, o `BlockNoteView` depende de APIs do navegador (DOM/Window). Sempre carregue o componente do editor usando `dynamic(() => import(...), { ssr: false })` ou declare `'use client'` em componente isolado.
3. **Tipagem Estrita com Schemas**: Ao definir blocos customizados, sempre crie o schema com `BlockNoteSchema.create({ blockSpecs: { ...defaultBlockSpecs, myCustomBlock: createMyBlock() } })` e passe para `useCreateBlockNote({ schema })`. Isso garante inferência perfeita de tipos TypeScript em `editor.topLevelBlocks`.
4. **Preservação de Código Oficial**: Utilize exclusivamente os métodos oficiais documentados na API.

## 4. Mapa Rápido da Estrutura de Diretórios
- [`introducao_e_fundamentos/`](introducao_e_fundamentos/): Conceitos do modelo de blocos, schemas e interoperabilidade.
- [`primeiros_passos/`](primeiros_passos/): Guias de instalação para React, Next.js, ShadCN, Mantine e Vanilla JS.
- [`componentes_react/`](componentes_react/): Customização e substituição de menus de formatação, side menu e slash menu.
- [`blocos_e_conteudo/`](blocos_e_conteudo/): Especificações de tabelas, código, matemática, diagramas e embeds.
- [`esquemas_customizados/`](esquemas_customizados/): Criação de blocos, inline content e estilos customizados em React.
- [`recursos_avancados/`](recursos_avancados/): Colaboração em tempo real (Yjs), comentários, BlockNote AI e i18n.
- [`importacao_e_exportacao/`](importacao_e_exportacao/): Conversores para Markdown, HTML, PDF e DOCX.
- [`estilizacao_e_temas/`](estilizacao_e_temas/): Customização visual, temas claro/escuro e sobrescrita de CSS.
- [`referencia_da_api/`](referencia_da_api/): Referência exaustiva de métodos, eventos, seleções e utilitários.
