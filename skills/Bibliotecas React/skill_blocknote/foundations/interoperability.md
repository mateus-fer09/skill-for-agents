# Interoperabilidade e formatos

A documentação diferencia formatos lossless e lossy. O formato nativo — array JSON de blocks (`editor.document`) — é recomendado para armazenamento porque preserva a estrutura BlockNote.

Formatos documentados:
- BlockNote JSON: import/export, lossless;
- BlockNote HTML: import/export;
- HTML padrão: import/export lossy;
- Markdown: import/export lossy;
- PDF: export por pacote XL;
- DOCX: export por pacote XL;
- ODT: export por pacote XL;
- Email HTML: export por pacote XL.

Para persistência, capture alterações do editor e armazene o JSON. Para carregamento, forneça o conteúdo na criação (`initialContent`).

Fontes:
- https://www.blocknotejs.org/docs/foundations/supported-formats
- https://www.blocknotejs.org/docs/features/import
