---
name: boas-praticas-fullstack
description: Use esta skill sempre que for planejar, escrever, revisar ou refatorar código em projetos que usam React, TypeScript, TailwindCSS ou Node.js — inclui criar uma feature nova, corrigir um bug, montar um endpoint, criar um componente, ou fazer scaffold de um projeto do zero. Consulte esta skill ANTES de começar a implementar (para planejar a abordagem) e ANTES de considerar a tarefa concluída (como checklist final de qualidade). Aplique por padrão mesmo que o usuário não peça explicitamente "boas práticas", "qualidade" ou "arquitetura" — o objetivo é evitar código apressado, sem tipagem, sem tratamento de erro ou sem estrutura, mesmo em tarefas que parecem pequenas ou pedidos que pareçam simples.
---

# Boas práticas full-stack — React, TypeScript, TailwindCSS e Node.js

O maior risco ao gerar código rápido não é a sintaxe errada — é entregar algo que "funciona no happy path" mas que quebra silenciosamente, é impossível de manter, ou empurra decisões de arquitetura ruins para o futuro. Esta skill existe para forçar uma pausa de planejamento antes de codar e uma checagem de qualidade antes de entregar, sem burocratizar tarefas pequenas.

Duas regras que guiam tudo abaixo:
1. **Planejar 2 minutos economiza 20 minutos de retrabalho.** Um esboço rápido da abordagem evita reescrever componentes ou endpoints inteiros depois.
2. **Tipagem e tratamento de erro não são "extras" — são o código.** Um componente sem estado de erro, ou uma rota sem validação de entrada, está incompleto, não "pronto mais simples".

---

## 1. Antes de codar: planeje em voz alta

Para qualquer tarefa que não seja uma alteração trivial de uma linha, resuma antes de escrever código:

- **O que exatamente está sendo pedido** — se o pedido for ambíguo, assuma a interpretação mais razoável e declare a suposição em vez de travar esperando esclarecimento.
- **Onde isso se encaixa no projeto existente** — antes de criar um padrão novo, olhe como o projeto já resolve problemas parecidos (outro componente, outro endpoint, outro hook) e siga a convenção existente em vez de inventar uma terceira forma de fazer a mesma coisa.
- **Quais são os estados que a UI ou a API precisam cobrir** — não só o caminho feliz: carregando, vazio, erro, sem permissão, dado inválido.
- **O que pode ser quebrado em passos pequenos e testáveis**, em vez de uma função gigante que faz tudo de uma vez.

Isso não precisa ser formal — pode ser 3-4 frases antes do código. O ponto é pensar na forma antes de pensar na sintaxe.

---

## 2. Princípios gerais (valem para front e back)

- **Nomes dizem o que a coisa faz.** `getUserOrders`, não `getData`. Se o nome precisa de comentário explicando, o nome está errado.
- **Funções e componentes pequenos, uma responsabilidade cada.** Se está difícil descrever o que uma função faz em uma frase sem "e", ela provavelmente devia ser duas.
- **Erros nunca são silenciosos.** Nada de `catch {}` vazio ou `catch (e) { console.log(e) }` como tratamento final — ou trate o erro de verdade (retry, fallback, mensagem pro usuário) ou deixe ele propagar para quem sabe tratar.
- **DRY com moderação.** Duplicação de 2 linhas não justifica uma abstração genérica nova — abstraia quando o padrão se repetir umas 3 vezes e a forma já estiver clara, não antes.
- **Tipos e validação são a primeira linha de defesa**, não uma formalidade pra passar no build. `any` e `unknown` sem narrowing são um sinal de que o problema não foi modelado, não uma solução.
- **Segredos, chaves de API e credenciais nunca vão no código.** Sempre variáveis de ambiente, nunca hardcoded, nem "temporariamente" nem em exemplo.

---

## 3. Frontend — React + TypeScript + TailwindCSS

