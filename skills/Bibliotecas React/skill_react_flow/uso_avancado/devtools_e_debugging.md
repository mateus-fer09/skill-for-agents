---
title: "DevTools e Debugging no React Flow"
description: "Guia pr?tico para cria??o de pain?is DevTools de inspe??o no React Flow v12 (@xyflow/react), incluindo NodeInspector, ChangeLogger, ViewportLogger e ferramentas de depura??o de handles e conex?es."
topics:
  - "Painel DevTools Modular"
  - "NodeInspector (Inspe??o de N?s, Handles e Dimens?es)"
  - "ChangeLogger (Log em Tempo Real de NodeChange e EdgeChange)"
  - "ViewportLogger (Coordenadas e Matriz de Transforma??o)"
  - "Depura??o Visual de Handles com CSS"
keywords:
  - "devtools"
  - "debugging"
  - "NodeInspector"
  - "ChangeLogger"
  - "ViewportLogger"
  - "inspect handles"
  - "@xyflow/react"
source_scope: "Learn / Advanced Use / Devtools and Debugging"
---

# DevTools e Debugging no React Flow

Depurar diagramas interativos pode ser complexo devido a transforma??es de coordenadas, estados de sele??o, bounds de handles e muta??es ass?ncronas.

O React Flow permite construir um painel de **DevTools** completo que se integra nativamente ao fluxo, exibindo informa??es cruciais para desenvolvedores em tempo de desenvolvimento.

---

## 1. Estrutura do Painel DevTools

Um painel de DevTools avan?ado ? composto por:
1. **`NodeInspector`**: Mostra as dimens?es reais medidas no DOM (`measured.width`, `measured.height`), posi??es absolutas e coordenadas dos handles dos n?s selecionados.
2. **`ChangeLogger`**: Exibe um feed em tempo real de todos os eventos disparados por `onNodesChange` e `onEdgesChange`.
3. **`ViewportLogger`**: Exibe `{ x, y, zoom }` e a matriz de transforma??o do canvas.

---

## 2. Implementa??o Completa dos Componentes DevTools

### `NodeInspector.tsx`

```tsx
import React from 'react';
import { useStore, ReactFlowState, Panel } from '@xyflow/react';

export function NodeInspector() {
  const selectedNodes = useStore((s: ReactFlowState) =>
    s.nodes.filter((node) => node.selected)
  );

  if (selectedNodes.length === 0) {
    return null;
  }

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.95)',
      color: '#f8fafc',
      padding: 12,
      borderRadius: 6,
      fontSize: 11,
      fontFamily: 'monospace',
      maxWidth: 320,
      marginTop: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <div style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: 6 }}>
        NODE INSPECTOR ({selectedNodes.length} selecionado(s))
      </div>
      {selectedNodes.map((node) => (
        <div key={node.id} style={{ borderBottom: '1px solid #334155', paddingBottom: 6, marginBottom: 6 }}>
          <p><strong>ID:</strong> {node.id} ({node.type || 'default'})</p>
          <p><strong>Posi??o:</strong> x: {Math.round(node.position.x)}, y: {Math.round(node.position.y)}</p>
          <p><strong>Dimens?es:</strong> {node.measured?.width ?? '?'}px x {node.measured?.height ?? '?'}px</p>
          <p><strong>Dados:</strong> {JSON.stringify(node.data)}</p>
        </div>
      ))}
    </div>
  );
}
```

### `ChangeLogger.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { useStore, ReactFlowState } from '@xyflow/react';

export function ChangeLogger({ limit = 6 }: { limit?: number }) {
  const [log, setLog] = useState<string[]>([]);
  const nodes = useStore((s: ReactFlowState) => s.nodes);

  useEffect(() => {
    setLog((prev) => [
      `[${new Date().toLocaleTimeString()}] N?s atualizados: ${nodes.length} n?s ativos`,
      ...prev.slice(0, limit - 1),
    ]);
  }, [nodes, limit]);

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.95)',
      color: '#a7f3d0',
      padding: 10,
      borderRadius: 6,
      fontSize: 10,
      fontFamily: 'monospace',
      marginTop: 8,
      maxWidth: 320
    }}>
      <div style={{ color: '#34d399', fontWeight: 'bold', marginBottom: 4 }}>CHANGE LOGGER</div>
      {log.map((item, idx) => (
        <div key={idx}>{item}</div>
      ))}
    </div>
  );
}
```

### `ViewportLogger.tsx`

```tsx
import React from 'react';
import { useViewport } from '@xyflow/react';

export function ViewportLogger() {
  const { x, y, zoom } = useViewport();

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.95)',
      color: '#fde047',
      padding: '6px 10px',
      borderRadius: 6,
      fontSize: 11,
      fontFamily: 'monospace'
    }}>
      VIEWPORT: x: {x.toFixed(1)} | y: {y.toFixed(1)} | zoom: {zoom.toFixed(2)}x
    </div>
  );
}
```

### `Devtools.tsx` (Componente Container)

```tsx
import React, { useState } from 'react';
import { Panel } from '@xyflow/react';
import { NodeInspector } from './NodeInspector';
import { ChangeLogger } from './ChangeLogger';
import { ViewportLogger } from './ViewportLogger';

export function DevTools() {
  const [showInspector, setShowInspector] = useState(true);
  const [showLogger, setShowLogger] = useState(true);

  return (
    <Panel position="bottom-right" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => setShowInspector((v) => !v)}
          style={{ fontSize: 10, padding: '4px 8px', background: showInspector ? '#2563eb' : '#64748b', color: '#fff', border: 'none', borderRadius: 4 }}
        >
          {showInspector ? 'Ocultar Inspector' : 'Mostrar Inspector'}
        </button>
        <button
          onClick={() => setShowLogger((v) => !v)}
          style={{ fontSize: 10, padding: '4px 8px', background: showLogger ? '#059669' : '#64748b', color: '#fff', border: 'none', borderRadius: 4 }}
        >
          {showLogger ? 'Ocultar Logger' : 'Mostrar Logger'}
        </button>
      </div>

      <ViewportLogger />
      {showInspector && <NodeInspector />}
      {showLogger && <ChangeLogger />}
    </Panel>
  );
}
```

---

## 3. Depura??o Visual de Handles com CSS

Para visualizar o raio de conex?o dos handles e identificar problemas de alinhamento, adicione esta regra CSS em seu ambiente de desenvolvimento:

```css
/* Ativa contornos visuais em handles no modo de depura??o */
.debug-mode .react-flow__handle {
  outline: 2px dashed rgba(239, 68, 68, 0.8) !important;
  outline-offset: 4px;
}

.debug-mode .react-flow__handle-connecting {
  background: #22c55e !important;
  transform: scale(1.4);
}
```
