---
title: Reinforcement Fine-Tuning (RFT) e DPO
description: Ajuste fino por reforço com Reinforcement Fine-Tuning (RFT) e Otimização Direta de Preferência (DPO) para raciocínio especialista e alinhamento de decisões.
topics:
  - reinforcement-fine-tuning
  - rft
  - dpo
  - direct-preference-optimization
  - reasoning-fine-tuning
keywords:
  - RFT
  - DPO
  - Direct Preference Optimization
  - reward_model
  - reasoning-models
related:
  - ../fine_tuning_e_evals/fine_tuning_sft.md
  - ../modelos/modelos_de_raciocinio.md
  - ../fine_tuning_e_evals/evals_e_graders.md
source_scope:
  - https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning.md
  - https://developers.openai.com/api/docs/guides/rft-use-cases.md
  - https://developers.openai.com/api/docs/guides/direct-preference-optimization.md
---

# Reinforcement Fine-Tuning (RFT) e Direct Preference Optimization (DPO)

Enquanto o SFT ensina ao modelo a imitar respostas de exemplo, o **Reinforcement Fine-Tuning (RFT)** e o **Direct Preference Optimization (DPO)** treinam o modelo a explorar múltiplos caminhos de raciocínio e maximizar funções de recompensa e critérios de qualidade especialistas.

---

## 1. O que é Reinforcement Fine-Tuning (RFT)?

O RFT aplica algoritmos de aprendizado por reforço aos modelos de raciocínio (como `o3-mini`), treinando-os para:
- Resolver problemas de lógica complexa, matemática e análise jurídica/financeira.
- Explorar hipóteses e validar passos antes de emitir a conclusão.
- Auto-corrigir erros em passos intermediários de raciocínio.

### Como Funciona o Ciclo RFT:
1. **Geração de Múltiplas Trajetórias**: O modelo gera várias cadeias de raciocínio concorrentes para uma mesma pergunta.
2. **Avaliação por Graders**: Avaliadores automáticos (*graders*) ou regras programáticas pontuam a correção da resposta final e a solidez da lógica.
3. **Atualização de Políticas**: Os pesos do modelo são atualizados por reforço para favorecer estratégias de raciocínio bem-sucedidas.

---

## 2. Direct Preference Optimization (DPO)

O **DPO** ajusta o modelo comparando diretamente pares de respostas onde uma é preferida em relação à outra (`chosen` vs `rejected`), sem exigir a criação explícita de um modelo de recompensa separado.

### Formato do Dataset DPO (`dpo_dataset.jsonl`)

```json
{
  "messages": [{"role": "user", "content": "Explique o conceito de closure em JavaScript para um iniciante."}],
  "chosen": {"role": "assistant", "content": "Um closure acontece quando uma função interna 'lembra' das variáveis do seu escopo externo, mesmo depois que a função externa já terminou de executar..."},
  "rejected": {"role": "assistant", "content": "Closure é uma estrutura de dados de ponteiros lexicais e alocação de memória no heap do V8."}
}
```

---

## 3. Quando Usar SFT vs RFT vs DPO

| Técnica | Casos de Uso Recomendados | Requisitos |
|---|---|---|
| **Supervised Fine-Tuning (SFT)** | Formatação de saída, tom de voz, jargão corporativo, extração estrita | 50 a 5.000 pares de exemplos de entrada e saída |
| **DPO** | Escolha entre estilos alternativos, redução de prolixidade, alinhamento de decisões subjetivas | Pares comparativos `(chosen, rejected)` |
| **Reinforcement Fine-Tuning (RFT)** | Verificação formal de código, provas matemáticas, otimização de consultas SQL, raciocínio em múltiplos passos | Perguntas com respostas verificáveis programaticamente (graders) |

---

## 4. Referências Cruzadas

- [`../fine_tuning_e_evals/fine_tuning_sft.md`](../fine_tuning_e_evals/fine_tuning_sft.md)
- [`../fine_tuning_e_evals/evals_e_graders.md`](../fine_tuning_e_evals/evals_e_graders.md)
- [`../modelos/modelos_de_raciocinio.md`](../modelos/modelos_de_raciocinio.md)