### Estrutura de componentes
- Componentes pequenos e composáveis. Se um componente passou de ~150-200 linhas ou mistura muita lógica de dados com muita lógica visual, extraia um hook (`useAlgumaCoisa`) para a lógica e deixe o componente focado em renderizar.
- Separe "container" (busca dados, tem estado) de "apresentação" (recebe props, renderiza) quando o componente cresce — isso facilita reutilizar a parte visual e testar a lógica isoladamente.
- Evite prop drilling de mais de 2-3 níveis. Se muitos componentes intermediários só estão repassando uma prop sem usá-la, considere Context ou reestruturar a árvore de componentes.

### TypeScript
- Tipagem explícita em props, retornos de função pública e nas bordas do sistema (respostas de API, dados de formulário). Dentro de uma função pequena, inferência de tipo está ok.
- `any` é o último recurso, não o primeiro. Se o tipo é genuinamente desconhecido, use `unknown` e faça narrowing, não `any` pra silenciar o compilador.
- Modele estados impossíveis para fora do tipo. Em vez de `{ data?: T; loading: boolean; error?: string }` (que permite `loading: true` com `data` preenchido ao mesmo tempo), prefira uma union:
  ```ts
  type RequestState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; message: string };
  ```
- Ative (ou respeite, se já ativo) o `strict` do `tsconfig.json`. Não desligue regras de tipo para "fazer o erro sumir" — resolva a causa.

### Estado
- Estado local (`useState`) por padrão. Suba o estado (lifting) só quando dois componentes realmente precisam compartilhá-lo. Não crie contexto global para algo que só um componente usa.
- Dado que vem do servidor (API) não é "estado do componente" — trate como cache. Se o projeto já usa uma lib de data-fetching (React Query, SWR, RTK Query), siga o padrão existente em vez de reinventar fetch + `useEffect` + `useState` manualmente.
- `useEffect` é para sincronizar com sistemas externos (DOM, subscriptions, APIs), não uma solução genérica para "rodar algo depois". Se o efeito só está derivando um valor a partir de outro estado, calcule direto no render.

### TailwindCSS
- Extraia combinações de classes repetidas para um componente ou para uma função utilitária (`clsx`/`cva`) em vez de copiar a mesma string gigante de classes em vários lugares.
  ```tsx
  const buttonStyles = cva("rounded-md font-medium transition-colors", {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      },
      size: { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-base" },
    },
  });
  ```
- Prefira os tokens do tema (`text-gray-600`, `rounded-lg`, escala de espaçamento padrão) a valores arbitrários (`text-[#4b5563]`, `mt-[13px]`) — valores arbitrários indicam que falta alinhar com o design system do projeto, ou que o design system precisa desse token.
- Sempre pense em responsividade (`sm:`, `md:`, `lg:`) quando o componente for parte de uma tela real, não só de um teste isolado.
- Acessibilidade não é opcional: elementos interativos usam `<button>`/`<a>` reais (não `<div onClick>`), imagens têm `alt`, inputs têm `<label>` associado, e o contraste de cor segue o tema do projeto.

### Estados de carregamento, erro e vazio
Todo componente que busca dados assíncronos precisa cobrir, no mínimo:
- **Carregando** — skeleton ou spinner, não uma tela em branco.
- **Erro** — mensagem legível para o usuário, não o erro técnico cru.
- **Vazio** — o que mostrar quando a lista/resultado é vazio de verdade (isso não é o mesmo que erro).

### Performance
- `useMemo`/`useCallback`/`React.memo` resolvem um problema de performance medido, não são um reflexo automático — usá-los sem necessidade adiciona complexidade sem ganho real. Otimize quando notar (ou o usuário reportar) um problema real de re-render.
- Em listas, sempre usar uma `key` estável e única (id do dado), nunca o índice do array quando a lista pode reordenar, filtrar ou ter itens inseridos/removidos.

---

## 4. Backend — Node.js

