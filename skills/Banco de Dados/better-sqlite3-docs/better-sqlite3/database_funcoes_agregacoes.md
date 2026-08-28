# Database — funções SQL, agregações e window functions

## function(name, [options], function) -> this

Registra uma função JavaScript como função SQL.

Por padrão, a aridade é derivada de `function.length`. É possível registrar o mesmo nome com aridades diferentes. Registrar novamente o mesmo nome + mesma aridade substitui a versão anterior.

### Opções

- `varargs: true` — aceita qualquer quantidade de argumentos.
- `directOnly: true` — restringe uso a SQL de nível superior; impede uso em VIEW, TRIGGER e estruturas de schema como CHECK/DEFAULT.
- `deterministic: true` — marca a função como determinística, permitindo otimizações do SQLite em certos contextos.

Exemplo conceitual:

```js
db.function('add2', (a, b) => a + b);
const value = db.prepare('SELECT add2(?, ?)').pluck().get(12, 4);
```

## aggregate(name, options) -> this

Registra uma função agregadora definida em JavaScript.

### Ciclo básico

- `start` — valor inicial ou função que produz o estado inicial; se ausente, o estado começa como `null`.
- `step(acc, ...)` — chamado para cada linha; o retorno passa a ser o novo estado acumulado.
- `result(acc)` — opcional; transforma o acumulador no valor SQLite final.

Objetos JavaScript podem ser usados como contexto intermediário, desde que `result()` finalize em um valor válido para SQLite.

Se `step()` retornar `undefined`, o valor acumulado anterior é mantido.

As opções `varargs`, `directOnly` e `deterministic` também se aplicam a agregações.

## Window functions

Quando `inverse()` é fornecido, a agregação pode atuar como window function.

- `step()` adiciona uma linha à janela.
- `inverse()` remove uma linha da janela.
- `result()` pode ser chamado várias vezes durante a avaliação da janela.
