# Custom Schemas

Custom schemas permitem adicionar ou substituir:
- blocks;
- inline content;
- text styles.

## Estratégias

### Estender schema existente
`BlockNoteSchema.create().extend(...)` é o padrão para partir do schema padrão e adicionar/substituir specs.

### Criar do zero
`BlockNoteSchema.create({...})` pode receber somente as specs desejadas; é útil quando o editor deve conter um subconjunto pequeno dos built-ins e componentes próprios.

## Custom Blocks
A API React fornece helpers para criar specs renderizadas em React. A configuração do bloco descreve type, prop schema e tipo de conteúdo; a implementação descreve renderização e integração com editor.
Fonte: https://www.blocknotejs.org/docs/features/custom-schemas/custom-blocks

## Custom Inline Content
Define inline specs próprias, props e renderização para elementos embutidos em blocos textuais.
Fonte: https://www.blocknotejs.org/docs/features/custom-schemas/custom-inline-content

## Custom Styles
Permite adicionar estilos textuais além dos defaults.
Fonte: https://www.blocknotejs.org/docs/features/custom-schemas/custom-styles

## Source with Preview
Há padrão oficial para blocos com modo source/preview.
Fonte: https://www.blocknotejs.org/docs/features/custom-schemas/source-with-preview
