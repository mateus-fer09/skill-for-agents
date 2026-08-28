---
title: "Linhas, Caixas e Polilinhas Gráficas — Pine Script v5 / v6"
description: "Criação dinâmica de elementos geométricos com line.*, box.* e polyline.*: coordenadas xloc (bar_index vs bar_time), estilos, extensões e gerenciamento de limites de memória."
category: "Visualização e Elementos Gráficos"
version: "Pine Script v5 / v6"
tags:
  - lines
  - boxes
  - polylines
  - chart-points
  - drawing-objects
  - garbage-collection
---

# Linhas, Caixas e Polilinhas (`line.*`, `box.*`, `polyline.*`)

Diferente das plotagens convencionais que produzem séries contínuas para cada barra, os objetos de desenho permitem criar formas geométricas dinâmicas em coordenadas de tempo e preço arbitrárias no passado, presente ou futuro do gráfico.

---

## 1. Coordenadas de Tempo: `xloc.bar_index` vs `xloc.bar_time`

| Modo `xloc` | Eixo X Representa... | Vantagem |
|---|---|---|
| `xloc.bar_index` (Padrão) | O número sequencial da barra (`bar_index`). | Simples e intuitivo para cálculos baseados em contagem de barras. |
| `xloc.bar_time` | Timestamp UNIX em milissegundos (`time`). | Essencial para projetar desenhos no **futuro** (além da barra atual) ou em multi-timeframe. |

---

## 2. Segmentos de Linha com `line.*`

### Funções Principais:
- `line.new(x1, y1, x2, y2, xloc, extend, color, style, width)`: Cria uma linha.
- `line.set_xy1()`, `line.set_xy2()`: Modifica as coordenadas.
- `line.set_extend()`: Define extensões (`extend.none`, `extend.right`, `extend.left`, `extend.both`).
- `line.set_style()`: Altera o estilo (`line.style_solid`, `line.style_dashed`, `line.style_dotted`).
- `line.delete()`: Remove o objeto da memória.

---

## 3. Retângulos e Zonas com `box.*`

### Funções Principais:
- `box.new(left, top, right, bottom, border_color, border_width, border_style, extend, xloc, bgcolor)`: Cria uma caixa delimitadora.
- `box.set_top()`, `box.set_bottom()`, `box.set_right()`, `box.set_left()`: Ajusta as dimensões dinamicamente.
- `box.set_text()`, `box.set_text_color()`, `box.set_text_size()`: Adiciona texto embutido na caixa.

---

## 4. Polilinhas e Formas Complexas com `polyline.*` (Pine v6)

Polilinhas conectam múltiplos vértices 2D definidos através de um array de `chart.point`.

```pinescript
// Criação de polilinha triangular
chart.point[] points = array.new<chart.point>(0)
array.push(points, chart.point.from_index(bar_index - 10, low[10]))
array.push(points, chart.point.from_index(bar_index - 5, high[5]))
array.push(points, chart.point.from_index(bar_index, low))

polyline.new(points, curved=false, closed=true, line_color=color.purple, fill_color=color.new(color.purple, 80))
```

---

## 5. Gerenciamento de Limites e Garbage Collection

> **Regra Fundamental de Limites**:
> Por padrão, o Pine Script exibe até **50 linhas, 50 caixas e 50 polilinhas**. Para aumentar esse limite até o teto máximo de **500 objetos**, configure explicitamente na declaração do script:
> `indicator("Meu Script", max_lines_count=500, max_boxes_count=500, max_polylines_count=100)`

---

## 6. Script Completo: Detector e Projetor de Zonas de Oferta e Demanda (Order Blocks)

```pinescript
//@version=5
indicator("Zonas de Oferta e Demanda com Caixas Dinâmicas", overlay=true, max_boxes_count=100, max_lines_count=100)

// 1. INPUTS
pivotLen   = input.int(5, title="Força do Pivô")
boxOpacity = input.int(80, title="Transparência da Zona", minval=0, maxval=100)

// 2. DETECÇÃO DE PIVÔS
pH = ta.pivothigh(high, pivotLen, pivotLen)
pL = ta.pivotlow(low, pivotLen, pivotLen)

// 3. ARRAYS DE GERENCIAMENTO DE CAIXAS
var box[] supplyBoxes = array.new_box(0)
var box[] demandBoxes = array.new_box(0)

// Criação de Zona de Oferta (Supply Zone / Topo)
if not na(pH)
    box b = box.new(
         left=bar_index - pivotLen, top=high[pivotLen],
         right=bar_index + 15, bottom=math.max(open[pivotLen], close[pivotLen]),
         border_color=color.red,
         bgcolor=color.new(color.red, boxOpacity),
         text="Oferta (Supply)", text_size=size.small, text_color=color.white
      )
    array.push(supplyBoxes, b)
    if array.size(supplyBoxes) > 20
        box.delete(array.shift(supplyBoxes))

// Criação de Zona de Demanda (Demand Zone / Fundo)
if not na(pL)
    box b = box.new(
         left=bar_index - pivotLen, top=math.min(open[pivotLen], close[pivotLen]),
         right=bar_index + 15, bottom=low[pivotLen],
         border_color=color.green,
         bgcolor=color.new(color.green, boxOpacity),
         text="Demanda (Demand)", text_size=size.small, text_color=color.white
      )
    array.push(demandBoxes, b)
    if array.size(demandBoxes) > 20
        box.delete(array.shift(demandBoxes))

plot(close, title="Preço", color=color.gray)
```
