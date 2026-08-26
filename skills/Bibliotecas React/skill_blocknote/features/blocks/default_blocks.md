# Built-in Blocks e Default Schema

O Default Schema reúne blocos, inline content e styles fornecidos por padrão.

## Propriedades globais documentadas
Os built-ins usam propriedades padrão como:
- `backgroundColor`
- `textColor`
- `textAlignment` (`left`, `center`, `right`, `justify`)

Alguns tipos possuem factory `create...BlockSpec` configurável. Para aplicar uma versão configurada de um bloco padrão, crie/estenda um `BlockNoteSchema` e substitua a spec correspondente.

Subseções oficiais: Typography, List Types, Tables, Embeds, Code Blocks, Math & Equations, Diagrams, Inline Content e Custom.

Fonte: https://www.blocknotejs.org/docs/features/blocks
