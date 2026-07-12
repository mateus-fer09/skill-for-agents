---
name: frontend-craft
description: Guia completo para construir interfaces de front-end (React/Electron/Web) com design visual distinto E código de qualidade. Use sempre que o usuário pedir para criar, redesenhar ou revisar uma tela, componente, landing page, dashboard, formulário ou qualquer parte de uma UI. Cobre tanto decisões estéticas (paleta, tipografia, layout, motion) quanto arquitetura de componentes React, gerenciamento de estado, performance e acessibilidade. Ative esta skill mesmo que o usuário não diga explicitamente "design" — basta mencionar tela, interface, componente, página ou app.
---

# Frontend Craft

Esta skill combina duas responsabilidades que normalmente ficam separadas: **direção visual** (para a UI não parecer genérica) e **engenharia de front-end** (para o código ser sustentável). Trate cada tarefa de UI como se estivesse contratado tanto para o design quanto para a implementação — as duas decisões se afetam mutuamente.

## Parte 1 — Direção visual

### Ancore no produto real
Antes de desenhar qualquer coisa, defina: qual é o produto, quem usa, e qual é o único trabalho desta tela. Se o usuário já tem um projeto com identidade própria (nome, paleta, tom), use essa identidade como ponto de partida em vez de reinventar. Evite os três "defaults" que todo modelo de IA tende a produzir:
1. Fundo bege/creme + serifada de alto contraste + accent terracota.
2. Fundo quase preto + um único accent neon (verde-ácido ou vermelho).
3. Layout estilo jornal, hairlines, zero border-radius, colunas densas.

Esses três são válidos *se o briefing pedir por eles* — o problema é usá-los por padrão, sem justificativa ligada ao produto.

### Processo em duas passadas
1. **Rascunho do sistema de tokens**, antes de escrever qualquer código:
   - **Cor**: 4–6 hex nomeados (ex: `--void: #0B0B12`, `--violet-glow: #8B5CF6`).
   - **Tipografia**: fonte de destaque (usada com moderação) + fonte de corpo + fonte utilitária para dados/legendas.
   - **Layout**: descreva o conceito em 1 frase + wireframe ASCII se ajudar.
   - **Elemento-assinatura**: a UMA coisa marcante que essa tela vai ser lembrada por ter.
2. **Autocrítica antes de construir**: releia o rascunho e pergunte "isso é uma escolha específica deste produto, ou é o que eu geraria para qualquer projeto parecido?". Se for genérico, revise e anote o que mudou.

### Princípios de design
- **Hero como tese**: abra com a coisa mais característica do produto (headline, demo ao vivo, animação) — não com "número grande + label pequeno + gradiente" por padrão.
- **Tipografia carrega personalidade**: pareie display e corpo deliberadamente; defina uma escala clara de pesos e espaçamentos.
- **Estrutura é informação**: numeração, divisores e labels só fazem sentido se codificarem algo real (uma sequência de fato, por exemplo). Não decore com "01 / 02 / 03" só porque parece bonito.
- **Motion com propósito**: escolha *onde* a animação serve ao produto (entrada, scroll-reveal, micro-interação de hover) em vez de espalhar efeitos. Às vezes nenhuma animação é a escolha certa.
- **Gaste ousadia em um lugar só**: deixe o elemento-assinatura ser o único momento memorável; mantenha o resto disciplinado.
- **Piso de qualidade obrigatório, sem anunciar**: responsivo até mobile, foco de teclado visível, `prefers-reduced-motion` respeitado.

### Copy é material de design
Escreva do lado de quem usa a tela, não de como o sistema foi construído ("gerenciar notificações", não "config de webhook"). Voz ativa: um botão que diz "Salvar alterações" deve gerar um toast "Alterações salvas" — o vocabulário não muda no meio do fluxo. Erros explicam o que aconteceu e como resolver, sem se desculpar. Telas vazias convidam a uma ação.

## Parte 2 — Arquitetura e código React

### Estrutura de componentes
- Um componente = uma responsabilidade. Se o componente precisa de comentário tipo "// isso também faz X", provavelmente deve ser dois componentes.
- Componentes de apresentação (só UI, recebem props) separados de componentes de container/lógica (buscam dados, gerenciam estado). Isso facilita testar e reaproveitar visual sem lógica junto.
- Nomeie arquivos e pastas por domínio, não por tipo técnico: prefira `features/auth/LoginForm.jsx` a `components/forms/LoginForm.jsx` quando o projeto crescer.
- Hooks customizados (`useX`) para extrair lógica reutilizável (fetch, formulário, debounce) para fora do componente visual.

### Estado
- Estado local (`useState`) para o que só aquele componente usa. Suba o estado (`lift state up`) apenas até o ancestral comum mais próximo que realmente precisa dele — evitar tanto estado "preso demais embaixo" quanto "context global desnecessário".
- Context API para estado verdadeiramente global e raramente mutável (tema, usuário autenticado). Para estado que muda com frequência e afeta muitos componentes, considerar uma lib dedicada (Zustand, Redux Toolkit) em vez de Context puro, que re-renderiza a árvore inteira.
- Nunca duplicar estado derivável — calcule na renderização (ou com `useMemo` se for caro) em vez de guardar em outro `useState` sincronizado manualmente.

### Performance
- `useMemo`/`useCallback` só quando há um problema medido (renderizações caras, listas grandes, props passadas para componentes memoizados) — não por padrão em todo componente.
- Code-splitting com `React.lazy` + `Suspense` para rotas e telas pesadas que não são carregadas de início.
- Listas grandes: `key` estável (nunca o índice do array, quando a lista pode reordenar) e virtualização (`react-window`) acima de algumas centenas de itens.

### Acessibilidade (não negociável)
- HTML semântico primeiro (`<button>`, `<nav>`, `<label>`) antes de recriar comportamento com `<div onClick>`.
- Todo elemento interativo alcançável e operável via teclado (`Tab`, `Enter`, `Space`), com foco visível.
- Inputs sempre com `<label>` associado; imagens informativas com `alt` descritivo, decorativas com `alt=""`.
- Contraste de cor mínimo AA, especialmente relevante em paletas escuras/neon — teste, não assuma.

### Estilização
- Escolha uma abordagem por projeto e seja consistente: CSS Modules, Tailwind ou styled-components — não misture duas no mesmo componente sem motivo.
- Tokens de design (cores, espaçamentos, tipografia) centralizados em variáveis (CSS custom properties ou tema do Tailwind), nunca hex/px soltos espalhados pelos componentes.
- Cuidado com especificidade de seletores: selector por classe de seção (`.section`) e por elemento (`.cta`) podem colidir de forma inesperada em paddings/margins — prefira classes específicas e evite aninhamento profundo.

### Checklist antes de entregar
1. O componente tem uma responsabilidade clara?
2. Existe estado duplicado ou desnecessariamente global?
3. Funciona 100% via teclado e tem foco visível?
4. Responsivo em mobile?
5. As cores/tipografia vêm de tokens centralizados, não de valores soltos?
6. O elemento-assinatura do design ainda está lá, e o resto está discreto ao redor dele?