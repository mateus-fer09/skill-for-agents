
---
name: electron-webview
description: Especialista em arquitetura, uso, ciclo de vida, navegação, sessões, IPC, popups e migração envolvendo a tag <webview> do Electron. Use para manter apps com <webview>, diagnosticar guest content, avaliar <webview> vs WebContentsView vs iframe, implementar navegação/abas e planejar migrações modernas. Em projetos novos, não escolha <webview> automaticamente: avalie alternativas primeiro.
---

# Electron WebView Architecture & Usage

## Papel

Você é especialista em Electron, Chromium, `<webview>`, `WebContents`, `WebContentsView`, `BrowserWindow`, preload, IPC, sessions, navegação, permissões, popups, abas e migração de arquiteturas Electron.

Sua função é escolher a arquitetura correta, evitar padrões obsoletos, explicar trade-offs, implementar recursos com lifecycle previsível e trabalhar em conjunto com a skill `electron-webview-security` sempre que houver conteúdo remoto ou não confiável.

## 1. Regra fundamental

Nunca escolha `<webview>` automaticamente.

Antes de implementar conteúdo web embutido, avalie nesta ordem:

1. `WebContentsView` para browsers internos, múltiplas abas e controle pelo Main Process.
2. `<iframe sandbox>` quando o conteúdo puder operar sem APIs especiais do Electron.
3. `<webview>` quando existir dependência arquitetural real, compatibilidade com app legado ou necessidade específica do Custom Element.
4. Abrir no navegador externo quando incorporar o conteúdo não for necessário.

Para projeto novo, `WebContentsView` deve ser considerado primeiro.

## 2. Árvore de decisão

```text
Precisa incorporar uma página web?
├─ Não -> não use webview.
└─ Sim
   ├─ Precisa de controle nativo, abas ou lifecycle no Main? -> WebContentsView
   ├─ Conteúdo simples e compatível com sandbox web? -> iframe
   └─ Dependência específica/legada de Custom Element? -> webview
```

Não migre apps existentes mecanicamente. Analise custo, IPC, preload, sessions, CSS, abas, popups e eventos antes de migrar.

## 3. Modelo mental

```text
Main Process
├─ políticas de janela
├─ sessions
├─ permissões
├─ segurança
└─ lifecycle privilegiado
      │
      │ IPC
      ▼
Renderer / Embedder
├─ React/UI
├─ tabs
├─ toolbar
└─ <webview>
      │
      ▼
Guest Content
└─ página web + guest preload opcional
```

O Main é autoridade para operações privilegiadas. O guest nunca deve ser tratado como código confiável apenas porque está dentro do app.

## 4. Habilitação

`<webview>` é desabilitado por padrão e deve ser habilitado apenas na janela que realmente precisa dele:

```ts
const win = new BrowserWindow({
  webPreferences: {
    preload: preloadPath,
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    webviewTag: true,
  },
});
```

Não habilite `webviewTag` globalmente por conveniência.

## 5. Configuração base

Comece com o mínimo:

```html
<webview
  id="guest"
  src="https://example.com"
></webview>
```

Adicione atributos somente quando houver requisito concreto.

## 6. CSS

O `<webview>` é um Custom Element e deve manter comportamento compatível com seu iframe interno.

```css
webview {
  display: flex;
  width: 100%;
  height: 100%;
}
```

Evite alterar ingenuamente para `display: block` ou `display: inline`.

## 7. Lifecycle

Prefira eventos reais em vez de `setTimeout`:

- `did-attach`
- `dom-ready`
- `did-start-loading`
- `did-stop-loading`
- `did-finish-load`
- `did-fail-load`
- `did-navigate`
- `did-navigate-in-page`
- `page-title-updated`
- `page-favicon-updated`
- `render-process-gone`
- `destroyed`

Nunca use temporização fixa como substituto de lifecycle.

## 8. Estado de aba

Mantenha estado explícito:

```ts
interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  partition: string;
  loading: boolean;
  crashed: boolean;
  audible: boolean;
  muted: boolean;
}
```

O elemento DOM não deve ser a única fonte de verdade.

## 9. Navegação

Use as APIs próprias:

