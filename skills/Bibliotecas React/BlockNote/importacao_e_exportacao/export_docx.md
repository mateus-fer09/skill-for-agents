---
title: "DOCX Export"
description: "It's possible to export BlockNote documents to docx, completely client-side."
topics:
  - "Importacao e exportacao"
keywords:
  - "DOCX Export"
  - "docx"
  - "DOCXExporter"
  - "toDocxJsDocument"
  - "options"
  - "schema"
  - "mappings"
  - "extraBlock"
source_scope:
  - "https://www.blocknotejs.org/docs/features/export/docx"
---

# [DOCX Export](#docx-export)

It's possible to export BlockNote documents to docx, completely client-side.

> [!NOTE]
> 

This feature is provided by the `@blocknote/xl-docx-exporter`. `xl-` packages
are fully open source, but released under a copyleft license. A commercial
license for usage in closed source, proprietary products comes as part of the
[Business subscription](/pricing).

First, install the `@blocknote/xl-docx-exporter` and `docx` packages:

```tsx
npm install @blocknote/xl-docx-exporter docx
```

Then, create an instance of the `DOCXExporter` class. This exposes the following methods:

```tsx
import {
  DOCXExporter,
  docxDefaultSchemaMappings,
} from "@blocknote/xl-docx-exporter";
import { Packer } from "docx";

// Create the exporter
const exporter = new DOCXExporter(editor.schema, docxDefaultSchemaMappings);

// Convert the blocks to a docxjs document
const docxDocument = await exporter.toDocxJsDocument(editor.document);

// Use docx to write to file:
await Packer.toBuffer(docxDocument);
```

See the [full example](/examples/interoperability/converting-blocks-to-docx) below:

### [Customizing the Docx output file](#customizing-the-docx-output-file)

`toDocxJsDocument` takes an optional `options` parameter, which allows you to customize document metadata (like the author) and section options (like headers and footers).

Example usage:

```tsx
import { Paragraph, TextRun } from "docx";

const doc = await exporter.toDocxJsDocument(testDocument, {
  documentOptions: {
    creator: "John Doe",
  },
  sectionOptions: {
    headers: {
      default: {
        options: {
          children: [new Paragraph({ children: [new TextRun("Header")] })],
        },
      },
    },
    footers: {
      default: {
        options: {
          children: [new Paragraph({ children: [new TextRun("Footer")] })],
        },
      },
    },
  },
});
```

### [Custom mappings / custom schemas](#custom-mappings--custom-schemas)

The `DOCXExporter` constructor takes a `schema`, `mappings` and `options` parameter.
A *mapping* defines how to convert a BlockNote schema element (a Block, Inline Content, or Style) to a [docxjs](https://docx.js.org/) element.
If you're using a [custom schema](/docs/features/custom-schemas) in your editor, or if you want to overwrite how default BlockNote elements are converted to docx, you can pass your own `mappings`:

For example, use the following code in case your schema has an `extraBlock` type:

```tsx
import {
  DOCXExporter,
  docxDefaultSchemaMappings,
} from "@blocknote/xl-docx-exporter";
import { Paragraph, TextRun } from "docx";

new DOCXExporter(schema, {
  blockMapping: {
    ...docxDefaultSchemaMappings.blockMapping,
    myCustomBlock: (block, exporter) => {
      return new Paragraph({
        children: [
          new TextRun({
            text: "My custom block",
          }),
        ],
      });
    },
  },
  inlineContentMapping: docxDefaultSchemaMappings.inlineContentMapping,
  styleMapping: docxDefaultSchemaMappings.styleMapping,
});
```

### [Math & diagram blocks](#math--diagram-blocks)

The [math](/docs/features/blocks/math) and [diagram](/docs/features/blocks/diagrams) blocks ship their own DOCX mappings — math exports as native (editable) Word equations, diagrams as embedded images. See [exporting math](/docs/features/blocks/math#docx) and [exporting diagrams](/docs/features/blocks/diagrams#exporting) for the setup.

### [Exporter options](#exporter-options)

The `DOCXExporter` constructor takes an optional `options` parameter.
While conversion happens on the client-side, the default setup uses a server hosted proxy to resolve files:

```tsx
const defaultOptions = {
  // a function to resolve external resources in order to avoid CORS issues
  // by default, this calls a BlockNote hosted server-side proxy to resolve files
  resolveFileUrl: corsProxyResolveFileUrl,
  // the strings rendered into the exported document (file link texts, error
  // placeholders); pass a locale from @blocknote/core/locales (or your
  // editor's dictionary) to export in another language
  dictionary: locales.en,
  // the colors to use in the Docx for things like highlighting, background colors and font colors.
  colors: COLORS_DEFAULT, // defaults from @blocknote/core
};
```
[

PDF

Export BlockNote documents to a PDF.](/docs/features/export/pdf)[

Email Export

Export BlockNote documents to an email using React Email.](/docs/features/export/email)
