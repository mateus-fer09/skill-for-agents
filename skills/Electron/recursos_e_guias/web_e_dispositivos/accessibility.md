---
title: "Acessibilidade"
description: "As questões de acessibilidade em aplicativos Electron são semelhantes às de sites na Web, já que ambos fazem uso do HTML."
topics:
  - "Recursos e guias"
  - "Web e dispositivos"
keywords:
  - "Acessibilidade"
  - "AXManualAccessibility"
source_scope:
  - "https://www.electronjs.org/pt/docs/latest/tutorial/accessibility"
---

# Acessibilidade

As questões de acessibilidade em aplicativos Electron são semelhantes às de sites na Web, já que ambos fazem uso do HTML.

## Habilitando manualmente os recursos de acessibilidade

Aplicativos Electron ativarão automaticamente recursos de acessibilidade na presença de tecnologia assistiva (por exemplo, [JAWS](https://www.freedomscientific.com/products/software/jaws/) no Windows ou [VoiceOver](https://help.apple.com/voiceover/mac/10.15/) no macOS). Confira a [documentação de acessibilidade](https://www.chromium.org/developers/design-documents/accessibility#TOC-How-Chrome-detects-the-presence-of-Assistive-Technology) do Chrome para mais detalhes.

Você também pode alterar manualmente esses recursos em seu aplicativo Electron ou definindo bandeiras em softwares nativos de terceiros.

### Usando a API do Electron

By using the [`app.setAccessibilitySupportEnabled(enabled)`](/pt/docs/latest/api/app#appsetaccessibilitysupportenabledenabled-macos-windows) API, you can manually expose Chrome's accessibility tree to users in the application preferences. Observe que os utilitários de assistência do sistema do usuário têm prioridade sobre esta configuração e deverão substituí-la.

### A partir de *software* de terceiros

#### macOS

No macOS, a tecnologia assistiva de terceiros pode alternar recursos de acessibilidade dentro de aplicativos Electron definindo o atributo `AXManualAccessibility` programaticamente:

Usando Objective-C:

```javascript
CFStringRef kAXManualAccessibility = CFSTR("AXManualAccessibility");  
  
+ (void)enableAccessibility:(BOOL)enable inElectronApplication:(NSRunningApplication *)app  
{  
    AXUIElementRef appRef = AXUIElementCreateApplication(app.processIdentifier);  
    if (appRef == nil)  
        return;  
  
    CFBooleanRef value = enable ? kCFBooleanTrue : kCFBooleanFalse;  
    AXUIElementSetAttributeValue(appRef, kAXManualAccessibility, value);  
    CFRelease(appRef);  
}  

```

Usando Swift:

```javascript
import Cocoa  
let name = CommandLine.arguments.count >= 2 ? CommandLine.arguments[1] : "Electron"  
let pid = NSWorkspace.shared.runningApplications.first(where: {$0.localizedName == name})!.processIdentifier  
let axApp = AXUIElementCreateApplication(pid)  
let result = AXUIElementSetAttributeValue(axApp, "AXManualAccessibility" as CFString, true as CFTypeRef)  
print("Setting 'AXManualAccessibility' \(error.rawValue == 0 ? "succeeded" : "failed")")  

```
