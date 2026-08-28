---
title: "Ordens e Posições: entry(), exit(), order() e close() — Pine Script v5 / v6"
description: "Guia exaustivo de execução de ordens quantitativas: strategy.entry(), strategy.exit() com stop loss, take profit e trailing stop dinâmico, cancelamento de ordens e grupos OCA."
category: "Estratégias e Backtesting"
version: "Pine Script v5 / v6"
tags:
  - strategy-entry
  - strategy-exit
  - stop-loss
  - take-profit
  - trailing-stop
  - oca-groups
---

# Ordens e Posições no Pine Script

O Pine Script fornece uma API completa para gerenciamento do ciclo de vida de ordens de negociação, saídas parciais, proteção de capital e trailing stops automatizados.

---

## 1. Funções de Entrada e Saída

### A. `strategy.entry()`
Abre ou reverte uma posição na direção especificada.

```pinescript
strategy.entry(id, direction, qty, limit, stop, oca_name, oca_type, comment)
```
- `direction`: `strategy.long` (compra) ou `strategy.short` (venda a descoberto).
- `limit`: Preço limite para ordens pendentes limitadas.
- `stop`: Preço de stop para ordens pendentes de rompimento (stop order).

### B. `strategy.exit()`
Associa ordens de saída de proteção (**Stop Loss**, **Take Profit** e **Trailing Stop**) a uma entrada aberta específica (`from_entry`).

```pinescript
strategy.exit(id, from_entry, qty, qty_percent, profit, limit, loss, stop, trail_points, trail_offset, oca_name, comment)
```

| Parâmetro de Saída | Unidade de Medida | Descrição |
|---|---|---|
| `profit` | Ticks / Pontos de Preço | Distância de Take Profit a partir do preço de entrada. |
| `limit` | Nível Absoluto de Preço | Preço exato do Take Profit no gráfico. |
| `loss` | Ticks / Pontos de Preço | Distância de Stop Loss a partir do preço de entrada. |
| `stop` | Nível Absoluto de Preço | Preço exato do Stop Loss no gráfico. |
| `trail_points` | Ticks / Pontos de Preço | Distância que o preço precisa andar a favor para **ativar o Trailing Stop**. |
| `trail_offset` | Ticks / Pontos de Preço | Distância de recuo permitida antes do acionamento do Trailing Stop. |
| `qty_percent` | Porcentagem (0-100) | Permite realizar saídas parciais (ex: fechar 50% no primeiro alvo). |

### C. `strategy.close()` e `strategy.close_all()`
Fecha imediatamente a mercado uma posição específica ou todas as posições da conta.

```pinescript
strategy.close("Long_Trade", comment="Saída de Emergência")
strategy.close_all(comment="Encerramento do Pregão")
```

---

## 2. Script Completo: Sistema de Negociação com Alvos Parciais e Trailing Stop

```pinescript
//@version=5
strategy("Sistema de Ordens com Alvos Parciais e Trailing Stop", overlay=true, initial_capital=100000, default_qty_type=strategy.percent_of_equity, default_qty_value=20)

// 1. INPUTS
atrLen      = input.int(14, title="Período do ATR")
slAtrMult   = input.float(1.5, title="Multiplicador Stop Loss (ATR)")
tp1AtrMult  = input.float(2.0, title="Multiplicador Alvo 1 (ATR)")
tp2AtrMult  = input.float(4.0, title="Multiplicador Alvo 2 (ATR)")

// 2. INDICADORES
fastEma = ta.ema(close, 10)
slowEma = ta.ema(close, 30)
atrVal  = ta.atr(atrLen)

buySignal  = ta.crossover(fastEma, slowEma)
sellSignal = ta.crossunder(fastEma, slowEma)

// 3. EXECUÇÃO LONG COM ALVOS PARCIAIS
if buySignal and strategy.position_size == 0
    strategy.entry("Long_Main", strategy.long, comment="Entrada Long")
    
    // Níveis calculados no momento do disparo
    float stopPrice = close - (atrVal * slAtrMult)
    float target1   = close + (atrVal * tp1AtrMult)
    float target2   = close + (atrVal * tp2AtrMult)
    
    // Saída Parcial 1: Fecha 50% da posição no Alvo 1
    strategy.exit("TP1_SL", from_entry="Long_Main", qty_percent=50, limit=target1, stop=stopPrice, comment="Alvo Parcial 1")
    
    // Saída Parcial 2: Fecha os 50% restantes no Alvo 2 ou no Trailing Stop
    strategy.exit("TP2_Trailing", from_entry="Long_Main", qty_percent=100, limit=target2, stop=stopPrice, trail_points=atrVal * 1.5 / syminfo.mintick, trail_offset=atrVal * 0.8 / syminfo.mintick, comment="Alvo Final / Trailing")

plot(fastEma, color=color.green)
plot(slowEma, color=color.red)
```
