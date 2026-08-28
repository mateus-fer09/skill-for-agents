---
title: "Estruturas Condicionais: if, else if, else e switch — Pine Script v5 / v6"
description: "Uso avançado de estruturas condicionais no Pine Script: expressões if com retorno de valor, efeitos colaterais e comandos switch com e sem expressão."
category: "Sistema de Tipos e Sintaxe"
version: "Pine Script v5 / v6"
tags:
  - conditionals
  - if
  - else
  - switch
  - branching
---

# Estruturas Condicionais: `if`, `else if`, `else` e `switch`

O Pine Script fornece duas estruturas fundamentais para controle de fluxo condicional: o bloco `if` / `else if` / `else` e a expressão `switch`. No Pine Script, ambas podem ser usadas tanto para **efeitos colaterais** (executar comandos) quanto como **expressões que retornam valores**.

---

## 1. A Estrutura Condicional `if`

### Sintaxe Geral:
```pinescript
// Como expressão de atribuição
resultado = if condicao1
    valor1
else if condicao2
    valor2
else
    valorPadrao
```

### Regras do Bloco `if`:
1. A condição deve avaliar para um valor do tipo `bool` (`true` ou `false`).
2. Se o `if` for utilizado para atribuir um valor a uma variável, **todos os ramos devem retornar o mesmo tipo de dado**.
3. O bloco de código de cada ramo deve ser identado com 4 espaços.

```pinescript
//@version=5
indicator("Exemplo de Estrutura IF com Retorno", overlay=false)

rsiVal = ta.rsi(close, 14)

// IF atribuindo valor a uma variável
string estadoRsi = if rsiVal > 70
    "Sobrecomprado"
else if rsiVal < 30
    "Sobrevendido"
else
    "Neutro"

// IF para execução de efeitos colaterais
var int contagemAlertas = 0
if rsiVal > 70 or rsiVal < 30
    contagemAlertas += 1

plot(rsiVal, title="RSI", color=color.purple)
```

---

## 2. A Estrutura Condicional `switch`

O Pine Script v5 e v6 oferece a poderosa estrutura `switch`, que elimina a necessidade de longas cadeias aninhadas de `if/else`.

### Forma 1: `switch` com Expressão de Controle (Value Matching)
Compara o valor de uma expressão com diferentes casos constantes ou variáveis.

```pinescript
switch modoCalculo
    "EMA"  => ta.ema(close, 20)
    "SMA"  => ta.sma(close, 20)
    "WMA"  => ta.wma(close, 20)
    "RMA"  => ta.rma(close, 20)
    => ta.sma(close, 20) // Caso padrão (default)
```

### Forma 2: `switch` sem Expressão (Condition Ladder / Predicate Matching)
Avalia sequencialmente uma série de condições booleanas até encontrar a primeira verdadeira.

```pinescript
color candleColor = switch
    close > open and volume > ta.sma(volume, 20) => color.green
    close > open                                 => color.lime
    close < open and volume > ta.sma(volume, 20) => color.red
    => color.gray // Default
```

---

## 3. Script Completo: Seletor de Médias Móveis com `switch` e Enums

```pinescript
//@version=5
indicator("Seletor Dinâmico de Médias — Switch Engine", overlay=true)

// 1. INPUTS COM OPÇÕES
maType = input.string(defval="EMA", title="Tipo de Média Móvel", options=["SMA", "EMA", "WMA", "HMA", "RMA", "VWMA"])
maLen  = input.int(20, title="Período da Média", minval=1)
src    = input.source(close, title="Fonte")

// 2. CÁLCULO MODULAR VIA SWITCH COM RETORNO
float selectedMa = switch maType
    "SMA"  => ta.sma(src, maLen)
    "EMA"  => ta.ema(src, maLen)
    "WMA"  => ta.wma(src, maLen)
    "HMA"  => ta.hma(src, maLen)
    "RMA"  => ta.rma(src, maLen)
    "VWMA" => ta.vwma(src, maLen)
    => ta.sma(src, maLen) // Default de segurança

// 3. COLORIZAÇÃO VIA SWITCH SEM EXPRESSÃO
color maColor = switch
    selectedMa > selectedMa[1] and close > selectedMa => color.green
    selectedMa < selectedMa[1] and close < selectedMa => color.red
    => color.orange

// 4. PLOTS
plot(selectedMa, title="Média Selecionada", color=maColor, linewidth=3)
```
