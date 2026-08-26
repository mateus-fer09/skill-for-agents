# Editor Setup

`useCreateBlockNote(options?, deps?)` cria uma instância de `BlockNoteEditor` e encapsula a criação em React. Entre as opções documentadas aparecem `initialContent`, `dictionary`, `schema`, `uploadFile` e `pasteHandler`. O segundo argumento funciona como lista de dependências para recriar a instância.

Para controle manual do lifecycle, a documentação indica `BlockNoteEditor.create`.

`BlockNoteView` renderiza a instância. Props de destaque: `editor`, `editable`, `onChange`, `onSelectionChange` e `theme`.

### Componente não controlado
A documentação alerta que `BlockNoteView` é não controlado. Não trate o conteúdo como um `value` React comum; configure conteúdo inicial na criação do editor e use Editor API/eventos para ler/manipular o documento.

Fonte: https://www.blocknotejs.org/docs/getting-started/editor-setup
