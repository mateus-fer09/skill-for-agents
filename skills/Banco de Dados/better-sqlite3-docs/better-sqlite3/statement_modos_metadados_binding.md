# Statement — modos de retorno, metadados e binding permanente

## pluck([toggleState]) -> this

Faz o statement retornar apenas o valor da primeira coluna de cada linha, em vez do objeto de linha inteiro.

Ativação: `pluck()` ou `pluck(true)`; desativação: `pluck(false)`.

É mutuamente exclusivo com `expand` e `raw`.

## expand([toggleState]) -> this

Retorna dados agrupados por tabela de origem. Cada chave de primeiro nível representa uma tabela; colunas derivadas de expressão/subquery aparecem no namespace especial `$`.

É útil em JOINs quando tabelas possuem nomes de colunas sobrepostos.

É mutuamente exclusivo com `pluck` e `raw`.

## raw([toggleState]) -> this

Retorna cada linha como array em vez de objeto. É voltado principalmente a otimização de performance em grandes volumes.

Use `columns()` para recuperar metadados/nome das colunas.

É mutuamente exclusivo com `pluck` e `expand`.

## columns() -> array<object>

Retorna metadados das colunas do resultado.

Cada entrada possui:

- `name` — nome/alias no resultado;
- `column` — coluna original ou `null` em expressão/subquery;
- `table` — tabela original ou `null`;
- `database` — banco original ou `null`;
- `type` — tipo declarado ou `null`.

Se o schema mudar, metadados de statements existentes podem ficar desatualizados até nova execução. Por isso, é preferível chamar `columns()` após `get()`, `all()` ou `iterate()` quando mudanças de schema forem possíveis.

## bind([...bindParameters]) -> this

Vincula parâmetros permanentemente ao statement.

Depois de `bind()`, não é permitido fornecer parâmetros temporários a `run`, `get`, `all` ou `iterate`.

É uma otimização útil quando o mesmo statement é executado repetidamente com os mesmos argumentos.

## toString() -> string

Retorna a string SQL do statement.

- Sem binding permanente: retorna o SQL original com placeholders.
- Com `bind()`: retorna SQL expandido com os valores permanentemente vinculados.

Parâmetros temporários usados em `get()`/`run()` etc. não aparecem em `toString()`. Para observar SQL executado com valores temporários, use `verbose` ao criar `Database`.

## Propriedades de Statement

- `database` — objeto `Database` pai.
- `source` — SQL original usado para preparar o statement.
- `reader` — indica se retorna dados.
- `readonly` — indica se o statement é classificado como somente leitura; funções SQL ainda podem produzir efeitos colaterais indiretos.
- `busy` — indica execução ativa via `iterate()`.
