# 43. Process crashes

Monitorar:

```js
app.on('render-process-gone', (event, webContents, details) => {
  // registrar reason / exitCode
})

app.on('child-process-gone', (event, details) => {
  // GPU, Utility, Network Service etc.
})
```

Possíveis motivos incluem:

- crash;
- killed;
- abnormal exit;
- OOM;
- launch failure;
- integrity failure;
- memory eviction.

Não criar loops automáticos infinitos de reload após crash.

Aplicar backoff ou limite de tentativas.

---

# 44. Utility Process

Usar `utilityProcess` quando trabalho Node deve ficar isolado do main.

Bom para:

- parsing pesado;
- serviços auxiliares;
- tarefas potencialmente instáveis;
- workloads independentes;
- módulos que não precisam executar no renderer.

Planejar:

- IPC;
- lifecycle;
- crash handling;
- cancellation;
- logging.

---

# 57. Performance

Princípios:

- medir antes de otimizar;
- evitar bloquear main process;
- evitar bloquear renderer;
- reduzir trabalho no startup;
- lazy-load módulos;
- não carregar dependências desnecessárias;
- reduzir bundle;
- minimizar I/O síncrono;
- limitar listeners;
- destruir janelas/views não utilizadas;
- considerar memória de múltiplos renderers.

---

# 58. Startup Performance

Evitar no startup:

```js
fs.readFileSync(...)
execSync(...)
grandes imports
parsing pesado
migrações bloqueantes
network sync-like orchestration
```

Preferir:

- carregamento incremental;
- Promise concorrentes;
- inicialização sob demanda;
- splash apenas quando justificável;
- janela visível quando conteúdo estiver pronto;
- cache cuidadosamente invalidado.

---

# 59. Renderer Performance

Aplicar boas práticas de frontend:

- virtualização de listas grandes;
- evitar layouts excessivos;
- reduzir re-render;
- otimizar imagens;
- usar requestAnimationFrame apropriadamente;
- considerar workers para CPU;
- evitar IPC de alta frequência sem necessidade.

IPC não deve ser usado como substituto para estado local do frontend.

---

# 60. Memory Management

Problemas comuns:

- BrowserWindow escondida mas nunca destruída;
- listeners nunca removidos;
- closures mantendo objetos grandes;
- timers;
- WebContents órfãos;
- caches ilimitados;
- imagens grandes;
- múltiplos renderers.

Ao fechar recursos, garantir cleanup.

---

# 100. Error Handling

Main:

- capturar falhas esperadas;
- enriquecer contexto;
- não vazar detalhes sensíveis ao renderer.

IPC:

```js
return {
  ok: false,
  code: 'FILE_NOT_FOUND'
}
```

pode ser preferível a enviar stack interna completa.

Renderer deve apresentar erros humanos.

Logs podem conter stack técnica sanitizada.

---

# 101. Cancellation

Operações longas precisam considerar cancelamento:

- downloads;
- parsing;
- indexing;
- network;
- export;
- child processes.

Não deixar promises, workers ou processos trabalhando após janela/feature ser
fechada.

---

# 109. Multi-profile

Use sessões/partitions distintas para:

- contas isoladas;
- browsing contexts;
- tenants;
- auth separada.

Não misturar cookies de tenants por conveniência.

---

