# Database — conexão, configuração e propriedades

Fonte: documentação oficial `docs/api.md`.

## new Database(path, [options])

Cria uma conexão SQLite. Se o arquivo não existir, ele é criado, salvo quando uma opção impedir isso. A operação de abertura é síncrona.

### Formas de banco

- Arquivo: passe um caminho, por exemplo `app.db`.
- Em memória: use `:memory:`.
- Temporário: use string vazia ou omita os argumentos.
- Buffer: um Buffer produzido por `db.serialize()` também pode ser usado para abrir um banco em memória.

### Opções

- `readonly` — abre a conexão somente para leitura. Padrão: `false`.
- `fileMustExist` — lança `Error` se o arquivo não existir. É ignorado para bancos in-memory, temporários ou conexões readonly. Padrão: `false`.
- `timeout` — tempo máximo, em milissegundos, para aguardar um banco bloqueado antes de `SQLITE_BUSY`. Padrão: `5000`.
- `verbose` — callback chamado com cada string SQL executada pela conexão. Padrão: `null`.
- `nativeBinding` — caminho para `better_sqlite3.node`, útil quando bundlers/build systems impedem a localização automática do addon nativo.

### Exemplo equivalente

```js
const Database = require('better-sqlite3');
const db = new Database('app.db', { verbose: console.log });
```

## close()

`db.close()` fecha a conexão. Depois disso, novos statements não podem ser criados nem statements existentes executados.

Um padrão comum é fechar o banco durante o encerramento do processo.

```js
process.on('exit', () => db.close());
```

## Propriedades de Database

- `db.open: boolean` — informa se a conexão está aberta.
- `db.inTransaction: boolean` — informa se há uma transação aberta.
- `db.name: string` — string usada para abrir a conexão.
- `db.memory: boolean` — indica banco em memória ou temporário.
- `db.readonly: boolean` — indica conexão criada em modo somente leitura.
