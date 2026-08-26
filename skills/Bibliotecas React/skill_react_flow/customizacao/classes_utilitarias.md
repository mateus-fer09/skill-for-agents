---
title: "Classes Utilitárias do React Flow (nodrag, nopan, nowheel)"
description: "Guia detalhado de uso e prevenção de conflitos de eventos DOM com as classes utilitárias embutidas: nodrag, nopan e nowheel no React Flow."
topics: ["classes-utilitarias", "nodrag", "nopan", "nowheel", "event-bubbling", "dom-events"]
keywords: ["nodrag", "nopan", "nowheel", "drag class", "event propagation", "interactive nodes", "noDragClassName"]
source_scope: "React Flow Docs: Learn > Customization > Utility Classes"
---

# Classes Utilitárias do React Flow: `nodrag`, `nopan`, `nowheel`

Em uma aplicação de grafos interativa, o canvas captura continuamente eventos de clique, arraste do mouse e rolagem do scroll. 

Quando você adiciona controles normais de formulário HTML (como inputs de texto, seletores de cor, sliders ou caixas de código roláveis) dentro de um nó ou label de aresta, esses eventos podem conflitar com o arraste do nó ou com a navegação da câmera.

Para resolver isso de forma elegante, o React Flow fornece **três classes utilitárias fundamentais**.

---

## 1. Tabela Comparativa de Classes Utilitárias

| Classe CSS | O que ela Desabilita? | Onde deve ser Aplicada? |
| :--- | :--- | :--- |
| **`nodrag`** | Desabilita o **arraste do nó** ao clicar/arrastar sobre o elemento. | `<input>`, `<textarea>`, `<select>`, `<button>`, sliders (`<input type="range">`), caixas de seleção. |
| **`nopan`** | Desabilita o **arraste da viewport (câmera)** ao interagir com o elemento. | Sliders horizontais/verticais, color pickers, canvas de desenho interno, `EdgeLabelRenderer`. |
| **`nowheel`** | Desabilita o **zoom da viewport** ao rolar o scroll do mouse sobre o elemento. | Containers com scroll interno (overflow auto/scroll), editores Monaco/CodeMirror, listas longas dentro do nó. |

---

## 2. Aprofundamento: A Classe `nodrag`

Por padrão, clicar em qualquer ponto dentro de um nó inicia o arraste do nó pelo canvas. 

Se você tiver um `<input type="text" />` sem a classe `nodrag`:
- O usuário não conseguirá selecionar texto dentro do input com o mouse, pois o clique arrastará o nó inteiro.
- Botões podem não registrar o evento `onClick` confiavelmente se o usuário mover 1 pixel durante o clique.

```tsx
// ✅ Adicione sempre nodrag em inputs e botões internos
<input
  className="nodrag"
  type="text"
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

---

## 3. Aprofundamento: A Classe `nopan`

Se você tiver um slider `<input type="range">` ou um mapa de cores interativo:
- Sem `nopan`, ao arrastar a barra do slider para o lado, o React Flow interpretará que o usuário está querendo arrastar a tela inteira (pan).
- Com `nopan`, apenas o valor do slider é alterado e a câmera permanece imóvel.

```tsx
// ✅ Combine nodrag e nopan em sliders
<input
  className="nodrag nopan w-full"
  type="range"
  min="0"
  max="100"
  value={volume}
  onChange={(e) => setVolume(Number(e.target.value))}
/>
```

---

## 4. Aprofundamento: A Classe `nowheel`

Se você tiver uma lista de 50 itens com `overflow-y: scroll` dentro de um nó:
- Sem `nowheel`, quando o usuário colocar o cursor sobre a lista e girar a roda do mouse para descer a lista, o React Flow dará zoom-out em todo o grafo em vez de rolar o conteúdo interno.
- Com `nowheel`, a rolagem da lista funciona perfeitamente sem afetar o zoom da tela.

```tsx
// ✅ Adicione nowheel em containers com scroll interno
<div className="nowheel h-32 overflow-y-auto border p-2">
  {logs.map((log, i) => (
    <div key={i}>{log}</div>
  ))}
</div>
```

---

## 5. Exemplo Prático Completo: `RichWidgetNode.tsx`

```tsx
import React, { useState, memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

function RichWidgetNode({ data }: NodeProps) {
  const [text, setText] = useState('');
  const [range, setRange] = useState(50);
  const [logs, setLogs] = useState([
    'Iniciando sistema...',
    'Conectando ao banco de dados...',
    'Autenticação efetuada com sucesso.',
    'Aguardando eventos do webhook...',
    'Processando lote de mensagens #104...',
    'Lote finalizado sem erros.',
  ]);

  return (
    <div className="w-80 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-4 shadow-xl text-zinc-800 dark:text-zinc-200">
      <Handle type="target" position={Position.Top} />

      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2">
        Painel de Controle Rico
      </h3>

      {/* 1. Input de Texto com 'nodrag' */}
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-zinc-500 mb-1">
          Nome do Fluxo (com seleção de texto livre):
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite aqui..."
          className="nodrag w-full px-2.5 py-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* 2. Slider com 'nodrag' e 'nopan' */}
      <div className="mb-3">
        <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
          <span>Sensibilidade:</span>
          <span className="font-bold text-indigo-600">{range}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="nodrag nopan w-full accent-indigo-600 cursor-pointer"
        />
      </div>

      {/* 3. Lista Rolável com 'nowheel' e 'nodrag' */}
      <div>
        <label className="block text-[11px] font-medium text-zinc-500 mb-1">
          Terminal de Logs (Rolagem livre de zoom):
        </label>
        <div className="nowheel nodrag h-24 overflow-y-auto bg-zinc-950 text-emerald-400 font-mono text-[10px] p-2 rounded border border-zinc-800 space-y-1">
          {logs.map((item, idx) => (
            <div key={idx}>&gt; {item}</div>
          ))}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(RichWidgetNode);
```
