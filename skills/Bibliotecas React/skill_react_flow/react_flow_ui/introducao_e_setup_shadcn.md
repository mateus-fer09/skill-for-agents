---
title: "React Flow UI - Introdução e Setup com shadcn/ui e Tailwind CSS 4"
description: "Guia completo de introdução e instalação do React Flow UI com shadcn/ui, Tailwind CSS 4 e React 19. Filosofia copy-paste, configuração de registry, ordem correta de imports de CSS e personalização temática."
topics:
  - "Filosofia React Flow UI"
  - "Instalação e Pré-requisitos"
  - "Configuração do Tailwind CSS 4 e React 19"
  - "Instalação de Blocos via shadcn CLI"
  - "Variáveis de Tema e Suporte a Dark Mode"
keywords:
  - "React Flow UI"
  - "shadcn/ui"
  - "Tailwind CSS 4"
  - "React 19"
  - "components.json"
  - "global.css"
  - "Registry"
source_scope: "ui/introduction"
---

# Introdução e Setup do React Flow UI

O **React Flow UI** é uma coleção oficial de componentes prontos para uso construídos sob a filosofia do [shadcn/ui](https://ui.shadcn.com/) e estilizados com [Tailwind CSS](https://tailwindcss.com/). Eles fornecem uma base sólida, visualmente refinada e com acessibilidade nativa para criação imediata de editores visuais, nós customizados, arestas animadas, toolbars e ferramentas de depuração.

---

## 1. Filosofia de Design

Diferente de bibliotecas de componentes tradicionais empacotadas como dependências NPM fechadas (*black-boxes*), o React Flow UI segue o paradigma **Copy & Paste**:

* **Código Aberto no seu Projeto:** O código-fonte dos componentes reside diretamente na pasta `components/` ou `registry/` da sua aplicação.
* **Sem Bloqueios de Customização:** Você possui total liberdade para alterar estilos Tailwind, adicionar campos ao DOM, trocar ícones e estender propriedades.
* **Integração Nativa com shadcn/ui:** Utiliza os mesmos tokens de cores (`bg-card`, `text-foreground`, `border-muted`, etc.), permitindo que seu fluxo herde automaticamente o tema (Dark/Light mode) da aplicação.

---

## 2. Pré-requisitos e Instalação do shadcn/ui

Antes de adicionar os blocos do React Flow UI, seu projeto deve ter o Tailwind CSS e o shadcn/ui inicializados.

### Passo 1: Inicializar o shadcn/ui
No diretório raiz do seu projeto, execute:

```bash
npx shadcn@latest init
```

O assistente criará o arquivo `components.json` e configurará os aliases de caminho (ex: `@/components`, `@/lib/utils`).

### Exemplo de `components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

---

## 3. Configuração do Tailwind CSS 4 e CSS Stylesheet

> [!IMPORTANT]
> **Ordem Crítica de Importação de Estilos no Tailwind CSS 4:**
> Ao utilizar o Tailwind CSS 4 com React Flow, o stylesheet principal `@xyflow/react/dist/style.css` **deve ser obrigatoriamente importado dentro de `@layer base` no seu arquivo CSS global (`globals.css` ou `index.css`)**, logo após a importação do Tailwind CSS.
> **Evite importar `@xyflow/react/dist/style.css` dentro do `App.tsx`, `page.tsx` ou em módulos JS/TSX**, pois isso desestabiliza a especificidade das regras do Tailwind 4.

### Configuração em `globals.css` (Tailwind CSS 4 + React 19)
```css
@import "tailwindcss";
@import "tw-animate-css";

@layer base {
  @import "@xyflow/react/dist/style.css";
}

/* Configuração de Variáveis de Tema */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

---

## 4. Instalando Componentes com a shadcn CLI

Você pode instalar qualquer componente do React Flow UI diretamente na sua pasta de componentes através da URL do registro oficial:

```bash
# Nós e Containers Base
npx shadcn@latest add https://ui.reactflow.dev/base-node
npx shadcn@latest add https://ui.reactflow.dev/base-handle
npx shadcn@latest add https://ui.reactflow.dev/labeled-handle
npx shadcn@latest add https://ui.reactflow.dev/button-handle
npx shadcn@latest add https://ui.reactflow.dev/node-status-indicator
npx shadcn@latest add https://ui.reactflow.dev/node-tooltip
npx shadcn@latest add https://ui.reactflow.dev/node-appendix
npx shadcn@latest add https://ui.reactflow.dev/placeholder-node
npx shadcn@latest add https://ui.reactflow.dev/labeled-group-node
npx shadcn@latest add https://ui.reactflow.dev/database-schema-node

# Arestas Avançadas
npx shadcn@latest add https://ui.reactflow.dev/animated-svg-edge
npx shadcn@latest add https://ui.reactflow.dev/button-edge
npx shadcn@latest add https://ui.reactflow.dev/data-edge

# Controles, Busca e DevTools
npx shadcn@latest add https://ui.reactflow.dev/devtools
npx shadcn@latest add https://ui.reactflow.dev/node-search
npx shadcn@latest add https://ui.reactflow.dev/zoom-slider
npx shadcn@latest add https://ui.reactflow.dev/zoom-select
```

### O que o comando `shadcn add` executa:
1. Faz o download do componente TypeScript diretamente para a pasta configurada no seu `components.json`.
2. Instala automaticamente todas as dependências adicionais necessárias (ex: `lucide-react`, `@radix-ui/react-slider`, `class-variance-authority`).
3. Adapta os imports para os aliases do seu projeto.

---

## 5. Classes Utilitárias Essenciais para Componentes Customizados

Ao construir UIs interativas dentro de nós e arestas, certas classes utilitárias CSS do React Flow devem ser empregadas:

| Classe CSS | Função | Onde Aplicar |
| :--- | :--- | :--- |
| `nodrag` | Impede que o nó seja arrastado quando o usuário clica ou interage com este elemento. | Botões, sliders, inputs de texto, selects e checkboxes dentro do nó. |
| `nopan` | Impede que o canvas seja movido ao interagir com o elemento. | Elementos de scroll interno, sliders ou overlays interativos. |
| `nowheel` | Impede que o evento da roda do mouse faça zoom no canvas ao rolar listas internas. | Áreas com overflow/scroll vertical dentro de nós. |
| `in-[.selected]:*` | Seletor Tailwind para aplicar estilos no nó quando o contêiner ancestral `.react-flow__node` estiver com a classe `.selected`. | Bordas com brilho, anéis de foco (*rings*) e sombras de seleção. |
