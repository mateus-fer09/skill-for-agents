---
title: "Matrizes e Álgebra Linear — Pine Script v5 / v6"
description: "Manipulação de matrizes bidimensionais com matrix.*: criação, manipulação de linhas/colunas, determinantes, inversão, autovalores e modelos quantitativos."
category: "Estruturas de Dados Avançadas"
version: "Pine Script v5 / v6"
tags:
  - matrix
  - linear-algebra
  - quantitative-finance
  - regression
  - 2d-arrays
---

# Matrizes e Álgebra Linear (`matrix.*`) no Pine Script

O namespace `matrix.*` oferece estruturas bidimensionais (tabelas de linhas e colunas) e operações avançadas de álgebra linear, permitindo o cálculo nativo de regressões multivariadas, matrizes de covariância de portfólio, rotações geométricas e autovalores.

---

## 1. Construtores de Matrizes

| Construtor | Descrição |
|---|---|
| `matrix.new_float(rows, columns, initial_value)` | Cria matriz 2D de números de ponto flutuante. |
| `matrix.new_int(rows, columns, initial_value)` | Cria matriz 2D de números inteiros. |
| `matrix.new_string(rows, columns, initial_value)` | Cria matriz 2D de strings. |
| `matrix.new<TypeName>(rows, columns, initial_value)` | Cria matriz 2D genérica para qualquer tipo ou UDT. |

---

## 2. Funções Principais do Namespace `matrix.*`

| Operação | Função | Descrição |
|---|---|---|
| **Dimensões** | `matrix.rows(id)`, `matrix.columns(id)` | Retorna a contagem de linhas e colunas. |
| **Acesso & Escrita** | `matrix.get(id, row, col)` | Retorna o elemento na posição `[row, col]`. |
| | `matrix.set(id, row, col, value)` | Sobrescreve o elemento na posição `[row, col]`. |
| **Manipulação Estrutural** | `matrix.add_row(id, index, array_id)` | Insere uma nova linha a partir de um array. |
| | `matrix.add_col(id, index, array_id)` | Insere uma nova coluna a partir de um array. |
| | `matrix.remove_row(id, index)` | Remove a linha na posição especificada. |
| | `matrix.remove_col(id, index)` | Remove a coluna na posição especificada. |
| | `matrix.get_row(id, row)` | Extrai uma linha inteira como um novo array. |
| | `matrix.get_col(id, col)` | Extrai uma coluna inteira como um novo array. |
| **Álgebra Linear** | `matrix.mult(id1, id2)` | Multiplica duas matrizes compatíveis ($A 	imes B$). |
| | `matrix.transpose(id)` | Retorna a matriz transposta ($A^T$). |
| | `matrix.det(id)` | Calcula o determinante de uma matriz quadrada. |
| | `matrix.inv(id)` | Calcula a matriz inversa ($A^{-1}$). |
| | `matrix.eigenvalues(id)` | Retorna os autovalores da matriz. |
| | `matrix.eigenvectors(id)` | Retorna os autovetores da matriz. |
| | `matrix.dot_product(id1, id2)` | Calcula o produto escalar entre vetores/matrizes. |

---

## 3. Script Completo: Regressão Linear Simples via Matriz

```pinescript
//@version=5
indicator("Regressão Linear Matricial — OLS Engine", overlay=true)

// 1. INPUTS
lookback = input.int(20, title="Período da Regressão", minval=5, maxval=100)

// 2. CONSTRUÇÃO DAS MATRIZES PARA OLS (Ordinary Least Squares: Beta = (X^T * X)^-1 * X^T * Y)
calcLinearRegression() =>
    // Cria Matriz X de dimensões [lookback x 2] (Coluna 0: Constante 1, Coluna 1: Tempo i)
    matrix<float> matX = matrix.new_float(lookback, 2, 1.0)
    matrix<float> matY = matrix.new_float(lookback, 1, 0.0)
    
    for i = 0 to lookback - 1
        t = float(lookback - 1 - i)
        matrix.set(matX, i, 1, t)
        matrix.set(matY, i, 0, close[lookback - 1 - i])
    
    // X^T (Transposta de X)
    matrix<float> matXT = matrix.transpose(matX)
    
    // (X^T * X)
    matrix<float> matXTX = matrix.mult(matXT, matX)
    
    // (X^T * X)^-1 (Inversa)
    matrix<float> matInv = matrix.inv(matXTX)
    
    // (X^T * X)^-1 * X^T
    matrix<float> matTemp = matrix.mult(matInv, matXT)
    
    // Beta = matTemp * Y -> [2 x 1] onde Beta[0] = Intercepto (alpha), Beta[1] = Inclinação (slope)
    matrix<float> matBeta = matrix.mult(matTemp, matY)
    
    alpha = matrix.get(matBeta, 0, 0)
    slope = matrix.get(matBeta, 1, 0)
    
    currentFit = alpha + slope * float(lookback - 1)
    [currentFit, slope]

[regFit, regSlope] = calcLinearRegression()

// 3. PLOTS
plot(regFit, title="Reta de Regressão Matricial", color=regSlope >= 0 ? color.green : color.red, linewidth=3)
```