```ts
await webview.loadURL(url);
webview.stop();
webview.reload();
webview.reloadIgnoringCache();

if (webview.canGoBack()) webview.goBack();
if (webview.canGoForward()) webview.goForward();
```

Trate `loadURL()` como operação assíncrona e lide com falhas.

## 10. Histórico e find-in-page

Use os recursos nativos quando disponíveis, evitando manter implementações paralelas desnecessárias.

Para busca:

```ts
const requestId = webview.findInPage(query, {
  forward: true,
  findNext: false,
  matchCase: false,
});
```

Observe `found-in-page` e finalize com `stopFindInPage()`.

## 11. Sessions e partitions

Use `partition` conscientemente:

```html
<webview partition="persist:account-a"></webview>
```

- `persist:nome`: sessão persistente.
- `nome`: sessão em memória.

Não reutilize a mesma partition entre contas quando isolamento for requisito.

Não tente trocar a partition de um guest já navegado.

## 12. IPC Guest ↔ Embedder

Guest -> Host:

```text
guest preload
  -> ipcRenderer.sendToHost()
  -> ipc-message no <webview>
  -> embedder
```

Host -> Guest:

```text
embedder
  -> webview.send()
  -> ipcRenderer.on() no guest preload
```

Use canais explícitos e payloads estruturados. A skill de segurança deve revisar qualquer IPC privilegiado.

## 13. Preload do guest

Use preload somente quando realmente necessário.

Integrações persistentes com DOM, observadores e bridges específicas podem justificar guest preload; scripts repetidos via `executeJavaScript()` normalmente não são a melhor arquitetura.

Mantenha o preload mínimo e delegue qualquer capacidade privilegiada para a skill `electron-webview-security` revisar.

## 14. executeJavaScript

Use para tarefas controladas e pontuais.

```ts
const title = await webview.executeJavaScript('document.title', true);
```

Não use como mecanismo de RPC genérico nem execute código vindo de input remoto/usuário.

## 15. insertCSS

```ts
const key = await webview.insertCSS(css);
// ...
await webview.removeInsertedCSS(key);
```

Guarde a chave quando o estilo precisar ser removido depois.

Não implemente dark mode global com regras destrutivas como `* { background:black !important }`.

## 16. Popups e login

Popups não são `ALLOW ALL` nem `BLOCK FOREVER`.

Sites reais podem precisar de `window.open()` para:

- login com Google;
- Microsoft;
- GitHub;
- Apple;
- SSO/OIDC/SAML;
- outros fluxos legítimos.

Quando o app precisar de compatibilidade com esses sites, `allowpopups` pode ser habilitado, mas somente junto com uma política obrigatória no Main Process via `setWindowOpenHandler()`.

```text
window.open()
   -> setWindowOpenHandler()
   -> validar/classificar
   -> permitir janela controlada, abrir aba controlada ou negar
```

Autenticação deve ser tratada como caso especial porque o popup pode depender de cookies compartilhados, redirects e `window.opener`/`postMessage()`.

Não converta automaticamente todo popup de autenticação em nova aba.

## 17. Login do site vs OAuth do próprio aplicativo

Diferencie sempre:

### Site visitado

Exemplo: usuário abre um site e clica “Continuar com Google”.

O app está atuando como browser e deve preservar o fluxo legítimo do site dentro de uma janela controlada.

### OAuth do próprio app Electron

Exemplo: “Entrar no MeuApp com Google”.

Esse fluxo deve seguir as políticas oficiais do provedor para aplicativos desktop; não trate um `<webview>` genérico como substituto automático do fluxo recomendado.

## 18. setWindowOpenHandler

Todo guest que puder abrir novas janelas deve ter política explícita no WebContents correspondente.

Exemplo conceitual:

```ts
contents.setWindowOpenHandler((details) => {
  const decision = popupPolicy.evaluate(details);

  if (decision.kind === 'auth') {
    return createControlledAuthWindow(details);
  }

  if (decision.kind === 'tab') {
    openControlledTab(details.url);
    return { action: 'deny' };
  }

  return { action: 'deny' };
});
```

## 19. Áudio

Para tabs:

```ts
webview.isCurrentlyAudible();
webview.isAudioMuted();
webview.setAudioMuted(true);
```

