# Index Master — Boas Práticas de Arquitetura de Software

## Visão geral do tema

Esta Skill trata arquitetura de software como disciplina de **decisão sob restrições**. O objetivo é permitir que o agente identifique drivers, modele atributos de qualidade, escolha boundaries e estilos, analise failure modes e trade-offs, documente decisões e valide a arquitetura ao longo do tempo.

## Princípios globais

1. Comece por drivers e ASRs, não por tecnologia ou padrão.
2. Prefira a alternativa mais simples que satisfaça requisitos verificáveis.
3. Modularidade exige boundaries, ownership, encapsulamento e dependências controladas.
4. Distribuição compra autonomia/isolamento pagando com latência, consistência e operação.
5. Toda chamada remota pode falhar; modele timeout, retry e idempotência.
6. Dados possuem ownership e requisitos de consistência explícitos.
7. Segurança, observabilidade e operabilidade fazem parte do design.
8. Arquitetura deve evoluir com feedback, ADRs e fitness functions.
9. Padrões são ferramentas contextuais, não metas.
10. Trade-offs e incertezas devem ser explicitados.

## Roteamento por intenção

| Intenção | Arquivos recomendados |
|---|---|
| Projetar um novo sistema | `fundamentos/drivers_e_asrs.md`, `fundamentos/atributos_de_qualidade.md`, `decisoes/boundaries_e_ownership.md`, `referencia/matriz_de_decisoes.md` |
| Revisar arquitetura existente | `referencia/checklist_revisao_arquitetural.md`, `antipadroes/antipadroes_e_smells.md`, `evolucao/evolucao_e_fitness_functions.md` |
| Escolher monólito ou microsserviços | `estilos/monolito_modular.md`, `estilos/microsservicos.md`, `decisoes/boundaries_e_ownership.md` |
| Projetar integrações | `decisoes/comunicacao_sync_async.md`, `decisoes/contratos_e_apis.md`, `estilos/event_driven.md` |
| Resolver consistência distribuída | `decisoes/dados_consistencia_transacoes.md`, `decisoes/comunicacao_sync_async.md` |
| Melhorar confiabilidade | `qualidade/confiabilidade_e_resiliencia.md`, `qualidade/observabilidade_e_operabilidade.md` |
| Melhorar performance/escala | `qualidade/performance_e_escalabilidade.md`, `decisoes/estado_cache_e_particionamento.md` |
| Projetar segurança | `qualidade/seguranca_e_privacidade.md` |
| Melhorar testabilidade | `qualidade/testabilidade.md`, `decisoes/dependencias_e_inversao.md` |
| Documentar decisões e estrutura | `evolucao/documentacao_adrs_c4.md` |
| Modernizar legado | `evolucao/modernizacao_de_legado.md`, `estilos/monolito_modular.md`, `estilos/microsservicos.md` |

## Mapa de Contexto

### `antipadroes/antipadroes_e_smells.md` — Antipadrões e smells arquiteturais

**Propósito:** Sinais recorrentes de deterioração estrutural, causas, impactos e correções.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `decisoes/boundaries_e_ownership.md` — Boundaries, decomposição e ownership

**Propósito:** Como definir fronteiras estruturais alinhadas a responsabilidades, domínio, mudança e ownership.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `decisoes/comunicacao_sync_async.md` — Comunicação síncrona e assíncrona

**Propósito:** Critérios para escolher chamadas diretas, APIs, filas e eventos e gerenciar seus trade-offs.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `decisoes/contratos_e_apis.md` — Contratos, APIs e evolução

**Propósito:** Como projetar contratos explícitos, compatíveis, idempotentes e evolutivos.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `decisoes/dados_consistencia_transacoes.md` — Dados, consistência e transações

**Propósito:** Ownership de dados, consistência local/distribuída, duplicação e coordenação.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `decisoes/dependencias_e_inversao.md` — Dependências, direção e inversão

**Propósito:** Como controlar dependências estruturais e proteger políticas centrais de detalhes voláteis.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `decisoes/estado_cache_e_particionamento.md` — Estado, cache e particionamento

**Propósito:** Como tratar estado, caching, sessão e particionamento sem ocultar problemas de consistência.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `estilos/camadas_hexagonal_clean.md` — Camadas, Hexagonal e Clean Architecture

**Propósito:** Comparação de estruturas baseadas em separação de responsabilidades e direção de dependências.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `estilos/event_driven.md` — Arquitetura orientada a eventos

