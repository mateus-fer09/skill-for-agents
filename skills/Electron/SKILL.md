---
name: electron
description: Capacita o agente a projetar, implementar, revisar, depurar, proteger, testar, empacotar e distribuir aplicações Electron modernas.
---

# Electron Master Index

## Propósito geral

Este índice é o roteador principal da skill modular de Electron. A documentação foi particionada por domínio para reduzir perda de contexto, melhorar recuperação via RAG/Tool Calling e permitir que o agente carregue apenas o conjunto de conhecimento necessário para a tarefa atual.

A skill original tem como objetivo capacitar o agente a projetar, implementar, revisar, depurar, proteger, testar, empacotar, distribuir e manter aplicações Electron modernas, cobrindo arquitetura de processos, lifecycle, janelas e WebContents, preload/IPC, segurança, sessões/rede, APIs nativas, performance, testes, distribuição e manutenção.

## Fonte de autoridade

Ao resolver questões Electron, respeite a ordem de autoridade definida pela documentação original:

1. documentação oficial da versão alvo do Electron;
2. documentação oficial `latest`, quando a versão não for informada;
3. tipos TypeScript fornecidos pelo pacote `electron`;
4. release notes e breaking changes da versão alvo;
5. documentação de Electron Forge quando a tarefa envolver Forge;
6. documentação de Node.js e Chromium referente às versões embarcadas;
7. comportamento observado em testes reproduzíveis;
8. conhecimento geral do agente.

Não presuma que APIs antigas, experimentais, deprecated ou específicas de plataforma mantêm disponibilidade, assinatura, defaults ou comportamento em versões/plataformas atuais.

## Regras e padrões absolutos

- Trate `main`, `preload`, `renderer` e utility/child processes como fronteiras de privilégio distintas.
- Quanto menos privilégios um renderer possuir, melhor.
- Por padrão arquitetural, use `nodeIntegration: false`, `contextIsolation: true` e `sandbox: true`.
- Nunca exponha `ipcRenderer` inteiro, `require`, `fs`, `child_process`, `shell` ou APIs Node/Electron genéricas ao renderer.
- Prefira APIs de preload pequenas, explícitas, semânticas e tipadas.
- Todo IPC privilegiado deve usar canal específico e validar sender, origem quando aplicável, tipos, formato, limites e autorização.
- Nunca aceite comandos shell genéricos nem caminhos arbitrários sem validação.
- Não desabilite `webSecurity` para contornar CORS/CSP/origem.
- Nunca habilite Node para conteúdo remoto não confiável.
- Trate conteúdo remoto, conteúdo local, arquivos, Markdown, clipboard, deep links, argumentos, URLs e dados externos como entradas potencialmente não confiáveis.
- Restrinja navegação, abertura de novas janelas e `shell.openExternal`.
- Preserve o princípio de menor privilégio em todas as fronteiras.
- Não invente APIs Electron. Quando houver dúvida sobre versão, plataforma, assinatura, default ou disponibilidade, consulte a documentação oficial da versão alvo.
- Ao trabalhar em arquitetura existente, preserve convenções e tooling do projeto salvo quando houver motivo técnico explícito para mudança.

## Estratégia de recuperação para agentes

1. Leia este arquivo primeiro.
2. Identifique o domínio principal da pergunta.
3. Consulte o menor número de módulos capaz de responder com segurança.
4. Para qualquer decisão arquitetural, revisão de segurança, geração de código ou migração, combine o módulo técnico com `12_politicas_do_agente_e_qualidade.md`.
5. Se a tarefa atravessar fronteiras — por exemplo, “abrir arquivo no renderer via IPC” — carregue todos os módulos diretamente envolvidos, não apenas um.
6. Se a resposta depender de comportamento version-specific ou platform-specific, valide também na documentação oficial da versão alvo.

## Mapa de Contexto

### `01_conceitos_e_arquitetura.md`

Leia SE a pergunta envolver visão geral do Electron, modelo multiprocess, responsabilidades de main/renderer/preload, estrutura de projeto, arquitetura de serviços/janelas, conteúdo local/remoto, persistência, extensibilidade, versões ou APIs deprecated.

### `02_lifecycle_janelas_views_e_webcontents.md`

Leia SE a pergunta envolver lifecycle do app, criação/fechamento/reabertura de janelas, BrowserWindow, WebContents, navegação, novas janelas, BaseWindow, WebContentsView, screen, title bars, frameless, multi-window, loading ou ownership/destroy/close.

### `03_ipc_preload_e_contratos.md`

