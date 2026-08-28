---
title: "Multi-Timeframe e request.security() — Pine Script v5 / v6"
description: "Acesso a dados de outros tempos gráficos e ativos sem repainting: uso de request.security(), lookahead, gaps e request.security_lower_tf()."
category: "Entradas, Alertas e Dados Externos"
version: "Pine Script v5 / v6"
tags:
  - mtf
  - multi-timeframe
  - request-security
  - repainting-prevention
  - lookahead
  - lower-tf
---

# Multi-Timeframe e `request.security()` no Pine Script

O namespace `request.*` permite importar séries de dados de tempos gráficos superiores (HTF - Higher Timeframe), tempos gráficos inferiores (LTF - Lower Timeframe), ativos diferentes (pares correlacionados ou índices) e dados fundamentais/econômicos.

---

## 1. A Função `request.security()` e seus Parâmetros

### Assinatura:
```pinescript
request.security(symbol, timeframe, expression, gaps, lookahead, ignore_invalid_symbol, currency)
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `symbol` | `simple string` | Ticker do ativo desejado (ex: `syminfo.tickerid`, `"BINANCE:BTCUSDT"`). |
| `timeframe` | `simple string` | Resolução temporal (ex: `"60"`, `"240"`, `"D"`, `"W"`, `timeframe.period`). |
| `expression` | Qualquer tipo | Expressão ou tupla calculada no contexto do outro timeframe (ex: `close`, `ta.ema(close, 50)`). |
| `gaps` | `barmerge_gaps` | `barmerge.gaps_off` (repete o último valor conhecido) ou `barmerge.gaps_on` (retorna `na` onde não há nova barra). |
| `lookahead` | `barmerge_lookahead` | `barmerge.lookahead_off` (Padrão e seguro) ou `barmerge.lookahead_on` (Cuidado: risco de repainting no histórico). |

---

## 2. A Regra de Ouro Anti-Repainting em Multi-Timeframe

> **Atenção Máxima (Risco Crítico de Repainting)**:
> Quando você solicita dados de um tempo gráfico superior (ex: Diário em um gráfico de 15 minutos), a barra diária ainda está em formação durante todo o dia. Se o script acessar o fechamento do dia atual no histórico, ele estará usando dados que o trader **não conhecia às 10h da manhã**, criando um backtest falso milagroso que falha no mercado real.

### Padrão Não-Repainting Homologado (Official Safe Pattern):
Para garantir que o cálculo utilize **apenas a barra superior já totalmente fechada e confirmada**, acesse a expressão deslocada em `[1]` com `lookahead=barmerge.lookahead_off`:

```pinescript
// PADRÃO 100% SEGURO E NÃO-REPAINTING:
htfEmaSegura = request.security(
     syminfo.tickerid, "D",
     ta.ema(close, 50)[1], // Acessa o valor no fechamento do dia anterior
     barmerge.gaps_off,
     barmerge.lookahead_off
  )
```

---

## 3. Tempos Gráficos Inferiores com `request.security_lower_tf()`

Para analisar barras microscópicas dentro da barra atual (ex: obter todas as barras de 1 minuto que ocorreram dentro da barra de 15 minutos), usa-se `request.security_lower_tf()`, que retorna um **Array** de valores para cada barra atual.

```pinescript
//@version=5
indicator("Exemplo Lower Timeframe", overlay=false)

// Retorna um array com os fechamentos de 1 minuto dentro da barra atual
float[] ltfCloses = request.security_lower_tf(syminfo.tickerid, "1", close)
int ticksCount = array.size(ltfCloses)

plot(ticksCount, title="Contagem de Barras LTF de 1m", color=color.blue)
```

---

## 4. Script Completo: Indicador de Tendência Tripla MTF Não-Repainting

```pinescript
//@version=5
indicator("Painel de Tendência Tripla MTF (Não-Repainting)", overlay=true)

// 1. INPUTS DE TEMPOS GRÁFICOS SUPERIORES
tfMedium = input.timeframe(defval="60", title="Tempo Gráfico Médio (ex: 1h)")
tfHigh   = input.timeframe(defval="D",  title="Tempo Gráfico Alto (ex: Diário)")
maPeriod = input.int(50, title="Período da EMA Base")

// 2. CÁLCULO LOCAL (TIMEFRAME ATUAL DO GRÁFICO)
localEma = ta.ema(close, maPeriod)
localTrendBull = close > localEma

// 3. REQUISIÇÕES MTF NÃO-REPAINTING (USANDO EXPRESSÃO[1] E LOOKAHEAD_OFF)
mediumEma = request.security(syminfo.tickerid, tfMedium, ta.ema(close, maPeriod)[1], barmerge.gaps_off, barmerge.lookahead_off)
mediumTrendBull = close > mediumEma

highEma = request.security(syminfo.tickerid, tfHigh, ta.ema(close, maPeriod)[1], barmerge.gaps_off, barmerge.lookahead_off)
highTrendBull = close > highEma

// Confluência Total de Alta e Baixa
allBullish = localTrendBull and mediumTrendBull and highTrendBull
allBearish = not localTrendBull and not mediumTrendBull and not highTrendBull

// 4. PLOTAGEM DAS MÉDIAS MTF NO GRÁFICO
plot(localEma,  title="EMA Atual", color=color.yellow, linewidth=1)
plot(mediumEma, title="EMA MTF Médio (1h)", color=color.blue, linewidth=2)
plot(highEma,   title="EMA MTF Alto (Diário)", color=color.purple, linewidth=3)

// 5. PAINEL DE CONFLUÊNCIA MTF (TABLE)
var table mtfHUD = table.new(position.top_right, 2, 4, bgcolor=color.black, border_width=1)

if barstate.islast
    table.cell(mtfHUD, 0, 0, "Timeframe", text_color=color.white, bgcolor=color.navy)
    table.cell(mtfHUD, 1, 0, "Alinhamento", text_color=color.white, bgcolor=color.navy)
    
    table.cell(mtfHUD, 0, 1, "Atual (" + timeframe.period + ")", text_color=color.white)
    table.cell(mtfHUD, 1, 1, localTrendBull ? "BULL" : "BEAR", text_color=localTrendBull ? color.green : color.red)
    
    table.cell(mtfHUD, 0, 2, "Médio (" + tfMedium + ")", text_color=color.white)
    table.cell(mtfHUD, 1, 2, mediumTrendBull ? "BULL" : "BEAR", text_color=mediumTrendBull ? color.green : color.red)
    
    table.cell(mtfHUD, 0, 3, "Alto (" + tfHigh + ")", text_color=color.white)
    table.cell(mtfHUD, 1, 3, highTrendBull ? "BULL" : "BEAR", text_color=highTrendBull ? color.green : color.red)

bgcolor(allBullish ? color.new(color.green, 92) : allBearish ? color.new(color.red, 92) : na, title="Confluência Total")
```
