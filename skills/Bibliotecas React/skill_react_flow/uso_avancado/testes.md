---
title: "Testes no React Flow (Playwright, Cypress e React Testing Library)"
description: "Estrat?gias completas de testes automatizados para aplica??es React Flow v12, incluindo testes de ponta a ponta (E2E) com Playwright/Cypress, testes de integra??o com React Testing Library / Vitest e mocks essenciais para ResizeObserver e canvas."
topics:
  - "Estrat?gias de Testes: Unit?rios, Integra??o e E2E"
  - "Testes E2E com Playwright (Arrastar N?s, Conectar Handles, Zoom/Pan)"
  - "Testes com Cypress"
  - "Testes de Integra??o com React Testing Library e Vitest/Jest"
  - "Configura??o de Mocks para ResizeObserver e DOMMatrixReadOnly"
keywords:
  - "testing"
  - "playwright"
  - "cypress"
  - "react testing library"
  - "vitest"
  - "jest"
  - "ResizeObserver mock"
  - "drag and drop test"
  - "@xyflow/react"
source_scope: "Learn / Advanced Use / Testing"
---

# Testes no React Flow (Playwright, Cypress e React Testing Library)

Testar aplica??es baseadas em grafos visuais envolve verificar tanto o comportamento de renderiza??o de n?s quanto intera??es espaciais complexas (como arrastar n?s, conectar portas/handles com o mouse e navegar na viewport).

---

## 1. Testes de Ponta a Ponta (E2E) com Playwright

O **Playwright** ? a ferramenta recomendada para testar o React Flow, pois executa em navegadores reais com suporte total a eventos de ponteiro (Pointer Events) e SVG.

### Exemplo: Teste de Arraste de N? e Conex?o de Aresta

```typescript
import { test, expect } from '@playwright/test';

test.describe('React Flow Canvas E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Aguarda o canvas e n?s renderizarem
    await expect(page.locator('.react-flow__node')).toHaveCount(2);
  });

  test('deve arrastar um n? para novas coordenadas', async ({ page }) => {
    const node1 = page.locator('.react-flow__node[data-id="1"]');
    const boxBefore = await node1.boundingBox();
    expect(boxBefore).not.toBeNull();

    // Simula arrasto com mouse
    await page.mouse.move(boxBefore!.x + 20, boxBefore!.y + 20);
    await page.mouse.down();
    await page.mouse.move(boxBefore!.x + 150, boxBefore!.y + 100, { steps: 5 });
    await page.mouse.up();

    const boxAfter = await node1.boundingBox();
    expect(boxAfter!.x).toBeGreaterThan(boxBefore!.x + 100);
  });

  test('deve conectar dois n?s arrastando do handle source para o target', async ({ page }) => {
    const sourceHandle = page.locator('.react-flow__node[data-id="1"] .react-flow__handle-right');
    const targetHandle = page.locator('.react-flow__node[data-id="2"] .react-flow__handle-left');

    const sourceBox = await sourceHandle.boundingBox();
    const targetBox = await targetHandle.boundingBox();

    // Arrasta a nova linha de conex?o
    await page.mouse.move(sourceBox!.x + 4, sourceBox!.y + 4);
    await page.mouse.down();
    await page.mouse.move(targetBox!.x + 4, targetBox!.y + 4, { steps: 8 });
    await page.mouse.up();

    // Verifica se a nova aresta SVG foi criada no DOM
    await expect(page.locator('.react-flow__edge')).toHaveCount(1);
  });
});
```

---

## 2. Testes de Componentes com React Testing Library e Vitest / Jest

Ao testar componentes com React Testing Library em ambientes Node.js (jsdom/happy-dom), ? fundamental mockar APIs do navegador que o React Flow utiliza internamente (`ResizeObserver`, `DOMMatrixReadOnly`).

### `setupTests.ts` (Mock Global Obrigat?rio)

```typescript
// Mock de ResizeObserver para ambientes jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock de DOMMatrixReadOnly se necess?rio
if (typeof window.DOMMatrixReadOnly === 'undefined') {
  // @ts-ignore
  window.DOMMatrixReadOnly = class DOMMatrixReadOnly {
    m22 = 1;
    transformPoint(point: any) { return point; }
  };
}
```

### Exemplo: Testando um N? Customizado

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReactFlowProvider } from '@xyflow/react';
import { ColorChooserNode } from './ColorChooserNode';

describe('<ColorChooserNode />', () => {
  it('deve renderizar com a cor inicial e permitir altera??o', () => {
    const mockData = { color: '#ff0000', label: 'N? Teste' };

    render(
      <ReactFlowProvider>
        <ColorChooserNode
          id="test-node"
          data={mockData}
          selected={false}
          type="colorChooser"
          zIndex={1}
          isConnectable={true}
          positionAbsoluteX={100}
          positionAbsoluteY={100}
          dragging={false}
        />
      </ReactFlowProvider>
    );

    expect(screen.getByText('N? Teste')).toBeDefined();
    
    const colorInput = screen.getByDisplayValue('#ff0000');
    fireEvent.change(colorInput, { target: { value: '#00ff00' } });
    expect(colorInput).toHaveValue('#00ff00');
  });
});
```
