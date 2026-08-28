---
title: "Inputs e Configurações do Usuário — Pine Script v5 / v6"
description: "Guia completo sobre a família de funções input.*: tipos numéricos, booleanos, strings, símbolos, tempos gráficos, agrupamento com group e organização com inline."
category: "Entradas, Alertas e Dados Externos"
version: "Pine Script v5 / v6"
tags:
  - inputs
  - ui-configuration
  - group
  - inline
  - parameters
  - tooltips
---

# Inputs e Configurações do Usuário (`input.*`) no Pine Script

A família de funções `input.*()` permite expor variáveis ajustáveis no diálogo de configurações do script, permitindo que os usuários finais configurem parâmetros operacionais sem modificar o código-fonte.

---

## 1. Catálogo Completo de Funções `input.*()`

| Função | Tipo de Retorno | Tipo de Controle no Painel |
|---|---|---|
| `input.int()` | `input int` | Campo numérico inteiro com botões de incremento (stepper) |
| `input.float()` | `input float` | Campo numérico decimal com suporte a casas decimais e limites |
| `input.bool()` | `input bool` | Caixa de seleção (Checkbox) |
| `input.string()` | `input string` | Campo de texto livre ou menu Dropdown (quando `options` é fornecido) |
| `input.color()` | `input color` | Seletor de cores completo com paleta e canal de transparência |
| `input.symbol()` | `input string` | Seletor de ativos do TradingView com busca de ticker |
| `input.timeframe()`| `input string` | Seletor de tempos gráficos (1m, 5m, 1h, 1D, etc.) |
| `input.source()` | `series float` | Seletor de fonte de preços (`close`, `open`, `high`, `hl2`, etc.) |
| `input.session()` | `input string` | Seletor de faixa de horário de sessão de mercado (`"0900-1700"`) |
| `input.enum()` | `EnumMember` | Menu dropdown tipado a partir de uma declaração `enum` |

---

## 2. Parâmetros de Customização e Layout de Interface

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `defval` | Varia | Valor padrão inicial. |
| `title` | `const string` | Rótulo textual descritivo ao lado do campo. |
| `minval` / `maxval` | Numérico | Limites mínimo e máximo permitidos. |
| `step` | Numérico | Passo de incremento ao clicar nas setas do controle. |
| `options` | `array / lista` | Lista de opções para criar um menu dropdown fechado. |
| `group` | `const string` | Nome da seção colapsável que agrupa os inputs relacionados. |
| `inline` | `const string` | Identificador que coloca múltiplos inputs na mesma linha horizontal. |
| `tooltip` | `const string` | Texto explicativo exibido ao passar o mouse sobre o ícone de ajuda (?). |
| `confirm` | `const bool` | Se `true`, solicita confirmação ao aplicar o script no gráfico. |

---

## 3. Script Completo: Painel de Configurações Profissional com Agrupamento e Inline

```pinescript
//@version=5
indicator("Painel de Configurações Profissional — Inputs Master", overlay=true)

// 1. GRUPO: PARÂMETROS DE TENDÊNCIA
grpTrend = "MÉDIAS MÓVEIS DE TENDÊNCIA"
fastLen  = input.int(defval=9, title="Média Rápida", minval=1, maxval=200, group=grpTrend, inline="ma1")
fastCol  = input.color(defval=color.blue, title="", group=grpTrend, inline="ma1")

slowLen  = input.int(defval=21, title="Média Lenta", minval=1, maxval=500, group=grpTrend, inline="ma2")
slowCol  = input.color(defval=color.orange, title="", group=grpTrend, inline="ma2")

maSrc    = input.source(defval=close, title="Fonte de Preço", group=grpTrend)

// 2. GRUPO: FILTROS E SESSÃO OPERACIONAL
grpFilter = "FILTRO DE SESSÃO E HORÁRIO"
useSession = input.bool(defval=true, title="Ativar Filtro de Horário", group=grpFilter)
tradeSess  = input.session(defval="0900-1700:23456", title="Horário Permitido (GMT-3)", group=grpFilter, tooltip="Segunda a Sexta das 09:00 às 17:00")

// 3. GRUPO: MULTI-ATIVO DE COMPARAÇÃO
grpCompare = "COMPARAÇÃO COM ATIVO DE REFERÊNCIA"
refSymbol  = input.symbol(defval="SP:SPX", title="Ativo de Benchmark", group=grpCompare)
refTf      = input.timeframe(defval="D", title="Tempo Gráfico do Benchmark", group=grpCompare)

// 4. CÁLCULOS
fastMa = ta.ema(maSrc, fastLen)
slowMa = ta.ema(maSrc, slowLen)

// Verificação de Sessão Ativa
inSession = not na(time(timeframe.period, tradeSess))
canTrade  = not useSession or inSession

// Requisição de Benchmark
benchmarkClose = request.security(refSymbol, refTf, close[1], barmerge.gaps_off, barmerge.lookahead_off)

// 5. PLOTS
plot(fastMa, title="EMA Rápida", color=fastCol, linewidth=2)
plot(slowMa, title="EMA Lenta", color=slowCol, linewidth=2)
bgcolor(canTrade ? color.new(color.blue, 96) : color.new(color.gray, 92), title="Fundo de Sessão")
```
