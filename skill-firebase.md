---
name: firebase-integration
description: Padrões para Firebase Authentication (email/senha, login Google, recuperação de senha) e regras de segurança do Firestore/Realtime Database. Use sempre que o usuário mencionar Firebase Auth, login com Google, recuperação/reset de senha, onAuthStateChanged, Firestore rules, Realtime Database rules, ou "proteger meus dados" num app que usa Firebase. Dá atenção especial a apps Electron/desktop, onde o fluxo de login com Google via popup tem armadilhas que não existem na web comum.
---

# Firebase Integration

Cobre os dois pilares que mais geram bug em produção: autenticação mal configurada (usuário não consegue entrar, ou o app confia em dado que não devia) e regras de segurança permissivas (qualquer um lê/escreve o banco inteiro). Use sempre o **SDK modular v9+** (`firebase/app`, `firebase/auth`, `firebase/firestore`) — o SDK antigo baseado em namespace (`firebase.auth()`) é legado e não faz tree-shaking.

## Setup base

```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

Nunca trate `auth.currentUser` no cliente como fonte de verdade para autorização — ele é conveniente para UI, mas o backend (Cloud Functions, regras do Firestore) deve sempre validar o **ID token**, nunca confiar em dado enviado cru pelo cliente (ex: `?uid=...` na URL).

## Email/senha

```js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

await createUserWithEmailAndPassword(auth, email, password);
await signInWithEmailAndPassword(auth, email, password);
```

Trate os códigos de erro específicos (`auth/email-already-in-use`, `auth/weak-password`, `auth/user-not-found`, `auth/wrong-password`, `auth/too-many-requests`) com mensagens claras — não exponha stack trace bruto pro usuário.

## Recuperação de senha

```js
import { sendPasswordResetEmail } from 'firebase/auth';

await sendPasswordResetEmail(auth, email, {
  url: 'https://seuapp.com/login', // ou deep link, no caso de app desktop/mobile
});
```

Pontos importantes:
- **Nunca revele se o e-mail existe ou não** na mensagem de erro/sucesso — sempre mostre algo como "se esse e-mail existir, enviamos um link", para evitar enumeração de contas.
- O link de reset expira em ~1 hora — trate `auth/expired-action-code` pedindo pro usuário solicitar um novo.
- O domínio de redirect (`url` em `actionCodeSettings`) precisa estar na lista de **domínios autorizados** em Firebase Console → Authentication → Settings, ou o redirect falha silenciosamente.
- Personalize o template do e-mail em Console → Authentication → Templates — o padrão vem com a marca do Firebase, não da sua.

## Login com Google

```js
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

await signInWithPopup(auth, provider); // web desktop-first
// fallback: signInWithRedirect(auth, provider) para mobile/navegadores que bloqueiam popup
```

- **Linking de contas**: se o mesmo e-mail já existe com login por senha e o usuário tenta entrar com Google (ou vice-versa), não crie uma segunda conta — use `linkWithCredential` para unificar, e explique na UI o que aconteceu ("essa conta já existe, vinculamos seu login Google a ela").
- Depois de mudar custom claims (ex: papel de admin) no backend, o ID token em cache no cliente **não atualiza sozinho** — force `user.getIdToken(true)` para refletir a mudança.

### ⚠️ Atenção especial: Electron (relevante para o Aether Space)
`signInWithPopup` dentro de uma `BrowserWindow` do Electron **frequentemente falha**, porque o Google bloqueia OAuth dentro de user-agents embutidos (erro `disallowed_useragent`) — política de segurança do próprio Google contra webviews embutidas, não é bug do Firebase. Duas abordagens que funcionam:
1. **Abrir o fluxo no navegador do sistema** (`shell.openExternal`) e capturar o retorno via **protocolo customizado** (`app.setAsDefaultProtocolClient`) ou um servidor local temporário — depois trocar o `id_token`/`access_token` recebido por uma credencial Firebase com `GoogleAuthProvider.credential(idToken, accessToken)` e `signInWithCredential`.
2. Usar uma `BrowserWindow` dedicada configurada para se parecer com um navegador legítimo (`user-agent` de Chrome real) — mais frágil, tende a quebrar quando o Google reforça a política; a opção 1 é a mais robusta a longo prazo.

Nunca tente contornar isso escondendo o user-agent de forma enganosa apenas para "passar" — a Google pode bloquear o app inteiro depois. Planeje o fluxo do navegador do sistema desde o início do design da tela de login.

## Estado de sessão

```js
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    // logado — usar user.uid para queries, nunca confiar em outro identificador
  } else {
    // deslogado — redirecionar pra tela de login
  }
});
```

Sempre trate o estado "carregando" (antes do primeiro callback disparar) separado de "deslogado" — sem isso a UI pisca a tela de login por um instante mesmo quando o usuário já está autenticado (sessão persistida).

## Regras de segurança — Firestore

Regra de ouro: **por padrão, negue tudo**, depois abra exceções específicas. Nunca deixe uma regra `allow read, write: if true;` passar de ambiente de teste para produção.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.memberIds;
    }
  }
}
```

- `request.auth != null` é a checagem mínima em qualquer regra que não seja pública de propósito.
- Compare contra `resource.data` (documento existente) para leitura/update, e contra `request.resource.data` para validar o que está **sendo escrito** (ex: impedir que o usuário se auto-promova a admin mudando um campo `role`).
- Regras não substituem validação no cliente — são a última linha de defesa, não a única. Valide também no formulário, mas nunca confie só nisso.
- Teste regras com o **Firestore Emulator Suite** antes de publicar — regra errada em produção normalmente só é percebida quando já vazou dado.

## Regras de segurança — Realtime Database

Sintaxe diferente do Firestore (JSON, não a DSL de `match`):

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

- Realtime Database **não tem query com filtro server-side tão rico quanto o Firestore** — cuidado ao desenhar regras que dependem de estrutura de dados aninhada; regras aninhadas erradas costumam ou bloquear demais ou vazar sub-árvores inteiras.
- `.validate` complementa `.read`/`.write` para garantir formato dos dados (tipo, tamanho de string, campos obrigatórios) — não é só sobre quem acessa, mas o que pode ser escrito.

## Checklist antes de ir para produção
1. Nenhuma regra `if true` / `.read: true` sem justificativa explícita (dado público de propósito).
2. Toda leitura/escrita sensível checa `request.auth`/`auth != null`.
3. Fluxo de reset de senha não revela se o e-mail existe.
4. Domínios de redirect autorizados atualizados no Console.
5. Se Electron: login Google testado via navegador do sistema, não só em popup interno.
6. Regras testadas no Emulator Suite, não só "parece que funciona" em produção.
7. Mensagens de erro de auth traduzidas/amigáveis, sem vazar código interno do Firebase pro usuário final.