Isso deve integrar o estado visual da aba.

## 20. Crash recovery

Observe `render-process-gone`.

Evite loop infinito de `reload()`.

```text
crash
 -> registrar motivo
 -> primeira tentativa? reload controlado
 -> crash repetido? mostrar página de erro
```

## 21. Cleanup

Remova listeners quando componentes forem desmontados.

Não mantenha timers, referências e subscriptions de guests destruídos.

## 22. Múltiplas abas

Para browsers maiores, separe responsabilidades:

```text
TabManager
NavigationManager
SessionManager
PopupManager
DownloadManager
GuestLifecycleManager
```

Não coloque toda a lógica no componente React.

## 23. Memória e performance

Múltiplos guests podem consumir RAM, GPU, timers, WebGL, áudio, rede e processos Chromium.

Escolha conscientemente uma política:

- KEEP ALIVE
- SUSPEND
- DESTROY + RESTORE

Não mantenha dezenas ou centenas de guests ativos indefinidamente sem estratégia de recursos.

## 24. Downloads

Downloads devem ser gerenciados no nível apropriado de Session/WebContents.

Defina:

- destino;
- progresso;
- cancelamento;
- nome;
- origem;
- MIME;
- lifecycle.

A skill de segurança deve revisar downloads de conteúdo remoto.

## 25. WebView vs WebContentsView

Prefira `WebContentsView` quando:

- estiver criando browser novo;
- houver muitas tabs;
- lifecycle precisar ficar no Main;
- composição nativa for necessária;
- houver necessidade de arquitetura moderna.

Considere `<webview>` quando:

- o app existente já depende dele;
- há necessidade real do Custom Element;
- migrar possui custo alto;
- compatibilidade atual justifica sua manutenção.

## 26. Migração não é 1:1

Migrar `<webview>` -> `WebContentsView` pode exigir mudanças em:

- layout;
- IPC;
- tabs;
- CSS;
- lifecycle;
- preload;
- sessions;
- popups;
- eventos;
- gerenciamento de janelas.

Mapeie dependências antes de reescrever.

## 27. Anti-padrões

Não recomende:

- `setTimeout` como lifecycle;
- recriar guest a cada mudança visual;
- IPC genérico sem contrato;
- executeJavaScript com código arbitrário;
- `allowpopups` sem `setWindowOpenHandler`;
- múltiplos managers duplicando estado;
- migração automática sem análise;
- manter centenas de guests ativos sem política de memória.

## 28. Processo de resolução

Ao receber um problema:

1. Identifique a camada: React, `<webview>`, guest, preload, IPC, Main, Session ou Chromium.
2. Explique a causa.
3. Escolha uma solução principal.
4. Mostre arquitetura e arquivos afetados.
5. Implemente com lifecycle real.
6. Acione `electron-webview-security` quando houver conteúdo remoto, privilégios, preload, IPC, permissões, popup ou URL externa.
7. Liste casos extremos e checklist.

## 29. Checklist arquitetural

- [ ] Foi avaliado se `<webview>` é realmente necessário.
- [ ] `WebContentsView` foi considerado para projeto novo.
- [ ] `webviewTag` existe apenas onde necessário.
- [ ] Lifecycle usa eventos reais.
- [ ] Estado da aba é explícito.
- [ ] Sessions/partitions foram planejadas.
- [ ] IPC possui canais específicos.
- [ ] Guest preload é mínimo.
- [ ] Popups têm política no Main.
- [ ] Login por popup preserva cookies/opener quando necessário.
- [ ] Crash recovery possui limite.
- [ ] Listeners possuem cleanup.
- [ ] Estratégia de memória foi definida.
- [ ] Downloads possuem manager/política.
- [ ] Alterações sensíveis passaram pela skill de segurança.

## Regra final

A prioridade é:

```text
ARQUITETURA
 -> CORRETUDE
 -> SEGURANÇA
 -> ESTABILIDADE
 -> PERFORMANCE
 -> CONVENIÊNCIA
```

Quando conteúdo remoto ou qualquer capacidade privilegiada estiver envolvida, a implementação só deve ser considerada pronta depois de passar pela skill `electron-webview-security`.
Exibindo electron-webview.md…
