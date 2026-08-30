# Electron Master Knowledge Index & Router

Este arquivo é o roteador mestre da Skill do **Electron**. Ele mapeia toda a base de conhecimento oficial organizada para agentes de IA.

## 1. Visão Geral da Tecnologia

O **Electron** é um framework de código aberto para criação de aplicações desktop multiplataforma (Windows, macOS, Linux) utilizando tecnologias web padronizadas: **JavaScript/TypeScript, HTML e CSS**.
O Electron combina o runtime do **Chromium** (para renderização de UI) com o **Node.js** (para acesso ao sistema operacional, sistema de arquivos e APIs de baixo nível) em um modelo de múltiplos processos.

## 2. Regras Globais de Arquitetura e Boas Práticas

1. **Modelo de Processos**: O Electron possui **um** Processo Principal (`Main Process`, `app`, `BrowserWindow`, `ipcMain`) e **múltiplos** Processos de Renderização (`Renderer Process`, UI da página web, `ipcRenderer`).
2. **Isolamento de Contexto (`contextIsolation: true`)**: O isolamento de contexto deve permanecer ativado por padrão. Nunca desative `contextIsolation` em produção.
3. **Integração Node no Renderer (`nodeIntegration: false`)**: Não habilite `nodeIntegration: true` em renderers com conteúdo remoto ou dinâmico.
4. **Comunicação Segura com Preload e Context Bridge**: Utilize scripts de pré-carregamento (`preload.js`) e `contextBridge.exposeInMainWorld()` para expor com segurança apenas métodos específicos ao frontend.
5. **Tratamento de IPC**: Use `ipcMain.handle()` + `ipcRenderer.invoke()` para comunicação bidirecional assíncrona (Promise-based). Use `ipcMain.on()` + `ipcRenderer.send()` para envio unidirecional.
6. **Navegação Segura**: Sempre valide origens em `will-navigate`, configure Content Security Policy (CSP) restritiva e use `setWindowOpenHandler` para links externos.

## 3. Roteamento Rápido por Intenção do Usuário

| Intenção do Usuário | Arquivo Recomendado |
|---|---|
| Instalar Electron / Iniciar novo projeto | [`primeiros_passos/instalacao.md`](primeiros_passos/instalacao.md) / [`primeiros_passos/primeiro_app.md`](primeiros_passos/primeiro_app.md) |
| Entender modelo de processos e ciclo de vida | [`fundamentos/modelo_de_processos.md`](fundamentos/modelo_de_processos.md) / [`fundamentos/introducao.md`](fundamentos/introducao.md) |
| Configurar Preload e Context Isolation | [`fundamentos/isolamento_de_contexto.md`](fundamentos/isolamento_de_contexto.md) / [`fundamentos/preload_scripts.md`](fundamentos/preload_scripts.md) |
| Comunicação entre Processos (IPC) | [`processos_e_comunicacao/ipc_comunicacao_interprocessos.md`](processos_e_comunicacao/ipc_comunicacao_interprocessos.md) |
| Criar e controlar Janelas (`BrowserWindow`) | [`api/browser_window.md`](api/browser_window.md) / [`api/base_window.md`](api/base_window.md) |
| Ciclo de vida da aplicação (`app`) | [`api/app.md`](api/app.md) |
| Configurar menus nativos e contextuais | [`recursos_e_guias/interface_e_janelas/menus.md`](recursos_e_guias/interface_e_janelas/menus.md) / [`api/menu.md`](api/menu.md) |
| Criar ícone de bandeja no sistema (`Tray`) | [`recursos_e_guias/interface_e_janelas/tray.md`](recursos_e_guias/interface_e_janelas/tray.md) / [`api/tray.md`](api/tray.md) |
| Exibir Caixas de Diálogo (`dialog`) | [`api/dialog.md`](api/dialog.md) |
| Executar tarefas pesadas em segundo plano | [`processos_e_comunicacao/utility_process.md`](processos_e_comunicacao/utility_process.md) / [`api/utility_process.md`](api/utility_process.md) |
| Fazer requisições HTTP nativas com Chromium | [`api/net.md`](api/net.md) |
| Gerenciar Cookies, Cache e Sessão | [`api/session.md`](api/session.md) / [`api/cookies.md`](api/cookies.md) |
| Armazenamento Seguro de Credenciais | [`api/safe_storage.md`](api/safe_storage.md) |
| Checklist de Segurança e Vulnerabilidades | [`seguranca_e_otimizacao/checklist_de_seguranca.md`](seguranca_e_otimizacao/checklist_de_seguranca.md) |
| Modificar Fuses binários do Electron | [`seguranca_e_otimizacao/fuses.md`](seguranca_e_otimizacao/fuses.md) |
| Empacotar e Distribuir (Electron Forge) | [`distribuicao_e_publicacao/electron_forge.md`](distribuicao_e_publicacao/electron_forge.md) |
| Auto-atualização de aplicativos | [`distribuicao_e_publicacao/atualizacoes_auto_updater.md`](distribuicao_e_publicacao/atualizacoes_auto_updater.md) / [`api/auto_updater.md`](api/auto_updater.md) |
| Testes Automatizados com Playwright/Spectron | [`testes_e_depuracao/testes_automatizados.md`](testes_e_depuracao/testes_automatizados.md) |
| Depuração no VS Code | [`testes_e_depuracao/depuracao_com_vscode.md`](testes_e_depuracao/depuracao_com_vscode.md) |
| Utilizar Módulos Nativos C++/Rust (Node-API) | [`nativo_e_desenvolvimento/modulos_nativos_node.md`](nativo_e_desenvolvimento/modulos_nativos_node.md) |
| Consultar Breaking Changes e Migração | [`referencia/breaking_changes.md`](referencia/breaking_changes.md) |
| Consultar Switches de Linha de Comando | [`referencia/command_line_switches.md`](referencia/command_line_switches.md) / [`api/command_line_switches.md`](api/command_line_switches.md) |

## 4. Mapa de Contexto e Arquivos Especializados

### [`api/app.md`](api/app.md)

- **Título**: app
- **Descrição**: Documentação técnica e referência da API de app no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/app
- **Exemplos de Código**: 21 bloco(s)

### [`api/auto_updater.md`](api/auto_updater.md)

- **Título**: autoUpdater
- **Descrição**: Documentação técnica e referência da API de autoUpdater no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/auto-updater
- **Exemplos de Código**: 4 bloco(s)

### [`api/base_window.md`](api/base_window.md)

- **Título**: BaseWindow
- **Descrição**: Documentação técnica e referência da API de BaseWindow no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/base-window
- **Exemplos de Código**: 37 bloco(s)

### [`api/browser_view.md`](api/browser_view.md)

- **Título**: BrowserView
- **Descrição**: History[](/docs/latest/breaking-changes#deprecated-browserview)
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/browser-view
- **Exemplos de Código**: 43 bloco(s)

### [`api/browser_window.md`](api/browser_window.md)

- **Título**: BrowserWindow
- **Descrição**: Documentação técnica e referência da API de BrowserWindow no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/browser-window
- **Exemplos de Código**: 53 bloco(s)

### [`api/client_request.md`](api/client_request.md)

- **Título**: Class: ClientRequest
- **Descrição**: ## Class: ClientRequest
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/client-request
- **Exemplos de Código**: 3 bloco(s)

### [`api/clipboard.md`](api/clipboard.md)

- **Título**: clipboard
- **Descrição**: History[ ](/docs/latest/breaking-changes#deprecated-clipboard-api-access-from-renderer-processes)
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/clipboard
- **Exemplos de Código**: 35 bloco(s)

### [`api/clipboard_item.md`](api/clipboard_item.md)

- **Título**: ClipboardItem
- **Descrição**: Documentação técnica e referência da API de ClipboardItem no Electron.
- **Fonte Oficial**: https://electronjs.org/docs/latest/api/clipboard-item
- **Exemplos de Código**: 4 bloco(s)

### [`api/command_line.md`](api/command_line.md)

- **Título**: Classe: Linha de Comando
- **Descrição**: ## Classe: Linha de Comando
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/command-line
- **Exemplos de Código**: 6 bloco(s)

### [`api/command_line_switches.md`](api/command_line_switches.md)

- **Título**: Switches de Linha de Comando Suportadas
- **Descrição**: Documentação técnica e referência da API de Switches de Linha de Comando Suportadas no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/command-line-switches
- **Exemplos de Código**: 5 bloco(s)

### [`api/content_tracing.md`](api/content_tracing.md)

- **Título**: contentTracing
- **Descrição**: Documentação técnica e referência da API de contentTracing no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/content-tracing
- **Exemplos de Código**: 8 bloco(s)

### [`api/context_bridge.md`](api/context_bridge.md)

- **Título**: contextBridge
- **Descrição**: History[ ](/docs/latest/breaking-changes#behavior-changed-ipcrenderer-can-no-longer-be-sent-over-the-contextbridge)
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/context-bridge
- **Exemplos de Código**: 21 bloco(s)

### [`api/cookies.md`](api/cookies.md)

- **Título**: Class: Cookies
- **Descrição**: ## Class: Cookies
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/cookies
- **Exemplos de Código**: 1 bloco(s)

### [`api/corner_smoothing_css.md`](api/corner_smoothing_css.md)

- **Título**: CSS Rule: `-electron-corner-smoothing`
- **Descrição**: ## CSS Rule: -electron-corner-smoothing
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/corner-smoothing-css
- **Exemplos de Código**: 4 bloco(s)

### [`api/crash_reporter.md`](api/crash_reporter.md)

- **Título**: crashReporter
- **Descrição**: Documentação técnica e referência da API de crashReporter no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/crash-reporter
- **Exemplos de Código**: 17 bloco(s)

### [`api/debugger.md`](api/debugger.md)

- **Título**: Class: Debugger
- **Descrição**: ## Class: Debugger
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/debugger
- **Exemplos de Código**: 1 bloco(s)

### [`api/desktop_capturer.md`](api/desktop_capturer.md)

- **Título**: desktopCapturer
- **Descrição**: Documentação técnica e referência da API de desktopCapturer no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/desktop-capturer
- **Exemplos de Código**: 7 bloco(s)

### [`api/dialog.md`](api/dialog.md)

- **Título**: dialog
- **Descrição**: Documentação técnica e referência da API de dialog no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/dialog
- **Exemplos de Código**: 38 bloco(s)

### [`api/dock.md`](api/dock.md)

- **Título**: Dock
- **Descrição**: Documentação técnica e referência da API de Dock no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/dock
- **Exemplos de Código**: 0 bloco(s)

### [`api/download_item.md`](api/download_item.md)

- **Título**: Class: DownloadItem
- **Descrição**: ## Class: DownloadItem
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/download-item
- **Exemplos de Código**: 1 bloco(s)

### [`api/environment_variables.md`](api/environment_variables.md)

- **Título**: Variáveis de Ambiente
- **Descrição**: Documentação técnica e referência da API de Variáveis de Ambiente no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/environment-variables
- **Exemplos de Código**: 12 bloco(s)

### [`api/estruturas/activation_arguments.md`](api/estruturas/activation_arguments.md)

- **Título**: ActivationArguments Object
- **Descrição**: Documentação técnica e referência da API de ActivationArguments Object no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/activation-arguments
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/base_window_options.md`](api/estruturas/base_window_options.md)

- **Título**: BaseWindowConstructorOptions Object
- **Descrição**: - width Integer (optional) - Window's width in pixels. Default is 800 .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/base-window-options
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/bluetooth_device.md`](api/estruturas/bluetooth_device.md)

- **Título**: BluetoothDevice Object
- **Descrição**: - deviceName string
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/bluetooth-device
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/browser_window_options.md`](api/estruturas/browser_window_options.md)

- **Título**: BrowserWindowConstructorOptions Object extends
- **Descrição**: - webPreferences [WebPreferences](/pt/docs/latest/api/structures/web-preferences) (optional) - Settings of web page's features.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/browser-window-options
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/certificate.md`](api/estruturas/certificate.md)

- **Título**: Objeto Certificado
- **Descrição**: - data string - Dados codificados em PEM
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/certificate
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/certificate_principal.md`](api/estruturas/certificate_principal.md)

- **Título**: CertificatePrincipal Object
- **Descrição**: - commonName string - Nome Comum.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/certificate-principal
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/clipboard_bookmark.md`](api/estruturas/clipboard_bookmark.md)

