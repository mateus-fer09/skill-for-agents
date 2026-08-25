### index_master.md

`````markdown
# index_master.md

## Propósito geral

Este índice é o roteador principal da skill modular de Electron. A documentação foi particionada por domínio para reduzir perda de contexto, melhorar recuperação via RAG/Tool Calling e permitir que o agente carregue apenas o conjunto de conhecimento necessário para a tarefa atual.

A skill original tem como objetivo capacitar o agente a projetar, implementar, revisar, depurar, proteger, testar, empacotar, distribuir e manter aplicações Electron modernas, cobrindo arquitetura de processos, lifecycle, janelas e WebContents, preload/IPC, segurança, sessões/rede, APIs nativas, performance, testes, distribuição e manutenção.

## Fonte de autoridade

Ao resolver questões Electron, respeite a ordem de autoridade definida pela documentação original:

1. documentação oficial da versão alvo do Electron;
2. documentação oficial `latest`, quando a versão não for informada;
3. tipos TypeScript fornecidos pelo pacote `electron`;
4. release notes e breaking changes da versão alvo;
5. documentação de Electron Forge quando a tarefa envolver Forge;
6. documentação de Node.js e Chromium referente às versões embarcadas;
7. comportamento observado em testes reproduzíveis;
8. conhecimento geral do agente.

Não presuma que APIs antigas, experimentais, deprecated ou específicas de plataforma mantêm disponibilidade, assinatura, defaults ou comportamento em versões/plataformas atuais.

## Regras e padrões absolutos

- Trate `main`, `preload`, `renderer` e utility/child processes como fronteiras de privilégio distintas.
- Quanto menos privilégios um renderer possuir, melhor.
- Por padrão arquitetural, use `nodeIntegration: false`, `contextIsolation: true` e `sandbox: true`.
- Nunca exponha `ipcRenderer` inteiro, `require`, `fs`, `child_process`, `shell` ou APIs Node/Electron genéricas ao renderer.
- Prefira APIs de preload pequenas, explícitas, semânticas e tipadas.
- Todo IPC privilegiado deve usar canal específico e validar sender, origem quando aplicável, tipos, formato, limites e autorização.
- Nunca aceite comandos shell genéricos nem caminhos arbitrários sem validação.
- Não desabilite `webSecurity` para contornar CORS/CSP/origem.
- Nunca habilite Node para conteúdo remoto não confiável.
- Trate conteúdo remoto, conteúdo local, arquivos, Markdown, clipboard, deep links, argumentos, URLs e dados externos como entradas potencialmente não confiáveis.
- Restrinja navegação, abertura de novas janelas e `shell.openExternal`.
- Preserve o princípio de menor privilégio em todas as fronteiras.
- Não invente APIs Electron. Quando houver dúvida sobre versão, plataforma, assinatura, default ou disponibilidade, consulte a documentação oficial da versão alvo.
- Ao trabalhar em arquitetura existente, preserve convenções e tooling do projeto salvo quando houver motivo técnico explícito para mudança.

## Estratégia de recuperação para agentes

1. Leia este arquivo primeiro.
2. Identifique o domínio principal da pergunta.
3. Consulte o menor número de módulos capaz de responder com segurança.
4. Para qualquer decisão arquitetural, revisão de segurança, geração de código ou migração, combine o módulo técnico com `12_politicas_do_agente_e_qualidade.md`.
5. Se a tarefa atravessar fronteiras — por exemplo, “abrir arquivo no renderer via IPC” — carregue todos os módulos diretamente envolvidos, não apenas um.
6. Se a resposta depender de comportamento version-specific ou platform-specific, valide também na documentação oficial da versão alvo.

## Mapa de Contexto

### `01_conceitos_e_arquitetura.md`

Leia SE a pergunta envolver visão geral do Electron, modelo multiprocess, responsabilidades de main/renderer/preload, estrutura de projeto, arquitetura de serviços/janelas, conteúdo local/remoto, persistência, extensibilidade, versões ou APIs deprecated.

### `02_lifecycle_janelas_views_e_webcontents.md`

Leia SE a pergunta envolver lifecycle do app, criação/fechamento/reabertura de janelas, BrowserWindow, WebContents, navegação, novas janelas, BaseWindow, WebContentsView, screen, title bars, frameless, multi-window, loading ou ownership/destroy/close.

### `03_ipc_preload_e_contratos.md`

Leia SE a pergunta envolver ipcMain/ipcRenderer, contextBridge, preload, MessageChannelMain/MessagePortMain, contratos TypeScript, design/namespaces de canais, validação de payloads ou frames/senders.

### `04_seguranca_e_hardening.md`

Leia SE a pergunta envolver threat model, contextIsolation, sandbox, nodeIntegration, CSP, permissões, filesystem/command security, TLS/certificados, autenticação/autorização, DOM security, URLs, secrets, OAuth, production hardening, security review ou anti-patterns.

### `05_apis_nativas_e_integracao_so.md`

Leia SE a pergunta envolver Menu, Tray, Dialog, Clipboard, NativeImage, tema, notificações, atalhos globais, captura de tela, energia, protocolos/deep links/file associations, shell, systemPreferences ou integrações específicas de Windows/macOS/Linux.

### `06_dados_rede_sessoes_protocolos.md`

Leia SE a pergunta envolver paths/dados do app, Session, net, cookies, proxy, headers, webRequest, URLs/paths de entrada, variáveis de ambiente, API keys, OAuth, estado offline ou separação de ambientes.

### `07_setup_configuracao_e_dependencias.md`

Leia SE a pergunta envolver módulos Node nativos, ABI/rebuild/arquitetura, dependências npm, lockfile, atualização/auditoria de dependências ou preparação técnica do ambiente do projeto.

### `08_performance_estabilidade_e_processos.md`

Leia SE a pergunta envolver crashes de renderer/child process, utilityProcess, startup, CPU, memória, renderer performance, cancelamento, multi-profile/custo de processos ou estabilidade operacional.

### `09_testes_debug_e_diagnostico.md`

Leia SE a pergunta envolver crashReporter, netLog/contentTracing, DevTools, logging, testes unitários/integrados/E2E, automação, debugging, Electron Fiddle ou matrizes/ordem de diagnóstico.

### `10_build_release_e_distribuicao.md`

Leia SE a pergunta envolver autoUpdater, packaging, ASAR, Electron Forge, code signing, notarization, formatos de distribuição, canais de update, versionamento, source maps, minification ou diagnóstico de release.

### `11_fluxos_exemplos_e_padroes.md`

Leia SE o usuário pedir um exemplo completo mínimo de arquitetura Electron segura, incluindo main, preload, renderer, IPC e fluxo de execução de referência.

### `12_politicas_do_agente_e_qualidade.md`

Leia SEMPRE ao produzir ou revisar uma solução Electron relevante; contém princípio de autoridade, severidade de code review, migração, regras de consulta à documentação, política de código gerado, response policy, version awareness, checklists e critérios finais de qualidade.

## Combinações de contexto recomendadas

- **Criar uma janela segura:** `02_lifecycle_janelas_views_e_webcontents.md` + `04_seguranca_e_hardening.md` + `12_politicas_do_agente_e_qualidade.md`.
- **Criar uma API preload/IPC:** `03_ipc_preload_e_contratos.md` + `04_seguranca_e_hardening.md` + `12_politicas_do_agente_e_qualidade.md`.
- **Acessar filesystem:** `03_ipc_preload_e_contratos.md` + `04_seguranca_e_hardening.md` + `06_dados_rede_sessoes_protocolos.md`.
- **Carregar conteúdo remoto:** `02_lifecycle_janelas_views_e_webcontents.md` + `04_seguranca_e_hardening.md` + `06_dados_rede_sessoes_protocolos.md`.
- **Integrar recurso do sistema operacional:** `05_apis_nativas_e_integracao_so.md` + o módulo de segurança quando houver entrada não confiável ou privilégio.
- **Investigar crash/performance:** `08_performance_estabilidade_e_processos.md` + `09_testes_debug_e_diagnostico.md`.
- **Preparar release:** `10_build_release_e_distribuicao.md` + `12_politicas_do_agente_e_qualidade.md`.
- **Migrar projeto Electron antigo:** `01_conceitos_e_arquitetura.md` + `04_seguranca_e_hardening.md` + `10_build_release_e_distribuicao.md` + `12_politicas_do_agente_e_qualidade.md`.
- **Gerar projeto de referência completo:** `11_fluxos_exemplos_e_padroes.md` + módulos técnicos afetados + `12_politicas_do_agente_e_qualidade.md`.

## Regra de preservação desta modularização

Os módulos técnicos contêm as seções originais movidas integralmente, sem resumir o conteúdo técnico e sem remover blocos de código, configurações ou snippets. O índice adiciona apenas a camada de roteamento necessária para recuperação por agentes.
`````

