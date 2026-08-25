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

