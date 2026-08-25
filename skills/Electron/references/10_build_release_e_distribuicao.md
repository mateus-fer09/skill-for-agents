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