Leia SE a pergunta envolver ipcMain/ipcRenderer, contextBridge, preload, MessageChannelMain/MessagePortMain, contratos TypeScript, design/namespaces de canais, validação de payloads ou frames/senders.

### `04_seguranca_e_hardening.md`

Leia SE a pergunta envolver threat model, contextIsolation, sandbox, nodeIntegration, CSP, permissões, filesystem/command security, TLS/certificados, autenticação/autorização, DOM security, URLs, secrets, OAuth, production hardening, security review ou anti-patterns.

### `05_apis_nativas_e_integracao_so.md`

Leia SE a pergunta envolver Menu, Tray, Dialog, Clipboard, NativeImage, tema, notificações, atalhos globais, captura de tela, energia, protocolos/deep links/file associations, shell, systemPreferences ou integrações específicas de Windows/macOS/Linux.

### `06_dados_rede_sessoes_protocolos.md`

Leia SE a pergunta envolver paths/dados do app, Session, net, cookies, proxy, headers, webRequest, URLs/paths de entrada, variáveis de ambiente, API keys, OAuth, estado offline ou separação de ambientes.

### `07_setup_configuracao_e_dependencias.md`

Leia SE a pergunta envolver módulos Node nativos, ABI/rebuild/arquitetura, dependências npm, lockfile, atualização/auditoria de dependências ou preparação técnica do ambiente do projeto.

### `08_performance_estabilidade_e_processos.md`

Leia SE a pergunta envolver crashes de renderer/child process, utilityProcess, startup, CPU, memória, renderer performance, cancelamento, multi-profile/custo de processos ou estabilidade operacional.

### `09_testes_debug_e_diagnostico.md`

Leia SE a pergunta envolver crashReporter, netLog/contentTracing, DevTools, logging, testes unitários/integrados/E2E, automação, debugging, Electron Fiddle ou matrizes/ordem de diagnóstico.

### `10_build_release_e_distribuicao.md`

Leia SE a pergunta envolver autoUpdater, packaging, ASAR, Electron Forge, code signing, notarization, formatos de distribuição, canais de update, versionamento, source maps, minification ou diagnóstico de release.

### `11_fluxos_exemplos_e_padroes.md`

Leia SE o usuário pedir um exemplo completo mínimo de arquitetura Electron segura, incluindo main, preload, renderer, IPC e fluxo de execução de referência.

### `12_politicas_do_agente_e_qualidade.md`

Leia SEMPRE ao produzir ou revisar uma solução Electron relevante; contém princípio de autoridade, severidade de code review, migração, regras de consulta à documentação, política de código gerado, response policy, version awareness, checklists e critérios finais de qualidade.

## Combinações de contexto recomendadas

- **Criar uma janela segura:** `02_lifecycle_janelas_views_e_webcontents.md` + `04_seguranca_e_hardening.md` + `12_politicas_do_agente_e_qualidade.md`.
- **Criar uma API preload/IPC:** `03_ipc_preload_e_contratos.md` + `04_seguranca_e_hardening.md` + `12_politicas_do_agente_e_qualidade.md`.
- **Acessar filesystem:** `03_ipc_preload_e_contratos.md` + `04_seguranca_e_hardening.md` + `06_dados_rede_sessoes_protocolos.md`.
- **Carregar conteúdo remoto:** `02_lifecycle_janelas_views_e_webcontents.md` + `04_seguranca_e_hardening.md` + `06_dados_rede_sessoes_protocolos.md`.
- **Integrar recurso do sistema operacional:** `05_apis_nativas_e_integracao_so.md` + o módulo de segurança quando houver entrada não confiável ou privilégio.
- **Investigar crash/performance:** `08_performance_estabilidade_e_processos.md` + `09_testes_debug_e_diagnostico.md`.
- **Preparar release:** `10_build_release_e_distribuicao.md` + `12_politicas_do_agente_e_qualidade.md`.
- **Migrar projeto Electron antigo:** `01_conceitos_e_arquitetura.md` + `04_seguranca_e_hardening.md` + `10_build_release_e_distribuicao.md` + `12_politicas_do_agente_e_qualidade.md`.
- **Gerar projeto de referência completo:** `11_fluxos_exemplos_e_padroes.md` + módulos técnicos afetados + `12_politicas_do_agente_e_qualidade.md`.

## Regra de preservação desta modularização

Os módulos técnicos contêm as seções originais movidas integralmente, sem resumir o conteúdo técnico e sem remover blocos de código, configurações ou snippets. O índice adiciona apenas a camada de roteamento necessária para recuperação por agentes.