- **Título**: ClipboardBookmark Object
- **Descrição**: - title string - The title of the bookmark.
- **Fonte Oficial**: https://electronjs.org/docs/latest/api/structures/clipboard-bookmark
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/color_space.md`](api/estruturas/color_space.md)

- **Título**: ColorSpace Object
- **Descrição**: -
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/color-space
- **Exemplos de Código**: 11 bloco(s)

### [`api/estruturas/cookie.md`](api/estruturas/cookie.md)

- **Título**: Cookie Object
- **Descrição**: - name string - O nome do cookie.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/cookie
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/cpu_usage.md`](api/estruturas/cpu_usage.md)

- **Título**: Objeto UsoDaCPU
- **Descrição**: - número percentCPUUsage - Porcentagem da CPU usada desde a última chamada de getCPUUsage. A primeira chamada retorna 0.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/cpu-usage
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/crash_report.md`](api/estruturas/crash_report.md)

- **Título**: Objeto de Relatório de Erro
- **Descrição**: - date Date
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/crash-report
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/custom_scheme.md`](api/estruturas/custom_scheme.md)

- **Título**: Objeto
- **Descrição**: - scheme string - Esquemas personalizados que serão registrados com opções.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/custom-scheme
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/desktop_capturer_source.md`](api/estruturas/desktop_capturer_source.md)

- **Título**: DesktopCapturerSource Object
- **Descrição**: - id string - O identificador de uma window ou screen que pode ser usado como uma restrição chromeMediaSourceId ao chamar [ navigator.getUserMedia ](https://developer.mozilla.org/e
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/desktop-capturer-source
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/display.md`](api/estruturas/display.md)

- **Título**: Objeto
- **Descrição**: - accelerometerSupport string - Pode ser available , unavailable , unknown .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/display
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/enable_heap_profiling_options.md`](api/estruturas/enable_heap_profiling_options.md)

- **Título**: EnableHeapProfilingOptions Object
- **Descrição**: - mode string (optional) - Controls which processes are profiled. Equivalent to --memlog in Chrome. Default is all .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/enable-heap-profiling-options
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/extension.md`](api/estruturas/extension.md)

- **Título**: Extension Object
- **Descrição**: - id string
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/extension
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/extension_info.md`](api/estruturas/extension_info.md)

- **Título**: Objeto ExtensionInfo
- **Descrição**: - name string
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/extension-info
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/file_filter.md`](api/estruturas/file_filter.md)

- **Título**: FileFilter Object
- **Descrição**: - name string
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/file-filter
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/file_path_with_headers.md`](api/estruturas/file_path_with_headers.md)

- **Título**: Objeto FilePathWithHeaders
- **Descrição**: - path string - O caminho para o arquivo a ser enviado.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/file-path-with-headers
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/filesystem_permission_request.md`](api/estruturas/filesystem_permission_request.md)

- **Título**: FilesystemPermissionRequest Object extends
- **Descrição**: - filePath string (optional) - The path of the fileSystem request.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/filesystem-permission-request
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/gpu_feature_status.md`](api/estruturas/gpu_feature_status.md)

- **Título**: GPUFeatureStatus Object
- **Descrição**: - 2d_canvas string - Canvas.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/gpu-feature-status
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/hid_device.md`](api/estruturas/hid_device.md)

- **Título**: Objeto HIDDevice
- **Descrição**: - deviceId string - Identificador único deste dispositivo.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/hid-device
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/input_event.md`](api/estruturas/input_event.md)

- **Título**: Objeto InputEvent
- **Descrição**: - type string - Pode ser undefined , mouseDown , mouseUp , mouseMove , mouseEnter , mouseLeave , contextMenu , mouseWheel , rawKeyDown , keyDown , keyUp , char , gestureScrollBegin
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/input-event
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/ipc_main_event.md`](api/estruturas/ipc_main_event.md)

- **Título**: Objeto IpcMainEvent herda de
- **Descrição**: - type String - Possible values include frame
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/ipc-main-event
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/ipc_main_invoke_event.md`](api/estruturas/ipc_main_invoke_event.md)

- **Título**: Objeto IpcMainInvokeEvent herda de
- **Descrição**: - type String - Possible values include frame
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/ipc-main-invoke-event
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/ipc_main_service_worker_event.md`](api/estruturas/ipc_main_service_worker_event.md)

- **Título**: IpcMainServiceWorkerEvent Object extends
- **Descrição**: - type String - Possible values include service-worker .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/ipc-main-service-worker-event
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/ipc_main_service_worker_invoke_event.md`](api/estruturas/ipc_main_service_worker_invoke_event.md)

- **Título**: IpcMainServiceWorkerInvokeEvent Object extends
- **Descrição**: - type String - Possible values include service-worker .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/ipc-main-service-worker-invoke-event
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/ipc_renderer_event.md`](api/estruturas/ipc_renderer_event.md)

- **Título**: Objeto IpcRendererEvent herda de
- **Descrição**: - sender [IpcRenderer](/pt/docs/latest/api/ipc-renderer) - The IpcRenderer instance that emitted the event originally
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/ipc-renderer-event
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/jump_list_category.md`](api/estruturas/jump_list_category.md)

- **Título**: Objeto JumpListCategory
- **Descrição**: - type string (opcional) - Um dos seguintes:
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/jump-list-category
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/jump_list_item.md`](api/estruturas/jump_list_item.md)

- **Título**: JumpListItem Object
- **Descrição**: - type string (opcional) - Um dos seguintes:
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/jump-list-item
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/keyboard_event.md`](api/estruturas/keyboard_event.md)

- **Título**: Objeto KeyboardEvent
- **Descrição**: - ctrlKey boolean (opcional) - se a tecla Ctrl foi usada em um acelerador para acionar o evento
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/keyboard-event
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/keyboard_input_event.md`](api/estruturas/keyboard_input_event.md)

- **Título**: Objeto KeyboardInputEvent herda de
- **Descrição**: - type string - O tipo de evento, pode ser rawKeyDown , keyDown , keyUp ou char .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/keyboard-input-event
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/media_access_permission_request.md`](api/estruturas/media_access_permission_request.md)

- **Título**: MediaAccessPermissionRequest Object extends
- **Descrição**: - securityOrigin string (optional) - The security origin of the request.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/media-access-permission-request
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/memory_info.md`](api/estruturas/memory_info.md)

- **Título**: Objeto MemoryInfo
- **Descrição**: - workingSetSize Integer - A quantidade de memória atualmente fixado a RAM físico real.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/memory-info
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/memory_usage_details.md`](api/estruturas/memory_usage_details.md)

- **Título**: Objeto MemoryUsageDetails
- **Descrição**: - count number
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/memory-usage-details
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/menu_item_badge.md`](api/estruturas/menu_item_badge.md)

- **Título**: MenuItemBadge Object
- **Descrição**: - type string (optional) - Can be alerts , updates , new-items or none . Default is none . See [Creating badges of a specific type](https://developer.apple.com/documentation/appkit
- **Fonte Oficial**: https://electronjs.org/docs/latest/api/structures/menu-item-badge
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/mime_typed_buffer.md`](api/estruturas/mime_typed_buffer.md)

- **Título**: Objeto MimeTypedBuffer
- **Descrição**: - mimeType string (opcional) - MIME type do buffer.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/mime-typed-buffer
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/mouse_input_event.md`](api/estruturas/mouse_input_event.md)

- **Título**: Objeto MouseInputEvent herda de
- **Descrição**: - type string - O tipo do evento, pode ser mouseDown , mouseUp , mouseEnter , mouseLeave , contextMenu , mouseWheel ou mouseMove .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/mouse-input-event
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/mouse_wheel_input_event.md`](api/estruturas/mouse_wheel_input_event.md)

- **Título**: Objeto MouseWheelInputEvent herda de
- **Descrição**: - type string - O tipo do evento, pode ser mouseWheel .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/mouse-wheel-input-event
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/navigation_entry.md`](api/estruturas/navigation_entry.md)

- **Título**: NavigationEntry Object
- **Descrição**: - url string
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/navigation-entry
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/notification_action.md`](api/estruturas/notification_action.md)

- **Título**: Objeto NotificationAction
- **Descrição**: - type string - The type of action, can be button or selection . selection is only supported on Windows.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/notification-action
- **Exemplos de Código**: 8 bloco(s)

### [`api/estruturas/notification_response.md`](api/estruturas/notification_response.md)

- **Título**: Objeto NotificationAction
- **Descrição**: - actionIdentifier string - A string identificadora da ação que o usuário selecionou.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/notification-response
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/offscreen_shared_texture.md`](api/estruturas/offscreen_shared_texture.md)

- **Título**: OffscreenSharedTexture Object
- **Descrição**: - textureInfo Object - The shared texture info.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/offscreen-shared-texture
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/open_external_permission_request.md`](api/estruturas/open_external_permission_request.md)

- **Título**: OpenExternalPermissionRequest Object estende
- **Descrição**: # OpenExternalPermissionRequest Object estende PermissionRequest
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/open-external-permission-request
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/payment_discount.md`](api/estruturas/payment_discount.md)

- **Título**: Objeto PaymentDiscount
- **Descrição**: - identifier string - Uma string usada identificar unicamente uma oferta de desconto para um produto.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/payment-discount
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/permission_request.md`](api/estruturas/permission_request.md)

- **Título**: PermissionRequest Object
- **Descrição**: - requestingUrl string - A última URL que o quadro solicitante carregou.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/permission-request
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/point.md`](api/estruturas/point.md)

