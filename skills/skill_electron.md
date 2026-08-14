---
name: electron-packaging
description: Guia para empacotar, assinar, notarizar e distribuir apps Electron para Windows e macOS usando electron-builder, incluindo auto-update com electron-updater. Use sempre que o usuário mencionar build de produção, instalador, .dmg, .exe, .nsis, assinatura de código, notarização, code signing, auto-update, publicar release, ou "empacotar o app" para Electron. Esse fluxo é bem diferente de deploy web (não existe "só fazer build e subir num servidor") — cada plataforma tem requisitos próprios de segurança que bloqueiam o app se não forem seguidos.
---

# Electron Packaging & Distribuição

Empacotar um app Electron não é só rodar `electron-builder`. Windows e macOS têm gatekeepers de segurança (SmartScreen e Gatekeeper) que bloqueiam ou alertam sobre apps não assinados/não notarizados — o usuário final vê um aviso assustador de "app não confiável" se algum passo for pulado. Trate assinatura e notarização como parte obrigatória do pipeline, não como um "nice to have" pra depois.

## Visão geral do pipeline

```
código-fonte → electron-builder empacota → assina (Windows/macOS) → 
notariza (macOS) → gera instalador (.exe/.dmg) → publica (GitHub Releases/S3/etc) →
electron-updater detecta e aplica update no cliente
```

## Configuração base do electron-builder

No `package.json` ou `electron-builder.json`, defina `appId` (formato reverso de domínio, ex: `com.aetherspace.app`) e os alvos por plataforma:

