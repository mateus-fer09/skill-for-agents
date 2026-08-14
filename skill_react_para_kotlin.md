---
name: react-para-kotlin-planejamento
description: Use esta skill sempre que a tarefa for analisar um projeto React (web ou desktop/Electron) e gerar um planejamento.md para criar uma versão mobile equivalente no Android Studio com Kotlin. O entregável desta skill NÃO é código Kotlin — é um documento de planejamento estruturado que mapeia cada tela, funcionalidade e camada de dados do projeto React para o equivalente no ecossistema Android nativo (Jetpack Compose, ViewModel, coroutines/Flow, Retrofit, Room). Trigger em pedidos como "quero uma versão Android desse app", "cria o planejamento pra portar isso pro mobile", "analisa esse projeto React pra migrar pra Kotlin", mesmo sem o usuário detalhar a estrutura do documento.
---

# Planejamento de migração React → Android (Kotlin)

Traduzir componente por componente de JSX pra Kotlin quase sempre produz um app Android que se comporta como um site dentro de uma casca nativa — navegação errada, gestos errados, arquitetura forçada. O objetivo aqui não é traduzir código, é entender o que o produto **faz** (funcionalidades, fluxos, dados) e planejar como isso é reconstruído do jeito idiomático em Android nativo. Por isso o entregável é um plano, não código: decisões de arquitetura e mapeamento de telas erradas custam muito mais caro descobertas depois de já ter escrito Kotlin do que antes.

---

## Fase 1: Analisar o projeto React

Antes de escrever qualquer linha do planejamento, levante:

- **Todas as telas/rotas** — páginas, rotas do React Router, ou estrutura de features/pastas se não houver router explícito.
- **Para cada tela**: qual é a função dela, quais dados mostra, quais ações o usuário pode tomar, e de onde/pra onde ela navega.
- **Fluxo de dados**: de onde vem cada dado (API REST, `localStorage`, IndexedDB, IPC do Electron se for um app desktop) e como é guardado no estado (Context API, Redux, Zustand, `useState` local).
- **Integrações externas**: endpoints de API consumidos (e como autenticam), SDKs de terceiros, notificações, pagamentos, upload/download de arquivo.
- **Lógica de negócio que não é só visual** — validações, cálculos, regras condicionais. Essa lógica precisa ser replicada de verdade no plano, não só "a tela parecida".
- **Design system atual** (paleta, tipografia, espaçamento do Tailwind) como ponto de partida — não pra copiar 1:1, mobile tem convenções próprias (Material Design).

Se alguma parte do projeto estiver pouco clara ou ambígua, registre como "a confirmar" no planejamento em vez de presumir um comportamento — o plano existe pra reduzir decisão às cegas, não pra empurrar a ambiguidade pra dentro do código Kotlin depois.

---

## Fase 2: Mapear conceitos React → Android/Kotlin

Use esse mapeamento como referência ao preencher o planejamento — não force um paralelo 1:1 quando o Android tem um jeito próprio de resolver o mesmo problema:

| React / Web | Android / Kotlin |
|---|---|
| Componente funcional | `@Composable` function (Jetpack Compose) |
| Props | Parâmetros do Composable |
| `useState`/`useReducer` local | `remember { mutableStateOf(...) }` ou state hoisting |
| Context API / Redux / Zustand (estado global) | `ViewModel` + `StateFlow`, injetado via Hilt/Koin |
| React Router | Navigation Compose (`NavHost`, `NavController`) |
| `useEffect` (busca de dado ao montar) | `viewModelScope.launch {}` com coroutines no ViewModel, ou `LaunchedEffect` no Composable pra efeito ligado à UI |
| `fetch`/`axios` | Retrofit (ou Ktor Client) + coroutines |
| Formulário controlado | `TextField` com state hoisting + validação no ViewModel |
| `localStorage`/IndexedDB | `DataStore` (preferências simples) ou `Room` (dado estruturado/relacional) |
| Tokens Tailwind (cor/tipografia) | `MaterialTheme` customizado (`Color.kt`, `Type.kt`) equivalente |
| Breakpoints CSS responsivos | Não tem equivalente direto — usar `WindowSizeClass` só se o app precisar suportar tablet/foldable |
| IPC do Electron (se o projeto for desktop) | Sem equivalente direto — lógica que rodava no processo Main vira lógica local no Repository/ViewModel, ou precisa de uma API backend se dependia de acesso ao sistema operacional |

---

## Fase 3: Gerar o `planejamento.md`

O documento final segue esta estrutura:

```markdown
# Planejamento: Versão Android de [nome do projeto]

## 1. Visão geral
- Resumo do que o app faz hoje na versão React
- Escopo da v1 mobile: o que entra agora, o que fica pra depois

## 2. Inventário de funcionalidades
| Funcionalidade | Tela(s) no React | Prioridade | Observações |
|---|---|---|---|

## 3. Mapeamento de telas
Para cada tela:
- Nome / Composable equivalente
- Dados exibidos
- Ações do usuário
- Navegação (de onde vem, pra onde vai)

## 4. Camada de dados
- Endpoints de API consumidos (lista, com forma de autenticação)
- O que precisa de persistência local (Room) vs. só cache em memória (DataStore/estado)
- Estado global necessário e qual ViewModel é dono dele

## 5. Arquitetura proposta
- MVVM + Jetpack Compose
- Injeção de dependência (Hilt)
- Navegação (Navigation Compose)
- Rede (Retrofit + coroutines/Flow)

## 6. Design system
- Paleta de cor mapeada pro MaterialTheme
- Tipografia mapeada
- Ajustes pensados pra mobile (navegação por abas/bottom nav em vez de sidebar, bottom sheet em vez de modal centralizado, etc.)

## 7. Fases de implementação
- Ordem sugerida (ex.: autenticação → tela principal → features secundárias)
- Marcos/entregas por fase

## 8. Riscos e pontos em aberto
- Funcionalidades sem equivalente direto no mobile (hover state, drag-and-drop complexo, atalho de teclado)
- Decisões que precisam de confirmação do usuário antes de seguir pra implementação
```

---

## Fase 4: princípios pra não fazer um port ruim

- **Não force o padrão do React onde o Android tem convenção própria** — sidebar de desktop vira bottom navigation ou drawer, modal centralizado vira bottom sheet, hover vira long-press ou é simplesmente removido.
- **O plano tem fases, não é "portar tudo de uma vez.**" Priorize o essencial pra uma v1 funcional e liste o resto como fase seguinte.
- **Sinalize explicitamente** qualquer funcionalidade que depende de algo exclusivo de desktop/browser (drag-and-drop com mouse, atalho de teclado, IPC do Electron, hover) como "requer redesenho" no plano — nunca como "portar direto", porque não existe port direto pra essas interações.

---

## Checklist antes de considerar o planejamento pronto

- [ ] Toda tela do projeto React aparece no inventário e no mapeamento de telas
- [ ] Toda chamada de API consumida está listada na camada de dados
- [ ] Cada funcionalidade sem equivalente direto no mobile está sinalizada, não ignorada ou omitida
- [ ] O planejamento está dividido em fases, não é uma lista única de "portar tudo"
- [ ] As dependências Android sugeridas (Compose, Hilt, Retrofit, Room) estão nomeadas explicitamente
- [ ] Pontos ambíguos do projeto original estão marcados como "a confirmar", não resolvidos por suposição
