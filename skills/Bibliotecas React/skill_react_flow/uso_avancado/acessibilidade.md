---
title: "Acessibilidade (a11y) no React Flow"
description: "Guia de conformidade WCAG 2.1 AA no React Flow v12, navega??o por teclado, pap?is ARIA para n?s e arestas, personaliza??o de mensagens e internacionaliza??o de leitores de tela com ariaLabelConfig."
topics:
  - "Conformidade WCAG 2.1 AA"
  - "Navega??o Total por Teclado"
  - "Atributos e Pap?is ARIA para N?s e Arestas"
  - "Personaliza??o e Tradu??o com ariaLabelConfig"
  - "Gerenciamento de Foco e Alto Contraste"
keywords:
  - "accessibility"
  - "a11y"
  - "WCAG"
  - "keyboard navigation"
  - "ariaLabelConfig"
  - "screen reader"
  - "@xyflow/react"
source_scope: "Learn / Concepts / Accessibility"
---

# Acessibilidade (a11y) no React Flow

O React Flow foi projetado para oferecer suporte a **acessibilidade (a11y)** de acordo com as diretrizes **WCAG 2.1 AA**, garantindo que usu?rios dependentes de leitores de tela e navega??o exclusiva por teclado possam navegar, inspecionar e interagir com diagramas de grafos.

---

## 1. Recursos Nativos de Navega??o por Teclado

O React Flow implementa atalhos nativos para opera??o do canvas:

| Tecla / Combina??o | A??o Executada |
| :--- | :--- |
| `Tab` / `Shift + Tab` | Alterna o foco sequencialmente entre os n?s do grafo. |
| `Setas Direcionais` (`?`, `?`, `?`, `?`) | Move o n? atualmente focado pelo canvas (pan/move). |
| `Enter` / `Espa?o` | Seleciona o n? ou ativa o handle focado para iniciar conex?o. |
| `Delete` / `Backspace` | Remove os n?s ou arestas selecionados. |
| `Escape` | Cancela uma conex?o em andamento ou desmarca os elementos selecionados. |

---

## 2. Estrutura e Pap?is ARIA

Os n?s e arestas do React Flow possuem atributos sem?nticos para leitores de tela (como NVDA, VoiceOver e JAWS):
- **N?s:** Possuem `role="button"` (ou `role="group"`), `tabIndex={0}`, `aria-roledescription="node"` e `aria-describedby` com instru??es de teclado.
- **Arestas:** Possuem `aria-label` descritivo indicando a origem e o destino da conex?o (ex: *"Conex?o do N? 1 para o N? 2"*).

---

## 3. Customizando e Traduzindo Mensagens ARIA com `ariaLabelConfig`

Voc? pode internacionalizar todas as mensagens lidas pelos leitores de tela passando o objeto `ariaLabelConfig` para a raiz do `<ReactFlow />`:

```tsx
import React from 'react';
import { ReactFlow, AriaLabelConfig } from '@xyflow/react';

const customPtBrAriaLabels: Partial<AriaLabelConfig> = {
  'node.a11yDescription.default':
    'Pressione as setas direcionais para mover o n?. Pressione Enter para selecionar.',
  'node.a11yDescription.keyboard':
    'Use as teclas de seta para reposicionar este n? no diagrama.',
  'edge.a11yDescription.default':
    'Pressione Backspace ou Delete para remover esta conex?o.',
};

export function AccessibleFlow({ nodes, edges, onNodesChange, onEdgesChange }) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      ariaLabelConfig={customPtBrAriaLabels}
      aria-label="Diagrama Interativo de Processos"
    />
  );
}
```

---

## 4. Estilos de Alto Contraste e Foco Vis?vel

Para garantir que usu?rios com baixa vis?o identifiquem claramente o elemento ativo, certifique-se de estilizar o seletor `:focus-visible`:

```css
/* Realce acess?vel para n?s focados via teclado */
.react-flow__node:focus-visible {
  outline: 3px solid #2563eb !important;
  outline-offset: 4px;
}

.react-flow__handle:focus-visible {
  outline: 3px solid #16a34a !important;
  transform: scale(1.3);
}
```
