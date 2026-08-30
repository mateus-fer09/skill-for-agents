---
title: "Objeto"
description: "- accelerometerSupport string - Pode ser available , unavailable , unknown ."
topics:
  - "Api"
  - "Estruturas"
keywords:
  - "Objeto"
  - "Display"
  - "accelerometerSupport"
  - "available"
  - "unavailable"
  - "unknown"
  - "bounds"
  - "colorDepth"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/structures/display"
---

# Objeto `Display`

- `accelerometerSupport` string - Pode ser `available`, `unavailable`, `unknown`.

- `bounds` [Rectangle](/pt/docs/latest/api/structures/rectangle) - the bounds of the display in DIP points.

- `colorDepth` number - O número de bits por pixel.

- `colorSpace` string — Representa um espaço de cor (objeto tridimensional que contém todas as combinações de cor possíveis) para o propósito de conversões de cores.

- `depthPerComponent` number - O número de bits por componente de cor.

- `detected` boolean - `true` if the display is detected by the system.

- `displayFrequency` number - A taxa de atualização de exibição.

- `id` number - Identificador único associado ao objeto. A value of -1 means the display is invalid or the correct `id` is not yet known, and a value of -10 means the display is a virtual display assigned to a unified desktop.

- `internal` boolean - `true` para um display interno e `false` para um display externo.

- `label` string - Etiqueta amigável, determinada pela plataforma.

- `maximumCursorSize` [Size](/pt/docs/latest/api/structures/size) - Maximum cursor size in native pixels.

- `nativeOrigin`[Point](/pt/docs/latest/api/structures/point) — Retorna as coordenadas originais do objeto em 'píxel'. Only available on windowing systems like X11 that position displays in pixel coordinates.

- `rotation` number - Representa a rotação da janela em graus no sentido horário. Pode ser 0, 90, 180 e 270.

- `scaleFactor` number - Fator de escala de pixels do dispositivo de saída.

- `touchSupport` string - Pode ser `available`, `unavailable` ou `unknown`.

- `monochrome` boolean - se o display é ou não um display monocromático.

- `size` [Size](/pt/docs/latest/api/structures/size)

- `workArea` [Rectangle](/pt/docs/latest/api/structures/rectangle) - the work area of the display in DIP points.

- `workAreaSize`[Size](/pt/docs/latest/api/structures/size) — O tamanho (dimensões) da área útil.

O objeto `Display` representa o display físico conectado ao sistema. Um `Display` falso pode existir em um sistema sem interface gráfica, ou um `Display` pode corresponder a um display virtual remoto.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/structures/display.md)
