# 10. Paths e dados

APIs:

- `app.getAppPath()`
- `app.getPath(name)`
- `app.setPath(name, path)`
- `app.setAppLogsPath(path)`

Paths comuns:

- `home`
- `appData`
- `userData`
- `sessionData`
- `temp`
- `exe`
- `module`
- `desktop`
- `documents`
- `downloads`
- `music`
- `pictures`
- `videos`
- `recent`
- `logs`
- `crashDumps`

## Regra de armazenamento

Configurações da aplicação podem ficar em `userData`.

Evitar colocar arquivos grandes diretamente em `userData`.

Quando apropriado:

```js
const path = require('node:path')

const dataPath = path.join(
  app.getPath('userData'),
  'my-app-data'
)
```

`sessionData` pode conter grandes caches Chromium e pode ser separado de
`userData` quando necessário.

---

# 24. Session

`session` gerencia estado de navegador e rede.

Áreas importantes:

- cookies;
- cache;
- proxy;
- permissions;
- downloads;
- headers;
- requests;
- storage;
- certificates;
- custom partitions.

Partições:

```js
partition: 'persist:profile'
```

`persist:` cria armazenamento persistente.

Sem `persist:` a sessão é normalmente em memória.

Separar sessões quando perfis ou níveis de confiança forem distintos.

---

# 46. Net

`net` fornece networking via stack do Chromium.

Considerar quando comportamento Chromium é desejado:

- proxy;
- cookies/session;
- certificados;
- integração de autenticação.

Para código Node genérico, `fetch`, `https` ou bibliotecas Node podem ser
alternativas conforme o contexto.

Escolher conscientemente a stack de rede.

---

# 110. Cookies

Ao acessar cookies:

- aplicar escopo;
- Secure;
- HttpOnly;
- SameSite;
- expiration;
- domain/path.

Não copiar tokens de cookie para renderer se não for necessário.

---

# 111. Proxy

Session/net podem configurar proxy.

Validar:

- PAC;
- proxy URL;
- credentials;
- bypass;
- reload/resolution.

Não registrar credenciais de proxy em logs.

---

# 112. Custom Headers

Interceptação de requests pode adicionar headers.

Cuidado para não:

- vazar Authorization para domínio errado;
- aplicar token globalmente;
- modificar requests de terceiros;
- quebrar CORS/security semantics.

Aplicar filtro por origem.

---

# 113. WebRequest / request interception

Quando disponível no contexto/versão:

- registrar handlers com cuidado;
- evitar handlers pesados;
- limitar URLs;
- não criar proxy genérico inseguro.

Consultar API atual de `session.webRequest`.

---

# 120. URLs

Sempre usar parser:

```js
const url = new URL(input)
```

Validar explicitamente:

- protocol;
- hostname;
- port;
- pathname;
- origin.

Não confiar em regex improvisada quando `URL` atende.

---

# 121. Paths

Usar:

- `path.resolve`;
- `path.normalize`;
- `path.relative`;

para containment.

Exemplo conceitual:

```js
const candidate = path.resolve(root, input)
const relative = path.relative(root, candidate)

if (
  relative.startsWith('..') ||
  path.isAbsolute(relative)
) {
  throw new Error('Path outside allowed root')
}
```

---

# 122. Environment Variables

Variáveis de ambiente não são secret storage.

Podem ser úteis em:

- desenvolvimento;
- CI;
- configuração de build.

Não embarcar credenciais permanentes no bundle.

---

# 123. Secrets

Aplicações desktop distribuídas não conseguem esconder secret estático
perfeitamente do usuário local.

Não incluir:

- private API keys poderosas;
- signing keys;
- backend admin tokens.

Use backend para operações que exigem secrets de servidor.

---

# 124. API Keys

Chaves públicas destinadas a cliente devem:

- ter escopo mínimo;
- rate limit;
- domain/device/account controls quando suportado.

Nunca transformar aplicação Electron em custódia de secret de servidor.

---

# 125. OAuth

Para login OAuth:

- usar PKCE quando aplicável;
- state;
- redirect URI validado;
- deep link seguro;
- browser/system flow conforme provider;
- armazenar refresh tokens com cuidado.

Não implementar OAuth improvisado em `webview` sem necessidade.

---

# 159. Network Offline

Renderer pode detectar status web, mas isso não prova conectividade real.

Serviços devem tratar falhas de rede independentemente.

---

# 166. Environment Separation

Usar configuração explícita:

```text
development
test
production
```

Evitar detectar apenas por:

```js
process.env.NODE_ENV
```

se o tooling não garante valor correto.

Centralizar config.

---

