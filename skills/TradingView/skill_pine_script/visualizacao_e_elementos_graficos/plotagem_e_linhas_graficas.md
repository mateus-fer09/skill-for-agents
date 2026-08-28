---
title: "Plotagem e Linhas Gráficas — Pine Script v5 / v6"
description: "Guia completo de plotagem técnica: plot(), plotshape(), plotchar(), plotarrow(), plotcandle(), plotbar(), estilos gráficos e mascaramento dinâmico com na."
category: "Visualização e Elementos Gráficos"
version: "Pine Script v5 / v6"
tags:
  - plot
  - plotshape
  - plotchar
  - plotcandle
  - plotbar
  - visualization
---

# Plotagem e Linhas Gráficas no Pine Script

O Pine Script fornece uma rica gama de funções embutidas para renderização gráfica de alta performance diretamente no gráfico de preços ou em painéis osciladores separados.

---

## 1. A Função `plot()` e seus Estilos

A função `plot()` é o principal meio de desenhar séries numéricas contínuas ou discretas.

### Parâmetros Principais de `plot()`:
| Parâmetro | Tipo | Descrição |
|---|---|---|
| `series` | `series float/int` | A série temporal de dados a ser desenhada. |
| `title` | `const string` | Nome exibido nas opções de formatação e na legenda do gráfico. |
| `color` | `series color` | Cor estática ou dinâmica da linha/histograma. |
| `linewidth` | `input int` | Espessura da linha (de 1 a 4). |
| `style` | `plot_style` | O estilo gráfico de renderização (ver tabela abaixo). |
| `trackprice` | `const bool` | Se `true`, desenha uma linha horizontal pontilhada estendida no último preço plotado. |
| `offset` | `input int` | Desloca a plotagem `n` barras para a direita (positivo) ou esquerda (negativo). |
| `show_last` | `input int` | Limita o desenho apenas às últimas `n` barras do gráfico. |

### Estilos de Plotagem (`plot.style_*`):
- `plot.style_line` (Padrão): Linha contínua conectando os pontos.
- `plot.style_stepline`: Linha em degraus (estilo escada), ideal para níveis e suportes.
- `plot.style_histogram`: Barras verticais a partir do valor zero.
- `plot.style_cross`: Cruzes individuais em cada barra.
- `plot.style_circles`: Círculos em cada barra.
- `plot.style_area`: Linha com preenchimento sombreado até o zero.
- `plot.style_columns`: Colunas sólidas verticais.
- `plot.style_linebr`: Linha contínua que **não conecta** sobre valores `na` (cria quebras visuais).

---

## 2. Formas, Caracteres e Setas (`plotshape`, `plotchar`, `plotarrow`)

| Função | Finalidade | Principais Argumentos |
|---|---|---|
| `plotshape()` | Desenha formas geométricas (triângulos, diamantes, círculos, etc.) | `series`, `style`, `location`, `color`, `size`, `text`, `textcolor` |
| `plotchar()` | Renderiza qualquer caractere Unicode ou letra | `series`, `char`, `location`, `color`, `size`, `text` |
| `plotarrow()` | Plota setas proporcionais à magnitude da série | `series`, `colorup`, `colordown`, `maxheight`, `minheight` |

### Localizações de Formas (`location.*`):
- `location.abovebar`: Acima da máxima da vela.
- `location.belowbar`: Abaixo da mínima da vela.
- `location.top`: No topo absoluto do painel.
- `location.bottom`: Na base absoluta do painel.
- `location.absolute`: No valor de preço exato fornecido.

---

## 3. Plotagem Customizada de Barras e Velas (`plotbar`, `plotcandle`)

Permite desenhar barras OHLC e velas completas totalmente personalizadas (ex: barras Heikin-Ashi sintéticas ou candles filtrados por volume).

```pinescript
plotcandle(open, high, low, close, title="Velas Customizadas", color=close > open ? color.green : color.red, wickcolor=color.gray, bordercolor=color.black)
```

---

## 4. Script Completo: Mostruário de Todos os Estilos de Plotagem

```pinescript
//@version=5
indicator("Galeria Completa de Plotagens Gráficas", overlay=true)

// 1. CÁLCULOS
ma20 = ta.sma(close, 20)
ma50 = ta.sma(close, 50)
crossUp = ta.crossover(ma20, ma50)
crossDown = ta.crossunder(ma20, ma50)
momentum = ta.mom(close, 10)

// 2. PLOT NORMAL E STEPLINE
plot(ma20, title="MA 20 (Line)", color=color.blue, linewidth=2)
plot(ma50, title="MA 50 (Stepline)", color=color.orange, linewidth=2, style=plot.style_stepline)

// 3. PLOTSHAPE (Sinais de Compra/Venda)
plotshape(crossUp, title="Cruzamento de Alta", style=shape.triangleup, location=location.belowbar, color=color.green, size=size.normal, text="COMPRA")
plotshape(crossDown, title="Cruzamento de Baixa", style=shape.triangledown, location=location.abovebar, color=color.red, size=size.normal, text="VENDA")

// 4. PLOTCHAR (Indicador de Volume Excepcional)
isHighVol = volume > ta.sma(volume, 20) * 2.0
plotchar(isHighVol, title="Volume Alto", char="★", location=location.abovebar, color=color.yellow, size=size.small)

// 5. COLORIZAÇÃO CONDICIONAL DE VELAS (BARCOLOR)
barcolor(close > open and isHighVol ? color.purple : na, title="Vela de Volume Alto")
```
