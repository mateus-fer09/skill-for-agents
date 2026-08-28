---
title: "Time Series e o Operador Histórico [] — Pine Script v5 / v6"
description: "Estrutura fundamental de séries temporais, operador de indexação histórica [], buffer de memória max_bars_back e tratamento seguro de valores na, nz() e fixnan()."
category: "Modelo de Execução e Séries"
version: "Pine Script v5 / v6"
tags:
  - time-series
  - history-referencing
  - square-brackets
  - max-bars-back
  - na
  - nz
  - fixnan
---

# Time Series e o Operador Histórico `[]`

Em Pine Script, praticamente todas as variáveis primárias (`close`, `open`, `high`, `low`, `volume`, `time`) e variáveis derivadas são **Time Series** (séries temporais). Uma série temporal armazena não apenas o valor atual, mas toda a sequência de valores calculados para cada barra no passado.

---

## 1. O Operador Histórico `[]`

Para acessar o valor de uma variável em barras anteriores, utiliza-se o operador de colchetes `[offset]`, onde `offset` representa o número de barras para trás em relação à barra atual.

| Sintaxe | Significado | Exemplo |
|---|---|---|
| `variable` ou `variable[0]` | Valor da variável na barra atual em processamento | `close` ou `close[0]` |
| `variable[1]` | Valor da variável exatamente 1 barra atrás (barra anterior) | `close[1]` |
| `variable[2]` | Valor da variável 2 barras atrás | `high[2]` |
| `variable[n]` | Valor da variável `n` barras atrás | `ta.sma(close, 20)[5]` |

### Regras Vitais do Operador `[]`:
1. `offset` deve ser sempre um número inteiro maior ou igual a 0. Não é possível indexar para o futuro com números negativos (`close[-1]` é proibido).
2. O operador `[]` pode ser aplicado a variáveis simples, resultados de expressões, UDTs e séries de qualquer tipo primitivo (`float`, `int`, `bool`, `color`, etc.).

```pinescript
//@version=5
indicator("Operador Histórico e Séries", overlay=true)

// Acessando preços passados
fechamentoAnterior = close[1]
maximaDeDuasBarras = high[2]

// Verificando padrão de 3 velas consecutivas de alta
tresVelasDeAlta = (close > open) and (close[1] > open[1]) and (close[2] > open[2])

// Calculando a variação percentual de 1 período
retorno1Barra = (close - close[1]) / close[1] * 100

// Plotando sinais
plotshape(tresVelasDeAlta, title="3 Velas de Alta", location=location.belowbar, color=color.green, style=shape.arrowup, text="3 Alta")
```

---

## 2. Tratamento de Valores Nulos (`na`), `nz()` e `fixnan()`

No início do gráfico (nas primeiras barras), quando o histórico solicitado ultrapassa a quantidade de barras existentes, o Pine Script retorna o valor especial `na` (Not Available / Nulo).

### Funções Built-in de Proteção Contra `na`:

| Função | Assinatura | Comportamento |
|---|---|---|
| `na(x)` | `na(series) -> bool` | Retorna `true` se `x` for `na`; caso contrário retorna `false`. |
| `nz(x, y)` | `nz(series, replacement=0.0) -> series` | Se `x` for `na`, substitui por `y` (por padrão, substitui por `0.0`). |
| `fixnan(x)`| `fixnan(series) -> series` | Se `x` for `na`, substitui pelo valor válido **mais recente não-nulo** da série. |

```pinescript
//@version=5
indicator("Exemplo de Tratamento Seguro de NA", overlay=false)

// Exemplo com nz(): Evita NaN em cálculos cumulativos
var float volumeTotal = 0.0
volumeValido = nz(volume, 0.0)
volumeTotal := volumeTotal + volumeValido

// Exemplo com na(): Verificação condicional
var float precoInicial = na
if na(precoInicial) and (bar_index >= 10)
    precoInicial := close

// Exemplo com fixnan(): Mantém o último pivô de alta encontrado
pivotHigh = ta.pivothigh(high, 5, 5) // Retorna na na maioria das barras
pivotContinuo = fixnan(pivotHigh)     // Substitui os na pelo último pivô real

plot(volumeTotal, title="Volume Acumulado Seguro", color=color.blue)
plot(pivotContinuo, title="Pivô Contínuo (fixnan)", color=color.purple, linewidth=2)
```

---

## 3. Mecanismo de Buffer e o Parâmetro `max_bars_back`

Para otimizar o uso de memória, o compilador do Pine Script calcula automaticamente a profundidade necessária do buffer histórico para cada série. No entanto, quando o acesso histórico ocorre dentro de estruturas dinâmicas ou condicionais complexas, o compilador pode não prever o tamanho necessário, gerando o erro de execução:
`Runtime error: The script requested historical values going back further than the buffer size allowed`.

### Como Corrigir com `max_bars_back`:

1. **Na declaração do script**:
```pinescript
indicator("Meu Script", overlay=true, max_bars_back=500)
```
2. **Em uma variável específica** via função `max_bars_back()`:
```pinescript
max_bars_back(close, 500)
```

---

## 4. Script Completo: Detector de Divergências com Indexação Histórica Segura

```pinescript
//@version=5
indicator("Detector de Divergência Bullish — Time Series Engine", overlay=true, max_bars_back=300)

// 1. INPUTS
rsiLen      = input.int(14, title="Período RSI")
pivotPeriod = input.int(5, title="Força do Pivô (Barras Esquerda/Direita)")

// 2. CÁLCULO DAS SÉRIES
rsiVal = ta.rsi(close, rsiLen)

// Detecção de Pivôs de Baixa no Preço e no RSI
pricePivotLow = ta.pivotlow(low, pivotPeriod, pivotPeriod)
rsiPivotLow   = ta.pivotlow(rsiVal, pivotPeriod, pivotPeriod)

// 3. IDENTIFICAÇÃO DE DIVERGÊNCIA REGULAR DE ALTA (Preço faz fundo mais baixo, RSI faz fundo mais alto)
var float lastPriceLow = na
var float prevPriceLow = na
var float lastRsiLow   = na
var float prevRsiLow   = na

isNewPivot = not na(pricePivotLow)

if isNewPivot
    // Desloca o histórico dos pivôs
    prevPriceLow := lastPriceLow
    lastPriceLow := low[pivotPeriod]
    
    prevRsiLow   := lastRsiLow
    lastRsiLow   := rsiVal[pivotPeriod]

// Condição de Divergência Bullish
bullishDivergence = isNewPivot and 
     (not na(prevPriceLow)) and 
     (lastPriceLow < prevPriceLow) and 
     (lastRsiLow > prevRsiLow)

// Plotagem no gráfico
plotshape(bullishDivergence, title="Divergência Bullish", style=shape.labelup, location=location.belowbar, color=color.green, text="DIV ALTA", textcolor=color.white, offset=-pivotPeriod)

// Linha conectora de pivô
plot(fixnan(pricePivotLow), title="Linha de Suporte de Pivô", color=color.new(color.gray, 50), style=plot.style_linebr, offset=-pivotPeriod)
```
