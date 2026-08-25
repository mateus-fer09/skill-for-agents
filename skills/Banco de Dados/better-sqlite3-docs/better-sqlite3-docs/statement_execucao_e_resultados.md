# Statement — execução e resultados

`Statement` representa uma única instrução SQL preparada.

A finalização manual não é necessária; o pacote libera statements durante garbage collection ou quando o banco associado é fechado.

## run([...bindParameters]) -> object

Executa o statement e retorna um objeto `info`.

### info.changes

Quantidade de linhas inseridas, atualizadas ou removidas diretamente pela operação. Alterações causadas por foreign-key actions ou triggers não entram nessa contagem.

### info.lastInsertRowid

`rowid` da última linha inserida diretamente pela instrução, ignorando inserções disparadas por triggers. Se a instrução não inseriu linhas, esse valor deve ser ignorado.

Falhas lançam `Error`.

## get([...bindParameters]) -> row | undefined

Somente para statements que retornam dados.

Executa e retorna a primeira linha como objeto. Se não houver linha, retorna `undefined`.

## all([...bindParameters]) -> array

Somente para statements que retornam dados.

Executa e retorna todas as linhas como array de objetos. Se não houver resultados, retorna `[]`.

## iterate([...bindParameters]) -> iterator

Somente para statements que retornam dados.

Retorna um iterator para consumir linhas uma por vez. É útil quando não se deseja materializar todo o resultado imediatamente.

Se você pretende consumir todas as linhas de qualquer forma, a documentação indica que `all()` tende a ser ligeiramente mais eficiente.

Se a execução falhar, um `Error` é lançado e o iterator é encerrado.

### Exemplo

```js
const stmt = db.prepare('SELECT * FROM cats');
for (const row of stmt.iterate()) {
  if (row.name === 'Joey') break;
}
```
