---
name: uiux-layout-projeto
description: Use esta skill sempre que a tarefa envolver planejar ou criar interface, UX, layout de página, estrutura de componentes visuais, sistema de design, fluxo de navegação, wireframe, dashboard, tela nova, ou reorganizar o layout de um projeto React/Tailwind existente. Consulte ANTES de montar qualquer tela nova (pra planejar hierarquia, fluxo e estrutura antes de escrever JSX) e também ao criar componentes de UI reutilizáveis ou definir/ajustar o design system do projeto (cores, tipografia, espaçamento no Tailwind). Trigger mesmo em pedidos que pareçam só "cria essa tela" ou "monta esse componente" sem mencionar UX explicitamente — o objetivo é evitar telas remendadas sem hierarquia clara e sem consistência com o resto do projeto.
---

# Planejamento e criação de UI/UX e layout de projeto

O erro mais comum ao gerar UI rápido não é a tela ficar feia — é ela ficar genérica, inconsistente com o resto do produto, e sem pensar em quem vai usar. Layout bonito isolado não resolve isso: uma tela precisa ter hierarquia clara, se encaixar no fluxo do usuário, e usar os mesmos tokens visuais das outras telas do projeto. Esta skill existe pra essas três coisas acontecerem antes do JSX, não depois.

---

## 1. Antes de desenhar: planeje a UX

Para qualquer tela ou fluxo novo (não uma alteração cosmética pequena), responda antes de codar:

- **Qual é o único job dessa tela?** Se a resposta tem "e" no meio ("mostra os pedidos e permite editar perfil e..."), a tela provavelmente devia ser duas.
- **Quem chega nessa tela e vindo de onde?** Isso define o que precisa estar visível de cara vs. o que pode estar a um clique de distância.
- **Qual é a ação principal que o usuário deve conseguir tomar?** Ela precisa ser o elemento com mais peso visual da tela — não dividir atenção com 4 CTAs do mesmo tamanho.
- **O que acontece nos casos que não são o caminho feliz?** Lista vazia, erro de carregamento, permissão negada, estado de sucesso — planeje esses estados junto com o estado "normal", não como um adendo depois.

Um esboço em texto ou um wireframe ASCII rápido antes do código já resolve a maior parte disso:
```
[Header: título da página + ação principal (botão, canto direito)]
[Filtros/busca, se houver]
[Lista/grid de itens — cada item: nome, status, ação secundária]
[Estado vazio: ilustração + texto + CTA pra criar o primeiro item]
```

---

## 2. Consistência com o projeto antes de criatividade

Antes de estilizar algo do zero, olhe como o projeto já resolve o mesmo tipo de elemento — botão primário, card, modal, formulário. Use o padrão existente (componente, classe Tailwind, variante) em vez de criar um estilo levemente diferente pro mesmo tipo de elemento. Inconsistência visual (dois estilos de botão "primário" diferentes no mesmo app) é o sinal mais rápido de que uma tela foi gerada isolada do resto do produto.

Se o projeto ainda não tem um padrão pra esse elemento, é o momento de criar um componente reutilizável — não resolver só pra essa tela.

---

## 3. Sistema de design (tokens)

Cor, tipografia e espaçamento vêm de um número pequeno e fixo de valores, não de escolhas ad-hoc tela a tela. Em projetos Tailwind, isso vive no `tailwind.config`:

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2563eb", hover: "#1d4ed8" },
        surface: "#0f172a",
        muted: "#64748b",
      },
      fontFamily: {
        display: ["Cal Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      spacing: {
        section: "5rem", // espaçamento vertical padrão entre seções
      },
    },
  },
};
```

- **Cor**: defina uma paleta pequena e nomeada (não mais que 4-6 cores + variações de tom) e reutilize em todo o projeto — evite escolher um novo tom de azul cada vez que precisar de um botão.
- **Tipografia**: no máximo 2 famílias (uma pra display/títulos, uma pra corpo de texto), com uma escala de tamanho definida (`text-sm`, `text-base`, `text-lg`, `text-2xl`...) usada de forma consistente — não tamanhos arbitrários (`text-[15px]`) espalhados.
- **Espaçamento**: uma escala consistente de espaçamento entre seções e dentro de componentes, em vez de margens/paddings arbitrários decididos visualmente tela por tela.

---

## 4. Fuja do visual genérico de IA

Layouts gerados rápido tendem a convergir pros mesmos três padrões, independente do produto: (1) fundo bege claro com serifa de alto contraste e um acento terracota; (2) fundo quase preto com um único acento neon; (3) estilo "jornal" com linhas finas, zero arredondamento e colunas densas. Nenhum desses é errado por si só, mas usá-los por padrão — sem que o produto peça isso — é o que faz a tela parecer "feita por IA".

Antes de estilizar, escolha deliberadamente com base no produto real: quem usa isso, que sensação o produto quer passar (sério/lúdico, denso/arejado, corporativo/pessoal), e o que já existe no projeto. Gaste a ousadia visual em um elemento de assinatura (uma forma de destacar dados, uma transição, um jeito único de mostrar estado vazio) e mantenha o resto disciplinado — não distribua "criatividade" igualmente em todo canto da tela, isso cansa visualmente e nunca fica coeso.

---

## 5. Estrutura de layout do projeto

Organize componentes por papel, não tudo dentro de uma pasta `components/` genérica:
```
src/
  components/
    ui/          → primitivos reutilizáveis: Button, Input, Card, Modal
    layout/      → Header, Sidebar, PageShell, Footer
  features/
    orders/
      components/  → componentes específicos dessa feature
      hooks/
      OrdersPage.tsx
  layouts/         → composições de layout por tipo de página (AuthLayout, DashboardLayout)
