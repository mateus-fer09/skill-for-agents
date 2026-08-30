---
title: "Themes"
description: "BlockNote comes with both a light and dark theme. By default, the theme is automatically selected based on the user's system preference, but you can also force either light or dark"
topics:
  - "Estilizacao e temas"
keywords:
  - "Themes"
  - "theme"
source_scope:
  - "https://www.blocknotejs.org/docs/react/styling-theming/themes"
---

# [Themes](#themes)

BlockNote comes with both a light and dark theme. By default, the theme is automatically selected based on the user's system preference, but you can also force either light or dark mode.

When [using Mantine](/docs/getting-started/mantine), you have additional theme functionality:

- Custom color schemes for light and dark mode, including highlight colors

- Change fonts, shadows, borders, and border radii

- Custoimize themes programmatically or using CSS variable overrides

This page mostly focuses on the extra functionality that comes from using Mantine, but the [Forcing Light/Dark Mode](/docs/react/styling-theming/themes#forcing-lightdark-mode) section is applicable to all UI libraries.

## [CSS Variables](#css-variables)

A theme is made up of a set of CSS variables, which can be overwritten to change the editor theme.

Here are each of the theme CSS variables you can set, with values from the default light theme:

```tsx
--bn-colors-editor-text: #3f3f3f;
--bn-colors-editor-background: #ffffff;
--bn-colors-menu-text: #3f3f3f;
--bn-colors-menu-background: #ffffff;
--bn-colors-tooltip-text: #3f3f3f;
--bn-colors-tooltip-background: #efefef;
--bn-colors-hovered-text: #3f3f3f;
--bn-colors-hovered-background: #efefef;
--bn-colors-selected-text: #ffffff;
--bn-colors-selected-background: #3f3f3f;
--bn-colors-disabled-text: #afafaf;
--bn-colors-disabled-background: #efefef;

--bn-colors-shadow: #cfcfcf;
--bn-colors-border: #efefef;
--bn-colors-side-menu: #cfcfcf;

--bn-colors-highlights-gray-text: #9b9a97;
--bn-colors-highlights-gray-background: #ebeced;
--bn-colors-highlights-brown-text: #64473a;
--bn-colors-highlights-brown-background: #e9e5e3;
--bn-colors-highlights-red-text: #e03e3e;
--bn-colors-highlights-red-background: #fbe4e4;
--bn-colors-highlights-orange-text: #d9730d;
--bn-colors-highlights-orange-background: #f6e9d9;
--bn-colors-highlights-yellow-text: #dfab01;
--bn-colors-highlights-yellow-background: #fbf3db;
--bn-colors-highlights-green-text: #4d6461;
--bn-colors-highlights-green-background: #ddedea;
--bn-colors-highlights-blue-text: #0b6e99;
--bn-colors-highlights-blue-background: #ddebf1;
--bn-colors-highlights-purple-text: #6940a5;
--bn-colors-highlights-purple-background: #eae4f2;
--bn-colors-highlights-pink-text: #ad1a72;
--bn-colors-highlights-pink-background: #f4dfeb;

--bn-font-family:
  "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Open Sans",
  "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
  "Droid Sans", "Helvetica Neue", sans-serif;
--bn-border-radius: 6px;
```

Setting these variables on the `.bn-root[data-color-scheme]` selector will overwrite them for both default light & dark themes. To overwrite variables separately for light & dark themes, use the `.bn-root[data-color-scheme="light"]` and `.bn-root[data-color-scheme="dark"]` selectors.

## [Programmatic Configuration](#programmatic-configuration)

You can also set the theme CSS variables using the [`theme` prop in `BlockNoteView`](/docs/react/overview#props). Passing a `Theme` object will overwrite CSS variables for both light & dark themes with values from the object.

```tsx
/**
 * A foreground & background pair
 */
type  = <{
  : string;
  : string;
}>;

/**
 * A color scheme
 */
type  = <{
  : ;
  : ;
  : ;
  : ;
  : ;
  : ;
  : string;
  : string;
  : string;
  : <{
    : ;
    : ;
    : ;
    : ;
    : ;
    : ;
    : ;
    : ;
    : ;
  }>;
}>;

/**
 * A theme
 */
type  = <{
  : ;
  : number;
  : string;
}>;
```

In the demo below, we create the same red theme as from the previous demo, but this time we set it using the `theme` prop in `BlockNoteView`:

## [Light and Dark Themes](#light-and-dark-themes)

Alternatively, you can overwrite CSS variables for the light & dark theme separately by passing the following object type:

```tsx
type LightAndDarkThemes = {
  light: Theme;
  dark: Theme;
};
```

## [Forcing Light/Dark Mode](#forcing-lightdark-mode)

By passing `"light"` or `"dark"` to the `theme` prop instead of a `Theme` object, you can also force BlockNote to always use the light or dark theme.

If you want to set more complex styles on the editor, see [Overriding CSS](/docs/react/styling-theming/overriding-css).[

Styling & Theming

You can completely change the look and feel of the BlockNote editor. Change basic styling quickly with theme CSS variables, or apply more complex styles with additional CSS rules.](/docs/react/styling-theming)[

Overriding CSS

You can change any styles applied to the editor by setting your own CSS styles.](/docs/react/styling-theming/overriding-css)
