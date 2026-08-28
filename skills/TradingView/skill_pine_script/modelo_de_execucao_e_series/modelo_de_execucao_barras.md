---
title: "Modelo de Execução em Barras — Pine Script v5 / v6"
description: "Mecanismo de execução sequencial de scripts no Pine Script: processamento barra por barra, histórico vs tempo real, recálculo por ticks e rollback de estado."
category: "Modelo de Execução e Séries"
version: "Pine Script v5 / v6"
tags:
  - execution-model
  - bar-by-bar
  - realtime
  - history
  - ticks
  - rollback
---

# Modelo de Execução em Barras no Pine Script

O modelo de execução do Pine Script é fundamentalmente diferente de linguagens convencionais como Python ou JavaScript. Ele é projetado como um motor de fluxo orientado a eventos que processa uma série temporal de barras da esquerda para a direita (da barra mais antiga para a mais recente).

---

## 1. O Ciclo de Execução Barra por Barra

Quando um script é carregado no gráfico:
1. O runtime identifica o conjunto completo de barras históricas disponíveis para o ativo e tempo gráfico carregados.
2. O script é executado **uma vez para cada barra histórica**, sequencialmente, do índice 0 (a barra mais antiga do histórico) até a barra atual.
3. Ao atingir a **barra de tempo real (realtime)**, o comportamento muda: o script é reexecutado a **cada novo tick de preço** recebido do provedor de dados.

```mermaid
flowchart LR
    subgraph Histórico [Barras Históricas (Fechadas e Imutáveis)]
        B0[Barra 0: Executa 1x] --> B1[Barra 1: Executa 1x]
        B1 --> B2[Barra 2: Executa 1x]
        B2 --> Bn[Barra N: Executa 1x]
    end
    subgraph TempoReal [Barra Realtime (Aberta e Dinâmica)]
        Bn --> R1[Tick 1: Executa e calcula]
        R1 --> R2[Tick 2: Rollback + Recalcula]
        R2 --> R3[Tick 3: Rollback + Recalcula]
        R3 --> RF[Fechamento da Barra: Confirma Estado Final]
    end
```

---

## 2. Diferenças Críticas: Histórico vs Tempo Real

| Característica | Barras Históricas | Barra de Tempo Real (Realtime) |
|---|---|---|
| Estado da Barra | Fechada (`barstate.ishistory == true`) | Aberta (`barstate.isrealtime == true`) |
| Frequência de Execução | Exatamente **1 vez** por barra (com base no fechamento definitivo da barra) | **Múltiplas vezes** (a cada novo tick de preço ou volume) |
| Valores de `open`, `high`, `low`, `close` | Fixos e imutáveis | `open` é fixo; `high`, `low` e `close` mudam continuamente com os ticks |
| Modificação de Variáveis | Variáveis normais são calculadas uma única vez e salvas no histórico da série | Variáveis sofrem **rollback** (reversão ao estado do fechamento da barra anterior) antes de cada novo tick |
| Persistência | `var` mantém o valor final da barra anterior | `var` sofre rollback a cada tick, exceto se declarada como `varip` (var intrabar persist) |

---

## 3. O Fenômeno do Rollback em Tempo Real

Em barras de tempo real, antes de processar um novo tick, o motor do Pine Script **restaura todas as variáveis para os valores que elas tinham no fechamento da barra anterior**, exceto variáveis declaradas com `varip`.

### Demonstração Prática do Rollback:

```pinescript
//@version=5
indicator("Demonstração de Execução e Rollback", overlay=false)

// Variável normal: recalculada a cada tick e revertida ao estado da barra anterior
normalCount = 0
normalCount := normalCount + 1

// Variável var: retém o valor confirmado do fechamento de cada barra
var int barConfirmedCounter = 0
if barstate.isconfirmed
    barConfirmedCounter += 1

// Variável varip: retém o valor a CADA TICK sem sofrer rollback
varip int totalTicksCounter = 0
totalTicksCounter += 1

// Plotagem comparativa
plot(normalCount, title="Contador Normal (Sempre 1)", color=color.gray)
plot(barConfirmedCounter, title="Barras Fechadas Confirmadas", color=color.blue, linewidth=2)
plot(totalTicksCounter, title="Total Acumulado de Ticks (varip)", color=color.orange, linewidth=2)
```

---

## 4. Ordem dos Ticks em Teste Histórico vs Tempo Real

Em tempo real, o script recebe cada movimento real de preço (bid/ask). No histórico, os servidores do TradingView utilizam apenas os valores OHLC consolidados da barra.
- Em barras históricas de 1 minuto, o compilador avalia a barra usando a transição fictícia clássica: `Open -> High/Low -> Low/High -> Close`.
- Para simulação intrabar ultraprecisa em estratégias, utiliza-se o Bar Magnifier ou `request.security_lower_tf()`.

---

## 5. Script Completo de Monitoramento de Execução

```pinescript
//@version=5
indicator("Monitor de Modelo de Execução", overlay=false)

// Contadores de ciclo
var int historyBarsCount = 0
var int realtimeBarsCount = 0
varip int realtimeTicksCount = 0

if barstate.ishistory
    historyBarsCount += 1

if barstate.isrealtime
    realtimeTicksCount += 1
    if barstate.isnew
        realtimeBarsCount += 1

// Tabela de diagnóstico em tempo real
var table diagTable = table.new(position=position.top_right, columns=2, rows=4, bgcolor=color.black, border_color=color.gray, border_width=1)

if barstate.islast
    table.cell(diagTable, 0, 0, "Métrica", text_color=color.white, bgcolor=color.navy)
    table.cell(diagTable, 1, 0, "Valor", text_color=color.white, bgcolor=color.navy)
    
    table.cell(diagTable, 0, 1, "Barras Históricas Processadas", text_color=color.white)
    table.cell(diagTable, 1, 1, str.tostring(historyBarsCount), text_color=color.green)
    
    table.cell(diagTable, 0, 2, "Novas Barras em Tempo Real", text_color=color.white)
    table.cell(diagTable, 1, 2, str.tostring(realtimeBarsCount), text_color=color.yellow)
    
    table.cell(diagTable, 0, 3, "Ticks Processados (varip)", text_color=color.white)
    table.cell(diagTable, 1, 3, str.tostring(realtimeTicksCount), text_color=color.orange)

plot(bar_index, title="Índice da Barra Atual (bar_index)", color=color.purple)
```
