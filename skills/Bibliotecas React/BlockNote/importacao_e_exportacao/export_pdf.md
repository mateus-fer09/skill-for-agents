---
title: "PDF Export"
description: "It's possible to export BlockNote documents to PDF, completely client-side."
topics:
  - "Importacao e exportacao"
keywords:
  - "PDF Export"
  - "PDFExporter"
  - "filename.pdf"
  - "toReactPDFDocument"
  - "options"
  - "schema"
  - "mappings"
  - "extraBlock"
source_scope:
  - "https://www.blocknotejs.org/docs/features/export/pdf"
---

# [PDF Export](#pdf-export)

It's possible to export BlockNote documents to PDF, completely client-side.

> [!NOTE]
> 

This feature is provided by the `@blocknote/xl-pdf-exporter`. `xl-` packages
are fully open source, but released under a copyleft license. A commercial
license for usage in closed source, proprietary products comes as part of the
[Business subscription](/pricing).

First, install the `@blocknote/xl-pdf-exporter` and `@react-pdf/renderer` packages:

```tsx
npm install @blocknote/xl-pdf-exporter @react-pdf/renderer
```

Then, create an instance of the `PDFExporter` class. This exposes the following methods:

```tsx
import {
  PDFExporter,
  pdfDefaultSchemaMappings,
} from "@blocknote/xl-pdf-exporter";
import * as ReactPDF from "@react-pdf/renderer";

// Create the exporter
const exporter = new PDFExporter(editor.schema, pdfDefaultSchemaMappings);

// Convert the blocks to a react-pdf document
const pdfDocument = await exporter.toReactPDFDocument(editor.document);

// Use react-pdf to write to file:
await ReactPDF.render(pdfDocument, `filename.pdf`);
```

See the [full example](/examples/interoperability/converting-blocks-to-pdf) with live PDF preview below:

### [Customizing the PDF](#customizing-the-pdf)

`toReactPDFDocument` takes an optional `options` parameter, which allows you to customize the header and footer of the PDF:

Example usage:

```tsx
import { Text } from "@react-pdf/renderer";
const pdfDocument = await exporter.toReactPDFDocument(editor.document, {
  header: <Text>Header</Text>,
  footer: <Text>Footer</Text>,
});
```

### [Custom mappings / custom schemas](#custom-mappings--custom-schemas)

The `PDFExporter` constructor takes a `schema` and `mappings` parameter.
A *mapping* defines how to convert a BlockNote schema element (a Block, Inline Content, or Style) to a React-PDF element.
If you're using a [custom schema](/docs/features/custom-schemas) in your editor, or if you want to overwrite how default BlockNote elements are converted to PDF, you can pass your own `mappings`:

For example, use the following code in case your schema has an `extraBlock` type:

```tsx
import { PDFExporter, pdfDefaultSchemaMappings } from "@blocknote/xl-pdf-exporter";
import { Text } from "@react-pdf/renderer";

new PDFExporter(schema, {
    blockMapping: {
        ...pdfDefaultSchemaMappings.blockMapping,
        myCustomBlock: (block, exporter) => {
            return <Text>My custom block</Text>;
        },
    },
    inlineContentMapping: pdfDefaultSchemaMappings.inlineContentMapping,
    styleMapping: pdfDefaultSchemaMappings.styleMapping,
});
```

### [Math & diagram blocks](#math--diagram-blocks)

The [math](/docs/features/blocks/math) and [diagram](/docs/features/blocks/diagrams) blocks ship their own PDF mappings — math blocks export as vector formulas, inline math as images flowing with the text, diagrams as embedded images. See [exporting math](/docs/features/blocks/math#pdf) and [exporting diagrams](/docs/features/blocks/diagrams#exporting) for the setup.

### [Exporter options](#exporter-options)

The `PDFExporter` constructor takes an optional `options` parameter.
While conversion happens on the client-side, the default setup uses two server based resources:

```tsx
const defaultOptions = {
  // emoji source, this is passed to the react-pdf library (https://react-pdf.org/fonts#registeremojisource)
  // these are loaded from cloudflare + twemoji by default
  emojiSource: {
    format: "png",
    url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/",
  },
  // a function to resolve external resources in order to avoid CORS issues
  // by default, this calls a BlockNote hosted server-side proxy to resolve files
  resolveFileUrl: corsProxyResolveFileUrl,
  // the strings rendered into the exported document (file link texts, error
  // placeholders); pass a locale from @blocknote/core/locales (or your
  // editor's dictionary) to export in another language
  dictionary: locales.en,
  // the colors to use in the PDF for things like highlighting, background colors and font colors.
  colors: COLORS_DEFAULT, // defaults from @blocknote/core
};
```
[

HTML

It's possible to export Blocks to HTML, completely client-side.](/docs/features/export/html)[

DOCX

Export BlockNote documents to a docx word (Office Open XML) file.](/docs/features/export/docx)
