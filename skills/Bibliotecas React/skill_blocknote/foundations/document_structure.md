# Estrutura de documentos

Um documento BlockNote é uma lista de blocos. Cada `Block` possui:
- `id`: identificador persistente durante a vida do bloco;
- `type`: tipo do bloco;
- `props`: propriedades específicas;
- `content`: conteúdo inline, tabela ou `undefined`, conforme o tipo;
- `children`: blocos aninhados.

## Inline content
O conteúdo rich-text padrão combina texto estilizado e links. Texto possui `text` e um mapa de `styles`; links possuem `href` e conteúdo textual estilizado. Schemas customizados podem adicionar outros tipos inline.

## Casos especiais
- Blocos sem rich-text podem ter `content` indefinido.
- Code blocks usam conteúdo textual sem rich styles.
- `plainContentToString` é a utility documentada para ler conteúdo plain.
- Multi-column introduz `columnList` e `column`; uma column list precisa de pelo menos duas colunas, columns devem conter blocos normais e column lists devem conter columns.
- Tabelas usam `TableContent`, com larguras, headers opcionais e células compostas por arrays de inline content.

Fonte: https://www.blocknotejs.org/docs/foundations/document-structure
