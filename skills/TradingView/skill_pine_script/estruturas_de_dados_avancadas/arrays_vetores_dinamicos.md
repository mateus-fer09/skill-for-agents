---
title: "Arrays e Vetores Dinâmicos — Pine Script v5 / v6"
description: "Guia completo de manipulação de vetores dinâmicos unidimensionais com array.*: criação, inserção, remoção, busca, ordenação e cálculos estatísticos."
category: "Estruturas de Dados Avançadas"
version: "Pine Script v5 / v6"
tags:
  - arrays
  - dynamic-vectors
  - sorting
  - statistics
  - array-methods
---

# Arrays e Vetores Dinâmicos (`array.*`) no Pine Script

Arrays são coleções unidimensionais de tamanho dinâmico indexadas a partir de `0`. Eles podem armazenar qualquer tipo de dado do Pine Script, incluindo tipos primitivos (`float`, `int`, `color`, `string`), identificadores gráficos (`line`, `label`, `box`) e UDTs.

---

## 1. Construtores de Arrays

| Construtor | Descrição |
|---|---|
| `array.new_float(size, initial_value)` | Cria um array de números decimais |
| `array.new_int(size, initial_value)` | Cria um array de números inteiros |
| `array.new_bool(size, initial_value)` | Cria um array de booleanos |
| `array.new_color(size, initial_value)` | Cria um array de cores |
| `array.new_string(size, initial_value)` | Cria um array de strings |
| `array.new_line(size, initial_value)` | Cria um array de objetos `line` |
| `array.new_label(size, initial_value)` | Cria um array de objetos `label` |
| `array.new_box(size, initial_value)` | Cria um array de objetos `box` |
| `array.new<TypeName>(size, initial_value)` | Cria um array genérico de UDTs ou qualquer tipo |

---

## 2. Tabela de Métodos Principais do Namespace `array.*`

| Categoria | Função | Assinatura e Propósito |
|---|---|---|
| **Tamanho** | `array.size(id)` | Retorna o número de elementos contidos no array. |
| **Inserção** | `array.push(id, value)` | Adiciona um elemento ao **final** do array. |
| | `array.unshift(id, value)` | Insere um elemento no **início** (índice 0) do array. |
| | `array.insert(id, index, value)` | Insere um elemento em uma posição arbitrária. |
| **Remoção** | `array.pop(id)` | Remove e retorna o **último** elemento. |
| | `array.shift(id)` | Remove e retorna o **primeiro** elemento (índice 0). |
| | `array.remove(id, index)` | Remove o elemento na posição `index`. |
| | `array.clear(id)` | Remove todos os elementos do array (tamanho vira 0). |
| **Acesso & Escrita** | `array.get(id, index)` | Retorna o elemento na posição `index`. |
| | `array.set(id, index, value)` | Sobrescreve o elemento na posição `index`. |
| | `array.fill(id, value, start, end)` | Preenche uma faixa com o valor especificado. |
| **Estatística** | `array.min(id)`, `array.max(id)` | Retorna o menor e o maior valor numérico. |
| | `array.avg(id)`, `array.sum(id)` | Retorna a média aritmética e a soma total. |
| | `array.stdev(id)`, `array.variance(id)` | Retorna o desvio padrão e a variância amostral. |
| **Busca & Ordenação** | `array.includes(id, value)` | Retorna `true` se o valor estiver presente no array. |
| | `array.indexof(id, value)` | Retorna o índice da primeira ocorrência do valor. |
| | `array.sort(id, order)` | Ordena o array em ordem crescente (`order.ascending`) ou decrescente (`order.descending`). |
| | `array.reverse(id)` | Inverte a ordem de todos os elementos. |
| | `array.slice(id, start, end)` | Cria um novo subarray com os elementos da faixa. |

---

## 3. Script Completo: Canal de Volatilidade Percentil com Arrays

```pinescript
//@version=5
indicator("Canal Percentil com Arrays Dinâmicos", overlay=true)

// 1. INPUTS
windowSize = input.int(50, title="Tamanho da Janela de Preços", minval=10, maxval=200)
highPerc   = input.float(90.0, title="Percentil Superior (%)", minval=50, maxval=100)
lowPerc    = input.float(10.0, title="Percentil Inferior (%)", minval=0, maxval=50)

// 2. CRIAÇÃO E MANUTENÇÃO DO ARRAY CIRCULAR
var float[] priceBuffer = array.new_float(0)

// Adiciona o fechamento atual e remove o mais antigo para manter o tamanho fixo
array.push(priceBuffer, close)
if array.size(priceBuffer) > windowSize
    array.shift(priceBuffer)

// 3. CÁLCULO DE PERCENTIS COM CÓPIA E ORDENAÇÃO
float upperVal = na
float lowerVal = na
float medianVal = na

if array.size(priceBuffer) == windowSize
    // Clona o array para não desordenar o buffer cronológico original
    float[] sortedBuffer = array.copy(priceBuffer)
    array.sort(sortedBuffer, order.ascending)
    
    // Cálculo dos índices correspondentes aos percentis
    int idxUpper  = math.round((highPerc / 100.0) * (windowSize - 1))
    int idxLower  = math.round((lowPerc / 100.0) * (windowSize - 1))
    int idxMedian = math.round(0.5 * (windowSize - 1))
    
    upperVal  := array.get(sortedBuffer, idxUpper)
    lowerVal  := array.get(sortedBuffer, idxLower)
    medianVal := array.get(sortedBuffer, idxMedian)

// 4. PLOTS DO CANAL
pUp  = plot(upperVal, title="Percentil 90", color=color.green, linewidth=2)
pMid = plot(medianVal, title="Mediana (Percentil 50)", color=color.gray, linewidth=1)
pLow = plot(lowerVal, title="Percentil 10", color=color.red, linewidth=2)

fill(pUp, pLow, color=color.new(color.blue, 92), title="Área Percentil")
```
