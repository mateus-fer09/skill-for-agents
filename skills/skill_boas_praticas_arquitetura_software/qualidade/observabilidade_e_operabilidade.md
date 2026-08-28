---
title: Observabilidade e operabilidade
description: Como tornar sistemas compreensíveis, diagnosticáveis e operáveis em produção.
topics:
  - observability
  - operability
  - logs
  - metrics
  - traces
  - SLO
keywords:
  - logs
  - metrics
  - traces
  - SLI
  - SLO
  - alerting
  - incident response
  - correlation
related:
  - confiabilidade_e_resiliencia.md
  - performance_e_escalabilidade.md
  - ../evolucao/evolucao_e_fitness_functions.md
source_categories:
  - engenharia industrial
  - referência técnica
---

# Observabilidade e operabilidade

## Operação faz parte do design

Um sistema que funciona em testes mas não pode ser diagnosticado em produção possui deficiência arquitetural. Operabilidade inclui deploy, rollback, monitoramento, configuração, incident response e manutenção.

## Três sinais de telemetria

- **logs:** registros de eventos discretos;
- **metrics:** séries quantitativas agregadas;
- **traces:** caminho e latência de operações distribuídas.

Use correlation IDs/context propagation para conectar sinais.

## Instrumente o que importa ao usuário

SLIs devem refletir comportamentos relevantes: sucesso, latência, frescor, completude. Métricas de CPU são úteis para diagnóstico, mas não substituem indicador de serviço.

## Quatro golden signals

Google SRE destaca:

- latency;
- traffic;
- errors;
- saturation.

Eles são ponto de partida, não catálogo completo.

## Alertas acionáveis

Um alerta deve corresponder a ação humana necessária. Alertar cada exceção cria fadiga. SLO/error-budget burn rate pode ser mecanismo mais alinhado a impacto.

## Logs estruturados

Inclua campos consistentes, timestamp, severidade, correlation, identidade não sensível e contexto suficiente. Evite strings impossíveis de consultar e dados secretos.

## Tracing distribuído

É especialmente útil em cadeias de serviços e filas. Propague contexto através de fronteiras síncronas e assíncronas quando viável.

## Runbooks

Para falhas recorrentes, documente:

- sintomas;
- dashboards;
- diagnósticos;
- mitigação;
- rollback/fallback;
- escalonamento;
- pós-incidente.

## Configuração

Configuração deve ser validada, versionada quando apropriado e observável. Mudanças de configuração são mudanças de produção e precisam de segurança semelhante a código.

## Deploy e rollback

Arquitetura operacional madura favorece pequenas mudanças, canary/gradual rollout quando risco justificar, feature flags, compatibilidade e rollback. Rollback de código não necessariamente desfaz migração de dados: planeje separadamente.

## Antipadrões

- logging sem estrutura;
- dashboards sem objetivo;
- alertas em tudo;
- tracing sem sampling/custo controlado;
- telemetria contendo PII/secrets;
- health endpoint sempre 200;
- deploy manual não reproduzível.

## Regra operacional

Se uma failure mode importa, deve existir maneira proporcional de **detectar, diagnosticar, mitigar e aprender** com ela.