### 01_conceitos_e_arquitetura.md

`````markdown
# skill_electron_all.md

## Metadata

```yaml
name: electron-all
description: >
  Skill abrangente para projetar, implementar, revisar, depurar, proteger,
  testar, empacotar, distribuir e manter aplicações Electron modernas,
  cobrindo arquitetura de processos, lifecycle, BrowserWindow, WebContents,
  preload, IPC, segurança, sessões, protocolos, APIs nativas, integração com
  sistema operacional, performance, atualizações, testes e boas práticas.
version: 1.0.0
domain: desktop-development
framework: Electron
language: pt-BR
source_of_truth:
  - https://www.electronjs.org/docs/latest/
  - https://www.electronjs.org/docs/latest/api/app
documentation_policy: latest-stable
```

---

# 1. Objetivo da skill

Esta skill transforma o agente em um especialista de engenharia Electron capaz de:

- compreender a arquitetura e o modelo de processos do Electron;
- criar aplicações desktop multiplataforma para Windows, macOS e Linux;
- estruturar corretamente `main`, `preload` e `renderer`;
- projetar APIs IPC mínimas, explícitas, tipadas e seguras;
- usar APIs Electron somente no processo/contexto em que são suportadas;
- gerenciar corretamente o ciclo de vida da aplicação;
- criar e gerenciar janelas, views, sessões e `webContents`;
- carregar conteúdo local ou remoto com controles de segurança adequados;
- implementar navegação, downloads, menus, tray, diálogos e atalhos;
- integrar recursos nativos do sistema operacional;
- trabalhar com notificações, clipboard, shell, protocolos e arquivos;
- usar processos utilitários e módulos nativos quando necessário;
- implementar armazenamento de dados e segredos de maneira adequada;
- diagnosticar crashes, OOM, falhas de renderer e child processes;
- otimizar startup, memória, renderização, I/O e uso de CPU;
- testar e depurar aplicações Electron;
- empacotar, assinar, distribuir e atualizar aplicações;
- revisar código Electron procurando erros arquiteturais e vulnerabilidades;
- migrar código Electron antigo ou inseguro para padrões atuais.

Esta skill deve ser usada como conhecimento operacional, não como substituto
cego da documentação oficial. Quando uma API, comportamento, plataforma,
assinatura, default ou requisito de versão puder ter mudado, o agente deve
consultar a documentação oficial da versão alvo.

---

# 3. Modelo mental obrigatório

Electron combina:

- Chromium para renderização de interfaces e APIs web;
- Node.js para funcionalidades de sistema e runtime JavaScript;
- APIs próprias do Electron para integrar Chromium, Node e o sistema operacional.

Um aplicativo Electron não é simplesmente um site executado em uma janela.

O agente deve sempre separar mentalmente:

```text
Application
│
├── Main Process
│   ├── app lifecycle
│   ├── BrowserWindow / BaseWindow
│   ├── WebContents
│   ├── menus / tray / dialogs
│   ├── sessions / protocols
│   ├── OS integration
│   ├── privileged APIs
│   └── ipcMain
│
├── Renderer Process(es)
│   ├── DOM
│   ├── frontend framework
│   ├── browser APIs
│   └── API mínima exposta pelo preload
│
├── Preload Script(s)
│   ├── trusted bridge
│   ├── validation / serialization
│   ├── ipcRenderer
│   └── contextBridge
│
└── Utility / Child Processes
    └── trabalhos pesados ou isolados
```

Regra central:

> Quanto menos privilégios um renderer possuir, melhor.

---

# 4. Processos Electron

## 4.1 Main process

Existe normalmente um único processo principal.

É responsável por:

- ciclo de vida da aplicação;
- criação e gerenciamento de janelas;
- acesso a APIs privilegiadas;
- integração com o sistema operacional;
- coordenação entre renderers;
- registro de protocolos;
- manipulação de menus;
- tray;
- atalhos globais;
- permissões;
- atualização;
- persistência e recursos nativos.

O main process deve evitar tarefas CPU-bound prolongadas porque bloqueá-lo
prejudica toda a aplicação.

Quando trabalho pesado for necessário, considerar:

- `utilityProcess`;
- `worker_threads`;
- processo filho;
- serviço separado;
- processamento assíncrono apropriado.

---

## 4.2 Renderer process

Cada página Electron geralmente roda em seu próprio renderer Chromium.

O renderer deve ser tratado como ambiente potencialmente comprometível.

Por padrão arquitetural:

```js
nodeIntegration: false
contextIsolation: true
sandbox: true
```

Não fornecer acesso direto a:

- `fs`;
- `child_process`;
- `shell`;
- `ipcRenderer` inteiro;
- objetos Electron privilegiados;
- APIs Node genéricas.

---

## 4.3 Preload

O preload é a fronteira de confiança entre renderer e Electron.

Responsabilidades:

- importar apenas recursos necessários;
- usar `contextBridge.exposeInMainWorld`;
- expor métodos pequenos e específicos;
- validar inputs;
- limitar canais IPC;
- transformar dados quando necessário;
- não expor Event, sender ou objetos privilegiados.

Exemplo recomendado:

```js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('desktop', {
  openFile: () => ipcRenderer.invoke('files:open'),
  saveSettings: (settings) =>
    ipcRenderer.invoke('settings:save', settings)
})
```

Evitar:

```js
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer
})
```

ou:

```js
contextBridge.exposeInMainWorld('api', {
  send: ipcRenderer.send
})
```

---

# 56. Process Model e Chromium

Electron herda o modelo multiprocess do Chromium.

Podem existir:

- main/browser process;
- renderer;
- GPU;
- network service;
- utility processes;
- crashpad;
- zygote no Linux.

O agente deve diferenciar:

- crash do renderer;
- crash do GPU;
- OOM;
- falha do main;
- falha da UI web.

---

# 62. ESM e CommonJS

Electron pode ser usado com CommonJS e ESM conforme versão/configuração.

Antes de converter projeto:

- verificar suporte da versão alvo;
- verificar preload;
- verificar main entry;
- verificar extensão de arquivos;
- verificar `type` do package.json;
- verificar bundler.

Não misturar padrões sem compreender resolução de módulos.

---

# 64. Estrutura recomendada

```text
src/
├── main/
│   ├── main.ts
│   ├── windows/
│   ├── ipc/
│   ├── services/
│   ├── security/
│   └── native/
│
├── preload/
│   ├── index.ts
│   └── api/
│
├── renderer/
│   ├── index.html
│   ├── main.ts
│   ├── ui/
│   └── styles/
│
└── shared/
    ├── contracts/
    └── types/
