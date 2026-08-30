---
title: "DesktopCapturerSource Object"
description: "- id string - O identificador de uma window ou screen que pode ser usado como uma restrição chromeMediaSourceId ao chamar [ navigator.getUserMedia ](https://developer.mozilla.org/e"
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "DesktopCapturerSource Object"
  - "chromeMediaSourceId"
  - "navigator.getUserMedia"
  - "name"
  - "thumbnail"
  - "thumbnailSize"
  - "options"
  - "desktopCapturer.getSources"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/desktop-capturer-source"
---

# DesktopCapturerSource Object

- `id` string - O identificador de uma window ou screen que pode ser usado como uma restrição `chromeMediaSourceId` ao chamar [`navigator.getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia). O formato do identificador será `window:XX:YY` ou `screen:ZZ:0`. XX é o windowID/handle. YY é 1 para o processo atual, e 0 para todos os outros. ZZ é um número sequencial que representa a tela, e não é igual ao índice no nome da fonte.

- `name` string - Uma janela será nomeada ou `Entire Screen` ou `Screen<index>`, onde o nome de uma janela será de acordo com o título da janela.

- `thumbnail` [NativeImage](/pt/docs/latest/api/native-image) - A thumbnail image. **Nota:** Não há garantia de que o tamanho da miniatura é o mesmo de `thumbnailSize` especificado nas `options` passadas para `desktopCapturer.getSources`. O tamanho real depende da escala da tela ou da janela.

- `display_id` string - A unique identifier that will correspond to the `id` of the matching [Display](/pt/docs/latest/api/structures/display) returned by the [Screen API](/pt/docs/latest/api/screen). Em algumas plataformas, isso é equivalente a `xx` porção do campo do `id` acima, e em outras será diferente. Será uma string vazia se não estiver disponível.

- `appIcon` [NativeImage](/pt/docs/latest/api/native-image) - Uma imagem de ícone do aplicativo que tenha uma janela ou nulo se a origem tiver um tipo de tela. O tamanho do ícone não é conhecido antecipadamente e depende do que o aplicativo fornece.
