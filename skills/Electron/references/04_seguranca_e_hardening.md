# 15. `shell.openExternal`

Nunca passar URL não confiável diretamente.

Errado:

```js
shell.openExternal(userProvidedUrl)
```

Correto:

```js
function isAllowedExternalUrl(raw) {
  try {
    const url = new URL(raw)

    return (
      url.protocol === 'https:' &&
      ['docs.example.com', 'example.com'].includes(url.hostname)
    )
  } catch {
    return false
  }
}
```

---

# 18. Context Isolation

`contextIsolation` deve permanecer habilitado.

Motivo:

- separa o contexto JavaScript da página do contexto do preload;
- reduz possibilidade de interferência entre código da página e APIs privilegiadas;
- dificulta escalada de XSS para comprometimento nativo.

Usar:

```js
webPreferences: {
  contextIsolation: true
}
```

O preload deve usar `contextBridge`.

---

# 19. Sandbox

Manter sandbox de renderers habilitado.

```js
webPreferences: {
  sandbox: true
}
```

Não desabilitar sem motivo técnico documentado.

Código Node privilegiado deve permanecer no main, utility process ou preload
controlado.

---

# 20. Node Integration

Para conteúdo remoto:

```js
nodeIntegration: false
```

Regra absoluta:

> Nunca habilitar integração Node para conteúdo remoto não confiável.

Mesmo para conteúdo local, preferir arquitetura sem Node direto no renderer.

---

# 21. Content Security Policy

Definir CSP restritiva.

Exemplo mínimo para app local:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;"
>
```

Adaptar conforme requisitos reais.

Evitar:

- `unsafe-eval`;
- `unsafe-inline` sem necessidade;
- wildcards amplos;
- origens genéricas;
- scripts remotos desnecessários.

---

# 22. Segurança de conteúdo

Checklist mínimo obrigatório:

- carregar recursos externos somente via protocolos seguros;
- não habilitar Node para conteúdo remoto;
- manter `contextIsolation`;
- manter sandbox;
- configurar permission handlers;
- não desabilitar `webSecurity`;
- usar CSP;
- não habilitar `allowRunningInsecureContent`;
- evitar experimental features;
- evitar `enableBlinkFeatures`;
- restringir `<webview>`;
- limitar navegação;
- limitar novas janelas;
- validar `shell.openExternal`;
- manter Electron atualizado;
- validar sender de IPC;
- preferir protocolos customizados a `file://` quando aplicável;
- avaliar Electron Fuses;
- nunca expor APIs Electron completas ao conteúdo não confiável.

---

# 23. Permission Handling

Para sessões que carregam conteúdo remoto, controlar permissões.

Exemplo conceitual:

```js
session.defaultSession.setPermissionRequestHandler(
  (webContents, permission, callback, details) => {
    const allowed =
      isTrustedOrigin(details.requestingUrl) &&
      permission === 'notifications'

    callback(allowed)
  }
)
```

Aplicar princípio de menor privilégio.

Não usar `callback(true)` genericamente.

---

# 25. Protocolos customizados

Preferir protocolo customizado bem definido para recursos da aplicação quando
o design exigir origin semantics adequadas.

Exemplo conceitual:

```text
app://bundle/index.html
```

Ao registrar protocolos:

- validar caminhos;
- impedir traversal;
- definir privilégios mínimos;
- restringir MIME types;
- não criar ponte genérica para filesystem;
- não aceitar URL arbitrária sem parsing seguro.

---

# 26. `<webview>`

Usar com cautela.

Antes de adotar `<webview>`, avaliar se `WebContentsView` atende melhor.

Se `<webview>` for usado:

- não habilitar `allowpopups`;
- não habilitar Node;
- verificar `src`;
- validar opções no evento de criação;
- limitar navegação;
- limitar novas janelas;
- tratar preload do webview como código privilegiado.

---

# 40. Safe Storage

`safeStorage` permite criptografia usando facilities do sistema operacional.

Usar para dados sensíveis pequenos quando apropriado.

Não assumir que:

