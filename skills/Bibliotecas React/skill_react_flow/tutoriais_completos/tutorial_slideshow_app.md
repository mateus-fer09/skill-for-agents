---
title: "Tutorial Completo: Apresenta??es e Slideshow Interativo com React Flow"
description: "Como criar uma ferramenta interativa de apresenta??es baseada em slides sobre canvas infinito usando React Flow v12, transi??es suaves de c?mera com fitBounds/setCenter, n?s de Markdown e controles de navega??o."
topics:
  - "Layout Baseado em Slides no Canvas Infinito"
  - "SlideNode com Renderiza??o de Markdown"
  - "Navega??o por Teclado e Transi??es Suaves de C?mera"
  - "Controles de Apresenta??o e Barra de Progresso"
  - "Vis?o do Apresentador (Presenter View)"
keywords:
  - "slideshow"
  - "presentation"
  - "camera transitions"
  - "SlideNode"
  - "fitBounds"
  - "setCenter"
  - "markdown slides"
  - "@xyflow/react"
source_scope: "Tutorials / Slide Show Presentation"
---

# Tutorial Completo: Apresenta??es e Slideshow Interativo com React Flow

Imagine transformar seu canvas infinito em uma apresenta??o interativa no estilo Prezi / Keynote, onde cada slide ? um n? gigante no espa?o 2D e a c?mera se desloca com anima??es suaves e elegantes de zoom e pan.

Neste tutorial completo, construiremos uma aplica??o de **Slideshow interativo** baseada em React Flow v12 (`@xyflow/react`).

---

## 1. Arquitetura da Apresenta??o

Cada slide possui dimens?es fixas no padr?o 16:9 (`900px` de largura por `500px` de altura).
- `src/slides.ts`: Array com a defini??o e conte?do em Markdown de cada slide.
- `src/Slide.tsx`: Componente de n? customizado que renderiza o slide com visual de cart?o de apresenta??o.
- `src/SlideControls.tsx`: Barra flutuante com bot?es Anterior/Pr?ximo, contador de slides e tela cheia.
- `src/App.tsx`: Gerenciador central de navega??o que move a c?mera do React Flow via `setCenter` ou `fitBounds`.

---

## 2. Implementa??o Completa dos Arquivos

### `src/slides.ts`

```typescript
export type SlideData = {
  title: string;
  content: string;
  slideNumber: number;
};

export const SLIDE_WIDTH = 900;
export const SLIDE_HEIGHT = 500;
export const SLIDE_GAP = 200;

export const slides: SlideData[] = [
  {
    slideNumber: 1,
    title: 'React Flow v12: O Futuro dos Grafos na Web',
    content: `
### Bem-vindo ? Apresenta??o Interativa!

- **Canvas Infinito** com suporte a hardware acceleration.
- **Transi??es de C?mera 60fps**.
- N?s totalmente customiz?veis em React.
    `,
  },
  {
    slideNumber: 2,
    title: 'Arquitetura Reativa',
    content: `
### Por que React Flow ? t?o R?pido?

1. **Reatividade Fina**: N?s s? re-renderizam quando seus dados espec?ficos mudam.
2. **Virtualiza??o Integrada**: N?s fora da tela n?o sobrecarregam o DOM.
3. **Zustand Interno**: Gerenciamento de estado de alto desempenho.
    `,
  },
  {
    slideNumber: 3,
    title: 'Casos de Uso Poderosos',
    content: `
### O que voc? pode construir?

- **Engenharias de IA / LangChain Pipelines**
- **Sintetizadores de ?udio Modulares**
- **Mapas Mentais & Whiteboards Colaborativos**
- **Apresenta??es Espaciais como esta!**
    `,
  },
  {
    slideNumber: 4,
    title: 'Obrigado!',
    content: `
### Perguntas & Respostas