```json
{
  "appId": "com.suaempresa.seuapp",
  "productName": "Seu App",
  "mac": {
    "target": [{ "target": "default", "arch": ["universal"] }],
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

Nunca commite certificados ou senhas no repositório — sempre injete via variáveis de ambiente/secrets de CI.

## macOS: assinatura + notarização

Desde o macOS 10.15+, **assinar não é suficiente**: apps distribuídos fora da Mac App Store também precisam ser **notarizados**, ou o Gatekeeper bloqueia a abertura por padrão (o usuário precisa liberar manualmente, o que mata a experiência).

Passos:
1. **Conta Apple Developer Program** (paga, anual) — sem isso não existe certificado válido.
2. **Certificado "Developer ID Application"** — não confundir com "Apple Distribution" (esse é só pra App Store; usar o errado gera o erro "binary is not signed with a valid Developer ID certificate").
3. **Hardened Runtime obrigatório** para notarizar: `hardenedRuntime: true` + arquivo de entitlements (`build/entitlements.mac.plist`), incluindo a versão "inherit" que se aplica a processos filhos (helper processes, renderer).
4. **Notarização** via `notarytool` (ferramenta atual da Apple — a antiga `altool` foi descontinuada). O electron-builder assina automaticamente; a notarização pode ser configurada nativamente ou via hook `afterSign` com `@electron/notarize`:

```js
// build/notarize.js
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') return;

  const appName = context.packager.appInfo.productFilename;
  await notarize({
    tool: 'notarytool',
    appBundleId: context.packager.config.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD, // senha de app específica, não a senha normal da conta
    teamId: process.env.APPLE_TEAM_ID,
  });
};
```

5. Após aprovada, a Apple retorna um "ticket" — o electron-builder faz o **stapling** (grudar o ticket no bundle) automaticamente, permitindo que o Gatekeeper valide até offline.

### Erros comuns (macOS)
- **"Hardened Runtime not enabled"** → faltou `hardenedRuntime: true`.
- **"Invalid Info.plist / signature has wrong format"** → algum binário dentro do bundle não foi assinado (comum com módulos nativos `.node`); garanta `asarUnpack` para esses arquivos e assine tudo, se necessário com um hook `afterSign` customizado.
- **"No identity found"** → certificado não está no keychain ou a assinatura Apple Developer expirou.
- **App abre mas trava/comportamento estranho** → checar se todos os processos filhos herdam os entitlements corretos.

## Windows: assinatura de código

- Certificado tradicional: compre de uma CA reconhecida (DigiCert, Sectigo, SSL.com) — mas desde as mudanças do CA/Browser Forum, certificados OV/EV agora frequentemente exigem hardware token (HSM), o que complica automação em CI.
- Alternativa mais barata e CI-friendly: **Azure Artifact Signing** (antigo Azure Trusted Signing) — assinatura em nuvem, elimina a necessidade de token físico e reduz avisos do SmartScreen. Disponibilidade limitada por país — verifique antes de planejar em torno dela.
- SmartScreen ainda pode alertar mesmo com certificado válido em apps novos — a reputação do certificado constrói com o tempo/volume de downloads; isso é esperado e não indica configuração errada.
- `publisherName` no config do NSIS/AppX precisa bater exatamente com o "Subject" do certificado, ou o build falha.

## CI (GitHub Actions) — padrão típico

- Certificado macOS: exportar como `.p12`, converter para base64, guardar em secret, decodificar no runner antes do build (`CSC_LINK` apontando pro arquivo).
- Certificado Windows: mesma lógica com `WIN_CSC_LINK` / `WIN_CSC_KEY_PASSWORD` — importante ao cross-compilar Windows a partir de um runner macOS, para não confundir com o certificado mac.
- Rodar `electron-builder --publish always` só na CI (nunca localmente) para evitar publicar builds não testados ou vazar credenciais na máquina do dev.
- Sempre um step que pula a notarização se não estiver em CI (`process.env.CI !== 'true'`), pra não travar builds locais de dev sem credenciais configuradas.

## Auto-update com electron-updater

`electron-updater` é o par natural do `electron-builder` — lê o mesmo formato de metadata gerado no publish.

```js
// main process
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();
```

Pontos de atenção:
- **Onde publicar**: GitHub Releases (mais simples, gratuito para repos públicos/privados com token) ou S3/servidor próprio (`generic` provider) — configurado em `publish` no electron-builder config.
- **Assinatura é pré-requisito para auto-update no macOS**: sem app assinado e notarizado corretamente, o `autoUpdater` falha silenciosamente ou o update é rejeitado pelo Gatekeeper.
- **Versionamento semântico obrigatório**: o `electron-updater` compara versões do `package.json`; pular esse cuidado quebra a detecção de "há update disponível".
- Trate o fluxo de update como parte da UX, não só do build: informe o usuário quando um update foi baixado e que reiniciar aplica (`autoUpdater.quitAndInstall()`), em vez de reiniciar sem avisar.
- Teste o auto-update **antes** do launch real: publique uma versão de teste com número menor, ou use um canal separado (beta/alpha) — descobrir bugs de update em produção é o pior cenário possível, porque o próprio mecanismo de correção pode estar quebrado.

## Ícones e assets

- Forneça os ícones nos formatos nativos de cada plataforma: `.icns` (macOS), `.ico` (Windows), `.png` (Linux) — não dá pra usar um único PNG genérico e esperar que o electron-builder converta com qualidade.
- Tamanhos recomendados: pelo menos 1024×1024 como fonte, para o gerador de ícones (`electron-icon-builder` ou similar) conseguir derivar todos os tamanhos menores sem perder nitidez.
- No `.dmg` do macOS, configure o layout do instalador (posição do ícone do app + atalho para `/Applications`) via `dmg.contents` — sem isso, o instalador fica com o layout padrão genérico do sistema.

## Checklist antes de publicar uma release
1. `appId` e `productName` finais definidos (mudar depois quebra updates de usuários existentes).
2. Certificados válidos (não expirados) para cada plataforma alvo.
3. Hardened Runtime + entitlements corretos no macOS.
4. Notarização configurada e testada em CI, não só localmente.
5. Ícones nos formatos nativos corretos.
6. `publish` configurado apontando para o destino certo (GitHub Releases/S3/genérico).
7. Testou o auto-update de uma versão anterior real para essa nova versão, não só o build "do zero".