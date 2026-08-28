---
title: "Rótulos (Labels) e Tabelas de Painel (Tables) — Pine Script v5 / v6"
description: "Construção de interfaces de usuário ricas com label.* e table.*: posicionamento, estilos, tooltips, HUDs multi-temporais e painéis de estatísticas fixos."
category: "Visualização e Elementos Gráficos"
version: "Pine Script v5 / v6"
tags:
  - labels
  - tables
  - ui
  - hud
  - dashboard
  - tooltips
---

# Rótulos (`label.*`) e Tabelas (`table.*`) no Pine Script

O Pine Script permite enriquecer a experiência do usuário através de **etiquetas de texto flutuantes ancoradas no preço (`label.*`)** e **painéis estáticos de instrumentos e dados fixos na tela (`table.*`)**.

---

## 1. Rótulos Flutuantes com `label.*`

Os rótulos são caixas de texto com ponteiros que apontam para coordenadas específicas no gráfico.

### Funções e Propriedades Principais:
- `label.new(x, y, text, xloc, yloc, color, style, textcolor, size, textalign, tooltip)`: Cria um novo rótulo.
- `label.set_text()`, `label.set_tooltip()`: Atualiza o texto visível ou o texto exibido ao passar o mouse.
- `label.set_style()`: Altera o formato (`label.style_label_up`, `label.style_label_down`, `label.style_label_left`, `label.style_label_right`, `label.style_none`).
- `label.delete()`: Remove o rótulo da memória.

---

## 2. Tabelas e Painéis HUD Fixos com `table.*`

As tabelas são grades fixas de linhas e colunas ancoradas em um dos 9 cantos da janela do gráfico, independentes de zoom ou rolagem.

### Posições Suportadas (`position.*`):
- `position.top_left`, `position.top_center`, `position.top_right`
- `position.middle_left`, `position.middle_center`, `position.middle_right`
- `position.bottom_left`, `position.bottom_center`, `position.bottom_right`

### Ciclo Canônico de Construção de Tabela:
1. **Criação Única com `var`**:
```pinescript
var table myDashboard = table.new(position.top_right, columns=3, rows=5, bgcolor=color.black, border_width=1)
```
2. **Preenchimento Otimizado em `barstate.islast`**:
```pinescript
if barstate.islast
    table.cell(myDashboard, column=0, row=0, text="Métrica", text_color=color.white, bgcolor=color.navy)
```

---

## 3. Script Completo: Painel de Controle Multiativo e Estatísticas de Mercado

```pinescript
//@version=5
indicator("Dashboard Analítico Profissional — HUD Table", overlay=true, max_labels_count=50)

// 1. INPUTS
posTable = input.string(defval="Superior Direito", title="Posição do Painel", options=["Superior Direito", "Superior Esquerdo", "Inferior Direito", "Inferior Esquerdo"])

tablePos = switch posTable
    "Superior Direito"  => position.top_right
    "Superior Esquerdo" => position.top_left
    "Inferior Direito"  => position.bottom_right
    => position.bottom_left

// 2. CÁLCULOS TÉCNICOS
rsiVal  = ta.rsi(close, 14)
atrVal  = ta.atr(14)
sma200  = ta.sma(close, 200)
trendUp = close > sma200

// Variação Diária
dailyChange = (close - open) / open * 100

// 3. RÓTULO DINÂMICO DE PREÇO ATUAL COM TOOLTIP
var label livePriceLabel = na
label.delete(livePriceLabel)
livePriceLabel := label.new(
     x=bar_index, y=close,
     text="RSI: " + str.tostring(rsiVal, "#.#"),
     color=rsiVal > 70 ? color.red : rsiVal < 30 ? color.green : color.blue,
     textcolor=color.white,
     style=label.style_label_left,
     tooltip="Preço Atual: " + str.tostring(close) + "\nATR(14): " + str.tostring(atrVal, "#.##")
  )

// 4. CRIAÇÃO E RENDERIZAÇÃO DA TABELA (HUD)
var table hud = table.new(tablePos, 2, 5, bgcolor=color.rgb(15, 18, 24), border_color=color.rgb(45, 50, 65), border_width=1)

if barstate.islast
    // Cabeçalho
    table.cell(hud, 0, 0, "Indicador", text_color=color.white, bgcolor=color.rgb(30, 40, 60), text_size=size.small)
    table.cell(hud, 1, 0, "Valor / Estado", text_color=color.white, bgcolor=color.rgb(30, 40, 60), text_size=size.small)
    
    // Linha 1: Tendência Primária (SMA 200)
    table.cell(hud, 0, 1, "Tendência 200", text_color=color.white, text_size=size.small)
    table.cell(hud, 1, 1, trendUp ? "ALTA (BULL)" : "BAIXA (BEAR)", text_color=trendUp ? color.green : color.red, text_size=size.small)
    
    // Linha 2: Oscilador RSI
    table.cell(hud, 0, 2, "RSI (14)", text_color=color.white, text_size=size.small)
    table.cell(hud, 1, 2, str.tostring(rsiVal, "#.##"), text_color=rsiVal >= 70 ? color.red : rsiVal <= 30 ? color.green : color.white, text_size=size.small)
    
    // Linha 3: Volatilidade ATR
    table.cell(hud, 0, 3, "Volatilidade ATR", text_color=color.white, text_size=size.small)
    table.cell(hud, 1, 3, str.tostring(atrVal, "#.##"), text_color=color.yellow, text_size=size.small)
    
    // Linha 4: Variação da Barra
    table.cell(hud, 0, 4, "Retorno da Barra", text_color=color.white, text_size=size.small)
    table.cell(hud, 1, 4, str.tostring(dailyChange, "+#.##;-#.##;0.00") + "%", text_color=dailyChange >= 0 ? color.green : color.red, text_size=size.small)

plot(sma200, title="Média 200", color=color.white)
```