```

Princípio:

- main = privilégio;
- preload = bridge;
- renderer = UI;
- shared = contratos puros.

---

# 92. Remote Content

Antes de carregar conteúdo remoto, perguntar:

1. é realmente necessário?
2. a origem é controlada?
3. usa HTTPS?
4. Node está desabilitado?
5. context isolation está habilitado?
6. sandbox está habilitado?
7. permissions estão restritas?
8. navegação está limitada?
9. novas janelas estão limitadas?
10. IPC valida sender?
11. shell external é validado?
12. CSP está adequada?

Conteúdo arbitrário da internet não deve ser tratado como uma página de
browser comum dentro de Electron.

---

# 93. Local Content

Conteúdo local também pode sofrer XSS.

Nunca assumir que “local” significa “seguro”.

Dados provenientes de:

- arquivos;
- banco;
- Markdown;
- APIs;
- plugins;
- clipboard;
- deep links;
- argumentos;

continuam não confiáveis.

Sanitizar conteúdo inserido no DOM.

---

# 94. Plugins e extensibilidade

Se aplicação carregar plugins de terceiros:

- definir trust model;
- não executar plugin no main por padrão;
- considerar processo isolado;
- definir permissões;
- assinar/verificar pacotes;
- limitar APIs;
- versionar contrato;
- oferecer revogação.

Um plugin Electron com acesso Node equivale potencialmente a código nativo do
usuário.

---

# 95. Persistência

Opções dependem do projeto:

- arquivos JSON;
- SQLite;
- IndexedDB;
- localStorage;
- banco remoto;
- key-value database.

Escolha deve considerar:

- processo que acessa;
- concorrência;
- corrupção;
- migração;
- backup;
- segurança;
- tamanho.

Não colocar todo acesso a banco diretamente no renderer privilegiado.

---

# 96. Main Process Service Layer

Recomendado:

```text
ipc handler
    ↓
validation
    ↓
authorization
    ↓
service
    ↓
repository/native API
```

Benefícios:

- testabilidade;
- IPC menor;
- segurança centralizada;
- desacoplamento de Electron.

---

# 97. Window Manager

Apps complexos devem centralizar gerenciamento de janelas.

Exemplo de responsabilidades:

- criar;
- recuperar;
- focar;
- fechar;
- persistir bounds;
- prevenir duplicatas;
- cleanup;
- aplicar políticas de segurança uniformes.

Evitar espalhar `new BrowserWindow()` por toda a codebase.

---

# 129. Electron Versions

Electron atualiza Chromium e Node regularmente.

Ao atualizar major:

- ler breaking changes;
- revisar deprecated APIs;
- rebuild native modules;
- executar E2E;
- validar signing;
- validar auto-update;
- testar OSs alvo;
- verificar CSP e security defaults.

---

# 130. Deprecated APIs

Não introduzir API deprecated em novo código se houver substituto oficial.

Exemplos históricos incluem APIs antigas de views/remote patterns.

Sempre consultar documentação atual antes de usar:

- BrowserView;
- `remote`;
- APIs removidas;
- flags antigas.

---

# 131. `remote`

Não usar o antigo módulo `remote`.

Arquitetura moderna:

```text
renderer -> preload -> IPC -> main
```

---

# 132. BrowserView

Se documentação atual marcar `BrowserView` como deprecated, não recomendar em
novo projeto.

Preferir alternativa moderna indicada pela documentação, como
`WebContentsView`, conforme caso.

---

# 178. Padrão de projeto robusto

Para aplicações grandes:

```text
Electron shell
│
├── Bootstrap
│   ├── lifecycle
│   ├── single instance
│   └── migrations
│
├── Security Layer
│   ├── window policy
│   ├── IPC authorization
│   ├── URL policy
│   └── permission policy
│
├── Window Manager
│
├── IPC Router
│   ├── schemas
│   ├── handlers
│   └── contracts
│
├── Services
│
├── Persistence
│
├── Native Integrations
│
├── Utility Processes
│
└── Renderer Apps
```

---
`````

### 02_lifecycle_janelas_views_e_webcontents.md

`````markdown
# 5. Lifecycle da aplicação: módulo `app`

`app` pertence ao main process e controla o ciclo de vida da aplicação.

Importação preferencial:

```js
const { app } = require('electron/main')
```

ou, conforme o sistema de módulos:

```js
import { app } from 'electron'
```

## 5.1 Inicialização

Padrão:

```js
const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
```

APIs úteis:

- `app.isReady()`
- `app.whenReady()`

`ready` é emitido uma única vez após Electron terminar a inicialização.

Certas APIs que obrigatoriamente precisam ser chamadas antes de `ready`
devem ser configuradas sincronicamente no topo do main process.

---

# 6. Eventos principais de `app`

O agente deve conhecer a finalidade dos seguintes eventos:

## Startup e lifecycle

- `will-finish-launching`
- `ready`
- `window-all-closed`
- `before-quit`
- `will-quit`
- `quit`

## Ativação e integração macOS

- `activate`
- `did-become-active`
- `did-resign-active`
- `open-file`
- `open-url`
- `continue-activity`
- `will-continue-activity`
- `continue-activity-error`
- `activity-was-continued`
- `update-activity-state`
- `new-window-for-tab`

## Janelas e WebContents

- `browser-window-created`
- `browser-window-focus`
- `browser-window-blur`
- `web-contents-created`

## Segurança e autenticação

- `certificate-error`
- `select-client-certificate`
- `login`

## Processos e estabilidade

- `render-process-gone`
- `child-process-gone`
- `gpu-info-update`

## Outros

- `accessibility-support-changed`
- `session-created`
- `second-instance`

O agente deve consultar a documentação antes de assumir disponibilidade
cross-platform.

---

# 7. Encerramento correto

Padrão multiplataforma:

```js
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

No macOS, aplicativos normalmente permanecem ativos mesmo sem janelas.

Recriar janela:

```js
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

Diferença essencial:

```text
app.quit()
    executa fluxo normal de fechamento
    dispara eventos relevantes
    permite beforeunload/unload

app.exit(code)
    encerra imediatamente
    não executa o lifecycle normal de quit
```

Usar `app.exit()` somente quando encerramento abrupto for realmente desejado.

---

# 8. Single Instance

Para impedir múltiplas instâncias:

```js
const gotLock = app.requestSingleInstanceLock()

if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, argv, workingDirectory, additionalData) => {
    // restaurar/focar a janela principal
  })
}
```

Preferir `additionalData` quando a ordem e fidelidade de argumentos precisarem
ser preservadas.

---

# 9. Relaunch

```js
app.relaunch({
  args: process.argv.slice(1).concat(['--relaunch'])
})

app.exit(0)
```

`app.relaunch()` agenda a nova execução, mas não fecha automaticamente a
instância atual.

Evitar chamadas duplicadas que possam criar múltiplas instâncias.

---

# 11. BrowserWindow

`BrowserWindow` é uma das principais abstrações de UI Electron.

Exemplo seguro:

```js
const path = require('node:path')
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({
  width: 1200,
  height: 800,
  show: false,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true
  }
})

win.once('ready-to-show', () => {
  win.show()
})