- criptografia equivale a gerenciamento completo de secrets;
- qualquer ambiente Linux possui backend seguro configurado;
- o usuário local privilegiado não pode acessar dados.

Nunca hardcodar secrets no código empacotado.

---

# 51. Shell Integration

`shell` pode:

- abrir caminho;
- mostrar item em pasta;
- abrir URL externa;
- manipular trash.

Como é API poderosa:

- aceitar apenas paths/URLs validados;
- evitar comandos arbitrários;
- não construir shell command strings.

---

# 68. Segurança de filesystem

Ao receber paths:

- normalizar;
- resolver;
- verificar root permitido;
- evitar `../`;
- verificar symlinks quando relevante;
- validar extensão;
- validar tamanho;
- validar tipo real quando necessário.

Nunca permitir:

```js
ipcMain.handle('fs:read', (_, path) =>
  fs.promises.readFile(path)
)
```

como API genérica para renderer não confiável.

---

# 69. Segurança de comandos

Evitar:

```js
exec(userInput)
```

Evitar construir strings shell.

Se subprocesso for necessário:

```js
spawn(binary, args, {
  shell: false
})
```

e validar:

- binary;
- argumentos;
- cwd;
- environment.

---

# 70. Web Security

Não desabilitar:

```js
webSecurity: false
```

sem justificativa excepcional.

Se CORS, CSP ou origem estiver causando erro, corrigir arquitetura/origem,
não remover a proteção global.

---

# 71. Insecure Content

Não habilitar:

```js
allowRunningInsecureContent: true
```

Conteúdo HTTPS não deve carregar recursos HTTP.

---

# 72. Experimental Features

Evitar:

- `experimentalFeatures`;
- `enableBlinkFeatures`;

exceto quando requisito explícito e riscos forem compreendidos.

---

# 73. Certificates

`certificate-error` permite customização da validação TLS.

Default:

> rejeitar certificados inválidos.

Nunca escrever:

```js
app.on('certificate-error', (event, wc, url, error, certificate, callback) => {
  event.preventDefault()
  callback(true)
})
```

genericamente em produção.

Se pinning/custom trust for necessário:

- validar host;
- validar certificado;
- validar fingerprint;
- tratar rotação;
- considerar implicações operacionais.

---

# 74. Authentication

Evento `login` pode fornecer credenciais para autenticação HTTP/proxy.

Nunca:

- hardcodar senha;
- logar credenciais;
- enviar secrets ao renderer sem necessidade.

Preferir secret storage apropriado.

---

# 91. Electron Fuses

Fuses permitem restringir determinadas capacidades no binário Electron.

O agente deve avaliar fuses apropriados para hardening do build.

Como opções e defaults podem mudar, consultar documentação da versão alvo
antes de recomendar configuração exata.

Princípio:

> desabilitar no binário capacidades que o produto não precisa reduz superfície
> de ataque.

---

# 98. Security Baseline para BrowserWindow

Default recomendado pela skill:

```js
const window = new BrowserWindow({
  webPreferences: {
    preload,
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    webSecurity: true,
    allowRunningInsecureContent: false
  }
})
```

Não adicionar opções inseguras sem requisito documentado.

---

# 118. Renderer Compromise Model

Assumir que XSS pode executar JavaScript no renderer.

A arquitetura deve garantir que um XSS ainda não consiga:

- executar shell;
- ler arquivos arbitrários;
- roubar secrets;
- instalar software;
- acessar APIs Electron arbitrárias.

Este é o principal motivo do design preload + IPC mínimo.

---

# 119. DOM Security

Evitar:

```js
element.innerHTML = untrusted
```

Preferir:

```js
element.textContent = untrusted
```

Quando HTML rico for necessário, usar sanitização robusta.

Frameworks reduzem alguns riscos, mas não eliminam XSS.

---

# 126. CSP e Frameworks

Ao usar Vite/Webpack/Next-like renderer tooling:

- dev server pode exigir CSP menos restrita em desenvolvimento;
- produção deve usar CSP restritiva;
- separar dev config de prod;
- não liberar `unsafe-eval` em produção apenas porque HMR precisou em dev.

---

