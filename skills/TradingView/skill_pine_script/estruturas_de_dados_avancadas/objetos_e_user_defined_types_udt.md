---
title: "Objetos e User-Defined Types (UDT) — Pine Script v5 / v6"
description: "Criação de estruturas de dados e classes personalizadas com type: declaração de campos, instanciação com new(), mutação de propriedades e semântica de referência."
category: "Estruturas de Dados Avançadas"
version: "Pine Script v5 / v6"
tags:
  - udt
  - objects
  - type
  - struct
  - reference-types
---

# Objetos e User-Defined Types (UDT) no Pine Script

Os **User-Defined Types (UDT)** são o equivalente a estruturas (`structs`) ou classes de dados no Pine Script. Eles permitem agrupar múltiplos campos relacionados em uma única entidade tipada, facilitando a modelagem de estratégias complexas, rastreadores de ordens, pivôs e dados analíticos.

---

## 1. Declaração de um Tipo (`type`)

A declaração de um UDT utiliza a palavra-chave `type`, seguida pelo nome do tipo e pelos campos identados com 4 espaços.

```pinescript
type PivotPoint
    int   barIndex
    int   barTime
    float price
    bool  isHigh
    color pointColor = color.blue // Campo com valor padrão
```

### Regras de Declaração de Campos:
- Os tipos dos campos podem ser primitivos (`int`, `float`, `bool`, `color`, `string`), outros UDTs, arrays, matrizes, maps ou identificadores de desenho (`line`, `label`, `box`, etc.).
- Não é permitido definir métodos diretamente dentro do bloco `type`; os métodos são declarados separadamente com a palavra-chave `method`.

---

## 2. Instanciação e Cópia de Objetos

### A. Instanciação com `.new()`
Todo UDT possui automaticamente uma função construtora gerada pelo compilador no formato `TypeName.new()`. Os argumentos podem ser passados posicionalmente ou nomeados.

```pinescript
// Construtor posicional
p1 = PivotPoint.new(bar_index, time, high, true, color.green)

// Construtor com argumentos nomeados
p2 = PivotPoint.new(price=low, isHigh=false, barIndex=bar_index, barTime=time)
```

### B. Cópia Rasa com `.copy()`
O compilador também fornece automaticamente o método `TypeName.copy()`, que realiza uma cópia rasa (shallow copy) do objeto.

```pinescript
p3 = p1.copy()
```

---

## 3. Semântica de Referência (Mutabilidade)

> **Regra Crítica de Memória**:
> Objetos UDT são **tipos de referência**. Quando você atribui uma variável de objeto a outra (`objB = objA`) ou passa um objeto para uma função, você está passando uma **referência** para a mesma instância de memória, e não uma cópia dos dados.

```pinescript
//@version=5
indicator("Semântica de Referência UDT", overlay=false)

type Tracker
    int count = 0

increment(Tracker t) =>
    t.count := t.count + 1 // Modifica o objeto original referenciado

var trackerA = Tracker.new()
increment(trackerA)

plot(trackerA.count, title="Contagem do Rastreador")
```

---

## 4. Script Completo: Gerenciador de Swings de Mercado com UDT

```pinescript
//@version=5
indicator("Gerenciador de Swings com UDT", overlay=true)

// 1. DEFINIÇÃO DO UDT PARA SWING POINTS
type SwingPoint
    int   index
    float price
    bool  isHigh
    line  trendLine

// 2. FUNÇÃO GERADORA DE SWINGS
createSwing(int idx, float prc, bool highFlag) =>
    SwingPoint.new(idx, prc, highFlag, na)

// 3. RASTREADOR DE SWINGS NO GRÁFICO
var SwingPoint lastHigh = na
var SwingPoint lastLow  = na

pH = ta.pivothigh(high, 5, 5)
pL = ta.pivotlow(low, 5, 5)

if not na(pH)
    prevHigh = lastHigh
    lastHigh := createSwing(bar_index - 5, pH, true)
    
    // Desenha linha conectando os dois últimos topos de swing
    if not na(prevHigh)
        line.delete(prevHigh.trendLine)
        lastHigh.trendLine := line.new(
             x1=prevHigh.index, y1=prevHigh.price,
             x2=lastHigh.index, y2=lastHigh.price,
             color=color.green, width=2, style=line.style_dashed
          )
    label.new(bar_index - 5, pH, "Topo Swing", color=color.green, textcolor=color.white, style=label.style_label_down)

if not na(pL)
    prevLow = lastLow
    lastLow := createSwing(bar_index - 5, pL, false)
    
    // Desenha linha conectando os dois últimos fundos de swing
    if not na(prevLow)
        line.delete(prevLow.trendLine)
        lastLow.trendLine := line.new(
             x1=prevLow.index, y1=prevLow.price,
             x2=lastLow.index, y2=lastLow.price,
             color=color.red, width=2, style=line.style_dashed
          )
    label.new(bar_index - 5, pL, "Fundo Swing", color=color.red, textcolor=color.white, style=label.style_label_up)
```
