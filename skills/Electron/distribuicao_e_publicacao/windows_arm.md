---
title: "Windows on ARM"
description: "Se seu aplicativo roda com o Electron 6.0.8 ou superior, agora você pode construí-lo para o Windows 10 no ARM. This considerably improves performance, but requires recompilation of"
topics:
  - "Distribuicao e publicacao"
keywords:
  - "Windows on ARM"
  - "node_modules"
  - "npm_config_arch"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/windows-arm"
---

# Windows on ARM

Se seu aplicativo roda com o Electron 6.0.8 ou superior, agora você pode construí-lo para o Windows 10 no ARM. This considerably improves performance, but requires recompilation of any native modules used in your app. It may also require small fixups to your build and packaging scripts.

## Executando um app básico

Se o seu aplicativo não usa nenhum módulo nativo, então é muito mais fácil criar uma versão do ARM do seu aplicativo.

1. Certifique-se de que o diretório `node_modules` do seu app esteja vazio.

2. Usando um *Prompt de Comando*, execute `set npm_config_arch=arm64` antes de executar `npm install`/`yarn install` como de costume.

3. [If you have Electron installed as a development dependency](/pt/docs/latest/tutorial/tutorial-first-app#initializing-your-npm-project), npm will download and unpack the arm64 version. Você pode então empacotar e distribuir seu aplicativo normalmente.

## General considerations

### Architecture-specific code

Lots of Windows-specific code contains if... else logic that selects between either the x64 or x86 architectures.

```javascript
if (process.arch === 'x64') {  
  // Do 64-bit thing...  
} else {  
  // Do 32-bit thing...  
}  

```

Se você quiser o arm64 como arquitetura de destino, uma lógica como essa normalmente vai selecionar a arquitetura errada, então verifique com muita atenção o seu aplicativo e seus scripts de compilação em busca de condições como essa. Em scripts de compilação e empacotamento personalizados, você sempre deve verificar o valor de `npm_config_arch` no ambiente, em vez de depender da arquitetura no processo atual.

### Módulos nativos

If you use native modules, you must make sure that they compile against v142 of the MSVC compiler (provided in Visual Studio 2017). You must also check that any pre-built `.dll` or `.lib` files provided or referenced by the native module are available for Windows on Arm.

### Testando seu aplicativo

Para testar seu aplicativo, use um dispositivo ARM executando o Windows 10 ARM (versão 1903 ou mais tarde). Certifique-se de copiar seu aplicativo para o dispositivo de destino - a sandbox do Chromium não funcionará corretamente ao carregar seus recursos de aplicativo a partir de um local de rede.

## Development prerequisites

### Node.js/node-gyp

[Node.js v12.9.0 or later is recommended.](https://nodejs.org/en/) If updating to a new version of Node is undesirable, you can instead [update npm's copy of node-gyp manually](https://github.com/nodejs/node-gyp/wiki/Updating-npm's-bundled-node-gyp) to version 5.0.2 or later, which contains the required changes to compile native modules for Arm.

### Visual Studio 2017

O Visual Studio 2017 (qualquer edição) é necessário para a compilação de módulos nativos. Você pode baixar o Visual Studio Community 2017 através do [programa Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/) da Microsoft. Após a instalação, você pode adicionar os componentes específicos do ARM executando o seguinte comando a partir de um *Prompt de Comando*:

```javascript
vs_installer.exe ^  
--add Microsoft.VisualStudio.Workload.NativeDesktop ^  
--add Microsoft.VisualStudio.Component.VC.ATLMFC ^  
--add Microsoft.VisualStudio.Component.VC.Tools.ARM64 ^  
--add Microsoft.VisualStudio.Component.VC.MFC.ARM64 ^  
--includeRecommended  

```

#### Criando um prompt de comando para compilação cruzada

Definir `npm_config_arch=arm64` no ambiente cria os arquivos `.obj` corretos para arm64, mas o *Prompt de Comando do Desenvolvedor para VS 2017* padrão utilizará o vinculador x64. Para corrigir isto:

1. Duplique o atalho do *Prompt de Comando de Ferramentas Cruzadas do x86_x64 para VS 2017* (por exemplo, ao localizá-lo no menu iniciar, clique com o botão direito, selecione *Abrir local do arquivo*, copie e cole) para algum lugar conveniente.

2. Clique com o botão direito no novo atalho e clique em *Propriedades*.

3. Altere o campo *Destino* para que o final dele seja `vcvarsamd64_arm64.bat` ao invés de `vcvarsamd64_x86.bat`.

Se feito com sucesso, o prompt de comando deverá imprimir algo semelhante a isso na inicialização:

```javascript
**********************************************************************  
** Visual Studio 2017 Developer Command Prompt v15.9.15  
** Copyright (c) 2017 Microsoft Corporation  
**********************************************************************  
[vcvarsall.bat] Environment initialized for: 'x64_arm64'  

```

Se você deseja desenvolver seu aplicativo diretamente em um dispositivo do Arm, substitua `vcvarsx86_arm64.bat` no *Destino* para que a compilação cruzada ocorra com a emulação x86 do dispositivo.

### Vinculando com o `node.lib` correto

By default, `node-gyp` unpacks Electron's node headers and downloads the x86 and x64 versions of `node.lib` into `%APPDATA%\..\Local\node-gyp\Cache`, but it does not download the arm64 version ([a fix for this is in development](https://github.com/nodejs/node-gyp/pull/1875).) Para corrigir isto:

1. Baixe a versão arm64 do `node.lib` de [https://electronjs.org/headers/v6.0.9/win-arm64/node.lib](https://electronjs.org/headers/v6.0.9/win-arm64/node.lib)

2. Mova-a para `%APPDATA%\..\Local\node-gyp\Cache\6.0.9\arm64\node.lib`

Substitua `6.0.9` pela versão que você está usando.

## Compilação cruzada de módulos nativos

Depois de completar tudo acima, abra o seu prompt de comando de compilação cruzada e execute `set npm_config_arch=arm64`. Então use o `npm install` para construir seu projeto normalmente. Como com a compilação cruzada de módulos x86, você pode precisar excluir a pasta `node_modules` para forçar a recompilação de módulos nativos se eles tiverem sido compilados anteriormente para outra arquitetura.

## Depurando módulos nativos

Módulos nativos podem ser depurados com o Visual Studio 2017 (funcionando na sua máquina de desenvolvimento) e o [depurador remoto do Visual Studio](https://learn.microsoft.com/en-us/visualstudio/debugger/remote-debugging-cpp?view=vs-2019) correspondente rodando no dispositivo de destino. Para depurar:

1. Launch your app `.exe` on the target device via the *Command Prompt* (passing `--inspect-brk` to pause it before any native modules are loaded).

2. Inicie o Visual Studio 2017 em sua máquina de desenvolvimento.

3. Connect to the target device by selecting *Debug > Attach to Process...* and enter the device's IP address and the port number displayed by the Visual Studio Remote Debugger tool.

4. Click *Refresh* and select the [appropriate Electron process to attach](/pt/docs/latest/development/debugging-on-windows).

5. You may need to make sure that any symbols for native modules in your app are loaded correctly. To configure this, head to *Debug > Options...* in Visual Studio 2017, and add the folders containing your `.pdb` symbols under *Debugging > Symbols*.

6. Once attached, set any appropriate breakpoints and resume JavaScript execution using Chrome's [remote tools for Node](/pt/docs/latest/tutorial/debugging-main-process).

## Getting additional help

Se você encontrar um problema com esta documentação, ou se seu aplicativo funciona quando compilado para x86, mas não para arm64, por favor [registre um problema](/pt/docs/latest/development/issues) com "Windows on Arm" no título.[Editar esta página](https://github.com/electron/electron/edit/main/docs/tutorial/windows-arm.md)
