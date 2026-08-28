---
title: "Sistema de Alertas e Mensagens Dinâmicas — Pine Script v5 / v6"
description: "Criação de alertas profissionais: alert() dinâmico vs alertcondition(), placeholders dinâmicos ({{ticker}}, {{close}}), frequências e formatação JSON para Webhooks."
category: "Entradas, Alertas e Dados Externos"
version: "Pine Script v5 / v6"
tags:
  - alerts
  - webhooks
  - json
  - placeholders
  - alertcondition
  - automated-trading
---

# Sistema de Alertas e Mensagens Dinâmicas no Pine Script

O Pine Script possui um sistema avançado de alertas que permite notificar traders por som, pop-up, e-mail, push no celular ou enviar mensagens **JSON via Webhook** para execução automática em corretoras e plataformas de trading algorítmico (ex: 3Commas, TradingView Alerts API, servidores próprios).

---

## 1. `alert()` Dinâmico vs `alertcondition()` Estático

| Característica | `alert()` (Moderno / Recomendado) | `alertcondition()` (Legado) |
|---|---|---|
| **Disponível em** | Indicadores e Estratégias | Apenas em Indicadores |
| **Mensagem Dinâmica** | Sim (suporta concatenação de strings `+` e formatações em tempo de execução) | Apenas strings estáticas ou placeholders pré-definidos (`{{close}}`) |
| **Local de Execução** | Pode ser chamado dentro de blocos `if` arbitrários | Deve estar no escopo global |
| **Frequências de Disparo** | Configuradas via código (`alert.freq_*`) | Configuradas manualmente pelo usuário no diálogo de criação de alertas |

### Frequências de Disparo da Função `alert()`:
- `alert.freq_once_per_bar`: Dispara no máximo **uma vez por barra** (no primeiro tick que atingir a condição).
- `alert.freq_once_per_bar_close`: Dispara **apenas no fechamento definitivo da barra** (garante sinal não-repainting).
- `alert.freq_all`: Dispara a **cada tick** que a condição for verdadeira.

---

## 2. Placeholders Dinâmicos em Mensagens de Alerta

Ao usar `alertcondition()` ou criar alertas manuais na interface, você pode utilizar os seguintes placeholders especiais:

| Placeholder | Descrição |
|---|---|
| `{{ticker}}` | Ticker do ativo atual (ex: `BTCUSDT`, `PETR4`). |
| `{{exchange}}` | Bolsa onde o ativo é negociado (ex: `BINANCE`, `BMFBOVESPA`, `NASDAQ`). |
| `{{close}}`, `{{open}}`, `{{high}}`, `{{low}}`, `{{volume}}` | Preços OHLCV da barra de disparo. |
| `{{time}}` | Timestamp UTC do momento do disparo. |
| `{{interval}}` | Tempo gráfico do gráfico (ex: `60`, `D`, `240`). |
| `{{plot_0}}`, `{{plot_1}}` | Valor das plotagens sequenciais do script. |

---

## 3. Construção de Payloads JSON para Webhooks

Para disparar ordens em bots de automação (como Binance, Bybit ou plataformas institucionais), a mensagem do alerta deve ser formatada como um JSON rigorosamente válido.

```pinescript
buildWebhookJson(string action, float orderPrice, float stopLoss, float takeProfit) =>
    "{" + 
    ""secret": "MINHA_CHAVE_SECRETA_API"," +
    ""action": "" + action + ""," +
    ""symbol": "" + syminfo.ticker + ""," +
    ""price": " + str.tostring(orderPrice, "#.##") + "," +
    ""sl": " + str.tostring(stopLoss, "#.##") + "," +
    ""tp": " + str.tostring(takeProfit, "#.##") + "," +
    ""time": " + str.tostring(time) +
    "}"
```

---

## 4. Script Completo: Motor de Alertas Webhook Multi-Condição

```pinescript
//@version=5
indicator("Motor de Alertas e Webhooks JSON", overlay=true)

// 1. INPUTS
atrLen     = input.int(14, title="Período do ATR")
atrMultSL  = input.float(1.5, title="Multiplicador Stop Loss (ATR)")
atrMultTP  = input.float(3.0, title="Multiplicador Take Profit (ATR)")

// 2. CÁLCULO DE SINAIS E NÍVEIS
fastEma = ta.ema(close, 9)
slowEma = ta.ema(close, 21)
atrVal  = ta.atr(atrLen)

buySignal  = ta.crossover(fastEma, slowEma)
sellSignal = ta.crossunder(fastEma, slowEma)

// 3. CONSTRUTOR DE MENSAGEM JSON VIA STR.FORMAT
buildJsonPayload(string side, float entryPrc, float slPrc, float tpPrc) =>
    str.format(
         '{{"action":"{0}","symbol":"{1}","exchange":"{2}","entry":{3},"sl":{4},"tp":{5},"time":{6}}}',
         side, syminfo.ticker, syminfo.prefix,
         str.tostring(entryPrc, "#.##"),
         str.tostring(slPrc, "#.##"),
         str.tostring(tpPrc, "#.##"),
         str.tostring(timenow)
      )

// 4. DISPARO DE ALERTAS DINÂMICOS NO FECHAMENTO DA BARRA
if buySignal and barstate.isconfirmed
    sl = close - (atrVal * atrMultSL)
    tp = close + (atrVal * atrMultTP)
    jsonMsg = buildJsonPayload("BUY", close, sl, tp)
    alert(jsonMsg, alert.freq_once_per_bar_close)

if sellSignal and barstate.isconfirmed
    sl = close + (atrVal * atrMultSL)
    tp = close - (atrVal * atrMultTP)
    jsonMsg = buildJsonPayload("SELL", close, sl, tp)
    alert(jsonMsg, alert.freq_once_per_bar_close)

// 5. ALERTCONDITION PARA AVISOS CONVENCIONAIS NA INTERFACE
alertcondition(buySignal, title="Alerta UI: Compra", message="Sinal de Compra no ativo {{ticker}}! Preço: {{close}}")
alertcondition(sellSignal, title="Alerta UI: Venda", message="Sinal de Venda no ativo {{ticker}}! Preço: {{close}}")

plot(fastEma, title="EMA 9", color=color.green)
plot(slowEma, title="EMA 21", color=color.red)
```
