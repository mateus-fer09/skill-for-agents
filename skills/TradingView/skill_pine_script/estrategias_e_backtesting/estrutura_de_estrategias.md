---
title: "Estrutura de Estratégias e Parâmetros de Backtesting — Pine Script v5 / v6"
description: "Configuração do motor quantitativo strategy(): dimensionamento de posições, capital inicial, modelos de comissão, slippage, piramidação e ciclo de cálculo."
category: "Estratégias e Backtesting"
version: "Pine Script v5 / v6"
tags:
  - strategy
  - backtesting
  - commission
  - slippage
  - pyramiding
  - risk-management
---

# Estrutura de Estratégias e Parâmetros de Backtesting no Pine Script

A declaração `strategy()` inicializa o motor de simulação de trading algorítmico do TradingView, habilitando o Painel de Testador de Estratégias (Strategy Tester), métricas de desempenho institucional, relatórios de trades individuais e visualização de curva de capital (equity curve).

---

## 1. Parâmetros Fundamentais da Declaração `strategy()`

| Parâmetro | Tipo | Padrão | Descrição |
|---|---|---|---|
| `title` | `const string` | Obrigatório | Nome completo da estratégia. |
| `overlay` | `const bool` | `false` | Se `true`, plota ordens e indicadores no painel de preços. |
| `initial_capital` | `const float` | `10000.0` | Saldo da conta no início do período de teste. |
| `currency` | `const string` | `currency.NONE` | Moeda da conta (`currency.USD`, `currency.EUR`, `currency.BRL`, etc.). |
| `default_qty_type` | `const string` | `strategy.fixed` | Método de dimensionamento de ordens (`strategy.fixed`, `strategy.cash_per_order`, `strategy.percent_of_equity`). |
| `default_qty_value` | `const float` | `1.0` | Valor base do dimensionamento. Se for percentual, `10.0` significa 10% do capital atual. |
| `commission_type` | `const string` | `strategy.commission.percent` | Tipo de taxa (`strategy.commission.percent`, `strategy.commission.cash_per_order`, `strategy.commission.cash_per_contract`). |
| `commission_value` | `const float` | `0.0` | Valor da taxa cobrada em cada execução de ordem (ex: `0.075` para 0.075% de taxa de corretagem). |
| `slippage` | `const int` | `0` | Deslizamento de preço em número de ticks/pontos para simular execução em mercado volátil. |
| `pyramiding` | `const int` | `0` | Número máximo de entradas adicionais permitidas na mesma direção antes do fechamento total. |
| `calc_on_order_fills` | `const bool` | `false` | Se `true`, recalcula o script imediatamente após a execução de uma ordem no meio da barra. |
| `calc_on_every_tick` | `const bool` | `false` | Se `true`, reexecuta a estratégia a cada novo tick na barra em tempo real. |
| `process_orders_on_close` | `const bool` | `false` | Se `true`, executa ordens a mercado no exato preço de fechamento da barra atual em vez da abertura da próxima barra. |

---

## 2. Propriedades de Posição da Conta (`strategy.*`)

Durante a execução da estratégia, o script tem acesso em tempo real ao estado da conta e das posições abertas:

| Propriedade | Tipo | Descrição |
|---|---|---|
| `strategy.position_size` | `series float` | Quantidade de contratos/ações abertas. Valor positivo = Long; Valor negativo = Short; `0` = Fora do mercado (Flat). |
| `strategy.position_avg_price` | `series float` | Preço médio de entrada da posição atual aberta. |
| `strategy.equity` | `series float` | Patrimônio líquido total da conta (Capital inicial + Lucro fechado + Lucro aberto). |
| `strategy.openprofit` | `series float` | Lucro/prejuízo não realizado (flutuante) da posição aberta atual. |
| `strategy.netprofit` | `series float` | Lucro líquido total realizado de todas as operações fechadas. |

---

## 3. Script Completo: Estratégia Base Profissional com Gestão de Capital e Custos

```pinescript
//@version=5
strategy(
     title="Estratégia Quantitativa Profissional — Base Template",
     shorttitle="EQP",
     overlay=true,
     initial_capital=50000.0,
     default_qty_type=strategy.percent_of_equity,
     default_qty_value=15.0,
     commission_type=strategy.commission.percent,
     commission_value=0.04,
     slippage=2,
     pyramiding=1,
     process_orders_on_close=true
  )

// 1. INPUTS DE GESTÃO E FILTRO
maFastLen = input.int(20, title="Período Média Rápida")
maSlowLen = input.int(50, title="Período Média Lenta")
filterRsi = input.int(50, title="Limiar RSI de Filtro")

// 2. INDICADORES DA ESTRATÉGIA
fastEma = ta.ema(close, maFastLen)
slowEma = ta.ema(close, maSlowLen)
rsiVal  = ta.rsi(close, 14)

// 3. REGRAS DE ENTRADA
longCondition  = ta.crossover(fastEma, slowEma) and (rsiVal > filterRsi)
shortCondition = ta.crossunder(fastEma, slowEma) and (rsiVal < filterRsi)

// 4. EXECUÇÃO DE ORDENS
if longCondition
    strategy.entry("Long_Trade", strategy.long, comment="Entrada Long")

if shortCondition
    strategy.entry("Short_Trade", strategy.short, comment="Entrada Short")

// 5. PLOTS
plot(fastEma, title="EMA Rápida", color=color.green, linewidth=2)
plot(slowEma, title="EMA Lenta", color=color.red, linewidth=2)
```
