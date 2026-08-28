---
title: Drivers arquiteturais e ASRs
description: Como descobrir, priorizar e tornar verificáveis requisitos arquiteturalmente significativos.
topics:
  - business drivers
  - ASR
  - requisitos não funcionais
  - restrições
  - cenários de qualidade
keywords:
  - architecturally significant requirement
  - quality scenario
  - RTO
  - RPO
  - SLO
  - constraint
related:
  - papel_da_arquitetura.md
  - atributos_de_qualidade.md
  - ../referencia/checklist_revisao_arquitetural.md
source_categories:
  - referência técnica
  - engenharia industrial
---

# Drivers arquiteturais e ASRs

## Por que começar por drivers

Arquiteturas falham frequentemente não por falta de padrões, mas por otimizar a propriedade errada. O trabalho inicial é descobrir quais requisitos realmente alteram a forma do sistema.

Um **Architecturally Significant Requirement (ASR)** é um requisito funcional ou não funcional que produz efeito mensurável sobre a arquitetura. Um requisito como “o usuário pode editar o perfil” pode não alterar a estrutura global. Já “o checkout deve permanecer disponível durante falhas de um provedor externo” provavelmente exige decisões de timeout, isolamento, fallback, persistência e operação.

## Categorias de drivers

### Negócio

- time-to-market;
- custo máximo operacional;
- expansão geográfica;
- estratégia de produto;
- necessidade de integração com parceiros;
- tolerância a indisponibilidade;
- exigências contratuais.

### Qualidade

- disponibilidade;
- latência;
- throughput;
- segurança;
- modificabilidade;
- testabilidade;
- auditabilidade;
- escalabilidade;
- interoperabilidade;
- observabilidade.

### Restrições

- tecnologia obrigatória;
- legislação e compliance;
- residência de dados;
- plataforma existente;
- equipe e competências;
- orçamento;
- prazo;
- compatibilidade legada.

## Transforme adjetivos em cenários

“Alta performance”, “seguro” ou “escalável” são vagos. Um cenário de qualidade útil deve identificar, quando aplicável:

- fonte do estímulo;
- estímulo;
- ambiente;
- artefato afetado;
- resposta esperada;
- medida da resposta.

### Exemplo elaborado para esta Skill

Em horário de pico, 10 mil clientes simultâneos enviam solicitações de consulta ao catálogo; 99% das respostas devem ser concluídas em até 300 ms, medidos na borda pública do serviço, sem ultrapassar a capacidade contratada do banco principal.

Agora há material para discutir cache, índices, particionamento, escalabilidade horizontal, filas ou degradação. “O sistema deve ser rápido” não fornece isso.

## Priorize explicitamente

Atributos competem. Maior consistência pode custar disponibilidade ou latência; maior isolamento pode aumentar custo; maior flexibilidade pode aumentar abstração. Registre prioridade e motivo.

Uma técnica simples:

| Driver | Prioridade | Métrica/critério | Consequência arquitetural provável |
|---|---|---|---|
| Disponibilidade do checkout | Alta | SLO 99,95% | isolamento, timeouts, fallback, redundância |
| Time-to-market | Alta | ciclo semanal | baixo overhead operacional, automação |
| Portabilidade multi-cloud | Baixa | sem requisito contratual | evitar abstração prematura |

## Não projete para máximos imaginários

Pergunte:

- Qual é a carga atual?
- Qual crescimento é plausível?
- Qual pico já foi observado?
- Qual custo de não suportar o pico?
- Qual antecedência existe para escalar?

Projetar para ordens de magnitude sem evidência pode gerar sharding, filas, caches e sistemas distribuídos prematuros.

## RTO, RPO e SLO

- **RTO (Recovery Time Objective):** tempo-alvo para restaurar a capacidade após interrupção.
- **RPO (Recovery Point Objective):** quantidade aceitável de perda de dados expressa como tempo.
- **SLO (Service Level Objective):** nível-alvo de serviço medido por indicadores relevantes ao usuário.

Esses números devem influenciar arquitetura. Um RPO próximo de zero exige mecanismos diferentes de um RPO de 24 horas. Um SLO de 99,9% não deve ser tratado como sinônimo de 100%.

## Perguntas diagnósticas

1. Qual falha mais prejudica o negócio?
2. Quais mudanças serão mais frequentes?
3. Quais dependências externas não controlamos?
4. Quais dados são críticos e quem deve possuí-los?
5. Quais limites de latência são percebidos por usuários?
6. Qual indisponibilidade é aceitável?
7. O sistema precisa escalar uniformemente ou apenas partes específicas?
8. Há requisitos de isolamento por tenant?
9. Há exigência de auditoria ou rastreabilidade?
10. Quais decisões serão caras de reverter?

## Antipadrões

- escolher arquitetura antes de conhecer drivers;
- copiar arquitetura de empresas em escala incomparável;
- tratar todos os atributos como “alta prioridade”;
- usar termos qualitativos sem métricas;
- ignorar competências e capacidade operacional da equipe;
- projetar apenas happy path;
- não registrar restrições.

## Resultado esperado

Antes de escolher um estilo arquitetural, produza uma lista curta e priorizada de ASRs e restrições. A arquitetura deve conseguir explicar como cada decisão relevante responde a pelo menos um desses drivers.

## Fontes principais

- SEI — quality attributes, cenários e ATAM.
- Microsoft Azure Architecture Center — build for business needs.
- Google SRE — SLIs/SLOs/error budgets.
