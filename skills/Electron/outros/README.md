---
title: "Guia Oficial"
description: "Certifique-se de usar a documentação correspondente a versão do Electron que você esta usando. A versão faz parte da URL desta página. Se não, você provavelmente esta usando a docu"
topics:
  - "Outros"
keywords:
  - "Guia Oficial"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/README"
---

# Guia Oficial

Certifique-se de usar a documentação correspondente a versão do Electron que você esta usando. A versão faz parte da URL desta página. Se não, você provavelmente esta usando a documentação da branch de desenvolvimento qual pode conter mudanças da API que pode não ser compatível com a sua versão do Electron. Para ver a documentação de versões anteriores, você pode [procurar pelas tags](https://github.com/electron/electron/tree/v1.4.0) no GitHub, para isso, abra o menu "Switch branches/tags" e selecione a tag da versão que você gostaria de ver.

## Perguntas Frequentes

Há perguntas que são feitas com bastante frequência. Confira isso antes de criar um issue:

- [Perguntas Frequentes no Electron](/pt/docs/latest/faq)

## Guias e Tutoriais

### Guia de Introdução

- [Introdução](/pt/docs/latest/)

- [Modelos de Processo](/pt/docs/latest/tutorial/process-model)

### Aprendendo o básico

- Adicionando Recursos para Seu Aplicativo

  - [Notificações](/pt/docs/latest/tutorial/notifications)

  - [Documentos Recentes](/pt/docs/latest/tutorial/recent-documents)

  - [Progresso do Aplicativo](/pt/docs/latest/tutorial/progress-bar)

  - [Menu Dock Personalizado](/pt/docs/latest/tutorial/macos-dock)

  - [Barra de Tarefas do Windows Personalizado](/pt/docs/latest/tutorial/windows-taskbar)

  - [Ações Desktop Linux Personalizado](/pt/docs/latest/tutorial/linux-desktop-actions)

  - [Atalhos do Teclado](/pt/docs/latest/tutorial/keyboard-shortcuts)

  - [Detecção de Offline/Online](/pt/docs/latest/tutorial/online-offline-events)

  - [Arquivo Representado para o macOS BrowserWindows](/pt/docs/latest/tutorial/represented-file)

  - [Nativo Arquivo Drag & Drop](/pt/docs/latest/tutorial/native-file-drag-drop)

  - [Navigation History](/pt/docs/latest/tutorial/navigation-history)

  - [Renderização fora da tela](/pt/docs/latest/tutorial/offscreen-rendering)

  - [Modo escuro](/pt/docs/latest/tutorial/dark-mode)

  - [Incluir conteúdos Web no Electron](/pt/docs/latest/tutorial/web-embeds)

- [Boilerplates e CLIs](/pt/docs/latest/tutorial/boilerplates-and-clis)

  - [Boilerplate vs CLI](/pt/docs/latest/tutorial/boilerplates-and-clis#boilerplate-vs-cli)

  - [Electron Forge](/pt/docs/latest/tutorial/boilerplates-and-clis#electron-forge)

  - [electron-builder](/pt/docs/latest/tutorial/boilerplates-and-clis#electron-builder)

  - [electron-react-boilerplate](/pt/docs/latest/tutorial/boilerplates-and-clis#electron-react-boilerplate)

  - [Outras Ferramentas e Boilerplates](/pt/docs/latest/tutorial/boilerplates-and-clis#other-tools-and-boilerplates)

### Passos avançados

- Arquitetura do Aplicativo

  - [Usando Módulos Nativos do Node.js](/pt/docs/latest/tutorial/using-native-node-modules)

  - [Estratégias de Performance](/pt/docs/latest/tutorial/performance)

  - [Estratégias de Segurança](/pt/docs/latest/tutorial/security)

  - [Process Sandboxing](/pt/docs/latest/tutorial/sandbox)

- [Acessibilidade](/pt/docs/latest/tutorial/accessibility)

  - [Habilitando manualmente os recursos de acessibilidade](/pt/docs/latest/tutorial/accessibility#manually-enabling-accessibility-features)

- [Teste e Depuração](/pt/docs/latest/tutorial/application-debugging)

  - [O Processo Principal de Depuração](/pt/docs/latest/tutorial/debugging-main-process)

  - [Depurando com Visual Studio Code](/pt/docs/latest/tutorial/debugging-vscode)

  - [Testando em sistemas de CI (Travis, Jenkins)](/pt/docs/latest/tutorial/testing-on-headless-ci)

  - [Extensão de DevTools](/pt/docs/latest/tutorial/devtools-extension)

  - [Testes automatizados](/pt/docs/latest/tutorial/automated-testing)

  - [REPL](/pt/docs/latest/tutorial/repl)

- [Distribuição](/pt/docs/latest/tutorial/application-distribution)

  - [Assinando Código](/pt/docs/latest/tutorial/code-signing)

  - [Mac App Store](/pt/docs/latest/tutorial/mac-app-store-submission-guide)

  - [Windows Store](/pt/docs/latest/tutorial/windows-store-guide)

  - [Snapcraft](/pt/docs/latest/tutorial/snapcraft)

  - [ASAR 'Archives'](/pt/docs/latest/tutorial/asar-archives)

- [Atualizações](/pt/docs/latest/tutorial/updates)

- [Recebendo suporte](/pt/docs/latest/tutorial/support)

## Tutoriais Detalhados

Esses tutoriais individuais explicam os tópicos discutidos no guia acima.

- [Instalando o Electron](/pt/docs/latest/tutorial/installation)

  - [Proxies](/pt/docs/latest/tutorial/installation#proxies)

  - [Mirrors e Caches Customizados](/pt/docs/latest/tutorial/installation#custom-mirrors-and-caches)

  - [Solução de Problemas](/pt/docs/latest/tutorial/installation#troubleshooting)

- Electron Releases & Developer Feedback

  - [Politica de versão](/pt/docs/latest/tutorial/electron-versioning)

  - [Linha do Tempo de Lançamentos](/pt/docs/latest/tutorial/electron-timelines)

---

- [Glossário de Termos](/pt/docs/latest/glossary)

## Referências da API

- [Processamento de Objeto](/pt/docs/latest/api/process)

- [Switches de Linha de Comando Suportadas](/pt/docs/latest/api/command-line-switches)

- [Variáveis de Ambiente](/pt/docs/latest/api/environment-variables)

- [Suporte para extensões do Chrome](/pt/docs/latest/api/extensions)

- [Grandes Alterações na API](/pt/docs/latest/breaking-changes)

### Custom Web Features:

- [`-electron-corner-smoothing` CSS Rule](/pt/docs/latest/api/corner-smoothing-css)

- [`<webview>` Tag](/pt/docs/latest/api/webview-tag)

- [`window.open` Função](/pt/docs/latest/api/window-open)

### Módulos para o Processo Principal:

- [app](/pt/docs/latest/api/app)

- [autoUpdater](/pt/docs/latest/api/auto-updater)

- [BaseWindow](/pt/docs/latest/api/base-window)

- [BrowserWindow](/pt/docs/latest/api/browser-window)

- [contentTracing](/pt/docs/latest/api/content-tracing)

- [desktopCapturer](/pt/docs/latest/api/desktop-capturer)

- [dialog](/pt/docs/latest/api/dialog)

- [globalShortcut](/pt/docs/latest/api/global-shortcut)

- [inAppPurchase](/pt/docs/latest/api/in-app-purchase)

- [ImageView](/pt/docs/latest/api/image-view)

- [ipcMain](/pt/docs/latest/api/ipc-main)

- [Menu](/pt/docs/latest/api/menu)

- [MenuItem](/pt/docs/latest/api/menu-item)

- [MessageChannelMain](/pt/docs/latest/api/message-channel-main)

- [MessagePortMain](/pt/docs/latest/api/message-port-main)

- [nativeTheme](/pt/docs/latest/api/native-theme)

- [net](/pt/docs/latest/api/net)

- [netLog](/pt/docs/latest/api/net-log)

- [Notificação](/pt/docs/latest/api/notification)

- [powerMonitor](/pt/docs/latest/api/power-monitor)

- [powerSaveBlocker](/pt/docs/latest/api/power-save-blocker)

- [protocol](/pt/docs/latest/api/protocol)

- [pushNotifications](/pt/docs/latest/api/push-notifications)

- [safeStorage](/pt/docs/latest/api/safe-storage)

- [screen](/pt/docs/latest/api/screen)

- [ServiceWorkerMain](/pt/docs/latest/api/service-worker-main)

- [session](/pt/docs/latest/api/session)

- [ShareMenu](/pt/docs/latest/api/share-menu)

- [systemPreferences](/pt/docs/latest/api/system-preferences)

- [TouchBar](/pt/docs/latest/api/touch-bar)

- [Tray](/pt/docs/latest/api/tray)

- [utilityProcess](/pt/docs/latest/api/utility-process)

- [Exibir](/pt/docs/latest/api/exibir)

- [webContents](/pt/docs/latest/api/web-contents)

- [webFrameMain](/pt/docs/latest/api/web-frame-main)

- [WebContentsView](/pt/docs/latest/api/web-contents-view)

### Módulos para o Processo de Renderização (Página Web):

- [contextBridge](/pt/docs/latest/api/context-bridge)

- [ipcRenderer](/pt/docs/latest/api/ipc-renderer)

- [webFrame](/pt/docs/latest/api/web-frame)

### Módulos para Ambos os Processos:

- [clipboard](/pt/docs/latest/api/clipboard) (non-sandboxed renderers only)

- [crashReporter](/pt/docs/latest/api/crash-reporter)

- [nativeImage](/pt/docs/latest/api/native-image)

- [shell](/pt/docs/latest/api/shell) (non-sandboxed renderers only)

## Desenvolvimento

See [development/README.md](/pt/docs/latest/development/README)[Editar esta página](https://github.com/electron/electron/edit/main/docs/README.md)