win.loadFile('index.html')
```

O agente deve saber trabalhar com:

- tamanho e posição;
- resizable;
- minimização/maximização;
- fullscreen;
- frame;
- title bar;
- always on top;
- parent/child windows;
- modal windows;
- background color;
- icon;
- visibility;
- focus;
- multi-monitor;
- state restoration.

---

# 12. WebContents

Cada janela ou view possui um `webContents`.

Usos:

- carregar URLs;
- observar navegação;
- enviar IPC;
- controlar DevTools;
- capturar página;
- executar operações de impressão;
- inspecionar crashes;
- controlar zoom;
- manipular áudio;
- gerenciar handlers de novas janelas.

Regra:

Nunca executar JavaScript arbitrário proveniente de dados não confiáveis.

Evitar `executeJavaScript` quando uma API IPC explícita resolver o problema.

---

# 13. Navegação segura

Tratar toda navegação inesperada como risco.

Aplicações que deveriam permanecer no próprio conteúdo devem limitar navegação.

Exemplo:

```js
win.webContents.on('will-navigate', (event, url) => {
  const target = new URL(url)

  if (target.origin !== 'https://example.com') {
    event.preventDefault()
  }
})
```

Validar usando `URL`, nunca apenas `startsWith`.

Inseguro:

```js
url.startsWith('https://example.com')
```

pois pode permitir strings maliciosas visualmente semelhantes.

---

# 14. Novas janelas

Usar:

```js
webContents.setWindowOpenHandler(({ url }) => {
  const parsed = new URL(url)

  if (parsed.origin === 'https://trusted.example') {
    return { action: 'allow' }
  }

  return { action: 'deny' }
})
```

Default seguro para conteúdo remoto:

```js
webContents.setWindowOpenHandler(() => ({
  action: 'deny'
}))
```

Abrir links externos somente após validação explícita.

---

# 27. WebContentsView

`WebContentsView` é opção moderna para embutir conteúdo web controlado.

Casos:

- painéis;
- tabs;
- conteúdo remoto isolado;
- browsers embutidos;
- múltiplas superfícies Chromium.

O agente deve aplicar os mesmos princípios de segurança de `BrowserWindow`.

---

# 28. BaseWindow e Views

Electron possui APIs de composição de janela e views.

Ao utilizar `BaseWindow`, `View`, `WebContentsView`, `ImageView` ou APIs
relacionadas:

- gerenciar lifetime explicitamente;
- evitar references órfãs;
- destruir `webContents` quando necessário;
- considerar resize;
- considerar DPI/scaling;
- separar superfície visual de conteúdo web.

---

# 106. Custom Title Bars

Ao criar frame customizado:

- preservar drag regions;
- acessibilidade;
- botões nativos;
- snap;
- fullscreen;
- maximização;
- diferenças macOS/Windows/Linux.

Não sacrificar usabilidade por estética.

---

# 107. Frameless Windows

Janelas sem frame exigem cuidado:

- drag;
- resize;
- close/minimize/maximize;
- focus;
- keyboard;
- accessibility;
- platform behavior.

Testar em todos os sistemas alvo.

---

# 108. Multi-window

Cada BrowserWindow aumenta custo de renderer.

Para muitas superfícies:

- avaliar reutilização;
- views;
- tabs;
- virtualização;
- lazy creation.

Nunca manter dezenas de renderers ativos sem medir consumo.

---

# 154. BrowserWindow Ownership

Ao criar uma janela:

- armazenar referência quando necessário;
- remover referência ao fechar;
- evitar memory leak;
- não interagir após `isDestroyed()`.

---

# 155. Destroy vs Close

`close()` segue fluxo normal de fechamento.

`destroy()` é mais abrupto.

Preferir fechamento normal quando o usuário e lifecycle devem ser respeitados.

---

# 156. ready-to-show

Pode melhorar UX evitando flash de tela vazia.

Alternativas:

- background color;
- render inicial rápido.

Não atrasar visibilidade indefinidamente.

---

# 157. Loading Events

Conhecer eventos de `webContents` relevantes:

- start;
- stop;
- finish;
- fail;
- DOM ready;
- navigation.

A nomenclatura e assinatura exatas devem ser confirmadas na versão alvo.

---

# 158. Failure UX

Se página falhar ao carregar:

- logar código/descrição;
- oferecer retry;
- distinguir offline vs bundle corruption;
- não entrar em reload loop.

---
`````

### 03_ipc_preload_e_contratos.md

`````markdown
# 16. IPC

Electron usa IPC para comunicação entre processos.

Módulos principais:

- `ipcMain`
- `ipcRenderer`
- `contextBridge`

Padrões:

## Renderer -> Main: fire-and-forget

```js
ipcRenderer.send('telemetry:event', payload)
```

```js
ipcMain.on('telemetry:event', (event, payload) => {
  // validar
})
```

## Renderer -> Main: request/response

Preferido:

```js
ipcRenderer.invoke('files:open')
```

```js
ipcMain.handle('files:open', async (event) => {
  // validar sender
  return result
})
```

## Main -> Renderer

```js
win.webContents.send('app:update-status', status)
```

No preload:

```js
contextBridge.exposeInMainWorld('updates', {
  onStatus(callback) {
    const handler = (_event, value) => callback(value)

    ipcRenderer.on('app:update-status', handler)

    return () => {
      ipcRenderer.removeListener('app:update-status', handler)
    }
  }
})
```

Não repassar o objeto `event` ao renderer.

---

# 17. Regras de IPC seguro

Todo handler IPC privilegiado deve:

1. usar canal específico;
2. validar sender;
3. validar origem quando aplicável;
4. validar tipo dos argumentos;
5. validar formato;
6. validar limites de tamanho;
7. aplicar autorização;
8. não confiar em caminhos;
9. não aceitar comandos shell genéricos;
10. retornar apenas os dados necessários.

Exemplo de validação:

```js
ipcMain.handle('settings:set-theme', (event, theme) => {
  if (!isTrustedSender(event.senderFrame)) {
    throw new Error('Unauthorized IPC sender')
  }

  if (!['light', 'dark', 'system'].includes(theme)) {
    throw new TypeError('Invalid theme')
  }

  saveTheme(theme)

  return { ok: true }
})
```

---

# 45. MessageChannelMain e MessagePortMain

Úteis para comunicação estruturada e canais dedicados entre contextos/processos.

Considerar quando:

- alto volume de mensagens;
- stream-like communication;
- canal isolado;
- transferência de ports.

Ainda aplicar validação e ownership explícito.

---

# 63. TypeScript

Recomendado para aplicações médias/grandes.

Benefícios:

- tipos Electron;
- contratos IPC;
- APIs preload declaradas;
- eventos;
- estruturas platform-specific.

Exemplo:

```ts
declare global {
  interface Window {
    desktop: {
      openFile(): Promise<string | null>
    }
  }
}
```

Criar tipos compartilhados para IPC, mas não compartilhar módulos runtime que
introduzam dependências privilegiadas no renderer.

---

# 65. Arquitetura de IPC recomendada

```text
renderer
   │
   ▼
window.desktop.files.open()
   │
   ▼
preload
   │
   ▼
ipcRenderer.invoke("files:open")
   │
   ▼
ipcMain.handle("files:open")
   │
   ▼
service layer
   │
   ▼
filesystem/dialog/native API
```

Não colocar toda lógica de negócio em handlers IPC.

Handlers devem ser adaptadores de fronteira.

---

# 66. Design de canais IPC

Usar namespace:

```text
files:open
files:save
settings:get
settings:update
updates:check
window:minimize
auth:logout
```

Evitar:

```text
action
command
do
execute
ipc
```

Canais genéricos incentivam payloads genéricos e vulneráveis.

---

# 67. Schemas de validação

Quando projeto já usa biblioteca de schema:

- Zod;
- Valibot;
- Joi;
- Ajv;
- outra biblioteca existente;

reutilizar para validar inputs IPC.

Exemplo conceitual:

```js
const parsed = SettingsSchema.parse(input)
```

Não adicionar dependência apenas para uma validação trivial se checagens
simples forem suficientes.

---

# 99. Security Baseline para IPC

```js
function validateSender(event) {
  const url = event.senderFrame?.url

  if (!url) {
    throw new Error('Missing sender URL')
  }

  const parsed = new URL(url)

  if (parsed.protocol !== 'app:') {
    throw new Error('Untrusted IPC sender')
  }
}
```

A implementação exata depende do esquema de origem do app.

Não copiar literalmente sem ajustar ao projeto.

---

# 114. Preload Design

Um bom preload:

```text
100% explícito
mínimo
sem lógica de negócio pesada
sem segredos
sem acesso genérico a Node
com APIs semânticas
com cleanup de listeners
com validação básica
```

Ruim:

```js
window.require = require
window.fs = require('fs')
window.electron = require('electron')
```

---

# 115. API Surface

Pergunta obrigatória ao adicionar método no preload:

> O renderer realmente precisa desta capacidade?

Se sim:

> Qual é a menor função que entrega essa capacidade?

Exemplo:

Melhor:

```js
getCurrentUserAvatar()
```

Pior:

```js
readAnyFile(path)
```

---

# 116. Remote Procedure Design

Evitar API IPC estilo:

```js
invoke('execute', {
  module: 'fs',
  method: 'readFile',
  args: [...]
})
```

Isso recria RCE sobre IPC.

Cada ação privilegiada deve ter endpoint semântico.

---

# 117. Authentication vs Authorization

O renderer declarar:

```json
{ "isAdmin": true }
```

não é autorização.

O main deve verificar estado confiável próprio.

Nunca confiar em role/permission enviada pelo renderer.

---

# 153. Frames e IPC

Em aplicações com iframes, validar o frame real que enviou mensagem.

Não assumir:

```text
sender webContents = trusted page
```

implica:

```text
sender frame = trusted frame
```

---
`````

