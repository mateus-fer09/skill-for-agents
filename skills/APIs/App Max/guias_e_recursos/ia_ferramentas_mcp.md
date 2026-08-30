---
title: "Referência de Ferramentas do Servidor MCP"
description: "Glossário detalhado das 13 ferramentas oficiais expostas pelo servidor MCP da Appmax com schemas de entrada e saída."
topics:
  - mcp
  - ferramentas-mcp
  - tool-calling
  - schemas-mcp
keywords:
  - mcp tools
  - tool calling
  - consultar_pedido
  - criar_cliente
  - gerar_pix
  - 13 ferramentas mcp
related:
  - ../index_master.md
  - webhooks.md
  - rate_limit.md
  - calculo_parcelas.md
source_scope:
  - https://docs.appmax.com.br/guides/ia-ferramentas
---

# Referência de ferramentas MCP

As 13 ferramentas que o servidor MCP da Appmax expõe para agentes de IA. Cada entrada mostra: o que você pede, o que o agente chama por baixo e o que retorna.

> **Pré-requisito**
>
> Para usar essas ferramentas, seu agente precisa estar conectado ao servidor MCP. Veja a [configuração](llms_txt_mcp.md#configuração).
## Documentação

### `search_docs` · busca semântica

**Você pede:** *"Como funciona o webhook de confirmação de pagamento?"*

**O agente chama:** `search_docs({ "query": "webhook confirmação pagamento" })`

**Retorno:** trechos relevantes dos guias de webhooks e status de pedidos. O agente responde com base no conteúdo real — não inventa endpoint nem campo.

---

### `list_pages` · enumerar o que existe

**Você pede:** *"Que tipos de pagamento a Appmax suporta?"*

**O agente chama:** `list_pages({ "prefix": "api-" })`

**Retorno:** todas as 15 páginas da API Reference — incluindo `api-apple-pay`, `api-pix`, `api-boleto`, `api-cartão-de-crédito`, `api-tokenização`, `api-parcelas`. Determinístico, sem depender de ranking de busca.

---

### `get_page` · leitura integral de um guia

**Você pede:** *"Preciso implementar tokenização de cartão do zero."*

**O agente chama:** `get_page({ "page": "api-tokenização" })`

**Retorno:** o guia completo em markdown — endpoints, campos obrigatórios, exemplos e edge cases.

---

### `get_full_docs` · documentação inteira

**Você pede:** *"Carregue toda a documentação da Appmax no contexto."*

**O agente chama:** `get_full_docs({ "lang": "pt" })`

**Retorno:** ~140 KB de texto plano com todas as páginas. Use com moderação — prefira `search_docs` + `get_page` para consultas pontuais.

---

### `check_health` · status do servidor

**O agente chama:** `check_health({})`

**Retorno:** status do servidor, versão, lista de tools disponíveis e estatísticas (número de páginas por idioma, tamanho do corpus).

## Diagnóstico

### `diagnose_error` · causa-raiz de erro HTTP

**Você pede:** *"Estou recebendo 401 em `/v1/customers`, o que é?"*

**O agente chama:** `diagnose_error({ "status_code": 401, "endpoint": "/v1/customers", "credential_type": "app" })`

**Retorno:** *"Você está usando credenciais de app num endpoint de merchant. Use o token do merchant."* — com link pro guia de autenticação.

**Cenários cobertos:** 401 (credenciais trocadas, token expirado), 403 (URL errada), 404 (recurso não encontrado), 422 (fluxo incompleto, payload inválido), 429 (rate limit), 500 (health check falhou), 502 (webhook falhou), 503 (serviço indisponível).

---

### `validate_payload` · validar payload antes de enviar

**Você pede:** *"Valida esse JSON antes de eu mandar pra API de criar pedido"*

**O agente chama:** `validate_payload({ "endpoint": "create_order", "payload": "{...}" })`

**Retorno:** lista de problemas — float em vez de centavos, `products_value` e `unit_value` usados juntos, campos obrigatórios faltando. Evita o 422 antes de chamar a API.

**Endpoints suportados:** `create_customer`, `create_order`, `pay_credit_card`, `pay_pix`, `pay_boleto`, `pay_apple_pay`, `tokenize`, `refund`, `create_recurrence`.

---

### `validate_order_total` · conferir cálculo do pedido

**Você pede:** *"O total do pedido deveria ser R$214,80 mas a API rejeita"*

**O agente chama:** `validate_order_total({ "products": [...], "shipping_value": 1500, "expected_total": 21480 })`

**Retorno:** breakdown detalhado (subtotal + frete - desconto = total), comparação com o valor informado, e detecção de erros comuns (float, exclusão mútua, arredondamento).

---

### `validate_installation_flow` · auditar implementação do fluxo de instalação

**Você pede:** *"Revisa se meu fluxo de instalação está certo"*

**O agente chama:** `validate_installation_flow({ "snippets": [{ "step": "app_token", "code": "..." }, { "step": "authorize", "code": "..." }, { "step": "validation_url", "code": "..." }], "environment": "sandbox" })`

**Retorno:** relatório por etapa com status (OK, Issues, Faltando), evidências de cada check (URL base correta para o ambiente, método HTTP, headers, payload, formato do `external_id`, etc.) e uma lista de próximos passos. Detecta os erros mais frequentes: `app_id` enviado como Numerical ID em vez do UUID, `url_callback` ausente, handler da URL de validação aceitando apenas GET, resposta no shape `{"status":"ok"}` em vez de `{"external_id":"<UUID>"}`, `external_id` hardcoded, credenciais do merchant usadas no lugar das do app.

**Etapas suportadas:** `app_token` (`POST /oauth2/token` com credenciais do APP), `authorize` (`POST /app/authorize`), `redirect` (redirect do navegador para o painel da Appmax), `generate` (`POST /app/client/generate`), `validation_url` (handler que o integrador expõe para o health check).

## Geração de código

### `generate_code_snippet` · snippets em 5 linguagens

**Você pede:** *"Me dá o código Python pra criar um pagamento Pix no sandbox"*

**O agente chama:** `generate_code_snippet({ "endpoint": "pay_pix", "language": "python", "environment": "sandbox" })`

**Retorno:** código pronto com a URL correta, headers, body e notas — em curl, Node.js, Python, PHP ou Go.

**Endpoints suportados:** `auth`, `auth_app`, `create_customer`, `create_order`, `get_order`, `upsell`, `pay_credit_card`, `pay_pix`, `pay_boleto`, `pay_apple_pay`, `tokenize`, `installments`, `refund`, `create_recurrence`, `app_authorize`, `app_generate`.

---

### `get_integration_flow` · fluxo passo-a-passo

**Você pede:** *"Qual a sequência de endpoints pra instalar meu app?"*

**O agente chama:** `get_integration_flow({ "flow": "app_installation", "environment": "sandbox" })`

**Retorno:** wizard com os 4 passos (token → authorize → redirect → generate), URLs por ambiente, pré-requisitos por passo e notas sobre health check.

**Flows disponíveis:** `app_installation`, `checkout_credit_card`, `checkout_pix`, `checkout_boleto`, `subscription`, `refund`, `upsell`.

## Onboarding e webhooks

### `get_onboarding_checklist` · checklist administrativo

**Você pede:** *"Estou começando do zero, o que preciso fazer pra integrar?"*

**O agente chama:** `get_onboarding_checklist({ "integration_type": "checkout_proprio", "stage": "planning" })`

**Retorno:** checklist personalizado — criar conta, criar app, configurar URLs, obter credenciais, implementar fluxo, testar, publicar. Cada item com link pro guia correspondente.

**Tipos de integração:** `checkout_proprio`, `plataforma_publica`, `recorrencia`, `upsell`.

**Estágios:** `planning`, `development`, `sandbox_testing`, `production_ready`.

---

### `get_webhook_schema` · schemas tipados de eventos

**Você pede:** *"Preciso dos tipos TypeScript pro webhook de pedido aprovado"*

**O agente chama:** `get_webhook_schema({ "event": "order_approved" })`

**Retorno:** schema completo com todos os campos tipados (`order_id: int`, `total: int`, `payment_info.credit_card.installments: int`, etc.) + payload de exemplo em JSON. O agente gera tipos TS/Go/Python a partir disso.

**Tipos de evento:** `order` (18 eventos), `customer` (3), `payment` (2), `subscription` (5). Chame sem parâmetros para ver a lista completa.

> **Multi-idioma nativo**
>
> Todas as ferramentas de documentação aceitam o parâmetro `lang` (`pt` ou `en`). Seu time trabalha no idioma nativo, sem tradução no caminho.

## Veja Também

- [Index Master](../index_master.md)
- [Webhooks](webhooks.md)
- [Rate Limit](rate_limit.md)
- [Calculo Parcelas](calculo_parcelas.md)
