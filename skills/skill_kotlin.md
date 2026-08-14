---
name: implementacao-kotlin-android
description: Use esta skill sempre que for escrever, revisar ou refatorar código Kotlin/Android — telas em Jetpack Compose, ViewModels, repositórios, integração com API, persistência local, navegação ou injeção de dependência. É a fase de implementação que vem depois do planejamento (ex.: o planejamento.md gerado pela skill de migração React → Kotlin), mas se aplica a qualquer trabalho Android/Kotlin, mesmo sem um planejamento prévio. Trigger em pedidos como "implementa essa tela em Compose", "cria o ViewModel disso", "integra com essa API no Android", "monta o Room pra isso", mesmo que o usuário não peça "boas práticas" explicitamente.
---

# Implementação Kotlin/Android — Compose, MVVM, coroutines

Código Android apressado costuma ter o mesmo sintoma em formas diferentes: lógica de negócio dentro do Composable, estado gerenciado de forma ad-hoc, `!!` usado pra calar o compilador em vez de tratar o null de verdade. Esta skill existe pra a arquitetura certa (MVVM com Compose stateless) e os idiomas do Kotlin serem o caminho padrão, não um refinamento posterior.

Se existir um `planejamento.md` do projeto (gerado ao portar de React, ou de qualquer outro planejamento), siga a ordem de fases definida nele em vez de implementar fora de ordem — o plano existe pra evitar retrabalho de dependência (ex.: implementar uma tela que depende de autenticação antes da autenticação existir).

---

## 1. Antes de implementar: confirme o escopo da tela/feature

Pra qualquer tela ou feature nova (não um ajuste pontual), tenha claro antes de codar:
- Quais estados essa tela precisa cobrir (carregando, sucesso, erro, vazio) — igual no frontend web, planeje isso junto com o estado "normal", não depois.
- De onde vêm os dados (API, banco local, os dois) e quem é dono desse estado (qual `ViewModel`).
- Quais ações do usuário disparam efeito colateral (chamada de rede, escrita no banco) vs. o que é só estado de UI local.

---

## 2. Arquitetura: MVVM em camadas

```
data/
  remote/        → interfaces Retrofit, DTOs de resposta da API
  local/         → entidades e DAOs do Room, DataStore
  repository/    → implementação concreta dos repositórios (combina remote + local)
domain/          → (opcional em apps menores) modelos de domínio, use cases
ui/
  <feature>/
    <Feature>Screen.kt       → Composable, sem lógica de negócio
    <Feature>ViewModel.kt    → estado exposto via StateFlow, lógica de apresentação
    <Feature>UiState.kt      → sealed class/interface com os estados possíveis da tela
```

- **Composable não sabe de onde o dado vem.** Ele recebe estado já pronto do `ViewModel` e emite eventos (clique, digitação) de volta — nunca chama Retrofit, Room ou repositório diretamente.
- **ViewModel não sabe de Compose.** Ele não importa nada de `androidx.compose.*` — expõe estado via `StateFlow` e funções públicas que a UI chama, o que permite testar a lógica sem precisar renderizar UI.
- **Repository é a única camada que decide** se o dado vem da rede, do cache local, ou dos dois — o ViewModel só pede o dado, sem saber a origem.

---

## 3. Jetpack Compose

- **State hoisting**: Composables preferencialmente *stateless* — recebem `value` e `onValueChange` como parâmetros, o estado real vive no `ViewModel` (ou em `remember` só quando é puramente visual e local, tipo "modal está aberto").
- **Modele estados impossíveis pra fora do tipo**, com uma sealed interface, do mesmo jeito que se faz em TypeScript no frontend:
  ```kotlin
  sealed interface OrdersUiState {
      data object Loading : OrdersUiState
      data class Success(val orders: List<Order>) : OrdersUiState
      data class Error(val message: String) : OrdersUiState
      data object Empty : OrdersUiState
  }
  ```
