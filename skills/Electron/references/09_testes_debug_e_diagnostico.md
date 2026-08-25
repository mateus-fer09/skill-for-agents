# 42. Crash Reporter

`crashReporter` permite coleta de relatórios de crash.

Requisitos:

- política de privacidade;
- endpoint adequado;
- não enviar PII desnecessária;
- limitar metadata;
- observar consentimento e requisitos legais;
- correlacionar logs de forma segura.

---

# 47. netLog e contentTracing

Ferramentas para diagnóstico:

- `netLog` para tráfego/rede Chromium;
- `contentTracing` para performance tracing.

Arquivos de diagnóstico podem conter dados sensíveis.

Nunca compartilhar logs completos sem revisão.

---

# 76. DevTools

Em desenvolvimento:

```js
win.webContents.openDevTools()
```

Em produção:

- decidir política explicitamente;
- não tratar ocultação do DevTools como mecanismo de segurança;
- nunca armazenar secrets supondo que usuário não inspecionará código.

Código Electron distribuído deve ser considerado acessível ao usuário final.

---

# 77. Logging

Separar níveis:

- debug;
- info;
- warn;
- error;
- fatal.

Logs devem incluir contexto útil:

- processo;
- versão;
- OS;
- operation id;
- reason;
- stack.

Não logar:

- tokens;
- senhas;
- cookies;
- dados pessoais desnecessários;
- payloads completos sem filtro.

---

# 78. Testing

Estratégia recomendada:

```text
Unit tests
    serviços puros e validação

Integration tests
    main/preload/IPC

Electron E2E
    janelas + renderer + OS interactions

Packaging smoke tests
    aplicativo empacotado
```

Não depender apenas de testes do frontend em navegador comum.

---

# 79. Automated Testing

Testes Electron podem utilizar ferramentas de automação compatíveis com
Chromium/Electron.

Práticas:

- iniciar app em estado previsível;
- diretório `userData` temporário;
- mocks somente quando apropriado;
- evitar testes flakey baseados em sleep;
- aguardar eventos/condições;
- testar app empacotado em CI quando possível.

---

# 80. Debugging

Ferramentas:

- DevTools renderer;
- Node inspector no main;
- logs;
- crash dumps;
- `netLog`;
- `contentTracing`;
- process events;
- Electron Fiddle para reproduções mínimas.

Ao depurar, isolar primeiro:

```text
main?
preload?
renderer?
IPC?
Chromium?
Node?
OS?
packaging?
assinatura/permissão?
```

---

# 81. Electron Fiddle

Útil para:

- testar APIs;
- criar reprodução mínima;
- verificar comportamento;
- compartilhar exemplo;
- comparar versões.

Não usar Fiddle como arquitetura de produção.

---

# 179. Troubleshooting Matrix

## Janela não abre

Verificar:

- `app.whenReady`;
- entry point;
- exceção no main;
- preload path;
- `loadFile`/`loadURL`;
- CSP;
- packaging paths.

## `require is not defined` no renderer

Provavelmente esperado.

Não habilitar Node.

Mover capacidade necessária para preload.

## `ipcRenderer` indisponível

Verificar preload e contextBridge.

## IPC não responde

Verificar:

- channel name;
- `handle` vs `on`;
- preload;
- sender;
- promise rejection;
- handler registrado antes do uso.

## Funciona em dev, falha empacotado

Verificar:

- `__dirname`;
- asar;
- assets;
- native modules;
- paths absolutos;
- env vars;
- CSP;
- signing.

## Funciona no Windows, falha no macOS

Verificar API platform-specific e permissions/entitlements.

## Renderer crasha

Capturar `render-process-gone`.

Verificar:

- OOM;
- GPU;
- native modules;
- conteúdo pesado;
- crash dump.

---

# 180. Performance Diagnostic Order

1. medir startup;
2. medir main blocking;
3. medir renderer CPU;
4. medir memory;
5. contar renderers;
6. inspecionar sync I/O;
7. analisar bundle/imports;
8. avaliar IPC frequency;
9. usar tracing/profiler;
10. otimizar apenas gargalo medido.

---

