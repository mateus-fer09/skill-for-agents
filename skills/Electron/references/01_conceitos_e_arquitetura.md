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

