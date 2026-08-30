---
title: Infraestrutura e Gerenciamento de Contexto de Ferramentas
description: Gerenciamento de contexto em agentes de alta complexidade, chamadas programáticas de ferramentas, combinação de ferramentas e caching com Tool Use.
topics:
  - tool-context
  - programmatic-calling
  - tool-caching
  - combinations
keywords:
  - tool context
  - tool caching
  - programmatic tool
  - fine-grained streaming
related:
  - ferramentas_e_agentes/tool_use_visao_geral.md
  - mensagens_e_prompting/prompt_caching.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/manage-tool-context
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/tool-combinations
  - https://platform.claude.com/docs/pt-BR/agents-and-tools/tool-use/tool-use-with-prompt-caching
---

# Infraestrutura e Gerenciamento de Contexto de Ferramentas

À medida que agentes se tornam mais complexos e executam dezenas de ferramentas consecutivas, o gerenciamento de contexto, a economia de tokens e a latência de execução tornam-se fatores críticos.

---

## 1. Prompt Caching Aplicado a Ferramentas

Definições de ferramentas (`tools`) consomem tokens em cada requisição. Ao marcar o último item da lista de ferramentas com `cache_control: {"type": "ephemeral"}`, todo o catálogo de ferramentas fica retido em cache com **90% de desconto** nas chamadas subsequentes:

```json
{
  "tools": [
    {
      "name": "pesquisar_banco_vetorial",
      "description": "...",
      "input_schema": { ... }
    },
    {
      "name": "executar_query_sql",
      "description": "...",
      "input_schema": { ... },
      "cache_control": {"type": "ephemeral"}
    }
  ]
}
```

---

## 2. Gerenciamento de Saídas de Ferramentas Volumosas

Ferramentas que retornam grandes volumes de dados (ex: logs brutos de 50.000 linhas ou payloads JSON com milhares de registros) podem poluir o contexto e elevar os custos desnecessariamente.

### Boas Práticas:
1. **Filtragem no Lado do Cliente**: Execute agregações, paginações e projeções de campos antes de retornar o resultado no bloco `tool_result`.
2. **Compactação Pós-Uso**: Após o modelo extrair a conclusão relevante do resultado bruto, edite turnos históricos antigos substituindo o dump volumoso por um resumo sintetizado.
3. **Persistência em Arquivo**: Salve arquivos grandes via **Files API** e entregue apenas o `file_id` para o modelo inspecionar por partes.

---

## 3. Streaming Granular de Chamadas de Ferramentas

Ao utilizar streaming (`stream: true`), os argumentos da ferramenta são emitidos em tempo real no evento `content_block_delta` através de fragmentos `input_json_delta`. Isso permite iniciar a validação de parâmetros e preparação de recursos antes mesmo do encerramento completo do bloco de chamada.

---

## Veja Também

- [`../ferramentas_e_agentes/tool_use_visao_geral.md`](../ferramentas_e_agentes/tool_use_visao_geral.md)
- [`../mensagens_e_prompting/prompt_caching.md`](../mensagens_e_prompting/prompt_caching.md)
