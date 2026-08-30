---
title: "Guia de estilo de Documentação do Electron"
description: "Estas são as diretrizes para escrever a documentação do Electron."
topics:
  - "Nativo e desenvolvimento"
keywords:
  - "Guia de estilo de Documentação do Electron"
  - "markdownlint"
  - "javascript"
  - "BrowserWindow"
  - "autoUpdater"
  - "session"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/development/style-guide"
---

# Guia de estilo de Documentação do Electron

Estas são as diretrizes para escrever a documentação do Electron.

## Títulos

- Each page must have a single `#`-level title at the top.

- Chapters in the same page must have `##`-level headings.

- Sub-chapters need to increase the number of `#` in the heading according to
their nesting depth.

- The page's title must follow [APA title case](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case).

- All chapters must follow [APA sentence case](https://apastyle.apa.org/style-grammar-guidelines/capitalization/sentence-case).

Using `Quick Start` as example:

```javascript
# Início Rápido  
  
...  
  
## Processo principal  
  
...  
  
## Processo de renderização   
  
...  
  
## Execute seu aplicativo  
  
...  
  
### Executar como uma distribuição  
  
...  
  
### Baixando manualmente o binário do Electron  
  
...  

```

Para referencias à API, existem exceções a está regra.

## Funcionalidades Markdown

This repository uses the [`markdownlint`](https://github.com/DavidAnson/markdownlint) package to enforce consistent
Markdown styling. For the exact rules, see the `.markdownlint.json` file in the root
folder.

Existem algumas diretrizes de estilo que não estão cobertas pelas regras do linter:

- Use `sh` instead of `cmd` in code blocks (due to the syntax highlighter).

- Keep line lengths between 80 and 100 characters if possible for readability
purposes.

- No nesting lists more than 2 levels (due to the markdown renderer).

- All `js` and `javascript` code blocks are linted with
[standard-markdown](https://www.npmjs.com/package/standard-markdown).

- Para listas não ordenadas, use asteriscos em vez de traços.

## Picking words

- Use "will" over "would" when describing outcomes.

- Prefer "in the ___ process" over "on".

## Referências da API

The following rules only apply to the documentation of APIs.

### Título e descrição

Each module's API doc must use the actual object name returned by `require('electron')`
as its title (such as `BrowserWindow`, `autoUpdater`, and `session`).

Diretamente abaixo do título da página, adicione uma descrição de uma linha do módulo como uma citação de markdown (começando com `>`).

Using the `session` module as an example:

```javascript
# session  
  
> Manage browser sessions, cookies, cache, proxy settings, etc.  

```

### Métodos e eventos de módulo

For modules that are not classes, their methods and events must be listed under
the `## Methods` and `## Events` chapters.

Using `autoUpdater` as an example:

```javascript
# autoUpdater  
  
## Events  
  
### Event: 'error'  
  
## Methods  
  
### `autoUpdater.setFeedURL(options)`  

```

### Classes

- API classes or classes that are part of modules must be listed under a
`## Class: TheClassName` chapter.

- One page can have multiple classes.

- Constructors must be listed with `###`-level headings.

- [Static Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)
must be listed under a `### Static Methods` chapter.

- [Instance Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Prototype_methods)
must be listed under an `### Instance Methods` chapter.

- All methods that have a return value must start their description with
"Returns `[TYPE]` - [Return description]"

  - If the method returns an `Object`, its structure can be specified using a colon
followed by a newline then an unordered list of properties in the same style as
function parameters.

- Instance Events must be listed under an `### Instance Events` chapter.

- Instance Properties must be listed under an `### Instance Properties` chapter.

  - Instance Properties must start with "A [Property Type] ..."

Using the `Session` and `Cookies` classes as an example:

```javascript
# session  
  
## Métodos  
  
### session.fromPartition(partition)  
  
## Propriedades Estáticas  
  
### session.defaultSession  
  
## Classe: Session  
  
### Eventos de Instância  
  
#### Event: 'will-download'  
  
### Métodos de Instância  
  
#### `ses.getCacheSize()`  
  
### Propriedades de Instância  
  
#### `ses.cookies`  
  
## Classe: Cookies  
  
### Métodos de Instância  
  
#### `cookies.get(filter, callback)`  

```

### Métodos e seus argumentos

O capítulo de métodos deve estar no seguinte formato:

```javascript
### `objectName.methodName(required[, optional]))`  
  
* `required` string - A parameter description.  
* `optional` Integer (optional) - Another parameter description.  
  
...  

```

#### Nível de cabeçalho

The heading can be `###` or `####`-levels depending on whether the method
belongs to a module or a class.

#### Function signature

For modules, the `objectName` is the module's name. For classes, it must be the
name of the instance of the class, and must not be the same as the module's
name.

For example, the methods of the `Session` class under the `session` module must
use `ses` as the `objectName`.

Optional arguments are notated by square brackets `[]` surrounding the optional
argument as well as the comma required if this optional argument follows another
argument:

```javascript
obrigatório[, opcional]  

```

#### Argument descriptions

More detailed information on each of the arguments is noted in an unordered list
below the method. The type of argument is notated by either JavaScript primitives
(e.g. `string`, `Promise`, or `Object`), a custom API structure like Electron's
[Cookie](/pt/docs/latest/api/structures/cookie), or the wildcard `any`.

If the argument is of type `Array`, use `[]` shorthand with the type of value
inside the array (for example,`any[]` or `string[]`).

If the argument is of type `Promise`, parametrize the type with what the promise
resolves to (for example, `Promise<void>` or `Promise<string>`).

If an argument can be of multiple types, separate the types with `|`.

The description for `Function` type arguments should make it clear how it may be
called and list the types of the parameters that will be passed to it.

#### Platform-specific functionality

Se um argumento ou um método for exclusivo para determinadas plataformas, essas plataformas são
denotadas usando uma lista itálica delimitada pelo espaço seguindo o tipo de dados. Values
can be `macOS`, `Windows` or `Linux`.

```javascript
* `animate` boolean (optional) _macOS_ _Windows_ - Animate the thing.  

```

### Eventos

O capítulo de eventos deve estar na seguinte forma:

```javascript
### Event: 'wake-up'  
  
Returns:  
  
* `time` string  
  
...  

```

The heading can be `###` or `####`-levels depending on whether the event
belongs to a module or a class.

Os argumentos de um evento seguem as mesmas regras e métodos.

### Propriedades

O capítulo de propriedades deve estar no seguinte formulário:

```javascript
### session.defaultsession  
  
...  

```

The heading can be `###` or `####`-levels depending on whether the property
belongs to a module or a class.

## API History

An "API History" block is a YAML code block encapsulated by an HTML comment that
should be placed directly after the Markdown header for a class or method, like so:

```javascript
#### `win.setTrafficLightPosition(position)` _macOS_  
  
<!--  
```YAML history  
added:  
  - pr-url: https://github.com/electron/electron/pull/22533  
changes:  
  - pr-url: https://github.com/electron/electron/pull/26789  
    description: "Made `trafficLightPosition` option work for `customButtonOnHover` window."  
deprecated:  
  - pr-url: https://github.com/electron/electron/pull/37094  
    breaking-changes-header: deprecated-browserwindowsettrafficlightpositionposition  
```  
-->  
  
* `position` [Point](structures/point.md)  
  
Set a custom position for the traffic light buttons. Can only be used with `titleBarStyle` set to `hidden`.  

```

It should adhere to the API History [JSON Schema](https://json-schema.org/)
(`api-history.schema.json`) which you can find in the `docs` folder.
The [API History Schema RFC](https://github.com/electron/rfcs/blob/f36e0a8483e1ea844710890a8a7a1bd58ecbac05/text/0004-api-history-schema.md) includes example usage and detailed
explanations for each aspect of the schema.

The purpose of the API History block is to describe when/where/how/why an API was:

- Adicionado

- Changed (usually breaking changes)

- Obsoleto

Each API change listed in the block should include a link to the
PR where that change was made along with an optional short description of the
change. If applicable, include the [heading id](https://gist.github.com/asabaylus/3071099)
for that change from the [breaking changes documentation](/pt/docs/latest/breaking-changes).

The [API History linting script](https://github.com/electron/lint-roller/blob/3030970136ec6b41028ef973f944d3e5cad68e1c/bin/lint-markdown-api-history.ts) (`lint:api-history`)
validates API History blocks in the Electron documentation against the schema and
performs some other checks. You can look at its [tests](https://github.com/electron/lint-roller/blob/main/tests/lint-roller-markdown-api-history.spec.ts) for more
details.

There are a few style guidelines that aren't covered by the linting script:

### Formato

Always adhere to this format:

```javascript
API HEADER                  |  #### `win.flashFrame(flag)`  
BLANK LINE                  |   
HTML COMMENT OPENING TAG    |  <!--  
API HISTORY OPENING TAG     |  ```YAML history  
API HISTORY                 |  added:  
                            |    - pr-url: https://github.com/electron/electron/pull/22533  
API HISTORY CLOSING TAG     |  ```  
HTML COMMENT CLOSING TAG    |  -->  
BLANK LINE                  |  

```

### YAML

- Use two spaces for indentation.

- Do not use comments.

### Descriptions

- Always wrap descriptions with double quotation marks (i.e. "example").

  - [Certain special characters (e.g. `[`, `]`) can break YAML parsing](https:/stackoverflow.com/a/37015689/19020549).

- Describe the change in a way relevant to app developers and make it
capitalized, punctuated, and past tense.

  - Refer to [Clerk](https://github.com/electron/clerk/blob/main/README.md#examples)
for examples.

- Keep descriptions concise.

  - Ideally, a description will match its corresponding header in the
breaking changes document.

  - Favor using the release notes from the associated PR whenever possible.

  - Developers can always view the breaking changes document or linked
pull request for more details.

### Placement

Generally, you should place the API History block directly after the Markdown header
for a class or method that was changed. However, there are some instances where this
is ambiguous:

#### Chromium bump

- [chore: bump chromium to 122.0.6194.0 (main)](https://github.com/electron/electron/pull/40750)

  - [Behavior Changed: cross-origin iframes now use Permission Policy to access features](https://github.com/electron/electron/blob/f508f6b6b570481a2b61d8c4f8c1951f492e4309/docs/breaking-changes.md#behavior-changed-cross-origin-iframes-now-use-permission-policy-to-access-features)

Sometimes a breaking change doesn't relate to any of the existing APIs. In this
case, it is ok not to add API History anywhere.

#### Change affecting multiple APIs

- [refactor: ensure IpcRenderer is not bridgable](https://github.com/electron/electron/pull/40330)

  - [Behavior Changed: ipcRenderer can no longer be sent over the contextBridge](https://github.com/electron/electron/blob/f508f6b6b570481a2b61d8c4f8c1951f492e4309/docs/breaking-changes.md#behavior-changed-ipcrenderer-can-no-longer-be-sent-over-the-contextbridge)

Sometimes a breaking change involves multiple APIs. In this case, place the
API History block under the top-level Markdown header for each of the
involved APIs.

```javascript
# contextBridge  
  
<!--  
```YAML history  
changes:  
  - pr-url: https://github.com/electron/electron/pull/40330  
    description: "`ipcRenderer` can no longer be sent over the `contextBridge`"  
    breaking-changes-header: behavior-changed-ipcrenderer-can-no-longer-be-sent-over-the-contextbridge  
```  
-->  
  
> Create a safe, bi-directional, synchronous bridge across isolated contexts  

```

```javascript
# ipcRenderer  
  
<!--  
```YAML history  
changes:  
  - pr-url: https://github.com/electron/electron/pull/40330  
    description: "`ipcRenderer` can no longer be sent over the `contextBridge`"  
    breaking-changes-header: behavior-changed-ipcrenderer-can-no-longer-be-sent-over-the-contextbridge  
```  
-->  
  
Process: [Renderer](../glossary.md#renderer-process)  

```

Notice how an API History block wasn't added under:

- `contextBridge.exposeInMainWorld(apiKey, api)`

since that function wasn't changed, only how it may be used:

```javascript
  contextBridge.exposeInMainWorld('app', {  
-   ipcRenderer,  
+   onEvent: (cb) => ipcRenderer.on('foo', (e, ...args) => cb(args))  
  })  

```

## Documentation translations

See [electron/i18n](https://github.com/electron/i18n#readme)[Editar esta página](https://github.com/electron/electron/edit/main/docs/development/style-guide.md)
