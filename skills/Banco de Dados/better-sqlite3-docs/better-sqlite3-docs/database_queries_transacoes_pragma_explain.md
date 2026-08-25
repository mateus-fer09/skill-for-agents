# Database — queries, transações, PRAGMA e EXPLAIN

## prepare(string) -> Statement

Cria um prepared statement a partir de uma única string SQL.

```js
const stmt = db.prepare('SELECT name, age FROM cats');
```

Prepared statements são o mecanismo principal para executar SQL parametrizado.

## transaction(function) -> function

Cria uma função transacional síncrona. Ao invocá-la:

- uma transação é iniciada;
- retorno normal implica commit;
- exceção implica rollback e propagação do erro.

Argumentos e valor de retorno são repassados entre a função transacional e a função original. O binding de `this` também é preservado.

### Transações aninhadas

Uma função criada por `db.transaction()` pode chamar outra. Nesse caso, a transação interna vira um savepoint. Se a função interna falhar, ocorre rollback até o savepoint; o erro é relançado. Se o erro escapar da função externa, a transação externa também é revertida.

### Modos disponíveis

A função resultante possui variantes:

- chamada normal → `BEGIN`;
- `.deferred(...)` → `BEGIN DEFERRED`;
- `.immediate(...)` → `BEGIN IMMEDIATE`;
- `.exclusive(...)` → `BEGIN EXCLUSIVE`.

### Regras críticas

- Não misture transações gerenciadas por `db.transaction()` com `COMMIT` ou `ROLLBACK` manuais dentro da função.
- Não use funções `async` com `db.transaction()`; após o primeiro `await`, a função já retornou do ponto de vista da transação.
- SQLite pode forçar rollback em alguns cenários, inclusive conflitos e erros específicos. Ao capturar erros dentro de uma transação, consulte `db.inTransaction` antes de continuar.
- Quando a transação tiver sido revertida automaticamente, normalmente o comportamento correto é relançar o erro.

## pragma(string, [options]) -> results

Executa um PRAGMA SQLite e normaliza seu retorno.

Por padrão, retorna array de objetos/linhas. Com `{ simple: true }`, retorna apenas a primeira coluna da primeira linha.

```js
db.pragma('cache_size = 32000');
const cacheSize = db.pragma('cache_size', { simple: true });
```

Prefira `db.pragma()` para PRAGMAs, em vez de prepared statements genéricos.

## explain(string) -> array

Executa `EXPLAIN` sobre a instrução fornecida.

- SQL normal → bytecode/virtual machine instructions.
- Prefixo `QUERY PLAN` → plano de consulta de mais alto nível.

```js
db.explain('SELECT * FROM cats WHERE name = ?');
db.explain('QUERY PLAN SELECT * FROM cats WHERE name = ?');
```

Parâmetros podem permanecer sem binding nesse método, pois o SQL é inspecionado, não executado.
