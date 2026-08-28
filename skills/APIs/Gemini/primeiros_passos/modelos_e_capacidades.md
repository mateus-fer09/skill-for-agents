---
title: Catálogo de Modelos Gemini e Capacidades
description: Guia completo sobre o portfólio de modelos da Google Gemini API (Gemini 2.5 Flash, Gemini 2.0 Flash, Gemini 2.0 Flash Thinking, Gemini 1.5 Pro, Gemini 1.5 Flash), especificações de contexto, quotas e matriz de decisão.
---

# Catálogo de Modelos Gemini e Capacidades

## 1. Visão Geral do Portfólio

A família de modelos Gemini foi concebida nativamente para processamento multimodal, raciocínio de longo contexto e alto throughput.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        PORTFÓLIO GEMINI MODELS                         │
├───────────────────────┬───────────────────────┬────────────────────────┤
│     GEMINI 2.5        │      GEMINI 2.0       │       GEMINI 1.5       │
│  - 2.5 Pro (SOTA)     │  - 2.0 Flash (Fast)   │  - 1.5 Pro (2M Tokens) │
│  - 2.5 Flash (Speed)  │  - 2.0 Flash Thinking │  - 1.5 Flash (Low-cost)│
└───────────────────────┴───────────────────────┴────────────────────────┘
```

---

## 2. Matriz Comparativa de Especificações

| Modelo ID | Janela de Entrada (*Context Window*) | Limite de Saída (*Max Output*) | Modalidades Suportadas | Suporte a Thinking / CoT | Caso de Uso Primário |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **`gemini-2.5-pro`** | 1.048.576 tokens (~1M) | 8.192 tokens | Texto, Imagem, Áudio, Vídeo, PDF | Sim (Avançado) | Tarefas ultra-complexas, raciocínio avançado, código complexo e arquitetura. |
| **`gemini-2.5-flash`** | 1.048.576 tokens (~1M) | 8.192 tokens | Texto, Imagem, Áudio, Vídeo, PDF | Sim | Melhor equilíbrio custo-benefício, velocidade e raciocínio de última geração. |
| **`gemini-2.0-flash`** | 1.048.576 tokens (~1M) | 8.192 tokens | Texto, Imagem, Áudio, Vídeo, PDF | Não | Alta velocidade, Live API, agentes de tempo real e chamadas de ferramentas em escala. |
| **`gemini-2.0-flash-thinking-exp`**| 1.048.576 tokens (~1M) | 65.536 tokens | Texto, Imagem, Áudio, Vídeo, PDF | Sim (Nativo) | Raciocínio matemático, algoritmos complexos, diagnósticos e lógica profunda com tokens de pensamento visíveis. |
| **`gemini-1.5-pro`** | 2.097.152 tokens (~2M) | 8.192 tokens | Texto, Imagem, Áudio, Vídeo, PDF | Não | Raciocínio profundo sobre bases massivas de código (codebases inteiras), livros e horas de vídeo. |
| **`gemini-1.5-flash`** | 1.048.576 tokens (~1M) | 8.192 tokens | Texto, Imagem, Áudio, Vídeo, PDF | Não | Tarefas de alto volume com custo mínimo, sumarização rápida e classificação. |
| **`text-embedding-004`** | 2.048 tokens | 768 dimensões | Texto | N/A | Busca semântica, RAG, agrupamento e classificação vetorial. |
| **`imagen-3.0-generate-002`**| N/A (Prompt de Texto) | 1-4 Imagens | Texto ➔ Imagem | N/A | Geração e renderização fotorrealista de imagens. |

---

## 3. Detalhamento dos Modelos de Destaque

### 3.1. Gemini 2.0 Flash (`gemini-2.0-flash`)
- **Velocidade de Primeira Resposta (TTFT):** Ultra-baixa latência (<250ms em prompts médios).
- **Capacidades Nativas:** Suporta chamada de funções paralela, Live API bidirecional (WebSockets), Code Execution e Grounding com Google Search.
- **Janela de Contexto:** 1.048.576 tokens de entrada (equivalente a ~700.000 palavras, 1 hora de vídeo ou 11 horas de áudio).

### 3.2. Gemini 2.0 Flash Thinking (`gemini-2.0-flash-thinking-exp-01-21`)
- O modelo expõe seus passos intermediários de reflexão através de `thought_tokens`.
- Ideal para validação de hipóteses, deduções lógicas, análise de código e resolução de problemas matemáticos.

```python
# Exemplo de chamada com Flash Thinking
from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.0-flash-thinking-exp-01-21",
    contents="Quantos 'r' existem na palavra 'strawberry'? Mostre o raciocínio detalhado."
)

print("Resposta:", response.text)
```

### 3.3. Gemini 1.5 Pro (`gemini-1.5-pro`)
- Líder em compreensão de longo contexto com até **2.097.152 tokens**.
- Capaz de analisar repositórios inteiros de código (50.000+ linhas de código) em um único prompt sem fragmentação RAG.

---

## 4. Guia de Decisão de Modelos

```text
Qual é a sua prioridade principal?
  │
  ├─► Latência mínima e custo ultra-baixo?
  │     └─► Use: gemini-2.0-flash ou gemini-1.5-flash
  │
  ├─► Raciocínio analítico profundo, matemática ou validação algorítmica?
  │     └─► Use: gemini-2.0-flash-thinking-exp ou gemini-2.5-pro
  │
  ├─► Contexto gigantesco (>1 milhão de tokens) e análise exaustiva de documentos/vídeos?
  │     └─► Use: gemini-1.5-pro (até 2M tokens)
  │
  ├─► Chat em tempo real por voz/vídeo full-duplex?
  │     └─► Use: gemini-2.0-flash via Live API
  │
  └─► Vetorização para RAG e Similaridade Semântica?
        └─► Use: text-embedding-004
```

---

## 5. Listagem Programática de Modelos Disponíveis

### Python (`google-genai`)
```python
from google import genai

client = genai.Client()

# Listar todos os modelos disponíveis para a sua API Key
for model in client.models.list():
    print(f"Model ID: {model.name} | Display Name: {model.display_name}")
```

### TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function listAllModels() {
  const models = await ai.models.list();
  for await (const m of models) {
    console.log(`Model ID: ${m.name} | Display: ${m.displayName}`);
  }
}

listAllModels().catch(console.error);
```
