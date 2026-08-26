---
title: "Tutorial Completo: Integrando React Flow com a Web Audio API (Sintetizador Modular)"
description: "Constru??o passo a passo de um sintetizador modular completo em tempo real combinando React Flow v12, n?s de ?udio (Oscilador, Ganho/Amplificador, Sa?da/Speaker), AudioContext e store Zustand."
topics:
  - "Web Audio API e AudioContext Graph"
  - "Mapeando Conex?es Visuais para ?udio em Tempo Real"
  - "N? de Oscilador (OscillatorNode com Waveforms)"
  - "N? de Ganho / Volume (GainNode)"
  - "N? de Sa?da Master / Alto-falante (AudioDestinationNode)"
  - "Motor de ?udio Reativo (audio.js)"
keywords:
  - "web audio api"
  - "audio synthesizer"
  - "audio graph"
  - "OscillatorNode"
  - "GainNode"
  - "AudioContext"
  - "zustand store"
  - "@xyflow/react"
source_scope: "Tutorials / Web Audio API"
---

# Tutorial Completo: Integrando React Flow com a Web Audio API (Sintetizador Modular)

A **Web Audio API** do navegador ? orientada a grafos direcionados: fontes sonoras (como osciladores) conectam-se a n?s de processamento (como filtros e n?s de ganho), que por sua vez se conectam ao destino de reprodu??o final (`audioContext.destination`).

Esta arquitetura espelha exatamente a estrutura de **n?s e arestas** do React Flow. Neste tutorial completo, voc? construir? um sintetizador modular funcional onde conex?es de arestas no canvas conectam cabos de ?udio em tempo real!

---

## 1. Arquitetura do Sistema

```
[ OscNode (Oscillator) ] ---> [ AmpNode (Gain) ] ---> [ OutNode (Speaker) ]
  (440Hz, sine)                 (Volume: 0.5)           (AudioContext Destination)
```

O projeto divide-se em:
- `src/audio.js`: O motor Web Audio que cria, conecta e desconecta n?s de ?udio f?sicos sob demanda.
- `src/store.js`: Store Zustand que orquestra os n?s do React Flow e sincroniza altera??es com o `audio.js`.
- `src/nodes/Osc.jsx`: N? de oscilador com seletor de tipo de onda e slider de frequ?ncia.
- `src/nodes/Amp.jsx`: N? de amplificador/ganho com slider de volume.
- `src/nodes/Out.jsx`: N? de sa?da final com bot?o Power/Mute.
- `src/App.jsx`: Canvas React Flow conectando os n?s de ?udio.

---

## 2. Implementa??o Completa dos Arquivos

### `src/audio.js`

```javascript
// Motor de ?udio Nativo Web Audio API

let context;
const nodes = new Map();

export function getAudioContext() {
  if (!context) {
    context = new (window.AudioContext || window.webkitAudioContext)();
  }
  return context;
}

export function isAudioRunning() {
  return context && context.state === 'running';
}

export function toggleAudio() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    return ctx.resume();
  } else if (ctx.state === 'running') {
    return ctx.suspend();
  }
  return Promise.resolve();
}

// Cria n? de oscilador
export function createAudioNode(id, type, data) {
  const ctx = getAudioContext();

  switch (type) {
    case 'osc': {
      const node = ctx.createOscillator();
      node.frequency.value = data.frequency || 440;
      node.type = data.type || 'sine';
      node.start();
      nodes.set(id, node);
      break;
    }

    case 'amp': {
      const node = ctx.createGain();
      node.gain.value = data.gain !== undefined ? data.gain : 0.5;
      nodes.set(id, node);
      break;
    }

    case 'out': {
      const node = ctx.destination;
      nodes.set(id, node);
      break;
    }
  }
}

// Atualiza par?metros de n?s em tempo real
export function updateAudioNode(id, data) {
  const node = nodes.get(id);
  if (!node) return;

  if (data.frequency !== undefined && node.frequency) {
    node.frequency.setTargetAtTime(data.frequency, getAudioContext().currentTime, 0.01);
  }

  if (data.type !== undefined && node.type) {
    node.type = data.type;
  }

  if (data.gain !== undefined && node.gain) {
    node.gain.setTargetAtTime(data.gain, getAudioContext().currentTime, 0.01);
  }
}

// Conecta dois n?s de ?udio
export function connectAudioNodes(sourceId, targetId) {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);

  if (source && target) {
    source.connect(target);
  }
}

// Desconecta dois n?s de ?udio
export function disconnectAudioNodes(sourceId, targetId) {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);

  if (source && target) {
    try {
      source.disconnect(target);
    } catch (err) {
      console.warn('Erro ao desconectar n? de ?udio:', err);
    }
  }
}

// Remove n? do mapa de ?udio
export function removeAudioNode(id) {
  const node = nodes.get(id);
  if (node) {
    if (node.stop) {
      node.stop();
    }
    node.disconnect();
    nodes.delete(id);
  }
}
```