### Arquitetura em camadas
Evite lógica de negócio direto dentro do handler da rota. Separe em camadas, mesmo em projetos pequenos — isso facilita testar e trocar peças depois:
```
routes/     → define os endpoints, delega pro controller
controllers/→ lê request, chama o service, formata a response
services/   → regra de negócio, não sabe nada de HTTP
repositories/ (ou data/) → acesso a banco/API externa
```
Um handler de rota que faz parsing, validação, query no banco e formatação de resposta tudo junto é o sinal mais comum de código "rápido demais" — quebre isso mesmo que o endpoint pareça simples hoje.

### Validação de entrada
Nunca confie no que vem do cliente. Valide body, query params e params de rota na borda, antes de qualquer lógica de negócio — com uma lib de schema (Zod, Yup) sempre que o projeto já usar uma:
```ts
const createOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const parsed = createOrderSchema.safeParse(req.body);
if (!parsed.success) {
  return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
}
```

### Tratamento de erros e respostas de API
- Formato de erro consistente em toda a API (ex.: `{ error: string, details?: unknown }`), não uma string solta às vezes e um objeto em outras.
- Status HTTP corretos: 400 para entrada inválida, 401/403 para autenticação/autorização, 404 para recurso inexistente, 409 para conflito, 500 só para erro realmente inesperado do servidor.
- Um error handler central (middleware) para capturar exceções não tratadas, em vez de `try/catch` repetido e inconsistente em cada rota.
- Nunca vaze detalhes internos (stack trace, query SQL, path do arquivo) na resposta para o cliente em produção.

### Assincronismo
- Toda `Promise` tem que ter destino: `await` dentro de `try/catch`, ou `.catch()` explícito. Promise sem tratamento é um dos jeitos mais comuns de um erro sumir silenciosamente.
- Cuidado com `Promise.all` quando uma falha não deve derrubar as outras operações — nesse caso, `Promise.allSettled` é mais adequado.

### Segurança básica
- Sanitizar/parametrizar toda query — nunca concatenar input do usuário direto numa query SQL (use o ORM/query builder ou prepared statements).
- Rate limiting em endpoints sensíveis (login, criação de conta, endpoints públicos caros).
- CORS configurado explicitamente para as origens esperadas, não `*` em produção.
- Senhas e tokens: hash com algoritmo apropriado (bcrypt/argon2), nunca texto plano, nunca logados.

### Logs e observabilidade
- Log de erros com contexto suficiente para debugar (rota, id da requisição, payload relevante — sem dados sensíveis) em vez de só `console.log(error)`.
- Nível de log adequado (info/warn/error) — nem tudo é `console.log`.

---

## 5. Armadilhas comuns ao gerar código rápido (evite)

- Colocar tudo em um arquivo/componente gigante "pra terminar logo" — isso vira dívida técnica imediata.
- Usar `any` ou `// @ts-ignore` para fazer o erro de tipo sumir em vez de resolver a causa.
- Ignorar estado de erro/loading porque "o happy path funciona".
- Copiar e colar um bloco de código em vez de extrair a parte comum, quando o padrão já se repetiu.
- Validar só no frontend e assumir que o backend não precisa validar de novo.
- Deixar `console.log` de debug espalhado no código final.
- Nomes genéricos (`data`, `temp`, `handleClick2`) que não dizem nada sobre o que a coisa representa.
- Misturar convenções diferentes das que já existem no projeto (ex.: criar um novo padrão de fetch quando já existe um hook padrão pra isso).

---

## 6. Checklist final antes de considerar a tarefa pronta

Antes de entregar, revise rapidamente:

- [ ] O código cobre erro, loading e vazio (quando envolve dados assíncronos)?
- [ ] Não tem `any` nem `@ts-ignore` sem justificativa clara?
- [ ] Entrada de usuário (frontend) e de requisição (backend) está validada?
- [ ] Não tem segredo/chave hardcoded?
- [ ] Nomes de variáveis, funções e componentes são autoexplicativos?
- [ ] O padrão usado é consistente com o resto do projeto, não um padrão novo inventado à toa?
- [ ] Se algo pode falhar (rede, banco, parsing), existe um `catch` que trata isso de verdade?