### 04_seguranca_e_hardening.md

`````markdown
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
`````

### 05_apis_nativas_e_integracao_so.md

`````markdown
# 29. Menu e MenuItem

APIs:

- `Menu`
- `MenuItem`

Podem criar:

- application menu;
- context menu;
- submenu;
- roles nativas;
- accelerator keys.

Preferir roles nativas quando disponíveis:

```js
{
  role: 'copy'
}
```

em vez de reimplementar ações comuns manualmente.

---

# 30. Tray

`Tray` permite ícone persistente na área de sistema.

Cuidados:

- manter referência JS para evitar garbage collection;
- diferenças de comportamento entre plataformas;
- ícones adequados ao sistema;
- menus de contexto;
- double click / click;
- lifecycle em background.

---

# 31. Dialog

`dialog` permite:

- abrir arquivo;
- abrir diretório;
- salvar arquivo;
- message box;
- error box;
- certificados quando aplicável.

Para IPC:

```js
ipcMain.handle('dialog:open-file', async (event) => {
  validateSender(event)

  const result = await dialog.showOpenDialog({
    properties: ['openFile']
  })

  return result.canceled ? null : result.filePaths[0]
})
```

Não permitir que o renderer determine opções perigosas sem validação.

---

# 32. Clipboard

`clipboard` permite ler e escrever:

- texto;
- HTML;
- imagem;
- bookmarks;
- formatos customizados conforme plataforma.

Tratar dados de clipboard como não confiáveis.

Nunca executar conteúdo do clipboard.

---

# 33. NativeImage

`nativeImage` é usado para:

- ícones;
- tray;
- dock;
- thumbnails;
- imagens nativas;
- conversão PNG/JPEG;
- escala e representations.

Considerar DPI e `scaleFactor`.

---

# 34. Native Theme

`nativeTheme` permite integrar dark/light/system theme.

Usos:

- `shouldUseDarkColors`;
- detectar mudanças;
- configurar `themeSource`.

Renderer pode receber atualização via IPC ou media queries.

---

# 35. Notifications

`Notification` integra notificações nativas.

Considerar:

- suporte específico de plataforma;
- permissão;
- actions;
- icon;
- click;
- toast configuration no Windows;
- assinatura/identidade da aplicação.

---

# 36. Global Shortcut

`globalShortcut` registra atalhos do sistema.

Registrar após `app.whenReady()`.

Liberar em `will-quit`:

```js
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
```

Evitar atalhos conflitantes ou excessivos.

---

# 37. Screen

`screen` permite:

- listar displays;
- converter coordenadas;
- obter display primário;
- detectar add/remove/update de monitores;
- trabalhar com cursor.

Usar após `app` estar ready.

Ao restaurar posição de janela:

- verificar se o display ainda existe;
- impedir janela completamente fora da tela;
- considerar DPI.

---

# 38. Desktop Capturer

`desktopCapturer` permite obter fontes de tela/janelas para captura.

Cuidados:

- consentimento;
- permissões de sistema;
- macOS screen recording permission;
- exposição de dados sensíveis;
- thumbnails;
- performance.

---

# 39. PowerMonitor e PowerSaveBlocker

`powerMonitor`:

- suspensão;
- resume;
- lock/unlock;
- mudança de energia;
- estado idle quando suportado.

`powerSaveBlocker` impede certas formas de suspensão.

Usar apenas pelo período necessário.

Sempre liberar blocker após finalizar a operação.

---

# 48. Protocol

`protocol` implementa schemes customizados.

Casos:

- servir recursos internos;
- criar origem da aplicação;
- integrar URLs customizadas.

Atenção a:

- registro antes do uso conforme API;
- privilégios de scheme;
- standard/secure semantics;
- CSP;
- CORS;
- path traversal.

---

# 49. Deep Links

Fluxo típico:

macOS:
- `open-url`;

Windows/Linux:
- argumentos de command line;
- protocolo registrado;
- single-instance handling.

Regras:

- validar scheme;
- validar host;
- validar path;
- validar query;
- não executar comandos diretamente;
- tratar URL como input não confiável.

---

# 50. File Associations

Abrir arquivos requer:

- configuração de pacote/installer;
- manipulação de argumentos;
- `open-file` no macOS;
- single instance;
- validação do caminho;
- segurança de parser.

Nunca confiar no conteúdo do arquivo apenas por sua extensão.

---

# 52. System Preferences

`systemPreferences` expõe funções específicas do sistema.

Muitas APIs são platform-specific.

Sempre verificar:

- plataforma;
- versão do OS;
- entitlements;
- permissões.

---

# 53. macOS

Aspectos típicos:

- Dock lifecycle;
- application menu;
- `activate`;
- `open-file`;
- `open-url`;
- Handoff;
- Touch Bar quando aplicável;
- code signing;
- notarization;
- entitlements;
- sandbox/hardened runtime;
- accessibility permissions;
- screen recording permissions.

Não assumir comportamento Windows/Linux no macOS.

---

# 54. Windows

Aspectos típicos:

- AppUserModelID;
- taskbar integration;
- jump lists;
- toast notifications;
- file/protocol associations;
- installer;
- code signing;
- registry integration quando necessário;
- shutdown/restart lifecycle differences.

Alguns eventos de quit podem não ocorrer durante shutdown/logout.

---

# 55. Linux

Aspectos típicos:

- desktop files;
- icons;
- X11 vs Wayland;
- package formats;
- keyring backend;
- native dependencies;
- distro compatibility;
- global shortcuts / focus differences;
- sandbox requirements.

Evitar generalizar comportamento de uma distro para todas.

---

# 75. Accessibility

Electron pode integrar APIs de acessibilidade Chromium e do sistema.

Não desabilitar acessibilidade para “melhorar performance” sem evidência.

Interfaces devem:

- usar HTML semântico;
- teclado;
- labels;
- focus;
- contraste;
- screen readers.

---

# 102. Downloads

Ao manipular downloads:

- validar origem;
- escolher diretório;
- tratar nomes;
- evitar overwrite;
- verificar extensão/MIME;
- informar usuário;
- considerar arquivos executáveis;
- tratar cancelamento.

Não abrir automaticamente download não confiável.

---

# 103. Printing

Electron pode imprimir páginas ou gerar PDF via `webContents`.

Antes:

- garantir conteúdo carregado;
- considerar background graphics;
- controlar impressora;
- tratar falhas;
- não imprimir informação sensível inadvertidamente.

---

# 104. PDF

Para exportar UI a PDF, preferir APIs Electron apropriadas sobre hacks de
screenshot quando o objetivo for documento imprimível.

Validar opções na documentação da versão alvo.

---

# 105. Zoom

Gerenciar zoom por `webContents`/`webFrame` conforme contexto.

Evitar dependência de zoom para corrigir layout.

Usar CSS responsivo.

---

# 133. API Categories

O agente deve reconhecer as categorias de API Electron:

## Main process modules

Incluem, entre outros:

- app
- autoUpdater
- BaseWindow
- BrowserWindow
- clipboard
- contentTracing
- crashReporter
- desktopCapturer
- dialog
- globalShortcut
- ImageView
- inAppPurchase
- ipcMain
- Menu
- MenuItem
- MessageChannelMain
- MessagePortMain
- nativeImage
- nativeTheme
- net
- netLog
- Notification
- powerMonitor
- powerSaveBlocker
- process extensions
- protocol
- pushNotifications
- safeStorage
- screen
- session
- sharedTexture
- ShareMenu
- shell
- systemPreferences
- TouchBar
- Tray
- utilityProcess
- webContents
- WebContentsView
- webFrameMain
- View

Além disso existem:

- renderer process modules;
- utility process APIs;
- custom DOM elements;
- classes;
- API structures;
- APIs derivadas de Chromium e Node.

A lista pode mudar entre versões.

---

# 134. `app` API — métodos essenciais

O agente deve conhecer ou saber localizar:

- `quit`
- `exit`
- `relaunch`
- `isReady`
- `whenReady`
- `focus`
- `isActive`
- `hide`
- `isHidden`
- `show`
- `setAppLogsPath`
- `getAppPath`
- `getPath`
- `setPath`
- `getFileIcon`
- version/name/locale APIs
- single-instance APIs
- protocol/file association helpers
- user activity APIs
- login item settings
- accessibility APIs
- GPU APIs
- badges/dock/platform-specific APIs

Como a superfície é extensa, consultar a documentação oficial para assinatura
exata e suporte por plataforma.

---

# 135. App Name e Version

A aplicação deve obter metadata via APIs/package config ao invés de duplicar
strings.

Usos:

- about;
- logs;
- telemetry;
- update checks;
- support bundle.

---

# 136. Locale

Electron expõe APIs de locale.

Não assumir que:

```text
locale = country
timezone = locale
language = locale
```

São conceitos distintos.

---

# 137. GPU

Electron/Chromium pode usar GPU.

Diagnóstico:

- `gpu-info-update`;
- APIs de GPU;
- command-line flags apenas quando justificadas.

Não desabilitar aceleração gráfica globalmente como primeira solução.

Medir e reproduzir primeiro.

---

# 138. Command Line Switches

Electron/Chromium suporta switches.

Regras:

- configurar no momento correto;
- verificar documentação;
- não copiar flags antigas de Stack Overflow;
- evitar flags que enfraquecem sandbox/security;
- documentar motivo.

---

# 139. Accessibility Support

Há APIs para consultar/alterar certos comportamentos de acessibilidade.

Não forçar modos sem necessidade.

Priorizar compatibilidade com ferramentas assistivas.

---

# 140. App Login Items

Quando configurar startup/login:

- respeitar escolha do usuário;
- mostrar setting claro;
- observar diferenças Windows/macOS;
- evitar persistência agressiva.

---

# 141. Recent Documents

APIs de recentes podem integrar arquivos abertos ao sistema.

Usar somente para arquivos relevantes e consentidos.

Limpar quando apropriado.

---

# 142. Dock

No macOS, `app.dock` pode controlar:

- icon;
- badge;
- menu;
- bounce;
- visibility.

Implementação deve ser condicionada a:

```js
process.platform === 'darwin'
```

ou feature detection adequado.

---

# 143. Badges

Badges possuem diferenças por plataforma.

Nunca assumir sem testar.

---

# 144. Jump Lists

Windows possui integração de taskbar/jump list.

Validar requisitos específicos da plataforma.

---

# 145. User Tasks

Recursos nativos de launcher/taskbar devem usar APIs apropriadas, não hacks.

---

# 146. macOS Handoff

Eventos de activity podem permitir continuidade entre dispositivos.

Requer:

- Team ID apropriado;
- activity types;
- Info.plist;
- state serializável.

Não implementar se produto não precisa.

---

# 147. Push Notifications

Quando disponível:

- permissões;
- platform support;
- tokens;
- lifecycle;
- privacy.

Não presumir API uniforme entre OSs.

---

# 148. In-App Purchase

APIs de compra são específicas de plataformas/ecossistemas.

Validar:

- store;
- signing;
- receipt;
- transaction validation;
- server-side verification.

Nunca confiar apenas em flag do renderer para confirmar compra.

---

# 149. Touch Bar

API macOS/compatibilidade específica.

Implementar como enhancement, não requisito central da UI.

---

# 150. Share Menu

Integração de compartilhamento é platform-specific.

Tratar dados compartilhados com privacy awareness.

---

# 151. ImageView / View / SharedTexture

APIs mais avançadas devem ser utilizadas apenas com entendimento de:

- lifecycle;
- rendering pipeline;
- GPU/resources;
- platform/version support.

Para UI convencional, evitar complexidade desnecessária.

---

# 152. WebFrameMain

Permite interação com frames no main.

Ao lidar com iframes:

- validar frame origin;
- considerar frame hierarchy;
- não autorizar IPC apenas pelo top-level URL se subframes puderem enviar;
- usar senderFrame quando aplicável.

---

# 161. CLI Arguments

`process.argv` também é input externo.

Validar:

- flags;
- filenames;
- protocols;
- values.

Não passar argumentos direto para comandos.

---

# 162. Drag and Drop

Arquivos arrastados para UI também são untrusted input.

Validar antes de:

- abrir;
- parsear;
- executar;
- indexar;
- upload.

---

# 163. File Parsing

PDF, imagens, archives, documentos e formatos complexos podem conter conteúdo
malformado.

Para parsers de risco:

- process isolation;
- limits;
- timeout;
- size check;
- dependency updates.

---

# 164. Archive Extraction

Prevenir zip-slip/path traversal.

Nunca extrair entry path sem normalizar e restringir ao diretório de destino.

---
`````

