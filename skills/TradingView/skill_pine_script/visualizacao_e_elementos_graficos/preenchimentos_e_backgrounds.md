---
title: "Preenchimentos, Fundos e Cores Dinâmicas — Pine Script v5 / v6"
description: "Técnicas de estilização visual: fill() entre plots e hlines, coloração de fundo com bgcolor(), canais de transparência e gradientes com color.from_gradient()."
category: "Visualização e Elementos Gráficos"
version: "Pine Script v5 / v6"
tags:
  - fill
  - bgcolor
  - colors
  - gradients
  - transparency
  - styling
---

# Preenchimentos, Fundos e Cores Dinâmicas no Pine Script

O Pine Script permite criar camadas visuais ricas através do preenchimento de áreas sombreadas entre curvas (`fill()`), destaque de sessões de mercado ou regimes de volatilidade no fundo do gráfico (`bgcolor()`) e criação de mapas de calor dinâmicos (`color.from_gradient()`).

---

## 1. Preenchimento de Áreas com `fill()`

A função `fill()` conecta duas plotagens (`plot`) ou duas linhas horizontais (`hline`), preenchendo a área delimitada entre elas.

### Sintaxe:
```pinescript
p1 = plot(upperLimit, title="Superior")
p2 = plot(lowerLimit, title="Inferior")
fill(p1, p2, color=color.new(color.blue, 90), title="Área Sombreada")
```

### Preenchimentos Condicionais Dinâmicos:
A cor do `fill()` pode variar de acordo com o estado do mercado (ex: verde se a média rápida estiver acima da lenta, vermelho se estiver abaixo).

---

## 2. Destaque de Fundo com `bgcolor()`

A função `bgcolor()` colore a totalidade do fundo vertical da barra correspondente.

```pinescript
// Destaca sessões asiáticas ou de alta volatilidade
bgcolor(isNySession ? color.new(color.blue, 90) : na, title="Sessão Nova York")
```

---

## 3. Manipulação de Cores e Gradientes (`color.*`)

| Função | Descrição |
|---|---|
| `color.new(baseColor, transp)` | Adiciona transparência (de `0` = opaco a `100` = totalmente invisível). |
| `color.rgb(r, g, b, a)` | Cria uma cor pelos canais Red, Green, Blue (0-255) e Alfa opcional (0-100). |
| `color.from_gradient(value, bottom_value, top_value, bottom_color, top_color)` | Gera um gradiente contínuo proporcional entre duas cores. |

---

## 4. Script Completo: Nuvem de Tendência Ichimoku com Gradiente de Força

```pinescript
//@version=5
indicator("Nuvem Dinâmica e Mapa de Calor de Gradiente", overlay=true)

// 1. CÁLCULO DE MÉDIAS PARA A NUVEM
fastEma = ta.ema(close, 20)
slowEma = ta.ema(close, 50)
rsiVal  = ta.rsi(close, 14)

// 2. COR DINÂMICA DA NUVEM
bool isBullCloud = fastEma >= slowEma
color cloudColor = isBullCloud ? color.new(color.green, 80) : color.new(color.red, 80)

// 3. PLOT E FILL
pFast = plot(fastEma, title="EMA 20", color=isBullCloud ? color.green : color.maroon, linewidth=1)
pSlow = plot(slowEma, title="EMA 50", color=isBullCloud ? color.teal : color.red, linewidth=1)
fill(pFast, pSlow, color=cloudColor, title="Nuvem de Tendência")

// 4. FUNDO COM GRADIENTE BASEADO NO RSI (MAPA DE CALOR DE MOMENTO)
// Gradiente de verde (sobrevendido) para vermelho (sobrecomprado)
color rsiHeatmap = color.from_gradient(rsiVal, 30, 70, color.new(color.green, 90), color.new(color.red, 90))
bgcolor(rsiHeatmap, title="Mapa de Calor RSI")
```
