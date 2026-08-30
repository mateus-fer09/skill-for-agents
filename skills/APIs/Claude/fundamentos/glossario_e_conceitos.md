---
title: Glossário e Conceitos Centrais
description: Definições formais, terminologia técnica e conceitos operacionais fundamentais da Claude Platform e da Messages API.
topics:
  - glossario
  - terminologia
  - conceitos-chave
keywords:
  - tokens
  - context window
  - stop reason
  - prompt caching
  - tool use
  - thinking tokens
related:
  - fundamentos/visao_geral.md
  - mensagens_e_prompting/messages_api.md
source_scope:
  - https://platform.claude.com/docs/pt-BR/about-claude/glossary
---

# Glossário e Conceitos Centrais

Este documento reúne a terminologia técnica oficial utilizada em toda a documentação da Claude Platform e da Messages API da Anthropic.

---

### **Token**
A menor unidade textual processada pelos modelos Claude. Em geral, 1 token corresponde a aproximadamente 4 caracteres em inglês, ou cerca de 0,75 palavras. Em código ou línguas latinas (como português), a relação pode variar.

### **Janela de Contexto (Context Window)**
A quantidade total máxima de tokens (somando instruções do sistema, histórico da conversa, documentos anexados, chamadas de ferramentas e a própria resposta gerada) que o modelo consegue reter e processar em uma única chamada. Na Claude Platform, a janela padrão é de **200.000 tokens**.

### **Prompt Caching**
Mecanismo de infraestrutura da Anthropic que armazena na memória do servidor o prefixo computado de uma requisição por até 5 minutos. Chamadas subsequentes que compartilham o mesmo prefixo utilizam o cache, garantindo **90% de desconto** no custo dos tokens e redução de até **85% na latência**.

### **Thinking Tokens (Reasoning)**
Tokens gerados internamente pelo modelo em modo de raciocínio estendido (*Extended Thinking*). Esses tokens não são entregues diretamente no texto final ao usuário, mas são faturados como tokens de saída e podem ser inspecionados para auditoria da linha de raciocínio.

### **Stop Reason**
Motivo formal pelo qual o modelo encerrou a geração do turno. Retornado no payload JSON da resposta:
- `end_turn`: O modelo concluiu naturalmente sua resposta para o usuário.
- `max_tokens`: O modelo atingiu o limite estipulado no parâmetro `max_tokens`.
- `stop_sequence`: O modelo encontrou uma das sequências de parada fornecidas em `stop_sequences`.
- `tool_use`: O modelo decidiu invocar uma ou mais ferramentas e aguarda os resultados correspondentes.

### **Tool Calling / Tool Use**
Capacidade do modelo de inspecionar esquemas de funções fornecidos em formato JSON Schema, decidir quando invocá-las e estruturar argumentos JSON válidos para execução pelo cliente.

### **Managed Agent**
Agente autônomo gerenciado pela Anthropic que opera em sandboxes de nuvem seguras com acesso a ferramentas de sistema operacional (*bash*, *editor de texto*, *navegador*, *mcp*) e orquestração de longo prazo.

### **Model Context Protocol (MCP)**
Protocolo aberto e padronizado criado pela Anthropic para conectar modelos e agentes de IA a fontes de dados locais e remotas, repositórios, bancos de dados e ferramentas externas de forma segura e extensível.

---

## Veja Também

- [`../fundamentos/visao_geral.md`](../fundamentos/visao_geral.md)
- [`../mensagens_e_prompting/messages_api.md`](../mensagens_e_prompting/messages_api.md)
- [`../ferramentas_e_agentes/tool_use_visao_geral.md`](../ferramentas_e_agentes/tool_use_visao_geral.md)