Visite a documenta??o oficial em [reactflow.dev](https://reactflow.dev).

*Desenvolvido com @xyflow/react.*
    `,
  },
];
```

### `src/Slide.tsx`

```tsx
import React, { memo } from 'react';
import { NodeProps, Node } from '@xyflow/react';
import { SlideData, SLIDE_WIDTH, SLIDE_HEIGHT } from './slides';

export type SlideNodeType = Node<SlideData, 'slide'>;

function SlideComponent({ data, selected }: NodeProps<SlideNodeType>) {
  return (
    <div
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        background: '#ffffff',
        borderRadius: 16,
        padding: 48,
        boxSizing: 'border-box',
        border: selected ? '4px solid #2563eb' : '1px solid #e2e8f0',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#0f172a'
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
          SLIDE {data.slideNumber}
        </div>
        <h1 style={{ fontSize: 36, margin: '16px 0 24px 0', color: '#1e293b' }}>
          {data.title}
        </h1>
        <div style={{ fontSize: 20, lineHeight: 1.6, color: '#334155', whiteSpace: 'pre-line' }}>
          {data.content}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 16, color: '#94a3b8', fontSize: 13 }}>
        <span>React Flow Presentation App</span>
        <span>Slide {data.slideNumber} de 4</span>
      </div>
    </div>
  );
}

export const SlideNode = memo(SlideComponent);
```

### `src/SlideControls.tsx`

```tsx
import React from 'react';
import { Panel } from '@xyflow/react';

interface SlideControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onFitAll: () => void;
}

export function SlideControls({ currentSlide, totalSlides, onPrev, onNext, onFitAll }: SlideControlsProps) {
  return (
    <Panel position="bottom-center" style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(15, 23, 42, 0.9)',
        padding: '10px 20px',
        borderRadius: 30,
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        color: '#fff'
      }}>
        <button
          onClick={onPrev}
          disabled={currentSlide === 0}
          style={{
            background: currentSlide === 0 ? '#475569' : '#38bdf8',
            color: '#0f172a',
            border: 'none',
            borderRadius: 20,
            padding: '6px 16px',
            fontWeight: 'bold',
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          ? Anterior
        </button>

        <span style={{ fontSize: 14, fontWeight: 600, minWidth: 100, textAlign: 'center' }}>
          Slide {currentSlide + 1} de {totalSlides}
        </span>

        <button
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          style={{
            background: currentSlide === totalSlides - 1 ? '#475569' : '#38bdf8',
            color: '#0f172a',
            border: 'none',
            borderRadius: 20,
            padding: '6px 16px',
            fontWeight: 'bold',
            cursor: currentSlide === totalSlides - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Pr?ximo ?
        </button>

        <div style={{ width: 1, height: 24, background: '#475569', margin: '0 4px' }} />

        <button
          onClick={onFitAll}
          style={{
            background: 'transparent',
            border: '1px solid #94a3b8',
            color: '#fff',
            borderRadius: 20,
            padding: '6px 12px',
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          Ver Todos
        </button>
      </div>
    </Panel>
  );
}
```

### `src/App.tsx`

```tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  Node,
  NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { slides, SLIDE_WIDTH, SLIDE_HEIGHT, SLIDE_GAP } from './slides';
import { SlideNode, SlideNodeType } from './Slide';
import { SlideControls } from './SlideControls';

const nodeTypes: NodeTypes = {
  slide: SlideNode,
};

// Gera n?s posicionados horizontalmente em sequ?ncia
const initialNodes: SlideNodeType[] = slides.map((slide, index) => ({
  id: `slide-${index}`,
  type: 'slide',
  position: {
    x: index * (SLIDE_WIDTH + SLIDE_GAP),
    y: 0,
  },
  data: slide,
}));

function SlideshowPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setCenter, fitView } = useReactFlow();

  // Anima a c?mera para centralizar o slide alvo
  const moveToSlide = useCallback((index: number) => {
    const targetX = index * (SLIDE_WIDTH + SLIDE_GAP) + SLIDE_WIDTH / 2;
    const targetY = SLIDE_HEIGHT / 2;

    setCenter(targetX, targetY, {
      zoom: 1.1,
      duration: 1000,
    });
    setCurrentSlide(index);
  }, [setCenter]);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      moveToSlide(currentSlide + 1);
    }
  }, [currentSlide, moveToSlide]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      moveToSlide(currentSlide - 1);
    }
  }, [currentSlide, moveToSlide]);

  const handleFitAll = useCallback(() => {
    fitView({ duration: 1200, padding: 0.1 });
  }, [fitView]);

  // Navega??o por teclado (Setas Esquerda/Direita)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleFitAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleFitAll]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#090d16' }}>
      <ReactFlow
        defaultNodes={initialNodes}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag={true}
        zoomOnScroll={true}
        nodesDraggable={false}
      >
        <Background color="#1e293b" gap={24} />
        <SlideControls
          currentSlide={currentSlide}
          totalSlides={slides.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onFitAll={handleFitAll}
        />
      </ReactFlow>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <SlideshowPresentation />
    </ReactFlowProvider>
  );
}
```