- **Título**: Point Object
- **Descrição**: - x number
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/point
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/post_body.md`](api/estruturas/post_body.md)

- **Título**: Objeto PostBody
- **Descrição**: - data ([UploadRawData](/pt/docs/latest/api/structures/upload-raw-data) | [UploadFile](/pt/docs/latest/api/structures/upload-file))[] - The post data to be sent to the new window.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/post-body
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/preload_script.md`](api/estruturas/preload_script.md)

- **Título**: PreloadScript Object
- **Descrição**: - type string - Context type where the preload script will be executed. Possible values include frame or service-worker .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/preload-script
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/preload_script_registration.md`](api/estruturas/preload_script_registration.md)

- **Título**: PreloadScriptRegistration Object
- **Descrição**: - type string - Context type where the preload script will be executed. Possible values include frame or service-worker .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/preload-script-registration
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/print_to_pdf_margins.md`](api/estruturas/print_to_pdf_margins.md)

- **Título**: PrintToPDFMargins Object
- **Descrição**: - top number (optional) - Top margin in inches. Defaults to 1cm (~0.4 inches).
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/print-to-pdf-margins
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/print_to_pdf_options.md`](api/estruturas/print_to_pdf_options.md)

- **Título**: PrintToPDFOptions Object
- **Descrição**: - landscape boolean (optional) - Paper orientation. true for landscape, false for portrait. Defaults to false.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/print-to-pdf-options
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/printer_info.md`](api/estruturas/printer_info.md)

- **Título**: Objeto PrinterInfo
- **Descrição**: - name string - o nome da impressora como entendido pelo SO.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/printer-info
- **Exemplos de Código**: 1 bloco(s)

### [`api/estruturas/process_memory_info.md`](api/estruturas/process_memory_info.md)

- **Título**: Objeto ProcessMemoryInfo
- **Descrição**: - residentSet Integer Linux Windows - A quantidade de memória atualmente fixada para a RAM física real em Kilobytes.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/process-memory-info
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/process_metric.md`](api/estruturas/process_metric.md)

- **Título**: Processamento de Objeto
- **Descrição**: - pid Integer - Processo id of proccesso.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/process-metric
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/product.md`](api/estruturas/product.md)

- **Título**: Product Object
- **Descrição**: - productIdentifier string - string que identifica o produto para a Apple App Store.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/product
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/product_discount.md`](api/estruturas/product_discount.md)

- **Título**: Objeto ProductDiscount
- **Descrição**: - identifier string - Uma string usada identificar unicamente uma oferta de desconto para um produto.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/product-discount
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/product_subscription_period.md`](api/estruturas/product_subscription_period.md)

- **Título**: Objeto ProductSubscriptionPeriod
- **Descrição**: - numberOfUnits number - O número de unidades por período de assinatura.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/product-subscription-period
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/protocol_request.md`](api/estruturas/protocol_request.md)

- **Título**: Objeto ProtocolRequest
- **Descrição**: - string url
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/protocol-request
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/protocol_response.md`](api/estruturas/protocol_response.md)

- **Título**: Objeto ProtocolResponse
- **Descrição**: - error Integer (opcional) - Quando definido, a request vai falhar com o número error . Para os números de erro disponíveis, por favor veja a [lista de net errors](https://source.c
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/protocol-response
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/protocol_response_upload_data.md`](api/estruturas/protocol_response_upload_data.md)

- **Título**: Objeto ProtocolResponseUploadData
- **Descrição**: - contentType string - Tipo MIME do conteúdo.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/protocol-response-upload-data
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/proxy_config.md`](api/estruturas/proxy_config.md)

- **Título**: ProxyConfig Object
- **Descrição**: - mode string (optional) - The proxy mode. Should be one of direct , auto_detect , pac_script , fixed_servers or system . Defaults to pac_script proxy mode if pacScript option is s
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/proxy-config
- **Exemplos de Código**: 1 bloco(s)

### [`api/estruturas/rectangle.md`](api/estruturas/rectangle.md)

- **Título**: Rectangle Object
- **Descrição**: - x number - A coordenada x da origem do retângulo (deve ser um número inteiro).
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/rectangle
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/referrer.md`](api/estruturas/referrer.md)

- **Título**: Referrer Object
- **Descrição**: - url string - Referenciador HTTP para URL.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/referrer
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/render_process_gone_details.md`](api/estruturas/render_process_gone_details.md)

- **Título**: RenderProcessGoneDetails Object
- **Descrição**: - reason string - The reason the render process is gone. Valores possíveis:
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/render-process-gone-details
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/resolved_endpoint.md`](api/estruturas/resolved_endpoint.md)

- **Título**: ResolvedEndpoint Object
- **Descrição**: - address string
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/resolved-endpoint
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/resolved_host.md`](api/estruturas/resolved_host.md)

- **Título**: ResolvedHost Object
- **Descrição**: # ResolvedHost Object
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/resolved-host
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/scrubber_item.md`](api/estruturas/scrubber_item.md)

- **Título**: Objeto ScrubberItem
- **Descrição**: - label string (opcional) - O texto para aparecer neste item.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/scrubber-item
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/segmented_control_segment.md`](api/estruturas/segmented_control_segment.md)

- **Título**: SegmentedControlSegment Object
- **Descrição**: - label string (opcional) - O texto a ser exibido neste segmento.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/segmented-control-segment
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/serial_port.md`](api/estruturas/serial_port.md)

- **Título**: Objeto SerialPort
- **Descrição**: - portId string - Identificador único para a porta.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/serial-port
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/service_worker_info.md`](api/estruturas/service_worker_info.md)

- **Título**: Objeto ServiceWorkerInfo
- **Descrição**: - scriptUrl string - O URL completo para o script que este service worker executa
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/service-worker-info
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/shared_dictionary_info.md`](api/estruturas/shared_dictionary_info.md)

- **Título**: SharedDictionaryInfo Object
- **Descrição**: - match string - The matching path pattern for the dictionary which was declared in 'use-as-dictionary' response header's match option.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/shared-dictionary-info
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/shared_dictionary_usage_info.md`](api/estruturas/shared_dictionary_usage_info.md)

- **Título**: SharedDictionaryUsageInfo Object
- **Descrição**: - frameOrigin string - The origin of the frame where the request originates. It’s specific to the individual frame making the request and is defined by its scheme, host, and port. 
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/shared-dictionary-usage-info
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/shared_texture_handle.md`](api/estruturas/shared_texture_handle.md)

- **Título**: SharedTextureHandle Object
- **Descrição**: - ntHandle Buffer (optional) Windows - NT HANDLE holds the shared texture. Note that this NT HANDLE is local to current process. Output textures of rgba , bgra , rgbaf16 formats do
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-handle
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/shared_texture_import_texture_info.md`](api/estruturas/shared_texture_import_texture_info.md)

- **Título**: SharedTextureImportTextureInfo Object
- **Descrição**: - pixelFormat string - The pixel format of the texture.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-import-texture-info
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/shared_texture_imported.md`](api/estruturas/shared_texture_imported.md)

- **Título**: SharedTextureImported Object
- **Descrição**: - textureId string - The unique identifier of the imported shared texture.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-imported
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/shared_texture_imported_subtle.md`](api/estruturas/shared_texture_imported_subtle.md)

- **Título**: SharedTextureImportedSubtle Object
- **Descrição**: - getVideoFrame Function<[VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame) - Create a VideoFrame that uses the imported shared texture in the current proces
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-imported-subtle
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/shared_texture_subtle.md`](api/estruturas/shared_texture_subtle.md)

- **Título**: SharedTextureSubtle Object
- **Descrição**: - importSharedTexture Function<[SharedTextureImportedSubtle](/pt/docs/latest/api/structures/shared-texture-imported-subtle) - Imports the shared texture from the given options. Ret
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-subtle
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/shared_texture_sync_token.md`](api/estruturas/shared_texture_sync_token.md)

- **Título**: SharedTextureSyncToken Object
- **Descrição**: # SharedTextureSyncToken Object
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-sync-token
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/shared_texture_transfer.md`](api/estruturas/shared_texture_transfer.md)

- **Título**: SharedTextureTransfer Object
- **Descrição**: - transfer string Readonly - The opaque transfer data of the shared texture. This can be transferred across Electron processes.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/shared-texture-transfer
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/shared_worker_info.md`](api/estruturas/shared_worker_info.md)

- **Título**: Objeto SharedWorkerInfo
- **Descrição**: - id string - O id único do shared worker.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/shared-worker-info
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/sharing_item.md`](api/estruturas/sharing_item.md)

- **Título**: Objeto SharingItem
- **Descrição**: - texts string[] (opcional) - Um array de texto a ser compartilhado.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/sharing-item
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/shortcut_details.md`](api/estruturas/shortcut_details.md)

- **Título**: Objeto ShortcutDetails
- **Descrição**: - target string - O alvo à ser executado por este atalho.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/shortcut-details
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/size.md`](api/estruturas/size.md)

- **Título**: Objeto Size
- **Descrição**: - width number - Largura
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/size
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/task.md`](api/estruturas/task.md)

- **Título**: Task Object
- **Descrição**: - program string - Caminho do programa para executar, geralmente você deve especificar process.execPath que abre o programa atual.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/task
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/thumbar_button.md`](api/estruturas/thumbar_button.md)

- **Título**: Objeto ThumbarButton
- **Descrição**: - icon [NativeImage](/pt/docs/latest/api/native-image) - The icon showing in thumbnail toolbar.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/thumbar-button
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/trace_categories_and_options.md`](api/estruturas/trace_categories_and_options.md)

- **Título**: TraceCategoriesAndOptions Object
- **Descrição**: - categoryFilter string - Um filtro para controlar quais grupos de categoria devem ser rastreados. Um filtro pode ter um prefixo '-' opcional para excluir grupos de categorias que 
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/trace-categories-and-options
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/trace_config.md`](api/estruturas/trace_config.md)

- **Título**: Objeto TraceConfig
- **Descrição**: - recording_mode string (opcional) - Pode ser record-until-full , record-continuously , record-as-much-as-possible ou trace-to-console . O padrão é record-until-full .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/trace-config
- **Exemplos de Código**: 1 bloco(s)

### [`api/estruturas/transaction.md`](api/estruturas/transaction.md)

- **Título**: Objeto Transaction
- **Descrição**: - transactionIdentifier string - Uma string que identifica exclusivamente uma transação de pagamento bem-sucedida.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/transaction
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/upload_data.md`](api/estruturas/upload_data.md)

