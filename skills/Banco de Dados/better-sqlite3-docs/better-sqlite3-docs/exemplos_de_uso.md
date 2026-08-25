# Exemplos de uso integrados

Os exemplos abaixo são reconstruções didáticas baseadas na API documentada, para facilitar uso por agentes sem duplicar a página original.

## CRUD básico

```js
const Database = require('better-sqlite3');
const db = new Database('app.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER
  )
`);

const insert = db.prepare('INSERT INTO users (name, age) VALUES (?, ?)');
const info = insert.run('Ana', 28);

const byId = db.prepare('SELECT * FROM users WHERE id = ?');
const user = byId.get(info.lastInsertRowid);

const list = db.prepare('SELECT * FROM users ORDER BY id');
const users = list.all();
```

## Inserção em lote com transação

```js
const insert = db.prepare('INSERT INTO users (name, age) VALUES (@name, @age)');

const insertMany = db.transaction((users) => {
  for (const user of users) {
    insert.run(user);
  }
});

insertMany([
  { name: 'Ana', age: 28 },
  { name: 'Bruno', age: 31 },
]);
```

## Iterator para resultado grande

```js
const stmt = db.prepare('SELECT * FROM users');
for (const user of stmt.iterate()) {
  // processa uma linha por vez
}
```

## Primeira coluna com pluck

```js
const names = db
  .prepare('SELECT name FROM users ORDER BY name')
  .pluck()
  .all();
```

## PRAGMA simples

```js
const pageSize = db.pragma('page_size', { simple: true });
```

## Banco serializado em memória

```js
const snapshot = db.serialize();
const memoryDb = new Database(snapshot);
```

## Tratamento por código SQLite

```js
try {
  db.prepare('INSERT INTO users (id, name) VALUES (?, ?)').run(1, 'Ana');
} catch (err) {
  if (err && typeof err.code === 'string') {
    console.error(err.code);
  }
  throw err;
}
```