- **Performance de recomposição**: use `data class` (imutáveis, `val`) pros modelos que viram estado — isso permite o Compose comparar por igualdade estrutural e pular recomposição desnecessária. Em `LazyColumn`/`LazyRow`, sempre passe uma `key` estável (id do item), nunca o índice, quando a lista pode reordenar, filtrar ou ter itens inseridos/removidos.
- **`@Preview`** pra iterar num Composable isoladamente sem precisar rodar o app inteiro — use principalmente em componentes reutilizáveis (botões, cards) e telas com estado mockado.
- Evite lógica condicional complexa dentro do corpo do Composable — se o `if`/`when` está definindo o que renderizar baseado em várias condições, considere derivar isso pra um estado explícito no ViewModel (ex.: o `OrdersUiState` acima) em vez de espalhar a decisão pela árvore de UI.

---

## 4. Idiomas do Kotlin

- **Evite `!!`** — ele silencia o compilador sobre uma possibilidade real de `NullPointerException`, exatamente como `any` silencia o TypeScript. Prefira `?.`, `?:` (Elvis), ou `requireNotNull(x) { "mensagem clara" }` quando um null ali é realmente um bug e você quer falhar com uma mensagem útil.
- **`val` por padrão, `var` só quando o valor genuinamente muda** — isso vale pra propriedades de classe e variável local.
- **Data class para modelos**, nunca uma classe mutável genérica pra representar um dado que só é lido.
- **Sealed class/interface pra estados finitos** (UI state, resultado de operação) em vez de múltiplos booleanos soltos (`isLoading`, `isError`, `hasData`) que podem entrar em combinação inválida ao mesmo tempo.
- **Extension functions com moderação** — úteis pra deixar código mais legível (`String.isValidEmail()`), mas não abuse a ponto de esconder lógica de negócio importante atrás de uma chamada que parece trivial.

---

## 5. Coroutines e Flow

- Trabalho assíncrono no `ViewModel` roda em `viewModelScope.launch { }` — isso cancela automaticamente quando o ViewModel morre, evitando trabalho órfão.
- Estado exposto pra UI é `StateFlow` (ou `State` do Compose), não `LiveData`, em projetos novos com Compose — `LiveData` só faz sentido se o projeto já usa em outro lugar e trocar tudo de uma vez não vale o esforço agora.
- **Toda coroutine que pode falhar tem tratamento explícito** — `try/catch` ao redor da chamada suspensa, ou um wrapper de `Result`/`sealed class` que o repositório retorna, nunca uma exceção deixada solta que derruba o app.
  ```kotlin
  fun loadOrders() {
      viewModelScope.launch {
          _uiState.value = OrdersUiState.Loading
          try {
              val orders = repository.getOrders()
              _uiState.value = OrdersUiState.Success(orders)
          } catch (e: IOException) {
              _uiState.value = OrdersUiState.Error("Não foi possível carregar os pedidos.")
          }
      }
  }
  ```
- **Dispatcher correto pra cada trabalho**: `Dispatchers.IO` pra rede/banco, `Dispatchers.Default` pra processamento pesado de CPU, `Main` (implícito no `viewModelScope`) só pra atualizar estado de UI.

---

## 6. Rede (Retrofit)

- Interface Retrofit com funções `suspend`, uma por endpoint, tipadas com DTOs específicos da resposta — não reaproveite o mesmo DTO pra respostas de formato diferente só pra economizar uma classe.
- Erro de rede é tratado no repositório, traduzido pra um tipo que a camada de domínio/ViewModel entende (não deixe `HttpException`/`IOException` do Retrofit vazar até o Composable).
- Timeout configurado explicitamente no client HTTP — nunca deixe no padrão sem pensar, especialmente em endpoints que podem demorar.

---

## 7. Persistência local

- **Room** pra dado estruturado/relacional que precisa de query (histórico, cache de lista, dado offline-first).
- **DataStore** pra preferências simples e dado chave-valor (tema escolhido, flag de onboarding visto, token — este último sempre criptografado, ver seção 9).
- Migração de schema do Room é planejada desde a primeira versão da entidade — adicionar uma `Migration` depois que o app já está em produção sem ter pensado nisso desde o início é a forma mais comum de perder dado do usuário numa atualização.

