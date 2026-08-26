# Integrações de setup

## Mantine
Pacotes centrais mais `@blocknote/mantine`; a documentação distingue o stylesheet completo de um stylesheet apenas com os estilos adicionais do BlockNote para projetos que já usam Mantine.
Fonte: https://www.blocknotejs.org/docs/getting-started/mantine

## Ariakit
Usa `@blocknote/ariakit`; é a opção baseada em primitives headless, com CSS opcional fornecido pelo BlockNote.
Fonte: https://www.blocknotejs.org/docs/getting-started/ariakit

## ShadCN
Usa `@blocknote/shadcn` e pressupõe um projeto com ShadCN/Tailwind. A documentação exige que o Tailwind encontre as classes do pacote por meio de `@source`. É possível fornecer componentes ShadCN próprios a `BlockNoteView`; componentes incompatíveis com a estratégia de portais podem exigir ajustes.
Fonte: https://www.blocknotejs.org/docs/getting-started/shadcn

## Next.js
BlockNote deve ser usado do lado cliente. Use a página oficial para a configuração específica de importação/SSR.
Fonte: https://www.blocknotejs.org/docs/getting-started/nextjs

## Vanilla JS
Há fluxo sem React, com criação e montagem manual do editor/UI. Use quando o projeto não usa React ou quando o lifecycle deve ser controlado diretamente.
Fonte: https://www.blocknotejs.org/docs/getting-started/vanilla-js
