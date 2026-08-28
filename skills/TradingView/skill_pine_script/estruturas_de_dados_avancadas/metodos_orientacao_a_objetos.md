---
title: "Métodos e Orientação a Objetos — Pine Script v5 / v6"
description: "Criação de métodos orientados a objetos com a palavra-chave method: sintaxe encadeada (objeto.metodo()), extensão de tipos built-in e polimorfismo de dados."
category: "Estruturas de Dados Avançadas"
version: "Pine Script v5 / v6"
tags:
  - methods
  - oop
  - method-chaining
  - udt-extension
  - syntactic-sugar
---

# Métodos e Orientação a Objetos (`method`) no Pine Script

A palavra-chave `method` permite definir funções que podem ser invocadas utilizando a clássica **sintaxe de encadeamento com ponto (`objeto.metodo()`)**, aproximando o Pine Script dos padrões de programação orientada a objetos (OOP).

---

## 1. Declaração de um Método

A declaração de um método é idêntica à de uma função, com a adição do prefixo `method` antes do nome da função. O **primeiro parâmetro** do método define o tipo do objeto receptor sobre o qual o método opera.

```pinescript
// Declaração do método
method normalize(float src, float minVal, float maxVal) =>
    (src - minVal) / (maxVal - minVal)

// Chamada com sintaxe encadeada
normalizedClose = close.normalize(ta.lowest(low, 20), ta.highest(high, 20))
```

---

## 2. Estendendo UDTs com Métodos Especializados

Métodos transformam User-Defined Types em estruturas ricas com comportamentos encapsulados.

```pinescript
//@version=5
indicator("Exemplo de Métodos em UDT", overlay=true)

// Declaração do UDT
type BoundingBox
    float top
    float bottom
    int   leftIndex
    int   rightIndex

// Método para calcular a altura da caixa
method height(BoundingBox b) =>
    b.top - b.bottom

// Método para calcular o centro da caixa
method center(BoundingBox b) =>
    math.avg(b.top, b.bottom)

// Método mutador para atualizar os limites
method update(BoundingBox b, float newTop, float newBottom, int currentBar) =>
    b.top := newTop
    b.bottom := newBottom
    b.rightIndex := currentBar

// Instanciação e chamada encadeada dos métodos
var myBox = BoundingBox.new(high, low, bar_index, bar_index)
myBox.update(high, low, bar_index)

plot(myBox.center(), title="Centro da Caixa", color=color.purple)
```

---

## 3. Encadeamento de Métodos (Method Chaining)

Quando um método retorna a própria instância do objeto (ou outro objeto compatível), múltiplos métodos podem ser chamados em cascata contínua.

```pinescript
type PointTracker
    float x = 0.0
    float y = 0.0

method setX(PointTracker p, float newX) =>
    p.x := newX
    p // Retorna o próprio objeto

method setY(PointTracker p, float newY) =>
    p.y := newY
    p // Retorna o próprio objeto

var pt = PointTracker.new()
// Encadeamento fluente:
pt.setX(10.5).setY(20.3)
```

---

## 4. Script Completo: Motor de Análise Técnica com Métodos Encadeados

```pinescript
//@version=5
indicator("Motor de Indicadores com Métodos OOP", overlay=true)

// 1. DEFINIÇÃO DO UDT CANAL
type ChannelBand
    float upper
    float lower
    float middle
    float spread

// 2. MÉTODOS ASSOCIADOS AO UDT
method calculate(ChannelBand cb, float src, int length, float mult) =>
    cb.middle := ta.sma(src, length)
    dev       = ta.stdev(src, length) * mult
    cb.upper  := cb.middle + dev
    cb.lower  := cb.middle - dev
    cb.spread := cb.upper - cb.lower
    cb

method isBreakoutUpper(ChannelBand cb, float price) =>
    price > cb.upper

method isBreakoutLower(ChannelBand cb, float price) =>
    price < cb.lower

// 3. USO FLUENTE DOS MÉTODOS
var band = ChannelBand.new(0.0, 0.0, 0.0, 0.0)
band.calculate(close, 20, 2.0)

isBull = band.isBreakoutUpper(close)
isBear = band.isBreakoutLower(close)

// 4. PLOTS
p1 = plot(band.upper, title="Banda Alta", color=color.green)
p2 = plot(band.middle, title="Média Central", color=color.gray)
p3 = plot(band.lower, title="Banda Baixa", color=color.red)

fill(p1, p3, color=color.new(color.blue, 95), title="Preenchimento")

plotshape(isBull, title="Rompimento de Alta", style=shape.triangleup, location=location.belowbar, color=color.green, text="COMPRA")
plotshape(isBear, title="Rompimento de Baixa", style=shape.triangledown, location=location.abovebar, color=color.red, text="VENDA")
```
