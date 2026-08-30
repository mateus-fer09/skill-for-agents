---
title: "Custom Style Types"
description: "In addition to the default style types that BlockNote offers, you can also make your own custom styles using React components. Take a look at the demo below, in which we add a cust"
topics:
  - "Esquemas customizados"
keywords:
  - "Custom Style Types"
  - "createReactStyleSpec"
  - "StyleSpec"
  - "CustomStyleConfig"
  - "PropSchema"
  - "propSchema"
  - "ReactCustomStyleImplementation"
  - "render"
source_scope:
  - "https://www.blocknotejs.org/docs/features/custom-schemas/custom-styles"
---

# [Custom Style Types](#custom-style-types)

In addition to the default style types that BlockNote offers, you can also make your own custom styles using React components. Take a look at the demo below, in which we add a custom font style to a BlockNote editor, as well as a custom [Formatting Toolbar button](/docs/react/components/formatting-toolbar) to set it.

## [Creating a Custom Style Type](#creating-a-custom-style-type)

Use the `createReactStyleSpec` function to create a custom style type. This function takes two arguments:

```tsx
function createReactStyleSpec(
  styleConfig: CustomStyleConfig,
  styleImplementation: ReactStyleImplementation,
): StyleSpec;
```

It returns an instance of your custom inline content, or a `StyleSpec`. This `StyleSpec` then gets passed into your [BlockNote schema](/docs/features/custom-schemas#creating-your-own-schema) to add the style to the editor.

Let's look at our custom font style from the demo, and go over everything we pass to `createReactStyleSpec`:

```tsx
export const Font = createReactStyleSpec(
  {
    type: "font",
    propSchema: "string",
  },
  {
    render: (props) => (
      <span style={{ fontFamily: props.value }} ref={props.contentRef} />
    ),
  }
);
```

### [Style Config (`CustomStyleConfig`)](#style-config-customstyleconfig)

The Style Config describes the shape of your custom style. Use it to specify the type, and whether the style should take a string value:

```tsx
type CustomStyleConfig = {
  type: string;
  readonly propSchema: "boolean" | "string";
};
```

`type:` Defines the identifier of the custom style.

`propSchema:` The `PropSchema` specifies whether the style can only be toggled (`"boolean"`), or whether it can take a string value (`"string"`). Having a string value is useful for e.g. setting a color on the style.

> [!NOTE]
> 

*In the font style demo, we set `propSchema` to `"string"` so we can store the
font family.*

### [Style Implementation (`ReactCustomStyleImplementation`)](#style-implementation-reactcustomstyleimplementation)

The Style Implementation defines how the style should be rendered to HTML.

```tsx
type ReactCustomStyleImplementation = {
  render: React.FC<{
    value?: string;
    contentRef: (node: HTMLElement | null) => void;
  }>;
  toExternalHTML?: React.FC<{
    value?: string;
    contentRef: (node: HTMLElement | null) => void;
  }>;
  parse?: (element: HTMLElement) => string | true | undefined;
};
```

`render:` This is your React component which defines how your custom style should be rendered, and takes two React props:

- 

`value:` The string value of the style, this is only available if your style config contains `propSchema: "string"`.

- 

`contentRef:` A React `ref` to mark the editable element.

`toExternalHTML?:` This component is used whenever the style is being exported to HTML for use outside BlockNote, for example when copying it to the clipboard. If it's not defined, BlockNote will just use `render` for the HTML conversion. Takes the same props as `render`.

> [!NOTE]
> 

*Note that your component passed to `toExternalHTML` is rendered and
serialized in a separate React root, which means you can't use hooks that rely
on React Contexts.*

`parse?:` The `parse` function defines how to parse HTML content into your style, for example when pasting contents from the clipboard. If the element should be parsed into your custom style, you return a `string` or `true`. If the `propSchema` is `"string"`, you should likewise return a string value, or `true` otherwise. Returning `undefined` will not parse the style from the HTML element. Takes a single argument:

- `element`: The HTML element that's being parsed.

## [Adding Custom Style to the Editor](#adding-custom-style-to-the-editor)

Finally, create a BlockNoteSchema using the definition of your custom style:

```tsx
const schema = BlockNoteSchema.create({
  styleSpecs: {
    // enable the default styles if desired
    ...defaultStyleSpecs,

    // Add your own custom style:
    font: Font,
  },
});
```

You can then instantiate your editor with this custom schema, as explained on the [Custom Schemas](/docs/features/custom-schemas) page.[

Custom Inline Content

Learn how to create custom inline content for your BlockNote editor](/docs/features/custom-schemas/custom-inline-content)[

Source with Preview Blocks

Build custom blocks and inline content that are authored as source code but rendered as a preview — like BlockNote's math and diagram blocks.](/docs/features/custom-schemas/source-with-preview)
