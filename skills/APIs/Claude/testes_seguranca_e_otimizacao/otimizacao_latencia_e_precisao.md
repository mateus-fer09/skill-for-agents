---
title: Otimização de Latência, Consistência e Redução de Alucinações
description: Melhores práticas para acelerar o Time-to-First-Token (TTFT), assegurar saídas estruturadas confiáveis e minimizar alucinações.
topics:
  - latencia
  - precisao
  - reducao-alucinacoes
  - consistencia
keywords:
  - reduce latency
  - reduce hallucinations
  - output consistency
  - TTFT
related:
  - fundamentos/escolha_de_modelos_e_migracao.md
  - mensagens_e_prompting/prompt_caching.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/test-and-evaluate/strengthen-guardrails/reduce-latency
  - https://platform.claude.com/docs/pt-BR/test-and-evaluate/strengthen-guardrails/reduce-hallucinations
  - https://platform.claude.com/docs/pt-BR/test-and-evaluate/strengthen-guardrails/increase-consistency
---

# Otimização de Latência, Consistência e Redução de Alucinações

---

## 1. Otimização de Latência (Redução de TTFT e TPS)

1. **Habilite Streaming (`stream: true`)**: Permite que o frontend renderize palavras à medida que são geradas, proporcionando percepção de resposta instantânea para o usuário.
2. **Utilize Prompt Caching**: Reduz em até 85% o tempo de processamento inicial de documentos longos.
3. **Selecione o Modelo Apropriado**: Utilize `claude-3-5-haiku` para respostas de sub-segundo em tarefas conversacionais de baixa complexidade.
4. **Limite `max_tokens`**: Defina um `max_tokens` realista para evitar gerações excessivamente prolixas.

---

## 2. Redução de Alucinações

1. **Forneça Fontes Canônicas com Citação Obrigatória**: Instrua o Claude a responder apenas com base nos documentos fornecidos e a citar textualmente o trecho utilizado.
2. **Dê Permissão Explícita para Dizer 'Não Sei'**: Inclua a regra: *"Se a resposta não puder ser determinada exclusivamente a partir dos fatos fornecidos, declare: 'Informação não disponível nos documentos analisados.'"*
3. **Cadeia de Raciocínio (Chain-of-Thought / Extended Thinking)**: Exigir que o modelo pense passo a passo reduz drasticamente erros de dedução lógica e matemática.

---

## Veja Também

- [`../testes_seguranca_e_otimizacao/guardrails_e_seguranca.md`](../testes_seguranca_e_otimizacao/guardrails_e_seguranca.md)
- [`../testes_seguranca_e_otimizacao/avaliacoes_e_evals.md`](../testes_seguranca_e_otimizacao/avaliacoes_e_evals.md)
