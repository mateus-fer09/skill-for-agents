---
title: "Introdução e Primeiro Indicador — Pine Script v5 / v6"
description: "Guia completo sobre a diretiva de compilação //@version, declaração de scripts (indicator, strategy, library), parâmetros fundamentais e construção do primeiro indicador."
category: "Primeiros Passos"
version: "Pine Script v5 / v6"
tags:
  - indicator
  - strategy
  - library
  - version
  - overlay
  - primer
---

# Introdução e Primeiro Indicador em Pine Script

Pine Script é a linguagem de programação de domínio específico (DSL) desenvolvida pelo TradingView para criar indicadores técnicos personalizados, estratégias quantitativas completas e bibliotecas reutilizáveis. Ela é executada nativamente nos servidores em nuvem do TradingView e renderizada em tempo real no navegador ou aplicativo desktop.

---

## 1. Diretivas de Versão do Compilador

Todo script em Pine Script moderno deve iniciar obrigatoriamente com a diretiva de versão do compilador na primeiríssima linha do código (sem espaços antes da barra dupla).

```pinescript
//@version=5
```
ou na versão mais recente:
```pinescript
//@version=6
```

### Por que a diretiva é obrigatória?
- Se a diretiva for omitida, o compilador do TradingView assumirá por padrão a versão legada v1, o que causará falhas de compilação imediatas com códigos modernos.
- Pine Script v5 e v6 introduzem namespaces padronizados (`ta.*`, `math.*`, `request.*`, etc.), tipagem estrita, estruturas como `map`, `matrix`, `enum`, `type` e métodos orientados a objetos.

---

## 2. Declaração do Script: `indicator()`, `strategy()` ou `library()`

Exatamente um dos três comandos de declaração a seguir deve estar presente no script. A declaração define o tipo do script e suas capacidades no runtime do TradingView.

| Declaração | Finalidade Principal | Pode Plotar no Gráfico? | Pode Executar Ordens de Backtest? | Pode Exportar Funções/Tipos? |
|---|---|:---:|:---:|:---:|
| `indicator()` | Análise técnica visual, cálculos e alertas | Sim | Não | Não |
| `strategy()` | Backtesting de trading quantitativo e simulação de ordens | Sim | Sim | Não |
| `library()` | Pacotes de funções e tipos compartilháveis | Não | Não | Sim |

---

## 3. Parâmetros Principais da Declaração `indicator()`

| Parâmetro | Tipo | Padrão | Descrição |
|---|---|---|---|
| `title` | `const string` | Obrigatório | Nome completo do indicador exibido no topo do gráfico e na lista de scripts. |
| `shorttitle` | `const string` | `title` | Nome abreviado exibido na legenda do gráfico (legenda de valores). |
| `overlay` | `const bool` | `false` | Se `true`, plota sobre o painel principal de preços. Se `false`, cria um painel inferior separado. |
| `format` | `const string` | `format.inherit` | Formato dos valores numéricos (`format.price`, `format.volume`, `format.percent`, `format.inherit`). |
| `precision` | `const int` | `2` | Número de casas decimais exibidas na escala e na legenda (de 0 a 16). |
| `scale` | `scale_type` | `scale.right` | Escala do painel (`scale.right`, `scale.left`, `scale.none`). |
| `max_bars_back` | `const int` | Automático | Tamanho do buffer histórico para séries de dados quando a inferência automática falha (até 5000). |
| `max_lines_count` | `const int` | `50` | Limite de objetos `line` ativos na tela (máximo 500). |
| `max_labels_count` | `const int` | `50` | Limite de objetos `label` ativos na tela (máximo 500). |
| `max_boxes_count` | `const int` | `50` | Limite de objetos `box` ativos na tela (máximo 500). |
| `max_polylines_count`| `const int` | `50` | Limite de objetos `polyline` ativos na tela (máximo 100). |
| `dynamic_requests` | `const bool` | `false` | Permite chamadas dinâmicas a `request.security()` com strings de símbolos variáveis (Pine v6). |

---

## 4. Construindo o Primeiro Indicador Passo a Passo

Abaixo está um exemplo completo, compilável e executável de um indicador clássico: **Cruzamento de Médias Móveis com Bandas de Volatilidade e Painel Overlay**.