```
- Componentes de `ui/` não sabem nada do domínio do produto (um `Button` não sabe o que é um "pedido") — isso é o que permite reutilizar em qualquer lugar.
- Um `Layout` de página (ex.: `DashboardLayout`) define a moldura (sidebar, header, container) uma vez; páginas individuais só preenchem o conteúdo, sem reimplementar a moldura.
- Responsividade é parte da estrutura, não um ajuste por cima: pense em como o layout se comporta em mobile *ao planejar* (o que vira menu hambúrguer, o que empilha, o que some), não só adicionando classes `md:`/`lg:` depois que o desktop já está pronto.

---

## 6. Componentes reutilizáveis com variantes

Quando o mesmo tipo de elemento aparece com pequenas variações (botão primário/secundário/destrutivo, card com/sem imagem), modele como variantes de um componente, não como componentes/estilos separados copiados:
```tsx
const buttonVariants = cva("rounded-md font-medium transition-colors focus-visible:ring-2", {
  variants: {
    variant: {
      primary: "bg-primary text-white hover:bg-primary-hover",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      destructive: "bg-red-600 text-white hover:bg-red-700",
    },
    size: { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-base" },
  },
  defaultVariants: { variant: "primary", size: "md" },
});
```
Isso mantém as variações consistentes entre si (mesmo raio de borda, mesma transição) em vez de cada uma derivar levemente diferente.

---

## 7. Estados, feedback e microcopy

Toda tela com dado dinâmico cobre, no mínimo: carregando, vazio, erro, sucesso. Trate o texto desses estados como parte do design, não um detalhe:
- **Escreva do ponto de vista de quem usa**, não do sistema: "Nenhum pedido ainda" em vez de "orders_empty". Nomeie coisas pelo que a pessoa reconhece, não por como foi implementado.
- **Ações descrevem o que acontecem**: um botão "Salvar alterações" (não "Enviar"), e a confirmação depois usa a mesma palavra ("Alterações salvas") — a pessoa aprende o vocabulário da interface e ele precisa ser consistente do início ao fim do fluxo.
- **Erro explica o que aconteceu e, quando possível, o que fazer** — nunca uma mensagem genérica tipo "Algo deu errado" quando dá pra ser específico ("Não foi possível salvar. Verifique sua conexão e tente de novo").
- **Estado vazio é um convite a agir**, não só um "não há dados" — geralmente com um CTA pra criar o primeiro item.

---

## 8. Acessibilidade como parte do layout, não extra

- Hierarquia de heading real (`h1` → `h2` → `h3`) que reflete a estrutura da página, não escolhida pelo tamanho da fonte.
- Todo elemento interativo é navegável por teclado e tem foco visível (não remova o `outline` de foco sem substituir por algo igualmente visível).
- Contraste de texto segue os tokens do tema — se um texto secundário parece ilegível sobre o fundo, o token de cor precisa mudar, não só aquele texto isolado.
- Ícones que carregam significado sozinhos (sem texto ao lado) têm `aria-label`.

---

## 9. Checklist final antes de considerar a tela pronta

- [ ] A tela tem um job claro e uma ação principal com destaque visual óbvio?
- [ ] Usa os mesmos componentes/tokens de cor, tipografia e espaçamento do resto do projeto, não um estilo próprio?
- [ ] Cobre estado de carregamento, vazio e erro, com texto específico (não genérico)?
- [ ] Funciona em mobile de forma pensada (não só "encolhida"), com layout adaptado?
- [ ] É navegável por teclado, com foco visível e headings em ordem?
- [ ] Se o visual foi uma escolha deliberada pro produto, não um dos três padrões genéricos de IA por padrão?