---
title: "Criação e Publicação de Bibliotecas — Pine Script v5 / v6"
description: "Desenvolvimento de bibliotecas modulares com library(): exportação de funções e tipos com export, anotações de documentação de compilador e importação."
category: "Bibliotecas, Boas Práticas e Troubleshooting"
version: "Pine Script v5 / v6"
tags:
  - library
  - export
  - import
  - modularity
  - documentation-tags
---

# Criação e Publicação de Bibliotecas (`library()`) no Pine Script

As bibliotecas são publicações especiais de código Pine Script que contêm funções e tipos reutilizáveis (`type`) que podem ser importados por outros indicadores, estratégias ou bibliotecas.

---

## 1. A Declaração `library()`

Um script de biblioteca deve iniciar com a declaração `library()`.

```pinescript
//@version=5
library("MinhaBibliotecaQuant", overlay=true)
```

### Restrições Rígidas de Bibliotecas:
- Uma biblioteca **não pode desenhar diretamente no gráfico** (não pode chamar `plot()`, `plotshape()`, `bgcolor()`, etc.).
- Uma biblioteca **não pode executar ordens de estratégia** (não pode chamar `strategy.*`).
- Uma biblioteca **não pode conter inputs de usuário** (não pode chamar `input.*`).
- Funções exportadas **não podem depender de variáveis globais mutáveis** com estado dependente de barras anteriores a menos que o estado seja explicitamente passado em parâmetros (devem ser puras ou receber UDTs de contexto).

---

## 2. A Palavra-Chave `export` e Anotações de Compilador

Toda função ou tipo destinado ao uso externo deve ser precedido pela palavra-chave `export` e documentado com tags de anotação de cabeçalho:

| Tag de Compilador | Finalidade |
|---|---|
| `//@function` | Descrição do propósito geral da função exportada. |
| `//@param nome` | Explicação do parâmetro, tipo esperado e restrições. |
| `//@returns` | Descrição do valor retornado pela função. |
| `//@type` | Descrição do User-Defined Type (UDT) exportado. |

---

## 3. Importação de Bibliotecas (`import`)

Para utilizar uma biblioteca publicada no TradingView dentro de outro script:

```pinescript
import NomeDoAutor/NomeDaBiblioteca/Versao as alias
```

Exemplo:
```pinescript
import PineCoders/VisibleChart/4 as pc
```

---

## 4. Script Completo: Código de uma Biblioteca Profissional Reutilizável

```pinescript
//@version=5
// @description Biblioteca profissional para cálculo de estatísticas de volatilidade e normalização de preços.
library("MathQuantUtils", overlay=true)

// @type Estrutura para armazenar limites de normalização
// @field minVal Valor mínimo da janela histórica
// @field maxVal Valor máximo da janela histórica
export type NormalizationBounds
    float minVal
    float maxVal

// @function Normaliza uma série de preços no intervalo de 0.0 a 1.0 (Min-Max Scaler).
// @param src Série de preços a ser normalizada.
// @param length Período da janela de observação.
// @returns Série de ponto flutuante escalada entre 0.0 e 1.0.
export minMaxScale(series float src, simple int length) =>
    h = ta.highest(src, length)
    l = ta.lowest(src, length)
    float normalized = (h != l) ? (src - l) / (h - l) : 0.5
    normalized

// @function Calcula a volatilidade anualizada com base no True Range percentual.
// @param length Período do ATR.
// @param periodsPerYear Número de períodos em um ano (ex: 252 para diário, 365 para cripto).
// @returns Volatilidade estimada anualizada em porcentagem.
export annualizedAtrVol(simple int length = 14, simple int periodsPerYear = 252) =>
    trPercent = (ta.tr / close) * 100.0
    avgTr = ta.sma(trPercent, length)
    avgTr * math.sqrt(periodsPerYear)
```