### 06_dados_rede_sessoes_protocolos.md

`````markdown
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
`````

### 07_setup_configuracao_e_dependencias.md

`````markdown
# 61. Native Node Modules

Electron pode usar módulos Node nativos, mas eles precisam ser compatíveis com
o ABI/runtime embarcado.

Considerar:

- rebuild para Electron;
- arquitetura `x64`, `arm64`, etc.;
- Node-API/N-API quando possível;
- toolchain de compilação;
- distribuição de binários;
- code signing quando aplicável.

Electron Forge possui suporte/tooling para rebuild em fluxos comuns.

---

# 90. Dependencies

Electron app carrega:

- Electron;
- Chromium;
- Node.js;
- dependências npm;
- bibliotecas nativas;
- código da aplicação.

Segurança depende do conjunto.

Práticas:

- lockfile;
- auditoria;
- atualização regular;
- reduzir dependências;
- remover pacotes abandonados;
- revisar install scripts.

---
`````

### 08_performance_estabilidade_e_processos.md

`````markdown
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
`````

### 09_testes_debug_e_diagnostico.md

`````markdown
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
`````

### 10_build_release_e_distribuicao.md

`````markdown
# 41. AutoUpdater

`autoUpdater` suporta fluxo de atualização em plataformas e mecanismos
específicos.

O agente deve:

- verificar compatibilidade da plataforma;
- usar endpoints autenticados/HTTPS;
- validar assinatura;
- controlar estados de download;
- informar o usuário quando necessário;
- tratar rollback/falha;
- observar ciclo de `quitAndInstall`.

Nunca sugerir atualização sem considerar code signing.

Electron Forge pode fornecer tooling adicional de publicação.

---

# 82. Packaging

Empacotamento transforma aplicação em artefato distribuível.

Verificar:

- arquivos incluídos;
- `asar`;
- dependências;
- módulos nativos;
- ícones;
- metadata;
- executáveis auxiliares;
- resources;
- environment;
- source maps.

Nunca assumir que paths de desenvolvimento permanecem iguais no pacote.

---

# 83. ASAR

Electron frequentemente empacota código em `app.asar`.

Considerar:

- arquivos que precisam ser executados externamente;
- módulos nativos;
- unpacked files;
- path resolution;
- integridade.

ASAR não é mecanismo de criptografia nem proteção de propriedade intelectual.

---

# 84. Electron Forge

Electron Forge é ferramenta oficial/recomendada no ecossistema Electron para
scaffold, packaging e distribuição.

Áreas:

- makers;
- publishers;
- plugins;
- hooks;
- packaging;
- signing;
- native modules.

Quando projeto usa Forge, preservar sua configuração existente.

---

# 85. Code Signing

Aplicativos distribuídos devem ser assinados quando plataforma/ecossistema
exigir ou recomendar.

Windows:
- Authenticode/code signing.

macOS:
- Developer ID/Application signing;
- Hardened Runtime;
- notarization.

Nunca sugerir desabilitar verificações de assinatura para contornar problema
de release.

---

# 86. Notarization no macOS

Fluxo moderno geralmente requer:

- assinatura correta;
- entitlements;
- hardened runtime;
- submissão à Apple;
- notarization;
- stapling quando aplicável.

A configuração exata depende do tooling e versão atual.

Consultar documentação oficial atualizada.

---

# 87. Distribution

Formatos dependem da plataforma/tooling:

Windows:
- installers;
- packages.

macOS:
- `.app`;
- DMG/ZIP;
- Mac App Store quando aplicável.

Linux:
- deb;
- rpm;
- AppImage;
- snap ou outros formatos conforme tooling.

Testar instalação real em cada plataforma alvo.

---

# 88. Updates e distribuição

A atualização automática depende de:

- formato de distribuição;
- signing;
- servidor/provider;
- metadata;
- versão;
- canal.

Separar:

- stable;
- beta;
- nightly;

quando produto exigir.

Nunca fazer downgrade silencioso sem política explícita.

---

# 89. Versionamento

Usar SemVer quando adequado.

Antes de atualização:

- verificar migrações;
- compatibilidade de dados;
- rollback;
- mudanças Electron;
- breaking changes;
- Node/Chromium upgrades.

---

# 168. Source Maps

Source maps facilitam debugging, mas podem expor código-fonte.

Decidir:

- embarcar;
- enviar para error service;
- manter privados.

Nunca considerar ausência de source map uma barreira de segurança.

---

# 169. Minification

Minificação não é segurança.

Não usar obscurity como controle de acesso.

---

# 182. Distribution Diagnostic Order

1. target OS;
2. architecture;
3. package;
4. native modules;
5. signing;
6. entitlements;
7. notarization;
8. installer;
9. update metadata;
10. smoke test;
11. clean-machine install test.

---
`````