- **Título**: Objeto UploadData
- **Descrição**: - bytes Buffer - Conteúdo sendo enviado.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/upload-data
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/upload_file.md`](api/estruturas/upload_file.md)

- **Título**: Objeto UploadFile
- **Descrição**: - type 'file' - file .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/upload-file
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/upload_raw_data.md`](api/estruturas/upload_raw_data.md)

- **Título**: Objeto UploadRawData
- **Descrição**: - type 'rawData' - rawData .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/upload-raw-data
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/usb_device.md`](api/estruturas/usb_device.md)

- **Título**: Objeto USBDevice
- **Descrição**: - configuration Object (optional) - A [USBConfiguration](https://developer.mozilla.org/en-US/docs/Web/API/USBConfiguration) object containing information about the currently select
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/usb-device
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/user_default_types.md`](api/estruturas/user_default_types.md)

- **Título**: Objeto UserDefaultTypes
- **Descrição**: - string string
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/user-default-types
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/web_preferences.md`](api/estruturas/web_preferences.md)

- **Título**: WebPreferences Object
- **Descrição**: - devTools boolean (optional) - Whether to enable DevTools. If it is set to false , can not use BrowserWindow.webContents.openDevTools() to open DevTools. Por padrão é true .
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/web-preferences
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/web_request_filter.md`](api/estruturas/web_request_filter.md)

- **Título**: Objeto WebRequestFilter
- **Descrição**: - urls string[] - Array of [URL patterns](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns) used to include requests that match these patterns.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/web-request-filter
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/web_socket_options.md`](api/estruturas/web_socket_options.md)

- **Título**: WebSocketOptions Object
- **Descrição**: - protocols string | string[] (optional) - Requested WebSocket subprotocols.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/web-socket-options
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/web_source.md`](api/estruturas/web_source.md)

- **Título**: Objeto WebSource
- **Descrição**: - code string
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/web-source
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/webauthn_account.md`](api/estruturas/webauthn_account.md)

- **Título**: WebAuthnAccount Object
- **Descrição**: - credentialId string - URL-safe base64-encoded (no padding) credential ID of the discoverable credential. Matches PublicKeyCredential.id returned by navigator.credentials.get() in
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/webauthn-account
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/window_open_handler_response.md`](api/estruturas/window_open_handler_response.md)

