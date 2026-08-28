---
title: "Funções Definidas pelo Usuário (UDF) — Pine Script v5 / v6"
description: "Criação de funções personalizadas (UDF) de linha única e múltiplas linhas, tipagem de parâmetros, valores padrão, múltiplos retornos em tupla e regras de escopo."
category: "Sistema de Tipos e Sintaxe"
version: "Pine Script v5 / v6"
tags:
  - functions
  - udf
  - tuples
  - multiple-returns
  - scope
  - recursion
---

# Funções Definidas pelo Usuário (UDF) no Pine Script

As funções definidas pelo usuário (User-Defined Functions ou UDFs) permitem modularizar a lógica do script, eliminar duplicação de código e criar bibliotecas reutilizáveis.

---

## 1. Funções de Linha Única vs Múltiplas Linhas

### A. Função de Linha Única
Definida na mesma linha com o operador `=>`.

```pinescript
// Assinatura: nome(param1, param2) => expressao
calcPercentChange(float src, int length) => (src - src[length]) / src[length] * 100
```

### B. Função de Múltiplas Linhas
O corpo da função é identado com 4 espaços. A última linha da função ou a última expressão avaliada determina o **valor de retorno**.

```pinescript
calcBollingerBands(float src, int length, float mult) =>
    basis = ta.sma(src, length)
    dev   = mult * ta.stdev(src, length)
    upper = basis + dev
    lower = basis - dev
    [basis, upper, lower] // Retorno de tupla com 3 valores
```

---

## 2. Tipagem Estrita de Parâmetros e Valores Padrão

No Pine Script v5 e v6, é altamente recomendado declarar explicitamente os tipos de dados e qualificadores dos parâmetros para evitar erros de compilação em chamadas futuras.

```pinescript
//@version=5
indicator("UDF com Tipagem e Valores Padrão", overlay=true)

// Função com parâmetros tipados e valores padrão
customMa(series float src = close, simple int len = 20, simple string maType = "EMA") =>
    result = switch maType
        "EMA" => ta.ema(src, len)
        "SMA" => ta.sma(src, len)
        "WMA" => ta.wma(src, len)
        => ta.sma(src, len)
    result

// Chamadas válidas da função
ma1 = customMa()                          // Usa todos os padrões (close, 20, "EMA")
ma2 = customMa(high, 50, "SMA")           // Passa argumentos posicionais
ma3 = customMa(src=low, maType="WMA")     // Passa argumentos nomeados (len usa padrão 20)

plot(ma1, color=color.blue)
plot(ma2, color=color.orange)
plot(ma3, color=color.green)
```

---

## 3. Retornos Múltiplos com Tuplas

Uma UDF pode retornar múltiplos valores empacotados em colchetes `[val1, val2, val3]`. Na chamada, os valores são desempacotados em variáveis correspondentes.

```pinescript
//@version=5
indicator("UDF com Desempacotamento de Tuplas", overlay=true)

// Função que calcula pivôs e distâncias
calcPivotMetrics(int leftBars, int rightBars) =>
    pH = ta.pivothigh(high, leftBars, rightBars)
    pL = ta.pivotlow(low, leftBars, rightBars)
    isNewHigh = not na(pH)
    isNewLow  = not na(pL)
    [pH, pL, isNewHigh, isNewLow]

// Desempacotamento da tupla
[pivotH, pivotL, hasHigh, hasLow] = calcPivotMetrics(5, 5)

plotshape(hasHigh, title="Pivô Alta", style=shape.triangleup, location=location.abovebar, color=color.green, offset=-5)
plotshape(hasLow,  title="Pivô Baixa", style=shape.triangledown, location=location.belowbar, color=color.red, offset=-5)
```

---

## 4. Restrições e Armadilhas em UDFs

1. **Chamadas Condicionais de Funções Técnicas com Histórico**:
   - Se uma UDF chamar funções que dependem do histórico das barras (como `ta.sma`, `ta.rsi`, `ta.ema`), essa UDF **deve ser executada em todas as barras** para que o buffer interno seja mantido atualizado. Chamar uma UDF contendo `ta.sma()` dentro de um bloco `if` condicional fará com que o cálculo da média produza resultados inconsistentes.
2. **Recursão e Limite de Pilha**:
   - Funções recursivas são permitidas em Pine Script, mas a profundidade máxima de recursão é de até **500 chamadas**. Ultrapassar esse limite gera erro de runtime.
