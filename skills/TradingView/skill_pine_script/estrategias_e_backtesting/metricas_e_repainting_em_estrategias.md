---
title: "Métricas de Performance e Prevenção de Repainting em Estratégias — Pine Script v5 / v6"
description: "Auditoria quantitativa de estratégias: métricas built-in de performance (netprofit, drawdown, winrate), modelos de preenchimento de ordens e identificação de repainting."
category: "Estratégias e Backtesting"
version: "Pine Script v5 / v6"
tags:
  - performance-metrics
  - winrate
  - drawdown
  - order-fills
  - repainting-audit
  - realistic-backtesting
---

# Métricas de Performance e Prevenção de Repainting em Estratégias

Um backtest só possui valor prático se refletir com fidelidade as condições reais de execução do mercado, eliminando vieses de antecipação temporal (Lookahead Bias) e preenchimentos irreais de ordens.

---

## 1. Métricas de Performance Built-in (`strategy.*`)

| Variável Built-in | Tipo | Significado |
|---|---|---|
| `strategy.netprofit` | `series float` | Lucro líquido total realizado da estratégia em unidades monetárias. |
| `strategy.grossprofit` | `series float` | Soma de todos os lucros obtidos nas operações vencedoras. |
| `strategy.grossloss` | `series float` | Soma de todas as perdas das operações perdedoras. |
| `strategy.wintrades` | `series int` | Quantidade total de operações com lucro fechadas. |
| `strategy.losstrades` | `series int` | Quantidade total de operações com prejuízo fechadas. |
| `strategy.eventrades` | `series int` | Operações fechadas no zero a zero (breakeven). |
| `strategy.closedtrades`| `series int` | Total consolidado de operações fechadas. |
| `strategy.max_drawdown`| `series float` | Maior declínio de capital de pico a vale (Drawdown Máximo). |

---

## 2. Armadilhas Clássicas de Repainting em Estratégias

1. **`calc_on_every_tick = true` sem Simulação Intrabar Adequada**:
   - Em tempo real, a estratégia pode entrar e sair várias vezes na mesma barra. No histórico, a barra consolida e apenas uma execução final pode ser registrada, divergindo drasticamente do resultado ao vivo.
2. **Uso de `lookahead_on` em Chamadas Multi-Timeframe**:
   - Se o script consultar dados de um timeframe superior usando `barmerge.lookahead_on`, a estratégia conhecerá a máxima ou o fechamento do dia antes que o dia termine.
3. **Assunção Irreal de Preenchimento de Ordens Limitadas**:
   - Uma ordem limitada só é executada se o preço real de mercado negociar **além** do preço da ordem, e não apenas encostar nele.

---

## 3. Script Completo: Dashboard HUD de Métricas Quantitativas da Estratégia

```pinescript
//@version=5
strategy("Estratégia com HUD de Métricas Quantitativas", overlay=true, initial_capital=100000)

// Lógica de Entrada Básica (EMA Crossover)
emaFast = ta.ema(close, 14)
emaSlow = ta.ema(close, 28)

if ta.crossover(emaFast, emaSlow)
    strategy.entry("Long", strategy.long)
if ta.crossunder(emaFast, emaSlow)
    strategy.close("Long")

// CÁLCULO DE MÉTRICAS ANALÍTICAS
totalTrades = strategy.closedtrades
winTrades   = strategy.wintrades
winRate     = totalTrades > 0 ? (float(winTrades) / float(totalTrades) * 100.0) : 0.0
profitFactor = strategy.grossloss != 0 ? math.abs(strategy.grossprofit / strategy.grossloss) : 0.0

// TABELA HUD DE PERFORMANCE NA ÚLTIMA BARRA
var table perfHUD = table.new(position.bottom_right, 2, 6, bgcolor=color.rgb(20, 25, 35), border_color=color.gray, border_width=1)

if barstate.islast
    table.cell(perfHUD, 0, 0, "Métrica do Testador", bgcolor=color.navy, text_color=color.white)
    table.cell(perfHUD, 1, 0, "Resultado", bgcolor=color.navy, text_color=color.white)
    
    table.cell(perfHUD, 0, 1, "Lucro Líquido ($)", text_color=color.white)
    table.cell(perfHUD, 1, 1, str.tostring(strategy.netprofit, "$#.##"), text_color=strategy.netprofit >= 0 ? color.green : color.red)
    
    table.cell(perfHUD, 0, 2, "Total de Operações", text_color=color.white)
    table.cell(perfHUD, 1, 2, str.tostring(totalTrades), text_color=color.white)
    
    table.cell(perfHUD, 0, 3, "Taxa de Acerto (Win Rate)", text_color=color.white)
    table.cell(perfHUD, 1, 3, str.tostring(winRate, "#.#") + "%", text_color=winRate >= 50 ? color.green : color.orange)
    
    table.cell(perfHUD, 0, 4, "Fator de Lucro (Profit Factor)", text_color=color.white)
    table.cell(perfHUD, 1, 4, str.tostring(profitFactor, "#.##"), text_color=profitFactor >= 1.5 ? color.green : color.yellow)
    
    table.cell(perfHUD, 0, 5, "Patrimônio Atual ($)", text_color=color.white)
    table.cell(perfHUD, 1, 5, str.tostring(strategy.equity, "$#.##"), text_color=color.white)

plot(emaFast, color=color.green)
plot(emaSlow, color=color.red)
```
