---
title: Getting Started
topics: [instalacao, react, editor]
keywords: [useCreateBlockNote, BlockNoteView, @blocknote/core, @blocknote/react]
source_scope: [https://www.blocknotejs.org/docs/getting-started]
---
# Getting Started

A configuração React padrão usa `@blocknote/core`, `@blocknote/react` e uma implementação de UI. A documentação recomenda Mantine para novos projetos e também oferece Ariakit e ShadCN.

Fluxo conceitual:
1. instalar core, React e o pacote de UI;
2. importar os estilos necessários;
3. criar o editor com `useCreateBlockNote()`;
4. renderizar `BlockNoteView` passando a instância do editor.

Para Next.js e outros frameworks React com SSR, BlockNote é um componente client-only; consulte a integração específica.

Fonte: https://www.blocknotejs.org/docs/getting-started