### `src/store.js`

```javascript
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import {
  createAudioNode,
  updateAudioNode,
  removeAudioNode,
  connectAudioNodes,
  disconnectAudioNodes,
  toggleAudio
} from './audio';

const initialNodes = [
  {
    id: 'osc-1',
    type: 'osc',
    data: { label: 'Oscilador A', frequency: 220, type: 'sawtooth' },
    position: { x: 50, y: 50 },
  },
  {
    id: 'amp-1',
    type: 'amp',
    data: { label: 'Amplificador', gain: 0.3 },
    position: { x: 300, y: 100 },
  },
  {
    id: 'out-1',
    type: 'out',
    data: { label: 'Sa?da Master', isRunning: false },
    position: { x: 550, y: 100 },
  },
];

const initialEdges = [
  { id: 'e-osc-amp', source: 'osc-1', target: 'amp-1' },
  { id: 'e-amp-out', source: 'amp-1', target: 'out-1' },
];

export const useStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,

  // Inicializa os n?s de ?udio no motor Web Audio
  initAudioEngine: () => {
    initialNodes.forEach((n) => createAudioNode(n.id, n.type, n.data));
    initialEdges.forEach((e) => connectAudioNodes(e.source, e.target));
  },

  onNodesChange: (changes) => {
    changes.forEach((change) => {
      if (change.type === 'remove') {
        removeAudioNode(change.id);
      }
    });

    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    changes.forEach((change) => {
      if (change.type === 'remove') {
        const edge = get().edges.find((e) => e.id === change.id);
        if (edge) {
          disconnectAudioNodes(edge.source, edge.target);
        }
      }
    });

    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    connectAudioNodes(connection.source, connection.target);
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  updateNodeData: (id, data) => {
    updateAudioNode(id, data);
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...data },
          };
        }
        return node;
      }),
    });
  },

  toggleAudioPower: async () => {
    await toggleAudio();
    const isRunning = get().nodes.find(n => n.id === 'out-1')?.data.isRunning;
    get().updateNodeData('out-1', { isRunning: !isRunning });
  },

  addOscillator: () => {
    const id = `osc_${nanoid(4)}`;
    const newNode = {
      id,
      type: 'osc',
      data: { label: `Oscilador (${id})`, frequency: 440, type: 'sine' },
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
    };

    createAudioNode(newNode.id, newNode.type, newNode.data);
    set({ nodes: [...get().nodes, newNode] });
  },
}));
```

### `src/nodes/Osc.jsx`

```jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStore } from '../store';

export function OscNode({ id, data }) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div style={{
      padding: '12px 16px',
      background: '#1e293b',
      border: '2px solid #38bdf8',
      borderRadius: 10,
      color: '#f8fafc',
      fontFamily: 'sans-serif',
      fontSize: 12,
      minWidth: 160,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }}>
      <div style={{ fontWeight: 'bold', color: '#38bdf8', marginBottom: 8 }}>
        {data.label || 'Oscilador'}
      </div>

      <label style={{ display: 'block', marginBottom: 6 }}>
        Tipo de Onda:
        <select
          value={data.type || 'sine'}
          onChange={(e) => updateNodeData(id, { type: e.target.value })}
          className="nodrag"
          style={{ width: '100%', marginTop: 4, background: '#334155', color: '#fff', border: 'none', padding: 4, borderRadius: 4 }}
        >
          <option value="sine">Sen?ide (Sine)</option>
          <option value="square">Quadrada (Square)</option>
          <option value="triangle">Triangular (Triangle)</option>
          <option value="sawtooth">Dente de Serra (Sawtooth)</option>
        </select>
      </label>

      <label style={{ display: 'block' }}>
        Frequ?ncia: <strong>{data.frequency || 440} Hz</strong>
        <input
          type="range"
          min={20}
          max={1200}
          value={data.frequency || 440}
          onChange={(e) => updateNodeData(id, { frequency: Number(e.target.value) })}
          className="nodrag"
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#38bdf8', width: 10, height: 10 }}
      />
    </div>
  );
}
```

### `src/nodes/Amp.jsx`

```jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStore } from '../store';

export function AmpNode({ id, data }) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div style={{
      padding: '12px 16px',
      background: '#1e293b',
      border: '2px solid #a855f7',
      borderRadius: 10,
      color: '#f8fafc',
      fontFamily: 'sans-serif',
      fontSize: 12,
      minWidth: 140,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#a855f7', width: 10, height: 10 }} />

      <div style={{ fontWeight: 'bold', color: '#a855f7', marginBottom: 8 }}>
        {data.label || 'Ganho / Volume'}
      </div>

      <label style={{ display: 'block' }}>
        Volume: <strong>{Math.round((data.gain ?? 0.5) * 100)}%</strong>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={data.gain ?? 0.5}
          onChange={(e) => updateNodeData(id, { gain: Number(e.target.value) })}
          className="nodrag"
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      <Handle type="source" position={Position.Right} style={{ background: '#a855f7', width: 10, height: 10 }} />
    </div>
  );
}
```

### `src/nodes/Out.jsx`

```jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStore } from '../store';

export function OutNode({ id, data }) {
  const toggleAudioPower = useStore((state) => state.toggleAudioPower);

  return (
    <div style={{
      padding: '14px 18px',
      background: '#1e293b',
      border: '2px solid #22c55e',
      borderRadius: 10,
      color: '#f8fafc',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      minWidth: 130,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#22c55e', width: 10, height: 10 }} />

      <div style={{ fontWeight: 'bold', color: '#22c55e', marginBottom: 8 }}>
        ?? SA?DA MASTER
      </div>

      <button
        onClick={toggleAudioPower}
        className="nodrag"
        style={{
          padding: '8px 16px',
          background: data.isRunning ? '#ef4444' : '#22c55e',
          color: '#fff',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}
      >
        {data.isRunning ? 'MUTE / PAUSAR' : 'LIGAR ?UDIO'}
      </button>
    </div>
  );
}
```

### `src/App.jsx`

```jsx
import React, { useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Panel,
  NodeTypes
} from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';
import '@xyflow/react/dist/style.css';

import { useStore } from './store';
import { OscNode } from './nodes/Osc';
import { AmpNode } from './nodes/Amp';
import { OutNode } from './nodes/Out';

const nodeTypes: NodeTypes = {
  osc: OscNode,
  amp: AmpNode,
  out: OutNode,
};

export default function SynthesizerApp() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, initAudioEngine, addOscillator } = useStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      initAudioEngine: state.initAudioEngine,
      addOscillator: state.addOscillator,
    }))
  );

  useEffect(() => {
    initAudioEngine();
  }, [initAudioEngine]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#090d16' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background gap={16} color="#1e293b" />
          <Controls />
          <Panel position="top-right">
            <button
              onClick={addOscillator}
              style={{
                padding: '10px 16px',
                background: '#38bdf8',
                color: '#0f172a',
                border: 'none',
                borderRadius: 6,
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(56, 189, 248, 0.4)'
              }}
            >
              + Adicionar Oscilador
            </button>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
```
