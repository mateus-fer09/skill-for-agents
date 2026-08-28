# Sources Manifest — Boas Práticas de Arquitetura de Software

Data da pesquisa: **2026-08-26**

## Classificação usada

- **A** — fonte normativa, primária ou oficial do mantenedor/criador.
- **B** — referência técnica altamente reconhecida.
- **C** — engenharia industrial / prática de produção de alta qualidade.
- **D** — fonte secundária usada apenas como apoio.

> A classificação indica utilidade para esta Skill; não declara autoridade absoluta fora do contexto.

| Fonte | Organização/Autor | URL | Classe | Utilizada para | Arquivos principais |
|---|---|---|---|---|---|
| ISO/IEC/IEEE 42010:2022 — Architecture description | ISO/IEC/IEEE | https://www.iso.org/standard/74393.html | A | arquitetura vs descrição, views/viewpoints, documentação | `fundamentos/papel_da_arquitetura.md`, `evolucao/documentacao_adrs_c4.md` |
| ATAM: Method for Architecture Evaluation | SEI / Kazman, Klein, Clements | https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/ | B | trade-offs, riscos, quality attributes | `fundamentos/atributos_de_qualidade.md`, `fundamentos/drivers_e_asrs.md` |
| Quality Attributes | SEI | https://www.sei.cmu.edu/library/quality-attributes/ | B | atributos de qualidade | `fundamentos/atributos_de_qualidade.md` |
| Modifiability Tactics | SEI / Bachmann, Bass, Nord | https://www.sei.cmu.edu/library/modifiability-tactics/ | B | modularidade, acoplamento, modificabilidade | `fundamentos/modularidade_acoplamento_coesao.md` |
| Architecture Styles | Microsoft Azure Architecture Center | https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/ | C | estilos, restrições, trade-offs | `estilos/*` |
| Design Principles for Azure Applications | Microsoft | https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/ | C | evolução, failure analysis, negócios | `fundamentos/principios_e_heuristicas.md`, `qualidade/*` |
| Build for Business Needs | Microsoft | https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/build-for-business | C | drivers, RTO/RPO | `fundamentos/drivers_e_asrs.md` |
| Cloud Design Patterns | Microsoft | https://learn.microsoft.com/en-us/azure/architecture/patterns/ | C | retry, circuit breaker, bulkhead, saga, CQRS etc. | `qualidade/confiabilidade_e_resiliencia.md`, `decisoes/*` |
| Bulkhead Pattern | Microsoft | https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead | C | isolamento e blast radius | `qualidade/confiabilidade_e_resiliencia.md` |
| Retry Pattern | Microsoft | https://learn.microsoft.com/en-us/azure/architecture/patterns/retry | C | retries e riscos | `qualidade/confiabilidade_e_resiliencia.md` |
| AWS Well-Architected Framework | AWS | https://docs.aws.amazon.com/wellarchitected/latest/framework/wellarchitected-framework.html | C | pilares, mudanças pequenas/reversíveis, operação | `fundamentos/principios_e_heuristicas.md`, `qualidade/*` |
| Timeouts, retries and backoff with jitter | AWS Builders' Library | https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/ | C | resiliência de chamadas remotas | `qualidade/confiabilidade_e_resiliencia.md`, `decisoes/comunicacao_sync_async.md` |
| Service Level Objectives | Google SRE | https://sre.google/sre-book/service-level-objectives/ | B/C | SLI, SLO, error budgets | `fundamentos/drivers_e_asrs.md`, `qualidade/confiabilidade_e_resiliencia.md` |
| Monitoring Distributed Systems | Google SRE | https://sre.google/sre-book/monitoring-distributed-systems/ | B/C | golden signals e monitoramento | `qualidade/observabilidade_e_operabilidade.md` |
| Implementing SLOs | Google SRE Workbook | https://sre.google/workbook/implementing-slos/ | B/C | prática de SLO | `qualidade/confiabilidade_e_resiliencia.md` |
| NIST SP 800-218 SSDF v1.1 | NIST | https://csrc.nist.gov/pubs/sp/800/218/final | A | secure SDLC e supply chain | `qualidade/seguranca_e_privacidade.md` |
| OWASP Secure by Design Framework | OWASP | https://owasp.org/www-project-secure-by-design-framework/ | B | segurança no design e arquitetura | `qualidade/seguranca_e_privacidade.md` |
| The Twelve-Factor App | Twelve-Factor community / original Heroku methodology | https://12factor.net/ | B | stateless, config, build-release-run, dev/prod | `decisoes/estado_cache_e_particionamento.md`, `qualidade/testabilidade.md` |
| C4 Model — official site | Simon Brown | https://c4model.com/ | A/B | documentação e diagramas | `evolucao/documentacao_adrs_c4.md` |
| C4 Diagrams | Simon Brown | https://c4model.com/diagrams | A/B | context/container/component/code | `evolucao/documentacao_adrs_c4.md` |
| C4 Review Checklist | Simon Brown | https://c4model.com/diagrams/checklist | A/B | qualidade de diagramas | `evolucao/documentacao_adrs_c4.md` |
| Architectural Decision Records | adr.github.io | https://adr.github.io/ | B | ADR, decision log, ASR | `evolucao/documentacao_adrs_c4.md` |
| Microservice Prerequisites | Martin Fowler | https://martinfowler.com/bliki/MicroservicePrerequisites.html | B | pré-requisitos e custo operacional | `estilos/microsservicos.md` |
| Patterns of Distributed Systems | Martin Fowler / Unmesh Joshi | https://martinfowler.com/articles/patterns-of-distributed-systems/ | B | patterns distribuídos, idempotência | `decisoes/comunicacao_sync_async.md` |
| Idempotent Receiver | Martin Fowler / Unmesh Joshi | https://martinfowler.com/articles/patterns-of-distributed-systems/idempotent-receiver.html | B | retries e deduplicação | `decisoes/comunicacao_sync_async.md`, `decisoes/contratos_e_apis.md` |

## Fontes descartadas ou não usadas como autoridade

- blogs SEO genéricos e artigos sem autoria clara: descartados;
- fóruns e respostas isoladas: não usados como base normativa;
- conteúdo de fornecedores foi usado principalmente para práticas operacionais/cloud e não como prova de que determinada arquitetura é universal;
- a ISO 42010 foi usada apenas para conceitos publicamente disponíveis sobre descrição arquitetural; a Skill não reproduz o texto integral da norma.

## Política de rastreabilidade

Os arquivos temáticos indicam suas fontes principais no corpo ou em metadados. Este manifesto centraliza a proveniência para permitir verificação posterior sem inserir bibliografia repetitiva em cada parágrafo.