- **Título**: WindowOpenHandlerResponse Object
- **Descrição**: - action string - Can be allow or deny . Controls whether new window should be created.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/window-open-handler-response
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/window_session_end_event.md`](api/estruturas/window_session_end_event.md)

- **Título**: WindowSessionEndEvent Object extends
- **Descrição**: - reasons string[] - List of reasons for shutdown. Can be 'shutdown', 'close-app', 'critical', or 'logoff'.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/structures/window-session-end-event
- **Exemplos de Código**: 0 bloco(s)

### [`api/estruturas/window_state_persistence.md`](api/estruturas/window_state_persistence.md)

- **Título**: WindowStatePersistence Object
- **Descrição**: - bounds boolean (optional) - Whether to persist window position and size across application restarts. Defaults to true if not specified.
- **Fonte Oficial**: https://electronjs.org/docs/latest/api/structures/window-state-persistence
- **Exemplos de Código**: 0 bloco(s)

### [`api/extensions.md`](api/extensions.md)

- **Título**: Chrome Extension Support
- **Descrição**: Electron supports a subset of the [Chrome Extensions API](https://developer.chrome.com/extensions/api_index), primarily to support DevTools extensions and Chromium-internal extensi
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/extensions
- **Exemplos de Código**: 1 bloco(s)

### [`api/extensions_api.md`](api/extensions_api.md)

- **Título**: Class: Extensions
- **Descrição**: ## Class: Extensions
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/extensions-api
- **Exemplos de Código**: 1 bloco(s)

### [`api/global_shortcut.md`](api/global_shortcut.md)

- **Título**: globalShortcut
- **Descrição**: Documentação técnica e referência da API de globalShortcut no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/global-shortcut
- **Exemplos de Código**: 4 bloco(s)

### [`api/image_view.md`](api/image_view.md)

- **Título**: ImageView
- **Descrição**: Documentação técnica e referência da API de ImageView no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/image-view
- **Exemplos de Código**: 2 bloco(s)

### [`api/in_app_purchase.md`](api/in_app_purchase.md)

- **Título**: inAppPurchase
- **Descrição**: History
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/in-app-purchase
- **Exemplos de Código**: 1 bloco(s)

### [`api/incoming_message.md`](api/incoming_message.md)

- **Título**: Class: IncomingMessage
- **Descrição**: ## Class: IncomingMessage
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/incoming-message
- **Exemplos de Código**: 1 bloco(s)

### [`api/ipc_main.md`](api/ipc_main.md)

- **Título**: ipcMain
- **Descrição**: Documentação técnica e referência da API de ipcMain no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/ipc-main
- **Exemplos de Código**: 6 bloco(s)

### [`api/ipc_main_service_worker.md`](api/ipc_main_service_worker.md)

- **Título**: Class: IpcMainServiceWorker
- **Descrição**: ## Class: IpcMainServiceWorker
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/ipc-main-service-worker
- **Exemplos de Código**: 0 bloco(s)

### [`api/ipc_renderer.md`](api/ipc_renderer.md)

- **Título**: ipcRenderer
- **Descrição**: History[ ](/docs/latest/breaking-changes#behavior-changed-ipcrenderer-can-no-longer-be-sent-over-the-contextbridge)
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/ipc-renderer
- **Exemplos de Código**: 10 bloco(s)

### [`api/menu.md`](api/menu.md)

- **Título**: Menu
- **Descrição**: ## Class: Menu
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/menu
- **Exemplos de Código**: 0 bloco(s)

### [`api/menu_item.md`](api/menu_item.md)

- **Título**: MenuItem
- **Descrição**: ## Class: MenuItem
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/menu-item
- **Exemplos de Código**: 0 bloco(s)

### [`api/message_channel_main.md`](api/message_channel_main.md)

- **Título**: MessageChannelMain
- **Descrição**: MessageChannelMain is the main-process-side equivalent of the DOM [ MessageChannel ](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) object. Its singular function 
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/message-channel-main
- **Exemplos de Código**: 1 bloco(s)

### [`api/message_port_main.md`](api/message_port_main.md)

- **Título**: MessagePortMain
- **Descrição**: MessagePortMain is the main-process-side equivalent of the DOM [ MessagePort ](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort) object. It behaves similarly to the DOM
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/message-port-main
- **Exemplos de Código**: 0 bloco(s)

### [`api/native_image.md`](api/native_image.md)

- **Título**: nativeImage
- **Descrição**: Documentação técnica e referência da API de nativeImage no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/native-image
- **Exemplos de Código**: 12 bloco(s)

### [`api/native_theme.md`](api/native_theme.md)

- **Título**: nativeTheme
- **Descrição**: Documentação técnica e referência da API de nativeTheme no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/native-theme
- **Exemplos de Código**: 0 bloco(s)

### [`api/navigation_history.md`](api/navigation_history.md)

- **Título**: Class: NavigationHistory
- **Descrição**: ## Class: NavigationHistory
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/navigation-history
- **Exemplos de Código**: 0 bloco(s)

### [`api/net.md`](api/net.md)

- **Título**: net
- **Descrição**: Documentação técnica e referência da API de net no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/net
- **Exemplos de Código**: 4 bloco(s)

### [`api/net_log.md`](api/net_log.md)

- **Título**: netLog
- **Descrição**: Documentação técnica e referência da API de netLog no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/net-log
- **Exemplos de Código**: 1 bloco(s)

### [`api/notification.md`](api/notification.md)

- **Título**: Notificação
- **Descrição**: Documentação técnica e referência da API de Notificação no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/notification
- **Exemplos de Código**: 13 bloco(s)

### [`api/parent_port.md`](api/parent_port.md)

- **Título**: parentPort
- **Descrição**: Documentação técnica e referência da API de parentPort no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/parent-port
- **Exemplos de Código**: 1 bloco(s)

### [`api/power_monitor.md`](api/power_monitor.md)

- **Título**: powerMonitor
- **Descrição**: Documentação técnica e referência da API de powerMonitor no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/power-monitor
- **Exemplos de Código**: 0 bloco(s)

### [`api/power_save_blocker.md`](api/power_save_blocker.md)

- **Título**: powerSaveBlocker
- **Descrição**: Documentação técnica e referência da API de powerSaveBlocker no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/power-save-blocker
- **Exemplos de Código**: 1 bloco(s)

### [`api/process.md`](api/process.md)

- **Título**: process
- **Descrição**: Documentação técnica e referência da API de process no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/process
- **Exemplos de Código**: 1 bloco(s)

### [`api/protocol.md`](api/protocol.md)

- **Título**: protocol
- **Descrição**: Documentação técnica e referência da API de protocol no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/protocol
- **Exemplos de Código**: 42 bloco(s)

### [`api/push_notifications.md`](api/push_notifications.md)

- **Título**: pushNotifications
- **Descrição**: Process: [Main](/pt/docs/latest/glossary#main-process)
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/push-notifications
- **Exemplos de Código**: 1 bloco(s)

### [`api/safe_storage.md`](api/safe_storage.md)

- **Título**: safeStorage
- **Descrição**: Documentação técnica e referência da API de safeStorage no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/safe-storage
- **Exemplos de Código**: 0 bloco(s)

### [`api/screen.md`](api/screen.md)

- **Título**: screen
- **Descrição**: Documentação técnica e referência da API de screen no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/screen
- **Exemplos de Código**: 2 bloco(s)

### [`api/service_worker_main.md`](api/service_worker_main.md)

- **Título**: Class: ServiceWorkerMain
- **Descrição**: ## Class: ServiceWorkerMain
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/service-worker-main
- **Exemplos de Código**: 0 bloco(s)

### [`api/service_workers.md`](api/service_workers.md)

- **Título**: Class: ServiceWorkers
- **Descrição**: ## Class: ServiceWorkers
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/service-workers
- **Exemplos de Código**: 2 bloco(s)

### [`api/session.md`](api/session.md)

- **Título**: session
- **Descrição**: Documentação técnica e referência da API de session no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/session
- **Exemplos de Código**: 25 bloco(s)

### [`api/share_menu.md`](api/share_menu.md)

- **Título**: ShareMenu
- **Descrição**: The ShareMenu class creates [Share Menu](https://developer.apple.com/design/human-interface-guidelines/macos/extensions/share-extensions/) on macOS, which can be used to share info
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/share-menu
- **Exemplos de Código**: 1 bloco(s)

### [`api/shared_texture.md`](api/shared_texture.md)

- **Título**: sharedTexture
- **Descrição**: Documentação técnica e referência da API de sharedTexture no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/shared-texture
- **Exemplos de Código**: 0 bloco(s)

### [`api/shell.md`](api/shell.md)

- **Título**: shell
- **Descrição**: Documentação técnica e referência da API de shell no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/shell
- **Exemplos de Código**: 4 bloco(s)

### [`api/system_preferences.md`](api/system_preferences.md)

- **Título**: systemPreferences
- **Descrição**: Documentação técnica e referência da API de systemPreferences no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/system-preferences
- **Exemplos de Código**: 3 bloco(s)

### [`api/touch_bar.md`](api/touch_bar.md)

- **Título**: TouchBar
- **Descrição**: Documentação técnica e referência da API de TouchBar no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/touch-bar
- **Exemplos de Código**: 1 bloco(s)

### [`api/touch_bar_button.md`](api/touch_bar_button.md)

- **Título**: Class: TouchBarButton
- **Descrição**: ## Class: TouchBarButton
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/touch-bar-button
- **Exemplos de Código**: 0 bloco(s)

### [`api/touch_bar_color_picker.md`](api/touch_bar_color_picker.md)

- **Título**: Class: TouchBarColorPicker
- **Descrição**: ## Class: TouchBarColorPicker
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/touch-bar-color-picker
- **Exemplos de Código**: 0 bloco(s)

### [`api/touch_bar_group.md`](api/touch_bar_group.md)

- **Título**: Class: TouchBarGroup
- **Descrição**: ## Class: TouchBarGroup
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/touch-bar-group
- **Exemplos de Código**: 0 bloco(s)

### [`api/touch_bar_label.md`](api/touch_bar_label.md)

- **Título**: Class: TouchBarLabel
- **Descrição**: ## Class: TouchBarLabel
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/touch-bar-label
- **Exemplos de Código**: 0 bloco(s)

### [`api/touch_bar_other_items_proxy.md`](api/touch_bar_other_items_proxy.md)

- **Título**: Class: TouchBarOtherItemsProxy
- **Descrição**: ## Class: TouchBarOtherItemsProxy
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/touch-bar-other-items-proxy
- **Exemplos de Código**: 0 bloco(s)

### [`api/touch_bar_popover.md`](api/touch_bar_popover.md)

- **Título**: Class: TouchBarPopover
- **Descrição**: ## Class: TouchBarPopover
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/touch-bar-popover
- **Exemplos de Código**: 0 bloco(s)

### [`api/touch_bar_scrubber.md`](api/touch_bar_scrubber.md)

- **Título**: Class: TouchBarScrubber
- **Descrição**: ## Class: TouchBarScrubber
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/touch-bar-scrubber
- **Exemplos de Código**: 0 bloco(s)

### [`api/touch_bar_segmented_control.md`](api/touch_bar_segmented_control.md)

- **Título**: Class: TouchBarSegmentedControl
- **Descrição**: ## Class: TouchBarSegmentedControl
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/touch-bar-segmented-control
- **Exemplos de Código**: 0 bloco(s)

### [`api/touch_bar_slider.md`](api/touch_bar_slider.md)

- **Título**: Class: TouchBarSlider
- **Descrição**: ## Class: TouchBarSlider
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/touch-bar-slider
- **Exemplos de Código**: 0 bloco(s)

### [`api/touch_bar_spacer.md`](api/touch_bar_spacer.md)

- **Título**: Class: TouchBarSpacer
- **Descrição**: ## Class: TouchBarSpacer
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/touch-bar-spacer
- **Exemplos de Código**: 0 bloco(s)

### [`api/tray.md`](api/tray.md)

- **Título**: Tray
- **Descrição**: ## Class: Tray
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/tray
- **Exemplos de Código**: 3 bloco(s)

### [`api/utility_process.md`](api/utility_process.md)

- **Título**: utilityProcess
- **Descrição**: utilityProcess creates a child process with Node.js and Message ports enabled. It provides the equivalent of [ child_process.fork ](https://nodejs.org/dist/latest-v16.x/docs/api/ch
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/utility-process
- **Exemplos de Código**: 4 bloco(s)

### [`api/view.md`](api/view.md)

- **Título**: View
- **Descrição**: Documentação técnica e referência da API de View no Electron.
- **Fonte Oficial**: https://electronjs.org/docs/latest/api/view
- **Exemplos de Código**: 1 bloco(s)

### [`api/web_contents.md`](api/web_contents.md)

- **Título**: webContents
- **Descrição**: Documentação técnica e referência da API de webContents no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/web-contents
- **Exemplos de Código**: 108 bloco(s)

### [`api/web_contents_view.md`](api/web_contents_view.md)

- **Título**: WebContentsView
- **Descrição**: Documentação técnica e referência da API de WebContentsView no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/web-contents-view
- **Exemplos de Código**: 2 bloco(s)

### [`api/web_frame.md`](api/web_frame.md)

- **Título**: webFrame
- **Descrição**: Documentação técnica e referência da API de webFrame no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/web-frame
- **Exemplos de Código**: 6 bloco(s)

### [`api/web_frame_main.md`](api/web_frame_main.md)

- **Título**: webFrameMain
- **Descrição**: Documentação técnica e referência da API de webFrameMain no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/web-frame-main
- **Exemplos de Código**: 21 bloco(s)

### [`api/web_request.md`](api/web_request.md)

- **Título**: Class: WebRequest
- **Descrição**: ## Class: WebRequest
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/web-request
- **Exemplos de Código**: 2 bloco(s)

### [`api/web_socket.md`](api/web_socket.md)

- **Título**: Class: WebSocket extends `EventTarget`
- **Descrição**: ## Class: WebSocket extends EventTarget
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/web-socket
- **Exemplos de Código**: 1 bloco(s)

### [`api/web_utils.md`](api/web_utils.md)

- **Título**: webUtils
- **Descrição**: Documentação técnica e referência da API de webUtils no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/web-utils
- **Exemplos de Código**: 2 bloco(s)

### [`api/webview_tag.md`](api/webview_tag.md)

- **Título**: <webview>
- **Descrição**: ## Atenção
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/webview-tag
- **Exemplos de Código**: 22 bloco(s)

### [`api/window_open.md`](api/window_open.md)

- **Título**: Abrindo janelas a partir do renderizador
- **Descrição**: Existem várias maneiras de controlar como as janelas são criadas a partir de conteúdo confiável ou não confiável dentro de um renderizador. Windows can be created from the renderer
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/api/window-open
- **Exemplos de Código**: 3 bloco(s)

### [`distribuicao_e_publicacao/application_distribution.md`](distribuicao_e_publicacao/application_distribution.md)

- **Título**: Empacotamento de Aplicativos
- **Descrição**: To distribute your app with Electron, you need to package and rebrand it. To do this, you can either use specialized tooling or manual approaches.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/application-distribution
- **Exemplos de Código**: 5 bloco(s)

### [`distribuicao_e_publicacao/distribution_overview.md`](distribuicao_e_publicacao/distribution_overview.md)

- **Título**: Distribution Overview
- **Descrição**: Once your app is ready for production, there are a couple steps you need to take before you can deliver it to your users.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/distribution-overview
- **Exemplos de Código**: 0 bloco(s)

### [`distribuicao_e_publicacao/forge_overview.md`](distribuicao_e_publicacao/forge_overview.md)

- **Título**: Distributing Apps With Electron Forge
- **Descrição**: Electron Forge is a tool for packaging and publishing Electron applications. It unifies Electron's build tooling ecosystem into a single extensible interface so that anyone can jum
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/forge-overview
- **Exemplos de Código**: 0 bloco(s)

### [`distribuicao_e_publicacao/mac_app_store_submission_guide.md`](distribuicao_e_publicacao/mac_app_store_submission_guide.md)

- **Título**: Guia para Mac App Store
- **Descrição**: Este guia fornece informações sobre:
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/mac-app-store-submission-guide
- **Exemplos de Código**: 10 bloco(s)

### [`distribuicao_e_publicacao/snapcraft.md`](distribuicao_e_publicacao/snapcraft.md)

- **Título**: Snapcraft Guide (Linux)
- **Descrição**: This guide provides information on how to package your Electron application for any Snapcraft environment, including the Ubuntu Software Center.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/snapcraft
- **Exemplos de Código**: 14 bloco(s)

### [`distribuicao_e_publicacao/updates.md`](distribuicao_e_publicacao/updates.md)

- **Título**: Atualizando Aplicativos
- **Descrição**: Existem várias maneiras de fornecer atualizações automáticas para seu aplicativo Electron. The easiest and officially supported one is taking advantage of the built-in [Squirrel](h
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/updates
- **Exemplos de Código**: 15 bloco(s)

### [`distribuicao_e_publicacao/windows_arm.md`](distribuicao_e_publicacao/windows_arm.md)

- **Título**: Windows on ARM
- **Descrição**: Se seu aplicativo roda com o Electron 6.0.8 ou superior, agora você pode construí-lo para o Windows 10 no ARM. This considerably improves performance, but requires recompilation of
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/windows-arm
- **Exemplos de Código**: 3 bloco(s)

### [`distribuicao_e_publicacao/windows_store_guide.md`](distribuicao_e_publicacao/windows_store_guide.md)

- **Título**: Guia para Windows Store
- **Descrição**: Com o Windows 10, o bom e velho executável win32 ganhou uma nova irmã: A Plataforma Universal do Windows. O novo formato .appx não apenas disponibiliza várias APIs poderosas como C
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/windows-store-guide
- **Exemplos de Código**: 3 bloco(s)

### [`fundamentos/context_isolation.md`](fundamentos/context_isolation.md)

- **Título**: Context Isolation
- **Descrição**: ## What is it?
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/context-isolation
- **Exemplos de Código**: 9 bloco(s)

### [`fundamentos/electron_timelines.md`](fundamentos/electron_timelines.md)

- **Título**: Versões do Electron
- **Descrição**: Electron frequently releases major versions alongside every other Chromium release. This document focuses on the release cadence and version support policy.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/electron-timelines
- **Exemplos de Código**: 0 bloco(s)

### [`fundamentos/electron_versioning.md`](fundamentos/electron_versioning.md)

- **Título**: Versionamento do Electron
- **Descrição**: Documentação técnica e referência da API de Versionamento do Electron no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/electron-versioning
- **Exemplos de Código**: 10 bloco(s)

### [`fundamentos/esm.md`](fundamentos/esm.md)

- **Título**: ES Modules (ESM) in Electron
- **Descrição**: ## Introdução
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/esm
- **Exemplos de Código**: 12 bloco(s)

### [`fundamentos/introducao.md`](fundamentos/introducao.md)

- **Título**: O que é o Electron?
- **Descrição**: Electron é um framework que te permite criar aplicações desktop com JavaScript, HTML e CSS. Ao embutir o [Chromium](https://www.chromium.org/) e o [Node.js](https://nodejs.org/) no
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/
- **Exemplos de Código**: 0 bloco(s)

### [`fundamentos/process_model.md`](fundamentos/process_model.md)

- **Título**: Modelos de Processo
- **Descrição**: O Electron herda sua arquitetura multi-processo do Chromium, o que torna o framework muito semelhante a um navegador web moderno. This guide will expand on the concepts applied in 
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/process-model
- **Exemplos de Código**: 8 bloco(s)

### [`fundamentos/support.md`](fundamentos/support.md)

- **Título**: This doc has moved!
- **Descrição**: - For information on supported releases, see the [Electron Releases](/pt/docs/latest/tutorial/electron-timelines) doc.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/support
- **Exemplos de Código**: 0 bloco(s)

### [`nativo_e_desenvolvimento/README.md`](nativo_e_desenvolvimento/README.md)

- **Título**: Desenvolvendo com Electron
- **Descrição**: Estes guias destinam-se a pessoas que trabalham no projeto Electron. For guides on Electron app development, see [/docs/README.md](/pt/docs/latest/README#guides-and-tutorials).
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/README
- **Exemplos de Código**: 0 bloco(s)

### [`nativo_e_desenvolvimento/api_history_migration_guide.md`](nativo_e_desenvolvimento/api_history_migration_guide.md)

- **Título**: Electron API History Migration Guide
- **Descrição**: This document demonstrates how to add API History blocks to existing APIs.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/api-history-migration-guide
- **Exemplos de Código**: 11 bloco(s)

### [`nativo_e_desenvolvimento/build_instructions_gn.md`](nativo_e_desenvolvimento/build_instructions_gn.md)

- **Título**: Instruções de Compilação
- **Descrição**: Follow the guidelines below for building Electron itself , for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the prebuilt Elec
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/build-instructions-gn
- **Exemplos de Código**: 32 bloco(s)

### [`nativo_e_desenvolvimento/build_instructions_linux.md`](nativo_e_desenvolvimento/build_instructions_linux.md)

- **Título**: Instruções para Configurar (Linux)
- **Descrição**: Follow the guidelines below for building Electron itself on Linux, for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the prebu
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/build-instructions-linux
- **Exemplos de Código**: 4 bloco(s)

### [`nativo_e_desenvolvimento/build_instructions_macos.md`](nativo_e_desenvolvimento/build_instructions_macos.md)

- **Título**: Instruções de Compilação (macOS)
- **Descrição**: Follow the guidelines below for building Electron itself on macOS, for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the prebu
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/build-instructions-macos
- **Exemplos de Código**: 2 bloco(s)

### [`nativo_e_desenvolvimento/build_instructions_windows.md`](nativo_e_desenvolvimento/build_instructions_windows.md)

- **Título**: Instruções para Configuração (Windows)
- **Descrição**: Follow the guidelines below for building Electron itself on Windows, for the purposes of creating custom Electron binaries. For bundling and distributing your app code with the pre
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/build-instructions-windows
- **Exemplos de Código**: 4 bloco(s)

### [`nativo_e_desenvolvimento/chromium_development.md`](nativo_e_desenvolvimento/chromium_development.md)

- **Título**: Desenvolvimento do Chromium
- **Descrição**: Documentação técnica e referência da API de Desenvolvimento do Chromium no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/chromium-development
- **Exemplos de Código**: 0 bloco(s)

### [`nativo_e_desenvolvimento/clang_tidy.md`](nativo_e_desenvolvimento/clang_tidy.md)

- **Título**: Using clang-tidy on C++ Code
- **Descrição**: [ clang-tidy ](https://clang.llvm.org/extra/clang-tidy/) is a tool to automatically check C/C++/Objective-C code for style violations, programming errors, and best practices.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/clang-tidy
- **Exemplos de Código**: 0 bloco(s)

### [`nativo_e_desenvolvimento/coding_style.md`](nativo_e_desenvolvimento/coding_style.md)

- **Título**: Estilo de Codificação
- **Descrição**: Essas são as diretrizes para programar no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/coding-style
- **Exemplos de Código**: 0 bloco(s)

### [`nativo_e_desenvolvimento/creating_api.md`](nativo_e_desenvolvimento/creating_api.md)

- **Título**: Creating a New Electron Browser Module
- **Descrição**: Welcome to the Electron API guide! If you are unfamiliar with creating a new Electron API module within the [ browser ](https://github.com/electron/electron/tree/main/shell/browser
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/creating-api
- **Exemplos de Código**: 7 bloco(s)

### [`nativo_e_desenvolvimento/debugging.md`](nativo_e_desenvolvimento/debugging.md)

- **Título**: Electron Debugging
- **Descrição**: There are many different approaches to debugging issues and bugs in Electron, many of which are platform specific.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/debugging
- **Exemplos de Código**: 4 bloco(s)

### [`nativo_e_desenvolvimento/debugging_on_macos.md`](nativo_e_desenvolvimento/debugging_on_macos.md)

- **Título**: Depuração no macOS
- **Descrição**: If you experience crashes or issues in Electron that you believe are not caused by your JavaScript application, but instead by Electron itself, debugging can be a little bit tricky
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/debugging-on-macos
- **Exemplos de Código**: 7 bloco(s)

### [`nativo_e_desenvolvimento/debugging_on_windows.md`](nativo_e_desenvolvimento/debugging_on_windows.md)

- **Título**: Depuração no Windows
- **Descrição**: Se experimentar falhas ou problemas no Electron que acredita que não são causados pelo seu aplicativo de JavaScript, mas devido ao próprio Electron, a depuração pode ser um pouco c
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/debugging-on-windows
- **Exemplos de Código**: 1 bloco(s)

### [`nativo_e_desenvolvimento/debugging_with_symbol_server.md`](nativo_e_desenvolvimento/debugging_with_symbol_server.md)

- **Título**: Configuração para servidor de símbolos no Depurador
- **Descrição**: Debug symbols allow you to have better debugging sessions. They have information about the functions contained in executables and dynamic libraries and provide you with information
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/debugging-with-symbol-server
- **Exemplos de Código**: 3 bloco(s)

### [`nativo_e_desenvolvimento/debugging_with_xcode.md`](nativo_e_desenvolvimento/debugging_with_xcode.md)

- **Título**: Debugging with XCode
- **Descrição**: ## Debugging with XCode
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/debugging-with-xcode
- **Exemplos de Código**: 1 bloco(s)

### [`nativo_e_desenvolvimento/issues.md`](nativo_e_desenvolvimento/issues.md)

- **Título**: Questões com o Electron
- **Descrição**: - [How to Contribute to Issues](#how-to-contribute-to-issues)
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/issues
- **Exemplos de Código**: 0 bloco(s)

### [`nativo_e_desenvolvimento/multi_monitor_testing.md`](nativo_e_desenvolvimento/multi_monitor_testing.md)

- **Título**: Multi-Monitor Testing
- **Descrição**: The virtualDisplay addon leverages macOS CoreGraphics APIs to create virtual displays, allowing you to write and run multi-monitor tests without the need for physical monitors. Due
- **Fonte Oficial**: https://electronjs.org/docs/latest/development/multi-monitor-testing
- **Exemplos de Código**: 8 bloco(s)

### [`nativo_e_desenvolvimento/native_code_and_electron.md`](nativo_e_desenvolvimento/native_code_and_electron.md)

- **Título**: Native Code and Electron
- **Descrição**: One of Electron's most powerful features is the ability to combine web technologies with native code - both for compute-intensive logic as well as for the occasional native user in
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/native-code-and-electron
- **Exemplos de Código**: 15 bloco(s)

### [`nativo_e_desenvolvimento/native_code_and_electron_cpp_linux.md`](nativo_e_desenvolvimento/native_code_and_electron_cpp_linux.md)

- **Título**: Native Code and Electron: C++ (Linux)
- **Descrição**: This tutorial builds on the [general introduction to Native Code and Electron](/pt/docs/latest/tutorial/native-code-and-electron) and focuses on creating a native addon for Linux u
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/native-code-and-electron-cpp-linux
- **Exemplos de Código**: 23 bloco(s)

### [`nativo_e_desenvolvimento/native_code_and_electron_cpp_win32.md`](nativo_e_desenvolvimento/native_code_and_electron_cpp_win32.md)

- **Título**: Native Code and Electron: C++ (Windows)
- **Descrição**: This tutorial builds on the [general introduction to Native Code and Electron](/pt/docs/latest/tutorial/native-code-and-electron) and focuses on creating a native addon for Windows
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/native-code-and-electron-cpp-win32
- **Exemplos de Código**: 27 bloco(s)

### [`nativo_e_desenvolvimento/native_code_and_electron_objc_macos.md`](nativo_e_desenvolvimento/native_code_and_electron_objc_macos.md)

- **Título**: Native Code and Electron: Objective-C (macOS)
- **Descrição**: This tutorial builds on the [general introduction to Native Code and Electron](/pt/docs/latest/tutorial/native-code-and-electron) and focuses on creating a native addon for macOS u
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/native-code-and-electron-objc-macos
- **Exemplos de Código**: 21 bloco(s)

### [`nativo_e_desenvolvimento/native_code_and_electron_swift_macos.md`](nativo_e_desenvolvimento/native_code_and_electron_swift_macos.md)

- **Título**: Native Code and Electron: Swift (macOS)
- **Descrição**: This tutorial builds on the [general introduction to Native Code and Electron](/pt/docs/latest/tutorial/native-code-and-electron) and focuses on creating a native addon for macOS u
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/native-code-and-electron-swift-macos
- **Exemplos de Código**: 18 bloco(s)

### [`nativo_e_desenvolvimento/patches.md`](nativo_e_desenvolvimento/patches.md)

- **Título**: Patches in Electron
- **Descrição**: Electron is built on two major upstream projects: Chromium and Node.js. Each of these projects has several of their own dependencies, too. We try our best to use these dependencies
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/patches
- **Exemplos de Código**: 5 bloco(s)

### [`nativo_e_desenvolvimento/pull_requests.md`](nativo_e_desenvolvimento/pull_requests.md)

- **Título**: Pull Requests
- **Descrição**: - [Setting up your local environment](#setting-up-your-local-environment)
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/pull-requests
- **Exemplos de Código**: 8 bloco(s)

### [`nativo_e_desenvolvimento/reclient.md`](nativo_e_desenvolvimento/reclient.md)

- **Título**: Reclient
- **Descrição**: Documentação técnica e referência da API de Reclient no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/reclient
- **Exemplos de Código**: 1 bloco(s)

### [`nativo_e_desenvolvimento/source_code_directory_structure.md`](nativo_e_desenvolvimento/source_code_directory_structure.md)

- **Título**: Estrutura de Diretório do Código Fonte
- **Descrição**: O código-fonte do Electron é separado em algumas partes, respeitando as convenções de separação do Chromium.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/source-code-directory-structure
- **Exemplos de Código**: 3 bloco(s)

### [`nativo_e_desenvolvimento/style_guide.md`](nativo_e_desenvolvimento/style_guide.md)

- **Título**: Guia de estilo de Documentação do Electron
- **Descrição**: Estas são as diretrizes para escrever a documentação do Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/style-guide
- **Exemplos de Código**: 18 bloco(s)

### [`nativo_e_desenvolvimento/testing.md`](nativo_e_desenvolvimento/testing.md)

- **Título**: Testando
- **Descrição**: We aim to keep the code coverage of Electron high. Nós pedidos que todos os pull requests não sejam apenas aprovados em todos os testes já existentes, mas de preferência adicione n
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/testing
- **Exemplos de Código**: 4 bloco(s)

### [`nativo_e_desenvolvimento/using_native_node_modules.md`](nativo_e_desenvolvimento/using_native_node_modules.md)

- **Título**: Módulos Nativos do NodeJS
- **Descrição**: Módulos Node,js nativos são suportados pelo Electron, mas, como Electron tem uma [interface binária de aplicação (ABI)](https://en.wikipedia.org/wiki/Application_binary_interface) 
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/using-native-node-modules
- **Exemplos de Código**: 6 bloco(s)

### [`nativo_e_desenvolvimento/v8_development.md`](nativo_e_desenvolvimento/v8_development.md)

- **Título**: V8 Desenvolvimento
- **Descrição**: Documentação técnica e referência da API de V8 Desenvolvimento no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/development/v8-development
- **Exemplos de Código**: 0 bloco(s)

### [`outros/README.md`](outros/README.md)

- **Título**: Guia Oficial
- **Descrição**: Certifique-se de usar a documentação correspondente a versão do Electron que você esta usando. A versão faz parte da URL desta página. Se não, você provavelmente esta usando a docu
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/README
- **Exemplos de Código**: 0 bloco(s)

### [`outros/why_electron.md`](outros/why_electron.md)

- **Título**: Why Electron
- **Descrição**: Electron is a framework enabling developers to build cross-platform desktop applications for macOS, Windows, and Linux by combining web technologies (HTML, JavaScript, CSS) with No
- **Fonte Oficial**: https://electronjs.org/docs/latest/why-electron
- **Exemplos de Código**: 0 bloco(s)

### [`primeiros_passos/boilerplates_and_clis.md`](primeiros_passos/boilerplates_and_clis.md)

- **Título**: Boilerplates e CLIs
- **Descrição**: O desenvolvimento em Electron não é preconizado - não há "uma maneira única" de se desenvolver, construir, empacotar ou lançar um aplicativo Electron. Recursos adicionais para o El
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/boilerplates-and-clis
- **Exemplos de Código**: 0 bloco(s)

### [`primeiros_passos/installation.md`](primeiros_passos/installation.md)

- **Título**: Advanced Installation Instructions
- **Descrição**: npm install electron --save-dev The preferred method is to install Electron as a development dependency in your app:
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/installation
- **Exemplos de Código**: 13 bloco(s)

### [`primeiros_passos/tutorial_adding_features.md`](primeiros_passos/tutorial_adding_features.md)

- **Título**: Adicionando recursos
- **Descrição**: [!NOTE]
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/tutorial-adding-features
- **Exemplos de Código**: 0 bloco(s)

### [`primeiros_passos/tutorial_first_app.md`](primeiros_passos/tutorial_first_app.md)

- **Título**: Criando seu primeiro aplicativo
- **Descrição**: [!NOTE]
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/tutorial-first-app
- **Exemplos de Código**: 21 bloco(s)

### [`primeiros_passos/tutorial_packaging.md`](primeiros_passos/tutorial_packaging.md)

- **Título**: Empacotando seu aplicativo
- **Descrição**: [!NOTE]
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/tutorial-packaging
- **Exemplos de Código**: 8 bloco(s)

### [`primeiros_passos/tutorial_preload.md`](primeiros_passos/tutorial_preload.md)

- **Título**: Usando scripts de pré-carregamento
- **Descrição**: [!NOTE]
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/tutorial-preload
- **Exemplos de Código**: 18 bloco(s)

### [`primeiros_passos/tutorial_prerequisites.md`](primeiros_passos/tutorial_prerequisites.md)

- **Título**: Pré-requisitos
- **Descrição**: [!NOTE]
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/tutorial-prerequisites
- **Exemplos de Código**: 1 bloco(s)

### [`primeiros_passos/tutorial_publishing_updating.md`](primeiros_passos/tutorial_publishing_updating.md)

- **Título**: Publicando e atualizando
- **Descrição**: [!NOTE]
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/tutorial-publishing-updating
- **Exemplos de Código**: 9 bloco(s)

### [`processos_e_comunicacao/ipc.md`](processos_e_comunicacao/ipc.md)

- **Título**: Comunicação entre Processos
- **Descrição**: Inter-process communication (IPC) is a key part of building feature-rich desktop applications in Electron. Because the main and renderer processes have different responsibilities i
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/ipc
- **Exemplos de Código**: 33 bloco(s)

### [`processos_e_comunicacao/message_ports.md`](processos_e_comunicacao/message_ports.md)

- **Título**: MessagePorts in Electron
- **Descrição**: [ MessagePort ](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)s are a web feature that allow passing messages between different contexts. It's like window.postMessag
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/message-ports
- **Exemplos de Código**: 13 bloco(s)

### [`processos_e_comunicacao/multithreading.md`](processos_e_comunicacao/multithreading.md)

- **Título**: Multitarefa
- **Descrição**: Com o [Web Workers](https://developer.mozilla.org/en/docs/Web/API/Web_Workers_API/Using_web_workers), é possível executar JavaScript em nível de tarefas de um sistema operacional.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/multithreading
- **Exemplos de Código**: 2 bloco(s)

### [`processos_e_comunicacao/repl.md`](processos_e_comunicacao/repl.md)

- **Título**: REPL
- **Descrição**: [Read-Eval-Print-Loop](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) (REPL) is a simple, interactive computer programming environment that takes single user i
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/repl
- **Exemplos de Código**: 1 bloco(s)

### [`processos_e_comunicacao/sandbox.md`](processos_e_comunicacao/sandbox.md)

- **Título**: Process Sandboxing
- **Descrição**: One key security feature in Chromium is that processes can be executed within a sandbox. The sandbox limits the harm that malicious code can cause by limiting access to most system
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/sandbox
- **Exemplos de Código**: 4 bloco(s)

### [`recursos_e_guias/examples.md`](recursos_e_guias/examples.md)

- **Título**: Examples Overview
- **Descrição**: In this section, we have collected a set of guides for common features that you may want to implement in your Electron application. Each guide contains a practical example in a min
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/examples
- **Exemplos de Código**: 3 bloco(s)

### [`recursos_e_guias/integracao_com_so/in_app_purchases.md`](recursos_e_guias/integracao_com_so/in_app_purchases.md)

- **Título**: In-App Purchases
- **Descrição**: ## Preparando
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/in-app-purchases
- **Exemplos de Código**: 2 bloco(s)

### [`recursos_e_guias/integracao_com_so/launch_app_from_url_in_another_app.md`](recursos_e_guias/integracao_com_so/launch_app_from_url_in_another_app.md)

- **Título**: Deep Links
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/launch-app-from-url-in-another-app
- **Exemplos de Código**: 13 bloco(s)

### [`recursos_e_guias/integracao_com_so/linux_desktop_actions.md`](recursos_e_guias/integracao_com_so/linux_desktop_actions.md)

- **Título**: Desktop Launcher Actions
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/linux-desktop-actions
- **Exemplos de Código**: 1 bloco(s)

### [`recursos_e_guias/integracao_com_so/macos_dock.md`](recursos_e_guias/integracao_com_so/macos_dock.md)

- **Título**: Menu do Dock
- **Descrição**: On macOS, the [Dock](https://support.apple.com/en-ca/guide/mac-help/mh35859/mac) is an interface element that displays open and frequently-used apps. While opened or pinned, each a
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/macos-dock
- **Exemplos de Código**: 1 bloco(s)

### [`recursos_e_guias/integracao_com_so/native_file_drag_drop.md`](recursos_e_guias/integracao_com_so/native_file_drag_drop.md)

- **Título**: Nativo Arquivo Drag & Drop
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/native-file-drag-drop
- **Exemplos de Código**: 7 bloco(s)

### [`recursos_e_guias/integracao_com_so/recent_documents.md`](recursos_e_guias/integracao_com_so/recent_documents.md)

- **Título**: Documentos Recentes
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/recent-documents
- **Exemplos de Código**: 4 bloco(s)

### [`recursos_e_guias/integracao_com_so/represented_file.md`](recursos_e_guias/integracao_com_so/represented_file.md)

- **Título**: Representing Files in a BrowserWindow
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/represented-file
- **Exemplos de Código**: 2 bloco(s)

### [`recursos_e_guias/integracao_com_so/windows_taskbar.md`](recursos_e_guias/integracao_com_so/windows_taskbar.md)

- **Título**: Taskbar Customization
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/windows-taskbar
- **Exemplos de Código**: 6 bloco(s)

### [`recursos_e_guias/interface_e_janelas/application_menu.md`](recursos_e_guias/interface_e_janelas/application_menu.md)

- **Título**: Application Menu
- **Descrição**: Each Electron app has a single top-level application menu.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/application-menu
- **Exemplos de Código**: 3 bloco(s)

### [`recursos_e_guias/interface_e_janelas/context_menu.md`](recursos_e_guias/interface_e_janelas/context_menu.md)

- **Título**: Context Menu
- **Descrição**: Context menus are pop-up menus that appear when right-clicking (or pressing a shortcut such as Shift + F10 on Windows) somewhere in an app's interface.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/context-menu
- **Exemplos de Código**: 6 bloco(s)

### [`recursos_e_guias/interface_e_janelas/custom_title_bar.md`](recursos_e_guias/interface_e_janelas/custom_title_bar.md)

- **Título**: Custom Title Bar
- **Descrição**: ## Basic tutorial
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/custom-title-bar
- **Exemplos de Código**: 17 bloco(s)

### [`recursos_e_guias/interface_e_janelas/custom_window_interactions.md`](recursos_e_guias/interface_e_janelas/custom_window_interactions.md)

- **Título**: Custom Window Interactions
- **Descrição**: ## Custom draggable regions
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/custom-window-interactions
- **Exemplos de Código**: 6 bloco(s)

### [`recursos_e_guias/interface_e_janelas/custom_window_styles.md`](recursos_e_guias/interface_e_janelas/custom_window_styles.md)

- **Título**: Custom Window Styles
- **Descrição**: ## Frameless windows
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/custom-window-styles
- **Exemplos de Código**: 4 bloco(s)

### [`recursos_e_guias/interface_e_janelas/dark_mode.md`](recursos_e_guias/interface_e_janelas/dark_mode.md)

- **Título**: Modo escuro
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/dark-mode
- **Exemplos de Código**: 10 bloco(s)

### [`recursos_e_guias/interface_e_janelas/keyboard_shortcuts.md`](recursos_e_guias/interface_e_janelas/keyboard_shortcuts.md)

- **Título**: Atalhos do Teclado
- **Descrição**: ## Accelerators
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/keyboard-shortcuts
- **Exemplos de Código**: 13 bloco(s)

### [`recursos_e_guias/interface_e_janelas/menus.md`](recursos_e_guias/interface_e_janelas/menus.md)

- **Título**: Menus
- **Descrição**: Electron's [Menu](/pt/docs/latest/api/menu) class provides a standardized way to create cross-platform native menus throughout your application.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/menus
- **Exemplos de Código**: 12 bloco(s)

### [`recursos_e_guias/interface_e_janelas/notifications.md`](recursos_e_guias/interface_e_janelas/notifications.md)

- **Título**: Notificações
- **Descrição**: Each operating system has its own mechanism to display notifications to users. Electron's notification APIs are cross-platform, but are different for each process type.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/notifications
- **Exemplos de Código**: 7 bloco(s)

### [`recursos_e_guias/interface_e_janelas/progress_bar.md`](recursos_e_guias/interface_e_janelas/progress_bar.md)

- **Título**: Progress Bars
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/progress-bar
- **Exemplos de Código**: 2 bloco(s)

### [`recursos_e_guias/interface_e_janelas/tray.md`](recursos_e_guias/interface_e_janelas/tray.md)

- **Título**: Tray Menu
- **Descrição**: This guide will take you through the process of creating an icon with its own context menu to the system tray.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/tray
- **Exemplos de Código**: 2 bloco(s)

### [`recursos_e_guias/interface_e_janelas/window_customization.md`](recursos_e_guias/interface_e_janelas/window_customization.md)

- **Título**: Window Customization
- **Descrição**: The [ BrowserWindow ](/pt/docs/latest/api/browser-window) module is the foundation of your Electron application, and it exposes many APIs that let you customize the look and behavi
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/window-customization
- **Exemplos de Código**: 0 bloco(s)

### [`recursos_e_guias/interface_e_janelas/window_state_persistence.md`](recursos_e_guias/interface_e_janelas/window_state_persistence.md)

- **Título**: Window State Persistence
- **Descrição**: ## Overview
- **Fonte Oficial**: https://electronjs.org/docs/latest/tutorial/window-state-persistence
- **Exemplos de Código**: 3 bloco(s)

### [`recursos_e_guias/web_e_dispositivos/accessibility.md`](recursos_e_guias/web_e_dispositivos/accessibility.md)

- **Título**: Acessibilidade
- **Descrição**: As questões de acessibilidade em aplicativos Electron são semelhantes às de sites na Web, já que ambos fazem uso do HTML.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/accessibility
- **Exemplos de Código**: 2 bloco(s)

### [`recursos_e_guias/web_e_dispositivos/devices.md`](recursos_e_guias/web_e_dispositivos/devices.md)

- **Título**: Device Access
- **Descrição**: Like Chromium based browsers, Electron provides access to device hardware through web APIs. For the most part these APIs work like they do in a browser, but there are some differen
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/devices
- **Exemplos de Código**: 16 bloco(s)

### [`recursos_e_guias/web_e_dispositivos/navigation_history.md`](recursos_e_guias/web_e_dispositivos/navigation_history.md)

- **Título**: Navigation History
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/navigation-history
- **Exemplos de Código**: 10 bloco(s)

### [`recursos_e_guias/web_e_dispositivos/offscreen_rendering.md`](recursos_e_guias/web_e_dispositivos/offscreen_rendering.md)

- **Título**: Renderização fora da tela
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/offscreen-rendering
- **Exemplos de Código**: 1 bloco(s)

### [`recursos_e_guias/web_e_dispositivos/online_offline_events.md`](recursos_e_guias/web_e_dispositivos/online_offline_events.md)

- **Título**: Detecção de Evento Online/Offline
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/online-offline-events
- **Exemplos de Código**: 4 bloco(s)

### [`recursos_e_guias/web_e_dispositivos/spellchecker.md`](recursos_e_guias/web_e_dispositivos/spellchecker.md)

- **Título**: SpellChecker
- **Descrição**: Electron has built-in support for Chromium's spellchecker since Electron 8. On Windows and Linux this is powered by Hunspell dictionaries, and on macOS it makes use of the native s
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/spellchecker
- **Exemplos de Código**: 4 bloco(s)

### [`recursos_e_guias/web_e_dispositivos/using_pepper_flash_plugin.md`](recursos_e_guias/web_e_dispositivos/using_pepper_flash_plugin.md)

- **Título**: Pepper Flash Plugin
- **Descrição**: Electron no longer supports the Pepper Flash plugin, as Chrome has removed support.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/using-pepper-flash-plugin
- **Exemplos de Código**: 0 bloco(s)

### [`recursos_e_guias/web_e_dispositivos/web_embeds.md`](recursos_e_guias/web_e_dispositivos/web_embeds.md)

- **Título**: Web Embeds
- **Descrição**: ## Visão Geral
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/web-embeds
- **Exemplos de Código**: 0 bloco(s)

### [`referencia/breaking_changes.md`](referencia/breaking_changes.md)

- **Título**: Breaking Changes
- **Descrição**: Breaking changes will be documented here, and deprecation warnings added to JS code where possible, at least [one major version](/pt/docs/latest/tutorial/electron-versioning#semver
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/breaking-changes
- **Exemplos de Código**: 180 bloco(s)

### [`referencia/claude.md`](referencia/claude.md)

- **Título**: Electron Documentation Guide
- **Descrição**: ## API History Migration
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/CLAUDE
- **Exemplos de Código**: 2 bloco(s)

### [`referencia/experimental.md`](referencia/experimental.md)

- **Título**: Experimental APIs
- **Descrição**: Some of Electron's APIs are tagged with _Experimental_ in the documentation. This tag indicates that the API may not be considered stable and the API may be removed or modified mor
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/experimental
- **Exemplos de Código**: 0 bloco(s)

### [`referencia/faq.md`](referencia/faq.md)

- **Título**: Perguntas Frequentes no Electron
- **Descrição**: ## Por que estou tendo problemas para instalar o Electron?
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/faq
- **Exemplos de Código**: 6 bloco(s)

### [`referencia/glossario.md`](referencia/glossario.md)

- **Título**: Glossário
- **Descrição**: Esta página define alguns termos usados frequentemente no desenvolvimento com Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/glossary
- **Exemplos de Código**: 0 bloco(s)

### [`seguranca_e_otimizacao/asar_archives.md`](seguranca_e_otimizacao/asar_archives.md)

- **Título**: ASAR 'Archives'
- **Descrição**: After creating an [application distribution](/pt/docs/latest/tutorial/application-distribution), the app's source code is usually bundled into an [ASAR archive](https://github.com/
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/asar-archives
- **Exemplos de Código**: 9 bloco(s)

### [`seguranca_e_otimizacao/asar_integrity.md`](seguranca_e_otimizacao/asar_integrity.md)

- **Título**: ASAR Integrity
- **Descrição**: ASAR integrity is a security feature that validates the contents of your app's [ASAR archives](/pt/docs/latest/tutorial/asar-archives) at runtime.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/asar-integrity
- **Exemplos de Código**: 4 bloco(s)

### [`seguranca_e_otimizacao/code_signing.md`](seguranca_e_otimizacao/code_signing.md)

- **Título**: Assinando Código
- **Descrição**: Code signing is a security technology to certify that an app was created by you. You should sign your application so it does not trigger any operating system security warnings.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/code-signing
- **Exemplos de Código**: 5 bloco(s)

### [`seguranca_e_otimizacao/fuses.md`](seguranca_e_otimizacao/fuses.md)

- **Título**: Electron Fuses
- **Descrição**: Documentação técnica e referência da API de Electron Fuses no Electron.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/fuses
- **Exemplos de Código**: 4 bloco(s)

### [`seguranca_e_otimizacao/performance.md`](seguranca_e_otimizacao/performance.md)

- **Título**: Performance
- **Descrição**: Desenvolvedores frequentemente perguntam sobre formas de otimizar a performance de aplicações Electron. Engenheiros de software, consumidores e desenvolvedores de frameworks nem se
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/performance
- **Exemplos de Código**: 3 bloco(s)

### [`seguranca_e_otimizacao/security.md`](seguranca_e_otimizacao/security.md)

- **Título**: Segurança
- **Descrição**: [!NOTE]
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/security
- **Exemplos de Código**: 26 bloco(s)

### [`testes_e_depuracao/application_debugging.md`](testes_e_depuracao/application_debugging.md)

- **Título**: Depuração de Aplicativos
- **Descrição**: Sempre que seu aplicativo Electron não estiver se comportando do jeito que você queria, você pode usar uma gama de ferramentas te dão uma força para descobrir erros no seu código, 
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/application-debugging
- **Exemplos de Código**: 1 bloco(s)

### [`testes_e_depuracao/automated_testing.md`](testes_e_depuracao/automated_testing.md)

- **Título**: Testes automatizados
- **Descrição**: Test automation is an efficient way of validating that your application code works as intended. While Electron doesn't actively maintain its own testing solution, this guide will g
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/automated-testing
- **Exemplos de Código**: 23 bloco(s)

### [`testes_e_depuracao/debugging_main_process.md`](testes_e_depuracao/debugging_main_process.md)

- **Título**: O Processo Principal de Depuração
- **Descrição**: O DevTools em uma janela do navegador do Electron, só pode depurar JavaScript que é executado na janela (ex. uma web página). Para depurar JavaScript que é executado no processo pr
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/debugging-main-process
- **Exemplos de Código**: 1 bloco(s)

### [`testes_e_depuracao/debugging_vscode.md`](testes_e_depuracao/debugging_vscode.md)

- **Título**: Debugging in VSCode
- **Descrição**: This guide goes over how to set up VSCode debugging for both your own Electron project as well as the native Electron codebase.
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/debugging-vscode
- **Exemplos de Código**: 4 bloco(s)

### [`testes_e_depuracao/devtools_extension.md`](testes_e_depuracao/devtools_extension.md)

- **Título**: Extensão de DevTools
- **Descrição**: Electron supports [Chrome DevTools extensions](https://developer.chrome.com/docs/extensions/how-to/devtools/extend-devtools), which can be used to extend the ability of Chrome's de
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/devtools-extension
- **Exemplos de Código**: 1 bloco(s)

### [`testes_e_depuracao/testing_on_headless_ci.md`](testes_e_depuracao/testing_on_headless_ci.md)

- **Título**: Testing on Headless CI Systems (Travis CI, Jenkins)
- **Descrição**: Sendo baseado no Chromium, o Electron necessita de um driver de vídeo para rodar. If Chromium can't find a display driver, Electron will fail to launch - and therefore not execute 
- **Fonte Oficial**: https://www.electronjs.org/pt/docs/latest/tutorial/testing-on-headless-ci
- **Exemplos de Código**: 1 bloco(s)

