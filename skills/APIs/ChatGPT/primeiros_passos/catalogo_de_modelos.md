---
title: "Catálogo Completo de Modelos da OpenAI"
description: "Guia exaustivo de todos os modelos disponíveis na OpenAI API: Família GPT-4o, GPT-4o-mini, Modelos de Raciocínio o1, o3-mini, o1-mini, GPT-4 Turbo, DALL-E 3, Whisper-1, TTS-1/HD e Embeddings, com limites de contexto, suporte multimodal e casos de uso recomendados."
topics: ["modelos", "gpt-4o", "gpt-4o-mini", "o1", "o3-mini", "dall-e-3", "whisper", "tts", "embeddings", "pricing", "context-window"]
keywords: ["gpt-4o", "gpt-4o-mini", "o1", "o3-mini", "o1-mini", "text-embedding-3-large", "whisper-1", "tts-1", "dall-e-3", "context window"]
source_scope: "OpenAI API Docs: Models > Overview, Continuous Model Upgrades, Model Pricing & Capabilities Matrix"
---

# Catálogo Completo de Modelos da OpenAI

A OpenAI disponibiliza um portfólio abrangente de modelos de inteligência artificial otimizados para diferentes compromissos entre latência, custo, capacidade de raciocínio lógico e modalidades sensoriais (texto, código, visão, áudio e imagem).

---

## 1. Matriz Geral dos Principais Modelos

| Modelo | Tipo Principal | Janela de Contexto | Máx Tokens Saída | Modalidades de Entrada | Modalidades de Saída | Caso de Uso Ideal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`gpt-4o`** | Flagship Multimodal | 128.000 tokens | 16.384 tokens | Texto, Imagem, Áudio | Texto | Tarefas complexas, análise visual avançada, agentes multimodais |
| **`gpt-4o-mini`** | Rápido & Econômico | 128.000 tokens | 16.384 tokens | Texto, Imagem | Texto | Chatbots de alto volume, triagem, automações cotidianas |
| **`o1`** | Raciocínio Profundo | 200.000 tokens | 100.000 tokens | Texto, Imagem | Texto | Matemática, ciência, refatoração de código complexo, raciocínio lógico |
| **`o3-mini`** | Raciocínio Eficiente | 200.000 tokens | 100.000 tokens | Texto | Texto | Engenharia de software, raciocínio veloz, pipelines de CI/CD |
| **`o1-mini`** | Raciocínio Compacto | 128.000 tokens | 65.536 tokens | Texto | Texto | Tarefas de código e matemática com restrição de custo |
| **`gpt-4o-realtime-preview`** | Voz em Tempo Real | 128.000 tokens | 4.096 tokens | Texto, Áudio (PCM16) | Texto, Áudio (PCM16) | Conversação por voz bidirecional de baixíssima latência |
| **`dall-e-3`** | Geração de Imagens | N/A | 1 imagem / req | Texto (Prompt) | Imagem (URL / Base64) | Ilustrações de alta resolução e design visual |
| **`whisper-1`** | Transcrição de Fala | Arquivos até 25MB | N/A | Áudio (mp3, wav, etc.) | Texto / JSON / SRT / VTT | Speech-to-Text multilíngue e tradução para inglês |
| **`tts-1` / `tts-1-hd`** | Síntese de Fala | 4.096 caracteres | N/A | Texto | Áudio (mp3, opus, aac, etc.) | Text-to-Speech com vozes naturais e baixa latência |
| **`text-embedding-3-large`** | Embeddings Semânticos | 8.191 tokens | 3.072 dimensões | Texto | Vetor float[] | Busca vetorial (RAG) de alta precisão e clustering |
| **`text-embedding-3-small`** | Embeddings Econômicos | 8.191 tokens | 1.536 dimensões | Texto | Vetor float[] | Busca semântica de alta velocidade e baixo custo |

---

## 2. Modelos Flagship: Família GPT-4o

### 2.1. `gpt-4o` (Omni)
- **Descrição:** O modelo carro-chefe de ponta da OpenAI, treinado nativamente de forma ponta a ponta sobre texto, visão e áudio.
- **Pontos Fortes:**
  - Desempenho superior em benchmarks de raciocínio, tradução e código.
  - Análise visual detalhada (OCR, compreensão de gráficos complexos, diagramas de arquitetura).
  - Suporte completo a Structured Outputs (`strict: true`) e chamadas de ferramentas paralelas (*Parallel Tool Calling*).