---

## 8. Injeção de dependência (Hilt)

- `@HiltViewModel` + `@Inject constructor` no ViewModel, recebendo o repositório (interface, não a implementação concreta) como dependência.
- Módulos (`@Module`/`@InstallIn`) fornecem as instâncias concretas de Retrofit, Room e repositórios — a troca de implementação (ex.: mockar um repositório em teste) não exige tocar no ViewModel.

---

## 9. Segurança básica no Android

- **Nenhuma chave de API ou segredo hardcoded no código-fonte** — use `local.properties` + `BuildConfig` (fora do controle de versão) pra chaves de build, e nunca uma chave que dá acesso a dado sensível direto no app; prefira o app chamar seu próprio backend, que guarda a chave real.
- **Dado sensível local (token, credencial) vai em armazenamento criptografado** (`EncryptedSharedPreferences` ou `DataStore` com criptografia), nunca em `SharedPreferences` comum ou arquivo de texto simples.
- **R8/ProGuard habilitado no build de release**, ofuscando o código antes de publicar.
- **Nunca logue dado sensível** (token, senha, dado de pagamento) — nem em `Log.d` "temporário" que alguém esquece de remover.
- Toda comunicação de rede em HTTPS — sem exceção configurada pra permitir tráfego em texto claro (`cleartextTrafficPermitted`) fora de ambiente de desenvolvimento local.

---

## 10. Navegação (Navigation Compose)

- Um único `NavHost` por grafo de navegação, com rotas tipadas (não strings soltas montadas na mão) sempre que o projeto Kotlin já suportar isso.
- Argumentos de navegação são tipados e validados — nunca passe um objeto complexo serializado manualmente sem checar o parsing.
- Lógica de "pra onde navegar depois dessa ação" fica no ViewModel/evento, não decidida dentro da árvore de Composables da tela.

---

## 11. Testes

- Lógica de `ViewModel` e `Repository` é testável isoladamente (JUnit + `kotlinx-coroutines-test`) porque não depende de Compose nem de Android real — se está difícil testar um ViewModel sem instrumentação, é sinal de que ele tem responsabilidade demais ou dependência direta de algo que devia estar atrás de uma interface.
- Priorize teste de lógica de negócio e mapeamento de estado (dado a resposta X da API, o `UiState` vira Y) sobre teste de UI pixel a pixel.

---

## 12. Armadilhas comuns (evite)

- Lógica de negócio (cálculo, validação, decisão) dentro do corpo do Composable, em vez de no ViewModel.
- Chamada de rede ou acesso a banco direto de dentro de um Composable.
- `!!` usado pra fazer o erro de null sumir, em vez de tratar a possibilidade real.
- `Context` de `Activity` guardado num singleton ou classe de vida longa — isso vaza memória (o Android nunca consegue liberar a Activity); use `Application` context quando precisar de contexto de longa duração.
- `LazyColumn` sem `key` estável quando a lista pode mudar de ordem/conteúdo.
- Strings de UI hardcoded no Composable em vez de `strings.xml` (quebra localização e revisão de copy).
- Coroutine lançada sem escopo apropriado (`GlobalScope`) em vez de `viewModelScope`/`lifecycleScope`, o que impede cancelamento automático.
- Ignorar o estado de erro da chamada de rede e só tratar o caminho de sucesso.

---

## 13. Checklist final antes de considerar a implementação pronta

- [ ] O Composable é stateless e não contém lógica de negócio nem chamada de rede/banco direta?
- [ ] O estado da tela é modelado como sealed class/interface, cobrindo loading/sucesso/erro/vazio?
- [ ] Toda coroutine que pode falhar tem tratamento explícito de erro?
- [ ] Nenhum `!!` sem justificativa clara, nenhum segredo hardcoded?
- [ ] `LazyColumn`/`LazyRow` usam `key` estável?
- [ ] Dado sensível local está em armazenamento criptografado, não em `SharedPreferences` comum?
- [ ] A implementação segue a ordem de fases do `planejamento.md`, se ele existir?
