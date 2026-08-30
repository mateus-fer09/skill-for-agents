---
title: "CSS Rule: `-electron-corner-smoothing`"
description: "## CSS Rule: -electron-corner-smoothing"
topics:
  - "Api"
keywords:
  - "CSS Rule: `-electron-corner-smoothing`"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/corner-smoothing-css"
---

# CSS Rule: `-electron-corner-smoothing`

## CSS Rule: `-electron-corner-smoothing`

> 

Smoothes out the corner rounding of the `border-radius` CSS rule.

The rounded corners of elements with [the `border-radius` CSS rule](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) can be smoothed out using the `-electron-corner-smoothing` CSS rule. This smoothness is very similar to Apple's "continuous" rounded corners in SwiftUI and Figma's "corner smoothing" control on design elements.

Integrating with the operating system and its design language is important to many desktop applications. The shape of a rounded corner can be a subtle detail to many users. However, aligning closely to the system's design language that users are familiar with makes the application's design feel familiar too. Beyond matching the design language of macOS, designers may decide to use smoother round corners for many other reasons.

`-electron-corner-smoothing` affects the shape of borders, outlines, and shadows on the target element. Mirroring the behavior of `border-radius`, smoothing will gradually back off if an element's size is too small for the chosen value.

The `-electron-corner-smoothing` CSS rule is **only implemented for Electron** and has no effect in browsers. Avoid using this rule outside of Electron. This CSS rule is considered experimental and may require migration in the future if replaced by a CSS standard.

### Exemplo

The following example shows the effect of corner smoothing at different percents.

```javascript
.box {  
  width: 128px;  
  height: 128px;  
  background-color: cornflowerblue;  
  border-radius: 24px;  
  -electron-corner-smoothing: var(--percent);  /* Column header in table below. */  
}  

```

### 
``

```javascript
  
  
  
  
  
  
  

```
````

### 
``

```javascript
  
  
  
  
  
  

```

### 

- ****``
- ****
- ****
- ****

```javascript
  
  
  

```
[](https://github.com/electron/electron/edit/main/docs/api/corner-smoothing-css.md)

- [``](#css-rule--electron-corner-smoothing)

  - 
  - 
  - 
  - 

- [](/pt/docs/latest/)
- [](/pt/docs/latest/api/app)

- [](/pt/docs/latest/tutorial/performance)
- [](/pt/docs/latest/tutorial/security)

- [](https://electronforge.io)
- [](/pt/fiddle)

- [](/pt/governance)
- [](/pt/community)
- [](https://discordapp.com/invite/APGC3k5yaH)
- [](https://bsky.app/profile/electronjs.org)
- [](https://x.com/electronjs)
- [](https://social.lfx.dev/@electronjs)
- [](https://stackoverflow.com/questions/tagged/electron)

- [](https://github.com/electron/electron)
- [](https://opencollective.com/electron)
- [](https://p.datadoghq.com/sb/c44e1df0-85d7-11ee-94c9-da7ad0900002-c245f7ef47d0d0c32abecdc0938c2a85)
[](https://openjsf.org/)[](https://openjsf.org)[](https://openjsf.org)[](https://openjsf.org)[](https://trademark-policy.openjsf.org)[](https://trademark-list.openjsf.org)[](https://trademark-list.openjsf.org)[](https://openjsf.org)[](https://terms-of-use.openjsf.org)[](https://privacy-policy.openjsf.org)[](https://bylaws.openjsf.org)[](https://code-of-conduct.openjsf.org)[](https://trademark-policy.openjsf.org)[](https://trademark-list.openjsf.org)[](https://www.linuxfoundation.org/cookies)