- **Aliases e Snapshots:** `gpt-4o`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-2024-05-13`.

### 2.2. `gpt-4o-mini`
- **Descrição:** Modelo altamente eficiente e com custo ultrabaixo (~60% mais barato que o GPT-3.5 Turbo), mantendo inteligência comparável aos modelos topo de linha.
- **Pontos Fortes:**
  - Latência extremamente reduzida, ideal para streaming em interfaces web e mobile.
  - Suporte a visão computacional e JSON Schema rigoroso.
  - Excelente candidato para tarefas em lote via Batch API e Fine-Tuning supervisionado.
- **Snapshots:** `gpt-4o-mini`, `gpt-4o-mini-2024-07-18`.

---

## 3. Modelos de Raciocínio: Série `o1` e `o3-mini`

Os modelos de raciocínio utilizam *Chain-of-Thought* (CoT) reforçado durante o processo de inferência antes de emitirem a resposta final.

### 3.1. Diferenças Críticas na Utilização
1. **Tokens de Raciocínio (*Reasoning Tokens*):**
   - O modelo gera tokens de pensamento interno (invisíveis na resposta final) que são faturados normalmente e contam contra a janela de contexto.
   - O parâmetro `max_completion_tokens` DEVE acomodar tanto os tokens de raciocínio quanto a resposta final visível.
2. **Controle de Esforço de Raciocínio (`reasoning_effort`):**
   - Suporta os valores `"low"`, `"medium"` e `"high"`.
   - Um esforço `"low"` reduz a latência e o consumo de tokens; `"high"` aprofunda a análise para provas matemáticas e depuração complexa.
3. **Parâmetros Incompatíveis:**
   - Modelos de raciocínio NÃO aceitam `temperature`, `top_p`, `presence_penalty` ou `frequency_penalty` (devem ser omitidos ou mantidos nos padrões).

### 3.2. Exemplo de Invocação do `o3-mini` em Python

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="o3-mini",
    messages=[
        {
            "role": "developer",
            "content": "Você é um especialista em verificação formal de algoritmos distribuídos."
        },
        {
            "role": "user",
            "content": "Prove a correção do algoritmo de exclusão mútua de Ricart-Agrawala e aponte cenários de falha por deadlock."
        }
    ],
    reasoning_effort="high", # 'low', 'medium' ou 'high'
    max_completion_tokens=25000,
)

print("Resposta:", response.choices[0].message.content)
print("Tokens de raciocínio utilizados:", response.usage.completion_tokens_details.reasoning_tokens)
```

---

## 4. Modelos Especializados (Áudio, Imagem e Embeddings)

### 4.1. Áudio e Voz
- **`whisper-1`:** Modelo de transcrição de áudio altamente robusto a ruídos e sotaques, suportando mais de 98 idiomas e tradução automática para o inglês.
- **`tts-1` / `tts-1-hd`:** Modelos de síntese de voz natural com 6 vozes padrão (`alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`). O `tts-1` prioriza latência em tempo real; o `tts-1-hd` prioriza clareza e fidelidade acústica.

### 4.2. Geração Visual
- **`dall-e-3`:** Geração de imagens fotorrealistas, estilizadas e vetoriais com controle estrito de prompt, formato widescreen (`1792x1024`), vertical (`1024x1792`) ou quadrado (`1024x1024`).

### 4.3. Embeddings Semânticos
- **`text-embedding-3-large`:** Vetores de 3.072 dimensões com suporte a truncamento dimensional flexível (*Matryoshka Representation Learning*) sem recálculo de embeddings.
- **`text-embedding-3-small`:** Vetores de 1.536 dimensões, balanceando alta precisão com custo 5x menor.

---

## 5. Como Listar Modelos Dinamicamente via API

```python
from openai import OpenAI

client = OpenAI()

# Listar todos os modelos ativos na sua conta
model_list = client.models.list()

# Filtrar modelos GPT e de Raciocínio
gpt_models = [m.id for m in model_list.data if "gpt" in m.id or "o1" in m.id or "o3" in m.id]
gpt_models.sort()

print("Modelos disponíveis:", gpt_models)
```