# 127. Development Server

Durante dev:

```text
http://localhost:...
```

pode ser aceitável localmente, mas:

- não copiar política para produção;
- restringir navigation;
- garantir preload seguro;
- considerar porta/origin;
- não tratar localhost externo como implicitamente confiável.

---

# 128. Production Origin

Preferir uma origem estável e controlável.

Conforme arquitetura:

- custom protocol;
- arquivo local com cuidados;
- servidor local bem projetado;
- HTTPS confiável.

A documentação recomenda evitar `file://` quando um protocolo customizado
oferecer modelo de segurança melhor.

---

# 160. Deep Link Security

Exemplo:

```text
myapp://open?file=...
```

não deve virar:

```js
fs.readFile(query.file)
```

sem containment e autorização.

Deep link é input externo.

---

# 165. URL Loading

Diferenciar:

```js
loadFile(...)
loadURL(...)
```

Para conteúdo incluído no app, `loadFile` pode ser suficiente.

Para custom protocol, usar URL correspondente.

Não concatenar URLs sem encoding/parsing.

---

# 167. Production Hardening

Antes de release:

- remover debug-only endpoints;
- revisar DevTools;
- CSP produção;
- fuses;
- source map policy;
- signing;
- update URLs;
- logging;
- secrets;
- IPC;
- permission handlers;
- navigation handlers;
- crash reporting.

---

# 170. Security Review Procedure

Quando solicitado a revisar projeto Electron, seguir:

## Etapa 1 — mapear contextos

Identificar:

- main entry;
- preload;
- renderer;
- views/webviews;
- utility processes.

## Etapa 2 — revisar BrowserWindow

Procurar:

- `nodeIntegration: true`;
- `contextIsolation: false`;
- `sandbox: false`;
- `webSecurity: false`;
- `allowRunningInsecureContent`;
- preload remoto;
- experimental flags.

## Etapa 3 — revisar IPC

Procurar:

- channels genéricos;
- ausência de validation;
- ausência de sender check;
- fs/shell/exec genérico;
- event forwarding.

## Etapa 4 — revisar navegação

Procurar:

- loadURL dinâmico;
- will-navigate;
- setWindowOpenHandler;
- openExternal.

## Etapa 5 — revisar conteúdo

- CSP;
- XSS;
- HTML injection;
- remote scripts.

## Etapa 6 — sistema

- filesystem;
- shell;
- child_process;
- secrets;
- protocol handlers.

## Etapa 7 — release

- signing;
- updater;
- dependencies;
- Electron version;
- fuses.

---

# 173. Common Anti-patterns

## Anti-pattern 1

```js
webPreferences: {
  nodeIntegration: true,
  contextIsolation: false
}
```

## Anti-pattern 2

```js
window.electron = require('electron')
```

## Anti-pattern 3

```js
ipcMain.handle('exec', (_, cmd) => exec(cmd))
```

## Anti-pattern 4

```js
ipcMain.handle('read-file', (_, path) =>
  fs.promises.readFile(path, 'utf8')
)
```

## Anti-pattern 5

```js
shell.openExternal(urlFromRenderer)
```

## Anti-pattern 6

```js
setWindowOpenHandler(() => ({ action: 'allow' }))
```

## Anti-pattern 7

```js
webSecurity: false
```

## Anti-pattern 8

```js
callback(true) // para qualquer certificate-error
```

---

# 174. Safe Default Decision Rules

Quando houver duas soluções funcionais, escolher:

```text
mais isolada > mais privilegiada
API específica > API genérica
IPC tipado > command bus genérico
local trusted content > remote executable content
async > sync blocking I/O
utility process > bloquear main
WebContentsView moderno > API deprecated
URL parser > string matching
allowlist > denylist
least privilege > convenience
```

---

# 181. Security Diagnostic Order

1. remote content?
2. Node integration?
3. context isolation?
4. sandbox?
5. CSP?
6. IPC?
7. navigation?
8. new windows?
9. external URLs?
10. filesystem?
11. shell/exec?
12. protocols?
13. permissions?
14. dependencies/version?
15. fuses/build?

---

