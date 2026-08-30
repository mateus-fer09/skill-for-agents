---
title: "Class: Cookies"
description: "## Class: Cookies"
topics:
  - "Api"
keywords:
  - "Class: Cookies"
  - "Cookies"
  - "cookies"
  - "event"
  - "cookie"
  - "cause"
  - "inserted"
  - "explicit"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/api/cookies"
---

# Class: Cookies

## Class: Cookies

> 

Query and modify a session's cookies.

Process: [Main](/pt/docs/latest/glossary#main-process)  
 *This class is not exported from the `'electron'` module. Ele é somente disponibilizado como um valor de retorno de outros métodos na API Electron.*

Instâncias da classe `Cookies` são acessadas através da propriedade `cookies` de uma `Sessão`.

Como por exemplo:

```javascript
const { session } = require('electron')  
  
// Query all cookies.  
session.defaultSession.cookies.get({})  
  .then((cookies) => {  
    console.log(cookies)  
  }).catch((error) => {  
    console.log(error)  
  })  
  
// Query all cookies associated with a specific url.  
session.defaultSession.cookies.get({ url: 'https://www.github.com' })  
  .then((cookies) => {  
    console.log(cookies)  
  }).catch((error) => {  
    console.log(error)  
  })  
  
// Set a cookie with the given cookie data;  
// may overwrite equivalent cookies if they exist.  
const cookie = { url: 'https://www.github.com', name: 'dummy_name', value: 'dummy' }  
session.defaultSession.cookies.set(cookie)  
  .then(() => {  
    // success  
  }, (error) => {  
    console.error(error)  
  })  

```

### Eventos de instância

Os seguintes eventos estão disponíveis em instâncias de `Cookies`:

#### Evento: 'changed'

Retorna:

- `event` Event

- `cookie` [Cookie](/pt/docs/latest/api/structures/cookie) - The cookie that was changed.

- `cause` string - The cause of the change with one of the following values:

  - `inserted` -  The cookie was inserted.

  - `inserted-no-change-overwrite` - The newly inserted cookie overwrote a cookie but did not result in any change. For example, inserting an identical cookie will produce this cause.

  - `inserted-no-value-change-overwrite` - The newly inserted cookie overwrote a cookie but did not result in any value change, but it's web observable (e.g. updates the expiry).

  - `explicit` - The cookie was deleted directly by a consumer's action.

  - `overwrite` - O cookie foi removido automaticamente devido à uma ação de inserção que o sobrescreveu.

  - `expired` - O cookie foi automaticamente removido conforme expirou.

  - `evicted` - The cookie was automatically evicted during garbage collection.

  - `expired-overwrite` - The cookie was overwritten with an already-expired expiration date.

- `removed` boolean - `true` se o cookie foi removido, `false` caso contrário.

Emitido quando um cookie é modificado devido à adição, edição, remoção ou expiração.

### Métodos de Instância

Os metódos a seguir estão disponíveis em instâncias `de Cookies`:

#### `cookies.get(filter)`

- `filter` Object

  - `url` string (optional) - Retrieves cookies which are associated with `url`. Empty implies retrieving cookies of all URLs.

  - `name` string (opcional) - Filtra cookies por nome.

  - `domain` string (opcional) - Recupera cookies nos quais os domínios sejam iguais ou subdomínios de `domain`.

  - `path` string (opcional) - Recupera cookies nos quais o caminho seja igual a `path`.

  - `secure` boolean (opcional) - Filtra cookies pela propriedade Secure.

  - `session` boolean (optional) - Filters out session or persistent cookies.

  - `httpOnly` boolean (optional) - Filters cookies by httpOnly.

Returns `Promise<Cookie[]>` - A promise which resolves an array of cookie objects.

Sends a request to get all cookies matching `filter`, and resolves a promise with the response.

#### `cookies.set(details)`

- Objeto `details`

  - `url` string - The URL to associate the cookie with. The promise will be rejected if the URL is invalid.

  - `name` string (optional) - The name of the cookie. Empty by default if omitted.

  - `value` string (optional) - The value of the cookie. Empty by default if omitted.

  - `domain` string (opcional) - O domínio do cookie; isto será normalizado com um ponto no início para que ele também seja válido para subdomínios. Empty by default if omitted.

  - `path` string (opcional) - O Diretório do cookie. Empty by default if omitted.

  - `secure` boolean (optional) - Whether the cookie should be marked as Secure. Defaults to false unless [Same Site=None](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#samesitenone_requires_secure) attribute is used.

  - `httpOnly` boolean (optional) - Whether the cookie should be marked as HTTP only. Defaults to false.

  - `expirationDate` Double (optional) - The expiration date of the cookie as the number of seconds since the UNIX epoch. If omitted then the cookie becomes a session cookie and will not be retained between sessions.

  - `sameSite` string (optional) - The [Same Site](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies) policy to apply to this cookie.  Pode ser `unspecified`, `no_restriction`, `lax` ou `strict`.  Por padrão é `lax`.

Returns `Promise<void>` - A promise which resolves when the cookie has been set.

Sets a cookie with `details`.

#### `cookies.remove(url, name)`

- `url` string - A URL associada com o cookie.

- `name` string - O nome do cookie a ser removido.

Returns `Promise<void>` - A promise which resolves when the cookie has been removed.

Removes the cookies matching `url` and `name`.

#### `cookies.flushStore()`

Returns `Promise<void>` - A promise which resolves when the cookie store has been flushed.

Escreve qualquer cookie que não tenha sido escrito no disco.

Cookies written by any method will not be written to disk immediately, but will be written every 30 seconds or 512 operations.

Calling this method can cause the cookie to be written to disk immediately.[Editar esta página](https://github.com/electron/electron/edit/main/docs/api/cookies.md)