### 11_fluxos_exemplos_e_padroes.md

`````markdown
# 177. Padrão completo mínimo

## `main.js`

```js
const path = require('node:path')
const {
  app,
  BrowserWindow,
  ipcMain,
  dialog
} = require('electron')

let mainWindow

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  })

  win.webContents.setWindowOpenHandler(() => ({
    action: 'deny'
  }))

  win.webContents.on('will-navigate', (event, url) => {
    const parsed = new URL(url)

    if (parsed.protocol !== 'file:') {
      event.preventDefault()
    }
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    if (mainWindow === win) {
      mainWindow = null
    }
  })

  win.loadFile('index.html')

  return win
}

function registerIpc() {
  ipcMain.handle('files:open', async (event) => {
    const url = event.senderFrame?.url ?? ''

    if (!url.startsWith('file://')) {
      throw new Error('Untrusted IPC sender')
    }

    const result = await dialog.showOpenDialog({
      properties: ['openFile']
    })

    if (result.canceled) {
      return null
    }

    return result.filePaths[0]
  })
}

app.whenReady().then(() => {
  registerIpc()

  mainWindow = createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

Observação:

O `startsWith('file://')` acima é aceitável apenas como exemplo didático de
estrutura. Em aplicações reais, a skill deve preferir validação robusta da
origem, idealmente com custom protocol seguro e parsing explícito.

## `preload.js`

```js
const {
  contextBridge,
  ipcRenderer
} = require('electron')

contextBridge.exposeInMainWorld('desktop', {
  openFile() {
    return ipcRenderer.invoke('files:open')
  }
})
```

## renderer

```js
document
  .querySelector('#open-file')
  .addEventListener('click', async () => {
    const file = await window.desktop.openFile()

    console.log(file)
  })
```

---
`````

### 12_politicas_do_agente_e_qualidade.md

`````markdown
# 2. Princípio de autoridade

Ordem de prioridade ao resolver questões Electron:

1. documentação oficial da versão alvo do Electron;
2. documentação oficial `latest`, quando a versão não for informada;
3. tipos TypeScript fornecidos pelo pacote `electron`;
4. release notes e breaking changes da versão alvo;
5. documentação de Electron Forge quando a tarefa envolver Forge;
6. documentação de Node.js e Chromium referente às versões embarcadas;
7. comportamento observado em testes reproduzíveis;
8. conhecimento geral do agente.

Nunca presumir que uma API documentada em versões antigas continua disponível,
nem que uma API marcada como experimental, deprecated ou platform-specific
possui o mesmo comportamento em todas as plataformas.

---

# 171. Code Review Severity

Classificar achados:

```text
CRITICAL
Possível RCE, secret crítico ou privilégio irrestrito.

HIGH
Escape do renderer, filesystem/shell amplo, auth bypass.

MEDIUM
Hardening ausente, validação insuficiente, DoS local.

LOW
Qualidade, defesa em profundidade, manutenção.

INFO
Melhoria não urgente.
```

---

# 172. Migration Procedure

Ao modernizar app Electron antigo:

1. identificar versão atual;
2. identificar versão alvo;
3. ler breaking changes;
4. remover `remote`;
5. remover Node do renderer;
6. criar preload;
7. habilitar context isolation;
8. habilitar sandbox;
9. converter APIs diretas para IPC;
10. validar sender;
11. revisar BrowserView/webview;
12. revisar CSP;
13. atualizar modules nativos;
14. atualizar packaging;
15. executar testes por plataforma.

Migrar incrementalmente.

---

# 175. Quando consultar documentação novamente

Consultar documentação oficial obrigatoriamente quando:

- versão Electron específica for mencionada;
- API estiver deprecated;
- comportamento for platform-specific;
- envolver assinatura/notarização;
- envolver updater;
- envolver store;
- envolver fuses;
- envolver command-line switches;
- envolver permissões nativas;
- envolver módulos nativos;
- envolver API nova;
- houver erro indicando mudança de assinatura;
- uma resposta depender do default atual.

---

# 176. Política para código gerado

Todo código Electron novo deve, por padrão:

- ser compatível com arquitetura main/preload/renderer;
- evitar API deprecated;
- manter security defaults;
- validar inputs privilegiados;
- ter cleanup;
- tratar erro;
- respeitar plataforma;
- usar `path.join`/`path.resolve`;
- não hardcodar secrets;
- não adicionar dependência desnecessária.

---

# 183. Agent Response Policy

Ao responder perguntas Electron:

## Para implementação

Entregar:

- arquitetura;
- código;
- arquivos envolvidos;
- riscos;
- diferenças por plataforma quando relevantes.

## Para erro

Explicar:

- causa provável;
- como confirmar;
- correção mínima;
- correção arquitetural se necessária.

## Para segurança

Ser conservador.

Não sugerir desabilitar controles como solução permanente.

## Para API

Informar:

- processo correto;
- lifecycle necessário;
- platform restrictions;
- deprecated status quando conhecido.

---

# 184. Não inventar APIs

Se não houver certeza sobre:

- nome;
- assinatura;
- retorno;
- evento;
- suporte de plataforma;

consultar a documentação.

Não criar métodos plausíveis que não existem.

---

# 185. Version Awareness

A skill é baseada em documentação `latest`.

O agente deve sempre distinguir:

```text
"documentação atual diz..."
```

de:

```text
"Electron 28 fazia..."
```

Se projeto estiver preso a versão antiga, não aplicar automaticamente API nova.

---

# 186. Segurança como requisito funcional

Em Electron, segurança é parte da arquitetura.

Uma implementação não é considerada correta se funcionar mas exigir:

```js
nodeIntegration: true
contextIsolation: false
webSecurity: false
allowRunningInsecureContent: true
```

sem justificativa legítima.

O agente deve buscar outra solução.

---

# 187. Checklist antes de gerar BrowserWindow

- [ ] O conteúdo é local ou remoto?
- [ ] O preload é necessário?
- [ ] `nodeIntegration` está false?
- [ ] `contextIsolation` está true?
- [ ] sandbox está true?
- [ ] `webSecurity` está true?
- [ ] CSP será aplicada?
- [ ] navigation será restrita?
- [ ] novas janelas serão restritas?
- [ ] permissões serão tratadas?
- [ ] renderer possui apenas APIs mínimas?

---

# 188. Checklist antes de criar IPC

- [ ] O IPC é realmente necessário?
- [ ] O nome do canal é específico?
- [ ] O sender é validado?
- [ ] Os argumentos possuem schema?
- [ ] Existe limite de tamanho?
- [ ] Existe autorização?
- [ ] Paths são validados?
- [ ] URLs são validadas?
- [ ] O retorno contém apenas o necessário?
- [ ] Erros sensíveis são sanitizados?

---

# 189. Checklist antes de carregar URL remota

- [ ] HTTPS?
- [ ] origem allowlisted?
- [ ] Node desabilitado?
- [ ] context isolation?
- [ ] sandbox?
- [ ] permission handler?
- [ ] navegação limitada?
- [ ] popups bloqueados?
- [ ] IPC sender validation?
- [ ] shell external allowlisted?
- [ ] CSP apropriada?

---

# 190. Checklist antes de release

- [ ] Electron atualizado?
- [ ] dependências auditadas?
- [ ] deprecated APIs removidas?
- [ ] segurança revisada?
- [ ] testes passam?
- [ ] package smoke-tested?
- [ ] modules nativos rebuildados?
- [ ] assinatura configurada?
- [ ] notarization quando necessária?
- [ ] updater configurado?
- [ ] logs sanitizados?
- [ ] crash reporting revisado?
- [ ] fuses avaliados?
- [ ] instalação limpa testada?

---

# 191. Checklist de performance

- [ ] main sem sync I/O pesado?
- [ ] renderer sem long tasks?
- [ ] imports lazy quando útil?
- [ ] janelas desnecessárias destruídas?
- [ ] listeners removidos?
- [ ] IPC não é excessivo?
- [ ] imagens otimizadas?
- [ ] cache controlado?
- [ ] startup medido?
- [ ] memory measured?

---

# 192. Critérios de qualidade

Uma solução Electron de alta qualidade deve ser:

- segura;
- explícita;
- multiplataforma ou conscientemente platform-specific;
- testável;
- observável;
- atualizável;
- resiliente a crash;
- eficiente;
- fácil de empacotar;
- compatível com lifecycle;
- baseada em APIs atuais.

---

# 193. Regra de menor privilégio

Para cada contexto:

## Main

Pode ser privilegiado, mas deve minimizar código exposto a input não confiável.

## Utility

Dar apenas o necessário.

## Preload

Expor capabilities mínimas.

## Renderer

Tratar como web app sem privilégios Node.

## Remote content

Tratar como não confiável.

---

# 194. Regra de fronteiras

Toda fronteira é ponto de validação:

```text
network -> main
file -> parser
renderer -> IPC
deep link -> app
clipboard -> renderer
webview -> host
child process -> main
plugin -> host
```

Dados não se tornam confiáveis apenas por terem cruzado uma camada.

---

# 195. Regra sobre exemplos externos

Não copiar exemplos de blogs ou respostas antigas sem verificar:

- versão;
- deprecated APIs;
- security settings;
- platform;
- tooling.

Especial atenção a exemplos antigos com:

- `remote`;
- `nodeIntegration: true`;
- `contextIsolation: false`;
- `enableRemoteModule`;
- BrowserView legado;
- APIs removidas.

---

# 196. Regra sobre troubleshooting inseguro

Nunca resolver erro com:

```js
webSecurity: false
```

ou:

```js
contextIsolation: false
```

ou:

```js
nodeIntegration: true
```

antes de identificar a causa.

Essas opções podem mascarar arquitetura incorreta.

---

# 197. Regra sobre manutenção

Aplicação Electron deve ter processo recorrente para:

- atualizar Electron;
- revisar advisories;
- atualizar dependências;
- testar release;
- revisar APIs deprecated;
- renovar certificates/signing;
- verificar updater.

Electron inclui browser engine, portanto atualização de segurança é importante.

---

# 198. Regra para respostas sobre plataforma

Sempre marcar explicitamente quando comportamento for:

- macOS only;
- Windows only;
- Linux only;
- Windows/macOS;
- dependente de X11/Wayland;
- dependente de store.

---

# 199. Regra para arquitetura existente

Ao modificar projeto existente:

1. respeitar conventions;
2. reutilizar utilities;
3. não adicionar framework desnecessário;
4. preservar module system;
5. preservar tooling;
6. melhorar segurança sem reescrever tudo sem necessidade.

---

# 200. Resultado esperado do agente

Com esta skill ativa, o agente deve ser capaz de atuar como:

- Electron developer;
- Electron architect;
- desktop application engineer;
- IPC designer;
- Electron security reviewer;
- debugging engineer;
- packaging/release engineer;
- migration engineer;
- performance reviewer.

Ele deve produzir soluções que não apenas “funcionem”, mas que estejam de
acordo com o modelo moderno de segurança e processos do Electron.

---

# 201. Fontes oficiais

Fonte principal:

https://www.electronjs.org/docs/latest/

API `app`:

https://www.electronjs.org/docs/latest/api/app

Áreas da documentação que esta skill modela conceitualmente:

- Getting Started
- Process Model
- Context Isolation
- Process Sandboxing
- IPC
- Security
- Performance
- Examples
- Development
- Native Node Modules
- Distribution
- Electron Forge
- Testing and Debugging
- API Reference
- Main Process Modules
- Renderer Process Modules
- Utility Process Modules
- Custom DOM Elements
- Chromium and Node.js
- Classes
- API Structures

---

# 202. Instrução final para o agente

Ao trabalhar com Electron:

> Não comece pela API mais poderosa. Comece pela menor capability que resolve o
> requisito.

> Não conceda Node ao renderer para simplificar arquitetura.

> Não desabilite controles de segurança para contornar erros de desenvolvimento.

> Não confie em IPC, URL, path, deep link, arquivo, conteúdo remoto ou renderer
> apenas porque pertencem à própria aplicação.

> Use `main` para privilégio, `preload` para mediação e `renderer` para UI.

> Considere lifecycle e diferenças de sistema operacional em toda integração
> nativa.

> Prefira APIs atuais e verifique a documentação oficial quando a resposta
> depender de versão, plataforma ou assinatura exata.

Essa é a baseline obrigatória desta skill.
`````
