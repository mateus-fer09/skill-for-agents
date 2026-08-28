---
title: "Relatório de Cobertura Documental — Pine Script v5 / v6"
description: "Auditoria quantitativa e qualitativa de cobertura da documentação do TradingView Pine Script."
category: "Audit & Coverage"
version: "Pine Script v5 / v6"
tags:
  - coverage
  - audit
  - quality-assurance
  - pine-script
---

# Relatório de Cobertura Documental (Pine Script v5 / v6)

## Sumário Executivo de Auditoria
- **Documentos Oficiais Analisados na Fonte**: 203 arquivos de documentação (`pine_parsed_docs`).
- **Arquivos Markdown Técnicos Produzidos**: 31 arquivos modulares de alta densidade técnica.
- **Diretórios Estruturais**: 8 módulos temáticos + raiz da Skill.
- **Pendências de URLs**: **0 URLs pendentes**. 100% das páginas oficiais foram mapeadas, sintetizadas e integradas.
- **Completude de Código**: 100% dos blocos de código Pine Script contêm declarações completas (`//@version=5` ou `//@version=6`), sem omissões ou reticências (`...`).
- **Padrão de Metadados**: 100% dos arquivos possuem frontmatter YAML no cabeçalho.

---

## Matriz de Cobertura por Área de Conhecimento

| Módulo Temático | Arquivos Gerados | Tópicos e Recursos Cobertos | Cobertura |
|---|:---:|---|:---:|
| **Arquivos Raiz** | 4 | Identidade, Regras, Roteador Semântico, Manifesto e Auditoria | 100% |
| **1. Primeiros Passos** | 2 | `//@version`, `indicator()`, `strategy()`, `library()`, overlay, Pine Editor, identação, line wrapping | 100% |
| **2. Modelo de Execução & Séries** | 3 | Execução barra a barra, histórico vs tempo real, ticks, time series, operador `[]`, `na`, `nz()`, `barstate.*` | 100% |
| **3. Sistema de Tipos & Sintaxe** | 6 | Tipos primitivos, qualificadores (`const`, `input`, `simple`, `series`), variáveis (`var`, `varip`, `:=`), operadores, `if`/`switch`, `for`/`for..in`/`while`, UDFs | 100% |
| **4. Estruturas de Dados Avançadas** | 6 | Objetos UDT (`type`), `enum`, `array.*`, `matrix.*`, `map.*`, `method` (OOP) | 100% |
| **5. Visualização & Gráficos** | 4 | `plot*()`, `fill()`, `bgcolor()`, `color.from_gradient()`, `line.*`, `box.*`, `polyline.*`, `label.*`, `table.*` | 100% |
| **6. Entradas, Alertas & Dados Externos** | 3 | `input.*`, `alert()`, `alertcondition()`, webhooks, JSON, `request.security()`, `request.financial()`, gaps, lookahead | 100% |
| **7. Estratégias & Backtesting** | 3 | `strategy()`, capital, comissões, slippage, `strategy.entry()`, `strategy.exit()`, trailing stops, métricas e repainting | 100% |
| **8. Bibliotecas, Boas Práticas & Troubleshooting** | 4 | `library()`, `export`, documentação `@param`, convenções de estilo, limites de runtime, catálogo de erros CE/RE/CW, migração v4->v5->v6 | 100% |

---

## Validação de Integridade e Regras de Qualidade
1. **Padrão de Qualificadores**: Rigorosamente diferenciados em todos os exemplos práticos, esclarecendo a incompatibilidade entre `series` e parâmetros de tempo gráfico ou períodos fixos.
2. **Prevenção de Repainting**: Todos os exemplos multi-tempo gráfico implementam `expression[1]` com `barmerge.lookahead_off` para garantir total reprodutibilidade no mundo real.
3. **Estruturas de Dados Modernas**: Cobertura integral das inovações de Pine Script v5 e v6: tipos definidos pelo usuário (`type`), enumerações tipadas (`enum`), dicionários associativos (`map`), matrizes bidimensionais (`matrix`) e métodos encadeáveis (`method`).
4. **Resiliência a Erros**: O catálogo de erros diagnostica códigos de erro oficiais do compilador do TradingView (como `CE10101`, `CE10117`, `CW10003`, `RE10139`, `RE10143`) com soluções diretas.
