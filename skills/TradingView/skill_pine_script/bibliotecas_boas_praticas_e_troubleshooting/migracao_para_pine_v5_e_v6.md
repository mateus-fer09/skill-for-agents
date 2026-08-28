---
title: "Guia de Migração para Pine Script v5 e v6 — Pine Script v5 / v6"
description: "Guia exaustivo de modernização de código legado: transição detalhada de Pine v4 para v5 e v6, novos namespaces ta.*, math.*, enums, type checking estrito e comparativos diff."
category: "Bibliotecas, Boas Práticas e Troubleshooting"
version: "Pine Script v5 / v6"
tags:
  - migration
  - v4-to-v5
  - v5-to-v6
  - namespaces
  - deprecation
---

# Guia de Migração para Pine Script v5 e v6

A evolução do Pine Script da versão 4 para a versão 5 e versão 6 trouxe grandes ganhos de segurança de tipos, modularidade e performance. Este guia apresenta a tabela completa de conversão para atualizar códigos legados.

---

## 1. Tabela de Conversão de Namespaces (v4 -> v5 / v6)

| Sintaxe Legada (v4) | Sintaxe Moderna (v5 / v6) | Categoria |
|---|---|---|
| `study()` | `indicator()` | Declaração de Script |
| `sma(x, y)` | `ta.sma(x, y)` | Análise Técnica |
| `ema(x, y)` | `ta.ema(x, y)` | Análise Técnica |
| `rsi(x, y)` | `ta.rsi(x, y)` | Análise Técnica |
| `macd(x, y, z, w)` | `ta.macd(x, y, z, w)` | Análise Técnica |
| `atr(x)` | `ta.atr(x)` | Análise Técnica |
| `cross(x, y)` | `ta.cross(x, y)` | Análise Técnica |
| `crossover(x, y)` | `ta.crossover(x, y)` | Análise Técnica |
| `crossunder(x, y)` | `ta.crossunder(x, y)` | Análise Técnica |
| `pivothigh(x, y, z)` | `ta.pivothigh(x, y, z)` | Análise Técnica |
| `pivotlow(x, y, z)` | `ta.pivotlow(x, y, z)` | Análise Técnica |
| `security(sym, tf, exp)` | `request.security(sym, tf, exp)` | Requisições Externas |
| `financial(sym, fid, tf)` | `request.financial(sym, fid, tf)` | Requisições Externas |
| `abs(x)`, `round(x)` | `math.abs(x)`, `math.round(x)` | Funções Matemáticas |
| `max(x, y)`, `min(x, y)` | `math.max(x, y)`, `math.min(x, y)` | Funções Matemáticas |
| `tostring(x)` | `str.tostring(x)` | Manipulação de Strings |
| `input(14, "Período", input.integer)` | `input.int(14, "Período")` | Configurações de Entrada |
| `input(0.5, "Mult", input.float)` | `input.float(0.5, "Mult")` | Configurações de Entrada |
| `input(true, "Ativar", input.bool)` | `input.bool(true, "Ativar")` | Configurações de Entrada |
| `iff(cond, val1, val2)` | `cond ? val1 : val2` | Operador Condicional |

---

## 2. Inovações Exclusivas do Pine Script v6

1. **Tipagem Mais Estrita e Verificação em Tempo de Compilação**:
   - Validações mais rigorosas em chamadas polimórficas e métodos de extensão.
2. **Suporte Completo a `enum` em Inputs**:
   - `input.enum()` para menus de múltipla escolha totalmente tipados e seguros.
3. **Novas Funções de Manipulação Geométrica**:
   - `polyline.*` para desenho de polígonos complexos contínuos.
4. **Requisições Dinâmicas**:
   - Capacidade de manipular listas dinâmicas de ativos em loops controlados.

---

## 3. Comparativo Prático: Script Legado v4 vs Script Moderno v5/v6

### Versão Legada (Pine Script v4):
```pinescript
//@version=4
study("Script Antigo v4", overlay=true)
len = input(14, "Periodo", input.integer)
val = sma(close, len)
crossBull = crossover(close, val)
plot(val, color=color.blue)
plotshape(crossBull, style=shape.triangleup)
```

### Versão Moderna Equivalente (Pine Script v5 / v6):
```pinescript
//@version=5
indicator("Script Moderno v5", overlay=true)
len = input.int(14, title="Período")
val = ta.sma(close, len)
crossBull = ta.crossover(close, val)
plot(val, title="SMA", color=color.blue, linewidth=2)
plotshape(crossBull, title="Cruzamento Bullish", style=shape.triangleup, location=location.belowbar, color=color.green)
```
