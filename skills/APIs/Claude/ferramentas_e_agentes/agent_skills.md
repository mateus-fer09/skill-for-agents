---
title: Claude Agent Skills
description: Arquitetura oficial de Skills para agentes da Claude Platform, criação de pacotes de habilidades modulares, uso via API e padrões corporativos.
topics:
  - agent-skills
  - skills-api
  - enterprise-skills
  - modular-knowledge
keywords:
  - Agent Skills
  - SKILL.md
  - skills API
  - modular skills
related:
  - ferramentas_e_agentes/tool_use_visao_geral.md
  - managed_agents/visao_geral_e_arquitetura.md
  - referencia_api/endpoints_skills.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/agent-skills/overview
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/agent-skills/quickstart
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/agent-skills/best-practices
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/agent-skills/enterprise
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/agent-skills/claude-api-skill
---

# Claude Agent Skills

As **Agent Skills** são unidades modulares de conhecimento, instruções operacionais, ferramentas e receitas de execução que capacitam agentes de IA a executar tarefas especializadas com máxima consistência e autonomia.

---

## Anatomia de uma Agent Skill

Uma Skill padronizada é estruturada em uma pasta contendo:

```
minha_skill/
├── SKILL.md                 # Manifesto obrigatório: identidade, regras e fluxo de navegação
├── index_master.md          # Roteador mestre: mapa de contexto e intenções do usuário
├── sources_manifest.md      # Registro formal de proveniência das fontes
├── coverage_report.md       # Relatório de auditoria de cobertura
└── modulos_tematicos/       # Arquivos Markdown granulares com metadados e referências cruzadas
```

---

## 1. O Arquivo `SKILL.md`

O `SKILL.md` atua como o ponto de entrada primário que qualquer agente lê ao carregar a Skill:

```markdown
---
name: minha-skill-especializada
description: Guia de instruções e referências para execução de tarefas técnicas especializadas.
---

# Identidade e Propósito da Skill
...

# Instruções de Navegação para o Agente
1. Identifique a intenção do usuário.
2. Consulte o `index_master.md` para localizar o arquivo exato.
3. Leia o módulo específico e siga estritamente os exemplos oficiais.
```

---

## 2. Gerenciamento de Skills via API (`/v1/skills`)

A Claude Platform disponibiliza endpoints para registrar, atualizar e versionar Skills dinamicamente no nível da organização ou Workspace:

### Criar uma Skill via API:

```bash
curl https://api.anthropic.com/v1/skills \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "anthropic-beta: skills-2025-01-01" \
     -H "content-type: application/json" \
     -d '{
       "name": "analise-tributaria",
       "description": "Skill para interpretação de regras tributárias e cálculos de impostos.",
       "files": [
         {"path": "SKILL.md", "content": "..."},
         {"path": "regras/icms.md", "content": "..."}
       ]
     }'
```

---

## 3. Melhores Práticas para Construção de Skills

1. **Evite Arquivos Monolíticos**: Divida o conhecimento em arquivos temáticos granulares para otimizar o consumo de tokens e a precisão do RAG.
2. **Preserve Códigos e Schemas Oficiais**: Mantenha exemplos completos com tipagem e imports sem simplificá-los para pseudocódigo.
3. **Mantenha Referências Cruzadas**: Crie links relativos (`[...](../modulo/arquivo.md)`) formando um grafo de conhecimento navegável.
4. **Metadados Frontmatter Ricos**: Inclua `title`, `description`, `topics`, `keywords` e `related` em todos os arquivos para recuperação semântica precisa.

---

## Veja Também

- [`../ferramentas_e_agentes/mcp_model_context_protocol.md`](../ferramentas_e_agentes/mcp_model_context_protocol.md)
- [`../managed_agents/visao_geral_e_arquitetura.md`](../managed_agents/visao_geral_e_arquitetura.md)
- [`../referencia_api/endpoints_skills.md`](../referencia_api/endpoints_skills.md)
