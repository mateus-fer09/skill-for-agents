---
title: "Operadores Aritméticos, Relacionais e Lógicos — Pine Script v5 / v6"
description: "Tabela exaustiva de operadores matemáticos, lógicos, comparativos, precedência de operadores e o operador ternário condicional ? :."
category: "Sistema de Tipos e Sintaxe"
version: "Pine Script v5 / v6"
tags:
  - operators
  - arithmetic
  - logic
  - ternary
  - precedence
  - comparison
---

# Operadores Aritméticos, Relacionais e Lógicos no Pine Script

O Pine Script fornece um conjunto completo de operadores para manipulação de expressões matemáticas, comparações lógicas e seleção condicional ternária.

---

## 1. Tabela Completa de Operadores

### A. Operadores Aritméticos
| Operador | Nome | Exemplo | Descrição |
|---|---|---|---|
| `+` | Adição | `a + b` | Soma valores numéricos ou concatena strings (`"Preço: " + str.tostring(close)`). |
| `-` | Subtração / Negação | `a - b`, `-high` | Subtrai valores ou inverte o sinal aritmético. |
| `*` | Multiplicação | `a * b` | Multiplica dois operandos numéricos. |
| `/` | Divisão | `a / b` | Divide dois operandos. Se `b == 0`, retorna `na` (sem falha crítica). |
| `%` | Módulo (Resto da Divisão) | `a % b` | Retorna o resto da divisão inteira entre `a` e `b`. |

### B. Operadores Relacionais (Comparação)
| Operador | Significado | Exemplo | Retorno |
|---|---|---|:---:|
| `==` | Igual a | `close == open` | `bool` |
| `!=` | Diferente de | `close != open` | `bool` |
| `<` | Menor que | `close < open` | `bool` |
| `<=` | Menor ou igual a | `low <= lowerBand` | `bool` |
| `>` | Maior que | `close > open` | `bool` |
| `>=` | Maior ou igual a | `high >= upperBand` | `bool` |

### C. Operadores Lógicos
| Operador | Descrição | Exemplo | Tabela Verdade |
|---|---|---|---|
| `and` | E lógico | `cond1 and cond2` | Retorna `true` apenas se ambos forem `true`. Se qualquer um for `false`, retorna `false`. Se um for `na`, propaga `na`. |
| `or` | OU lógico | `cond1 or cond2` | Retorna `true` se ao menos um for `true`. |
| `not` | NÃO lógico (Inversão) | `not cond1` | Inverte `true` para `false` e `false` para `true`. Se for `na`, retorna `na`. |

### D. Operador Condicional Ternário `? :`
```pinescript
resultado = condicao ? valor_se_verdadeiro : valor_se_falso
```

---

## 2. Ordem de Precedência dos Operadores

Quando múltiplos operadores coexistem na mesma linha de código, a avaliação segue a seguinte ordem de precedência (do mais prioritário para o menos prioritário):

1. `[]` (Indexação Histórica)
2. `+`, `-`, `not` (Operadores Unários)
3. `*`, `/`, `%` (Multiplicação, Divisão, Resto)
4. `+`, `-` (Adição e Subtração binárias)
5. `>`, `<`, `>=`, `<=` (Comparações de Ordem)
6. `==`, `!=` (Comparações de Igualdade)
7. `and` (E lógico)
8. `or` (OU lógico)
9. `?:` (Operador Ternário)
10. `=`, `:=`, `+=`, `-=`, `*=`, `/=` (Atribuição e Reatribuição)

> **Regra de Ouro**: Use sempre parênteses `()` para explicitar a ordem de avaliação e evitar ambiguidades em cálculos complexos.

---

## 3. Script Completo: Motor de Cálculo com Operadores e Avaliação Ternária

```pinescript
//@version=5
indicator("Calculadora de Sinais com Operadores Lógicos", overlay=true)

// 1. INPUTS
lenPeriod  = input.int(20, title="Período do Canal")
rsiThresh  = input.int(50, title="Limiar do RSI")

// 2. AVALIAÇÃO DE CONDIÇÕES COM OPERADORES ARITMÉTICOS E RELACIONAIS
smaFast    = ta.sma(close, 10)
smaSlow    = ta.sma(close, 30)
rsiVal     = ta.rsi(close, 14)

// Condições com 'and', 'or', 'not'
isTrendBullish = (smaFast > smaSlow) and (not (close < smaFast))
isRsiBullish   = (rsiVal >= rsiThresh) and (rsiVal <= 70)
isVolumeValid  = (volume > ta.sma(volume, 20) * 1.2) or (close > high[1])

// Sinal Combinado
isFullBuySignal = isTrendBullish and isRsiBullish and isVolumeValid

// 3. SELEÇÃO DE CORES DINÂMICAS VIA TERNÁRIO ANINHADO
color signalColor = isFullBuySignal ? color.green : 
     isTrendBullish ? color.lime : 
     (smaFast < smaSlow) ? color.red : color.gray

// 4. PLOTS
plot(smaFast, title="SMA Rápida", color=color.blue, linewidth=2)
plot(smaSlow, title="SMA Lenta", color=color.orange, linewidth=2)

plotshape(isFullBuySignal, title="Sinal Completo de Compra", style=shape.diamond, location=location.belowbar, color=color.green, size=size.small, text="FORTE ALTA")
bgcolor(isFullBuySignal ? color.new(color.green, 85) : na, title="Destaque de Entrada")
```
