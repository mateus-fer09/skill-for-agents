# Coverage Report — Boas Práticas de Arquitetura de Software

Data da auditoria: **2026-08-26**

## Escopo

Boas práticas de arquitetura de software para sistemas modernos, com foco em tomada de decisão, modularidade, estilos, sistemas distribuídos, qualidade operacional, segurança, evolução e documentação.

## Áreas principais e cobertura

| Domínio | Cobertura | Arquivos |
|---|---|---|
| Papel da arquitetura e decisões significativas | Completa | `fundamentos/papel_da_arquitetura.md` |
| Drivers, ASRs, RTO/RPO/SLO | Completa | `fundamentos/drivers_e_asrs.md` |
| Atributos de qualidade e trade-offs | Completa | `fundamentos/atributos_de_qualidade.md` |
| Modularidade, acoplamento, coesão | Completa | `fundamentos/modularidade_acoplamento_coesao.md` |
| Princípios e heurísticas | Completa | `fundamentos/principios_e_heuristicas.md` |
| Boundaries e ownership | Completa | `decisoes/boundaries_e_ownership.md` |
| Dependências e inversão | Completa | `decisoes/dependencias_e_inversao.md` |
| Comunicação sync/async | Completa | `decisoes/comunicacao_sync_async.md` |
| Dados, consistência e transações | Completa | `decisoes/dados_consistencia_transacoes.md` |
| Estado, cache, particionamento | Satisfatória | `decisoes/estado_cache_e_particionamento.md` |
| Contratos e APIs | Completa | `decisoes/contratos_e_apis.md` |
| Monólito modular | Completa | `estilos/monolito_modular.md` |
| Camadas / Hexagonal / Clean | Completa | `estilos/camadas_hexagonal_clean.md` |
| Microsserviços | Completa | `estilos/microsservicos.md` |
| Event-driven | Completa | `estilos/event_driven.md` |
| Confiabilidade e resiliência | Completa | `qualidade/confiabilidade_e_resiliencia.md` |
| Performance e escalabilidade | Completa | `qualidade/performance_e_escalabilidade.md` |
| Segurança e privacidade | Satisfatória | `qualidade/seguranca_e_privacidade.md` |
| Observabilidade e operabilidade | Completa | `qualidade/observabilidade_e_operabilidade.md` |
| Testabilidade | Completa | `qualidade/testabilidade.md` |
| Evolução e fitness functions | Completa | `evolucao/evolucao_e_fitness_functions.md` |
| Modernização de legado | Completa | `evolucao/modernizacao_de_legado.md` |
| Documentação, ADRs e C4 | Completa | `evolucao/documentacao_adrs_c4.md` |
| Antipadrões arquiteturais | Completa | `antipadroes/antipadroes_e_smells.md` |
| Matriz de decisão / checklist / glossário | Completa | `referencia/*` |

## Fontes

- Fontes encontradas e utilizadas: ISO, SEI/CMU, Microsoft Azure Architecture Center, AWS Well-Architected/Builders' Library, Google SRE, NIST, OWASP, Twelve-Factor, C4 Model, ADR community e Martin Fowler.
- Fontes secundárias frágeis: não utilizadas como autoridade principal.
- Fontes inacessíveis: nenhuma fonte crítica necessária permaneceu inacessível; materiais normativos pagos foram usados somente no nível publicamente descrito.

## Gap Analysis

### Fundamentos

Cobertos: definição operacional, drivers, quality attributes, modularidade, dependências, princípios.

### Aplicação

Cobertos por matrizes, checklists, exemplos e critérios de decisão. A Skill não tenta fornecer receitas vendor-specific.

### Decisões

Cobertas decisões de decomposição, comunicação, dados, estado, contratos e estilos principais.

### Trade-offs

Presentes transversalmente. Nenhum estilo é apresentado como universalmente superior.

### Antipadrões

Incluídos distributed monolith, shared database, chatty services, retry storm, overengineering, premature abstraction, golden hammer e outros.

### Edge cases

Cobertos principalmente em sistemas distribuídos: duplicatas, ordering, retries, backlog, consistência eventual, falhas parciais, cache stampede e migração.

### Profundidade

Inclui fundamentos, aplicação e tópicos avançados. A granularidade foi mantida em arquivos temáticos para RAG.

### Navegação

`index_master.md` roteia todos os arquivos; cross-links e metadados permitem retrieval.

### Evidência

Práticas críticas têm suporte em fontes normativas, técnicas ou de engenharia industrial listadas em `sources_manifest.md`.

## Lacunas declaradas

1. Arquitetura de sistemas safety-critical em domínios como aviação, medicina e automotivo não foi aprofundada; exige normas específicas do setor.
2. Arquitetura de sistemas de ML/LLM, data platforms e HPC não foi tratada como subdomínio próprio.
3. FinOps e sustentabilidade aparecem apenas como trade-offs gerais, não como disciplinas completas.
4. Segurança cobre arquitetura de aplicação em nível amplo; não substitui uma Skill dedicada de AppSec, cloud security ou compliance.
5. DDD aparece como ferramenta para boundaries, mas não é ensinado integralmente.

## Saturação temática

Após as rodadas de pesquisa, novas fontes de alta qualidade passaram predominantemente a reforçar conceitos já mapeados — drivers, quality attributes, trade-offs, failure isolation, evolução e operabilidade — sem revelar subdomínios essenciais ausentes dentro do escopo adotado.

## Validação final

- Subdomínios críticos conhecidos sem cobertura dentro do escopo adotado: **0**.
- Arquivos obrigatórios presentes: **sim**.
- `index_master.md` cobre a estrutura: **sim**.
- Rastreabilidade de fontes: **sim**.
- Trade-offs e antipadrões: **sim**.
- Estrutura adequada para retrieval/RAG: **sim**.
- Limitações declaradas: **sim**.
