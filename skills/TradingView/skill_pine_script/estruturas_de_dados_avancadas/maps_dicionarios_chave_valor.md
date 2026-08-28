---
title: "Maps e Dicionários Chave-Valor — Pine Script v5 / v6"
description: "Manipulação de tabelas de dispersão associativas com map.*: inserção, consulta O(1), remoção, inspeção de chaves e valores, e aplicações de profiling."
category: "Estruturas de Dados Avançadas"
version: "Pine Script v5 / v6"
tags:
  - maps
  - hash-map
  - key-value
  - dictionary
  - o-1-lookup
---

# Maps e Dicionários Chave-Valor (`map.*`) no Pine Script

O namespace `map.*` implementa estruturas de dados associativas (dicionários / hash maps) que armazenam elementos em pares únicos de **chave-valor**, permitindo operações de inserção, recuperação e verificação com complexidade de tempo média $O(1)$.

---

## 1. Construtor de Maps

A criação de um map utiliza a sintaxe genérica `map.new<keyType, valueType>()`.

```pinescript
// Map de String para Float (ex: Volume por Sessão)
map<string, float> sessionVolume = map.new<string, float>()

// Map de Int para UDT (ex: Registro de Ordens por ID)
map<int, OrderData> orderRegistry = map.new<int, OrderData>()
```

### Tipos de Chaves Permitidos:
- Tipos primitivos: `int`, `float`, `string`, `bool`.

### Tipos de Valores Permitidos:
- Qualquer tipo primitivo, UDTs, arrays, matrizes ou outros maps.

---

## 2. Funções Principais do Namespace `map.*`

| Operação | Função | Descrição |
|---|---|---|
| **Inserção / Atualização** | `map.put(id, key, value)` | Insere o par chave-valor. Se a chave já existir, sobrescreve o valor antigo. |
| **Consulta** | `map.get(id, key)` | Retorna o valor associado à chave. Se a chave não existir, retorna `na`. |
| **Existência** | `map.contains(id, key)` | Retorna `true` se o map contiver a chave especificada. |
| **Remoção** | `map.remove(id, key)` | Remove o par chave-valor associado à chave. |
| **Limpeza** | `map.clear(id)` | Esvazia completamente o map. |
| **Tamanho** | `map.size(id)` | Retorna a quantidade de pares chave-valor armazenados. |
| **Inspeção de Coleções** | `map.keys(id)` | Retorna um `array` contendo todas as chaves do map. |
| | `map.values(id)` | Retorna um `array` contendo todos os valores do map. |

---

## 3. Script Completo: Analisador de Performance por Dia da Semana com Map

```pinescript
//@version=5
indicator("Estatística por Dia da Semana com Maps", overlay=false)

// 1. CRIAÇÃO DOS MAPS PERSISTENTES COM VAR
var map<string, float> dayReturnMap = map.new<string, float>()
var map<string, int>   dayCountMap  = map.new<string, int>()

// 2. IDENTIFICAÇÃO DO DIA DA SEMANA
getDayName(int dayNum) =>
    switch dayNum
        dayofweek.monday    => "Segunda"
        dayofweek.tuesday   => "Terca"
        dayofweek.wednesday => "Quarta"
        dayofweek.thursday  => "Quinta"
        dayofweek.friday    => "Sexta"
        dayofweek.saturday  => "Sabado"
        dayofweek.sunday    => "Domingo"
        => "Desconhecido"

currentDay = getDayName(dayofweek)
barReturn  = (close - open) / open * 100

// 3. ACUMULAÇÃO DOS DADOS NO MAP NO FECHAMENTO DA BARRA
if barstate.isconfirmed
    // Atualiza Retorno Acumulado
    float currentTotal = map.contains(dayReturnMap, currentDay) ? map.get(dayReturnMap, currentDay) : 0.0
    map.put(dayReturnMap, currentDay, currentTotal + barReturn)
    
    // Atualiza Contagem de Dias
    int currentCount = map.contains(dayCountMap, currentDay) ? map.get(dayCountMap, currentDay) : 0
    map.put(dayCountMap, currentDay, currentCount + 1)

// 4. PAINEL DE PERFORMANCE POR DIA (RENDERIZADO NA ÚLTIMA BARRA)
var table statTable = table.new(position.top_right, 3, 6, bgcolor=color.rgb(25, 25, 30), border_width=1)

if barstate.islast
    table.cell(statTable, 0, 0, "Dia da Semana", bgcolor=color.navy, text_color=color.white)
    table.cell(statTable, 1, 0, "Ocorrências", bgcolor=color.navy, text_color=color.white)
    table.cell(statTable, 2, 0, "Retorno Médio (%)", bgcolor=color.navy, text_color=color.white)
    
    daysList = array.new_string(0)
    array.push(daysList, "Segunda")
    array.push(daysList, "Terca")
    array.push(daysList, "Quarta")
    array.push(daysList, "Quinta")
    array.push(daysList, "Sexta")
    
    for [i, dName] in daysList
        if map.contains(dayCountMap, dName)
            cnt = map.get(dayCountMap, dName)
            tot = map.get(dayReturnMap, dName)
            avgRet = cnt > 0 ? (tot / cnt) : 0.0
            
            table.cell(statTable, 0, i + 1, dName, text_color=color.white)
            table.cell(statTable, 1, i + 1, str.tostring(cnt), text_color=color.yellow)
            table.cell(statTable, 2, i + 1, str.tostring(avgRet, "#.##") + "%", text_color=avgRet >= 0 ? color.green : color.red)

plot(barReturn, title="Retorno da Barra (%)", color=color.gray)
```
