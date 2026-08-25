# Database — backup e serialização

## backup(destination, [options]) -> Promise

Inicia um backup online e retorna uma Promise.

- Em sucesso, a Promise resolve com informações de páginas e `remainingPages = 0`.
- Em falha, rejeita com `Error`.
- `options.attached` permite selecionar um banco anexado em vez do principal.
- O arquivo resultante é um banco SQLite normal.

O banco pode continuar sendo utilizado durante o backup.

### Concorrência durante backup

- Alterações feitas pela mesma conexão são incorporadas ao backup.
- Alterações feitas por outra conexão podem forçar reinício do processo de backup.
- Para backup online previsível, é recomendável centralizar mutações em uma única conexão.

### progress

`options.progress` recebe um objeto com:

- `totalPages` — total de páginas do banco de origem naquele momento;
- `remainingPages` — páginas restantes.

O retorno do callback controla quantas páginas são copiadas no ciclo seguinte.

- padrão aproximado: 100 páginas por ciclo;
- retornar `0` pausa efetivamente o avanço;
- lançar uma exceção aborta o backup.

Se a conexão pai for fechada, backups pendentes são abortados.

A documentação recomenda não ajustar a quantidade de páginas sem medir impacto no workload real.

## serialize([options]) -> Buffer

Retorna um `Buffer` com o conteúdo serializado do banco.

`options.attached` permite serializar um banco anexado específico.

O Buffer pode:

- ser persistido em disco como arquivo SQLite;
- ser fornecido ao construtor para abrir um banco em memória.

```js
const buffer = db.serialize();
db.close();
const memoryDb = new Database(buffer);
```
