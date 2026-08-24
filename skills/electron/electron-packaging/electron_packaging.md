---
name: electron-packaging
description: Empacotamento, assinatura, notarização, instaladores, publicação e auto-update de aplicações Electron para Windows e macOS usando electron-builder e electron-updater. Use para build de produção, .exe, NSIS, .dmg, code signing, certificados, Developer ID, hardened runtime, entitlements, notarização, notarytool, CI/CD, GitHub Releases, S3, publicação e atualização automática. Esta skill é independente da arquitetura de webview/browser e deve ser usada quando o problema estiver na distribuição do aplicativo.
---

# Electron Packaging & Distribution

## Papel

Você é responsável pelo pipeline:

```text
source
  ↓
electron-builder
  ↓
code signing
  ↓
notarization
  ↓
installer
  ↓
publish
  ↓
electron-updater
```

Empacotamento não é equivalente a deploy web.

Windows e macOS possuem mecanismos de confiança e verificação próprios.

## 1. Configuração base

```json
{
  "appId": "com.suaempresa.seuapp",
  "productName": "Seu App",
  "mac": {
    "target": [
      {
        "target": "default",
        "arch": ["universal"]
      }
    ],
    "category": "public.app-category.productivity",
    "hardenedRuntime": true,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist",
    "gatekeeperAssess": false
  },
  "win": {
    "target": ["nsis"]
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
}
```

Defina `appId` e `productName` de forma estável antes de distribuir.

## 2. Secrets

Nunca commite:

- certificados;
- senha de certificado;
- Apple ID password;
- app-specific password;
- tokens de publicação.

Use secrets/variáveis de ambiente de CI.

## 3. macOS

Para distribuição fora da Mac App Store, trate:

```text
Developer ID Application
+
Hardened Runtime
+
Entitlements
+
Notarization
+
Stapling
```

como pipeline obrigatório.

## 4. Certificado correto

Use:

```text
Developer ID Application
```

para distribuição direta fora da Mac App Store.

Não confunda com certificados voltados à App Store.

## 5. Hardened Runtime

```json
{
  "mac": {
    "hardenedRuntime": true,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  }
}
```

Helper processes também precisam dos entitlements corretos quando aplicável.

## 6. Notarização

Use `notarytool`.

Exemplo com `@electron/notarize`:

```js
const { notarize } = require("@electron/notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== "darwin") return;

  const appName =
    context.packager.appInfo.productFilename;

  await notarize({
    tool: "notarytool",
    appBundleId: context.packager.config.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword:
      process.env.APPLE_APP_SPECIFIC_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  });
};
```

## 7. macOS — erros comuns

### Hardened Runtime not enabled

Verifique:

```text
hardenedRuntime: true
```

### No identity found

Verifique:

- certificado;
- keychain;
- validade;
- secrets da CI.

### Binário interno não assinado

Atenção a:

- módulos nativos `.node`;
- helpers;
- arquivos desempacotados.

## 8. Windows code signing

Use certificado de assinatura reconhecido ou solução de assinatura em nuvem compatível com sua infraestrutura.

A assinatura deve ser planejada como parte do CI, não como etapa manual eventual.

## 9. SmartScreen

Aplicativos novos podem ainda receber alerta de reputação mesmo assinados.

Não interprete automaticamente isso como falha de assinatura.

## 10. publisherName

Quando exigido pelo target/configuração, `publisherName` deve corresponder ao subject esperado do certificado.

## 11. CI

Padrão típico:

```text
checkout
  ↓
install dependencies
  ↓
test
  ↓
build
  ↓
sign
  ↓
notarize
  ↓
publish
```

Evite publicar builds locais não testados.

## 12. Certificados em CI

Para macOS:

- exportar `.p12`;
- armazenar em secret/base64;
- restaurar no runner;
- configurar `CSC_LINK`.

Para Windows:

- configurar certificado/secrets equivalentes;
- evitar misturar credenciais de plataformas.

## 13. Publicação

Destinos possíveis:

- GitHub Releases;
- S3;
- provider genérico.

Configure `publish` no `electron-builder`.

## 14. Auto-update

Use `electron-updater`.

```ts
import { autoUpdater } from "electron-updater";

autoUpdater.checkForUpdatesAndNotify();
```

## 15. Versionamento

O mecanismo de update depende de versões coerentes.

Use versionamento semântico consistente.

## 16. UX de update

Não reinicie silenciosamente sem necessidade.

Fluxo preferível:

```text
update disponível
  ↓
download
  ↓
informar usuário
  ↓
reiniciar/aplicar
```

Quando apropriado:

```ts
autoUpdater.quitAndInstall();
```

## 17. Teste do updater

Teste antes de produção real.

Use:

- versão anterior;
- release de teste;
- canal beta/alpha quando necessário.

Não valide apenas um build limpo.

## 18. Ícones

Use formatos nativos:

```text
macOS → .icns
Windows → .ico
Linux → .png
```

Use fonte de alta resolução.

## 19. DMG

Configure layout quando quiser uma experiência final mais controlada:

- ícone do app;
- atalho `/Applications`;
- posições.

## 20. Checklist de release

- [ ] `appId` final
- [ ] `productName` final
- [ ] certificados válidos
- [ ] Hardened Runtime configurado no macOS
- [ ] entitlements corretos
- [ ] notarização testada
- [ ] stapling verificado quando aplicável
- [ ] assinatura Windows configurada
- [ ] ícones nativos corretos
- [ ] `publish` aponta para destino correto
- [ ] secrets estão apenas na CI
- [ ] versão foi atualizada corretamente
- [ ] auto-update foi testado a partir de uma versão anterior

## Regra final

Assinatura, notarização e atualização fazem parte da arquitetura de distribuição do aplicativo e devem ser planejadas junto do pipeline de release, não adicionadas apenas depois do build estar pronto.
