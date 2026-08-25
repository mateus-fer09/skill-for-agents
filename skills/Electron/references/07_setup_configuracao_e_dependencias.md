# 61. Native Node Modules

Electron pode usar módulos Node nativos, mas eles precisam ser compatíveis com
o ABI/runtime embarcado.

Considerar:

- rebuild para Electron;
- arquitetura `x64`, `arm64`, etc.;
- Node-API/N-API quando possível;
- toolchain de compilação;
- distribuição de binários;
- code signing quando aplicável.

Electron Forge possui suporte/tooling para rebuild em fluxos comuns.

---

# 90. Dependencies

Electron app carrega:

- Electron;
- Chromium;
- Node.js;
- dependências npm;
- bibliotecas nativas;
- código da aplicação.

Segurança depende do conjunto.

Práticas:

- lockfile;
- auditoria;
- atualização regular;
- reduzir dependências;
- remover pacotes abandonados;
- revisar install scripts.

---

