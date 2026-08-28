---
title: "Enums e Tipagem Enumerada — Pine Script v5 / v6"
description: "Uso de enumerações tipadas (enums) no Pine Script: declaração de constantes nomeadas, tipagem estrita de opções e integração com input.enum()."
category: "Estruturas de Dados Avançadas"
version: "Pine Script v5 / v6"
tags:
  - enums
  - types
  - input-enum
  - type-safety
---

# Enums e Tipagem Enumerada no Pine Script

Introduzidos para garantir segurança de tipos estrita e menus de seleção robustos, os **Enums** permitem criar conjuntos fechados e nomeados de valores constantes.

---

## 1. Declaração de Enums (`enum`)

A declaração de um enum utiliza a palavra-chave `enum`, seguida do nome do enum e de seus membros identados com 4 espaços. Opcionalmente, cada membro pode receber um título de exibição amigável entre aspas para a interface de usuário.

```pinescript
enum MovingAverageType
    SMA = "Média Móvel Simples"
    EMA = "Média Móvel Exponencial"
    WMA = "Média Móvel Ponderada"
    HMA = "Média Móvel de Hull"
    RMA = "Média Móvel de Wilder"
```

---

## 2. Integração com `input.enum()`

Os Enums se integram nativamente à função `input.enum()`, gerando automaticamente um menu dropdown seguro no painel de configurações do script, prevenindo erros de digitação de strings.

```pinescript
maSelection = input.enum(
     defval=MovingAverageType.EMA, 
     title="Algoritmo de Média",
     tooltip="Selecione o método de cálculo desejado."
  )
```

---

## 3. Uso em Expressões `switch`

Avaliar variáveis do tipo enum em blocos `switch` oferece clareza e garante que todos os casos possíveis sejam tratados.

```pinescript
calcMA(float src, int len, MovingAverageType maType) =>
    switch maType
        MovingAverageType.SMA => ta.sma(src, len)
        MovingAverageType.EMA => ta.ema(src, len)
        MovingAverageType.WMA => ta.wma(src, len)
        MovingAverageType.HMA => ta.hma(src, len)
        MovingAverageType.RMA => ta.rma(src, len)
```

---

## 4. Script Completo: Indicador Multimodal com Enums

```pinescript
//@version=5
indicator("Painel Multimodal com Enums Tipados", overlay=true)

// 1. DECLARAÇÃO DOS ENUMS
enum FilterMode
    OFF       = "Desativado"
    TREND     = "Filtro de Tendência EMA"
    VOLATILE  = "Filtro de Volatilidade ATR"
    COMBINED  = "Filtro Combinado (Tendência + Volatilidade)"

enum DisplayStyle
    CANDLES = "Velas Coloridas"
    SHAPES  = "Ícones de Sinal"
    BOTH    = "Velas e Ícones"

// 2. INPUTS BASEADOS EM ENUMS
filterSetting  = input.enum(FilterMode.COMBINED, title="Modo de Filtragem")
displaySetting = input.enum(DisplayStyle.BOTH, title="Estilo de Exibição")
emaLen         = input.int(50, title="Período da EMA")
atrLen         = input.int(14, title="Período do ATR")

// 3. LÓGICA DE FILTRAGEM
emaVal = ta.ema(close, emaLen)
atrVal = ta.atr(atrLen)

isTrendUp   = close > emaVal
isVolatile  = atrVal > ta.sma(atrVal, 20)

bool buyCondition = switch filterSetting
    FilterMode.OFF      => close > open
    FilterMode.TREND    => close > open and isTrendUp
    FilterMode.VOLATILE => close > open and isVolatile
    FilterMode.COMBINED => close > open and isTrendUp and isVolatile

// 4. RENDERIZAÇÃO CONDICIONAL BASEADA NO ENUM DE EXIBIÇÃO
if displaySetting == DisplayStyle.CANDLES or displaySetting == DisplayStyle.BOTH
    barcolor(buyCondition ? color.green : color.gray)

if displaySetting == DisplayStyle.SHAPES or displaySetting == DisplayStyle.BOTH
    plotshape(buyCondition, title="Sinal Buy", style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small)

plot(emaVal, title="EMA Filtro", color=color.blue, linewidth=2)
```
