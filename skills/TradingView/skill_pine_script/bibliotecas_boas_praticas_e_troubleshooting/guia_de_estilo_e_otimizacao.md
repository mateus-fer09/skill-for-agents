---
title: "Guia de Estilo, Otimização e Limites de Compilação — Pine Script v5 / v6"
description: "Padrões oficiais de nomenclatura, organização visual de código, limites de runtime (memória, chamadas de segurança, laços) e técnicas de profiling."
category: "Bibliotecas, Boas Práticas e Troubleshooting"
version: "Pine Script v5 / v6"
tags:
  - style-guide
  - optimization
  - runtime-limits
  - profiling
  - max-bars-back
  - performance
---

# Guia de Estilo, Otimização e Limites de Compilação no Pine Script

Escrever código Pine Script limpo e de alto desempenho garante que seus scripts carreguem instantaneamente no gráfico, evitem falhas de timeout de compilação e respeitem as cotas da nuvem do TradingView.

---

## 1. Convenções de Nomenclatura Oficiais (TradingView Style Guide)

| Elemento | Convenção Recomendada | Exemplo |
|---|---|---|
| **Constantes** | `UPPER_SNAKE_CASE` | `COLOR_BULLISH`, `MAX_BUFFER_SIZE` |
| **Inputs** | `lowerCamelCase` com sufixo `Input` | `lengthInput`, `fastMaInput`, `showDashboardInput` |
| **Variáveis Globais** | `lowerCamelCase` | `currentTrend`, `trailingStopPrice` |
| **Variáveis Persistentes (`var`)** | `lowerCamelCase` com prefixo `var` ou semântico | `varLastPivotHigh`, `tradeCount` |
| **Funções Customizadas (UDF)** | `lowerCamelCase` | `calcVolatileBands()`, `findSwings()` |
| **User-Defined Types (UDT)** | `UpperCamelCase` (PascalCase) | `TradeOrder`, `PivotLevel`, `RiskProfile` |
| **Enums** | `UpperCamelCase` com membros em `UPPER_SNAKE` | `enum ExecutionType` -> `MARKET`, `LIMIT` |

---

## 2. Limites Máximos de Runtime do Compilador

| Recurso do Runtime | Limite Oficial Máximo | O que acontece se exceder? |
|---|---|---|
| **Contagem de Linhas (`line`)** | 500 objetos ativos | Objetos mais antigos são deletados automaticamente pela garbage collection. |
| **Contagem de Caixas (`box`)** | 500 objetos ativos | Caixas mais antigas são deletadas. |
| **Contagem de Rótulos (`label`)** | 500 objetos ativos | Rótulos mais antigos são deletados. |
| **Contagem de Polilinhas (`polyline`)** | 100 objetos ativos | Polilinhas mais antigas são deletadas. |
| **Operações em Laços por Barra** | 500.000 iterações | O script é abortado imediatamente com erro de timeout de execução. |
| **Chamadas `request.security()`** | 40 requisições distintas | Erro de compilação imediato. |
| **Buffer Histórico (`max_bars_back`)** | 5.000 barras | Erro de runtime se o buffer requisitado exceder a capacidade de memória. |
| **Tamanho da Tabela (`table`)** | 100 células no total | Erro de runtime. |

---

## 3. Técnicas Avançadas de Otimização de Performance

1. **Evite Cálculos Redundantes em Séries**:
   - Se uma média móvel for usada em 5 lugares do código, calcule-a uma única vez e armazene o resultado em uma variável local.
2. **Encapsule Cálculos Pesados em `barstate.islast`**:
   - Métricas globais, ordenação de arrays grandes e renderização de tabelas devem ser executadas exclusivamente na última barra.
3. **Agrupe Chamadas `request.security()`**:
   - Em vez de fazer 4 chamadas separadas para obter `open`, `high`, `low`, `close` de outro timeframe, faça **uma única chamada retornando uma tupla**:
   ```pinescript
   // OTIMIZADO (Consome apenas 1 cota de request):
   [htfO, htfH, htfL, htfC] = request.security(syminfo.tickerid, "D", [open[1], high[1], low[1], close[1]])
   ```
