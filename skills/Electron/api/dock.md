---
title: "Dock"
description: "Documentação técnica e referência da API de Dock no Electron."
topics:
  - "Api"
keywords:
  - "Dock"
  - "type"
  - "informacional"
  - "critical"
  - "informational"
  - "filePath"
  - "text"
  - "string"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/dock"
---

## 

> 

Controle seu app no dock para macOS

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

> 

[!TIP] Veja também: [Um guia detalhado sobre como implementar os menus Dock](/pt/docs/latest/tutorial/macos-dock).

### Métodos de Instância

#### `dock.bounce([type])` *macOS*

- `type` *string* (opcional) - Pode ser `crítico` ou `informacional`. O valor padrão é `informacional`

Retorna um `Número` - um ID que representa a solicitação.

Quando `critical` é informado, o ícone na barra dock será ativado até que o aplicativo seja iniciado ou, a solicitação seja cancelada.

Quando `informational` é passado, o ícone irá pular para um segundo. No entanto, a solicitação continua ativa até que a aplicação torne-se ativa ou a solicitação seja cancelada.

> 

[!Nota: Esse método pode ser usado apenas quando o app não estiver focado; quando o app é focado ele retornará -1.

#### `dock.cancelBounce(id)` *macOS*

- `id` Inteiro

Cancelar o ressalto  `id`.

#### `dock.downloadFinished(filePath)` no *macOS*

- `filePath` string

Pular o Download se a função de script estiver dentro da pasta Downloads.

#### `dock.setBadge(text)` no *macOS*

- `text` string

Seleciona a *string* a ser mostrada na área de emblemamento do dock.

> 

[!IMPORTANTE] Você precisa garantir que seu aplicativo tenha permissão para exibir notificações para este método funcionar.

#### `dock.getBadge()` no *macOS*

Retorna `string` A sequência de caracteres do ícone na dock.

#### `dock.hide()` no *macOS*

Esconde o ícone na Dock.

> [!NOTE]
> 

> info

> 

**Known issue:** Calling `dock.hide()` within one second of a previous call will have no effect. As a workaround, ensure at least one second has elapsed between calls — for example, by deferring with a `setTimeout` of 1100ms or more after a previous call.

#### `dock.show()` no *macOS*

Retorna `Promise<void>`  Determina quando o ícone dock deve ser apresentado.

#### `dock.isVisible()` no *macOS*

Retorna `boolean` - Se o ícone do dock está visível.

#### `dock.setMenu(menu)` no *macOS*

- `menu`[Menu](/pt/docs/latest/api/menu)

Define a menu dock da aplicação [menu dock](https://developer.apple.com/design/human-interface-guidelines/dock-menus).

#### `dock.getMenu()` no *macOS*

Retorna `Menu | null` - da aplicação [menu dock](https://developer.apple.com/design/human-interface-guidelines/dock-menus).

#### `dock.setIcon(image)` no *macOS*

- `image` ([Imagem de navegação](/pt/docs/latest/api/native-image) | string)

Define a `imagem` associada com o ícone do dock.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/dock.md)[AnteriorClass: Debugger](/pt/docs/latest/api/debugger)[AvançarClass: DownloadItem](/pt/docs/latest/api/download-item)
