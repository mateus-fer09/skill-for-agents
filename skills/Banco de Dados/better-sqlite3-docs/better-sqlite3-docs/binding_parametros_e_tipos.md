# Binding de parâmetros e tipos SQLite ↔ JavaScript

## Parâmetros anônimos

Use `?` no SQL. Os valores podem ser fornecidos como argumentos individuais ou dentro de arrays. Arrays múltiplos também podem ser combinados; os valores são consumidos na ordem dos placeholders.

```js
const stmt = db.prepare('INSERT INTO people VALUES (?, ?, ?)');
stmt.run('John', 'Smith', 45);
```

## Parâmetros nomeados

São aceitas as três sintaxes SQLite:

- `@foo`
- `:foo`
- `$foo`

Os valores são passados em um objeto JavaScript cujas propriedades correspondem aos nomes sem o prefixo.

As sintaxes podem ser misturadas no mesmo SQL.

## Mistura de anônimos e nomeados

É possível combinar placeholders `?` e parâmetros nomeados. Nesse caso, passe valores posicionais e objetos de parâmetros conforme necessário para satisfazer todos os bindings.

## Conversão de tipos

| SQLite | JavaScript |
|---|---|
| `NULL` | `null` |
| `REAL` | `number` |
| `INTEGER` | `number` ou `BigInt` |
| `TEXT` | `string` |
| `BLOB` | `Buffer` |

## Regra de segurança

Para valores dinâmicos, use binding de parâmetros. Não concatene input não confiável em SQL.
