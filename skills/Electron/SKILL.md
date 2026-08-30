---
name: electron
description: "Skill técnica completa e modular para desenvolvimento de aplicações desktop com Electron (Chromium + Node.js). Cobre arquitetura, modelo de processos, IPC, Preload, Context Isolation, APIs completas do Main e Renderer, menus, janelas, tray, notificações, segurança, Electron Forge, auto-update, depuração e integração nativa."
---

# Electron Technical Knowledge Skill

Esta Skill fornece conhecimento técnico exaustivo, fiel e oficial para agentes de IA que projetam, implementam, depuram, empacotam e otimizam aplicações com **Electron**.

## 1. Identidade e Propósito
- **Tecnologia**: [Electron](https://www.electronjs.org/) (Chromium + Node.js)
- **Documentação de Origem**: Site Oficial da Documentação do Electron (`https://www.electronjs.org/pt/docs/latest/`)
- **Escopo Coberto**:
  - Arquitetura e Fundamentos (Modelo de Processos, Context Isolation, Preload Scripts, ESM, Ciclo de Vida)
  - Primeiros Passos (Instalação, Estruturação, Primeiro App, Boilerplates)
  - Comunicação entre Processos (IPC Main/Renderer, MessagePorts, UtilityProcess, Multithreading, Sandboxing)
  - Guias de Recursos (Janelas, Custom Titlebar, Menus, Tray, Notificações, Dark Mode, Atalhos, SO Nativo)
  - Segurança e Performance (Checklist de Segurança, Fuses, ASAR, Assinatura de Código, Otimizações)
  - Distribuição e Publicação (Electron Forge, Auto-Updater, Windows Store, Mac App Store, Snapcraft)
  - Testes e Depuração (VS Code Debugging, DevTools Extensions, Testes Automatizados em CI)
  - Módulos Nativos e C++ (Node-API, C++, Swift, Objective-C)
  - Catálogo Completo da API (Módulos `app`, `BrowserWindow`, `ipcMain`, `ipcRenderer`, `session`, `dialog`, `net`, `tray`, etc.)
  - Todas as 102 Estruturas de Dados e Tipos de Opções

## 2. Instruções de Navegação para o Agente
Quando você precisar resolver uma tarefa relacionada ao Electron:
1. **Consulte [`index_master.md`](index_master.md)** para localizar o arquivo específico do domínio ou a API exata.
2. **Siga a tabela de intenções** no `index_master.md` para navegação direta.
3. **Leia o arquivo de destino específico** para obter detalhes de parâmetros, assinaturas, eventos, restrições e exemplos oficiais.
4. **Para interfaces de opções ou tipos de retorno**, consulte a pasta `api/estruturas/`.
5. **Para migrações e compatibilidade de versões**, consulte `referencia/breaking_changes.md`.

## 3. Regras Fundamentais de Implementação
1. **Nunca invente APIs ou assinaturas**: Consulte sempre a documentação contida nesta Skill.
2. **Sempre adote as práticas de segurança oficiais**:
   - `contextIsolation: true` em todos os `webPreferences`.
   - `nodeIntegration: false` para renderers que carregam conteúdo web.
   - Comunicação segura com `contextBridge.exposeInMainWorld()`.
   - Validação de navegação com eventos `will-navigate` e `setWindowOpenHandler`.
3. **Padrão Assíncrono Recomendado**: Utilize `ipcMain.handle()` no Main Process e `ipcRenderer.invoke()` no Preload script para comunicação bidirecional sem bloqueio de thread.
4. **Preservação de Código**: Todos os exemplos nesta Skill refletem o código oficial testado da documentação.

## 4. Mapa Rápido da Estrutura de Diretórios
- [`fundamentos/`](fundamentos/): Conceitos arquiteturais essenciais, ciclo de vida e isolamento.
- [`primeiros_passos/`](primeiros_passos/): Guias de início rápido, configuração e criação de apps.
- [`processos_e_comunicacao/`](processos_e_comunicacao/): Padrões de IPC, MessageChannel, Web Workers e UtilityProcess.
- [`recursos_e_guias/`](recursos_e_guias/): Funcionalidades de interface de usuário, menus, notificações e integrações com o SO.
- [`seguranca_e_otimizacao/`](seguranca_e_otimizacao/): Práticas recomendadas de segurança, Fuses e performance.
- [`distribuicao_e_publicacao/`](distribuicao_e_publicacao/): Empacotamento com Electron Forge, instaladores e Auto-Updater.
- [`testes_e_depuracao/`](testes_e_depuracao/): Configuração de debug no VS Code e suites de testes automatizados.
- [`nativo_e_desenvolvimento/`](nativo_e_desenvolvimento/): Criação de add-ons nativos C++/Rust e compilação do core.
- [`api/`](api/): Todas as classes e módulos do Electron (`app`, `BrowserWindow`, `session`, `dialog`, etc.).
- [`api/estruturas/`](api/estruturas/): Todos os tipos e estruturas de dados aceitos ou retornados pelas APIs.
- [`referencia/`](referencia/): Breaking changes, flags de linha de comando e variáveis de ambiente.
