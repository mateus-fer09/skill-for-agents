# better-sqlite3 — Índice Mestre para Agentes de IA

Fonte primária: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md

## Propósito geral

`better-sqlite3` expõe uma API síncrona para trabalhar com SQLite em Node.js. O núcleo da API é composto por conexões `Database`, prepared statements (`Statement`), transações, PRAGMAs, backup/serialização, funções SQL definidas pelo usuário, agregações, tabelas virtuais, extensões nativas, tratamento de erros via `SqliteError` e binding de parâmetros.

## Regras e padrões absolutos

1. A abertura da conexão é síncrona; após `new Database(...)`, consultas podem ser executadas imediatamente.
2. Use prepared statements (`db.prepare(...)`) como caminho padrão para SQL parametrizado.
3. `db.exec(...)` aceita múltiplas instruções SQL, mas é menos seguro e menos eficiente que prepared statements; reserve-o principalmente para SQL externo, como arquivos de migração.
4. Nunca misture `db.transaction(...)` com `COMMIT`/`ROLLBACK` manuais dentro da função transacional gerenciada.
5. Funções passadas a `db.transaction(...)` não devem ser `async`.
6. Ao capturar um erro SQLite dentro de uma transação, verifique `db.inTransaction`; o SQLite pode ter feito rollback automático.
7. Para PRAGMAs, prefira `db.pragma(...)` em vez de prepared statements genéricos.
8. `Statement#get`, `all`, `iterate`, `pluck`, `expand`, `raw` e `columns` são relevantes somente para statements que retornam dados.
9. Os modos `pluck`, `expand` e `raw` são mutuamente exclusivos.
10. `Statement#bind(...)` faz binding permanente. Depois disso, o statement não aceita parâmetros temporários de execução.
11. `db.table(...)` cria tabelas virtuais somente de leitura.
12. Extensões carregadas por `db.loadExtension(...)` precisam ser compatíveis com a versão de SQLite utilizada pelo pacote.
13. `SqliteError.code` contém um extended result code do SQLite; erros SQLite normalmente indicam problema de uso/SQL e não necessariamente defeito em `better-sqlite3`.
14. Para consultas com parâmetros, use binding; não componha valores de usuário diretamente no SQL.
15. `Statement` não exige `finalize()` manual: a lib gerencia a finalização durante garbage collection ou fechamento do banco.

## Mapa de Contexto

- Leia `database_conexao_e_configuracao.md` SE a pergunta envolver criação/abertura do banco, `readonly`, `fileMustExist`, `timeout`, logging `verbose`, `nativeBinding`, propriedades da conexão ou fechamento.
- Leia `database_queries_transacoes_pragma_explain.md` SE a pergunta envolver `prepare()`, `transaction()`, savepoints, modos deferred/immediate/exclusive, PRAGMA, `EXPLAIN` ou `QUERY PLAN`.
- Leia `database_backup_serializacao.md` SE a pergunta envolver backup online, progresso de backup, pausa/cancelamento, serialização, Buffer ou banco em memória a partir de Buffer.
- Leia `database_funcoes_agregacoes.md` SE a pergunta envolver `db.function()`, funções SQL em JavaScript, `varargs`, `directOnly`, `deterministic`, `db.aggregate()`, `start`, `step`, `result`, `inverse` ou window functions.
- Leia `database_tabelas_virtuais_extensoes_exec.md` SE a pergunta envolver `db.table()`, generators, table-valued functions, parâmetros ocultos, factory de virtual table, `CREATE VIRTUAL TABLE`, extensões SQLite ou `db.exec()`.
- Leia `statement_execucao_e_resultados.md` SE a pergunta envolver `Statement#run`, `get`, `all`, `iterate`, `changes`, `lastInsertRowid`, retorno de linhas ou streaming/iteração.
- Leia `statement_modos_metadados_binding.md` SE a pergunta envolver `pluck`, `expand`, `raw`, `columns`, `bind`, `toString`, propriedades de `Statement` ou SQL expandido.
- Leia `binding_parametros_e_tipos.md` SE a pergunta envolver placeholders `?`, parâmetros nomeados `@`, `:`, `$`, mistura de bindings ou conversão de tipos SQLite ↔ JavaScript.
- Leia `erros_sqlite.md` SE a pergunta envolver `SqliteError`, `code`, extended result codes ou diagnóstico de falhas SQLite.
- Leia `exemplos_de_uso.md` SE o usuário pedir padrões de implementação ou exemplos integrando vários recursos.

## Estratégia recomendada para agentes

1. Identifique primeiro se a questão é de conexão, Database, Statement, binding ou erro.
2. Consulte apenas o módulo correspondente.
3. Consulte módulos adicionais somente quando houver dependência explícita, como `Statement` + binding.
4. Preserve prepared statements como padrão operacional para SQL parametrizado.
