---
title: "nativeImage"
description: "Documentação técnica e referência da API de nativeImage no Electron."
topics:
  - "Api"
keywords:
  - "contextBridge"
  - "nativeImage"
  - "NativeImage"
  - "null"
  - "JPEG"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/native-image"
---

# nativeImage

> 

Cria ícones de bandeija, dock e aplicações usando arquivos PNG ou JPG.

Process: [Main](/pt/docs/latest/glossary#main-process), [Renderer](/pt/docs/latest/glossary#renderer-process)

> 

[!IMPORTANT] If you want to call this API from a renderer process with context isolation enabled, place the API call in your preload script and [expose](/pt/docs/latest/tutorial/context-isolation#after-context-isolation-enabled) it using the [`contextBridge`](/pt/docs/latest/api/context-bridge) API.

The `nativeImage` module provides a unified interface for manipulating system images. These can be handy if you want to provide multiple scaled versions of the same icon or take advantage of macOS [template images](https://developer.apple.com/documentation/appkit/nsimage/1520017-template).

Electron APIs that take image files accept either file paths or `NativeImage` instances. An empty and transparent image will be used when `null` is passed.

For example, when creating a [Tray](/pt/docs/latest/api/tray) or setting a [BrowserWindow](/pt/docs/latest/api/browser-window)'s icon, you can either pass an image file path as a string:
Main Process

```javascript
const { BrowserWindow, Tray } = require('electron')  
  
const tray = new Tray('/Users/somebody/images/icon.png')  
const win = new BrowserWindow({ icon: '/Users/somebody/images/window.png' })  

```

or generate a `NativeImage` instance from the same file:
Main Process

```javascript
const { BrowserWindow, nativeImage, Tray } = require('electron')  
  
const trayIcon = nativeImage.createFromPath('/Users/somebody/images/icon.png')  
const appIcon = nativeImage.createFromPath('/Users/somebody/images/window.png')  
const tray = new Tray(trayIcon)  
const win = new BrowserWindow({ icon: appIcon })  

```

## Formatos Suportados

Currently, `PNG` and `JPEG` image formats are supported across all platforms. `PNG` is recommended because of its support for transparency and lossless compression.

On Windows, you can also load `ICO` icons from file paths. For best visual quality, we recommend including at least the following sizes:

- Ícone pequeno

  - 16x16 (com escala de DPI com 100%)

  - 20x20 (com escala de DPI com 125%)

  - 24x24 (com escala de DPI com 150%)

  - 32x32 (com escala de DPI com 200%)

- Ícone grande

  - 32x32 (com escala de DPI com 100%)

  - 40x40 (com escala de DPI com 150%)

  - 48x48 (com escala de DPI com 150%)

  - 64x64 (com escala de DPI com 200%)

  - 256x256

Check the *Icon Scaling* section in the Windows [App Icon Construction](https://learn.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-construction#icon-scaling) reference.

> [!NOTE]
> 

> note

> 

EXIF metadata is currently not supported and will not be taken into account during image encoding and decoding.

## Imagem em Alta Resolução

On platforms that support high pixel density displays (such as Apple Retina), you can append `@2x` after image's base filename to mark it as a 2x scale high resolution image.

For example, if `icon.png` is a normal image that has standard resolution, then `icon@2x.png` will be treated as a high resolution image that has double Dots per Inch (DPI) density.

If you want to support displays with different DPI densities at the same time, you can put images with different sizes in the same folder and use the filename without DPI suffixes within Electron. Como por exemplo:

```javascript
images/  
├── icon.png  
├── icon@2x.png  
└── icon@3x.png  

```

Main Process

```javascript
const { Tray } = require('electron')  
  
const appTray = new Tray('/Users/somebody/images/icon.png')  

```

The following suffixes for DPI are also supported:

- `@1x`

- `@1.25x`

- `@1.33x`

- `@1.4x`

- `@1.5x`

- `@1.8x`

- `@2x`

- `@2.5x`

- `@3x`

- `@4x`

- `@5x`

## Template Image *macOS*

On macOS, [template images](https://developer.apple.com/documentation/appkit/nsimage/1520017-template) consist of black and an alpha channel. Imagens padrão não são destinadas a serem usadas sozinhas, e geralmente são acompanhadas por outros conteúdos para criar a aparência final desejada.

The most common case is to use template images for a menu bar (Tray) icon, so it can adapt to both light and dark menu bars.

To mark an image as a template image, its base filename should end with the word `Template` (e.g. `xxxTemplate.png`). You can also specify template images at different DPI densities (e.g. `xxxTemplate@2x.png`).

## Métodos

The `nativeImage` module has the following methods, all of which return an instance of the [`NativeImage`](#class-nativeimage) class:

### `nativeImage.createEmpty()`

Retorna `NativeImage`

Cria uma instância `NativeImage` vazia.

### `nativeImage.createThumbnailFromPath(path, size)` *macOS* *Windows*

- `path` string - path to a file that we intend to construct a thumbnail out of.

- `size` [Size](/pt/docs/latest/api/structures/size) - the desired width and height (positive numbers) of the thumbnail.

Returns `Promise<NativeImage>` - fulfilled with the file's thumbnail preview image, which is a [NativeImage](/pt/docs/latest/api/native-image).

> 

[!NOTE] Windows implementation will ignore `size.height` and scale the height according to `size.width`.

### `nativeImage.createFromPath(path)`

- `path` string - path to a file that we intend to construct an image out of.

Retorna `NativeImage`

Creates a new `NativeImage` instance from an image file (e.g., PNG or JPEG) located at `path`. This method returns an empty image if the `path` does not exist, cannot be read, or is not a valid image.

```javascript
const { nativeImage } = require('electron')  
  
const image = nativeImage.createFromPath('/Users/somebody/images/icon.png')  
console.log(image)  

```

### `nativeImage.createFromBitmap(buffer, options)`

- `buffer` [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer)

- `options` Object

  - `width` Integer

  - `height` Integer

  - `scaleFactor` Number (optional) - Defaults to 1.0.

Retorna `NativeImage`

Creates a new `NativeImage` instance from `buffer` that contains the raw bitmap pixel data returned by `toBitmap()`. The specific format is platform-dependent.

### `nativeImage.createFromBuffer(buffer[, options])`

- `buffer` [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer)

- Objeto `options` (opcional)

  - `width` Integer (opicional) - Necessário para buffers de bitmap.

  - `height` Integer (opicional) - Necessário para buffers de bitmap.

  - `scaleFactor` Number (optional) - Defaults to 1.0.

Retorna `NativeImage`

Cria uma nova instância `NativeImage` a partir do `buffer`. Tries to decode as PNG or JPEG first.

### `nativeImage.createFromDataURL(dataURL)`

- `dataURL` string

Retorna `NativeImage`

Creates a new `NativeImage` instance from `dataUrl`, a base 64 encoded [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) string.

### `nativeImage.createFromNamedImage(imageName[, options])` *macOS*

- `imageName` string

- `options` Object | number[] (optional) - If `options` is a number array  (*Deprecated*), it is interpreted as `hslShift`. If it is an object, the following properties can be specified:

  - `hslShift` number[] (optional)

  - `pointSize` Number (optional) - Defaults to `30.0`.

  - `weight` 'ultralight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black' (optional) - Defaults to `regular`.

  - `scale` 'small' | 'medium' | 'large' (optional) - Defaults to `medium`.

Retorna `NativeImage`

Creates a new `NativeImage` instance from the `NSImage` that maps to the given image name. See Apple's [`NSImageName`](https://developer.apple.com/documentation/appkit/nsimagename#2901388) documentation and [SF Symbols](https://developer.apple.com/sf-symbols/) for a list of possible values.

O `hslShift` é aplicado à imagem com as seguintes regras:

- `hsl_shift[0]` (hue): The absolute hue value for the image - 0 and 1 map to 0 and 360 on the hue color wheel (red).

- `hsl_shift[1]` (saturation): A saturation shift for the image, with the following key values: 0 = remove all color. 0.5 = leave unchanged. 1 = fully saturate the image.

- `hsl_shift[2]` (lightness): A lightness shift for the image, with the following key values: 0 = remove all lightness (make all pixels black). 0.5 = leave unchanged. 1 = full lightness (make all pixels white).

Isso significa que `[-1, 0, 1]` irá deixar a imagem totalmente branca e `[-1, 1, 0]` irá deixar a imagem totalmente preta.

In some cases, the `NSImageName` doesn't match its string representation; one example of this is `NSFolderImageName`, whose string representation would actually be `NSFolder`. Therefore, you'll need to determine the correct string representation for your image before passing it in. This can be done with the following:

```javascript
echo -e '#import <Cocoa/Cocoa.h>\nint main() { NSLog(@"%@", SYSTEM_IMAGE_NAME); }' | clang -otest -x objective-c -framework Cocoa - && ./test  

```

where `SYSTEM_IMAGE_NAME` should be replaced with any value from [this list](https://developer.apple.com/documentation/appkit/nsimagename?language=objc).

For SF Symbols, usage looks as follows:

```javascript
const image = nativeImage.createFromNamedImage('square.and.pencil')  

```

where `'square.and.pencil'` is the symbol name from the [SF Symbols app](https://developer.apple.com/sf-symbols/).

### `nativeImage.createMenuSymbol(imageName)` *macOS*

- `imageName` string

Retorna `NativeImage`

Creates a new `NativeImage` instance from an SF Symbol for use in a native [Menu](/pt/docs/latest/api/menu). See [SF Symbols](https://developer.apple.com/sf-symbols/) for a list of possible values.

```javascript
const { nativeImage, MenuItem } = require('electron')  
  
const item = new MenuItem({  
  icon: nativeImage.createMenuSymbol('folder.badge.plus'),  
  label: 'Create Folder'  
})  

```

## Class: NativeImage

> 

Natively wrap images such as tray, dock, and application icons.

Process: [Main](/pt/docs/latest/glossary#main-process), [Renderer](/pt/docs/latest/glossary#renderer-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

### Métodos de Instância

Os seguintes métodos estão disponíveis nas instâncias da classe `NativeImage`:

#### `image.toPNG([options])`

- Objeto `options` (opcional)

  - `scaleFactor` Number (optional) - Defaults to 1.0.

Returns `Buffer` - A [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) that contains the image's `PNG` encoded data.

#### `image.toJPEG(quality)`

- `quality` Integer - Between 0 - 100.

Returns `Buffer` - A [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) that contains the image's `JPEG` encoded data.

#### `image.toBitmap([options])`

History[``](/docs/latest/breaking-changes#behavior-changed-nativeimagetobitmap-now-normalizes-color-space)

- ``

  - ``
  - ``[](/pt/docs/latest/api/structures/color-space)

``[](https://nodejs.org/api/buffer.html#buffer_class_buffer)

#### ``
[``](/docs/latest/breaking-changes#behavior-changed-nativeimagetodataurl-will-preserve-png-colorspace)

- ``

  - ``

``[](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)

#### ``**
[``](/docs/latest/breaking-changes#behavior-changed-nativeimagetobitmap-now-normalizes-color-space)

- ``

  - ``
  - ``[](/pt/docs/latest/api/structures/color-space)

``

#### ``**
``[](https://nodejs.org/api/buffer.html#buffer_class_buffer)``**``

#### ``
``

#### ``

- ``
[](/pt/docs/latest/api/structures/size)``

#### ``

- ``
[](https://developer.apple.com/documentation/appkit/nsimage/1520017-template)

#### ``
``[](https://developer.apple.com/documentation/appkit/nsimage/1520017-template)

#### ``

- ``[](/pt/docs/latest/api/structures/rectangle)
``

#### ``

- ``

  - ``
  - ``
  - ``````````

``````

#### ``

- ``
````

#### ``
````

#### ``

- ``

  - ``
  - ````
  - ````
  - ``
  - ``

### 

#### ``**
``[](https://developer.apple.com/documentation/appkit/nsimage/1520017-template)[](https://github.com/electron/electron/edit/main/docs/api/native-image.md)[](/pt/docs/latest/api/message-port-main)[](/pt/docs/latest/api/native-theme)

- 
- 
- [**](#template-image-macos)
- 

  - [``](#nativeimagecreateempty)
  - [``](#nativeimagecreatethumbnailfrompathpath-size-macos-windows)
  - [``](#nativeimagecreatefrompathpath)
  - [``](#nativeimagecreatefrombitmapbuffer-options)
  - [``](#nativeimagecreatefrombufferbuffer-options)
  - [``](#nativeimagecreatefromdataurldataurl)
  - [``](#nativeimagecreatefromnamedimageimagename-options-macos)
  - [``](#nativeimagecreatemenusymbolimagename-macos)

- 

  - 

    - [``](#imagetopngoptions)
    - [``](#imagetojpegquality)
    - [``](#imagetobitmapoptions)
    - [``](#imagetodataurloptions)
    - [``](#imagegetbitmapoptions-deprecated)
    - [``](#imagegetnativehandle-no-macos)
    - [``](#imageisempty)
    - [``](#imagegetsizescalefactor)
    - [``](#imagesettemplateimageoption)
    - [``](#imageistemplateimage)
    - [``](#imagecroprect)
    - [``](#imageresizeoptions)
    - [``](#imagegetaspectratioscalefactor)
    - [``](#imagegetscalefactors)
    - [``](#imageaddrepresentationoptions)

  - 

    - [``](#nativeimageismactemplateimage-no-macos)

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
