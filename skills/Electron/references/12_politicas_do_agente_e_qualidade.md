# 2. Princípio de autoridade

Ordem de prioridade ao resolver questões Electron:

1. documentação oficial da versão alvo do Electron;
2. documentação oficial `latest`, quando a versão não for informada;
3. tipos TypeScript fornecidos pelo pacote `electron`;
4. release notes e breaking changes da versão alvo;
5. documentação de Electron Forge quando a tarefa envolver Forge;
6. documentação de Node.js e Chromium referente às versões embarcadas;
7. comportamento observado em testes reproduzíveis;
8. conhecimento geral do agente.

Nunca presumir que uma API documentada em versões antigas continua disponível,
nem que uma API marcada como experimental, deprecated ou platform-specific
possui o mesmo comportamento em todas as plataformas.

---

# 171. Code Review Severity

Classificar achados:

```text
CRITICAL
Possível RCE, secret crítico ou privilégio irrestrito.

HIGH
Escape do renderer, filesystem/shell amplo, auth bypass.

MEDIUM
Hardening ausente, validação insuficiente, DoS local.

LOW
Qualidade, defesa em profundidade, manutenção.

INFO
Melhoria não urgente.
```

---

# 172. Migration Procedure

Ao modernizar app Electron antigo:

1. identificar versão atual;
2. identificar versão alvo;
3. ler breaking changes;
4. remover `remote`;
5. remover Node do renderer;
6. criar preload;
7. habilitar context isolation;
8. habilitar sandbox;
9. converter APIs diretas para IPC;
10. validar sender;
11. revisar BrowserView/webview;
12. revisar CSP;
13. atualizar modules nativos;
14. atualizar packaging;
15. executar testes por plataforma.

Migrar incrementalmente.

---

# 175. Quando consultar documentação novamente

Consultar documentação oficial obrigatoriamente quando:

- versão Electron específica for mencionada;
- API estiver deprecated;
- comportamento for platform-specific;
- envolver assinatura/notarização;
- envolver updater;
- envolver store;
- envolver fuses;
- envolver command-line switches;
- envolver permissões nativas;
- envolver módulos nativos;
- envolver API nova;
- houver erro indicando mudança de assinatura;
- uma resposta depender do default atual.

---

# 176. Política para código gerado

Todo código Electron novo deve, por padrão:

- ser compatível com arquitetura main/preload/renderer;
- evitar API deprecated;
- manter security defaults;
- validar inputs privilegiados;
- ter cleanup;
- tratar erro;
- respeitar plataforma;
- usar `path.join`/`path.resolve`;
- não hardcodar secrets;
- não adicionar dependência desnecessária.

---

# 183. Agent Response Policy

Ao responder perguntas Electron:

## Para implementação

Entregar:

- arquitetura;
- código;
- arquivos envolvidos;
- riscos;
- diferenças por plataforma quando relevantes.

## Para erro

Explicar:

- causa provável;
- como confirmar;
- correção mínima;
- correção arquitetural se necessária.

## Para segurança

Ser conservador.

Não sugerir desabilitar controles como solução permanente.

## Para API

Informar:

- processo correto;
- lifecycle necessário;
- platform restrictions;
- deprecated status quando conhecido.

---

# 184. Não inventar APIs

Se não houver certeza sobre:

- nome;
- assinatura;
- retorno;
- evento;
- suporte de plataforma;

consultar a documentação.

Não criar métodos plausíveis que não existem.

---

# 185. Version Awareness

A skill é baseada em documentação `latest`.

O agente deve sempre distinguir:

```text
"documentação atual diz..."
```

de:

```text
"Electron 28 fazia..."
```

Se projeto estiver preso a versão antiga, não aplicar automaticamente API nova.

---

# 186. Segurança como requisito funcional

Em Electron, segurança é parte da arquitetura.

Uma implementação não é considerada correta se funcionar mas exigir:

```js
nodeIntegration: true
contextIsolation: false
webSecurity: false
allowRunningInsecureContent: true
```

sem justificativa legítima.

O agente deve buscar outra solução.

---

# 187. Checklist antes de gerar BrowserWindow

- [ ] O conteúdo é local ou remoto?
- [ ] O preload é necessário?
- [ ] `nodeIntegration` está false?
- [ ] `contextIsolation` está true?
- [ ] sandbox está true?
- [ ] `webSecurity` está true?
- [ ] CSP será aplicada?
- [ ] navigation será restrita?
- [ ] novas janelas serão restritas?
- [ ] permissões serão tratadas?
- [ ] renderer possui apenas APIs mínimas?

---

# 188. Checklist antes de criar IPC

- [ ] O IPC é realmente necessário?
- [ ] O nome do canal é específico?
- [ ] O sender é validado?
- [ ] Os argumentos possuem schema?
- [ ] Existe limite de tamanho?
- [ ] Existe autorização?
- [ ] Paths são validados?
- [ ] URLs são validadas?
- [ ] O retorno contém apenas o necessário?
- [ ] Erros sensíveis são sanitizados?

---

# 189. Checklist antes de carregar URL remota

- [ ] HTTPS?
- [ ] origem allowlisted?
- [ ] Node desabilitado?
- [ ] context isolation?
- [ ] sandbox?
- [ ] permission handler?
- [ ] navegação limitada?
- [ ] popups bloqueados?
- [ ] IPC sender validation?
- [ ] shell external allowlisted?
- [ ] CSP apropriada?