```pinescript
//@version=5
indicator(title="Primeiro Indicador — Trend & Volatility Engine", shorttitle="TVE", overlay=true, max_bars_back=500)

// 1. INPUTS CONFIGURÁVEIS PELO USUÁRIO
groupTrend   = "Configuração de Tendência"
fastLen      = input.int(defval=9, title="Período da Média Rápida (EMA)", minval=1, group=groupTrend, tooltip="Comprimento da média móvel exponencial de curto prazo.")
slowLen      = input.int(defval=21, title="Período da Média Lenta (EMA)", minval=1, group=groupTrend, tooltip="Comprimento da média móvel exponencial de médio prazo.")
srcPrice     = input.source(defval=close, title="Fonte de Preço", group=groupTrend)

groupAtr     = "Filtro de Volatilidade (ATR)"
atrLen       = input.int(defval=14, title="Período do ATR", minval=1, group=groupAtr)
atrMult      = input.float(defval=1.5, title="Multiplicador do ATR", minval=0.1, step=0.1, group=groupAtr)

// 2. CÁLCULOS TÉCNICOS
fastEma = ta.ema(srcPrice, fastLen)
slowEma = ta.ema(srcPrice, slowLen)
atrVal  = ta.atr(atrLen)

// Bandas dinâmicas baseadas na Média Lenta e no ATR
upperBand = slowEma + (atrVal * atrMult)
lowerBand = slowEma - (atrVal * atrMult)

// Condições de Cruzamento de Tendência
bullishCross = ta.crossover(fastEma, slowEma)
bearishCross = ta.crossunder(fastEma, slowEma)

// 3. RENDERIZAÇÃO GRÁFICA (PLOTS)
pFast  = plot(fastEma, title="EMA Rápida", color=color.rgb(33, 150, 243), linewidth=2)
pSlow  = plot(slowEma, title="EMA Lenta", color=color.rgb(255, 152, 0), linewidth=2)
pUpper = plot(upperBand, title="Banda Superior ATR", color=color.new(color.teal, 50), style=plot.style_line)
pLower = plot(lowerBand, title="Banda Inferior ATR", color=color.new(color.maroon, 50), style=plot.style_line)

// Preenchimento entre as bandas ATR
fill(pUpper, pLower, color=color.new(color.blue, 92), title="Zona de Volatilidade ATR")

// Formas de Sinalização de Compra / Venda
plotshape(bullishCross, title="Sinal Bullish", style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small, text="COMPRA")
plotshape(bearishCross, title="Sinal Bearish", style=shape.triangledown, location=location.abovebar, color=color.red, size=size.small, text="VENDA")

// Coloração do fundo das barras no momento do cruzamento
bgcolor(bullishCross ? color.new(color.green, 85) : bearishCross ? color.new(color.red, 85) : na, title="Destaque de Cruzamento")

// 4. ALERTAS AUTOMATIZADOS
alertcondition(bullishCross, title="Alerta: Cruzamento de Alta (Bullish)", message="Alerta TVE: EMA Rápida cruzou acima da EMA Lenta no ativo {{ticker}}! Preço atual: {{close}}")
alertcondition(bearishCross, title="Alerta: Cruzamento de Baixa (Bearish)", message="Alerta TVE: EMA Rápida cruzou abaixo da EMA Lenta no ativo {{ticker}}! Preço atual: {{close}}")
```

---

## 5. Primeiro Script Não-Overlay (Painel Separado / Oscilador)

Quando `overlay=false`, o indicador renderiza em uma janela separada abaixo do gráfico de preços. É ideal para osciladores como RSI, Estocástico, MACD e OBV.

```pinescript
//@version=5
indicator(title="Primeiro Oscilador — RSI Dinâmico com Bandas", shorttitle="RSI Dyn", overlay=false, precision=2)

// 1. INPUTS
rsiLength   = input.int(14, title="Período do RSI", minval=1)
rsiSource   = input.source(close, title="Fonte")
obLevel     = input.int(70, title="Nível de Sobrecompra (Overbought)", minval=50, maxval=100)
osLevel     = input.int(30, title="Nível de Sobrevenda (Oversold)", minval=0, maxval=50)

// 2. CÁLCULO DO RSI E SUA MÉDIA
rsiValue = ta.rsi(rsiSource, rsiLength)
rsiMa    = ta.sma(rsiValue, 14)

// 3. PLOTAGEM DE NÍVEIS FIXOS (HLINE)
hOverbought = hline(obLevel, title="Sobrecompra", color=color.red, linestyle=hline.style_dashed)
hMiddle     = hline(50, title="Centro (50)", color=color.gray, linestyle=hline.style_dotted)
hOversold   = hline(osLevel, title="Sobrevenda", color=color.green, linestyle=hline.style_dashed)

// Preenchimento de cor entre os níveis de Sobrecompra e Sobrevenda
fill(hOverbought, hOversold, color=color.rgb(33, 150, 243, 90), title="Área Neutra")

// 4. PLOTS DINÂMICOS
rsiColor = rsiValue >= obLevel ? color.red : rsiValue <= osLevel ? color.green : color.purple
plot(rsiValue, title="Linha RSI", color=rsiColor, linewidth=2)
plot(rsiMa, title="Média Móvel do RSI", color=color.yellow, linewidth=1)
```

---

## 6. Boas Práticas e Erros Comuns

1. **Incompatibilidade de Overlay**:
   - Tentar plotar o preço `close` em um indicador com `overlay=false` comprimirá as linhas em escalas incompatíveis.
   - Sempre defina `overlay=true` para médias móveis, VWAP, Bollinger Bands e suportes/resistências.
2. **Declaração Múltipla**:
   - É proibido declarar mais de um `indicator()`, `strategy()` ou `library()` no mesmo arquivo. O compilador emitirá erro de sintaxe.
3. **Versão Omitida ou Antiga**:
   - Nunca use `//@version=4` ou `//@version=3` em novos projetos. Utilize os novos recursos de `//@version=5` ou `//@version=6`.
