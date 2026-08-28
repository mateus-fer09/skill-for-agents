# SqliteError e diagnóstico de erros

## class SqliteError

Erros gerados pelo SQLite são lançados como `SqliteError`, subclasse de `Error`.

Cada instância possui:

- `code: string` — extended result code SQLite, por exemplo um código de constraint específico.

A documentação orienta consultar os result codes oficiais do SQLite para entender o significado do erro.

Na maioria dos casos, um `SqliteError` indica uma condição ou uso relacionado ao SQLite, e não necessariamente um bug em `better-sqlite3`.

## Código desconhecido

Se SQLite produzir um código que a biblioteca não reconheça, `code` segue o formato:

`UNKNOWN_SQLITE_ERROR_NNNN`

onde `NNNN` representa o código numérico. Esse caso deve ser tratado como potencial bug de compatibilidade/reconhecimento da biblioteca.

## Uso em transações

Ao capturar um erro durante uma função `db.transaction()`, lembre que o próprio SQLite pode ter revertido a transação. Verifique:

```js
if (!db.inTransaction) {
  throw err;
}
```
