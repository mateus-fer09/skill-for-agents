# Database — tabelas virtuais, extensões e exec

## table(name, definition) -> this

Registra uma virtual table produzida em JavaScript. As linhas não são armazenadas no arquivo SQLite; são geradas sob demanda por uma generator function.

### Definição direta

A definição precisa declarar `columns`. `rows` deve ser uma generator function.

Cada `yield` pode produzir:

- objeto cujas chaves correspondem às colunas;
- array cujos índices correspondem à ordem das colunas.

`db.table()` cria tabelas virtuais somente para leitura.

### Table-valued functions

Virtual tables podem receber parâmetros. Por padrão:

- a quantidade é inferida de `rows.length`;
- nomes automáticos são `$1`, `$2`, etc.

A opção `parameters` permite definir nomes explícitos.

Parâmetros de virtual tables são implementados como hidden columns e podem aparecer no result set.

Parâmetros omitidos chegam como `undefined`, o que pode ser usado para parâmetros obrigatórios e valores default.

Ao usar parâmetros JavaScript com valores default, `function.length` deixa de refletir parâmetros opcionais; nesses casos, declare `parameters` explicitamente.

### Factory de virtual tables

Quando o segundo argumento de `db.table()` é uma factory function, a tabela não é criada automaticamente. A factory define um módulo que pode ser instanciado com `CREATE VIRTUAL TABLE ... USING ...`.

Os argumentos do módulo chegam como strings arbitrárias separadas por vírgulas e devem ser interpretados pela aplicação. SQLite não permite bound parameters nesses module arguments.

`directOnly` também pode restringir virtual tables para impedir uso em VIEW, TRIGGER e estruturas de schema.

## loadExtension(path, [entryPoint]) -> this

Carrega uma extensão SQLite compilada na conexão atual.

A aplicação deve garantir que a extensão foi compilada/linkada para uma versão compatível do SQLite usado pela versão instalada de `better-sqlite3`.

## exec(string) -> this

Executa uma string SQL que pode conter várias instruções.

Características importantes:

- menos seguro que prepared statements;
- pior desempenho que prepared statements;
- apropriado principalmente para SQL vindo de fonte externa, como arquivos de migração;
- se uma instrução falhar, a execução para;
- rollback necessário deve ser feito manualmente.

```js
const migration = fs.readFileSync('migrate-schema.sql', 'utf8');
db.exec(migration);
```
