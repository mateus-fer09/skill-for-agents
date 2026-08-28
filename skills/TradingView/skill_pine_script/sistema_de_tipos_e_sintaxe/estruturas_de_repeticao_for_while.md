---
title: "Estruturas de Repetição: for, for...in e while — Pine Script v5 / v6"
description: "Controle de laços de repetição no Pine Script: for com contador e passo, for...in para coleções, while condicional, comandos break e continue, e limites de execução do compilador."
category: "Sistema de Tipos e Sintaxe"
version: "Pine Script v5 / v6"
tags:
  - loops
  - for
  - for-in
  - while
  - break
  - continue
  - performance
---

# Estruturas de Repetição: `for`, `for...in` e `while`

O Pine Script fornece mecanismos robustos de iteração para processar buffers históricos, manipular coleções dinâmicas (arrays, matrizes, maps) e calcular algoritmos estatísticos iterativos.

---

## 1. O Laço `for` com Contador

O laço `for` clássico itera um contador de um valor inicial até um valor final, com incremento opcional `by`.

### Sintaxe:
```pinescript
for i = valorInicial to valorFinal by passo
    // bloco de comandos identado com 4 espaços
```

- Se `by passo` for omitido, o passo padrão é `1` se `valorInicial <= valorFinal`, ou `-1` se `valorInicial > valorFinal`.
- Tanto o início quanto o fim são **inclusivos**.

```pinescript
//@version=5
indicator("Exemplo de Loop FOR", overlay=false)

// Calculando a média ponderada manual dos últimos 10 fechamentos
int period = 10
float weightedSum = 0.0
int weightTotal   = 0

for i = 0 to period - 1
    weight = period - i
    weightedSum += close[i] * weight
    weightTotal += weight

manualWma = weightedSum / weightTotal
plot(manualWma, title="WMA Manual via FOR", color=color.blue)
```

---

## 2. O Laço `for...in` para Coleções

O laço `for...in` itera diretamente sobre os elementos de um **Array**, **Map** ou **Matriz**, eliminando a necessidade de indexação manual.

### Formas do `for...in`:
1. **Iteração direta de valores**:
```pinescript
for elemento in meuArray
    // opera sobre o elemento
```
2. **Iteração com índice e valor em tupla**:
```pinescript
for [indice, elemento] in meuArray
    // acessa tanto o índice quanto o elemento
```

```pinescript
//@version=5
indicator("Exemplo de Loop FOR IN com Array", overlay=false)

var float[] lastPrices = array.new_float(0)

// Armazena os últimos 5 fechamentos no array
array.push(lastPrices, close)
if array.size(lastPrices) > 5
    array.shift(lastPrices)

// Soma todos os preços do array usando for...in
float total = 0.0
for price in lastPrices
    total += price

avgPrice = total / array.size(lastPrices)
plot(avgPrice, title="Média dos 5 Preços", color=color.teal)
```

---

## 3. O Laço `while` Condicional

O laço `while` executa repetidamente seu bloco de código enquanto a condição lógica permanecer `true`.

```pinescript
//@version=5
indicator("Exemplo de Loop WHILE — Contagem de Velas Consecutivas", overlay=false)

// Conta quantas barras consecutivas fecharam acima do open
int bullishStreak = 0
while (bullishStreak < 50) and (close[bullishStreak] > open[bullishStreak])
    bullishStreak += 1

plot(bullishStreak, title="Sequência Consecutiva de Alta", color=color.green, style=plot.style_columns)
```

---

## 4. Comandos de Controle: `break` e `continue`

- **`break`**: Interrompe imediatamente a execução do laço mais interno e transfere o fluxo para a primeira linha após o laço.
- **`continue`**: Pula o restante das instruções da iteração atual e avança diretamente para a próxima iteração do laço.

---

## 5. Limites do Compilador e Otimização de Performance

> **Aviso Crítico de Runtime**:
> O Pine Script impõe um limite máximo de **500.000 operações de loop por barra**. Se um laço ultrapassar essa contagem (por exemplo, um loop infinito no `while`), o script será abortado imediatamente com erro de tempo de execução.

### Dicas de Otimização:
1. Sempre garanta que o contador do `while` progrida em direção à condição de término.
2. Prefira funções vetorizadas do namespace `ta.*` ou `array.*` (como `array.sum()`, `array.avg()`) em vez de recalcular manualmente somatórios com laços.
