# Skill — Boas Práticas de Arquitetura de Software

## Identidade

- **Nome:** Boas Práticas de Arquitetura de Software
- **Tema:** design e evolução de arquiteturas de software modernas
- **Objetivo:** apoiar agentes na análise, projeto, revisão e evolução de sistemas por meio de drivers, atributos de qualidade, boundaries, padrões, trade-offs, failure modes e evidência.
- **Escopo:** aplicações web/backend, SaaS, sistemas distribuídos, monólitos modulares, microsserviços, integrações, dados, confiabilidade, performance, segurança, observabilidade, testabilidade, documentação e modernização.
- **Público-alvo:** agentes que auxiliam desenvolvedores, tech leads e arquitetos.
- **Nível:** fundamentos a avançado/especialista.

## Quando utilizar esta Skill

Acione esta Skill quando o usuário pedir para:

- projetar ou revisar arquitetura de software;
- escolher estilo arquitetural;
- decidir entre monólito, monólito modular e microsserviços;
- definir boundaries, módulos, serviços e ownership;
- estruturar dependências, layers, ports/adapters ou Clean Architecture;
- projetar APIs, eventos, filas e integração;
- resolver consistência, transações e ownership de dados;
- melhorar confiabilidade, performance, escalabilidade ou observabilidade;
- incorporar segurança por design;
- melhorar testabilidade e capacidade de mudança;
- modernizar legado;
- criar ADRs, C4 e documentação arquitetural;
- diagnosticar antipadrões e dívida arquitetural.

## Como navegar

1. Abra `index_master.md`.
2. Identifique a intenção e os drivers.
3. Consulte `fundamentos/drivers_e_asrs.md` se houver qualquer decisão relevante.
4. Abra os arquivos especializados recomendados no mapa.
5. Cruze qualidade + estrutura + operação quando a decisão for sistêmica.
6. Use `referencia/matriz_de_decisoes.md` como roteador, nunca como tabela de respostas absolutas.
7. Use `referencia/checklist_revisao_arquitetural.md` para auditorias.
8. Consulte `sources_manifest.md` quando precisar verificar origem ou autoridade.

## Regras fundamentais para o agente

- Não transforme heurísticas em regras universais.
- Não recomende um estilo antes de identificar drivers e restrições.
- Não use escala hipotética como justificativa suficiente para complexidade.
- Explicite benefícios, custos, riscos e alternativas de decisões importantes.
- Diferencie boundary lógico de processo/deployment.
- Não confunda comunicação assíncrona com ausência de acoplamento.
- Não confunda redundância com confiabilidade sem modelo de falha e recovery testado.
- Não recomende retries sem timeout, limites e idempotência.
- Não trate consistência eventual como detalhe invisível ao produto.
- Não exponha tecnologia como substituto para arquitetura.
- Em segurança, identifique ativos, trust boundaries e ameaças.
- Em performance, exija cenário de carga e métricas.
- Em observabilidade, priorize SLIs/SLOs e impacto ao usuário.
- Registre incerteza quando faltarem dados.
- Se a decisão for cara de reverter, peça ou proponha evidência proporcional: benchmark, spike, protótipo, teste de carga ou ADR.

## Fluxo recomendado

1. **Identifique a intenção.** Projeto novo, revisão, incidente, evolução ou decisão específica?
2. **Extraia contexto.** Equipe, carga, domínio, criticidade, compliance, orçamento, prazo.
3. **Identifique ASRs.** Transforme adjetivos em cenários mensuráveis.
4. **Localize boundaries.** Responsabilidades, dados, ownership, unidades de mudança.
5. **Liste opções.** Comece pela alternativa mais simples plausível.
6. **Analise trade-offs.** Qualidade, custo, operação e reversibilidade.
7. **Modele failure modes.** Especialmente em dependências remotas e dados distribuídos.
8. **Valide.** Testes, benchmarks, protótipos, SLOs ou fitness functions.
9. **Documente.** ADR para decisões significativas; views/diagramas quando agregarem comunicação.
10. **Planeje evolução.** Gatilhos de revisão, métricas e estratégia incremental.

## Regra de resposta

Ao recomendar arquitetura, prefira a estrutura:

**Contexto → drivers → opções → decisão sugerida → trade-offs → riscos → sinais para reavaliar → validação.**

Evite respostas do tipo “use microsserviços”, “use Clean Architecture” ou “use eventos” sem explicar por que o contexto paga pelo custo.
