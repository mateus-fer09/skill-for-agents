---
title: "Catálogo de Erros, Warnings e Soluções — Pine Script v5 / v6"
description: "Diagnóstico completo de erros do compilador (CE10101, CE10117), erros de runtime (RE10139, RE10143), avisos (CW10003) e guia prático de resolução."
category: "Bibliotecas, Boas Práticas e Troubleshooting"
version: "Pine Script v5 / v6"
tags:
  - compilation-errors
  - runtime-errors
  - warnings
  - troubleshooting
  - debugging
  - pine-editor
---

# Catálogo de Erros, Warnings e Soluções no Pine Script

Guia de diagnóstico e resolução para os erros mais comuns emitidos pelo compilador e pelo runtime do TradingView Pine Script.

---

## 1. Erros de Compilação (Compilation Errors - CE)

### CE10101: `Type mismatch / Cannot assign type`
- **Causa**: Tentativa de atribuir um tipo incompatível a uma variável ou passar um qualificador inadequado (ex: passar `series string` onde se espera `simple string`).
- **Solução**: Use funções de conversão explícita (`int()`, `float()`, `str.tostring()`) ou assegure que parâmetros de funções que exigem `simple` (como `timeframe` em `request.security`) recebam variáveis de valor fixo.

### CE10117: `Undeclared identifier / Variable already defined`
- **Causa**: Utilizar o operador `=` para alterar uma variável existente (causando redeclaração inválida) em vez do operador de reatribuição `:=`.
- **Solução**: Substitua `=` por `:=` ao mutar variáveis previamente declaradas.

---

## 2. Erros de Tempo de Execução (Runtime Errors - RE)

### RE10139: `The study requested historical values going back further than allowed (max_bars_back)`
- **Causa**: O script tentou acessar um valor histórico além da capacidade do buffer alocado pelo compilador.
- **Solução**: Declare `max_bars_back = 500` na declaração `indicator()` ou use a função `max_bars_back(variavel, 500)`.

### RE10143: `Array index out of bounds`
- **Causa**: Chamada a `array.get(arr, idx)` onde `idx >= array.size(arr)` ou `idx < 0`.
- **Solução**: Verifique sempre o tamanho do array antes de acessar um índice: `if array.size(arr) > idx`.

### RE: `Loop is taking too long to execute (over 500k operations)`
- **Causa**: Laço `while` ou `for` com condição de término inalcançável gerando loop infinito.
- **Solução**: Garanta que o contador do laço avance e use a instrução `break` como trava de segurança.

---

## 3. Avisos do Compilador (Compiler Warnings - CW)

### CW10003: `Function call has side-effects / Deprecated syntax`
- **Causa**: Uso de funções legadas da versão 4 sem namespace (ex: `sma()` em vez de `ta.sma()`, `study()` em vez de `indicator()`).
- **Solução**: Atualize o namespace para o padrão oficial v5/v6.

---

## 4. Guia de Resolução Rápida (Flowchart)

```mermaid
flowchart TD
    E[Erro Detectado no Pine Editor] --> T{Qual é o tipo de erro?}
    T -->|Erro de Compilação CE| C1[Verificar Qualificadores: const / input / simple / series]
    C1 --> C2[Verificar Reatribuição: substituir = por :=]
    T -->|Erro de Buffer max_bars_back| B1[Adicionar max_bars_back=500 em indicator()]
    T -->|Erro de Array Out of Bounds| A1[Validar array.size() antes de array.get()]
    T -->|Script não plota| P1[Verificar se overlay=true e se a escala é compatível]
```