**Propósito:** Princípios, padrões, contratos e riscos de sistemas event-driven.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `estilos/microsservicos.md` — Microsserviços

**Propósito:** Critérios, pré-requisitos, benefícios, custos e failure modes do estilo de microsserviços.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `estilos/monolito_modular.md` — Monólito modular

**Propósito:** Como usar um único deploy mantendo boundaries fortes e caminho de evolução.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `evolucao/documentacao_adrs_c4.md` — Documentação arquitetural, ADRs e C4

**Propósito:** Como documentar estrutura, decisões e views de maneira útil e sustentável.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `evolucao/evolucao_e_fitness_functions.md` — Evolução arquitetural e fitness functions

**Propósito:** Como preservar propriedades arquiteturais ao longo do tempo por meio de feedback e validações contínuas.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `evolucao/modernizacao_de_legado.md` — Modernização de legado

**Propósito:** Estratégias incrementais para reduzir risco em migrações, substituições e decomposição de sistemas existentes.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `fundamentos/atributos_de_qualidade.md` — Atributos de qualidade e trade-offs

**Propósito:** Como modelar e negociar propriedades sistêmicas que direcionam decisões arquiteturais.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `fundamentos/drivers_e_asrs.md` — Drivers arquiteturais e ASRs

**Propósito:** Como descobrir, priorizar e tornar verificáveis requisitos arquiteturalmente significativos.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `fundamentos/modularidade_acoplamento_coesao.md` — Modularidade, acoplamento e coesão

**Propósito:** Princípios para decompor sistemas e manter mudanças localizadas.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `fundamentos/papel_da_arquitetura.md` — Papel da arquitetura de software

**Propósito:** O que é arquitetura de software, quais decisões são arquiteturalmente significativas e como relacioná-las a contexto e valor.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `fundamentos/principios_e_heuristicas.md` — Princípios e heurísticas arquiteturais

**Propósito:** Princípios práticos, com limites, para orientar decisões sem criar dogmas.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `qualidade/confiabilidade_e_resiliencia.md` — Confiabilidade e resiliência

**Propósito:** Failure modes, redundância, timeouts, retries, circuit breakers, bulkheads e recuperação.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `qualidade/observabilidade_e_operabilidade.md` — Observabilidade e operabilidade

**Propósito:** Como tornar sistemas compreensíveis, diagnosticáveis e operáveis em produção.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `qualidade/performance_e_escalabilidade.md` — Performance e escalabilidade

**Propósito:** Método para projetar, medir e evoluir capacidade sem otimização prematura.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `qualidade/seguranca_e_privacidade.md` — Segurança e privacidade por design

**Propósito:** Princípios arquiteturais para reduzir superfície de ataque e incorporar controles desde o design.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `qualidade/testabilidade.md` — Testabilidade e estratégia de validação

**Propósito:** Como a arquitetura influencia testes, contratos, ambientes e confiança de mudança.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `referencia/checklist_revisao_arquitetural.md` — Checklist de revisão arquitetural

**Propósito:** Checklist operacional para revisar uma arquitetura ou proposta.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `referencia/glossario.md` — Glossário de arquitetura de software

**Propósito:** Definições curtas de termos usados pela Skill.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

### `referencia/matriz_de_decisoes.md` — Matriz de decisões arquiteturais

**Propósito:** Atalhos de investigação para decisões recorrentes, sem transformar heurísticas em regras.

**Consulte SE** a solicitação envolver diretamente os conceitos descritos neste arquivo ou se uma decisão relacionada exigir critérios, trade-offs, riscos ou exemplos específicos. Combine-o com `fundamentos/drivers_e_asrs.md` quando a pergunta envolver escolha arquitetural.

## Regras de combinação de contexto

- Para decisões, combine **drivers + domínio específico + qualidade afetada + matriz/checklist**.
- Para sistemas distribuídos, quase sempre combine comunicação, dados/consistência, confiabilidade e observabilidade.
- Para mudanças arquiteturais, combine o estilo atual/proposto com modernização e fitness functions.
- Para recomendações de tecnologia, primeiro estabeleça o requisito arquitetural; a Skill deliberadamente não amarra boas práticas a um vendor específico.

## Proveniência

Consulte `sources_manifest.md` para fontes, autoridade e rastreabilidade. Consulte `coverage_report.md` para a auditoria de cobertura e limitações.
