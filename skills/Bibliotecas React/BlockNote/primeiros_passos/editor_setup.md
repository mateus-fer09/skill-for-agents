---
title: "Editor Setup"
description: "You can customize your editor when you instantiate it. Let's take a closer looks at the basic methods and components to set up your BlockNote editor."
topics:
  - "Primeiros passos"
keywords:
  - "Editor Setup"
  - "BlockNoteEditor"
  - "useCreateBlockNote"
  - "BlockNoteView"
  - "initialContent"
  - "dictionary"
  - "schema"
  - "uploadFile"
source_scope:
  - "https://www.blocknotejs.org/docs/getting-started/editor-setup"
---

# [Editor Setup](#editor-setup)

You can customize your editor when you instantiate it. Let's take a closer looks at the basic methods and components to set up your BlockNote editor.

## [Create an editor](#create-an-editor)

Create a new `BlockNoteEditor` by calling the `useCreateBlockNote` hook. This instantiates a new editor and its required state. You can later interact with the editor using the Editor API and pass it to the `BlockNoteView` component.

```tsx
declare function (
  ?: ,
  ?: React.,
): ;
```

The hook takes two optional parameters:

**options:** Configure the editor with various options. You can find some commonly used options below, or see [Editor Options](/docs/reference/editor/overview#options) for all available options.

- `initialContent` - Set starting content

- `dictionary` - Customize text strings for localization. See the [Localization](/docs/features/localization) for more.

- `schema` - Add custom blocks and styles. See [Custom Schemas](/docs/features/custom-schemas).

- `uploadFile` - Handle file uploads to a backend.

- `pasteHandler` - Handle how pasted clipboard content gets parsed.

**deps:** React dependency array that determines when to recreate the editor.

> [!NOTE]
> **Manually creating the editor (`BlockNoteEditor.create`)**

The `useCreateBlockNote` hook is actually a simple `useMemo` wrapper around
the `BlockNoteEditor.create` method. You can use this method directly if you
want to control the editor lifecycle manually. For example, we do this in
the [Saving & Loading example](/examples/backend/saving-loading) to delay
the editor creation until some content has been fetched from an external
data source.

## [Render the editor](#render-the-editor)

Use the `<BlockNoteView>` component to render the `BlockNoteEditor` instance you just created:

```tsx
const editor = useCreateBlockNote();

return <BlockNoteView editor={editor} />;
```

The `<BlockNoteView>` component has a number of props that you can use to customize the editor. See [React Overview](/docs/react/overview) for more information. But, here are some important props to consider:

- `editor`: The `BlockNoteEditor` instance to render.

- `editable`: Whether the editor should be editable.

- `onChange`: Callback fired when the editor content (document) changes.

- `onSelectionChange`: Callback fired when the editor selection changes.

- `theme`: The editor's theme, see [Themes](/docs/react/styling-theming/themes) for more about this.

> [!NOTE]
> **Uncontrolled component**

Note that the `BlockNoteView` component is an [uncontrolled component](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
This means you don't pass in the editor content directly as a prop. You can use the `initialContent` option in the `useCreateBlockNote` hook to set the initial content of the editor (similar to the `defaultValue` prop in a regular React `<textarea>`).

BlockNote handles the complexities and performance optimizations of managing editor state internally. You can interact with the editor content using the [Editor API](/docs/reference/editor/overview).[

With Vanilla JS

BlockNote is mainly designed as a quick and easy drop-in block-based editor for React apps, but can also be used in vanilla JavaScript apps.](/docs/getting-started/vanilla-js)[

Document Structure

Learn how documents (the content of the rich text editor) are structured to make the most out of BlockNote.](/docs/foundations/document-structure)