---

# 190. Checklist antes de release

- [ ] Electron atualizado?
- [ ] dependências auditadas?
- [ ] deprecated APIs removidas?
- [ ] segurança revisada?
- [ ] testes passam?
- [ ] package smoke-tested?
- [ ] modules nativos rebuildados?
- [ ] assinatura configurada?
- [ ] notarization quando necessária?
- [ ] updater configurado?
- [ ] logs sanitizados?
- [ ] crash reporting revisado?
- [ ] fuses avaliados?
- [ ] instalação limpa testada?

---

# 191. Checklist de performance

- [ ] main sem sync I/O pesado?
- [ ] renderer sem long tasks?
- [ ] imports lazy quando útil?
- [ ] janelas desnecessárias destruídas?
- [ ] listeners removidos?
- [ ] IPC não é excessivo?
- [ ] imagens otimizadas?
- [ ] cache controlado?
- [ ] startup medido?
- [ ] memory measured?

---

# 192. Critérios de qualidade

Uma solução Electron de alta qualidade deve ser:

- segura;
- explícita;
- multiplataforma ou conscientemente platform-specific;
- testável;
- observável;
- atualizável;
- resiliente a crash;
- eficiente;
- fácil de empacotar;
- compatível com lifecycle;
- baseada em APIs atuais.

---

# 193. Regra de menor privilégio

Para cada contexto:

## Main

Pode ser privilegiado, mas deve minimizar código exposto a input não confiável.

## Utility

Dar apenas o necessário.

## Preload

Expor capabilities mínimas.

## Renderer

Tratar como web app sem privilégios Node.

## Remote content

Tratar como não confiável.

---

# 194. Regra de fronteiras

Toda fronteira é ponto de validação:

```text
network -> main
file -> parser
renderer -> IPC
deep link -> app
clipboard -> renderer
webview -> host
child process -> main
plugin -> host
```

Dados não se tornam confiáveis apenas por terem cruzado uma camada.

---

# 195. Regra sobre exemplos externos

Não copiar exemplos de blogs ou respostas antigas sem verificar:

- versão;
- deprecated APIs;
- security settings;
- platform;
- tooling.

Especial atenção a exemplos antigos com:

- `remote`;
- `nodeIntegration: true`;
- `contextIsolation: false`;
- `enableRemoteModule`;
- BrowserView legado;
- APIs removidas.

---

# 196. Regra sobre troubleshooting inseguro

Nunca resolver erro com:

```js
webSecurity: false
```

ou:

```js
contextIsolation: false
```

ou:

```js
nodeIntegration: true
```

antes de identificar a causa.

Essas opções podem mascarar arquitetura incorreta.

---

# 197. Regra sobre manutenção

Aplicação Electron deve ter processo recorrente para:

- atualizar Electron;
- revisar advisories;
- atualizar dependências;
- testar release;
- revisar APIs deprecated;
- renovar certificates/signing;
- verificar updater.

Electron inclui browser engine, portanto atualização de segurança é importante.

---

# 198. Regra para respostas sobre plataforma

Sempre marcar explicitamente quando comportamento for:

- macOS only;
- Windows only;
- Linux only;
- Windows/macOS;
- dependente de X11/Wayland;
- dependente de store.

---

# 199. Regra para arquitetura existente

Ao modificar projeto existente:

1. respeitar conventions;
2. reutilizar utilities;
3. não adicionar framework desnecessário;
4. preservar module system;
5. preservar tooling;
6. melhorar segurança sem reescrever tudo sem necessidade.

---

# 200. Resultado esperado do agente

Com esta skill ativa, o agente deve ser capaz de atuar como:

- Electron developer;
- Electron architect;
- desktop application engineer;
- IPC designer;
- Electron security reviewer;
- debugging engineer;
- packaging/release engineer;
- migration engineer;
- performance reviewer.

Ele deve produzir soluções que não apenas “funcionem”, mas que estejam de
acordo com o modelo moderno de segurança e processos do Electron.

---

# 201. Fontes oficiais

Fonte principal:

https://www.electronjs.org/docs/latest/

API `app`:

https://www.electronjs.org/docs/latest/api/app

Áreas da documentação que esta skill modela conceitualmente:

- Getting Started
- Process Model
- Context Isolation
- Process Sandboxing
- IPC
- Security
- Performance
- Examples
- Development
- Native Node Modules
- Distribution
- Electron Forge
- Testing and Debugging
- API Reference
- Main Process Modules
- Renderer Process Modules
- Utility Process Modules
- Custom DOM Elements
- Chromium and Node.js
- Classes
- API Structures

---

# 202. Instrução final para o agente

Ao trabalhar com Electron:

> Não comece pela API mais poderosa. Comece pela menor capability que resolve o
> requisito.

> Não conceda Node ao renderer para simplificar arquitetura.

> Não desabilite controles de segurança para contornar erros de desenvolvimento.

> Não confie em IPC, URL, path, deep link, arquivo, conteúdo remoto ou renderer
> apenas porque pertencem à própria aplicação.

> Use `main` para privilégio, `preload` para mediação e `renderer` para UI.

> Considere lifecycle e diferenças de sistema operacional em toda integração
> nativa.

> Prefira APIs atuais e verifique a documentação oficial quando a resposta
> depender de versão, plataforma ou assinatura exata.

Essa é a baseline obrigatória desta skill.
